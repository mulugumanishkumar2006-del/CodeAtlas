"""Tests for Phase 28 Organism Finale Features 31-50 and WOW Feature Repository DNA Explorer."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_dna_explorer_profile():
    response = client.get("/api/v1/edg-organism/dna-explorer/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert data["architecture"]["score_pct"] == 96.0
    assert "██████████ 96%" in data["architecture"]["gauge_string"]
    assert data["security"]["score_pct"] == 82.0
    assert "████████░░ 82%" in data["security"]["gauge_string"]
    assert data["scalability"]["score_pct"] == 91.0
    assert data["testing"]["score_pct"] == 63.0
    assert data["reliability"]["score_pct"] == 90.0
    assert data["ai_readiness"]["score_pct"] == 75.0
    assert data["observability"]["score_pct"] == 89.0


def test_mutation_replay():
    response = client.get("/api/v1/edg-organism/mutation-replay/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert data[0]["replay_step"] == 1


def test_genome_diff():
    response = client.get("/api/v1/edg-organism/genome-diff/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    assert data[0]["gene_code"] == "SEC-15"


def test_executive_report():
    response = client.get("/api/v1/edg-organism/executive-report/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_health_score_pct"] == 94.8
    assert data["engineering_biodiversity_score"] == 88.5


def test_all_organism_features():
    response = client.get(
        "/api/v1/edg-organism/all-organism-features/main_backend_repo"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert data["dna_explorer"]["architecture"]["score_pct"] == 96.0
    assert data["organism_verdict"] == "ENTERPRISE_SOFTWARE_ORGANISM_EVOLUTION_OPTIMAL"
