import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Multi-Repo WSKG Cross-Repo Dependency Graph
# ----------------------------------------------------
def test_cross_repo_graph(client):
    res = client.post(
        "/api/v1/enterprise/cross-repo-graph",
        json={
            "organization_id": "acme-corp",
            "repository_ids": ["repo-auth", "repo-gateway", "repo-payment"],
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["organization_id"] == "acme-corp"
    assert len(data["cross_repo_edges"]) >= 2
    assert "CASCADE BLAST RADIUS ANALYSIS" in data["cascade_blast_radius_summary"]


# ----------------------------------------------------
# 2. Governance Policy Evaluation
# ----------------------------------------------------
def test_evaluate_policies(client):
    res = client.post(
        "/api/v1/enterprise/evaluate-policies",
        json={
            "organization_id": "acme-corp",
            "repository_id": "repo-gateway",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["overall_status"] == "VIOLATED"
    assert len(data["violations"]) >= 1
    assert data["violations"][0]["rule_id"] == "rule_no_gateway_db"


# ----------------------------------------------------
# 3. Shared Decision Records (ADRs)
# ----------------------------------------------------
def test_create_and_get_shared_decisions(client):
    adr_num = f"ADR-{uuid.uuid4().hex[:4].upper()}"

    # Create ADR
    res_create = client.post(
        f"/api/v1/enterprise/shared-decisions?organization_id=acme-corp&title=Standardize+gRPC+Interfaces&adr_number={adr_num}&summary=Mandates+gRPC+for+internal+calls&affected_repositories=repo-auth&affected_repositories=repo-gateway"
    )
    assert res_create.status_code == 201
    created = res_create.json()
    assert created["decision_id"].startswith("adr_")

    # Get ADRs
    res_get = client.get("/api/v1/enterprise/shared-decisions/acme-corp")
    assert res_get.status_code == 200
    decisions = res_get.json()
    assert len(decisions) >= 1


# ----------------------------------------------------
# 4. Enterprise Scorecard & Architecture Rules
# ----------------------------------------------------
def test_scorecard_and_architecture_rules(client):
    # Scorecard
    res_sc = client.get("/api/v1/enterprise/scorecard/acme-corp")
    assert res_sc.status_code == 200
    sc = res_sc.json()
    assert sc["overall_health_score"] > 80.0
    assert sc["total_repositories"] >= 10

    # Architecture Rules
    res_rules = client.get("/api/v1/enterprise/architecture-rules/acme-corp")
    assert res_rules.status_code == 200
    rules = res_rules.json()
    assert len(rules) >= 2


# ----------------------------------------------------
# 5. Full 11-Engine System Regression Verification
# ----------------------------------------------------
def test_full_enterprise_governance_suite_regression(client):
    # 1. Health Probe
    assert client.get("/api/v1/release/health/readiness").status_code == 200

    # 2. Production Launch Decision
    assert client.get("/api/v1/launch/decision").status_code == 200

    # 3. Decision Status
    assert client.get("/api/v1/v13/decision").status_code == 200

    # 4. Developer Intelligence
    assert client.post("/api/v1/developer-intelligence/investigate", json={"repository_id": "demo-repo", "question": "Auth refactor?"}).status_code == 200

    # 5. Predictive Intelligence
    assert client.get("/api/v1/predictive/explorer/demo-repo").status_code == 200

    # 6. Preventive Intelligence
    assert client.post("/api/v1/preventive/pipeline", json={"prediction_id": "pred_1", "repository_id": "demo-repo"}).status_code == 200

    # 7. Autopilot Initiate
    assert client.post("/api/v1/autopilot/initiate", json={"repository_id": "demo-repo", "objective": "Autopilot test"}).status_code == 201

    # 8. Enterprise Graph
    assert client.post("/api/v1/enterprise/cross-repo-graph", json={"organization_id": "acme-corp"}).status_code == 200
