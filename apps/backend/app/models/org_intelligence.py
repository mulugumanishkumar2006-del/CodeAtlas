import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class OrgSnapshotDBModel(Base):
    __tablename__ = "org_snapshots"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    overall_health_score = Column(Float, default=84.5)
    health_data = Column(JSON, nullable=False, default=dict)
    priorities_data = Column(JSON, nullable=False, default=list)
    spof_data = Column(JSON, nullable=False, default=list)
    initiatives_data = Column(JSON, nullable=False, default=list)
    migrations_data = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class EngineeringInitiativeDBModel(Base):
    __tablename__ = "org_initiatives"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    objective = Column(Text, nullable=False)
    problem_summary = Column(Text, nullable=False)
    status = Column(String, default="IN_PROGRESS")
    progress_percentage = Column(Float, default=45.0)
    affected_teams = Column(JSON, nullable=False, default=list)
    affected_repositories = Column(JSON, nullable=False, default=list)
    milestones = Column(JSON, nullable=False, default=list)
    owner = Column(String, default="VP of Engineering")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OrgDecisionSupportDBModel(Base):
    __tablename__ = "org_decision_support"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    evidence_citations = Column(JSON, nullable=False, default=list)
    confidence = Column(Float, default=0.95)
    recommended_next_step = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
