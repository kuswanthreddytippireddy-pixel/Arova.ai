from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from datetime import datetime
import hashlib
from bson import ObjectId
from app.database import db
from app.models.domain import User, Attempt, Certificate
from app.auth import get_current_user

router = APIRouter(prefix="/api/student", tags=["student"])

class Answer(BaseModel):
    question_index: int
    selected_option_index: int

class TestSubmissionRequest(BaseModel):
    answers: List[Answer]

@router.get("/dashboard")
async def get_dashboard(current_user: User = Depends(get_current_user)):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")

    enrollment = await db.db.enrollments.find_one({"student_id": current_user.student_id})
    if not enrollment:
        return {"message": "You are not enrolled in any internship yet."}

    internship = await db.db.internships.find_one({"_id": ObjectId(enrollment["internship_id"])})
    if not internship:
        raise HTTPException(status_code=404, detail="Internship data not found")

    # Find the current module
    current_module = None
    for module in internship.get("modules", []):
        if module["id"] == enrollment.get("current_module_id"):
            current_module = module
            break

    return {
        "internship_title": internship.get("title"),
        "duration_months": internship.get("duration_months"),
        "completed": enrollment.get("completed", False),
        "current_module": current_module
    }

@router.get("/module/{module_id}/test")
async def get_test(
    module_id: str,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can access this")
        
    enrollment = await db.db.enrollments.find_one({"student_id": current_user.student_id})
    if not enrollment:
        raise HTTPException(status_code=400, detail="Not enrolled")
        
    internship = await db.db.internships.find_one({"_id": ObjectId(enrollment["internship_id"])})
    
    current_module = None
    for mod in internship.get("modules", []):
        if mod["id"] == module_id:
            current_module = mod
            break
            
    if not current_module or not current_module.get("test"):
        raise HTTPException(status_code=404, detail="Test not found")
        
    test = current_module["test"]
    
    # Strip correct_option_index for security!
    safe_questions = []
    for q in test.get("questions", []):
        safe_questions.append({
            "text": q.get("text"),
            "options": q.get("options")
        })
        
    return {
        "module_title": current_module.get("title"),
        "title": test.get("title"),
        "max_attempts": test.get("max_attempts"),
        "pass_mark_percentage": test.get("pass_mark_percentage"),
        "questions": safe_questions
    }

@router.post("/module/{module_id}/test")
async def submit_test(
    module_id: str,
    request: TestSubmissionRequest,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can submit tests")

    enrollment = await db.db.enrollments.find_one({"student_id": current_user.student_id})
    if not enrollment:
        raise HTTPException(status_code=400, detail="Not enrolled")

    if enrollment.get("completed"):
        raise HTTPException(status_code=400, detail="Internship already completed")

    if enrollment.get("current_module_id") != module_id:
        raise HTTPException(status_code=400, detail="This is not your current active module")

    internship = await db.db.internships.find_one({"_id": ObjectId(enrollment["internship_id"])})
    
    # Locate module and test
    current_module = None
    module_index = -1
    for i, mod in enumerate(internship.get("modules", [])):
        if mod["id"] == module_id:
            current_module = mod
            module_index = i
            break
            
    if not current_module:
        raise HTTPException(status_code=404, detail="Module not found")
        
    test = current_module.get("test")
    if not test:
        raise HTTPException(status_code=400, detail="No test available for this module")

    # Check attempt count
    past_attempts = await db.db.attempts.count_documents({
        "student_id": current_user.student_id,
        "test_id": module_id
    })
    
    if past_attempts >= test.get("max_attempts", 3):
        raise HTTPException(status_code=400, detail="Maximum attempts reached for this test")

    # Grade the test
    questions = test.get("questions", [])
    correct_count = 0
    answer_map = {ans.question_index: ans.selected_option_index for ans in request.answers}
    
    for idx, q in enumerate(questions):
        if answer_map.get(idx) == q.get("correct_option_index"):
            correct_count += 1
            
    score_percentage = (correct_count / len(questions)) * 100 if len(questions) > 0 else 100
    passed = score_percentage >= test.get("pass_mark_percentage", 60.0)

    # Save Attempt
    attempt = Attempt(
        student_id=current_user.student_id,
        test_id=module_id,
        score_percentage=score_percentage,
        passed=passed,
        attempt_number=past_attempts + 1
    )
    await db.db.attempts.insert_one(attempt.dict(by_alias=True, exclude_none=True))

    result_data = {
        "score_percentage": score_percentage,
        "passed": passed,
        "message": "Test submitted successfully"
    }

    if passed:
        # Unlock next module or complete internship
        modules = internship.get("modules", [])
        if module_index + 1 < len(modules):
            next_module_id = modules[module_index + 1]["id"]
            await db.db.enrollments.update_one(
                {"_id": enrollment["_id"]},
                {"$set": {"current_module_id": next_module_id}}
            )
            result_data["next_module_unlocked"] = next_module_id
        else:
            # Internship completed, generate certificate
            await db.db.enrollments.update_one(
                {"_id": enrollment["_id"]},
                {"$set": {"completed": True}}
            )
            
            # Generate verify hash
            hash_str = f"{current_user.student_id}-{enrollment['internship_id']}-{datetime.utcnow().timestamp()}"
            verify_hash = hashlib.sha256(hash_str.encode()).hexdigest()[:16]
            
            cert = Certificate(
                student_id=current_user.student_id,
                internship_id=str(enrollment["internship_id"]),
                verify_hash=verify_hash
            )
            await db.db.certificates.insert_one(cert.dict(by_alias=True, exclude_none=True))
            
            result_data["internship_completed"] = True
            result_data["certificate_hash"] = verify_hash

    return result_data

@router.get("/certificate")
async def get_certificate(current_user: User = Depends(get_current_user)):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can access this")
        
    cert = await db.db.certificates.find_one({"student_id": current_user.student_id})
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    internship = await db.db.internships.find_one({"_id": ObjectId(cert["internship_id"])})
    
    return {
        "student_name": current_user.name,
        "internship_title": internship["title"] if internship else "Unknown",
        "verify_hash": cert["verify_hash"],
        "issue_date": cert.get("issue_date", datetime.utcnow())
    }
