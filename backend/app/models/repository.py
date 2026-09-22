from datetime import datetime
from typing import List, Any, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey, UniqueConstraint, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.workspace import Workspace
    from backend.app.models.analysis import Analysis
    from backend.app.models.file import File
    from backend.app.models.symbol import Symbol
    from backend.app.models.dependency import Dependency
    from backend.app.models.graph import GraphNode, GraphRelationship
    from backend.app.models.commit import Commit
    from backend.app.models.metric import Metric
    from backend.app.models.finding import Finding
    from backend.app.models.investigation import Investigation
    from backend.app.models.simulation import Simulation
    from backend.app.models.conversation import Conversation
    from backend.app.models.engineering_plan import EngineeringPlan
    from backend.app.models.pull_request_review import PullRequestReview


class Repository(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "repositories"
    __table_args__ = (
        UniqueConstraint("workspace_id", "name", name="uq_workspace_repo_name"),
    )

    workspace_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    url: Mapped[str] = mapped_column(String(1024), nullable=False)
    provider: Mapped[str] = mapped_column(String(50), default="github", nullable=False)
    owner_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    default_branch: Mapped[str] = mapped_column(String(100), default="main", nullable=False)
    current_commit_sha: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    connection_status: Mapped[str] = mapped_column(String(50), default="connected", nullable=False)
    analysis_status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)
    
    # Phase 4 Acquisition Fields
    clone_path: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    acquisition_status: Mapped[str] = mapped_column(String(50), default="NOT_CLONED", nullable=False, index=True)
    acquisition_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    metadata_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="repositories")
    analyses: Mapped[List["Analysis"]] = relationship(
        "Analysis",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    files: Mapped[List["File"]] = relationship(
        "File",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    symbols: Mapped[List["Symbol"]] = relationship(
        "Symbol",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    dependencies: Mapped[List["Dependency"]] = relationship(
        "Dependency",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    graph_nodes: Mapped[List["GraphNode"]] = relationship(
        "GraphNode",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    graph_relationships: Mapped[List["GraphRelationship"]] = relationship(
        "GraphRelationship",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    commits: Mapped[List["Commit"]] = relationship(
        "Commit",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    metrics: Mapped[List["Metric"]] = relationship(
        "Metric",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    findings: Mapped[List["Finding"]] = relationship(
        "Finding",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    investigations: Mapped[List["Investigation"]] = relationship(
        "Investigation",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    simulations: Mapped[List["Simulation"]] = relationship(
        "Simulation",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    conversations: Mapped[List["Conversation"]] = relationship(
        "Conversation",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    engineering_plans: Mapped[List["EngineeringPlan"]] = relationship(
        "EngineeringPlan",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
    pull_request_reviews: Mapped[List["PullRequestReview"]] = relationship(
        "PullRequestReview",
        back_populates="repository",
        cascade="all, delete-orphan",
    )
