# apps/backend/app/models/visual_experience.py

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Index, Integer, String, Text

from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class EngineeringAchievement(Base):
    __tablename__ = "engineering_achievements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    badge_key = Column(String(100), nullable=False, unique=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), default="trophy", nullable=False)
    unlocked = Column(String(10), default="UNLOCKED", nullable=False)
    unlocked_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ServiceHeartbeatLog(Base):
    __tablename__ = "service_heartbeat_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    service_name = Column(String(100), nullable=False, index=True)
    status = Column(
        String(20), default="HEALTHY", nullable=False
    )  # HEALTHY, SLOW, FAILURE
    p95_latency_ms = Column(Integer, default=42, nullable=False)
    throughput_rpm = Column(Integer, default=15000, nullable=False)
    recorded_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (Index("idx_heartbeat_service", "service_name"),)


class AIDebateSession(Base):
    __tablename__ = "ai_debate_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    topic = Column(String(255), nullable=False)
    consensus_summary = Column(Text, nullable=False)
    consensus_status = Column(String(50), default="APPROVED", nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
