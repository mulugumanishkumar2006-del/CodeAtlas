# apps/backend/app/schemas/aeo_boardroom_command.py

from typing import List, Optional

from pydantic import BaseModel


# 🌟 Ultimate Feature: AI Engineering Boardroom DTOs
class BoardroomStatement(BaseModel):
    role_id: str  # "cto", "architect", "sre", "security", "pm"
    role_title: str  # e.g. "CTO AI", "Architect AI"
    statement_text: str  # e.g. "Scaling risk is increasing."
    key_concern: str
    proposed_resolution: str


class BoardroomProposalRequest(BaseModel):
    proposal_title: Optional[str] = (
        "Split Checkout Service & Migrate to Active-Active Dual Region"
    )


class AIEngineeringBoardroomResponse(BaseModel):
    proposal_title: str
    discussion_statements: List[BoardroomStatement]
    consensus_verdict: str  # "Consensus: Migration in Q2."
    verdict_summary: str


# Feature 8: Strategic Decision Simulator DTOs
class StrategyComparisonOption(BaseModel):
    strategy_name: str
    business_impact_score: float
    engineering_risk_rating: str
    estimated_duration_weeks: float
    total_cost_usd: float


class StrategicDecisionSimulatorResponse(BaseModel):
    proposal_query: str
    option_a: StrategyComparisonOption
    option_b: StrategyComparisonOption
    recommended_strategy: str


# Feature 9: Executive Dashboard DTOs
class ExecutiveDashboardMetrics(BaseModel):
    delivery_health_pct: float
    architecture_health_pct: float
    tech_debt_trend_pct: float  # Negative indicates reduction
    cost_forecast_monthly_usd: float
    capacity_planning_allocated_pct: float


# Feature 10: Autonomous Improvement Engine DTOs
class AutonomousImprovementOpportunity(BaseModel):
    opportunity_id: str
    category: str  # "Performance", "Security", "Reliability", "Maintainability", "Cost Efficiency"
    title: str
    description: str
    estimated_impact: str
    auto_remediation_available: bool


class AutonomousImprovementEngineResponse(BaseModel):
    total_opportunities_detected: int
    opportunities: List[AutonomousImprovementOpportunity]
    engine_verdict: str
