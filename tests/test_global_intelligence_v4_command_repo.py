"""
Tests for CodeAtlas v4.0 - Command Center, Priority Engine & Repository/Architecture Intelligence
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.global_intelligence_v4.command_center_feed import CommandCenterAndPriorityEngine
from app.global_intelligence_v4.repository_architecture_knowledge import RepositoryArchitectureAndKnowledgeEngine

client = TestClient(app)

def test_command_center_and_eight_dimension_health():
    cmd = CommandCenterAndPriorityEngine()
    cc = cmd.get_engineering_command_center_overview()
    assert cc["platform_status"] == "OPERATIONAL"
    assert cc["eight_dimension_health"]["architecture"] == 88.4
    assert cc["eight_dimension_health"]["reliability"] == 99.8

    probs = cmd.get_prioritized_engineering_problems()
    assert len(probs["prioritized_problems"]) >= 2
    assert probs["prioritized_problems"][0]["rank"] == 1

    feed = cmd.get_intelligent_engineering_feed()
    assert len(feed["feed_events"]) >= 1

def test_repository_and_architecture_intelligence():
    rak = RepositoryArchitectureAndKnowledgeEngine()
    repo = rak.get_repository_intelligence("payment-service")
    assert repo["health_score"] == 92.4
    assert "code_intelligence" in repo

    arch = rak.get_architecture_map_and_service_topology()
    assert arch["service_count"] == 28
    assert arch["architecture_drift"]["drift_status"] == "LOW_DRIFT"

    decisions = rak.get_decision_and_documentation_intelligence()
    assert len(decisions["adrs_tracked"]) >= 1

def test_command_center_and_repo_api_endpoints():
    res_cc = client.get("/api/v1/global-intelligence-v4/command-center")
    assert res_cc.status_code == 200
    assert res_cc.json()["eight_dimension_health"]["reliability"] == 99.8

    res_arch = client.get("/api/v1/global-intelligence-v4/architecture/map")
    assert res_arch.status_code == 200
    assert res_arch.json()["service_count"] == 28
