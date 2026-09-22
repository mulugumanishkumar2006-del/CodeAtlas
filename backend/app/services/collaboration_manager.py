import asyncio
import json
import logging
import uuid
import time
from datetime import datetime, timezone
from typing import Dict, Set, Optional, List, Any
from fastapi import WebSocket, WebSocketDisconnect

from backend.app.schemas.collaboration import (
    CollaborationEvent,
    CollaborationEventType,
    PresenceUser,
)
from backend.app.db.redis import get_redis

logger = logging.getLogger("codeatlas.collaboration")


class WebSocketConnection:
    """Wrapper for an active WebSocket client with bounded send queue."""

    def __init__(
        self,
        websocket: WebSocket,
        connection_id: str,
        user_id: str,
        username: str,
        repository_id: str,
        workspace_id: Optional[str] = None,
        color: str = "#6366f1",
    ):
        self.websocket = websocket
        self.connection_id = connection_id
        self.user_id = user_id
        self.username = username
        self.repository_id = repository_id
        self.workspace_id = workspace_id
        self.color = color
        self.current_tab: str = "overview"
        self.last_heartbeat: datetime = datetime.now(timezone.utc)
        self.rooms: Set[str] = set()
        self._send_queue: asyncio.Queue[str] = asyncio.Queue(maxsize=100)
        self._sender_task: Optional[asyncio.Task] = None
        self._is_active: bool = True

    def start_sender(self):
        self._sender_task = asyncio.create_task(self._send_loop())

    async def _send_loop(self):
        try:
            while self._is_active:
                message = await self._send_queue.get()
                try:
                    await self.websocket.send_text(message)
                except Exception as e:
                    logger.debug(f"Error sending to WS {self.connection_id}: {e}")
                    break
                finally:
                    self._send_queue.task_done()
        except asyncio.CancelledError:
            pass
        finally:
            self._is_active = False

    async def send_event(self, event: CollaborationEvent):
        """Enqueue message with backpressure protection."""
        if not self._is_active:
            return
        msg = event.model_dump_json()
        try:
            # If queue full, drop oldest or discard to prevent memory leaks / blocking
            if self._send_queue.full():
                try:
                    _ = self._send_queue.get_nowait()
                    self._send_queue.task_done()
                except (asyncio.QueueEmpty, ValueError):
                    pass
            self._send_queue.put_nowait(msg)
        except asyncio.QueueFull:
            logger.warning(f"WS Queue full for connection {self.connection_id}; dropping event {event.event_type}")

    async def close(self):
        self._is_active = False
        if self._sender_task and not self._sender_task.done():
            self._sender_task.cancel()
        try:
            await self.websocket.close()
        except Exception:
            pass


class CollaborationManager:
    """
    Centralized Real-Time Event Architecture & Multi-Instance Connection Manager.
    Manages WebSockets, room subscriptions, presence tracking, and Redis Pub/Sub fanout.
    """

    def __init__(self):
        # connection_id -> WebSocketConnection
        self._connections: Dict[str, WebSocketConnection] = {}
        # room_name -> Set[connection_id]
        self._rooms: Dict[str, Set[str]] = {}
        # repo_id -> Set[connection_id]
        self._repo_connections: Dict[str, Set[str]] = {}
        self._lock = asyncio.Lock()
        self._redis_task: Optional[asyncio.Task] = None
        self._reaper_task: Optional[asyncio.Task] = None
        self._instance_id = str(uuid.uuid4())[:8]
        self._redis_disabled_until: float = 0.0

    async def start(self):
        """Start background Redis PubSub listener and stale session reaper."""
        if self._redis_task is None or self._redis_task.done():
            self._redis_task = asyncio.create_task(self._redis_listener())
        if self._reaper_task is None or self._reaper_task.done():
            self._reaper_task = asyncio.create_task(self._stale_session_reaper())
        logger.info(f"CollaborationManager started (instance: {self._instance_id})")

    async def stop(self):
        """Gracefully stop tasks and close connections."""
        if self._redis_task and not self._redis_task.done():
            self._redis_task.cancel()
        if self._reaper_task and not self._reaper_task.done():
            self._reaper_task.cancel()

        async with self._lock:
            for conn in list(self._connections.values()):
                await conn.close()
            self._connections.clear()
            self._rooms.clear()
            self._repo_connections.clear()
        logger.info("CollaborationManager stopped")

    async def register(
        self,
        websocket: WebSocket,
        user_id: str,
        username: str,
        repository_id: str,
        workspace_id: Optional[str] = None,
        color: str = "#6366f1",
    ) -> WebSocketConnection:
        """Register and authenticate a new client connection."""
        connection_id = str(uuid.uuid4())
        conn = WebSocketConnection(
            websocket=websocket,
            connection_id=connection_id,
            user_id=user_id,
            username=username,
            repository_id=repository_id,
            workspace_id=workspace_id,
            color=color,
        )
        conn.start_sender()

        async with self._lock:
            self._connections[connection_id] = conn
            if repository_id not in self._repo_connections:
                self._repo_connections[repository_id] = set()
            self._repo_connections[repository_id].add(connection_id)

            # Auto-join default repository room
            repo_room = f"repo:{repository_id}"
            self._add_to_room_locked(connection_id, repo_room)
            if workspace_id:
                ws_room = f"ws:{workspace_id}"
                self._add_to_room_locked(connection_id, ws_room)

        # Notify connection established
        welcome_event = CollaborationEvent(
            event_id=str(uuid.uuid4()),
            event_type=CollaborationEventType.CONNECTION_ESTABLISHED.value,
            repository_id=repository_id,
            workspace_id=workspace_id,
            user_id=user_id,
            user_name=username,
            payload={
                "connection_id": connection_id,
                "instance_id": self._instance_id,
                "rooms": list(conn.rooms),
            },
        )
        await conn.send_event(welcome_event)

        # Broadcast user joined & presence
        await self.broadcast_to_repository(
            repository_id=repository_id,
            event_type=CollaborationEventType.USER_JOINED.value,
            payload={
                "user_id": user_id,
                "username": username,
                "color": color,
                "connection_id": connection_id,
            },
            user_id=user_id,
            user_name=username,
        )
        await self.broadcast_presence(repository_id)
        return conn

    async def unregister(self, connection_id: str):
        """Clean up disconnected client."""
        conn: Optional[WebSocketConnection] = None
        async with self._lock:
            conn = self._connections.pop(connection_id, None)
            if conn:
                repo_id = conn.repository_id
                if repo_id in self._repo_connections:
                    self._repo_connections[repo_id].discard(connection_id)
                    if not self._repo_connections[repo_id]:
                        del self._repo_connections[repo_id]
                for room in list(conn.rooms):
                    if room in self._rooms:
                        self._rooms[room].discard(connection_id)
                        if not self._rooms[room]:
                            del self._rooms[room]

        if conn:
            await conn.close()
            # Broadcast user left
            await self.broadcast_to_repository(
                repository_id=conn.repository_id,
                event_type=CollaborationEventType.USER_LEFT.value,
                payload={
                    "user_id": conn.user_id,
                    "username": conn.username,
                    "connection_id": connection_id,
                },
                user_id=conn.user_id,
                user_name=conn.username,
            )
            await self.broadcast_presence(conn.repository_id)

    def _add_to_room_locked(self, connection_id: str, room: str):
        if room not in self._rooms:
            self._rooms[room] = set()
        self._rooms[room].add(connection_id)
        if connection_id in self._connections:
            self._connections[connection_id].rooms.add(room)

    async def join_room(self, connection_id: str, room: str):
        async with self._lock:
            if connection_id in self._connections:
                self._add_to_room_locked(connection_id, room)

    async def leave_room(self, connection_id: str, room: str):
        async with self._lock:
            if room in self._rooms:
                self._rooms[room].discard(connection_id)
                if not self._rooms[room]:
                    del self._rooms[room]
            if connection_id in self._connections:
                self._connections[connection_id].rooms.discard(room)

    def update_heartbeat(self, connection_id: str, current_tab: Optional[str] = None):
        if connection_id in self._connections:
            conn = self._connections[connection_id]
            conn.last_heartbeat = datetime.now(timezone.utc)
            if current_tab:
                conn.current_tab = current_tab

    async def get_presence(self, repository_id: str) -> List[PresenceUser]:
        """Return unique active users currently connected to the repository."""
        users_map: Dict[str, PresenceUser] = {}
        async with self._lock:
            conn_ids = self._repo_connections.get(repository_id, set())
            for cid in conn_ids:
                conn = self._connections.get(cid)
                if conn:
                    # Choose most recently seen if user has multiple tabs open
                    if conn.user_id not in users_map or users_map[conn.user_id].last_seen < conn.last_heartbeat.isoformat():
                        users_map[conn.user_id] = PresenceUser(
                            user_id=conn.user_id,
                            username=conn.username,
                            color=conn.color,
                            current_tab=conn.current_tab,
                            last_seen=conn.last_heartbeat.isoformat(),
                        )
        return list(users_map.values())

    async def broadcast_presence(self, repository_id: str):
        presence_list = await self.get_presence(repository_id)
        await self.broadcast_to_repository(
            repository_id=repository_id,
            event_type=CollaborationEventType.PRESENCE_UPDATE.value,
            payload={"users": [p.model_dump() for p in presence_list]},
        )

    async def broadcast_to_repository(
        self,
        repository_id: str,
        event_type: str,
        payload: Dict[str, Any],
        user_id: Optional[str] = None,
        user_name: Optional[str] = None,
        workspace_id: Optional[str] = None,
        event_id: Optional[str] = None,
    ):
        """
        Broadcast event to all clients on repository, publishing via Redis for cross-instance fanout.
        """
        event = CollaborationEvent(
            event_id=event_id or str(uuid.uuid4()),
            event_type=event_type,
            repository_id=repository_id,
            workspace_id=workspace_id,
            user_id=user_id,
            user_name=user_name,
            payload=payload,
        )

        # 1. Local delivery to connected clients on this instance
        await self._deliver_local_repository_event(repository_id, event)

        # 2. Redis publish for multi-instance fanout
        await self._publish_to_redis(repository_id, event)

    async def broadcast_to_room(
        self,
        room: str,
        event_type: str,
        repository_id: str,
        payload: Dict[str, Any],
        user_id: Optional[str] = None,
        user_name: Optional[str] = None,
    ):
        """Broadcast event to a specific sub-room (e.g. investigation, architecture)."""
        event = CollaborationEvent(
            event_id=str(uuid.uuid4()),
            event_type=event_type,
            repository_id=repository_id,
            user_id=user_id,
            user_name=user_name,
            payload={**payload, "_room": room},
        )
        async with self._lock:
            conn_ids = list(self._rooms.get(room, set()))
            for cid in conn_ids:
                conn = self._connections.get(cid)
                if conn:
                    await conn.send_event(event)

        # Redis publish
        await self._publish_to_redis(repository_id, event)

    async def _deliver_local_repository_event(self, repository_id: str, event: CollaborationEvent):
        async with self._lock:
            conn_ids = list(self._repo_connections.get(repository_id, set()))
            for cid in conn_ids:
                conn = self._connections.get(cid)
                if conn:
                    # If event is targeted to a room, verify membership
                    target_room = event.payload.get("_room")
                    if target_room and target_room not in conn.rooms:
                        continue
                    await conn.send_event(event)

    async def _publish_to_redis(self, repository_id: str, event: CollaborationEvent):
        """Publish event to Redis channel for other backend instances."""
        now = time.time()
        if now < self._redis_disabled_until:
            return

        try:
            redis = await get_redis()
            channel = f"codeatlas:events:{repository_id}"
            message = {
                "instance_id": self._instance_id,
                "event": event.model_dump(),
            }
            await asyncio.wait_for(redis.publish(channel, json.dumps(message)), timeout=0.1)
        except Exception as e:
            self._redis_disabled_until = time.time() + 10.0
            logger.debug(f"Redis publish skipped or failed: {e}")

    async def _redis_listener(self):
        """Subscribe to Redis channels to receive events from other backend instances."""
        while True:
            try:
                redis = await get_redis()
                pubsub = redis.pubsub()
                await asyncio.wait_for(pubsub.psubscribe("codeatlas:events:*"), timeout=0.5)
                logger.info("Subscribed to Redis event channels (codeatlas:events:*)")

                async for message in pubsub.listen():
                    if message and message.get("type") == "pmessage":
                        try:
                            data = json.loads(message["data"])
                            # Ignore messages originated from this instance
                            if data.get("instance_id") == self._instance_id:
                                continue
                            raw_event = data.get("event")
                            if raw_event:
                                event = CollaborationEvent.model_validate(raw_event)
                                await self._deliver_local_repository_event(event.repository_id, event)
                        except Exception as parse_err:
                            logger.debug(f"Error parsing Redis pubsub message: {parse_err}")
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.debug(f"Redis PubSub listener encountered error: {e}. Reconnecting in 3s...")
                await asyncio.sleep(3.0)

    async def _stale_session_reaper(self):
        """Periodically check for connections with expired heartbeats (>60s)."""
        while True:
            try:
                await asyncio.sleep(20.0)
                now = datetime.now(timezone.utc)
                stale_ids = []
                async with self._lock:
                    for cid, conn in self._connections.items():
                        delta = (now - conn.last_heartbeat).total_seconds()
                        if delta > 60:
                            stale_ids.append(cid)

                for cid in stale_ids:
                    logger.info(f"Reaping stale connection {cid}")
                    await self.unregister(cid)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in stale session reaper: {e}")


# Singleton instance
collaboration_manager = CollaborationManager()
