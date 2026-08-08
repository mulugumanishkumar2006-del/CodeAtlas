import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class OptimizationOpportunityDBModel(Base):
    __tablename__ = "gopt_opportunities"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    opportunity_title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # COST, PERFORMANCE, RELIABILITY, ARCHITECTURE, TECH_DEBT, PRODUCTIVITY
    target_entity = Column(String, nullable=False)
    potential_monthly_savings_usd = Column(Float, default=0.0)
    expected_impact_score = Column(Float, default=85.0)
    risk_level = Column(String, default="LOW_RISK")
    urgency = Column(String, default="HIGH")
    status = Column(String, default="IDENTIFIED")  # IDENTIFIED, PLANNED, EXECUTING, VERIFIED, REJECTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OptimizationStrategyDBModel(Base):
    __tablename__ = "gopt_strategies"

    id = Column(String, primary_key=True, index=True)
    opportunity_id = Column(String, index=True, nullable=False)
    strategy_name = Column(String, nullable=False)  # Minimal Change, Moderate Refactor, Major Architecture Migration
    estimated_effort_days = Column(Integer, default=3)
    projected_cost_delta_usd = Column(Float, default=-250.0)
    projected_reliability_score = Column(Float, default=99.2)
    confidence = Column(Float, default=0.94)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OptimizationExperimentDBModel(Base):
    __tablename__ = "gopt_experiments"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    experiment_name = Column(String, nullable=False)
    baseline_metrics = Column(JSON, nullable=False, default=dict)
    treatment_metrics = Column(JSON, nullable=False, default=dict)
    status = Column(String, default="RUNNING")  # RUNNING, COMPLETED, ROLLED_BACK
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OptimizationPlanRecordDBModel(Base):
    __tablename__ = "gopt_plans"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    plan_title = Column(String, nullable=False)
    actions_sequence = Column(JSON, nullable=False, default=list)
    verification_metrics = Column(JSON, nullable=False, default=list)
    rollback_plan = Column(Text, nullable=False)
    status = Column(String, default="PROPOSED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OptimizationMemoryEntryDBModel(Base):
    __tablename__ = "gopt_memory"

    id = Column(String, primary_key=True, index=True)
    problem_type = Column(String, nullable=False)
    applied_strategy = Column(String, nullable=False)
    measured_outcome_delta = Column(JSON, nullable=False, default=dict)
    confidence_delta = Column(Float, default=0.05)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)
