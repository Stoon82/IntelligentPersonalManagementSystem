from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models.log import LogType


class LogBase(BaseModel):
    title: str
    content: str
    log_type: LogType = LogType.NOTE
    project_id: Optional[int] = None


class LogCreate(LogBase):
    pass


class LogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    log_type: Optional[LogType] = None
    project_id: Optional[int] = None


class LogResponse(LogBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
