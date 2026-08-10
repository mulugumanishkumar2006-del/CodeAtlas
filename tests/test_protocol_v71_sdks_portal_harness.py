"""
Tests for CodeAtlas v7.1 - Multi-Tenancy, SDKs, Developer Portal & 17-Step E2E Platform Test Harness
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.protocol_v71.multitenancy_governance_sdks_marketplace import MultitenancyGovernanceSDKsMarketplaceEngine, DataClassification
from app.protocol_v71.developer_portal_admin_master_harness import DeveloperPortalAdminMasterHarnessEngine

client = TestClient(app)

def test_tenant_isolation_sdks_portal_and_17_step_test():
    multi_engine = MultitenancyGovernanceSDKsMarketplaceEngine()
    
    tenant = multi_engine.verify_tenant_and_data_plane_isolation("org_acme", "ws_prod", DataClassification.CONFIDENTIAL)
    assert tenant["isolation_audit"] == "PASSED"
    
    sdk = multi_engine.generate_multi_language_sdk_client_payload("python")
    assert sdk["sdk_package"] == "codeatlas-sdk-python"
    assert "CodeAtlasClient" in sdk["initializer_snippet"]
    
    plg = multi_engine.manage_marketplace_plugin_lifecycle("plg_datadog_connector", "ENABLE")
    assert plg["lifecycle_status"] == "ENABLED"
    
    dev_engine = DeveloperPortalAdminMasterHarnessEngine()
    portal = dev_engine.get_developer_portal_payload()
    assert portal["developer_portal"]["sandbox_status"] == "READY_FOR_THIRD_PARTY_DEVELOPERS"
    
    test17 = dev_engine.execute_17_step_end_to_end_platform_test("app_datadog")
    assert test17["steps_executed"] == 17
    assert test17["platform_test_verdict"] == "CODEATLAS_IS_A_PROGRAMMABLE_ENGINEERING_INTELLIGENCE_PLATFORM"
    
    p99 = dev_engine.execute_phase_99_developer_ecosystem_test()
    assert p99["steps_executed"] == 10
    assert p99["ecosystem_test_verdict"] == "DEVELOPERS_CAN_BUILD_AND_PUBLISH_GOVERNED_EXTENSIONS"
    
    readiness = dev_engine.audit_v71_platform_protocol_readiness()
    assert readiness["protocol_decision"] == "CODEATLAS v7.1 PLATFORM & INTELLIGENCE PROTOCOL READY"
    assert readiness["checks_passed"] == 32

def test_tenant_sdks_portal_and_readiness_api_endpoints():
    res_t = client.get("/api/v1/protocol-v71/tenant/isolation?tenant_id=org_acme")
    assert res_t.status_code == 200
    assert res_t.json()["isolation_audit"] == "PASSED"

    res_sdk = client.get("/api/v1/protocol-v71/sdk/payload?lang=python")
    assert res_sdk.status_code == 200
    assert res_sdk.json()["target_language"] == "python"

    res_plg = client.post("/api/v1/protocol-v71/marketplace/plugin", json={"plugin_id": "plg_datadog_connector", "action": "ENABLE"})
    assert res_plg.status_code == 200
    assert res_plg.json()["lifecycle_status"] == "ENABLED"

    res_port = client.get("/api/v1/protocol-v71/developer-portal")
    assert res_port.status_code == 200
    assert "developer_portal" in res_port.json()

    res_17 = client.post("/api/v1/protocol-v71/test-harness/17-step-test", json={"app_id": "app_datadog"})
    assert res_17.status_code == 200
    assert res_17.json()["steps_executed"] == 17

    res_p99 = client.get("/api/v1/protocol-v71/test-harness/phase-99-ecosystem")
    assert res_p99.status_code == 200
    assert res_p99.json()["steps_executed"] == 10

    res_ready = client.get("/api/v1/protocol-v71/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["protocol_decision"] == "CODEATLAS v7.1 PLATFORM & INTELLIGENCE PROTOCOL READY"
