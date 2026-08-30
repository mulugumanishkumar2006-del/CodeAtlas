from typing import List, Any, TYPE_CHECKING
from sqlalchemy import String, Integer, BigInteger, ForeignKey, UniqueConstraint, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.repository import Repository
    from backend.app.models.analysis import Analysis
    from backend.app.models.symbol import Symbol
    from backend.app.models.dependency import Dependency
    from backend.app.models.graph import GraphNode
    from backend.app.models.finding import Finding


class File(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "files"
    __table_args__ = (
        UniqueConstraint("repository_id", "path", name="uq_repo_file_path"),
    )

    repository_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analysis_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("analyses.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    path: Mapped[str] = mapped_column(String(1024), nullable=False, index=True)
    language: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    size_bytes: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    line_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    content_hash: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    source_metadata: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="files")
    analysis: Mapped["Analysis | None"] = relationship("Analysis", back_populates="files")
    symbols: Mapped[List["Symbol"]] = relationship(
        "Symbol",
        back_populates="file",
        cascade="all, delete-orphan",
    )
    dependencies: Mapped[List["Dependency"]] = relationship(
        "Dependency",
        foreign_keys="[Dependency.source_file_id]",
        back_populates="source_file",
    )
    graph_nodes: Mapped[List["GraphNode"]] = relationship(
        "GraphNode",
        back_populates="file",
    )
    findings: Mapped[List["Finding"]] = relationship(
        "Finding",
        back_populates="file",
    )
