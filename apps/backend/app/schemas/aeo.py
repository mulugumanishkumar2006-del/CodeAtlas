# apps/backend/app/schemas/aeo.py

from typing import List, Optional

from pydantic import BaseModel


class AIExecRoleInsight(BaseModel):
    role_id: str  # "cto", "architect", "pm", "tech_lead", "sre", "qa", "security", "platform"
    role_name: str  # e.g. "AI Architect"
    focus_area: str
    assessment: str
    key_directive: str
    status: str  # "Active", "Optimizing", "Alert"


class WorkDuplicationAlert(BaseModel):
    duplication_id: str
    team_a: str
    team_b: str
    duplicated_component: str
    similarity_pct: float
    recommended_unified_service: str


class ArchitectureAlignmentIssue(BaseModel):
    issue_id: str
    service_name: str
    violated_standard: str
    remediation_action: str
    priority: str  # "P0", "P1", "P2"


class ExecutionHubAction(BaseModel):
    action_id: str
    timestamp: str
    source_role: str
    target_team: str
    action_title: str
    action_type: str  # "Refactor Ticket", "Config Override", "SLA Threshold Change"
    status: str  # "Dispatched", "Executed", "Pending Review"


class AEOOrganizationMetrics(BaseModel):
    organization_health_index: float  # 0 to 100
    alignment_score_pct: float
    work_duplication_reduction_pct: float
    velocity_multiplier: float


class AEOOrgStateRequest(BaseModel):
    org_name: Optional[str] = "Enterprise Engineering Org"
    active_teams_count: Optional[int] = 12


class AEOOrgStateResponse(BaseModel):
    org_name: str
    ai_vp_engineering_verdict: str
    exec_roles: List[AIExecRoleInsight]
    duplication_alerts: List[WorkDuplicationAlert]
    alignment_issues: List[ArchitectureAlignmentIssue]
    execution_actions: List[ExecutionHubAction]
    metrics: AEOOrganizationMetrics
