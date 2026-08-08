from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.autonomous_cloud import (
    CommandCenterOverviewModel,
    DigitalTwinTopologyModel,
    IncidentPostmortemModel,
    IngestionPipelineStatusModel,
    ProductionReadinessScorecardModel,
    SaaSBillingLedgerModel,
    WorkflowExecutionResultModel,
)
from app.services.autonomous_cloud_service import AutonomousCloudService

router = APIRouter(prefix="/autonomous-cloud", tags=["Autonomous Engineering Cloud"])


# ----------------------------------------------------
# Command Center & Digital Twin (Phases 1-15)
# ----------------------------------------------------
@router.get(
    "/command-center/{organization_id}",
    response_model=CommandCenterOverviewModel,
    status_code=status.HTTP_200_OK,
)
def get_command_center_overview(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousCloudService(db=db)
    return service.get_command_center_overview(organization_id)


@router.get(
    "/digital-twin/{organization_id}",
    response_model=DigitalTwinTopologyModel,
    status_code=status.HTTP_200_OK,
)
def get_digital_twin_topology(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousCloudService(db=db)
    return service.get_digital_twin_topology(organization_id)


# ----------------------------------------------------
# Workflow Execution & Ingestion (Phases 9-11, 113)
# ----------------------------------------------------
@router.post(
    "/workflow/execute",
    response_model=WorkflowExecutionResultModel,
    status_code=status.HTTP_200_OK,
)
def execute_end_to_end_workflow(
    organization_id: str = Query("acme-corp"),
    repository_id: str = Query("repo_auth_01"),
    db: Session = Depends(get_db),
):
    service = AutonomousCloudService(db=db)
    return service.execute_end_to_end_workflow(organization_id, repository_id)


@router.get(
    "/ingestion-status/{repository_id}",
    response_model=IngestionPipelineStatusModel,
    status_code=status.HTTP_200_OK,
)
def get_ingestion_status(
    repository_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousCloudService(db=db)
    return service.get_ingestion_status(repository_id)


# ----------------------------------------------------
# Billing Metering & Postmortems (Phases 48, 69-72)
# ----------------------------------------------------
@router.get(
    "/billing/{organization_id}",
    response_model=SaaSBillingLedgerModel,
    status_code=status.HTTP_200_OK,
)
def get_billing_ledger(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousCloudService(db=db)
    return service.get_billing_ledger(organization_id)


@router.get(
    "/postmortem/{organization_id}/{incident_id}",
    response_model=IncidentPostmortemModel,
    status_code=status.HTTP_200_OK,
)
def get_incident_postmortem(
    organization_id: str,
    incident_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousCloudService(db=db)
    return service.get_incident_postmortem(organization_id, incident_id)


# ----------------------------------------------------
# Scorecard (Phase 112)
# ----------------------------------------------------
@router.get(
    "/scorecard/{organization_id}",
    response_model=ProductionReadinessScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_production_readiness_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = AutonomousCloudService(db=db)
    return service.get_production_readiness_scorecard(organization_id)
