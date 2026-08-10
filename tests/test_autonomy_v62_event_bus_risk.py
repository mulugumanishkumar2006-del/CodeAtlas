"""
Tests for CodeAtlas v6.2 - Unified Event Bus, Event Correlation, Anomaly Detector & Blast Radius Engine
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.autonomy_v62.observer_event_bus_risk import UnifiedEventBusAndRiskEngine, EventType

client = TestClient(app)

def test_event_publishing_correlation_and_blast_radius():
    engine = UnifiedEventBusAndRiskEngine()
    
    e1 = engine.publish_event(EventType.DEPLOYMENT_STARTED, "CI/CD Pipeline", {"deployment_id": "dep_412"})
    assert e1["event_type"] == EventType.DEPLOYMENT_STARTED

    e2 = engine.publish_event(EventType.METRIC_CHANGED, "OpenTelemetry", {"metric": "latency", "value_ms": 520})
    assert e2["event_type"] == EventType.METRIC_CHANGED

    corr = engine.correlate_events_and_detect_anomaly()
    assert corr["anomaly_detected"] is True
    assert corr["explanation"]["confidence"] == 0.98

    risk = engine.calculate_blast_radius_and_risk("checkout_service")
    assert risk["overall_risk_score"] == 0.88
    assert "checkout_service" in risk["blast_radius"]["affected_services"]

def test_event_bus_and_anomaly_api_endpoints():
    res_pub = client.post("/api/v1/autonomy-v62/event/publish", json={
        "event_type": "DeploymentStarted",
        "source": "CI/CD",
        "payload": {"dep_id": "412"}
    })
    assert res_pub.status_code == 200
    assert res_pub.json()["event_type"] == "DeploymentStarted"

    res_anom = client.get("/api/v1/autonomy-v62/anomaly/detect")
    assert res_anom.status_code == 200

    res_risk = client.get("/api/v1/autonomy-v62/risk/blast-radius?target=checkout_service")
    assert res_risk.status_code == 200
    assert res_risk.json()["overall_risk_score"] == 0.88
