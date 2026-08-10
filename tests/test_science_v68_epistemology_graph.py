"""
Tests for CodeAtlas v6.8 - Scientific Epistemology, Knowledge Graph & Evidence Ranking Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.science_v68.epistemology_scientific_graph import EpistemologyScientificGraphEngine, ScientificCategory, SourceAuthorityLevel

client = TestClient(app)

def test_evidence_ranking_and_conflicts():
    engine = EpistemologyScientificGraphEngine()
    
    rank = engine.rank_evidence_authority("sci_obs_001")
    assert rank["source_authority"] == SourceAuthorityLevel.INTERNAL_MEASUREMENT
    assert rank["evidence_quality_score"] == 0.95
    
    conflicts = engine.detect_and_explain_knowledge_conflicts()
    assert len(conflicts["conflicts_detected"]) == 1
    assert conflicts["conflicts_detected"][0]["verdict"] == "RESOLVED_VIA_EMPIRICAL_MEASUREMENT"

def test_evidence_ranking_and_conflicts_api_endpoints():
    res_rank = client.get("/api/v1/science-v68/evidence/rank?node_id=sci_obs_001")
    assert res_rank.status_code == 200
    assert res_rank.json()["evidence_quality_score"] == 0.95

    res_cnflt = client.get("/api/v1/science-v68/knowledge/conflicts")
    assert res_cnflt.status_code == 200
    assert len(res_cnflt.json()["conflicts_detected"]) == 1
