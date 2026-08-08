from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.knowledge_fabric import (
    EngineeringLessonModel,
    KnowledgeAIRequest,
    KnowledgeAIResponse,
    KnowledgeConflictModel,
    KnowledgeEntityModel,
    KnowledgeEntityType,
    KnowledgeExplorerGraphModel,
    WhyHistoryResponseModel,
)
from app.services.knowledge_fabric_service import KnowledgeFabricService

router = APIRouter(prefix="/knowledge-fabric", tags=["Engineering Knowledge Fabric"])


@router.post(
    "/capture",
    response_model=KnowledgeEntityModel,
    status_code=status.HTTP_201_CREATED,
)
def capture_knowledge_entity(
    organization_id: str = Query(...),
    repository_id: str = Query(...),
    entity_type: KnowledgeEntityType = Query(KnowledgeEntityType.SERVICE),
    name: str = Query("auth_service"),
    description: str = Query("Standalone authentication provider microservice"),
    provenance_source: str = Query("ADR-001 / Commit Log"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Knowledge Entity Capture & Provenance Tracking Endpoint.
    """
    service = KnowledgeFabricService(db=db)
    return service.capture_knowledge_entity(
        organization_id=organization_id,
        repository_id=repository_id,
        entity_type=entity_type,
        name=name,
        description=description,
        provenance_source=provenance_source,
    )


@router.get(
    "/why-history",
    response_model=WhyHistoryResponseModel,
    status_code=status.HTTP_200_OK,
)
def get_why_history(
    question: str = Query("Why was auth_service created?"),
    db: Session = Depends(get_db),
):
    """
    ⭐ "Why History" RAG Endpoint. Answers why architecture, services, decisions, or dependencies exist.
    """
    service = KnowledgeFabricService(db=db)
    return service.get_why_history(question)


@router.get(
    "/conflicts/{organization_id}",
    response_model=List[KnowledgeConflictModel],
    status_code=status.HTTP_200_OK,
)
def get_knowledge_conflicts(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Knowledge Conflict Detector Endpoint. Identifies mismatches between codebase AST facts and documentation statements.
    """
    service = KnowledgeFabricService(db=db)
    return service.get_knowledge_conflicts(organization_id)


@router.get(
    "/explorer/{entity_id}",
    response_model=KnowledgeExplorerGraphModel,
    status_code=status.HTTP_200_OK,
)
def get_knowledge_explorer_graph(
    entity_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Progressive Knowledge Explorer Graph Builder Endpoint.
    """
    service = KnowledgeFabricService(db=db)
    return service.get_knowledge_explorer_graph(entity_id)


@router.get(
    "/lessons/{organization_id}",
    response_model=List[EngineeringLessonModel],
    status_code=status.HTTP_200_OK,
)
def get_engineering_lessons(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Engineering Lessons Learned Endpoint.
    """
    service = KnowledgeFabricService(db=db)
    return service.get_engineering_lessons(organization_id)


@router.post(
    "/ai-query",
    response_model=KnowledgeAIResponse,
    status_code=status.HTTP_200_OK,
)
def query_knowledge_ai(
    req: KnowledgeAIRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Knowledge-Aware AI Assistant RAG Endpoint with internal citations and timeline summaries.
    """
    service = KnowledgeFabricService(db=db)
    return service.query_knowledge_ai(req)
