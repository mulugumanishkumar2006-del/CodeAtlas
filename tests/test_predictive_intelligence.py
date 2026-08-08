import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Prediction Generation & Explorer Tests (Phases 3-12)
# ----------------------------------------------------
def test_predictive_explorer_generation(client):
    res = client.get("/api/v1/predictive/explorer/demo-repo?time_window=30_DAYS")
    assert res.status_code == 200
    data = res.json()
    assert data["repository_id"] == "demo-repo"
    assert data["total_predictions"] >= 5

    types = [p["prediction_type"] for p in data["predictions"]]
    assert "HOTSPOT" in types
    assert "ARCHITECTURE_DRIFT" in types
    assert "CHANGE_RISK" in types
    assert "TECH_DEBT" in types

    for pred in data["predictions"]:
        assert pred["confidence"] in ["HIGH", "MEDIUM", "LOW", "UNKNOWN"]
        assert pred["explainability_reason"] is not None
        assert len(pred["signals"]) > 0


# ----------------------------------------------------
# 2. Time Window Configurable Filtering (Phase 13)
# ----------------------------------------------------
def test_predictive_time_windows(client):
    res_7 = client.get("/api/v1/predictive/explorer/demo-repo?time_window=7_DAYS")
    assert res_7.status_code == 200
    assert res_7.json()["predictions"][0]["time_window"] == "7_DAYS"

    res_90 = client.get("/api/v1/predictive/explorer/demo-repo?time_window=90_DAYS")
    assert res_90.status_code == 200
    assert res_90.json()["predictions"][0]["time_window"] == "90_DAYS"


# ----------------------------------------------------
# 3. Feedback Submission & Outcome Tracking (Phases 23 & 24)
# ----------------------------------------------------
def test_prediction_feedback_and_outcome(client):
    pred_id = f"pred_test_{uuid.uuid4().hex[:6]}"

    # Submit feedback
    res_fb = client.post(
        "/api/v1/predictive/feedback",
        json={
            "prediction_id": pred_id,
            "user_id": "dev_lead",
            "feedback_type": "USEFUL",
            "comment": "Confirmed auth_service hotspot risk.",
            "is_confirmed": True,
            "created_at": "2026-08-08T10:00:00Z",
        },
    )
    assert res_fb.status_code == 201

    # Record outcome
    res_oc = client.post(
        "/api/v1/predictive/outcome",
        json={
            "prediction_id": pred_id,
            "actual_outcome": "CONFIRMED",
            "notes": "Hotspot issue resolved via OAuth2 service extraction.",
            "evaluated_at": "2026-08-08T10:00:00Z",
        },
    )
    assert res_oc.status_code == 201


# ----------------------------------------------------
# 4. Model Evaluation Metrics (Phase 25)
# ----------------------------------------------------
def test_prediction_metrics(client):
    res = client.get("/api/v1/predictive/metrics/demo-repo")
    assert res.status_code == 200
    data = res.json()
    assert data["model_version"] == "v1.3.0-det-baseline"
    assert data["precision"] >= 0.90
    assert data["recall"] >= 0.90


# ----------------------------------------------------
# 5. Comprehensive 8-Engine Regression Verification
# ----------------------------------------------------
def test_full_predictive_suite_regression(client):
    # 1. Health Liveness & Readiness Probes
    res_ready = client.get("/api/v1/release/health/readiness")
    assert res_ready.status_code == 200

    # 2. Launch Decision Engine
    res_launch = client.get("/api/v1/launch/decision")
    assert res_launch.status_code == 200
    assert res_launch.json()["decision"] == "GO"

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

    # 5. Predictive Engineering Intelligence Explorer
    res_pred = client.get("/api/v1/predictive/explorer/demo-repo")
    assert res_pred.status_code == 200
    assert res_pred.json()["total_predictions"] >= 5
