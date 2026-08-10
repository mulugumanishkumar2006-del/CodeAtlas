"""
Tests for CodeAtlas v7.1 - Platform Event Bus, Webhooks & CAIP Intelligence Protocol Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.protocol_v71.event_bus_intelligence_protocol import EventBusIntelligenceProtocolEngine, CAIPMessageType, EventType

client = TestClient(app)

def test_event_bus_and_caip_protocol_messaging():
    engine = EventBusIntelligenceProtocolEngine()
    
    evt = engine.publish_platform_event(EventType.INCIDENT_DETECTED, {"incident": "INC-01"})
    assert evt["event_type"] == EventType.INCIDENT_DETECTED
    assert evt["webhooks_dispatched_count"] >= 1
    
    caip = engine.process_caip_protocol_message(CAIPMessageType.INTELLIGENCE_REQUEST, "ext_app")
    assert caip["status"] == "PROCESSED_SUCCESSFULLY"
    assert caip["caip_header"]["protocol_version"] == "caip/1.0"
    assert caip["caip_response_body"]["confidence"] == 0.98

test_event_bus_and_caip_protocol_messaging()

def test_event_and_caip_api_endpoints():
    res_evt = client.post("/api/v1/protocol-v71/event/publish", json={
        "event_type": EventType.INCIDENT_DETECTED,
        "payload": {"incident": "INC-01"}
    })
    assert res_evt.status_code == 200
    assert res_evt.json()["event_type"] == EventType.INCIDENT_DETECTED

    res_caip = client.post("/api/v1/protocol-v71/caip/message", json={
        "msg_type": CAIPMessageType.INTELLIGENCE_REQUEST,
        "sender": "ext_app"
    })
    assert res_caip.status_code == 200
    assert res_caip.json()["status"] == "PROCESSED_SUCCESSFULLY"
