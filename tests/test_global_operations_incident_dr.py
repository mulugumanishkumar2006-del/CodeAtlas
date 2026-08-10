"""
Tests for CodeAtlas v3.6 - Global Incident Command, Follow-the-Sun & Active-Active DR Engine
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.global_operations.incident_command_follow_sun import GlobalIncidentCommandEngine
from app.global_operations.change_and_dr_engine import GlobalChangeAndDREngine

client = TestClient(app)

def test_incident_reporting_and_deduplication():
    ic = GlobalIncidentCommandEngine()
    inc1 = ic.report_and_correlate_incident("DB Lock Spike", "payment-service", "reg_us_east", "SEV-1")
    assert inc1["is_correlated_duplicate"] is False

    inc2 = ic.report_and_correlate_incident("Payment Latency Spike", "payment-service", "reg_eu_west", "SEV-1")
    assert inc2["is_correlated_duplicate"] is True
    assert inc2["master_incident_id"] == inc1["incident_id"]

def test_follow_the_sun_timezone_routing():
    ic = GlobalIncidentCommandEngine()
    # Test UTC 4 -> APAC
    apac = ic.route_follow_the_sun_oncall("payment-service", current_utc_hour=4)
    assert "APAC" in apac["active_operating_window"]

    # Test UTC 12 -> EMEA
    emea = ic.route_follow_the_sun_oncall("payment-service", current_utc_hour=12)
    assert "EMEA" in emea["active_operating_window"]

    # Test UTC 20 -> AMER
    amer = ic.route_follow_the_sun_oncall("payment-service", current_utc_hour=20)
    assert "AMER" in amer["active_operating_window"]

def test_global_deployment_and_dr_failover():
    cdr = GlobalChangeAndDREngine()
    plan = cdr.plan_global_deployment("payment-service", "v3.6.0", "REGION_BY_REGION_CANARY")
    assert plan["status"] == "SCHEDULED"
    assert len(plan["regional_stages"]) == 3

    rollback = cdr.trigger_global_rollback(plan["deployment_id"], "Canary latency exceeded threshold")
    assert rollback["rollback_status"] == "GLOBAL_ROLLBACK_COMPLETED"

    failover = cdr.trigger_dr_failover("sys_payment", "reg_us_east")
    assert failover["failover_status"] == "FAILOVER_SUCCESSFUL"
    assert failover["promoted_region"] == "reg_eu_west"
    assert failover["achieved_rpo_sec"] == 0

def test_incident_and_dr_api_endpoints():
    res_oncall = client.get("/api/v1/global-operations/follow-the-sun/oncall?service=payment-service&utc_hour=14")
    assert res_oncall.status_code == 200
    assert "EMEA" in res_oncall.json()["active_operating_window"]
