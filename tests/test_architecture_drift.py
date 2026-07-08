"""Unit and integration tests for Architectural Drift Detection."""

import os
import sys
import shutil

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from fastapi.testclient import TestClient
from app.main import app
from app.api.v1.auth import get_current_user
from app.core.database import SessionLocal
from app.models.user import User
from app.models.repository import Repository
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.services.drift_detection_service import DriftDetectionService
from app.core.config import settings

def test_architecture_drift():
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
            db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).delete()
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
            properties={"path": "apps/backend/app/api/v1/users.py"}
        )
        service_node = GraphNode(
            id="node_service_1",
            repository_id=repo_id,
            name="app/services/user_service.py",
            type="service",
            properties={"path": "apps/backend/app/services/user_service.py"}
        )
        db_node = GraphNode(
            id="node_db_1",
            repository_id=repo_id,
            name="users",
            type="database table",
            properties={"path": "apps/backend/app/models/user.py"}
        )

        db.add_all([api_node, service_node, db_node])
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
            type="CALL"
        )
        rel2 = GraphRelationship(
            id="rel2",
            repository_id=repo_id,
            source_id="node_service_1",
            target_id="node_db_1",
            type="QUERY"
        )
        rel3 = GraphRelationship(
            id="rel3",
            repository_id=repo_id,
            source_id="node_api_1",
            target_id="node_db_1",
            type="DIRECT_QUERY"
        )

        db.add_all([rel1, rel2, rel3])
        db.commit()

    finally:
        db.close()

    # 3. Test Service Logic
    db_session = SessionLocal()
    try:
        # Load default rules
        rules = drift_service.load_rules(repo_id)
        assert len(rules.get("layers", [])) == 4
        assert len(rules.get("patterns", [])) == 2

        # Detect Drift
        report = drift_service.detect_drift(db_session, repo_id)
        assert report["compliance_score"] < 100.0
        
        # Verify violations are caught
        violations = report["violations"]
        assert len(violations) > 0

        # We expect a layer violation or a pattern violation (API -> DB table direct query)
        viol_types = [v.type for v in violations]
        assert "layer_violation" in viol_types or "pattern_violation" in viol_types

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
    custom_rules["layers"].append({
        "name": "Util",
        "matching_patterns": ["*util*"],
        "allowed_dependencies": []
    })
    post_res = client.post(f"/api/v1/repositories/{repo_id}/architecture/rules", json=custom_rules)
    assert post_res.status_code == 200
    assert len(post_res.json()["layers"]) == 5

    # GET /api/v1/repositories/{repo_id}/architecture/drift
    drift_res = client.get(f"/api/v1/repositories/{repo_id}/architecture/drift")
    assert drift_res.status_code == 200
    drift_report = drift_res.json()
    assert "compliance_score" in drift_report
    assert "violations" in drift_report
    assert "alerts" in drift_report

    print("All Architectural Drift backend tests passed successfully!")

    # Cleanup DB records
    db_cleanup = SessionLocal()
    try:
        db_cleanup.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).delete()
        db_cleanup.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
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
