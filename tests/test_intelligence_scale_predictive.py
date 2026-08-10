"""
Tests for CodeAtlas v3.4 - Patterns, Risk Model, Predictive Engine & Simulation Studio
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.intelligence_scale.pattern_and_risk_engine import PatternAndRiskEngine, RiskDimension
from app.intelligence_scale.predictive_engineering import PredictiveEngineeringEngine
from app.intelligence_scale.recommendation_and_simulation import RecommendationAndSimulationEngine

client = TestClient(app)

def test_patterns_and_9dim_risk():
    engine = PatternAndRiskEngine()
    patterns = engine.detect_engineering_patterns()
    assert "failure_patterns" in patterns
    assert "architecture_patterns" in patterns

    risk_res = engine.calculate_unified_risk_model("payment-service")
    assert len(risk_res["dimension_breakdown"]) == 9
    assert risk_res["criticality_level"] in ["CRITICAL", "HIGH", "MEDIUM"]

    blast = engine.calculate_blast_radius("redis-cluster-prod")
    assert blast["blast_radius_score"] == 8.5
    assert len(blast["affected_downstream_services"]) == 4

def test_predictive_engineering():
    pred = PredictiveEngineeringEngine()
    incident_pred = pred.predict_incident_probability("payment-service")
    assert incident_pred["probability"] > 0.5
    assert len(incident_pred["contributing_factors"]) == 3

    debt_fc = pred.forecast_tech_debt_and_architecture("payment-service")
    assert "+23.3%" in debt_fc["tech_debt_forecast"]["growth_rate_pct"]

    cost_fc = pred.forecast_capacity_and_cost()
    assert "$42,000" in cost_fc["cost_forecast"]["current_monthly_spend"]

def test_recommendation_and_simulation_studio():
    rec_sim = RecommendationAndSimulationEngine()
    p_score = rec_sim.calculate_priority_score(risk=8.0, impact=9.0, confidence=0.95, effort=2.0)
    assert p_score == 34.2 # (8 * 9 * 0.95) / 2 = 34.2

    recs = rec_sim.get_recommendations()
    assert len(recs) == 3
    # Top recommendation should have highest priority score
    assert recs[0]["priority_score"] >= recs[1]["priority_score"]

    sim = rec_sim.simulate_change("DEPLOYMENT", "payment-service")
    assert sim["simulation_id"].startswith("sim_")

    arch_comp = rec_sim.compare_architectures("Monolith", "Event-Driven Async Microservices")
    assert arch_comp["recommendation"] == "PROCEED WITH PROPOSED ARCHITECTURE"
