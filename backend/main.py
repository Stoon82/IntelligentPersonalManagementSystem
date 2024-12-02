from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import datetime
from dotenv import load_dotenv
from routers import (
    auth,
    tasks_router,
    activities_router,
    development_router,
    profile_router,
    projects_router,
    ai_router,
    concepts_router,
    ideas_router,
    logs_router,
    mindmaps_router,
    project_ideas_router
)

# Load environment variables
load_dotenv()

# Create FastAPI app instance
app = FastAPI(
    title="IPMS API",
    description="Intelligent Project Management System API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])
app.include_router(activities_router, prefix="/api/activities", tags=["activities"])
app.include_router(development_router, prefix="/api/development", tags=["development"])
app.include_router(profile_router, prefix="/api/profile", tags=["profile"])
app.include_router(projects_router, prefix="/api/projects", tags=["projects"])
app.include_router(ai_router, prefix="/api/ai", tags=["ai"])
app.include_router(concepts_router, prefix="/api/concepts", tags=["concepts"])
app.include_router(ideas_router, prefix="/api/ideas", tags=["ideas"])
app.include_router(logs_router, prefix="/api/logs", tags=["logs"])
app.include_router(mindmaps_router, prefix="/api/mindmaps", tags=["mindmaps"])
app.include_router(project_ideas_router, prefix="/api/project-ideas", tags=["project-ideas"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to IPMS API",
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
