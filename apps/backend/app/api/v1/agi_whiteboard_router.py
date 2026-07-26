# apps/backend/app/api/v1/agi_whiteboard_router.py


from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.agi_whiteboard_command import (
    AISprintDesignerResponse,
    ConfidenceHeatmapResponse,
    ExecutiveBriefingResponse,
    GenomeExplorerResponse,
    NaturalLanguagePlanResponse,
    WhiteboardRedesignRequest,
    WhiteboardSignatureResponse,
)
from app.services.agi_whiteboard_service import AGIWhiteboardService

router = APIRouter(
    prefix="/agi-whiteboard",
    tags=["agi_whiteboard"],
)

wb_service = AGIWhiteboardService()


@router.post("/redesign-whiteboard", response_model=WhiteboardSignatureResponse)
def generate_signature_whiteboard(
    payload: WhiteboardRedesignRequest,
    db: Session = Depends(get_db),
) -> WhiteboardSignatureResponse:
    """🌟 Signature Feature: Generates 8-layer editable AI Architecture Whiteboard for prompt (e.g. 50M users)."""
    return wb_service.generate_signature_whiteboard(payload, db)


@router.post("/natural-language-plan", response_model=NaturalLanguagePlanResponse)
def generate_natural_language_plan(
    query: str = Query(
        "Scale architecture for 50 million users",
        description="Natural language plan query",
    ),
    db: Session = Depends(get_db),
) -> NaturalLanguagePlanResponse:
    """Feature 41: Natural Language Engineering Planning"""
    return wb_service.generate_natural_language_plan(query, db)


@router.post("/sprint-designer", response_model=AISprintDesignerResponse)
def design_ai_sprint(
    target_sprint: str = Query("Sprint 42", description="Target sprint name"),
    db: Session = Depends(get_db),
) -> AISprintDesignerResponse:
    """Feature 42: AI Sprint Designer"""
    return wb_service.design_ai_sprint(target_sprint, db)


@router.get("/executive-briefings", response_model=ExecutiveBriefingResponse)
def get_executive_briefing(
    db: Session = Depends(get_db),
) -> ExecutiveBriefingResponse:
    """Feature 43: Executive Engineering Briefings"""
    return wb_service.get_executive_briefing(db)


@router.get("/genome-explorer", response_model=GenomeExplorerResponse)
def explore_genome(
    db: Session = Depends(get_db),
) -> GenomeExplorerResponse:
    """Feature 50: Repository Genome Explorer"""
    return wb_service.explore_genome(db)


@router.get("/confidence-heatmap", response_model=ConfidenceHeatmapResponse)
def get_confidence_heatmap(
    db: Session = Depends(get_db),
) -> ConfidenceHeatmapResponse:
    """Feature 55: Knowledge Confidence Heatmap"""
    return wb_service.get_confidence_heatmap(db)
