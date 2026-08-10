"""
Tests for CodeAtlas v4.2 - Org Hierarchy, Ownership Gaps, Bus Factor & Bottlenecks
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.enterprise_os_v42.org_model_bus_factor import OrganizationModelAndBusFactorEngine

client = TestClient(app)

def test_org_hierarchy_and_connected_graph():
    engine = OrganizationModelAndBusFactorEngine()
    org = engine.get_organization_hierarchy_and_graph()
    assert org["organization_name"] == "Acme Enterprise Corp"
    assert org["hierarchy_tree"]["business_unit"] == "Payments & Commerce"
    assert len(org["connected_graph_path"]) == 7

def test_ownership_gaps_and_responsible_bus_factor():
    engine = OrganizationModelAndBusFactorEngine()
    bus = engine.detect_ownership_gaps_and_bus_factor("Team-Payments")
    assert bus["responsible_bus_factor"]["score"] == 1
    assert len(bus["ownership_gaps_detected"]) >= 1

    bottlenecks = engine.analyze_cross_team_bottlenecks()
    assert len(bottlenecks["cross_team_dependencies"]) >= 1
    assert bottlenecks["cross_team_dependencies"][0]["bottleneck_type"] == "PR_REVIEW_DEPENDENCY"

def test_org_hierarchy_api_endpoints():
    res_org = client.get("/api/v1/enterprise-os-v42/org/hierarchy")
    assert res_org.status_code == 200
    assert res_org.json()["organization_name"] == "Acme Enterprise Corp"

    res_bus = client.get("/api/v1/enterprise-os-v42/bus-factor?team=Team-Payments")
    assert res_bus.status_code == 200
    assert res_bus.json()["responsible_bus_factor"]["score"] == 1
