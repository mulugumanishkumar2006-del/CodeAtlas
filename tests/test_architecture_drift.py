"""Unit and integration tests for Architectural Drift Detection."""

import os
import shutil
import sys

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.database import SessionLocal
from app.main import app
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.repository import Repository
from app.models.user import User
from app.services.drift_detection_service import DriftDetectionService
from fastapi.testclient import TestClient


def test_architecture_drift():
    # Ensure database tables are created for tests
    from app.core.database import Base, engine

    Base.metadata.create_all(bind=engine)

    # 1. Setup mock repository ID
    repo_id = "test_architecture_drift_repo"
    drift_service = DriftDetectionService()

    # Clean up any leftover rules
    repo_dir = drift_service.get_repo_dir(repo_id)
    shutil.rmtree(repo_dir, ignore_errors=True)

    # 2. Setup mock user and repository in database
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == "12345").first()
        if not user:
            user = User(
                id="12345",
                username="arch_tester",
                name="Arch Tester",
                email="arch_tester@example.com",
            )
            db.add(user)
            db.commit()

        # Delete any previous records
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if repo:
            db.query(GraphRelationship).filter(
                GraphRelationship.repository_id == repo_id
            ).delete()
            db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
            db.delete(repo)
            db.commit()

        repo = Repository(
            id=repo_id,
            name="arch-drift-repo",
            full_name="tester/arch-drift-repo",
            clone_url="https://github.com/tester/arch-drift-repo.git",
            status="cloned",
            user_id="12345",
        )
        db.add(repo)
        db.commit()

        # Add Nodes: API Route, Service, Database Table
        api_node = GraphNode(
            id="node_api_1",
            repository_id=repo_id,
            name="app/api/v1/users.py",
            type="api",
            properties={"path": "apps/backend/app/api/v1/users.py"},
        )
        service_node = GraphNode(
            id="node_service_1",
            repository_id=repo_id,
            name="app/services/user_service.py",
            type="service",
            properties={"path": "apps/backend/app/services/user_service.py"},
        )
        db_node = GraphNode(
            id="node_db_1",
            repository_id=repo_id,
            name="users",
            type="database table",
            properties={"path": "apps/backend/app/models/user.py"},
        )

        # For Circular dependency cycle: Auth -> User -> Notif -> Auth
        auth_c = GraphNode(
            id="auth_c",
            repository_id=repo_id,
            name="app/auth.py",
            type="module",
            properties={"path": "apps/backend/app/auth.py"},
        )
        user_c = GraphNode(
            id="user_c",
            repository_id=repo_id,
            name="app/user.py",
            type="module",
            properties={"path": "apps/backend/app/user.py"},
        )
        notif_c = GraphNode(
            id="notif_c",
            repository_id=repo_id,
            name="app/notification.py",
            type="module",
            properties={"path": "apps/backend/app/notification.py"},
        )

        # For Domain boundary leakage: Auth depending on Billing/Payment
        auth_l = GraphNode(
            id="auth_l",
            repository_id=repo_id,
            name="app/auth/login.py",
            type="module",
            properties={"path": "apps/backend/app/auth/login.py"},
        )
        billing_l = GraphNode(
            id="billing_l",
            repository_id=repo_id,
            name="app/billing/charge.py",
            type="module",
            properties={"path": "apps/backend/app/billing/charge.py"},
        )

        # Microservice shared database query service in billing domain
        billing_service = GraphNode(
            id="billing_service",
            repository_id=repo_id,
            name="app/billing/billing_service.py",
            type="service",
            properties={"path": "apps/backend/app/billing/billing_service.py"},
        )

        db.add_all(
            [
                api_node,
                service_node,
                db_node,
                auth_c,
                user_c,
                notif_c,
                auth_l,
                billing_l,
                billing_service,
            ]
        )
        db.commit()

        # Add Relationships:
        # 1. API calls Service (Valid)
        # 2. Service calls DB Table (Valid)
        # 3. API calls DB Table directly (Layer Violation & Pattern Violation)
        rel1 = GraphRelationship(
            id="rel1",
            repository_id=repo_id,
            source_id="node_api_1",
            target_id="node_service_1",
            type="CALL",
        )
        rel2 = GraphRelationship(
            id="rel2",
            repository_id=repo_id,
            source_id="node_service_1",
            target_id="node_db_1",
            type="QUERY",
        )
        rel3 = GraphRelationship(
            id="rel3",
            repository_id=repo_id,
            source_id="node_api_1",
            target_id="node_db_1",
            type="DIRECT_QUERY",
        )

        # Circular cycle relationships: auth -> user -> notif -> auth
        rel_c1 = GraphRelationship(
            id="rel_c1",
            repository_id=repo_id,
            source_id="auth_c",
            target_id="user_c",
            type="IMPORT",
        )
        rel_c2 = GraphRelationship(
            id="rel_c2",
            repository_id=repo_id,
            source_id="user_c",
            target_id="notif_c",
            type="IMPORT",
        )
        rel_c3 = GraphRelationship(
            id="rel_c3",
            repository_id=repo_id,
            source_id="notif_c",
            target_id="auth_c",
            type="IMPORT",
        )

        # Boundary leakage relationship: auth_l (matches Domain auth) -> billing_l (matches Domain billing)
        rel_l1 = GraphRelationship(
            id="rel_l1",
            repository_id=repo_id,
            source_id="auth_l",
            target_id="billing_l",
            type="IMPORT",
        )

        # Shared database query: billing_service queries the users table
        rel_db_shared = GraphRelationship(
            id="rel_db_shared",
            repository_id=repo_id,
            source_id="billing_service",
            target_id="node_db_1",
            type="QUERY",
        )

        db.add_all([rel1, rel2, rel3, rel_c1, rel_c2, rel_c3, rel_l1, rel_db_shared])
        db.commit()

    finally:
        db.close()

    # 3. Test Service Logic
    db_session = SessionLocal()
    try:
        # Load default rules
        rules = drift_service.load_rules(repo_id)
        assert len(rules.get("layers", [])) == 4
        assert len(rules.get("boundaries", [])) == 2
        assert len(rules.get("custom_rules", [])) == 4

        # Append a custom rule to test matching
        rules["custom_rules"].append(
            {
                "id": "api_no_direct_db",
                "name": "API cannot direct DB",
                "source_matcher": "*api*",
                "target_matcher": "users",
                "type": "forbidden",
                "severity": "critical",
            }
        )
        drift_service.save_rules(repo_id, rules)

        # Assert auth domain forbids billing dependency by default config fallback
        auth_rule = next((b for b in rules["boundaries"] if b["name"] == "auth"), None)
        assert auth_rule is not None
        assert "billing" in auth_rule["forbidden_dependencies"]

        # Detect Drift
        report = drift_service.detect_drift(db_session, repo_id)
        assert report["compliance_score"] < 100.0

        # Verify violations are caught
        violations = report["violations"]
        assert len(violations) > 0

        # Find circular dependency violations
        cycles = [v for v in violations if v.type == "circular_dependency"]
        assert len(cycles) > 0
        cycle_v = cycles[0]
        assert (
            "app/auth.py" in cycle_v.affected_modules
            or "app/user.py" in cycle_v.affected_modules
        )
        assert cycle_v.severity_score is not None
        assert cycle_v.suggested_fix is not None

        # Find boundary leakage violations
        leaks = [
            v
            for v in violations
            if v.type == "boundary_violation" and v.severity == "critical"
        ]
        assert len(leaks) > 0
        leak_v = leaks[0]
        assert "Domain Leakage" in leak_v.message
        assert leak_v.suggested_fix is not None
        assert leak_v.severity_score == 85

        # Verify Custom Rule violations are evaluated
        custom_viols = [v for v in violations if v.type == "custom_rule_violation"]
        assert len(custom_viols) > 0
        assert custom_viols[0].suggested_fix is not None
        assert custom_viols[0].severity_score is not None

        # Verify Microservice Boundary Analysis
        analysis = report["microservice_boundary_analysis"]
        assert "shared_databases" in analysis
        assert "distributed_monolith_indicators" in analysis
        shared_db_tables = [s["table_name"] for s in analysis["shared_databases"]]
        assert "users" in shared_db_tables
        assert analysis["distributed_monolith_indicators"]["score"] > 0
        assert analysis["distributed_monolith_indicators"]["risk_level"] in [
            "low",
            "medium",
            "high",
        ]

        # Verify AI Architecture Reviewer
        assert report["ai_review"] is not None
        assert report["ai_review"].summary == "Repository Review"
        assert len(report["ai_review"].findings) > 0
        assert report["ai_review"].maintainability_improvement > 0

        # We expect a layer violation or a pattern violation (API -> DB table direct query)
        viol_types = [v.type for v in violations]
        assert (
            "layer_violation" in viol_types
            or "pattern_violation" in viol_types
            or "custom_rule_violation" in viol_types
        )

    finally:
        db_session.close()

    # 4. Test API Endpoints
    client = TestClient(app)

    def override_get_current_user():
        db_auth = SessionLocal()
        try:
            return db_auth.query(User).filter(User.id == "12345").first()
        finally:
            db_auth.close()

    app.dependency_overrides[get_current_user] = override_get_current_user

    # GET /api/v1/repositories/{repo_id}/architecture/rules
    rules_res = client.get(f"/api/v1/repositories/{repo_id}/architecture/rules")
    assert rules_res.status_code == 200
    assert len(rules_res.json()["layers"]) > 0

    # POST /api/v1/repositories/{repo_id}/architecture/rules (Save new custom rules)
    custom_rules = rules_res.json()
    # Add a custom layer rule
    custom_rules["layers"].append(
        {"name": "Util", "matching_patterns": ["*util*"], "allowed_dependencies": []}
    )
    post_res = client.post(
        f"/api/v1/repositories/{repo_id}/architecture/rules", json=custom_rules
    )
    assert post_res.status_code == 200
    assert len(post_res.json()["layers"]) == 5

    # GET /api/v1/repositories/{repo_id}/architecture/drift
    drift_res = client.get(f"/api/v1/repositories/{repo_id}/architecture/drift")
    assert drift_res.status_code == 200
    drift_report = drift_res.json()
    assert "compliance_score" in drift_report
    assert "violations" in drift_report
    assert "alerts" in drift_report
    assert "ai_review" in drift_report
    assert drift_report["ai_review"]["summary"] == "Repository Review"
    assert drift_report["ai_review"]["maintainability_improvement"] > 0

    # GET /api/v1/repositories/{repo_id}/architecture/drift/timeline
    timeline_res = client.get(
        f"/api/v1/repositories/{repo_id}/architecture/drift/timeline"
    )
    assert timeline_res.status_code == 200
    timeline = timeline_res.json()
    assert len(timeline) == 4
    assert timeline[0]["compliance_score"] == 98.0
    assert timeline[0]["status"] == "Healthy"
    assert timeline[-1]["compliance_score"] == 71.0
    assert len(timeline[-1]["introduced_violations"]) > 0

    # GET /api/v1/repositories/{repo_id}/architecture/pr/review
    pr_res = client.get(
        f"/api/v1/repositories/{repo_id}/architecture/pr/review?base_sha=8b353f06d7efc40552b0f443b71bf12d484192b0&head_sha=7a3b4e2f3d6c1b5a2e9f0d8c7b6a5f4e3d2c1b0a"
    )
    assert pr_res.status_code == 200
    pr_review = pr_res.json()
    assert len(pr_review["predicted_layer_violations"]) > 0
    assert pr_review["drift_impact"]["score_change"] == -22.0
    assert "bypass" in pr_review["feedback"]
    assert "High coupling" in pr_review["change_risk_reasons"]
    assert "Authentication" in pr_review["likely_broken_tests"]
    assert "Payment" in pr_review["likely_broken_tests"]
    assert "Invoices" in pr_review["likely_broken_tests"]
    assert "Notifications" in pr_review["likely_broken_tests"]

    # GET /api/v1/repositories/{repo_id}/architecture/policies
    policy_res = client.get(f"/api/v1/repositories/{repo_id}/architecture/policies")
    assert policy_res.status_code == 200
    policy_report = policy_res.json()
    assert policy_report["compliance_score"] > 0.0
    assert len(policy_report["policies"]) == 5

    # 9. Test SQL-backed endpoints
    from app.models.architecture import (
        ArchitectureBaseline,
        ArchitectureViolation,
        ComplianceHistory,
        GovernancePolicy,
    )

    # POST /api/v1/repositories/{repo_id}/architecture/baseline
    baseline_res = client.post(
        f"/api/v1/repositories/{repo_id}/architecture/baseline",
        json={"architecture_type": "hexagonal"},
    )
    assert baseline_res.status_code == 200
    assert baseline_res.json()["status"] == "success"

    # POST /api/v1/repositories/{repo_id}/architecture/analyze
    analyze_res = client.post(f"/api/v1/repositories/{repo_id}/architecture/analyze")
    assert analyze_res.status_code == 200
    assert "isomorphism_matched" in analyze_res.json()
    assert "communities" in analyze_res.json()
    assert "coupling_matrix" in analyze_res.json()

    # GET /api/v1/repositories/{repo_id}/architecture/compliance
    compliance_res = client.get(
        f"/api/v1/repositories/{repo_id}/architecture/compliance"
    )
    assert compliance_res.status_code == 200
    assert "compliance_score" in compliance_res.json()
    assert "total_violations" in compliance_res.json()

    # GET /api/v1/repositories/{repo_id}/architecture/violations
    violations_res = client.get(
        f"/api/v1/repositories/{repo_id}/architecture/violations"
    )
    assert violations_res.status_code == 200
    assert isinstance(violations_res.json(), list)

    # GET /api/v1/repositories/{repo_id}/architecture/governance
    gov_res = client.get(f"/api/v1/repositories/{repo_id}/architecture/governance")
    assert gov_res.status_code == 200
    assert gov_res.json()["compliance_score"] > 0.0

    # POST /api/v1/repositories/{repo_id}/architecture/policies
    policies_res = client.post(
        f"/api/v1/repositories/{repo_id}/architecture/policies",
        json={
            "organization_id": "default",
            "policies": [
                {
                    "policy_name": "Test Policy",
                    "rule_definition": "no_cycles",
                    "enabled": False,
                }
            ],
        },
    )
    assert policies_res.status_code == 200

    # POST /api/v1/repositories/{repo_id}/pull-request/review
    pr_post_res = client.post(
        f"/api/v1/repositories/{repo_id}/pull-request/review",
        json={
            "base_sha": "8b353f06d7efc40552b0f443b71bf12d484192b0",
            "head_sha": "7a3b4e2f3d6c1b5a2e9f0d8c7b6a5f4e3d2c1b0a",
        },
    )
    assert pr_post_res.status_code == 200
    assert "drift_impact" in pr_post_res.json()

    print("All Architectural Drift backend tests passed successfully!")

    # Cleanup DB records
    db_cleanup = SessionLocal()
    try:
        db_cleanup.query(GraphRelationship).filter(
            GraphRelationship.repository_id == repo_id
        ).delete()
        db_cleanup.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
        db_cleanup.query(ArchitectureBaseline).filter(
            ArchitectureBaseline.repo_id == repo_id
        ).delete()
        db_cleanup.query(ArchitectureViolation).filter(
            ArchitectureViolation.repo_id == repo_id
        ).delete()
        db_cleanup.query(ComplianceHistory).filter(
            ComplianceHistory.repo_id == repo_id
        ).delete()
        db_cleanup.query(GovernancePolicy).delete()

        repo_rec = db_cleanup.query(Repository).filter(Repository.id == repo_id).first()
        if repo_rec:
            db_cleanup.delete(repo_rec)
        db_cleanup.commit()
    finally:
        db_cleanup.close()

    # Cleanup test files on disk
    shutil.rmtree(repo_dir, ignore_errors=True)


if __name__ == "__main__":
    test_architecture_drift()
