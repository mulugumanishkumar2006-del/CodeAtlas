import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Telemetry & Funnel Observation Tests (Phases 1-4)
# ----------------------------------------------------
def test_v13_production_observation(client):
    res = client.get("/api/v1/v13/observation")
    assert res.status_code == 200
    data = res.json()
    assert len(data["workflow_funnel"]) == 8
    assert data["overall_funnel_conversion_rate"] >= 75.0
    assert data["ai_grounding_accuracy"] >= 95.0


# ----------------------------------------------------
# 2. Friction & Value Map Classification Tests (Phases 14 & 15)
# ----------------------------------------------------
def test_v13_friction_and_value_map(client):
    res = client.get("/api/v1/v13/friction-and-value-map")
    assert res.status_code == 200
    data = res.json()
    assert len(data["value_map"]) >= 5

    classifications = [v["classification"] for v in data["value_map"]]
    assert "KEEP" in classifications
    assert "EXPAND" in classifications
    assert "DEPRECATE" in classifications


# ----------------------------------------------------
# 3. Opportunity Scoring & Rejection Reasons Tests (Phases 18 & 19)
# ----------------------------------------------------
def test_v13_opportunities_scoring(client):
    res = client.get("/api/v1/v13/opportunities")
    assert res.status_code == 200
    data = res.json()
    assert len(data["scored_candidates"]) >= 3
    assert len(data["rejected_candidates"]) >= 2

    for item in data["scored_candidates"]:
        assert item["priority"] in ["P0", "P1", "P2", "P3"]
        assert item["total_score"] > 0

    for item in data["rejected_candidates"]:
        assert item["priority"] == "REJECTED"
        assert item["rejection_reason"] is not None


# ----------------------------------------------------
# 4. 5-Phase Engineering Roadmap Tests (Phase 22)
# ----------------------------------------------------
def test_v13_engineering_roadmap(client):
    res = client.get("/api/v1/v13/roadmap")
    assert res.status_code == 200
    phases = res.json()
    assert len(phases) == 5
    assert phases[0]["phase_number"] == 1
    assert "Incremental WSKG" in phases[0]["title"]
    assert phases[4]["phase_number"] == 5


# ----------------------------------------------------
# 5. Final Decision Engine Tests (Phase 27)
# ----------------------------------------------------
def test_v13_planning_decision(client):
    res = client.get("/api/v1/v13/decision")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "V1.3 PLAN READY"
    assert data["evidence_backed"] is True
    assert "CONNECT" in data["north_star_objective"]


# ----------------------------------------------------
# 6. Full End-to-End Suite Regression Verification
# ----------------------------------------------------
def test_full_v13_suite_regression(client):
    # 1. Health Liveness & Readiness Probes
    res_ready = client.get("/api/v1/release/health/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["status"] == "READY"

    # 2. Production Launch Decision
    res_launch = client.get("/api/v1/launch/decision")
    assert res_launch.status_code == 200
    assert res_launch.json()["decision"] == "GO"

    # 3. AI Reasoning Query Engine
    res_ai = client.post(
        "/api/v1/reasoning/query",
        json={
            "repository_id": "demo-repo",
            "query": "How is authentication implemented?",
            "intent_override": "EXPLAIN",
        },
    )
    assert res_ai.status_code == 200

    # 4. Simulation Studio Engine
    res_sim = client.post(
        "/api/v1/simulation/run",
        json={
            "repository_id": "demo-repo",
            "title": "v1.3 Planning Test Simulation",
            "proposed_changes": [
                {
                    "change_id": "c_v13",
                    "change_type": "EXTRACT_SERVICE",
                    "target_entity": "auth_service",
                    "new_value": "identity_service",
                }
            ],
        },
    )
    assert res_sim.status_code == 200
    assert res_sim.json()["status"] == "COMPLETED"
