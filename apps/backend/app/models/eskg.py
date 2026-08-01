import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)

from app.core.database import Base


class ESKGNode(Base):
    """
    Represents an entity node in the Enterprise Software Knowledge Graph (ESKG).
    Covers 10 Entity Layers: repository, microservice, package, function, class, api, database, infrastructure, documentation, business_domain.
    """

    __tablename__ = "eskg_nodes"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, index=True)
    label = Column(String(255), nullable=False)
    entity_type = Column(
        String(50), nullable=False, index=True
    )  # repository, microservice, package, function, class, api, database, infrastructure, documentation, business_domain
    domain = Column(
        String(100), default="core", index=True
    )  # Auth, Payments, Orders, Inventory, Shipping, Notifications, Analytics, Data Platform, Infra
    tier = Column(String(50), default="tier_1")  # tier_0, tier_1, tier_2, tier_3
    status = Column(
        String(50), default="healthy"
    )  # healthy, warning, degraded, critical
    criticality_score = Column(Float, default=85.0)
    owner_team = Column(String(100), default="platform_team")
    description = Column(Text, nullable=True)

    properties = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ESKGEdge(Base):
    """
    Represents a directed dependency or relationship edge between two ESKG nodes.
    Relationship Types: DEPENDS_ON, EXPOSES_API, QUERIES_DATABASE, DEPLOYED_ON, OWNED_BY, DOCUMENTED_BY, CALLS_FUNCTION, IMPLEMENTS_CAPABILITY, PRODUCES_EVENT, CONSUMES_EVENT.
    """

    __tablename__ = "eskg_edges"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id = Column(
        String(64),
        ForeignKey("eskg_nodes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    target_id = Column(
        String(64),
        ForeignKey("eskg_nodes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    relationship_type = Column(String(50), nullable=False, index=True)
    weight = Column(Float, default=1.0)
    description = Column(Text, nullable=True)
    properties = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)


class ESKGSnapshot(Base):
    """
    Represents an ecosystem snapshot of the Enterprise Software Knowledge Graph topology.
    """

    __tablename__ = "eskg_snapshots"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    enterprise_name = Column(String(100), default="Global Enterprise Ecosystem")
    total_nodes = Column(Integer, default=0)
    total_edges = Column(Integer, default=0)
    spof_count = Column(Integer, default=0)
    circular_deps_count = Column(Integer, default=0)
    health_score = Column(Float, default=90.0)
    topology_summary = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)


class ESKGImpactAnalysis(Base):
    """
    Represents a calculated blast radius / impact analysis for an enterprise node.
    """

    __tablename__ = "eskg_impact_analyses"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    target_node_id = Column(String(64), nullable=False, index=True)
    target_node_name = Column(String(255), nullable=False)
    blast_radius_score = Column(Float, default=0.0)
    impacted_nodes_count = Column(Integer, default=0)
    impacted_nodes = Column(JSON, default=list)
    mitigation_recommendations = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class ESKGReasoningQuery(Base):
    """
    Represents an AI reasoning query over the Enterprise Software Knowledge Graph.
    """

    __tablename__ = "eskg_reasoning_queries"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    query_text = Column(Text, nullable=False)
    synthesized_answer = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.95)
    traversed_path = Column(JSON, default=list)
    recommended_actions = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)
