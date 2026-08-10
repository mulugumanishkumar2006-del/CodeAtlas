"""
CodeAtlas v5.0 - Engineering Intelligence OS API Router
Exposes endpoints for Unified Graph & Memory, Time Travel, Evidence Reasoning, Predictions & Tradeoffs, 5 Role Copilots, 8-Mode Command Center, Platform Self-Diagnostics, and 28-step End-to-End Test.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.engineering_os_v50.unified_graph_memory import UnifiedGraphAndMemoryEngine
from app.engineering_os_v50.reasoning_prediction_tradeoffs import ReasoningPredictionAndTradeoffEngine
from app.engineering_os_v50.role_copilots_command_center import RoleCopilotsAndCommandCenterEngine
from app.engineering_os_v50.risk_governance_self_diagnostics import RiskGovernanceAndSelfDiagnosticsEngine

router = APIRouter(prefix="/engineering-os-v50", tags=["Engineering Intelligence OS v5.0"])

graph_memory = UnifiedGraphAndMemoryEngine()
reason_predict = ReasoningPredictionAndTradeoffEngine()
copilots_command = RoleCopilotsAndCommandCenterEngine()
diagnostics_audit = RiskGovernanceAndSelfDiagnosticsEngine()


# --- Unified Graph, Time Travel & Engineering Memory ---

@router.get("/graph/unified")
def get_unified_graph():
    return graph_memory.get_unified_graph_and_entity_resolution()

@router.get("/time-travel")
def query_time_travel(days_ago: int = Query(180)):
    return graph_memory.query_time_aware_architecture_history(days_ago)

@router.post("/memory/record")
def record_memory(
    fact: str = Body(...),
    truth_type: str = Body(...),
    source: str = Body(...),
    confidence: float = Body(0.95)
):
    return graph_memory.record_engineering_memory(fact, truth_type, source, confidence)


# --- Evidence Reasoning, Predictions & Multi-Objective Tradeoffs ---

@router.post("/reason")
def execute_reasoning(query: str = Body(..., embed=True)):
    return reason_predict.execute_evidence_first_reasoning(query)

@router.get("/predict")
def predict_outcomes(service: str = Query("payment-service")):
    return reason_predict.predict_multi_domain_engineering_outcomes(service)

@router.post("/tradeoffs/optimize")
def optimize_tradeoffs(objectives: Dict[str, str] = Body(...)):
    return reason_predict.optimize_multi_objective_tradeoffs(objectives)


# --- Role Copilots & 8-Mode Command Center ---

@router.post("/copilot/query")
def query_copilot(role: str = Body(...), query: str = Body(...)):
    return copilots_command.query_role_copilot(role, query)

@router.get("/command-center/mode")
def get_command_center_mode(mode: str = Query("EXECUTIVE")):
    return copilots_command.get_command_center_mode_state(mode)


# --- Self-Diagnostics, 28-Step Anomaly Test & OS Readiness ---

@router.get("/self-diagnostics")
def run_self_diagnostics():
    return diagnostics_audit.run_platform_self_diagnostics()

@router.post("/scenario/28-step-test")
def run_28_step_scenario():
    return diagnostics_audit.execute_28_step_production_anomaly_scenario()

@router.get("/readiness")
def get_os_readiness():
    return diagnostics_audit.audit_v50_engineering_os_readiness()
