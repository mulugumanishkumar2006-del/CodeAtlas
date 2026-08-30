from typing import List, Any, TYPE_CHECKING
from sqlalchemy import String, Integer, Text, ForeignKey, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.repository import Repository
    from backend.app.models.file import File
    from backend.app.models.graph import GraphNode
    from backend.app.models.finding import Finding


class Symbol(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "symbols"
    __table_args__ = (
        Index("ix_symbols_repo_file", "repository_id", "file_id"),
        Index("ix_symbols_repo_name", "repository_id", "name"),
    )

    repository_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    file_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("files.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    symbol_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )  # function, class, method, variable, interface, struct, etc.
    qualified_name: Mapped[str] = mapped_column(String(1024), nullable=False, index=True)
    start_line: Mapped[int] = mapped_column(Integer, nullable=False)
    end_line: Mapped[int] = mapped_column(Integer, nullable=False)
    start_column: Mapped[int | None] = mapped_column(Integer, nullable=True)
    end_column: Mapped[int | None] = mapped_column(Integer, nullable=True)
    docstring: Mapped[str | None] = mapped_column(Text, nullable=True)
    ast_metadata: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="symbols")
    file: Mapped["File"] = relationship("File", back_populates="symbols")
    graph_nodes: Mapped[List["GraphNode"]] = relationship(
        "GraphNode",
        back_populates="symbol",
    )
    findings: Mapped[List["Finding"]] = relationship(
        "Finding",
        back_populates="symbol",
    )
