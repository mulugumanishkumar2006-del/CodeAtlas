from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class ArchitectureBaseline(Base):
    __tablename__ = "architecture_baselines"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repo_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    architecture_type = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ArchitectureViolation(Base):
    __tablename__ = "architecture_violations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repo_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    violation_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    source_entity = Column(String, nullable=False)
    target_entity = Column(String, nullable=False)
    detected_at = Column(DateTime(timezone=True), server_default=func.now())


class GovernancePolicy(Base):
    __tablename__ = "governance_policies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    organization_id = Column(String, nullable=False, index=True)
    policy_name = Column(String, nullable=False)
    rule_definition = Column(String, nullable=False)  # JSON or text payload
    enabled = Column(Boolean, default=True, nullable=False)


class ComplianceHistory(Base):
    __tablename__ = "compliance_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repo_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    compliance_score = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
