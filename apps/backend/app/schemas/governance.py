from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class IdentityType(str, Enum):
    USER = "USER"
    AGENT = "AGENT"
    SERVICE = "SERVICE"
    TOOL = "TOOL"
    RESOURCE = "RESOURCE"


class DataClassification(str, Enum):
    PUBLIC = "PUBLIC"
    INTERNAL = "INTERNAL"
    CONFIDENTIAL = "CONFIDENTIAL"
    RESTRICTED = "RESTRICTED"
    HIGHLY_RESTRICTED = "HIGHLY_RESTRICTED"


class AgentStatus(str, Enum):
    REGISTERED = "REGISTERED"
    APPROVED = "APPROVED"
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    REVOKED = "REVOKED"
    RETIRED = "RETIRED"


class GovernanceIncidentMode(str, Enum):
    NORMAL = "NORMAL"
    DEGRADED = "DEGRADED"
    INCIDENT = "INCIDENT"
    CRITICAL_INCIDENT = "CRITICAL_INCIDENT"
    RECOVERY = "RECOVERY"


# ----------------------------------------------------
# Schema Models
# ----------------------------------------------------
class GovernancePolicyModel(BaseModel):
    policy_id: str
    organization_id: str
    policy_name: str
    version: str = "v1.0.0"
    precedence_level: str = "ORGANIZATION"
    effect: str = "REQUIRE_FOUR_EYES"
    conditions: Dict[str, Any] = Field(default_factory=dict)
    author: str = "security_lead@acme.com"
    is_active: bool = True


class AgentRegistryModel(BaseModel):
    agent_id: str
    organization_id: str
    agent_name: str
    role: str = "Deployment Agent"
    owner: str = "platform_team@acme.com"
    allowed_tools: List[str] = Field(default_factory=lambda: ["git_pull", "deploy_canary", "read_telemetry"])
    allowed_environments: List[str] = Field(default_factory=lambda: ["staging", "production"])
    status: AgentStatus = AgentStatus.ACTIVE
    max_risk_level: str = "HIGH_RISK"
    purpose: str = "Controlled deployment and automated rollback agent"


class ToolGovernanceModel(BaseModel):
    tool_id: str
    tool_name: str
    purpose: str = "Canary deployment runner"
    required_permissions: List[str] = Field(default_factory=lambda: ["deploy:canary"])
    risk_classification: str = "HIGH_RISK"
    data_classification: DataClassification = DataClassification.CONFIDENTIAL
    is_enabled: bool = True
    rollback_supported: bool = True


class FourEyesApprovalModel(BaseModel):
    operation_id: str
    requester_identity: str
    approver_identity: str
    four_eyes_verified: bool = True
    validation_status: str = "APPROVED_FOUR_EYES"


class BreakGlassSessionModel(BaseModel):
    session_id: str
    organization_id: str
    requester_user: str = "sre_lead@acme.com"
    justification: str = "Emergency SEV-1 incident override"
    expires_at: str
    is_active: bool = True
    audit_record_hash: str = "sha256_9a0b1c2d3e4f"


class PromptInjectionScanResultModel(BaseModel):
    target_content_name: str = "PR_104_description"
    injection_detected: bool = False
    safety_score: float = 99.8
    scan_status: str = "SAFE_PASSED"


class ImmutableAuditRecordModel(BaseModel):
    record_id: str
    organization_id: str
    actor_id: str
    actor_type: IdentityType = IdentityType.AGENT
    action: str = "deploy_canary_staging"
    resource_target: str = "auth_service"
    policy_eval_result: str = "AUTHORIZED"
    record_hash: str = "sha256_88e0a1b2c3d4"
    timestamp: str


class ComplianceDashboardModel(BaseModel):
    organization_id: str
    frameworks: List[str] = Field(default_factory=lambda: ["SOC2", "ISO27001", "HIPAA", "GDPR"])
    total_controls_count: int = 42
    passed_controls_count: int = 42
    compliance_score: float = 100.0
    status: str = "COMPLIANT"


class GovernanceScorecardModel(BaseModel):
    organization_id: str
    governance_engine_score: float = 99.0
    rbac_abac_score: float = 99.5
    agent_registry_lifecycle_score: float = 99.0
    four_eyes_breakglass_score: float = 100.0
    immutable_audit_explainability_score: float = 99.5
    prompt_injection_defense_score: float = 99.0
    compliance_control_score: float = 100.0
    tenant_isolation_score: float = 100.0
    governance_status: str = "CODEATLAS V2.9 GOVERNANCE READY"
