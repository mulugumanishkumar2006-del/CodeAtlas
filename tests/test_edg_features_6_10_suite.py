"""Tests for Phase 28 Features 6-10 (Dangerous Mutation Detector, DNA Comparison, Genome Similarity, Evolution Score, Genetic Drift)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_detect_dangerous_mutations():
    response = client.get("/api/v1/edg-secondary/detect-dangerous-mutations")
    assert response.status_code == 200
    data = response.json()
    assert data["total_prs_intercepted"] > 0
    assert len(data["alerts"]) > 0
    assert data["alerts"][0]["risk_level"] in ["Critical", "High"]


def test_compare_dna():
    response = client.get("/api/v1/edg-secondary/compare-dna/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["target_repository_id"] == "main_backend_repo"
    assert len(data["comparisons"]) == 3
    netflix = next(
        c for c in data["comparisons"] if "Netflix" in c["company_repo_name"]
    )
    assert netflix["architecture_match_pct"] == 92.4


def test_genome_similarity():
    response = client.get("/api/v1/edg-secondary/genome-similarity/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["matches_count"] > 0
    assert data["matches"][0]["similarity_score_pct"] == 94.2


def test_evolution_score():
    response = client.get("/api/v1/edg-secondary/evolution-score/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["architecture_improvement_score_pct"] == 34.5
    assert data["code_quality_index"] == 94.2


def test_genetic_drift():
    response = client.get("/api/v1/edg-secondary/genetic-drift/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["multi_year_drift_rate_pct_per_year"] == 2.4
    assert data["drift_risk_assessment"] == "Low Architectural Drift"


def test_all_secondary_features():
    response = client.get(
        "/api/v1/edg-secondary/all-secondary-features/main_backend_repo"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert data["evolution_score"]["architecture_improvement_score_pct"] == 34.5
