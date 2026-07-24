import os
import sys

# Override DATABASE_URL to use SQLite for isolated tests before importing anything else
os.environ["DATABASE_URL"] = "sqlite:///./test_temp.db"

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.database import Base, SessionLocal, engine
from app.main import app
from app.models.repository import Repository
from app.models.user import User
from fastapi.testclient import TestClient


def test_software_world_endpoint():
    # Setup SQLite clean db

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    user_id = "test_world_user_id"
    repo_id = "test_world_repo_id"

    db = SessionLocal()
    try:
        # Create user
        user = User(
            id=user_id,
            username="world_tester",
            name="World Tester",
            email="world_tester@example.com",
        )
        db.add(user)
        db.commit()

        # Create repository
        repo = Repository(
            id=repo_id,
            name="my-custom-microservice",
            full_name="world_tester/my-custom-microservice",
            clone_url="https://github.com/world_tester/my-custom-microservice.git",
            status="cloned",
            user_id=user_id,
        )
        db.add(repo)
        db.commit()
    finally:
        db.close()

    client = TestClient(app)

    # Override auth helper
    def override_get_current_user():
        test_db = SessionLocal()
        try:
            return test_db.query(User).filter(User.id == user_id).first()
        finally:
            test_db.close()

    app.dependency_overrides[get_current_user] = override_get_current_user

    try:
        # 1. Test Standard Scale (13 nodes + 1 real node = 14 total nodes)
        response = client.get("/api/v1/software-world?scale=13")
        assert response.status_code == 200
        data = response.json()

        assert "nodes" in data
        assert "edges" in data

        nodes = data["nodes"]
        edges = data["edges"]

        # 13 mock nodes + 1 user repo = 14 nodes
        assert len(nodes) == 14

        # Let's find our real node in the list
        real_nodes = [n for n in nodes if not n["is_mock"]]
        assert len(real_nodes) == 1
        assert real_nodes[0]["id"] == repo_id
        assert real_nodes[0]["name"] == "my-custom-microservice"
        assert real_nodes[0]["status"] == "active"

        # Check standard edges
        assert len(edges) > 10
        # Make sure our real repo has a connector edge to api-gateway
        real_edges = [e for e in edges if e["source"] == repo_id]
        assert len(real_edges) == 1
        assert real_edges[0]["target"] == "netflix-api-gateway"

        # 2. Test Netflix Scale (300 nodes + 1 real node = 301 total nodes)
        response_large = client.get("/api/v1/software-world?scale=300")
        assert response_large.status_code == 200
        data_large = response_large.json()

        nodes_large = data_large["nodes"]
        edges_large = data_large["edges"]

        assert len(nodes_large) == 301
        assert len(edges_large) > 300

        # Spot check mock node structure
        mock_node = [n for n in nodes_large if n["is_mock"]][0]
        assert "id" in mock_node
        assert "name" in mock_node
        assert "status" in mock_node
        assert "primary_language" in mock_node
        assert "health_score" in mock_node
        assert "lines_of_code" in mock_node
        assert "coverage" in mock_node
        assert "complexity" in mock_node
        assert "alerts" in mock_node
        assert "x" in mock_node
        assert "y" in mock_node

    finally:
        app.dependency_overrides.clear()
