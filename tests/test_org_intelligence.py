import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Organization Snapshot & Health Model (Phases 1-3)
# ----------------------------------------------------
def test_get_organization_snapshot_and_health(client):
    res = client.get("/api/v1/org/snapshot/acme-corp")
    assert res.status_code == 200
    snap = res.json()
    assert snap["organization_id"] == "acme-corp"
    assert snap["health"]["overall_score"] > 80.0
    assert len(snap["single_points_of_failure"]) >= 1
    assert len(snap["priorities"]) >= 1
    assert len(snap["initiatives"]) >= 1


# ----------------------------------------------------
# 2. 7-Dimension Health Dimensions (Phase 3)
# ----------------------------------------------------
def test_get_organization_health(client):
    res = client.get("/api/v1/org/health/acme-corp")
    assert res.status_code == 200
    health = res.json()
    assert health["architecture_health"]["current_score"] >= 80.0
    assert health["security_health"]["current_score"] >= 90.0


# ----------------------------------------------------
# 3. Executive Briefing Generator (Phase 29)
# ----------------------------------------------------
def test_get_executive_briefing(client):
    res = client.get("/api/v1/org/executive-briefing/acme-corp")
    assert res.status_code == 200
    brief = res.json()
    assert len(brief["what_changed"]) >= 1
    assert len(brief["what_at_risk"]) >= 1
    assert len(brief["recommended_next_steps"]) >= 1


# ----------------------------------------------------
# 4. Organizational AI Architect RAG (Phase 26)
# ----------------------------------------------------
def test_query_ai_architect(client):
    res = client.post(
        "/api/v1/org/ai-architect/query",
        json={
            "organization_id": "acme-corp",
            "question": "What are our highest architectural risks?",
        },
    )
    assert res.status_code == 200
    ai_res = res.json()
    assert "ORGANIZATIONAL AI ARCHITECT ANALYSIS" in ai_res["answer"]
    assert len(ai_res["evidence_citations"]) >= 1
    assert ai_res["confidence"] > 0.90


# ----------------------------------------------------
# 5. Full 12-Engine System Regression Check
# ----------------------------------------------------
def test_full_org_intelligence_suite_regression(client):
    # 1. Health Probe
    assert client.get("/api/v1/release/health/readiness").status_code == 200

    # 2. Launch Decision
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

    # 9. Org Intelligence Snapshot
    assert client.get("/api/v1/org/snapshot/acme-corp").status_code == 200
