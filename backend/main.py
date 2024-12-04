import os
import sys

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from contextlib import contextmanager
import logging
from typing import List
import datetime
from dotenv import load_dotenv
from routers import (
    auth_router, users_router, tasks_router, projects_router, activities_router,
    ideas_router, concepts_router, mindmaps_router, logs_router, log_entries_router,
    bugs_router
)
from database import async_init_db

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

# Create FastAPI app instance
app = FastAPI(
    title="IPMS API",
    description="API for the Intelligent Project Management System",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5000",  
    os.getenv("FRONTEND_URL", "")  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Content-Type", 
        "Authorization", 
        "Accept", 
        "Origin", 
        "X-Requested-With",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
    ],
    expose_headers=["*"],
    max_age=600,  
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])
app.include_router(projects_router, prefix="/api/projects", tags=["projects"])
app.include_router(activities_router, prefix="/api/activities", tags=["activities"])
app.include_router(ideas_router, prefix="/api/ideas", tags=["ideas"])
app.include_router(concepts_router, prefix="/api/concepts", tags=["concepts"])
app.include_router(mindmaps_router, prefix="/api/mindmaps", tags=["mindmaps"])
app.include_router(logs_router, prefix="/api/logs", tags=["logs"])
app.include_router(log_entries_router, prefix="/api/logs", tags=["log_entries"])
app.include_router(bugs_router, prefix="/api/bugs", tags=["bugs"])

@app.on_event("startup")
async def startup_event():
    try:
        await async_init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the IPMS API",
        "status": "active",
        "version": "1.0.0"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": str(datetime.datetime.now())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
