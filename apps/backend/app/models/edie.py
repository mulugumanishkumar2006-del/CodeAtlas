import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    String,
    Text,
)

from app.core.database import Base


class EngineeringDecisionModel(Base):
    """
    Stores core Engineering Decision Record (EDR/ADR) memory for EDIE.
    """

    __tablename__ = "engineering_decisions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(String(255), index=True, nullable=False)

    title = Column(String(255), nullable=False, index=True)
    decision_type = Column(String(50), default="ARCHITECTURE", index=True)
    status = Column(String(50), default="ACCEPTED", index=True)

    context = Column(Text, nullable=True)
    decision = Column(Text, nullable=False)
    consequences = Column(Text, nullable=True)

    alternatives_considered = Column(JSON, default=list)
    sources = Column(JSON, default=list)
    author = Column(String(100), default="Lead Architect")
    tags = Column(JSON, default=list)

    impact_score = Column(Float, default=85.0)
    confidence_score = Column(Float, default=0.95)
    health_status = Column(String(50), default="HEALTHY")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DecisionGraphNodeModel(Base):
    """
    Represents a node in the Engineering Decision Graph.
    """

    __tablename__ = "decision_graph_nodes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(String(255), index=True, nullable=False)

    label = Column(String(255), nullable=False)
    node_type = Column(String(50), default="DECISION", index=True)
    properties = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)


class DecisionGraphEdgeModel(Base):
    """
    Represents a typed relationship edge in the Engineering Decision Graph.
    """

    __tablename__ = "decision_graph_edges"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(String(255), index=True, nullable=False)

    source_id = Column(String(36), index=True, nullable=False)
    target_id = Column(String(36), index=True, nullable=False)
    relation_type = Column(String(50), default="DEPENDS_ON", index=True)

    weight = Column(Float, default=1.0)
    metadata_json = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)


class DecisionValidationModel(Base):
    """
    Tracks architectural drift and compliance validation for an engineering decision.
    """

    __tablename__ = "decision_validations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    decision_id = Column(String(36), index=True, nullable=False)
    repository_id = Column(String(255), index=True, nullable=False)

    is_valid = Column(Boolean, default=True)
    drift_status = Column(String(50), default="ALIGNED", index=True)
    explanation = Column(Text, nullable=True)
    violations_found = Column(JSON, default=list)

    last_validated_at = Column(DateTime, default=datetime.utcnow)


class DecisionTimelineEventModel(Base):
    """
    Tracks chronological timeline events for decisions across system history.
    """

    __tablename__ = "decision_timeline_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    decision_id = Column(String(36), index=True, nullable=False)
    repository_id = Column(String(255), index=True, nullable=False)

    event_type = Column(String(50), default="CREATED", index=True)
    description = Column(Text, nullable=False)
    actor = Column(String(100), default="System")

    timestamp = Column(DateTime, default=datetime.utcnow)


class FutureRecommendationModel(Base):
    """
    Stores AI-predicted future recommendations based on historical decision trends.
    """

    __tablename__ = "future_recommendations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(String(255), index=True, nullable=False)

    title = Column(String(255), nullable=False)
    recommendation = Column(Text, nullable=False)
    impact = Column(String(50), default="HIGH")
    rationale = Column(Text, nullable=True)
    related_decision_ids = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)
