from typing import List, Any, TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, Integer, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.repository import Repository
    from backend.app.models.metric import Metric
    from backend.app.models.finding import Finding
    from backend.app.models.file import File
    from backend.app.models.dependency import Dependency
    from backend.app.models.graph import GraphNode, GraphRelationship


class Analysis(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "analyses"

    repository_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    commit_sha: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    branch: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default="pending",
        nullable=False,
        index=True,
    )  # pending, running, completed, failed
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    metadata_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="analyses")
    metrics: Mapped[List["Metric"]] = relationship(
        "Metric",
        back_populates="analysis",
        cascade="all, delete-orphan",
    )
    findings: Mapped[List["Finding"]] = relationship(
        "Finding",
        back_populates="analysis",
        cascade="all, delete-orphan",
    )
    files: Mapped[List["File"]] = relationship(
        "File",
        back_populates="analysis",
    )
    dependencies: Mapped[List["Dependency"]] = relationship(
        "Dependency",
        back_populates="analysis",
    )
    graph_nodes: Mapped[List["GraphNode"]] = relationship(
        "GraphNode",
        back_populates="analysis",
    )
    graph_relationships: Mapped[List["GraphRelationship"]] = relationship(
        "GraphRelationship",
        back_populates="analysis",
    )
