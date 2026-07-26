"""Tests for Phase 28 Features 11-15 (DNA Stability, AI Genetic Advisor, Species Classification, Repository Family Tree, Genome Heatmap)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_get_dna_stability():
    response = client.get("/api/v1/edg-dynamics/dna-stability/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert data["stability_index_pct"] == 94.2
    assert data["volatility_rating"] == "Low"


def test_recommend_mutations():
    response = client.get("/api/v1/edg-dynamics/ai-genetic-advisor")
    assert response.status_code == 200
    data = response.json()
    assert data["total_recommendations"] > 0
    assert len(data["recommendations"]) > 0
    assert "gRPC" in data["recommendations"][0]["proposed_mutation"]


def test_classify_species():
    response = client.get(
        "/api/v1/edg-dynamics/species-classification/main_backend_repo"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["primary_species"] == "FinTech High-Frequency Vault"
    assert len(data["supported_sectors"]) == 8
    assert "Healthcare" in data["supported_sectors"]
    assert "Gaming" in data["supported_sectors"]


def test_get_family_tree():
    response = client.get("/api/v1/edg-dynamics/family-tree/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["lineage_nodes_count"] >= 3
    assert len(data["ancestry_tree"]) >= 3


def test_get_genome_heatmap():
    response = client.get("/api/v1/edg-dynamics/genome-heatmap/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["strengths_count"] > 0
    assert data["weaknesses_count"] > 0
    assert len(data["heatmap_grid"]) > 0


def test_all_dynamics_features():
    response = client.get(
        "/api/v1/edg-dynamics/all-dynamics-features/main_backend_repo"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert data["stability"]["stability_index_pct"] == 94.2
    assert data["species"]["primary_species"] == "FinTech High-Frequency Vault"
