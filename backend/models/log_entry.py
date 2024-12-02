from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class LogEntry(Base):
    __tablename__ = "log_entries"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Keys
    log_id = Column(Integer, ForeignKey("logs.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    log = relationship("Log", back_populates="entries")
    user = relationship("User", back_populates="log_entries")
