# apps/backend/app/api/v1/spe_lab_finale_router.py

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.spe_lab_finale import (
    ArchitectureBlackHole,
    DependencyOrbitMap,
    InteractivePhysicsLabDragRequest,
    InteractivePhysicsLabDragResponse,
    SPELabFinaleResponse,
    TechnicalDebtGravityWell,
)
from app.services.spe_lab_finale_service import SPELabFinaleService

router = APIRouter(
    prefix="/spe-lab",
    tags=["spe_lab"],
)

spe_lab_service = SPELabFinaleService()


@router.post(
    "/drag-service-simulation", response_model=InteractivePhysicsLabDragResponse
)
def simulate_drag_event(
    payload: InteractivePhysicsLabDragRequest,
    db: Session = Depends(get_db),
) -> InteractivePhysicsLabDragResponse:
    """🌟 WOW Feature Endpoint: Simulates drag-and-drop solar system orbital movements."""
    return spe_lab_service.simulate_drag_event(payload, db)


@router.get("/gravity-wells", response_model=List[TechnicalDebtGravityWell])
def get_gravity_wells(
    db: Session = Depends(get_db),
) -> List[TechnicalDebtGravityWell]:
    """Feature 16: Technical Debt Gravity Wells"""
    return spe_lab_service.get_gravity_wells(db)


@router.get("/architecture-black-holes", response_model=List[ArchitectureBlackHole])
def get_black_holes(
    db: Session = Depends(get_db),
) -> List[ArchitectureBlackHole]:
    """Feature 17: Architecture Black Holes"""
    return spe_lab_service.get_black_holes(db)


@router.get("/dependency-orbit-map", response_model=List[DependencyOrbitMap])
def get_orbit_maps(
    db: Session = Depends(get_db),
) -> List[DependencyOrbitMap]:
    """Feature 18: Dependency Orbit Maps"""
    return spe_lab_service.get_orbit_maps(db)


@router.get("/all-lab-features", response_model=SPELabFinaleResponse)
def get_all_lab_features(
    db: Session = Depends(get_db),
) -> SPELabFinaleResponse:
    """Synthesizes Features 16 to 30 into a unified lab finale state."""
    return spe_lab_service.get_all_lab_features(db)
