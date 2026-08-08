import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_68_phases_global_optimization(client):
    org_id = "acme-corp"

    # Scorecards, Opportunities & Architecture Comparison
    assert client.get(f"/api/v1/global-optimization/engineering-scorecard/{org_id}").status_code == 200
    assert client.get(f"/api/v1/global-optimization/opportunities/{org_id}").status_code == 200
    assert client.get("/api/v1/global-optimization/architecture-comparison/auth_service").status_code == 200

    # Experiments & Executive Summary
    assert client.get(f"/api/v1/global-optimization/experiments/{org_id}").status_code == 200
    assert client.get(f"/api/v1/global-optimization/executive-summary/{org_id}").status_code == 200

    # Completion Scorecard
    res_card = client.get(f"/api/v1/global-optimization/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["optimization_status"] == "CODEATLAS V2.8 GLOBAL OPTIMIZATION READY"


def test_full_36_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=opt@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Control Plane, Platform, Scale, Developer Platform, Marketplace, Global, Predictive, Autonomous, Self-Healing, Optimization
    assert client.get("/api/v1/control-plane/overview/acme-corp").status_code == 200
    assert client.get("/api/v1/platform/health").status_code == 200
    assert client.get("/api/v1/enterprise-scale/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/developer-platform/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/marketplace-intelligence/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/global-intelligence/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/predictive-cloud/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/autonomous-operations/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/self-healing/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/global-optimization/scorecard/acme-corp").status_code == 200
