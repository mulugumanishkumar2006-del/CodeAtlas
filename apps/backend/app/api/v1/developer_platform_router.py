from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.developer_platform import (
    AgentRegistryItemModel,
    APIKeyCreatedResponse,
    APIKeyCreateRequest,
    CLIProfileModel,
    CustomAgentRegistrationRequest,
    DeveloperSandboxSessionModel,
    EcosystemScorecardModel,
    ExtensionAnalyticsModel,
    MarketplaceListingModel,
    OAuthAppCreateRequest,
    OAuthAppModel,
    PluginManifestModel,
    SDKClientConfigModel,
    ToolRegistryItemModel,
    WebhookDeliveryHistoryModel,
    WebhookSubscriptionModel,
    WorkflowDefinitionModel,
)
from app.services.developer_platform_service import DeveloperPlatformService

router = APIRouter(prefix="/developer-platform", tags=["Ecosystem & Developer Platform"])


# ----------------------------------------------------
# API Keys & OAuth (Phases 1-6)
# ----------------------------------------------------
@router.post(
    "/api-keys/{organization_id}",
    response_model=APIKeyCreatedResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_api_key(
    organization_id: str,
    req: APIKeyCreateRequest,
    owner_email: str = Query("dev@acme.com"),
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.create_api_key(organization_id, req, owner_email)


@router.post(
    "/oauth-apps/{organization_id}",
    response_model=OAuthAppModel,
    status_code=status.HTTP_201_CREATED,
)
def create_oauth_app(
    organization_id: str,
    req: OAuthAppCreateRequest,
    owner_email: str = Query("dev@acme.com"),
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.create_oauth_app(organization_id, req, owner_email)


# ----------------------------------------------------
# Webhook Platform & Delivery (Phases 9-12)
# ----------------------------------------------------
@router.get(
    "/webhooks/{organization_id}",
    response_model=List[WebhookSubscriptionModel],
    status_code=status.HTTP_200_OK,
)
def get_webhook_subscriptions(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_webhook_subscriptions(organization_id)


@router.get(
    "/webhook-deliveries/{subscription_id}",
    response_model=List[WebhookDeliveryHistoryModel],
    status_code=status.HTTP_200_OK,
)
def get_webhook_deliveries(
    subscription_id: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_webhook_deliveries(subscription_id)


# ----------------------------------------------------
# CLI & SDK Config (Phases 13-18)
# ----------------------------------------------------
@router.get(
    "/cli-profile",
    response_model=CLIProfileModel,
    status_code=status.HTTP_200_OK,
)
def get_cli_profile(db: Session = Depends(get_db)):
    service = DeveloperPlatformService(db=db)
    return service.get_cli_profile()


@router.get(
    "/sdk-config/{language}",
    response_model=SDKClientConfigModel,
    status_code=status.HTTP_200_OK,
)
def get_sdk_config(
    language: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_sdk_config(language)


# ----------------------------------------------------
# Agent & Tool Registries (Phases 19-24)
# ----------------------------------------------------
@router.post(
    "/agents/register/{organization_id}",
    response_model=AgentRegistryItemModel,
    status_code=status.HTTP_201_CREATED,
)
def register_custom_agent(
    organization_id: str,
    req: CustomAgentRegistrationRequest,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.register_custom_agent(organization_id, req)


@router.get(
    "/agents/{organization_id}",
    response_model=List[AgentRegistryItemModel],
    status_code=status.HTTP_200_OK,
)
def get_agent_registry(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_agent_registry(organization_id)


@router.get(
    "/tools/{organization_id}",
    response_model=List[ToolRegistryItemModel],
    status_code=status.HTTP_200_OK,
)
def get_tool_registry(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_tool_registry(organization_id)


# ----------------------------------------------------
# Plugins & Workflows (Phases 25-35)
# ----------------------------------------------------
@router.get(
    "/plugins/{organization_id}",
    response_model=List[PluginManifestModel],
    status_code=status.HTTP_200_OK,
)
def get_plugin_manifests(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_plugin_manifests(organization_id)


@router.get(
    "/workflows/{organization_id}",
    response_model=List[WorkflowDefinitionModel],
    status_code=status.HTTP_200_OK,
)
def get_workflow_definitions(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_workflow_definitions(organization_id)


# ----------------------------------------------------
# Marketplace, Sandbox & Analytics (Phases 43-52)
# ----------------------------------------------------
@router.get(
    "/marketplace",
    response_model=List[MarketplaceListingModel],
    status_code=status.HTTP_200_OK,
)
def get_marketplace_listings(db: Session = Depends(get_db)):
    service = DeveloperPlatformService(db=db)
    return service.get_marketplace_listings()


@router.get(
    "/sandbox/{organization_id}",
    response_model=DeveloperSandboxSessionModel,
    status_code=status.HTTP_200_OK,
)
def get_developer_sandbox(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_developer_sandbox(organization_id)


@router.get(
    "/analytics/{organization_id}",
    response_model=ExtensionAnalyticsModel,
    status_code=status.HTTP_200_OK,
)
def get_extension_analytics(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_extension_analytics(organization_id)


# ----------------------------------------------------
# Scorecard (Phase 63)
# ----------------------------------------------------
@router.get(
    "/scorecard/{organization_id}",
    response_model=EcosystemScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_ecosystem_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = DeveloperPlatformService(db=db)
    return service.get_ecosystem_scorecard(organization_id)
