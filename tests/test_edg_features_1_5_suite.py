"""Tests for Phase 28 Features 1-5 (Repository DNA Fingerprint, Mutation Detector, Evolution Tracker, Healthy Mutation Detector)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_get_fingerprint():
    response = client.get("/api/v1/edg-primary/fingerprint/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert "dna_sha256_" in data["dna_sha256_hash"]
    assert data["base_pairs_count"] == 4200


def test_detect_mutations():
    response = client.get("/api/v1/edg-primary/detect-mutations")
    assert response.status_code == 200
    data = response.json()
    assert data["total_commits_analyzed"] == 142
    assert data["good_mutations_count"] == 128
    assert data["bad_mutations_count"] == 14
    assert len(data["mutations"]) > 0


def test_evolution_tracker():
    response = client.get("/api/v1/edg-primary/evolution-tracker")
    assert response.status_code == 200
    data = response.json()
    assert data["total_snapshots"] >= 2
    assert data["evolution_trend"] == "POSITIVE_GENETIC_SELECTION"


def test_healthy_mutations():
    response = client.get("/api/v1/edg-primary/healthy-mutations")
    assert response.status_code == 200
    data = response.json()
    assert data["top_beneficial_mutations_count"] > 0
    assert data["healthy_verdict"] == "HEALTHY_ARCHITECTURAL_SELECTION_CONFIRMED"


def test_all_primary_features():
    response = client.get("/api/v1/edg-primary/all-primary-features/main_backend_repo")
    assert response.status_code == 200
    data = response.json()
    assert data["repository_id"] == "main_backend_repo"
    assert data["mutations"]["good_mutations_count"] == 128
