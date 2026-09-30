from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from app.database import db
from app.models.domain import User
from app.auth import verify_password, create_access_token, get_current_user_allow_temp, get_password_hash

router = APIRouter(prefix="/api/auth", tags=["auth"])

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Find user by email or student_id
    user_doc = await db.db.users.find_one({
        "$or": [{"email": form_data.username}, {"student_id": form_data.username}]
    })
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    user = User(**user_doc)

    # Check lockout
    if user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(status_code=423, detail="Account is locked due to too many failed attempts. Try again later.")

    # Verify password
    if not verify_password(form_data.password, user.password_hash):
        failed_attempts = user.failed_login_attempts + 1
        update_data = {"failed_login_attempts": failed_attempts}
        
        if failed_attempts >= 5:
            update_data["locked_until"] = datetime.utcnow() + timedelta(minutes=15)
            
        await db.db.users.update_one({"_id": user_doc["_id"]}, {"$set": update_data})
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Successful login, reset failed attempts
    if user.failed_login_attempts > 0 or user.locked_until:
        await db.db.users.update_one(
            {"_id": user_doc["_id"]}, 
            {"$set": {"failed_login_attempts": 0, "locked_until": None}}
        )
        
    # Generate token
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "temp_password_active": user.temp_password_active,
        "role": user.role
    }

@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user_allow_temp)
):
    if not verify_password(request.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    new_hash = get_password_hash(request.new_password)
    
    await db.db.users.update_one(
        {"email": current_user.email},
        {"$set": {
            "password_hash": new_hash,
            "temp_password_active": False
        }}
    )
    
    # Return fresh token
    access_token = create_access_token(data={"sub": current_user.email, "role": current_user.role})
    return {"access_token": access_token, "token_type": "bearer", "message": "Password updated successfully"}
