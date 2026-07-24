from typing import Any, Dict, List

from app.ai_cto.schemas.recommendation import (
    CostOptimization,
    HiringRecommendation,
    RiskProfile,
)
from app.ai_cto.schemas.roadmap import EngineeringRoadmap
from pydantic import BaseModel, Field


class ExecutiveReport(BaseModel):
    strategic_summary: str = Field(
        ..., description="High-level engineering vision mapping to business goals"
    )
    projected_budget_impact_usd: float = Field(
        ..., description="Estimated total monthly budget variance"
    )
    timeline_verdict: str = Field(
        ..., description="Estimated timeframe for migration/scaling completion"
    )
    regulatory_compliance_check: str = Field(
        ..., description="Compliance status and key gaps identified"
    )
    executive_roi_justification: str = Field(
        ..., description="Business value justification for non-technical stakeholders"
    )
    current_infrastructure_cost: float = Field(
        default=1500.0, description="Estimated current monthly infrastructure spend"
    )
    future_infrastructure_cost: float = Field(
        default=1200.0,
        description="Estimated monthly infrastructure spend post optimization",
    )
    savings_opportunities: float = Field(
        default=300.0, description="Total potential monthly infrastructure cost savings"
    )
    business_impact: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Effect of changes on Cost, Customer Experience, Reliability, and Dev Speed",
    )
    tech_debt_investments: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Prioritized list of technical debt items to solve first",
    )
    incident_prevention: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Future production incidents forecasts and preventative actions",
    )


class EngineeringReport(BaseModel):
    architectural_standards: List[str] = Field(
        default_factory=list, description="Target guidelines and boundary rules"
    )
    target_module_layout: Dict[str, str] = Field(
        default_factory=dict,
        description="Proposed path mapping to new folder structure",
    )
    migration_execution_script: str = Field(
        ..., description="Mock migration commands or structural refactoring pseudocode"
    )
    refactoring_blueprints: str = Field(
        ..., description="Detailed instructions and code patterns to rewrite hotspots"
    )
    architecture_evolution: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Phased roadmap sequence showing evolution path",
    )
    security_strategy: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Authentication, secrets, encryption and dependency updates suggestions",
    )
    reliability_plan: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Disaster recovery, backups, HA, and failover steps",
    )
    technology_recommendations: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Frameworks, databases, queues, and caching recommendations",
    )
    architecture_debate: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Simulates an architecture debate transcript between multiple personas",
    )
    multi_year_vision: List[Dict[str, str]] = Field(
        default_factory=list,
        description="1-3 year multi-year architecture evolution vision roadmap",
    )
    innovation_opportunities: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Adopting new technologies or patterns with measurable benefits",
    )
    explainable_recommendations: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Every recommended change with full explanation fields",
    )


class CTOAnalysisResponse(BaseModel):
    repository_id: str = Field(..., description="Target codebase identifier")
    goals: Dict[str, Any] = Field(
        default_factory=dict, description="Target business goals analyzed"
    )
    growth_projections: Dict[str, Any] = Field(
        default_factory=dict, description="Future growth estimates (LOC, complexity)"
    )
    roi_analysis: Dict[str, Any] = Field(
        default_factory=dict, description="Financial ROI metric scores"
    )
    capacity_planning: Dict[str, Any] = Field(
        default_factory=dict,
        description="Estimated compute and db resource capacity requirements",
    )
    costs: List[CostOptimization] = Field(
        default_factory=list, description="Cost reduction strategies"
    )
    hiring: List[HiringRecommendation] = Field(
        default_factory=list, description="Hiring and organizational plan"
    )
    risks: List[RiskProfile] = Field(
        default_factory=list, description="Technical and team risk assessment"
    )
    roadmap: EngineeringRoadmap = Field(
        ..., description="Milestones, timelines, and dependencies"
    )
    executive_report: ExecutiveReport = Field(
        ..., description="Strategy plan formatted for leadership"
    )
    engineering_report: EngineeringReport = Field(
        ..., description="Blueprint plan formatted for developers"
    )
    predicted_bottlenecks: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Forecasting CPU hotspots, slow services, and future scale constraints",
    )
    persona_reports: Dict[str, str] = Field(
        default_factory=dict,
        description="Targeted strategy reports for CTO, CEO, Engineering Managers, and Investors",
    )
    scenario_simulation: Dict[str, Any] = Field(
        default_factory=dict,
        description="Impact forecasts for a 100x traffic simulation scenario",
    )
