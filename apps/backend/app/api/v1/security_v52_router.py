"""
CodeAtlas v5.2 - Security, Compliance & Enterprise Trust API Router
Exposes endpoints for Zero Trust Auth, RBAC/ABAC Authorization, Secret Scanning, KMS Rotation, Indirect Prompt Defense, Agent Kill Switch, Compliance Engine, 13-Attack Simulation, and Trust Readiness.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.security_v52.zero_trust_identity_access import ZeroTrustIdentityAndAccessEngine
from app.security_v52.secrets_data_classification_kms import SecretScannerAndKMSEngine
from app.security_v52.prompt_defense_agent_sandbox import IndirectPromptDefenseAndSandboxEngine
from app.security_v52.compliance_policy_trust_center import ComplianceAndPolicyTrustEngine

router = APIRouter(prefix="/security-v52", tags=["Security & Enterprise Trust v5.2"])

identity_access = ZeroTrustIdentityAndAccessEngine()
secrets_kms = SecretScannerAndKMSEngine()
prompt_sandbox = IndirectPromptDefenseAndSandboxEngine()
compliance_policy = ComplianceAndPolicyTrustEngine()


# --- Zero Trust Identity & RBAC / ABAC Authorization ---

@router.post("/auth/sso")
def sso_authenticate(email: str = Body(...), provider: str = Body("Okta-SAML-SSO")):
    return identity_access.authenticate_sso_saml_oidc(email, provider)

@router.post("/auth/authorize")
def authorize_action(
    role: str = Body(...),
    resource_id: str = Body(...),
    action_tier: str = Body(...),
    classification: str = Body("Internal")
):
    return identity_access.authorize_resource_action(role, resource_id, action_tier, classification)

@router.post("/auth/break-glass")
def break_glass(user_email: str = Body(...), reason: str = Body(...), approver_email: str = Body(...)):
    return identity_access.execute_break_glass_emergency_access(user_email, reason, approver_email)


# --- Secret Detection, Redaction & KMS Encryption ---

@router.post("/secrets/scan")
def scan_secrets(text: str = Body(..., embed=True)):
    return secrets_kms.scan_and_redact_secrets(text)

@router.post("/kms/rotate")
def rotate_kms():
    return secrets_kms.rotate_envelope_kms_key()


# --- Indirect Prompt Defense & Agent Kill Switch ---

@router.post("/prompt-defense/indirect-scan")
def scan_indirect_prompt(source_type: str = Body(...), content: str = Body(...)):
    return prompt_sandbox.inspect_untrusted_input_for_indirect_injection(source_type, content)

@router.post("/agent/kill-switch")
def trigger_kill_switch(admin_email: str = Body(...), reason: str = Body(...)):
    return prompt_sandbox.trigger_administrator_agent_kill_switch(admin_email, reason)

@router.post("/audit/append")
def append_audit(event_type: str = Body(...), actor: str = Body(...), action: str = Body(...), metadata: Dict[str, Any] = Body(...)):
    return prompt_sandbox.append_immutable_audit_entry(event_type, actor, action, metadata)


# --- Compliance Policy & 13-Attack Simulation ---

@router.post("/policy/evaluate")
def evaluate_policy(policy_rule: str = Body(...), context: Dict[str, Any] = Body(...)):
    return compliance_policy.evaluate_machine_readable_policy(policy_rule, context)

@router.post("/attack-simulation/13-scenarios")
def run_13_attack_scenarios():
    return compliance_policy.run_13_attack_scenario_simulation()

@router.get("/readiness")
def get_trust_readiness():
    return compliance_policy.audit_v52_enterprise_trust_readiness()
