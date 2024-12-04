import os
import sys
import logging

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import datetime
from dotenv import load_dotenv
from routers import (
    auth_router, users_router, tasks_router, projects_router, activities_router,
    ideas_router, concepts_router, mindmaps_router, logs_router, log_entries_router
)
from database import init_db

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app instance
app = FastAPI(
    title="IPMS API",
    description="Intelligent Project Management System API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React development server
        "http://127.0.0.1:3000",  # Alternative local address
        "http://localhost:5000",  # Production build server
        os.getenv("FRONTEND_URL", "")  # Production URL from environment
    ],
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
    max_age=600,  # Cache preflight requests for 10 minutes
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

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized successfully")

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
