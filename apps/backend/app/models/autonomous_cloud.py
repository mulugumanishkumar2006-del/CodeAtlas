import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class OrganizationTenantDBModel(Base):
    __tablename__ = "v3_cloud_tenants"

    id = Column(String, primary_key=True, index=True)
    organization_name = Column(String, nullable=False)
    subscription_plan = Column(String, default="ENTERPRISE")  # FREE, DEVELOPER, TEAM, BUSINESS, ENTERPRISE
    tenant_status = Column(String, default="ACTIVE")
    data_residency_region = Column(String, default="us-east-1")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class BillingLedgerDBModel(Base):
    __tablename__ = "v3_cloud_billing_ledger"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    metric_type = Column(String, nullable=False)  # REPOSITORIES, USERS, AI_TOKENS, AGENT_ACTIONS, STORAGE_GB
    quantity_used = Column(Float, default=0.0)
    monthly_cost_usd = Column(Float, default=0.0)
    billed_at = Column(DateTime, default=datetime.datetime.utcnow)


class BackgroundJobRecordDBModel(Base):
    __tablename__ = "v3_cloud_jobs"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    job_type = Column(String, nullable=False)  # REPO_INGESTION, HYBRID_SEARCH_INDEXING, AI_SIMULATION
    status = Column(String, default="QUEUED")  # QUEUED, RUNNING, COMPLETED, FAILED, RETRYING
    progress_percentage = Column(Float, default=0.0)
    worker_id = Column(String, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class DigitalTwinEntityDBModel(Base):
    __tablename__ = "v3_cloud_digital_twin"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    entity_name = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)  # REPOSITORY, SERVICE, MODULE, FUNCTION, DEPENDENCY
    connected_relationships = Column(JSON, nullable=False, default=list)
    health_score = Column(Float, default=98.5)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)


class IncidentPostmortemDBModel(Base):
    __tablename__ = "v3_cloud_postmortems"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    incident_title = Column(String, nullable=False)
    severity = Column(String, default="SEV-1")
    root_cause_summary = Column(Text, nullable=False)
    remediation_actions = Column(JSON, nullable=False, default=list)
    mttr_seconds = Column(Float, default=75.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class EventLogDBModel(Base):
    __tablename__ = "v3_cloud_events"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    event_type = Column(String, nullable=False)  # repository.connected, incident.detected, recovery.started
    payload = Column(JSON, nullable=False, default=dict)
    idempotency_key = Column(String, unique=True, index=True, nullable=False)
    emitted_at = Column(DateTime, default=datetime.datetime.utcnow)
