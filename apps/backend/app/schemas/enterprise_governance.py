from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PolicySeverity(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class PolicyEvaluationStatus(str, Enum):
    PASSED = "PASSED"
    VIOLATED = "VIOLATED"
    EXEMPTED = "EXEMPTED"


class EnterpriseRole(str, Enum):
    ENTERPRISE_ADMIN = "ENTERPRISE_ADMIN"
    LEAD_ARCHITECT = "LEAD_ARCHITECT"
    STAFF_ENGINEER = "STAFF_ENGINEER"
    COMPLIANCE_AUDITOR = "COMPLIANCE_AUDITOR"


class CrossRepoEdgeModel(BaseModel):
    source_repository: str
    source_component: str
    target_repository: str
    target_component: str
    edge_type: str = "API_CALL"  # API_CALL, EVENT_PUB_SUB, SHARED_LIBRARY, DB_DEPENDENCY
    coupling_strength: float = Field(default=0.85, ge=0.0, le=1.0)
    is_breaking_risk: bool = False


class SharedDecisionRecordModel(BaseModel):
    decision_id: str
    organization_id: str
    title: str
    adr_number: str
    author: str = "Lead Architect"
    affected_repositories: List[str] = Field(default_factory=list)
    status: str = "ACCEPTED"  # DRAFT, PROPOSED, ACCEPTED, SUPERSEDED
    consensus_score: float = 0.95
    summary: str
    created_at: str


class OrgArchitectureRuleModel(BaseModel):
    rule_id: str
    organization_id: str
    rule_name: str
    description: str
    severity: PolicySeverity = PolicySeverity.HIGH
    allowed_patterns: List[str] = Field(default_factory=list)
    forbidden_patterns: List[str] = Field(default_factory=list)
    is_enforced: bool = True


class GovernancePolicyViolationModel(BaseModel):
    violation_id: str
    rule_id: str
    repository_id: str
    violating_component: str
    severity: PolicySeverity
    description: str
    remediation_recommendation: str
    detected_at: str


class EnterpriseRiskScorecardModel(BaseModel):
    organization_id: str
    total_repositories: int = 12
    overall_health_score: float = 88.5
    cross_repo_coupling_score: float = 34.2
    architecture_drift_score: float = 12.0
    active_policy_violations_count: int = 3
    critical_violations_count: int = 0
    top_risky_repositories: List[str] = Field(default_factory=list)


class EnterpriseGraphRequest(BaseModel):
    organization_id: str
    repository_ids: List[str] = Field(default_factory=list)


class EnterpriseGraphResponse(BaseModel):
    organization_id: str
    total_nodes: int
    total_edges: int
    cross_repo_edges: List[CrossRepoEdgeModel]
    high_coupling_bridges: List[str]
    cascade_blast_radius_summary: str


class PolicyEvaluationRequest(BaseModel):
    organization_id: str
    repository_id: str


class PolicyEvaluationResponse(BaseModel):
    organization_id: str
    repository_id: str
    overall_status: PolicyEvaluationStatus
    evaluated_rules_count: int
    violations: List[GovernancePolicyViolationModel]
    passed_rules_count: int
