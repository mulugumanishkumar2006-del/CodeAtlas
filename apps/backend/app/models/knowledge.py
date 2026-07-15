from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class KnowledgeSummary(Base):
    """
    Repository-level aggregated knowledge retention and risk scores.
    """

    __tablename__ = "knowledge_summaries"

    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    bus_factor = Column(Integer, nullable=False, default=1)
    knowledge_concentration = Column(Float, nullable=False, default=0.0)
    documentation_quality = Column(Float, nullable=False, default=0.0)
    team_resilience_score = Column(Float, nullable=False, default=50.0)
    overall_risk = Column(String, nullable=False, default="Low")
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    repository = relationship("Repository")


class OwnershipDistribution(Base):
    """
    Codebase authorship and primary ownership statistics per developer.
    """

    __tablename__ = "ownership_distributions"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    author_name = Column(String, nullable=False)
    author_email = Column(String, nullable=False)
    files_owned = Column(Integer, nullable=False, default=0)
    ownership_percentage = Column(Float, nullable=False, default=0.0)
    last_commit_at = Column(DateTime(timezone=True), nullable=True)
    risk_score = Column(Float, nullable=False, default=0.0)

    repository = relationship("Repository")


class KnowledgeRiskItem(Base):
    """
    Component-level knowledge loss risks (single-point-of-failure files, stale maintainers).
    """

    __tablename__ = "knowledge_risk_items"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    file_path = Column(String, nullable=False)
    risk_level = Column(String, nullable=False, default="Low")  # Low, Medium, High
    reason = Column(String, nullable=False)
    owner_name = Column(String, nullable=False)
    owner_email = Column(String, nullable=False)
    mitigation_action = Column(String, nullable=False)

    repository = relationship("Repository")


class DocumentationGap(Base):
    """
    Files/modules with high complexity but low documentation coverage.
    """

    __tablename__ = "documentation_gaps"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    file_path = Column(String, nullable=False)
    complexity = Column(Integer, nullable=False, default=0)
    documentation_coverage = Column(Float, nullable=False, default=0.0)
    comment_lines = Column(Integer, nullable=False, default=0)
    code_lines = Column(Integer, nullable=False, default=0)
    gap_severity = Column(String, nullable=False, default="Low")  # Low, Medium, High

    repository = relationship("Repository")


class ModuleOwnership(Base):
    """
    Ownership details for every module/file to render the Ownership Heatmap.
    """

    __tablename__ = "module_ownerships"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    file_path = Column(String, nullable=False)
    primary_owner_name = Column(String, nullable=False)
    primary_owner_email = Column(String, nullable=False)
    secondary_owner_name = Column(String, nullable=True)
    secondary_owner_email = Column(String, nullable=True)
    num_contributors = Column(Integer, nullable=False, default=1)
    last_modified_at = Column(DateTime(timezone=True), nullable=True)
    ownership_concentration = Column(Float, nullable=False, default=0.0)
    risk_level = Column(
        String, nullable=False, default="Low"
    )  # Critical, High, Medium, Low
    knowledge_risk_score = Column(Float, nullable=False, default=0.0)
    risk_reasons = Column(String, nullable=False, default="[]")

    repository = relationship("Repository")


class DocumentationReport(Base):
    """
    Detailed documentation analysis scores (README quality, ADR coverage, APIs, inline comments).
    """

    __tablename__ = "documentation_reports"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    coverage = Column(Float, nullable=False, default=0.0)
    missing_docs = Column(
        String, nullable=False, default="[]"
    )  # Serialized JSON list of missing guides
    recommendations = Column(
        String, nullable=False, default="[]"
    )  # Serialized JSON list of recommendations
    documentation_score = Column(Float, nullable=False, default=0.0)
    readme_score = Column(Float, nullable=False, default=0.0)
    adr_score = Column(Float, nullable=False, default=0.0)
    api_doc_score = Column(Float, nullable=False, default=0.0)
    inline_comments_score = Column(Float, nullable=False, default=0.0)
    missing_docs_count = Column(Integer, nullable=False, default=0)
    readme_details = Column(String, nullable=True)
    adr_details = Column(String, nullable=True)
    api_doc_details = Column(String, nullable=True)
    inline_comments_details = Column(String, nullable=True)

    repository = relationship("Repository")


class KnowledgeGapDetail(Base):
    """
    Identified knowledge gaps: complex, low-doc modules with few contributors and high recent activity.
    """

    __tablename__ = "knowledge_gap_details"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    file_path = Column(String, nullable=False)
    complexity = Column(Integer, nullable=False, default=0)
    documentation_coverage = Column(Float, nullable=False, default=0.0)
    num_contributors = Column(Integer, nullable=False, default=1)
    recent_changes_count = Column(Integer, nullable=False, default=0)
    risk_score = Column(Float, nullable=False, default=0.0)
    risk_level = Column(
        String, nullable=False, default="Low"
    )  # Critical, High, Medium, Low
    reasons = Column(String, nullable=False)
    mitigation_action = Column(String, nullable=False)

    repository = relationship("Repository")


class ExpertiseGraph(Base):
    """
    Expertise flow layout representing Developer -> Modules -> Services -> Databases -> Infrastructure.
    """

    __tablename__ = "expertise_graphs"

    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    graph_json = Column(String, nullable=False, default="{}")

    repository = relationship("Repository")


class KnowledgeTransferPlan(Base):
    """
    Recommendations to mitigate knowledge concentration risks on high-risk files.
    """

    __tablename__ = "knowledge_transfer_plans"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    file_path = Column(String, nullable=False)
    current_owners_summary = Column(String, nullable=False)
    steps_json = Column(String, nullable=False, default="[]")
    current_risk_score = Column(Float, nullable=False, default=0.0)
    projected_risk_score = Column(Float, nullable=False, default=0.0)

    repository = relationship("Repository")


class DocumentationAdvisor(Base):
    """
    AI-driven automated recommendations for documentation improvements.
    """

    __tablename__ = "documentation_advisors"

    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    missing_adrs = Column(String, nullable=False, default="[]")
    missing_api_docs = Column(String, nullable=False, default="[]")
    missing_readme_sections = Column(String, nullable=False, default="[]")
    missing_architecture_diagrams = Column(String, nullable=False, default="[]")
    missing_onboarding_guides = Column(String, nullable=False, default="[]")

    repository = relationship("Repository")


class KnowledgeMemory(Base):
    """
    Searchable engineering memory database matching key design choices (e.g. why Redis, Postgres).
    """

    __tablename__ = "knowledge_memories"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    topic = Column(String, nullable=False, index=True)
    answer = Column(String, nullable=False)
    source_type = Column(
        String, nullable=False
    )  # e.g. "ADR", "Commit History", "Documentation", "Code Comment"
    source_path = Column(String, nullable=False)

    repository = relationship("Repository")


class KnowledgeEvolutionSnapshot(Base):
    """
    Historical record of knowledge distribution changes over time.
    """

    __tablename__ = "knowledge_evolution_snapshots"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    timestamp = Column(DateTime(timezone=True), nullable=False)
    event_type = Column(
        String, nullable=False
    )  # e.g., "Ownership Expanded", "Single Maintainer Flagged", "Documentation Added", "Risk Mitigated"
    description = Column(String, nullable=False)
    affected_file = Column(String, nullable=True)
    bus_factor = Column(Integer, nullable=False, default=1)
    risk_score = Column(Float, nullable=False, default=50.0)

    repository = relationship("Repository")


class KnowledgeScore(Base):
    """
    Module-level knowledge risk, documentation score, and bus factor metrics.
    """

    __tablename__ = "knowledge_scores"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    module = Column(String, nullable=False)
    knowledge_risk = Column(Float, nullable=False, default=0.0)
    documentation_score = Column(Float, nullable=False, default=0.0)
    bus_factor = Column(Integer, nullable=False, default=1)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    repository = relationship("Repository")


class Ownership(Base):
    """
    Module-level primary owners, secondary maintainers, and contributor numbers.
    """

    __tablename__ = "ownership"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    repo_id = Column(
        String,
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    module = Column(String, nullable=False)
    primary_owner = Column(String, nullable=False)
    secondary_owner = Column(String, nullable=True)
    contributors = Column(Integer, nullable=False, default=1)

    repository = relationship("Repository")
