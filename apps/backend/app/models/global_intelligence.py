import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class CloudResourceDBModel(Base):
    __tablename__ = "gi_cloud_resources"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    resource_name = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)  # COMPUTE, STORAGE, DATABASE, KUBERNETES, SERVERLESS
    provider = Column(String, default="AWS")  # AWS, GCP, AZURE
    region = Column(String, default="us-east-1")
    service_id = Column(String, index=True, nullable=True)
    cost_monthly_usd = Column(Float, default=120.00)
    health_status = Column(String, default="HEALTHY")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class InfrastructureGraphEdgeDBModel(Base):
    __tablename__ = "gi_infra_edges"

    id = Column(String, primary_key=True, index=True)
    source_resource_id = Column(String, index=True, nullable=False)
    target_resource_id = Column(String, index=True, nullable=False)
    relationship_type = Column(String, nullable=False)  # HOSTS, CONNECTS_TO, RUNS_ON, DEPENDS_ON
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class RuntimeTopologyEdgeDBModel(Base):
    __tablename__ = "gi_runtime_topology"

    id = Column(String, primary_key=True, index=True)
    source_service = Column(String, index=True, nullable=False)
    target_service = Column(String, index=True, nullable=False)
    protocol = Column(String, default="HTTP/gRPC")
    observed_rps = Column(Float, default=450.0)
    drift_status = Column(String, default="EXPECTED")  # EXPECTED, OBSERVED, UNEXPECTED, MISSING
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class TelemetryMetricDBModel(Base):
    __tablename__ = "gi_metrics"

    id = Column(String, primary_key=True, index=True)
    service_id = Column(String, index=True, nullable=False)
    metric_name = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String, default="ms")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class TelemetryLogDBModel(Base):
    __tablename__ = "gi_logs"

    id = Column(String, primary_key=True, index=True)
    service_id = Column(String, index=True, nullable=False)
    log_level = Column(String, default="ERROR")
    message = Column(Text, nullable=False)
    trace_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class TelemetryTraceDBModel(Base):
    __tablename__ = "gi_traces"

    id = Column(String, primary_key=True, index=True)
    trace_id = Column(String, index=True, nullable=False)
    entry_service = Column(String, nullable=False)
    total_duration_ms = Column(Float, default=45.0)
    spans_count = Column(Integer, default=5)
    has_error = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class ObservabilityAlertDBModel(Base):
    __tablename__ = "gi_alerts"

    id = Column(String, primary_key=True, index=True)
    service_id = Column(String, index=True, nullable=False)
    alert_name = Column(String, nullable=False)
    severity = Column(String, default="HIGH")
    status = Column(String, default="TRIGGERED")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class IncidentRecordDBModel(Base):
    __tablename__ = "gi_incidents"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    severity = Column(String, default="SEV-2")  # SEV-1, SEV-2, SEV-3
    status = Column(String, default="RESOLVED")  # OPEN, INVESTIGATING, MITIGATED, RESOLVED
    affected_services = Column(JSON, nullable=False, default=list)
    root_cause_summary = Column(Text, nullable=True)
    confidence = Column(String, default="LIKELY")  # LIKELY, POSSIBLE, UNCERTAIN, CONFIRMED
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)


class IncidentTimelineEventDBModel(Base):
    __tablename__ = "gi_incident_timeline"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, index=True, nullable=False)
    event_type = Column(String, nullable=False)  # DEPLOYMENT, LATENCY_SPIKE, ERROR_SPIKE, ALERT, RESOLUTION
    description = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class SLOTargetDBModel(Base):
    __tablename__ = "gi_slo_targets"

    id = Column(String, primary_key=True, index=True)
    service_id = Column(String, index=True, nullable=False)
    slo_name = Column(String, nullable=False)
    target_percentage = Column(Float, default=99.99)
    current_availability = Column(Float, default=99.95)
    error_budget_remaining = Column(Float, default=65.0)  # percentage
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class RunbookRecordDBModel(Base):
    __tablename__ = "gi_runbooks"

    id = Column(String, primary_key=True, index=True)
    service_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    freshness_status = Column(String, default="CURRENT")  # CURRENT, AGING, STALE
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ResilienceScorecardDBModel(Base):
    __tablename__ = "gi_resilience_scorecards"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    overall_score = Column(Float, default=98.5)
    redundancy_score = Column(Float, default=99.0)
    observability_score = Column(Float, default=98.0)
    recovery_score = Column(Float, default=98.5)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
