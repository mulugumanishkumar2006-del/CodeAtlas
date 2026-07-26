"""Tests for Features 31-40: Knowledge Graph & Architecture Intelligence Suite."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_feature_31_knowledge_graph_explorer():
    response = client.get("/api/v1/knowledge-insights/graph-explorer")
    assert response.status_code == 200
    data = response.json()
    assert len(data["nodes"]) > 0
    assert len(data["edges"]) > 0
    assert data["total_nodes"] > 0


def test_feature_32_technology_lifecycle_tracking():
    response = client.get("/api/v1/knowledge-insights/tech-lifecycle")
    assert response.status_code == 200
    data = response.json()
    assert data["total_tracked_technologies"] > 0
    assert len(data["technology_radar"]) > 0


def test_feature_33_emerging_technology_alerts():
    response = client.get("/api/v1/knowledge-insights/emerging-alerts")
    assert response.status_code == 200
    data = response.json()
    assert len(data["alerts"]) > 0


def test_feature_34_architecture_success_stories():
    response = client.get("/api/v1/knowledge-insights/success-stories")
    assert response.status_code == 200
    data = response.json()
    assert len(data["stories"]) > 0
    assert data["stories"][0]["latency_reduction_pct"] > 0


def test_feature_35_engineering_case_studies():
    response = client.get("/api/v1/knowledge-insights/case-studies")
    assert response.status_code == 200
    data = response.json()
    assert len(data["case_studies"]) > 0


def test_feature_36_ai_learning_feedback_loop():
    payload = {
        "recommendation_id": "REC-789",
        "rating": "accepted",
        "user_feedback_notes": "Great recommendation! Refactored service cleanly.",
    }
    response = client.post("/api/v1/knowledge-insights/learning-feedback", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PROCESSED"
    assert "feedback_id" in data


def test_feature_37_pattern_confidence_scoring():
    response = client.get(
        "/api/v1/knowledge-insights/pattern-confidence/pattern-eda-001"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["overall_confidence_score"] > 0
    assert data["verdict"] in ["HIGHLY_RECOMMENDED", "CONDITIONAL", "DEPRECATED"]


def test_feature_38_historical_trend_visualization():
    response = client.get("/api/v1/knowledge-insights/historical-trends/test-repo-id")
    assert response.status_code == 200
    data = response.json()
    assert len(data["metric_points"]) > 0
    assert data["net_tech_debt_reduction_pct"] > 0


def test_feature_39_recommendation_explanations():
    response = client.get("/api/v1/knowledge-insights/explain-recommendation/REC-101")
    assert response.status_code == 200
    data = response.json()
    assert len(data["decision_factors"]) > 0
    assert "explainable_summary" in data


def test_feature_40_cross_domain_engineering_insights():
    response = client.get("/api/v1/knowledge-insights/cross-domain-insights")
    assert response.status_code == 200
    data = response.json()
    assert len(data["insights"]) > 0
    assert data["total_insights"] > 0
