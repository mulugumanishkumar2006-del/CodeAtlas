"""
CodeAtlas v3.5 - Governed Autonomous Engineering Network API Router
Exposes comprehensive endpoints for Agent Registry, Task Orchestration, Risk Engine, Policy Engine,
Human Approval Vault, Transactional Executor, Incident War Room, Rollback, Kill Switch, and Autonomy Score.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.autonomous_network.agent_platform_registry import AgentRegistryPlatform
from app.autonomous_network.task_orchestrator import TaskOrchestratorEngine
from app.autonomous_network.risk_and_policy_engine import RiskAndPolicyEngine
from app.autonomous_network.action_executor_rollback import ActionExecutorAndRollback
from app.autonomous_network.specialized_domain_agents import SpecializedDomainAgentsHub
from app.autonomous_network.safety_guardrails_eval import SafetyGuardrailsAndEvalEngine

router = APIRouter(prefix="/autonomous-network", tags=["Autonomous Engineering Network"])

platform_registry = AgentRegistryPlatform()
orchestrator = TaskOrchestratorEngine()
risk_policy_engine = RiskAndPolicyEngine()
executor_rollback = ActionExecutorAndRollback()
domain_agents = SpecializedDomainAgentsHub()
guardrails_eval = SafetyGuardrailsAndEvalEngine()


# --- Agent Registry & Tools ---

@router.get("/agents")
def list_agents():
    return platform_registry.list_agents()

@router.get("/agents/{agent_id}")
def get_agent(agent_id: str):
    agent = platform_registry.get_agent_by_id(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.get("/tools")
def list_tools():
    return platform_registry.list_tools()

@router.post("/memory/scope")
def enforce_memory_scoping(agent_id: str = Body(...), context: str = Body(...), tenant_id: str = Body("default_tenant")):
    try:
        return platform_registry.enforce_memory_scoping(agent_id, context, tenant_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# --- Task Orchestration & Consensus ---

@router.post("/tasks/plan")
def plan_task(prompt: str = Body(...)):
    return orchestrator.plan_engineering_task(prompt)

@router.post("/tasks/handoff")
def agent_handoff(
    from_agent: str = Body(...),
    to_agent: str = Body(...),
    task_id: str = Body(...),
    findings: List[str] = Body(...),
    evidence: List[str] = Body(...),
    confidence: float = Body(...),
    required_action: str = Body(...)
):
    return orchestrator.execute_agent_handoff(from_agent, to_agent, task_id, findings, evidence, confidence, required_action)

@router.post("/tasks/reconcile")
def reconcile_findings(reports: List[Dict[str, Any]] = Body(...)):
    return orchestrator.reconcile_agent_findings(reports)


# --- Risk, Policy & Emergency Kill Switch ---

@router.post("/risk/calculate")
def calculate_risk(
    prod_impact: float = Body(...),
    security_impact: float = Body(...),
    data_impact: float = Body(...),
    blast_radius: float = Body(...),
    reversibility: float = Body(...),
    confidence: float = Body(...),
    environment: str = Body("production")
):
    return risk_policy_engine.calculate_action_risk(prod_impact, security_impact, data_impact, blast_radius, reversibility, confidence, environment)

@router.post("/policy/evaluate")
def evaluate_policy(
    agent_id: str = Body(...),
    action_name: str = Body(...),
    environment: str = Body(...),
    risk_score: float = Body(...)
):
    return risk_policy_engine.evaluate_policy(agent_id, action_name, environment, risk_score)

@router.post("/kill-switch")
def trigger_kill_switch(scope: str = Body("GLOBAL"), activate: bool = Body(True)):
    return risk_policy_engine.trigger_emergency_kill_switch(scope, activate)


# --- Approval Vault, Execution & Rollback ---

@router.post("/approvals")
def create_approval_request(
    agent_id: str = Body(...),
    action_name: str = Body(...),
    reason: str = Body(...),
    evidence: List[str] = Body(...),
    risk_score: float = Body(...),
    affected_systems: List[str] = Body(...),
    expected_outcome: str = Body(...),
    rollback_plan: str = Body(...)
):
    return executor_rollback.create_human_approval_request(agent_id, action_name, reason, evidence, risk_score, affected_systems, expected_outcome, rollback_plan)

@router.post("/approvals/{approval_id}/approve")
def approve_request(approval_id: str, approver: str = Body(...)):
    try:
        return executor_rollback.approve_request(approval_id, approver)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/actions/execute")
def execute_action(action_id: str = Body(...), action_name: str = Body(...), target_system: str = Body(...), dry_run: bool = Body(False)):
    return executor_rollback.execute_transactional_action(action_id, action_name, target_system, dry_run)

@router.post("/actions/rollback")
def trigger_rollback(execution_id: str = Body(...), reason: str = Body(...)):
    return executor_rollback.trigger_automatic_rollback(execution_id, reason)


# --- Domain Automation Hub & War Room ---

@router.get("/war-room/{incident_id}")
def get_war_room(incident_id: str):
    return domain_agents.get_incident_war_room_state(incident_id)

@router.post("/release/plan")
def plan_release(version: str = Body(...), service: str = Body(...)):
    return domain_agents.plan_progressive_release(version, service)

@router.post("/patch/generate")
def generate_patch(description: str = Body(...), file_path: str = Body(...)):
    return domain_agents.generate_code_patch(description, file_path)

@router.post("/security/response")
def security_response(cve: str = Body(...), package: str = Body(...)):
    return domain_agents.generate_security_response(cve, package)


# --- Safety, Autonomy Score & ROI ---

@router.post("/sanitize")
def sanitize_context(raw_input: str = Body(...)):
    return guardrails_eval.sanitize_untrusted_context(raw_input)

@router.get("/autonomy-score")
def get_autonomy_score():
    return guardrails_eval.calculate_autonomy_score_and_roi()
