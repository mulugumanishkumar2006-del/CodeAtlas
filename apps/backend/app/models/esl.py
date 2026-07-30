import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)

from app.core.database import Base


class SimulationExperiment(Base):
    """
    Represents an Engineering Simulation Laboratory (ESL) experiment run.
    Experiment types: architecture, db_migration, infrastructure, failure_scenario, black_friday,
    dependency_upgrade, cloud_comparison, security_attack, disaster_recovery, team_growth, digital_lab.
    """

    __tablename__ = "simulation_experiments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    experiment_type = Column(String(50), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    status = Column(String(50), default="completed", index=True)
    confidence_score = Column(Float, default=96.5)
    overall_health_delta = Column(Float, default=15.0)

    parameters_json = Column(JSON, default=dict)
    summary_metrics = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ArchitectureSimResult(Base):
    """
    Simulates impact of service splitting, monolith extraction, or API removals.
    """

    __tablename__ = "architecture_sim_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    experiment_id = Column(
        String(36),
        ForeignKey("simulation_experiments.id", ondelete="CASCADE"),
        nullable=True,
    )

    target_service = Column(String(255), nullable=False)
    action_type = Column(String(50), default="split_service")

    coupling_reduction_pct = Column(Float, default=45.0)
    blast_radius_reduction_pct = Column(Float, default=60.0)
    latency_impact_ms = Column(Float, default=-12.0)

    impacted_endpoints = Column(JSON, default=list)
    recommended_patterns = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class DatabaseMigrationResult(Base):
    """
    Simulates database migration impact (e.g. PostgreSQL -> CockroachDB, MySQL -> PostgreSQL).
    """

    __tablename__ = "database_migration_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    experiment_id = Column(
        String(36),
        ForeignKey("simulation_experiments.id", ondelete="CASCADE"),
        nullable=True,
    )

    source_db = Column(String(100), default="PostgreSQL")
    target_db = Column(String(100), default="CockroachDB")

    schema_compatibility_pct = Column(Float, default=94.0)
    migration_downtime_minutes = Column(Float, default=0.0)
    read_throughput_multiplier = Column(Float, default=3.5)
    write_latency_delta_ms = Column(Float, default=+2.4)

    potential_lock_risks = Column(JSON, default=list)
    step_by_step_migration_plan = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class InfrastructureSimResult(Base):
    """
    Simulates capacity & scaling performance across Kubernetes, ECS, Serverless, Bare Metal.
    """

    __tablename__ = "infrastructure_sim_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    experiment_id = Column(
        String(36),
        ForeignKey("simulation_experiments.id", ondelete="CASCADE"),
        nullable=True,
    )

    technology_stack = Column(String(100), default="Kubernetes")
    target_concurrent_users = Column(Integer, default=100000000)

    predicted_rps = Column(Float, default=450000.0)
    predicted_ram_usage_gb = Column(Float, default=128.0)
    predicted_cpu_cores = Column(Integer, default=64)
    bottleneck_detected = Column(Boolean, default=False)

    capacity_recommendations = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class FailureScenarioResult(Base):
    """
    Simulates chaos engineering outages (e.g. What if Kafka goes down? DB primary crash).
    """

    __tablename__ = "failure_scenario_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    experiment_id = Column(
        String(36),
        ForeignKey("simulation_experiments.id", ondelete="CASCADE"),
        nullable=True,
    )

    outage_type = Column(String(100), default="Kafka Broker Down")
    cascading_failure_risk = Column(Float, default=11.2)
    resilience_score = Column(Float, default=93.5)

    impacted_services = Column(JSON, default=list)
    circuit_breaker_activations = Column(JSON, default=list)
    recovery_time_seconds = Column(Float, default=3.8)

    created_at = Column(DateTime, default=datetime.utcnow)


class BlackFridaySimResult(Base):
    """
    Simulates Black Friday / High-traffic surge load testing.
    """

    __tablename__ = "black_friday_sim_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    experiment_id = Column(
        String(36),
        ForeignKey("simulation_experiments.id", ondelete="CASCADE"),
        nullable=True,
    )

    traffic_multiplier = Column(Float, default=10.0)
    concurrent_requests_per_sec = Column(Integer, default=280000)

    p95_latency_ms = Column(Float, default=42.0)
    p99_latency_ms = Column(Float, default=115.0)
    error_rate_pct = Column(Float, default=0.015)
    auto_scale_pods_required = Column(Integer, default=120)

    system_status = Column(String(50), default="SURVIVED")

    created_at = Column(DateTime, default=datetime.utcnow)


class DependencyUpgradeResult(Base):
    """
    ⭐ Feature 5: Dependency Upgrade Simulator.
    """

    __tablename__ = "dependency_upgrade_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    source_dependency = Column(String(100), default="Spring Boot 2.7")
    target_dependency = Column(String(100), default="Spring Boot 3.2")

    breaking_apis_count = Column(Integer, default=8)
    deprecated_methods_count = Column(Integer, default=24)
    required_code_changes = Column(JSON, default=list)
    estimated_migration_effort_hours = Column(Float, default=32.0)

    created_at = Column(DateTime, default=datetime.utcnow)


class SecurityAttackSimResult(Base):
    """
    ⭐ Feature 8: Security Attack Simulator.
    """

    __tablename__ = "security_attack_sim_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    attack_vector = Column(String(100), default="SQL Injection & Supply Chain")
    resilience_score = Column(Float, default=94.5)
    vulnerabilities_exploited = Column(JSON, default=list)
    mitigation_steps = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class TeamGrowthSimResult(Base):
    """
    ⭐ Features 26–40: Team Growth & Productivity Simulation.
    """

    __tablename__ = "team_growth_sim_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    current_team_size = Column(Integer, default=10)
    target_team_size = Column(Integer, default=50)

    predicted_sprint_velocity = Column(Float, default=240.0)
    communication_overhead_pct = Column(Float, default=18.5)
    merge_conflict_frequency_pct = Column(Float, default=8.2)

    onboarding_timeline_weeks = Column(Integer, default=4)

    created_at = Column(DateTime, default=datetime.utcnow)


class DigitalEngineeringLabSession(Base):
    """
    🌟 Signature Feature: Digital Engineering Laboratory & Command Center.
    Inputs: 50M Users, AWS, CockroachDB, Redis Cluster, Kafka, Kubernetes.
    Outputs: Architecture Score 91%, Cost $87,000/mo, Latency 72ms, Risk Medium, Confidence 89%.
    """

    __tablename__ = "digital_engineering_lab_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    scenario_name = Column(String(255), default="Scale to 50 Million Users")
    platform = Column(String(100), default="AWS")
    database = Column(String(100), default="CockroachDB")
    cache = Column(String(100), default="Redis Cluster")
    messaging = Column(String(100), default="Kafka")
    deployment = Column(String(100), default="Kubernetes")

    architecture_score = Column(Float, default=91.0)
    estimated_monthly_cost_usd = Column(Float, default=87000.0)
    expected_latency_ms = Column(Float, default=72.0)
    risk_level = Column(String(50), default="Medium")
    confidence_pct = Column(Float, default=89.0)

    recommended_changes = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)
