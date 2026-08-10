"""
CodeAtlas v7.0 - Engineering Intelligence Platform API Router
Exposes endpoints for Context Engine, Unified Search, Decision & Action Execution, Agent Orchestration, Subsystem Integration Status, Multi-dimensional Drift, Universal Copilot, Role Workspaces, Failsafe Pause, 16-Step Master Test, Phase 99 Master Query, and Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.platform_v70.unified_graph_context_search import UnifiedGraphContextSearchEngine
from app.platform_v70.decision_policy_agent_platform import DecisionPolicyAgentPlatformEngine, AgentRole
from app.platform_v70.integrated_intelligence_risk_opportunity import IntegratedIntelligenceRiskOpportunityEngine, AutonomyLevel
from app.platform_v70.copilot_workspaces_master_test_harness import CopilotWorkspacesMasterTestHarnessEngine

router = APIRouter(prefix="/platform-v70", tags=["Engineering Intelligence Platform v7.0"])

graph_search = UnifiedGraphContextSearchEngine()
decision_agents = DecisionPolicyAgentPlatformEngine()
integrated_hub = IntegratedIntelligenceRiskOpportunityEngine()
copilot_master = CopilotWorkspacesMasterTestHarnessEngine()


# --- Context Engine & Unified Search ---

@router.get("/context/payload")
def get_context_payload(
    user_role: str = Query("Architect"),
    current_task: str = Query("Evaluating CockroachDB Migration Strategy"),
    repo_id: str = Query("CodeAtlas/apps/backend")
):
    return graph_search.build_context_aware_intelligence_payload(user_role, current_task, repo_id)

@router.get("/search/unified")
def search_unified(
    query: str = Query("Why did checkout service latency spike?"),
    mode: str = Query("TEMPORAL")
):
    return graph_search.execute_unified_search(query, mode)


# --- Decision, Action & Agent Platform ---

@router.post("/action/execute")
def execute_action(
    decision_title: str = Body("Execute Zero-Downtime Valkey 8.0 Cache Migration"),
    action_type: str = Body("MODIFY_CONTAINER_IMAGE_SPEC"),
    risk_level: str = Body("LOW")
):
    return decision_agents.execute_governed_decision_and_action(decision_title, action_type, risk_level)

@router.post("/agent/handoff")
def orchestrate_handoff(
    initial_agent: str = Body(AgentRole.SRE),
    target_agent: str = Body(AgentRole.ARCHITECT),
    task: str = Body("Investigate P99 Latency Spike and Recommend Architecture Remediation")
):
    return decision_agents.orchestrate_agent_handoff_workflow(initial_agent, target_agent, task)

@router.post("/failsafe/pause")
def set_failsafe_pause(pause: bool = Body(True, embed=True)):
    return decision_agents.set_emergency_global_failsafe_pause(pause)


# --- Integrated Subsystems, Drift & Risk/Opportunity ---

@router.get("/subsystems/status")
def get_subsystems_status():
    return integrated_hub.get_unified_subsystem_integration_status()

@router.get("/drift/detect")
def detect_drift():
    return integrated_hub.detect_multi_dimensional_drift_and_reality_sync()

@router.get("/risk-opportunity/graphs")
def get_risk_opportunity_graphs():
    return integrated_hub.get_unified_risk_and_opportunity_graphs()


# --- Universal Copilot, Workspaces, 16-Step Test & Master Query ---

@router.post("/copilot/ask")
def ask_copilot(query: str = Body("Should we migrate this critical service to CockroachDB?", embed=True)):
    return copilot_master.ask_universal_copilot(query)

@router.get("/workspace/role")
def get_workspace(role: str = Query("COMMAND_CENTER")):
    return copilot_master.get_role_workspace(role)

@router.post("/test-harness/16-step-test")
def run_16_step_test(question: str = Body("Should we migrate this critical service?", embed=True)):
    return copilot_master.execute_16_step_end_to_end_master_intelligence_test(question)

@router.get("/test-harness/phase-99-query")
def run_phase_99_query():
    return copilot_master.execute_phase_99_master_intelligence_query()

@router.get("/readiness")
def get_platform_readiness():
    return copilot_master.audit_v70_platform_readiness()
