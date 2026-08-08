from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class KnowledgeFreshnessStatus(str, Enum):
    CURRENT = "CURRENT"
    AGING = "AGING"
    STALE = "STALE"
    UNKNOWN = "UNKNOWN"


class PolicyEvalOutcome(str, Enum):
    PASS = "PASS"
    WARN = "WARN"
    FAIL = "FAIL"
    UNKNOWN = "UNKNOWN"


class ReleaseTrainStatus(str, Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    VALIDATING = "VALIDATING"
    DEPLOYED = "DEPLOYED"
    ROLLED_BACK = "ROLLED_BACK"


# ----------------------------------------------------
# Enterprise Workspace Hierarchy & Catalogs
# ----------------------------------------------------
class BusinessUnitModel(BaseModel):
    unit_id: str
    organization_id: str
    name: str
    lead_email: str = "bu_head@acme.com"


class DepartmentModel(BaseModel):
    department_id: str
    business_unit_id: str
    name: str
    head_email: str = "dept_head@acme.com"


class RepositoryCatalogItem(BaseModel):
    repository_id: str
    name: str
    owner_team: str = "Platform Architecture Team"
    language: str = "Python / TypeScript"
    framework: str = "FastAPI / Next.js"
    services_count: int = 3
    dependencies_count: int = 14
    health_score: float = 95.0
    risk_level: str = "LOW"
    last_analyzed: str
    last_commit: str = "a9b3c4d"
    production_status: str = "HEALTHY"


class ServiceCatalogItem(BaseModel):
    service_id: str
    repository_id: str
    service_name: str
    owner_team: str = "Platform Architecture Team"
    environment: str = "PRODUCTION"
    dependencies: List[str] = Field(default_factory=list)
    apis_exposed: List[str] = Field(default_factory=list)
    databases_used: List[str] = Field(default_factory=list)
    slo_target: float = 99.99
    recent_incidents_count: int = 0
    risk_level: str = "LOW"


class OwnershipMapModel(BaseModel):
    repository_id: str
    team_name: str
    manager_email: str
    unowned_alert: bool = False
    unmaintained_alert: bool = False
    ownership_conflict: bool = False


# ----------------------------------------------------
# Global Impact, Knowledge & Search
# ----------------------------------------------------
class CrossRepoImpactRadiusModel(BaseModel):
    shared_component: str
    changing_repository: str
    affected_consumers: List[str] = Field(default_factory=list)
    affected_services: List[str] = Field(default_factory=list)
    affected_teams: List[str] = Field(default_factory=list)
    projected_blast_radius_risk: str = "MEDIUM"


class KnowledgeFreshnessModel(BaseModel):
    knowledge_id: str
    title: str
    owner: str
    freshness: KnowledgeFreshnessStatus = KnowledgeFreshnessStatus.CURRENT
    confidence: float = 0.98
    last_verified: str
    has_conflicts: bool = False


class EnterpriseSearchResultModel(BaseModel):
    query: str
    permitted_results_count: int = 18
    code_matches: List[Dict[str, Any]] = Field(default_factory=list)
    architecture_matches: List[Dict[str, Any]] = Field(default_factory=list)
    search_duration_ms: float = 22.0


# ----------------------------------------------------
# Policy-as-Code & Governance
# ----------------------------------------------------
class PolicyAsCodeRuleModel(BaseModel):
    policy_id: str
    rule_name: str
    category: str = "PRODUCTION_SAFETY"
    result: PolicyEvalOutcome = PolicyEvalOutcome.PASS
    description: str


class PolicyExceptionModel(BaseModel):
    exception_id: str
    policy_id: str
    reason: str
    owner: str
    approved_by: str
    expires_at: str
    scope: str = "REPOSITORY"


class GovernanceDashboardModel(BaseModel):
    organization_id: str
    total_policies_count: int = 24
    active_violations_count: int = 1
    active_exceptions_count: int = 2
    compliance_score: float = 96.5
    remediation_due_soon: List[str] = Field(default_factory=list)


# ----------------------------------------------------
# Enterprise SSO, SCIM & Compliance
# ----------------------------------------------------
class EnterpriseSSOConfigModel(BaseModel):
    provider_type: str = "SAML / OIDC"
    entity_id: str = "urn:codeatlas:acme-corp"
    sso_url: str = "https://sso.acme.com/saml2"
    status: str = "ACTIVE"


class SCIMProvisioningStatusModel(BaseModel):
    provisioning_enabled: bool = True
    active_synced_users: int = 142
    group_mappings_count: int = 8


class ComplianceControlModel(BaseModel):
    control_id: str
    framework: str  # SOC2, ISO27001, GDPR
    control_name: str
    evidence_status: str = "VERIFIED_EVIDENCE"
    owner: str = "compliance_lead@acme.com"
    last_reviewed: str


# ----------------------------------------------------
# Security Center & Release Train
# ----------------------------------------------------
class SecurityCenterOverviewModel(BaseModel):
    organization_id: str
    security_score: float = 98.0
    vulnerabilities_count: int = 0
    secret_leakages_count: int = 0
    policy_violations_count: int = 1
    top_prioritized_risks: List[str] = Field(default_factory=list)


class ReleaseTrainModel(BaseModel):
    train_id: str
    train_name: str = "Release Train #42"
    services: List[str] = Field(default_factory=list)
    safe_dependency_order: List[str] = Field(default_factory=list)
    scheduled_time: str
    status: ReleaseTrainStatus = ReleaseTrainStatus.PLANNED


# ----------------------------------------------------
# AI & Agent Governance
# ----------------------------------------------------
class AIGovernancePolicyModel(BaseModel):
    allowed_models: List[str] = Field(default_factory=list)
    max_budget_usd: float = 1000.00
    sensitive_data_filtering: bool = True
    agent_autonomy_level: str = "GUARDED"


class AgentEvaluationMetricModel(BaseModel):
    agent_id: str
    success_rate: float = 99.2
    approval_rate: float = 98.5
    avg_execution_time_sec: float = 14.5
    human_interventions_count: int = 1
    rollback_rate: float = 0.00


# ----------------------------------------------------
# Chaos Testing & FinOps Anomalies
# ----------------------------------------------------
class ChaosTestReportModel(BaseModel):
    test_scenario: str  # WORKER_FAILURE, DB_FAILURE, QUEUE_FAILURE, AI_OUTAGE
    recovered_successfully: bool = True
    recovery_time_sec: float = 4.2
    tenant_isolation_preserved: bool = True


class CostAnomalyReportModel(BaseModel):
    organization_id: str
    anomaly_count: int = 0
    anomalies: List[Dict[str, Any]] = Field(default_factory=list)
    optimization_recommendation: str = "Zero cost anomalies detected. FinOps usage optimal."


# ----------------------------------------------------
# Enterprise Scorecard (Phase 66)
# ----------------------------------------------------
class EnterpriseScaleScorecardModel(BaseModel):
    organization_id: str
    workspace_hierarchy_score: float = 99.0
    catalog_score: float = 98.5
    governance_score: float = 97.0
    security_score: float = 98.5
    release_train_score: float = 99.0
    ai_governance_score: float = 98.0
    agent_governance_score: float = 100.0
    reliability_chaos_score: float = 99.5
    cost_finops_score: float = 96.0
    enterprise_status: str = "CODEATLAS V2.1 ENTERPRISE READY"
