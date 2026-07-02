import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from app.api.v1.auth import get_current_user
from app.core.database import SessionLocal
from app.models.user import User
from app.models.repository import Repository
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.graph_enums import GraphNodeType, GraphRelationshipType


@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    try:
        # Create a mock user if they don't exist
        user = db.query(User).filter(User.id == "12345").first()
        if not user:
            user = User(
                id="12345",
                username="graph_tester",
                name="Graph Tester",
                email="tester@example.com",
            )
            db.add(user)
            db.commit()

        # Create a mock repository
        repo_id = "test_graph_repo"
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if repo:
            db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).delete()
            db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
            db.delete(repo)
            db.commit()

        repo = Repository(
            id=repo_id,
            name="test-graph-repo",
            full_name="tester/test-graph-repo",
            clone_url="https://github.com/tester/test-graph-repo.git",
            status="cloned",
            user_id="12345",
        )
        db.add(repo)
        db.commit()

        yield db

        # Cleanup
        db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).delete()
        db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
        db.delete(repo)
        db.commit()
    finally:
        db.close()


@pytest.fixture(scope="module")
def client(db_session):
    def override_get_current_user():
        db = SessionLocal()
        try:
            return db.query(User).filter(User.id == "12345").first()
        finally:
            db.close()

    app.dependency_overrides[get_current_user] = override_get_current_user
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_create_and_fetch_graph(client):
    repo_id = "test_graph_repo"

    # 1. Create a node for each of the 12 Node Types
    for i, node_type in enumerate(GraphNodeType):
        node_id = f"node_{node_type.name.lower()}"
        payload = {
            "id": node_id,
            "type": node_type.value,
            "name": f"Test {node_type.value} Node",
            "properties": {"index": i, "meta": "test-val"}
        }
        res = client.post(f"/api/v1/repositories/{repo_id}/graph/nodes", json=payload)
        assert res.status_code == 201
        data = res.json()
        assert data["id"] == node_id
        assert data["type"] == node_type.value
        assert data["properties"]["index"] == i

    # 2. Try creating a duplicate node to verify error handling
    res = client.post(
        f"/api/v1/repositories/{repo_id}/graph/nodes",
        json={
            "id": f"node_{GraphNodeType.REPOSITORY.name.lower()}",
            "type": GraphNodeType.REPOSITORY.value,
            "name": "Duplicate Node",
        }
    )
    assert res.status_code == 400

    # 3. Create relationships of all 10 types linking nodes sequentially
    node_types_list = list(GraphNodeType)
    for i, rel_type in enumerate(GraphRelationshipType):
        source_idx = i % len(node_types_list)
        target_idx = (i + 1) % len(node_types_list)
        source_id = f"node_{node_types_list[source_idx].name.lower()}"
        target_id = f"node_{node_types_list[target_idx].name.lower()}"

        rel_id = f"rel_{rel_type.name.lower()}"
        payload = {
            "id": rel_id,
            "source_id": source_id,
            "target_id": target_id,
            "type": rel_type.value,
            "properties": {"weight": 1.5}
        }
        res = client.post(f"/api/v1/repositories/{repo_id}/graph/relationships", json=payload)
        assert res.status_code == 201
        data = res.json()
        assert data["id"] == rel_id
        assert data["source_id"] == source_id
        assert data["target_id"] == target_id
        assert data["type"] == rel_type.value

    # 4. Try creating a relationship with invalid nodes to verify validation
    res = client.post(
        f"/api/v1/repositories/{repo_id}/graph/relationships",
        json={
            "id": "rel_invalid",
            "source_id": "nonexistent_source",
            "target_id": "nonexistent_target",
            "type": GraphRelationshipType.DEPENDS_ON.value,
        }
    )
    assert res.status_code == 400

    # 5. Retrieve the whole graph and check node count and relationship kinds
    res = client.get(f"/api/v1/repositories/{repo_id}/graph")
    assert res.status_code == 200
    graph_data = res.json()
    assert len(graph_data["nodes"]) == len(GraphNodeType)
    assert len(graph_data["relationships"]) == len(GraphRelationshipType)

    # Validate node types and relationship types list match
    retrieved_node_types = {n["type"] for n in graph_data["nodes"]}
    expected_node_types = {nt.value for nt in GraphNodeType}
    assert retrieved_node_types == expected_node_types

    retrieved_rel_types = {r["type"] for r in graph_data["relationships"]}
    expected_rel_types = {rt.value for rt in GraphRelationshipType}
    assert retrieved_rel_types == expected_rel_types
