import asyncio
import json
import logging
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from backend.app.db.session import get_db, get_session_factory
from backend.app.models.repository import Repository
from backend.app.models.collaboration import Annotation, Comment
from backend.app.models.investigation import Investigation
from backend.app.schemas.collaboration import (
    CollaborationEvent,
    CollaborationEventType,
    PresenceUser,
    AnnotationCreateRequest,
    AnnotationResponse,
    CommentCreateRequest,
    CommentResponse,
    InvestigationCreateRequest,
    InvestigationResponse,
)
from backend.app.services.collaboration_manager import collaboration_manager
from backend.app.services.rag_service import rag_service

logger = logging.getLogger("codeatlas.api.collaboration")
router = APIRouter(tags=["Real-Time Collaboration"])


@router.websocket("/ws/repositories/{repository_id}")
async def repository_collaboration_websocket(
    websocket: WebSocket,
    repository_id: str,
    user_id: Optional[str] = Query(None),
    username: Optional[str] = Query(None),
    workspace_id: Optional[str] = Query(None),
    color: Optional[str] = Query("#6366f1"),
):
    """
    WebSocket connection endpoint for repository-scoped real-time multi-user collaboration.
    Supports presence, live analysis progress, token streaming, and cross-instance Redis fanout.
    """
    await websocket.accept()

    # 1. Authorize repository access
    async with get_session_factory()() as db:
        repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
        repo = repo_res.scalars().first()
        if not repo:
            await websocket.send_text(
                json.dumps({
                    "event_type": CollaborationEventType.SYSTEM_ERROR.value,
                    "payload": {"error": f"Repository '{repository_id}' does not exist or unauthorized."},
                })
            )
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

    # Derive identity if not provided
    eff_user_id = user_id or f"user_{str(uuid.uuid4())[:8]}"
    eff_username = username or f"Engineer_{eff_user_id[:6]}"

    conn = await collaboration_manager.register(
        websocket=websocket,
        user_id=eff_user_id,
        username=eff_username,
        repository_id=repository_id,
        workspace_id=workspace_id or repo.workspace_id,
        color=color or "#6366f1",
    )

    try:
        while True:
            text = await websocket.receive_text()
            try:
                data = json.loads(text)
            except Exception:
                continue

            msg_type = data.get("type") or data.get("event_type")

            # Handle ping / pong
            if msg_type == "ping":
                pong_event = CollaborationEvent(
                    event_id=str(uuid.uuid4()),
                    event_type=CollaborationEventType.PONG.value,
                    repository_id=repository_id,
                    user_id=eff_user_id,
                    payload={"client_time": data.get("time")},
                )
                await conn.send_event(pong_event)

            # Handle heartbeat & presence
            elif msg_type == "presence.heartbeat":
                cur_tab = data.get("current_tab")
                collaboration_manager.update_heartbeat(conn.connection_id, cur_tab)

            # Handle room join/leave
            elif msg_type == "room.join":
                room = data.get("room")
                if room:
                    await collaboration_manager.join_room(conn.connection_id, room)
            elif msg_type == "room.leave":
                room = data.get("room")
                if room:
                    await collaboration_manager.leave_room(conn.connection_id, room)

            # Handle live AI query streaming over WebSocket
            elif msg_type == "ai.query":
                question = data.get("question", "")
                conversation_id = data.get("conversation_id")
                if question.strip():
                    async with get_session_factory()() as db:
                        async for stream_ev in rag_service.query_stream(
                            repository_id=repository_id,
                            question=question,
                            db=db,
                            conversation_id=conversation_id,
                        ):
                            ws_ev = CollaborationEvent(
                                event_id=str(uuid.uuid4()),
                                event_type=stream_ev.get("event_type", "ai.token"),
                                repository_id=repository_id,
                                user_id=eff_user_id,
                                user_name=eff_username,
                                payload=stream_ev,
                            )
                            await conn.send_event(ws_ev)

    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected: {conn.connection_id}")
    except Exception as e:
        logger.error(f"Error in collaboration WebSocket loop: {e}", exc_info=True)
    finally:
        await collaboration_manager.unregister(conn.connection_id)


# --- REST Endpoints for Presence & Collaboration Artifacts ---

@router.get("/repositories/{repository_id}/presence", response_model=List[PresenceUser])
async def get_repository_presence(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> List[PresenceUser]:
    """Retrieve list of currently active collaborators on this repository."""
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
    return await collaboration_manager.get_presence(repository_id)


# --- Annotations ---

@router.get("/repositories/{repository_id}/annotations", response_model=List[AnnotationResponse])
async def list_annotations(
    repository_id: str,
    target_type: Optional[str] = Query(None),
    target_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> List[AnnotationResponse]:
    """List annotations on a repository or specific entity."""
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    q = select(Annotation).where(Annotation.repository_id == repository_id)
    if target_type:
        q = q.where(Annotation.target_type == target_type)
    if target_id:
        q = q.where(Annotation.target_id == target_id)
    q = q.order_by(Annotation.created_at.desc())

    result = await db.execute(q)
    annotations = result.scalars().all()
    return [AnnotationResponse.model_validate(a) for a in annotations]


@router.post("/repositories/{repository_id}/annotations", response_model=AnnotationResponse, status_code=status.HTTP_201_CREATED)
async def create_annotation(
    repository_id: str,
    payload: AnnotationCreateRequest,
    user_id: Optional[str] = Query(None),
    username: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> AnnotationResponse:
    """Create a collaborative architecture or code annotation."""
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    annotation = Annotation(
        repository_id=repository_id,
        user_id=user_id,
        target_type=payload.target_type,
        target_id=payload.target_id,
        category=payload.category,
        content=payload.content,
        metadata_json=payload.metadata_json or {},
    )
    db.add(annotation)
    await db.commit()
    await db.refresh(annotation)

    resp = AnnotationResponse.model_validate(annotation)
    resp.user_name = username

    # Broadcast event to repository room
    await collaboration_manager.broadcast_to_repository(
        repository_id=repository_id,
        event_type=CollaborationEventType.ANNOTATION_CREATED.value,
        payload=resp.model_dump(mode="json"),
        user_id=user_id,
        user_name=username,
    )
    return resp


@router.delete("/repositories/{repository_id}/annotations/{annotation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_annotation(
    repository_id: str,
    annotation_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete an annotation and broadcast update."""
    q = select(Annotation).where(
        Annotation.id == annotation_id,
        Annotation.repository_id == repository_id,
    )
    res = await db.execute(q)
    annotation = res.scalars().first()
    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")

    await db.delete(annotation)
    await db.commit()

    await collaboration_manager.broadcast_to_repository(
        repository_id=repository_id,
        event_type=CollaborationEventType.ANNOTATION_DELETED.value,
        payload={"annotation_id": annotation_id},
    )


# --- Comments & Discussions ---

@router.get("/repositories/{repository_id}/comments", response_model=List[CommentResponse])
async def list_comments(
    repository_id: str,
    target_type: Optional[str] = Query(None),
    target_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> List[CommentResponse]:
    """List threaded comments for repository or specific entity."""
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    q = select(Comment).where(Comment.repository_id == repository_id)
    if target_type:
        q = q.where(Comment.target_type == target_type)
    if target_id:
        q = q.where(Comment.target_id == target_id)
    q = q.order_by(Comment.created_at.asc())

    result = await db.execute(q)
    comments = result.scalars().all()
    return [CommentResponse.model_validate(c) for c in comments]


@router.post("/repositories/{repository_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    repository_id: str,
    payload: CommentCreateRequest,
    user_id: Optional[str] = Query(None),
    username: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> CommentResponse:
    """Add a collaborative discussion comment."""
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    comment = Comment(
        repository_id=repository_id,
        user_id=user_id,
        parent_id=payload.parent_id,
        target_type=payload.target_type,
        target_id=payload.target_id,
        content=payload.content,
        metadata_json=payload.metadata_json or {},
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)

    resp = CommentResponse.model_validate(comment)
    resp.user_name = username

    await collaboration_manager.broadcast_to_repository(
        repository_id=repository_id,
        event_type=CollaborationEventType.COMMENT_CREATED.value,
        payload=resp.model_dump(mode="json"),
        user_id=user_id,
        user_name=username,
    )
    return resp


@router.delete("/repositories/{repository_id}/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    repository_id: str,
    comment_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a comment."""
    q = select(Comment).where(
        Comment.id == comment_id,
        Comment.repository_id == repository_id,
    )
    res = await db.execute(q)
    comment = res.scalars().first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    await db.delete(comment)
    await db.commit()

    await collaboration_manager.broadcast_to_repository(
        repository_id=repository_id,
        event_type=CollaborationEventType.COMMENT_DELETED.value,
        payload={"comment_id": comment_id},
    )


# --- Collaborative Investigations ---

@router.get("/repositories/{repository_id}/investigations", response_model=List[InvestigationResponse])
async def list_investigations(
    repository_id: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
) -> List[InvestigationResponse]:
    """List investigations for a repository."""
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    q = select(Investigation).where(Investigation.repository_id == repository_id)
    if status_filter:
        q = q.where(Investigation.status == status_filter)
    q = q.order_by(Investigation.created_at.desc())

    result = await db.execute(q)
    investigations = result.scalars().all()
    return [InvestigationResponse.model_validate(inv) for inv in investigations]


@router.post("/repositories/{repository_id}/investigations", response_model=InvestigationResponse, status_code=status.HTTP_201_CREATED)
async def create_investigation(
    repository_id: str,
    payload: InvestigationCreateRequest,
    user_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> InvestigationResponse:
    """Create a shared investigation for the repository."""
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    inv = Investigation(
        repository_id=repository_id,
        user_id=user_id,
        title=payload.title,
        query=payload.query,
        summary=payload.summary,
        status=payload.status or "open",
        metadata_json=payload.metadata_json or {},
    )
    db.add(inv)
    await db.commit()
    await db.refresh(inv)

    resp = InvestigationResponse.model_validate(inv)

    await collaboration_manager.broadcast_to_repository(
        repository_id=repository_id,
        event_type=CollaborationEventType.INVESTIGATION_CREATED.value,
        payload=resp.model_dump(mode="json"),
        user_id=user_id,
    )
    return resp


@router.patch("/repositories/{repository_id}/investigations/{investigation_id}", response_model=InvestigationResponse)
async def update_investigation(
    repository_id: str,
    investigation_id: str,
    status_update: Optional[str] = Query(None, alias="status"),
    summary_update: Optional[str] = Query(None, alias="summary"),
    db: AsyncSession = Depends(get_db),
) -> InvestigationResponse:
    """Update investigation state and broadcast live change."""
    q = select(Investigation).where(
        Investigation.id == investigation_id,
        Investigation.repository_id == repository_id,
    )
    res = await db.execute(q)
    inv = res.scalars().first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    if status_update:
        inv.status = status_update
    if summary_update is not None:
        inv.summary = summary_update

    await db.commit()
    await db.refresh(inv)

    resp = InvestigationResponse.model_validate(inv)
    await collaboration_manager.broadcast_to_repository(
        repository_id=repository_id,
        event_type=CollaborationEventType.INVESTIGATION_UPDATED.value,
        payload=resp.model_dump(mode="json"),
    )
    return resp
