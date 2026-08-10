"""
CodeAtlas v4.5 - Global Engineering Network API Router
Exposes endpoints for 10-Layer Graph, Build Provenance, Vulnerability Propagation, Vendor Lock-in, Data Residency, API/Event Graph, Natural Language Graph Queries, and v4.5 Network Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.network_v45.global_graph_supply_chain import GlobalGraphAndSupplyChainEngine
from app.network_v45.vulnerability_ecosystem_risk import VulnerabilityAndEcosystemRiskEngine
from app.network_v45.data_governance_decision_graph import DataGovernanceAndDecisionGraphEngine
from app.network_v45.api_event_explorer_sync import APIEventExplorerAndSyncEngine

router = APIRouter(prefix="/network-v45", tags=["Global Engineering Network v4.5"])

graph_engine = GlobalGraphAndSupplyChainEngine()
vuln_engine = VulnerabilityAndEcosystemRiskEngine()
data_engine = DataGovernanceAndDecisionGraphEngine()
api_query_engine = APIEventExplorerAndSyncEngine()


# --- 10-Layer Graph & Supply Chain Provenance ---

@router.get("/graph/10-layer")
def get_10_layer_graph():
    return graph_engine.get_ten_layer_network_graph()

@router.get("/supply-chain/provenance")
def trace_provenance(deployment_id: str = Query("dep_8814")):
    return graph_engine.trace_artifact_build_provenance(deployment_id)


# --- Vulnerability Propagation & External Ecosystem Risk ---

@router.get("/vulnerability/traverse")
def traverse_vulnerability(cve: str = Query("CVE-2026-4401")):
    return vuln_engine.traverse_vulnerability_propagation(cve)

@router.get("/ecosystem/lockin")
def evaluate_lockin():
    return vuln_engine.evaluate_external_provider_lockin_and_multicloud()


# --- Data Governance & Decision Graph ---

@router.get("/data/residency")
def get_data_residency():
    return data_engine.get_data_flow_residency_and_classification()

@router.get("/decisions/antipatterns")
def get_decisions_and_antipatterns():
    return data_engine.get_engineering_decision_and_antipattern_graph()


# --- API/Event Ecosystem & Natural Language Graph Queries ---

@router.get("/api-event/health")
def get_api_event_health():
    return api_query_engine.get_api_and_event_ecosystem_health()

@router.post("/graph/query")
def execute_graph_query(query: str = Body(..., embed=True)):
    return api_query_engine.execute_natural_language_graph_query(query)

@router.get("/readiness")
def get_network_readiness():
    return api_query_engine.audit_v45_global_network_readiness()
