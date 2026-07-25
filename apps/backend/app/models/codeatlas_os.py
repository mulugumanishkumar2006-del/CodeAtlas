# apps/backend/app/models/codeatlas_os.py

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class OSKernelSession(Base):
    __tablename__ = "os_kernel_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_name = Column(String(255), nullable=False)
    status = Column(
        String(50), default="RUNNING", nullable=False
    )  # RUNNING, IDLE, PAUSED
    kernel_version = Column(String(50), default="20.0.0-OS", nullable=False)
    active_subsystems_json = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    queries = relationship(
        "UniversalQueryEvent", back_populates="session", cascade="all, delete-orphan"
    )


class ToolAdapterIntegration(Base):
    __tablename__ = "tool_adapter_integrations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tool_name = Column(
        String(50), nullable=False, index=True
    )  # GitHub, GitLab, Jira, Slack, Azure DevOps, Kubernetes, Datadog, Grafana, Prometheus
    category = Column(
        String(50), nullable=False
    )  # SCM, PM, Quality, Observability, Docs, Security, CICD, Chat, K8s
    status = Column(
        String(50), default="CONNECTED", nullable=False
    )  # CONNECTED, SYNCING, ERROR
    endpoint_url = Column(String(255), nullable=True)
    last_sync_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (Index("idx_tool_adapter_name", "tool_name"),)


class UniversalQueryEvent(Base):
    __tablename__ = "universal_query_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(
        String(36),
        ForeignKey("os_kernel_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )
    query_text = Column(Text, nullable=False)
    category = Column(
        String(50), nullable=False
    )  # Scalability, Latency, Modernization, ROI, Ownership, Release
    answer_summary = Column(Text, nullable=False)
    confidence_score = Column(String(10), default="96.5%", nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    session = relationship("OSKernelSession", back_populates="queries")


class EngineeringMemoryItem(Base):
    __tablename__ = "engineering_memory_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    memory_type = Column(
        String(50), nullable=False, index=True
    )  # Decision, Incident, Review, Architecture, Lesson
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    author_role = Column(String(50), default="Architect", nullable=False)
    repository_id = Column(String(100), nullable=True)
    tags_json = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (Index("idx_eng_memory_type", "memory_type"),)


class EngineeringTimelineEvent(Base):
    __tablename__ = "engineering_timeline_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    event_type = Column(
        String(50), nullable=False, index=True
    )  # Deployment, Release, Incident, ArchEvolution, HealthChange
    title = Column(String(255), nullable=False)
    details = Column(Text, nullable=False)
    severity = Column(
        String(20), default="INFO", nullable=False
    )  # INFO, WARNING, CRITICAL
    repository_name = Column(String(100), nullable=True)
    timestamp = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (Index("idx_eng_timeline_type", "event_type"),)


class UniversalSearchIndex(Base):
    __tablename__ = "universal_search_indices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    domain = Column(
        String(50), nullable=False, index=True
    )  # Code, ADRs, APIs, Docs, Incidents, PRs, Commits, Architecture, Metrics
    title = Column(String(255), nullable=False)
    snippet = Column(Text, nullable=False)
    target_url = Column(String(255), nullable=False)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (Index("idx_universal_search_domain", "domain"),)


class PlatformPlugin(Base):
    __tablename__ = "platform_plugins"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    plugin_name = Column(String(100), nullable=False, unique=True)
    version = Column(String(20), default="1.0.0", nullable=False)
    description = Column(Text, nullable=False)
    author = Column(String(100), nullable=False)
    status = Column(String(20), default="ENABLED", nullable=False)  # ENABLED, DISABLED
    installed_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class AIDecisionLog(Base):
    __tablename__ = "ai_decision_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    recommendation_title = Column(String(255), nullable=False)
    rationale = Column(Text, nullable=False)
    status = Column(
        String(50), default="IMPLEMENTED", nullable=False
    )  # PROPOSED, APPROVED, IMPLEMENTED, REJECTED
    outcome_summary = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
