"""Tests for Phase 26: Autonomous Engineering Organization (AEO)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_aeo_list_executive_roles():
    response = client.get("/api/v1/aeo/executive-roles")
    assert response.status_code == 200
    roles = response.json()
    assert len(roles) == 8
    role_ids = [r["id"] for r in roles]
    assert "cto" in role_ids
    assert "architect" in role_ids
    assert "pm" in role_ids
    assert "tech_lead" in role_ids
    assert "sre" in role_ids
    assert "qa" in role_ids
    assert "security" in role_ids
    assert "platform" in role_ids


def test_aeo_coordinate_organization():
    payload = {
        "org_name": "Global Enterprise Org",
        "active_teams_count": 12,
    }
    response = client.post("/api/v1/aeo/coordinate-org", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert (
        data["ai_vp_engineering_verdict"]
        == "AUTONOMOUS_ORGANIZATION_COORDINATION_OPTIMAL"
    )
    assert len(data["exec_roles"]) == 8
    assert len(data["duplication_alerts"]) > 0
    assert len(data["alignment_issues"]) > 0
    assert len(data["execution_actions"]) > 0
    assert data["metrics"]["organization_health_index"] > 90.0
    assert data["metrics"]["velocity_multiplier"] > 1.5
