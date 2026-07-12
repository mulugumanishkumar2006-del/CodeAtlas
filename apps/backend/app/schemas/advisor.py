from datetime import datetime
from typing import Any, Dict, List

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Pattern Advisory
# ---------------------------------------------------------------------------


class PatternAdvisory(BaseModel):
    """
    A single design pattern advisory produced by the DesignPatternAdvisorService.
    Covers why to use, where specifically in the codebase, and full trade-off analysis.
    """

    id: str
    pattern_name: str = Field(
        ..., description="Human-readable pattern name e.g. 'Repository Pattern'"
    )
    pattern_key: str = Field(
        ..., description="Machine key e.g. 'repository', 'factory', 'circuit_breaker'"
    )
    category: str = Field(
        ...,
        description="GoF or Architectural category: Creational | Structural | Behavioral | Architectural | Distributed",
    )
    icon: str = Field(..., description="Emoji icon for UI display")
    applicable: bool = Field(
        ..., description="True if the pattern should be applied to this codebase"
    )
    already_present: bool = Field(
        default=False,
        description="True if the pattern is already detected in the codebase",
    )
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence that this advisory is correct"
    )
    priority: int = Field(
        ..., ge=1, le=5, description="Recommended implementation priority"
    )
    effort: str = Field(..., description="Low | Medium | High")
    why: str = Field(
        ..., description="Why this pattern is recommended for this specific codebase"
    )
    where: List[str] = Field(
        default_factory=list,
        description="Specific modules/files where to apply the pattern",
    )
    benefits: List[str] = Field(
        default_factory=list,
        description="Concrete benefits of applying this pattern here",
    )
    drawbacks: List[str] = Field(
        default_factory=list, description="Known drawbacks or trade-offs"
    )
    evidence: List[str] = Field(
        default_factory=list,
        description="Repository-specific evidence for the recommendation",
    )
    implementation_hint: str = Field(
        default="", description="Short 1-2 sentence implementation guide"
    )
    related_patterns: List[str] = Field(
        default_factory=list, description="Complementary patterns to consider"
    )


class PatternAdvisoryReport(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    advisories: List[PatternAdvisory] = Field(default_factory=list)
    total_applicable: int = 0
    total_already_present: int = 0
    total_not_applicable: int = 0
    recommended_order: List[str] = Field(
        default_factory=list,
        description="Pattern names in recommended implementation order",
    )
    summary: str = Field(default="", description="One-line summary of pattern health")


# ---------------------------------------------------------------------------
# Scalability Advisory
# ---------------------------------------------------------------------------


class ScalabilityAdvisory(BaseModel):
    """
    A single scalability advisory with detected issue, recommendation, and implementation guide.
    """

    id: str
    recommendation: str = Field(
        ..., description="Human-readable recommendation e.g. 'Add Redis Cache'"
    )
    technique: str = Field(
        ...,
        description="Technique key: caching | cdn | load_balancer | queue | read_replica | partitioning | sharding | service_mesh | horizontal_scaling",
    )
    category: str = Field(
        ...,
        description="Category: Infrastructure | Database | Messaging | Caching | Networking",
    )
    icon: str
    severity: str = Field(..., description="Critical | High | Medium | Low")
    confidence: float = Field(..., ge=0.0, le=1.0)
    issue_description: str = Field(
        ..., description="Description of the detected scalability bottleneck"
    )
    evidence: List[str] = Field(default_factory=list)
    why: str = Field(..., description="Why this technique addresses the detected issue")
    where: List[str] = Field(
        default_factory=list, description="Specific services/modules affected"
    )
    benefits: List[str] = Field(default_factory=list)
    implementation_steps: List[str] = Field(
        default_factory=list, description="Ordered concrete implementation steps"
    )
    estimated_improvement: str = Field(
        default="", description="e.g. '50–70% read latency reduction'"
    )
    effort: str = Field(..., description="Low | Medium | High")
    tags: List[str] = Field(default_factory=list)


class ScalabilityReport(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    advisories: List[ScalabilityAdvisory] = Field(default_factory=list)
    total_issues: int = 0
    critical_count: int = 0
    high_count: int = 0
    categories_affected: List[str] = Field(default_factory=list)
    scalability_verdict: str = Field(
        default="", description="One-line verdict on overall scalability health"
    )


# ---------------------------------------------------------------------------
# Feature 5 — Refactoring Advisor
# ---------------------------------------------------------------------------


class ModuleComponent(BaseModel):
    """A proposed extracted component from a god module decomposition."""

    name: str = Field(..., description="Proposed component name e.g. 'OrderDomain'")
    responsibility: str = Field(
        ..., description="One-line description of what this component owns"
    )
    estimated_effort_weeks: int = Field(..., description="Engineering weeks to extract")
    key_responsibilities: List[str] = Field(
        default_factory=list, description="Bullet list of what this component will own"
    )
    depends_on: List[str] = Field(
        default_factory=list, description="Other components this one depends on"
    )
    color: str = Field(
        default="#a78bfa", description="UI accent color for this component"
    )


class MigrationPhase(BaseModel):
    """One phase in the module migration plan."""

    phase: int
    name: str = Field(..., description="Phase name e.g. 'Extract API Layer'")
    weeks: str = Field(..., description="Week range e.g. '1–2'")
    tasks: List[str] = Field(
        default_factory=list, description="Ordered tasks in this phase"
    )
    can_parallelize: bool = Field(
        default=False, description="Can this run in parallel with other work"
    )
    risk_level: str = Field(
        default="Medium", description="Risk level: Low | Medium | High"
    )


class RefactoringRisk(BaseModel):
    """An identified risk in the refactoring plan."""

    risk: str = Field(..., description="Description of the risk")
    likelihood: str = Field(..., description="Low | Medium | High")
    impact: str = Field(..., description="Low | Medium | High")
    mitigation: str = Field(..., description="Concrete mitigation strategy")


class ExpectedImprovement(BaseModel):
    """A measurable improvement expected after the refactoring."""

    metric: str = Field(..., description="Metric name e.g. 'Average Fan-In per Module'")
    before: str = Field(..., description="Current value")
    after: str = Field(..., description="Expected value after refactoring")
    improvement: str = Field(..., description="Delta e.g. '+24%' or '-68%'")


class RefactoringPlan(BaseModel):
    """
    Feature 5 — Complete module decomposition plan.
    Instead of 'Refactor this', provides a specific split-into architecture
    with migration plan, risks, timeline, and expected improvements.
    """

    id: str
    source_module: str = Field(..., description="Name of the god module to decompose")
    source_loc: int = Field(default=0, description="Current lines of code")
    source_complexity: int = Field(
        default=0, description="Current max cyclomatic complexity"
    )
    source_fan_in: int = Field(
        default=0, description="Current afferent coupling (incoming)"
    )
    source_fan_out: int = Field(
        default=0, description="Current efferent coupling (outgoing)"
    )
    rationale: str = Field(..., description="Why this module needs decomposition")
    split_into: List[ModuleComponent] = Field(
        default_factory=list, description="Proposed decomposed components"
    )
    migration_phases: List[MigrationPhase] = Field(
        default_factory=list, description="Ordered migration phases"
    )
    risks: List[RefactoringRisk] = Field(
        default_factory=list, description="Identified risks"
    )
    total_timeline_weeks: int = Field(..., description="Total weeks for full migration")
    expected_improvements: List[ExpectedImprovement] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)
    priority: int = Field(..., ge=1, le=5)


class RefactoringAdvisoryReport(BaseModel):
    """Feature 5 — Collection of module decomposition plans."""

    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    plans: List[RefactoringPlan] = Field(default_factory=list)
    total_plans: int = 0
    total_effort_weeks: int = 0
    summary: str = Field(default="")


# ---------------------------------------------------------------------------
# Feature 6 — Coupling Reduction Advisor
# ---------------------------------------------------------------------------


class CouplingIssue(BaseModel):
    """
    Feature 6 — A specific coupling problem with a precise, actionable fix.
    Not 'reduce coupling' — but 'Extract X interface and inject via constructor'.
    """

    id: str
    issue_type: str = Field(
        ..., description="high_coupling | cyclic_dependency | god_object | large_module"
    )
    severity: str = Field(..., description="Critical | High | Medium | Low")
    module_name: str
    description: str = Field(
        ..., description="Precise description of the coupling problem"
    )
    metrics: Dict[str, Any] = Field(
        default_factory=dict, description="fan_in, fan_out, loc, max_cc, etc."
    )
    affected_modules: List[str] = Field(
        default_factory=list, description="All modules involved in this coupling issue"
    )
    precise_fix: str = Field(
        ..., description="Specific actionable fix — not generic advice"
    )
    fix_steps: List[str] = Field(
        default_factory=list, description="Ordered concrete engineering steps"
    )
    before_state: str = Field(..., description="Description of current coupling state")
    after_state: str = Field(
        ..., description="Description of state after fix is applied"
    )
    estimated_effort: str = Field(..., description="e.g. '3–5 days'")
    expected_improvement: str = Field(
        ..., description="e.g. 'Eliminates 3 circular imports'"
    )
    confidence: float = Field(..., ge=0.0, le=1.0)
    tags: List[str] = Field(default_factory=list)


class CouplingReport(BaseModel):
    """Feature 6 — Coupling analysis report."""

    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    issues: List[CouplingIssue] = Field(default_factory=list)
    total_issues: int = 0
    coupling_health_score: float = Field(
        default=0.0, description="0–100 score (100 = perfectly decoupled)"
    )
    by_type: Dict[str, int] = Field(default_factory=dict)
    verdict: str = Field(default="")


# ---------------------------------------------------------------------------
# Feature 7 — Architecture Decision Generator (ADR)
# ---------------------------------------------------------------------------


class ADRProposal(BaseModel):
    id: str = Field(..., description="e.g. 'ADR-021'")
    title: str = Field(..., description="ADR title")
    decision: str = Field(..., description="The decision made")
    reason: str = Field(..., description="The reason for this decision")
    alternatives: List[str] = Field(
        default_factory=list, description="Alternatives considered"
    )
    result: str = Field(..., description="Expected outcome / result")
    status: str = Field(
        default="Proposed", description="Proposed | Accepted | Rejected | Deprecated"
    )
    date: str = Field(..., description="Date of generation")


class ADRReport(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    proposals: List[ADRProposal] = Field(default_factory=list)
    total_proposals: int = 0


# ---------------------------------------------------------------------------
# Feature 8 — AI Engineering Review
# ---------------------------------------------------------------------------


class AIReviewReport(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    overall_summary: str = Field(
        ..., description="Narrative overview of repository engineering health"
    )


# ---------------------------------------------------------------------------
# Feature 9 — Sprint Recommendation Engine
# ---------------------------------------------------------------------------


class SprintTask(BaseModel):
    id: str
    priority_level: int = Field(..., description="1 | 2 | 3")
    title: str = Field(..., description="e.g. 'Authentication Refactor'")
    estimated_days: int = Field(..., description="Days to complete")
    expected_improvement_pct: int = Field(
        ..., description="Expected improvement percentage"
    )
    risk: str = Field(..., description="Low | Medium | High")
    rationale: str
    target_component: str


class SprintRecommendation(BaseModel):
    sprint_name: str = Field(..., description="e.g. 'Sprint 14'")
    tasks: List[SprintTask] = Field(default_factory=list)


class SprintReport(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    sprints: List[SprintRecommendation] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Feature 10 — Multi-Level Recommendation
# ---------------------------------------------------------------------------


class ScopeRecommendation(BaseModel):
    id: str
    scope: str = Field(
        ..., description="Function | Class | Module | Service | Repository | Enterprise"
    )
    target_name: str = Field(..., description="The name of the target entity")
    title: str
    recommendation: str
    impact: str = Field(..., description="Low | Medium | High")
    effort: str = Field(..., description="Low | Medium | High")
    suggested_fix: str


class MultiLevelReport(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    recommendations: List[ScopeRecommendation] = Field(default_factory=list)
    total_by_scope: Dict[str, int] = Field(default_factory=dict)
