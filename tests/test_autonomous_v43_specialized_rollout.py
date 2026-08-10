"""
Tests for CodeAtlas v4.3 - 11 Specialized Agents, Multi-Agent Consensus, Self-Healing & Progressive Canary Rollout
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.autonomous_v43.specialized_agents_consensus import SpecializedAgentsAndConsensusEngine
from app.autonomous_v43.self_healing_rollout_safety import SelfHealingAndRolloutSafetyEngine

client = TestClient(app)

def test_multi_agent_consensus_and_specialized_tasks():
    engine = SpecializedAgentsAndConsensusEngine()
    consensus = engine.orchestrate_multi_agent_consensus("Deploy Redis Patch", "Promote patch ptch_001 to Production")
    assert consensus["consensus_reached"] is True
    assert consensus["consensus_verdict"] == "MULTI_AGENT_APPROVED"

    task_res = engine.execute_specialized_domain_agent_task("Security_Agent", "Scan PR #101 for Secret Leaks")
    assert task_res["status"] == "COMPLETED"

def test_self_healing_and_canary_rollout_auto_stop():
    safety = SelfHealingAndRolloutSafetyEngine()
    heal = safety.run_self_healing_workflow("Pod Latency Spike", "payment-service")
    assert heal["self_healing_status"] == "SUCCESSFULLY_HEALED"

    # Canary success
    canary_ok = safety.execute_progressive_canary_rollout("dep_8814", simulate_auto_stop_anomaly=False)
    assert canary_ok["rollout_status"] == "ROLLOUT_SUCCESSFUL_100_PERCENT"

    # Canary auto-stop on anomaly
    canary_stop = safety.execute_progressive_canary_rollout("dep_8814", simulate_auto_stop_anomaly=True)
    assert canary_stop["rollout_status"] == "AUTO_STOPPED_AND_ROLLED_BACK"

def test_autonomous_readiness_api_endpoint():
    res_ready = client.get("/api/v1/autonomous-v43/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["autonomous_decision"] == "CODEATLAS V4.3 AUTONOMOUS ENGINEERING READY"
    assert res_ready.json()["checks_passed"] == 20
