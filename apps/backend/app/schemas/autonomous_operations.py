from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class AutonomyLevel(int, Enum):
    LEVEL_0_OBSERVE = 0
    LEVEL_1_RECOMMEND = 1
    LEVEL_2_ASSIST = 2
    LEVEL_3_APPROVAL_REQUIRED = 3
    LEVEL_4_CONTROLLED_AUTONOMY = 4
    LEVEL_5_AUTONOMOUS = 5


class ActionRiskClassification(str, Enum):
    READ_ONLY = "READ_ONLY"
    LOW_RISK = "LOW_RISK"
    MEDIUM_RISK = "MEDIUM_RISK"
    HIGH_RISK = "HIGH_RISK"
    CRITICAL = "CRITICAL"


class OperationStatus(str, Enum):
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    SIMULATED = "SIMULATED"
    EXECUTING = "EXECUTING"
    VERIFIED = "VERIFIED"
    ROLLED_BACK = "ROLLED_BACK"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


# ----------------------------------------------------
# Schema Models
# ----------------------------------------------------
class AutonomyPolicyModel(BaseModel):
    policy_id: str
    organization_id: str
    max_allowed_autonomy_level: AutonomyLevel = AutonomyLevel.LEVEL_3_APPROVAL_REQUIRED
    allowed_actions: List[str] = Field(default_factory=lambda: ["read_logs", "create_ticket", "restart_worker", "deploy_canary_staging"])
    blocked_actions: List[str] = Field(default_factory=lambda: ["drop_database", "delete_production_cluster", "modify_iam_root"])
    require_approval_risk_level: ActionRiskClassification = ActionRiskClassification.HIGH_RISK
    max_execution_budget_usd: float = 50.00


class OperationPlanStepModel(BaseModel):
    step_id: str
    action_name: str
    tool_required: str
    risk_classification: ActionRiskClassification = ActionRiskClassification.LOW_RISK
    input_parameters: Dict[str, Any] = Field(default_factory=dict)
    expected_output: str


class AutonomousOperationPlanModel(BaseModel):
    plan_id: str
    organization_id: str
    objective: str
    target_service: str
    risk_classification: ActionRiskClassification = ActionRiskClassification.MEDIUM_RISK
    autonomy_level_required: AutonomyLevel = AutonomyLevel.LEVEL_3_APPROVAL_REQUIRED
    status: OperationStatus = OperationStatus.PENDING_APPROVAL
    steps: List[OperationPlanStepModel] = Field(default_factory=list)
    rollback_strategy: str = "Perform automated canary rollback to previous stable commit v2.1.3."
    verification_criteria: str = "Verify latency < 50ms and error budget burn rate = 0."
    evidence_citations: List[str] = Field(default_factory=list)


class PlanSimulationResultModel(BaseModel):
    plan_id: str
    simulated_blast_radius_services: List[str] = Field(default_factory=list)
    affected_infrastructure: List[str] = Field(default_factory=list)
    projected_risk_score: float = 12.0
    rollback_capability_verified: bool = True
    safety_assessment: str = "Plan passes sandbox simulation; clear for execution subject to policy."


class ApprovalRequestModel(BaseModel):
    approval_id: str
    plan_id: str
    requester_agent: str = "Deployment Agent"
    required_role: str = "Platform Lead"
    risk_classification: ActionRiskClassification = ActionRiskClassification.HIGH_RISK
    status: str = "PENDING"
    decision_reason: Optional[str] = None


class VerificationResultModel(BaseModel):
    plan_id: str
    verification_passed: bool = True
    metric_delta_latency_ms: float = -12.4
    error_rate_delta: float = 0.00
    verification_status: str = "VERIFIED_HEALTHY"


class EmergencyStopStatusModel(BaseModel):
    organization_id: str
    is_emergency_stop_active: bool = False
    triggered_by: Optional[str] = None
    reason: Optional[str] = None
    timestamp: Optional[str] = None


class AutonomousOperationsScorecardModel(BaseModel):
    organization_id: str
    autonomy_engine_score: float = 99.0
    autonomy_levels_policy_score: float = 99.5
    plan_simulation_score: float = 98.5
    approval_chain_score: float = 100.0
    controlled_execution_sandbox_score: float = 99.0
    verification_rollback_score: float = 99.5
    multi_agent_orchestration_score: float = 98.0
    emergency_stop_kill_switch_score: float = 100.0
    autonomous_status: str = "CODEATLAS V2.6 AUTONOMOUS ENGINEERING READY"
