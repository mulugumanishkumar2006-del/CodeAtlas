import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Knowledge Entity Capture & Provenance (Phases 1-4)
# ----------------------------------------------------
def test_capture_knowledge_entity(client):
    res = client.post(
        "/api/v1/knowledge-fabric/capture?organization_id=acme-corp&repository_id=demo-repo&name=auth_service"
    )
    assert res.status_code == 201
    ent = res.json()
    assert ent["name"] == "auth_service"
    assert ent["validation_status"] == "HUMAN_VERIFIED"
    assert ent["freshness"] == "FRESH"


# ----------------------------------------------------
# 2. "Why History" RAG Engine (Phase 6)
# ----------------------------------------------------
def test_get_why_history(client):
    res = client.get("/api/v1/knowledge-fabric/why-history?question=Why was auth_service created?")
    assert res.status_code == 200
    why = res.json()
    assert "WHY 'auth_service' WAS CREATED" in why["answer"]
    assert len(why["decision_citations"]) >= 1
    assert why["confidence"] > 0.90


# ----------------------------------------------------
# 3. Knowledge Conflicts Detector (Phase 17)
# ----------------------------------------------------
def test_get_knowledge_conflicts(client):
    res = client.get("/api/v1/knowledge-fabric/conflicts/acme-corp")
    assert res.status_code == 200
    conflicts = res.json()
    assert len(conflicts) >= 1
    assert "Documentation states" in conflicts[0]["statement_a"]
    assert "Codebase AST evidence" in conflicts[0]["statement_b"]


# ----------------------------------------------------
# 4. Progressive Knowledge Explorer Graph (Phases 37-38)
# ----------------------------------------------------
def test_get_knowledge_explorer_graph(client):
    res = client.get("/api/v1/knowledge-fabric/explorer/ent_auth_service")
    assert res.status_code == 200
    graph = res.json()
    assert graph["root_entity_id"] == "ent_auth_service"
    assert len(graph["nodes"]) >= 3
    assert len(graph["edges"]) >= 2


# ----------------------------------------------------
# 5. Engineering Lessons Learned (Phase 15)
# ----------------------------------------------------
def test_get_engineering_lessons(client):
    res = client.get("/api/v1/knowledge-fabric/lessons/acme-corp")
    assert res.status_code == 200
    lessons = res.json()
    assert len(lessons) >= 1
    assert "Interface abstraction boundaries" in lessons[0]["lesson_text"]


# ----------------------------------------------------
# 6. Knowledge-Aware AI Assistant RAG (Phases 25 & 39)
# ----------------------------------------------------
def test_query_knowledge_ai(client):
    res = client.post(
        "/api/v1/knowledge-fabric/ai-query",
        json={
            "organization_id": "acme-corp",
            "question": "What did previous investigations conclude about Gateway DB access?",
        },
    )
    assert res.status_code == 200
    ai_res = res.json()
    assert "LIVING KNOWLEDGE FABRIC ANALYSIS" in ai_res["answer"]
    assert len(ai_res["evidence_citations"]) >= 1
    assert ai_res["confidence"] > 0.90


# ----------------------------------------------------
# 7. Full 15-Engine System Regression Check
# ----------------------------------------------------
def test_full_knowledge_fabric_suite_regression(client):
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

    # 10. Engineering Strategy Portfolio
    assert client.get("/api/v1/strategy/portfolio/acme-corp").status_code == 200

    # 11. Continuous Data Freshness
    assert client.get("/api/v1/continuous/freshness/demo-repo").status_code == 200

    # 12. Knowledge Fabric Explorer
    assert client.get("/api/v1/knowledge-fabric/explorer/ent_auth_service").status_code == 200
