import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class RecoveryStrategyDBModel(Base):
    __tablename__ = "sheal_strategies"

    id = Column(String, primary_key=True, index=True)
    strategy_name = Column(String, nullable=False)
    failure_category = Column(String, nullable=False)  # TRANSIENT, RESOURCE, DEPENDENCY, DEPLOYMENT
    action_type = Column(String, nullable=False)  # RESTART, SCALE, ROLLBACK, CIRCUIT_BREAKER
    preconditions = Column(JSON, nullable=False, default=list)
    risk_level = Column(String, default="LOW_RISK")
    historical_success_rate = Column(Float, default=0.96)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SelfHealingRunRecordDBModel(Base):
    __tablename__ = "sheal_runs"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    target_service = Column(String, nullable=False)
    failure_type = Column(String, nullable=False)
    state = Column(String, default="DETECTED")  # DETECTED, DIAGNOSING, PLANNED, EXECUTING, VERIFYING, RECOVERED, ESCALATED
    strategy_id = Column(String, nullable=False)
    verification_status = Column(String, default="PENDING")
    execution_time_seconds = Column(Float, default=4.2)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SelfHealingRunbookDBModel(Base):
    __tablename__ = "sheal_runbooks"

    id = Column(String, primary_key=True, index=True)
    runbook_title = Column(String, nullable=False)
    target_service = Column(String, nullable=False)
    version = Column(String, default="v1.0.0")
    trigger_condition = Column(String, nullable=False)
    steps_sequence = Column(JSON, nullable=False, default=list)
    is_validated = Column(Boolean, default=True)
    last_tested_at = Column(DateTime, default=datetime.datetime.utcnow)


class MTTRMetricDBModel(Base):
    __tablename__ = "sheal_mttr"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    service_id = Column(String, nullable=False)
    mean_time_to_detect_seconds = Column(Float, default=12.0)
    mean_time_to_diagnose_seconds = Column(Float, default=18.0)
    mean_time_to_recover_seconds = Column(Float, default=45.0)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)


class RecoveryPolicyDBModel(Base):
    __tablename__ = "sheal_policies"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    allowed_auto_recoveries = Column(JSON, nullable=False, default=list)
    blocked_auto_recoveries = Column(JSON, nullable=False, default=list)
    max_retries_per_failure = Column(Integer, default=2)
    stable_observation_window_seconds = Column(Integer, default=300)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
