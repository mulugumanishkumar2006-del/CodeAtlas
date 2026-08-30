from typing import Any, TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.repository import Repository
    from backend.app.models.analysis import Analysis
    from backend.app.models.file import File


class Dependency(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "dependencies"
    __table_args__ = (
        Index("ix_dependencies_repo_name", "repository_id", "name"),
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
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    version_spec: Mapped[str | None] = mapped_column(String(100), nullable=True)
    dependency_type: Mapped[str] = mapped_column(
        String(50),
        default="direct",
        nullable=False,
        index=True,
    )  # direct, transitive, dev, peer, system
    package_manager: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )  # pip, npm, yarn, pnpm, cargo, maven, gradle, go, nuget, composer, etc.
    source_file_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("files.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    target_file_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("files.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    metadata_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="dependencies")
    analysis: Mapped["Analysis | None"] = relationship("Analysis", back_populates="dependencies")
    source_file: Mapped["File | None"] = relationship(
        "File",
        foreign_keys=[source_file_id],
        back_populates="dependencies",
    )
    target_file: Mapped["File | None"] = relationship(
        "File",
        foreign_keys=[target_file_id],
    )

