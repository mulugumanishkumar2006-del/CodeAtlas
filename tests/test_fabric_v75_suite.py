"""
Tests for CodeAtlas v7.5 - Engineering Intelligence Fabric
Tests Entity Resolution, Event Ingestion, Digital Twin, Change Risk, Policy Authorization, Action Execution & Rollback, Incident Investigation, Universal Fabric Search, Test Harnesses (Phases 94, 95, 96, 97, 98), and 40-Point Readiness Audit.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.fabric_v75.universal_entity_event_twin import UniversalEntityEventTwinEngine, EntityType, EventConfidence
from app.fabric_v75.agent_action_workflow_intelligence import AgentActionWorkflowIntelligenceEngine, ActionCatalog
from app.fabric_v75.knowledge_search_master_harness import KnowledgeSearchMasterHarnessEngine

client = TestClient(app)

def test_universal_entity_event_twin_engine():
    engine = UniversalEntityEventTwinEngine()
    
    # Test entity resolution
    res = engine.resolve_and_register_entity("ent_custom_svc", "Custom Microservice", EntityType.SERVICE)
    assert res["entity"]["entity_id"] == "ent_custom_svc"
    assert res["resolution_status"] == "UNIQUE_IDENTITY_STABLE"

    # Test event ingestion and correlation
    evt = engine.ingest_event_and_correlate("DEPLOYMENT_SUCCESS", "GitHub_Actions", "ent_custom_svc")
    assert evt["ingested_event"]["event_type"] == "DEPLOYMENT_SUCCESS"
    assert len(evt["correlated_causal_chain"]) == 3

    # Test change risk and blast radius
    risk = engine.evaluate_change_risk_and_blast_radius("ent_custom_svc", "Upgrade PostgreSQL pool")
    assert risk["change_risk_assessment"]["risk_level"] == "LOW_TO_MEDIUM"
    assert len(risk["blast_radius_analysis"]["affected_entities"]) == 2

    # Test policy authorization
    auth = engine.evaluate_policy_authorization("SCALE_UP_PODS", "ent_custom_svc")
    assert auth["allowed"] is True
    assert auth["policy_decision"] == "ALLOWED"

def test_agent_action_workflow_intelligence_engine():
    engine = AgentActionWorkflowIntelligenceEngine()
    
    # Test action execution and verification
    act = engine.execute_and_verify_action(ActionCatalog.SCALE, "ent_checkout_service")
    assert act["action_record"]["status"] == "COMPLETED_VERIFIED"
    assert act["verification_result"]["intended_outcome_verified"] is True

    # Test incident investigation
    inc = engine.investigate_incident_and_hypothesize("inc_9012")
    assert len(inc["competing_hypotheses"]) == 2
    assert inc["assembled_context"]["owning_team"] == "team_checkout_core"

    # Test cost & business impact
    cost = engine.calculate_cost_and_business_impact("ent_checkout_service")
    assert cost["business_impact"]["mapped_business_feature"] == "Checkout & Global Payment Gateway"

def test_knowledge_search_master_harness_engine():
    engine = KnowledgeSearchMasterHarnessEngine()

    # Test universal fabric search
    search = engine.execute_universal_fabric_search("Why did payment latency increase?")
    assert search["evidence_grounding_score"] == 0.99
    assert len(search["correlated_fabric_sources"]) == 5

    # Test Phase 94 17-step test
    p94 = engine.execute_phase_94_17_step_end_to_end_fabric_test()
    assert p94["steps_executed"] == 17
    assert p94["fabric_verdict"] == "CODEATLAS_OPERATES_AS_AN_ENGINEERING_INTELLIGENCE_FABRIC"

    # Test Phase 95 security breach test
    p95 = engine.execute_phase_95_security_breach_test()
    assert "PASSED" in p95["defense_verdict"]

    # Test Phase 96 chaos test
    p96 = engine.execute_phase_96_fabric_chaos_test()
    assert "PASSED" in p96["resilience_verdict"]

    # Test Phase 97 scale test
    p97 = engine.execute_phase_97_scale_test()
    assert "PASSED" in p97["scale_verdict"]

    # Test Phase 98 autonomy test
    p98 = engine.execute_phase_98_autonomy_test()
    assert "PASSED" in p98["autonomy_verdict"]

    # Test 40-point readiness audit
    readiness = engine.audit_v75_fabric_readiness()
    assert readiness["fabric_decision"] == "CODEATLAS v7.5 ENGINEERING INTELLIGENCE FABRIC READY"
    assert readiness["checks_passed"] == 40

def test_fabric_v75_api_endpoints():
    # Test FastAPI Router endpoints
    res_resolve = client.post("/api/v1/fabric-v75/entities/resolve", json={
        "entity_id": "ent_test_api",
        "name": "Test API Service"
    })
    assert res_resolve.status_code == 200
    assert res_resolve.json()["entity"]["entity_id"] == "ent_test_api"

    res_ingest = client.post("/api/v1/fabric-v75/events/ingest", json={
        "event_type": "DEPLOYMENT_SUCCESS",
        "source_system": "GitHub_Actions",
        "entity_id": "ent_test_api"
    })
    assert res_ingest.status_code == 200
    assert res_ingest.json()["ingested_event"]["event_type"] == "DEPLOYMENT_SUCCESS"

    res_search = client.get("/api/v1/fabric-v75/search/universal?query=Why%20did%20latency%20increase")
    assert res_search.status_code == 200
    assert res_search.json()["evidence_grounding_score"] == 0.99

    res_p94 = client.get("/api/v1/fabric-v75/test-harness/phase-94-17-step")
    assert res_p94.status_code == 200
    assert res_p94.json()["steps_executed"] == 17

    res_readiness = client.get("/api/v1/fabric-v75/readiness")
    assert res_readiness.status_code == 200
    assert res_readiness.json()["fabric_decision"] == "CODEATLAS v7.5 ENGINEERING INTELLIGENCE FABRIC READY"
    assert res_readiness.json()["checks_passed"] == 40
