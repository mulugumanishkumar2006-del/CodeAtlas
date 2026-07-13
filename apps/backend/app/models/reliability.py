from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ReliabilityPrediction(Base):
    """
    Component-level (file/module) AI reliability bug predictions.
    """

    __tablename__ = "reliability_predictions"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    file_path = Column(String, nullable=False, index=True)
    prediction_type = Column(
        String, nullable=False, default="file"
    )  # "file", "class", "function", "service"
    name = Column(String, nullable=False, index=True)
    failure_probability = Column(Float, nullable=False, default=0.0)
    confidence = Column(Float, nullable=False, default=0.0)
    regression_risk = Column(Float, nullable=False, default=0.0)
    change_risk = Column(Float, nullable=False, default=0.0)
    complexity = Column(Integer, nullable=False, default=0)
    lines_of_code = Column(Integer, nullable=False, default=0)
    reliability = Column(Float, nullable=False, default=1.0)
    failure_risk = Column(Float, nullable=False, default=0.0)
    recovery_difficulty = Column(String, nullable=False, default="Medium")
    root_cause_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    repository = relationship("Repository")


class ReliabilitySummary(Base):
    """
    Repository-level aggregated AI reliability scores and risk metrics.
    """

    __tablename__ = "reliability_summaries"

    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    reliability_score = Column(Float, nullable=False, default=100.0)
    deployment_risk = Column(String, nullable=False, default="Low")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    repository = relationship("Repository")
