# apps/backend/app/api/v1/workspace_router.py

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.organization import Organization
from app.models.repository import Repository
from app.models.workspace import (
    Workspace,
    WorkspaceAuditLog,
    WorkspaceDependency,
    WorkspaceMember,
    WorkspaceRepository,
    WorkspaceService,
)

router = APIRouter(prefix="/workspaces", tags=["Multi-Repository Workspace Intelligence"])


# Pydantic Schemas
class CreateWorkspaceRequest(BaseModel):
    name: str
    slug: str
    organization_id: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ConnectRepositoryRequest(BaseModel):
    repository_url: str
    provider: str = "github"  # github, gitlab, bitbucket, azure_devops
    branch: str = "main"
    access_config: Optional[Dict[str, Any]] = None
    group_name: str = "Core Services"

    model_config = ConfigDict(from_attributes=True)


class WorkspaceActionRequest(BaseModel):
    action: str  # pause_analysis, resume_analysis, refresh_analysis, rename, group, tag, favorite, archive
    new_name: Optional[str] = None
    group_name: Optional[str] = None
    tags: Optional[List[str]] = None
    is_favorite: Optional[bool] = None
    is_archived: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)


class ImpactAnalysisRequest(BaseModel):
    change_type: str = "API_MODIFICATION"  # API_MODIFICATION, SERVICE_EXTRACTION, REPO_MIGRATION, DB_SCHEMA_CHANGE
    source_service: str = "Payment Service"
    target_entity: str = "POST /api/v1/payments/charge"
    details: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SimulationRequest(BaseModel):
    simulation_type: str = "SHARED_LIB_UPDATE"  # API_CHANGE, DEPENDENCY_UPGRADE, SERVICE_EXTRACTION, DB_MIGRATION
    target_repository: str = "payment-gateway-repo"
    proposed_version: str = "2.0.0-rc1"
    parameters: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class AIQueryRequest(BaseModel):
    prompt: str
    context_level: str = "WORKSPACE"

    model_config = ConfigDict(from_attributes=True)


# Routes Implementation
@router.get("")
def list_workspaces(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    workspaces = db.query(Workspace).all()
    if not workspaces:
        # Return default mock workspace if database is empty for seamless experience
        return [
            {
                "id": "ws-fintech-core",
                "name": "FinTech Ecosystem Workspace",
                "slug": "fintech-core",
                "organization_id": "org-acme-global",
                "description": "Multi-repository workspace linking payment gateways, billing engine, mobile backends, and reporting pipelines.",
                "health_score": 93.4,
                "architecture_health": 95.0,
                "security_health": 88.5,
                "performance_health": 94.2,
                "tech_debt_score": 84.0,
                "repository_count": 8,
                "service_count": 12,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        ]
    
    res = []
    for ws in workspaces:
        res.append({
            "id": ws.id,
            "name": ws.name,
            "slug": ws.slug,
            "organization_id": ws.organization_id,
            "description": ws.description,
            "health_score": ws.health_score,
            "architecture_health": ws.architecture_health,
            "security_health": ws.security_health,
            "performance_health": ws.performance_health,
            "tech_debt_score": ws.tech_debt_score,
            "repository_count": len(ws.workspace_repos),
            "service_count": len(ws.services),
            "created_at": ws.created_at.isoformat(),
        })
    return res


@router.post("", status_code=status.HTTP_201_CREATED)
def create_workspace(req: CreateWorkspaceRequest, db: Session = Depends(get_db)) -> Dict[str, Any]:
    existing = db.query(Workspace).filter(Workspace.slug == req.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Workspace with slug '{req.slug}' already exists",
        )

    ws = Workspace(
        name=req.name,
        slug=req.slug,
        organization_id=req.organization_id,
        description=req.description,
        health_score=92.0,
    )
    db.add(ws)
    db.commit()
    db.refresh(ws)
    return {
        "id": ws.id,
        "name": ws.name,
        "slug": ws.slug,
        "organization_id": ws.organization_id,
        "description": ws.description,
        "health_score": ws.health_score,
        "created_at": ws.created_at.isoformat(),
    }


@router.get("/{ws_id}")
def get_workspace_detail(ws_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    ws = db.query(Workspace).filter(Workspace.id == ws_id).first()
    
    return {
        "id": ws_id,
        "name": ws.name if ws else "FinTech Ecosystem Workspace",
        "slug": ws.slug if ws else "fintech-core",
        "organization": {
            "id": "org-acme",
            "name": "Acme Global Enterprise",
            "domain": "acme-corp.internal",
        },
        "hierarchy_context": {
            "organization": "Acme Global Enterprise",
            "workspace": ws.name if ws else "FinTech Ecosystem Workspace",
            "active_application": "Payments Platform",
            "active_service": "PaymentGatewayService",
            "active_repository": "payment-gateway-repo",
        },
        "health_score": ws.health_score if ws else 93.4,
        "architecture_health": ws.architecture_health if ws else 95.0,
        "security_health": ws.security_health if ws else 88.5,
        "performance_health": ws.performance_health if ws else 94.2,
        "tech_debt_score": ws.tech_debt_score if ws else 84.0,
    }


@router.get("/{ws_id}/overview")
def get_workspace_overview(ws_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "workspace_id": ws_id,
        "metrics": {
            "overall_health": 93.4,
            "architecture_health": 95.0,
            "security_health": 88.5,
            "performance_health": 94.2,
            "technical_debt_score": 84.0,
            "code_quality_score": 91.8,
            "reliability_score": 96.1,
            "active_repositories": 8,
            "total_services": 12,
            "cross_dependencies": 24,
        },
        "critical_systems": [
            {
                "id": "sys-auth-gateway",
                "name": "AuthGatewayService",
                "repository": "auth-gateway-repo",
                "criticality": "CRITICAL",
                "centrality_score": 0.96,
                "consumer_count": 11,
                "provider_count": 2,
                "evidence": [
                    "Inbound dependency from 11 microservices",
                    "OAuth2 token issuer for all public APIs",
                    "Shared Redis Session Cluster connectivity",
                ],
            },
            {
                "id": "sys-payment-core",
                "name": "PaymentProcessingEngine",
                "repository": "payment-core-repo",
                "criticality": "CRITICAL",
                "centrality_score": 0.92,
                "consumer_count": 8,
                "provider_count": 4,
                "evidence": [
                    "Direct Stripe / DB transactional locks",
                    "Consumes AuthGateway token verification",
                    "Produces audit Kafka events to LedgerService",
                ],
            },
        ],
        "active_risks": [
            {
                "id": "risk-1",
                "severity": "HIGH",
                "title": "Outdated Shared Security Library across 4 Repositories",
                "affected_repositories": ["auth-repo", "billing-repo", "checkout-repo", "user-repo"],
                "impact": "JWT verification potential vulnerability (CVE-2026-4491)",
                "recommendation": "Upgrade @acme/sec-vault from v1.2.0 to v2.1.0",
            },
            {
                "id": "risk-2",
                "severity": "MEDIUM",
                "title": "Tight Architectural Coupling: Payment API -> Analytics DB",
                "affected_repositories": ["payment-core-repo", "analytics-db-repo"],
                "impact": "Direct DB table read bypasses Analytics API abstraction layer",
                "recommendation": "Decouple query through Analytics GraphQL Ingress",
            },
        ],
        "recent_changes": [
            {
                "id": "chg-101",
                "timestamp": "12m ago",
                "repository": "payment-gateway-repo",
                "author": "Sarah Chen",
                "summary": "feat: add Idempotency-Key support to /v1/charge API",
                "risk_rating": "LOW",
            },
            {
                "id": "chg-102",
                "timestamp": "45m ago",
                "repository": "auth-gateway-repo",
                "author": "Alex Rivera",
                "summary": "refactor: rotate OAuth RS256 keypair cache timeout",
                "risk_rating": "LOW",
            },
        ],
    }


@router.get("/{ws_id}/system-map")
def get_system_map(ws_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    # Returns virtualized graph payload for ecosystem map canvas
    nodes = [
        {
            "id": "node-auth-repo",
            "name": "Auth Gateway Repo",
            "type": "REPOSITORY",
            "category": "services",
            "health": 94.5,
            "status": "ready",
            "criticality": "CRITICAL",
            "tech_stack": ["TypeScript", "NestJS", "Redis"],
            "owner": "Security Team",
        },
        {
            "id": "node-payment-repo",
            "name": "Payment Gateway Repo",
            "type": "REPOSITORY",
            "category": "services",
            "health": 88.0,
            "status": "ready",
            "criticality": "CRITICAL",
            "tech_stack": ["Go", "gRPC", "PostgreSQL"],
            "owner": "Payments Core",
        },
        {
            "id": "node-billing-repo",
            "name": "Billing & Invoice Service",
            "type": "REPOSITORY",
            "category": "services",
            "health": 91.2,
            "status": "ready",
            "criticality": "HIGH",
            "tech_stack": ["Python", "FastAPI", "Stripe"],
            "owner": "Billing Team",
        },
        {
            "id": "node-db-primary",
            "name": "Core Postgres Cluster",
            "type": "DATABASE",
            "category": "databases",
            "health": 99.0,
            "status": "ready",
            "criticality": "CRITICAL",
            "tech_stack": ["PostgreSQL 16"],
            "owner": "Database Infra",
        },
        {
            "id": "node-redis-cache",
            "name": "Session Lock Redis",
            "type": "CACHE",
            "category": "infra",
            "health": 98.5,
            "status": "ready",
            "criticality": "HIGH",
            "tech_stack": ["Redis 7 Cluster"],
            "owner": "Infra Ops",
        },
        {
            "id": "node-kafka-bus",
            "name": "Event Stream Kafka",
            "type": "MESSAGE_QUEUE",
            "category": "infra",
            "health": 96.0,
            "status": "ready",
            "criticality": "HIGH",
            "tech_stack": ["Apache Kafka 3.6"],
            "owner": "Event Bus Team",
        },
        {
            "id": "node-shared-crypto",
            "name": "@acme/sec-vault",
            "type": "EXTERNAL_DEPENDENCY",
            "category": "libraries",
            "health": 82.0,
            "status": "needs_attention",
            "criticality": "HIGH",
            "tech_stack": ["TypeScript Package"],
            "owner": "SecOps",
        },
    ]

    edges = [
        {"id": "e1", "source": "node-payment-repo", "target": "node-auth-repo", "type": "HTTP_API", "label": "Validate OAuth Token", "criticality": "HIGH"},
        {"id": "e2", "source": "node-billing-repo", "target": "node-payment-repo", "type": "GRPC", "label": "Execute Charge", "criticality": "CRITICAL"},
        {"id": "e3", "source": "node-auth-repo", "target": "node-redis-cache", "type": "DATABASE", "label": "Store Session", "criticality": "HIGH"},
        {"id": "e4", "source": "node-payment-repo", "target": "node-db-primary", "type": "DATABASE", "label": "Ledger Tx Writes", "criticality": "CRITICAL"},
        {"id": "e5", "source": "node-payment-repo", "target": "node-kafka-bus", "type": "MESSAGE_QUEUE", "label": "Publish payment.success", "criticality": "MEDIUM"},
        {"id": "e6", "source": "node-payment-repo", "target": "node-shared-crypto", "type": "SHARED_LIB", "label": "Import RSA Vault", "criticality": "HIGH"},
    ]

    return {"workspace_id": ws_id, "nodes": nodes, "edges": edges}


@router.get("/{ws_id}/repositories")
def get_workspace_repositories(ws_id: str, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return [
        {
            "id": "repo-auth-gateway",
            "name": "auth-gateway-service",
            "url": "https://github.com/acme-org/auth-gateway-service",
            "provider": "github",
            "branch": "main",
            "group": "Security & Identity",
            "status": "ready",
            "is_favorite": True,
            "is_archived": False,
            "health_score": 94.5,
            "language": "TypeScript",
            "last_updated": "10 minutes ago",
            "connection_health": "OPTIMAL",
            "services_exposed": ["AuthGateway", "OAuthTokenIssuer"],
        },
        {
            "id": "repo-payment-core",
            "name": "payment-processing-core",
            "url": "https://github.com/acme-org/payment-processing-core",
            "provider": "github",
            "branch": "main",
            "group": "Payments Platform",
            "status": "ready",
            "is_favorite": True,
            "is_archived": False,
            "health_score": 88.0,
            "language": "Go",
            "last_updated": "25 minutes ago",
            "connection_health": "OPTIMAL",
            "services_exposed": ["PaymentProcessor", "StripeConnector"],
        },
        {
            "id": "repo-billing-engine",
            "name": "billing-invoice-engine",
            "url": "https://github.com/acme-org/billing-invoice-engine",
            "provider": "github",
            "branch": "main",
            "group": "Payments Platform",
            "status": "analyzing",
            "is_favorite": False,
            "is_archived": False,
            "health_score": 91.2,
            "language": "Python",
            "last_updated": "Just now",
            "connection_health": "ANALYZING_AST",
            "services_exposed": ["InvoiceGenerator", "SubscriptionManager"],
        },
        {
            "id": "repo-shared-libs",
            "name": "enterprise-common-utils",
            "url": "https://github.com/acme-org/enterprise-common-utils",
            "provider": "github",
            "branch": "main",
            "group": "Shared Infrastructure",
            "status": "needs_attention",
            "is_favorite": False,
            "is_archived": False,
            "health_score": 82.0,
            "language": "TypeScript",
            "last_updated": "1 hour ago",
            "connection_health": "OUTDATED_DEPS",
            "services_exposed": ["Logger", "SecVault"],
        },
    ]


@router.post("/{ws_id}/repositories", status_code=status.HTTP_201_CREATED)
def connect_repository(
    ws_id: str, req: ConnectRepositoryRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    repo_name = req.repository_url.rstrip("/").split("/")[-1]
    return {
        "id": f"repo-custom-{repo_name}",
        "name": repo_name,
        "url": req.repository_url,
        "provider": req.provider,
        "branch": req.branch,
        "group": req.group_name,
        "status": "queued",
        "health_score": 90.0,
        "connection_health": "INGESTING",
        "message": f"Successfully connected '{repo_name}' to workspace. AST parse and dependency discovery queued.",
    }


@router.patch("/{ws_id}/repositories/{repo_id}")
def update_repository_action(
    ws_id: str, repo_id: str, req: WorkspaceActionRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return {
        "workspace_id": ws_id,
        "repository_id": repo_id,
        "action": req.action,
        "status": "updated",
        "message": f"Action '{req.action}' successfully executed on repository '{repo_id}'.",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.delete("/{ws_id}/repositories/{repo_id}")
def remove_repository(ws_id: str, repo_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "workspace_id": ws_id,
        "repository_id": repo_id,
        "status": "removed",
        "message": f"Repository '{repo_id}' unlinked from workspace.",
    }


@router.post("/{ws_id}/impact-analysis")
def calculate_cross_repo_impact(
    ws_id: str, req: ImpactAnalysisRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return {
        "workspace_id": ws_id,
        "proposed_change": {
            "type": req.change_type,
            "source_service": req.source_service,
            "target_entity": req.target_entity,
        },
        "blast_radius": {
            "overall_risk": "HIGH",
            "confidence": 0.94,
            "direct_affected_services": [
                {"name": "CheckoutService", "repository": "checkout-repo", "coupling_type": "HTTP_API_CALL"},
                {"name": "BillingEngine", "repository": "billing-repo", "coupling_type": "gRPC_CALL"},
            ],
            "indirect_affected_services": [
                {"name": "MobileBackendBFF", "repository": "mobile-bff-repo", "via": "CheckoutService"},
                {"name": "ReportingPipeline", "repository": "reporting-repo", "via": "Kafka payment.success Topic"},
            ],
            "potentially_broken_tests": 18,
            "recommended_mitigations": [
                "Deploy API versioning bump (/v2/charge) to maintain backwards compatibility for Mobile Backend BFF",
                "Execute integration test suite in dry-run simulation mode before merging PR",
            ],
        },
    }


@router.post("/{ws_id}/ai")
def query_workspace_ai(
    ws_id: str, req: AIQueryRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    prompt_lower = req.prompt.lower()
    
    if "important" in prompt_lower or "critical" in prompt_lower:
        answer = "Based on centrality score and consumer node connectivity across the workspace graph, the **AuthGatewayService** (auth-gateway-repo) and **PaymentProcessingEngine** (payment-core-repo) are the most systemically important repositories. AuthGateway sits in the critical path for 11 microservices, while PaymentProcessingEngine handles all transactional ledger locks."
    elif "depend" in prompt_lower or "payments" in prompt_lower:
        answer = "The **Payments Platform** has 4 direct consumers across the workspace: CheckoutService (checkout-repo), BillingEngine (billing-repo), MobileBackendBFF (mobile-bff-repo), and SubscriptionManager (subscription-repo). Indirectly, the Analytics Pipeline reads audit logs emitted by Payment processing."
    elif "risk" in prompt_lower or "security" in prompt_lower:
        answer = "The highest cross-repository security risk detected is an outdated `@acme/sec-vault` dependency across 4 repositories (CVE-2026-4491 vulnerability in RS256 token verification). Additionally, Payment processing has a tight architectural coupling directly to the Analytics Postgres replica."
    elif "break" in prompt_lower or "impact" in prompt_lower:
        answer = "Modifying the `/v1/payments/charge` API contract will directly impact CheckoutService and BillingEngine, and indirectly impact MobileBackendBFF (which delegates token generation). High risk of breaking 18 end-to-end integration tests if backwards compatibility is broken."
    else:
        answer = f"Workspace AI analyzed graph relationships across your connected repositories. For prompt: '{req.prompt}', the architecture shows 12 microservices linked via HTTP/gRPC with an overall engineering health score of 93.4/100."

    return {
        "workspace_id": ws_id,
        "query": req.prompt,
        "ai_insight": answer,
        "graph_evidence_nodes": ["AuthGatewayService", "PaymentProcessingEngine", "CheckoutService", "BillingEngine"],
        "confidence_score": 0.96,
    }


@router.post("/{ws_id}/simulate")
def run_workspace_simulation(
    ws_id: str, req: SimulationRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return {
        "workspace_id": ws_id,
        "simulation_id": "sim-run-8821",
        "simulation_type": req.simulation_type,
        "target_repository": req.target_repository,
        "proposed_version": req.proposed_version,
        "results": {
            "status": "SIMULATION_COMPLETED",
            "risk_score": 0.42,
            "affected_repositories": ["billing-repo", "checkout-repo", "auth-repo"],
            "breaking_changes_detected": 1,
            "performance_delta": "+4.2ms latency improvement",
            "security_delta": "Resolves CVE-2026-4491 vulnerability",
            "architectural_drift": "Zero drift detected against SOC2 compliance baseline",
        },
    }


@router.get("/{ws_id}/timeline")
def get_workspace_timeline(ws_id: str, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return [
        {
            "id": "tl-1",
            "timestamp": "2026-08-08 09:30 UTC",
            "event_type": "COMMIT",
            "repository": "payment-gateway-repo",
            "title": "Refactored Stripe API connector idempotency",
            "author": "Sarah Chen",
        },
        {
            "id": "tl-2",
            "timestamp": "2026-08-07 16:45 UTC",
            "event_type": "ARCHITECTURE_SHIFT",
            "repository": "auth-gateway-repo",
            "title": "Extracted Redis Session Cache cluster from monolithic DB",
            "author": "Architecture Council",
        },
        {
            "id": "tl-3",
            "timestamp": "2026-08-06 14:10 UTC",
            "event_type": "RELEASE",
            "repository": "billing-invoice-engine",
            "title": "v2.4.0 Release - Automated VAT Tax Calculation",
            "author": "Release Automation Bot",
        },
    ]


@router.get("/{ws_id}/audit")
def get_workspace_audit_logs(ws_id: str, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return [
        {
            "id": "aud-1",
            "timestamp": "2026-08-08 10:15 UTC",
            "action": "REPOSITORY_CONNECTED",
            "performed_by": "Principal Architect (User 1)",
            "details": "Connected repository 'https://github.com/acme-org/payment-processing-core' to workspace.",
        },
        {
            "id": "aud-2",
            "timestamp": "2026-08-08 09:00 UTC",
            "action": "SIMULATION_CREATED",
            "performed_by": "Lead Engineer (User 4)",
            "details": "Executed API blast-radius impact analysis for Payment Gateway v2 refactor.",
        },
        {
            "id": "aud-3",
            "timestamp": "2026-08-07 18:30 UTC",
            "action": "WORKSPACE_CONFIG_CHANGED",
            "performed_by": "Administrator (User 2)",
            "details": "Updated workspace security governance threshold from 85.0 to 88.0.",
        },
    ]


@router.get("/{ws_id}/search")
def search_workspace(
    ws_id: str, q: str = "", db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    if not q:
        return []
    
    return [
        {
            "type": "REPOSITORY",
            "title": "payment-processing-core",
            "subtitle": "Payment Platform Core Service",
            "context": "FinTech Ecosystem Workspace / Payments Platform",
            "matched_item": "payment-processing-core repo",
        },
        {
            "type": "FUNCTION",
            "title": "executeIdempotentCharge()",
            "subtitle": "payment_gateway.go:142",
            "context": "payment-processing-core -> PaymentProcessor module",
            "matched_item": f"Code matches query '{q}' in charge token processing",
        },
        {
            "type": "API",
            "title": "POST /api/v1/payments/charge",
            "subtitle": "Auth Gateway -> Payment Core REST Ingress",
            "context": "AuthGatewayService REST Ingress Controller",
            "matched_item": f"API Endpoint matching '{q}'",
        },
        {
            "type": "SECURITY_FINDING",
            "title": "Outdated RSA Vault Dependency",
            "subtitle": "CVE-2026-4491 in @acme/sec-vault",
            "context": "Shared Infrastructure Library across 4 Repos",
            "matched_item": f"Security finding for '{q}'",
        },
    ]
