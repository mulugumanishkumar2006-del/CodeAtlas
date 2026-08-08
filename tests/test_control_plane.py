import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Environment Matrix & Graph (Phases 1-3)
# ----------------------------------------------------
def test_get_control_plane_overview(client):
    res = client.get("/api/v1/control-plane/overview/acme-corp")
    assert res.status_code == 200
    overview = res.json()
    assert overview["status"] == "ACTIVE"
    assert overview["environments_count"] == 5


def test_get_environments(client):
    res = client.get("/api/v1/control-plane/environments/acme-corp")
    assert res.status_code == 200
    envs = res.json()
    assert len(envs) >= 5
    env_names = [e["name"] for e in envs]
    assert "LOCAL" in env_names
    assert "DEVELOPMENT" in env_names
    assert "TEST" in env_names
    assert "STAGING" in env_names
    assert "PRODUCTION" in env_names


def test_get_environment_graph(client):
    res = client.get("/api/v1/control-plane/environment-graph/acme-corp")
    assert res.status_code == 200
    graph = res.json()
    assert len(graph["nodes"]) >= 10
    assert len(graph["links"]) >= 8
    assert "STAGING" in graph["what_runs_where"]


# ----------------------------------------------------
# 2. Releases & Change Request (Phases 4-5)
# ----------------------------------------------------
def test_get_release_candidates(client):
    res = client.get("/api/v1/control-plane/releases/acme-corp/demo-repo")
    assert res.status_code == 200
    releases = res.json()
    assert len(releases) >= 1
    assert releases[0]["release_readiness"] == "READY"


def test_create_change_request(client):
    res = client.post(
        "/api/v1/control-plane/change-request",
        json={
            "organization_id": "acme-corp",
            "repository_id": "demo-repo",
            "objective": "OAuth2 Auth Refactor",
            "commit_hash": "a9b3c4d",
            "owner": "dev@acme.com",
            "target_environment": "STAGING",
        },
    )
    assert res.status_code == 201
    cr = res.json()
    assert cr["cr_id"].startswith("cr_")
    assert cr["simulation_verified"] is True


# ----------------------------------------------------
# 3. Policy Evaluation (Phases 6-7)
# ----------------------------------------------------
def test_evaluate_policy(client):
    # Staging check (ALLOWED)
    res_stg = client.post(
        "/api/v1/control-plane/policy/evaluate",
        json={
            "organization_id": "acme-corp",
            "user_or_agent": "autopilot_agent",
            "user_role": "DEVELOPER",
            "action": "DEPLOY",
            "repository_id": "demo-repo",
            "target_environment": "STAGING",
            "risk_score": 20.0,
        },
    )
    assert res_stg.status_code == 200
    assert res_stg.json()["result"] == "ALLOWED"

    # Production check (REQUIRES_APPROVAL)
    res_prod = client.post(
        "/api/v1/control-plane/policy/evaluate",
        json={
            "organization_id": "acme-corp",
            "user_or_agent": "autopilot_agent",
            "user_role": "DEVELOPER",
            "action": "DEPLOY",
            "repository_id": "demo-repo",
            "target_environment": "PRODUCTION",
            "risk_score": 35.0,
        },
    )
    assert res_prod.status_code == 200
    assert res_prod.json()["result"] == "REQUIRES_APPROVAL"


# ----------------------------------------------------
# 4. Deployment Planning, Preview & Guard Gate (Phases 8-9, 16)
# ----------------------------------------------------
def test_create_deployment_plan(client):
    res = client.post(
        "/api/v1/control-plane/deployments/plan?organization_id=acme-corp&repository_id=demo-repo&target_environment=STAGING"
    )
    assert res.status_code == 201
    plan = res.json()
    assert plan["policy_result"] == "ALLOWED"

    res_prod = client.post(
        "/api/v1/control-plane/deployments/plan?organization_id=acme-corp&repository_id=demo-repo&target_environment=PRODUCTION"
    )
    assert res_prod.status_code == 201
    assert res_prod.json()["policy_result"] == "REQUIRES_APPROVAL"


def test_get_deployment_preview(client):
    res = client.get("/api/v1/control-plane/deployments/preview?organization_id=acme-corp&repository_id=demo-repo&target_environment=STAGING")
    assert res.status_code == 200
    prev = res.json()
    assert prev["current_version"] == "v1.2.0"
    assert prev["target_version"] == "v1.3.0-rc1"


def test_evaluate_deployment_guard(client):
    res = client.post("/api/v1/control-plane/deployments/guard?risk_score=24.0&tests_pass=true&security_pass=true")
    assert res.status_code == 200
    assert res.json()["guard_decision"] == "ALLOWED — ALL GATES PASSED"


# ----------------------------------------------------
# 5. Centralized Operations Queue & Drift (Phases 28, 34)
# ----------------------------------------------------
def test_get_operations_queue(client):
    res = client.get("/api/v1/control-plane/queue/acme-corp")
    assert res.status_code == 200
    queue = res.json()
    assert len(queue) >= 1
    assert queue[0]["status"] == "RUNNING"


def test_get_environment_drift(client):
    res = client.get("/api/v1/control-plane/drift/acme-corp")
    assert res.status_code == 200
    drifts = res.json()
    assert len(drifts) >= 1
    assert drifts[0]["drift_type"] == "RUNTIME"


# ----------------------------------------------------
# 6. Operations AI Assistant RAG (Phase 35)
# ----------------------------------------------------
def test_query_operations_ai(client):
    res = client.post(
        "/api/v1/control-plane/ai-query",
        json={
            "organization_id": "acme-corp",
            "question": "What is currently running in Staging and is there any drift?",
        },
    )
    assert res.status_code == 200
    ops_res = res.json()
    assert "OPERATIONS CONTROL PLANE STATUS" in ops_res["answer"]
    assert len(ops_res["evidence_citations"]) >= 1
    assert ops_res["confidence"] > 0.90


# ----------------------------------------------------
# 7. Full 27-Engine System Regression Check (Phase 46)
# ----------------------------------------------------
def test_full_control_plane_suite_regression(client):
    assert client.get("/api/v1/release/health/readiness").status_code == 200
    assert client.get("/api/v1/launch/decision").status_code == 200
    assert client.get("/api/v1/v13/decision").status_code == 200
    assert client.post("/api/v1/developer-intelligence/investigate", json={"repository_id": "demo-repo", "question": "Auth refactor?"}).status_code == 200
    assert client.get("/api/v1/predictive/explorer/demo-repo").status_code == 200
    assert client.post("/api/v1/preventive/pipeline", json={"prediction_id": "pred_1", "repository_id": "demo-repo"}).status_code == 200
    assert client.post("/api/v1/autopilot/initiate", json={"repository_id": "demo-repo", "objective": "Autopilot test"}).status_code == 201
    assert client.post("/api/v1/enterprise/cross-repo-graph", json={"organization_id": "acme-corp"}).status_code == 200
    assert client.get("/api/v1/org/snapshot/acme-corp").status_code == 200
    assert client.get("/api/v1/strategy/portfolio/acme-corp").status_code == 200
    assert client.get("/api/v1/continuous/freshness/demo-repo").status_code == 200
    assert client.get("/api/v1/knowledge-fabric/explorer/ent_auth_service").status_code == 200
    assert client.get("/api/v1/autonomous/dashboard/acme-corp").status_code == 200
    assert client.get("/api/v1/control-plane/environments/acme-corp").status_code == 200
