import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.autopilot_service import AutopilotService


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Initiate Run & Pause at Human Approval Gate (Phases 1-10)
# ----------------------------------------------------
def test_initiate_autopilot_run_pauses_at_approval_gate(client):
    res = client.post(
        "/api/v1/autopilot/initiate",
        json={
            "repository_id": "demo-repo",
            "objective": "Reduce coupling in auth_service and extract OAuth2 capability",
            "trigger": "DEVELOPER_REQUEST",
        },
    )
    assert res.status_code == 201
    run = res.json()
    assert run["run_id"].startswith("ap_run_")
    assert run["status"] == "AWAITING_APPROVAL"
    assert "ANALYSIS_ONLY" in run["approved_scopes"]
    assert len(run["steps"]) >= 6
    assert "ENGINEERING AUTOPILOT PLAN" in run["plan_summary"]


# ----------------------------------------------------
# 2. Grant Approval & Scope Control (Phase 11)
# ----------------------------------------------------
def test_grant_approval_and_scope_control(client):
    init_res = client.post(
        "/api/v1/autopilot/initiate",
        json={
            "repository_id": "demo-repo",
            "objective": "Fix architecture drift in payment module",
        },
    )
    run_id = init_res.json()["run_id"]

    # Grant CODE_MODIFICATION & TESTING scopes
    appr_res = client.post(
        "/api/v1/autopilot/approve",
        json={
            "run_id": run_id,
            "scopes_to_approve": ["CODE_MODIFICATION", "TESTING", "PULL_REQUEST"],
            "approved_by": "Principal Architect",
        },
    )
    assert appr_res.status_code == 200
    run = appr_res.json()
    assert run["status"] == "APPROVED"
    assert "CODE_MODIFICATION" in run["approved_scopes"]
    assert len(run["approvals"]) >= 2


# ----------------------------------------------------
# 3. Sandbox Step Execution & PR Preparation (Phases 12-26)
# ----------------------------------------------------
def test_execute_sandbox_steps_and_pr_creation(client):
    init_res = client.post(
        "/api/v1/autopilot/initiate",
        json={
            "repository_id": "demo-repo",
            "objective": "Refactor interface boundaries",
        },
    )
    run_id = init_res.json()["run_id"]

    # Approve scopes
    client.post(
        "/api/v1/autopilot/approve",
        json={
            "run_id": run_id,
            "scopes_to_approve": ["CODE_MODIFICATION", "TESTING", "PULL_REQUEST"],
        },
    )

    # Execute sandbox
    exec_res = client.post(f"/api/v1/autopilot/execute-next?run_id={run_id}")
    assert exec_res.status_code == 200
    run = exec_res.json()
    assert run["status"] == "COMPLETED"
    assert "DIFF SUMMARY" in run["diff_summary"]


# ----------------------------------------------------
# 4. Secret Protection & Redaction Guard (Phase 32)
# ----------------------------------------------------
def test_secret_redaction_guard():
    service = AutopilotService()
    text = "Connecting to API with api_key='secret_key_123456789' and password='my_password_xyz'."
    clean_text = service.redact_secrets(text)
    assert "secret_key_123456789" not in clean_text
    assert "my_password_xyz" not in clean_text
    assert "[REDACTED_SECRET]" in clean_text


# ----------------------------------------------------
# 5. Run Cancellation (Phase 36)
# ----------------------------------------------------
def test_cancel_autopilot_run(client):
    init_res = client.post(
        "/api/v1/autopilot/initiate",
        json={
            "repository_id": "demo-repo",
            "objective": "Experimental refactoring run",
        },
    )
    run_id = init_res.json()["run_id"]

    cancel_res = client.post(f"/api/v1/autopilot/cancel?run_id={run_id}&reason=User+requested+stop")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "CANCELLED"


# ----------------------------------------------------
# 6. Evaluation Metrics (Phase 42)
# ----------------------------------------------------
def test_autopilot_metrics(client):
    res = client.get("/api/v1/autopilot/metrics/demo-repo")
    assert res.status_code == 200
    m = res.json()
    assert m["human_approval_rate"] > 0.90
    assert m["scope_adherence_rate"] == 1.00


# ----------------------------------------------------
# 7. Comprehensive 10-Engine System Regression Check
# ----------------------------------------------------
def test_full_autopilot_suite_regression(client):
    # 1. Health Probe
    assert client.get("/api/v1/release/health/readiness").status_code == 200

    # 2. Production Launch Decision
    assert client.get("/api/v1/launch/decision").status_code == 200

    # 3. Decision Status
    assert client.get("/api/v1/v13/decision").status_code == 200

    # 4. Core Developer Intelligence
    assert client.post("/api/v1/developer-intelligence/investigate", json={"repository_id": "demo-repo", "question": "Auth refactor?"}).status_code == 200

    # 5. Predictive Intelligence
    assert client.get("/api/v1/predictive/explorer/demo-repo").status_code == 200

    # 6. Preventive Intelligence Pipeline
    assert client.post("/api/v1/preventive/pipeline", json={"prediction_id": "pred_1", "repository_id": "demo-repo"}).status_code == 200

    # 7. Engineering Autopilot Initiate
    res_ap = client.post("/api/v1/autopilot/initiate", json={"repository_id": "demo-repo", "objective": "E2E Autopilot test"})
    assert res_ap.status_code == 201
    assert res_ap.json()["status"] == "AWAITING_APPROVAL"
