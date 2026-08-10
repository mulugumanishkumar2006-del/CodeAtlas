"""
Tests for CodeAtlas v3.7 - Pattern Mining, Engineering Maturity, AI Reasoning & Platform Self-Evolution
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.intelligence_advanced.patterns_maturity_benchmarks import PatternsMaturityAndCascadingEngine
from app.intelligence_advanced.ai_reasoning_self_evolution import AIReasoningAndSelfEvolutionEngine, AIReasoningStage

client = TestClient(app)

def test_pattern_mining_maturity_and_cascading():
    pm = PatternsMaturityAndCascadingEngine()
    patterns = pm.mine_engineering_patterns_and_antipatterns()
    assert len(patterns["positive_patterns"]) >= 1
    assert len(patterns["anti_patterns_detected"]) >= 1

    maturity = pm.assess_engineering_maturity_and_benchmark("Team-Payments")
    assert maturity["overall_maturity_level"] == "LEVEL_4_ADVANCED"
    assert maturity["maturity_dimensions"]["architecture"] == 90.0

    cascading = pm.simulate_cascading_failure("Redis Master Outage", "reg_us_east")
    assert len(cascading["cascading_path"]) == 4

def test_ai_reasoning_and_platform_self_evolution():
    ar = AIReasoningAndSelfEvolutionEngine()
    reasoning = ar.execute_structured_ai_reasoning("Checkout Outage Root Cause")
    assert len(reasoning["structured_stages"]) == 5
    assert reasoning["structured_stages"][0]["stage"] == AIReasoningStage.OBSERVATION

    drifts = ar.detect_systemic_drifts()
    assert "architecture_drift" in drifts["drifts_detected"]

    dead = ar.analyze_dead_systems_and_consolidation()
    assert len(dead["dead_systems_detected"]) >= 1

    self_evo = ar.run_platform_self_analysis_and_evolution()
    assert self_evo["codeatlas_self_analysis"]["own_architecture_status"] == "EXCELLENT"

def test_ai_reasoning_api_endpoints():
    res_reason = client.post("/api/v1/intelligence-advanced/ai/reason", json={"topic": "Checkout Outage Root Cause"})
    assert res_reason.status_code == 200
    assert len(res_reason.json()["structured_stages"]) == 5

    res_evo = client.get("/api/v1/intelligence-advanced/self-evolution")
    assert res_evo.status_code == 200
    assert "EXCELLENT" in res_evo.json()["codeatlas_self_analysis"]["own_architecture_status"]
