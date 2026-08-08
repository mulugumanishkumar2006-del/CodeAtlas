import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Agent Registry & Policies
# ----------------------------------------------------
def test_get_registered_agents(client):
    res = client.get("/api/v1/governance/agents/acme-corp")
    assert res.status_code == 200
    agents = res.json()
    assert len(agents) >= 1
    assert agents[0]["status"] == "ACTIVE"


def test_get_governance_policies(client):
    res = client.get("/api/v1/governance/policies/acme-corp")
    assert res.status_code == 200
    pols = res.json()
    assert len(pols) >= 1
    assert pols[0]["effect"] == "REQUIRE_FOUR_EYES"


# ----------------------------------------------------
# 2. Four-Eyes, Break-Glass & Prompt Defense
# ----------------------------------------------------
def test_evaluate_four_eyes(client):
    res = client.post("/api/v1/governance/four-eyes/evaluate?requester_id=agent_1&approver_id=sre_lead")
    assert res.status_code == 200
    eval_res = res.json()
    assert eval_res["four_eyes_verified"] is True

    # Same identity test
    res_same = client.post("/api/v1/governance/four-eyes/evaluate?requester_id=sre_lead&approver_id=sre_lead")
    assert res_same.status_code == 200
    assert res_same.json()["four_eyes_verified"] is False


def test_create_break_glass_session(client):
    res = client.post("/api/v1/governance/break-glass/create/acme-corp?requester_user=sre_lead&justification=Emergency")
    assert res.status_code == 200
    bg = res.json()
    assert bg["is_active"] is True


def test_scan_prompt_injection(client):
    res = client.post("/api/v1/governance/prompt-defense/scan?content_snippet=safe_code")
    assert res.status_code == 200
    scan = res.json()
    assert scan["injection_detected"] is False


# ----------------------------------------------------
# 3. Audit & Compliance
# ----------------------------------------------------
def test_get_audit_trail(client):
    res = client.get("/api/v1/governance/audit-trail/acme-corp")
    assert res.status_code == 200
    auds = res.json()
    assert len(auds) >= 1


def test_get_compliance_dashboard(client):
    res = client.get("/api/v1/governance/compliance/acme-corp")
    assert res.status_code == 200
    comp = res.json()
    assert comp["status"] == "COMPLIANT"


# ----------------------------------------------------
# 4. Scorecard & Readiness
# ----------------------------------------------------
def test_get_governance_scorecard(client):
    res = client.get("/api/v1/governance/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["governance_status"] == "CODEATLAS V2.9 GOVERNANCE READY"
