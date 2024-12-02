from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime

from database import get_db
from models.log import Log
from models.log_entry import LogEntry
from models.user import User
from schemas.log_entry import LogEntryCreate, LogEntryUpdate, LogEntryResponse
from auth.utils import get_current_user

router = APIRouter(tags=["log_entries"])


@router.post("/{log_id}/entries", response_model=LogEntryResponse)
async def create_log_entry(
    log_id: int,
    entry_data: LogEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new log entry"""
    # Check if log exists and user has access
    log = db.query(Log).filter(
        Log.id == log_id,
        Log.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    db_entry = LogEntry(
        **entry_data.dict(),
        log_id=log_id,
        user_id=current_user.id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


@router.get("/{log_id}/entries", response_model=List[LogEntryResponse])
async def get_log_entries(
    log_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all entries for a specific log"""
    # Check if log exists and user has access
    log = db.query(Log).filter(
        Log.id == log_id,
        Log.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    entries = db.query(LogEntry).filter(
        LogEntry.log_id == log_id
    ).order_by(desc(LogEntry.created_at)).offset(skip).limit(limit).all()
    
    return entries


@router.put("/{log_id}/entries/{entry_id}", response_model=LogEntryResponse)
async def update_log_entry(
    log_id: int,
    entry_id: int,
    entry_data: LogEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a log entry"""
    entry = db.query(LogEntry).filter(
        LogEntry.id == entry_id,
        LogEntry.log_id == log_id,
        LogEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Log entry not found")
    
    for key, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, key, value)
    
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{log_id}/entries/{entry_id}")
async def delete_log_entry(
    log_id: int,
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a log entry"""
    entry = db.query(LogEntry).filter(
        LogEntry.id == entry_id,
        LogEntry.log_id == log_id,
        LogEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Log entry not found")
    
    db.delete(entry)
    db.commit()
    return {"message": "Log entry deleted successfully"}
