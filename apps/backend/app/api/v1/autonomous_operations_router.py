from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.autonomous_operations import (
    ApprovalRequestModel,
    AutonomousOperationPlanModel,
    AutonomousOperationsScorecardModel,
    AutonomyPolicyModel,
    EmergencyStopStatusModel,
    PlanSimulationResultModel,
    VerificationResultModel,
)
from app.services.autonomous_operations_service import AutonomousOperationsService

router = APIRouter(prefix="/autonomous-operations", tags=["Autonomous Engineering Operations"])


# ----------------------------------------------------
# Autonomy Engine, Policy & Plans (Phases 1-10)
# ----------------------------------------------------
@router.get(
    "/policies/{organization_id}",
    response_model=AutonomyPolicyModel,
    status_code=status.HTTP_200_OK,
)
def get_autonomy_policy(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousOperationsService(db=db)
    return service.get_autonomy_policy(organization_id)


@router.post(
    "/plans/generate",
    response_model=AutonomousOperationPlanModel,
    status_code=status.HTTP_200_OK,
)
def generate_operation_plan(
    target_service: str = Query("auth_service"),
    objective: str = Query("Apply connection pool fix canary in staging"),
    db: Session = Depends(get_db),
):
    service = AutonomousOperationsService(db=db)
    return service.generate_operation_plan(target_service, objective)


@router.get(
    "/plans/simulate/{plan_id}",
    response_model=PlanSimulationResultModel,
    status_code=status.HTTP_200_OK,
)
def simulate_plan(
    plan_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousOperationsService(db=db)
    return service.simulate_plan(plan_id)


# ----------------------------------------------------
# Human Approval, Verification & Emergency Stop (Phases 8, 20, 46)
# ----------------------------------------------------
@router.post(
    "/approvals/request/{plan_id}",
    response_model=ApprovalRequestModel,
    status_code=status.HTTP_200_OK,
)
def request_approval(
    plan_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousOperationsService(db=db)
    return service.request_approval(plan_id)


@router.get(
    "/verification/{plan_id}",
    response_model=VerificationResultModel,
    status_code=status.HTTP_200_OK,
)
def verify_operation(
    plan_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousOperationsService(db=db)
    return service.verify_operation(plan_id)


@router.get(
    "/emergency-stop/status/{organization_id}",
    response_model=EmergencyStopStatusModel,
    status_code=status.HTTP_200_OK,
)
def get_emergency_stop_status(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousOperationsService(db=db)
    return service.get_emergency_stop_status(organization_id)


@router.post(
    "/emergency-stop/trigger/{organization_id}",
    response_model=EmergencyStopStatusModel,
    status_code=status.HTTP_200_OK,
)
def trigger_emergency_stop(
    organization_id: str,
    triggered_by: str = Query("admin_user"),
    reason: str = Query("Global kill switch invoked by security lead"),
    db: Session = Depends(get_db),
):
    service = AutonomousOperationsService(db=db)
    return service.trigger_emergency_stop(organization_id, triggered_by, reason)


# ----------------------------------------------------
# Scorecard (Phase 66)
# ----------------------------------------------------
@router.get(
    "/scorecard/{organization_id}",
    response_model=AutonomousOperationsScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_autonomous_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousOperationsService(db=db)
    return service.get_autonomous_scorecard(organization_id)
