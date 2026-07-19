import os
import sys

# Override DATABASE_URL to use SQLite for isolated tests before importing anything else
os.environ["DATABASE_URL"] = "sqlite:///./test_temp.db"

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

import pytest
from app.core.database import Base, get_db
from app.core.database import engine as core_engine
from app.health.models.health import RepositoryHealth
from app.main import app
from app.models.file import File
from app.models.repository import Repository
from app.models.user import User
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

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

    from app.api.v1.auth import get_current_user

    app.dependency_overrides[get_current_user] = lambda: User(
        id="1", username="testuser", email="test@example.com"
    )

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


def test_download_and_notifications_endpoints(db_session, client):
    # Setup user & repository
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

    # Seed File
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

    # Seed RepositoryHealth
    repo_health = RepositoryHealth(
        repo_id="test_repo_id",
        overall_score=89.0,
        architecture_score=88.0,
        quality_score=90.0,
        technical_debt=14.0,
        knowledge_score=85.0,
        security_score=94.0,
        performance_score=88.0,
        scalability_score=90.0,
        developer_experience=89.0,
    )
    db_session.add(repo_health)
    db_session.commit()

    # 1. Test Notifications
    res_notif = client.get("/api/v1/repositories/test_repo_id/health/notifications")
    assert (
        res_notif.status_code == 200
    ), f"Status: {res_notif.status_code}, Detail: {res_notif.json()}"
    data = res_notif.json()
    assert len(data) == 5
    assert data[0]["type"] == "health_drop"
    assert data[1]["type"] == "tech_debt"

    # 2. Test Reports Download PDF
    res_pdf = client.get(
        "/api/v1/repositories/test_repo_id/health/reports/download?format=pdf"
    )
    assert res_pdf.status_code == 200
    assert "application/pdf" in res_pdf.headers["content-type"]
    assert "attachment" in res_pdf.headers["content-disposition"]

    # 3. Test Reports Download HTML
    res_html = client.get(
        "/api/v1/repositories/test_repo_id/health/reports/download?format=html"
    )
    assert res_html.status_code == 200
    assert "text/html" in res_html.headers["content-type"]

    # 4. Test Reports Download Markdown
    res_md = client.get(
        "/api/v1/repositories/test_repo_id/health/reports/download?format=markdown"
    )
    assert res_md.status_code == 200
    assert "text/markdown" in res_md.headers["content-type"]
