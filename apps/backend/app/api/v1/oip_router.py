from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.oip import (
    AIOrgIntelligenceSchema,
    BusinessCriticalitySchema,
    EngineeringEarthNodeSchema,
    ExecutiveDashboardMetricsSchema,
    ExecutiveDeepAnalyticsSchema,
    KnowledgeDeepAnalyticsSchema,
    KnowledgeSiloSchema,
    MaturityScoreSchema,
    OrganizationCreate,
    OrganizationResponse,
    OrgGraphResponseSchema,
    PortfolioDeepAnalyticsSchema,
    RepositoryIntelligenceSchema,
    StrategyEngineRequest,
    StrategyEngineResponse,
    TeamCreate,
    TeamDeepAnalyticsSchema,
    TeamResponse,
)
from app.services.oip_service import OrganizationIntelligenceService

router = APIRouter()


@router.get(
    "/oip/overview",
    response_model=OrganizationResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Organization Intelligence Platform overview metrics",
)
def get_organization_overview(
    org_id: Optional[str] = Query(None, description="Optional Organization ID"),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    return OrganizationResponse.model_validate(org)


@router.post(
    "/oip/organizations",
    response_model=OrganizationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new Engineering Organization",
)
def create_organization(
    data: OrganizationCreate,
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.create_organization(data)
    return OrganizationResponse.model_validate(org)


@router.get(
    "/oip/teams",
    response_model=List[TeamResponse],
    status_code=status.HTTP_200_OK,
    summary="Get team workload, burnout risks, and debt contributions",
)
def get_teams(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    teams = service.get_teams(org.id)
    return [TeamResponse.model_validate(t) for t in teams]


@router.post(
    "/oip/teams",
    response_model=TeamResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register an engineering team",
)
def create_team(
    data: TeamCreate,
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    team = service.create_team(data)
    return TeamResponse.model_validate(team)


@router.get(
    "/oip/repositories",
    response_model=List[RepositoryIntelligenceSchema],
    status_code=status.HTTP_200_OK,
    summary="Get Repository Intelligence (Modernization, Maintenance Index, Bus Factor)",
)
def get_repositories_intelligence(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    repos = service.get_repository_intelligence(org.id)
    return [RepositoryIntelligenceSchema.model_validate(r) for r in repos]


@router.get(
    "/oip/knowledge-silos",
    response_model=List[KnowledgeSiloSchema],
    status_code=status.HTTP_200_OK,
    summary="Get Knowledge Intelligence and Silo risk analysis",
)
def get_knowledge_silos(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    silos = service.get_knowledge_silos(org.id)
    return [KnowledgeSiloSchema.model_validate(s) for s in silos]


@router.get(
    "/oip/business-criticality",
    response_model=List[BusinessCriticalitySchema],
    status_code=status.HTTP_200_OK,
    summary="Get Business Intelligence and Service Criticality assessment",
)
def get_business_criticality(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    crits = service.get_business_criticality(org.id)
    return [BusinessCriticalitySchema.model_validate(c) for c in crits]


@router.get(
    "/oip/executive-dashboard",
    response_model=ExecutiveDashboardMetricsSchema,
    status_code=status.HTTP_200_OK,
    summary="Get C-suite Executive Dashboard metrics and risk summary",
)
def get_executive_dashboard(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    return service.generate_executive_dashboard(org.id)


@router.post(
    "/oip/strategy-engine",
    response_model=StrategyEngineResponse,
    status_code=status.HTTP_200_OK,
    summary="Run AI Engineering Strategy Engine to generate recommendations",
)
def run_strategy_engine(
    req: StrategyEngineRequest,
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    return service.run_strategy_engine(req)


@router.post(
    "/oip/analyze",
    status_code=status.HTTP_200_OK,
    summary="Trigger end-to-end Organization Intelligence analysis",
)
def trigger_analysis(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    return service.trigger_full_organization_analysis(org.id)


@router.get(
    "/oip/maturity-score",
    response_model=MaturityScoreSchema,
    status_code=status.HTTP_200_OK,
    summary="Get 0-100 Engineering Maturity Score across 7 dimensions (Feature 5)",
)
def get_maturity_score(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    mat = service.get_engineering_maturity_score(org.id)
    return MaturityScoreSchema.model_validate(mat)


@router.get(
    "/oip/org-graph",
    response_model=OrgGraphResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Get 8-tier Google Maps-style Engineering Organization Hierarchy Graph (Feature 4)",
)
def get_organization_graph(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    return service.get_organization_graph(org.id)


@router.get(
    "/oip/team-deep-analytics",
    response_model=List[TeamDeepAnalyticsSchema],
    status_code=status.HTTP_200_OK,
    summary="Get Deep Team Intelligence Analytics for Features 6-20",
)
def get_team_deep_analytics(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    teams_deep = service.get_team_deep_analytics(org.id)
    return [TeamDeepAnalyticsSchema.model_validate(td) for td in teams_deep]


@router.get(
    "/oip/portfolio-deep-analytics",
    response_model=List[PortfolioDeepAnalyticsSchema],
    status_code=status.HTTP_200_OK,
    summary="Get Deep Repository Portfolio Analytics for Features 21-40",
)
def get_portfolio_deep_analytics(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    portfolio = service.get_portfolio_deep_analytics(org.id)
    return [PortfolioDeepAnalyticsSchema.model_validate(p) for p in portfolio]


@router.get(
    "/oip/knowledge-deep-analytics",
    response_model=KnowledgeDeepAnalyticsSchema,
    status_code=status.HTTP_200_OK,
    summary="Get Deep Knowledge Intelligence Analytics for Features 41-60",
)
def get_knowledge_deep_analytics(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    k = service.get_knowledge_deep_analytics(org.id)
    return KnowledgeDeepAnalyticsSchema.model_validate(k)


@router.get(
    "/oip/executive-deep-analytics",
    response_model=ExecutiveDeepAnalyticsSchema,
    status_code=status.HTTP_200_OK,
    summary="Get Deep Executive Intelligence & CTO Dashboard Analytics for Features 61-80",
)
def get_executive_deep_analytics(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    exec_deep = service.get_executive_deep_analytics(org.id)
    return ExecutiveDeepAnalyticsSchema.model_validate(exec_deep)


@router.get(
    "/oip/ai-org-intelligence",
    response_model=AIOrgIntelligenceSchema,
    status_code=status.HTTP_200_OK,
    summary="Get AI Organization Intelligence Analytics for Features 81-100",
)
def get_ai_org_intelligence(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    ai_obj = service.get_ai_org_intelligence(org.id)
    return AIOrgIntelligenceSchema.model_validate(ai_obj)


@router.get(
    "/oip/engineering-earth",
    response_model=List[EngineeringEarthNodeSchema],
    status_code=status.HTTP_200_OK,
    summary="Get Engineering Earth Google-Earth Styled Node Telemetry (Signature Feature 100)",
)
def get_engineering_earth(
    org_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    service = OrganizationIntelligenceService(db)
    org = service.get_organization_overview(org_id)
    earth_nodes = service.get_engineering_earth(org.id)
    return [EngineeringEarthNodeSchema.model_validate(node) for node in earth_nodes]
