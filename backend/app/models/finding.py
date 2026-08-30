from typing import Any, TYPE_CHECKING
from sqlalchemy import String, Integer, Text, ForeignKey, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.repository import Repository
    from backend.app.models.analysis import Analysis
    from backend.app.models.file import File
    from backend.app.models.symbol import Symbol


class Finding(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "findings"
    __table_args__ = (
        Index("ix_findings_analysis_sev", "analysis_id", "severity"),
        Index("ix_findings_repo_cat", "repository_id", "category"),
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
    file_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("files.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    symbol_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("symbols.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    rule_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )  # architecture, security, performance, maintainability, reliability
    severity: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        index=True,
    )  # critical, high, medium, low, info
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    line_start: Mapped[int | None] = mapped_column(Integer, nullable=True)
    line_end: Mapped[int | None] = mapped_column(Integer, nullable=True)
    evidence: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    remediation: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="findings")
    analysis: Mapped["Analysis"] = relationship("Analysis", back_populates="findings")
    file: Mapped["File | None"] = relationship("File", back_populates="findings")
    symbol: Mapped["Symbol | None"] = relationship("Symbol", back_populates="findings")
