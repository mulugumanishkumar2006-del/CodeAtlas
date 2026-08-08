import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Strategic Options Generator (Phases 4-5)
# ----------------------------------------------------
def test_get_strategic_options(client):
    res = client.get("/api/v1/strategy/options/acme-corp?target=auth_service")
    assert res.status_code == 200
    options = res.json()
    assert len(options) >= 4
    assert any(o["option_id"] == "opt_b_interface_abstraction" for o in options)
    assert any(o["option_id"] == "opt_d_accept_current" for o in options)


# ----------------------------------------------------
# 2. Multi-Scenario Comparison (Phases 7-8)
# ----------------------------------------------------
def test_compare_scenarios(client):
    res = client.post("/api/v1/strategy/compare-scenarios?organization_id=acme-corp")
    assert res.status_code == 200
    comp = res.json()
    assert len(comp["better_for"]) >= 1
    assert len(comp["worse_for"]) >= 1
    assert comp["confidence"] > 0.90


# ----------------------------------------------------
# 3. Do-Nothing Consequence Analyzer (Phase 15)
# ----------------------------------------------------
def test_get_do_nothing_analysis(client):
    res = client.post("/api/v1/strategy/do-nothing-analysis?target_entity=auth_service")
    assert res.status_code == 200
    dna = res.json()
    assert dna["target_entity"] == "auth_service"
    assert "DEGRADING" in dna["projected_risk_trend"]


# ----------------------------------------------------
# 4. Strategic Portfolio & Relative Roadmap (Phases 10 & 32)
# ----------------------------------------------------
def test_get_strategic_portfolio(client):
    res = client.get("/api/v1/strategy/portfolio/acme-corp")
    assert res.status_code == 200
    port = res.json()
    assert len(port) >= 1
    assert any(p["roadmap_phase"] == "NOW" for p in port)


# ----------------------------------------------------
# 5. Leadership Strategic Briefing (Phase 30)
# ----------------------------------------------------
def test_get_leadership_brief(client):
    res = client.get("/api/v1/strategy/leadership-brief/acme-corp")
    assert res.status_code == 200
    brief = res.json()
    assert len(brief["what_matters_most"]) >= 1
    assert len(brief["what_to_invest"]) >= 1
    assert len(brief["what_to_defer"]) >= 1


# ----------------------------------------------------
# 6. Organizational AI Strategist RAG (Phases 27-28)
# ----------------------------------------------------
def test_query_ai_strategist(client):
    res = client.post(
        "/api/v1/strategy/ai-strategist/query",
        json={
            "organization_id": "acme-corp",
            "question": "Where should engineering invest to reduce risk?",
        },
    )
    assert res.status_code == 200
    ai_res = res.json()
    assert "ORGANIZATIONAL AI STRATEGIST RECOMMENDATION" in ai_res["recommendation"]
    assert len(ai_res["evidence"]) >= 1
    assert len(ai_res["options"]) >= 1
    assert ai_res["confidence"] > 0.90


# ----------------------------------------------------
# 7. Full 13-Engine System Regression Check
# ----------------------------------------------------
def test_full_engineering_strategy_suite_regression(client):
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
