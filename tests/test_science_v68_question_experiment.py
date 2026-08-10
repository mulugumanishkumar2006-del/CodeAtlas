"""
Tests for CodeAtlas v6.8 - Question Engine, Experiments, Tech Radar, 12-Step Test & Phase 99 Audit
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.science_v68.question_hypothesis_experiment_registry import QuestionHypothesisExperimentRegistryEngine
from app.science_v68.playbooks_scientific_decision_center import PlaybooksScientificDecisionCenterEngine

client = TestClient(app)

def test_question_experiment_radar_and_12_step_test():
    question_engine = QuestionHypothesisExperimentRegistryEngine()
    
    q_res = question_engine.process_technical_question_and_hypotheses("Why is checkout service slow?")
    assert len(q_res["decomposed_subquestions"]) == 3
    assert q_res["ranked_hypotheses"][0]["rank"] == 1
    
    exp = question_engine.register_and_record_experiment_result("Test Cache", "Redis speeds up reads", "<20ms", "12ms", True)
    assert exp["passed"] is True
    
    neg = question_engine.get_negative_knowledge_memory()
    assert neg["failed_experiments_count"] >= 1
    
    playbook_engine = PlaybooksScientificDecisionCenterEngine()
    radar = playbook_engine.get_technology_radar_and_architecture_patterns()
    assert "CockroachDB Distributed SQL" in radar["technology_radar"]["ADOPT"]
    
    test12 = playbook_engine.execute_12_step_final_end_to_end_research_test("API latency increasing")
    assert test12["steps_executed"] == 12
    assert test12["research_test_verdict"] == "CODEATLAS_TRANSFORMS_QUESTIONS_INTO_VALIDATED_KNOWLEDGE"
    
    p99 = playbook_engine.execute_final_scientific_question_audit()
    assert p99["final_question"] == "What do we not know that matters?"
    
    readiness = playbook_engine.audit_v68_scientific_intelligence_readiness()
    assert readiness["scientific_decision"] == "CODEATLAS v6.8 ENGINEERING KNOWLEDGE & SCIENTIFIC INTELLIGENCE READY"
    assert readiness["checks_passed"] == 23

def test_question_experiment_and_readiness_api_endpoints():
    res_q = client.post("/api/v1/science-v68/question/ask", json={"question": "Why is latency slow?"})
    assert res_q.status_code == 200
    assert len(res_q.json()["decomposed_subquestions"]) == 3

    res_radar = client.get("/api/v1/science-v68/technology-radar")
    assert res_radar.status_code == 200
    assert "ADOPT" in res_radar.json()["technology_radar"]

    res_12 = client.post("/api/v1/science-v68/test-harness/12-step-test", json={"question": "API latency increasing"})
    assert res_12.status_code == 200
    assert res_12.json()["steps_executed"] == 12

    res_p99 = client.get("/api/v1/science-v68/test-harness/phase-99-question")
    assert res_p99.status_code == 200
    assert res_p99.json()["final_question"] == "What do we not know that matters?"

    res_ready = client.get("/api/v1/science-v68/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["scientific_decision"] == "CODEATLAS v6.8 ENGINEERING KNOWLEDGE & SCIENTIFIC INTELLIGENCE READY"
