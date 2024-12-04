import os
import sys

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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

# Configure CORS with proper error handling
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": str(exc.detail)},
        headers={"Access-Control-Allow-Origin": "http://localhost:3000"}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers={"Access-Control-Allow-Origin": "http://localhost:3000"}
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
