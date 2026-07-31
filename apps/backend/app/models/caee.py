import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    String,
    Text,
)

from app.core.database import Base


class ArchitectureEvolutionSession(Base):
    """
    Represents a CAEE evolution session analyzing current state & target horizons (1Y, 3Y, 5Y).
    """

    __tablename__ = "architecture_evolution_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    overall_evolution_score = Column(Float, default=92.5)
    architecture_stability_index = Column(Float, default=88.0)
    current_coupling_coefficient = Column(Float, default=0.42)
    target_coupling_coefficient = Column(Float, default=0.15)

    current_state_summary = Column(Text, nullable=True)
    target_vision_1y = Column(JSON, default=dict)
    target_vision_3y = Column(JSON, default=dict)
    target_vision_5y = Column(JSON, default=dict)

    status = Column(String(50), default="ACTIVE", index=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ArchitectureGapItem(Base):
    """
    Represents an architectural gap or drift item between current & target states.
    """

    __tablename__ = "architecture_gap_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("architecture_evolution_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    gap_title = Column(String(255), nullable=False)
    category = Column(
        String(50), default="coupling"
    )  # coupling, debt, monolith, sprawl, legacy
    severity = Column(String(50), default="HIGH")
    description = Column(Text, nullable=True)
    impacted_components = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class EvolutionMigrationStep(Base):
    """
    Represents a stepwise migration milestone in the architectural evolution roadmap.
    """

    __tablename__ = "evolution_migration_steps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("architecture_evolution_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    phase_name = Column(String(100), nullable=False)  # Phase 1, Phase 2, Phase 3
    action_item = Column(String(255), nullable=False)
    horizon = Column(String(20), default="1Y")  # 1Y, 3Y, 5Y
    estimated_effort_person_days = Column(Float, default=12.0)
    risk_level = Column(String(50), default="LOW")
    status = Column(String(50), default="PLANNED")

    created_at = Column(DateTime, default=datetime.utcnow)


class EvolutionTimelineMilestone(Base):
    """
    Represents quarterly architectural evolution milestones.
    """

    __tablename__ = "evolution_timeline_milestones"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36),
        ForeignKey("architecture_evolution_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    quarter = Column(String(20), nullable=False)  # Q1 2026, Q2 2026, etc.
    milestone_title = Column(String(255), nullable=False)
    target_architecture_pattern = Column(String(100), default="Modular Monolith")
    coupling_target = Column(Float, default=0.25)
    is_completed = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
