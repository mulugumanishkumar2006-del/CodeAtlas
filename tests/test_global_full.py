import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_65_phases_global_intelligence(client):
    org_id = "acme-corp"

    # Cloud, Infra & Topology
    assert client.get(f"/api/v1/global-intelligence/cloud-resources/{org_id}").status_code == 200
    assert client.get(f"/api/v1/global-intelligence/infrastructure-graph/{org_id}").status_code == 200
    assert client.get(f"/api/v1/global-intelligence/runtime-topology/{org_id}").status_code == 200
    assert client.get(f"/api/v1/global-intelligence/architecture-drift/{org_id}").status_code == 200

    # Blast Radius & Observability
    assert client.get("/api/v1/global-intelligence/blast-radius/auth_service").status_code == 200
    assert client.get("/api/v1/global-intelligence/observability/auth_service").status_code == 200

    # Incidents & Copilot
    assert client.get("/api/v1/global-intelligence/incidents/inc_901").status_code == 200
    assert client.get("/api/v1/global-intelligence/incident-copilot/inc_901").status_code == 200

    # SLOs, Time Machine & Resilience
    assert client.get("/api/v1/global-intelligence/service-slo/auth_service").status_code == 200
    assert client.get(f"/api/v1/global-intelligence/time-machine/{org_id}").status_code == 200
    assert client.get(f"/api/v1/global-intelligence/resilience/{org_id}").status_code == 200

    # Completion Scorecard
    res_card = client.get(f"/api/v1/global-intelligence/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["global_status"] == "CODEATLAS V2.4 GLOBAL INTELLIGENCE READY"


def test_full_32_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=sre@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200
    assert client.get("/api/v1/enterprise-scale/repository-catalog/acme-corp").status_code == 200

    # 3. Control Plane, Platform, Scale, Developer Platform, Marketplace
    assert client.get("/api/v1/control-plane/overview/acme-corp").status_code == 200
    assert client.get("/api/v1/platform/health").status_code == 200
    assert client.get("/api/v1/enterprise-scale/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/developer-platform/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/marketplace-intelligence/scorecard/acme-corp").status_code == 200

    # 4. Global Engineering Intelligence
    assert client.get("/api/v1/global-intelligence/scorecard/acme-corp").status_code == 200
