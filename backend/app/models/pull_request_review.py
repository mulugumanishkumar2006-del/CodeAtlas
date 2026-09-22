from typing import Any, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.repository import Repository
    from backend.app.models.user import User


class PullRequestReview(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Phase 24: Persisted CI/CD & Automated Pull Request Reviews.
    Stores diff metrics, changed files and symbols, breaking changes,
    blast radius, architecture drift, risk & debt deltas, security/reliability findings,
    test impact, review gates, and inline findings.
    Strictly scoped to a single repository.
    """
    __tablename__ = "pull_request_reviews"

    repository_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    provider: Mapped[str] = mapped_column(
        String(50),
        default="local",
        nullable=False,
        index=True,
    )  # github, gitlab, local, cli
    pr_number: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    source_branch: Mapped[str | None] = mapped_column(String(255), nullable=True)
    target_branch: Mapped[str | None] = mapped_column(String(255), nullable=True)
    base_commit_sha: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    head_commit_sha: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    author: Mapped[str | None] = mapped_column(String(255), nullable=True)

    status: Mapped[str] = mapped_column(
        String(50),
        default="completed",
        nullable=False,
        index=True,
    )  # pending, analyzing, completed, failed
    review_gate_status: Mapped[str] = mapped_column(
        String(50),
        default="PASSED",
        nullable=False,
        index=True,
    )  # PASSED, WARNING, FAILED, BLOCKED

    summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Quantitative Summary Metrics
    changed_files_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    changed_symbols_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    insertions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    deletions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    risk_score_before: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    risk_score_after: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    risk_delta: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    debt_hours_before: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    debt_hours_after: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    debt_hours_delta: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    debt_cost_before: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    debt_cost_after: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    debt_cost_delta: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    breaking_changes_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    architecture_violations_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    security_findings_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reliability_findings_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    test_gaps_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Detailed Structured JSON Payloads
    diff_summary_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    symbol_changes_json: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)
    breaking_changes_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    architecture_review_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    impact_analysis_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    risk_breakdown_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    technical_debt_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    security_review_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    reliability_review_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    test_impact_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    historical_context_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    unknowns_json: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)
    validation_checklist_json: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)
    review_comments_json: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)
    review_gates_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    ai_review_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    config_snapshot_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="pull_request_reviews")
    user: Mapped["User | None"] = relationship("User", foreign_keys=[user_id])
