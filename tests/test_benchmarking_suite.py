"""Tests for Features 21-30: Engineering Maturity & Benchmarking Suite."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_feature_21_evolution_comparison():
    payload = {
        "base_repo_id": "repo-alpha-123",
        "target_repo_id": "repo-beta-456",
    }
    response = client.post("/api/v1/benchmarking/evolution-compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "base_repo_name" in data
    assert "target_repo_name" in data
    assert len(data["metric_deltas"]) > 0
    assert "overall_comparison_verdict" in data


def test_feature_22_team_workflow_intelligence():
    response = client.get("/api/v1/benchmarking/team-workflow/test-repo-id")
    assert response.status_code == 200
    data = response.json()
    assert data["repo_id"] == "test-repo-id"
    assert data["pr_lead_time_hours"] > 0
    assert data["developer_burnout_risk"] in ["Low", "Moderate", "High"]
    assert len(data["workflow_bottlenecks"]) > 0


def test_feature_23_engineering_maturity_model():
    response = client.get("/api/v1/benchmarking/engineering-maturity/test-repo-id")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_maturity_level"] in [1, 2, 3, 4, 5]
    assert len(data["pillars"]) == 6
    assert data["industry_percentile"] > 0


def test_feature_24_tech_debt_benchmarking():
    response = client.get("/api/v1/benchmarking/tech-debt/test-repo-id")
    assert response.status_code == 200
    data = response.json()
    assert data["total_debt_hours"] >= 0
    assert data["financial_debt_cost_usd"] >= 0
    assert len(data["categories"]) > 0


def test_feature_25_scalability_benchmarking():
    response = client.get("/api/v1/benchmarking/scalability/test-repo-id")
    assert response.status_code == 200
    data = response.json()
    assert data["scalability_readiness_score"] >= 0
    assert data["max_estimated_rps"] > 0
    assert len(data["bottlenecks"]) > 0


def test_feature_26_reliability_benchmarking():
    response = client.get("/api/v1/benchmarking/reliability/test-repo-id")
    assert response.status_code == 200
    data = response.json()
    assert data["reliability_index"] >= 0
    assert data["fallback_safety_rating"] in ["A+", "A", "B", "C", "F"]


def test_feature_27_observability_benchmarking():
    response = client.get("/api/v1/benchmarking/observability/test-repo-id")
    assert response.status_code == 200
    data = response.json()
    assert data["observability_score"] >= 0
    assert data["tracing_coverage_pct"] >= 0


def test_feature_28_release_maturity_benchmarking():
    response = client.get("/api/v1/benchmarking/release-maturity/test-repo-id")
    assert response.status_code == 200
    data = response.json()
    assert data["release_maturity_score"] >= 0
    assert data["deployment_frequency_dora_tier"] in ["Elite", "High", "Medium", "Low"]


def test_feature_29_ai_confidence_engine():
    payload = {
        "prompt_or_context": "Refactor authentication token vault to gRPC service interface.",
        "proposed_code_changes": "class AuthVaultClient:\n    pass\n",
    }
    response = client.post("/api/v1/benchmarking/ai-confidence", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["confidence_score_pct"] > 0
    assert len(data["evidence_trail"]) > 0
    assert "explainable_rationale" in data


def test_feature_30_industry_recommendations():
    for industry in ["FinTech", "HealthTech", "CyberSecurity", "Cloud-Native SaaS"]:
        response = client.get(
            f"/api/v1/benchmarking/industry-recommendations?industry={industry}"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["target_industry"] == industry
        assert data["industry_architecture_align_score"] > 0
        assert len(data["compliance_standards"]) > 0
        assert len(data["tailored_recommendations"]) > 0
