import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class APIKeyDBModel(Base):
    __tablename__ = "dev_api_keys"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    key_prefix = Column(String, nullable=False)
    hashed_secret = Column(String, nullable=False)
    scopes = Column(JSON, nullable=False, default=list)
    owner_email = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OAuthApplicationDBModel(Base):
    __tablename__ = "dev_oauth_apps"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    app_name = Column(String, nullable=False)
    client_id = Column(String, unique=True, index=True, nullable=False)
    client_secret_hash = Column(String, nullable=False)
    redirect_urls = Column(JSON, nullable=False, default=list)
    scopes = Column(JSON, nullable=False, default=list)
    owner_email = Column(String, nullable=False)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class WebhookSubscriptionDBModel(Base):
    __tablename__ = "dev_webhook_subs"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    target_url = Column(String, nullable=False)
    signing_secret = Column(String, nullable=False)
    events = Column(JSON, nullable=False, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class WebhookDeliveryDBModel(Base):
    __tablename__ = "dev_webhook_deliveries"

    id = Column(String, primary_key=True, index=True)
    subscription_id = Column(String, index=True, nullable=False)
    event_type = Column(String, nullable=False)
    status = Column(String, default="DELIVERED")  # QUEUED, SENDING, DELIVERED, FAILED, RETRYING, DEAD_LETTER
    response_code = Column(Integer, default=200)
    attempts = Column(Integer, default=1)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class AgentRegistryDBModel(Base):
    __tablename__ = "dev_agent_registry"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    agent_name = Column(String, nullable=False)
    version = Column(String, default="v1.0.0")
    capabilities = Column(JSON, nullable=False, default=list)
    permissions = Column(JSON, nullable=False, default=list)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ToolRegistryDBModel(Base):
    __tablename__ = "dev_tool_registry"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    tool_name = Column(String, nullable=False)
    version = Column(String, default="v1.0.0")
    input_schema = Column(JSON, nullable=False, default=dict)
    output_schema = Column(JSON, nullable=False, default=dict)
    security_status = Column(String, default="VERIFIED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PluginDBModel(Base):
    __tablename__ = "dev_plugins"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    plugin_name = Column(String, nullable=False)
    version = Column(String, default="v1.0.0")
    author = Column(String, nullable=False)
    capabilities = Column(JSON, nullable=False, default=list)
    status = Column(String, default="ENABLED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class WorkflowDBModel(Base):
    __tablename__ = "dev_workflows"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    workflow_name = Column(String, nullable=False)
    trigger_event = Column(String, nullable=False)
    actions = Column(JSON, nullable=False, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class MarketplaceListingDBModel(Base):
    __tablename__ = "dev_marketplace"

    id = Column(String, primary_key=True, index=True)
    category = Column(String, nullable=False)  # AGENTS, PLUGINS, INTEGRATIONS, TOOLS, WORKFLOWS, DASHBOARDS
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    version = Column(String, default="v1.0.0")
    security_status = Column(String, default="VERIFIED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
