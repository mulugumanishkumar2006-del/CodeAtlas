"""Integration test for Technical Debt & Risk Heatmap endpoints."""

import os
import shutil
import sys

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.config import settings
from app.core.database import SessionLocal
from app.main import app
from app.models.file import File
from app.models.relationship import Relationship
from app.models.repository import Repository
from app.models.repository_statistics import RepositoryStatistics
from app.models.user import User
from fastapi.testclient import TestClient


def main():
    # 1. Setup mock repository files on disk
    repo_id = "test_tech_debt_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)
    os.makedirs(cloned_dir, exist_ok=True)

    # We make a nested file structure to test our path aggregation tree builder
    os.makedirs(os.path.join(cloned_dir, "services"), exist_ok=True)
    os.makedirs(os.path.join(cloned_dir, "utils"), exist_ok=True)

    # Complex Python file in services/
    auth_content = """\
import os

def check_auth(token):
    # Multiple branch points to increase complexity
    if not token:
        return False
    if len(token) < 10:
        return False
    
    parts = token.split(".")
    if len(parts) != 3:
        return False
        
    header, payload, signature = parts
    if not header or not payload:
        return False
        
    for char in signature:
        if char == "$":
            return False
            
    return True
"""
    with open(
        os.path.join(cloned_dir, "services", "auth.py"), "w", encoding="utf-8"
    ) as f:
        f.write(auth_content)

    # Simple python helper in utils/
    helper_content = """\
def clean_string(s):
    return s.strip().lower()
"""
    with open(
        os.path.join(cloned_dir, "utils", "helper.py"), "w", encoding="utf-8"
    ) as f:
        f.write(helper_content)

    # 2. Setup mock user and repository in the database
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == "98765").first()
        if not user:
            user = User(
                id="98765",
                username="tech_debt_tester",
                name="Tech Debt Tester",
                email="tester@example.com",
            )
            db.add(user)
            db.commit()

        # Delete any previous repo records
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if repo:
            db.query(RepositoryStatistics).filter(
                RepositoryStatistics.repository_id == repo_id
            ).delete()
            db.query(Relationship).filter(
                Relationship.repository_id == repo_id
            ).delete()
            db.query(File).filter(File.repository_id == repo_id).delete()
            db.delete(repo)
            db.commit()

        repo = Repository(
            id=repo_id,
            name="tech-debt-repo",
            full_name="tester/tech-debt-repo",
            clone_url="https://github.com/tester/tech-debt-repo.git",
            status="cloned",
            user_id="98765",
        )
        db.add(repo)
        db.commit()
    finally:
        db.close()

    # 3. Create client and override authentication dependency
    client = TestClient(app)

    def override_get_current_user():
        db = SessionLocal()
        try:
            return db.query(User).filter(User.id == "98765").first()
        finally:
            db.close()

    app.dependency_overrides[get_current_user] = override_get_current_user

    # 4. Parse the repository to populate files & metrics tables
    print("=== Triggering repository parsing ===")
    parse_response = client.post(f"/api/v1/repositories/{repo_id}/parse")
    assert (
        parse_response.status_code == 200
    ), f"Expected 200 from parsing, got {parse_response.status_code}"
    print("Parsing successful!")

    # 5. Fetch Technical Debt Report
    print("\n=== Fetching Technical Debt Heatmap & Recommendations ===")
    response = client.get(f"/api/v1/repositories/{repo_id}/tech-debt")
    print(f"Status code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

    report = response.json()
    print("Report summary:")
    print(report["summary"])

    # Assert correct summary keys
    assert "average_debt_score" in report["summary"]
    assert "high_risk_components_count" in report["summary"]
    assert "circular_dependencies_count" in report["summary"]
    assert "average_doc_coverage" in report["summary"]

    # Assert correct scorecard keys (Feature 2)
    assert "scorecard" in report
    scorecard = report["scorecard"]
    print("Report scorecard:", scorecard)
    assert "architecture" in scorecard
    assert "maintainability" in scorecard
    assert "security" in scorecard
    assert "testing" in scorecard
    assert "performance" in scorecard
    assert "documentation" in scorecard
    assert "technical_debt" in scorecard
    assert "overall_health" in scorecard

    # Assert correct heatmap structure
    assert "heatmap" in report
    heatmap = report["heatmap"]
    assert heatmap["name"] == "root"
    assert heatmap["type"] == "directory"
    assert len(heatmap["children"]) > 0

    # Verify nesting structure exists
    child_names = [child["name"] for child in heatmap["children"]]
    print(f"Root child folders/files: {child_names}")
    assert "services" in child_names or "utils" in child_names

    # Verify details of nested children
    services_dir = next(c for c in heatmap["children"] if c["name"] == "services")
    assert services_dir["type"] == "directory"
    auth_file = services_dir["children"][0]
    assert auth_file["name"] == "auth.py"
    assert auth_file["type"] == "file"
    assert "score" in auth_file
    assert "value" in auth_file
    assert "cognitive_complexity" in auth_file
    assert "has_long_methods" in auth_file
    assert "has_god_classes" in auth_file
    print(
        f"services/auth.py risk score: {auth_file['score']}, code lines: {auth_file['value']}, cognitive: {auth_file['cognitive_complexity']}"
    )

    # Assert remediation recommendations
    assert "remediations" in report
    remediations = report["remediations"]
    print(f"\nDiscovered {len(remediations)} remediation tasks:")
    for plan in remediations:
        print(f"  File: {plan['file_path']}")
        print(f"  Risk Level: {plan['risk_level']}")
        print(f"  Reasons: {plan['reasons']}")
        print(f"  Action: {plan['action']}")
        print(
            f"  Effort: {plan['estimated_effort']}, Improvement: {plan['expected_improvement']}"
        )
        assert "risk_level" in plan
        assert "action" in plan
        assert "estimated_effort" in plan

    # 6. Verify specific new Technical Debt and Health API endpoints
    print("\n=== Fetching specific endpoints ===")

    # POST /api/v1/repositories/{repo_id}/technical-debt/analyze
    analyze_res = client.post(f"/api/v1/repositories/{repo_id}/technical-debt/analyze")
    assert (
        analyze_res.status_code == 200
    ), f"Expected 200 from analyze, got {analyze_res.status_code}"
    assert "scorecard" in analyze_res.json()
    print("POST /technical-debt/analyze: PASS")

    # GET /api/v1/repositories/{repo_id}/technical-debt/heatmap
    heatmap_res = client.get(f"/api/v1/repositories/{repo_id}/technical-debt/heatmap")
    assert (
        heatmap_res.status_code == 200
    ), f"Expected 200 from heatmap, got {heatmap_res.status_code}"
    assert heatmap_res.json()["name"] == "root"
    print("GET /technical-debt/heatmap: PASS")

    # GET /api/v1/repositories/{repo_id}/technical-debt/hotspots
    hotspots_res = client.get(f"/api/v1/repositories/{repo_id}/technical-debt/hotspots")
    assert (
        hotspots_res.status_code == 200
    ), f"Expected 200 from hotspots, got {hotspots_res.status_code}"
    assert "most_dangerous_file" in hotspots_res.json()
    print("GET /technical-debt/hotspots: PASS")

    # GET /api/v1/repositories/{repo_id}/technical-debt/recommendations
    recs_res = client.get(
        f"/api/v1/repositories/{repo_id}/technical-debt/recommendations"
    )
    assert (
        recs_res.status_code == 200
    ), f"Expected 200 from recommendations, got {recs_res.status_code}"
    assert isinstance(recs_res.json(), list)
    print("GET /technical-debt/recommendations: PASS")

    # GET /api/v1/repositories/{repo_id}/technical-debt/history
    hist_res = client.get(f"/api/v1/repositories/{repo_id}/technical-debt/history")
    assert (
        hist_res.status_code == 200
    ), f"Expected 200 from history, got {hist_res.status_code}"
    assert isinstance(hist_res.json(), list)
    print("GET /technical-debt/history: PASS")

    # GET /api/v1/repositories/{repo_id}/technical-debt/forecast
    forecast_res = client.get(f"/api/v1/repositories/{repo_id}/technical-debt/forecast")
    assert (
        forecast_res.status_code == 200
    ), f"Expected 200 from forecast, got {forecast_res.status_code}"
    assert isinstance(forecast_res.json(), list)
    print("GET /technical-debt/forecast: PASS")

    # GET /api/v1/repositories/{repo_id}/health
    health_res = client.get(f"/api/v1/repositories/{repo_id}/health")
    assert (
        health_res.status_code == 200
    ), f"Expected 200 from health, got {health_res.status_code}"
    assert "overall_health" in health_res.json()
    print("GET /health: PASS")

    # 7. Query PostgreSQL db directly to verify database records were saved properly
    db_verify = SessionLocal()
    try:
        from app.models.tech_debt import HealthScore, RiskForecast, TechnicalDebtReport

        reports = (
            db_verify.query(TechnicalDebtReport)
            .filter(TechnicalDebtReport.repo_id == repo_id)
            .all()
        )
        healths = (
            db_verify.query(HealthScore).filter(HealthScore.repo_id == repo_id).all()
        )
        forecasts = (
            db_verify.query(RiskForecast).filter(RiskForecast.repo_id == repo_id).all()
        )

        assert (
            len(reports) > 0
        ), "Expected at least one TechnicalDebtReport record saved in DB"
        assert len(healths) > 0, "Expected at least one HealthScore record saved in DB"
        assert len(forecasts) > 0, "Expected RiskForecast records saved in DB"
        print("PostgreSQL direct records verification: PASS")
    finally:
        db_verify.close()

    print("\nAll technical debt engine tests passed successfully!")

    # Cleanup test files on disk
    shutil.rmtree(cloned_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
