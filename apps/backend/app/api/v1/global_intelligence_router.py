from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.global_intelligence import (
    AIIncidentCopilotResponseModel,
    ArchitectureDriftAnalysisModel,
    ChangeBlastRadiusModel,
    CloudResourceModel,
    GlobalIntelligenceScorecardModel,
    IncidentReportModel,
    InfrastructureGraphEdgeModel,
    ObservabilityTelemetrySummaryModel,
    ResilienceScorecardModel,
    RuntimeTopologyEdgeModel,
    ServiceHealthSLOModel,
    TimeMachineSnapshotModel,
)
from app.services.global_intelligence_service import GlobalIntelligenceService

router = APIRouter(prefix="/global-intelligence", tags=["Global Engineering Intelligence"])


# ----------------------------------------------------
# Digital Twin, Cloud & Infrastructure (Phases 1-9)
# ----------------------------------------------------
@router.get(
    "/cloud-resources/{organization_id}",
    response_model=List[CloudResourceModel],
    status_code=status.HTTP_200_OK,
)
def get_cloud_resources(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_cloud_resources(organization_id)


@router.get(
    "/infrastructure-graph/{organization_id}",
    response_model=List[InfrastructureGraphEdgeModel],
    status_code=status.HTTP_200_OK,
)
def get_infrastructure_edges(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_infrastructure_edges(organization_id)


@router.get(
    "/runtime-topology/{organization_id}",
    response_model=List[RuntimeTopologyEdgeModel],
    status_code=status.HTTP_200_OK,
)
def get_runtime_topology(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_runtime_topology(organization_id)


@router.get(
    "/architecture-drift/{organization_id}",
    response_model=ArchitectureDriftAnalysisModel,
    status_code=status.HTTP_200_OK,
)
def analyze_architecture_drift(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.analyze_architecture_drift(organization_id)


# ----------------------------------------------------
# Blast Radius & Telemetry (Phases 10-20)
# ----------------------------------------------------
@router.get(
    "/blast-radius/{target_service}",
    response_model=ChangeBlastRadiusModel,
    status_code=status.HTTP_200_OK,
)
def calculate_change_blast_radius(
    target_service: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.calculate_change_blast_radius(target_service)


@router.get(
    "/observability/{service_id}",
    response_model=ObservabilityTelemetrySummaryModel,
    status_code=status.HTTP_200_OK,
)
def get_observability_summary(
    service_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_observability_summary(service_id)


# ----------------------------------------------------
# Incident Intelligence & Copilot (Phases 21-36)
# ----------------------------------------------------
@router.get(
    "/incidents/{incident_id}",
    response_model=IncidentReportModel,
    status_code=status.HTTP_200_OK,
)
def get_incident_report(
    incident_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_incident_report(incident_id)


@router.get(
    "/incident-copilot/{incident_id}",
    response_model=AIIncidentCopilotResponseModel,
    status_code=status.HTTP_200_OK,
)
def get_ai_incident_copilot(
    incident_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_ai_incident_copilot(incident_id)


# ----------------------------------------------------
# SLOs, Time Machine & Resilience (Phases 27-53)
# ----------------------------------------------------
@router.get(
    "/service-slo/{service_id}",
    response_model=ServiceHealthSLOModel,
    status_code=status.HTTP_200_OK,
)
def get_service_health_slo(
    service_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_service_health_slo(service_id)


@router.get(
    "/time-machine/{organization_id}",
    response_model=TimeMachineSnapshotModel,
    status_code=status.HTTP_200_OK,
)
def get_time_machine_snapshot(
    organization_id: str,
    timestamp_iso: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_time_machine_snapshot(organization_id, timestamp_iso)


@router.get(
    "/resilience/{organization_id}",
    response_model=ResilienceScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_resilience_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_resilience_scorecard(organization_id)


# ----------------------------------------------------
# Completion Scorecard (Phase 65)
# ----------------------------------------------------
@router.get(
    "/scorecard/{organization_id}",
    response_model=GlobalIntelligenceScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_global_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalIntelligenceService(db=db)
    return service.get_global_scorecard(organization_id)
