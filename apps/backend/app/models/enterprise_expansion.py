import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class BusinessUnitDBModel(Base):
    __tablename__ = "v32_ent_business_units"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    business_unit_name = Column(String, nullable=False)
    department_name = Column(String, nullable=False)
    team_name = Column(String, nullable=False)
    workspace_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SSOConfigDBModel(Base):
    __tablename__ = "v32_ent_sso"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    provider_type = Column(String, default="SAML")  # SAML, OIDC
    issuer_url = Column(String, nullable=False)
    domain_verified = Column(Boolean, default=True)
    sso_enforced = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SCIMUserBindingDBModel(Base):
    __tablename__ = "v32_ent_scim"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    scim_external_id = Column(String, nullable=False)
    email = Column(String, nullable=False)
    assigned_role = Column(String, default="Developer")
    status = Column(String, default="ACTIVE")
    synced_at = Column(DateTime, default=datetime.datetime.utcnow)


class EnterpriseAuditStreamDBModel(Base):
    __tablename__ = "v32_ent_audit_streams"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    siem_provider = Column(String, default="Splunk")  # Splunk, Datadog, Elastic, Sentinel
    endpoint_url = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ServiceCatalogEntryDBModel(Base):
    __tablename__ = "v32_ent_service_catalog"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    service_name = Column(String, nullable=False)
    owner_team = Column(String, nullable=False)
    criticality = Column(String, default="HIGH")
    repository_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class EngineeringPolicyAsCodeDBModel(Base):
    __tablename__ = "v32_ent_policies"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    policy_name = Column(String, nullable=False)
    rego_code = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class FinOpsCostAllocationDBModel(Base):
    __tablename__ = "v32_ent_finops"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    business_unit_id = Column(String, nullable=False)
    team_name = Column(String, nullable=False)
    monthly_budget_usd = Column(Float, default=5000.0)
    current_spend_usd = Column(Float, default=3240.0)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)
