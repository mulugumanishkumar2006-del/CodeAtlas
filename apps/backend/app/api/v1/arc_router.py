from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.arc import (
    AIIntelligenceResponse,
    AIMissionControlResponse,
    APIBreakingChangeResponse,
    BusinessIntelligenceResponse,
    CanaryRolloutPlanResponse,
    ControlTowerDataResponse,
    DatabaseMigrationValidationResponse,
    DeploymentPlanningResponse,
    DisasterRecoveryReadinessResponse,
    EnvironmentParityResponse,
    ExecutiveSummaryResponse,
    GlobalControlCenterResponse,
    MultiTeamApprovalResponse,
    PerformanceIntelligenceResponse,
    ReleaseIntelligenceBreakdownResponse,
    ReleaseNotesResponse,
    ReleaseValidationRequest,
    ReleaseValidationResponse,
    RiskAnalysisResponse,
    RollbackStrategyPlanResponse,
    SecretsAuditResponse,
    SecurityIntelligenceResponse,
    SLOValidationResponse,
)
from app.services.arc_service import ARCService

router = APIRouter()


@router.post(
    "/arc/validate-release",
    response_model=ReleaseValidationResponse,
    status_code=status.HTTP_200_OK,
)
def validate_release(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 1 & 2: AI Release Readiness Score & Production Risk Predictor
    """
    service = ARCService(db=db)
    res = service.validate_release(
        repository_id=req.repository_id,
        release_version=req.release_version,
        target_environment=req.target_environment,
    )
    return res


@router.get(
    "/arc/readiness/{repository_id}",
    response_model=ReleaseValidationResponse,
    status_code=status.HTTP_200_OK,
)
def get_release_readiness(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    Fetch release readiness score & metrics for a repository.
    """
    service = ARCService(db=db)
    res = service.validate_release(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.post(
    "/arc/detect-breaking-changes",
    response_model=APIBreakingChangeResponse,
    status_code=status.HTTP_200_OK,
)
def detect_breaking_changes(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 4: API Breaking Change Detector
    """
    service = ARCService(db=db)
    res = service.detect_breaking_changes(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.post(
    "/arc/validate-migration",
    response_model=DatabaseMigrationValidationResponse,
    status_code=status.HTTP_200_OK,
)
def validate_migration(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 5: Database Migration Validator
    """
    service = ARCService(db=db)
    res = service.validate_migration(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.post(
    "/arc/multi-team-approvals",
    response_model=MultiTeamApprovalResponse,
    status_code=status.HTTP_200_OK,
)
def get_multi_team_approvals(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 42 & 49: Multi-Team Approval Workflow & Compliance Gate
    """
    service = ARCService(db=db)
    res = service.get_multi_team_approvals(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.get(
    "/arc/global-control-center/{repository_id}",
    response_model=GlobalControlCenterResponse,
    status_code=status.HTTP_200_OK,
)
def get_global_control_center(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 41–60: Global Release Control Center & AI Deployment Advisor
    """
    service = ARCService(db=db)
    res = service.get_global_control_center(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.post(
    "/arc/validate-environment-parity",
    response_model=EnvironmentParityResponse,
    status_code=status.HTTP_200_OK,
)
def validate_environment_parity(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 14–18: Environment Parity & Infrastructure Readiness
    """
    service = ARCService(db=db)
    res = service.validate_environment_parity(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.post(
    "/arc/validate-slo",
    response_model=SLOValidationResponse,
    status_code=status.HTTP_200_OK,
)
def validate_slo_and_error_budget(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 26–30: Error Budget Estimator & SLO Validation
    """
    service = ARCService(db=db)
    res = service.validate_slo_and_error_budget(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.post(
    "/arc/executive-summary",
    response_model=ExecutiveSummaryResponse,
    status_code=status.HTTP_200_OK,
)
def generate_executive_deployment_summary(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 26, 37–40: Incident Prediction & Executive Deployment Summary
    """
    service = ARCService(db=db)
    res = service.generate_executive_deployment_summary(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.post(
    "/arc/dr-readiness",
    response_model=DisasterRecoveryReadinessResponse,
    status_code=status.HTTP_200_OK,
)
def validate_disaster_recovery_and_multi_region(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 31–36: Multi-Region, Cache & DR Readiness Validator
    """
    service = ARCService(db=db)
    res = service.validate_disaster_recovery_and_multi_region(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.post(
    "/arc/release-notes",
    response_model=ReleaseNotesResponse,
    status_code=status.HTTP_200_OK,
)
def generate_release_notes(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 20 & 21: Release Notes Generator & Changelog Intelligence
    """
    service = ARCService(db=db)
    res = service.generate_release_notes(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.post(
    "/arc/secrets-audit",
    response_model=SecretsAuditResponse,
    status_code=status.HTTP_200_OK,
)
def audit_secrets_and_config(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 13, 19 & 25: Secrets Audit & Alert Coverage Analysis
    """
    service = ARCService(db=db)
    res = service.audit_secrets_and_config(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.post(
    "/arc/canary-plan",
    response_model=CanaryRolloutPlanResponse,
    status_code=status.HTTP_200_OK,
)
def generate_canary_plan(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 7: Canary Deployment Planner
    """
    service = ARCService(db=db)
    res = service.generate_canary_plan(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.post(
    "/arc/rollback-strategy",
    response_model=RollbackStrategyPlanResponse,
    status_code=status.HTTP_200_OK,
)
def generate_rollback_strategy(
    req: ReleaseValidationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 8: Rollback Strategy Generator
    """
    service = ARCService(db=db)
    res = service.generate_rollback_strategy(
        repository_id=req.repository_id,
        release_version=req.release_version,
    )
    return res


@router.get(
    "/arc/control-tower/{repository_id}",
    response_model=ControlTowerDataResponse,
    status_code=status.HTTP_200_OK,
)
def get_control_tower_data(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    🌟 Signature Feature: AI Deployment Control Tower Data
    """
    service = ARCService(db=db)
    res = service.get_control_tower_data(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.get(
    "/arc/release-intelligence/{repository_id}",
    response_model=ReleaseIntelligenceBreakdownResponse,
    status_code=status.HTTP_200_OK,
)
def get_release_intelligence(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Enterprise Features 1–5: Release Intelligence (Score 0-100, Risk Predictor, Exec Summary, Confidence Engine, AI Approval)
    """
    service = ARCService(db=db)
    res = service.get_release_intelligence(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.get(
    "/arc/deployment-planning/{repository_id}",
    response_model=DeploymentPlanningResponse,
    status_code=status.HTTP_200_OK,
)
def get_deployment_planning(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Enterprise Features 6–10: Deployment Planning (Canary, Blue Green, Feature Flag, Calendar, Timeline)
    """
    service = ARCService(db=db)
    res = service.get_deployment_planning(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.get(
    "/arc/risk-analysis/{repository_id}",
    response_model=RiskAnalysisResponse,
    status_code=status.HTTP_200_OK,
)
def get_risk_analysis(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Enterprise Features 11–15: Risk Analysis (API Breaking Changes, DB Migration, Dependency Risk, Infra Readiness, Config Drift)
    """
    service = ARCService(db=db)
    res = service.get_risk_analysis(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.get(
    "/arc/performance-intelligence/{repository_id}",
    response_model=PerformanceIntelligenceResponse,
    status_code=status.HTTP_200_OK,
)
def get_performance_intelligence(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Enterprise Features 16–30: Performance Intelligence (Load, CPU, Memory, Latency, Cache, Queue, HPA, Connection Pool, Bottlenecks, Throughput)
    """
    service = ARCService(db=db)
    res = service.get_performance_intelligence(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.get(
    "/arc/security-intelligence/{repository_id}",
    response_model=SecurityIntelligenceResponse,
    status_code=status.HTTP_200_OK,
)
def get_security_intelligence(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Enterprise Features 31–45: Security Intelligence (Secrets, CVE, Dependencies, AuthN/AuthZ, JWT/OAuth, TLS, OWASP, IAM, Supply Chain)
    """
    service = ARCService(db=db)
    res = service.get_security_intelligence(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.get(
    "/arc/business-intelligence/{repository_id}",
    response_model=BusinessIntelligenceResponse,
    status_code=status.HTTP_200_OK,
)
def get_business_intelligence(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Enterprise Features 46–60: Business Intelligence (Impact, Revenue, SLA/SLO, Error Budget, ROI, Criticality, Notifications, Exec Dashboard, Trends)
    """
    service = ARCService(db=db)
    res = service.get_business_intelligence(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.get(
    "/arc/ai-intelligence/{repository_id}",
    response_model=AIIntelligenceResponse,
    status_code=status.HTTP_200_OK,
)
def get_ai_intelligence(
    repository_id: str,
    release_version: str = Query(default="v3.2.0"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Enterprise Features 61–70: AI Intelligence & Global Release Control Center
    """
    service = ARCService(db=db)
    res = service.get_ai_intelligence(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res


@router.get(
    "/arc/mission-control/{repository_id}",
    response_model=AIMissionControlResponse,
    status_code=status.HTTP_200_OK,
)
def get_mission_control(
    repository_id: str,
    release_version: str = Query(default="v4.2"),
    db: Session = Depends(get_db),
):
    """
    🚀 WOW Feature: AI Mission Control (NASA-like deployment dashboard payload)
    """
    service = ARCService(db=db)
    res = service.get_mission_control(
        repository_id=repository_id,
        release_version=release_version,
    )
    return res
