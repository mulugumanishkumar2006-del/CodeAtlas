from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AutopilotStatus(str, Enum):
    DETECTED = "DETECTED"
    INVESTIGATING = "INVESTIGATING"
    PLANNING = "PLANNING"
    SIMULATING = "SIMULATING"
    AWAITING_APPROVAL = "AWAITING_APPROVAL"
    APPROVED = "APPROVED"
    EXECUTING = "EXECUTING"
    TESTING = "TESTING"
    VALIDATING = "VALIDATING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    ROLLED_BACK = "ROLLED_BACK"


class AutopilotTrigger(str, Enum):
    PREDICTION = "PREDICTION"
    RISK = "RISK"
    INVESTIGATION = "INVESTIGATION"
    IMPACT_ANALYSIS = "IMPACT_ANALYSIS"
    ARCHITECTURE_DRIFT = "ARCHITECTURE_DRIFT"
    DEVELOPER_REQUEST = "DEVELOPER_REQUEST"
    PREVENTION_PLAN = "PREVENTION_PLAN"


class ApprovalScope(str, Enum):
    ANALYSIS_ONLY = "ANALYSIS_ONLY"
    CODE_MODIFICATION = "CODE_MODIFICATION"
    TESTING = "TESTING"
    COMMIT = "COMMIT"
    PULL_REQUEST = "PULL_REQUEST"
    MERGE = "MERGE"
    DEPLOYMENT = "DEPLOYMENT"


class TaskRiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AutopilotStepModel(BaseModel):
    step_id: str
    step_number: int
    title: str
    state: AutopilotStatus
    command: Optional[str] = None
    is_approved: bool = False
    output: Optional[str] = None
    duration_ms: float = 0.0


class AutopilotApprovalModel(BaseModel):
    approval_id: str
    scope: ApprovalScope
    approved_by: str = "dev_user"
    approved_at: str
    is_granted: bool = True
    notes: Optional[str] = None


class AutopilotAuditLogModel(BaseModel):
    log_id: str
    user: str
    action: str
    details: str
    timestamp: str


class AutopilotRunModel(BaseModel):
    run_id: str
    repository_id: str
    tenant_id: str = "default"
    user: str = "Staff Software Engineer"
    trigger: AutopilotTrigger
    objective: str
    status: AutopilotStatus = AutopilotStatus.DETECTED
    risk_level: TaskRiskLevel = TaskRiskLevel.MEDIUM
    approved_scopes: List[ApprovalScope] = Field(default_factory=list)
    steps: List[AutopilotStepModel] = Field(default_factory=list)
    approvals: List[AutopilotApprovalModel] = Field(default_factory=list)
    cost_accumulated: float = 0.05
    max_cost_limit: float = 2.00
    created_at: str
    completed_at: Optional[str] = None
    plan_summary: Optional[str] = None
    simulation_summary: Optional[str] = None
    diff_summary: Optional[str] = None
    audit_logs: List[AutopilotAuditLogModel] = Field(default_factory=list)


class AutopilotRunRequest(BaseModel):
    repository_id: str
    objective: str
    trigger: AutopilotTrigger = AutopilotTrigger.DEVELOPER_REQUEST
    initial_policy: ApprovalScope = ApprovalScope.ANALYSIS_ONLY


class AutopilotApprovalRequest(BaseModel):
    run_id: str
    scopes_to_approve: List[ApprovalScope]
    approved_by: str = "Lead Architect"


class AutopilotEvaluationMetrics(BaseModel):
    total_runs: int = 24
    human_approval_rate: float = 0.96
    plan_accuracy: float = 0.98
    scope_adherence_rate: float = 1.00
    unexpected_changes_count: int = 0
    time_saved_hours: float = 18.5
