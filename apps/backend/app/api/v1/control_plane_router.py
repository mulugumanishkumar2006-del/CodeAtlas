from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.control_plane import (
    AgentOperationModel,
    ApprovalChainModel,
    ArtifactIntelligenceModel,
    AuditLogModel,
    ChangeCorrelationModel,
    ChangeRequestModel,
    ConcurrencyLockModel,
    ControlPlaneObservabilityModel,
    ControlPlaneOverviewModel,
    DeliveryStrategy,
    DeploymentExecutionModel,
    DeploymentGuardGateResult,
    DeploymentHistoryItem,
    DeploymentPlanModel,
    DeploymentPreviewModel,
    DeploymentRiskModel,
    EnvironmentDriftModel,
    EnvironmentGraphModel,
    EnvironmentModel,
    FailureRecoveryReportModel,
    IncidentLinkModel,
    ObservabilityTelemetryModel,
    OperationQueueItemModel,
    OperationsAIRequest,
    OperationsAIResponse,
    PolicyEvalRequest,
    PolicyEvalResponse,
    PipelineRunModel,
    ReleaseCandidateModel,
    ReleaseIntelligenceView,
    ReleaseReadinessAssessment,
    RollbackPlanModel,
    SchedulingWindowModel,
    SecurityCheckResultModel,
    TimelineEventModel,
    VerificationModel,
)
from app.services.control_plane_service import ControlPlaneService

router = APIRouter(prefix="/control-plane", tags=["Engineering Control Plane"])


# ----------------------------------------------------
# Overview & Environments (Phases 1-3)
# ----------------------------------------------------
@router.get(
    "/overview/{organization_id}",
    response_model=ControlPlaneOverviewModel,
    status_code=status.HTTP_200_OK,
)
def get_control_plane_overview(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_control_plane_overview(organization_id)


@router.get(
    "/environments/{organization_id}",
    response_model=List[EnvironmentModel],
    status_code=status.HTTP_200_OK,
)
def get_environments(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_environments(organization_id)


@router.get(
    "/environment-graph/{organization_id}",
    response_model=EnvironmentGraphModel,
    status_code=status.HTTP_200_OK,
)
def get_environment_graph(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_environment_graph(organization_id)


# ----------------------------------------------------
# Releases & Change Requests (Phases 4-5)
# ----------------------------------------------------
@router.get(
    "/releases/{organization_id}/{repository_id}",
    response_model=List[ReleaseCandidateModel],
    status_code=status.HTTP_200_OK,
)
def get_release_candidates(
    organization_id: str,
    repository_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_release_candidates(organization_id, repository_id)


@router.post(
    "/change-request",
    response_model=ChangeRequestModel,
    status_code=status.HTTP_201_CREATED,
)
def create_change_request(
    cr_data: Dict[str, Any],
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.create_change_request(cr_data)


# ----------------------------------------------------
# Policy Evaluation (Phases 6-7)
# ----------------------------------------------------
@router.post(
    "/policy/evaluate",
    response_model=PolicyEvalResponse,
    status_code=status.HTTP_200_OK,
)
def evaluate_policy(
    req: PolicyEvalRequest,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.evaluate_policy(req)


# ----------------------------------------------------
# Deployment Planning, Preview & Guard (Phases 8-9, 16)
# ----------------------------------------------------
@router.post(
    "/deployments/plan",
    response_model=DeploymentPlanModel,
    status_code=status.HTTP_201_CREATED,
)
def create_deployment_plan(
    organization_id: str = Query(...),
    repository_id: str = Query(...),
    target_environment: str = Query("STAGING"),
    target_version: str = Query("v1.3.0-rc1"),
    strategy: DeliveryStrategy = Query(DeliveryStrategy.CANARY),
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.create_deployment_plan(
        organization_id=organization_id,
        repository_id=repository_id,
        target_environment=target_environment,
        target_version=target_version,
        strategy=strategy,
    )


@router.get(
    "/deployments/preview",
    response_model=DeploymentPreviewModel,
    status_code=status.HTTP_200_OK,
)
def get_deployment_preview(
    organization_id: str = Query(...),
    repository_id: str = Query(...),
    target_environment: str = Query("STAGING"),
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_deployment_preview(organization_id, repository_id, target_environment)


@router.post(
    "/deployments/guard",
    response_model=DeploymentGuardGateResult,
    status_code=status.HTTP_200_OK,
)
def evaluate_deployment_guard(
    risk_score: float = Query(24.0),
    tests_pass: bool = Query(True),
    security_pass: bool = Query(True),
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.evaluate_deployment_guard(risk_score, tests_pass, security_pass)


# ----------------------------------------------------
# CI/CD & Artifact Intelligence (Phases 10-12)
# ----------------------------------------------------
@router.get(
    "/pipelines/{repository_id}",
    response_model=List[PipelineRunModel],
    status_code=status.HTTP_200_OK,
)
def get_pipeline_runs(
    repository_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_pipeline_runs(repository_id)


@router.get(
    "/artifacts/{artifact_id}",
    response_model=ArtifactIntelligenceModel,
    status_code=status.HTTP_200_OK,
)
def get_artifact_intelligence(
    artifact_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_artifact_intelligence(artifact_id)


# ----------------------------------------------------
# Deployment Risk, Execution & Verification (Phases 13-15, 19-21)
# ----------------------------------------------------
@router.get(
    "/deployments/risk/{repository_id}",
    response_model=DeploymentRiskModel,
    status_code=status.HTTP_200_OK,
)
def evaluate_deployment_risk(
    repository_id: str,
    target_environment: str = Query("STAGING"),
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.evaluate_deployment_risk(repository_id, target_environment)


@router.post(
    "/deployments/execute/{plan_id}",
    response_model=DeploymentExecutionModel,
    status_code=status.HTTP_200_OK,
)
def execute_deployment(
    plan_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.execute_deployment(plan_id)


@router.get(
    "/deployments/verify/{deployment_id}",
    response_model=VerificationModel,
    status_code=status.HTTP_200_OK,
)
def verify_deployment(
    deployment_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.verify_deployment(deployment_id)


# ----------------------------------------------------
# Approvals & Rollback (Phases 17-18, 22-23)
# ----------------------------------------------------
@router.get(
    "/approvals/{request_id}",
    response_model=ApprovalChainModel,
    status_code=status.HTTP_200_OK,
)
def get_approval_chain(
    request_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_approval_chain(request_id)


@router.post(
    "/deployments/rollback/{deployment_id}",
    response_model=RollbackPlanModel,
    status_code=status.HTTP_200_OK,
)
def execute_rollback(
    deployment_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.execute_rollback(deployment_id)


@router.post(
    "/incidents/link",
    response_model=IncidentLinkModel,
    status_code=status.HTTP_200_OK,
)
def link_deployment_incident(
    deployment_id: str = Query(...),
    incident_id: str = Query(...),
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.link_deployment_incident(deployment_id, incident_id)


# ----------------------------------------------------
# Operations Intelligence & Queue (Phases 24-30)
# ----------------------------------------------------
@router.get(
    "/release-intelligence/{version}",
    response_model=ReleaseIntelligenceView,
    status_code=status.HTTP_200_OK,
)
def get_release_intelligence(
    version: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_release_intelligence(version)


@router.get(
    "/timeline/{organization_id}",
    response_model=List[TimelineEventModel],
    status_code=status.HTTP_200_OK,
)
def get_operations_timeline(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_operations_timeline(organization_id)


@router.post(
    "/agent/operation",
    response_model=AgentOperationModel,
    status_code=status.HTTP_200_OK,
)
def execute_agent_operation(
    agent_id: str = Query(...),
    requested_action: str = Query(...),
    target_environment: str = Query("STAGING"),
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.execute_agent_operation(agent_id, requested_action, target_environment)


@router.get(
    "/queue/{organization_id}",
    response_model=List[OperationQueueItemModel],
    status_code=status.HTTP_200_OK,
)
def get_operations_queue(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_operations_queue(organization_id)


# ----------------------------------------------------
# Observability & Drift (Phases 31-34)
# ----------------------------------------------------
@router.get(
    "/drift/{organization_id}",
    response_model=List[EnvironmentDriftModel],
    status_code=status.HTTP_200_OK,
)
def get_environment_drift(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_environment_drift(organization_id)


@router.get(
    "/history/{repository_id}",
    response_model=List[DeploymentHistoryItem],
    status_code=status.HTTP_200_OK,
)
def get_deployment_history(
    repository_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_deployment_history(repository_id)


# ----------------------------------------------------
# Operations AI & Readiness (Phases 35-37)
# ----------------------------------------------------
@router.post(
    "/ai-query",
    response_model=OperationsAIResponse,
    status_code=status.HTTP_200_OK,
)
def query_operations_ai(
    req: OperationsAIRequest,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.query_operations_ai(req)


@router.get(
    "/readiness/{release_id}",
    response_model=ReleaseReadinessAssessment,
    status_code=status.HTTP_200_OK,
)
def assess_release_readiness(
    release_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.assess_release_readiness(release_id)


# ----------------------------------------------------
# Audit, Security & Observability (Phases 38-43)
# ----------------------------------------------------
@router.get(
    "/audit/{organization_id}",
    response_model=List[AuditLogModel],
    status_code=status.HTTP_200_OK,
)
def get_audit_logs(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_audit_logs(organization_id)


@router.get(
    "/security-check/{organization_id}",
    response_model=SecurityCheckResultModel,
    status_code=status.HTTP_200_OK,
)
def run_security_check(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.run_security_check(organization_id)


@router.get(
    "/observability/{organization_id}",
    response_model=ControlPlaneObservabilityModel,
    status_code=status.HTTP_200_OK,
)
def get_control_plane_observability(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.get_control_plane_observability(organization_id)


@router.post(
    "/synthetic-env/{organization_id}",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
def generate_synthetic_test_environment(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = ControlPlaneService(db=db)
    return service.generate_synthetic_test_environment(organization_id)
