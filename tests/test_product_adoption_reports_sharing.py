"""
Tests for CodeAtlas v4.1 - Shared Investigations, Explainable AI & Report Generator
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.product_adoption_v41.investigations_reports_sharing import InvestigationsReportsAndSharingEngine, AIConfidenceLevel

client = TestClient(app)

def test_explainable_ai_and_sources():
    engine = InvestigationsReportsAndSharingEngine()
    ai_resp = engine.get_explainable_ai_response("Why did checkout fail?")
    assert ai_resp["confidence"] == AIConfidenceLevel.HIGH_CONFIDENCE
    assert len(ai_resp["evidence_sources"]) == 3

def test_shared_investigations_and_multi_format_reports():
    engine = InvestigationsReportsAndSharingEngine()
    inv = engine.create_shared_investigation("Investigate Redis Latency Spike", "Alice", ["Datadog Metric http_500"])
    assert inv["status"] == "OPEN"
    assert inv["creator"] == "Alice"

    rpt = engine.generate_multi_format_report("TECHNICAL_ENGINEERING", "MARKDOWN")
    assert rpt["report_type"] == "TECHNICAL_ENGINEERING"
    assert "download_url" in rpt

def test_explainable_ai_and_reports_api_endpoints():
    res_ai = client.post("/api/v1/product-adoption-v41/ai/explain", json={"query": "Why did checkout fail?"})
    assert res_ai.status_code == 200
    assert res_ai.json()["confidence"] == AIConfidenceLevel.HIGH_CONFIDENCE

    res_rpt = client.post("/api/v1/product-adoption-v41/reports/generate", json={"type": "EXECUTIVE", "format": "PDF"})
    assert res_rpt.status_code == 200
    assert res_rpt.json()["report_type"] == "EXECUTIVE"
