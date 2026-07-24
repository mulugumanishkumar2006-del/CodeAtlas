import os

os.environ["DATABASE_URL"] = "sqlite:///./test_temp.db"
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
from app.services.software_city_service import SoftwareCityService
from fastapi.testclient import TestClient


def setup_mock_data():
    app.dependency_overrides[get_current_user] = override_get_current_user

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
        repo_id = "test_city_repo_id"
        db.query(GraphRelationship).filter(
            GraphRelationship.repository_id == repo_id
        ).delete()
        db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
        db.query(Repository).filter(Repository.id == repo_id).delete()
        db.commit()

        # Create mock repository
        repo = Repository(
            id=repo_id,
            name="test-city-repo",
            full_name="test/test-city-repo",
            clone_url="https://github.com/test/test-city-repo.git",
            status="cloned",
            user_id="12345",
        )
        db.add(repo)
        db.commit()

        # Create graph nodes: files, functions
        n1 = GraphNode(
            id="n1",
            repository_id=repo_id,
            type="File",
            name="orders.py",
            properties={"path": "orders.py", "size_bytes": 1200},
        )
        n2 = GraphNode(
            id="n2",
            repository_id=repo_id,
            type="Function",
            name="process_payment",
            properties={"file_id": "n1", "is_async": True},
        )
        db.add(n1)
        db.add(n2)
        db.commit()

    finally:
        db.close()


def override_get_current_user():
    return User(
        id="12345",
        username="test_user",
        name="Test User",
        email="test@example.com",
    )


client = TestClient(app)


def test_software_city_service():
    setup_mock_data()
    db = SessionLocal()
    try:
        response = SoftwareCityService.get_city_layout(db, "test_city_repo_id")
        assert response.city_name == "test-city-repo"
        assert len(response.districts) > 0

        # Verify orders.py is mapped to a building
        found_building = False
        for dist in response.districts:
            for nh in dist.neighborhoods:
                for building in nh.buildings:
                    if building.name == "orders.py":
                        found_building = True
                        assert building.type == "File"
                        # Should have rooms inside
                        assert len(building.rooms) > 0
                        assert building.rooms[0].name == "process_payment"
                        assert building.rooms[0].is_async is True
        assert found_building is True
    finally:
        db.close()


def test_software_city_api_endpoint():
    setup_mock_data()
    response = client.get(
        "/api/v1/repositories/test_city_repo_id/digital-twin/software-city"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["city_name"] == "test-city-repo"
    assert "districts" in data
    assert len(data["districts"]) > 0
    assert "roads" in data
    assert "highways" in data
    assert "power_stations" in data
    assert "railway_stations" in data
    assert "warehouses" in data
    assert "citizens" in data
    assert "airports" in data
    assert "control_towers" in data
    assert "utility_plants" in data


def test_git_push_and_reset_simulation_api():
    setup_mock_data()
    # Trigger Git push webhook simulation
    res_push = client.post(
        "/api/v1/repositories/test_city_repo_id/digital-twin/git-push"
    )
    assert res_push.status_code == 200
    push_data = res_push.json()
    assert push_data["status"] == "success"
    assert "GitHub push event processed" in push_data["message"]

    # Verify that the new node is processed in the city layout
    res_city = client.get(
        "/api/v1/repositories/test_city_repo_id/digital-twin/software-city"
    )
    assert res_city.status_code == 200
    city_data = res_city.json()

    # Check that pushed_feature_module.py is constructed in the layout
    found_pushed = False
    for dist in city_data["districts"]:
        for nh in dist["neighborhoods"]:
            for building in nh["buildings"]:
                if building["name"] == "pushed_feature_module.py":
                    found_pushed = True
                    break
    assert found_pushed is True

    # Reset simulation
    res_reset = client.post(
        "/api/v1/repositories/test_city_repo_id/digital-twin/reset-simulation"
    )
    assert res_reset.status_code == 200
    assert res_reset.json()["status"] == "success"

    # Verify pushed node has been cleared
    res_city_after = client.get(
        "/api/v1/repositories/test_city_repo_id/digital-twin/software-city"
    )
    found_pushed_after = False
    for dist in res_city_after.json()["districts"]:
        for nh in dist["neighborhoods"]:
            for building in nh["buildings"]:
                if building["name"] == "pushed_feature_module.py":
                    found_pushed_after = True
    assert found_pushed_after is False
