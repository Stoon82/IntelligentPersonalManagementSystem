from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JournalEntryBase(BaseModel):
    content: str
    mood: Optional[str] = None
    tags: Optional[List[str]] = []

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryUpdate(JournalEntryBase):
    pass

class JournalEntryResponse(JournalEntryBase):
    id: int
    user_id: int
    journal_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class JournalBase(BaseModel):
    title: str

class JournalCreate(JournalBase):
    pass

class JournalUpdate(JournalBase):
    pass

class JournalResponse(JournalBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
