from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class LogType(str, enum.Enum):
    NOTE = "note"
    PROGRESS = "progress"
    ISSUE = "issue"
    DECISION = "decision"
    OTHER = "other"


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    log_type = Column(Enum(LogType), default=LogType.NOTE)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="logs")
    project = relationship("Project", back_populates="logs")
