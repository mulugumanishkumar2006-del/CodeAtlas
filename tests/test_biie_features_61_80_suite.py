import os

import pytest

os.environ["DATABASE_URL"] = "sqlite:///./test_biie_f61_80_temp.db"

import app.models  # noqa: F401
from app.core.database import Base, get_db
from app.main import app
from app.services.biie_ai_advisor_service import BIIEAIAdvisorService
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_biie_f61_80_temp.db"
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


def test_features_61_to_80_master_suite(db_session):
    res = BIIEAIAdvisorService.get_ai_advisor_suite(db_session, "repo-ai-master")
    # Feature 61
    assert (
        res["ai_cto_advisor_summary"]["strategic_verdict"]
        == "PRIORITIZE_DECOUPLING_AND_SSO_GATEWAY"
    )
    # Feature 62
    assert res["ai_product_strategy"]["strategy_score_0_100"] == 94.5
    # Feature 63
    assert len(res["ai_portfolio_optimizer"]) == 3
    # Feature 64
    assert res["ai_investment_planner"]["recommended_sprint_budget_usd"] == 15000.0
    # Feature 65
    assert (
        res["ai_revenue_predictor"]["predicted_arr_gain_from_refactoring_usd"]
        == 145000.0
    )
    # Feature 66
    assert res["ai_customer_impact_forecast"]["projected_nrr_improvement_pct"] == +4.5
    # Feature 67
    assert (
        res["ai_business_case"]["approval_status"]
        == "RECOMMENDED_FOR_IMMEDIATE_APPROVAL"
    )
    # Feature 68
    assert "cto_brief" in res["ai_executive_briefings"]
    # Feature 69
    assert len(res["ai_product_roadmaps"]) == 4
    # Feature 70
    assert res["ai_architecture_roi"]["net_present_value_npv_usd"] == 285000.0
    # Feature 71
    assert (
        res["ai_cost_reduction_planner"]["target_monthly_cloud_savings_usd"] == 3850.0
    )
    # Feature 72
    assert len(res["ai_modernization_prioritizer"]) == 3
    # Feature 73
    assert len(res["ai_risk_mitigation_planner"]) == 2
    # Feature 74
    assert len(res["ai_strategic_recommendations"]) == 3
    # Feature 75
    assert len(res["ai_kpi_forecasting"]) == 3
    # Feature 76
    assert "recommended_headcount_allocation" in res["ai_org_planning"]

    # Feature 77
    assert res["ai_market_readiness"]["market_readiness_score_0_100"] == 95.0
    # Feature 78
    assert res["ai_product_health"]["product_health_score_0_100"] == 94.2
    # Feature 79
    assert len(res["ai_opportunity_detection"]) == 1
    # Feature 80
    assert len(res["ai_strategic_simulation"]["simulated_scenarios"]) == 2


def test_generate_ai_business_case(db_session):
    res = BIIEAIAdvisorService.generate_ai_business_case(
        db_session, "repo-case-test", "auth_service"
    )
    assert res["target_module"] == "auth_service"
    assert res["financial_justification"]["upfront_cost_usd"] == 15000.0
    assert res["financial_justification"]["net_roi_pct"] == 1133.3


def test_run_strategic_simulation(db_session):
    res = BIIEAIAdvisorService.run_strategic_simulation(
        db_session, "repo-sim-test", 15000.0
    )
    assert len(res["simulation_scenarios"]) == 2
    assert res["simulation_scenarios"][0]["verdict"] == "RECOMMENDED"


# --- FastAPI Endpoint Integration Tests ---


def test_api_ai_advisor_suite(db_session):
    response = client.get(
        "/api/v1/biie/ai-advisor/advisor-suite?repository_id=api-ai-1"
    )
    assert response.status_code == 200
    data = response.json()
    assert "ai_cto_advisor_summary" in data
    assert "ai_strategic_simulation" in data


def test_api_business_case_generator(db_session):
    response = client.post(
        "/api/v1/biie/ai-advisor/business-case-generator",
        json={"repository_id": "api-ai-2", "target_module": "payment_service"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["target_module"] == "payment_service"
    assert data["financial_justification"]["net_savings_usd"] == 170000.0


def test_api_product_roadmap(db_session):
    response = client.get(
        "/api/v1/biie/ai-advisor/product-roadmap?repository_id=api-ai-3"
    )
    assert response.status_code == 200
    data = response.json()
    assert "ai_product_roadmaps" in data
    assert len(data["ai_product_roadmaps"]) == 4


def test_api_strategic_simulation(db_session):
    response = client.post(
        "/api/v1/biie/ai-advisor/strategic-simulation",
        json={"repository_id": "api-ai-4", "investment_amount_usd": 15000.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["simulation_scenarios"]) == 2


def test_api_cto_recommendations(db_session):
    response = client.get(
        "/api/v1/biie/ai-advisor/cto-recommendations?repository_id=api-ai-5"
    )
    assert response.status_code == 200
    data = response.json()
    assert "ai_strategic_recommendations" in data
    assert len(data["ai_strategic_recommendations"]) == 3
