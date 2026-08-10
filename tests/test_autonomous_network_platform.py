"""
Tests for CodeAtlas v3.5 - Agent Platform, Registry, Tools & Memory Boundaries
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.autonomous_network.agent_platform_registry import AgentRegistryPlatform, AgentCapability

client = TestClient(app)

def test_agent_registry_and_capabilities():
    platform = AgentRegistryPlatform()
    agents = platform.list_agents()
    assert len(agents) == 14  # All 14 specialized agents

    sre_agent = platform.get_agent_by_id("agent_sre")
    assert sre_agent is not None
    assert AgentCapability.EXECUTE in sre_agent["capabilities"]
    assert sre_agent["risk_level"] == "HIGH"

    arch_agent = platform.get_agent_by_id("agent_arch")
    assert AgentCapability.EXECUTE not in arch_agent["capabilities"]

def test_tool_registry():
    platform = AgentRegistryPlatform()
    tools = platform.list_tools()
    assert len(tools) >= 8
    
    github_tool = [t for t in tools if t["tool_id"] == "tool_github"][0]
    assert github_tool["permission_level"] == "HIGH"

def test_memory_scoping():
    platform = AgentRegistryPlatform()
    scoped = platform.enforce_memory_scoping("agent_code", "payment_service_src", "tenant_acme")
    assert scoped["context_access"] == "GRANTED_SCOPED"
    assert "tenant_acme" in scoped["sanitized_context"]

def test_agents_api_endpoints():
    res = client.get("/api/v1/autonomous-network/agents")
    assert res.status_code == 200
    assert len(res.json()) == 14

    res_single = client.get("/api/v1/autonomous-network/agents/agent_inc")
    assert res_single.status_code == 200
    assert res_single.json()["name"] == "Incident Agent"
