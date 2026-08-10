"""
Tests for CodeAtlas v4.4 - Migration Strategy Matrix, Interactive What-If & Digital Twin Audit
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.simulation_v44.migration_whatif_sync import MigrationWhatIfAndSyncEngine

client = TestClient(app)

def test_migration_strategies_comparison():
    engine = MigrationWhatIfAndSyncEngine()
    mig = engine.compare_migration_strategies("Spanner_Cloud_DB")
    assert len(mig["strategies_evaluated"]) == 3
    assert mig["safest_recommended_strategy"] == "Strangler Fig Pattern Pattern" or "Strangler Fig Pattern" in mig["safest_recommended_strategy"]

def test_interactive_whatif_simulation():
    engine = MigrationWhatIfAndSyncEngine()
    whatif = engine.run_interactive_whatif_simulation({"traffic_multiplier": 5, "regions_count": 2, "cache_enabled": True})
    assert "predicted_p99_ms" in whatif["simulated_outcome"]
    assert "estimated_monthly_cost" in whatif["simulated_outcome"]

def test_digital_twin_readiness_api_endpoint():
    res_ready = client.get("/api/v1/simulation-v44/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["digital_twin_decision"] == "CODEATLAS V4.4 DIGITAL TWIN READY"
    assert res_ready.json()["checks_passed"] == 21
