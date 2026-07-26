# apps/backend/app/api/v1/spe_features_11_15_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.spe_features_11_15 import (
    CollisionDetectorResponse,
    EngineeringClimateResponse,
    ForceSimulationRequest,
    ForceSimulationResponse,
    ResonanceDetectionResponse,
    SPEFeatures11To15Response,
    StabilityIndexResponse,
)
from app.services.spe_features_11_15_service import SPEFeatures11To15Service

router = APIRouter(
    prefix="/spe-dynamics",
    tags=["spe_dynamics"],
)

spe_dynamics_service = SPEFeatures11To15Service()


@router.post("/simulate-force", response_model=ForceSimulationResponse)
def simulate_force(
    payload: ForceSimulationRequest,
    db: Session = Depends(get_db),
) -> ForceSimulationResponse:
    """Feature 11: Force Simulation Engine"""
    return spe_dynamics_service.simulate_force(payload, db)


@router.get("/detect-collisions", response_model=CollisionDetectorResponse)
def detect_collisions(
    db: Session = Depends(get_db),
) -> CollisionDetectorResponse:
    """Feature 12: Collision Detector Engine"""
    return spe_dynamics_service.detect_collisions(db)


@router.get("/stability-index/{component_id}", response_model=StabilityIndexResponse)
def get_stability_index(
    component_id: str,
    db: Session = Depends(get_db),
) -> StabilityIndexResponse:
    """Feature 13: Subsystem Stability Index Engine"""
    return spe_dynamics_service.get_stability_index(component_id, db)


@router.get("/detect-resonance", response_model=ResonanceDetectionResponse)
def detect_resonance(
    db: Session = Depends(get_db),
) -> ResonanceDetectionResponse:
    """Feature 14: Resonance Detection Engine"""
    return spe_dynamics_service.detect_resonance(db)


@router.get("/engineering-climate", response_model=EngineeringClimateResponse)
def get_engineering_climate(
    db: Session = Depends(get_db),
) -> EngineeringClimateResponse:
    """Feature 15: Engineering Climate Summarizer ("Calm", "Warming", "Storm", "Critical")"""
    return spe_dynamics_service.get_engineering_climate(db)


@router.get(
    "/all-dynamic-features/{component_id}", response_model=SPEFeatures11To15Response
)
def get_all_dynamic_features(
    component_id: str,
    db: Session = Depends(get_db),
) -> SPEFeatures11To15Response:
    """Synthesizes Features 11 to 15 into a unified dynamic physics profile."""
    return spe_dynamics_service.get_all_dynamic_features(component_id, db)
