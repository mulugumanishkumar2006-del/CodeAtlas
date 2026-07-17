"""Schemas for the Repository Health Intelligence Engine."""

from __future__ import annotations

from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Dimension-level schemas
# ---------------------------------------------------------------------------


class DimensionScore(BaseModel):
    """One of the 11 health dimensions."""

    name: str
    """Human-readable label, e.g. 'Architecture'."""

    score: float
    """Normalised 0–100 score for this dimension."""

    weight: float
    """Contribution weight (0–1) used in the composite formula."""

    grade: str
    """Letter grade: A, B, C, D, or F."""

    trend: str
    """Direction vs previous snapshot: 'up', 'down', or 'stable'."""

    trend_delta: float
    """Numeric change vs previous snapshot (positive = improved)."""

    icon: str
    """Emoji or lucide icon name for the UI."""

    color: str
    """Hex or CSS color used in the radar chart segment."""

    explanation: str
    """One-sentence insight specific to this dimension's score."""

    source: str
    """Which engine/service produced this score."""


# ---------------------------------------------------------------------------
# Trend / history
# ---------------------------------------------------------------------------


class HealthTrendPoint(BaseModel):
    """A single point on the health trend timeline."""

    snapshot_id: int
    timestamp: datetime
    overall_score: float
    grade: str
    dimension_scores: Dict[str, float] = Field(default_factory=dict)
    """Map of dimension name → score at this point in time."""


# ---------------------------------------------------------------------------
# Priority actions (cross-dimensional recommendations)
# ---------------------------------------------------------------------------


class HealthAction(BaseModel):
    """A prioritised action item that will improve the overall health score."""

    rank: int
    title: str
    description: str
    dimension: str
    """Which dimension this action addresses."""
    expected_improvement: float
    """Estimated +Δ on the overall health score after completing this action."""
    effort: str
    """E.g. '1 day', '3 days', '1 sprint'."""
    link_path: str
    """Frontend route where the user can investigate further."""
    severity: str
    """'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'."""


# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Categorized health schemas
# ---------------------------------------------------------------------------


class MeasureDetail(BaseModel):
    name: str
    score: float
    status: str  # "EXCELLENT" | "HEALTHY" | "WARNING" | "HIGH_RISK" | "CRITICAL"
    value_label: str  # e.g., "0 loops", "14.2% ratio", "3 files"
    details: str  # Summary description of why this score was given


class CategoryDetail(BaseModel):
    score: float
    status: str
    grade: str  # A | B | C | D | F
    measures: List[MeasureDetail]


class CategorizedHealthReport(BaseModel):
    architecture_health: CategoryDetail
    code_quality: CategoryDetail
    technical_debt: CategoryDetail
    reliability: CategoryDetail
    knowledge_health: CategoryDetail
    performance_readiness: CategoryDetail
    security_readiness: CategoryDetail
    scalability: CategoryDetail
    maintainability: CategoryDetail
    developer_experience: CategoryDetail


# ---------------------------------------------------------------------------
# Forecast
# ---------------------------------------------------------------------------


class HealthForecastPoint(BaseModel):
    days: int
    label: str
    score: float


class HealthForecast(BaseModel):
    current_score: float
    predictions: List[HealthForecastPoint]
    reason: str


# ---------------------------------------------------------------------------
# Top-level report
# ---------------------------------------------------------------------------


class HealthIntelligenceReport(BaseModel):
    """Full repository health intelligence report."""

    repo_id: str
    snapshot_id: Optional[int] = None
    generated_at: datetime = Field(default_factory=datetime.utcnow)

    # ---- Core score -------------------------------------------------------
    overall_score: float
    """Composite weighted score 0–100."""

    grade: str
    """A / B / C / D / F."""

    status: str
    """'EXCELLENT', 'HEALTHY', 'WARNING', 'HIGH_RISK', 'CRITICAL'."""

    status_color: str
    """CSS color class for the status badge."""

    # ---- Change vs previous snapshot -------------------------------------
    score_delta: float
    """Change in overall score since last snapshot (positive = better)."""

    trend: str
    """'improving', 'stable', 'degrading'."""

    # ---- Narrative --------------------------------------------------------
    headline: str
    """One-line summary shown in the hero card, e.g. 'Your repo health dropped 8 points this week.'"""

    narrative: str
    """Multi-sentence plain-English explanation of the current health state."""

    what_is_healthy: List[str]
    """Top 3 strongest dimensions — what's going well."""

    what_needs_attention: List[str]
    """Top 3 weakest dimensions — where to focus."""

    # ---- 11 Dimensions ----------------------------------------------------
    dimensions: List[DimensionScore]

    # ---- Actions ----------------------------------------------------------
    priority_actions: List[HealthAction]

    # ---- Trend history ----------------------------------------------------
    trend_history: List[HealthTrendPoint] = Field(default_factory=list)

    # ---- Categorized breakdown ---------------------------------------------
    categories: Optional[CategorizedHealthReport] = None

    # ---- Forecast ---------------------------------------------------------
    forecast: Optional[HealthForecast] = None


# ---------------------------------------------------------------------------
# API request / response wrappers
# ---------------------------------------------------------------------------


class AnalyzeHealthRequest(BaseModel):
    use_cached: bool = True
    """If True, re-use the most recent results from each sub-engine (faster).
    If False, force a fresh calculation from all engines (slower, 10–30 s)."""


class TrendResponse(BaseModel):
    repo_id: str
    snapshots: List[HealthTrendPoint]
