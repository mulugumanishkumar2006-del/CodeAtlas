from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class DriftStatus(str, Enum):
    EXPECTED = "EXPECTED"
    OBSERVED = "OBSERVED"
    UNEXPECTED = "UNEXPECTED"
    MISSING = "MISSING"


class RootCauseConfidence(str, Enum):
    LIKELY = "LIKELY"
    POSSIBLE = "POSSIBLE"
    UNCERTAIN = "UNCERTAIN"
    CONFIRMED = "CONFIRMED"


class IncidentSeverity(str, Enum):
    SEV_1 = "SEV-1"
    SEV_2 = "SEV-2"
    SEV_3 = "SEV-3"


# ----------------------------------------------------
# Digital Twin & Cloud Models
# ----------------------------------------------------
class CloudResourceModel(BaseModel):
    resource_id: str
    organization_id: str
    resource_name: str
    resource_type: str  # COMPUTE, STORAGE, DATABASE, KUBERNETES, SERVERLESS
    provider: str = "AWS"
    region: str = "us-east-1"
    service_id: Optional[str] = "auth_service"
    cost_monthly_usd: float = 120.00
    health_status: str = "HEALTHY"


class InfrastructureGraphEdgeModel(BaseModel):
    source_resource_id: str
    target_resource_id: str
    relationship_type: str  # HOSTS, CONNECTS_TO, RUNS_ON, DEPENDS_ON


class RuntimeTopologyEdgeModel(BaseModel):
    source_service: str
    target_service: str
    protocol: str = "HTTP/gRPC"
    observed_rps: float = 450.0
    drift_status: DriftStatus = DriftStatus.EXPECTED


class ArchitectureDriftAnalysisModel(BaseModel):
    organization_id: str
    total_edges_analyzed: int = 42
    expected_edges_count: int = 38
    observed_edges_count: int = 40
    unexpected_dependencies: List[str] = Field(default_factory=list)
    missing_dependencies: List[str] = Field(default_factory=list)
    drift_risk_score: float = 4.2


# ----------------------------------------------------
# Change Blast Radius & Deployment Risk
# ----------------------------------------------------
class ChangeBlastRadiusModel(BaseModel):
    proposed_commit: str = "a9b3c4d"
    target_service: str = "auth_service"
    affected_services: List[str] = Field(default_factory=list)
    affected_infrastructure: List[str] = Field(default_factory=list)
    affected_teams: List[str] = Field(default_factory=list)
    projected_risk_score: float = 12.5
    deployment_risk_level: str = "LOW"


# ----------------------------------------------------
# Observability & Signal Correlation
# ----------------------------------------------------
class ObservabilityTelemetrySummaryModel(BaseModel):
    service_id: str
    avg_latency_ms: float = 24.5
    error_rate_percentage: float = 0.01
    throughput_rps: float = 890.0
    active_alerts_count: int = 0
    recent_errors_sample: List[str] = Field(default_factory=list)


# ----------------------------------------------------
# Incident Intelligence & Copilot
# ----------------------------------------------------
class IncidentTimelineEventModel(BaseModel):
    event_id: str
    event_type: str  # DEPLOYMENT, LATENCY_SPIKE, ERROR_SPIKE, ALERT, RESOLUTION
    description: str
    timestamp: str


class IncidentReportModel(BaseModel):
    incident_id: str
    organization_id: str
    title: str
    severity: IncidentSeverity = IncidentSeverity.SEV_2
    status: str = "RESOLVED"
    affected_services: List[str] = Field(default_factory=list)
    timeline: List[IncidentTimelineEventModel] = Field(default_factory=list)
    root_cause_summary: str
    confidence: RootCauseConfidence = RootCauseConfidence.LIKELY
    evidence_citations: List[str] = Field(default_factory=list)
    started_at: str
    resolved_at: Optional[str] = None


class AIIncidentCopilotResponseModel(BaseModel):
    incident_id: str
    summary: str
    likely_root_causes: List[str] = Field(default_factory=list)
    evidence_citations: List[str] = Field(default_factory=list)
    affected_services: List[str] = Field(default_factory=list)
    recommended_safe_actions: List[str] = Field(default_factory=list)
    confidence: RootCauseConfidence = RootCauseConfidence.LIKELY


# ----------------------------------------------------
# Service Health, SLOs & Runbooks
# ----------------------------------------------------
class ServiceHealthSLOModel(BaseModel):
    service_id: str
    service_name: str
    slo_target_percentage: float = 99.99
    current_availability: float = 99.98
    error_budget_remaining_percentage: float = 85.0
    burn_rate_trend: str = "STABLE"
    runbook_url: str = "https://docs.acme.com/runbooks/auth_service"
    runbook_freshness: str = "CURRENT"


# ----------------------------------------------------
# Engineering Time Machine & Resilience Scorecard
# ----------------------------------------------------
class TimeMachineSnapshotModel(BaseModel):
    snapshot_timestamp: str
    organization_id: str
    active_services_count: int = 6
    active_deployments_count: int = 2
    system_health_score: float = 98.5
    drift_status: str = "STABLE"


class ResilienceScorecardModel(BaseModel):
    organization_id: str
    overall_resilience_score: float = 98.5
    redundancy_score: float = 99.0
    observability_score: float = 98.0
    recovery_score: float = 98.5
    dependency_risk_score: float = 3.5
    resilience_status: str = "OPTIMAL"


# ----------------------------------------------------
# Global Intelligence Scorecard (Phase 65)
# ----------------------------------------------------
class GlobalIntelligenceScorecardModel(BaseModel):
    organization_id: str
    digital_twin_score: float = 99.0
    cloud_infra_score: float = 98.5
    runtime_topology_score: float = 99.0
    observability_telemetry_score: float = 99.5
    incident_copilot_score: float = 100.0
    slo_error_budget_score: float = 98.5
    time_machine_score: float = 99.0
    resilience_score: float = 98.5
    global_status: str = "CODEATLAS V2.4 GLOBAL INTELLIGENCE READY"
