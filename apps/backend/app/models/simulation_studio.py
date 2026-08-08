import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class SimulationSessionModel(Base):
    __tablename__ = "simulation_studio_sessions"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    workspace_id = Column(String, index=True, nullable=True)
    title = Column(String, nullable=False)
    base_commit_sha = Column(String, nullable=False, default="HEAD")
    status = Column(String, default="DRAFT", nullable=False)
    proposed_changes = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class SimulationScenarioModel(Base):
    __tablename__ = "simulation_studio_scenarios"

    id = Column(String, primary_key=True, index=True)
    simulation_session_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    proposed_changes = Column(JSON, nullable=False, default=list)
    simulated_risk = Column(JSON, nullable=False, default=dict)
    simulated_impact = Column(JSON, nullable=False, default=dict)
    confidence = Column(String, default="HIGH")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SimulationResultModel(Base):
    __tablename__ = "simulation_studio_results"

    id = Column(String, primary_key=True, index=True)
    simulation_session_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    virtual_graph = Column(JSON, nullable=False, default=dict)
    graph_diff = Column(JSON, nullable=False, default=list)
    impact = Column(JSON, nullable=False, default=dict)
    risk = Column(JSON, nullable=False, default=dict)
    assumptions = Column(JSON, nullable=False, default=list)
    confidence = Column(String, default="HIGH")
    validation_plan = Column(JSON, nullable=False, default=dict)
    ai_reasoning = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
