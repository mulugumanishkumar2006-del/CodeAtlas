from typing import List, Any, TYPE_CHECKING
from sqlalchemy import String, Float, ForeignKey, UniqueConstraint, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.repository import Repository
    from backend.app.models.analysis import Analysis
    from backend.app.models.file import File
    from backend.app.models.symbol import Symbol


class GraphNode(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "graph_nodes"
    __table_args__ = (
        UniqueConstraint("repository_id", "node_key", name="uq_repo_node_key"),
        Index("ix_graph_nodes_repo_type", "repository_id", "node_type"),
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
    node_key: Mapped[str] = mapped_column(String(512), nullable=False, index=True)
    node_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )  # module, package, file, symbol, service, layer, component
    label: Mapped[str] = mapped_column(String(255), nullable=False)
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
    properties: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="graph_nodes")
    analysis: Mapped["Analysis | None"] = relationship("Analysis", back_populates="graph_nodes")
    file: Mapped["File | None"] = relationship("File", back_populates="graph_nodes")
    symbol: Mapped["Symbol | None"] = relationship("Symbol", back_populates="graph_nodes")

    outgoing_relationships: Mapped[List["GraphRelationship"]] = relationship(
        "GraphRelationship",
        foreign_keys="[GraphRelationship.source_node_id]",
        back_populates="source_node",
        cascade="all, delete-orphan",
    )
    incoming_relationships: Mapped[List["GraphRelationship"]] = relationship(
        "GraphRelationship",
        foreign_keys="[GraphRelationship.target_node_id]",
        back_populates="target_node",
        cascade="all, delete-orphan",
    )


class GraphRelationship(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "graph_relationships"
    __table_args__ = (
        Index("ix_graph_rel_repo_nodes", "repository_id", "source_node_id", "target_node_id"),
        Index("ix_graph_rel_type", "repository_id", "relationship_type"),
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
    source_node_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("graph_nodes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    target_node_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("graph_nodes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    relationship_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )  # imports, calls, inherits, depends_on, contains, exposes
    weight: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    properties: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="graph_relationships")
    analysis: Mapped["Analysis | None"] = relationship("Analysis", back_populates="graph_relationships")
    source_node: Mapped["GraphNode"] = relationship(
        "GraphNode",
        foreign_keys=[source_node_id],
        back_populates="outgoing_relationships",
    )
    target_node: Mapped["GraphNode"] = relationship(
        "GraphNode",
        foreign_keys=[target_node_id],
        back_populates="incoming_relationships",
    )
