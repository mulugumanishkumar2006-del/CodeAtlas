import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class ProductionBaselineDBModel(Base):
    __tablename__ = "v31_launch_baselines"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    availability_percentage = Column(Float, default=99.95)
    api_p99_latency_ms = Column(Float, default=24.5)
    analysis_completion_seconds = Column(Float, default=18.2)
    ai_response_seconds = Column(Float, default=0.85)
    mttr_seconds = Column(Float, default=75.0)
    measured_at = Column(DateTime, default=datetime.datetime.utcnow)


class RunbookEntryDBModel(Base):
    __tablename__ = "v31_launch_runbooks"

    id = Column(String, primary_key=True, index=True)
    runbook_code = Column(String, unique=True, index=True, nullable=False)  # API_OUTAGE, DB_OUTAGE, REDIS_OUTAGE
    title = Column(String, nullable=False)
    severity = Column(String, default="SEV-1")
    owner = Column(String, nullable=False)
    steps = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PublicStatusPageDBModel(Base):
    __tablename__ = "v31_launch_status"

    id = Column(String, primary_key=True, index=True)
    component_name = Column(String, nullable=False)  # API, Frontend, Ingestion, AI, Agents
    status = Column(String, default="OPERATIONAL")  # OPERATIONAL, DEGRADED, PARTIAL_OUTAGE, MAJOR_OUTAGE
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)


class ProductAnalyticsMetricDBModel(Base):
    __tablename__ = "v31_launch_analytics"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    active_users_count = Column(Integer, default=12)
    daily_ai_queries_count = Column(Integer, default=145)
    daily_agent_executions_count = Column(Integer, default=28)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)


class BetaProgramUserDBModel(Base):
    __tablename__ = "v31_launch_beta_users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    organization_id = Column(String, nullable=False)
    status = Column(String, default="ACTIVE")  # INVITED, ACTIVE, GRADUATED
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)
