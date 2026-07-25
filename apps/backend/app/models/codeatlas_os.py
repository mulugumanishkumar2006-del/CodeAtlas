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
    )  # GitHub, Jira, SonarQube, Datadog, Confluence, Snyk, Jenkins
    category = Column(
        String(50), nullable=False
    )  # SCM, PM, Quality, Observability, Docs, Security, CICD
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
