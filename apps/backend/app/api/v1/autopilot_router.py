from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.autopilot import (
    AutopilotApprovalRequest,
    AutopilotEvaluationMetrics,
    AutopilotRunModel,
    AutopilotRunRequest,
)
from app.services.autopilot_service import AutopilotService

router = APIRouter(prefix="/autopilot", tags=["Engineering Autopilot"])


@router.post(
    "/initiate",
    response_model=AutopilotRunModel,
    status_code=status.HTTP_201_CREATED,
)
def initiate_autopilot_run(
    req: AutopilotRunRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ CodeAtlas v1.3 Engineering Autopilot Endpoint.
    Initiates a human-in-the-loop engineering run under strict approval policy. Pauses at state 'AWAITING_APPROVAL'.
    """
    service = AutopilotService(db=db)
    return service.initiate_run(req)


@router.post(
    "/approve",
    response_model=AutopilotRunModel,
    status_code=status.HTTP_200_OK,
)
def grant_autopilot_approval(
    req: AutopilotApprovalRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Explicitly grants approval for specific scopes (CODE_MODIFICATION, TESTING, COMMIT, PULL_REQUEST).
    """
    service = AutopilotService(db=db)
    return service.grant_approval(req)


@router.post(
    "/execute-next",
    response_model=AutopilotRunModel,
    status_code=status.HTTP_200_OK,
)
def execute_next_autopilot_step(
    run_id: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Executes approved sandbox step sequence in an isolated workspace environment.
    """
    service = AutopilotService(db=db)
    return service.execute_next_step(run_id)


@router.post(
    "/cancel",
    response_model=AutopilotRunModel,
    status_code=status.HTTP_200_OK,
)
def cancel_autopilot_run(
    run_id: str = Query(...),
    reason: str = Query("Developer cancelled run"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Safely terminates a running autopilot instance and preserves audit logs.
    """
    service = AutopilotService(db=db)
    return service.cancel_run(run_id, reason)


@router.get(
    "/run/{run_id}",
    response_model=AutopilotRunModel,
    status_code=status.HTTP_200_OK,
)
def get_autopilot_run(
    run_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns current state, step progress, approval scopes, and audit trail for an autopilot run.
    """
    service = AutopilotService(db=db)
    return service.get_run(run_id)


@router.get(
    "/metrics/{repository_id}",
    response_model=AutopilotEvaluationMetrics,
    status_code=status.HTTP_200_OK,
)
def get_autopilot_metrics(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns autopilot evaluation metrics (human approval rate, plan accuracy, scope adherence rate).
    """
    service = AutopilotService(db=db)
    return service.get_evaluation_metrics(repository_id)
