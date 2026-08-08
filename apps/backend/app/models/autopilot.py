import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class AutopilotRunDBModel(Base):
    __tablename__ = "autopilot_runs"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    user = Column(String, default="Staff Software Engineer")
    trigger = Column(String, nullable=False)
    objective = Column(Text, nullable=False)
    status = Column(String, default="DETECTED")
    risk_level = Column(String, default="MEDIUM")
    approved_scopes = Column(JSON, nullable=False, default=list)
    steps = Column(JSON, nullable=False, default=list)
    approvals = Column(JSON, nullable=False, default=list)
    cost_accumulated = Column(Float, default=0.05)
    max_cost_limit = Column(Float, default=2.00)
    plan_summary = Column(Text, nullable=True)
    simulation_summary = Column(Text, nullable=True)
    diff_summary = Column(Text, nullable=True)
    audit_logs = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class AutopilotAuditLogDBModel(Base):
    __tablename__ = "autopilot_audit_logs"

    id = Column(String, primary_key=True, index=True)
    run_id = Column(String, index=True, nullable=False)
    user = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
