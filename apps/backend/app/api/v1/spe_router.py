# apps/backend/app/api/v1/spe_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.spe import (
    ComponentPhysicsProfile,
    SPEUniverseRequest,
    SPEUniverseResponse,
)
from app.services.spe_service import SPEService

router = APIRouter(
    prefix="/spe",
    tags=["spe"],
)

spe_service = SPEService()


@router.get("/component-physics/{component_id}", response_model=ComponentPhysicsProfile)
def get_component_physics(
    component_id: str,
    db: Session = Depends(get_db),
) -> ComponentPhysicsProfile:
    """Calculates 10-property physics profile for a specific microservice component."""
    return spe_service.get_component_physics(component_id, db)


@router.post("/simulate-universe", response_model=SPEUniverseResponse)
def simulate_universe(
    payload: SPEUniverseRequest,
    db: Session = Depends(get_db),
) -> SPEUniverseResponse:
    """Simulates full system software physics universe across all microservices."""
    return spe_service.simulate_universe(payload, db)
