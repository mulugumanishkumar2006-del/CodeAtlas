import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class AgentTaskDBModel(Base):
    __tablename__ = "auto_tasks"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    objective = Column(Text, nullable=False)
    requester = Column(String, default="Engineering System")
    state = Column(String, default="WAITING_FOR_APPROVAL")
    autonomy_level = Column(Integer, default=0)
    risk_score = Column(Float, default=35.0)
    proposed_diff = Column(Text, nullable=False)
    validation_matrix = Column(JSON, nullable=False, default=list)
    approvals = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentPolicyDBModel(Base):
    __tablename__ = "auto_policies"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    autonomy_level = Column(Integer, default=0)
    allowed_commands = Column(JSON, nullable=False, default=list)
    blocked_commands = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentAuditTrailDBModel(Base):
    __tablename__ = "auto_audit"

    id = Column(String, primary_key=True, index=True)
    task_id = Column(String, index=True, nullable=False)
    agent_role = Column(String, nullable=False)
    action_taken = Column(Text, nullable=False)
    policy_applied = Column(String, nullable=False)
    result_status = Column(String, default="SUCCESS")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
