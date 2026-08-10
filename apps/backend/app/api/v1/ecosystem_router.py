"""
CodeAtlas v3.3 - Ecosystem API Router
Exposes comprehensive endpoints for Integration Platform, Registry, Marketplace, Connectors,
PR/CI Intelligence, Telemetry-to-Code Correlation, Engineering Graph, ChatOps, Cross-Tool AI, and Workflows.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.ecosystem.platform_engine import IntegrationPlatformEngine
from app.ecosystem.registry import IntegrationRegistryManager
from app.ecosystem.connectors.source_control import SourceControlConnector
from app.ecosystem.connectors.cicd import CICDConnector
from app.ecosystem.connectors.issue_tracking import IssueTrackingConnector
from app.ecosystem.connectors.incident_management import IncidentManagementConnector
from app.ecosystem.connectors.chatops import ChatOpsConnector
from app.ecosystem.connectors.cloud_observability_security import CloudObservabilitySecurityConnectors
from app.ecosystem.intelligence.pr_intelligence import PRIntelligenceEngine
from app.ecosystem.intelligence.ci_deployment_intelligence import CIDeploymentIntelligenceEngine
from app.ecosystem.intelligence.telemetry_code_correlator import TelemetryCodeCorrelator
from app.ecosystem.intelligence.knowledge_security_adr import KnowledgeSecurityADREngine
from app.ecosystem.graph.unified_engineering_graph import UnifiedEngineeringGraph
from app.ecosystem.agents_and_workflows import CrossToolAIAndWorkflows

router = APIRouter(prefix="/ecosystem", tags=["Ecosystem & Integrations"])

# Engine instances
platform_engine = IntegrationPlatformEngine()
registry_manager = IntegrationRegistryManager()
scm_connector = SourceControlConnector()
cicd_connector = CICDConnector()
issue_connector = IssueTrackingConnector()
incident_connector = IncidentManagementConnector()
chatops_connector = ChatOpsConnector()
cloud_obs_sec_connectors = CloudObservabilitySecurityConnectors()

pr_intelligence = PRIntelligenceEngine()
ci_deployment_intelligence = CIDeploymentIntelligenceEngine()
telemetry_correlator = TelemetryCodeCorrelator()
knowledge_adr_engine = KnowledgeSecurityADREngine()

graph_engine = UnifiedEngineeringGraph()
agents_workflows_engine = CrossToolAIAndWorkflows()


# --- Platform & Webhooks ---

@router.post("/webhooks/inbound")
def handle_inbound_webhook(
    delivery_id: str,
    provider: str,
    event_type: str,
    payload: Dict[str, Any] = Body(...),
    signature: str = ""
):
    return platform_engine.process_webhook(delivery_id, provider, event_type, payload, signature)

@router.post("/platform/queue/drain")
def drain_offline_queue():
    processed = platform_engine.drain_offline_queue()
    return {"status": "SUCCESS", "processed_items": processed}

@router.get("/platform/policies")
def list_policies():
    return platform_engine.get_enterprise_policies()

@router.get("/platform/audit")
def list_audit_logs():
    return platform_engine.audit_log


# --- Registry & Marketplace ---

@router.get("/integrations")
def list_integrations():
    return registry_manager.list_integrations()

@router.post("/integrations")
def register_integration(
    name: str = Body(...),
    provider: str = Body(...),
    category: str = Body(...),
    credentials: Dict[str, Any] = Body(...),
    scopes: List[str] = Body(...)
):
    return registry_manager.register_integration(name, provider, category, credentials, scopes)

@router.post("/integrations/{int_id}/rotate")
def rotate_credentials(int_id: str, new_credentials: Dict[str, Any] = Body(...)):
    try:
        return registry_manager.rotate_credentials(int_id, new_credentials)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/integrations/{int_id}")
def disconnect_integration(int_id: str):
    success = registry_manager.disconnect_integration(int_id)
    if not success:
        raise HTTPException(status_code=404, detail="Integration not found")
    return {"status": "SUCCESS", "message": f"Disconnected integration {int_id}"}

@router.get("/marketplace")
def get_marketplace_catalog():
    return registry_manager.get_marketplace_catalog()

@router.post("/sandbox/execute")
def execute_sandbox(connector_code: str = Body(...), payload: Dict[str, Any] = Body(...)):
    return registry_manager.execute_custom_connector_sandbox(connector_code, payload)


# --- Connectors & Sync ---

@router.post("/connectors/source-control/sync")
def sync_repository(repo_url: str = Body(...), branch: str = Body("main")):
    return scm_connector.sync_repository(repo_url, branch)

@router.post("/connectors/cicd/ingest")
def ingest_pipeline(pipeline_data: Dict[str, Any] = Body(...)):
    return cicd_connector.ingest_pipeline_run(pipeline_data)

@router.post("/connectors/issues/convert-finding")
def convert_finding_to_issue(
    finding_id: str = Body(...),
    title: str = Body(...),
    finding_type: str = Body(...),
    repository: str = Body(...),
    file_path: str = Body(...),
    function_name: str = Body(...),
    architecture_context: str = Body(...),
    risk_score: float = Body(...),
    evidence: str = Body(...),
    ai_explanation: str = Body(...)
):
    return issue_connector.convert_finding_to_issue(
        finding_id, title, finding_type, repository, file_path,
        function_name, architecture_context, risk_score, evidence, ai_explanation
    )

@router.get("/connectors/issues")
def list_created_issues():
    return issue_connector.list_issues()

@router.post("/connectors/incidents/ingest")
def ingest_incident(incident_data: Dict[str, Any] = Body(...)):
    return incident_connector.ingest_incident(incident_data)

@router.get("/connectors/incidents")
def list_incidents():
    return incident_connector.list_incidents()

@router.post("/connectors/chatops/command")
def handle_chat_command(command: str = Body(...), args: List[str] = Body([]), user_id: str = Body("user_1"), channel_id: str = Body("chan_1")):
    return chatops_connector.handle_slash_command(command, args, user_id, channel_id)

@router.post("/connectors/chatops/approve")
def approve_chat_action(approval_id: str = Body(...), approved_by: str = Body(...)):
    try:
        return chatops_connector.approve_action(approval_id, approved_by)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/connectors/cloud/inventory")
def get_cloud_inventory(provider: str = Query("aws")):
    return cloud_obs_sec_connectors.get_cloud_inventory(provider)

@router.get("/connectors/sbom")
def generate_sbom(repository: str = Query("github.com/company/payment-service")):
    return cloud_obs_sec_connectors.generate_sbom(repository)


# --- Intelligence ---

@router.post("/intelligence/pr/analyze")
def analyze_pr(pr_id: str = Body(...), repo: str = Body(...), diff_files: List[str] = Body(...)):
    return pr_intelligence.analyze_pr_impact(pr_id, repo, diff_files)

@router.post("/intelligence/pr/review")
def ai_pr_review(pr_id: str = Body(...), repo: str = Body(...), diff_summary: str = Body(...)):
    return pr_intelligence.generate_ai_pr_review(pr_id, repo, diff_summary)

@router.post("/intelligence/pr/simulate")
def simulate_pr(pr_id: str = Body(...), repo: str = Body(...)):
    return pr_intelligence.simulate_pr_impact(pr_id, repo)

@router.post("/intelligence/ci/root-cause")
def ci_root_cause(pipeline_id: str = Body(...), logs: str = Body(...), changed_files: List[str] = Body(...)):
    return ci_deployment_intelligence.analyze_ci_root_cause(pipeline_id, logs, changed_files)

@router.post("/intelligence/deployment/risk")
def calculate_deployment_risk(service_name: str = Body(...), environment: str = Body("production"), pr_ids: List[str] = Body([])):
    return ci_deployment_intelligence.calculate_deployment_risk(service_name, environment, pr_ids)

@router.post("/intelligence/release/summary")
def generate_release_summary(release_version: str = Body(...), service_name: str = Body(...), pr_ids: List[str] = Body([])):
    return ci_deployment_intelligence.generate_release_summary(release_version, service_name, pr_ids)

@router.get("/intelligence/telemetry/trace-to-code")
def trace_to_code(trace_id: str = Query(...)):
    return telemetry_correlator.trace_to_code(trace_id)

@router.post("/intelligence/telemetry/log-to-code")
def log_to_code(error_log: str = Body(...)):
    return telemetry_correlator.log_to_code(error_log)

@router.get("/intelligence/telemetry/metric-to-code")
def metric_to_code(metric_name: str = Query(...), degradation_value: str = Query(...)):
    return telemetry_correlator.metric_to_code(metric_name, degradation_value)

@router.post("/intelligence/adr/check")
def check_adr_compliance(code_diff: str = Body(...), file_path: str = Body(...)):
    return knowledge_adr_engine.check_adr_compliance(code_diff, file_path)

@router.get("/intelligence/adr")
def list_adrs():
    return knowledge_adr_engine.list_adrs()


# --- Graph & Universal Search ---

@router.get("/graph")
def get_engineering_graph():
    return graph_engine.query_graph()

@router.get("/search")
def cross_system_search(query: str = Query(...)):
    return graph_engine.cross_system_search(query)

@router.get("/palette")
def universal_command_palette(action_query: str = Query(...)):
    return graph_engine.universal_command_palette(action_query)


# --- Cross-Tool AI, Agents & Persona Workflows ---

@router.post("/ai/reason")
def reason_across_tools(query: str = Body(...)):
    return agents_workflows_engine.reason_across_tools(query)

@router.post("/actions/plan")
def initiate_action(action_name: str = Body(...), target_systems: List[str] = Body(...), requester: str = Body(...)):
    return agents_workflows_engine.initiate_cross_system_action(action_name, target_systems, requester)

@router.post("/actions/authorize")
def authorize_action(execution_id: str = Body(...), approver: str = Body(...)):
    try:
        return agents_workflows_engine.authorize_and_execute_action(execution_id, approver)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/workflows/{persona}")
def get_persona_workflow(persona: str):
    return agents_workflows_engine.get_persona_workflow_view(persona)

@router.get("/analytics/roi")
def get_roi():
    return agents_workflows_engine.calculate_ecosystem_roi()

@router.get("/analytics/event-flow")
def get_event_flow():
    return agents_workflows_engine.get_event_flow_visualization()
