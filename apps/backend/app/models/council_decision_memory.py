# apps/backend/app/models/council_decision_memory.py

import uuid

from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class CouncilDecisionMemory(Base):
    __tablename__ = "council_decision_memories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)

    recommendation_id = Column(String, nullable=False)
    recommendation_title = Column(String, nullable=False)
    status = Column(
        String, default="Accepted", nullable=False
    )  # Accepted, Rejected, Deferred
    why = Column(Text, nullable=True)
    confidence_score = Column(Float, default=90.0, nullable=False)

    predicted_impact = Column(JSON, nullable=True)
    actual_outcome = Column(JSON, nullable=True)
    learning_feedback = Column(Text, nullable=True)
    accuracy_score = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    repository = relationship("Repository")
