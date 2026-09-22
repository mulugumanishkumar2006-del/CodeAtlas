from typing import Optional, Any, List, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.repository import Repository
    from backend.app.models.user import User


class Annotation(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Durable collaborative annotation attached to architecture components,
    nodes, files, or symbols within a repository.
    """
    __tablename__ = "annotations"

    repository_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    # Target entity: file, symbol, graph_node, architecture_component, general
    target_type: Mapped[str] = mapped_column(String(50), nullable=False, default="architecture_component")
    target_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    # Category: note, question, concern, decision, review_comment
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="note")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", foreign_keys=[repository_id])
    user: Mapped[Optional["User"]] = relationship("User", foreign_keys=[user_id])


class Comment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Durable comment and discussion thread entry associated with a repository,
    file, symbol, architecture node, investigation, or PR review.
    """
    __tablename__ = "comments"

    repository_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    # Threading support
    parent_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("comments.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    # Target entity: repository, file, symbol, graph_node, investigation, pr_review, annotation
    target_type: Mapped[str] = mapped_column(String(50), nullable=False, default="repository")
    target_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", foreign_keys=[repository_id])
    user: Mapped[Optional["User"]] = relationship("User", foreign_keys=[user_id])
    parent: Mapped[Optional["Comment"]] = relationship("Comment", remote_side="Comment.id", foreign_keys=[parent_id])


# Composite indices for fast lookup by repository and target
Index("idx_annotations_repo_target", Annotation.repository_id, Annotation.target_type, Annotation.target_id)
Index("idx_comments_repo_target", Comment.repository_id, Comment.target_type, Comment.target_id)
