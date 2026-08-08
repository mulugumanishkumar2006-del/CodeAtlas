import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class PreventionPlanDBModel(Base):
    __tablename__ = "prev_plans"

    id = Column(String, primary_key=True, index=True)
    prediction_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    target_entity = Column(String, nullable=False)
    objective = Column(Text, nullable=False)
    problem_summary = Column(Text, nullable=False)
    chosen_option_id = Column(String, nullable=False)
    affected_files = Column(JSON, nullable=False, default=list)
    affected_components = Column(JSON, nullable=False, default=list)
    expected_dependencies = Column(JSON, nullable=False, default=list)
    api_changes = Column(JSON, nullable=False, default=list)
    db_changes = Column(JSON, nullable=False, default=list)
    config_changes = Column(JSON, nullable=False, default=list)
    task_breakdown = Column(JSON, nullable=False, default=list)
    validation_plan = Column(JSON, nullable=False, default=list)
    success_criteria = Column(JSON, nullable=False, default=list)
    rollback_steps = Column(JSON, nullable=False, default=list)
    status = Column(String, default="PLANNING")
    outcome = Column(String, default="UNKNOWN")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PreventionOutcomeDBModel(Base):
    __tablename__ = "prev_outcomes"

    id = Column(String, primary_key=True, index=True)
    plan_id = Column(String, index=True, nullable=False)
    actual_outcome = Column(String, nullable=False)
    measured_risk_reduction = Column(Float, default=45.0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class RecurrencePatternDBModel(Base):
    __tablename__ = "prev_recurrence"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    entity_name = Column(String, index=True, nullable=False)
    occurrence_count = Column(Float, default=3.0)
    risk_type = Column(String, default="COUPLING_DRIFT")
    previous_interventions = Column(JSON, nullable=False, default=list)
    previous_outcomes = Column(JSON, nullable=False, default=list)
    recommended_action = Column(Text, nullable=False)
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
