"""SQLAlchemy database models for repository health intelligence."""

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class RepositoryHealth(Base):
    """Stores full point-in-time scores for all health dimensions."""

    __tablename__ = "repository_health"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    overall_score = Column(Float, nullable=False)
    architecture_score = Column(Float, nullable=False)
    quality_score = Column(Float, nullable=False)
    technical_debt = Column(Float, nullable=False)
    knowledge_score = Column(Float, nullable=False)
    security_score = Column(Float, nullable=False)
    performance_score = Column(Float, nullable=False)
    scalability_score = Column(Float, nullable=False)
    developer_experience = Column(Float, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )


class HealthHistory(Base):
    """Tracks composite overall scores across time for trend chart plotting."""

    __tablename__ = "health_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    score = Column(Float, nullable=False)
    timestamp = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )


class Recommendation(Base):
    """Stores rule-based prioritized advisor recommendation nodes."""

    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    recommendation = Column(Text, nullable=False)
    improvement = Column(Float, nullable=False)
    priority = Column(String(20), nullable=False)  # HIGH, MEDIUM, LOW
    estimated_effort = Column(String(20), nullable=False)  # Low, Medium, High
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
