import os
import sys
from datetime import datetime, timezone

import pytest

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.core.database import SessionLocal
from app.main import app
from app.models.evolution import CommitSnapshot, ComponentSnapshot
from app.models.repository import Repository
from app.models.user import User
from fastapi.testclient import TestClient


@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="module")
def setup_test_data(db_session):
    # 1. Create a test user
    user = db_session.query(User).filter(User.id == "test_evo_user").first()
    if not user:
        user = User(
            id="test_evo_user",
            username="evo_test",
            name="Evolution Test User",
            email="evo@example.com",
        )
        db_session.add(user)
        db_session.commit()

    # 2. Create a test repository
    repo_id = "test_evo_repo_id"
    repo = db_session.query(Repository).filter(Repository.id == repo_id).first()
    if repo:
        commit_ids = [
            c.id
            for c in db_session.query(CommitSnapshot)
            .filter(CommitSnapshot.repository_id == repo_id)
            .all()
        ]
        if commit_ids:
            db_session.query(ComponentSnapshot).filter(
                ComponentSnapshot.commit_snapshot_id.in_(commit_ids)
            ).delete(synchronize_session=False)
        db_session.query(CommitSnapshot).filter(
            CommitSnapshot.repository_id == repo_id
        ).delete()
        db_session.delete(repo)
        db_session.commit()

    repo = Repository(
        id=repo_id,
        name="evo-repo",
        full_name="test/evo-repo",
        clone_url="https://github.com/test/evo-repo.git",
        status="cloned",
        user_id="test_evo_user",
    )
    db_session.add(repo)
    db_session.commit()

    base_snap = CommitSnapshot(
        id="snap_base_id",
        repository_id=repo_id,
        commit_sha="aaaa1111bbbb2222cccc3333dddd4444eeee5555",
        author_name="Alice",
        author_email="alice@example.com",
        committed_at=datetime(2026, 1, 1, 12, 0, 0, tzinfo=timezone.utc),
        message="Initial commit",
        total_files=2,
        total_lines=150,
        code_lines=100,
        comment_lines=30,
        complexity_total=10,
        complexity_average=5.0,
        complexity_max=7,
        documentation_coverage=0.8,
        dependencies_count=5,
        languages={"python": 100},
        health_score=85.0,
        architecture_patterns=[
            {
                "pattern": "MVC",
                "confidence": 0.8,
                "description": "MVC Pattern",
                "evidence": [],
            }
        ],
        graph_data={
            "nodes": [
                {"id": "auth", "name": "auth", "kind": "file", "file_path": "auth.py"}
            ],
            "edges": [],
        },
        average_function_size=20.0,
        cohesion_score=0.9,
        maintainability_index=80.0,
    )
    db_session.add(base_snap)

    head_snap = CommitSnapshot(
        id="snap_head_id",
        repository_id=repo_id,
        commit_sha="1111222233334444555566667777888899990000",
        author_name="Bob",
        author_email="bob@example.com",
        committed_at=datetime(2026, 1, 2, 12, 0, 0, tzinfo=timezone.utc),
        message="Feature update: bump version to v1.1.0, added ADR definition document, modified docker-compose config",
        total_files=3,
        total_lines=500,
        code_lines=450,
        comment_lines=40,
        complexity_total=30,
        complexity_average=10.0,
        complexity_max=15,
        documentation_coverage=0.6,
        dependencies_count=20,  # dependency explosion spike
        languages={"python": 180},
        health_score=65.0,
        average_function_size=35.0,
        cohesion_score=0.7,
        maintainability_index=60.0,
        architecture_patterns=[
            {
                "pattern": "MVC",
                "confidence": 0.8,
                "description": "MVC Pattern",
                "evidence": [],
            }
        ],
        graph_data={
            "nodes": [
                {"id": "auth", "name": "auth", "kind": "file", "file_path": "auth.py"},
                {
                    "id": "payment_api",
                    "name": "payment_api",
                    "kind": "api",
                    "file_path": "payment_api.py",
                },
                {
                    "id": "users_db",
                    "name": "users_db",
                    "kind": "database table",
                    "file_path": "models.py",
                },
            ],
            "edges": [
                {"source": "payment_api", "target": "users_db", "kind": "CALLS"},
                {"source": "auth", "target": "payment_api", "kind": "CALLS"},
            ],
        },
    )
    db_session.add(head_snap)
    db_session.commit()

    # 4. Create ComponentSnapshots for base
    c1_base = ComponentSnapshot(
        id="comp1_base",
        commit_snapshot_id="snap_base_id",
        path="auth",
        type="domain",
        name="auth",
        complexity_total=5,
        complexity_average=2.5,
        complexity_max=4,
        code_lines=50,
        comment_lines=15,
        dependencies_count=1,
        dependents_count=2,
        coupling_score=0.33,
        technical_debt_score=25.5,
    )
    db_session.add(c1_base)

    # 5. Create ComponentSnapshots for head
    c1_head = ComponentSnapshot(
        id="comp1_head",
        commit_snapshot_id="snap_head_id",
        path="auth",
        type="domain",
        name="auth",
        complexity_total=20,  # complexity and tech debt spike
        complexity_average=10.0,
        complexity_max=12,
        code_lines=80,
        comment_lines=10,
        dependencies_count=8,
        dependents_count=1,
        coupling_score=0.88,
        technical_debt_score=65.2,  # Spikes from 25.5 -> 65.2 (>15 point spike)
    )
    db_session.add(c1_head)

    c2_head = ComponentSnapshot(
        id="comp2_head",
        commit_snapshot_id="snap_head_id",
        path="payment",
        type="domain",
        name="payment",
        complexity_total=8,
        complexity_average=4.0,
        complexity_max=5,
        code_lines=40,
        comment_lines=15,
        dependencies_count=2,
        dependents_count=0,
        coupling_score=1.0,
        technical_debt_score=30.0,
    )
    db_session.add(c2_head)
    db_session.commit()

    yield {
        "repo_id": repo_id,
        "base_sha": "aaaa1111bbbb2222cccc3333dddd4444eeee5555",
        "head_sha": "1111222233334444555566667777888899990000",
        "user_id": "test_evo_user",
    }

    # Clean up test database records
    commit_ids = [
        c.id
        for c in db_session.query(CommitSnapshot)
        .filter(CommitSnapshot.repository_id == repo_id)
        .all()
    ]
    if commit_ids:
        db_session.query(ComponentSnapshot).filter(
            ComponentSnapshot.commit_snapshot_id.in_(commit_ids)
        ).delete(synchronize_session=False)
    db_session.query(CommitSnapshot).filter(
        CommitSnapshot.repository_id == repo_id
    ).delete()
    db_session.query(Repository).filter(Repository.id == repo_id).delete()
    db_session.query(User).filter(User.id == "test_evo_user").delete()
    db_session.commit()


def test_evolution_timeline_api(setup_test_data):
    from app.api.v1.auth import get_current_user

    client = TestClient(app)

    # Mock user auth dependency
    def mock_get_current_user():
        db = SessionLocal()
        try:
            return db.query(User).filter(User.id == setup_test_data["user_id"]).first()
        finally:
            db.close()

    app.dependency_overrides[get_current_user] = mock_get_current_user

    repo_id = setup_test_data["repo_id"]

    # 1. Test timeline endpoint
    res = client.get(f"/api/v1/repositories/{repo_id}/evolution/timeline")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2
    assert data[0]["commit_sha"] == setup_test_data["base_sha"]
    assert data[0]["health_score"] == 85.0
    assert data[0]["maintainability_index"] == 80.0
    assert data[0]["average_function_size"] == 20.0
    assert data[1]["commit_sha"] == setup_test_data["head_sha"]
    assert data[1]["health_score"] == 65.0
    assert data[1]["maintainability_index"] == 60.0

    # 2. Test components list endpoint
    res = client.get(f"/api/v1/repositories/{repo_id}/evolution/components?path=auth")
    assert res.status_code == 200
    comp_data = res.json()
    assert len(comp_data) == 2
    assert comp_data[0]["complexity_total"] == 5
    assert comp_data[1]["complexity_total"] == 20

    # 3. Test diff endpoint
    base_sha = setup_test_data["base_sha"]
    head_sha = setup_test_data["head_sha"]
    res = client.get(
        f"/api/v1/repositories/{repo_id}/evolution/diff?base_sha={base_sha}&head_sha={head_sha}"
    )
    assert res.status_code == 200
    diff_data = res.json()
    assert diff_data["code_lines_diff"] == 350
    assert diff_data["complexity_total_diff"] == 20
    assert diff_data["dependencies_count_diff"] == 15
    assert len(diff_data["added_components"]) == 1
    assert diff_data["added_components"][0]["path"] == "payment"
    assert len(diff_data["changed_components"]) == 1
    assert diff_data["changed_components"][0]["path"] == "auth"
    assert len(diff_data["evolution_highlights"]) > 0
    assert diff_data["debt_hike_reason"] is not None
    assert "health score dropped" in diff_data["debt_hike_reason"].lower()

    # 4. Test anomalies endpoint
    res = client.get(f"/api/v1/repositories/{repo_id}/evolution/anomalies")
    assert res.status_code == 200
    anom_data = res.json()
    # Check that anomalies were detected (dependency explosion, and auth technical debt spike)
    assert len(anom_data) >= 2
    metrics = [a["metric_name"] for a in anom_data]
    assert "dependencies" in metrics
    assert "tech_debt" in metrics

    # 5. Test graph endpoint (Phase 7)
    res = client.get(
        f"/api/v1/repositories/{repo_id}/evolution/graph?commit_sha={head_sha}"
    )
    assert res.status_code == 200
    graph_json = res.json()
    assert "nodes" in graph_json
    assert len(graph_json["nodes"]) == 3
    assert len(graph_json["edges"]) == 2

    # 6. Test drifts endpoint (Phase 7)
    res = client.get(f"/api/v1/repositories/{repo_id}/evolution/drifts")
    assert res.status_code == 200
    drifts_data = res.json()
    assert len(drifts_data) > 0
    drift_types = [d["type"] for d in drifts_data]
    assert "layer_violation" in drift_types
    assert "domain_leakage" in drift_types
    assert any(d["commit_sha"] == head_sha for d in drifts_data)

    # 7. Test engineering-timeline endpoint (Phase 7 - Features 7 & 8)
    res = client.get(f"/api/v1/repositories/{repo_id}/evolution/engineering-timeline")
    assert res.status_code == 200
    timeline_events = res.json()
    assert len(timeline_events) > 0
    event_types = [t["type"] for t in timeline_events]
    assert "commit" in event_types
    assert "adr" in event_types
    assert "release" in event_types
    assert "refactor" in event_types
    assert "infrastructure" in event_types
    assert "service" in event_types

    # 8. Test AI Summary endpoint (Phase 7 - Feature 9)
    res = client.get(
        f"/api/v1/repositories/{repo_id}/evolution/ai-summary?base_sha={base_sha}&head_sha={head_sha}"
    )
    assert res.status_code == 200
    ai_summary = res.json()
    assert "summary_bullets" in ai_summary
    assert len(ai_summary["summary_bullets"]) > 0
    bullets = ai_summary["summary_bullets"]
    assert any("health" in b.lower() or "health score" in b.lower() for b in bullets)
    assert any("complexity" in b.lower() for b in bullets)

    # 9. Test AI Insights endpoint (Phase 7 - Feature 12)
    res = client.get(f"/api/v1/repositories/{repo_id}/evolution/insights")
    assert res.status_code == 200
    insights = res.json()
    assert "largest_arch_change" in insights
    assert "most_impactful_release" in insights
    assert "biggest_refactoring" in insights
    assert "most_stable_module" in insights
    assert "fastest_growing_service" in insights
    assert "most_frequently_modified_api" in insights

    # 10. Test Analytics algorithms endpoint (LCS, change points, community shifts, trend slopes)
    res = client.get(f"/api/v1/repositories/{repo_id}/evolution/analytics")
    assert res.status_code == 200
    analytics = res.json()
    assert "longest_common_subgraph" in analytics
    assert "change_points" in analytics
    assert "community_evolution" in analytics
    assert "trend_slopes" in analytics

    lcs_val = analytics["longest_common_subgraph"]
    assert "nodes" in lcs_val
    assert "edges" in lcs_val

    # Reset overrides
    app.dependency_overrides.pop(get_current_user, None)
