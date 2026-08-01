import os

import pytest

os.environ["DATABASE_URL"] = "sqlite:///./test_biie_f21_40_temp.db"

import app.models  # noqa: F401
from app.core.database import Base, get_db
from app.main import app
from app.services.biie_economics_service import BIIEEconomicsService
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_biie_f21_40_temp.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_features_21_to_40_master_suite(db_session):
    res = BIIEEconomicsService.get_engineering_economics_suite(
        db_session, "repo-econ-master"
    )
    # Feature 21
    assert res["tech_debt_cost_estimation"]["principal_debt_cost_usd"] == 68000.0
    # Feature 22
    assert res["modernization_roi"]["three_year_npv_usd"] == 285000.0
    # Feature 23
    assert res["engineering_investment"]["capex_new_feature_development_pct"] == 65.0
    # Feature 24
    assert res["cloud_cost_optimization"]["potential_monthly_savings_usd"] == 3850.0
    # Feature 25
    assert res["team_productivity_cost"]["total_monthly_friction_cost_usd"] == 18500.0
    # Feature 26
    assert res["build_failure_cost"]["total_monthly_build_failure_cost_usd"] == 4189.0
    # Feature 27
    assert (
        res["deployment_failure_cost"]["total_monthly_deployment_failure_cost_usd"]
        == 12500.0
    )
    # Feature 28
    assert res["incident_cost_estimation"]["monthly_incidents_cost_usd"] == 38500.0
    # Feature 29
    assert res["opportunity_cost_analysis"]["lost_arr_opportunity_usd"] == 145000.0
    # Feature 30
    assert res["refactoring_roi"]["net_roi_pct"] == 1133.3
    # Feature 31
    assert len(res["infrastructure_spending"]) == 3
    # Feature 32
    assert len(res["budget_forecasting"]) == 4
    # Feature 33
    assert len(res["ai_cost_recommendations"]) >= 2
    # Feature 34
    assert (
        res["maintenance_cost_forecasting"]["current_annual_maintenance_cost_usd"]
        == 118000.0
    )
    # Feature 35
    assert res["operational_efficiency"]["efficiency_score_0_100"] == 91.5
    # Feature 36
    assert res["cost_to_value_ratio"]["engineering_cost_per_1k_arr_usd"] == 4.20
    # Feature 37
    assert res["resource_allocation"]["feature_work_allocated_pct"] == 60.0
    # Feature 38
    assert len(res["portfolio_investment"]) == 3
    # Feature 39
    assert len(res["cost_anomaly_detection"]) == 1
    # Feature 40
    assert res["executive_financial_dashboard"]["cloud_cost_pct_of_arr"] == 0.83


# --- FastAPI Endpoint Integration Tests ---


def test_api_engineering_economics_suite(db_session):
    response = client.get(
        "/api/v1/biie/economics/engineering-economics-suite?repository_id=api-econ-1"
    )
    assert response.status_code == 200
    data = response.json()
    assert "tech_debt_cost_estimation" in data
    assert "executive_financial_dashboard" in data


def test_api_cloud_optimization(db_session):
    response = client.get(
        "/api/v1/biie/economics/cloud-optimization?repository_id=api-econ-2"
    )
    assert response.status_code == 200
    data = response.json()
    assert "cloud_cost_optimization" in data
    assert data["cloud_cost_optimization"]["potential_monthly_savings_usd"] == 3850.0


def test_api_incident_build_costs(db_session):
    response = client.get(
        "/api/v1/biie/economics/incident-build-costs?repository_id=api-econ-3"
    )
    assert response.status_code == 200
    data = response.json()
    assert "build_failure_cost" in data
    assert "incident_cost_estimation" in data


def test_api_modernization_roi(db_session):
    response = client.get(
        "/api/v1/biie/economics/modernization-roi?repository_id=api-econ-4"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["modernization_roi"]["three_year_npv_usd"] == 285000.0


def test_api_executive_financial_dashboard(db_session):
    response = client.get(
        "/api/v1/biie/economics/executive-financial-dashboard?repository_id=api-econ-5"
    )
    assert response.status_code == 200
    data = response.json()
    assert "executive_financial_dashboard" in data
    assert data["cost_to_value_ratio"]["engineering_cost_per_1k_arr_usd"] == 4.20
