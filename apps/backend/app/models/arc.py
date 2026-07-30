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


class ReleaseValidationSession(Base):
    """
    Represents an AI Release Commander (ARC) validation session for a specific release version.
    """

    __tablename__ = "release_validation_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    release_version = Column(String(50), default="v3.2.0", nullable=False, index=True)
    overall_readiness_score = Column(Float, default=94.0)
    deployment_risk_level = Column(String(50), default="LOW")

    incident_probability_pct = Column(Float, default=4.0)
    rollback_probability_pct = Column(Float, default=2.0)
    hotfix_likelihood_pct = Column(Float, default=1.5)
    confidence_score_pct = Column(Float, default=96.0)

    estimated_deployment_time_minutes = Column(Integer, default=12)
    status = Column(String(50), default="ready_for_production", index=True)

    summary_metrics = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ReleaseChecklistItem(Base):
    """
    Represents a repository-specific pre-deployment checklist item.
    """

    __tablename__ = "release_checklist_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("release_validation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    item_name = Column(String(255), nullable=False)
    category = Column(String(50), default="database")
    status = Column(String(50), default="approved")
    details = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


class APIBreakingChange(Base):
    """
    Represents a detected API breaking change or schema incompatibility.
    """

    __tablename__ = "api_breaking_changes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("release_validation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    endpoint = Column(String(255), nullable=False)
    http_method = Column(String(20), default="POST")
    change_type = Column(String(50), default="schema_mutation")
    severity = Column(String(50), default="HIGH")
    description = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


class DatabaseMigrationValidation(Base):
    """
    Validates DB migration safety, lock duration, downtime risk, and consistency.
    """

    __tablename__ = "database_migration_validations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("release_validation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    migration_file = Column(String(255), nullable=False)
    predicted_lock_duration_seconds = Column(Float, default=1.2)
    downtime_risk_level = Column(String(50), default="LOW")
    rollback_complexity = Column(String(50), default="LOW")
    is_approved = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)


class CanaryRolloutPlan(Base):
    """
    Represents a progressive canary deployment plan with traffic percentages and promotion rules.
    """

    __tablename__ = "canary_rollout_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("release_validation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    initial_traffic_pct = Column(Float, default=10.0)
    progression_steps = Column(JSON, default=list)
    health_metrics_monitored = Column(JSON, default=list)
    auto_rollback_threshold_error_pct = Column(Float, default=0.5)

    created_at = Column(DateTime, default=datetime.utcnow)


class RollbackStrategyPlan(Base):
    """
    Represents an automated rollback strategy sequence and DB recovery steps.
    """

    __tablename__ = "rollback_strategy_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("release_validation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    rollback_sequence = Column(JSON, default=list)
    db_recovery_script = Column(Text, nullable=True)
    cache_restoration_plan = Column(Text, nullable=True)
    recovery_time_objective_seconds = Column(Float, default=30.0)

    created_at = Column(DateTime, default=datetime.utcnow)


class EnvironmentParityValidation(Base):
    """
    ⭐ Feature 14: Environment Parity & Infrastructure Readiness Validator.
    """

    __tablename__ = "environment_parity_validations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("release_validation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    k8s_manifest_status = Column(String(50), default="VALIDATED")
    terraform_audit_status = Column(String(50), default="PASSED")
    docker_image_vulnerability_count = Column(Integer, default=0)

    environment_diffs = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class SLOValidationResult(Base):
    """
    ⭐ Features 26–30: Error Budget & SLO/SLA Risk Estimator.
    """

    __tablename__ = "slo_validation_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("release_validation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    error_budget_remaining_pct = Column(Float, default=94.2)
    slo_burn_rate = Column(Float, default=0.02)
    sla_violation_risk_pct = Column(Float, default=0.5)

    distributed_tracing_readiness = Column(Boolean, default=True)
    logging_coverage_pct = Column(Float, default=98.5)

    created_at = Column(DateTime, default=datetime.utcnow)


class MultiTeamApprovalWorkflow(Base):
    """
    ⭐ Feature 42 & 49: Multi-team & Compliance Approval Workflow.
    """

    __tablename__ = "multi_team_approval_workflows"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("release_validation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    devops_approved = Column(Boolean, default=True)
    security_approved = Column(Boolean, default=True)
    architecture_approved = Column(Boolean, default=True)
    product_approved = Column(Boolean, default=True)
    compliance_passed = Column(Boolean, default=True)

    approvals_json = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)
