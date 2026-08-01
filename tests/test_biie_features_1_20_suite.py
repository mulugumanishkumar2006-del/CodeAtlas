import os

import pytest

os.environ["DATABASE_URL"] = "sqlite:///./test_biie_f1_20_temp.db"

import app.models  # noqa: F401
from app.core.database import Base, get_db
from app.main import app
from app.services.biie_primary_service import BIIEPrimaryService
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_biie_f1_20_temp.db"
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


def test_feature1_business_capability_graph(db_session):
    res = BIIEPrimaryService.build_business_capability_graph(db_session, "repo-f1")
    assert res["total_domains"] >= 3
    assert "graph_topology" in res
    assert res["domains"][0]["domain"] == "Financial & Payment Operations"


def test_feature2_revenue_dependency_graph(db_session):
    res = BIIEPrimaryService.build_revenue_dependency_graph(db_session, "repo-f2")
    assert res["total_revenue_generating_services"] >= 4
    payment_svc = next(
        s for s in res["services_revenue_map"] if s["service"] == "payment_service"
    )
    assert payment_svc["hourly_revenue_usd"] == 48500.0
    assert payment_svc["business_criticality"] == "CRITICAL"


def test_feature3_customer_impact_engine(db_session):
    res = BIIEPrimaryService.evaluate_customer_impact_engine(
        db_session, "repo-f3", "payment_service"
    )
    assert res["total_blast_radius_customers"] >= 14000
    assert len(res["regions_breakdown"]) == 3
    assert len(res["customer_tiers_breakdown"]) == 3
    assert res["internal_users_affected"]["engineering_team_members"] == 42


def test_feature4_business_criticality_score(db_session):
    res = BIIEPrimaryService.calculate_business_criticality_score(
        db_session, "repo-f4", "payment_service"
    )
    assert res["criticality_score_0_100"] >= 90.0
    assert res["tier_level"] == "Tier 1 - Mission Critical"
    assert "revenue_impact_weight_30pct" in res["score_factors"]


def test_feature5_product_dependency_graph(db_session):
    res = BIIEPrimaryService.build_product_dependency_graph(db_session, "repo-f5")
    assert len(res["product_tree"]) >= 1
    features = res["product_tree"][0]["features"]
    assert len(features) >= 3
    assert features[0]["microservice"] == "payment_service"


def test_features_6_to_20_business_analytics_suite(db_session):
    res = BIIEPrimaryService.get_business_analytics_suite(db_session, "repo-f6-20")
    # Feature 6
    assert res["revenue_risk_analysis"]["total_arr_at_risk_usd"] == 17500000.0
    # Feature 7
    assert res["product_health_dashboard"]["overall_product_health_score"] == 94.2
    # Feature 8
    assert len(res["customer_journey_mapping"]) == 4
    # Feature 9
    assert len(res["feature_dependency_analysis"]["bottleneck_features"]) >= 2
    # Feature 10
    assert len(res["business_capability_heatmap"]) >= 4
    # Feature 11
    assert "arr_retention_kpi" in res["business_kpi_mapping"]
    # Feature 12
    assert len(res["revenue_hotspots"]) >= 2
    # Feature 13
    assert res["service_criticality_ranking"][0]["service"] == "payment_service"
    # Feature 14
    assert res["business_continuity_spof"]["spof_risk_score"] == 28.5
    # Feature 15
    assert res["product_architecture_summary"]["tiers_count"] == 4
    # Feature 16
    assert len(res["customer_segments"]) == 3
    # Feature 17
    assert len(res["regional_dependencies"]) == 3
    # Feature 18
    assert len(res["feature_adoption"]) == 3
    # Feature 19
    assert res["business_growth_trends"]["arr_growth_6m_pct"] == 24.5
    # Feature 20
    assert res["product_modernization"]["modernization_score_0_100"] == 88.5


# --- FastAPI Endpoint Integration Tests ---


def test_api_capability_graph(db_session):
    response = client.get(
        "/api/v1/biie/analytics/capability-graph?repository_id=api-f1"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_domains"] >= 3


def test_api_revenue_graph(db_session):
    response = client.get("/api/v1/biie/analytics/revenue-graph?repository_id=api-f2")
    assert response.status_code == 200
    data = response.json()
    assert data["total_revenue_generating_services"] >= 4


def test_api_customer_impact(db_session):
    response = client.post(
        "/api/v1/biie/analytics/customer-impact",
        json={"repository_id": "api-f3", "target_service": "payment_service"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_blast_radius_customers"] >= 14000


def test_api_criticality_score(db_session):
    response = client.get(
        "/api/v1/biie/analytics/criticality-score?repository_id=api-f4&service_name=payment_service"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["criticality_score_0_100"] >= 90.0


def test_api_product_dependency_graph(db_session):
    response = client.get(
        "/api/v1/biie/analytics/product-dependency-graph?repository_id=api-f5"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["product_tree"]) >= 1


def test_api_business_analytics_suite(db_session):
    response = client.get(
        "/api/v1/biie/analytics/business-analytics-suite?repository_id=api-f6-20"
    )
    assert response.status_code == 200
    data = response.json()
    assert "revenue_risk_analysis" in data
    assert "product_modernization" in data
