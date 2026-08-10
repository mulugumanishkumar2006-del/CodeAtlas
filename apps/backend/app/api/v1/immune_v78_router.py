"""
CodeAtlas v7.8 - Engineering Immune System API Router
Exposes endpoints for Immune Graph, Behavioral Anomaly Detection, Threat Hypotheses, Attack Surface Paths, Adaptive Containment Execution, Secret Rotation Workflows, Security Digital Twin Defense Simulation, Immunity Scores, Test Harnesses (Phases 94, 95, 96, 97, 98), and 45-Point Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.immune_v78.graph_inventory_baseline_detector import GraphInventoryBaselineDetectorEngine, ThreatCategory, AssetCriticality
from app.immune_v78.containment_supplychain_agent_immunity_engine import ContainmentSupplychainAgentImmunityEngine, ContainmentLevel
from app.immune_v78.memory_defense_master_harness import MemoryDefenseMasterHarnessEngine

router = APIRouter(prefix="/immune-v78", tags=["Engineering Immune System v7.8"])

graph_engine = GraphInventoryBaselineDetectorEngine()
containment_engine = ContainmentSupplychainAgentImmunityEngine()
harness_engine = MemoryDefenseMasterHarnessEngine()


# --- Immune Graph, Dynamic Trust & Threat Detection ---

@router.get("/graph/assets")
def get_immune_graph():
    return graph_engine.immune_graph

@router.post("/trust/update")
def update_trust(
    asset_id: str = Body("agent_payment_bot"),
    trust_delta: float = Body(-0.30),
    evidence: str = Body("Unusual credential access pattern")
):
    return graph_engine.update_dynamic_trust_score(asset_id, trust_delta, evidence)

@router.post("/threats/detect-and-classify")
def detect_threats(asset_id: str = Body("agent_payment_bot", embed=True)):
    return graph_engine.detect_and_classify_threats(asset_id)

@router.get("/attack-surface/paths")
def get_attack_paths(target_asset: str = Query("svc_checkout_payment")):
    return graph_engine.analyze_attack_surface_and_paths(target_asset)


# --- Containment, Supply Chain & Agent Immunity ---

@router.post("/containment/execute")
def execute_containment(
    target_id: str = Body("agent_payment_bot"),
    containment_level: str = Body(ContainmentLevel.QUARANTINE),
    reason: str = Body("Privilege escalation attempt detected")
):
    return containment_engine.execute_adaptive_containment(target_id, containment_level, reason)

@router.get("/supply-chain/evaluate")
def evaluate_supply_chain(
    dependency_name: str = Query("npm:express-core-v4"),
    secret_id: str = Query("sec_aws_rds_password")
):
    return containment_engine.evaluate_supply_chain_and_secret_immunity(dependency_name, secret_id)

@router.get("/agent-immunity/evaluate")
def evaluate_agent_immunity(
    agent_id: str = Query("agent_payment_bot"),
    model_version: str = Query("gpt-4o-2026-v2")
):
    return containment_engine.evaluate_agent_and_tool_immunity(agent_id, model_version)


# --- Security Digital Twin, Test Harnesses & Readiness Audit ---

@router.get("/digital-twin/simulate-defenses")
def simulate_defenses(threat_id: str = Query("thrt_1")):
    return harness_engine.simulate_counterfactual_defenses(threat_id)

@router.get("/test-harness/phase-94-18-step")
def run_phase_94_18_step_test():
    return harness_engine.execute_phase_94_18_step_end_to_end_immune_test()

@router.get("/test-harness/phase-95-unknown-threat")
def run_phase_95_unknown_threat():
    return harness_engine.execute_phase_95_unknown_threat_test()

@router.get("/test-harness/phase-96-false-positive")
def run_phase_96_false_positive():
    return harness_engine.execute_phase_96_false_positive_test()

@router.get("/test-harness/phase-97-cascading-threat")
def run_phase_97_cascading_threat():
    return harness_engine.execute_phase_97_cascading_threat_test()

@router.get("/test-harness/phase-98-scale")
def run_phase_98_scale():
    return harness_engine.execute_phase_98_scale_test()

@router.get("/readiness")
def get_immune_readiness():
    return harness_engine.audit_v78_immune_system_readiness()
