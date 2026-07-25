# tests/test_prediction_engine.py

import os

import pytest
from app.core.database import Base, get_db
from app.main import app
from app.prediction_engine import (
    ArchitectureEvolutionPredictor,
    ArchitectureForecastAI,
    FutureEngineeringTimeline,
    GrowthAI,
    IncidentAI,
    IncidentPredictionAI,
    RepoFutureForecastEngine,
    TeamGrowthPlanner,
    TechDebtGrowthSimulator,
    TechnicalDebtAI,
)
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test_pred_temp.db")
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
