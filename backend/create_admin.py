import asyncio
import motor.motor_asyncio as m
from app.auth import get_password_hash
from app.models.domain import User

async def run():
    client = m.AsyncIOMotorClient('mongodb+srv://ajayajzxc_db_user:2azsldin8zkuT9ie@cluster0.xd5jee3.mongodb.net/?appName=Cluster0')
    db = client.arova_new_production_db
    
    # Delete existing if any
    await db['users'].delete_many({'email': 'admin@arova.in'})
    
    # Create new
    pw_hash = get_password_hash("Arova#2026")
    admin = User(
        email="admin@arova.in",
        role="SUPERADMIN",
        password_hash=pw_hash,
        temp_password_active=False
    )
    
    await db['users'].insert_one(admin.dict(by_alias=True, exclude_none=True))
    print('Superadmin created: admin@arova.in / Arova#2026')

asyncio.run(run())
