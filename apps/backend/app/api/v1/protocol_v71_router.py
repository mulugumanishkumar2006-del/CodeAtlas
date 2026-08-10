"""
CodeAtlas v7.1 - Platform & Intelligence Protocol API Router
Exposes endpoints for Capability Discovery, Intelligence Operations, Event Publishing, CAIP Protocol Processing, Tenant Isolation Verification, Multi-Language SDKs, Marketplace Lifecycle, Developer Portal, 17-Step Platform Test, Phase 99 Ecosystem Test, and Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.protocol_v71.apis_registries_capability_discovery import ApisRegistriesCapabilityDiscoveryEngine, IntelligenceOperation
from app.protocol_v71.event_bus_intelligence_protocol import EventBusIntelligenceProtocolEngine, CAIPMessageType, EventType
from app.protocol_v71.multitenancy_governance_sdks_marketplace import MultitenancyGovernanceSDKsMarketplaceEngine, DataClassification
from app.protocol_v71.developer_portal_admin_master_harness import DeveloperPortalAdminMasterHarnessEngine

router = APIRouter(prefix="/protocol-v71", tags=["Platform & Intelligence Protocol v7.1"])

apis_registries = ApisRegistriesCapabilityDiscoveryEngine()
event_caip = EventBusIntelligenceProtocolEngine()
multitenancy_sdks = MultitenancyGovernanceSDKsMarketplaceEngine()
dev_portal_admin = DeveloperPortalAdminMasterHarnessEngine()


# --- Capabilities & Intelligence APIs ---

@router.get("/capabilities")
def get_capabilities():
    return apis_registries.discover_platform_capabilities()

@router.post("/intelligence/operate")
def execute_operation(
    op: str = Body(IntelligenceOperation.INVESTIGATE),
    target: str = Body("checkout-service"),
    params: Dict[str, Any] = Body(None)
):
    return apis_registries.execute_intelligence_operation(op, target, params)


# --- Event Bus & CAIP Protocol Messaging ---

@router.post("/event/publish")
def publish_event(
    event_type: str = Body(EventType.INCIDENT_DETECTED),
    payload: Dict[str, Any] = Body(None)
):
    return event_caip.publish_platform_event(event_type, payload)

@router.post("/caip/message")
def process_caip_message(
    msg_type: str = Body(CAIPMessageType.INTELLIGENCE_REQUEST),
    sender: str = Body("ext_app_datadog_integration"),
    body: Dict[str, Any] = Body(None)
):
    return event_caip.process_caip_protocol_message(msg_type, sender, body)


# --- Multi-Tenancy, SDKs & Marketplace ---

@router.get("/tenant/isolation")
def verify_tenant_isolation(
    tenant_id: str = Query("org_acme_corp"),
    workspace_id: str = Query("ws_checkout_prod"),
    data_class: str = Query(DataClassification.CONFIDENTIAL)
):
    return multitenancy_sdks.verify_tenant_and_data_plane_isolation(tenant_id, workspace_id, data_class)

@router.get("/sdk/payload")
def get_sdk_payload(lang: str = Query("python")):
    return multitenancy_sdks.generate_multi_language_sdk_client_payload(lang)

@router.post("/marketplace/plugin")
def manage_plugin(
    plugin_id: str = Body("plg_datadog_connector"),
    action: str = Body("ENABLE")
):
    return multitenancy_sdks.manage_marketplace_plugin_lifecycle(plugin_id, action)


# --- Developer Portal, 17-Step Test, Phase 99 Test & Readiness ---

@router.get("/developer-portal")
def get_developer_portal():
    return dev_portal_admin.get_developer_portal_payload()

@router.post("/test-harness/17-step-test")
def run_17_step_test(app_id: str = Body("app_external_datadog_workflow", embed=True)):
    return dev_portal_admin.execute_17_step_end_to_end_platform_test(app_id)

@router.get("/test-harness/phase-99-ecosystem")
def run_phase_99_ecosystem():
    return dev_portal_admin.execute_phase_99_developer_ecosystem_test()

@router.get("/readiness")
def get_protocol_readiness():
    return dev_portal_admin.audit_v71_platform_protocol_readiness()
