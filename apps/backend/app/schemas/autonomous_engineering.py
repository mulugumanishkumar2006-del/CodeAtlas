from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AutonomyLevel(int, Enum):
    LEVEL_0_OBSERVE = 0
    LEVEL_1_RECOMMEND = 1
    LEVEL_2_PLAN = 2
    LEVEL_3_PREPARE = 3
    LEVEL_4_HUMAN_APPROVAL = 4
    LEVEL_5_CONTROLLED_EXECUTION = 5
    LEVEL_6_POLICY_BOUNDED = 6


class AgentState(str, Enum):
    CREATED = "CREATED"
    INVESTIGATING = "INVESTIGATING"
    PLANNING = "PLANNING"
    SIMULATING = "SIMULATING"
    PREPARING = "PREPARING"
    WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL"
    EXECUTING = "EXECUTING"
    VALIDATING = "VALIDATING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    ROLLED_BACK = "ROLLED_BACK"
    BLOCKED = "BLOCKED"


class CommandSafetyClass(str, Enum):
    SAFE = "SAFE"
    RESTRICTED = "RESTRICTED"
    DANGEROUS = "DANGEROUS"
    BLOCKED = "BLOCKED"


class AgentRole(str, Enum):
    INVESTIGATOR = "INVESTIGATOR"
    ARCHITECT = "ARCHITECT"
    CODER = "CODER"
    TESTER = "TESTER"
    SECURITY_REVIEWER = "SECURITY_REVIEWER"
    SRE = "SRE"
    DOCUMENTATION_AGENT = "DOCUMENTATION_AGENT"


class ValidationCheckModel(BaseModel):
    check_name: str
    status: str = "PASS"  # PASS, FAIL, SKIPPED, NOT_RUN
    duration_ms: int = 120
    failure_reason: Optional[str] = None


class CommandSafetyModel(BaseModel):
    command_string: str
    safety_class: CommandSafetyClass
    is_permitted: bool
    policy_rule: str


class EngineeringAgentModel(BaseModel):
    agent_id: str
    name: str
    role: AgentRole
    autonomy_level: AutonomyLevel = AutonomyLevel.LEVEL_0_OBSERVE
    active_policy_id: str = "pol_default_observe"


class AgentTaskModel(BaseModel):
    task_id: str
    organization_id: str
    repository_id: str
    objective: str
    requester: str = "Engineering System"
    state: AgentState = AgentState.WAITING_FOR_APPROVAL
    autonomy_level: AutonomyLevel = AutonomyLevel.LEVEL_0_OBSERVE
    risk_score: float = 35.0
    proposed_diff: str = "diff --git a/app/auth.py b/app/auth.py\n+ # Interface adapter"
    validation_matrix: List[ValidationCheckModel] = Field(default_factory=list)
    approvals: List[str] = Field(default_factory=list)
    created_at: str


class AgentHandoffModel(BaseModel):
    handoff_id: str
    task_id: str
    from_agent: AgentRole
    to_agent: AgentRole
    context_summary: str
    confidence: float = 0.96
    timestamp: str


class AgentApprovalRequestModel(BaseModel):
    task_id: str
    approver: str = "Lead Software Architect"
    action: str = "APPROVE"  # APPROVE, REJECT, REQUEST_CHANGES, CANCEL
    reason: str = "Validated proposed diff and simulation blast radius."


class AutonomyDashboardModel(BaseModel):
    organization_id: str
    current_default_autonomy_level: AutonomyLevel = AutonomyLevel.LEVEL_0_OBSERVE
    active_agents_count: int = 4
    pending_approvals_count: int = 1
    running_tasks_count: int = 1
    completed_tasks_count: int = 12
    blocked_tasks_count: int = 0
