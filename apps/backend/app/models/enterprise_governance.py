import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class SharedDecisionDBModel(Base):
    __tablename__ = "ent_shared_decisions"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    adr_number = Column(String, nullable=False)
    author = Column(String, default="Lead Architect")
    affected_repositories = Column(JSON, nullable=False, default=list)
    status = Column(String, default="ACCEPTED")
    consensus_score = Column(Float, default=0.95)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OrgArchitectureRuleDBModel(Base):
    __tablename__ = "ent_arch_rules"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    rule_name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, default="HIGH")
    allowed_patterns = Column(JSON, nullable=False, default=list)
    forbidden_patterns = Column(JSON, nullable=False, default=list)
    is_enforced = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class GovernancePolicyDBModel(Base):
    __tablename__ = "ent_gov_policies"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    policy_name = Column(String, nullable=False)
    policy_category = Column(String, default="SECURITY_AND_ARCHITECTURE")
    rules = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
