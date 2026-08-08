import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class GovernancePolicyDBModel(Base):
    __tablename__ = "gov_policies"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    policy_name = Column(String, nullable=False)
    version = Column(String, default="v1.0.0")
    precedence_level = Column(String, default="ORGANIZATION")  # GLOBAL, ORGANIZATION, WORKSPACE, ENVIRONMENT
    effect = Column(String, default="ALLOW")  # ALLOW, DENY, REQUIRE_APPROVAL, REQUIRE_FOUR_EYES
    conditions = Column(JSON, nullable=False, default=dict)
    author = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentRegistryEntryDBModel(Base):
    __tablename__ = "gov_agents"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    agent_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    allowed_tools = Column(JSON, nullable=False, default=list)
    allowed_environments = Column(JSON, nullable=False, default=list)
    status = Column(String, default="ACTIVE")  # REGISTERED, APPROVED, ACTIVE, SUSPENDED, REVOKED
    max_risk_level = Column(String, default="MEDIUM_RISK")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ToolGovernanceEntryDBModel(Base):
    __tablename__ = "gov_tools"

    id = Column(String, primary_key=True, index=True)
    tool_name = Column(String, nullable=False)
    purpose = Column(Text, nullable=False)
    required_permissions = Column(JSON, nullable=False, default=list)
    risk_classification = Column(String, default="MEDIUM_RISK")
    data_classification = Column(String, default="CONFIDENTIAL")
    is_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ImmutableAuditRecordDBModel(Base):
    __tablename__ = "gov_immutable_audit"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    actor_id = Column(String, nullable=False)  # User or Agent ID
    actor_type = Column(String, nullable=False)  # USER, AGENT, SYSTEM
    action = Column(String, nullable=False)
    resource_target = Column(String, nullable=False)
    policy_eval_result = Column(String, default="AUTHORIZED")
    record_hash = Column(String, nullable=False)  # Integrity verification hash
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class ComplianceControlDBModel(Base):
    __tablename__ = "gov_compliance_controls"

    id = Column(String, primary_key=True, index=True)
    framework_name = Column(String, nullable=False)  # SOC2, ISO27001, HIPAA, GDPR
    control_id = Column(String, nullable=False)
    requirement = Column(Text, nullable=False)
    status = Column(String, default="PASS")  # PASS, FAIL, WARNING
    owner = Column(String, nullable=False)
    last_review_at = Column(DateTime, default=datetime.datetime.utcnow)


class BreakGlassSessionDBModel(Base):
    __tablename__ = "gov_break_glass"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    requester_user = Column(String, nullable=False)
    justification = Column(Text, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class GovernanceRiskRegisterDBModel(Base):
    __tablename__ = "gov_risk_register"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    risk_title = Column(String, nullable=False)
    severity = Column(String, default="HIGH")
    owner = Column(String, nullable=False)
    is_accepted = Column(Boolean, default=False)
    accepted_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
