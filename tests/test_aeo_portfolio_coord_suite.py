"""Tests for AEO Cross-Repo Coordination, Macro Goal Translator, Portfolio Optimizer, and Program Manager."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_cross_repo_coordination():
    response = client.get("/api/v1/aeo-portfolio/cross-repo-coordination")
    assert response.status_code == 200
    data = response.json()
    assert len(data["duplicated_libraries"]) > 0
    assert len(data["inconsistent_apis"]) > 0
    assert data["overall_cross_repo_health_score"] > 90.0


def test_macro_business_goal_translator():
    payload = {
        "macro_goal": "Expand to Europe.",
        "target_region": "Europe (eu-central-1)",
    }
    response = client.post("/api/v1/aeo-portfolio/translate-macro-goal", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["execution_verdict"] == "MACRO_EUROPEAN_EXPANSION_BLUEPRINT_GENERATED"

    # Verify 7 pillar outputs
    assert len(data["gdpr_work"]) > 0
    assert len(data["auth_updates"]) > 0
    assert len(data["localization_tasks"]) > 0
    assert len(data["infra_changes"]) > 0
    assert len(data["monitoring_improvements"]) > 0
    assert len(data["security_checklist"]) > 0
    assert len(data["sprint_roadmap"]) > 0


def test_portfolio_optimizer():
    response = client.post("/api/v1/aeo-portfolio/optimize-portfolio", json={})
    assert response.status_code == 200
    data = response.json()
    assert len(data["prioritized_initiatives"]) > 0
    ranks = [p["rank"] for p in data["prioritized_initiatives"]]
    assert ranks == [1, 2, 3]


def test_ai_program_manager():
    response = client.get("/api/v1/aeo-portfolio/program-manager")
    assert response.status_code == 200
    data = response.json()
    assert data["active_projects_count"] > 0
    assert len(data["dependencies"]) > 0
    assert data["critical_path_bottleneck"] != ""
