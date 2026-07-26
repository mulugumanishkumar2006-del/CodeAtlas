# apps/backend/app/schemas/agi_simulation_insights.py

from typing import Any, Dict, List

from pydantic import BaseModel


# Feature 21: Software Evolution Simulator
class EvolutionSimulatorResponse(BaseModel):
    simulated_horizon_years: float
    projected_code_lines: int
    projected_complexity_avg: float
    projected_tech_debt_hours: float
    architectural_drift_risk: str  # "Low", "Moderate", "High"


# Feature 22: Engineering Market Trends
class MarketTrendsResponse(BaseModel):
    trending_architectures: List[Dict[str, Any]]
    trending_databases: List[Dict[str, Any]]
    fastest_growing_paradigms: List[str]


# Feature 23: Business Goal Translator
class BusinessGoalTranslatorRequest(BaseModel):
    business_okr: str  # e.g. "Reduce checkout drop-off by 15%"


class BusinessGoalTranslatorResponse(BaseModel):
    business_okr: str
    translated_technical_epics: List[str]
    affected_microservices: List[str]
    estimated_refactoring_hours: float
    expected_business_impact: str


# Feature 24: Architecture Experiment Lab
class ArchitectureExperimentResponse(BaseModel):
    experiment_id: str
    option_a_name: str
    option_b_name: str
    latency_delta_pct: float
    throughput_delta_pct: float
    cost_delta_pct: float
    winner_recommendation: str


# Feature 25: Repository Scenario Engine
class ScenarioEngineResponse(BaseModel):
    scenario_query: str
    simulated_outcome: str
    blast_radius_modules: List[str]
    risk_level: str


# Feature 26: Engineering Decision Journal
class DecisionJournalEntry(BaseModel):
    adr_id: str
    title: str
    status: str  # "Accepted", "Proposed", "Superseded"
    decision_driver: str
    date_recorded: str


class DecisionJournalResponse(BaseModel):
    entries: List[DecisionJournalEntry]
    total_adrs: int


# Feature 27: AI Governance Advisor
class GovernanceAdvisorResponse(BaseModel):
    soc2_compliance_pct: float
    hipaa_compliance_pct: float
    pci_dss_compliance_pct: float
    gdpr_compliance_pct: float
    governance_verdict: str


# Feature 28: Risk Portfolio Optimizer
class RiskPortfolioResponse(BaseModel):
    overall_risk_score: float  # 0 to 100
    security_risk: float
    operational_risk: float
    architectural_risk: float
    financial_exposure_usd: float


# Feature 29: Engineering Knowledge Synthesizer
class KnowledgeSynthesizerResponse(BaseModel):
    total_insights_synthesized: int
    key_insights: List[str]


# Feature 30: Cross-Repository Learning
class CrossRepoLearningResponse(BaseModel):
    global_repos_indexed: int
    shared_patterns_extracted: int
    top_extracted_pattern: str


# Feature 31: AI Migration Scientist
class MigrationScientistResponse(BaseModel):
    source_stack: str
    target_stack: str
    migration_complexity: str
    estimated_weeks: float
    automated_migration_coverage_pct: float


# Feature 32: Platform Health Optimizer
class PlatformHealthOptimizerResponse(BaseModel):
    cpu_optimization_pct: float
    memory_savings_pct: float
    recommended_k8s_tune: str


# Feature 33: AI Architecture Debate
class ArchitectureDebateResponse(BaseModel):
    debate_topic: str
    cto_argument: str
    security_argument: str
    sre_argument: str
    consensus_verdict: str


# Feature 34: Future Architecture Explorer
class FutureArchitectureResponse(BaseModel):
    year_horizon: int
    predicted_paradigms: List[str]
    readiness_rating: str


# Feature 35: Engineering Capability Scorer
class CapabilityScorerResponse(BaseModel):
    capability_index_score: float  # 0 to 100
    tier_name: str = "Elite"
    pillar_scores: Dict[str, float]


# Feature 36: Technical Debt Economist
class TechDebtEconomistResponse(BaseModel):
    principal_debt_hours: float
    monthly_interest_hours: float
    financial_interest_cost_monthly_usd: float
    paydown_roi_pct: float


# Feature 37: Developer Productivity Analyzer
class ProductivityAnalyzerResponse(BaseModel):
    context_switch_tax_hours_weekly: float
    pr_lead_time_hours: float
    productivity_index: float


# Feature 38: Reliability Forecast Lab
class ReliabilityForecastResponse(BaseModel):
    forecasted_mtbf_hours: float
    sla_breach_probability_pct: float
    forecast_verdict: str


# Feature 39: Software Lifecycle Intelligence
class SoftwareLifecycleIntelResponse(BaseModel):
    tracked_packages_count: int
    eol_warning_count: int
    lifecycle_health_pct: float


# Feature 40: AI Innovation Advisor
class InnovationAdvisorResponse(BaseModel):
    innovation_opportunities: List[str]
    competitive_advantage_score: float
