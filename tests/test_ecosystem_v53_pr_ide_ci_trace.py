"""
Tests for CodeAtlas v5.3 - PR Intelligence Risk Score, IDE Extension & Trace-to-Code Navigation
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.ecosystem_v53.pr_ide_ci_incident_context import PRAndIDEContextEngine

client = TestClient(app)

def test_pr_intelligence_and_ide_context():
    engine = PRAndIDEContextEngine()
    
    # Low risk PR
    low_pr = engine.evaluate_pull_request_intelligence("PR-101", ["apps/backend/app/main.py"])
    assert low_pr["risk_level"] == "LOW_RISK"
    assert "payment-service" in low_pr["impact_map"]["affected_services"]

    # IDE inline context
    ide = engine.get_ide_extension_context("apps/backend/app/main.py", 14)
    assert ide["line_number"] == 14
    assert "reconciliation-worker" in ide["downstream_dependents"]

def test_trace_to_code_navigation():
    engine = PRAndIDEContextEngine()
    trace = engine.navigate_trace_to_code_and_production("tr_9941a82")
    assert trace["production_service"] == "payment-service"
    assert trace["source_code_location"]["file_path"] == "apps/backend/app/main.py"

def test_pr_and_ide_api_endpoints():
    res_pr = client.post("/api/v1/ecosystem-v53/pr/evaluate", json={"pr_id": "PR-101", "changed_files": ["main.py"]})
    assert res_pr.status_code == 200
    assert res_pr.json()["risk_level"] == "LOW_RISK"

    res_ide = client.get("/api/v1/ecosystem-v53/ide/context?file_path=apps/backend/app/main.py&line_number=14")
    assert res_ide.status_code == 200
    assert res_ide.json()["line_number"] == 14

    res_trace = client.get("/api/v1/ecosystem-v53/trace/navigate?trace_id=tr_9941a82")
    assert res_trace.status_code == 200
    assert res_trace.json()["production_service"] == "payment-service"
