from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.edie import (
    ADRExportResponse,
    ADRValidationReport,
    AIReasoningSuiteResponse,
    ArchitectureStoryResponse,
    DecisionEvolutionSuiteResponse,
    DecisionGraphResponse,
    DecisionTimelineEventResponse,
    DecisionValidationResponse,
    DesignPatternTrackItem,
    EDIESummaryStats,
    EngineeringBrainResponse,
    EngineeringDecisionCreate,
    EngineeringDecisionResponse,
    EngineeringWikiResponse,
    EvolutionNarrativeEra,
    ExecutiveIntelligenceSuiteResponse,
    FrameworkAdoptionItem,
    FutureRecommendationResponse,
    KnowledgeGapItem,
    ReasoningQueryRequest,
    ReasoningQueryResponse,
    RepositoryHistorianNarrative,
    TechnologyLifecycleItem,
)
from app.services.edie_service import EDIEService

router = APIRouter()


@router.get(
    "/edie/summary/{repo_id}",
    response_model=EDIESummaryStats,
    status_code=status.HTTP_200_OK,
)
def get_edie_summary(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Get high-level summary statistics for EDIE dashboard.
    """
    return EDIEService.get_summary_stats(db, repo_id)


@router.get(
    "/edie/decisions/{repo_id}",
    response_model=List[EngineeringDecisionResponse],
    status_code=status.HTTP_200_OK,
)
def get_engineering_decisions(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieve all stored engineering decisions for a repository.
    """
    decisions = EDIEService.get_decisions(db, repo_id)
    return [EngineeringDecisionResponse.from_orm(d) for d in decisions]


@router.get(
    "/edie/decisions/detail/{decision_id}",
    response_model=EngineeringDecisionResponse,
    status_code=status.HTTP_200_OK,
)
def get_decision_detail(
    decision_id: str,
    db: Session = Depends(get_db),
):
    """
    Get detailed information about a specific engineering decision.
    """
    dec = EDIEService.get_decision(db, decision_id)
    if not dec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Decision with ID '{decision_id}' not found.",
        )
    return EngineeringDecisionResponse.from_orm(dec)


@router.post(
    "/edie/decisions",
    response_model=EngineeringDecisionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_engineering_decision(
    decision_in: EngineeringDecisionCreate,
    db: Session = Depends(get_db),
):
    """
    Record a new engineering decision.
    """
    dec = EDIEService.create_decision(db, decision_in)
    return EngineeringDecisionResponse.from_orm(dec)


@router.post(
    "/edie/query",
    response_model=ReasoningQueryResponse,
    status_code=status.HTTP_200_OK,
)
def query_reasoning_engine(
    query_in: ReasoningQueryRequest,
    db: Session = Depends(get_db),
):
    """
    Ask natural language 'Why' questions to the Engineering Reasoning Engine.
    Ex: 'Why was Redis introduced?', 'Why did we split Payments into microservices?'
    """
    return EDIEService.query_reasoning_engine(
        db, query_in.repository_id, query_in.query
    )


@router.get(
    "/edie/graph/{repo_id}",
    response_model=DecisionGraphResponse,
    status_code=status.HTTP_200_OK,
)
def get_decision_graph(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieve the connected Engineering Decision Graph (nodes and edges).
    """
    return EDIEService.build_decision_graph(db, repo_id)


@router.get(
    "/edie/timeline/{repo_id}",
    response_model=List[DecisionTimelineEventResponse],
    status_code=status.HTTP_200_OK,
)
def get_decision_timeline(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieve the chronological decision timeline events.
    """
    return EDIEService.get_decision_timeline(db, repo_id)


@router.get(
    "/edie/validate/{repo_id}",
    response_model=List[DecisionValidationResponse],
    status_code=status.HTTP_200_OK,
)
def validate_decisions(
    repo_id: str,
    decision_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Validate codebase compliance and drift status against engineering decisions.
    """
    return EDIEService.validate_decisions(db, repo_id, decision_id)


@router.get(
    "/edie/recommendations/{repo_id}",
    response_model=List[FutureRecommendationResponse],
    status_code=status.HTTP_200_OK,
)
def get_future_recommendations(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Get AI-predicted future recommendations for system evolution.
    """
    return EDIEService.generate_future_recommendations(db, repo_id)


@router.get(
    "/edie/export-adr/{decision_id}",
    response_model=ADRExportResponse,
    status_code=status.HTTP_200_OK,
)
def export_adr_markdown(
    decision_id: str,
    db: Session = Depends(get_db),
):
    """
    Export an engineering decision as a standard MADR Markdown file.
    """
    try:
        return EDIEService.export_adr_markdown(db, decision_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get(
    "/edie/wiki/{repo_id}",
    response_model=EngineeringWikiResponse,
    status_code=status.HTTP_200_OK,
)
def get_engineering_wiki(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Generate an enterprise Engineering Architecture Wiki for the repository.
    """
    return EDIEService.generate_engineering_wiki(db, repo_id)


@router.get(
    "/edie/historian/{repo_id}",
    response_model=RepositoryHistorianNarrative,
    status_code=status.HTTP_200_OK,
)
def get_repository_historian_narrative(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Get AI Repository Historian narrative detailing key architectural inflection points.
    """
    return EDIEService.get_repository_historian_narrative(db, repo_id)


@router.get(
    "/edie/architecture-story/{repo_id}",
    response_model=ArchitectureStoryResponse,
    status_code=status.HTTP_200_OK,
)
def get_architecture_story(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Generate an Architecture Story narrative for executive reporting.
    """
    return EDIEService.generate_architecture_story(db, repo_id)


@router.get(
    "/edie/evolution-narrative/{repo_id}",
    response_model=List[EvolutionNarrativeEra],
    status_code=status.HTTP_200_OK,
)
def get_evolution_narrative(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Get chronological repository evolution narrative eras.
    """
    return EDIEService.get_evolution_narrative(db, repo_id)


@router.get(
    "/edie/design-patterns/{repo_id}",
    response_model=List[DesignPatternTrackItem],
    status_code=status.HTTP_200_OK,
)
def get_design_patterns(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Track design patterns adopted across the codebase.
    """
    return EDIEService.get_design_patterns(db, repo_id)


@router.get(
    "/edie/framework-timeline/{repo_id}",
    response_model=List[FrameworkAdoptionItem],
    status_code=status.HTTP_200_OK,
)
def get_framework_adoption_timeline(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Get Framework & Infrastructure adoption and deprecation timeline.
    """
    return EDIEService.get_framework_adoption_timeline(db, repo_id)


@router.get(
    "/edie/tech-lifecycle/{repo_id}",
    response_model=List[TechnologyLifecycleItem],
    status_code=status.HTTP_200_OK,
)
def get_technology_lifecycle_tracker(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Track technology lifecycle stages (Evaluating, Adopted, Deprecated, Sunset).
    """
    return EDIEService.get_technology_lifecycle_tracker(db, repo_id)


@router.get(
    "/edie/knowledge-gaps/{repo_id}",
    response_model=List[KnowledgeGapItem],
    status_code=status.HTTP_200_OK,
)
def detect_knowledge_gaps(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Detect undocumented services, missing ADRs, and orphaned components.
    """
    return EDIEService.detect_knowledge_gaps(db, repo_id)


@router.post(
    "/edie/validate-adr",
    response_model=ADRValidationReport,
    status_code=status.HTTP_200_OK,
)
def validate_adr_content(
    filename: str = Query("ADR-001.md"),
    content: str = Query(""),
):
    """
    Validate ADR markdown structure and completeness against MADR standard.
    """
    return EDIEService.validate_adr_content(filename, content)


@router.get(
    "/edie/ai-reasoning/{repo_id}",
    response_model=AIReasoningSuiteResponse,
    status_code=status.HTTP_200_OK,
)
def get_ai_reasoning_suite(
    repo_id: str,
    decision_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get full AI Reasoning Suite analysis (Features 21-40: Debates, Trade-offs, Reviews, Advisors, Migration steps).
    """
    return EDIEService.generate_ai_reasoning_suite(db, repo_id, decision_id)


@router.get(
    "/edie/decision-evolution/{repo_id}",
    response_model=DecisionEvolutionSuiteResponse,
    status_code=status.HTTP_200_OK,
)
def get_decision_evolution_suite(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Get Decision Evolution analysis (Features 41-60: Tech replacements, DB evolution, Cloud migration, Observability, Strategy).
    """
    return EDIEService.generate_decision_evolution_suite(db, repo_id)


@router.post(
    "/edie/engineering-brain",
    response_model=EngineeringBrainResponse,
    status_code=status.HTTP_200_OK,
)
def post_engineering_brain_query(
    req: ReasoningQueryRequest,
    db: Session = Depends(get_db),
):
    """
    Signature Feature ⭐: Engineering Brain
    Query CodeAtlas architectural memory like asking every architect who has ever worked on the project.
    """
    return EDIEService.query_engineering_brain(db, req.repository_id, req.query)


@router.get(
    "/edie/executive-intelligence/{repo_id}",
    response_model=ExecutiveIntelligenceSuiteResponse,
    status_code=status.HTTP_200_OK,
)
def get_executive_intelligence_suite(
    repo_id: str,
    db: Session = Depends(get_db),
):
    """
    Get Executive Intelligence suite (Features 61-80: Knowledge Score 95.4, Bus Factor, KPI Dashboard, & Brain Memory).
    """
    return EDIEService.generate_executive_intelligence_suite(db, repo_id)
