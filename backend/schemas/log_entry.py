from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class LogEntryBase(BaseModel):
    content: str


class LogEntryCreate(LogEntryBase):
    pass


class LogEntryUpdate(BaseModel):
    content: Optional[str] = None


class LogEntryResponse(LogEntryBase):
    id: int
    log_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
