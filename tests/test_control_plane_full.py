import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_48_phases_control_plane(client):
    # Phase 1: Overview
    res_ov = client.get("/api/v1/control-plane/overview/acme-corp")
    assert res_ov.status_code == 200
    assert res_ov.json()["environments_count"] == 5

    # Phase 2-3: Environments & Graph
    res_envs = client.get("/api/v1/control-plane/environments/acme-corp")
    assert res_envs.status_code == 200
    res_graph = client.get("/api/v1/control-plane/environment-graph/acme-corp")
    assert res_graph.status_code == 200

    # Phase 4-5: Releases & Change Requests
    res_rels = client.get("/api/v1/control-plane/releases/acme-corp/demo-repo")
    assert res_rels.status_code == 200
    res_cr = client.post(
        "/api/v1/control-plane/change-request",
        json={"organization_id": "acme-corp", "repository_id": "demo-repo", "objective": "Full test CR"},
    )
    assert res_cr.status_code == 201

    # Phase 6-7: Policy Evaluation
    res_pol = client.post(
        "/api/v1/control-plane/policy/evaluate",
        json={
            "organization_id": "acme-corp",
            "user_or_agent": "test_runner",
            "repository_id": "demo-repo",
            "target_environment": "STAGING",
        },
    )
    assert res_pol.status_code == 200

    # Phase 8-9, 16: Deployment Plan, Preview & Guard
    res_plan = client.post("/api/v1/control-plane/deployments/plan?organization_id=acme-corp&repository_id=demo-repo")
    assert res_plan.status_code == 201
    res_prev = client.get("/api/v1/control-plane/deployments/preview?organization_id=acme-corp&repository_id=demo-repo&target_environment=STAGING")
    assert res_prev.status_code == 200
    res_guard = client.post("/api/v1/control-plane/deployments/guard?risk_score=15.0&tests_pass=true&security_pass=true")
    assert res_guard.status_code == 200

    # Phase 10-12: CI/CD & Artifacts
    res_pipes = client.get("/api/v1/control-plane/pipelines/demo-repo")
    assert res_pipes.status_code == 200
    res_art = client.get("/api/v1/control-plane/artifacts/art_v130_rc1")
    assert res_art.status_code == 200

    # Phase 13-15, 19-21: Risk, Execution, Verification
    res_risk = client.get("/api/v1/control-plane/deployments/risk/demo-repo?target_environment=STAGING")
    assert res_risk.status_code == 200
    plan_id = res_plan.json()["plan_id"]
    res_exec = client.post(f"/api/v1/control-plane/deployments/execute/{plan_id}")
    assert res_exec.status_code == 200
    res_ver = client.get(f"/api/v1/control-plane/deployments/verify/{plan_id}")
    assert res_ver.status_code == 200

    # Phase 17-18, 22-23: Approvals, Rollback, Incident Link
    res_appr = client.get("/api/v1/control-plane/approvals/req_101")
    assert res_appr.status_code == 200
    res_rb = client.post(f"/api/v1/control-plane/deployments/rollback/{plan_id}")
    assert res_rb.status_code == 200
    res_inc = client.post("/api/v1/control-plane/incidents/link?deployment_id=dep_101&incident_id=INC-402")
    assert res_inc.status_code == 200

    # Phase 24-30: Release Intel, Timeline, Agent Op, Queue
    res_rel_intel = client.get("/api/v1/control-plane/release-intelligence/v1.3.0-rc1")
    assert res_rel_intel.status_code == 200
    res_time = client.get("/api/v1/control-plane/timeline/acme-corp")
    assert res_time.status_code == 200
    res_agent_op = client.post("/api/v1/control-plane/agent/operation?agent_id=autonomy_1&requested_action=DEPLOY&target_environment=STAGING")
    assert res_agent_op.status_code == 200
    res_q = client.get("/api/v1/control-plane/queue/acme-corp")
    assert res_q.status_code == 200

    # Phase 31-35: Drift, History, Operations AI
    res_drift = client.get("/api/v1/control-plane/drift/acme-corp")
    assert res_drift.status_code == 200
    res_hist = client.get("/api/v1/control-plane/history/demo-repo")
    assert res_hist.status_code == 200
    res_ai = client.post("/api/v1/control-plane/ai-query", json={"organization_id": "acme-corp", "question": "What is running in staging?"})
    assert res_ai.status_code == 200

    # Phase 36-43: Readiness, Audit, Security Check, Observability, Synthetic Env
    res_ready = client.get("/api/v1/control-plane/readiness/rel_v130_rc1")
    assert res_ready.status_code == 200
    res_audit = client.get("/api/v1/control-plane/audit/acme-corp")
    assert res_audit.status_code == 200
    res_sec = client.get("/api/v1/control-plane/security-check/acme-corp")
    assert res_sec.status_code == 200
    assert res_sec.json()["passed"] is True
    res_obs = client.get("/api/v1/control-plane/observability/acme-corp")
    assert res_obs.status_code == 200
    res_syn = client.post("/api/v1/control-plane/synthetic-env/acme-corp")
    assert res_syn.status_code == 200
