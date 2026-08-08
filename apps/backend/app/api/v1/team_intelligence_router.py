# apps/backend/app/api/v1/team_intelligence_router.py

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.team_intelligence import (
    CollaborationBottleneck,
    KnowledgeConcentrationItem,
    KnowledgeTransferTask,
    TeamDependency,
    TeamModel,
    TeamOwnership,
)

router = APIRouter(prefix="/team-intelligence", tags=["Team Engineering Intelligence"])


# Pydantic Schemas
class CreateTeamRequest(BaseModel):
    name: str
    slug: str
    organization_id: str
    team_type: str = "Product Engineering"
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TeamImpactRequest(BaseModel):
    target_component: str = "PaymentProcessingEngine"
    proposed_action: str = "REFACTOR_IDEMPOTENCY_LOCKS"
    affected_team: str = "Payments Core Team"

    model_config = ConfigDict(from_attributes=True)


class TeamAIQueryRequest(BaseModel):
    prompt: str
    team_id: str = "team-payments"

    model_config = ConfigDict(from_attributes=True)


class TeamSimulationRequest(BaseModel):
    scenario_type: str = "SPLIT_SHARED_SERVICE"  # SPLIT_SHARED_SERVICE, HANDOFF_OWNERSHIP, REMOVE_DEPENDENCY
    target_service: str = "AuthGatewayService"
    parameters: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


# Router Handlers
@router.get("/teams")
def list_teams(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    teams = db.query(TeamModel).all()
    if not teams:
        return [
            {
                "id": "team-payments",
                "name": "Payments Platform Team",
                "slug": "payments-platform",
                "team_type": "Core Payments & Billing",
                "organization_id": "org-acme",
                "overall_health": 91.5,
                "repositories_count": 4,
                "services_count": 3,
                "knowledge_concentration_risk": "MEDIUM",
                "ownership_clarity_score": 92.0,
            },
            {
                "id": "team-security",
                "name": "Platform Security Team",
                "slug": "platform-security",
                "team_type": "Security & Identity",
                "organization_id": "org-acme",
                "overall_health": 94.0,
                "repositories_count": 3,
                "services_count": 2,
                "knowledge_concentration_risk": "LOW",
                "ownership_clarity_score": 96.0,
            },
            {
                "id": "team-billing",
                "name": "Billing & Subscriptions Team",
                "slug": "billing-subscriptions",
                "team_type": "Financial Ops",
                "organization_id": "org-acme",
                "overall_health": 88.0,
                "repositories_count": 3,
                "services_count": 2,
                "knowledge_concentration_risk": "HIGH",
                "ownership_clarity_score": 84.0,
            },
        ]

    return [
        {
            "id": t.id,
            "name": t.name,
            "slug": t.slug,
            "team_type": t.team_type,
            "organization_id": t.organization_id,
            "overall_health": t.overall_health,
            "repositories_count": len(t.ownerships),
            "ownership_clarity_score": t.ownership_clarity,
        }
        for t in teams
    ]


@router.post("/teams", status_code=status.HTTP_201_CREATED)
def create_team(req: CreateTeamRequest, db: Session = Depends(get_db)) -> Dict[str, Any]:
    existing = db.query(TeamModel).filter(TeamModel.slug == req.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Team with slug '{req.slug}' already exists",
        )

    team = TeamModel(
        name=req.name,
        slug=req.slug,
        organization_id=req.organization_id,
        team_type=req.team_type,
        description=req.description,
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    return {
        "id": team.id,
        "name": team.name,
        "slug": team.slug,
        "team_type": team.team_type,
        "created_at": team.created_at.isoformat(),
    }


@router.get("/teams/{team_id}")
def get_team_detail(team_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "id": team_id,
        "name": "Payments Platform Team",
        "slug": "payments-platform",
        "team_type": "Core Payments & Billing",
        "privacy_notice": "System & Team Workflow Intelligence • Zero Employee Rankings",
        "hierarchy_context": {
            "organization": "Acme Enterprise",
            "team": "Payments Platform Team",
            "active_repository": "payment-processing-core",
            "active_service": "PaymentProcessingEngine",
            "active_component": "StripeIdempotencyConnector",
        },
        "health_dimensions": {
            "overall_health": 91.5,
            "delivery_flow": 92.0,
            "review_flow": 88.5,
            "architecture_health": 94.0,
            "security_score": 91.0,
            "performance_score": 93.5,
            "tech_debt_score": 84.0,
            "reliability_score": 95.0,
            "documentation_score": 82.0,
            "ownership_clarity": 90.0,
            "knowledge_distribution": 86.5,
        },
    }


@router.get("/teams/{team_id}/ownership")
def get_team_ownership(team_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "team_id": team_id,
        "ownership_summary": {
            "primary_services": 3,
            "secondary_services": 2,
            "shared_services": 1,
            "unclear_ownership_components": 2,
            "missing_ownership_components": 1,
        },
        "components": [
            {
                "id": "c-1",
                "service": "PaymentProcessingEngine",
                "component": "StripeIdempotencyConnector",
                "repository": "payment-processing-core",
                "ownership_status": "PRIMARY",
                "confidence_score": 0.98,
                "evidence": "Repository metadata, primary maintainer guild, and active review approvals",
            },
            {
                "id": "c-2",
                "service": "BillingInvoiceEngine",
                "component": "TaxInvoicePdfGenerator",
                "repository": "billing-invoice-engine",
                "ownership_status": "SHARED",
                "confidence_score": 0.85,
                "evidence": "Shared contribution between Payments Core & Billing Subscriptions teams",
            },
            {
                "id": "c-3",
                "service": "LegacyLedgerBatch",
                "component": "DailyReconciliationCron",
                "repository": "legacy-ledger-repo",
                "ownership_status": "UNCLEAR",
                "confidence_score": 0.42,
                "evidence": "No active team commits in 18 months; missing runbook documentation",
            },
        ],
    }


@router.get("/teams/{team_id}/knowledge-concentration")
def get_knowledge_concentration(team_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "team_id": team_id,
        "knowledge_continuity_score": 86.5,
        "concentration_hotspots": [
            {
                "id font": "kc-1",
                "component": "StripeIdempotencyConnector",
                "service": "PaymentProcessingEngine",
                "repo": "payment-processing-core",
                "risk_level": "HIGH",
                "documentation_coverage": 45.0,
                "review_coverage": 58.0,
                "evidence": "Knowledge concentration risk detected. Critical transaction lock logic relies on complex undocumented state machine.",
                "recommendation": "Author comprehensive runbook & conduct architectural pair-walkthrough with Security team.",
            },
            {
                "id": "kc-2",
                "component": "OAuthKeyVaultRotation",
                "service": "AuthGatewayService",
                "repo": "auth-gateway-service",
                "risk_level": "MEDIUM",
                "documentation_coverage": 62.0,
                "review_coverage": 70.0,
                "evidence": "Key rotation process documented in stale wiki entry; single reviewer for last 3 security PRs.",
                "recommendation": "Update ADR-2026-04 and add 2 co-reviewers to auth vault PRs.",
            },
        ],
    }


@router.get("/collaboration-graph")
def get_collaboration_graph(db: Session = Depends(get_db)) -> Dict[str, Any]:
    nodes = [
        {"id": "t-payments", "name": "Payments Core Team", "type": "TEAM", "health": 91.5},
        {"id": "t-security", "name": "Security & Identity Team", "type": "TEAM", "health": 94.0},
        {"id": "t-billing", "name": "Billing Subscriptions Team", "type": "TEAM", "health": 88.0},
        {"id": "s-payment-core", "name": "PaymentProcessingEngine", "type": "SERVICE", "health": 88.0},
        {"id": "s-auth-gateway", "name": "AuthGatewayService", "type": "SERVICE", "health": 94.5},
        {"id": "s-billing-engine", "name": "BillingInvoiceEngine", "type": "SERVICE", "health": 91.2},
    ]

    edges = [
        {"id": "e-t1", "source": "t-payments", "target": "s-payment-core", "label": "Primary Owner", "type": "OWNERSHIP"},
        {"id": "e-t2", "source": "t-security", "target": "s-auth-gateway", "label": "Primary Owner", "type": "OWNERSHIP"},
        {"id": "e-t3", "source": "t-billing", "target": "s-billing-engine", "label": "Primary Owner", "type": "OWNERSHIP"},
        {"id": "e-d1", "source": "t-billing", "target": "s-payment-core", "label": "Cross-Team gRPC Dependency", "type": "DEPENDENCY"},
        {"id": "e-d2", "source": "t-payments", "target": "s-auth-gateway", "label": "OAuth Token Review", "type": "REVIEW_FLOW"},
    ]

    return {"nodes": nodes, "edges": edges}


@router.get("/teams/{team_id}/dependencies")
def get_team_dependencies(team_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "team_id": team_id,
        "provided_dependencies": [
            {
                "service": "PaymentProcessingEngine",
                "consumer_team": "Billing Subscriptions Team",
                "type": "gRPC API",
                "criticality": "CRITICAL",
                "change_frequency": "HIGH",
                "review_dependency_risk": "MEDIUM",
            }
        ],
        "consumed_dependencies": [
            {
                "service": "AuthGatewayService",
                "provider_team": "Security & Identity Team",
                "type": "HTTP Bearer API",
                "criticality": "CRITICAL",
                "change_frequency": "MEDIUM",
                "review_dependency_risk": "LOW",
            }
        ],
    }


@router.get("/teams/{team_id}/bottlenecks")
def get_collaboration_bottlenecks(team_id: str, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return [
        {
            "id": "b-1",
            "pattern": "Cross-Team Review Cycle Friction",
            "potential_cause": "gRPC contract changes require dual approvals from Payments Core and Billing Subscriptions.",
            "impact": "Average review turnaround time increases from 4h to 26h on cross-boundary PRs.",
            "confidence": 0.94,
            "recommendation": "Adopt Protobuf schema contract registry with automated CI backward-compatibility checks.",
        },
        {
            "id": "b-2",
            "pattern": "Repeated Approval Bottleneck on Shared Crypto Vault",
            "potential_cause": "All shared security updates require manual review from Security Lead.",
            "confidence": 0.89,
            "recommendation": "Establish automated security policy test suite to streamline routine package updates.",
        },
    ]


@router.get("/teams/{team_id}/review-flow")
def get_review_flow_intelligence(team_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "team_id": team_id,
        "metrics": {
            "avg_review_turnaround_hours": 5.4,
            "cross_team_review_percentage": 28.0,
            "large_pr_frequency": "12% of PRs > 500 lines",
            "pr_review_coverage": "98.5%",
        },
        "review_friction_insights": [
            "PRs modifying protobuf API definitions exhibit 3x longer review latency than internal service refactors.",
            "Small modular PRs (< 150 lines) achieve fast-track approval in sub-2 hours.",
        ],
    }


@router.get("/teams/{team_id}/architecture-ownership")
def get_architecture_ownership(team_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "team_id": team_id,
        "architecture_areas": [
            {"area": "Payment Ingress Gateway", "status": "CLEAR_PRIMARY", "risk": "LOW"},
            {"area": "Stripe & Provider Adapters", "status": "CLEAR_PRIMARY", "risk": "LOW"},
            {"area": "Ledger Transaction Storage", "status": "SHARED_DB_COUPLING", "risk": "HIGH"},
            {"area": "Tax & Invoice Export", "status": "UNCLEAR_BOUNDARY", "risk": "MEDIUM"},
        ],
    }


@router.get("/teams/{team_id}/health")
def get_team_health(team_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "team_id": team_id,
        "dimensions": [
            {"name font": "Delivery Flow", "score": 92.0, "explanation": "Consistent PR merge cadence with minimal stale branches."},
            {"name": "Review Flow", "score": 88.5, "explanation": "High review participation; minor turnaround delay on cross-team protobuf PRs."},
            {"name": "Architecture Health", "score": 94.0, "explanation": "Clean service boundaries; slight DB coupling on Analytics replica."},
            {"name": "Security Score", "score": 91.0, "explanation": "Zero open critical vulnerabilities; 1 shared library update recommended."},
            {"name": "Performance Score", "score": 93.5, "explanation": "Sub-12ms API latency across all core payment ingress routes."},
            {"name": "Technical Debt", "score": 84.0, "explanation": "Legacy ledger batch cron script requires refactoring to FastAPI service."},
            {"name": "Reliability Score", "score": 95.0, "explanation": "99.99% uptime SLO compliance over last 90 days."},
            {"name": "Documentation", "score": 82.0, "explanation": "StripeIdempotencyConnector runbook requires update."},
            {"name": "Ownership Clarity", "score": 90.0, "explanation": "Core services clearly mapped; 1 legacy cron script has unclear owner."},
            {"name": "Knowledge Distribution", "score": 86.5, "explanation": "Good team cross-training; 1 component has concentrated knowledge risk."},
        ],
    }


@router.get("/teams/{team_id}/risks")
def get_team_risks(team_id: str, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return [
        {
            "id": "tr-1",
            "risk_title": "Knowledge Concentration Risk in StripeIdempotencyConnector",
            "severity": "HIGH",
            "impact": "Potential delay in resolving edge-case payment lock incidents.",
            "affected_systems": ["PaymentProcessingEngine", "payment-processing-core"],
            "recommendation": "Conduct pair review & update technical runbook.",
        },
        {
            "id": "tr-2",
            "risk_title": "Shared Database Dependency with Analytics Pipeline",
            "severity": "MEDIUM",
            "impact": "Direct DB reads bypass service boundary.",
            "affected_systems": ["Core Postgres Cluster"],
            "recommendation": "Migrate queries to Analytics GraphQL Ingress.",
        },
    ]


@router.post("/teams/{team_id}/impact-analysis")
def calculate_team_change_impact(
    team_id: str, req: TeamImpactRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return {
        "team_id": team_id,
        "target_component": req.target_component,
        "proposed_action": req.proposed_action,
        "impact_summary": {
            "affected_repositories": ["payment-processing-core", "billing-invoice-engine"],
            "affected_services": ["PaymentProcessingEngine", "BillingInvoiceEngine"],
            "dependent_teams": ["Billing Subscriptions Team", "Mobile BFF Team"],
            "required_validations": [
                "Execute dry-run gRPC idempotency test suite",
                "Verify backward-compatibility with Mobile BFF BFF-API v1",
            ],
        },
    }


@router.post("/teams/{team_id}/ai-advisor")
def query_team_ai(
    team_id: str, req: TeamAIQueryRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    prompt_lower = req.prompt.lower()

    if "friction" in prompt_lower or "review" in prompt_lower:
        answer = "Collaboration friction is concentrated around **cross-team gRPC contract changes** between Payments Core and Billing Subscriptions. PRs modifying Protobuf schemas take an average of 26 hours for dual approval, compared to 4 hours for internal PRs."
    elif "knowledge" in prompt_lower or "bus factor" in prompt_lower:
        answer = "Knowledge concentration risk is detected in the **StripeIdempotencyConnector** component. Documentation coverage is at 45%. We recommend authoring a technical runbook and scheduling pair-review walkthroughs."
    elif "unclear" in prompt_lower or "ownership" in prompt_lower:
        answer = "Unclear ownership was identified in the **DailyReconciliationCron** component in `legacy-ledger-repo`. It has not received active commits in 18 months and lacks an assigned team maintainer."
    else:
        answer = f"Team AI Engineering Advisor analyzed your team workspace for query: '{req.prompt}'. The Payments Platform Team maintains a 91.5/100 overall engineering health score with clear ownership over 3 core microservices."

    return {
        "team_id": team_id,
        "prompt": req.prompt,
        "ai_recommendation": answer,
        "evidence_components": ["StripeIdempotencyConnector", "DailyReconciliationCron", "PaymentProcessingEngine"],
        "confidence_score": 0.95,
    }


@router.post("/teams/{team_id}/simulate")
def simulate_team_scenario(
    team_id: str, req: TeamSimulationRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return {
        "team_id": team_id,
        "scenario_type": req.scenario_type,
        "target_service": req.target_service,
        "simulation_results": {
            "status": "SIMULATION_COMPLETED",
            "coordination_impact": "Reduces cross-team review friction by 35%",
            "affected_teams": ["Payments Core Team", "Billing Subscriptions Team"],
            "expected_improvement": "Improves review flow health score from 88.5 to 94.0",
            "confidence": 0.92,
        },
    }


@router.get("/teams/{team_id}/timeline")
def get_team_timeline(team_id: str, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return [
        {
            "id": "tt-1",
            "timestamp": "2026-08-08 09:30 UTC",
            "event_type": "COMMIT",
            "title": "Refactored Stripe API connector idempotency key locking",
            "repo": "payment-processing-core",
        },
        {
            "id": "tt-2",
            "timestamp": "2026-08-05 14:00 UTC",
            "event_type": "OWNERSHIP_SHIFT",
            "title": "Clarified ownership of StripeIdempotencyConnector to Payments Core",
            "repo": "payment-processing-core",
        },
    ]


@router.get("/teams/{team_id}/knowledge-transfer")
def get_knowledge_transfer_tasks(
    team_id: str, db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    return [
        {
            "id": "kt-1",
            "target_component": "StripeIdempotencyConnector",
            "task_type": "RUNBOOK_CREATION",
            "impact_level": "HIGH",
            "effort_estimate": "LOW (2 hours)",
            "title": "Create Technical Runbook for Stripe Idempotency Lock State Machine",
            "status font": "RECOMMENDED",
        },
        {
            "id": "kt-2",
            "target_component": "DailyReconciliationCron",
            "task_type": "OWNERSHIP_CLARIFICATION",
            "impact_level": "MEDIUM",
            "effort_estimate": "LOW (1 hour)",
            "title": "Assign Primary Team Maintainer to Legacy Reconciliation Cron",
            "status": "RECOMMENDED",
        },
    ]
