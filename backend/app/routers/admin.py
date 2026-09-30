import csv
import io
import random
import string
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import List
from app.database import db
from app.models.domain import User, Enrollment
from app.auth import get_current_superadmin, get_password_hash
from bson import ObjectId

router = APIRouter(prefix="/api/admin", tags=["admin"])

class CreateStudentRequest(BaseModel):
    name: str
    email: EmailStr
    internship_track_months: int

class EnrollRequest(BaseModel):
    student_id: str
    internship_id: str

def generate_random_password(length=10):
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(random.choice(chars) for _ in range(length))

async def create_single_student_logic(email: str, name: str = "Student", internship_track_months: int = 1) -> dict:
    existing = await db.db.users.find_one({"email": email})
    if existing:
        return {"email": email, "status": "error", "message": "Email already exists"}

    # Generate a unique student ID
    count = await db.db.users.count_documents({"role": "STUDENT"})
    student_id = f"ARV{count + 1001:04d}"

    temp_password = "ChangeMe#2026"
    hashed_pw = get_password_hash(temp_password)

    new_student = User(
        email=email,
        student_id=student_id,
        role="STUDENT",
        password_hash=hashed_pw,
        temp_password_active=True,
        name=name
    )
    await db.db.users.insert_one(new_student.dict(by_alias=True, exclude_none=True))

    # Auto-enroll in an internship
    internship = await db.db.internships.find_one({"duration_months": internship_track_months})
    if not internship:
        internship = await db.db.internships.find_one({}) # fallback to any
    
    if internship and internship.get("modules"):
        first_module_id = internship["modules"][0]["id"]
        enrollment = Enrollment(
            student_id=student_id,
            internship_id=str(internship["_id"]),
            current_module_id=first_module_id
        )
        await db.db.enrollments.insert_one(enrollment.dict(by_alias=True, exclude_none=True))

    print(f"Created student {email} | ID: {student_id} | Password: {temp_password}")
    return {"email": email, "student_id": student_id, "temp_password": temp_password, "status": "success"}

@router.post("/students")
async def create_student(
    request: CreateStudentRequest,
    admin: User = Depends(get_current_superadmin)
):
    result = await create_single_student_logic(request.email, request.name, request.internship_track_months)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/students/bulk-upload")
async def bulk_upload_students(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_superadmin)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    content = await file.read()
    decoded = content.decode("utf-8")
    csv_reader = csv.DictReader(io.StringIO(decoded))

    results = []
    for row in csv_reader:
        email = row.get("email")
        name = row.get("name", "Student")
        months = int(row.get("duration_months", 1))
        if email:
            res = await create_single_student_logic(email, name, months)
            results.append(res)

    return {"message": "Bulk upload processed", "results": results}

@router.post("/enroll")
async def enroll_student(
    request: EnrollRequest,
    admin: User = Depends(get_current_superadmin)
):
    student = await db.db.users.find_one({"student_id": request.student_id, "role": "STUDENT"})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    internship = await db.db.internships.find_one({"_id": ObjectId(request.internship_id)})
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
        
    if not internship.get("modules"):
        raise HTTPException(status_code=400, detail="Internship has no modules configured")

    # Check if already enrolled
    existing_enrollment = await db.db.enrollments.find_one({
        "student_id": request.student_id,
        "internship_id": request.internship_id
    })
    if existing_enrollment:
        raise HTTPException(status_code=400, detail="Student is already enrolled in this internship")

    first_module_id = internship["modules"][0]["id"]
    
    new_enrollment = Enrollment(
        student_id=request.student_id,
        internship_id=request.internship_id,
        current_module_id=first_module_id
    )
    
    await db.db.enrollments.insert_one(new_enrollment.dict(by_alias=True, exclude_none=True))
    
    return {"message": "Student successfully enrolled", "internship_id": request.internship_id}
