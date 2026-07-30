# tests/test_council.py

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.database import Base, SessionLocal, engine
from app.main import app
from app.models.repository import Repository
from app.models.repository_statistics import RepositoryStatistics
from app.models.user import User
from fastapi.testclient import TestClient


def setup_mock_data():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        user_id = "test_council_user_id"
        repo_id = "test_council_repo_id"

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            user = User(
                id=user_id,
                email="council_test@example.com",
                username="council_test",
                name="Council Tester",
            )
            db.add(user)
            db.commit()

        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if not repo:
            repo = Repository(
                id=repo_id,
                name="test-council-repo",
                full_name="example/test-council-repo",
                user_id=user_id,
                clone_url="https://github.com/example/test-council-repo",
            )
            db.add(repo)
            db.commit()

        stats = (
            db.query(RepositoryStatistics)
            .filter(RepositoryStatistics.id == "test_stats_id")
            .first()
        )
        if not stats:
            stats = RepositoryStatistics(
                id="test_stats_id",
                repository_id=repo_id,
                total_files=35,
                total_lines=2800,
                average_complexity=5.2,
                documentation_coverage=82.0,
            )
            db.add(stats)
            db.commit()

        return repo_id
    finally:
        db.close()


def mock_get_current_user():
    return User(
        id="test_council_user_id",
        username="council_test",
        name="Council Tester",
        email="council_test@example.com",
    )


app.dependency_overrides[get_current_user] = mock_get_current_user
client = TestClient(app)


def test_council_personas_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/personas")
    assert res.status_code == 200
    data = res.json()
    assert data["total_personas"] == 10
    assert len(data["personas"]) == 10


def test_council_deliberate_endpoint():
    repo_id = setup_mock_data()

    payload = {
        "question": "How do we reduce deployment time from 45 minutes to under 15 minutes?",
        "priority_focus": "velocity",
    }

    res = client.post(
        f"/api/v1/repositories/{repo_id}/council/deliberate",
        json=payload,
    )
    assert res.status_code == 200
    data = res.json()
    assert "consensus_score" in data
    assert data["vote_distribution"]["total_members"] == 10
    assert len(data["council_personas"]) == 10
    assert len(data["debate_transcript"]) > 0
    assert len(data["tradeoff_matrix"]) > 0
    assert "final_decision" in data
    assert "verdict_title" in data["final_decision"]


def test_cto_review_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/cto-review")
    assert res.status_code == 200
    data = res.json()
    assert data["agent"] == "AI CTO"
    assert "long_term_architecture" in data
    assert "roi_analysis" in data
    assert "growth_planning" in data


def test_staff_engineer_review_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/staff-engineer-review")
    assert res.status_code == 200
    data = res.json()
    assert data["agent"] == "AI Staff Engineer"
    assert "code_quality_audit" in data
    assert "design_patterns" in data
    assert "refactoring_blueprint" in data


def test_security_review_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/security-review")
    assert res.status_code == 200
    data = res.json()
    assert data["agent"] == "AI Security Engineer"
    assert "vulnerability_summary" in data
    assert "owasp_compliance" in data


def test_performance_review_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/performance-review")
    assert res.status_code == 200
    data = res.json()
    assert data["agent"] == "AI Performance Engineer"
    assert "latency_metrics" in data
    assert "caching_analysis" in data


def test_sre_review_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/sre-review")
    assert res.status_code == 200
    data = res.json()
    assert data["agent"] == "AI SRE Lead"
    assert "sla_slo_metrics" in data
    assert "disaster_recovery" in data


def test_qa_review_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/qa-review")
    assert res.status_code == 200
    data = res.json()
    assert data["agent"] == "AI QA Lead"
    assert "test_plans" in data
    assert "missing_tests" in data


def test_cloud_architect_review_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/cloud-architect-review")
    assert res.status_code == 200
    data = res.json()
    assert data["agent"] == "AI Cloud Architect"
    assert "kubernetes_config" in data
    assert "autoscaling_policy" in data


def test_database_architect_review_endpoint():
    repo_id = setup_mock_data()

    res = client.get(
        f"/api/v1/repositories/{repo_id}/council/database-architect-review"
    )
    assert res.status_code == 200
    data = res.json()
    assert data["agent"] == "AI Database Architect"
    assert "schema_design" in data
    assert "indexes_optimization" in data


def test_product_architect_review_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/product-architect-review")
    assert res.status_code == 200
    data = res.json()
    assert data["agent"] == "AI Product Architect"
    assert "customer_impact" in data
    assert "product_goals_alignment" in data


def test_save_and_get_decision_memory():
    repo_id = setup_mock_data()

    save_res = client.post(
        f"/api/v1/repositories/{repo_id}/council/memory",
        json={
            "recommendation_id": "rec-test-1",
            "recommendation_title": "Deploy Redis In-Memory Caching",
            "status": "Accepted",
            "why": "High latency drop",
            "confidence_score": 95.0,
        },
    )
    assert save_res.status_code == 200
    m_data = save_res.json()
    assert m_data["status"] == "Accepted"
    memory_id = m_data["id"]

    get_res = client.get(f"/api/v1/repositories/{repo_id}/council/memory")
    assert get_res.status_code == 200
    history = get_res.json()
    assert len(history) > 0
    assert history[0]["recommendation_id"] == "rec-test-1"

    # Test Learning Engine evaluation
    learn_res = client.post(
        f"/api/v1/repositories/{repo_id}/council/learn",
        json={
            "memory_id": memory_id,
            "actual_outcome": {"actual_latency_reduction_pct": 43.5},
        },
    )
    assert learn_res.status_code == 200
    l_data = learn_res.json()
    assert "accuracy_score" in l_data
    assert "learning_feedback" in l_data


def test_simulate_engineering_change():
    repo_id = setup_mock_data()

    res = client.post(
        f"/api/v1/repositories/{repo_id}/council/simulate",
        json={"proposal": "Deploy Redis caching and session encryption"},
    )
    assert res.status_code == 200
    data = res.json()
    assert "baseline_metrics" in data
    assert "simulated_after_metrics" in data
    assert "metric_deltas" in data
    assert len(data["persona_predictions"]) == 10


def test_architecture_meeting_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/meeting")
    assert res.status_code == 200
    data = res.json()
    assert "agenda" in data
    assert "risks_discussed" in data
    assert "decisions_made" in data
    assert "action_items" in data


def test_cross_agent_conflicts_endpoint():
    repo_id = setup_mock_data()

    res = client.get(f"/api/v1/repositories/{repo_id}/council/conflicts")
    assert res.status_code == 200
    data = res.json()
    assert data["detected_conflicts_count"] > 0
    assert len(data["conflicts"]) > 0


def test_external_decision_api():
    repo_id = setup_mock_data()

    res = client.post(
        "/api/v1/external/council/decisions",
        json={
            "repository_id": repo_id,
            "question": "External CI pipeline checking caching proposal",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SUCCESS"
    assert "consensus_score" in data
    assert "recommended_verdict" in data
