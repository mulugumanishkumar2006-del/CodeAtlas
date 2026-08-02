# tests/test_ai_cto.py

import os
import sys

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.database import Base, engine, get_db
from app.main import app
from app.models.cto_strategy_history import CTOStrategyHistory  # noqa
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.repository import Repository
from app.models.repository_statistics import RepositoryStatistics
from app.models.user import User
from fastapi.testclient import TestClient

Base.metadata.create_all(bind=engine)


def mock_get_current_user():
    db = next(get_db())
    try:
        user = db.query(User).filter(User.id == "test_cto_user_id").first()
        if not user:
            user = User(
                id="test_cto_user_id",
                username="cto_tester",
                name="CTO Tester",
                email="cto@example.com",
            )
            db.add(user)
            db.commit()
        return user
    finally:
        db.close()


app.dependency_overrides[get_current_user] = mock_get_current_user
client = TestClient(app)


def setup_mock_data():
    db = next(get_db())
    try:
        user_id = "test_cto_user_id"
        repo_id = "test_cto_repo_id"

        # Check existing user
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            user = User(
                id=user_id,
                username="cto_tester",
                name="CTO Tester",
                email="cto@example.com",
            )
            db.add(user)

        # Check existing repo
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if not repo:
            repo = Repository(
                id=repo_id,
                name="CTO Test Repo",
                full_name="cto/test_repo",
                clone_url="https://github.com/cto/test_repo.git",
                user_id=user_id,
            )
            db.add(repo)

        # Check existing stats
        stats = (
            db.query(RepositoryStatistics)
            .filter(RepositoryStatistics.id == "stats_001")
            .first()
        )
        if not stats:
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

        # Check existing nodes
        api_node = db.query(GraphNode).filter(GraphNode.id == "node_api_cto").first()
        if not api_node:
            api_node = GraphNode(
                id="node_api_cto",
                repository_id=repo_id,
                type="API Endpoint",
                name="/users",
                properties={"path": "app/main.py"},
            )
            db.add(api_node)

        db_node = db.query(GraphNode).filter(GraphNode.id == "node_db_cto").first()
        if not db_node:
            db_node = GraphNode(
                id="node_db_cto",
                repository_id=repo_id,
                type="Database_Table",
                name="users_table",
                properties={"path": "app/models/user.py"},
            )
            db.add(db_node)

        # Check existing relationship
        rel = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.id == "rel_direct_cto")
            .first()
        )
        if not rel:
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
    repo_id = "test_cto_repo_id"

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
    comp = res.json()
    assert "latest_version" in comp
    assert "health_score_delta" in comp

    # 8. Test POST /repositories/{repo_id}/cto/continuous-reevaluate (Feature 30)
    res = client.post(f"/api/v1/repositories/{repo_id}/cto/continuous-reevaluate")
    assert res.status_code == 200
    reeval = res.json()
    assert reeval["status"] == "success"
    assert len(reeval["pipeline_logs"]) >= 4

    # 9. Test Phase 39 Strategic Decisions embedded in analysis
    assert "strategic_decisions" in data
    sd = data["strategic_decisions"]
    assert "scaling_100m" in sd
    assert "technology_replacement" in sd
    assert "kubernetes_adoption" in sd
    assert "team_allocation" in sd
    assert "investment_planning" in sd
    assert "microservices_migration" in sd
    assert "tech_debt_budget" in sd
    assert "five_year_vision" in sd

    # 10. Test GET /repositories/{repo_id}/cto/strategic-decisions (Phase 39)
    res = client.get(f"/api/v1/repositories/{repo_id}/cto/strategic-decisions")
    assert res.status_code == 200
    strat_data = res.json()
    assert "scaling_100m" in strat_data
    assert (
        strat_data["scaling_100m"]["question"]
        == "Can our architecture handle 100 million users?"
    )
    assert len(strat_data["technology_replacement"]["technologies_to_replace"]) > 0
    assert "should_adopt" in strat_data["kubernetes_adoption"]

    # 11. Test POST /repositories/{repo_id}/cto/simulate-scale (Phase 39)
    res = client.post(
        f"/api/v1/repositories/{repo_id}/cto/simulate-scale",
        json={"target_users": 100000000, "target_requests_per_sec": 50000},
    )
    assert res.status_code == 200
    sim_res = res.json()
    assert sim_res["goals"]["target_users"] == 100000000
    assert "scenario_simulation" in sim_res
    assert "scaling_100m_analysis" in sim_res

    # 12. Test Feature 1: Enhanced AI CTO Chat with structured 50M scaling details
    res = client.post(
        f"/api/v1/repositories/{repo_id}/cto/chat",
        json={"message": "How should we prepare our platform for 50 million users?"},
    )
    assert res.status_code == 200
    chat_50m = res.json()
    assert "structured_details" in chat_50m
    assert len(chat_50m["structured_details"]["infra_recommendations"]) > 0

    # 13. Test Feature 2: GET /repositories/{repo_id}/cto/engineering-strategy
    res = client.get(f"/api/v1/repositories/{repo_id}/cto/engineering-strategy")
    assert res.status_code == 200
    strat_res = res.json()
    assert "strategy_1_year" in strat_res
    assert "strategy_3_year" in strat_res
    assert "strategy_5_year" in strat_res

    # 14. Test Feature 3: GET /repositories/{repo_id}/cto/engineering-vision-2030
    res = client.get(f"/api/v1/repositories/{repo_id}/cto/engineering-vision-2030")
    assert res.status_code == 200
    vis_res = res.json()
    assert vis_res["title"] == "CodeAtlas Engineering Vision 2030"
    assert "pillars" in vis_res

    # 15. Test Feature 5: POST /repositories/{repo_id}/cto/strategic-advisor
    res = client.post(
        f"/api/v1/repositories/{repo_id}/cto/strategic-advisor",
        json={"decision_key": "monolith_vs_microservices"},
    )
    assert res.status_code == 200
    trade_res = res.json()
    assert "decision" in trade_res
    assert len(trade_res["tradeoffs"]) > 0

    # 16. Test Features 6–25: GET /repositories/{repo_id}/cto/technology-intelligence
    res = client.get(f"/api/v1/repositories/{repo_id}/cto/technology-intelligence")
    assert res.status_code == 200
    intel_res = res.json()
    assert "technology_lifecycle" in intel_res
    assert "framework_replacement" in intel_res
    assert "language_migration" in intel_res
    assert "cloud_strategy" in intel_res
    assert "ai_adoption" in intel_res
    assert "security_roadmap" in intel_res

    # 17. Test Features 26–50: GET /repositories/{repo_id}/cto/growth-intelligence
    res = client.get(f"/api/v1/repositories/{repo_id}/cto/growth-intelligence")
    assert res.status_code == 200
    growth_res = res.json()
    assert "team_scaling_planner" in growth_res
    assert "hiring_recommendations" in growth_res
    assert "skill_gap_analysis" in growth_res
    assert "productivity_forecasting" in growth_res
    assert "burnout_risk_indicators" in growth_res
    assert "global_engineering_score" in growth_res
    assert "strategic_okrs" in growth_res

    # 18. Test Features 51–75: GET /repositories/{repo_id}/cto/engineering-economics
    res = client.get(f"/api/v1/repositories/{repo_id}/cto/engineering-economics")
    assert res.status_code == 200
    econ_res = res.json()
    assert "engineering_roi" in econ_res
    assert "technical_debt_cost" in econ_res
    assert "cloud_cost_forecasting" in econ_res
    assert "finops_recommendations" in econ_res
    assert "cloud_waste_detection" in econ_res
    assert "carbon_footprint" in econ_res
    assert "investment_confidence_score" in econ_res

    # 19. Test Features 76–100: GET /repositories/{repo_id}/cto/future-intelligence
    res = client.get(f"/api/v1/repositories/{repo_id}/cto/future-intelligence")
    assert res.status_code == 200
    fut_res = res.json()
    assert "ten_year_architecture_forecast" in fut_res
    assert "technology_trend_prediction" in fut_res
    assert "future_skill_demand" in fut_res
    assert "ai_native_architecture" in fut_res
    assert "engineering_resilience_score" in fut_res
    assert "cto_strategic_memory" in fut_res

    # 20. Test Features 101–119: GET /repositories/{repo_id}/cto/global-executive
    res = client.get(f"/api/v1/repositories/{repo_id}/cto/global-executive")
    assert res.status_code == 200
    exec_res = res.json()
    assert "board_meeting_report" in exec_res
    assert "cto_weekly_brief" in exec_res
    assert "technology_radar" in exec_res
    assert "enterprise_risk_matrix" in exec_res
    assert "engineering_war_room" in exec_res
    assert "digital_cto_command_center" in exec_res

    # 21. Test Signature Feature 120: POST /repositories/{repo_id}/cto/digital-command-center
    res = client.post(
        f"/api/v1/repositories/{repo_id}/cto/digital-command-center",
        json={
            "query_prompt": "Our company expects to grow from 1 million to 100 million users over the next five years. What should we do?"
        },
    )
    assert res.status_code == 200
    cmd_res = res.json()
    assert cmd_res["current_architecture"] == "Modular Monolith"
    assert cmd_res["health_score_pct"] == 82
    assert len(cmd_res["recommended_roadmap"]) == 5
    assert cmd_res["estimated_cost_usd_formatted"] == "$8.2M"
    assert cmd_res["engineering_effort_months"] == 145
    assert "99.99% Availability" in cmd_res["expected_benefits"]
    assert "60% Faster Deployments" in cmd_res["expected_benefits"]
    assert "40% Lower Technical Debt" in cmd_res["expected_benefits"]
    assert "3× Scalability" in cmd_res["expected_benefits"]
    assert cmd_res["confidence_score_pct"] == 94
