import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_67_phases_platform(client):
    # Multi-tenancy & Auth
    res_org = client.post("/api/v1/platform/organizations?name=AcmeCorp&subscription_tier=ENTERPRISE")
    assert res_org.status_code == 201
    org_id = res_org.json()["organization_id"]

    res_auth = client.post("/api/v1/platform/auth/login?email=admin@acme.com&organization_id=" + org_id)
    assert res_auth.status_code == 200

    # Onboarding
    res_onb = client.post(
        "/api/v1/platform/onboarding",
        json={"email": "admin@acme.com", "organization_name": "AcmeCorp", "github_repo_url": "https://github.com/acme/demo-repo"},
    )
    assert res_onb.status_code == 200
    assert res_onb.json()["status"] == "ONBOARDED"

    # Webhooks & Jobs
    res_wh = client.post(
        "/api/v1/platform/webhooks/ingest",
        json={"event_type": "repository.updated", "signature_hmac": "sha256=abcdef", "nonce": "n101", "payload": {"repo": "demo-repo"}},
    )
    assert res_wh.status_code == 200

    res_job = client.post(f"/api/v1/platform/jobs/submit?organization_id={org_id}&repository_id=demo-repo")
    assert res_job.status_code == 202

    # Rate Limiting & Security Audit
    res_rl = client.get(f"/api/v1/platform/rate-limit/{org_id}")
    assert res_rl.status_code == 200

    res_sec = client.get(f"/api/v1/platform/security-audit/{org_id}")
    assert res_sec.status_code == 200

    # Quotas, AI Models & Search
    res_q = client.get(f"/api/v1/platform/quotas/{org_id}")
    assert res_q.status_code == 200

    res_ai_cfg = client.get("/api/v1/platform/ai-config")
    assert res_ai_cfg.status_code == 200

    res_srch = client.post("/api/v1/platform/search", json={"organization_id": org_id, "query": "AuthService"})
    assert res_srch.status_code == 200

    # Command Center & Notifications
    res_cc = client.get(f"/api/v1/platform/command-center/{org_id}")
    assert res_cc.status_code == 200

    res_notif = client.get(f"/api/v1/platform/notifications/{org_id}")
    assert res_notif.status_code == 200

    # Audit, DR & SLO
    res_audit = client.get(f"/api/v1/platform/audit-logs/{org_id}")
    assert res_audit.status_code == 200

    res_dr = client.get("/api/v1/platform/disaster-recovery")
    assert res_dr.status_code == 200

    res_slo = client.get("/api/v1/platform/slo")
    assert res_slo.status_code == 200

    # CLI & Error Experience
    res_cli = client.post("/api/v1/platform/cli/execute?command=codeatlas%20analyze")
    assert res_cli.status_code == 200

    res_err = client.get("/api/v1/platform/error/ERR-4001")
    assert res_err.status_code == 200

    # Phase 64 & 65: E2E Scenario Validation & 28-System Regression
    res_e2e = client.post(f"/api/v1/platform/e2e-validation/{org_id}")
    assert res_e2e.status_code == 200
    assert res_e2e.json()["overall_status"] == "PASSED"

    # Scorecard
    res_score = client.get(f"/api/v1/platform/scorecard/{org_id}")
    assert res_score.status_code == 200
    assert res_score.json()["launch_status"] == "CODEATLAS V2.0 PRODUCTION READY"
