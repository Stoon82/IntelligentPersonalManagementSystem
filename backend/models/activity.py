from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Activity(Base):
    __tablename__ = "activities"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    type = Column(String(50))  # e.g., 'music', 'web', 'app', 'location'
    data = Column(JSON)  # Store flexible activity data
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Define relationship with User model
    user = relationship("User", back_populates="activities", lazy="joined")
    # Define relationship with Project model
    project = relationship("Project", back_populates="activities", lazy="joined")

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    content = Column(Text)
    mood = Column(String(50), nullable=True)
    tags = Column(JSON)  # Store array of tags
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Define relationship with User model
    user = relationship("User", back_populates="journal_entries", lazy="joined")
