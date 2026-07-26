# apps/backend/app/api/v1/edg_features_1_5_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.edg_features_1_5 import (
    EDGPrimaryFeaturesResponse,
    EvolutionTrackerResponse,
    HealthyMutationDetectorResponse,
    MutationDetectorResponse,
    RepositoryDNAFingerprint,
)
from app.services.edg_features_1_5_service import EDGFeatures1To5Service

router = APIRouter(
    prefix="/edg-primary",
    tags=["edg_primary"],
)

edg_primary_service = EDGFeatures1To5Service()


@router.get("/fingerprint/{repo_id}", response_model=RepositoryDNAFingerprint)
def get_fingerprint(
    repo_id: str,
    db: Session = Depends(get_db),
) -> RepositoryDNAFingerprint:
    """Feature 1: Repository DNA Fingerprint Engine"""
    return edg_primary_service.get_fingerprint(repo_id, db)


@router.get("/detect-mutations", response_model=MutationDetectorResponse)
def detect_mutations(
    db: Session = Depends(get_db),
) -> MutationDetectorResponse:
    """Feature 3: Mutation Detector (Classifies Good vs Bad commit mutations)"""
    return edg_primary_service.detect_mutations(db)


@router.get("/evolution-tracker", response_model=EvolutionTrackerResponse)
def track_evolution(
    db: Session = Depends(get_db),
) -> EvolutionTrackerResponse:
    """Feature 4: DNA Evolution Tracker"""
    return edg_primary_service.track_evolution(db)


@router.get("/healthy-mutations", response_model=HealthyMutationDetectorResponse)
def detect_healthy_mutations(
    db: Session = Depends(get_db),
) -> HealthyMutationDetectorResponse:
    """Feature 5: Healthy Mutation Detector"""
    return edg_primary_service.detect_healthy_mutations(db)


@router.get(
    "/all-primary-features/{repo_id}", response_model=EDGPrimaryFeaturesResponse
)
def get_all_primary_features(
    repo_id: str,
    db: Session = Depends(get_db),
) -> EDGPrimaryFeaturesResponse:
    """Synthesizes Features 1 to 5 into a unified primary genome state."""
    return edg_primary_service.get_all_primary_features(repo_id, db)
