# apps/backend/app/models/reality_twin.py

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, Index, Integer, String, Text

from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class RealityTwinNode(Base):
    __tablename__ = "reality_twin_nodes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    node_name = Column(String(100), nullable=False, unique=True)
    node_type = Column(
        String(50), nullable=False
    )  # Pod, Container, Microservice, Database, Cache
    status = Column(
        String(20), default="RUNNING", nullable=False
    )  # RUNNING, DEGRADED, FAILED
    cpu_utilization_pct = Column(Float, default=45.0, nullable=False)
    memory_utilization_pct = Column(Float, default=55.0, nullable=False)
    restart_count = Column(Integer, default=0, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ProductionTelemetryMetric(Base):
    __tablename__ = "production_telemetry_metrics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    service_name = Column(String(100), nullable=False, index=True)
    p95_latency_ms = Column(Float, default=42.0, nullable=False)
    p99_latency_ms = Column(Float, default=120.0, nullable=False)
    throughput_rpm = Column(Float, default=15000.0, nullable=False)
    error_rate_pct = Column(Float, default=0.01, nullable=False)
    recorded_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (Index("idx_telemetry_service", "service_name"),)


class IncidentSimulationRecord(Base):
    __tablename__ = "incident_simulation_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    simulation_type = Column(
        String(50), nullable=False
    )  # Outage, TrafficSpike, MemoryLeak
    target_service = Column(String(100), nullable=False)
    blast_radius_summary = Column(Text, nullable=False)
    predicted_downtime_mins = Column(Integer, default=0, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
