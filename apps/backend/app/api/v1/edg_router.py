# apps/backend/app/api/v1/edg_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.edg import (
    DNASequencerPipelineRequest,
    DNASequencerPipelineResponse,
    RepositoryGenomeProfile,
)
from app.services.edg_service import EDGService

router = APIRouter(
    prefix="/edg",
    tags=["edg"],
)

edg_service = EDGService()


@router.post("/sequence-dna", response_model=DNASequencerPipelineResponse)
def execute_dna_sequencer_pipeline(
    payload: DNASequencerPipelineRequest,
    db: Session = Depends(get_db),
) -> DNASequencerPipelineResponse:
    """Executes 9-stage DNA Sequencer Pipeline (Repository -> AST -> Knowledge Graph -> Runtime -> Prediction -> Physics -> Brain -> Sequencer -> DNA Report)."""
    return edg_service.execute_dna_sequencer_pipeline(payload, db)


@router.get("/repository-genome/{repo_id}", response_model=RepositoryGenomeProfile)
def get_repository_genome(
    repo_id: str,
    db: Session = Depends(get_db),
) -> RepositoryGenomeProfile:
    """Retrieves DNA genome profile for a specific repository."""
    return edg_service.get_repository_genome(repo_id, db)
