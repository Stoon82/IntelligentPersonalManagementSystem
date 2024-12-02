from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

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

    # Essential relationships for auth
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan", lazy='dynamic')
    # Core functionality relationships
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan", lazy='dynamic')
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan", lazy='dynamic')
    journal_entries = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan", lazy='dynamic')
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan", lazy='dynamic')
    ideas = relationship("Idea", back_populates="user", cascade="all, delete-orphan", lazy='dynamic')
    concept_notes = relationship("ConceptNote", back_populates="user", cascade="all, delete-orphan", lazy='dynamic')
    logs = relationship("Log", back_populates="user", cascade="all, delete-orphan", lazy='dynamic')
    log_entries = relationship("LogEntry", back_populates="user", cascade="all, delete-orphan", lazy='dynamic')

    def __repr__(self):
        return f"<User {self.username}>"
