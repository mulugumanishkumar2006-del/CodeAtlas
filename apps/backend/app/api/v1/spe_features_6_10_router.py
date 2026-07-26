# apps/backend/app/api/v1/spe_features_6_10_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.spe_features_6_10 import (
    SoftwareAccelerationBreakdown,
    SoftwareElasticityBreakdown,
    SoftwareEnergyBreakdown,
    SoftwareEntropyBreakdown,
    SoftwareFrictionBreakdown,
    SPEFeatures6To10Response,
)
from app.services.spe_features_6_10_service import SPEFeatures6To10Service

router = APIRouter(
    prefix="/spe-secondary",
    tags=["spe_secondary"],
)

spe_secondary_service = SPEFeatures6To10Service()


@router.get(
    "/acceleration-breakdown/{component_id}",
    response_model=SoftwareAccelerationBreakdown,
)
def get_acceleration_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwareAccelerationBreakdown:
    """Feature 6: Software Acceleration Engine"""
    return spe_secondary_service.get_acceleration_breakdown(component_id, db)


@router.get(
    "/friction-breakdown/{component_id}", response_model=SoftwareFrictionBreakdown
)
def get_friction_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwareFrictionBreakdown:
    """Feature 7: Software Friction Engine (Coupling, Complexity, Test Coverage, Docs)"""
    return spe_secondary_service.get_friction_breakdown(component_id, db)


@router.get(
    "/elasticity-breakdown/{component_id}", response_model=SoftwareElasticityBreakdown
)
def get_elasticity_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwareElasticityBreakdown:
    """Feature 8: Software Elasticity Engine"""
    return spe_secondary_service.get_elasticity_breakdown(component_id, db)


@router.get(
    "/entropy-breakdown/{component_id}", response_model=SoftwareEntropyBreakdown
)
def get_entropy_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwareEntropyBreakdown:
    """Feature 9: Software Entropy Tracker Engine ⭐ (Architectural Disorder)"""
    return spe_secondary_service.get_entropy_breakdown(component_id, db)


@router.get("/energy-breakdown/{component_id}", response_model=SoftwareEnergyBreakdown)
def get_energy_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwareEnergyBreakdown:
    """Feature 10: Software Energy Engine"""
    return spe_secondary_service.get_energy_breakdown(component_id, db)


@router.get(
    "/all-secondary-features/{component_id}", response_model=SPEFeatures6To10Response
)
def get_all_secondary_features(
    component_id: str,
    db: Session = Depends(get_db),
) -> SPEFeatures6To10Response:
    """Synthesizes Features 6 to 10 into a unified secondary physics profile."""
    return spe_secondary_service.get_all_secondary_features(component_id, db)
