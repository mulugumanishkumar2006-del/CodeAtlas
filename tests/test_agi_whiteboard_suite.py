"""Tests for Phase 25 Finale Features 41-60: Signature AI Architecture Whiteboard & Command Center."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_signature_ai_architecture_whiteboard():
    payload = {
        "prompt": "Redesign this architecture for 50 million users.",
        "target_scale": "50,000,000 Users",
    }
    response = client.post("/api/v1/agi-whiteboard/redesign-whiteboard", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "SIGNATURE_WHITEBOARD_GENERATED"

    # Verify all 8 whiteboard layers exist
    assert len(data["diagram"]["nodes"]) == 6
    assert len(data["diagram"]["edges"]) == 5
    assert len(data["migration_phases"]) == 4
    assert data["cost_estimate"]["total_scale_budget_usd"] > 0
    assert len(data["risk_matrix"]) > 0
    assert len(data["sprint_backlog"]) > 0
    assert len(data["hiring_plan"]) > 0
    assert len(data["infra_plan"]) > 0
    assert data["rollback_strategy"]["automated_switchback_seconds"] > 0


def test_natural_language_planning():
    response = client.post(
        "/api/v1/agi-whiteboard/natural-language-plan?query=Scale to 50M users"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["generated_plan_steps"]) > 0


def test_ai_sprint_designer():
    response = client.post(
        "/api/v1/agi-whiteboard/sprint-designer?target_sprint=Sprint 42"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_points"] > 0


def test_executive_briefings():
    response = client.get("/api/v1/agi-whiteboard/executive-briefings")
    assert response.status_code == 200
    data = response.json()
    assert data["roi_pct"] > 0


def test_genome_explorer():
    response = client.get("/api/v1/agi-whiteboard/genome-explorer")
    assert response.status_code == 200
    data = response.json()
    assert data["genome_health_score"] > 90.0


def test_confidence_heatmap():
    response = client.get("/api/v1/agi-whiteboard/confidence-heatmap")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_confidence_pct"] > 90.0
