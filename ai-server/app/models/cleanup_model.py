from pydantic import BaseModel, Field
from datetime import datetime

class CleanupRecord(BaseModel):
    user: str
    location: str
    before_img: str
    after_img: str
    cleaned: bool
    cleanliness_score: int
    explanation: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
