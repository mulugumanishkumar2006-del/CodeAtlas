# tests/test_ai_cto.py

import os
import sys

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.database import Base, SessionLocal, engine
from app.main import app
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.repository import Repository
from app.models.repository_statistics import RepositoryStatistics
from app.models.user import User
from fastapi.testclient import TestClient


def setup_mock_data():

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        user_id = "test_cto_user_id"
        repo_id = "test_cto_repo_id"

        # Create User
        user = User(
            id=user_id,
            username="cto_tester",
            name="CTO Tester",
            email="cto@example.com",
        )
        db.add(user)
        db.commit()

        # Create Repository
        repo = Repository(
            id=repo_id,
            name="cto-test-repo",
            full_name="tester/cto-test-repo",
            clone_url="https://github.com/tester/cto-test-repo.git",
            status="cloned",
            user_id=user_id,
        )
        db.add(repo)
        db.commit()

        # Create Stats
        stats = RepositoryStatistics(
            id="stats_001",
            repository_id=repo_id,
            total_files=25,
            total_lines=1500,
            total_code_lines=1200,
            total_comment_lines=100,
            total_blank_lines=200,
            total_size_bytes=45000,
            total_complexity=80.0,
            average_complexity=6.2,
            documentation_coverage=85.0,
            languages={"python": 0.8, "javascript": 0.2},
            entity_statistics={"file": 25, "class": 5},
        )
        db.add(stats)
        db.commit()

        # Create Nodes: API Route and DB Table
        api_node = GraphNode(
            id="node_api_cto",
            repository_id=repo_id,
            type="API Endpoint",
            name="/users",
            properties={"path": "app/main.py"},
        )
        db_node = GraphNode(
            id="node_db_cto",
            repository_id=repo_id,
            type="Database_Table",
            name="users_table",
            properties={"path": "app/models/user.py"},
        )
        db.add(api_node)
        db.add(db_node)
        db.commit()

        # Create a Direct database query relationship (bottleneck)
        rel = GraphRelationship(
            id="rel_direct_cto",
            repository_id=repo_id,
            source_id="node_api_cto",
            target_id="node_db_cto",
            type="DIRECT_QUERY",
            properties={},
        )
        db.add(rel)
        db.commit()

    finally:
        db.close()


def test_cto_strategic_analysis_suite():
    setup_mock_data()

    client = TestClient(app)

    # Override auth helper
    def override_get_current_user():
        test_db = SessionLocal()
        try:
            return test_db.query(User).filter(User.id == "test_cto_user_id").first()
        finally:
            test_db.close()

    app.dependency_overrides[get_current_user] = override_get_current_user

    repo_id = "test_cto_repo_id"

    try:
        # 1. Test POST /repositories/{repo_id}/cto/analyze
        payload = {
            "target_users": 50000,
            "target_requests_per_sec": 500,
            "migration_target": "serverless",
            "budget_reduction_pct": 15.0,
        }
        res = client.post(f"/api/v1/repositories/{repo_id}/cto/analyze", json=payload)
        assert res.status_code == 200
        data = res.json()

        assert data["repository_id"] == repo_id
        assert data["goals"]["target_users"] == 50000
        assert data["goals"]["target_requests_per_sec"] == 500
        assert data["growth_projections"]["growth_rate_pct"] == 25.0
        assert data["roi_analysis"]["implementation_cost_hours"] > 0
        assert data["capacity_planning"]["proposed_concurrency_workers"] == 10
        assert len(data["costs"]) > 0
        assert len(data["hiring"]) > 0
        assert len(data["risks"]) > 0
        assert len(data["roadmap"]["milestones"]) > 0
        assert "mile_001" in [m["id"] for m in data["roadmap"]["milestones"]]
        assert data["executive_report"]["projected_budget_impact_usd"] < 0
        assert len(data["engineering_report"]["architectural_standards"]) > 0
        assert len(data["engineering_report"]["multi_year_vision"]) > 0
        assert len(data["engineering_report"]["innovation_opportunities"]) > 0
        assert len(data["engineering_report"]["explainable_recommendations"]) > 0

        # 2. Test GET /repositories/{repo_id}/cto/roadmap
        res = client.get(f"/api/v1/repositories/{repo_id}/cto/roadmap")
        assert res.status_code == 200
        roadmap = res.json()
        assert roadmap["repository_id"] == repo_id
        assert len(roadmap["milestones"]) > 0

        # 3. Test GET /repositories/{repo_id}/cto/costs
        res = client.get(f"/api/v1/repositories/{repo_id}/cto/costs")
        assert res.status_code == 200
        costs = res.json()
        assert len(costs) > 0
        assert costs[0]["current_cost_usd"] > costs[0]["proposed_cost_usd"]

        # 4. Test GET /repositories/{repo_id}/cto/risks
        res = client.get(f"/api/v1/repositories/{repo_id}/cto/risks")
        assert res.status_code == 200
        risks = res.json()
        assert len(risks) > 0

        # 5. Test POST /repositories/{repo_id}/cto/chat (Feature 28)
        res = client.post(
            f"/api/v1/repositories/{repo_id}/cto/chat",
            json={"message": "How do we reduce deployment time?"},
        )
        assert res.status_code == 200
        chat_res = res.json()
        assert "reply" in chat_res
        assert len(chat_res["actionable_steps"]) > 0

        # 6. Test GET /repositories/{repo_id}/cto/history (Feature 29)
        res = client.get(f"/api/v1/repositories/{repo_id}/cto/history")
        assert res.status_code == 200
        history_list = res.json()
        assert len(history_list) > 0

        # 7. Test GET /repositories/{repo_id}/cto/history/compare (Feature 29)
        res = client.get(f"/api/v1/repositories/{repo_id}/cto/history/compare")
        assert res.status_code == 200
        compare_res = res.json()
        assert "latest_version" in compare_res

        # 8. Test POST /repositories/{repo_id}/cto/continuous-reevaluate (Feature 30)
        res = client.post(f"/api/v1/repositories/{repo_id}/cto/continuous-reevaluate")
        assert res.status_code == 200
        cont_res = res.json()
        assert cont_res["status"] == "success"
        assert len(cont_res["pipeline_logs"]) > 0

    finally:
        app.dependency_overrides.clear()
