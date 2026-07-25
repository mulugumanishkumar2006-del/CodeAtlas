# apps/backend/app/models/autonomous_task.py

import uuid

from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class AutonomousTask(Base):
    __tablename__ = "autonomous_tasks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    pipeline_run_id = Column(String, nullable=False, index=True)

    task_type = Column(String, nullable=False)  # refactor, test, docs, dependency
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(Integer, default=1)  # 1=Critical, 2=High, 3=Medium, 4=Low
    status = Column(
        String, default="pending"
    )  # pending, executing, validated, pr_ready, approved, rejected, merged
    estimated_effort = Column(String, nullable=True)  # e.g. "2 hours"

    files_affected = Column(JSON, nullable=True)  # list of file paths
    generated_diff = Column(JSON, nullable=True)  # structured diff hunks
    validation_result = Column(JSON, nullable=True)  # lint/type/test/security results
    pr_data = Column(JSON, nullable=True)  # PR title, description, labels, reviewers

    council_recommendation_id = Column(String, nullable=True)
    confidence_score = Column(Float, default=85.0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    repository = relationship("Repository")
