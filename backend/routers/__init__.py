from .auth import router
from .tasks import router as tasks_router
from .activities import router as activities_router
from .development import router as development_router
from .profile import router as profile_router
from .projects import router as projects_router
from .ai import router as ai_router
from .concepts import router as concepts_router
from .ideas import router as ideas_router
from .logs import router as logs_router
from .mindmaps import router as mindmaps_router
from .project_ideas import router as project_ideas_router

__all__ = [
    'router',
    'tasks_router',
    'activities_router',
    'development_router',
    'profile_router',
    'projects_router',
    'ai_router',
    'concepts_router',
    'ideas_router',
    'logs_router',
    'mindmaps_router',
    'project_ideas_router'
]
