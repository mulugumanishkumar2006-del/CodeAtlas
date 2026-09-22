from datetime import datetime, timezone
from enum import Enum
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field, ConfigDict


class CollaborationEventType(str, Enum):
    # Connection & Presence
    CONNECTION_ESTABLISHED = "connection.established"
    CONNECTION_CLOSED = "connection.closed"
    USER_JOINED = "user.joined"
    USER_LEFT = "user.left"
    PRESENCE_UPDATE = "presence.update"
    REPOSITORY_SESSION_UPDATE = "repository.session.update"

    # Analysis & Indexing
    ANALYSIS_STARTED = "analysis.started"
    ANALYSIS_PROGRESS = "analysis.progress"
    ANALYSIS_COMPLETED = "analysis.completed"
    ANALYSIS_FAILED = "analysis.failed"
    INDEXING_STARTED = "indexing.started"
    INDEXING_PROGRESS = "indexing.progress"
    INDEXING_COMPLETED = "indexing.completed"
    INDEXING_FAILED = "indexing.failed"

    # AI Streaming
    AI_RESPONSE_STARTED = "ai.response.started"
    AI_TOKEN = "ai.token"
    AI_RESPONSE_COMPLETED = "ai.response.completed"
    AI_RESPONSE_ERROR = "ai.response.error"

    # Investigations
    INVESTIGATION_CREATED = "investigation.created"
    INVESTIGATION_UPDATED = "investigation.updated"

    # Annotations
    ANNOTATION_CREATED = "annotation.created"
    ANNOTATION_UPDATED = "annotation.updated"
    ANNOTATION_DELETED = "annotation.deleted"

    # Comments
    COMMENT_CREATED = "comment.created"
    COMMENT_UPDATED = "comment.updated"
    COMMENT_DELETED = "comment.deleted"

    # PR Review
    PR_REVIEW_STARTED = "pr_review.started"
    PR_REVIEW_PROGRESS = "pr_review.progress"
    PR_REVIEW_COMPLETED = "pr_review.completed"
    PR_REVIEW_FAILED = "pr_review.failed"

    # System & Heartbeat
    PING = "ping"
    PONG = "pong"
    NOTIFICATION = "notification"
    SYSTEM_ERROR = "system.error"


class CollaborationEvent(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    event_id: str
    event_type: str
    version: int = 1
    repository_id: str
    workspace_id: Optional[str] = None
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    payload: Dict[str, Any] = Field(default_factory=dict)


class PresenceUser(BaseModel):
    user_id: str
    username: str
    color: str = "#6366f1"
    current_tab: Optional[str] = None
    last_seen: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AnnotationCreateRequest(BaseModel):
    target_type: str = Field(default="architecture_component", description="file, symbol, graph_node, architecture_component, general")
    target_id: str = Field(..., description="ID or key of the target entity")
    category: str = Field(default="note", description="note, question, concern, decision, review_comment")
    content: str = Field(..., min_length=1)
    metadata_json: Optional[Dict[str, Any]] = None


class AnnotationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    repository_id: str
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    target_type: str
    target_id: str
    category: str
    content: str
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime


class CommentCreateRequest(BaseModel):
    target_type: str = Field(default="repository", description="repository, file, symbol, graph_node, investigation, pr_review, annotation")
    target_id: str = Field(..., description="Target identifier or ID")
    parent_id: Optional[str] = Field(default=None, description="Parent comment ID for threaded replies")
    content: str = Field(..., min_length=1)
    metadata_json: Optional[Dict[str, Any]] = None


class CommentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    repository_id: str
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    parent_id: Optional[str] = None
    target_type: str
    target_id: str
    content: str
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime


class InvestigationCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    query: str = Field(..., min_length=1)
    summary: Optional[str] = None
    status: str = Field(default="open")
    metadata_json: Optional[Dict[str, Any]] = None


class InvestigationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    repository_id: str
    user_id: Optional[str] = None
    title: str
    status: str
    query: str
    summary: Optional[str] = None
    findings_summary: Optional[Dict[str, Any]] = None
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
