from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.journal import JournalEntry
from ..schemas.journal import JournalEntryCreate, JournalEntryResponse

router = APIRouter(prefix="/journal", tags=["Journal"])

@router.post("/", response_model=JournalEntryResponse)
def create_journal_entry(entry: JournalEntryCreate, db: Session = Depends(get_db)):
    db_entry = JournalEntry(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/", response_model=List[JournalEntryResponse])
def get_journal_entries(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(JournalEntry).offset(skip).limit(limit).all()

@router.put("/{entry_id}", response_model=JournalEntryResponse)
def update_journal_entry(entry_id: int, entry: JournalEntryCreate, db: Session = Depends(get_db)):
    db_entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    for key, value in entry.dict().items():
        setattr(db_entry, key, value)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.delete("/{entry_id}", response_model=JournalEntryResponse)
def delete_journal_entry(entry_id: int, db: Session = Depends(get_db)):
    db_entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    db.delete(db_entry)
    db.commit()
    return db_entry
