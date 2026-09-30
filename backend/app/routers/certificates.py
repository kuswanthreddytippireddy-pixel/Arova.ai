from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import db

router = APIRouter(prefix="/api/certificates", tags=["certificates"])

@router.get("/verify/{verify_hash}")
async def verify_certificate(verify_hash: str):
    # Public endpoint to verify a certificate's authenticity
    cert = await db.db.certificates.find_one({"verify_hash": verify_hash})
    
    if not cert:
        raise HTTPException(status_code=404, detail="Invalid certificate or certificate not found")

    student = await db.db.users.find_one({"student_id": cert["student_id"], "role": "STUDENT"})
    internship = await db.db.internships.find_one({"_id": ObjectId(cert["internship_id"])})

    if not student or not internship:
        raise HTTPException(status_code=404, detail="Certificate references invalid data")

    # Return public data suitable for an employer to verify
    return {
        "valid": True,
        "certificate_id": str(cert.get("_id")),
        "issue_date": cert.get("issue_date"),
        "student_details": {
            "student_id": student.get("student_id"),
            # Only sending safe identifying info, not emails or personal stuff
        },
        "internship_details": {
            "title": internship.get("title"),
            "duration_months": internship.get("duration_months")
        },
        "verification_hash": verify_hash,
        "message": "This is a valid and authentic AROVA Certificate."
    }
