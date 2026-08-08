import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class InvestigationStateModel(Base):
    __tablename__ = "investigation_states"

    investigation_id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    workspace_id = Column(String, index=True, nullable=True)
    question = Column(Text, nullable=False)
    hypothesis = Column(Text, nullable=True)
    evidence = Column(JSON, nullable=False, default=list)
    findings = Column(JSON, nullable=False, default=list)
    rejected_hypotheses = Column(JSON, nullable=False, default=list)
    conclusion = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=True)
    validation_status = Column(String, default="IN_PROGRESS")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ReasoningEvalRecordModel(Base):
    __tablename__ = "reasoning_eval_records"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    query = Column(Text, nullable=False)
    intent = Column(String, nullable=False)
    factual_accuracy = Column(Float, nullable=False)
    grounding_score = Column(Float, nullable=False)
    evidence_correctness = Column(Float, nullable=False)
    hallucination_rate = Column(Float, nullable=False)
    uncertainty_handling_score = Column(Float, nullable=False)
    usefulness_score = Column(Float, nullable=False)
    latency_ms = Column(Float, nullable=False)
    cost_usd = Column(Float, nullable=False)
    passed = Column(Boolean, nullable=False, default=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
