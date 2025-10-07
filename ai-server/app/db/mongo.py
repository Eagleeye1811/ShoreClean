from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = None
db = None
cleanup_collection = None
flyers_collection = None  # 👈 add this

async def connect_db():
    global client, db, cleanup_collection, flyers_collection
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["ai_server"]
    cleanup_collection = db["cleanup_records"]
    flyers_collection = db["flyers"]  
    print("MongoDB connected")

async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB disconnected")

def get_database():
    return db
