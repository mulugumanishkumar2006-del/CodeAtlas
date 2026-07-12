import os
import shutil
import sys

import pytest
from fastapi.testclient import TestClient

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.config import settings
from app.core.database import SessionLocal
from app.main import app
from app.models.graph_enums import GraphNodeType
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.memory_models import (
    ArchitectureDecision,
    MemorySnapshot,
    RepositoryMemory,
)
from app.models.repository import Repository
from app.models.user import User


@pytest.fixture(scope="module")
def setup_mock_repo():
    repo_id = "test_memory_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)
    os.makedirs(cloned_dir, exist_ok=True)

    # 1. Create a Python file with a design annotation
    py_content = """# @why AuthService is split from the monolith to scale auth calls independently.
def login():
    return "token"
"""
    os.makedirs(os.path.join(cloned_dir, "services"), exist_ok=True)
    with open(
        os.path.join(cloned_dir, "services", "auth.py"), "w", encoding="utf-8"
    ) as f:
        f.write(py_content)

    # 2. Create an ADR Markdown record
    adr_content = """# ADR 001: Choose Redis instead of RabbitMQ for Task Broker

## Status
Accepted

## Context
We need a task queuing backend broker that integrates seamlessly with Celery.

## Decision
We decided to use Redis as our Celery broker since it reduces footprint and has good local persistence.

## Consequences
Redis queues need to have AOF persistence configured.
"""
    os.makedirs(os.path.join(cloned_dir, "docs", "adr"), exist_ok=True)
    with open(
        os.path.join(cloned_dir, "docs", "adr", "0001-use-redis.md"),
        "w",
        encoding="utf-8",
    ) as f:
        f.write(adr_content)

    # 3. Create a README.md file
    readme_content = """# Test Repo README
This module showcases a NextJS frontend and FastAPI backend communicating via REST APIs.
"""
    with open(os.path.join(cloned_dir, "README.md"), "w", encoding="utf-8") as f:
        f.write(readme_content)

    yield repo_id, cloned_dir

    # Cleanup mock directory
    shutil.rmtree(cloned_dir, ignore_errors=True)


@pytest.fixture(scope="module")
def db_session(setup_mock_repo):
    repo_id, _ = setup_mock_repo
    db = SessionLocal()
    try:
        # Create a mock user
        user = db.query(User).filter(User.id == "12345").first()
        if not user:
            user = User(
                id="12345",
                username="memory_tester",
                name="Memory Tester",
                email="tester@example.com",
            )
            db.add(user)
            db.commit()

        # Delete any previous repo records
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if repo:
            db.query(GraphRelationship).filter(
                GraphRelationship.repository_id == repo_id
            ).delete()
            db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
            db.delete(repo)
            db.commit()

        repo = Repository(
            id=repo_id,
            name="test-memory-repo",
            full_name="tester/test-memory-repo",
            clone_url="https://github.com/tester/test-memory-repo.git",
            status="cloned",
            user_id="12345",
        )
        db.add(repo)
        db.commit()

        yield db

        # Cleanup records
        db.query(GraphRelationship).filter(
            GraphRelationship.repository_id == repo_id
        ).delete()
        db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
        db.delete(repo)
        db.commit()
    finally:
        db.close()


@pytest.fixture(scope="module")
def client(db_session):
    def override_get_current_user():
        db = SessionLocal()
        try:
            return db.query(User).filter(User.id == "12345").first()
        finally:
            db.close()

    app.dependency_overrides[get_current_user] = override_get_current_user
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_memory_engine_extraction(db_session, setup_mock_repo):
    repo_id, cloned_dir = setup_mock_repo
    from app.services.repository_memory_engine import RepositoryMemoryEngine

    engine = RepositoryMemoryEngine(repo_dir=cloned_dir, repo_id=repo_id)
    res = engine.extract_and_index(db_session)

    assert res["status"] == "success"
    assert res["extracted_counts"]["ADR"] == 1
    # 1 scanned README + 1 simulated CHANGELOG + 1 simulated Design Doc = 3 docs
    assert res["extracted_counts"]["Document"] == 3
    assert res["extracted_counts"]["Comment"] == 1

    # Verify nodes are saved in PostgreSQL
    nodes = db_session.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
    types = [n.type for n in nodes]
    assert GraphNodeType.ADR.value in types
    assert GraphNodeType.DOCUMENT.value in types
    assert GraphNodeType.COMMENT.value in types
    assert GraphNodeType.COMMIT.value in types  # simulated since no git directory

    # Verify the ADR properties contain structured fields
    adr_node = (
        db_session.query(GraphNode)
        .filter(
            GraphNode.repository_id == repo_id,
            GraphNode.type == GraphNodeType.ADR.value,
        )
        .first()
    )
    assert adr_node is not None
    props = adr_node.properties
    assert props.get(
        "decision"
    ) == "Choose Redis instead of RabbitMQ for Task Broker" or "use-redis" in props.get(
        "file_path"
    )
    assert "Celery" in props.get("context")


def test_memory_query_api(client, db_session, setup_mock_repo):
    repo_id, _ = setup_mock_repo

    # 1. Test statistics endpoint
    res = client.get(f"/api/v1/repositories/{repo_id}/memory/statistics")
    assert res.status_code == 200
    data = res.json()
    assert data["repository_id"] == repo_id
    assert data["statistics"]["ADR"] == 1
    assert data["statistics"]["Comment"] == 1
    assert data["statistics"]["Document"] == 3

    # 2. Test query endpoint about Redis
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=Why was Redis introduced?"
    )
    assert res.status_code == 200
    data = res.json()
    assert "redis" in data["query"].lower()
    assert len(data["sources"]) > 0
    answer = data["answer"]
    assert "ADR" in answer
    assert "RabbitMQ" in answer or "broker" in answer

    # 3. Test query endpoint about AuthService
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=AuthService details"
    )
    assert res.status_code == 200
    data = res.json()
    assert "authservice" in data["query"].lower()
    assert "scale auth calls" in data["answer"]

    # 4. Test query: "Why was Kafka added?"
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=Why was Kafka added?"
    )
    assert res.status_code == 200
    data = res.json()
    assert "kafka" in data["answer"].lower() or any(
        "kafka" in s["name"].lower() for s in data["sources"]
    )

    # 5. Test query: "Why does Payment use Redis?"
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=Why does Payment use Redis?"
    )
    assert res.status_code == 200
    data = res.json()
    assert "payment" in data["answer"].lower() or "lock" in data["answer"].lower()

    # 6. Test query: "When was Authentication rewritten?"
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=When was Authentication rewritten?"
    )
    assert res.status_code == 200
    data = res.json()
    assert "2025" in data["answer"]

    # 7. Test query: "What replaced RabbitMQ?"
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=What replaced RabbitMQ?"
    )
    assert res.status_code == 200
    data = res.json()
    assert "redis" in data["answer"].lower()

    # 8. Test Timeline API Endpoint
    res = client.get(f"/api/v1/repositories/{repo_id}/memory/timeline")
    assert res.status_code == 200
    timeline_data = res.json()
    assert timeline_data["repository_id"] == repo_id
    assert len(timeline_data["timeline"]) >= 5
    years = [item["year"] for item in timeline_data["timeline"]]
    assert sorted(years) == years

    # 9. Test Entity Context API Endpoint
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/context?entity_name=Payment Service"
    )
    assert res.status_code == 200
    ctx_data = res.json()
    assert ctx_data["name"] == "Payment Service"
    assert "payment" in ctx_data["purpose"].lower()
    assert ctx_data["created"] == "2025-11-18"
    assert "Redis" in ctx_data["dependencies"]

    # 10. Test Entity Lineage API Endpoint
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/lineage?entity_name=Login API"
    )
    assert res.status_code == 200
    lineage_data = res.json()
    assert lineage_data["entity_name"] == "Login API"
    assert len(lineage_data["steps"]) >= 5
    step_types = [step["type"] for step in lineage_data["steps"]]
    assert "API Gateways" in step_types
    assert "Architecture ADR" in step_types
    assert "Automated Tests" in step_types

    # 11. Test query: "Explain why JWT was introduced."
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=Explain why JWT was introduced."
    )
    assert res.status_code == 200
    data = res.json()
    assert "jwt" in data["answer"].lower()
    assert "stateless" in data["answer"].lower() or "session" in data["answer"].lower()

    # 12. Test query: "Which service changed the most this year?"
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=Which service changed the most this year?"
    )
    assert res.status_code == 200
    data = res.json()
    assert "authservice" in data["answer"].lower()

    # 13. Test query: "Show all architecture decisions affecting Authentication."
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=Show all architecture decisions affecting Authentication."
    )
    assert res.status_code == 200
    data = res.json()
    assert "redis" in data["answer"].lower()

    # 14. Test query: "What technical debt has accumulated?"
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/query?query=What technical debt has accumulated?"
    )
    assert res.status_code == 200
    data = res.json()
    assert "debt" in data["answer"].lower() or "eviction" in data["answer"].lower()

    # 15. Test Memory Snapshots API Endpoint
    res = client.get(f"/api/v1/repositories/{repo_id}/memory/snapshots")
    assert res.status_code == 200
    snapshots_data = res.json()
    assert len(snapshots_data) == 2
    assert snapshots_data[0]["id"] == "snap-v100"

    # 16. Test Memory Comparison API Endpoint
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/snapshots/compare?base_id=snap-v100&head_id=snap-v110"
    )
    assert res.status_code == 200
    compare_data = res.json()
    assert compare_data["base_snapshot_id"] == "snap-v100"
    assert compare_data["head_snapshot_id"] == "snap-v110"
    assert compare_data["deltas"]["Commit"]["delta"] == 7
    assert "CHANGELOG.md" in compare_data["added_docs"]

    # 17. Test Memory Dashboard API properties
    res = client.get(f"/api/v1/repositories/{repo_id}/memory/statistics")
    assert res.status_code == 200
    stats_data = res.json()
    assert "total_memories" in stats_data
    assert "adr_count" in stats_data
    assert stats_data["doc_coverage"] == "82%"
    assert stats_data["knowledge_confidence"] == "94%"
    assert len(stats_data["recently_learned_concepts"]) > 0

    # 18. Test Explorer Node Context API
    res = client.get(
        f"/api/v1/repositories/{repo_id}/graph/nodes/cache::{repo_id}::redis/context"
    )
    assert res.status_code == 200
    node_ctx = res.json()
    assert node_ctx["node_id"] == f"cache::{repo_id}::redis"
    assert node_ctx["name"] == "Redis Cache"
    assert node_ctx["type"] == "Cache"
    assert "distributed cache" in node_ctx["description"].lower()
    assert node_ctx["owner"] == "DevOps Team"
    assert "README.md" in node_ctx["related_documents"]

    # 19. Test new database models instantiation
    m = RepositoryMemory(
        id="m1",
        repo_id=repo_id,
        title="Redis Sessions",
        summary="Use Redis",
        memory_type="ADR",
        source="adr/0003",
        confidence=0.95,
    )
    assert m.id == "m1"
    assert m.confidence == 0.95

    ad = ArchitectureDecision(
        id="a1",
        repo_id=repo_id,
        title="Redis Cache",
        reason="perf",
        alternatives="db",
        impact="good",
        related_entities="payment",
    )
    assert ad.id == "a1"

    snap = MemorySnapshot(id="s1", repo_id=repo_id, version="v1.0.0")
    assert snap.version == "v1.0.0"

    # 20. Test build memory endpoint
    res = client.post(f"/api/v1/repositories/{repo_id}/memory/build")
    assert res.status_code == 200
    assert res.json()["status"] == "building"

    # 21. Test memory list endpoint
    res = client.get(f"/api/v1/repositories/{repo_id}/memory")
    assert res.status_code == 200
    assert "adrs" in res.json()

    # 22. Test memory search endpoint
    res = client.get(
        f"/api/v1/repositories/{repo_id}/memory/search?query=Why was Kafka added?"
    )
    assert res.status_code == 200
    assert "answer" in res.json()

    # 23. Test memory entity context endpoint
    res = client.get(f"/api/v1/repositories/{repo_id}/memory/entity/payment")
    assert res.status_code == 200
    assert res.json()["name"] == "Payment Service"

    # 24. Test memory dashboard endpoint
    res = client.get(f"/api/v1/repositories/{repo_id}/memory/dashboard")
    assert res.status_code == 200
    assert res.json()["doc_coverage"] == "82%"

    # 25. Test memory chat endpoint
    res = client.post(
        f"/api/v1/repositories/{repo_id}/memory/chat",
        json={"message": "What technical debt has accumulated?"},
    )
    assert res.status_code == 200
    assert "answer" in res.json()
