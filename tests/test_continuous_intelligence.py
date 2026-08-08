import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Webhook Ingestion & Change Classification (Phases 1-4)
# ----------------------------------------------------
def test_ingest_engineering_event(client):
    res = client.post(
        "/api/v1/continuous/webhook/ingest?organization_id=acme-corp&repository_id=demo-repo&summary=TestCommit"
    )
    assert res.status_code == 201
    evt = res.json()
    assert evt["repository_id"] == "demo-repo"
    assert evt["change_category"] in ["ARCHITECTURAL", "STRUCTURAL", "DEPENDENCY"]


# ----------------------------------------------------
# 2. Continuous Engineering Timeline (Phase 28)
# ----------------------------------------------------
def test_get_continuous_timeline(client):
    res = client.get("/api/v1/continuous/timeline/demo-repo")
    assert res.status_code == 200
    tl = res.json()
    assert tl["repository_id"] == "demo-repo"
    assert len(tl["events"]) >= 1


# ----------------------------------------------------
# 3. Daily Engineering Brief Generator (Phase 30)
# ----------------------------------------------------
def test_get_daily_brief(client):
    res = client.get("/api/v1/continuous/daily-brief/acme-corp")
    assert res.status_code == 200
    brief = res.json()
    assert brief["meaningful_changes_count"] >= 1
    assert len(brief["architecture_changes"]) >= 1


# ----------------------------------------------------
# 4. Data Freshness Tracker (Phase 36)
# ----------------------------------------------------
def test_get_data_freshness(client):
    res = client.get("/api/v1/continuous/freshness/demo-repo")
    assert res.status_code == 200
    fresh = res.json()
    assert fresh["status"] == "FRESH"
    assert "UP_TO_DATE" in fresh["graph_freshness"]


# ----------------------------------------------------
# 5. Role-Based Notification Digest & Deduplication (Phases 22-24)
# ----------------------------------------------------
def test_get_notifications_for_role(client):
    res = client.get("/api/v1/continuous/notifications/Architect")
    assert res.status_code == 200
    notifs = res.json()
    assert len(notifs) >= 1
    assert notifs[0]["recipient_role"] == "Architect"
    assert notifs[0]["deduplicated_event_count"] >= 1


# ----------------------------------------------------
# 6. Event Replay Engine (Phase 38)
# ----------------------------------------------------
def test_replay_events(client):
    res = client.post(
        "/api/v1/continuous/event-replay",
        json={
            "organization_id": "acme-corp",
            "repository_id": "demo-repo",
            "event_ids": ["evt_1", "evt_2"],
            "dry_run": True,
        },
    )
    assert res.status_code == 200
    rep = res.json()
    assert rep["status"] == "REPLAY_COMPLETED"
    assert rep["dry_run"] is True


# ----------------------------------------------------
# 7. Full 14-Engine System Regression Check
# ----------------------------------------------------
def test_full_continuous_intelligence_suite_regression(client):
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
