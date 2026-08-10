"""
Tests for CodeAtlas v3.6 - Control Plane, Global Routing, Topology & Health Radar
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.global_operations.control_plane_router import MultiRegionControlPlaneEngine, RegionStatus
from app.global_operations.topology_and_health import GlobalTopologyAndHealthEngine

client = TestClient(app)

def test_control_plane_regions_and_routing():
    cp = MultiRegionControlPlaneEngine()
    regions = cp.list_regions()
    assert len(regions) == 3

    # Test update status
    updated = cp.update_region_status("reg_eu_west", RegionStatus.DRAINING)
    assert updated["status"] == RegionStatus.DRAINING

    # Test global routing with EU data residency
    route_eu = cp.route_global_traffic("Asia/Tokyo", "EU_ONLY")
    assert route_eu["routed_region_id"] == "reg_eu_west"
    assert route_eu["routing_reason"] == "DATA_RESIDENCY_STRICT_EU"

def test_cloud_abstraction_primitives():
    cp = MultiRegionControlPlaneEngine()
    model = cp.get_cloud_abstraction_model()
    assert "AWS" in model["normalized_primitives"]["compute"]
    assert "GCP" in model["normalized_primitives"]["compute"]
    assert "AZURE" in model["normalized_primitives"]["compute"]

def test_worldwide_topology_and_health():
    th = GlobalTopologyAndHealthEngine()
    topology = th.get_worldwide_service_map()
    assert len(topology["worldwide_services"]) >= 2

    cross_deps = th.analyze_cross_region_dependencies()
    assert len(cross_deps["cross_region_dependencies"]) >= 1

    health = th.get_global_and_regional_health()
    assert health["global_health"]["overall_status"] == "HEALTHY"
    assert "reg_us_east" in health["regional_health_breakdown"]

def test_control_plane_api_endpoints():
    res_reg = client.get("/api/v1/global-operations/regions")
    assert res_reg.status_code == 200
    assert len(res_reg.json()) == 3

    res_top = client.get("/api/v1/global-operations/topology")
    assert res_top.status_code == 200
