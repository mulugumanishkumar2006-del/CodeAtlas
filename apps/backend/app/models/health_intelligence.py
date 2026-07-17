"""SQLAlchemy model for persisting repository health snapshots."""

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class RepositoryHealthSnapshot(Base):
    """
    Persists a point-in-time health intelligence report so that
    the Health Intelligence Engine can render trend charts across
    multiple analysis runs.
    """

    __tablename__ = "repository_health_snapshots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # ---- Composite score --------------------------------------------------
    overall_score = Column(Float, nullable=False)
    grade = Column(String(2), nullable=False)
    status = Column(String(20), nullable=False)

    # ---- 11 Dimension scores (denormalized for fast trend queries) ----------
    score_architecture = Column(Float, nullable=True)
    score_technical_debt = Column(Float, nullable=True)
    score_reliability = Column(Float, nullable=True)
    score_knowledge = Column(Float, nullable=True)
    score_documentation = Column(Float, nullable=True)
    score_performance = Column(Float, nullable=True)
    score_testing = Column(Float, nullable=True)
    score_security = Column(Float, nullable=True)
    score_developer_experience = Column(Float, nullable=True)
    score_scalability = Column(Float, nullable=True)
    score_maintainability = Column(Float, nullable=True)

    # ---- Narrative (stored for history) -----------------------------------
    headline = Column(String(512), nullable=True)
    narrative = Column(Text, nullable=True)
