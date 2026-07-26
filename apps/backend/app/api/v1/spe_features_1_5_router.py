# apps/backend/app/api/v1/spe_features_1_5_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.spe_features_1_5 import (
    SoftwareGravityBreakdown,
    SoftwareMassBreakdown,
    SoftwarePressureBreakdown,
    SoftwareTemperatureBreakdown,
    SoftwareVelocityBreakdown,
    SPEFeatures1To5Response,
)
from app.services.spe_features_1_5_service import SPEFeatures1To5Service

router = APIRouter(
    prefix="/spe-primary",
    tags=["spe_primary"],
)

spe_primary_service = SPEFeatures1To5Service()


@router.get("/mass-breakdown/{component_id}", response_model=SoftwareMassBreakdown)
def get_mass_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwareMassBreakdown:
    """Feature 1: Software Mass Engine (LOC, Cyclomatic Complexity, Classes, Functions)"""
    return spe_primary_service.get_mass_breakdown(component_id, db)


@router.get(
    "/gravity-breakdown/{component_id}", response_model=SoftwareGravityBreakdown
)
def get_gravity_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwareGravityBreakdown:
    """Feature 2: Software Gravity Engine (Dependent Systems)"""
    return spe_primary_service.get_gravity_breakdown(component_id, db)


@router.get(
    "/temperature-breakdown/{component_id}", response_model=SoftwareTemperatureBreakdown
)
def get_temperature_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwareTemperatureBreakdown:
    """Feature 3: Software Temperature Engine (Recent Activity)"""
    return spe_primary_service.get_temperature_breakdown(component_id, db)


@router.get(
    "/pressure-breakdown/{component_id}", response_model=SoftwarePressureBreakdown
)
def get_pressure_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwarePressureBreakdown:
    """Feature 4: Software Pressure Engine (Production RPS Load)"""
    return spe_primary_service.get_pressure_breakdown(component_id, db)


@router.get(
    "/velocity-breakdown/{component_id}", response_model=SoftwareVelocityBreakdown
)
def get_velocity_breakdown(
    component_id: str,
    db: Session = Depends(get_db),
) -> SoftwareVelocityBreakdown:
    """Feature 5: Software Velocity Engine (Rate of Change)"""
    return spe_primary_service.get_velocity_breakdown(component_id, db)


@router.get(
    "/all-primary-features/{component_id}", response_model=SPEFeatures1To5Response
)
def get_all_primary_features(
    component_id: str,
    db: Session = Depends(get_db),
) -> SPEFeatures1To5Response:
    """Synthesizes Features 1 to 5 into a unified primary physics profile."""
    return spe_primary_service.get_all_primary_features(component_id, db)
