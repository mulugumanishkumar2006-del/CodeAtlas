import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)

from app.core.database import Base


class RefactoringScanReport(Base):
    """
    Represents a full-repository AST and Knowledge Graph refactoring scan.
    """

    __tablename__ = "refactoring_scan_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    scan_status = Column(String(50), default="completed", index=True)
    total_files_scanned = Column(Integer, default=0)
    total_opportunities_found = Column(Integer, default=0)
    god_classes_count = Column(Integer, default=0)
    god_functions_count = Column(Integer, default=0)
    dead_code_count = Column(Integer, default=0)
    duplicate_blocks_count = Column(Integer, default=0)
    circular_deps_count = Column(Integer, default=0)

    overall_health_score = Column(Float, default=72.0)
    refactoring_debt_score = Column(Float, default=28.0)
    repository_cleanup_score = Column(Float, default=74.5)
    module_cohesion_score = Column(Float, default=81.0)

    summary_metrics = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RefactoringOpportunity(Base):
    """
    Represents a specific refactoring opportunity detected across code smells.
    Smell categories: god_class, god_function, dead_code, duplicate_code, circular_dependency,
    long_method, feature_envy, data_clumps, primitive_obsession, large_module,
    naming_smell, layer_violation, complex_switch, excessive_inheritance, generic_code.
    """

    __tablename__ = "refactoring_opportunities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    scan_report_id = Column(
        String(36),
        ForeignKey("refactoring_scan_reports.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    smell_type = Column(String(50), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_file = Column(String(500), nullable=False)
    target_symbol = Column(String(255), nullable=True)
    line_range = Column(String(100), nullable=True)

    # Multi-variable Priority Scores
    priority_score = Column(Float, default=50.0, index=True)
    business_value = Column(Float, default=70.0)
    engineering_cost = Column(Float, default=30.0)
    risk_score = Column(Float, default=20.0)
    tech_debt_impact = Column(Float, default=80.0)
    customer_impact = Column(Float, default=50.0)

    recommended_action = Column(Text, nullable=True)
    refactoring_pattern = Column(String(100), nullable=True)

    status = Column(String(50), default="detected", index=True)
    metadata_json = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RefactoringPlan(Base):
    """
    Represents an AI multi-week modernization execution plan.
    """

    __tablename__ = "refactoring_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title = Column(String(255), default="AI Refactoring Modernization Plan")
    timeframe = Column(String(50), default="4_weeks")
    total_stages = Column(Integer, default=4)
    status = Column(String(50), default="draft", index=True)

    stages_json = Column(JSON, default=list)
    total_estimated_roi_pct = Column(Float, default=165.0)
    total_estimated_hours = Column(Float, default=120.0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ModernizationRoadmap(Base):
    """
    Quarterly/Monthly/Sprint repository modernization roadmap.
    """

    __tablename__ = "modernization_roadmaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    quarter = Column(String(20), default="Q3-2026")
    roadmap_summary = Column(Text, nullable=True)

    sprints_breakdown = Column(JSON, default=list)
    team_assignments = Column(JSON, default=dict)
    roi_analysis = Column(JSON, default=dict)
    cost_estimation_usd = Column(Float, default=22500.0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DecompositionCandidate(Base):
    """
    Monolith decomposition recommendation (Modular Monolith or Microservices candidate).
    """

    __tablename__ = "decomposition_candidates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    service_name = Column(String(255), nullable=False)
    architecture_type = Column(String(50), default="modular_monolith")
    domain_boundary = Column(String(255), nullable=False)

    included_modules = Column(JSON, default=list)
    suggested_api_contracts = Column(JSON, default=list)
    coupling_reduction_pct = Column(Float, default=45.0)
    complexity_delta = Column(Float, default=-30.0)

    status = Column(String(50), default="proposed")

    created_at = Column(DateTime, default=datetime.utcnow)


class RefactoringSimulationRun(Base):
    """
    Simulation dry-run for predicting safety and behavioral impact before execution.
    """

    __tablename__ = "refactoring_simulation_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    opportunity_id = Column(String(36), nullable=True)

    simulation_name = Column(String(255), nullable=False)
    simulated_diff = Column(Text, nullable=True)

    safety_score = Column(Float, default=96.5)
    breaking_change_risk = Column(Float, default=3.5)
    test_coverage_pass_rate = Column(Float, default=100.0)

    validation_checks = Column(JSON, default=list)
    recommended_pr_title = Column(String(255), nullable=True)
    generated_pr_branch = Column(String(255), nullable=True)
    status = Column(String(50), default="passed")

    created_at = Column(DateTime, default=datetime.utcnow)


class ArchitectureDecisionRecord(Base):
    """
    ⭐ Feature 32: Automated Architecture Decision Record (ADR) Generation.
    """

    __tablename__ = "architecture_decision_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    adr_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    status = Column(
        String(50), default="accepted"
    )  # proposed, accepted, superseded, deprecated
    context = Column(Text, nullable=False)
    decision = Column(Text, nullable=False)
    consequences = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)


class RefactoringStudioSession(Base):
    """
    🌟 Signature Feature: AI Refactoring Studio Session
    Simulates repository transformation from 72% health -> 93% health across 4 sprints.
    """

    __tablename__ = "refactoring_studio_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    session_name = Column(
        String(255), default="Full Repository Modernization Simulation"
    )
    baseline_health_score = Column(Float, default=72.0)
    target_health_score = Column(Float, default=93.0)

    tech_debt_delta_pct = Column(Float, default=-41.0)
    build_time_delta_pct = Column(Float, default=-18.0)
    deployment_risk_delta_pct = Column(Float, default=-33.0)
    developer_productivity_delta_pct = Column(Float, default=29.0)

    sprints_timeline = Column(JSON, default=list)
    simulation_replay_steps = Column(JSON, default=list)
    status = Column(String(50), default="active")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
