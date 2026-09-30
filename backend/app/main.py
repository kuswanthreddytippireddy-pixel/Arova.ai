from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection, db
from app.config import settings
from app.routers import auth, admin, student, certificates
from app.models.domain import User
from app.auth import get_password_hash

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    
    # Create default superadmin if not exists
    admin_exists = await db.db.users.find_one({"email": settings.ADMIN_EMAIL})
    if not admin_exists:
        print("Creating default superadmin account...")
        hashed_pw = get_password_hash(settings.ADMIN_PASSWORD)
        superadmin = User(
            email=settings.ADMIN_EMAIL,
            role="SUPERADMIN",
            password_hash=hashed_pw,
            temp_password_active=True
        )
        await db.db.users.insert_one(superadmin.dict(by_alias=True, exclude_none=True))

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Welcome to AROVA API"}

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(student.router)
app.include_router(certificates.router)
