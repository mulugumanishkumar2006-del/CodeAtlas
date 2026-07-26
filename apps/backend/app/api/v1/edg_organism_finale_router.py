# apps/backend/app/api/v1/edg_organism_finale_router.py

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.edg_organism_finale import (
    EDGOrganismFinaleResponse,
    ExecutiveGenomeReport,
    GenomeDiffItem,
    MutationReplayItem,
    RepositoryDNAExplorerProfile,
)
from app.services.edg_organism_finale_service import EDGOrganismFinaleService

router = APIRouter(
    prefix="/edg-organism",
    tags=["edg_organism"],
)

edg_organism_service = EDGOrganismFinaleService()


@router.get("/dna-explorer/{repo_id}", response_model=RepositoryDNAExplorerProfile)
def get_dna_explorer_profile(
    repo_id: str,
    db: Session = Depends(get_db),
) -> RepositoryDNAExplorerProfile:
    """🌟 WOW Feature Endpoint: Repository DNA Explorer with exact percentage scores and ASCII visual gauges."""
    return edg_organism_service.get_dna_explorer_profile(repo_id, db)


@router.get("/mutation-replay/{repo_id}", response_model=List[MutationReplayItem])
def replay_mutations(
    repo_id: str,
    db: Session = Depends(get_db),
) -> List[MutationReplayItem]:
    """Feature 32: Mutation Replay Engine"""
    return edg_organism_service.replay_mutations(repo_id, db)


@router.get("/genome-diff/{repo_id}", response_model=List[GenomeDiffItem])
def get_genome_diffs(
    repo_id: str,
    db: Session = Depends(get_db),
) -> List[GenomeDiffItem]:
    """Feature 44: Genome Diff Visualization Engine"""
    return edg_organism_service.get_genome_diffs(repo_id, db)


@router.get("/executive-report/{repo_id}", response_model=ExecutiveGenomeReport)
def get_executive_report(
    repo_id: str,
    db: Session = Depends(get_db),
) -> ExecutiveGenomeReport:
    """Feature 41: Executive Genome Report Engine"""
    return edg_organism_service.get_executive_report(repo_id, db)


@router.get(
    "/all-organism-features/{repo_id}", response_model=EDGOrganismFinaleResponse
)
def get_all_organism_features(
    repo_id: str,
    db: Session = Depends(get_db),
) -> EDGOrganismFinaleResponse:
    """Synthesizes Features 31 to 50 into a unified organism finale state."""
    return edg_organism_service.get_all_organism_features(repo_id, db)
