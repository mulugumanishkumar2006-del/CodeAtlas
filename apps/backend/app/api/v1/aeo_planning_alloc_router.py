# apps/backend/app/api/v1/aeo_planning_alloc_router.py


from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.aeo_planning_alloc import (
    AISprintPlannerRequest,
    AISprintPlannerResponse,
    CollaborationMatrixResponse,
    TeamAllocationRequest,
    TeamAllocationResponse,
)
from app.services.aeo_planning_alloc_service import AEOPlanningAllocService

router = APIRouter(
    prefix="/aeo-planning",
    tags=["aeo_planning"],
)

plan_service = AEOPlanningAllocService()


@router.get("/collaboration-matrix", response_model=CollaborationMatrixResponse)
def get_collaboration_matrix(
    initiative: str = Query(
        "Multi-Region Auth Vault Migration", description="Initiative title"
    ),
    db: Session = Depends(get_db),
) -> CollaborationMatrixResponse:
    """Feature 1: AI Engineering Organization Collaboration Matrix"""
    return plan_service.get_collaboration_matrix(initiative, db)


@router.post("/plan-sprint", response_model=AISprintPlannerResponse)
def plan_sprint(
    payload: AISprintPlannerRequest,
    db: Session = Depends(get_db),
) -> AISprintPlannerResponse:
    """Feature 2: AI Sprint Planner Engine"""
    return plan_service.plan_sprint(payload, db)


@router.post("/allocate-teams", response_model=TeamAllocationResponse)
def allocate_teams(
    payload: TeamAllocationRequest,
    db: Session = Depends(get_db),
) -> TeamAllocationResponse:
    """Feature 3: AI Team Allocation & Skill Gap Identification Engine"""
    return plan_service.allocate_teams(payload, db)
