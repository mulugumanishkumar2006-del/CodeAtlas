import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class EngineeringEventDBModel(Base):
    __tablename__ = "cont_events"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    event_type = Column(String, nullable=False)
    severity = Column(String, default="MEDIUM")
    change_category = Column(String, default="STRUCTURAL")
    source = Column(String, default="GitHub Webhook")
    summary = Column(Text, nullable=False)
    evidence_summary = Column(Text, nullable=False)
    affected_components = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class GraphVersionDBModel(Base):
    __tablename__ = "cont_graph_versions"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    version_number = Column(Integer, default=1)
    nodes_count = Column(Integer, default=42)
    edges_count = Column(Integer, default=128)
    graph_snapshot = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class NotificationQueueDBModel(Base):
    __tablename__ = "cont_notifications"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    recipient_role = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    priority = Column(String, default="HIGH")
    deduplicated_event_count = Column(Integer, default=1)
    evidence = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
