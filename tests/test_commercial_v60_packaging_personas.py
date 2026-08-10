"""
Tests for CodeAtlas v6.0 - Commercial Product Packaging, Metering, 6 Persona Views & Evidence-First AI
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.commercial_v60.packaging_metering_billing import CommercialPackagingAndMeteringEngine, ProductTier
from app.commercial_v60.persona_views_contextual_ai import PersonaViewsAndContextualAIEngine

client = TestClient(app)

def test_product_packaging_and_metering():
    engine = CommercialPackagingAndMeteringEngine()
    
    ent_feat = engine.get_tier_features(ProductTier.ENTERPRISE)
    assert ent_feat["tier"] == "ENTERPRISE"
    assert ent_feat["federation"] is True

    metering = engine.record_usage_metering("org_acme", 150, 50, 2000000, 250)
    assert metering["budget_governance"]["budget_status"] == "WITHIN_BUDGET_LIMITS"
    assert metering["metered_dimensions"]["active_users"] == 150

def test_persona_views_and_evidence_first_ai():
    ai_engine = PersonaViewsAndContextualAIEngine()
    
    cto_view = ai_engine.get_persona_view_intelligence("CTO", "org_acme")
    assert cto_view["persona"] == "CTO"
    assert cto_view["health_score"] == 94.2

    nlq = ai_engine.process_natural_language_query("Why is checkout slow?", "org_acme")
    assert nlq["confidence_score"] == 0.98
    assert len(nlq["evidence_sources"]) == 3

def test_packaging_and_persona_api_endpoints():
    res_tier = client.get("/api/v1/commercial-v60/tier/features?tier=ENTERPRISE")
    assert res_tier.status_code == 200
    assert res_tier.json()["tier"] == "ENTERPRISE"

    res_persona = client.get("/api/v1/commercial-v60/persona/intelligence?persona=CTO")
    assert res_persona.status_code == 200
    assert res_persona.json()["health_score"] == 94.2

    res_nlq = client.post("/api/v1/commercial-v60/nlq/ask", json={"query": "Why is checkout slow?", "org_id": "org_acme"})
    assert res_nlq.status_code == 200
    assert res_nlq.json()["confidence_score"] == 0.98
