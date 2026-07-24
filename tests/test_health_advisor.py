import os
import sys

# Override DATABASE_URL to use SQLite for isolated tests before importing anything else
os.environ["DATABASE_URL"] = "sqlite:///./test_temp.db"

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

import pytest
from app.core.database import Base, get_db
from app.core.database import engine as core_engine
from app.health.advisor.health_advisor import HealthAdvisor
from app.health.engine.health_engine import HealthEngine
from app.health.models.health import Recommendation
from app.health.reports.cto_report import CtoReportGenerator
from app.health.reports.executive_report import ExecutiveReportGenerator
from app.main import app
from app.models.file import File
from app.models.repository import Repository
from app.models.user import User
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup SQLite test DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def db_session():
    """Setup test database tables and yield a clean session."""

    Base.metadata.create_all(bind=engine)
    Base.metadata.create_all(bind=core_engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        Base.metadata.drop_all(bind=core_engine)


@pytest.fixture(scope="module")
def client(db_session):
    """Yield a TestClient using the test database session."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    # Skip JWT auth validation for simplify testing by mocking get_current_user
    from app.api.v1.auth import get_current_user

    app.dependency_overrides[get_current_user] = lambda: User(
        id="1", username="testuser", email="test@example.com"
    )

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


def test_health_calculation_and_recommendations(db_session):
    """Test that HealthEngine calculates correct scores and writes recommendations."""
    # 1. Setup mock repo, user, and files
    user = User(id="1", username="testuser", email="test@example.com")
    db_session.add(user)
    db_session.commit()

    repo = Repository(
        id="test_repo_id",
        name="test_repo",
        full_name="test/test_repo",
        clone_url="http://mock.clone",
        user_id=user.id,
    )
    db_session.add(repo)
    db_session.commit()

    file_node = File(
        id="file_1",
        repository_id="test_repo_id",
        file_path="app.py",
        language="python",
        size_bytes=100,
        code_lines=10,
        comment_lines=0,
        blank_lines=2,
        total_lines=12,
    )
    db_session.add(file_node)
    db_session.commit()

    # 2. Run analysis
    health_engine = HealthEngine()
    report = health_engine.run_analysis(db_session, "test_repo_id")

    assert "overall_score" in report
    assert "grade" in report
    assert "categories" in report
    assert "forecast" in report

    # 3. Check Advisor Recommendations
    scores = {d["name"]: d["score"] for d in report["dimensions"]}
    advisor = HealthAdvisor()
    recs = advisor.generate_recommendations(db_session, "test_repo_id", scores)

    assert len(recs) > 0
    assert any(r["recommendation"] == "Split Payment" for r in recs)

    # 4. Check DB entries
    db_recs = (
        db_session.query(Recommendation)
        .filter(Recommendation.repo_id == "test_repo_id")
        .all()
    )
    assert len(db_recs) == len(recs)


def test_reports_generation(db_session):
    """Test executive (CEO) and cto dashboard calculations."""
    overall_score = 88.0
    exec_data = ExecutiveReportGenerator.generate(
        db_session, "test_repo_id", overall_score
    )
    assert exec_data["repository_health"] == 88.0
    assert exec_data["engineering_velocity"] == "High"
    assert exec_data["risk"] == "Low"

    scores = {
        "Reliability": 70.0,
        "Security": 70.0,
        "Architecture": 90.0,
        "Scalability": 70.0,
    }
    cto_data = CtoReportGenerator.generate(db_session, "test_repo_id", scores)
    assert "Database" in cto_data["critical_issues"]
    assert "Redis" in cto_data["top_opportunities"]
    assert cto_data["architecture_drift"] == "Low"


def test_api_endpoints(client, db_session):
    """Test that all endpoints defined in health_router work as expected."""
    # Trigger full analysis
    response = client.post("/api/v1/repositories/test_repo_id/health/analyze")
    assert response.status_code == 200
    assert "overall_score" in response.json()

    # Get health summaries
    response = client.get("/api/v1/repositories/test_repo_id/health")
    assert response.status_code == 200
    assert response.json()["overall_score"] is not None

    # Get recommendations
    response = client.get("/api/v1/repositories/test_repo_id/health/recommendations")
    assert response.status_code == 200
    assert len(response.json()) > 0

    # Get executive
    response = client.get("/api/v1/repositories/test_repo_id/health/executive")
    assert response.status_code == 200
    assert "engineering_velocity" in response.json()

    # Get cto
    response = client.get("/api/v1/repositories/test_repo_id/health/cto")
    assert response.status_code == 200
    assert "critical_issues" in response.json()

    # Get consolidated dashboard payload
    response = client.get("/api/v1/repositories/test_repo_id/health/dashboard")
    assert response.status_code == 200
    assert "forecast" in response.json()
    assert "history" in response.json()
