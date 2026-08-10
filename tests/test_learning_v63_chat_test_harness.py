"""
Tests for CodeAtlas v6.3 - Profiles, NL Knowledge Chat & Memory Recall, 14-Step Test Harness & Audit
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.learning_v63.profiles_knowledge_chat import ProfilesAndKnowledgeChatEngine
from app.learning_v63.uncertainty_governance_test_harness import UncertaintyAndGovernanceTestHarnessEngine

client = TestClient(app)

def test_knowledge_chat_memory_recall_and_gaps():
    chat_engine = ProfilesAndKnowledgeChatEngine()
    
    chat1 = chat_engine.ask_knowledge_memory_chat("Why did this service fail last month?", "org_acme")
    assert chat1["recall_type"] == "INCIDENT_RECALL"
    assert chat1["confidence_score"] == 0.98

    chat2 = chat_engine.ask_knowledge_memory_chat("What fixed this problem previously?", "org_acme")
    assert chat2["recall_type"] == "REMEDIATION_RECALL"

    harness = UncertaintyAndGovernanceTestHarnessEngine()
    gaps = harness.evaluate_uncertainty_and_knowledge_gaps("checkout_service")
    assert gaps["knowledge_coverage_pct"] == "94.8%"

def test_14_step_end_to_end_learning_loop_test_and_readiness_audit():
    harness = UncertaintyAndGovernanceTestHarnessEngine()
    
    test14 = harness.execute_14_step_end_to_end_learning_loop_test("Production incident on checkout endpoint")
    assert test14["steps_executed"] == 14
    assert test14["learning_test_verdict"] == "CODEATLAS_BECOMES_BETTER_THROUGH_VERIFIED_EXPERIENCE"

    readiness = harness.audit_v63_learning_readiness()
    assert readiness["learning_decision"] == "CODEATLAS v6.3 ENGINEERING INTELLIGENCE LEARNING SYSTEM READY"
    assert readiness["checks_passed"] == 16

def test_knowledge_chat_and_14_step_test_api_endpoints():
    res_chat = client.post("/api/v1/learning-v63/chat/ask", json={
        "question": "Why did this service fail last month?",
        "org_id": "org_acme"
    })
    assert res_chat.status_code == 200
    assert res_chat.json()["recall_type"] == "INCIDENT_RECALL"

    res_14 = client.post("/api/v1/learning-v63/test-harness/14-step-test", json={"scenario": "Production incident"})
    assert res_14.status_code == 200
    assert res_14.json()["steps_executed"] == 14

    res_ready = client.get("/api/v1/learning-v63/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["learning_decision"] == "CODEATLAS v6.3 ENGINEERING INTELLIGENCE LEARNING SYSTEM READY"
