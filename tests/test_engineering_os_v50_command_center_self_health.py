"""
Tests for CodeAtlas v5.0 - 8-Mode Command Center, Platform Self-Diagnostics & 28-Step Anomaly Test
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.engineering_os_v50.role_copilots_command_center import RoleCopilotsAndCommandCenterEngine, CommandMode
from app.engineering_os_v50.risk_governance_self_diagnostics import RiskGovernanceAndSelfDiagnosticsEngine

client = TestClient(app)

def test_command_center_modes_and_self_diagnostics():
    cmd = RoleCopilotsAndCommandCenterEngine()
    mode_state = cmd.get_command_center_mode_state(CommandMode.DIGITAL_TWIN)
    assert mode_state["command_center_mode"] == CommandMode.DIGITAL_TWIN
    assert mode_state["time_travel_enabled"] is True

    diag = RiskGovernanceAndSelfDiagnosticsEngine()
    self_health = diag.run_platform_self_diagnostics()
    assert self_health["platform_self_health"] == "100% HEALTHY"
    assert len(self_health["diagnostics_checks"]) == 7

def test_28_step_production_anomaly_scenario():
    diag = RiskGovernanceAndSelfDiagnosticsEngine()
    test28 = diag.execute_28_step_production_anomaly_scenario()
    assert test28["steps_executed"] == 28
    assert test28["scenario_verdict"] == "SUCCESSFULLY_REMEDIATED_AND_LEARNED"

def test_command_center_and_os_readiness_api_endpoints():
    res_mode = client.get("/api/v1/engineering-os-v50/command-center/mode?mode=EXECUTIVE")
    assert res_mode.status_code == 200
    assert res_mode.json()["command_center_mode"] == "EXECUTIVE"

    res_ready = client.get("/api/v1/engineering-os-v50/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["os_decision"] == "CODEATLAS V5.0 ENGINEERING INTELLIGENCE OS READY"
    assert res_ready.json()["checks_passed"] == 26
