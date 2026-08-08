import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Scenario 1: Investigation & Hypotheses (Phases 2 & 3)
# ----------------------------------------------------
def test_investigation_workspace_and_hypotheses(client):
    res = client.post(
        "/api/v1/developer-intelligence/investigate",
        json={
            "repository_id": "demo-repo",
            "question": "Why is auth_service slow?",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["investigation_id"].startswith("inv_")
    assert len(data["hypotheses"]) >= 2
    assert len(data["findings"]) >= 2
    assert len(data["options"]) >= 3
    assert "RECOMMENDATION FOR INVESTIGATION" in data["recommendation"]
    assert len(data["safe_actions"]) >= 4


# ----------------------------------------------------
# 2. Scenario 2: Option Simulation & Scoring (Phases 6, 7 & 8)
# ----------------------------------------------------
def test_generate_and_simulate_options(client):
    res = client.post(
        "/api/v1/developer-intelligence/generate-options?repository_id=demo-repo&question=What+will+break+if+I+change+this%3F"
    )
    assert res.status_code == 200
    options = res.json()
    assert len(options) >= 3

    opt_titles = [o["title"] for o in options]
    assert any("Option A" in t for t in opt_titles)
    assert any("Option B" in t for t in opt_titles)

    for o in options:
        assert o["explainable_score"] > 0
        assert len(o["benefits"]) > 0


# ----------------------------------------------------
# 3. Scenario 3: Decision Recording & History (Phases 10 & 11)
# ----------------------------------------------------
def test_record_and_get_decision_history(client):
    import uuid
    dec_id = f"dec_test_{uuid.uuid4().hex[:6]}"
    # Record decision
    res_rec = client.post(
        "/api/v1/developer-intelligence/record-decision",
        json={
            "decision_id": dec_id,
            "repository_id": "demo-repo",
            "tenant_id": "default",
            "investigation_question": "Should we split auth module?",
            "chosen_option_id": "opt_b",
            "title": "OAuth2 Microservice Extraction",
            "reason": "Reduces direct DB coupling from 0.82 to 0.15.",
            "evidence_ids": ["ev_graph_1"],
            "tradeoffs": ["Requires contract update"],
            "rejected_alternatives": ["Option A"],
            "validation_plan": ["pytest tests/test_service_contracts.py"],
            "owner": "Staff Software Engineer",
            "timestamp": "2026-08-08T10:00:00Z",
            "status": "RECORDED",
        },
    )
    assert res_rec.status_code == 201

    # Fetch history
    res_hist = client.get("/api/v1/developer-intelligence/decision-history/demo-repo")
    assert res_hist.status_code == 200
    history = res_hist.json()
    assert len(history) >= 1
    assert history[0]["repository_id"] == "demo-repo"


# ----------------------------------------------------
# 4. Scenario 4: Implementation Plan & Checklist (Phases 12 & 13)
# ----------------------------------------------------
def test_create_implementation_plan(client):
    res = client.post(
        "/api/v1/developer-intelligence/create-implementation-plan?decision_id=dec_test_123&repository_id=demo-repo&title=Extract+OAuth2+Service"
    )
    assert res.status_code == 201
    plan = res.json()
    assert plan["plan_id"].startswith("plan_")
    assert len(plan["affected_files"]) >= 2
    assert len(plan["deployment_checklist"]) >= 4
    assert plan["deployment_checklist"][0]["category"] == "CODE"


# ----------------------------------------------------
# 5. Scenario 5: Plan vs Actual Validation & AI Review (Phases 14, 15 & 16)
# ----------------------------------------------------
def test_validate_plan_vs_actual_and_ai_review(client):
    # Plan vs Actual diff
    res_diff = client.post(
        "/api/v1/developer-intelligence/validate-plan-vs-actual?plan_id=plan_test_123&git_diff_text=diff--git"
    )
    assert res_diff.status_code == 200
    diff = res_diff.json()
    assert diff["fidelity_score"] >= 90.0
    assert "PLAN VS ACTUAL COMPARISON REVIEW" in diff["ai_review_summary"]

    # AI Review
    res_rev = client.post(
        "/api/v1/developer-intelligence/ai-review",
        json={
            "plan_id": "plan_test_123",
            "git_diff_text": "diff --git a/auth.py b/auth.py",
        },
    )
    assert res_rev.status_code == 200
    rev = res_rev.json()
    assert rev["matched_plan"] is True
    assert rev["test_sufficiency_score"] >= 0.90


# ----------------------------------------------------
# 6. Scenario 6: Comprehensive 7-Engine Regression Verification
# ----------------------------------------------------
def test_full_core_developer_intelligence_regression(client):
    # 1. Decision Status
    res_dec = client.get("/api/v1/v13/decision")
    assert res_dec.status_code == 200
    assert res_dec.json()["status"] == "V1.3 PLAN READY"

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
            "title": "Regression Simulation Test",
            "proposed_changes": [
                {
                    "change_id": "ch_reg",
                    "change_type": "EXTRACT_SERVICE",
                    "target_entity": "auth_service",
                    "new_value": "oauth2_service",
                }
            ],
        },
    )
    assert res_sim.status_code == 200
    assert res_sim.json()["status"] == "COMPLETED"

    # 5. Core Developer Intelligence Investigation
    res_dev = client.post(
        "/api/v1/developer-intelligence/investigate",
        json={
            "repository_id": "demo-repo",
            "question": "How to refactor auth domain?",
        },
    )
    assert res_dev.status_code == 200
    assert res_dev.json()["investigation_id"].startswith("inv_")
