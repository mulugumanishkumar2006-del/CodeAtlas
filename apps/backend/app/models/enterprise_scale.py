import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class BusinessUnitDBModel(Base):
    __tablename__ = "ent_business_units"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    lead_email = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class DepartmentDBModel(Base):
    __tablename__ = "ent_departments"

    id = Column(String, primary_key=True, index=True)
    business_unit_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    head_email = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ServiceCatalogDBModel(Base):
    __tablename__ = "ent_service_catalog"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    service_name = Column(String, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    owner_team = Column(String, nullable=False)
    environment = Column(String, default="PRODUCTION")
    framework = Column(String, default="FastAPI / Python")
    slo_target = Column(Float, default=99.99)
    risk_level = Column(String, default="LOW")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class RepositoryOwnershipDBModel(Base):
    __tablename__ = "ent_repo_ownership"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    team_name = Column(String, nullable=False)
    manager_email = Column(String, nullable=False)
    unowned_alert = Column(Boolean, default=False)
    unmaintained_alert = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class EngineeringPolicyDBModel(Base):
    __tablename__ = "ent_policies"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    policy_name = Column(String, nullable=False)
    category = Column(String, default="PRODUCTION_READINESS")
    rule_expression = Column(Text, nullable=False)
    severity = Column(String, default="HIGH")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PolicyExceptionDBModel(Base):
    __tablename__ = "ent_policy_exceptions"

    id = Column(String, primary_key=True, index=True)
    policy_id = Column(String, index=True, nullable=False)
    reason = Column(Text, nullable=False)
    owner = Column(String, nullable=False)
    approved_by = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class VulnerabilityIntelDBModel(Base):
    __tablename__ = "ent_vulnerabilities"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    cve_id = Column(String, nullable=False)
    severity = Column(String, default="HIGH")
    exploitability_score = Column(Float, default=7.5)
    remediation_status = Column(String, default="OPEN")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ReleaseTrainDBModel(Base):
    __tablename__ = "ent_release_trains"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    train_name = Column(String, nullable=False)
    scheduled_release_time = Column(DateTime, nullable=False)
    status = Column(String, default="PLANNED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class CostAnomalyDBModel(Base):
    __tablename__ = "ent_cost_anomalies"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    resource_type = Column(String, nullable=False)
    cost_delta_usd = Column(Float, default=120.00)
    anomaly_status = Column(String, default="DETECTED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
