"""
Tests for CodeAtlas v5.3 - CodeAtlas CLI, Public API & Webhook Subscriptions
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.ecosystem_v53.api_sdks_cli_webhooks import CodeAtlasCLIEngine, WebhookSubscriptionEngine

client = TestClient(app)

def test_cli_command_execution():
    cli = CodeAtlasCLIEngine()
    
    conn = cli.execute_cli_command("connect", [])
    assert conn["result"]["status"] == "SUCCESS"

    analyze = cli.execute_cli_command("analyze", ["repo_01"])
    assert analyze["result"]["analysis"]["architecture_health"] == 98.6

    search = cli.execute_cli_command("search", ["payment_service"])
    assert search["result"]["query"] == "payment_service"

def test_webhook_subscription_registration():
    webhooks = WebhookSubscriptionEngine()
    sub = webhooks.register_webhook_subscription(
        "https://api.enterprise.com/webhooks/codeatlas",
        ["ANALYSIS_COMPLETED", "RISK_DETECTED"],
        {"organization": "acme_corp", "severity": "HIGH"}
    )
    assert sub["sub_id"] == "sub_0001"
    assert len(sub["event_types"]) == 2

def test_cli_and_webhook_api_endpoints():
    res_cli = client.post("/api/v1/ecosystem-v53/cli/execute", json={"command": "graph", "args": []})
    assert res_cli.status_code == 200
    assert res_cli.json()["result"]["graph_edges"] == 84200

    res_wh = client.post("/api/v1/ecosystem-v53/webhooks/subscribe", json={
        "target_url": "https://api.ent.com/hook",
        "event_types": ["RISK_DETECTED"],
        "filters": {"severity": "HIGH"}
    })
    assert res_wh.status_code == 200
    assert res_wh.json()["sub_id"] == "sub_0001"
