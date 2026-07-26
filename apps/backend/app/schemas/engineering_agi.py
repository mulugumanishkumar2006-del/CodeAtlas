# apps/backend/app/schemas/engineering_agi.py

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ExecutiveMacroQueryRequest(BaseModel):
    prompt: str = Field(
        ...,
        description="High-level strategic prompt (e.g. 'Our company wants to expand from India to Europe over the next two years')",
    )
    target_timeline_years: float = 2.0
    budget_cap_usd: Optional[float] = None
    primary_region: str = "India (ap-south-1)"
    target_region: str = "Europe (eu-central-1)"


class PersonaInsight(BaseModel):
    role: str  # CTO, Architect, Scientist, Security, SRE, Finance, Product, Cloud, Data
    persona_name: str
    avatar_icon: str
    strategic_assessment: str
    key_recommendation: str
    risk_rating: str  # "Low", "Medium", "High", "Critical"


class CostEstimate(BaseModel):
    cloud_infra_monthly_usd: float
    one_time_migration_cost_usd: float
    compliance_licensing_cost_usd: float
    total_2year_cost_usd: float


class HiringEstimate(BaseModel):
    role_title: str
    headcount_needed: int
    avg_annual_salary_usd: float
    hiring_priority: str  # "Immediate", "Q3 2026", "Q1 2027"


class RiskPrediction(BaseModel):
    category: str  # "Data Sovereignty", "Cross-Border Latency", "Operational Burnout", "Security CVE"
    severity: str  # "Critical", "High", "Medium", "Low"
    description: str
    mitigation_strategy: str
    financial_exposure_usd: float


class QuarterlyMilestone(BaseModel):
    quarter: str  # "Q1 2026", "Q2 2026", ..., "Q4 2027"
    focus_area: str
    key_deliverables: List[str]
    architecture_state: str


class SprintPlan(BaseModel):
    sprint_number: int
    epic_title: str
    user_stories: List[str]
    total_story_points: int


class CloudStrategy(BaseModel):
    primary_region: str
    secondary_region: str
    topology: str  # "Multi-Region Active-Active with Kafka MirrorMaker"
    db_replication: str  # "CockroachDB Multi-Region Row-Level Lease Holders"
    cdn_edge_provider: str


class TradeOffAnalysis(BaseModel):
    option_a_title: str
    option_a_pros_cons: Dict[str, Any]
    option_b_title: str
    option_b_pros_cons: Dict[str, Any]
    recommended_option: str
    rationale: str


class SimulationMetrics(BaseModel):
    cross_border_latency_ms: float
    throughput_rps: int
    failure_probability_pct: float
    gdpr_compliance_score: float  # 0 to 100


class EngineeringAGIExecutiveResponse(BaseModel):
    macro_prompt: str
    executive_summary: str
    persona_council_insights: List[PersonaInsight]
    cost_estimate: CostEstimate
    hiring_estimates: List[HiringEstimate]
    risk_predictions: List[RiskPrediction]
    two_year_roadmap: List[QuarterlyMilestone]
    sprint_plans: List[SprintPlan]
    cloud_strategy: CloudStrategy
    trade_off_analysis: TradeOffAnalysis
    simulation_metrics: SimulationMetrics
    overall_system_verdict: str
