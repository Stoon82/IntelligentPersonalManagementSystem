from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime

from database import get_db
from models.log import Log, LogType
from models.user import User
from schemas.log import LogCreate, LogUpdate, LogResponse
from auth.utils import get_current_user

router = APIRouter(tags=["logs"])


@router.post("/", response_model=LogResponse)
async def create_log(
    log_data: LogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new log entry"""
    db_log = Log(
        **log_data.dict(),
        user_id=current_user.id
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@router.get("/", response_model=List[LogResponse])
async def get_logs(
    project_id: Optional[int] = None,
    log_type: Optional[LogType] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all logs for the current user"""
    query = db.query(Log).filter(Log.user_id == current_user.id)
    
    if project_id:
        query = query.filter(Log.project_id == project_id)
    if log_type:
        query = query.filter(Log.log_type == log_type)
    
    return query.order_by(desc(Log.created_at)).offset(skip).limit(limit).all()


@router.get("/{log_id}", response_model=LogResponse)
async def get_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific log entry"""
    log = db.query(Log).filter(
        Log.id == log_id,
        Log.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log


@router.put("/{log_id}", response_model=LogResponse)
async def update_log(
    log_id: int,
    log_data: LogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a log entry"""
    log = db.query(Log).filter(
        Log.id == log_id,
        Log.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    for key, value in log_data.dict(exclude_unset=True).items():
        setattr(log, key, value)
    
    log.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(log)
    return log


@router.delete("/{log_id}")
async def delete_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a log entry"""
    log = db.query(Log).filter(
        Log.id == log_id,
        Log.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    db.delete(log)
    db.commit()
    return {"message": "Log deleted successfully"}
