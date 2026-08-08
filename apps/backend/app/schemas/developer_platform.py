from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class APIScope(str, Enum):
    REPO_READ = "repository:read"
    REPO_WRITE = "repository:write"
    ARCH_READ = "architecture:read"
    GRAPH_READ = "graph:read"
    KNOWLEDGE_READ = "knowledge:read"
    AGENT_EXECUTE = "agent:execute"
    DEPLOYMENT_READ = "deployment:read"
    DEPLOYMENT_EXECUTE = "deployment:execute"
    ADMIN_READ = "admin:read"
    ADMIN_WRITE = "admin:write"


class WebhookDeliveryStatus(str, Enum):
    QUEUED = "QUEUED"
    SENDING = "SENDING"
    DELIVERED = "DELIVERED"
    FAILED = "FAILED"
    RETRYING = "RETRYING"
    DEAD_LETTER = "DEAD_LETTER"


class MarketplaceCategory(str, Enum):
    AGENTS = "AGENTS"
    PLUGINS = "PLUGINS"
    INTEGRATIONS = "INTEGRATIONS"
    TOOLS = "TOOLS"
    WORKFLOWS = "WORKFLOWS"
    DASHBOARDS = "DASHBOARDS"


# ----------------------------------------------------
# API Keys & OAuth (Phases 1-6)
# ----------------------------------------------------
class APIKeyCreateRequest(BaseModel):
    name: str
    scopes: List[APIScope] = Field(default_factory=list)
    expires_in_days: int = 365


class APIKeyCreatedResponse(BaseModel):
    key_id: str
    name: str
    key_prefix: str
    secret_key: str  # Revealed only once
    scopes: List[APIScope]
    expires_at: str


class OAuthAppCreateRequest(BaseModel):
    app_name: str
    redirect_urls: List[str]
    scopes: List[APIScope]


class OAuthAppModel(BaseModel):
    app_id: str
    app_name: str
    client_id: str
    client_secret_masked: str
    redirect_urls: List[str]
    scopes: List[APIScope]
    status: str = "ACTIVE"


# ----------------------------------------------------
# Webhook Platform & Delivery (Phases 9-12)
# ----------------------------------------------------
class WebhookSubscriptionModel(BaseModel):
    subscription_id: str
    target_url: str
    signing_secret_masked: str
    events: List[str]
    is_active: bool = True


class WebhookDeliveryHistoryModel(BaseModel):
    delivery_id: str
    subscription_id: str
    event_type: str
    status: WebhookDeliveryStatus = WebhookDeliveryStatus.DELIVERED
    response_code: int = 200
    attempts: int = 1
    timestamp: str


# ----------------------------------------------------
# CLI & SDKs (Phases 13-18)
# ----------------------------------------------------
class CLIProfileModel(BaseModel):
    profile_name: str = "default"
    organization_id: str = "acme-corp"
    workspace_id: str = "ws_prod"
    output_format: str = "json"  # human, json, machine
    timeout_sec: int = 30


class SDKClientConfigModel(BaseModel):
    language: str  # PYTHON, TYPESCRIPT
    package_name: str
    version: str = "v2.2.0"
    type_safe: bool = True
    auto_retry: bool = True
    max_retries: int = 3


# ----------------------------------------------------
# Agent & Tool Registries (Phases 19-24)
# ----------------------------------------------------
class CustomAgentRegistrationRequest(BaseModel):
    agent_name: str
    description: str
    capabilities: List[str]
    permissions: List[APIScope]
    risk_level: str = "LOW"


class AgentRegistryItemModel(BaseModel):
    agent_id: str
    agent_name: str
    version: str = "v1.0.0"
    capabilities: List[str]
    permissions: List[APIScope]
    status: str = "ACTIVE"
    usage_count: int = 42


class ToolRegistryItemModel(BaseModel):
    tool_id: str
    tool_name: str
    version: str = "v1.0.0"
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    security_status: str = "VERIFIED"


# ----------------------------------------------------
# Plugin System & Sandbox (Phases 25-29)
# ----------------------------------------------------
class PluginManifestModel(BaseModel):
    plugin_id: str
    name: str
    version: str = "v1.0.0"
    description: str
    author: str
    capabilities: List[str]
    requested_permissions: List[APIScope]
    sandbox_verified: bool = True
    status: str = "ENABLED"


# ----------------------------------------------------
# Workflows & Event Bus (Phases 33-37)
# ----------------------------------------------------
class WorkflowDefinitionModel(BaseModel):
    workflow_id: str
    workflow_name: str
    trigger_event: str = "repository.updated"
    conditions: List[str] = Field(default_factory=list)
    actions: List[str] = Field(default_factory=list)
    is_active: bool = True


class EventBusFilterModel(BaseModel):
    organization_id: str
    event_type: str = "repository.analyzed"
    workspace_id: Optional[str] = None
    severity: str = "ALL"


# ----------------------------------------------------
# Marketplace Foundation (Phases 43-46)
# ----------------------------------------------------
class MarketplaceListingModel(BaseModel):
    listing_id: str
    category: MarketplaceCategory
    title: str
    description: str
    author: str
    version: str = "v1.0.0"
    security_status: str = "VERIFIED"
    downloads_count: int = 142
    rating: float = 4.9


# ----------------------------------------------------
# Sandbox & Developer Analytics (Phases 47-52)
# ----------------------------------------------------
class DeveloperSandboxSessionModel(BaseModel):
    sandbox_id: str
    organization_id: str = "sandbox_acme"
    synthetic_repos_count: int = 5
    synthetic_agents_count: int = 3
    status: str = "ACTIVE"


class ExtensionAnalyticsModel(BaseModel):
    total_api_calls: int = 14500
    active_applications: int = 4
    delivered_webhooks: int = 890
    executed_workflows: int = 120
    avg_latency_ms: float = 18.2
    error_rate_percentage: float = 0.02


# ----------------------------------------------------
# Ecosystem Scorecard (Phase 63)
# ----------------------------------------------------
class EcosystemScorecardModel(BaseModel):
    organization_id: str
    public_api_score: float = 99.0
    sdk_cli_score: float = 98.5
    webhook_platform_score: float = 99.5
    agent_tool_registry_score: float = 100.0
    plugin_sandbox_score: float = 98.0
    workflow_engine_score: float = 99.0
    marketplace_score: float = 97.5
    sandbox_developer_exp_score: float = 99.0
    ecosystem_status: str = "CODEATLAS V2.2 DEVELOPER PLATFORM READY"
