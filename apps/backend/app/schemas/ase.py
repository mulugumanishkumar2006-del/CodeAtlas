from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class EvolutionItemAction(BaseModel):
    step: int
    title: str
    description: str
    target_file: Optional[str] = None
    suggested_change: Optional[str] = None


class EvolutionPlanItemBase(BaseModel):
    category: str
    title: str
    description: Optional[str] = None
    target_component: Optional[str] = None
    priority_score: float = 0.0
    business_impact: float = 0.0
    risk_score: float = 0.0
    effort_score: float = 0.0
    confidence_score: float = 0.95
    target_week: int = 1
    timeline_horizon: str = (
        "next_sprint"  # today, next_sprint, next_quarter, next_year, ideal
    )
    status: str = (
        "proposed"  # proposed, queued, validating, approved, rejected, completed
    )

    # ⭐ Feature 13: AI Review Board Metadata
    why_statement: Optional[str] = None
    expected_benefit: Optional[str] = None
    evidence: List[Dict[str, Any]] = Field(default_factory=list)

    # ⭐ Feature 14: Improvement Dependency Graph
    prerequisites: List[str] = Field(default_factory=list)

    # ⭐ Feature 25: ROI Calculator Metrics
    roi_metrics: Dict[str, Any] = Field(default_factory=dict)

    metrics: Dict[str, Any] = Field(default_factory=dict)
    actions: List[EvolutionItemAction] = Field(default_factory=list)
    validation_status: str = "pending"
    risk_analysis: Dict[str, Any] = Field(default_factory=dict)


class EvolutionPlanItemCreate(EvolutionPlanItemBase):
    repository_id: str


class EvolutionPlanItemResponse(EvolutionPlanItemBase):
    id: str
    repository_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WeeklyMilestone(BaseModel):
    week: int
    theme: str
    description: str
    target_items_count: int
    estimated_effort_hours: float
    expected_impact_score: float
    items: List[EvolutionPlanItemResponse] = Field(default_factory=list)


class EvolutionRoadmapResponse(BaseModel):
    id: str
    repository_id: str
    title: str
    timeframe_weeks: int
    overall_health_target: float
    current_health_score: float
    status: str
    weekly_phases: List[WeeklyMilestone] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TechDebtScheduleResponse(BaseModel):
    repository_id: str
    total_debt_items: int
    total_estimated_hours: float
    high_impact_quick_wins: List[EvolutionPlanItemResponse]
    scheduled_backlog: List[EvolutionPlanItemResponse]
    debt_by_category: Dict[str, int]


class SmartRefactoringQueueResponse(BaseModel):
    repository_id: str
    total_queued: int
    awaiting_approval: int
    validated_ready: int
    items: List[EvolutionPlanItemResponse]


class DomainPlannerResponse(BaseModel):
    repository_id: str
    planner_type: str
    planner_title: str
    description: str
    summary_metrics: Dict[str, Any]
    items: List[EvolutionPlanItemResponse]


class ContinuousEvolutionTriggerResponse(BaseModel):
    repository_id: str
    status: str
    items_generated: int
    roadmap_updated: bool
    summary: Dict[str, Any]


class EvolutionItemApprovalRequest(BaseModel):
    approver: str = "Engineer"
    notes: Optional[str] = None


class EvolutionItemValidationResponse(BaseModel):
    item_id: str
    validation_status: str
    sandbox_build_success: bool
    test_suite_passed: bool
    multi_agent_consensus: float
    risk_summary: Dict[str, Any]


# ⭐ Feature 14: Dependency Graph Schemas
class DependencyGraphNode(BaseModel):
    id: str
    title: str
    category: str
    prerequisites: List[str]
    is_blocked: bool
    blocking_count: int


class DependencyGraphResponse(BaseModel):
    repository_id: str
    total_nodes: int
    root_nodes: List[DependencyGraphNode]
    nodes: List[DependencyGraphNode]


# ⭐ Feature 15: Engineering Investment Optimizer
class InvestmentOptimizerRequest(BaseModel):
    repository_id: str
    timeframe_weeks: int = 2  # 2 weeks, 4 weeks, etc.
    focus_areas: List[str] = Field(default_factory=list)


class InvestmentOptimizerResponse(BaseModel):
    repository_id: str
    allocated_weeks: int
    total_hours_available: float
    recommended_items: List[EvolutionPlanItemResponse]
    expected_roi: Dict[
        str, Any
    ]  # cost_savings_usd, bug_risk_reduction, dev_hours_saved_per_month
    investment_breakdown: Dict[str, float]  # percentage allocation by category


# 🌟 Signature Feature: Engineering Evolution Timeline
class HorizonMilestone(BaseModel):
    horizon_key: str  # today, next_sprint, next_quarter, next_year, ideal
    horizon_title: str  # "Today (Baseline)", "Next Sprint (2 Weeks)", "Next Quarter (3 Months)", "Next Year (12 Months)", "Ideal Architecture"
    target_health_score: float
    architecture_summary: str
    key_improvements: List[EvolutionPlanItemResponse]
    metrics_delta: Dict[str, Any]


class EngineeringEvolutionTimelineResponse(BaseModel):
    repository_id: str
    current_baseline_score: float
    target_ideal_score: float
    horizons: List[HorizonMilestone]
