"""
Tests for CodeAtlas v3.3 - Engineering Graph, Cross-Tool AI & Workflows
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ecosystem.graph.unified_engineering_graph import UnifiedEngineeringGraph
from app.ecosystem.agents_and_workflows import CrossToolAIAndWorkflows

client = TestClient(app)

def test_engineering_graph_and_search():
    graph = UnifiedEngineeringGraph()
    graph_data = graph.query_graph()
    assert graph_data["total_nodes"] >= 10
    assert graph_data["total_edges"] >= 10

    search_res = graph.cross_system_search("Alice")
    assert len(search_res) >= 1
    assert search_res[0]["type"] == "Developer"

    palette_res = graph.universal_command_palette("investigate incident")
    assert palette_res["action"] == "INVESTIGATE_INCIDENT"

def test_cross_tool_ai_and_action_approvals():
    ai_engine = CrossToolAIAndWorkflows()
    reasoning = ai_engine.reason_across_tools("Why did production fail?")
    assert len(reasoning["sources_correlated"]) >= 5
    assert reasoning["confidence"] > 0.9

    action = ai_engine.initiate_cross_system_action("Rollback Deployment", ["GitHub Actions", "PagerDuty"], "dev1")
    assert action["stage"] == "PLAN"

    executed = ai_engine.authorize_and_execute_action(action["execution_id"], "lead_engineer")
    assert executed["stage"] == "AUDITED"
    assert len(executed["execution_results"]) == 3

def test_persona_workflows_and_roi():
    ai_engine = CrossToolAIAndWorkflows()
    dev_view = ai_engine.get_persona_workflow_view("developer")
    assert dev_view["persona"] == "Developer"

    cto_view = ai_engine.get_persona_workflow_view("cto")
    assert cto_view["persona"] == "CTO"

    roi = ai_engine.calculate_ecosystem_roi()
    assert "incidents_resolved_faster_pct" in roi

    flow = ai_engine.get_event_flow_visualization()
    assert len(flow["flow_steps"]) >= 8

def test_ecosystem_api_graph_and_ai():
    res = client.get("/api/v1/ecosystem/graph")
    assert res.status_code == 200
    assert res.json()["total_nodes"] >= 10

    reason_res = client.post("/api/v1/ecosystem/ai/reason", json="Why did production fail?")
    assert reason_res.status_code == 200

    wf_res = client.get("/api/v1/ecosystem/workflows/sre")
    assert wf_res.status_code == 200
    assert wf_res.json()["persona"] == "SRE"
