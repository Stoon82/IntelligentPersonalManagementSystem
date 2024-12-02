from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.mindmap import Mindmap
from pydantic import BaseModel
import logging

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

class MindmapBase(BaseModel):
    title: str
    data: dict

class MindmapCreate(MindmapBase):
    project_id: int

class MindmapResponse(MindmapBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

@router.post("/", response_model=MindmapResponse)
def create_mindmap(mindmap: MindmapCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating new mindmap with data: {mindmap.dict()}")
    try:
        db_mindmap = Mindmap(**mindmap.dict())
        db.add(db_mindmap)
        db.commit()
        db.refresh(db_mindmap)
        logger.info(f"Successfully created mindmap with id: {db_mindmap.id}")
        return db_mindmap
    except Exception as e:
        logger.error(f"Error creating mindmap: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{mindmap_id}", response_model=MindmapResponse)
def get_mindmap(mindmap_id: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching mindmap with id: {mindmap_id}")
    mindmap = db.query(Mindmap).filter(Mindmap.id == mindmap_id).first()
    if not mindmap:
        logger.warning(f"Mindmap {mindmap_id} not found")
        raise HTTPException(status_code=404, detail="Mindmap not found")
    logger.info(f"Found mindmap: {mindmap.id}")
    return mindmap

@router.get("/projects/{project_id}/mindmaps/", response_model=List[MindmapResponse])
def get_project_mindmaps(project_id: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching mindmaps for project: {project_id}")
    mindmaps = db.query(Mindmap).filter(Mindmap.project_id == project_id).all()
    logger.info(f"Found {len(mindmaps)} mindmaps for project {project_id}")
    return mindmaps

@router.put("/{mindmap_id}", response_model=MindmapResponse)
def update_mindmap(mindmap_id: int, mindmap: MindmapBase, db: Session = Depends(get_db)):
    logger.info(f"Updating mindmap {mindmap_id}")
    logger.debug(f"Update data: {mindmap.dict()}")
    
    db_mindmap = db.query(Mindmap).filter(Mindmap.id == mindmap_id).first()
    if not db_mindmap:
        logger.warning(f"Mindmap {mindmap_id} not found")
        raise HTTPException(status_code=404, detail="Mindmap not found")
    
    try:
        update_data = mindmap.dict(exclude_unset=True)
        logger.debug(f"Current mindmap state: {db_mindmap.__dict__}")
        logger.debug(f"Applying updates: {update_data}")
        
        for key, value in update_data.items():
            setattr(db_mindmap, key, value)
        
        db.commit()
        db.refresh(db_mindmap)
        logger.info(f"Successfully updated mindmap {mindmap_id}")
        logger.debug(f"New mindmap state: {db_mindmap.__dict__}")
        return db_mindmap
    except Exception as e:
        logger.error(f"Error updating mindmap {mindmap_id}: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating mindmap: {str(e)}")

@router.delete("/{mindmap_id}")
def delete_mindmap(mindmap_id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting mindmap {mindmap_id}")
    mindmap = db.query(Mindmap).filter(Mindmap.id == mindmap_id).first()
    if not mindmap:
        logger.warning(f"Mindmap {mindmap_id} not found")
        raise HTTPException(status_code=404, detail="Mindmap not found")
    
    try:
        db.delete(mindmap)
        db.commit()
        logger.info(f"Successfully deleted mindmap {mindmap_id}")
        return {"message": "Mindmap deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting mindmap {mindmap_id}: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
