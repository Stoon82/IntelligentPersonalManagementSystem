from database import Base, engine
from models.user import User
from models.refresh_token import RefreshToken
from models.log import Log
from models.project import Project
from models.task import Task
from models.activity import Activity
from models.concept import ConceptNote
from models.idea import Idea
from models.mindmap import Mindmap

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()
