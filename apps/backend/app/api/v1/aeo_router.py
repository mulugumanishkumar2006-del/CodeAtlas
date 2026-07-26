# apps/backend/app/api/v1/aeo_router.py

from typing import Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.aeo import (
    AEOOrgStateRequest,
    AEOOrgStateResponse,
)
from app.services.aeo_service import AEOService

router = APIRouter(
    prefix="/aeo",
    tags=["aeo"],
)

aeo_service = AEOService()


@router.post("/coordinate-org", response_model=AEOOrgStateResponse)
def coordinate_organization(
    payload: AEOOrgStateRequest,
    db: Session = Depends(get_db),
) -> AEOOrgStateResponse:
    """Phase 26 — Autonomous Engineering Organization: Coordinate entire engineering org across 8 AI Executive roles."""
    return aeo_service.coordinate_organization(payload, db)


@router.get("/executive-roles")
def list_executive_roles(
    db: Session = Depends(get_db),
) -> List[Dict[str, str]]:
    """List the 8 Autonomous AI Executive Roles comprising the Engineering AEO Council."""
    return aeo_service.get_exec_roles(db)
