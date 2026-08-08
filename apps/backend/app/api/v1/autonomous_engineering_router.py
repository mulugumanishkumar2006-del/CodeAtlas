from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.autonomous_engineering import (
    AgentApprovalRequestModel,
    AgentTaskModel,
    AutonomyDashboardModel,
    AutonomyLevel,
    CommandSafetyModel,
)
from app.services.autonomous_engineering_service import AutonomousEngineeringService

router = APIRouter(prefix="/autonomous", tags=["Autonomous Engineering"])


@router.post(
    "/tasks/create",
    response_model=AgentTaskModel,
    status_code=status.HTTP_201_CREATED,
)
def create_autonomous_task(
    organization_id: str = Query(...),
    repository_id: str = Query(...),
    objective: str = Query("Option B Auth Interface Decoupling"),
    autonomy_level: AutonomyLevel = Query(AutonomyLevel.LEVEL_0_OBSERVE),
    db: Session = Depends(get_db),
):
    """
    ⭐ Creates an autonomous engineering task with default Level 0 (Observe Only) safety controls.
    """
    service = AutonomousEngineeringService(db=db)
    return service.create_autonomous_task(
        organization_id=organization_id,
        repository_id=repository_id,
        objective=objective,
        autonomy_level=autonomy_level,
    )


@router.post(
    "/tasks/{task_id}/approve",
    response_model=AgentTaskModel,
    status_code=status.HTTP_200_OK,
)
def process_human_approval(
    task_id: str,
    req: AgentApprovalRequestModel,
    db: Session = Depends(get_db),
):
    """
    ⭐ Human Approval Gate Endpoint. Approves, rejects, or requests changes for prepared sandbox diffs.
    """
    service = AutonomousEngineeringService(db=db)
    req.task_id = task_id
    return service.process_human_approval(req)


@router.post(
    "/command-safety",
    response_model=CommandSafetyModel,
    status_code=status.HTTP_200_OK,
)
def evaluate_command_safety(
    command: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Command Safety Inspector Endpoint. Classifies commands into SAFE, RESTRICTED, DANGEROUS, or BLOCKED.
    """
    service = AutonomousEngineeringService(db=db)
    return service.evaluate_command_safety(command)


@router.post(
    "/rollback/{task_id}",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
def rollback_task(
    task_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Reverts sandbox worktree modifications cleanly to pre-task commit state.
    """
    service = AutonomousEngineeringService(db=db)
    return service.rollback_task(task_id)


@router.get(
    "/dashboard/{organization_id}",
    response_model=AutonomyDashboardModel,
    status_code=status.HTTP_200_OK,
)
def get_autonomy_dashboard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns Autonomy Control Dashboard overview (active agents, pending approvals, task counts).
    """
    service = AutonomousEngineeringService(db=db)
    return service.get_autonomy_dashboard(organization_id)
