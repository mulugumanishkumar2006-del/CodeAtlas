import uuid

from sqlalchemy import JSON, Column, DateTime, ForeignKey, String, Float, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class DigitalTwinSession(Base):
    __tablename__ = "digital_twin_sessions"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    repository = relationship("Repository")
    changes = relationship(
        "DigitalTwinChange",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="DigitalTwinChange.created_at.asc()",
    )


class DigitalTwinChange(Base):
    __tablename__ = "digital_twin_changes"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    session_id = Column(
        String,
        ForeignKey("digital_twin_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )
    action = Column(
        String, nullable=False
    )  # delete, modify, rename, add_dependency, remove_dependency
    target_type = Column(String, nullable=False)  # file, symbol, relationship
    target_name = Column(String, nullable=False)  # target file path or symbol name
    new_name = Column(String, nullable=True)  # new symbol name (optional)
    properties = Column(JSON, nullable=True)  # optional custom configuration
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("DigitalTwinSession", back_populates="changes")


class SimulationScenario(Base):
    __tablename__ = "simulation_scenarios"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    scenario_name = Column(String, nullable=False)
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    repository = relationship("Repository")
    results = relationship(
        "SimulationResult",
        back_populates="scenario",
        cascade="all, delete-orphan",
    )
    blast_radius_entities = relationship(
        "BlastRadiusEntity",
        back_populates="scenario",
        cascade="all, delete-orphan",
    )


class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    scenario_id = Column(
        String,
        ForeignKey("simulation_scenarios.id", ondelete="CASCADE"),
        nullable=False,
    )
    risk_score = Column(Integer, nullable=False)
    impact_score = Column(Integer, nullable=False)
    health_score = Column(Float, nullable=False)
    estimated_effort = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)

    scenario = relationship("SimulationScenario", back_populates="results")


class BlastRadiusEntity(Base):
    __tablename__ = "blast_radius"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    scenario_id = Column(
        String,
        ForeignKey("simulation_scenarios.id", ondelete="CASCADE"),
        nullable=False,
    )
    entity = Column(String, nullable=False)
    affected_nodes = Column(Integer, nullable=False)
    affected_files = Column(Integer, nullable=False)
    affected_services = Column(Integer, nullable=False)
    affected_tests = Column(Integer, nullable=False)

    scenario = relationship(
        "SimulationScenario", back_populates="blast_radius_entities"
    )
