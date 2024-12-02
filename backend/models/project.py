from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base
from .project_idea import project_ideas

class ProjectStatus(str, enum.Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PLANNING)
    start_date = Column(DateTime, default=datetime.utcnow)
    target_end_date = Column(DateTime, nullable=True)
    actual_end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Keys
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="projects", lazy="joined")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")
    concept_notes = relationship("ConceptNote", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")
    ideas = relationship("Idea", secondary=project_ideas, back_populates="projects", lazy="dynamic")
    mindmaps = relationship("Mindmap", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")
    logs = relationship("Log", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")

    def __repr__(self):
        return f"<Project {self.id}: {self.title}>"
