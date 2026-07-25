# tests/test_prediction_engine.py

import os

import pytest
from app.core.database import Base, get_db
from app.main import app
from app.prediction_engine.architecture_forecast import ArchitectureForecastAI
from app.prediction_engine.growth_ai import GrowthAI
from app.prediction_engine.incident_ai import IncidentAI
from app.prediction_engine.tech_debt_ai import TechnicalDebtAI
from app.prediction_engine.timeline import FutureEngineeringTimeline
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
    finally:
        db.close()


def test_prediction_api_endpoints():
    assert client.get("/api/v1/prediction/architecture-forecast").status_code == 200
    assert client.get("/api/v1/prediction/tech-debt-forecast").status_code == 200
    assert client.get("/api/v1/prediction/incident-risk-forecast").status_code == 200
    assert client.get("/api/v1/prediction/growth-forecast").status_code == 200
    assert client.get("/api/v1/prediction/future-timeline").status_code == 200
    assert client.get("/api/v1/prediction/rewrite-recommendations").status_code == 200
