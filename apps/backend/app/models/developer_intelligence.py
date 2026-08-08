import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class DecisionRecordDBModel(Base):
    __tablename__ = "dev_decision_records"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    investigation_question = Column(Text, nullable=False)
    chosen_option_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    evidence_ids = Column(JSON, nullable=False, default=list)
    tradeoffs = Column(JSON, nullable=False, default=list)
    rejected_alternatives = Column(JSON, nullable=False, default=list)
    validation_plan = Column(JSON, nullable=False, default=list)
    owner = Column(String, default="Staff Software Engineer")
    status = Column(String, default="RECORDED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ImplementationPlanDBModel(Base):
    __tablename__ = "dev_implementation_plans"

    id = Column(String, primary_key=True, index=True)
    decision_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    title = Column(String, nullable=False)
    affected_files = Column(JSON, nullable=False, default=list)
    affected_components = Column(JSON, nullable=False, default=list)
    dependency_changes = Column(JSON, nullable=False, default=list)
    api_changes = Column(JSON, nullable=False, default=list)
    db_changes = Column(JSON, nullable=False, default=list)
    configuration_changes = Column(JSON, nullable=False, default=list)
    tests_to_run = Column(JSON, nullable=False, default=list)
    migration_steps = Column(JSON, nullable=False, default=list)
    deployment_checklist = Column(JSON, nullable=False, default=list)
    rollback_steps = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PlanVsActualDBModel(Base):
    __tablename__ = "dev_plan_vs_actual"

    id = Column(String, primary_key=True, index=True)
    plan_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    planned_components = Column(JSON, nullable=False, default=list)
    actual_components = Column(JSON, nullable=False, default=list)
    expected_changes = Column(JSON, nullable=False, default=list)
    unexpected_changes = Column(JSON, nullable=False, default=list)
    missing_changes = Column(JSON, nullable=False, default=list)
    fidelity_score = Column(Float, default=95.0)
    ai_review_summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
