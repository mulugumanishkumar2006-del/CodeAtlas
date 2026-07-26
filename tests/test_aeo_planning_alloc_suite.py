"""Tests for AI Collaboration, Sprint Planner, and Team Allocation Engines."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_ai_collaboration_matrix():
    response = client.get(
        "/api/v1/aeo-planning/collaboration-matrix?initiative=50M%20User%20Scale"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["role_contributions"]) == 7
    roles = [r["role_name"] for r in data["role_contributions"]]
    assert "CTO AI" in roles
    assert "Architect AI" in roles
    assert "Security Engineer AI" in roles
    assert "SRE AI" in roles
    assert data["consensus_verdict"] != ""


def test_ai_sprint_planner():
    payload = {
        "sprint_name": "Sprint 42 - Multi-Region Scale",
        "target_duration_weeks": 2,
    }
    response = client.post("/api/v1/aeo-planning/plan-sprint", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["sprint_name"] == "Sprint 42 - Multi-Region Scale"
    assert data["total_story_points"] > 0
    assert len(data["backlog_tickets"]) > 0
    assert len(data["sprint_risks"]) > 0
    assert len(data["milestones"]) > 0


def test_ai_team_allocation():
    payload = {
        "project_initiative": "50 Million User Multi-Region Migration",
    }
    response = client.post("/api/v1/aeo-planning/allocate-teams", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["team_mappings"]) > 0
    assert len(data["skill_gaps"]) > 0
    assert (
        data["resource_balancing_verdict"] == "RESOURCE_LOAD_BALANCED_CAPACITY_OPTIMAL"
    )
