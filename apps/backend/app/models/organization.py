# apps/backend/app/models/organization.py

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Index, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    domain = Column(String(255), nullable=True)
    health_score = Column(
        Float, default=93.0, nullable=False
    )  # Org Health Score (e.g. 93/100)
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
    cross_dependencies = relationship(
        "CrossRepoDependency",
        back_populates="organization",
        cascade="all, delete-orphan",
    )
    metric_snapshots = relationship(
        "EnterpriseMetricSnapshot",
        back_populates="organization",
        cascade="all, delete-orphan",
    )


class CrossRepoDependency(Base):
    __tablename__ = "cross_repo_dependencies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(
        String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    source_repo_id = Column(
        String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    target_repo_id = Column(
        String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    dependency_type = Column(
        String(50), nullable=False
    )  # HTTP_API, GRPC, SHARED_LIB, KAFKA_TOPIC, DATABASE
    source_symbol = Column(String(255), nullable=True)
    target_symbol = Column(String(255), nullable=True)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    organization = relationship("Organization", back_populates="cross_dependencies")
    source_repository = relationship("Repository", foreign_keys=[source_repo_id])
    target_repository = relationship("Repository", foreign_keys=[target_repo_id])

    __table_args__ = (
        Index("idx_cross_dep_org", "organization_id"),
        Index("idx_cross_dep_source", "source_repo_id"),
        Index("idx_cross_dep_target", "target_repo_id"),
    )


class EnterpriseMetricSnapshot(Base):
    __tablename__ = "enterprise_metric_snapshots"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(
        String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    month_label = Column(String(20), nullable=False)  # e.g., "2026-01", "2026-02"
    health_score = Column(Float, nullable=False)
    tech_debt_score = Column(Float, nullable=False)
    security_score = Column(Float, nullable=False)
    performance_score = Column(Float, nullable=False)
    monthly_cost_usd = Column(Float, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    organization = relationship("Organization", back_populates="metric_snapshots")
