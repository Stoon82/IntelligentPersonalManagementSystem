from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    tasks = relationship("Task", back_populates="user", cascade="all, delete")
    password_resets = relationship("PasswordReset", back_populates="user")
    profile = relationship("Profile", back_populates="user", uselist=False)
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    
    # New relationships for personal data tracking
    activities = relationship("Activity", back_populates="user", cascade="all, delete")
    journal_entries = relationship("JournalEntry", back_populates="user", cascade="all, delete")
    logs = relationship("Log", back_populates="user", cascade="all, delete")
    
    # New relationships for personal development
    goals = relationship("Goal", back_populates="user", cascade="all, delete")
    habits = relationship("Habit", back_populates="user", cascade="all, delete")
    projects = relationship("Project", back_populates="owner", cascade="all, delete")
    ideas = relationship("Idea", back_populates="user", cascade="all, delete")
    concept_notes = relationship("ConceptNote", back_populates="user", cascade="all, delete")

    def __repr__(self):
        return f"<User {self.username}>"
