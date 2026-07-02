from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.repository import Repository
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.schemas.graph import (
    GraphNodeCreate,
    GraphNodeResponse,
    GraphRelationshipCreate,
    GraphRelationshipResponse,
    RepositoryGraphResponse,
)
from app.schemas.analysis import (
    CircularDependencyResponse,
    CouplingAnalysisResponse,
    ImpactRequest,
    ImpactAnalysisResponse,
)
from app.services.analysis_service import AnalysisService
from app.api.v1.auth import get_current_user

router = APIRouter()
analysis_service = AnalysisService()


@router.post(
    "/repositories/{repo_id}/graph/nodes",
    response_model=GraphNodeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_graph_node(
    repo_id: str,
    node: GraphNodeCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

    # Check if node already exists
    existing = db.query(GraphNode).filter(GraphNode.id == node.id, GraphNode.repository_id == repo_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Node already exists")

    db_node = GraphNode(
        id=node.id,
        repository_id=repo_id,
        type=node.type.value,
        name=node.name,
        properties=node.properties,
    )
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node


@router.post(
    "/repositories/{repo_id}/graph/relationships",
    response_model=GraphRelationshipResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_graph_relationship(
    repo_id: str,
    rel: GraphRelationshipCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

    # Verify source and target nodes exist in the repository
    source = db.query(GraphNode).filter(GraphNode.id == rel.source_id, GraphNode.repository_id == repo_id).first()
    target = db.query(GraphNode).filter(GraphNode.id == rel.target_id, GraphNode.repository_id == repo_id).first()
    if not source or not target:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Source or target node not found in repository")

    # Check if relationship already exists
    existing = db.query(GraphRelationship).filter(
        GraphRelationship.source_id == rel.source_id,
        GraphRelationship.target_id == rel.target_id,
        GraphRelationship.type == rel.type.value,
        GraphRelationship.repository_id == repo_id,
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Relationship already exists")

    db_rel = GraphRelationship(
        id=rel.id,
        repository_id=repo_id,
        source_id=rel.source_id,
        target_id=rel.target_id,
        type=rel.type.value,
        properties=rel.properties,
    )
    db.add(db_rel)
    db.commit()
    db.refresh(db_rel)
    return db_rel


@router.get(
    "/repositories/{repo_id}/graph",
    response_model=RepositoryGraphResponse,
)
def get_repository_graph(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

    nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
    relationships = db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).all()

    return RepositoryGraphResponse(
        nodes=[GraphNodeResponse.model_validate(n) for n in nodes],
        relationships=[GraphRelationshipResponse.model_validate(r) for r in relationships],
    )


@router.get(
    "/repositories/{repo_id}/analysis/circular",
    response_model=CircularDependencyResponse,
)
def get_circular_dependencies(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

    return analysis_service.detect_circular_dependencies(db, repo_id)


@router.get(
    "/repositories/{repo_id}/analysis/coupling",
    response_model=CouplingAnalysisResponse,
)
def get_coupling_analysis(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

    return analysis_service.calculate_coupling_analysis(db, repo_id)


@router.post(
    "/repositories/{repo_id}/analysis/impact",
    response_model=ImpactAnalysisResponse,
)
def get_impact_analysis(
    repo_id: str,
    request: ImpactRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

    return analysis_service.run_impact_analysis(db, repo_id, request.symbol_name)


@router.get("/repositories/{repo_id}/query/dependencies")
def get_dependencies(
    repo_id: str,
    node_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")
    return analysis_service.get_module_dependencies(db, repo_id, node_id)


@router.get("/repositories/{repo_id}/query/callers")
def get_callers(
    repo_id: str,
    symbol_name: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")
    return analysis_service.get_function_callers(db, repo_id, symbol_name)


@router.get("/repositories/{repo_id}/query/imports")
def get_imports(
    repo_id: str,
    node_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")
    return analysis_service.get_import_tree(db, repo_id, node_id)


@router.get("/repositories/{repo_id}/query/downstream")
def get_downstream(
    repo_id: str,
    node_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")
    return analysis_service.get_downstream_impact(db, repo_id, node_id)


@router.get("/repositories/{repo_id}/query/orphans")
def get_orphans(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")
    return analysis_service.find_orphan_modules(db, repo_id)
