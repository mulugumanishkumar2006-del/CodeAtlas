# apps/backend/app/api/v1/agi_simulation_insights_router.py


from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.agi_simulation_insights import (
    ArchitectureDebateResponse,
    ArchitectureExperimentResponse,
    BusinessGoalTranslatorRequest,
    BusinessGoalTranslatorResponse,
    CapabilityScorerResponse,
    CrossRepoLearningResponse,
    DecisionJournalResponse,
    EvolutionSimulatorResponse,
    FutureArchitectureResponse,
    GovernanceAdvisorResponse,
    InnovationAdvisorResponse,
    KnowledgeSynthesizerResponse,
    MarketTrendsResponse,
    MigrationScientistResponse,
    PlatformHealthOptimizerResponse,
    ProductivityAnalyzerResponse,
    ReliabilityForecastResponse,
    RiskPortfolioResponse,
    ScenarioEngineResponse,
    SoftwareLifecycleIntelResponse,
    TechDebtEconomistResponse,
)
from app.services.agi_simulation_insights_service import AGISimulationInsightsService

router = APIRouter(
    prefix="/agi-sim-insights",
    tags=["agi_simulation_insights"],
)

sim_service = AGISimulationInsightsService()


@router.post("/evolution-simulator", response_model=EvolutionSimulatorResponse)
def simulate_evolution(
    horizon_years: float = Query(2.0, description="Simulation horizon years"),
    db: Session = Depends(get_db),
) -> EvolutionSimulatorResponse:
    """Feature 21: Software Evolution Simulator"""
    return sim_service.simulate_evolution(horizon_years, db)


@router.get("/market-trends", response_model=MarketTrendsResponse)
def get_market_trends(
    db: Session = Depends(get_db),
) -> MarketTrendsResponse:
    """Feature 22: Engineering Market Trends"""
    return sim_service.get_market_trends(db)


@router.post("/translate-business-goal", response_model=BusinessGoalTranslatorResponse)
def translate_business_goal(
    payload: BusinessGoalTranslatorRequest,
    db: Session = Depends(get_db),
) -> BusinessGoalTranslatorResponse:
    """Feature 23: Business Goal Translator"""
    return sim_service.translate_business_goal(payload, db)


@router.post("/architecture-experiment", response_model=ArchitectureExperimentResponse)
def run_architecture_experiment(
    option_a: str = Query("REST JSON", description="First option name"),
    option_b: str = Query("gRPC Protobuf", description="Second option name"),
    db: Session = Depends(get_db),
) -> ArchitectureExperimentResponse:
    """Feature 24: Architecture Experiment Lab"""
    return sim_service.run_architecture_experiment(option_a, option_b, db)


@router.post("/scenario-engine", response_model=ScenarioEngineResponse)
def run_scenario_engine(
    scenario_query: str = Query(
        "What if database latency doubles?", description="Scenario query"
    ),
    db: Session = Depends(get_db),
) -> ScenarioEngineResponse:
    """Feature 25: Repository Scenario Engine"""
    return sim_service.run_scenario_engine(scenario_query, db)


@router.get("/decision-journal", response_model=DecisionJournalResponse)
def get_decision_journal(
    db: Session = Depends(get_db),
) -> DecisionJournalResponse:
    """Feature 26: Engineering Decision Journal"""
    return sim_service.get_decision_journal(db)


@router.get("/governance-advisor", response_model=GovernanceAdvisorResponse)
def get_governance_advisor(
    db: Session = Depends(get_db),
) -> GovernanceAdvisorResponse:
    """Feature 27: AI Governance Advisor"""
    return sim_service.get_governance_advisor(db)


@router.get("/risk-portfolio", response_model=RiskPortfolioResponse)
def get_risk_portfolio(
    db: Session = Depends(get_db),
) -> RiskPortfolioResponse:
    """Feature 28: Risk Portfolio Optimizer"""
    return sim_service.get_risk_portfolio(db)


@router.get("/knowledge-synthesizer", response_model=KnowledgeSynthesizerResponse)
def synthesize_knowledge(
    db: Session = Depends(get_db),
) -> KnowledgeSynthesizerResponse:
    """Feature 29: Engineering Knowledge Synthesizer"""
    return sim_service.synthesize_knowledge(db)


@router.get("/cross-repo-learning", response_model=CrossRepoLearningResponse)
def get_cross_repo_learning(
    db: Session = Depends(get_db),
) -> CrossRepoLearningResponse:
    """Feature 30: Cross-Repository Learning"""
    return sim_service.get_cross_repo_learning(db)


@router.get("/migration-scientist", response_model=MigrationScientistResponse)
def get_migration_scientist(
    db: Session = Depends(get_db),
) -> MigrationScientistResponse:
    """Feature 31: AI Migration Scientist"""
    return sim_service.get_migration_scientist(db)


@router.get("/health-optimizer", response_model=PlatformHealthOptimizerResponse)
def optimize_platform_health(
    db: Session = Depends(get_db),
) -> PlatformHealthOptimizerResponse:
    """Feature 32: Platform Health Optimizer"""
    return sim_service.optimize_platform_health(db)


@router.get("/architecture-debate", response_model=ArchitectureDebateResponse)
def get_architecture_debate(
    topic: str = Query("gRPC vs REST JSON for Auth Vault", description="Debate topic"),
    db: Session = Depends(get_db),
) -> ArchitectureDebateResponse:
    """Feature 33: AI Architecture Debate"""
    return sim_service.get_architecture_debate(topic, db)


@router.get("/future-explorer", response_model=FutureArchitectureResponse)
def explore_future_architecture(
    horizon_years: int = Query(5, description="Year horizon"),
    db: Session = Depends(get_db),
) -> FutureArchitectureResponse:
    """Feature 34: Future Architecture Explorer"""
    return sim_service.explore_future_architecture(horizon_years, db)


@router.get("/capability-scorer", response_model=CapabilityScorerResponse)
def score_engineering_capability(
    db: Session = Depends(get_db),
) -> CapabilityScorerResponse:
    """Feature 35: Engineering Capability Scorer"""
    return sim_service.score_engineering_capability(db)


@router.get("/tech-debt-economist", response_model=TechDebtEconomistResponse)
def analyze_tech_debt_economics(
    db: Session = Depends(get_db),
) -> TechDebtEconomistResponse:
    """Feature 36: Technical Debt Economist"""
    return sim_service.analyze_tech_debt_economics(db)


@router.get("/productivity-analyzer", response_model=ProductivityAnalyzerResponse)
def analyze_developer_productivity(
    db: Session = Depends(get_db),
) -> ProductivityAnalyzerResponse:
    """Feature 37: Developer Productivity Analyzer"""
    return sim_service.analyze_developer_productivity(db)


@router.get("/reliability-forecast", response_model=ReliabilityForecastResponse)
def forecast_reliability(
    db: Session = Depends(get_db),
) -> ReliabilityForecastResponse:
    """Feature 38: Reliability Forecast Lab"""
    return sim_service.forecast_reliability(db)


@router.get("/software-lifecycle", response_model=SoftwareLifecycleIntelResponse)
def get_software_lifecycle_intel(
    db: Session = Depends(get_db),
) -> SoftwareLifecycleIntelResponse:
    """Feature 39: Software Lifecycle Intelligence"""
    return sim_service.get_software_lifecycle_intel(db)


@router.get("/innovation-advisor", response_model=InnovationAdvisorResponse)
def get_innovation_advisor(
    db: Session = Depends(get_db),
) -> InnovationAdvisorResponse:
    """Feature 40: AI Innovation Advisor"""
    return sim_service.get_innovation_advisor(db)
