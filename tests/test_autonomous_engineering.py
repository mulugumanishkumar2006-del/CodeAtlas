import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.autonomous_engineering_service import AutonomousEngineeringService


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Task Creation & Default Level 0 Safety (Phases 1-3)
# ----------------------------------------------------
def test_create_autonomous_task(client):
    res = client.post(
        "/api/v1/autonomous/tasks/create?organization_id=acme-corp&repository_id=demo-repo&objective=Option%20B%20Auth%20Decoupling"
    )
    assert res.status_code == 201
    task = res.json()
    assert task["state"] == "WAITING_FOR_APPROVAL"
    assert task["autonomy_level"] == 0
    assert len(task["validation_matrix"]) >= 3


# ----------------------------------------------------
# 2. Human Approval Gate Processing (Phase 13)
# ----------------------------------------------------
def test_process_human_approval(client):
    res = client.post(
        "/api/v1/autonomous/tasks/task_123/approve",
        json={
            "task_id": "task_123",
            "approver": "Lead Architect",
            "action": "APPROVE",
            "reason": "Validated proposed diff",
        },
    )
    assert res.status_code == 200
    task = res.json()
    assert task["state"] == "EXECUTING"
    assert len(task["approvals"]) >= 1


# ----------------------------------------------------
# 3. Command Safety Allowlist Inspector (Phase 18)
# ----------------------------------------------------
def test_evaluate_command_safety(client):
    # Test blocked command
    res_blocked = client.post("/api/v1/autonomous/command-safety?command=rm%20-rf%20/data")
    assert res_blocked.status_code == 200
    assert res_blocked.json()["safety_class"] == "BLOCKED"
    assert not res_blocked.json()["is_permitted"]

    # Test safe command
    res_safe = client.post("/api/v1/autonomous/command-safety?command=pytest%20tests/")
    assert res_safe.status_code == 200
    assert res_safe.json()["safety_class"] == "SAFE"
    assert res_safe.json()["is_permitted"]


# ----------------------------------------------------
# 4. Secret Redaction Guard (Phase 19)
# ----------------------------------------------------
def test_secret_redaction_guard():
    service = AutonomousEngineeringService()
    raw = "Environment loaded: API_KEY=sk_live_99887766 and SECRET_KEY=supersecret"
    sanitized = service.redact_secrets_from_output(raw)
    assert "[REDACTED_SECRET]" in sanitized
    assert "sk_live_99887766" not in sanitized


# ----------------------------------------------------
# 5. Rollback Execution (Phase 26)
# ----------------------------------------------------
def test_rollback_task(client):
    res = client.post("/api/v1/autonomous/rollback/task_123")
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["status"] == "ROLLED_BACK"


# ----------------------------------------------------
# 6. Autonomy Control Dashboard (Phase 33)
# ----------------------------------------------------
def test_get_autonomy_dashboard(client):
    res = client.get("/api/v1/autonomous/dashboard/acme-corp")
    assert res.status_code == 200
    dash = res.json()
    assert dash["current_default_autonomy_level"] == 0
    assert dash["pending_approvals_count"] >= 1


# ----------------------------------------------------
# 7. Full 16-Engine System Regression Check
# ----------------------------------------------------
def test_full_autonomous_engineering_suite_regression(client):
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

    # 13. Autonomous Dashboard
    assert client.get("/api/v1/autonomous/dashboard/acme-corp").status_code == 200
