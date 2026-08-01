import os

import pytest

os.environ["DATABASE_URL"] = "sqlite:///./test_biie_f81_100_temp.db"

import app.models  # noqa: F401
from app.core.database import Base, get_db
from app.main import app
from app.services.biie_executive_command_service import BIIEExecutiveCommandService
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_biie_f81_100_temp.db"
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


def test_engineering_to_business_digital_twin(db_session):
    twin = BIIEExecutiveCommandService.get_engineering_to_business_digital_twin(
        db_session, "Payments Service"
    )
    assert twin["service_name"] == "Payments Service"
    assert twin["revenue_generated_annual_usd"] == 850000000.0
    assert twin["revenue_generated_display"] == "$850M/year"
    assert twin["customers_count"] == 18400000
    assert twin["regions_count"] == 42
    assert twin["dependent_services_count"] == 31
    assert twin["critical_apis_count"] == 214
    assert twin["downtime_cost_per_hour_usd"] == 1800000.0
    assert twin["business_criticality_score_0_100"] == 98.0
    assert twin["recommendation"] == "Upgrade infrastructure before Black Friday."
    assert len(twin["digital_twin_vector"]) == 9


def test_features_81_to_100_master_suite(db_session):
    res = BIIEExecutiveCommandService.get_global_command_center(
        db_session, "repo-cmd-master"
    )
    # Features 81-85 Role Dashboards
    assert res["ceo_dashboard"]["role"] == "CEO"
    assert res["cto_dashboard"]["role"] == "CTO"
    assert res["cio_dashboard"]["role"] == "CIO"
    assert res["cfo_dashboard"]["role"] == "CFO"
    assert res["product_dashboard"]["role"] == "PRODUCT"
    # Feature 86
    assert len(res["capability_explorer"]) == 3
    # Feature 87
    assert len(res["strategic_roadmap"]) == 4
    # Feature 88
    assert len(res["portfolio_scorecards"]) == 3
    # Feature 89
    assert res["revenue_impact_reports"]["total_arr_protected_usd"] == 20500000.0
    # Feature 90
    assert len(res["executive_kpi_center"]) == 4
    # Feature 91
    assert res["live_business_health"]["overall_health_score_0_100"] == 94.2
    # Feature 92
    assert res["quarterly_engineering_reports"]["current_quarter"] == "Q1 2026"
    # Feature 93
    assert res["investment_tracking"]["capex_new_features_pct"] == 65.0
    # Feature 94
    assert res["customer_experience"]["nps_score"] == 74
    # Feature 95
    assert len(res["business_heatmaps"]) == 3
    # Feature 96
    assert res["interactive_executive_reports"]["export_ready"] is True
    # Feature 97
    assert res["ai_executive_chat"]["status"] == "ONLINE"
    # Feature 98
    assert "planning_cycle" in res["enterprise_planning_center"]
    # Feature 99
    assert res["board_meeting_reports"]["slides_count"] == 12
    # Feature 100
    assert res["command_center_meta"]["status"] == "ALL_100_ENTERPRISE_FEATURES_ACTIVE"


def test_query_ai_executive_chat(db_session):
    res = BIIEExecutiveCommandService.query_ai_executive_chat(
        db_session, "repo-chat", "What is our peak outage exposure?"
    )
    assert "1.8M" in res["answer"] or "48.5k" in res["answer"]
    assert res["confidence_pct"] == 98.5


# --- FastAPI Endpoint Integration Tests ---


def test_api_executive_cockpit(db_session):
    response = client.get(
        "/api/v1/biie/command-center/executive-cockpit?repository_id=api-cmd-1"
    )
    assert response.status_code == 200
    data = response.json()
    assert "ceo_dashboard" in data
    assert "digital_twin" in data


def test_api_role_dashboard(db_session):
    response = client.get("/api/v1/biie/command-center/role-dashboard/CTO")
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "CTO"
    assert data["principal_tech_debt_usd"] == 68000.0


def test_api_engineering_to_business_twin(db_session):
    response = client.get(
        "/api/v1/biie/command-center/engineering-to-business-twin?service_name=Payments+Service"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["revenue_generated_display"] == "$850M/year"
    assert data["customers_display"] == "18.4 Million"
    assert data["downtime_cost_display"] == "$1.8M/hour"


def test_api_ai_executive_chat(db_session):
    response = client.post(
        "/api/v1/biie/command-center/ai-executive-chat",
        json={"repository_id": "api-cmd-2", "query": "What is our connected ARR?"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "20,500,000" in data["answer"]


def test_api_board_report(db_session):
    response = client.get(
        "/api/v1/biie/command-center/board-report?repository_id=api-cmd-3"
    )
    assert response.status_code == 200
    data = response.json()
    assert "board_meeting_reports" in data
    assert data["board_meeting_reports"]["slides_count"] == 12
