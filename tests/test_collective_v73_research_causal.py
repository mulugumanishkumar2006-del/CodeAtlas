"""
Tests for CodeAtlas v7.3 - Research Question Graph, Causal Reasoning & Forecast Calibration Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.collective_v73.research_hypotheses_causal_forecasting import ResearchHypothesesCausalForecastingEngine, CausalityLevel

client = TestClient(app)

def test_research_graph_and_causal_calibration():
    engine = ResearchHypothesesCausalForecastingEngine()
    
    qg = engine.evaluate_research_question_graph()
    assert qg["research_graph"]["normalized_benchmark_result"]["normalized_across_nodes"] is True
    assert qg["causality_classification"] == CausalityLevel.CAUSAL_EVIDENCE
    
    cal = engine.evaluate_causal_reasoning_and_prediction_calibration("P99_LATENCY")
    assert cal["calibration_metrics"]["calibration_verdict"] == "WELL_CALIBRATED (No overconfidence detected)"

def test_research_graph_and_causal_calibration_api_endpoints():
    res_qg = client.get("/api/v1/collective-v73/research/question-graph")
    assert res_qg.status_code == 200
    assert res_qg.json()["causality_classification"] == CausalityLevel.CAUSAL_EVIDENCE

    res_cal = client.get("/api/v1/collective-v73/causal-reasoning/calibration")
    assert res_cal.status_code == 200
    assert "WELL_CALIBRATED" in res_cal.json()["calibration_metrics"]["calibration_verdict"]
