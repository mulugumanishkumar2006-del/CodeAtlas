from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.self_healing import (
    CascadingFailureProtectionModel,
    MTTRIntelligenceModel,
    RecoveryPlanSimulationModel,
    RecoveryStrategyModel,
    SelfHealingRunbookModel,
    SelfHealingRunRecordModel,
    SelfHealingScorecardModel,
)
from app.services.self_healing_service import SelfHealingService

router = APIRouter(prefix="/self-healing", tags=["Self-Healing Engineering Platform"])


# ----------------------------------------------------
# Recovery Strategies & Simulations (Phases 1-10)
# ----------------------------------------------------
@router.get(
    "/strategies",
    response_model=List[RecoveryStrategyModel],
    status_code=status.HTTP_200_OK,
)
def get_recovery_strategies(db: Session = Depends(get_db)):
    service = SelfHealingService(db=db)
    return service.get_recovery_strategies()


@router.get(
    "/simulate/{target_service}",
    response_model=RecoveryPlanSimulationModel,
    status_code=status.HTTP_200_OK,
)
def simulate_recovery(
    target_service: str,
    db: Session = Depends(get_db),
):
    service = SelfHealingService(db=db)
    return service.simulate_recovery(target_service)


@router.post(
    "/execute/{target_service}",
    response_model=SelfHealingRunRecordModel,
    status_code=status.HTTP_200_OK,
)
def execute_recovery_run(
    target_service: str,
    db: Session = Depends(get_db),
):
    service = SelfHealingService(db=db)
    return service.execute_recovery_run(target_service)


# ----------------------------------------------------
# MTTR, Runbooks & Protection (Phases 31-48)
# ----------------------------------------------------
@router.get(
    "/mttr/{service_id}",
    response_model=MTTRIntelligenceModel,
    status_code=status.HTTP_200_OK,
)
def get_mttr_intelligence(
    service_id: str,
    db: Session = Depends(get_db),
):
    service = SelfHealingService(db=db)
    return service.get_mttr_intelligence(service_id)


@router.get(
    "/runbooks/{target_service}",
    response_model=List[SelfHealingRunbookModel],
    status_code=status.HTTP_200_OK,
)
def get_runbooks(
    target_service: str,
    db: Session = Depends(get_db),
):
    service = SelfHealingService(db=db)
    return service.get_runbooks(target_service)


@router.get(
    "/cascading-protection/{organization_id}",
    response_model=CascadingFailureProtectionModel,
    status_code=status.HTTP_200_OK,
)
def get_cascading_protection(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = SelfHealingService(db=db)
    return service.get_cascading_protection(organization_id)


# ----------------------------------------------------
# Scorecard (Phase 65)
# ----------------------------------------------------
@router.get(
    "/scorecard/{organization_id}",
    response_model=SelfHealingScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_self_healing_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = SelfHealingService(db=db)
    return service.get_self_healing_scorecard(organization_id)
