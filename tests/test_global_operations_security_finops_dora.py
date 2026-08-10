"""
Tests for CodeAtlas v3.6 - Zero Trust Security, FinOps, SLOs, Chaos, DORA Metrics & Self-Healing Platform
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.global_operations.data_event_bus_replication import GlobalDataAndEventBusEngine
from app.global_operations.security_identity_audit import SecurityAndAuditEngine, GlobalRole
from app.global_operations.finops_slo_reliability import GlobalFinOpsAndReliabilityEngine
from app.global_operations.ai_agent_ops_self_healing import AIAgentOpsAndSelfHealingEngine

client = TestClient(app)

def test_event_bus_and_data_residency():
    eb = GlobalDataAndEventBusEngine()
    published = eb.publish_global_event("DEPLOYMENT_FINISHED", "reg_us_east", "tenant_1", {"version": "v3.6.0"})
    assert published["replication_status"] == "REPLICATED_ACROSS_ALL_REGIONS"

    # Test EU residency block
    eu_check = eb.check_data_residency_policy("tenant_1", "reg_eu_west", "reg_us_east", "EU_PII")
    assert eu_check["allowed"] is False
    assert eu_check["action"] == "BLOCK_TRANSFER"

def test_zero_trust_and_immutable_audit():
    sec = SecurityAndAuditEngine()
    zt_res = sec.verify_zero_trust_request("user_alice", GlobalRole.SRE, "reg_us_east", "payment-cluster", "DRAIN_REGION", mfa=True)
    assert zt_res["authorized"] is True
    assert zt_res["verification_status"] == "ZERO_TRUST_VERIFIED"

    assert len(sec.audit_log_chain) == 1
    audit_entry = sec.audit_log_chain[0]
    assert audit_entry["action"] == "DRAIN_REGION"
    assert audit_entry["current_hash"] is not None

def test_finops_slo_and_chaos():
    fr = GlobalFinOpsAndReliabilityEngine()
    costs = fr.get_finops_cost_allocation()
    assert "reg_us_east" in costs["breakdown_by_region"]

    slo = fr.evaluate_slo_and_error_budget("payment-service")
    assert slo["current_availability_pct"] == 99.94

    chaos = fr.execute_chaos_experiment("Network Partition Test", "reg_us_east", "50% Packet Loss")
    assert chaos["resilience_score"] > 90.0

def test_dora_metrics_and_self_healing_api():
    sh = AIAgentOpsAndSelfHealingEngine()
    dora = sh.get_dora_intelligence_and_ops_score()
    assert dora["engineering_operations_score"] == 94.2
    assert "ELITE" in dora["dora_metrics"]["deployment_frequency"]

    self_health = sh.run_platform_self_monitoring_and_healing()
    assert self_health["codeatlas_self_health"] == "100% HEALTHY"

    # API endpoints test
    res_dora = client.get("/api/v1/global-operations/dora-metrics")
    assert res_dora.status_code == 200
    assert res_dora.json()["engineering_operations_score"] > 90.0
