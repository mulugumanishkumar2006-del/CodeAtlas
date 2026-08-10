"""
Tests for CodeAtlas v3.3 - Ecosystem Intelligence Services
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ecosystem.intelligence.pr_intelligence import PRIntelligenceEngine
from app.ecosystem.intelligence.ci_deployment_intelligence import CIDeploymentIntelligenceEngine
from app.ecosystem.intelligence.telemetry_code_correlator import TelemetryCodeCorrelator
from app.ecosystem.intelligence.knowledge_security_adr import KnowledgeSecurityADREngine

client = TestClient(app)

def test_pr_intelligence():
    pr_engine = PRIntelligenceEngine()
    analysis = pr_engine.analyze_pr_impact("101", "payment-service", ["app/api/v1/auth.py", "app/database/raw.py"])
    assert analysis["architecture_risk"] == "HIGH"
    assert len(analysis["boundary_violations"]) == 1

    review = pr_engine.generate_ai_pr_review("101", "payment-service", "Added Redis Caching")
    assert len(review["what_changed"]) == 3
    assert len(review["recommended_actions"]) == 2

    sim = pr_engine.simulate_pr_impact("101", "payment-service")
    assert sim["simulation_result"] == "SAFE_TO_MERGE_WITH_WARNINGS"

def test_ci_and_deployment_intelligence():
    ci_engine = CIDeploymentIntelligenceEngine()
    root_cause = ci_engine.analyze_ci_root_cause("pipe_1", "ConnectionRefusedError: Redis connection failed", ["services/cache.py"])
    assert root_cause["confidence_score"] == 0.94
    assert "Redis" in root_cause["root_cause"]

    risk = ci_engine.calculate_deployment_risk("payment-service", "production", ["101"])
    assert risk["risk_level"] in ["LOW", "HIGH"]
    assert "breakdown" in risk

def test_telemetry_correlation():
    telemetry = TelemetryCodeCorrelator()
    trace_res = telemetry.trace_to_code("trace_99182")
    assert trace_res["function"] == "process_charge"
    assert trace_res["line_number"] == 142

    log_res = telemetry.log_to_code("KeyError: 'cache_ttl'")
    assert log_res["file"] == "app/services/cache.py"

def test_security_and_adr():
    adr_engine = KnowledgeSecurityADREngine()
    check = adr_engine.check_adr_compliance("import redis\nclient = redis.Redis()", "services/cache.py")
    assert check["compliant"] is False
    assert len(check["conflicts_detected"]) >= 1
