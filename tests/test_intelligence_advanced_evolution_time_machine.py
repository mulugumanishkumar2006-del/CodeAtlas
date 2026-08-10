"""
Tests for CodeAtlas v3.7 - Temporal Evolution, Time Machine, Complexity & Debt Compounding
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.intelligence_advanced.temporal_time_machine import TemporalTimeMachineEngine
from app.intelligence_advanced.complexity_debt_migration import ComplexityDebtAndMigrationEngine

client = TestClient(app)

def test_time_machine_snapshots_and_narratives():
    tm = TemporalTimeMachineEngine()
    today_snap = tm.get_architecture_time_machine_snapshot("today")
    assert today_snap["snapshot_tag"] == "TODAY_PRESENT"

    year_snap = tm.get_architecture_time_machine_snapshot("last_year")
    assert year_snap["service_count"] == 1

    narrative = tm.generate_change_narrative("2025-08-01", "2026-08-01")
    assert "payment-processing" in narrative["what_changed"]

    pressure = tm.forecast_architectural_drift_and_pressure("payment-service")
    assert pressure["architecture_pressure_score"] > 50.0

def test_complexity_and_technical_debt_compounding():
    cd = ComplexityDebtAndMigrationEngine()
    comp = cd.evaluate_system_complexity("payment-platform")
    assert comp["five_dimensions"]["structural"] == 72.0
    assert comp["five_dimensions"]["dependency"] == 84.5

    debt = cd.calculate_debt_compounding_and_refactoring_priority()
    assert debt["total_technical_debt_hours"] == 1240
    assert len(debt["refactoring_priorities"]) == 2

    migration = cd.simulate_migration_graph("DB_MIGRATION", "Aurora", "Spanner")
    assert migration["simulated_risks"]["downtime_risk"] == "ZERO_DOWNTIME"

def test_time_machine_and_complexity_api_endpoints():
    res_snap = client.get("/api/v1/intelligence-advanced/time-machine/snapshot?timeframe=today")
    assert res_snap.status_code == 200
    assert res_snap.json()["snapshot_tag"] == "TODAY_PRESENT"

    res_comp = client.get("/api/v1/intelligence-advanced/complexity?system_name=payment-platform")
    assert res_comp.status_code == 200
    assert res_comp.json()["overall_complexity_score"] > 60.0
