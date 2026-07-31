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


class ReleaseIntelligenceBreakdownResponse(BaseModel):
    repository_id: str
    release_version: str
    overall_readiness_score: float  # Feature 1 (0 -> 100)
    score_breakdown: Dict[
        str, float
    ]  # test_coverage, technical_debt, build_health, architecture_stability, security, dependency_health, performance, code_churn
    deployment_risk: Dict[
        str, Any
    ]  # Feature 2 (failure_prob, rollback_prob, incident_prob, downtime_prob, customer_impact)
    executive_summary: Dict[
        str, Any
    ]  # Feature 3 (release_version, risk, confidence, business_impact, engineering_impact, security_impact, recommended_decision)
    confidence_engine: Dict[str, Any]  # Feature 4 (confidence_pct, why_explanation)
    ai_approval: Dict[
        str, Any
    ]  # Feature 5 (recommendation: Approved / Approved with Monitoring / Delay / Reject)


class DeploymentPlanningResponse(BaseModel):
    repository_id: str
    release_version: str
    canary_rollout_steps: List[float]  # Feature 6 (5% -> 15% -> 40% -> 100%)
    deployment_strategy_recommendation: Dict[
        str, Any
    ]  # Feature 7 (Blue Green / Rolling / Canary / Feature Flag / Shadow Deployment)
    feature_flag_intelligence: Dict[
        str, Any
    ]  # Feature 8 (Enable later / Enable immediately / Partial rollout / Dark launch)
    calendar_optimizer: Dict[
        str, Any
    ]  # Feature 9 (Avoid Holidays, Peak traffic, Maintenance windows, Business events)
    minute_by_minute_timeline: List[
        Dict[str, Any]
    ]  # Feature 10 (Minute-by-minute deployment plan)


class RiskAnalysisResponse(BaseModel):
    repository_id: str
    release_version: str
    api_breaking_changes: Dict[
        str, Any
    ]  # Feature 11 (Removed APIs, Changed contracts, Version conflicts)
    db_migration_analyzer: Dict[
        str, Any
    ]  # Feature 12 (Downtime, Lock duration, Rollback difficulty)
    dependency_risk: Dict[
        str, Any
    ]  # Feature 13 (Package upgrades, Version conflicts, Vulnerabilities)
    infrastructure_readiness: Dict[
        str, Any
    ]  # Feature 14 (Validate Kubernetes, Docker, Redis, Kafka, PostgreSQL, Nginx)
    configuration_drift: Dict[
        str, Any
    ]  # Feature 15 (Compare Dev -> Staging -> Production)


class PerformanceIntelligenceResponse(BaseModel):
    repository_id: str
    release_version: str
    load_prediction_rps: float  # Feature 16
    cpu_estimation_cores: float  # Feature 17
    memory_estimation_gb: float  # Feature 18
    latency_prediction_p95_ms: float  # Feature 19
    cache_readiness_pct: float  # Feature 20
    queue_health_status: str  # Feature 21
    autoscaling_validation_status: str  # Feature 22
    connection_pool_analysis: Dict[str, Any]  # Feature 23
    build_performance_seconds: float  # Feature 24
    startup_time_prediction_seconds: float  # Feature 25
    cold_start_estimation_ms: float  # Feature 26
    network_latency_forecast_ms: float  # Feature 27
    resource_bottlenecks: List[str]  # Feature 28
    performance_regression_risk_pct: float  # Feature 29
    throughput_estimation_rps: float  # Feature 30


class SecurityIntelligenceResponse(BaseModel):
    repository_id: str
    release_version: str
    secret_detection: Dict[str, Any]  # Feature 31
    cve_validation: Dict[str, Any]  # Feature 32
    dependency_vulnerabilities: Dict[str, Any]  # Feature 33
    authentication_review: Dict[str, Any]  # Feature 34
    authorization_review: Dict[str, Any]  # Feature 35
    jwt_validation: Dict[str, Any]  # Feature 36
    oauth_validation: Dict[str, Any]  # Feature 37
    tls_verification: Dict[str, Any]  # Feature 38
    api_security_audit: Dict[str, Any]  # Feature 39
    owasp_validation: Dict[str, Any]  # Feature 40
    compliance_readiness: Dict[str, Any]  # Feature 41
    iam_review: Dict[str, Any]  # Feature 42
    security_regression_detection: Dict[str, Any]  # Feature 43
    encryption_validation: Dict[str, Any]  # Feature 44
    supply_chain_security: Dict[str, Any]  # Feature 45


class BusinessIntelligenceResponse(BaseModel):
    repository_id: str
    release_version: str
    customer_impact_score: float  # Feature 46 (0-100)
    revenue_impact_prediction: Dict[str, Any]  # Feature 47
    sla_risk_pct: float  # Feature 48
    slo_validation_status: str  # Feature 49
    error_budget_impact_pct: float  # Feature 50
    release_roi: float  # Feature 51 (multiplier / ROI ratio)
    business_criticality: str  # Feature 52 (HIGH / CRITICAL)
    engineering_effort_person_days: float  # Feature 53
    team_readiness_score: float  # Feature 54 (0-100)
    stakeholder_notifications: List[Dict[str, Any]]  # Feature 55
    executive_dashboard_summary: Dict[str, Any]  # Feature 56
    incident_cost_estimation_usd: float  # Feature 57
    release_trend_analysis: Dict[str, Any]  # Feature 58
    deployment_history_count: int  # Feature 59
    business_confidence_score: float  # Feature 60 (0-100)


class AIIntelligenceResponse(BaseModel):
    repository_id: str
    release_version: str
    ai_root_cause_prediction: Dict[str, Any]  # Feature 61
    ai_rollback_planner: Dict[str, Any]  # Feature 62
    ai_incident_prediction: Dict[str, Any]  # Feature 63
    ai_deployment_chat: Dict[str, Any]  # Feature 64
    ai_engineering_advisor: Dict[str, Any]  # Feature 65
    ai_executive_assistant: Dict[str, Any]  # Feature 66
    ai_release_timeline: List[Dict[str, Any]]  # Feature 67
    ai_deployment_report_generator: Dict[str, Any]  # Feature 68
    ai_knowledge_graph_integration: Dict[str, Any]  # Feature 69
    global_release_control_center: Dict[str, Any]  # Feature 70


class AIMissionControlResponse(BaseModel):
    mission: str  # e.g., "Deploy Version 4.2"
    readiness_pct: float  # 96%
    risk_level: str  # LOW
    rollback_pct: float  # 1%
    confidence_pct: float  # 98%
    deployment_time_minutes: int  # 8 Minutes
    recommended_strategy: Dict[str, Any]  # Canary 5% -> 20% -> 50% -> 100%
    production_prediction: str  # Healthy
