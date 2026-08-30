from typing import Any, TYPE_CHECKING
from sqlalchemy import String, Float, ForeignKey, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.repository import Repository
    from backend.app.models.analysis import Analysis


class Metric(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "metrics"
    __table_args__ = (
        Index("ix_metrics_analysis_name", "analysis_id", "name"),
        Index("ix_metrics_repo_category", "repository_id", "category"),
    )

    repository_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analysis_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("analyses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )  # complexity, churn, maintainability, test_coverage, size, security
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str | None] = mapped_column(String(50), nullable=True)
    details: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="metrics")
    analysis: Mapped["Analysis"] = relationship("Analysis", back_populates="metrics")
