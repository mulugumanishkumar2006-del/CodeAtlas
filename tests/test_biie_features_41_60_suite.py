import os

import pytest

os.environ["DATABASE_URL"] = "sqlite:///./test_biie_f41_60_temp.db"

import app.models  # noqa: F401
from app.core.database import Base, get_db
from app.main import app
from app.services.biie_risk_service import BIIERiskService
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_biie_f41_60_temp.db"
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


def test_features_41_to_60_master_suite(db_session):
    res = BIIERiskService.get_risk_intelligence_suite(db_session, "repo-risk-master")
    # Feature 41
    assert (
        res["revenue_loss_prediction"]["predicted_loss_per_outage_hour_usd"] == 48500.0
    )
    # Feature 42
    assert res["sla_breach_forecasting"]["target_sla_pct"] == 99.99
    # Feature 43
    assert len(res["customer_churn_risk"]["high_risk_enterprise_accounts"]) >= 2
    # Feature 44
    assert res["compliance_impact"]["soc2_compliance_status"] == "COMPLIANT"
    # Feature 45
    assert res["regulatory_readiness"]["gdpr_readiness_pct"] == 98.0
    # Feature 46
    assert res["data_privacy_assessment"]["pii_data_nodes_count"] == 24
    # Feature 47
    assert res["operational_resilience"]["resilience_score_0_100"] == 89.5
    # Feature 48
    assert len(res["vendor_dependency_analysis"]) == 4
    # Feature 49
    assert res["supply_chain_risk"]["license_compliance_status"] == "CLEAN_MIT_APACHE"
    # Feature 50
    assert len(res["third_party_api_risk"]) == 2
    # Feature 51
    assert res["business_continuity_plan"]["recovery_time_objective_rto_mins"] == 15
    # Feature 52
    assert res["disaster_recovery_readiness"]["failover_readiness_score_0_100"] == 94.0
    # Feature 53
    assert res["outage_simulation_results"]["simulated_outage_duration_hours"] == 2.0
    # Feature 54
    assert res["market_readiness"]["market_readiness_score_0_100"] == 95.0
    # Feature 55
    assert res["innovation_risk_score"]["innovation_risk_score_0_100"] == 32.5
    # Feature 56
    assert res["customer_trust_indicators"]["security_confidence_index"] == 96.5
    # Feature 57
    assert len(res["service_availability_forecasting"]) == 3
    # Feature 58
    assert len(res["executive_risk_matrix"]) == 3
    # Feature 59
    assert len(res["portfolio_risk_heatmap"]) == 3
    # Feature 60
    assert res["business_resilience_index"]["resilience_index_0_100"] == 92.4


def test_simulate_business_outage(db_session):
    res = BIIERiskService.simulate_business_outage(db_session, "repo-outage-test", 4.0)
    assert res["duration_hours"] == 4.0
    assert res["total_financial_loss_usd"] == 194000.0
    assert res["projected_sla_refund_credits_usd"] == 48500.0


# --- FastAPI Endpoint Integration Tests ---


def test_api_risk_intelligence_suite(db_session):
    response = client.get(
        "/api/v1/biie/risk/risk-intelligence-suite?repository_id=api-risk-1"
    )
    assert response.status_code == 200
    data = response.json()
    assert "revenue_loss_prediction" in data
    assert "business_resilience_index" in data


def test_api_outage_simulation(db_session):
    response = client.post(
        "/api/v1/biie/risk/outage-simulation",
        json={"repository_id": "api-risk-2", "duration_hours": 3.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["duration_hours"] == 3.0
    assert data["total_financial_loss_usd"] == 145500.0


def test_api_compliance_privacy(db_session):
    response = client.get(
        "/api/v1/biie/risk/compliance-privacy?repository_id=api-risk-3"
    )
    assert response.status_code == 200
    data = response.json()
    assert "compliance_impact" in data
    assert data["regulatory_readiness"]["gdpr_readiness_pct"] == 98.0


def test_api_vendor_supply_chain(db_session):
    response = client.get(
        "/api/v1/biie/risk/vendor-supply-chain?repository_id=api-risk-4"
    )
    assert response.status_code == 200
    data = response.json()
    assert "vendor_dependency_analysis" in data
    assert len(data["vendor_dependency_analysis"]) == 4


def test_api_executive_matrix_heatmap(db_session):
    response = client.get(
        "/api/v1/biie/risk/executive-matrix-heatmap?repository_id=api-risk-5"
    )
    assert response.status_code == 200
    data = response.json()
    assert "executive_risk_matrix" in data
    assert data["business_resilience_index"]["resilience_index_0_100"] == 92.4
