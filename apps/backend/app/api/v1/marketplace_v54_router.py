"""
CodeAtlas v5.4 - Intelligence Marketplace & Ecosystem Expansion API Router
Exposes endpoints for Extension Manifests, Lifecycle Operations, SDK Catalogs, Semantic Discovery, Private Catalogs, Cryptographic Signing, 13-Stage Lifecycle Test, and Marketplace Readiness.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.marketplace_v54.extension_manifest_lifecycle import ExtensionManifestAndLifecycleEngine
from app.marketplace_v54.sdks_skills_workflows import ConnectorAndAgentSDKEngine
from app.marketplace_v54.policies_knowledge_discovery import PolicyKnowledgeAndDiscoveryEngine
from app.marketplace_v54.governance_signing_test_harness import GovernanceSigningAndTestHarnessEngine

router = APIRouter(prefix="/marketplace-v54", tags=["Intelligence Marketplace v5.4"])

manifest_lifecycle = ExtensionManifestAndLifecycleEngine()
sdks_workflows = ConnectorAndAgentSDKEngine()
discovery_knowledge = PolicyKnowledgeAndDiscoveryEngine()
signing_test_harness = GovernanceSigningAndTestHarnessEngine()


# --- Extension Manifest & Lifecycle Operations ---

@router.post("/manifest/validate")
def validate_manifest(manifest: Dict[str, Any] = Body(...)):
    return manifest_lifecycle.validate_extension_manifest(manifest)

@router.post("/extension/lifecycle")
def execute_lifecycle(
    extension_id: str = Body(...),
    operation: str = Body(...),
    manifest: Optional[Dict[str, Any]] = Body(None),
    trust_tier: str = Body("VERIFIED")
):
    return manifest_lifecycle.execute_lifecycle_operation(extension_id, operation, manifest, trust_tier)


# --- SDKs, Agent Trust Score & Workflow Composition ---

@router.get("/agent/trust-score")
def get_agent_trust_score(agent_id: str = Query("agent_sre_01")):
    return sdks_workflows.evaluate_agent_trust_score(agent_id)

@router.post("/workflow/compose")
def compose_workflow(workflow_name: str = Body(...), skills: List[str] = Body(...)):
    return sdks_workflows.compose_skills_into_marketplace_workflow(workflow_name, skills)


# --- Semantic Discovery & Knowledge Provenance ---

@router.get("/discovery/search")
def search_marketplace(query: str = Query("Find an agent that investigates Kubernetes incidents")):
    return discovery_knowledge.search_semantic_marketplace(query)

@router.get("/knowledge/provenance")
def get_knowledge_provenance(pack_id: str = Query("ext_fintech_knowledge_pack")):
    return discovery_knowledge.get_knowledge_pack_provenance(pack_id)


# --- Cryptographic Signing, 13-Stage Lifecycle Test & Readiness ---

@router.post("/signing/sign")
def sign_extension(publisher_id: str = Body(...), artifact_summary: str = Body(...)):
    return signing_test_harness.sign_extension_artifact(publisher_id, artifact_summary)

@router.post("/test-harness/13-stage-test")
def run_13_stage_test(extension_id: str = Body("ext_k8s_sre_agent", embed=True)):
    return signing_test_harness.execute_13_stage_extension_lifecycle_test(extension_id)

@router.get("/readiness")
def get_marketplace_readiness():
    return signing_test_harness.audit_v54_marketplace_readiness()
