import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def bootstrap():
    client = AsyncIOMotorClient('mongodb+srv://ajayajzxc_db_user:2azsldin8zkuT9ie@cluster0.xd5jee3.mongodb.net/?appName=Cluster0')
    db = client.arova_new_production_db
    
    internship = {
        'title': 'Full Stack Development',
        'duration_months': 2,
        'modules': [
            {
                'id': 'm1',
                'title': 'React Basics',
                'content': 'Learn React hooks and components',
                'order': 1,
                'test': {
                    'title': 'React Basics Test',
                    'max_attempts': 3,
                    'pass_mark_percentage': 60,
                    'questions': [
                        {
                            'text': 'What is JSX?',
                            'options': ['JavaScript XML', 'Java Syntax Extension', 'JSON X'],
                            'correct_option_index': 0
                        }
                    ]
                }
            }
        ]
    }
    
    # Check if we already have internships
    count = await db.internships.count_documents({})
    if count == 0:
        result = await db.internships.insert_one(internship)
        print(f'Internship bootstrapped with ID: {result.inserted_id}')
    else:
        print('Internships already exist!')
        docs = await db.internships.find({}).to_list(length=10)
        for doc in docs:
            print(f"ID: {doc['_id']} - Title: {doc['title']}")

if __name__ == "__main__":
    asyncio.run(bootstrap())
