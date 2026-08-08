import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.exceptions import (
    AIReasoningError,
    AnalysisError,
    AuthenticationError,
    DatabaseError,
    GraphError,
    NotFoundError,
    PermissionError,
    SearchError,
    SimulationError,
    ValidationError,
)


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. End-to-End Developer Journey Smoke Test (Phase 2 & 28)
# ----------------------------------------------------
def test_release_smoke_test(client):
    res = client.post("/api/v1/release/smoke-test", params={"repository_id": "demo-repo"})
    assert res.status_code == 200
    data = res.json()
    assert data["version"] == "v1.2.0-rc1"
    assert data["overall_status"] == "PASSED"
    assert data["total_steps"] == 14
    assert data["passed_steps"] == 14
    assert len(data["steps"]) == 14

    step_names = [s["step_name"] for s in data["steps"]]
    expected_journey = [
        "LOGIN",
        "CREATE WORKSPACE",
        "CONNECT REPOSITORY",
        "ANALYZE REPOSITORY",
        "EXPLORE REPOSITORY",
        "SEARCH",
        "ARCHITECTURE",
        "INVESTIGATE",
        "IMPACT",
        "AI REASONING",
        "TEMPORAL INTELLIGENCE",
        "SIMULATION",
        "DECISION SUPPORT",
        "LOGOUT",
    ]
    assert step_names == expected_journey


# ----------------------------------------------------
# 2. Production Health & Readiness Probes (Phase 20)
# ----------------------------------------------------
def test_liveness_and_readiness_probes(client):
    res_live = client.get("/api/v1/release/health/liveness")
    assert res_live.status_code == 200
    assert res_live.json()["status"] == "UP"

    res_ready = client.get("/api/v1/release/health/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["status"] == "READY"
    assert res_ready.json()["checks"]["database"] == "HEALTHY"


# ----------------------------------------------------
# 3. Release Scorecard (Phase 35)
# ----------------------------------------------------
def test_release_scorecard(client):
    res = client.get("/api/v1/release/scorecard")
    assert res.status_code == 200
    data = res.json()
    assert data["version"] == "v1.2.0-rc1"
    assert data["release_ready"] is True
    assert len(data["categories"]) == 12
    assert all(c["status"] == "GREEN" for c in data["categories"])


# ----------------------------------------------------
# 4. Secret Scanning Audit (Phase 14)
# ----------------------------------------------------
def test_secret_scan_audit(client):
    res = client.post("/api/v1/release/secret-scan", params={"repository_id": "demo-repo"})
    assert res.status_code == 200
    data = res.json()
    assert data["secrets_found_count"] == 0
    assert data["passed_audit"] is True


# ----------------------------------------------------
# 5. Error Taxonomy & Exception Handling (Phase 21)
# ----------------------------------------------------
def test_error_taxonomy_exceptions():
    e1 = ValidationError("Invalid parameter")
    assert e1.error_code == "VALIDATION_ERROR"
    assert e1.status_code == 400

    e2 = AuthenticationError()
    assert e2.error_code == "AUTH_ERROR"
    assert e2.status_code == 401

    e3 = PermissionError()
    assert e3.error_code == "PERMISSION_ERROR"
    assert e3.status_code == 403

    e4 = NotFoundError("Repository", "repo_999")
    assert e4.error_code == "NOT_FOUND"
    assert e4.status_code == 404

    e5 = AnalysisError("Analysis failed")
    assert e5.error_code == "ANALYSIS_ERROR"

    e6 = GraphError("Graph cycle detected")
    assert e6.error_code == "GRAPH_ERROR"

    e7 = SearchError("Invalid search query")
    assert e7.error_code == "SEARCH_ERROR"

    e8 = AIReasoningError("Provider timeout")
    assert e8.error_code == "AI_ERROR"

    e9 = SimulationError("Virtual graph construction failed")
    assert e9.error_code == "SIMULATION_ERROR"

    e10 = DatabaseError()
    assert e10.error_code == "DATABASE_ERROR"


# ----------------------------------------------------
# 6. End-to-End Regression Verification Across All v1.2 Modules
# ----------------------------------------------------
def test_v1_2_full_regression_suite(client):
    # 1. AI Reasoning Engine
    res_ai = client.post(
        "/api/v1/reasoning/query",
        json={
            "repository_id": "demo-repo",
            "query": "What is the architecture of the auth service?",
            "intent_override": "ARCHITECTURE",
        },
    )
    assert res_ai.status_code == 200

    # 2. Temporal Software Intelligence
    res_temp = client.get("/api/v1/temporal/drift/demo-repo")
    assert res_temp.status_code == 200

    # 3. Engineering Simulation Studio
    res_sim = client.post(
        "/api/v1/simulation/run",
        json={
            "repository_id": "demo-repo",
            "title": "Service Extraction Simulation",
            "proposed_changes": [
                {
                    "change_id": "c1",
                    "change_type": "EXTRACT_SERVICE",
                    "target_entity": "auth_domain",
                    "new_value": "oauth2_service",
                }
            ],
        },
    )
    assert res_sim.status_code == 200
    assert res_sim.json()["status"] == "COMPLETED"
