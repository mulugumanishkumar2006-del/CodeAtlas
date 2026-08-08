import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class AutonomyPolicyDBModel(Base):
    __tablename__ = "auto_ops_policies"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    max_allowed_autonomy_level = Column(Integer, default=3)  # Levels 0-5
    allowed_actions = Column(JSON, nullable=False, default=list)
    blocked_actions = Column(JSON, nullable=False, default=list)
    require_approval_risk_level = Column(String, default="HIGH_RISK")
    max_execution_budget_usd = Column(Float, default=50.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)


class AutonomousOperationPlanDBModel(Base):
    __tablename__ = "auto_ops_plans"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    objective = Column(String, nullable=False)
    target_service = Column(String, nullable=False)
    risk_classification = Column(String, default="MEDIUM_RISK")
    autonomy_level_required = Column(Integer, default=3)
    status = Column(String, default="PENDING_APPROVAL")  # PENDING_APPROVAL, SIMULATED, EXECUTING, COMPLETED, ROLLED_BACK
    actions_sequence = Column(JSON, nullable=False, default=list)
    rollback_strategy = Column(Text, nullable=False)
    verification_criteria = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ActionExecutionJournalDBModel(Base):
    __tablename__ = "auto_ops_journal"

    id = Column(String, primary_key=True, index=True)
    plan_id = Column(String, index=True, nullable=False)
    agent_id = Column(String, nullable=False)
    tool_name = Column(String, nullable=False)
    action_risk = Column(String, default="LOW_RISK")
    execution_status = Column(String, default="SUCCESS")
    output_summary = Column(Text, nullable=False)
    executed_at = Column(DateTime, default=datetime.datetime.utcnow)


class ApprovalRequestDBModel(Base):
    __tablename__ = "auto_ops_approvals"

    id = Column(String, primary_key=True, index=True)
    plan_id = Column(String, index=True, nullable=False)
    requester_agent = Column(String, nullable=False)
    required_role = Column(String, default="PLATFORM_LEAD")
    status = Column(String, default="PENDING")  # PENDING, APPROVED, REJECTED
    approved_by = Column(String, nullable=True)
    decision_reason = Column(Text, nullable=True)
    requested_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentStrategyMemoryDBModel(Base):
    __tablename__ = "auto_ops_strategy_memory"

    id = Column(String, primary_key=True, index=True)
    problem_pattern = Column(String, nullable=False)
    service_type = Column(String, nullable=False)
    successful_strategy = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.92)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)


class EmergencyStopRecordDBModel(Base):
    __tablename__ = "auto_ops_emergency_stop"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    triggered_by = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    triggered_at = Column(DateTime, default=datetime.datetime.utcnow)
