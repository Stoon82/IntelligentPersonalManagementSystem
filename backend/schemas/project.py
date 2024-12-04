from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models.project import ProjectStatus

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    status: ProjectStatus = ProjectStatus.PLANNING
    target_end_date: Optional[datetime] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    target_end_date: Optional[datetime] = None
    actual_end_date: Optional[datetime] = None

class Project(ProjectBase):
    id: int
    owner_id: int
    start_date: datetime
    actual_end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ProjectMemberBase(BaseModel):
    role: str = Field(..., min_length=1, max_length=50)
    permissions: list[str] = []

class ProjectMemberCreate(ProjectMemberBase):
    user_id: int
    project_id: int

class ProjectMember(ProjectMemberBase):
    id: int
    user_id: int
    project_id: int
    joined_at: datetime

    class Config:
        orm_mode = True
