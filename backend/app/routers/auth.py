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

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    user_doc = await db.db.users.find_one({"email": request.email})
    if not user_doc:
        # Return success anyway to prevent email enumeration
        return {"message": "If that email is registered, a reset code was sent."}
        
    import secrets
    # Generate a simple 6-character hex token for development
    reset_token = secrets.token_hex(3).upper()
    expiration = datetime.utcnow() + timedelta(minutes=15)
    
    await db.db.users.update_one(
        {"_id": user_doc["_id"]},
        {"$set": {
            "reset_token": reset_token,
            "reset_token_exp": expiration
        }}
    )
    
    # In production, send this via email. For dev, we return it in the response (or log it).
    print(f"RESET TOKEN FOR {request.email}: {reset_token}")
    
    return {
        "message": "If that email is registered, a reset code was sent.",
        "dev_token": reset_token # ONLY FOR DEVELOPMENT
    }

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    user_doc = await db.db.users.find_one({
        "email": request.email,
        "reset_token": request.token
    })
    
    if not user_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")
        
    # Check expiration
    if user_doc.get("reset_token_exp") and user_doc["reset_token_exp"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset token has expired.")
        
    new_hash = get_password_hash(request.new_password)
    
    await db.db.users.update_one(
        {"_id": user_doc["_id"]},
        {"$set": {
            "password_hash": new_hash,
            "temp_password_active": False,
            "reset_token": None,
            "reset_token_exp": None,
            "failed_login_attempts": 0,
            "locked_until": None
        }}
    )
    
    return {"message": "Password has been successfully reset. You can now log in."}

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        jti = payload.get("jti")
        exp = payload.get("exp")
        
        if jti and exp:
            await db.db.token_blacklist.insert_one({
                "jti": jti,
                "exp": datetime.fromtimestamp(exp)
            })
            
    except JWTError:
        pass # If token is invalid/expired anyway, no need to blacklist
        
    return {"message": "Logged out successfully"}
