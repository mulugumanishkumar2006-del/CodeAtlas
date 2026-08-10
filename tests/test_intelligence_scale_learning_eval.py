"""
Tests for CodeAtlas v3.4 - Learning Engine, Copilot, Health Scoring & AI Eval API
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.intelligence_scale.learning_and_copilot import LearningAndCopilotEngine
from app.intelligence_scale.analytics_eval_platform import AnalyticsEvalPlatformEngine

client = TestClient(app)

def test_learning_and_copilot():
    copilot = LearningAndCopilotEngine()
    feed = copilot.get_proactive_feed()
    assert len(feed) >= 2

    brief = copilot.generate_daily_brief()
    assert brief["metrics"]["changes_merged"] == 14

    synth = copilot.synthesize_multi_agent_investigation("INC-9941")
    assert len(synth["agent_contributions"]) == 4

def test_analytics_and_eval_platform():
    platform = AnalyticsEvalPlatformEngine()
    graph_analytics = platform.calculate_graph_analytics()
    assert graph_analytics["bus_factor_analysis"][0]["bus_factor"] == 1

    health = platform.calculate_overall_engineering_health_score()
    assert health["overall_health_score"] > 80.0
    assert len(health["dimension_scores"]) == 8

    eval_metrics = platform.get_ai_eval_metrics()
    assert eval_metrics["ai_evaluation"]["accuracy"] == "96.4%"

def test_intelligence_scale_api_endpoints():
    res_tg = client.get("/api/v1/intelligence-scale/temporal-graph")
    assert res_tg.status_code == 200
    assert res_tg.json()["supported_entity_types"] == 23

    res_nl = client.get("/api/v1/intelligence-scale/search/nl?query=Why+is+checkout+slow")
    assert res_nl.status_code == 200

    res_rec = client.get("/api/v1/intelligence-scale/recommendations")
    assert res_rec.status_code == 200
    assert len(res_rec.json()) == 3

    res_hs = client.get("/api/v1/intelligence-scale/health-score")
    assert res_hs.status_code == 200
    assert res_hs.json()["overall_health_score"] > 80.0
