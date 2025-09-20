from fastapi import APIRouter, UploadFile, Form, Depends
from app.services.cleanup_service import analyze_cleanup
from app.db.mongo import get_database
from app.models.cleanup_model import CleanupRecord
from datetime import datetime

# 1️⃣ Define the router first
router = APIRouter(prefix="/cleanup", tags=["Cleanup"])

# 2️⃣ Define your POST route
@router.post("/analyze")
async def analyze_route(
    before: UploadFile,
    after: UploadFile,
    location: str = Form(...),
    user: str = Form("anonymous"),
    db=Depends(get_database)
):
    try:
        before_bytes = await before.read()
        after_bytes = await after.read()

        result = await analyze_cleanup(before_bytes, after_bytes)

        record = CleanupRecord(
            user=user,
            location=location,
            before_img=before.filename,
            after_img=after.filename,
            cleaned=result["cleaned"],
            cleanliness_score=result["cleanliness_score"],
            explanation=result["explanation"],
            timestamp=datetime.utcnow()
        )

        await db["cleanup_records"].insert_one(record.dict())
        return {"success": True, "analysis": result}

    except Exception as e:
        print("Error in /analyze:", e)
        return {"success": False, "error": str(e)}

# 3️⃣ Optional GET route to fetch all records
@router.get("/all")
async def get_all_records(db=Depends(get_database)):
    records = await db["cleanup_records"].find().to_list(100)
    return {"records": records}
