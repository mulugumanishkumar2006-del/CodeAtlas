# apps/backend/app/models/cto_strategy_history.py

from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class CTOStrategyHistory(Base):
    __tablename__ = "cto_strategy_histories"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    version = Column(String, nullable=False, default="v1.0")
    trigger_event = Column(
        String, nullable=False, default="manual"
    )  # manual, git_push, goal_update

    # Goals & Parameters snapshot
    target_users = Column(Integer, nullable=True, default=10000)
    target_requests_per_sec = Column(Integer, nullable=True, default=100)
    migration_target = Column(String, nullable=True, default="serverless")
    budget_reduction_pct = Column(Float, nullable=True, default=0.0)

    # Generated Reports & Analysis JSON snapshots
    executive_report_json = Column(JSON, nullable=True)
    engineering_report_json = Column(JSON, nullable=True)
    roadmap_json = Column(JSON, nullable=True)
    risks_json = Column(JSON, nullable=True)
    costs_json = Column(JSON, nullable=True)
    hiring_json = Column(JSON, nullable=True)

    # Key performance indicators
    health_score = Column(Float, nullable=True, default=85.0)
    implemented_recommendations_count = Column(Integer, nullable=True, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    repository = relationship("Repository", backref="cto_strategy_histories")
