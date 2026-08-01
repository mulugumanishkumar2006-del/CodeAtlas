import os

import pytest

os.environ["DATABASE_URL"] = "sqlite:///./test_biie_temp.db"

import uuid

import app.models  # noqa: F401
from app.core.database import Base, get_db
from app.main import app
from app.services.biie_service import BIIEService
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_biie_temp.db"
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


def test_seed_default_capabilities(db_session):
    repo_id = str(uuid.uuid4())
    caps = BIIEService.seed_default_capabilities_if_empty(db_session, repo_id)
    assert len(caps) >= 5
    assert caps[0].capability_name == "Checkout & Payment Gateway Processing"
    assert caps[0].hourly_revenue_usd == 48500.0
    assert caps[0].total_arr_usd == 8500000.0


def test_sync_business_systems(db_session):
    res = BIIEService.sync_business_systems(db_session)
    assert res["status"] == "success"
    assert res["synced_connectors_count"] == 6


def test_register_business_capability(db_session):
    repo_id = str(uuid.uuid4())
    cap = BIIEService.register_business_capability(
        db=db_session,
        repository_id=repo_id,
        capability_name="Real-Time Fraud & Anti-Money Laundering Detection",
        description="Scans transactions for fraudulent velocity and anomalous behavior.",
        owner_team="Security Compliance",
        tier="Tier 1 - Mission Critical",
        hourly_revenue_usd=55000.0,
        total_arr_usd=9200000.0,
        mapped_services=["fraud_service", "payment_service"],
        mapped_code_nodes=["app.services.fraud.evaluate"],
        target_sla_up_pct=99.99,
    )
    assert cap.id is not None
    assert cap.capability_name == "Real-Time Fraud & Anti-Money Laundering Detection"
    assert cap.hourly_revenue_usd == 55000.0


def test_calculate_impact_analysis(db_session):
    repo_id = str(uuid.uuid4())
    record = BIIEService.calculate_impact_analysis(
        db=db_session,
        repository_id=repo_id,
        target_service="payment_service",
        target_commit_or_pr="PR #205 — Major Payment Gateway Refactor",
    )
    assert record.id is not None
    assert record.target_service == "payment_service"
    assert record.customer_blast_radius_total > 1000
    assert record.revenue_at_risk_hourly_usd >= 48500.0
    assert record.arr_threatened_usd >= 8500000.0
    assert record.risk_level in ["CRITICAL", "HIGH"]
    assert len(record.impacted_capabilities) >= 1


def test_calculate_cost_of_inaction(db_session):
    repo_id = str(uuid.uuid4())
    forecast_30 = BIIEService.calculate_cost_of_inaction(
        db=db_session,
        repository_id=repo_id,
        target_service_or_module="payment_service",
        horizon_days=30,
    )
    forecast_90 = BIIEService.calculate_cost_of_inaction(
        db=db_session,
        repository_id=repo_id,
        target_service_or_module="payment_service",
        horizon_days=90,
    )
    assert forecast_30.horizon_days == 30
    assert forecast_90.horizon_days == 90
    assert (
        forecast_90.total_cost_of_inaction_usd > forecast_30.total_cost_of_inaction_usd
    )
    assert forecast_90.net_roi_pct > 100.0


def test_generate_executive_intelligence_brief(db_session):
    repo_id = str(uuid.uuid4())
    brief_cto = BIIEService.generate_executive_intelligence_brief(
        db=db_session, repository_id=repo_id, target_audience="CTO"
    )
    brief_ceo = BIIEService.generate_executive_intelligence_brief(
        db=db_session, repository_id=repo_id, target_audience="CEO"
    )
    assert brief_cto.target_audience == "CTO"
    assert brief_ceo.target_audience == "CEO"
    assert len(brief_cto.strategic_action_recommendations) >= 3


def test_get_biie_dashboard_summary(db_session):
    repo_id = str(uuid.uuid4())
    summary = BIIEService.get_biie_dashboard_summary(db_session, repo_id)
    assert "summary_metrics" in summary
    assert summary["summary_metrics"]["total_arr_connected_usd"] > 10000000.0
    assert len(summary["business_capabilities"]) >= 5
    assert "nodes" in summary["capability_graph"]


# --- FastAPI Endpoint Integration Tests ---


def test_api_biie_connectors_sync(db_session):
    response = client.post("/api/v1/biie/connectors/sync")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["synced_connectors_count"] == 6


def test_api_biie_capabilities_list_and_create(db_session):
    repo_id = "test-repo-api"
    # List capabilities
    get_res = client.get(f"/api/v1/biie/capabilities?repository_id={repo_id}")
    assert get_res.status_code == 200
    get_data = get_res.json()
    assert get_data["capabilities_count"] >= 5

    # Register new capability
    post_res = client.post(
        "/api/v1/biie/capabilities",
        json={
            "repository_id": repo_id,
            "capability_name": "API Gateway & Rate Limiting",
            "description": "Throttles API requests and manages enterprise client rate limits.",
            "owner_team": "Edge Infrastructure",
            "tier": "Tier 1 - Mission Critical",
            "hourly_revenue_usd": 20000.0,
            "total_arr_usd": 3000000.0,
            "mapped_services": ["api_gateway"],
            "mapped_code_nodes": ["app.core.middleware"],
        },
    )
    assert post_res.status_code == 200
    assert post_res.json()["status"] == "success"


def test_api_biie_impact_analysis(db_session):
    repo_id = "test-repo-api"
    response = client.post(
        "/api/v1/biie/impact-analysis",
        json={
            "repository_id": repo_id,
            "target_service": "payment_service",
            "target_commit_or_pr": "PR #301 — Refactor Payment DB Connection Pool",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["target_service"] == "payment_service"
    assert data["customer_blast_radius_total"] > 1000
    assert data["revenue_at_risk_hourly_usd"] > 10000.0


def test_api_biie_cost_of_inaction(db_session):
    repo_id = "test-repo-api"
    response = client.post(
        "/api/v1/biie/cost-of-inaction",
        json={
            "repository_id": repo_id,
            "target_service_or_module": "payment_service",
            "horizon_days": 90,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["horizon_days"] == 90
    assert data["total_cost_of_inaction_usd"] > 100000.0
    assert data["net_roi_pct"] > 100.0


def test_api_biie_executive_brief(db_session):
    repo_id = "test-repo-api"
    response = client.post(
        "/api/v1/biie/executive-brief",
        json={
            "repository_id": repo_id,
            "target_audience": "CFO",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["target_audience"] == "CFO"
    assert "Briefing" in data["brief_title"] or "Brief" in data["brief_title"]


def test_api_biie_dashboard_summary(db_session):
    repo_id = "test-repo-api"
    response = client.get(f"/api/v1/biie/dashboard-summary?repository_id={repo_id}")
    assert response.status_code == 200
    data = response.json()
    assert "summary_metrics" in data
    assert "business_capabilities" in data
