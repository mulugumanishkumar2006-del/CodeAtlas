# apps/backend/app/api/v1/engineering_agi_router.py

from typing import Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.engineering_agi import (
    EngineeringAGIExecutiveResponse,
    ExecutiveMacroQueryRequest,
)
from app.services.engineering_agi_service import EngineeringAGIService

router = APIRouter(
    prefix="/engineering-agi",
    tags=["engineering_agi"],
)

agi_service = EngineeringAGIService()


@router.post("/executive-plan", response_model=EngineeringAGIExecutiveResponse)
def process_executive_macro_query(
    payload: ExecutiveMacroQueryRequest,
    db: Session = Depends(get_db),
) -> EngineeringAGIExecutiveResponse:
    """Phase 25 — Engineering AGI: Process high-level strategic executive query."""
    return agi_service.process_executive_macro_query(payload, db)


@router.get("/personas")
def list_personas(
    db: Session = Depends(get_db),
) -> List[Dict[str, str]]:
    """List the 9 specialized AI personas comprising the Engineering Executive Council."""
    return agi_service.get_personas(db)
