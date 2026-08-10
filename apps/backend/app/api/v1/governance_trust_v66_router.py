"""
CodeAtlas v6.6 - Engineering Governance & Trust API Router
Exposes endpoints for Identity Permissions, Policy-as-Code, Risk Engine, Human-in-the-Loop Approvals, 6-Stage Decision Chain Trace, Tamper-Evident Audit Log, Emergency Kill Switch, Agent Sandboxing, Prompt Injection Defense, Autonomy Levels, 15-Step Trust Test, and Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.governance_trust_v66.trust_identity_permissions_policy import TrustIdentityPermissionsPolicyEngine, ActionTypePermission
from app.governance_trust_v66.risk_approval_explainability_trace import RiskApprovalExplainabilityTraceEngine, RiskLevel
from app.governance_trust_v66.audit_model_agent_sandbox_killswitch import AuditModelAgentSandboxKillswitchEngine
from app.governance_trust_v66.safety_data_autonomy_test_harness import SafetyDataAutonomyTestHarnessEngine, AutonomyLevel

router = APIRouter(prefix="/governance-trust-v66", tags=["Engineering Governance & Trust v6.6"])

identity_policy = TrustIdentityPermissionsPolicyEngine()
risk_approval = RiskApprovalExplainabilityTraceEngine()
audit_sandbox = AuditModelAgentSandboxKillswitchEngine()
safety_autonomy = SafetyDataAutonomyTestHarnessEngine()


# --- Identity, Permissions & Policy as Code ---

@router.post("/identity/permissions/evaluate")
def evaluate_permissions(
    identity_id: str = Body("agent_migration_bot_v66"),
    resource: str = Body("Service:checkout-service"),
    action: str = Body(ActionTypePermission.EXECUTE),
    environment: str = Body("PRODUCTION")
):
    return identity_policy.evaluate_identity_permissions(identity_id, resource, action, environment)

@router.post("/policy/evaluate")
def evaluate_policy(
    proposed_action: str = Body("Execute CockroachDB Schema Migration"),
    risk_level: str = Body(RiskLevel.HIGH),
    environment: str = Body("PRODUCTION")
):
    return identity_policy.evaluate_policy_as_code(proposed_action, risk_level, environment)


# --- Risk, Approval & Decision Chain Trace ---

@router.post("/risk/evaluate")
def evaluate_risk(
    action_name: str = Body("Execute Online Database Schema Switchover"),
    environment: str = Body("PRODUCTION"),
    reversibility: str = Body("REVERSIBLE_VIA_DUAL_WRITE"),
    affected_services: int = Body(4)
):
    return risk_approval.evaluate_action_risk_level(action_name, environment, reversibility, affected_services)

@router.get("/approval/context")
def get_approval_context(action_name: str = Query("CockroachDB Dual-Write Migration Switchover")):
    return risk_approval.generate_approval_context_payload(action_name)

@router.get("/trace/decision-chain")
def get_decision_chain(recommendation: str = Query("Migrate Checkout DB to CockroachDB")):
    return risk_approval.build_complete_decision_chain_trace(recommendation)


# --- Tamper-Evident Audit & Kill Switch ---

@router.post("/audit/record")
def record_audit(event: str = Body(...), actor: str = Body(...), details: str = Body(...)):
    return audit_sandbox.record_audit_entry(event, actor, details)

@router.post("/kill-switch/toggle")
def toggle_kill_switch(activate: bool = Body(True), reason: str = Body("Emergency Security Lockdown")):
    return audit_sandbox.set_organization_emergency_kill_switch(activate, reason)

@router.get("/agent/sandbox/evaluate")
def evaluate_agent_sandbox(agent_id: str = Query("agent_migration_bot_v66"), tool: str = Query("execute_sql_migration")):
    return audit_sandbox.evaluate_agent_governance_and_sandbox(agent_id, tool)


# --- Safety, Autonomy Levels & 15-Step Test ---

@router.post("/safety/sanitize")
def sanitize_input(text: str = Body(..., embed=True)):
    return safety_autonomy.filter_secrets_and_prompt_injection(text)

@router.post("/autonomy/transition/evaluate")
def evaluate_autonomy_transition(
    current_level: str = Body(AutonomyLevel.LEVEL_3_HUMAN_APPROVED),
    accuracy_pct: float = Body(98.5),
    violations: int = Body(0)
):
    return safety_autonomy.evaluate_autonomy_level_transition(current_level, accuracy_pct, violations)

@router.post("/test-harness/15-step-test")
def run_15_step_test(scenario: str = Body("Production Incident Investigation and Remediation", embed=True)):
    return safety_autonomy.execute_15_step_final_complete_trust_chain_test(scenario)

@router.get("/readiness")
def get_trust_readiness():
    return safety_autonomy.audit_v66_governance_and_trust_readiness()
