"""Tests for Phase 28 Engineering Digital Genome (EDG)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_dna_sequencer_pipeline():
    payload = {"repository_id": "main_backend_repo"}
    response = client.post("/api/v1/edg/sequence-dna", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert len(data["pipeline_stages"]) == 9
    assert data["pipeline_stages"][0]["stage_name"] == "Repository Ingestion"

    profile = data["genome_profile"]
    assert profile["organism_type"] == "High-Scale Resilient Cloud Native Microservice"
    assert "ARCH-12" in profile["dna_sequence_string"]
    assert len(profile["genes"]) == 10
    assert profile["health_compatibility_pct"] > 90.0


def test_get_repository_genome():
    response = client.get("/api/v1/edg/repository-genome/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert data["genome_verdict"] == "GENOME_SEQUENCING_SUCCESSFUL_OPTIMAL_ORGANISM"
