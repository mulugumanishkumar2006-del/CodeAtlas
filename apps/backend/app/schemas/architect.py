from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------


class RecommendationCategory(str, Enum):
    design_pattern = "design_pattern"
    scalability = "scalability"
    refactoring = "refactoring"


class RecommendationRisk(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class RecommendationStatus(str, Enum):
    open = "open"
    acknowledged = "acknowledged"
    dismissed = "dismissed"


class ImpactLevel(str, Enum):
    High = "High"
    Medium = "Medium"
    Low = "Low"


class EffortLevel(str, Enum):
    High = "High"
    Medium = "Medium"
    Low = "Low"


# ---------------------------------------------------------------------------
# Core recommendation object
# ---------------------------------------------------------------------------


class ArchitectureRecommendation(BaseModel):
    """
    A single architecture recommendation produced by the ArchitectDecisionEngine.
    Every field is mandatory and evidence-backed — this is NOT free-text output.

    Feature 2 — Prioritization scores are derived from:
      • business_impact_score   — how critical this is to business capabilities
      • technical_impact_score  — structural improvement to the codebase
      • risk_reduction_score    — how much system risk this eliminates
      • engineering_effort_score — how much work it takes (higher = more effort)
      • health_improvement_pct  — estimated repository health % improvement

    composite_priority_score = (business*0.25) + (technical*0.25) + (risk*0.25)
                              + ((100 - effort)*0.15) + (health_pct*0.10)
    """

    id: str = Field(..., description="Unique recommendation identifier e.g. rec_001")
    category: RecommendationCategory = Field(
        ..., description="Category: design_pattern | scalability | refactoring"
    )
    title: str = Field(..., description="Short, actionable recommendation title")
    priority: int = Field(
        ...,
        ge=1,
        le=5,
        description="Priority: 1=Critical, 2=High, 3=Medium, 4=Low, 5=Informational",
    )
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence score 0.0–1.0"
    )
    risk: RecommendationRisk = Field(..., description="Risk level: HIGH | MEDIUM | LOW")
    estimated_effort: str = Field(
        ..., description="Estimated engineering effort e.g. '2–3 weeks'"
    )
    expected_impact: str = Field(
        ..., description="Expected outcome if recommendation is followed"
    )
    evidence: List[str] = Field(
        default_factory=list,
        description="Concrete, repo-specific evidence items (file paths, metric values, graph facts)",
    )
    reason: str = Field(..., description="Engineering rationale for the recommendation")
    trade_offs: List[str] = Field(
        default_factory=list,
        description="Known trade-offs or costs of adopting this recommendation",
    )
    status: RecommendationStatus = Field(
        default=RecommendationStatus.open,
        description="Current status of the recommendation",
    )
    alternatives: List[str] = Field(
        default_factory=list, description="Considered architectural alternatives"
    )

    # --- Optional enrichment ---
    affected_modules: Optional[List[str]] = Field(
        None, description="Module or file names most directly affected"
    )
    suggested_pattern: Optional[str] = Field(
        None, description="Name of the architectural pattern being recommended"
    )
    effort_hours_estimate: Optional[int] = Field(
        None, description="Rough engineering hours estimate"
    )
    tags: Optional[List[str]] = Field(
        None,
        description="Free-form tags e.g. ['coupling', 'circular-dep', 'god-class']",
    )

    # --- Feature 2: Prioritization scores (0–100) ---
    business_impact_score: Optional[float] = Field(
        None,
        description="Business impact score 0–100 (how critical to business capabilities)",
    )
    technical_impact_score: Optional[float] = Field(
        None,
        description="Technical impact score 0–100 (structural improvement to codebase)",
    )
    risk_reduction_score: Optional[float] = Field(
        None,
        description="Risk reduction score 0–100 (how much system risk this eliminates)",
    )
    engineering_effort_score: Optional[float] = Field(
        None,
        description="Engineering effort score 0–100 (100 = maximum effort required)",
    )
    health_improvement_pct: Optional[float] = Field(
        None, description="Estimated repository health % improvement if implemented"
    )
    composite_priority_score: Optional[float] = Field(
        None, description="Weighted composite score 0–100 used for ranking"
    )
    impact_level: Optional[str] = Field(
        None, description="Human-readable impact level: High | Medium | Low"
    )
    effort_level: Optional[str] = Field(
        None, description="Human-readable effort level: High | Medium | Low"
    )
    expected_improvement: Optional[str] = Field(
        None, description="Expected health improvement as percentage string e.g. '24%'"
    )


# ---------------------------------------------------------------------------
# Report (collection of recommendations)
# ---------------------------------------------------------------------------


class CategorySummary(BaseModel):
    design_pattern: int = 0
    scalability: int = 0
    refactoring: int = 0


class RepoArchitectureSummary(BaseModel):
    total_files: int = 0
    total_nodes: int = 0
    total_relationships: int = 0
    detected_patterns: List[str] = Field(default_factory=list)
    compliance_score: float = 0.0
    overall_health_score: float = 0.0
    circular_dependency_count: int = 0
    high_risk_files: int = 0
    orphan_modules: int = 0


class ArchitectReportResponse(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    recommendations: List[ArchitectureRecommendation] = Field(default_factory=list)
    total_recommendations: int = 0
    total_by_category: CategorySummary = Field(default_factory=CategorySummary)
    total_by_priority: Dict[int, int] = Field(default_factory=dict)
    top_priority_recommendation: Optional[ArchitectureRecommendation] = None
    repo_summary: RepoArchitectureSummary = Field(
        default_factory=RepoArchitectureSummary
    )
    engineering_verdict: str = Field(
        default="",
        description="One-line engineering verdict summarising the most critical action",
    )


class ArchitectSummaryResponse(BaseModel):
    """Lightweight summary for sidebar badges and quick info cards."""

    repo_id: str
    total_recommendations: int
    critical_count: int
    high_count: int
    average_confidence: float
    top_category: str
    engineering_verdict: str
    generated_at: datetime


# ---------------------------------------------------------------------------
# Feedback (acknowledge / dismiss)
# ---------------------------------------------------------------------------


class RecommendationFeedbackRequest(BaseModel):
    status: RecommendationStatus = Field(
        ..., description="New status: acknowledged | dismissed"
    )
    note: Optional[str] = Field(None, description="Optional engineer note")


# ---------------------------------------------------------------------------
# Roadmap and Dashboard (Feature 12 and Roadmap API)
# ---------------------------------------------------------------------------


class RoadmapMilestone(BaseModel):
    id: str
    phase: int
    title: str
    description: str
    priority: int
    estimated_days: int
    dependencies: List[str]
    risk: str


class RoadmapResponse(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    milestones: List[RoadmapMilestone] = Field(default_factory=list)


class DashboardSprintTask(BaseModel):
    title: str
    priority: int
    days: int


class DashboardResponse(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    active_recommendations: int
    priority_score: float
    health_improvement_potential: float
    risk_reduction: float
    estimated_engineering_cost: str
    suggested_sprint_plan: str
    sprint_tasks: List[DashboardSprintTask] = Field(default_factory=list)
    health_history: List[float] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Feature 11 — Architecture Copilot
# ---------------------------------------------------------------------------


class CopilotOpportunity(BaseModel):
    id: str
    title: str
    metrics_summary: str
    impact: str
    effort: str
    confidence: float


class ArchitectureCopilotReport(BaseModel):
    repo_id: str
    health_score: float
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    opportunities: List[CopilotOpportunity] = Field(default_factory=list)
