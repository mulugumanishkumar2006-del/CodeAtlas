from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ReleaseValidationRequest(BaseModel):
    repository_id: str
    release_version: str = "v3.2.0"
    target_environment: str = "production"


class ReleaseChecklistItemSchema(BaseModel):
    id: str
    item_name: str
    category: str
    status: str
    details: Optional[str] = None


class ReleaseValidationResponse(BaseModel):
    id: str
    repository_id: str
    release_version: str
    overall_readiness_score: float
    deployment_risk_level: str
    incident_probability_pct: float
    rollback_probability_pct: float
    hotfix_likelihood_pct: float
    confidence_score_pct: float
    estimated_deployment_time_minutes: int
    status: str
    checklist_items: List[ReleaseChecklistItemSchema] = []
    summary_metrics: Dict[str, Any] = {}


class APIBreakingChangeResponse(BaseModel):
    repository_id: str
    release_version: str
    breaking_changes_found: int
    changes: List[Dict[str, Any]]


class DatabaseMigrationValidationResponse(BaseModel):
    repository_id: str
    release_version: str
    migration_file: str
    predicted_lock_duration_seconds: float
    downtime_risk_level: str
    rollback_complexity: str
    is_approved: bool


class CanaryRolloutPlanResponse(BaseModel):
    repository_id: str
    release_version: str
    initial_traffic_pct: float
    progression_steps: List[float]
    health_metrics_monitored: List[str]
    auto_rollback_threshold_error_pct: float


class RollbackStrategyPlanResponse(BaseModel):
    repository_id: str
    release_version: str
    rollback_sequence: List[str]
    db_recovery_script: str
    cache_restoration_plan: str
    recovery_time_objective_seconds: float


class EnvironmentParityResponse(BaseModel):
    repository_id: str
    release_version: str
    k8s_manifest_status: str
    terraform_audit_status: str
    docker_image_vulnerability_count: int
    environment_diffs: List[Dict[str, Any]]


class SLOValidationResponse(BaseModel):
    repository_id: str
    release_version: str
    error_budget_remaining_pct: float
    slo_burn_rate: float
    sla_violation_risk_pct: float
    distributed_tracing_readiness: bool
    logging_coverage_pct: float


class ReleaseNotesResponse(BaseModel):
    repository_id: str
    release_version: str
    release_notes_markdown: str
    changelog_summary: List[str]
    release_impact_score: float


class SecretsAuditResponse(BaseModel):
    repository_id: str
    release_version: str
    secrets_exposed_count: int
    configuration_valid: bool
    alert_coverage_pct: float


class ExecutiveSummaryResponse(BaseModel):
    repository_id: str
    release_version: str
    engineering_confidence_score: float
    business_impact_level: str
    user_experience_forecast: str
    incident_prediction_pct: float
    executive_summary_text: str


class DisasterRecoveryReadinessResponse(BaseModel):
    repository_id: str
    release_version: str
    multi_region_active_active: bool
    backup_verified: bool
    queue_health_status: str
    cache_readiness_status: str
    recovery_time_objective_seconds: float


class MultiTeamApprovalResponse(BaseModel):
    repository_id: str
    release_version: str
    devops_approved: bool
    security_approved: bool
    architecture_approved: bool
    product_approved: bool
    compliance_passed: bool
    approvals_json: List[Dict[str, Any]]


class GlobalControlCenterResponse(BaseModel):
    repository_id: str
    release_version: str
    release_conflicts_detected: int
    maintenance_window_utc: str
    blue_green_deployment_recommended: bool
    chaos_test_verified: bool
    ai_deployment_advisor_recommendation: str
    global_status: str


class ControlTowerDataResponse(BaseModel):
    release_version: str
    overall_readiness: float
    deployment_risk: str
    incident_probability: float
    rollback_probability: float
    confidence: float
    recommended_actions: List[str]
    estimated_deployment_time: str
    status: str
