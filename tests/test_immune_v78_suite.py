"""
Tests for CodeAtlas v7.8 - Engineering Immune System
Tests Immune Graph & Dynamic Trust Model, Behavioral Anomaly Detection & Threat Hypotheses, Attack Surface & Path Analysis, Adaptive 6-Level Containment, Supply Chain & Secret Exposure Response, Agent & Tool Immunity, Security Digital Twin Defense Simulator, Test Harnesses (Phases 94, 95, 96, 97, 98), and 45-Point Readiness Audit.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.immune_v78.graph_inventory_baseline_detector import GraphInventoryBaselineDetectorEngine, ThreatCategory, AssetCriticality
from app.immune_v78.containment_supplychain_agent_immunity_engine import ContainmentSupplychainAgentImmunityEngine, ContainmentLevel
from app.immune_v78.memory_defense_master_harness import MemoryDefenseMasterHarnessEngine

client = TestClient(app)

def test_graph_inventory_baseline_detector_engine():
    engine = GraphInventoryBaselineDetectorEngine()

    # Test Immune Graph
    graph = engine.immune_graph
    assert "svc_checkout_payment" in graph
    assert graph["svc_checkout_payment"]["criticality"] == AssetCriticality.CRITICAL

    # Test Dynamic Trust Model
    trust = engine.update_dynamic_trust_score("agent_payment_bot", -0.30, "Unusual credential access")
    assert trust["updated_trust"] == 0.65
    assert trust["trust_verdict"] == "TRUST_DEGRADED_SUSPICIOUS"

    # Test Behavioral Threat Detection & Classification
    threat = engine.detect_and_classify_threats("agent_payment_bot")
    assert threat["threat_classification"] == ThreatCategory.AGENT_BEHAVIOR
    assert threat["threat_hypothesis"]["confidence"] == 0.96

    # Test Attack Surface & Path Analysis
    paths = engine.analyze_attack_surface_and_paths("svc_checkout_payment")
    assert len(paths["attack_path_analysis"]) == 1
    assert paths["blast_radius_estimate"]["estimated_financial_impact_usd"] == 75000.0

def test_containment_supplychain_agent_immunity_engine():
    engine = ContainmentSupplychainAgentImmunityEngine()

    # Test Adaptive Containment Execution (Level: QUARANTINE)
    cnt = engine.execute_adaptive_containment("agent_payment_bot", ContainmentLevel.QUARANTINE, "Privilege escalation attempt")
    assert cnt["status"] == "ADAPTIVE_CONTAINMENT_SUCCESSFUL"
    assert cnt["containment_record"]["containment_level"] == ContainmentLevel.QUARANTINE
    assert len(cnt["containment_record"]["enforced_actions"]) == 4

    # Test Supply Chain & Secret Exposure Response
    sc = engine.evaluate_supply_chain_and_secret_immunity("npm:express-core-v4", "sec_aws_rds_password")
    assert sc["dependency_immunity"]["build_integrity"] == "PASSED_SLSA_LEVEL_3"
    assert sc["secret_exposure_response"]["status"] == "ROTATION_COMPLETED_VERIFIED"

    # Test Agent & Tool Immunity
    ag = engine.evaluate_agent_and_tool_immunity("agent_payment_bot", "gpt-4o-2026-v2")
    assert ag["agent_quarantine_status"] == "QUARANTINED_POLICY_ENFORCED"
    assert ag["immunity_evaluations"]["prompt_manipulation_check"] == "PASSED_NO_INJECTION_DETECTED"

def test_memory_defense_master_harness_engine():
    engine = MemoryDefenseMasterHarnessEngine()

    # Test Security Digital Twin Defense Simulation
    twin = engine.simulate_counterfactual_defenses("thrt_1")
    assert len(twin["simulated_defenses"]) == 3
    assert twin["selected_defense"]["option"] == "CONTAINMENT_A_ISOLATE_AGENT"

    # Test Phase 94 18-Step Test
    p94 = engine.execute_phase_94_18_step_end_to_end_immune_test()
    assert p94["steps_executed"] == 18
    assert p94["immune_system_verdict"] == "CODEATLAS_OPERATES_AS_AN_ENGINEERING_IMMUNE_SYSTEM"

    # Test Phase 95 Unknown Threat Test
    p95 = engine.execute_phase_95_unknown_threat_test()
    assert "PASSED" in p95["detection_verdict"]

    # Test Phase 96 False Positive Test
    p96 = engine.execute_phase_96_false_positive_test()
    assert "PASSED" in p96["false_positive_verdict"]

    # Test Phase 97 Cascading Threat Test
    p97 = engine.execute_phase_97_cascading_threat_test()
    assert "PASSED" in p97["containment_verdict"]

    # Test Phase 98 Scale Test
    p98 = engine.execute_phase_98_scale_test()
    assert "PASSED" in p98["scale_verdict"]

    # Test 45-Point Readiness Audit
    readiness = engine.audit_v78_immune_system_readiness()
    assert readiness["immune_system_decision"] == "CODEATLAS v7.8 ENGINEERING IMMUNE SYSTEM READY"
    assert readiness["checks_passed"] == 45

def test_immune_v78_api_endpoints():
    res_graph = client.get("/api/v1/immune-v78/graph/assets")
    assert res_graph.status_code == 200
    assert "svc_checkout_payment" in res_graph.json()

    res_trust = client.post("/api/v1/immune-v78/trust/update", json={
        "asset_id": "agent_payment_bot",
        "trust_delta": -0.30,
        "evidence": "Unusual credential access pattern"
    })
    assert res_trust.status_code == 200
    assert res_trust.json()["updated_trust"] == 0.65

    res_threat = client.post("/api/v1/immune-v78/threats/detect-and-classify", json={"asset_id": "agent_payment_bot"})
    assert res_threat.status_code == 200
    assert res_threat.json()["threat_classification"] == ThreatCategory.AGENT_BEHAVIOR

    res_cnt = client.post("/api/v1/immune-v78/containment/execute", json={
        "target_id": "agent_payment_bot",
        "containment_level": "QUARANTINE",
        "reason": "Privilege escalation attempt detected"
    })
    assert res_cnt.status_code == 200
    assert res_cnt.json()["status"] == "ADAPTIVE_CONTAINMENT_SUCCESSFUL"

    res_p94 = client.get("/api/v1/immune-v78/test-harness/phase-94-18-step")
    assert res_p94.status_code == 200
    assert res_p94.json()["steps_executed"] == 18

    res_readiness = client.get("/api/v1/immune-v78/readiness")
    assert res_readiness.status_code == 200
    assert res_readiness.json()["immune_system_decision"] == "CODEATLAS v7.8 ENGINEERING IMMUNE SYSTEM READY"
    assert res_readiness.json()["checks_passed"] == 45
