import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Risk -> Intervention Pipeline & Safest Option (Phases 2-8)
# ----------------------------------------------------
def test_prevention_pipeline_and_safest_option(client):
    res = client.post(
        "/api/v1/preventive/pipeline",
        json={
            "prediction_id": "pred_hotspot_1",
            "repository_id": "demo-repo",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["target_entity"] == "auth_service"
    assert len(data["interventions"]) >= 3

    ranks = [opt["rank"] for opt in data["interventions"]]
    assert "BEST_OPTION" in ranks
    assert "LOWEST_EFFORT_OPTION" in ranks
    assert "HIGHEST_IMPACT_OPTION" in ranks

    # Verify Before/After state comparison
    ba = data["before_after"]
    assert ba["current_risk_score"] > ba["proposed_risk_score"]
    assert ba["risk_delta"] < 0

    # Verify Safest Option
    assert data["safest_option"]["rank"] == "BEST_OPTION"


# ----------------------------------------------------
# 2. Prevention Plan & Task Breakdown (Phases 9 & 10)
# ----------------------------------------------------
def test_create_prevention_plan(client):
    res = client.post(
        "/api/v1/preventive/create-plan?prediction_id=pred_hotspot_1&repository_id=demo-repo&chosen_option_id=opt_b_interface"
    )
    assert res.status_code == 201
    plan = res.json()
    assert plan["plan_id"].startswith("prev_plan_")
    assert plan["target_entity"] == "auth_service"
    assert len(plan["task_breakdown"]) >= 5
    assert len(plan["affected_files"]) >= 2
    assert len(plan["validation_plan"]) >= 2


# ----------------------------------------------------
# 3. Outcome Recording & Prevention History (Phases 15 & 18)
# ----------------------------------------------------
def test_record_outcome_and_history(client):
    plan_id = f"prev_plan_{uuid.uuid4().hex[:6]}"

    # Record outcome
    res_oc = client.post(
        "/api/v1/preventive/record-outcome",
        json={
            "plan_id": plan_id,
            "actual_outcome": "SUCCESSFULLY_PREVENTED",
            "measured_risk_reduction": 50.5,
            "notes": "OAuth2 service extraction successfully reduced coupling score.",
        },
    )
    assert res_oc.status_code == 201

    # Fetch history
    res_hist = client.get("/api/v1/preventive/history/demo-repo")
    assert res_hist.status_code == 200
    hist = res_hist.json()
    assert len(hist) >= 1
    assert hist[0]["repository_id"] == "demo-repo"


# ----------------------------------------------------
# 4. Recurrence Pattern Detection (Phase 17)
# ----------------------------------------------------
def test_recurrence_patterns(client):
    res = client.get("/api/v1/preventive/recurrence/demo-repo")
    assert res.status_code == 200
    patterns = res.json()
    assert len(patterns) >= 1
    assert patterns[0]["entity_name"] == "auth_service"
    assert patterns[0]["occurrence_count"] >= 3


# ----------------------------------------------------
# 5. Comprehensive 9-Engine Regression Verification
# ----------------------------------------------------
def test_full_preventive_suite_regression(client):
    # 1. Health Readiness Probe
    res_ready = client.get("/api/v1/release/health/readiness")
    assert res_ready.status_code == 200

    # 2. Production Launch Decision
    res_launch = client.get("/api/v1/launch/decision")
    assert res_launch.status_code == 200

    # 3. Decision Status
    res_dec = client.get("/api/v1/v13/decision")
    assert res_dec.status_code == 200

    # 4. Core Developer Intelligence Investigation
    res_dev = client.post(
        "/api/v1/developer-intelligence/investigate",
        json={
            "repository_id": "demo-repo",
            "question": "How to refactor auth domain?",
        },
    )
    assert res_dev.status_code == 200

    # 5. Predictive Intelligence Explorer
    res_pred = client.get("/api/v1/predictive/explorer/demo-repo")
    assert res_pred.status_code == 200

    # 6. Preventive Intelligence Pipeline
    res_prev = client.post(
        "/api/v1/preventive/pipeline",
        json={
            "prediction_id": "pred_hotspot_1",
            "repository_id": "demo-repo",
        },
    )
    assert res_prev.status_code == 200
    assert res_prev.json()["pipeline_id"].startswith("prev_pipe_")
