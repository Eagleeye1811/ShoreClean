import os
from dotenv import load_dotenv

load_dotenv()  # Load .env variables first
print("GOOGLE_APPLICATION_CREDENTIALS =", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.routes import cleanup_routes  # remove ai_routes since we no longer use OpenAI
from app.db.mongo import connect_db, close_db

app = FastAPI(title="AI Cleanup Server", version="1.0.0")

# Allow CORS for your frontend (React dev server)
origins = [
    "http://localhost:5173",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # or ["*"] to allow all origins in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include cleanup routes only
app.include_router(cleanup_routes.router, prefix="/cleanup", tags=["Cleanup"])

# MongoDB connection events
@app.on_event("startup")
async def startup_db_client():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db()
