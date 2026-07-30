from typing import Any, Dict, List

from pydantic import BaseModel


class ArchitectureSimRequest(BaseModel):
    repository_id: str
    target_service: str = "UserManagerService"
    action_type: str = "split_service"


class ArchitectureSimResponse(BaseModel):
    id: str
    repository_id: str
    target_service: str
    action_type: str
    coupling_reduction_pct: float
    blast_radius_reduction_pct: float
    latency_impact_ms: float
    impacted_endpoints: List[str]
    recommended_patterns: List[str]
    status: str


class DatabaseMigrationRequest(BaseModel):
    repository_id: str
    source_db: str = "PostgreSQL"
    target_db: str = "CockroachDB"


class DatabaseMigrationResponse(BaseModel):
    id: str
    repository_id: str
    source_db: str
    target_db: str
    schema_compatibility_pct: float
    migration_downtime_minutes: float
    read_throughput_multiplier: float
    write_latency_delta_ms: float
    potential_lock_risks: List[Dict[str, Any]]
    step_by_step_migration_plan: List[Dict[str, Any]]


class InfrastructureSimRequest(BaseModel):
    repository_id: str
    technology_stack: str = "Kubernetes"
    target_concurrent_users: int = 100000000


class InfrastructureSimResponse(BaseModel):
    id: str
    repository_id: str
    technology_stack: str
    target_concurrent_users: int
    predicted_rps: float
    predicted_ram_usage_gb: float
    predicted_cpu_cores: int
    bottleneck_detected: bool
    capacity_recommendations: List[str]


class DependencyUpgradeRequest(BaseModel):
    repository_id: str
    source_dependency: str = "Spring Boot 2.7"
    target_dependency: str = "Spring Boot 3.2"


class DependencyUpgradeResponse(BaseModel):
    id: str
    repository_id: str
    source_dependency: str
    target_dependency: str
    breaking_apis_count: int
    deprecated_methods_count: int
    required_code_changes: List[Dict[str, Any]]
    estimated_migration_effort_hours: float


class SecurityAttackSimRequest(BaseModel):
    repository_id: str
    attack_vector: str = "SQL Injection & Supply Chain"


class SecurityAttackSimResponse(BaseModel):
    id: str
    repository_id: str
    attack_vector: str
    resilience_score: float
    vulnerabilities_exploited: List[Dict[str, Any]]
    mitigation_steps: List[str]


class TeamGrowthSimRequest(BaseModel):
    repository_id: str
    current_team_size: int = 10
    target_team_size: int = 50


class TeamGrowthSimResponse(BaseModel):
    id: str
    repository_id: str
    current_team_size: int
    target_team_size: int
    predicted_sprint_velocity: float
    communication_overhead_pct: float
    merge_conflict_frequency_pct: float
    onboarding_timeline_weeks: int


class DigitalLabRequest(BaseModel):
    repository_id: str
    scenario_name: str = "Scale to 50 Million Users"
    platform: str = "AWS"
    database: str = "CockroachDB"
    cache: str = "Redis Cluster"
    messaging: str = "Kafka"
    deployment: str = "Kubernetes"


class DigitalLabResponse(BaseModel):
    id: str
    repository_id: str
    scenario_name: str
    platform: str
    database: str
    cache: str
    messaging: str
    deployment: str
    architecture_score: float
    estimated_monthly_cost_usd: float
    expected_latency_ms: float
    risk_level: str
    confidence_pct: float
    recommended_changes: List[str]


class AIDebateResponse(BaseModel):
    repository_id: str
    topic: str
    debate_rounds: List[Dict[str, Any]]
    consensus_architecture: str


class MonteCarloRiskResponse(BaseModel):
    repository_id: str
    iterations_run: int
    p90_cost_usd: float
    p95_latency_ms: float
    p99_outage_risk_pct: float
    confidence_interval: str


class FailureScenarioRequest(BaseModel):
    repository_id: str
    outage_type: str = "Kafka Broker Outage"


class FailureScenarioResponse(BaseModel):
    id: str
    repository_id: str
    outage_type: str
    cascading_failure_risk: float
    resilience_score: float
    impacted_services: List[str]
    circuit_breaker_activations: List[str]
    recovery_time_seconds: float


class BlackFridaySimRequest(BaseModel):
    repository_id: str
    traffic_multiplier: float = 10.0


class BlackFridaySimResponse(BaseModel):
    id: str
    repository_id: str
    traffic_multiplier: float
    concurrent_requests_per_sec: int
    p95_latency_ms: float
    p99_latency_ms: float
    error_rate_pct: float
    auto_scale_pods_required: int
    system_status: str


class CostSecuritySimRequest(BaseModel):
    repository_id: str
    target_cloud_provider: str = "AWS"


class CostSecuritySimResponse(BaseModel):
    repository_id: str
    current_monthly_cost_usd: float
    predicted_monthly_cost_usd: float
    cost_savings_pct: float
    security_hardening_score: float
    vulnerability_remediation_count: int


class SimulationReportResponse(BaseModel):
    report_id: str
    repository_id: str
    title: str
    simulation_summary: str
    executive_recommendation: str
    metrics: Dict[str, Any]
    generated_at: str
