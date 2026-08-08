import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class KnowledgeEntityDBModel(Base):
    __tablename__ = "kf_entities"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    entity_type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    provenance_source = Column(String, default="ADR-001 / Commit Log")
    validation_status = Column(String, default="HUMAN_VERIFIED")
    freshness = Column(String, default="FRESH")
    confidence = Column(Float, default=0.96)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class KnowledgeRelationDBModel(Base):
    __tablename__ = "kf_relations"

    id = Column(String, primary_key=True, index=True)
    source_entity_id = Column(String, index=True, nullable=False)
    target_entity_id = Column(String, index=True, nullable=False)
    relation_type = Column(String, nullable=False)
    evidence_summary = Column(Text, nullable=False)
    confidence = Column(Float, default=0.95)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class KnowledgeConflictDBModel(Base):
    __tablename__ = "kf_conflicts"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    entity_id = Column(String, index=True, nullable=False)
    entity_name = Column(String, nullable=False)
    statement_a = Column(Text, nullable=False)
    source_a = Column(String, nullable=False)
    statement_b = Column(Text, nullable=False)
    source_b = Column(String, nullable=False)
    status = Column(String, default="REVIEW_REQUIRED")
    confidence = Column(Float, default=0.92)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
