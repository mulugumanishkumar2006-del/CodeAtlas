"""Tests for Phase 25 Features 1-20: Universal Engineering Reasoning Engine & 15 Specialized AI Scientists."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_multistep_engineering_reasoning():
    payload = {
        "prompt": "Evaluate microservice decoupling strategy for high-throughput checkout database locks.",
        "repo_id": "test-repo",
    }
    response = client.post("/api/v1/agi-reasoning/multistep-reason", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["multi_step_chain"]) == 5
    phases = [s["phase_name"] for s in data["multi_step_chain"]]
    assert phases == ["Think", "Debate", "Simulate", "Verify", "Answer"]
    assert data["explainable_decision"]["confidence_score_pct"] > 90.0
    assert len(data["retained_memories"]) > 0
    assert data["verdict"] == "REASONING_COMPLETE_VERIFIED"


def test_list_15_specialized_scientists():
    response = client.get("/api/v1/agi-reasoning/scientists-list")
    assert response.status_code == 200
    scientists = response.json()
    assert len(scientists) == 15
    titles = [s["title"] for s in scientists]
    assert "Engineering Research Assistant" in titles
    assert "AI Architecture Professor" in titles
    assert "AI Incident Scientist" in titles
    assert "AI Reliability Scientist" in titles
    assert "AI Performance Scientist" in titles
    assert "AI Security Strategist" in titles
    assert "AI Cost Optimizer" in titles
    assert "AI Hiring Planner" in titles
    assert "AI Technology Advisor" in titles
    assert "AI Modernization Planner" in titles
    assert "AI Release Planner" in titles
    assert "AI Dependency Strategist" in titles
    assert "AI Database Scientist" in titles
    assert "AI API Architect" in titles
    assert "AI Cloud Economist" in titles


def test_specialized_scientist_consultation():
    test_cases = [
        ("incident_scientist", "Database lock contention during flash sale burst."),
        (
            "security_strategist",
            "GDPR Article 44 cross-border data residency requirement.",
        ),
        (
            "database_scientist",
            "PostgreSQL connection pool exhaustion under 1000 conns.",
        ),
        ("cloud_economist", "AWS Mumbai vs Frankfurt active-active dual-region cost."),
    ]
    for s_id, prompt in test_cases:
        payload = {
            "scientist_id": s_id,
            "query_prompt": prompt,
            "repo_id": "test-repo",
        }
        response = client.post(
            "/api/v1/agi-reasoning/scientist-consultation", json=payload
        )
        assert response.status_code == 200
        data = response.json()
        assert data["scientist_id"] == s_id
        assert data["confidence_pct"] > 90.0
        assert len(data["evidence_chain"]) > 0
