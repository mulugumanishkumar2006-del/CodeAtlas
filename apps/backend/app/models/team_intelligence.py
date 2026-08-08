# apps/backend/app/models/team_intelligence.py

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


class TeamModel(Base):
    __tablename__ = "team_models"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    organization_id = Column(
        String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    team_type = Column(
        String(100), default="Product Engineering", nullable=False
    )  # Core Platform, Security, Payments, Infrastructure, Frontend Experience
    description = Column(Text, nullable=True)

    # 10-Dimensional Team Engineering Health Scores
    overall_health = Column(Float, default=90.5, nullable=False)
    delivery_flow = Column(Float, default=92.0, nullable=False)
    review_flow = Column(Float, default=88.5, nullable=False)
    architecture_health = Column(Float, default=94.0, nullable=False)
    security_score = Column(Float, default=91.0, nullable=False)
    performance_score = Column(Float, default=93.5, nullable=False)
    tech_debt_score = Column(Float, default=84.0, nullable=False)
    reliability_score = Column(Float, default=95.0, nullable=False)
    documentation_score = Column(Float, default=82.0, nullable=False)
    ownership_clarity = Column(Float, default=90.0, nullable=False)
    knowledge_distribution = Column(Float, default=86.5, nullable=False)

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
    ownerships = relationship(
        "TeamOwnership",
        back_populates="team",
        cascade="all, delete-orphan",
    )
    provided_dependencies = relationship(
        "TeamDependency",
        foreign_keys="TeamDependency.provider_team_id",
        back_populates="provider_team",
        cascade="all, delete-orphan",
    )
    consumed_dependencies = relationship(
        "TeamDependency",
        foreign_keys="TeamDependency.consumer_team_id",
        back_populates="consumer_team",
        cascade="all, delete-orphan",
    )
    knowledge_risks = relationship(
        "KnowledgeConcentrationItem",
        back_populates="team",
        cascade="all, delete-orphan",
    )
    collaboration_bottlenecks = relationship(
        "CollaborationBottleneck",
        back_populates="team",
        cascade="all, delete-orphan",
    )

    __table_args__ = (Index("idx_team_org", "organization_id"),)


class TeamOwnership(Base):
    __tablename__ = "team_ownerships"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    team_id = Column(
        String(36), ForeignKey("team_models.id", ondelete="CASCADE"), nullable=False
    )
    repository_id = Column(
        String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=True
    )
    service_name = Column(String(255), nullable=False)
    component_name = Column(String(255), nullable=True)

    ownership_type = Column(
        String(50), default="PRIMARY", nullable=False
    )  # PRIMARY, SECONDARY, SHARED, UNCLEAR, MISSING
    confidence_score = Column(Float, default=0.95, nullable=False)
    evidence_json = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    team = relationship("TeamModel", back_populates="ownerships")
    repository = relationship("Repository", foreign_keys=[repository_id])


class TeamDependency(Base):
    __tablename__ = "team_dependencies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    consumer_team_id = Column(
        String(36), ForeignKey("team_models.id", ondelete="CASCADE"), nullable=False
    )
    provider_team_id = Column(
        String(36), ForeignKey("team_models.id", ondelete="CASCADE"), nullable=False
    )
    service_name = Column(String(255), nullable=False)
    dependency_type = Column(
        String(50), default="HTTP_API", nullable=False
    )  # HTTP_API, GRPC, SHARED_LIB, EVENT_BUS, DB_REPLICA
    criticality = Column(String(20), default="HIGH", nullable=False)
    review_dependency_risk = Column(Float, default=0.45, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    consumer_team = relationship(
        "TeamModel", foreign_keys=[consumer_team_id], back_populates="consumed_dependencies"
    )
    provider_team = relationship(
        "TeamModel", foreign_keys=[provider_team_id], back_populates="provided_dependencies"
    )


class KnowledgeConcentrationItem(Base):
    __tablename__ = "knowledge_concentration_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    team_id = Column(
        String(36), ForeignKey("team_models.id", ondelete="CASCADE"), nullable=False
    )
    component_name = Column(String(255), nullable=False)
    service_name = Column(String(255), nullable=False)
    repository_id = Column(
        String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=True
    )

    risk_severity = Column(
        String(20), default="HIGH", nullable=False
    )  # CRITICAL, HIGH, MEDIUM, LOW
    documentation_coverage = Column(Float, default=42.0, nullable=False)
    review_coverage = Column(Float, default=58.0, nullable=False)
    evidence_text = Column(Text, nullable=False)
    mitigation_recommendation = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    team = relationship("TeamModel", back_populates="knowledge_risks")


class CollaborationBottleneck(Base):
    __tablename__ = "collaboration_bottlenecks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    team_id = Column(
        String(36), ForeignKey("team_models.id", ondelete="CASCADE"), nullable=False
    )
    pattern_name = Column(String(255), nullable=False)
    potential_cause = Column(Text, nullable=False)
    impact_description = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.92, nullable=False)
    recommendation = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    team = relationship("TeamModel", back_populates="collaboration_bottlenecks")


class KnowledgeTransferTask(Base):
    __tablename__ = "knowledge_transfer_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    team_id = Column(
        String(36), ForeignKey("team_models.id", ondelete="CASCADE"), nullable=False
    )
    target_component = Column(String(255), nullable=False)
    task_type = Column(
        String(50), default="RUNBOOK_CREATION", nullable=False
    )  # RUNBOOK_CREATION, ADR_DOCUMENTATION, CROSS_TEAM_REVIEW, PAIR_WALKTHROUGH
    impact_level = Column(String(20), default="HIGH", nullable=False)
    effort_estimate = Column(String(20), default="MEDIUM", nullable=False)
    status = Column(String(50), default="RECOMMENDED", nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
