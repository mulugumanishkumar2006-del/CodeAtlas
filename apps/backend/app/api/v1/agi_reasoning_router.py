# apps/backend/app/api/v1/agi_reasoning_router.py

from typing import Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.agi_reasoning import (
    AGIReasoningCoreRequest,
    AGIReasoningCoreResponse,
    SpecializedScientistRequest,
    SpecializedScientistResponse,
)
from app.services.agi_reasoning_service import AGIReasoningService

router = APIRouter(
    prefix="/agi-reasoning",
    tags=["agi_reasoning"],
)

reasoning_service = AGIReasoningService()


@router.post("/multistep-reason", response_model=AGIReasoningCoreResponse)
def execute_multistep_reasoning(
    payload: AGIReasoningCoreRequest,
    db: Session = Depends(get_db),
) -> AGIReasoningCoreResponse:
    """Features 1-5: Universal Engineering Reasoning Engine & Multi-Step Reasoning."""
    return reasoning_service.execute_multistep_reasoning(payload, db)


@router.post("/scientist-consultation", response_model=SpecializedScientistResponse)
def consult_specialized_scientist(
    payload: SpecializedScientistRequest,
    db: Session = Depends(get_db),
) -> SpecializedScientistResponse:
    """Features 6-20: Consult any of the 15 specialized AI Scientists & Advisors."""
    return reasoning_service.consult_specialized_scientist(payload, db)


@router.get("/scientists-list")
def list_scientists(
    db: Session = Depends(get_db),
) -> List[Dict[str, str]]:
    """List the 15 specialized AI Scientists and Advisors (Features 6-20)."""
    return reasoning_service.list_scientists(db)
