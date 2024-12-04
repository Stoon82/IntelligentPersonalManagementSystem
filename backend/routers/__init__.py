from .auth import router as auth_router
from .users import router as users_router
from .tasks import router as tasks_router
from .projects import router as projects_router
from .activities import router as activities_router
from .ideas import router as ideas_router
from .concepts import router as concepts_router
from .mindmaps import router as mindmaps_router
from .logs import router as logs_router
from .log_entries import router as log_entries_router
from .bugs import router as bugs_router

__all__ = [
    'auth_router',
    'users_router',
    'tasks_router',
    'projects_router',
    'activities_router',
    'ideas_router',
    'concepts_router',
    'mindmaps_router',
    'logs_router',
    'log_entries_router',
    'bugs_router',
]
