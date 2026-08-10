"""
Tests for CodeAtlas v7.3 - Experience Ingestion, Evidence Quality, Pattern/Anti-Pattern Discovery & Playbooks Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.collective_v73.experience_evidence_patterns_playbooks import ExperienceEvidencePatternsPlaybooksEngine

client = TestClient(app)

def test_experience_ingestion_and_pattern_discovery():
    engine = ExperienceEvidencePatternsPlaybooksEngine()
    
    exp = engine.ingest_and_score_engineering_experience("INCIDENT", "DB connection limit spike")
    assert exp["experience_type"] == "INCIDENT"
    assert exp["evidence_model"]["evidence_quality_score"] == 0.94
    
    pats = engine.discover_patterns_and_antipatterns()
    assert len(pats["discovered_patterns"]) >= 1
    assert pats["discovered_patterns"][0]["type"] == "RECOMMENDED_PATTERN"
    assert len(pats["discovered_antipatterns"]) >= 1

def test_experience_and_patterns_api_endpoints():
    res_exp = client.post("/api/v1/collective-v73/experience/ingest", json={
        "exp_type": "INCIDENT",
        "summary": "DB connection limit spike"
    })
    assert res_exp.status_code == 200
    assert res_exp.json()["evidence_model"]["evidence_quality_score"] == 0.94

    res_pats = client.get("/api/v1/collective-v73/patterns/discover")
    assert res_pats.status_code == 200
    assert len(res_pats.json()["discovered_patterns"]) >= 1
