"""
Tests for CodeAtlas v4.0 - Ops Center, Agent Orchestration, Org Risk, Command Palette & ROI Analytics
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.global_intelligence_v4.ops_agents_org_governance import OpsAgentsOrgAndGovernanceEngine, AutonomyLevel

client = TestClient(app)

def test_ops_center_and_agent_orchestration():
    ops = OpsAgentsOrgAndGovernanceEngine()
    center = ops.get_operations_and_security_center()
    assert center["active_incidents"] == 0
    assert len(center["security_attack_paths"]) >= 1

    action = ops.orchestrate_agent_network_action("SRE_Agent", "Execute Canary Rollback", AutonomyLevel.L3_APPROVE)
    assert action["human_approval_status"] == "REQUIRED"
    assert action["policy_check"] == "POLICY_APPROVED"

def test_global_dr_command_palette_and_roi():
    ops = OpsAgentsOrgAndGovernanceEngine()
    dr = ops.get_global_ops_time_machine_and_org_risk()
    assert dr["disaster_recovery"]["rto_target_sec"] == 42

    cmd = ops.parse_universal_command_palette("/cmd analyze repository payment-service")
    assert cmd["action_type"] == "ANALYZE_REPOSITORY"

    roi = ops.calculate_engineering_roi_analytics()
    assert roi["engineering_roi"]["engineering_hours_saved_monthly"] == 420
    assert roi["v4_product_validation"]["all_38_validation_checks_passed"] is True

def test_ops_and_roi_api_endpoints():
    res_ops = client.get("/api/v1/global-intelligence-v4/ops/center")
    assert res_ops.status_code == 200
    assert res_ops.json()["active_incidents"] == 0

    res_roi = client.get("/api/v1/global-intelligence-v4/roi")
    assert res_roi.status_code == 200
    assert res_roi.json()["v4_product_validation"]["all_38_validation_checks_passed"] is True
