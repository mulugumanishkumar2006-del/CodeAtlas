import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.temporal_intelligence import (
    DriftTrend,
    RiskLevel,
    TemporalAIExplanationRequest,
    TemporalSearchRequest,
)
from app.services.temporal_intelligence_service import TemporalIntelligenceService


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def temporal_service():
    return TemporalIntelligenceService()


# ----------------------------------------------------
# 1. Git History Ingestion & Secret Scrubbing Tests
# ----------------------------------------------------
def test_git_ingestion_and_secret_scrubbing(temporal_service):
    raw_message = "Fix auth bug api_key='sk_live_secret123456' and Bearer eyJhbGciOiJIUzI1Ni"
    commit = temporal_service.ingest_git_commit(
        repository_id="repo_test_1",
        commit_sha="sha_c1",
        message=raw_message,
        author_name="DevAlice",
        author_email="alice@org.com",
        changed_files=["apps/backend/app/services/auth.py"],
    )

    assert commit.commit_sha == "sha_c1"
    assert "sk_live_secret123456" not in commit.message
    assert "[REDACTED_SECRET]" in commit.message or "[REDACTED_TOKEN]" in commit.message
    assert commit.total_files_changed == 1


# ----------------------------------------------------
# 2. Historical Snapshots & Code Time Machine Tests
# ----------------------------------------------------
def test_historical_snapshot(temporal_service):
    snap = temporal_service.get_snapshot("repo_test_1", "sha_c1")
    assert snap.repository_id == "repo_test_1"
    assert snap.commit_sha == "sha_c1"
    assert snap.total_components == 3
    assert len(snap.graph_state["nodes"]) >= 3


# ----------------------------------------------------
# 3. Graph Evolution & Architecture Diff Tests
# ----------------------------------------------------
def test_graph_evolution_and_architecture_diff(temporal_service):
    diff = temporal_service.diff_architecture("repo_test_1", "sha_c1", "sha_c2")
    assert diff.base_sha == "sha_c1"
    assert diff.head_sha == "sha_c2"
    assert len(diff.added_components) > 0
    assert len(diff.new_dependencies) > 0
    assert len(diff.evidence) > 0


# ----------------------------------------------------
# 4. Architecture Timeline Tests
# ----------------------------------------------------
def test_architecture_timeline(temporal_service):
    events = temporal_service.get_architecture_timeline("repo_test_1")
    assert len(events) >= 2
    assert events[0].event_type == "SERVICE_INTRODUCED"
    assert events[1].event_type == "DEPENDENCY_ADDED"


# ----------------------------------------------------
# 5. Dependency & Co-Change Intelligence Tests
# ----------------------------------------------------
def test_dependency_evolution_and_cochange(temporal_service):
    deps = temporal_service.get_dependency_evolution("repo_test_1")
    assert len(deps) >= 2
    assert deps[0].dependency_name == "sqlalchemy"

    cochanges = temporal_service.get_co_change_intelligence("repo_test_1")
    assert len(cochanges) >= 1
    assert cochanges[0].label == "Historical co-change"
    assert cochanges[0].strength_score > 0.5


# ----------------------------------------------------
# 6. Architecture Drift & Drift Trend Tests
# ----------------------------------------------------
def test_architecture_drift_and_trends(temporal_service):
    drifts = temporal_service.get_architecture_drift("repo_test_1")
    assert len(drifts) >= 1
    assert drifts[0].rule_name == "Layer Violation"
    assert drifts[0].trend in [DriftTrend.NEW, DriftTrend.INCREASING]
    assert drifts[0].severity in ["HIGH", "MEDIUM"]


# ----------------------------------------------------
# 7. Risk Trajectories & Hotspots Tests
# ----------------------------------------------------
def test_risk_evolution_and_hotspots(temporal_service):
    risks = temporal_service.get_risk_evolution("repo_test_1")
    assert len(risks) >= 1
    assert risks[0].current_risk in [RiskLevel.HIGH, RiskLevel.MEDIUM]
    assert len(risks[0].signals) > 0

    hotspots = temporal_service.get_change_hotspots("repo_test_1")
    assert len(hotspots) >= 1
    assert hotspots[0].change_frequency > 5
    assert hotspots[0].risk_level == RiskLevel.HIGH


# ----------------------------------------------------
# 8. Historical AI Reasoning & Search Tests
# ----------------------------------------------------
def test_temporal_ai_reasoning_and_search(temporal_service):
    req = TemporalAIExplanationRequest(
        repository_id="repo_test_1",
        query="When did the DB dependency appear in user service?",
    )
    res = temporal_service.query_temporal_ai(req)
    assert res.query == req.query
    assert len(res.historical_facts) > 0
    assert len(res.observations) > 0
    assert len(res.inferences) > 0
    assert len(res.predictions) > 0
    assert len(res.recommendations) > 0
    assert len(res.sources) > 0

    search_req = TemporalSearchRequest(repository_id="repo_test_1", query="auth")
    search_res = temporal_service.search_history(search_req)
    assert len(search_res.matching_commits) > 0


# ----------------------------------------------------
# 9. Temporal Blast Radius & Evaluation Tests
# ----------------------------------------------------
def test_temporal_impact_and_evaluation(temporal_service):
    impact = temporal_service.get_temporal_impact("repo_test_1", "auth_service")
    assert impact.target_component == "auth_service"
    assert impact.current_impacted_services >= impact.historical_impacted_services
    assert len(impact.impact_timeline) >= 2

    metrics = temporal_service.evaluate_temporal_intelligence("repo_test_1")
    assert metrics.historical_accuracy > 0.9
    assert metrics.passed_all_gates is True


# ----------------------------------------------------
# 10. API Endpoints Integration Tests
# ----------------------------------------------------
def test_api_temporal_endpoints(client):
    # Ingest
    res1 = client.post(
        "/api/v1/temporal/ingest",
        params={"repository_id": "api_repo", "commit_sha": "sha_100", "message": "Add payment API router"},
    )
    assert res1.status_code == 201

    # Snapshot
    res2 = client.get("/api/v1/temporal/snapshot/api_repo/sha_100")
    assert res2.status_code == 200
    assert res2.json()["commit_sha"] == "sha_100"

    # Timeline
    res3 = client.get("/api/v1/temporal/timeline/api_repo")
    assert res3.status_code == 200
    assert len(res3.json()) >= 1

    # Diff
    res4 = client.post(
        "/api/v1/temporal/diff",
        params={"repository_id": "api_repo", "base_sha": "sha_100", "head_sha": "sha_200"},
    )
    assert res4.status_code == 200
    assert "added_components" in res4.json()

    # Drift
    res5 = client.get("/api/v1/temporal/drift/api_repo")
    assert res5.status_code == 200
    assert len(res5.json()) >= 1

    # Co-change
    res6 = client.get("/api/v1/temporal/co-change/api_repo")
    assert res6.status_code == 200
    assert res6.json()[0]["label"] == "Historical co-change"

    # AI Explain
    res7 = client.post(
        "/api/v1/temporal/ai-explain",
        json={"repository_id": "api_repo", "query": "Why did coupling increase?"},
    )
    assert res7.status_code == 200
    assert "historical_facts" in res7.json()

    # Evaluate
    res8 = client.post("/api/v1/temporal/evaluate", params={"repository_id": "api_repo"})
    assert res8.status_code == 200
    assert res8.json()["passed_all_gates"] is True
