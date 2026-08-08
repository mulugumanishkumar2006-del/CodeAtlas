# apps/backend/app/api/v1/org_knowledge_graph_router.py

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.enterprise.org_knowledge_graph_engine import org_knowledge_graph_engine

router = APIRouter(prefix="/org-knowledge-graph", tags=["Organization Knowledge Graph Intelligence"])


# Pydantic Schemas
class PathFinderRequest(BaseModel):
    source_entity: str = "Checkout App"
    target_entity: str = "executeIdempotentCharge()"

    model_config = ConfigDict(from_attributes=True)


class ImpactGraphRequest(BaseModel):
    target_entity_id: str = "payment-processing-core"

    model_config = ConfigDict(from_attributes=True)


class GraphAIQueryRequest(BaseModel):
    prompt: str

    model_config = ConfigDict(from_attributes=True)


# Endpoints
@router.get("/context/{entity_type}/{entity_id}")
def get_entity_graph_context(
    entity_type: str, entity_id: str, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Focus Mode: Returns immediate graph neighborhood and context for ANY entity."""
    return org_knowledge_graph_engine.get_entity_context(entity_type=entity_type, entity_id=entity_id)


@router.post("/path-finder")
def find_graph_path(
    req: PathFinderRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Multi-Hop Path Finder: Finds shortest meaningful chain between 2 entities."""
    return org_knowledge_graph_engine.find_shortest_path(
        source_entity=req.source_entity, target_entity=req.target_entity
    )


@router.post("/impact-graph")
def calculate_impact_graph(
    req: ImpactGraphRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Impact Graph: Computes blast radius across repos, services, apps, and teams."""
    return org_knowledge_graph_engine.calculate_impact_graph(target_entity_id=req.target_entity_id)


@router.get("/heatmaps")
def get_graph_heatmaps(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Graph Heatmaps: Overlays for Risk, Debt, Security, Performance, Centrality."""
    return org_knowledge_graph_engine.get_heatmaps()


@router.get("/circular-dependencies")
def get_circular_dependencies(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Detects cycle loops across repositories, services, or modules."""
    return org_knowledge_graph_engine.detect_circular_dependencies()


@router.get("/hidden-dependencies")
def get_hidden_dependencies(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Identifies unlinked runtime/infra dependencies."""
    return org_knowledge_graph_engine.detect_hidden_dependencies()


@router.get("/knowledge-gaps")
def get_knowledge_gaps(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Finds missing docs, unassigned ownership, or unanalyzed entities."""
    return org_knowledge_graph_engine.detect_knowledge_gaps()


@router.get("/diff")
def get_graph_diff(
    snapshot_a: str = Query("2026-01-01"), snapshot_b: str = Query("CURRENT"), db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Compares graph states across time (Before vs After)."""
    return org_knowledge_graph_engine.get_graph_diff(snapshot_a=snapshot_a, snapshot_b=snapshot_b)


@router.post("/ai-query")
def query_ai_graph(
    req: GraphAIQueryRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Grounded Natural Language graph query assistant."""
    return org_knowledge_graph_engine.query_ai_graph(prompt=req.prompt)
