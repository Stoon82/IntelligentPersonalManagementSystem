from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.journal import JournalEntry, Journal
from schemas.journal import JournalEntryCreate, JournalEntryResponse, JournalCreate, JournalResponse
from fastapi.security import OAuth2PasswordBearer
from auth.utils import get_current_user

router = APIRouter(
    tags=["journals"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

@router.post("", response_model=JournalResponse)
async def create_journal(
    journal: JournalCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    current_user = Depends(get_current_user)
):
    db_journal = Journal(
        user_id=current_user.id,
        title=journal.title
    )
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

@router.get("", response_model=List[JournalResponse])
async def list_journals(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    current_user = Depends(get_current_user)
):
    return db.query(Journal).filter(Journal.user_id == current_user.id).all()

@router.post("/{journal_id}/entries", response_model=JournalEntryResponse)
async def create_journal_entry(
    journal_id: int,
    entry: JournalEntryCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    current_user = Depends(get_current_user)
):
    # Verify journal exists and belongs to user
    journal = db.query(Journal).filter(
        Journal.id == journal_id,
        Journal.user_id == current_user.id
    ).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    db_entry = JournalEntry(
        user_id=current_user.id,
        journal_id=journal_id,
        content=entry.content,
        mood=entry.mood,
        tags=entry.tags if entry.tags else []
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/{journal_id}/entries", response_model=List[JournalEntryResponse])
async def get_journal_entries(
    journal_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    current_user = Depends(get_current_user)
):
    # Verify journal exists and belongs to user
    journal = db.query(Journal).filter(
        Journal.id == journal_id,
        Journal.user_id == current_user.id
    ).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    return db.query(JournalEntry).filter(
        JournalEntry.journal_id == journal_id,
        JournalEntry.user_id == current_user.id
    ).all()

@router.get("/{journal_id}/entries/{entry_id}", response_model=JournalEntryResponse)
async def get_journal_entry(
    journal_id: int,
    entry_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    current_user = Depends(get_current_user)
):
    # Verify journal exists and belongs to user
    journal = db.query(Journal).filter(
        Journal.id == journal_id,
        Journal.user_id == current_user.id
    ).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.journal_id == journal_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return entry

@router.put("/{journal_id}/entries/{entry_id}", response_model=JournalEntryResponse)
async def update_journal_entry(
    journal_id: int,
    entry_id: int,
    entry_update: JournalEntryCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    current_user = Depends(get_current_user)
):
    # Verify journal exists and belongs to user
    journal = db.query(Journal).filter(
        Journal.id == journal_id,
        Journal.user_id == current_user.id
    ).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    db_entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.journal_id == journal_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    db_entry.content = entry_update.content
    db_entry.mood = entry_update.mood
    db_entry.tags = entry_update.tags if entry_update.tags else []
    
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.delete("/{journal_id}/entries/{entry_id}")
async def delete_journal_entry(
    journal_id: int,
    entry_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    current_user = Depends(get_current_user)
):
    # Verify journal exists and belongs to user
    journal = db.query(Journal).filter(
        Journal.id == journal_id,
        Journal.user_id == current_user.id
    ).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    db_entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.journal_id == journal_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    db.delete(db_entry)
    db.commit()
    return {"message": "Journal entry deleted successfully"}
