# tests/test_prediction_engine.py


import pytest
from app.core.database import Base, get_db
from app.main import app
from app.prediction_engine import (
    AIArchitectureEvolutionAdvisor,
    AIExperimentSimulator,
    AIStrategicPlannerEngine,
    ArchitectureEvolutionPredictor,
    ArchitectureForecastAI,
    CloudCostForecastEngine,
    DependencyFutureRiskPredictor,
    EngineeringCalendarPredictor,
    EngineeringTimeMachineEngine,
    ExplainablePredictionsEngine,
    FailureChainSimulator,
    FutureDependencyGraphEngine,
    FutureDigitalTwinEngine,
    FutureEngineeringTimeline,
    GrowthAI,
    IncidentAI,
    IncidentPredictionAI,
    KnowledgeDecayPredictor,
    MaintainabilityForecastEngine,
    MonolithRiskPredictor,
    PerformancePredictionEngine,
    RefactoringDeadlinePredictor,
    RepoFutureForecastEngine,
    ScalingTimelineEngine,
    TeamGrowthPlanner,
    TechDebtGrowthSimulator,
    TechnicalDebtAI,
    TechObsolescenceDetector,
)
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = "sqlite:///./test_pred_temp.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_prediction_engines():
    db = TestingSessionLocal()
    try:
        arch = ArchitectureForecastAI().forecast_architecture(db)
        assert arch["forecast_horizon"] == "2_YEAR_ARCHITECTURE_VIABILITY"
        assert len(arch["bottlenecks_predicted"]) == 3

        debt = TechnicalDebtAI().forecast_tech_debt(db)
        assert len(debt["unmaintainable_repositories"]) >= 1

        inc = IncidentAI().forecast_incidents(db)
        assert len(inc["failure_order_prediction"]) >= 1

        growth = GrowthAI().forecast_growth(db)
        assert len(growth["team_bottlenecks"]) >= 1

        timeline = FutureEngineeringTimeline().generate_future_timeline(db)
        assert len(timeline["milestones"]) == 4

        repo_fc = RepoFutureForecastEngine().forecast_repo_future(db)
        assert "6_months" in repo_fc["forecast_horizons"]
        assert "5_years" in repo_fc["forecast_horizons"]

        arch_ev = ArchitectureEvolutionPredictor().forecast_architecture_evolution(db)
        assert arch_ev["evolution_metrics"]["new_dependencies_projected_12m"] == 8

        debt_sim = TechDebtGrowthSimulator().simulate_tech_debt_growth(db)
        assert debt_sim["tech_debt_simulation"]["projected_1_year_pct"] == 52.0

        inc_pred = IncidentPredictionAI().predict_incidents(db)
        assert len(inc_pred["incident_predictions"]["predicted_outages"]) >= 3

        team_plan = TeamGrowthPlanner().plan_team_growth(db)
        assert (
            team_plan["team_growth_plan"]["role_breakdown"]["software_engineers_needed"]
            == 8
        )

        perf = PerformancePredictionEngine().predict_performance(db)
        assert perf["prediction_status"] == "REALTIME_PERFORMANCE_FORECAST_READY"

        cost_fc = CloudCostForecastEngine().forecast_cloud_costs(db)
        assert len(cost_fc["horizons"]) == 3

        arch_adv = AIArchitectureEvolutionAdvisor().suggest_architecture_evolution(db)
        assert len(arch_adv["proactive_suggestions"]) >= 2

        obs = TechObsolescenceDetector().detect_obsolescence(db)
        assert len(obs["detected_obsolescence_risks"]) >= 2

        dep_risk = DependencyFutureRiskPredictor().predict_dependency_risks(db)
        assert len(dep_risk["dependencies_at_risk"]) >= 2

        fail_chain = FailureChainSimulator().simulate_failure_chain(db)
        assert len(fail_chain["cascading_trajectory"]) == 4

        know = KnowledgeDecayPredictor().predict_knowledge_decay(db)
        assert len(know["key_contributor_risk"]) >= 1

        ref_dl = RefactoringDeadlinePredictor().predict_refactoring_deadlines(db)
        assert len(ref_dl["optimal_refactoring_windows"]) >= 2

        scale_tl = ScalingTimelineEngine().forecast_scaling_timeline(db)
        assert len(scale_tl["scale_tiers"]) == 5

        strat_plan = AIStrategicPlannerEngine().generate_roadmaps(db)
        assert "one_year_roadmap" in strat_plan

        maint_fc = MaintainabilityForecastEngine().forecast_maintainability(db)
        assert len(maint_fc["overall_maintainability_trend"]) == 4

        mono_risk = MonolithRiskPredictor().predict_monolith_risk(db)
        assert mono_risk["monolith_saturation_score"] == 82.4

        exp_sim = AIExperimentSimulator().simulate_experiment(db)
        assert "option_a" in exp_sim["comparison"]

        fut_dep = FutureDependencyGraphEngine().forecast_future_dependency_graph(db)
        assert fut_dep["nodes_count_projected_12m"] == 42

        eng_cal = EngineeringCalendarPredictor().predict_engineering_calendar(db)
        assert len(eng_cal["milestones_and_windows"]) == 4

        fut_twin = FutureDigitalTwinEngine().generate_future_digital_twin(db)
        assert fut_twin["future_twin_version"] == "3.0-PREDICTIVE-TWIN"

        expl = ExplainablePredictionsEngine().generate_explainable_predictions(db)
        assert expl["prediction_confidence_score"] == 96.4

        time_mach = EngineeringTimeMachineEngine().travel_to_future(db, "1_year")
        assert len(time_mach["snapshot"]["software_city_buildings"]) >= 3
    finally:
        db.close()


def test_prediction_api_endpoints():
    assert client.get("/api/v1/prediction/architecture-forecast").status_code == 200
    assert client.get("/api/v1/prediction/tech-debt-forecast").status_code == 200
    assert client.get("/api/v1/prediction/incident-risk-forecast").status_code == 200
    assert client.get("/api/v1/prediction/growth-forecast").status_code == 200
    assert client.get("/api/v1/prediction/future-timeline").status_code == 200
    assert client.get("/api/v1/prediction/rewrite-recommendations").status_code == 200
    assert client.get("/api/v1/prediction/repo-future-forecast").status_code == 200
    assert client.get("/api/v1/prediction/architecture-evolution").status_code == 200
    assert client.get("/api/v1/prediction/tech-debt-growth").status_code == 200
    assert client.get("/api/v1/prediction/incident-predictions").status_code == 200
    assert client.get("/api/v1/prediction/team-growth-planner").status_code == 200
    assert client.get("/api/v1/prediction/performance-prediction").status_code == 200
    assert client.get("/api/v1/prediction/cloud-cost-forecast").status_code == 200
    assert client.get("/api/v1/prediction/ai-architecture-evolution").status_code == 200
    assert client.get("/api/v1/prediction/tech-obsolescence").status_code == 200
    assert client.get("/api/v1/prediction/dependency-future-risk").status_code == 200
    assert client.get("/api/v1/prediction/simulate-failure-chain").status_code == 200
    assert client.get("/api/v1/prediction/knowledge-decay").status_code == 200
    assert client.get("/api/v1/prediction/refactoring-deadlines").status_code == 200
    assert client.get("/api/v1/prediction/scaling-timeline").status_code == 200
    assert client.get("/api/v1/prediction/ai-strategic-roadmap").status_code == 200
    assert client.get("/api/v1/prediction/maintainability-forecast").status_code == 200
    assert client.get("/api/v1/prediction/monolith-risk").status_code == 200
    assert client.get("/api/v1/prediction/experiment-simulator").status_code == 200
    assert client.get("/api/v1/prediction/future-dependency-graph").status_code == 200
    assert client.get("/api/v1/prediction/engineering-calendar").status_code == 200
    assert client.get("/api/v1/prediction/future-digital-twin").status_code == 200
    assert client.get("/api/v1/prediction/explainable-predictions").status_code == 200
    assert (
        client.get(
            "/api/v1/prediction/time-machine-state?target_horizon=1_year"
        ).status_code
        == 200
    )
