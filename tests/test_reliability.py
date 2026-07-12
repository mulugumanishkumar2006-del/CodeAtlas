"""Integration tests for the AI Reliability Intelligence Engine (Phase 12)."""

import os
import sys

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.database import Base, SessionLocal, engine
from app.main import app
from app.models.reliability import ReliabilityPrediction, ReliabilitySummary
from app.models.repository import Repository
from app.models.user import User
from fastapi.testclient import TestClient


def test_reliability_prediction_and_dashboard():
    # Ensure database tables are created cleanly
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    repo_id = "test_reliability_repo_id"
    user_id = "test_reliability_user_id"

    # Setup database session
    db = SessionLocal()
    try:
        # Create user if not exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            user = User(
                id=user_id,
                username="reliability_tester",
                name="Reliability Tester",
                email="reliability_tester@example.com",
            )
            db.add(user)
            db.commit()

        # Delete any previous records for this repo
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if repo:
            db.query(ReliabilityPrediction).filter(
                ReliabilityPrediction.repository_id == repo_id
            ).delete()
            db.query(ReliabilitySummary).filter(
                ReliabilitySummary.repo_id == repo_id
            ).delete()
            db.delete(repo)
            db.commit()

        # Create repository
        repo = Repository(
            id=repo_id,
            name="reliability-test-repo",
            full_name="tester/reliability-test-repo",
            clone_url="https://github.com/tester/reliability-test-repo.git",
            status="cloned",
            user_id=user_id,
        )
        db.add(repo)
        db.commit()

    finally:
        db.close()

    # Setup TestClient
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
        # 1. Test POST /repositories/{repo_id}/reliability/predict
        resp_pred = client.post(f"/api/v1/repositories/{repo_id}/reliability/predict")
        assert resp_pred.status_code == 200
        data_pred = resp_pred.json()
        assert data_pred["repo_id"] == repo_id
        assert "reliability_score" in data_pred
        assert "deployment_risk" in data_pred
        assert len(data_pred["hotspots"]) == 16

        # Verify hotspots structure
        for hot in data_pred["hotspots"]:
            assert "id" in hot
            assert "file_path" in hot
            assert "prediction_type" in hot
            assert "name" in hot
            assert "failure_probability" in hot
            assert "confidence" in hot
            assert "regression_risk" in hot
            assert "change_risk" in hot
            assert "complexity" in hot
            assert "lines_of_code" in hot

        # Verify trends structure
        assert len(data_pred["trends"]) > 0
        for trend in data_pred["trends"]:
            assert "checkpoint_date" in trend
            assert "health_score" in trend
            assert "failure_probability" in trend

        # 2. Test GET /repositories/{repo_id}/reliability/dashboard
        resp_dash = client.get(f"/api/v1/repositories/{repo_id}/reliability/dashboard")
        assert resp_dash.status_code == 200
        data_dash = resp_dash.json()
        assert data_dash["repo_id"] == repo_id
        assert data_dash["reliability_score"] == data_pred["reliability_score"]
        assert data_dash["deployment_risk"] == data_pred["deployment_risk"]
        assert len(data_dash["hotspots"]) == len(data_pred["hotspots"])
        assert len(data_dash["trends"]) == len(data_pred["trends"])

    finally:
        # Clean up database records after tests run
        db_cleanup = SessionLocal()
        try:
            db_cleanup.query(ReliabilityPrediction).filter(
                ReliabilityPrediction.repository_id == repo_id
            ).delete()
            db_cleanup.query(ReliabilitySummary).filter(
                ReliabilitySummary.repo_id == repo_id
            ).delete()
            repo_cleanup = (
                db_cleanup.query(Repository).filter(Repository.id == repo_id).first()
            )
            if repo_cleanup:
                db_cleanup.delete(repo_cleanup)
            db_cleanup.commit()
        finally:
            db_cleanup.close()
