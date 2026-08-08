import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class StrategicObjectiveDBModel(Base):
    __tablename__ = "strat_objectives"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    priority_weight = Column(Float, default=0.85)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class StrategicDecisionRecordDBModel(Base):
    __tablename__ = "strat_decisions"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    objective_id = Column(String, nullable=False)
    chosen_option_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    evidence_citations = Column(JSON, nullable=False, default=list)
    reviewers = Column(JSON, nullable=False, default=list)
    expected_outcome = Column(Text, nullable=False)
    actual_outcome = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class StrategicPortfolioDBModel(Base):
    __tablename__ = "strat_portfolio"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    roadmap_phase = Column(String, default="NOW")
    priority_score = Column(Float, default=88.0)
    risk_reduction_score = Column(Float, default=45.0)
    dependencies = Column(JSON, nullable=False, default=list)
    owner = Column(String, default="VP of Engineering")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
