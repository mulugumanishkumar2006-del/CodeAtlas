"""
CodeAtlas v5.3 - Developer & Enterprise Ecosystem API Router
Exposes endpoints for Public SDKs, Webhooks, CLI Commands, PR Intelligence, IDE State, CI Policy Gates, Visual Workflow Builder, Developer Feedback, and Ecosystem Readiness.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.ecosystem_v53.api_sdks_cli_webhooks import CodeAtlasCLIEngine, WebhookSubscriptionEngine
from app.ecosystem_v53.pr_ide_ci_incident_context import PRAndIDEContextEngine
from app.ecosystem_v53.workflow_builder_plugins_sdks import VisualWorkflowAndSDKEngine
from app.ecosystem_v53.feedback_onboarding_analytics import DeveloperFeedbackAndEcosystemAuditEngine

router = APIRouter(prefix="/ecosystem-v53", tags=["Developer & Enterprise Ecosystem v5.3"])

cli_engine = CodeAtlasCLIEngine()
webhook_engine = WebhookSubscriptionEngine()
pr_ide_engine = PRAndIDEContextEngine()
workflow_sdk_engine = VisualWorkflowAndSDKEngine()
feedback_audit_engine = DeveloperFeedbackAndEcosystemAuditEngine()


# --- CLI & Webhooks ---

@router.post("/cli/execute")
def execute_cli(command: str = Body(...), args: List[str] = Body([]), format_output: str = Body("json")):
    return cli_engine.execute_cli_command(command, args, format_output)

@router.post("/webhooks/subscribe")
def subscribe_webhook(target_url: str = Body(...), event_types: List[str] = Body(...), filters: Dict[str, Any] = Body(...)):
    return webhook_engine.register_webhook_subscription(target_url, event_types, filters)


# --- PR Risk Intelligence, IDE Context & Trace-to-Code ---

@router.post("/pr/evaluate")
def evaluate_pr(pr_id: str = Body(...), changed_files: List[str] = Body(...)):
    return pr_ide_engine.evaluate_pull_request_intelligence(pr_id, changed_files)

@router.get("/ide/context")
def get_ide_context(file_path: str = Query("apps/backend/app/main.py"), line_number: int = Query(14)):
    return pr_ide_engine.get_ide_extension_context(file_path, line_number)

@router.get("/trace/navigate")
def navigate_trace(trace_id: str = Query("tr_9941a82")):
    return pr_ide_engine.navigate_trace_to_code_and_production(trace_id)


# --- Visual Workflow Builder & SDK Catalog ---

@router.post("/workflow/build")
def build_workflow(workflow_name: str = Body(...), trigger: str = Body(...), actions: List[Dict[str, Any]] = Body(...)):
    return workflow_sdk_engine.build_automated_workflow(workflow_name, trigger, actions)

@router.get("/sdks/catalog")
def get_sdk_catalog():
    return workflow_sdk_engine.get_connector_and_agent_sdk_catalog()


# --- Developer Feedback Loop, 14-Step Scenario & Ecosystem Readiness ---

@router.post("/feedback/record")
def record_feedback(recommendation_id: str = Body(...), feedback_action: str = Body(...), explanation: str = Body("")):
    return feedback_audit_engine.record_developer_feedback(recommendation_id, feedback_action, explanation)

@router.post("/scenario/14-step-test")
def run_14_step_scenario():
    return feedback_audit_engine.execute_14_step_developer_workflow_scenario()

@router.get("/readiness")
def get_ecosystem_readiness():
    return feedback_audit_engine.audit_v53_ecosystem_readiness()
