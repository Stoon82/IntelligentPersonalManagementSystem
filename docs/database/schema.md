# Database Schema Documentation

## Overview
IPMS uses PostgreSQL as its database. The schema is managed through SQLAlchemy models.

## Models

### User
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    projects = relationship("Project", back_populates="owner")
    project_memberships = relationship("ProjectMember", back_populates="user")
    tasks = relationship("Task", back_populates="assignee")
    activities = relationship("Activity", back_populates="user")
```

### Project
```python
class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.PLANNING)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    target_end_date = Column(DateTime(timezone=True), nullable=True)
    actual_end_date = Column(DateTime(timezone=True), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="projects")
    members = relationship("ProjectMember", back_populates="project")
    tasks = relationship("Task", back_populates="project")
    activities = relationship("Activity", back_populates="project")
    concept_notes = relationship("ConceptNote", back_populates="project")
    ideas = relationship("Idea", secondary="project_ideas")
```

### ProjectMember
```python
class ProjectMember(Base):
    __tablename__ = "project_members"
    
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    role = Column(String(50), default="member")
    permissions = Column(JSON, default=list)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="members")
    user = relationship("User", back_populates="project_memberships")
```

### Task
```python
class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="todo")
    priority = Column(Integer, default=0)
    due_date = Column(DateTime, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    assignee_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")
```

### Idea
```python
class Idea(Base):
    __tablename__ = "ideas"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="draft")
    tags = Column(JSON, default=list)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="ideas")
    projects = relationship("Project", secondary="project_ideas")
```

### ConceptNote
```python
class ConceptNote(Base):
    __tablename__ = "concept_notes"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    content = Column(Text)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="concept_notes")
    user = relationship("User", back_populates="concept_notes")
```

### Activity
```python
class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True)
    type = Column(String(50))
    data = Column(JSON)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="activities")
    project = relationship("Project", back_populates="activities")
```

## Indexes
- Users: username, email
- Projects: owner_id
- Tasks: project_id, assignee_id
- Ideas: user_id
- ConceptNotes: project_id, user_id
- Activities: user_id, project_id

## Constraints
- All foreign keys have ON DELETE CASCADE except Task.assignee_id (SET NULL)
- Unique constraints on User.username and User.email
- Non-nullable constraints on critical fields (title, etc.)
- Default values for status fields and timestamps

## Migrations
Database migrations are handled using Alembic:
```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head

# Rollback one version
alembic downgrade -1
```
