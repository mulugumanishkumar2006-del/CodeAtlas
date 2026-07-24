"""Unit and integration tests for the AI Software Architect services and endpoints."""

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
from app.models.user import User
from fastapi.testclient import TestClient


def test_architect_recommendations_and_advisors():
    # Ensure database tables are created cleanly

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 1. Setup mock repository ID
    repo_id = "test_architect_repo_id"
    user_id = "123456"

    # Setup database session
    db = SessionLocal()
    try:
        # Create user if not exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            user = User(
                id=user_id,
                username="architect_tester",
                name="Architect Tester",
                email="architect_tester@example.com",
            )
            db.add(user)
            db.commit()

        # Delete any previous records for this repo
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if repo:
            db.query(GraphRelationship).filter(
                GraphRelationship.repository_id == repo_id
            ).delete()
            db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
            db.delete(repo)
            db.commit()

        # Create repository
        repo = Repository(
            id=repo_id,
            name="architect-test-repo",
            full_name="tester/architect-test-repo",
            clone_url="https://github.com/tester/architect-test-repo.git",
            status="cloned",
            user_id=user_id,
        )
        db.add(repo)
        db.commit()

        # 2. Insert mock graph nodes to trigger architectural recommendations

        # Node types: api, service, database table, class, module
        api_node = GraphNode(
            id="rec_node_api",
            repository_id=repo_id,
            name="app/api/v1/payments.py",
            type="api",
            properties={"path": "apps/backend/app/api/v1/payments.py"},
        )

        db_node = GraphNode(
            id="rec_node_db",
            repository_id=repo_id,
            name="payments_table",
            type="database table",
            properties={"path": "apps/backend/app/models/payment.py"},
        )

        # God module (Split service candidate):
        # Requires fan-in >= 7 and fan-out >= 5
        god_node = GraphNode(
            id="rec_node_god",
            repository_id=repo_id,
            name="app/services/payment_service.py",
            type="service",
            properties={"path": "apps/backend/app/services/payment_service.py"},
        )

        # Add other nodes to establish high fan-in and fan-out to the God node
        other_nodes = []
        for i in range(10):
            other_nodes.append(
                GraphNode(
                    id=f"other_node_{i}",
                    repository_id=repo_id,
                    name=f"app/services/helper_{i}.py",
                    type="service",
                    properties={"path": f"apps/backend/app/services/helper_{i}.py"},
                )
            )

        # Circular dependency nodes: cycle_node_a -> cycle_node_b -> cycle_node_c -> cycle_node_a
        cycle_node_a = GraphNode(
            id="cycle::node_a",
            repository_id=repo_id,
            name="app/cycle_a.py",
            type="module",
            properties={"path": "apps/backend/app/cycle_a.py"},
        )
        cycle_node_b = GraphNode(
            id="cycle::node_b",
            repository_id=repo_id,
            name="app/cycle_b.py",
            type="module",
            properties={"path": "apps/backend/app/cycle_b.py"},
        )
        cycle_node_c = GraphNode(
            id="cycle::node_c",
            repository_id=repo_id,
            name="app/cycle_c.py",
            type="module",
            properties={"path": "apps/backend/app/cycle_c.py"},
        )

        db.add_all(
            [api_node, db_node, god_node, cycle_node_a, cycle_node_b, cycle_node_c]
            + other_nodes
        )
        db.commit()

        # 3. Add relationships to establish the coupling scenarios
        relationships = []

        # API queries DB directly (triggers Repository Pattern recommendation)
        relationships.append(
            GraphRelationship(
                id="rel_api_db",
                repository_id=repo_id,
                source_id="rec_node_api",
                target_id="rec_node_db",
                type="DIRECT_QUERY",
                properties={"label": "direct_query"},
            )
        )

        # God module incoming/outgoing relationships:
        # Fan-in >= 7 (other helpers call god_node)
        for i in range(7):
            relationships.append(
                GraphRelationship(
                    id=f"rel_fi_{i}",
                    repository_id=repo_id,
                    source_id=f"other_node_{i}",
                    target_id="rec_node_god",
                    type="CALL",
                )
            )

        # Fan-out >= 5 (god_node calls other helper nodes)
        for i in range(3, 8):
            relationships.append(
                GraphRelationship(
                    id=f"rel_fo_{i}",
                    repository_id=repo_id,
                    source_id="rec_node_god",
                    target_id=f"other_node_{i}",
                    type="CALL",
                )
            )

        # DB serving multiple consumers (triggers Add Read Replicas)
        # Needs readers >= 6. We can link 6 helper nodes to the database table
        for i in range(6):
            relationships.append(
                GraphRelationship(
                    id=f"rel_db_reader_{i}",
                    repository_id=repo_id,
                    source_id=f"other_node_{i}",
                    target_id="rec_node_db",
                    type="QUERY",
                )
            )

        # High read hotspot with no caching (triggers Add Redis Cache)
        # Service has high fan-in >= 5 (helper nodes 0-4 call helper 9)
        for i in range(5):
            relationships.append(
                GraphRelationship(
                    id=f"rel_hotspot_{i}",
                    repository_id=repo_id,
                    source_id=f"other_node_{i}",
                    target_id="other_node_9",
                    type="CALL",
                )
            )

        # Circular relationships
        relationships.append(
            GraphRelationship(
                id="rel_cycle_ab",
                repository_id=repo_id,
                source_id="cycle::node_a",
                target_id="cycle::node_b",
                type="IMPORT",
            )
        )
        relationships.append(
            GraphRelationship(
                id="rel_cycle_bc",
                repository_id=repo_id,
                source_id="cycle::node_b",
                target_id="cycle::node_c",
                type="IMPORT",
            )
        )
        relationships.append(
            GraphRelationship(
                id="rel_cycle_ca",
                repository_id=repo_id,
                source_id="cycle::node_c",
                target_id="cycle::node_a",
                type="IMPORT",
            )
        )

        db.add_all(relationships)
        db.commit()

    finally:
        db.close()

    # 4. Test endpoints using FastAPI TestClient
    client = TestClient(app)

    # Override authentication dependency to return our mock user
    def override_get_current_user():
        test_db = SessionLocal()
        try:
            return test_db.query(User).filter(User.id == user_id).first()
        finally:
            test_db.close()

    app.dependency_overrides[get_current_user] = override_get_current_user

    try:
        # Test Feature 1 & 2 API Endpoint: Architect Recommendations Report
        resp_recs = client.get(
            f"/api/v1/repositories/{repo_id}/architect/recommendations"
        )
        assert resp_recs.status_code == 200
        data_recs = resp_recs.json()
        assert data_recs["repo_id"] == repo_id
        assert data_recs["total_recommendations"] > 0

        # Assert prioritizations scores are attached and within ranges
        for r in data_recs["recommendations"]:
            assert "business_impact_score" in r
            assert "technical_impact_score" in r
            assert "risk_reduction_score" in r
            assert "engineering_effort_score" in r
            assert "health_improvement_pct" in r
            assert "composite_priority_score" in r
            assert "alternatives" in r
            assert isinstance(r["alternatives"], list)
            assert r["priority"] in [1, 2, 3, 4, 5]

        # Test Architect Summary API Endpoint
        resp_summary = client.get(f"/api/v1/repositories/{repo_id}/architect/summary")
        assert resp_summary.status_code == 200
        data_summary = resp_summary.json()
        assert data_summary["repo_id"] == repo_id
        assert (
            data_summary["total_recommendations"] == data_recs["total_recommendations"]
        )
        assert "engineering_verdict" in data_summary

        # Test Feature 3 API Endpoint: Design Pattern Advisor
        resp_patterns = client.get(f"/api/v1/repositories/{repo_id}/architect/patterns")
        assert resp_patterns.status_code == 200
        data_patterns = resp_patterns.json()
        assert data_patterns["repo_id"] == repo_id
        assert "advisories" in data_patterns

        # Check that we have advisories for patterns (we look at 11 patterns)
        advisories_names = [a["pattern_name"] for a in data_patterns["advisories"]]
        assert "Repository Pattern" in advisories_names

        # Verify structure of Pattern Advisories
        for adv in data_patterns["advisories"]:
            assert "why" in adv
            assert "benefits" in adv
            assert "drawbacks" in adv
            assert "implementation_hint" in adv

        # Test Feature 4 API Endpoint: Scalability Advisor
        resp_scalability = client.get(
            f"/api/v1/repositories/{repo_id}/architect/scalability"
        )
        assert resp_scalability.status_code == 200
        data_scalability = resp_scalability.json()
        assert data_scalability["repo_id"] == repo_id
        assert "advisories" in data_scalability

        # Check for scalability advisories (caching, replicas, load balancer, etc.)
        techniques = [a["technique"] for a in data_scalability["advisories"]]
        assert "caching" in techniques
        assert "read_replica" in techniques

        # Verify structure of Scalability Advisories
        for adv in data_scalability["advisories"]:
            assert "why" in adv
            assert "benefits" in adv
            assert "implementation_steps" in adv
            assert "estimated_improvement" in adv

        # Test Feature 5 API Endpoint: Refactoring Advisor (Module Decomposition)
        resp_refactoring = client.get(
            f"/api/v1/repositories/{repo_id}/architect/refactoring"
        )
        assert resp_refactoring.status_code == 200
        data_refactoring = resp_refactoring.json()
        assert data_refactoring["repo_id"] == repo_id
        assert "plans" in data_refactoring
        assert len(data_refactoring["plans"]) > 0

        # Verify RefactoringPlan detailed layout
        for plan in data_refactoring["plans"]:
            assert "source_module" in plan
            assert "rationale" in plan
            assert "split_into" in plan
            assert len(plan["split_into"]) > 0

            # ModuleComponents verification
            for comp in plan["split_into"]:
                assert "name" in comp
                assert "responsibility" in comp
                assert "key_responsibilities" in comp
                assert "depends_on" in comp

            # MigrationPhases verification
            assert "migration_phases" in plan
            assert len(plan["migration_phases"]) > 0
            for phase in plan["migration_phases"]:
                assert "phase" in phase
                assert "name" in phase
                assert "weeks" in phase
                assert "tasks" in phase
                assert "risk_level" in phase

            # Risks verification
            assert "risks" in plan
            assert len(plan["risks"]) > 0
            for r in plan["risks"]:
                assert "risk" in r
                assert "likelihood" in r
                assert "impact" in r
                assert "mitigation" in r

            # Expected Improvements verification
            assert "expected_improvements" in plan
            assert len(plan["expected_improvements"]) > 0
            for imp in plan["expected_improvements"]:
                assert "metric" in imp
                assert "before" in imp
                assert "after" in imp
                assert "improvement" in imp

        # Test Feature 6 API Endpoint: Coupling Reduction Advisor
        resp_coupling = client.get(f"/api/v1/repositories/{repo_id}/architect/coupling")
        assert resp_coupling.status_code == 200
        data_coupling = resp_coupling.json()
        assert data_coupling["repo_id"] == repo_id
        assert "issues" in data_coupling
        assert len(data_coupling["issues"]) > 0

        # Verify CouplingIssue detailed layout
        for issue in data_coupling["issues"]:
            assert "issue_type" in issue
            assert issue["issue_type"] in (
                "cyclic_dependency",
                "god_object",
                "high_coupling",
                "large_module",
            )
            assert "severity" in issue
            assert "precise_fix" in issue
            assert "fix_steps" in issue
            assert len(issue["fix_steps"]) > 0
            assert "before_state" in issue
            assert "after_state" in issue
            assert "estimated_effort" in issue
            assert "expected_improvement" in issue
            assert "confidence" in issue

        # Test Feature 7 API Endpoint: ADR Generator
        resp_adr = client.get(f"/api/v1/repositories/{repo_id}/architect/adrs")
        assert resp_adr.status_code == 200
        data_adr = resp_adr.json()
        assert data_adr["repo_id"] == repo_id
        assert "proposals" in data_adr
        assert len(data_adr["proposals"]) > 0

        for prop in data_adr["proposals"]:
            assert "id" in prop
            assert "title" in prop
            assert "decision" in prop
            assert "reason" in prop
            assert "alternatives" in prop
            assert "result" in prop
            assert "status" in prop
            assert "date" in prop

        # Test Feature 8 API Endpoint: AI Engineering Review
        resp_review = client.get(f"/api/v1/repositories/{repo_id}/architect/review")
        assert resp_review.status_code == 200
        data_review = resp_review.json()
        assert data_review["repo_id"] == repo_id
        assert "strengths" in data_review
        assert "weaknesses" in data_review
        assert "recommendations" in data_review
        assert "overall_summary" in data_review
        assert len(data_review["strengths"]) > 0
        assert len(data_review["weaknesses"]) > 0
        assert len(data_review["recommendations"]) > 0

        # Test Feature 9 API Endpoint: Sprint Recommendation Engine
        resp_sprints = client.get(f"/api/v1/repositories/{repo_id}/architect/sprints")
        assert resp_sprints.status_code == 200
        data_sprints = resp_sprints.json()
        assert data_sprints["repo_id"] == repo_id
        assert "sprints" in data_sprints
        assert len(data_sprints["sprints"]) > 0

        for sprint in data_sprints["sprints"]:
            assert "sprint_name" in sprint
            assert "tasks" in sprint
            assert len(sprint["tasks"]) > 0
            for task in sprint["tasks"]:
                assert "id" in task
                assert "priority_level" in task
                assert "title" in task
                assert "estimated_days" in task
                assert "expected_improvement_pct" in task
                assert "risk" in task
                assert "rationale" in task
                assert "target_component" in task

        # Test Feature 10 API Endpoint: Multi-Level Recommendation
        resp_multilevel = client.get(
            f"/api/v1/repositories/{repo_id}/architect/multi-level"
        )
        assert resp_multilevel.status_code == 200
        data_multilevel = resp_multilevel.json()
        assert data_multilevel["repo_id"] == repo_id
        assert "recommendations" in data_multilevel
        assert len(data_multilevel["recommendations"]) == 6
        assert "total_by_scope" in data_multilevel

        scopes = [r["scope"] for r in data_multilevel["recommendations"]]
        assert "Function" in scopes
        assert "Class" in scopes
        assert "Module" in scopes
        assert "Service" in scopes
        assert "Repository" in scopes
        assert "Enterprise" in scopes

        for rec in data_multilevel["recommendations"]:
            assert "id" in rec
            assert "scope" in rec
            assert "target_name" in rec
            assert "title" in rec
            assert "recommendation" in rec
            assert "impact" in rec
            assert "effort" in rec
            assert "suggested_fix" in rec

        # Test GET sprint-plan API (Feature 9 Alias)
        resp_sp = client.get(f"/api/v1/repositories/{repo_id}/architect/sprint-plan")
        assert resp_sp.status_code == 200
        assert "sprints" in resp_sp.json()

        # Test POST analyze API (persists to DB)
        resp_anz = client.post(f"/api/v1/repositories/{repo_id}/architect/analyze")
        assert resp_anz.status_code == 200
        assert resp_anz.json()["status"] == "success"

        # Check DB persistence (recommendations, reviews, decisions)
        db_check = SessionLocal()
        try:
            from app.models.architect import (
                ArchitectureDecisionGenerated as ArchitectureDecisionGeneratedModel,
            )
            from app.models.architect import (
                ArchitectureRecommendation as ArchitectureRecommendationModel,
            )
            from app.models.architect import (
                ArchitectureReview as ArchitectureReviewModel,
            )

            recs_db = (
                db_check.query(ArchitectureRecommendationModel)
                .filter(ArchitectureRecommendationModel.repo_id == repo_id)
                .all()
            )
            assert len(recs_db) > 0
            for r_db in recs_db:
                assert r_db.title is not None
                assert r_db.priority in [1, 2, 3, 4, 5]

            rev_db = (
                db_check.query(ArchitectureReviewModel)
                .filter(ArchitectureReviewModel.repo_id == repo_id)
                .first()
            )
            assert rev_db is not None
            assert rev_db.health_score > 0

            dec_db = (
                db_check.query(ArchitectureDecisionGeneratedModel)
                .filter(ArchitectureDecisionGeneratedModel.repo_id == repo_id)
                .all()
            )
            assert len(dec_db) > 0
        finally:
            db_check.close()

        # Test POST roadmap API
        resp_road = client.post(f"/api/v1/repositories/{repo_id}/architect/roadmap")
        assert resp_road.status_code == 200
        data_road = resp_road.json()
        assert data_road["repo_id"] == repo_id
        assert "milestones" in data_road
        for ms in data_road["milestones"]:
            assert "id" in ms
            assert "phase" in ms
            assert "title" in ms
            assert "priority" in ms

        # Test GET dashboard API
        resp_dash = client.get(f"/api/v1/repositories/{repo_id}/architect/dashboard")
        assert resp_dash.status_code == 200
        data_dash = resp_dash.json()
        assert data_dash["repo_id"] == repo_id
        assert "active_recommendations" in data_dash
        assert "priority_score" in data_dash
        assert "health_improvement_potential" in data_dash
        assert "risk_reduction" in data_dash
        assert "estimated_engineering_cost" in data_dash
        # Test Feature 11 API Endpoint: Architecture Copilot (Proactive Opportunities)
        resp_copilot = client.get(f"/api/v1/repositories/{repo_id}/architect/copilot")
        assert resp_copilot.status_code == 200
        data_cop = resp_copilot.json()
        assert data_cop["repo_id"] == repo_id
        assert "health_score" in data_cop
        assert len(data_cop["opportunities"]) == 5
        for opp in data_cop["opportunities"]:
            assert "id" in opp
            assert "title" in opp
            assert "metrics_summary" in opp
            assert "impact" in opp
            assert "effort" in opp
            assert "confidence" in opp

    finally:
        # Clean up database records after tests run
        db_cleanup = SessionLocal()
        try:
            db_cleanup.query(GraphRelationship).filter(
                GraphRelationship.repository_id == repo_id
            ).delete()
            db_cleanup.query(GraphNode).filter(
                GraphNode.repository_id == repo_id
            ).delete()
            repo_cleanup = (
                db_cleanup.query(Repository).filter(Repository.id == repo_id).first()
            )
            if repo_cleanup:
                db_cleanup.delete(repo_cleanup)
            db_cleanup.commit()
        finally:
            db_cleanup.close()

        # Reset dependency overrides
        app.dependency_overrides.clear()
