"""Tests for Phase 28 Finale Features 16-30 (Code Chromosome Explorer and 14 Specialized Genomes)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_get_chromosomes():
    response = client.get("/api/v1/edg-lab/chromosomes/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4
    assert data[0]["chromosome_id"] == "CHR-01"
    assert "Security" in data[0]["name"]


def test_get_specialized_genomes():
    response = client.get("/api/v1/edg-lab/specialized-genomes/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 14
    dep_genome = next(g for g in data if g["category_name"] == "Dependency Genome")
    assert dep_genome["score_out_of_20"] == 14
    sec_genome = next(g for g in data if g["category_name"] == "Security Genome")
    assert sec_genome["score_out_of_20"] == 18


def test_all_lab_features():
    response = client.get("/api/v1/edg-lab/all-lab-features/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert len(data["chromosomes"]) == 4
    assert len(data["specialized_genomes"]) == 14
    assert (
        data["genome_sequencing_verdict"]
        == "FULL_14_SPECIALIZED_GENOMES_AND_CHROMOSOMES_SEQUENCED"
    )
