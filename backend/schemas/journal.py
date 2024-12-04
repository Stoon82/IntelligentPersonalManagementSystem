from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JournalEntryBase(BaseModel):
    content: str
    mood: Optional[str] = None
    tags: List[str] = []

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryResponse(JournalEntryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
