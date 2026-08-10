"""
Tests for CodeAtlas v7.4 - Evaluation Framework, Discovery Engine & AI Composition Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.marketplace_v74.evaluation_discovery_ai_composer import EvaluationDiscoveryAIComposerEngine

client = TestClient(app)

def test_evaluation_and_ai_composer():
    engine = EvaluationDiscoveryAIComposerEngine()
    
    ev = engine.evaluate_asset_performance("ast_k8s_latency_agent")
    assert ev["evaluation_matrix"]["correctness_score"] == 0.98
    assert ev["evaluation_matrix"]["performance_latency_ms"] == 42.0
    
    comp = engine.compose_workflow_via_ai("Database latency pipeline")
    assert len(comp["proposed_workflow"]["composed_assets"]) == 2
    assert comp["proposed_workflow"]["pre_execution_simulation"]["simulated_risk_level"] == "LOW"

def test_evaluation_and_ai_composer_api_endpoints():
    res_ev = client.get("/api/v1/marketplace-v74/evaluation/matrix?asset_id=ast_k8s_latency_agent")
    assert res_ev.status_code == 200
    assert res_ev.json()["evaluation_matrix"]["correctness_score"] == 0.98

    res_comp = client.post("/api/v1/marketplace-v74/ai-composer/compose", json={"prompt": "Database latency pipeline"})
    assert res_comp.status_code == 200
    assert len(res_comp.json()["proposed_workflow"]["composed_assets"]) == 2
