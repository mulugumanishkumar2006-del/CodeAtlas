"""
Tests for CodeAtlas v6.5 - Organization Model, Engineering Hierarchy, Product-Engineering Graph & Ownership Health Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.autonomous_org_v65.org_hierarchy_product_graph import OrgHierarchyProductGraphEngine, OrganizationLevel

client = TestClient(app)

def test_hierarchy_product_graph_and_ownership_health():
    engine = OrgHierarchyProductGraphEngine()
    
    hierarchy = engine.get_engineering_hierarchy()
    assert hierarchy["organization_level"] == OrganizationLevel.ORGANIZATION
    assert hierarchy["total_layers"] == 7
    
    product_graph = engine.get_product_engineering_graph("prod_checkout_platform")
    assert product_graph["product_name"] == "Global Checkout Platform"
    assert "checkout-service" in product_graph["services_involved"]
    
    health = engine.evaluate_ownership_health_and_bus_factor()
    assert health["evaluated_services_count"] == 28
    assert len(health["knowledge_bus_factor_risks"]) == 1
    assert health["overall_ownership_score"] == 92.5

def test_hierarchy_and_product_graph_api_endpoints():
    res_hier = client.get("/api/v1/autonomous-org-v65/hierarchy")
    assert res_hier.status_code == 200
    assert res_hier.json()["total_layers"] == 7

    res_prod = client.get("/api/v1/autonomous-org-v65/product-graph?product_id=prod_checkout_platform")
    assert res_prod.status_code == 200
    assert res_prod.json()["product_name"] == "Global Checkout Platform"

    res_own = client.get("/api/v1/autonomous-org-v65/ownership/health")
    assert res_own.status_code == 200
    assert res_own.json()["overall_ownership_score"] == 92.5
