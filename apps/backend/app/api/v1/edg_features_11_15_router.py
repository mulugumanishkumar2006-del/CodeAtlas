# apps/backend/app/api/v1/edg_features_11_15_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.edg_features_11_15 import (
    AIGeneticAdvisorResponse,
    DNAStabilityResponse,
    EDGDynamicsFeaturesResponse,
    EngineeringSpeciesClassificationResponse,
    GenomeHeatmapResponse,
    RepositoryFamilyTreeResponse,
)
from app.services.edg_features_11_15_service import EDGFeatures11To15Service

router = APIRouter(
    prefix="/edg-dynamics",
    tags=["edg_dynamics"],
)

edg_dynamics_service = EDGFeatures11To15Service()


@router.get("/dna-stability/{repo_id}", response_model=DNAStabilityResponse)
def get_dna_stability(
    repo_id: str,
    db: Session = Depends(get_db),
) -> DNAStabilityResponse:
    """Feature 11: DNA Stability Engine"""
    return edg_dynamics_service.get_dna_stability(repo_id, db)


@router.get("/ai-genetic-advisor", response_model=AIGeneticAdvisorResponse)
def recommend_mutations(
    db: Session = Depends(get_db),
) -> AIGeneticAdvisorResponse:
    """Feature 12: AI Genetic Advisor Engine"""
    return edg_dynamics_service.recommend_mutations(db)


@router.get(
    "/species-classification/{repo_id}",
    response_model=EngineeringSpeciesClassificationResponse,
)
def classify_species(
    repo_id: str,
    db: Session = Depends(get_db),
) -> EngineeringSpeciesClassificationResponse:
    """Feature 13: Engineering Species Classification Engine (8 Sectors)"""
    return edg_dynamics_service.classify_species(repo_id, db)


@router.get("/family-tree/{repo_id}", response_model=RepositoryFamilyTreeResponse)
def get_family_tree(
    repo_id: str,
    db: Session = Depends(get_db),
) -> RepositoryFamilyTreeResponse:
    """Feature 14: Repository Family Tree Engine"""
    return edg_dynamics_service.get_family_tree(repo_id, db)


@router.get("/genome-heatmap/{repo_id}", response_model=GenomeHeatmapResponse)
def get_genome_heatmap(
    repo_id: str,
    db: Session = Depends(get_db),
) -> GenomeHeatmapResponse:
    """Feature 15: Genome Heatmap Engine"""
    return edg_dynamics_service.get_genome_heatmap(repo_id, db)


@router.get(
    "/all-dynamics-features/{repo_id}", response_model=EDGDynamicsFeaturesResponse
)
def get_all_dynamics_features(
    repo_id: str,
    db: Session = Depends(get_db),
) -> EDGDynamicsFeaturesResponse:
    """Synthesizes Features 11 to 15 into a unified dynamics genome state."""
    return edg_dynamics_service.get_all_dynamics_features(repo_id, db)
