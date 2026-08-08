from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class EnvironmentType(str, Enum):
    LOCAL = "LOCAL"
    DEVELOPMENT = "DEVELOPMENT"
    TEST = "TEST"
    STAGING = "STAGING"
    PRODUCTION = "PRODUCTION"
    CUSTOM = "CUSTOM"


class OperationStatus(str, Enum):
    QUEUED = "QUEUED"
    POLICY_CHECK = "POLICY_CHECK"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    READY = "READY"
    RUNNING = "RUNNING"
    VERIFYING = "VERIFYING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    ROLLED_BACK = "ROLLED_BACK"
    BLOCKED = "BLOCKED"


class DeliveryStrategy(str, Enum):
    CANARY = "CANARY"
    BLUE_GREEN = "BLUE_GREEN"
    ROLLING = "ROLLING"
    PHASED = "PHASED"
    MANUAL = "MANUAL"


class PolicyEvalResult(str, Enum):
    ALLOWED = "ALLOWED"
    REQUIRES_APPROVAL = "REQUIRES_APPROVAL"
    BLOCKED = "BLOCKED"


class ReleaseStatus(str, Enum):
    READY = "READY"
    NOT_READY = "NOT_READY"
    BLOCKED = "BLOCKED"


class DriftType(str, Enum):
    STATIC = "STATIC"
    RUNTIME = "RUNTIME"
    UNKNOWN = "UNKNOWN"


# ----------------------------------------------------
# Phase 1: Domain Models
# ----------------------------------------------------
class ControlPlaneOverviewModel(BaseModel):
    control_plane_id: str
    organization_id: str
    status: str = "ACTIVE"
    environments_count: int = 5
    active_deployments_count: int = 2
    pending_approvals_count: int = 1
    system_health: str = "100% HEALTHY"


class EnvironmentPolicyModel(BaseModel):
    policy_id: str
    environment_name: str
    required_approvals: List[str] = Field(default_factory=list)
    allowed_time_windows: List[str] = Field(default_factory=list)
    allowed_roles: List[str] = Field(default_factory=list)
    blocked_operations: List[str] = Field(default_factory=list)


# ----------------------------------------------------
# Phase 2 & 3: Environment Model & Environment Graph
# ----------------------------------------------------
class EnvironmentModel(BaseModel):
    env_id: str
    organization_id: str
    name: str
    type: EnvironmentType
    provider: str = "AWS EKS / K8s"
    region: str = "us-east-1"
    access_policy: str = "ROLE_BASED_RBAC"
    deployment_policy: str = "GUARDED_CANARY"
    current_version: str = "v1.2.0"
    risk_level: str = "LOW"
    allowed_operations: List[str] = Field(default_factory=list)
    status: str = "HEALTHY"


class EnvironmentGraphNode(BaseModel):
    node_id: str
    node_type: str  # REPOSITORY, BRANCH, BUILD, ARTIFACT, DEPLOYMENT, ENVIRONMENT, SERVICE, INFRASTRUCTURE, OBSERVABILITY, TEAM
    name: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class EnvironmentGraphLink(BaseModel):
    source: str
    target: str
    relation: str


class EnvironmentGraphModel(BaseModel):
    organization_id: str
    nodes: List[EnvironmentGraphNode] = Field(default_factory=list)
    links: List[EnvironmentGraphLink] = Field(default_factory=list)
    what_runs_where: Dict[str, str] = Field(default_factory=dict)
    owners: Dict[str, str] = Field(default_factory=dict)
    recent_changes: List[str] = Field(default_factory=list)


# ----------------------------------------------------
# Phase 4: Release Model
# ----------------------------------------------------
class ReleaseCandidateModel(BaseModel):
    release_id: str
    organization_id: str
    repository_id: str
    version: str = "v1.3.0-rc1"
    commit_hash: str = "a9b3c4d"
    branch: str = "main"
    build_status: str = "SUCCESS"
    security_status: str = "PASS"
    architecture_status: str = "PASS"
    tests_passed: int = 142
    tests_failed: int = 0
    approvals_obtained: List[str] = Field(default_factory=list)
    release_readiness: ReleaseStatus = ReleaseStatus.READY


# ----------------------------------------------------
# Phase 5: Unified Change Request
# ----------------------------------------------------
class ChangeRequestModel(BaseModel):
    cr_id: str
    organization_id: str
    repository_id: str
    objective: str
    commit_hash: str
    files_changed: List[str] = Field(default_factory=list)
    impact_radius: str = "MEDIUM"
    risk_score: float = 18.5
    architecture_impact: str = "MODERATE_COUPLING"
    security_clearance: str = "PASSED"
    tests_summary: str = "100% PASSED"
    simulation_verified: bool = True
    target_environment: str = "STAGING"
    rollback_ready: bool = True
    owner: str = "lead_dev@acme.com"
    approvals: List[str] = Field(default_factory=list)


# ----------------------------------------------------
# Phase 6 & 7: Policy Engine & Evaluation
# ----------------------------------------------------
class PolicyEvalRequest(BaseModel):
    organization_id: str
    user_or_agent: str
    user_role: str = "DEVELOPER"
    action: str = "DEPLOY"
    repository_id: str
    target_environment: str
    risk_score: float = 20.0
    time_window_utc: str = "14:00"


class PolicyEvalResponse(BaseModel):
    evaluated_at: str
    who: str
    what: str
    where: str
    when: str
    why: str
    risk_score: float
    result: PolicyEvalResult
    reason: str
    required_approvals: List[str] = Field(default_factory=list)


# ----------------------------------------------------
# Phase 8 & 9: Deployment Planning & Preview
# ----------------------------------------------------
class DeploymentPlanModel(BaseModel):
    plan_id: str
    organization_id: str
    repository_id: str
    target_environment: str = "STAGING"
    target_version: str = "v1.3.0-rc1"
    strategy: DeliveryStrategy = DeliveryStrategy.CANARY
    artifact_id: str = "art_auth_v1.3.0-rc1"
    dependencies: List[str] = Field(default_factory=list)
    pre_checks: List[str] = Field(default_factory=list)
    post_checks: List[str] = Field(default_factory=list)
    risk_score: float = 24.0
    policy_result: PolicyEvalResult = PolicyEvalResult.ALLOWED
    rollback_plan: str = "Canary Traffic Shift Fallback & Git Worktree Clean"


class DeploymentPreviewModel(BaseModel):
    current_version: str
    target_version: str
    changes_count: int
    affected_services: List[str]
    dependencies: List[str]
    risk_assessment: str
    simulation_outcome: str
    validation_status: str
    rollback_ready: bool
    required_approvals: List[str]


# ----------------------------------------------------
# Phase 10 - 12: CI/CD, Pipeline & Artifact Intelligence
# ----------------------------------------------------
class PipelineModel(BaseModel):
    pipeline_id: str
    repository_id: str
    provider: str = "GitHub Actions"
    status: str = "HEALTHY"


class PipelineRunModel(BaseModel):
    run_id: str
    pipeline_id: str
    stage: str = "BUILD_AND_TEST"
    step: str = "INTEGRATION_TESTS"
    status: str = "SUCCESS"
    duration_seconds: int = 145
    logs_ref: str = "s3://logs/run_892.log"
    artifact_id: str = "art_auth_v1.3.0"
    commit_hash: str = "a9b3c4d"
    target_environment: str = "STAGING"


class ArtifactIntelligenceModel(BaseModel):
    artifact_id: str
    version: str
    commit_hash: str
    build_id: str
    dependencies: List[str]
    security_evidence: str = "0 VULNERABILITIES"
    test_evidence: str = "100% UNIT/INTEGRATION PASS"
    deployment_history_count: int = 3
    environments_used: List[str]


# ----------------------------------------------------
# Phase 13 - 16: Deployment Risk & Guard Gate
# ----------------------------------------------------
class DeploymentRiskModel(BaseModel):
    change_size: float = 12.0
    blast_radius: float = 25.0
    architecture_impact: float = 10.0
    dependency_impact: float = 15.0
    security_score: float = 0.0
    historical_failures: float = 5.0
    environment_criticality: float = 80.0
    overall_risk_score: float = 24.5
    risk_category: str = "MEDIUM"


class DeploymentGuardGateResult(BaseModel):
    risk_level: str = "HIGH"
    tests_status: str = "PASS"
    security_status: str = "PASS"
    architecture_status: str = "PASS"
    rollback_status: str = "READY"
    approval_status: str = "REQUIRED"
    guard_decision: str = "BLOCKED — APPROVAL REQUIRED"


# ----------------------------------------------------
# Phase 17 - 18: Approval Workflow & Chain
# ----------------------------------------------------
class ApprovalItemModel(BaseModel):
    approval_id: str
    role: str  # DEVELOPER, REVIEWER, ARCHITECT, SECURITY, RELEASE, PRODUCTION
    approver: str
    status: str  # PENDING, APPROVED, REJECTED
    timestamp: str
    comments: Optional[str] = None


class ApprovalChainModel(BaseModel):
    request_id: str
    review_status: str
    approval_status: str
    execution_status: str
    verification_status: str
    steps: List[ApprovalItemModel] = Field(default_factory=list)


# ----------------------------------------------------
# Phase 19 - 21: Execution, Verification & Post-Deploy Intelligence
# ----------------------------------------------------
class DeploymentExecutionModel(BaseModel):
    execution_id: str
    plan_id: str
    triggered_system: str = "AWS EKS / GitOps ArgoCD"
    start_time: str
    progress_percentage: int = 100
    status: str = "COMPLETED"
    logs_ref: str = "argocd://sync/job-901"
    target_version: str = "v1.3.0-rc1"
    target_environment: str = "STAGING"


class VerificationModel(BaseModel):
    deployment_id: str
    health_check: str = "PASS (100% PROBES OK)"
    service_availability: str = "99.99%"
    architecture_state: str = "STABLE"
    dependency_state: str = "NO DRIFT"
    security_runtime: str = "NO THREATS"
    performance_latency_ms: float = 42.5
    overall_verification: str = "PASSED"


class PostDeploymentComparisonModel(BaseModel):
    before_version: str
    after_version: str
    risk_delta: float = -5.2
    architecture_coupling_change: str = "NO CHANGE"
    performance_latency_delta_ms: float = -3.1
    error_rate_delta: str = "0.00%"
    outcome_summary: str = "Deployment succeeded with improved latency and 0 error signals."


# ----------------------------------------------------
# Phase 22 - 23: Rollback Control & Incident Link
# ----------------------------------------------------
class RollbackPlanModel(BaseModel):
    rollback_id: str
    target_environment: str
    rollback_version: str = "v1.2.0"
    plan_steps: List[str] = Field(default_factory=list)
    rollback_approval_status: str = "APPROVED"
    execution_result: str = "SUCCESS"
    verification_outcome: str = "SYSTEM RESTORED TO v1.2.0"


class IncidentLinkModel(BaseModel):
    incident_id: str
    deployment_id: str
    commit_hash: str
    service_name: str
    environment: str
    correlation_confidence: float = 0.88
    causality_proven: bool = False
    evidence_timeline: List[str] = Field(default_factory=list)


# ----------------------------------------------------
# Phase 24 - 25: Release Intelligence & Timeline
# ----------------------------------------------------
class ReleaseIntelligenceView(BaseModel):
    version: str
    changes_count: int
    risks_summary: str
    tests_summary: str
    security_summary: str
    architecture_summary: str
    approvals_summary: str
    deployments_summary: str
    outcome: str = "SUCCESSFULLY DEPLOYED TO STAGING"


class TimelineEventModel(BaseModel):
    event_id: str
    timestamp: str
    event_type: str  # COMMIT, PR, BUILD, TEST, RELEASE, DEPLOYMENT, RISK, INCIDENT, ROLLBACK, DECISION, OUTCOME
    actor: str
    description: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


# ----------------------------------------------------
# Phase 26 - 27: Agent Control & Operation Model
# ----------------------------------------------------
class AgentOperationModel(BaseModel):
    agent_id: str
    task_id: str
    requested_action: str
    target_environment: str
    policy_evaluation: PolicyEvalResult
    permission_granted: bool
    risk_level: str
    approval_id: Optional[str] = None
    execution_result: str = "COMPLETED"
    verification: str = "PASSED"


# ----------------------------------------------------
# Phase 28 - 30: Operation Queue, Concurrency & Scheduling
# ----------------------------------------------------
class OperationQueueItemModel(BaseModel):
    operation_id: str
    organization_id: str
    agent_or_user: str
    action: str
    target_environment: str
    status: OperationStatus = OperationStatus.RUNNING
    queue_position: int = 1


class ConcurrencyLockModel(BaseModel):
    lock_id: str
    resource_key: str  # e.g., service:auth_service:staging
    acquired_by: str
    priority: int = 10
    expires_at: str


class SchedulingWindowModel(BaseModel):
    schedule_id: str
    mode: str  # IMMEDIATE, SCHEDULED, MAINTENANCE_WINDOW, APPROVAL_WINDOW
    scheduled_time_utc: str
    in_maintenance_window: bool = True


# ----------------------------------------------------
# Phase 31 - 34: Observability, History & Drift
# ----------------------------------------------------
class ObservabilityTelemetryModel(BaseModel):
    service_name: str
    environment: str
    logs_summary: str = "NORMAL"
    metrics_p95_latency_ms: float = 38.0
    error_rate: float = 0.001
    health_status: str = "HEALTHY"


class ChangeCorrelationModel(BaseModel):
    commit_hash: str
    build_id: str
    release_version: str
    deployment_id: str
    runtime_signal: str
    incident_link: Optional[str] = None
    correlation_statement: str


class DeploymentHistoryItem(BaseModel):
    deployment_id: str
    version: str
    environment: str
    deployed_at: str
    status: str
    risk_score: float
    incidents_count: int = 0


class EnvironmentDriftModel(BaseModel):
    environment_name: str
    service_name: str
    expected_version: str
    observed_version: str
    drift_type: DriftType = DriftType.RUNTIME
    risk_level: str = "MEDIUM"


# ----------------------------------------------------
# Phase 35: Operations AI Assistant
# ----------------------------------------------------
class OperationsAIRequest(BaseModel):
    organization_id: str
    question: str


class OperationsAIResponse(BaseModel):
    organization_id: str
    question: str
    answer: str
    evidence_citations: List[str] = Field(default_factory=list)
    confidence: float = 0.96
    unknowns: List[str] = Field(default_factory=list)
    recommended_action: str


# ----------------------------------------------------
# Phase 36 - 38: Readiness, Safety & Audit
# ----------------------------------------------------
class ReleaseReadinessAssessment(BaseModel):
    release_id: str
    version: str
    tests_check: str = "PASS"
    build_check: str = "PASS"
    security_check: str = "PASS"
    architecture_check: str = "PASS"
    dependencies_check: str = "PASS"
    simulation_check: str = "PASS"
    approvals_check: str = "PASS"
    rollback_check: str = "PASS"
    observability_check: str = "PASS"
    overall_status: ReleaseStatus = ReleaseStatus.READY


class AuditLogModel(BaseModel):
    audit_id: str
    organization_id: str
    actor: str
    action: str
    target: str
    environment: str
    timestamp: str
    result: str
    verification: str


# ----------------------------------------------------
# Phase 39 - 42: Security, Failure Recovery & Telemetry
# ----------------------------------------------------
class SecurityCheckResultModel(BaseModel):
    credential_leakage_check: str = "SECURE"
    unauthorized_deployment_check: str = "BLOCKED"
    privilege_escalation_check: str = "PREVENTED"
    agent_abuse_check: str = "MONITORED"
    webhook_forgery_check: str = "VALIDATED_HMAC"
    replay_attack_check: str = "NONCE_VERIFIED"
    cross_tenant_check: str = "ISOLATED"
    environment_escalation_check: str = "RESTRICTED"
    secret_exposure_check: str = "CLEAN"
    command_injection_check: str = "SANITIZED"
    passed: bool = True


class FailureRecoveryReportModel(BaseModel):
    failure_type: str  # PIPELINE, DEPLOYMENT, VERIFICATION, WEBHOOK, OUTAGE, TIMEOUT, ROLLBACK
    detected_at: str
    recovery_action: str
    recovered_successfully: bool
    status_summary: str


class ControlPlaneObservabilityModel(BaseModel):
    queue_depth: int = 1
    operation_latency_ms: float = 14.2
    policy_failures_count: int = 0
    approval_latency_min: float = 12.5
    deployment_latency_sec: float = 180.0
    verification_latency_sec: float = 15.0
    failure_rate: float = 0.0
    rollback_rate: float = 0.0
    external_integrations_health: str = "ALL SYSTEMS GO"
