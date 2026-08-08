import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class TemporalCommitModel(Base):
    __tablename__ = "temporal_commits"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    commit_sha = Column(String, index=True, nullable=False)
    parent_sha = Column(String, nullable=True)
    author_name = Column(String, nullable=True)
    author_email = Column(String, nullable=True)
    committed_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    branch = Column(String, default="main")
    message = Column(Text, nullable=False)
    total_files_changed = Column(Integer, default=0)
    added_lines = Column(Integer, default=0)
    removed_lines = Column(Integer, default=0)
    changed_entities = Column(JSON, nullable=False, default=dict)
    analysis_version = Column(String, default="v1.2-temporal")


class TemporalSnapshotModel(Base):
    __tablename__ = "temporal_snapshots"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    commit_sha = Column(String, index=True, nullable=False)
    committed_at = Column(DateTime, default=datetime.datetime.utcnow)
    graph_state = Column(JSON, nullable=False, default=dict)
    architecture_state = Column(JSON, nullable=False, default=dict)
    health_score = Column(Float, default=100.0)


class ArchitectureDriftRecordModel(Base):
    __tablename__ = "architecture_drift_records"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    rule_name = Column(String, nullable=False)
    declared_architecture = Column(Text, nullable=False)
    observed_architecture = Column(Text, nullable=False)
    relationship = Column(String, nullable=False)
    evidence = Column(Text, nullable=False)
    severity = Column(String, default="MEDIUM")
    confidence = Column(Float, default=1.0)
    trend = Column(String, default="NEW")
    first_seen_commit = Column(String, nullable=False)
    latest_seen_commit = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class CoChangeRecordModel(Base):
    __tablename__ = "co_change_records"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    component_a = Column(String, index=True, nullable=False)
    component_b = Column(String, index=True, nullable=False)
    co_change_frequency = Column(Integer, default=1)
    shared_commits = Column(JSON, nullable=False, default=list)
    strength_score = Column(Float, default=0.0)
    label = Column(String, default="Historical co-change")
