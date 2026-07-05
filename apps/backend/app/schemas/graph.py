from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.models.graph_enums import GraphNodeType, GraphRelationshipType


class GraphNodeCreate(BaseModel):
    id: str
    type: GraphNodeType
    name: str
    properties: Optional[Dict[str, Any]] = None


class GraphNodeResponse(BaseModel):
    id: str
    type: str
    name: str
    properties: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class GraphRelationshipCreate(BaseModel):
    id: str
    source_id: str
    target_id: str
    type: GraphRelationshipType
    properties: Optional[Dict[str, Any]] = None


class GraphRelationshipResponse(BaseModel):
    id: str
    source_id: str
    target_id: str
    type: str
    properties: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class RepositoryGraphResponse(BaseModel):
    nodes: List[GraphNodeResponse]
    relationships: List[GraphRelationshipResponse]


class RelationshipSearchResponse(BaseModel):
    id: str
    source: GraphNodeResponse
    target: GraphNodeResponse
    type: str
    properties: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
