# apps/backend/app/api/v1/enterprise_router.py

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.enterprise.ai_portfolio_advisor import AIPortfolioAdvisorEngine
from app.enterprise.cross_repo_impact_analyzer import CrossRepoImpactAnalyzer
from app.enterprise.cross_repo_search import CrossRepoSearchEngine
from app.enterprise.enterprise_graph import EnterpriseKnowledgeGraph
from app.enterprise.enterprise_release_engine import EnterpriseReleaseEngine
from app.enterprise.enterprise_security_radar import EnterpriseSecurityRadar
from app.enterprise.performance_cost_engine import PerformanceCostEngine
from app.enterprise.portfolio_health_engine import PortfolioHealthEngine
from app.enterprise.team_intelligence_engine import TeamIntelligenceEngine
from app.enterprise.tech_stack_auditor import EnterpriseTechStackAuditor
from app.models.organization import Organization

router = APIRouter(prefix="/enterprise", tags=["Enterprise Portfolio Intelligence"])


class CreateOrganizationRequest(BaseModel):
    name: str
    slug: str
    domain: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class RegisterDependencyRequest(BaseModel):
    source_repo_id: str
    target_repo_id: str
    dependency_type: str
    source_symbol: Optional[str] = None
    target_symbol: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


@router.post("/organizations", status_code=status.HTTP_201_CREATED)
def create_organization(
    req: CreateOrganizationRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    existing = db.query(Organization).filter(Organization.slug == req.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Organization with slug '{req.slug}' already exists",
        )

    org = Organization(
        name=req.name, slug=req.slug, domain=req.domain, health_score=93.0
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    return {
        "id": org.id,
        "name": org.name,
        "slug": org.slug,
        "domain": org.domain,
        "health_score": org.health_score,
        "created_at": org.created_at.isoformat(),
    }


@router.get("/organizations/{org_id}/health")
def get_portfolio_health(org_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return PortfolioHealthEngine().get_portfolio_health(db, org_id)


@router.get("/organizations/{org_id}/graph")
def get_enterprise_graph(org_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return EnterpriseKnowledgeGraph().build_organization_graph(db, org_id)


@router.post("/organizations/{org_id}/dependencies")
def register_cross_dependency(
    org_id: str, req: RegisterDependencyRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return EnterpriseKnowledgeGraph().register_cross_dependency(
        db,
        org_id,
        req.source_repo_id,
        req.target_repo_id,
        req.dependency_type,
        req.source_symbol,
        req.target_symbol,
    )


@router.get("/organizations/{org_id}/impact-analysis")
def analyze_cross_repo_impact(
    org_id: str,
    target_repo_id: str = "demo-target-repo",
    changed_symbol: str = "POST /api/v1/auth/login",
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return CrossRepoImpactAnalyzer().analyze_impact(
        db, org_id, target_repo_id, changed_symbol
    )


@router.get("/organizations/{org_id}/tech-stack-audit")
def audit_tech_stack(org_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return EnterpriseTechStackAuditor().audit_organization(db, org_id)


@router.get("/organizations/{org_id}/security-radar")
def scan_security_radar(org_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return EnterpriseSecurityRadar().scan_organization_security(db, org_id)


@router.get("/organizations/{org_id}/search")
def search_cross_repo(
    org_id: str, query: str = "Authentication", db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return CrossRepoSearchEngine().search_organization(db, org_id, query)


@router.get("/organizations/{org_id}/team-intelligence")
def get_team_intelligence(org_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return TeamIntelligenceEngine().analyze_team_intelligence(db, org_id)


@router.get("/organizations/{org_id}/performance-costs")
def get_performance_costs(org_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return PerformanceCostEngine().analyze_performance_and_costs(db, org_id)


@router.get("/organizations/{org_id}/ai-portfolio-advisor")
def advise_ai_portfolio(
    org_id: str,
    prompt: str = "Which repositories should be modernized first?",
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return AIPortfolioAdvisorEngine().advise_portfolio(db, org_id, prompt)


@router.get("/organizations/{org_id}/command-center")
def get_command_center(org_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return EnterpriseReleaseEngine().get_command_center_data(db, org_id)
