"""Tests for Features 41-50: Software Evolution Atlas & Command Suite."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_feature_41_interactive_pattern_explorer():
    response = client.get("/api/v1/atlas-command/pattern-explorer")
    assert response.status_code == 200
    data = response.json()
    assert len(data["patterns"]) > 0
    assert data["total_patterns"] > 0


def test_feature_42_architecture_recommendation_dashboard():
    response = client.get("/api/v1/atlas-command/recommendations-dashboard")
    assert response.status_code == 200
    data = response.json()
    assert len(data["recommendations"]) > 0


def test_feature_43_software_evolution_atlas():
    """Test Feature 43: Software Evolution Atlas (🌟 WOW Feature)."""
    response = client.get("/api/v1/atlas-command/software-evolution-atlas")
    assert response.status_code == 200
    data = response.json()
    assert len(data["globe_nodes"]) > 0
    assert "banking" in data["domains_detail"]
    banking = data["domains_detail"]["banking"]
    assert len(banking["common_architectures"]) > 0
    assert len(banking["common_databases"]) > 0
    assert len(banking["scaling_strategies"]) > 0
    assert len(banking["failure_patterns"]) > 0
    assert len(banking["best_practices"]) > 0


def test_feature_44_engineering_radar():
    response = client.get("/api/v1/atlas-command/engineering-radar/test-repo-id")
    assert response.status_code == 200
    data = response.json()
    assert len(data["dimensions"]) == 6
    assert data["overall_radar_score"] > 0


def test_feature_45_repository_dna_comparison():
    response = client.post(
        "/api/v1/atlas-command/dna-comparison?repo_a_id=repo-a&repo_b_id=repo-b"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["overall_dna_similarity_pct"] > 0
    assert len(data["genes"]) > 0


def test_feature_46_enterprise_benchmark_reports():
    response = client.get("/api/v1/atlas-command/enterprise-reports")
    assert response.status_code == 200
    data = response.json()
    assert data["portfolio_health_score"] > 0


def test_feature_47_ai_strategy_reports():
    response = client.get("/api/v1/atlas-command/ai-strategy-reports")
    assert response.status_code == 200
    data = response.json()
    assert len(data["key_modernization_goals"]) > 0


def test_feature_48_continuous_learning_engine():
    response = client.post("/api/v1/atlas-command/continuous-learning/trigger")
    assert response.status_code == 200
    data = response.json()
    assert data["engine_status"] == "SYNCED"


def test_feature_49_plugin_marketplace_for_patterns():
    response = client.get("/api/v1/atlas-command/plugin-marketplace")
    assert response.status_code == 200
    data = response.json()
    assert len(data["plugins"]) > 0


def test_feature_50_engineering_intelligence_dashboard():
    response = client.get("/api/v1/atlas-command/intelligence-dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["global_health_index"] > 0
    assert data["system_readiness_verdict"] == "OPTIMAL_ELITE_OPERATIONAL"
