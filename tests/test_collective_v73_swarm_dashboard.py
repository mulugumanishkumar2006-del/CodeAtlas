"""
Tests for CodeAtlas v7.3 - Swarm Investigation, Poisoning Defense, Dissent Engine & Master Harness
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.collective_v73.marketplace_swarm_poisoning_dissent import MarketplaceSwarmPoisoningDissentEngine
from app.collective_v73.dashboard_gap_engine_master_test_harness import DashboardGapEngineMasterTestHarnessEngine

client = TestClient(app)

def test_swarm_poisoning_dissent_dashboard_and_15_step_test():
    swarm_engine = MarketplaceSwarmPoisoningDissentEngine()
    
    swarm = swarm_engine.execute_swarm_investigation("P99 Latency degradation")
    assert swarm["swarm_decomposition_count"] == 3
    assert swarm["conflict_resolution"]["conflict_detected"] is False
    
    pois = swarm_engine.verify_poisoning_defense_and_preserve_dissent()
    assert pois["poisoning_defense_audit"]["poisoning_detected"] is True
    assert len(pois["dissent_engine"]["credible_minority_opinions_preserved"]) == 1
    
    admin_engine = DashboardGapEngineMasterTestHarnessEngine()
    dash = admin_engine.get_collective_intelligence_dashboard_payload()
    assert dash["collective_dashboard"]["collective_intelligence_score"] == 0.95
    assert len(dash["collective_dashboard"]["knowledge_gaps_identified"]) == 1
    
    p95 = admin_engine.execute_phase_95_knowledge_poisoning_test()
    assert p95["test_name"] == "PHASE_95_KNOWLEDGE_POISONING_TEST"
    
    test15 = admin_engine.execute_15_step_end_to_end_collective_test("PgBouncer Pooling")
    assert test15["steps_executed"] == 15
    assert test15["collective_test_verdict"] == "CODEATLAS_OPERATES_AS_AN_ENGINEERING_COLLECTIVE_INTELLIGENCE_PLATFORM"
    
    p99 = admin_engine.execute_phase_99_collective_intelligence_query()
    assert "PgBouncer" in p99["response"]["effective_pattern"]
    
    readiness = admin_engine.audit_v73_collective_intelligence_readiness()
    assert readiness["collective_decision"] == "CODEATLAS v7.3 ENGINEERING COLLECTIVE INTELLIGENCE READY"
    assert readiness["checks_passed"] == 40

def test_swarm_poisoning_dashboard_and_readiness_api_endpoints():
    res_sw = client.post("/api/v1/collective-v73/swarm/investigate", json={"problem": "P99 Latency degradation"})
    assert res_sw.status_code == 200
    assert res_sw.json()["swarm_decomposition_count"] == 3

    res_pois = client.post("/api/v1/collective-v73/poisoning-defense/verify", json={})
    assert res_pois.status_code == 200
    assert res_pois.json()["poisoning_defense_audit"]["poisoning_detected"] is True

    res_dash = client.get("/api/v1/collective-v73/dashboard")
    assert res_dash.status_code == 200
    assert res_dash.json()["collective_dashboard"]["collective_intelligence_score"] == 0.95

    res_p95 = client.get("/api/v1/collective-v73/test-harness/phase-95-poisoning")
    assert res_p95.status_code == 200
    assert res_p95.json()["test_name"] == "PHASE_95_KNOWLEDGE_POISONING_TEST"

    res_15 = client.post("/api/v1/collective-v73/test-harness/15-step-test", json={"pattern": "PgBouncer Pooling"})
    assert res_15.status_code == 200
    assert res_15.json()["steps_executed"] == 15

    res_p99 = client.get("/api/v1/collective-v73/test-harness/phase-99-query")
    assert res_p99.status_code == 200
    assert "PgBouncer" in res_p99.json()["response"]["effective_pattern"]

    res_ready = client.get("/api/v1/collective-v73/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["collective_decision"] == "CODEATLAS v7.3 ENGINEERING COLLECTIVE INTELLIGENCE READY"
