"""
Tests for CodeAtlas v6.9 - Vendor Risk, Multi-Cloud Intelligence, Vulnerability Impact Graph & Technology Substitution Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ecosystem_v69.vendor_cloud_vulnerability_radar import VendorCloudVulnerabilityRadarEngine

client = TestClient(app)

def test_vendor_concentration_vulnerabilities_and_substitution():
    engine = VendorCloudVulnerabilityRadarEngine()
    
    vendor = engine.evaluate_vendor_concentration_and_lockin()
    assert vendor["vendor_concentration"]["concentration_percentage"] == 78.4
    assert len(vendor["vendor_lock_in_analysis"]) == 1
    
    vuln = engine.generate_vulnerability_impact_graph("GHSA-c5qf-59p4-qvg7")
    assert vuln["security_advisory_id"] == "GHSA-c5qf-59p4-qvg7"
    assert "payment-worker" in vuln["impact_graph"]["affected_services"]
    
    sub = engine.evaluate_technology_substitution_matrix("Redis Single-Instance Caching")
    assert len(sub["evaluated_alternatives"]) == 2
    assert "Valkey 8.0" in sub["substitution_recommendation"]

def test_vendor_vulnerability_and_substitution_api_endpoints():
    res_v = client.get("/api/v1/ecosystem-v69/vendor/concentration")
    assert res_v.status_code == 200
    assert res_v.json()["vendor_concentration"]["concentration_percentage"] == 78.4

    res_vuln = client.get("/api/v1/ecosystem-v69/vulnerability/impact?advisory_id=GHSA-c5qf-59p4-qvg7")
    assert res_vuln.status_code == 200
    assert res_vuln.json()["security_advisory_id"] == "GHSA-c5qf-59p4-qvg7"

    res_sub = client.post("/api/v1/ecosystem-v69/technology/substitution", json={"tech": "Redis"})
    assert res_sub.status_code == 200
    assert "Valkey" in res_sub.json()["substitution_recommendation"]
