import asyncio
import motor.motor_asyncio as m

async def run():
    db = m.AsyncIOMotorClient('mongodb+srv://ajayajzxc_db_user:2azsldin8zkuT9ie@cluster0.xd5jee3.mongodb.net/?appName=Cluster0')
    await db['arova_new_production_db']['users'].delete_many({'email': 'admin@arova-official.com'})
    print('Deleted user')

asyncio.run(run())
