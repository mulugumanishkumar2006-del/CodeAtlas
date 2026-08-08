from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.platform import (
    AIModelAbstractionConfig,
    APISecurityAuditModel,
    AuditLogEventModel,
    CLICommandResponse,
    CommandCenterOverviewModel,
    DisasterRecoveryReportModel,
    HybridSearchQueryRequest,
    HybridSearchQueryResponse,
    JobTaskModel,
    NotificationEventModel,
    OnboardingFlowRequest,
    OnboardingFlowResponse,
    OrganizationModel,
    PlatformHealthModel,
    ProductionScorecardModel,
    ProductionUserErrorModel,
    QuotaUsageModel,
    RateLimitStatusModel,
    SLOMetricModel,
    SubscriptionTier,
    UserSessionModel,
    WebhookIngestionRequest,
    WebhookIngestionResponse,
)
from app.services.platform_service import PlatformService

router = APIRouter(prefix="/platform", tags=["Platform & Production Launch"])


# ----------------------------------------------------
# Service Health Probes (Phase 38)
# ----------------------------------------------------
@router.get(
    "/health",
    response_model=PlatformHealthModel,
    status_code=status.HTTP_200_OK,
)
def get_health(db: Session = Depends(get_db)):
    service = PlatformService(db=db)
    return service.get_health()


@router.get("/readiness", status_code=status.HTTP_200_OK)
def get_readiness(db: Session = Depends(get_db)):
    service = PlatformService(db=db)
    return service.get_readiness()


@router.get("/liveness", status_code=status.HTTP_200_OK)
def get_liveness(db: Session = Depends(get_db)):
    service = PlatformService(db=db)
    return service.get_liveness()


# ----------------------------------------------------
# Organizations, Auth & Onboarding (Phases 3-7)
# ----------------------------------------------------
@router.post(
    "/organizations",
    response_model=OrganizationModel,
    status_code=status.HTTP_201_CREATED,
)
def create_organization(
    name: str = Query(...),
    subscription_tier: SubscriptionTier = Query(SubscriptionTier.ENTERPRISE),
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.create_organization(name=name, subscription_tier=subscription_tier)


@router.post(
    "/auth/login",
    response_model=UserSessionModel,
    status_code=status.HTTP_200_OK,
)
def authenticate_user(
    email: str = Query("admin@acme.com"),
    organization_id: str = Query("acme-corp"),
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.authenticate_user(email, organization_id)


@router.post(
    "/onboarding",
    response_model=OnboardingFlowResponse,
    status_code=status.HTTP_200_OK,
)
def run_onboarding(
    req: OnboardingFlowRequest,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.run_onboarding(req)


# ----------------------------------------------------
# Webhooks & Jobs (Phases 8-11)
# ----------------------------------------------------
@router.post(
    "/webhooks/ingest",
    response_model=WebhookIngestionResponse,
    status_code=status.HTTP_200_OK,
)
def ingest_webhook(
    req: WebhookIngestionRequest,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.ingest_webhook(req)


@router.post(
    "/jobs/submit",
    response_model=JobTaskModel,
    status_code=status.HTTP_202_ACCEPTED,
)
def submit_job_task(
    organization_id: str = Query(...),
    repository_id: str = Query(...),
    task_type: str = Query("REPOSITORY_ANALYSIS"),
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.submit_job_task(organization_id, repository_id, task_type)


# ----------------------------------------------------
# Security & Rate Limiting (Phases 18-19)
# ----------------------------------------------------
@router.get(
    "/rate-limit/{organization_id}",
    response_model=RateLimitStatusModel,
    status_code=status.HTTP_200_OK,
)
def get_rate_limit_status(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.get_rate_limit_status(organization_id)


@router.get(
    "/security-audit/{organization_id}",
    response_model=APISecurityAuditModel,
    status_code=status.HTTP_200_OK,
)
def run_api_security_audit(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.run_api_security_audit(organization_id)


# ----------------------------------------------------
# Quotas, AI Models & Search (Phases 20-25)
# ----------------------------------------------------
@router.get(
    "/quotas/{organization_id}",
    response_model=QuotaUsageModel,
    status_code=status.HTTP_200_OK,
)
def get_quotas(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.get_quotas(organization_id)


@router.get(
    "/ai-config",
    response_model=AIModelAbstractionConfig,
    status_code=status.HTTP_200_OK,
)
def get_ai_model_config(db: Session = Depends(get_db)):
    service = PlatformService(db=db)
    return service.get_ai_model_config()


@router.post(
    "/search",
    response_model=HybridSearchQueryResponse,
    status_code=status.HTTP_200_OK,
)
def execute_hybrid_search(
    req: HybridSearchQueryRequest,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.execute_hybrid_search(req)


# ----------------------------------------------------
# Command Center & Notifications (Phases 28-30)
# ----------------------------------------------------
@router.get(
    "/command-center/{organization_id}",
    response_model=CommandCenterOverviewModel,
    status_code=status.HTTP_200_OK,
)
def get_command_center(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.get_command_center(organization_id)


@router.get(
    "/notifications/{organization_id}",
    response_model=List[NotificationEventModel],
    status_code=status.HTTP_200_OK,
)
def get_notifications(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.get_notifications(organization_id)


# ----------------------------------------------------
# Audit, Disaster Recovery & SLO (Phases 31-40)
# ----------------------------------------------------
@router.get(
    "/audit-logs/{organization_id}",
    response_model=List[AuditLogEventModel],
    status_code=status.HTTP_200_OK,
)
def get_audit_logs(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.get_audit_logs(organization_id)


@router.get(
    "/disaster-recovery",
    response_model=DisasterRecoveryReportModel,
    status_code=status.HTTP_200_OK,
)
def get_disaster_recovery_report(db: Session = Depends(get_db)):
    service = PlatformService(db=db)
    return service.get_disaster_recovery_report()


@router.get(
    "/slo",
    response_model=SLOMetricModel,
    status_code=status.HTTP_200_OK,
)
def get_slo_metrics(db: Session = Depends(get_db)):
    service = PlatformService(db=db)
    return service.get_slo_metrics()


# ----------------------------------------------------
# CLI, Error Experience & Validation (Phases 55-66)
# ----------------------------------------------------
@router.post(
    "/cli/execute",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
def execute_cli_command(
    command: str = Query("codeatlas analyze"),
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.execute_cli_command(command)


@router.get(
    "/error/{error_code}",
    response_model=ProductionUserErrorModel,
    status_code=status.HTTP_200_OK,
)
def format_production_error(
    error_code: str,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.format_production_error(error_code)


@router.post(
    "/e2e-validation/{organization_id}",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
def run_end_to_end_scenario_validation(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.run_end_to_end_scenario_validation(organization_id)


@router.get(
    "/scorecard/{organization_id}",
    response_model=ProductionScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_production_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PlatformService(db=db)
    return service.get_production_scorecard(organization_id)
