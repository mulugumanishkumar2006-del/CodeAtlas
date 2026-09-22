import asyncio
import json
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.workspace import Workspace
from backend.app.models.collaboration import Annotation, Comment
from backend.app.models.investigation import Investigation
from backend.app.schemas.collaboration import (
    CollaborationEvent,
    CollaborationEventType,
    PresenceUser,
)
from backend.app.services.collaboration_manager import (
    CollaborationManager,
    collaboration_manager,
    WebSocketConnection,
)
from backend.app.services.rag_service import rag_service
from backend.app.services.llm_provider import GroundedDeterministicProvider


class MockWebSocket:
    """Mock FastAPI WebSocket for testing connection manager."""

    def __init__(self):
        self.sent_messages = []
        self.closed = False
        self.close_code = None

    async def send_text(self, text: str):
        if self.closed:
            raise RuntimeError("WebSocket is closed")
        self.sent_messages.append(text)

    async def close(self, code: int = 1000):
        self.closed = True
        self.close_code = code


@pytest.mark.asyncio
async def test_collaboration_manager_lifecycle_and_presence(db_session: AsyncSession):
    """Test connection registration, welcome event, presence broadcasting, and disconnect cleanup."""
    manager = CollaborationManager()
    await manager.start()

    mock_ws = MockWebSocket()
    conn = await manager.register(
        websocket=mock_ws,
        user_id="user_alice",
        username="Alice Engineer",
        repository_id="repo_1",
        workspace_id="ws_1",
        color="#10b981",
    )

    # Allow async queue worker to dispatch welcome message
    await asyncio.sleep(0.05)
    assert len(mock_ws.sent_messages) >= 1
    welcome = json.loads(mock_ws.sent_messages[0])
    assert welcome["event_type"] == CollaborationEventType.CONNECTION_ESTABLISHED.value
    assert welcome["payload"]["connection_id"] == conn.connection_id

    # Check presence
    presence = await manager.get_presence("repo_1")
    assert len(presence) == 1
    assert presence[0].user_id == "user_alice"
    assert presence[0].username == "Alice Engineer"

    # Heartbeat tab update
    manager.update_heartbeat(conn.connection_id, current_tab="architecture")
    presence = await manager.get_presence("repo_1")
    assert presence[0].current_tab == "architecture"

    # Unregister / disconnect
    await manager.unregister(conn.connection_id)
    presence_after = await manager.get_presence("repo_1")
    assert len(presence_after) == 0

    await manager.stop()


@pytest.mark.asyncio
async def test_repository_isolation_events():
    """Verify events emitted for Repo X NEVER leak to clients connected to Repo Y."""
    manager = CollaborationManager()
    await manager.start()

    ws_repo_x = MockWebSocket()
    ws_repo_y = MockWebSocket()

    conn_x = await manager.register(
        websocket=ws_repo_x,
        user_id="user_x",
        username="Engineer X",
        repository_id="repo_isolated_x",
    )
    conn_y = await manager.register(
        websocket=ws_repo_y,
        user_id="user_y",
        username="Engineer Y",
        repository_id="repo_isolated_y",
    )

    await asyncio.sleep(0.05)
    ws_repo_x.sent_messages.clear()
    ws_repo_y.sent_messages.clear()

    # Broadcast event specifically to Repo X
    await manager.broadcast_to_repository(
        repository_id="repo_isolated_x",
        event_type=CollaborationEventType.ANALYSIS_PROGRESS.value,
        payload={"stage": "parsing_ast", "progress_percent": 45},
    )

    await asyncio.sleep(0.05)

    # Repo X must receive the event
    assert len(ws_repo_x.sent_messages) == 1
    ev_x = json.loads(ws_repo_x.sent_messages[0])
    assert ev_x["event_type"] == CollaborationEventType.ANALYSIS_PROGRESS.value
    assert ev_x["repository_id"] == "repo_isolated_x"
    assert ev_x["payload"]["stage"] == "parsing_ast"

    # Repo Y must NOT receive any message
    assert len(ws_repo_y.sent_messages) == 0

    await manager.unregister(conn_x.connection_id)
    await manager.unregister(conn_y.connection_id)
    await manager.stop()


@pytest.mark.asyncio
async def test_redis_multi_instance_fanout_simulation():
    """
    Simulate two separate backend instances (Instance A and Instance B).
    An event delivered to Instance A is processed and can be distributed to clients on Instance B.
    """
    instance_a = CollaborationManager()
    instance_b = CollaborationManager()

    ws_client_b = MockWebSocket()
    conn_b = await instance_b.register(
        websocket=ws_client_b,
        user_id="user_instance_b",
        username="Remote Engineer",
        repository_id="shared_repo_1",
    )

    await asyncio.sleep(0.05)
    ws_client_b.sent_messages.clear()

    # Event generated on Instance A
    ev = CollaborationEvent(
        event_id="ev_fanout_123",
        event_type=CollaborationEventType.ANNOTATION_CREATED.value,
        repository_id="shared_repo_1",
        payload={"target_id": "main.py", "category": "note", "content": "Cross-instance sync"},
    )

    # Deliver to Instance B (simulating Redis subscription callback)
    await instance_b._deliver_local_repository_event("shared_repo_1", ev)
    await asyncio.sleep(0.05)

    assert len(ws_client_b.sent_messages) == 1
    received = json.loads(ws_client_b.sent_messages[0])
    assert received["event_type"] == CollaborationEventType.ANNOTATION_CREATED.value
    assert received["payload"]["content"] == "Cross-instance sync"

    await instance_a.stop()
    await instance_b.unregister(conn_b.connection_id)
    await instance_b.stop()


@pytest.mark.asyncio
async def test_ai_token_streaming_and_citations(db_session: AsyncSession):
    """Test token streaming lifecycle and grounded citation preservation."""
    # Create test repository
    ws = Workspace(name="WS Stream", slug="ws-stream")
    db_session.add(ws)
    await db_session.flush()

    repo = Repository(
        workspace_id=ws.id,
        name="StreamRepo",
        url="https://github.com/org/stream-repo.git",
        analysis_status="completed",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    # Stream query
    events = []
    async for ev in rag_service.query_stream(
        repository_id=repo.id,
        question="What is the architecture of this repo?",
        db=db_session,
    ):
        events.append(ev)

    assert len(events) >= 2
    assert events[0]["event_type"] == "ai.response.started"
    # Find completion event
    completed_ev = next((e for e in events if e.get("event_type") == "ai.response.completed"), None)
    assert completed_ev is not None
    payload = completed_ev["payload"]
    assert "answer" in payload
    assert payload["repository_id"] == repo.id


@pytest.mark.asyncio
async def test_annotations_crud_and_rest(client: AsyncClient, db_session: AsyncSession):
    """Test creating, listing, and deleting collaborative annotations via REST endpoints."""
    ws = Workspace(name="WS Ann", slug="ws-ann")
    db_session.add(ws)
    await db_session.flush()

    repo = Repository(
        workspace_id=ws.id,
        name="AnnRepo",
        url="https://github.com/org/ann-repo.git",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    # Create annotation
    create_resp = await client.post(
        f"/api/v1/repositories/{repo.id}/annotations?username=Alice",
        json={
            "target_type": "architecture_component",
            "target_id": "backend/app/main.py",
            "category": "concern",
            "content": "Potential bottleneck in request routing.",
        },
    )
    assert create_resp.status_code == 201
    created_data = create_resp.json()
    assert created_data["target_id"] == "backend/app/main.py"
    assert created_data["category"] == "concern"
    ann_id = created_data["id"]

    # List annotations
    list_resp = await client.get(f"/api/v1/repositories/{repo.id}/annotations")
    assert list_resp.status_code == 200
    items = list_resp.json()
    assert len(items) == 1
    assert items[0]["id"] == ann_id

    # Delete annotation
    del_resp = await client.delete(f"/api/v1/repositories/{repo.id}/annotations/{ann_id}")
    assert del_resp.status_code == 204

    # Verify deleted
    list_resp2 = await client.get(f"/api/v1/repositories/{repo.id}/annotations")
    assert len(list_resp2.json()) == 0


@pytest.mark.asyncio
async def test_comments_crud_and_threading(client: AsyncClient, db_session: AsyncSession):
    """Test creating parent comment and threaded reply."""
    ws = Workspace(name="WS Comm", slug="ws-comm")
    db_session.add(ws)
    await db_session.flush()

    repo = Repository(
        workspace_id=ws.id,
        name="CommRepo",
        url="https://github.com/org/comm-repo.git",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    # Parent comment
    parent_resp = await client.post(
        f"/api/v1/repositories/{repo.id}/comments?username=Bob",
        json={
            "target_type": "file",
            "target_id": "auth.py",
            "content": "Should we move JWT parsing into middleware?",
        },
    )
    assert parent_resp.status_code == 201
    parent_id = parent_resp.json()["id"]

    # Threaded reply
    reply_resp = await client.post(
        f"/api/v1/repositories/{repo.id}/comments?username=Charlie",
        json={
            "target_type": "file",
            "target_id": "auth.py",
            "parent_id": parent_id,
            "content": "Yes, that will centralize claim verification.",
        },
    )
    assert reply_resp.status_code == 201
    assert reply_resp.json()["parent_id"] == parent_id

    # List comments
    comments_resp = await client.get(f"/api/v1/repositories/{repo.id}/comments?target_id=auth.py")
    assert comments_resp.status_code == 200
    comments = comments_resp.json()
    assert len(comments) == 2


@pytest.mark.asyncio
async def test_collaborative_investigations_crud(client: AsyncClient, db_session: AsyncSession):
    """Test creating and updating collaborative investigation state."""
    ws = Workspace(name="WS Inv", slug="ws-inv")
    db_session.add(ws)
    await db_session.flush()

    repo = Repository(
        workspace_id=ws.id,
        name="InvRepo",
        url="https://github.com/org/inv-repo.git",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    # Create investigation
    inv_resp = await client.post(
        f"/api/v1/repositories/{repo.id}/investigations",
        json={
            "title": "Investigate High Coupling in Database Layer",
            "query": "Where are circular imports occurring?",
            "summary": "Initial finding suggests models/ and services/ cyclical dependency.",
        },
    )
    assert inv_resp.status_code == 201
    inv_data = inv_resp.json()
    inv_id = inv_data["id"]
    assert inv_data["status"] == "open"

    # Update investigation
    patch_resp = await client.patch(
        f"/api/v1/repositories/{repo.id}/investigations/{inv_id}?status=resolved&summary=Circular dependency resolved."
    )
    assert patch_resp.status_code == 200
    updated_data = patch_resp.json()
    assert updated_data["status"] == "resolved"
    assert updated_data["summary"] == "Circular dependency resolved."


@pytest.mark.asyncio
async def test_presence_endpoint(client: AsyncClient, db_session: AsyncSession):
    """Test /repositories/{id}/presence endpoint."""
    ws = Workspace(name="WS Pres", slug="ws-pres")
    db_session.add(ws)
    await db_session.flush()

    repo = Repository(
        workspace_id=ws.id,
        name="PresRepo",
        url="https://github.com/org/pres-repo.git",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    resp = await client.get(f"/api/v1/repositories/{repo.id}/presence")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_backpressure_queue_handling():
    """Verify that slow clients with full queues do not crash or block the manager."""
    mock_ws = MockWebSocket()
    conn = WebSocketConnection(
        websocket=mock_ws,
        connection_id="slow_client_1",
        user_id="user_slow",
        username="Slow Consumer",
        repository_id="repo_bp",
    )
    # Don't start sender loop so queue fills up to maxsize (100)
    for i in range(150):
        ev = CollaborationEvent(
            event_id=f"ev_{i}",
            event_type="test.event",
            repository_id="repo_bp",
            payload={"index": i},
        )
        await conn.send_event(ev)

    # Queue must not exceed maxsize 100
    assert conn._send_queue.qsize() <= 100
    await conn.close()


@pytest.mark.asyncio
async def test_room_subscription_and_filtering():
    """Verify that room-targeted broadcasts are only received by room members."""
    manager = CollaborationManager()
    await manager.start()

    ws_inv_member = MockWebSocket()
    ws_general = MockWebSocket()

    conn_member = await manager.register(
        websocket=ws_inv_member,
        user_id="user_inv",
        username="Investigation Lead",
        repository_id="repo_room_test",
    )
    conn_general = await manager.register(
        websocket=ws_general,
        user_id="user_gen",
        username="General Viewer",
        repository_id="repo_room_test",
    )

    inv_room = "repo:repo_room_test:inv:inv_99"
    await manager.join_room(conn_member.connection_id, inv_room)

    await asyncio.sleep(0.05)
    ws_inv_member.sent_messages.clear()
    ws_general.sent_messages.clear()

    # Broadcast to investigation room
    await manager.broadcast_to_room(
        room=inv_room,
        event_type=CollaborationEventType.INVESTIGATION_UPDATED.value,
        repository_id="repo_room_test",
        payload={"investigation_id": "inv_99", "status": "resolved"},
    )

    await asyncio.sleep(0.05)

    assert len(ws_inv_member.sent_messages) == 1
    ev_member = json.loads(ws_inv_member.sent_messages[0])
    assert ev_member["event_type"] == CollaborationEventType.INVESTIGATION_UPDATED.value
    assert ev_member["payload"]["investigation_id"] == "inv_99"

    # General connection should NOT receive room-specific event
    assert len(ws_general.sent_messages) == 0

    await manager.unregister(conn_member.connection_id)
    await manager.unregister(conn_general.connection_id)
    await manager.stop()


@pytest.mark.asyncio
async def test_analysis_progress_broadcast_hook(db_session: AsyncSession):
    """Verify that repository ingestion service broadcasts analysis events to connected clients."""
    from backend.app.services.repository_ingestion_service import ingestion_service

    ws_client = MockWebSocket()
    conn = await collaboration_manager.register(
        websocket=ws_client,
        user_id="watcher_1",
        username="Watcher",
        repository_id="repo_hook_test",
    )

    await asyncio.sleep(0.05)
    ws_client.sent_messages.clear()

    # Trigger progress update
    ingestion_service._set_progress(
        repo_id="repo_hook_test",
        status="running",
        stage="ast_parsing",
        progress_percent=60,
        files_discovered=10,
        files_processed=6,
    )

    await asyncio.sleep(0.05)

    assert len(ws_client.sent_messages) >= 1
    prog_ev = json.loads(ws_client.sent_messages[-1])
    assert prog_ev["event_type"] == CollaborationEventType.ANALYSIS_PROGRESS.value
    assert prog_ev["payload"]["stage"] == "ast_parsing"
    assert prog_ev["payload"]["progress_percent"] == 60

    await collaboration_manager.unregister(conn.connection_id)
