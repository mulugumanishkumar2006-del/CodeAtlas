# apps/backend/app/models/workspace.py

import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    organization_id = Column(
        String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    health_score = Column(Float, default=91.5, nullable=False)
    architecture_health = Column(Float, default=94.0, nullable=False)
    security_health = Column(Float, default=89.0, nullable=False)
    performance_health = Column(Float, default=92.5, nullable=False)
    tech_debt_score = Column(Float, default=85.0, nullable=False)

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

    # Relationships
    workspace_repos = relationship(
        "WorkspaceRepository",
        back_populates="workspace",
        cascade="all, delete-orphan",
    )
    dependencies = relationship(
        "WorkspaceDependency",
        back_populates="workspace",
        cascade="all, delete-orphan",
    )
    services = relationship(
        "WorkspaceService",
        back_populates="workspace",
        cascade="all, delete-orphan",
    )
    audit_logs = relationship(
        "WorkspaceAuditLog",
        back_populates="workspace",
        cascade="all, delete-orphan",
    )
    members = relationship(
        "WorkspaceMember",
        back_populates="workspace",
        cascade="all, delete-orphan",
    )

    __table_args__ = (Index("idx_workspace_org", "organization_id"),)


class WorkspaceRepository(Base):
    __tablename__ = "workspace_repositories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(
        String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False
    )
    repository_id = Column(
        String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )

    alias = Column(String(255), nullable=True)
    group_name = Column(String(100), default="Core Services", nullable=False)
    is_favorite = Column(Boolean, default=False, nullable=False)
    is_archived = Column(Boolean, default=False, nullable=False)
    analysis_status = Column(
        String(50), default="ready", nullable=False
    )  # connected, queued, analyzing, partially_analyzed, ready, needs_attention, failed, paused
    analysis_message = Column(Text, nullable=True)
    last_analyzed_at = Column(DateTime(timezone=True), nullable=True)

    metadata_json = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    workspace = relationship("Workspace", back_populates="workspace_repos")
    repository = relationship("Repository", foreign_keys=[repository_id])

    __table_args__ = (
        Index("idx_ws_repo_ws", "workspace_id"),
        Index("idx_ws_repo_repo", "repository_id"),
    )


class WorkspaceDependency(Base):
    __tablename__ = "workspace_dependencies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(
        String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False
    )
    source_repo_id = Column(
        String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    target_repo_id = Column(
        String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )

    dependency_type = Column(
        String(50), nullable=False
    )  # HTTP_API, GRPC, SHARED_LIB, KAFKA_TOPIC, DATABASE, PACKAGE
    direction = Column(String(20), default="OUTBOUND", nullable=False)
    version_spec = Column(String(100), default="v1.4.0", nullable=False)
    criticality = Column(String(20), default="HIGH", nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    confidence_score = Column(Float, default=0.95, nullable=False)
    change_risk_score = Column(Float, default=0.35, nullable=False)

    metadata_json = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    workspace = relationship("Workspace", back_populates="dependencies")
    source_repository = relationship("Repository", foreign_keys=[source_repo_id])
    target_repository = relationship("Repository", foreign_keys=[target_repo_id])


class WorkspaceService(Base):
    __tablename__ = "workspace_services"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(
        String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False
    )
    repository_id = Column(
        String(36), ForeignKey("repositories.id", ondelete="SET NULL"), nullable=True
    )

    name = Column(String(255), nullable=False)
    service_type = Column(
        String(50), default="microservice", nullable=False
    )  # microservice, api_gateway, database, message_queue, cache, cloud_resource
    owner_team = Column(String(100), default="Platform Core", nullable=False)
    criticality_score = Column(Float, default=88.0, nullable=False)
    health_score = Column(Float, default=92.0, nullable=False)
    consumer_count = Column(Integer, default=5, nullable=False)
    provider_count = Column(Integer, default=3, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    workspace = relationship("Workspace", back_populates="services")
    repository = relationship("Repository", foreign_keys=[repository_id])


class WorkspaceAuditLog(Base):
    __tablename__ = "workspace_audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(
        String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False
    )
    action_type = Column(String(100), nullable=False)
    performed_by = Column(String(100), default="Architect User", nullable=False)
    details_json = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    workspace = relationship("Workspace", back_populates="audit_logs")


class WorkspaceMember(Base):
    __tablename__ = "workspace_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(
        String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False
    )
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    role = Column(
        String(50), default="Architect", nullable=False
    )  # Workspace Viewer, Developer, Maintainer, Architect, Administrator
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    workspace = relationship("Workspace", back_populates="members")
    user = relationship("User", foreign_keys=[user_id])
