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


class WSKGNode(Base):
    """
    Represents an entity node in the World Software Knowledge Graph (WSKG).
    """

    __tablename__ = "wskg_nodes"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, index=True)
    label = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    ecosystem = Column(String(100), default="global", index=True)
    description = Column(Text, nullable=True)

    website_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    popularity_score = Column(Float, default=50.0)
    maturity_level = Column(String(50), default="stable")
    properties = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WSKGEdge(Base):
    """
    Represents a directed relationship edge between two WSKG nodes.
    """

    __tablename__ = "wskg_edges"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id = Column(
        String(64),
        ForeignKey("wskg_nodes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    target_id = Column(
        String(64),
        ForeignKey("wskg_nodes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    relationship_type = Column(String(50), nullable=False, index=True)
    weight = Column(Float, default=1.0)
    description = Column(Text, nullable=True)
    properties = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)


class WSKGIngestionJob(Base):
    __tablename__ = "wskg_ingestion_jobs"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_name = Column(String(100), nullable=False)
    status = Column(String(50), default="running")
    nodes_extracted = Column(Integer, default=0)
    edges_extracted = Column(Integer, default=0)
    details = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class WSKGReasoningQuery(Base):
    __tablename__ = "wskg_reasoning_queries"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    prompt = Column(Text, nullable=False)
    repository_id = Column(String(36), nullable=True)
    synthesized_answer = Column(Text, nullable=False)
    recommended_nodes = Column(JSON, default=list)
    confidence_score = Column(Float, default=0.95)

    created_at = Column(DateTime, default=datetime.utcnow)


class WSKGTechMigrationPath(Base):
    __tablename__ = "wskg_tech_migration_paths"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    from_technology = Column(String(255), nullable=False, index=True)
    to_technology = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    estimated_effort_weeks = Column(Float, default=2.0)
    complexity_score = Column(Float, default=5.0)
    migration_steps = Column(JSON, default=list)
    risk_factors = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class WSKGCaseStudy(Base):
    __tablename__ = "wskg_case_studies"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    company_name = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    architecture_type = Column(String(100), nullable=False)
    tech_stack = Column(JSON, default=list)
    key_takeaways = Column(JSON, default=list)
    scale_metrics = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)


class WSKGLearningPath(Base):
    __tablename__ = "wskg_learning_paths"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    topic = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    target_role = Column(String(100), default="Senior Software Engineer")
    milestones = Column(JSON, default=list)
    faqs = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


# 🌟 Signature Feature: World Software Atlas Node
class WSKGWorldAtlasNode(Base):
    """
    Represents a node in the Signature World Software Atlas zoom hierarchy.
    Zoom Levels: earth, domain, language, framework, database, infra, repository, package, symbol
    """

    __tablename__ = "wskg_world_atlas_nodes"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    parent_id = Column(
        String(64),
        ForeignKey("wskg_world_atlas_nodes.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    zoom_level = Column(String(50), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    child_count = Column(Integer, default=0)
    node_metadata = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
