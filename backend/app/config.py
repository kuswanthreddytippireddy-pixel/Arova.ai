from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AROVA Student Internship Portal"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "arova_db"
    JWT_SECRET: str = "changeme_super_secret_jwt_key_for_development_only"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    ADMIN_EMAIL: str = "admin@arova.in"
    ADMIN_PASSWORD: str = "ChangeMe#2026"

    class Config:
        env_file = ".env"

settings = Settings()
