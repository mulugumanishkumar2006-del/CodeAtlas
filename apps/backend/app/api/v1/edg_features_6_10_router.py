# apps/backend/app/api/v1/edg_features_6_10_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.edg_features_6_10 import (
    DangerousMutationDetectorResponse,
    DNAComparisonResponse,
    EDGSecondaryFeaturesResponse,
    EvolutionScoreResponse,
    GeneticDriftResponse,
    GenomeSimilarityResponse,
)
from app.services.edg_features_6_10_service import EDGFeatures6To10Service

router = APIRouter(
    prefix="/edg-secondary",
    tags=["edg_secondary"],
)

edg_secondary_service = EDGFeatures6To10Service()


@router.get(
    "/detect-dangerous-mutations", response_model=DangerousMutationDetectorResponse
)
def detect_dangerous_mutations(
    db: Session = Depends(get_db),
) -> DangerousMutationDetectorResponse:
    """Feature 6: Dangerous Mutation Detector Engine"""
    return edg_secondary_service.detect_dangerous_mutations(db)


@router.get("/compare-dna/{repo_id}", response_model=DNAComparisonResponse)
def compare_dna(
    repo_id: str,
    db: Session = Depends(get_db),
) -> DNAComparisonResponse:
    """Feature 7: DNA Comparison Engine (Netflix vs Uber vs Stripe vs Your Repository)"""
    return edg_secondary_service.compare_dna(repo_id, db)


@router.get("/genome-similarity/{repo_id}", response_model=GenomeSimilarityResponse)
def get_genome_similarity(
    repo_id: str,
    db: Session = Depends(get_db),
) -> GenomeSimilarityResponse:
    """Feature 8: Genome Similarity Engine"""
    return edg_secondary_service.get_genome_similarity(repo_id, db)


@router.get("/evolution-score/{repo_id}", response_model=EvolutionScoreResponse)
def get_evolution_score(
    repo_id: str,
    db: Session = Depends(get_db),
) -> EvolutionScoreResponse:
    """Feature 9: Architecture Evolution Score Engine"""
    return edg_secondary_service.get_evolution_score(repo_id, db)


@router.get("/genetic-drift/{repo_id}", response_model=GeneticDriftResponse)
def get_genetic_drift(
    repo_id: str,
    db: Session = Depends(get_db),
) -> GeneticDriftResponse:
    """Feature 10: Multi-Year Genetic Drift Engine"""
    return edg_secondary_service.get_genetic_drift(repo_id, db)


@router.get(
    "/all-secondary-features/{repo_id}", response_model=EDGSecondaryFeaturesResponse
)
def get_all_secondary_features(
    repo_id: str,
    db: Session = Depends(get_db),
) -> EDGSecondaryFeaturesResponse:
    """Synthesizes Features 6 to 10 into a unified secondary genome state."""
    return edg_secondary_service.get_all_secondary_features(repo_id, db)
