# Import all models here to ensure they are registered with SQLAlchemy
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base
from .user import User
from .activity import Activity, JournalEntry
from .task import Task, TaskStatus, TaskPriority
from .project import Project
from .refresh_token import RefreshToken
from .password_reset import PasswordReset
from .idea import Idea
from .log_entry import LogEntry  # Import LogEntry before Log
from .log import Log
from .concept import ConceptNote
from .mindmap import Mindmap

# Configure all mappers
from sqlalchemy.orm import configure_mappers
configure_mappers()

__all__ = [
    "Base",
    "User",
    "Task",
    "TaskStatus",
    "TaskPriority",
    "Activity",
    "JournalEntry",
    "Project",
    "RefreshToken",
    "PasswordReset",
    "Idea",
    "ConceptNote",
    "Log",
    "LogEntry",
    "Mindmap"
]
