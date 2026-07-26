# apps/backend/app/api/v1/edg_lab_finale_router.py

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.edg_lab_finale import (
    ChromosomeExplorerItem,
    EDGLabFinaleResponse,
    SpecializedGenomeProfile,
)
from app.services.edg_lab_finale_service import EDGLabFinaleService

router = APIRouter(
    prefix="/edg-lab",
    tags=["edg_lab"],
)

edg_lab_service = EDGLabFinaleService()


@router.get("/chromosomes/{repo_id}", response_model=List[ChromosomeExplorerItem])
def get_chromosomes(
    repo_id: str,
    db: Session = Depends(get_db),
) -> List[ChromosomeExplorerItem]:
    """Feature 16: Code Chromosome Explorer Engine"""
    return edg_lab_service.get_chromosomes(repo_id, db)


@router.get(
    "/specialized-genomes/{repo_id}", response_model=List[SpecializedGenomeProfile]
)
def get_specialized_genomes(
    repo_id: str,
    db: Session = Depends(get_db),
) -> List[SpecializedGenomeProfile]:
    """Features 17–30: 14 Specialized Genomes Engines"""
    return edg_lab_service.get_specialized_genomes(repo_id, db)


@router.get("/all-lab-features/{repo_id}", response_model=EDGLabFinaleResponse)
def get_all_lab_features(
    repo_id: str,
    db: Session = Depends(get_db),
) -> EDGLabFinaleResponse:
    """Synthesizes Features 16 to 30 into a unified lab finale state."""
    return edg_lab_service.get_all_lab_features(repo_id, db)
