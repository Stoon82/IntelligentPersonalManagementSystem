from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum, Table
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base
from .project_idea import project_ideas
from sqlalchemy import JSON
from sqlalchemy import func

class ProjectStatus(str, enum.Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ProjectMember(Base):
    __tablename__ = "project_members"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    role = Column(String(50), default="member")  # e.g., "owner", "member", "viewer"
    permissions = Column(JSON, default=list)  # List of permission strings
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    # Define relationships
    project = relationship("Project", back_populates="members", lazy="joined")
    user = relationship("User", back_populates="project_memberships", lazy="joined")

class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    target_end_date = Column(DateTime(timezone=True), nullable=True)
    actual_end_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.PLANNING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Foreign Keys
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="projects", lazy="joined")
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")
    activities = relationship("Activity", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")
    concept_notes = relationship("ConceptNote", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")
    ideas = relationship("Idea", secondary=project_ideas, back_populates="projects", lazy="dynamic")
    mindmaps = relationship("Mindmap", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")
    logs = relationship("Log", back_populates="project", cascade="all, delete-orphan", lazy="dynamic")

    def __repr__(self):
        return f"<Project {self.id}: {self.title}>"
