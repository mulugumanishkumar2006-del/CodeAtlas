import os
import sys

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.database import Base, SessionLocal, engine
from app.main import app
from app.models.digital_twin import DigitalTwinChange, DigitalTwinSession
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.repository import Repository
from app.models.tech_debt import TechnicalDebtReport
from app.models.user import User
from fastapi.testclient import TestClient


def setup_mock_data():

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create mock user
        user = db.query(User).filter(User.id == "12345").first()
        if not user:
            user = User(
                id="12345",
                username="test_user",
                name="Test User",
                email="test@example.com",
            )
            db.add(user)
            db.commit()

        # Clean up existing records
        repo_id = "test_twin_repo_id"
        db.query(DigitalTwinChange).filter(
            DigitalTwinChange.session_id.in_(
                db.query(DigitalTwinSession.id).filter(
                    DigitalTwinSession.repository_id == repo_id
                )
            )
        ).delete(synchronize_session=False)
        db.query(DigitalTwinSession).filter(
            DigitalTwinSession.repository_id == repo_id
        ).delete()
        db.query(GraphRelationship).filter(
            GraphRelationship.repository_id == repo_id
        ).delete()
        db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
        db.query(TechnicalDebtReport).filter(
            TechnicalDebtReport.repo_id == repo_id
        ).delete()
        db.query(Repository).filter(Repository.id == repo_id).delete()
        db.commit()

        # Create mock repository
        repo = Repository(
            id=repo_id,
            name="test-twin-repo",
            full_name="test/test-twin-repo",
            clone_url="https://github.com/test/test-twin-repo.git",
            status="cloned",
            user_id="12345",
        )
        db.add(repo)
        db.commit()

        # Setup mock Technical Debt Report
        td = TechnicalDebtReport(
            repo_id=repo_id,
            module="user_service.py",
            debt_score=15.0,
            risk_level="MEDIUM",
        )
        db.add(td)
        db.commit()

        # Create graph nodes: files, functions, api, test, database
        n1 = GraphNode(
            id="n1",
            repository_id=repo_id,
            type="File",
            name="user_service.py",
            properties={"path": "user_service.py"},
        )
        n2 = GraphNode(
            id="n2",
            repository_id=repo_id,
            type="Function",
            name="get_user",
            properties={"file_id": "n1"},
        )
        n3 = GraphNode(
            id="n3",
            repository_id=repo_id,
            type="File",
            name="user_controller.py",
            properties={"path": "user_controller.py"},
        )
        n4 = GraphNode(
            id="n4",
            repository_id=repo_id,
            type="Function",
            name="show_user_profile",
            properties={"file_id": "n3"},
        )
        n5 = GraphNode(
            id="n5",
            repository_id=repo_id,
            type="API Endpoint",
            name="GET /api/users/{id}",
            properties={"path": "/api/users/{id}"},
        )
        n6 = GraphNode(
            id="n6",
            repository_id=repo_id,
            type="File",
            name="user_test.py",
            properties={"path": "user_test.py"},
        )
        n7 = GraphNode(
            id="n7",
            repository_id=repo_id,
            type="Function",
            name="test_get_user",
            properties={"file_id": "n6"},
        )
        n8 = GraphNode(
            id="n8",
            repository_id=repo_id,
            type="Database Table",
            name="users",
            properties={"path": "models/users.py"},
        )

        db.add_all([n1, n2, n3, n4, n5, n6, n7, n8])
        db.commit()

        # Create relationships:
        r1 = GraphRelationship(
            id="r1",
            repository_id=repo_id,
            source_id="n3",
            target_id="n1",
            type="IMPORTS",
        )
        r2 = GraphRelationship(
            id="r2", repository_id=repo_id, source_id="n4", target_id="n2", type="CALLS"
        )
        r3 = GraphRelationship(
            id="r3",
            repository_id=repo_id,
            source_id="n5",
            target_id="n4",
            type="ROUTES_TO",
        )
        r4 = GraphRelationship(
            id="r4", repository_id=repo_id, source_id="n7", target_id="n2", type="CALLS"
        )
        # get_user queries database users table
        r5 = GraphRelationship(
            id="r5",
            repository_id=repo_id,
            source_id="n2",
            target_id="n8",
            type="QUERIES",
        )

        db.add_all([r1, r2, r3, r4, r5])
        db.commit()

    finally:
        db.close()


def test_digital_twin_endpoints():
    setup_mock_data()
    client = TestClient(app)

    def override_get_current_user():
        db = SessionLocal()
        try:
            return db.query(User).filter(User.id == "12345").first()
        finally:
            db.close()

    app.dependency_overrides[get_current_user] = override_get_current_user

    repo_id = "test_twin_repo_id"

    # 1. Create session
    print("=== Testing POST /repositories/{repo_id}/digital-twin/sessions ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions",
        json={"name": "Refactoring Simulation Run"},
    )
    assert response.status_code == 201
    session_data = response.json()
    session_id = session_data["id"]
    print(f"Created session ID: {session_id}")

    # 2. Add change (Delete users database table)
    print("=== Add virtual DB Table delete ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions/{session_id}/changes",
        json={
            "action": "delete",
            "target_type": "database",
            "target_name": "users",
        },
    )
    assert response.status_code == 201

    # 3. Simulate Database Drop
    print("=== Simulate Database Drop ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions/{session_id}/simulate"
    )
    assert response.status_code == 200
    report = response.json()
    print("Simulation report (DB Drop):")
    print(report["affected_counts"])

    # Assert database drop cascaded correctly
    counts = report["affected_counts"]
    assert (
        counts["databases"] == 0
    )  # users table was deleted starting node, not counted as transitively affected
    assert counts["functions"] >= 2  # get_user, show_user_profile
    assert counts["apis"] >= 1  # GET /api/users/{id}
    assert counts["tests"] >= 1  # test_get_user
    assert counts["ci_pipelines"] >= 1  # broken tests cascade to CI yaml workflows
    assert report["architecture_compliance_score"] == 100.0
    assert (
        report["estimated_failure_probability"] > 30.0
    )  # Failure probability is calculated

    # Assert blast radius node structure
    blast_nodes = report["blast_radius_nodes"]
    assert len(blast_nodes) > 0
    # core changed node has depth 0
    assert any(bn["depth"] == 0 for bn in blast_nodes)
    # downstream impacted nodes have depth 1 or 2
    assert any(bn["depth"] in (1, 2) for bn in blast_nodes)

    # Assert Risk predictions list
    risks = report["risk_predictions"]
    assert len(risks) == 7
    assert any(r["type"] == "Runtime Failures" for r in risks)
    assert any(r["type"] == "Security Impact" for r in risks)

    # Assert Cost estimations
    cost = report["cost_estimate"]
    assert cost is not None
    assert cost["developer_hours"] > 0.0
    assert cost["rollback_cost_index"] > 0.0

    # Assert Performance Predictions
    perf = report["performance_impact"]
    assert perf is not None
    assert perf["latency_change_ms"] >= 0.0
    assert perf["memory_change_mb"] >= 0.0

    # Assert Architecture Evolution Predictions
    evol = report["architecture_evolution"]
    assert evol is not None
    assert evol["compliance_before"] >= evol["compliance_after"]
    assert evol["tech_debt_before"] > 0.0

    # Assert AI alternative recommendations
    alts = report["ai_alternative_recommendations"]
    assert len(alts) > 0
    assert any(
        "deleting" in a["original_action"].lower()
        or "dropping" in a["original_action"].lower()
        or "no high-risk" in a["original_action"].lower()
        for a in alts
    )

    # Assert Simulation Timeline Replay
    timeline = report["simulation_timeline"]
    assert len(timeline) >= 2
    assert timeline[0]["step_number"] == 0
    assert timeline[0]["change_summary"] == "Baseline (Initial Repository State)"
    assert timeline[1]["step_number"] == 1

    # 4. Add technical debt reduction change (Delete user_service.py file)
    print("=== Add user_service.py delete ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions/{session_id}/changes",
        json={
            "action": "delete",
            "target_type": "file",
            "target_name": "user_service.py",
        },
    )
    assert response.status_code == 201

    # 5. Simulate File Deletion (verifying Tech Debt Sync)
    print("=== Simulate File Deletion ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions/{session_id}/simulate"
    )
    assert response.status_code == 200
    report = response.json()
    print("Simulation report (File Deletion Tech Debt change):")
    print(f"Tech Debt Change: {report['tech_debt_score_change']}")
    assert report["tech_debt_score_change"] == -15.0  # Reduction of 15.0 score

    # 6. Create session2 for testing Layer Violations
    print(
        "=== Testing POST /repositories/{repo_id}/digital-twin/sessions (Session 2) ==="
    )
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions",
        json={"name": "Compliance Rules Session"},
    )
    assert response.status_code == 201
    session2_id = response.json()["id"]

    print("=== Add illegal layer dependency (n5 routes_to n8 API -> DB directly) ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions/{session2_id}/changes",
        json={
            "action": "add_dependency",
            "target_type": "relationship",
            "target_name": "GET /api/users/{id}",
            "new_name": "users",
        },
    )
    assert response.status_code == 201

    # 7. Simulate Architecture Compliance on Session 2
    print("=== Simulate Layer Violation ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions/{session2_id}/simulate"
    )
    assert response.status_code == 200
    report = response.json()
    print(f"Compliance: {report['architecture_compliance_score']}%")
    print(f"Violations: {report['rules_violated']}")
    assert report["architecture_compliance_score"] < 100.0
    # 7.5. Test Scenario Comparison
    print("=== Test Scenario Comparison ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/compare",
        json={
            "scenario_a_session_id": session_id,
            "scenario_b_session_id": session2_id,
        },
    )
    assert response.status_code == 200
    compare_report = response.json()
    assert "scenario_a" in compare_report
    assert "scenario_b" in compare_report
    assert "verdict" in compare_report["recommendation"].lower()
    assert compare_report["scenario_a"]["name"] == "Refactoring Simulation Run"
    assert compare_report["scenario_b"]["name"] == "Compliance Rules Session"

    # Clean up sessions
    response = client.delete(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions/{session_id}"
    )
    assert response.status_code == 200
    response = client.delete(
        f"/api/v1/repositories/{repo_id}/digital-twin/sessions/{session2_id}"
    )
    assert response.status_code == 200
    print("Deleted simulation sessions.")

    # 8. Test AI Refactoring Simulator
    print("=== Test AI Refactoring Simulator ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/ai-refactor",
        json={"refactoring_goal": "Split Payment Service"},
    )
    assert response.status_code == 200
    ai_report = response.json()
    assert ai_report["goal"] == "Split Payment Service"
    assert len(ai_report["migration_plan"]) >= 4
    assert "mermaid" in ai_report["new_architecture"]
    assert len(ai_report["new_dependencies"]) > 0
    assert len(ai_report["timeline"]) > 0
    assert "rollback" in ai_report["rollback_strategy"].lower()
    assert "maintainability" in ai_report["expected_improvement"].lower()

    # 9. Test What-If Simulator
    print("=== Test What-If Simulator ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/what-if",
        json={"scenario_type": "developer_attrition"},
    )
    assert response.status_code == 200
    what_if = response.json()
    assert "attrition" in what_if["scenario_title"].lower()
    assert what_if["impact_level"] == "HIGH"
    assert what_if["failure_probability"] == 45.0
    assert len(what_if["affected_components"]) > 0
    assert "verdict" in what_if["verdict"].lower()

    # 10. Test Incident Simulator
    print("=== Test Incident Simulator ===")
    response = client.post(
        f"/api/v1/repositories/{repo_id}/digital-twin/incident-simulate",
        json={"query": "Database unavailable"},
    )
    assert response.status_code == 200
    incident = response.json()
    assert len(incident["apis_affected"]) > 0
    assert len(incident["services_affected"]) > 0
    assert len(incident["recovery_path"]) > 0
    assert "estimated_downtime" in incident
    assert "user_impact" in incident


def main():
    print("Setting up mock database objects...")
    setup_mock_data()
    print("Starting digital twin simulation API tests...")
    test_digital_twin_endpoints()
    print("\n[SUCCESS] All Digital Twin integration tests passed successfully!")


if __name__ == "__main__":
    main()
