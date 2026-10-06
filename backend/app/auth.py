from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.config import settings
from app.models.domain import User
from app.database import db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    import uuid
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "jti": str(uuid.uuid4())})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_email: str = payload.get("sub")
        jti: str = payload.get("jti")
        if user_email is None:
            raise credentials_exception
            
        if jti:
            blacklisted = await db.db.token_blacklist.find_one({"jti": jti})
            if blacklisted:
                raise credentials_exception
                
    except JWTError:
        raise credentials_exception
    
    user_doc = await db.db.users.find_one({"email": user_email})
    if user_doc is None:
        raise credentials_exception
    
    user = User(**user_doc)
    
    if user.temp_password_active:
        # If temp password is active, they must change it before accessing standard endpoints
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="PASSWORD_CHANGE_REQUIRED"
        )
        
    return user

async def get_current_superadmin(current_user: User = Depends(get_current_user)):
    if current_user.role != "SUPERADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return current_user

async def get_current_user_allow_temp(token: str = Depends(oauth2_scheme)):
    # Used specifically for the change-password endpoint
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_email: str = payload.get("sub")
        jti: str = payload.get("jti")
        if user_email is None:
            raise credentials_exception
            
        if jti:
            blacklisted = await db.db.token_blacklist.find_one({"jti": jti})
            if blacklisted:
                raise credentials_exception
                
    except JWTError:
        raise credentials_exception
    
    user_doc = await db.db.users.find_one({"email": user_email})
    if user_doc is None:
        raise credentials_exception
        
    return User(**user_doc)
