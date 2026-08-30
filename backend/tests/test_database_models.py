from datetime import datetime, timezone
import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models import (
    User,
    Workspace,
    Repository,
    Analysis,
    File,
    Symbol,
    Dependency,
    GraphNode,
    GraphRelationship,
    Commit,
    Metric,
    Finding,
    Investigation,
    Simulation,
    Conversation,
)


@pytest.mark.asyncio
async def test_workspace_can_exist(db_session: AsyncSession):
    # 1. A workspace can exist
    user = User(
        email="lead@codeatlas.io",
        username="lead_dev",
        full_name="Lead Developer",
    )
    db_session.add(user)
    await db_session.flush()

    workspace = Workspace(
        name="Platform Engineering",
        slug="platform-eng",
        description="Core platform repositories",
        owner_id=user.id,
    )
    db_session.add(workspace)
    await db_session.commit()

    result = await db_session.execute(select(Workspace).where(Workspace.slug == "platform-eng"))
    fetched = result.scalars().first()
    assert fetched is not None
    assert fetched.name == "Platform Engineering"
    assert fetched.owner_id == user.id


@pytest.mark.asyncio
async def test_repository_can_belong_to_workspace(db_session: AsyncSession):
    # 2. A repository can belong to a workspace
    workspace = Workspace(name="Data Team", slug="data-team")
    db_session.add(workspace)
    await db_session.flush()

    repo = Repository(
        workspace_id=workspace.id,
        name="data-pipeline",
        url="https://github.com/org/data-pipeline",
        provider="github",
        default_branch="main",
    )
    db_session.add(repo)
    await db_session.commit()

    result = await db_session.execute(select(Repository).where(Repository.id == repo.id))
    fetched_repo = result.scalars().first()
    assert fetched_repo is not None
    assert fetched_repo.workspace_id == workspace.id
    assert fetched_repo.name == "data-pipeline"


@pytest.mark.asyncio
async def test_analysis_can_belong_to_repository(db_session: AsyncSession):
    # 3. An analysis can belong to a repository
    workspace = Workspace(name="Core Workspace", slug="core-ws")
    db_session.add(workspace)
    await db_session.flush()

    repo = Repository(
        workspace_id=workspace.id,
        name="core-service",
        url="https://github.com/org/core-service",
    )
    db_session.add(repo)
    await db_session.flush()

    analysis = Analysis(
        repository_id=repo.id,
        commit_sha="a1b2c3d4e5f6",
        branch="main",
        status="completed",
        version=1,
        summary="Initial static analysis run",
        started_at=datetime.now(timezone.utc),
        completed_at=datetime.now(timezone.utc),
    )
    db_session.add(analysis)
    await db_session.commit()

    result = await db_session.execute(select(Analysis).where(Analysis.repository_id == repo.id))
    fetched_analysis = result.scalars().first()
    assert fetched_analysis is not None
    assert fetched_analysis.commit_sha == "a1b2c3d4e5f6"
    assert fetched_analysis.status == "completed"


@pytest.mark.asyncio
async def test_files_belong_to_correct_repository(db_session: AsyncSession):
    # 4. Files belong to the correct repository
    workspace = Workspace(name="Backend WS", slug="backend-ws")
    db_session.add(workspace)
    await db_session.flush()

    repo = Repository(
        workspace_id=workspace.id,
        name="auth-service",
        url="https://github.com/org/auth-service",
    )
    db_session.add(repo)
    await db_session.flush()

    file_record = File(
        repository_id=repo.id,
        path="src/auth/jwt.py",
        language="python",
        size_bytes=2048,
        line_count=65,
        content_hash="hash12345",
    )
    db_session.add(file_record)
    await db_session.commit()

    result = await db_session.execute(select(File).where(File.repository_id == repo.id))
    files = result.scalars().all()
    assert len(files) == 1
    assert files[0].path == "src/auth/jwt.py"
    assert files[0].repository_id == repo.id


@pytest.mark.asyncio
async def test_symbols_resolve_through_correct_file_and_repository(db_session: AsyncSession):
    # 5. Symbols resolve through their correct file/repository
    workspace = Workspace(name="Security WS", slug="security-ws")
    db_session.add(workspace)
    await db_session.flush()

    repo = Repository(
        workspace_id=workspace.id,
        name="crypto-lib",
        url="https://github.com/org/crypto-lib",
    )
    db_session.add(repo)
    await db_session.flush()

    file_record = File(
        repository_id=repo.id,
        path="crypto/signer.py",
        language="python",
        size_bytes=1500,
        line_count=40,
    )
    db_session.add(file_record)
    await db_session.flush()

    symbol = Symbol(
        repository_id=repo.id,
        file_id=file_record.id,
        name="generate_signature",
        symbol_type="function",
        qualified_name="crypto.signer.generate_signature",
        start_line=10,
        end_line=25,
        docstring="Generates RSA cryptographic signature",
    )
    db_session.add(symbol)
    await db_session.commit()

    result = await db_session.execute(select(Symbol).where(Symbol.file_id == file_record.id))
    fetched_symbol = result.scalars().first()
    assert fetched_symbol is not None
    assert fetched_symbol.name == "generate_signature"
    assert fetched_symbol.repository_id == repo.id
    assert fetched_symbol.file_id == file_record.id


@pytest.mark.asyncio
async def test_dependencies_remain_repository_scoped(db_session: AsyncSession):
    # 6. Dependencies remain repository-scoped
    workspace = Workspace(name="Web WS", slug="web-ws")
    db_session.add(workspace)
    await db_session.flush()

    repo = Repository(
        workspace_id=workspace.id,
        name="frontend-app",
        url="https://github.com/org/frontend-app",
    )
    db_session.add(repo)
    await db_session.flush()

    dep = Dependency(
        repository_id=repo.id,
        name="react",
        version_spec="^18.2.0",
        dependency_type="direct",
        package_manager="npm",
    )
    db_session.add(dep)
    await db_session.commit()

    result = await db_session.execute(select(Dependency).where(Dependency.repository_id == repo.id))
    fetched_dep = result.scalars().first()
    assert fetched_dep is not None
    assert fetched_dep.name == "react"
    assert fetched_dep.package_manager == "npm"


@pytest.mark.asyncio
async def test_graph_nodes_and_relationships_remain_repository_scoped(db_session: AsyncSession):
    # 7 & 8. Graph nodes and graph relationships remain repository-scoped
    workspace = Workspace(name="Arch WS", slug="arch-ws")
    db_session.add(workspace)
    await db_session.flush()

    repo = Repository(
        workspace_id=workspace.id,
        name="microservice-hub",
        url="https://github.com/org/microservice-hub",
    )
    db_session.add(repo)
    await db_session.flush()

    node_a = GraphNode(
        repository_id=repo.id,
        node_key="module:api.v1.auth",
        node_type="module",
        label="Auth Module",
    )
    node_b = GraphNode(
        repository_id=repo.id,
        node_key="module:db.session",
        node_type="module",
        label="DB Session",
    )
    db_session.add_all([node_a, node_b])
    await db_session.flush()

    rel = GraphRelationship(
        repository_id=repo.id,
        source_node_id=node_a.id,
        target_node_id=node_b.id,
        relationship_type="imports",
        weight=1.0,
    )
    db_session.add(rel)
    await db_session.commit()

    nodes_res = await db_session.execute(select(GraphNode).where(GraphNode.repository_id == repo.id))
    nodes = nodes_res.scalars().all()
    assert len(nodes) == 2

    rels_res = await db_session.execute(select(GraphRelationship).where(GraphRelationship.repository_id == repo.id))
    rels = rels_res.scalars().all()
    assert len(rels) == 1
    assert rels[0].source_node_id == node_a.id
    assert rels[0].target_node_id == node_b.id


@pytest.mark.asyncio
async def test_metrics_and_findings_remain_associated_with_correct_analysis(db_session: AsyncSession):
    # 9 & 10. Metrics & Findings remain associated with the correct analysis
    workspace = Workspace(name="Quality WS", slug="quality-ws")
    db_session.add(workspace)
    await db_session.flush()

    repo = Repository(
        workspace_id=workspace.id,
        name="payment-gateway",
        url="https://github.com/org/payment-gateway",
    )
    db_session.add(repo)
    await db_session.flush()

    analysis = Analysis(
        repository_id=repo.id,
        status="completed",
        version=1,
    )
    db_session.add(analysis)
    await db_session.flush()

    metric = Metric(
        repository_id=repo.id,
        analysis_id=analysis.id,
        category="maintainability",
        name="cyclomatic_complexity_avg",
        value=3.45,
        unit="score",
    )
    finding = Finding(
        repository_id=repo.id,
        analysis_id=analysis.id,
        rule_id="SEC-001",
        category="security",
        severity="high",
        title="Hardcoded API Secret Detected",
        description="Potential secret key found in source code configuration.",
    )
    db_session.add_all([metric, finding])
    await db_session.commit()

    m_res = await db_session.execute(select(Metric).where(Metric.analysis_id == analysis.id))
    assert m_res.scalars().first().value == 3.45

    f_res = await db_session.execute(select(Finding).where(Finding.analysis_id == analysis.id))
    assert f_res.scalars().first().rule_id == "SEC-001"


@pytest.mark.asyncio
async def test_investigations_simulations_and_conversations_scoped_to_repository(db_session: AsyncSession):
    # 11, 12, 13. Investigations, simulations, and conversations remain repository-scoped
    workspace = Workspace(name="AI Lab WS", slug="ai-lab-ws")
    db_session.add(workspace)
    await db_session.flush()

    repo = Repository(
        workspace_id=workspace.id,
        name="analytics-core",
        url="https://github.com/org/analytics-core",
    )
    db_session.add(repo)
    await db_session.flush()

    investigation = Investigation(
        repository_id=repo.id,
        title="Memory Leak Investigation in Worker Loop",
        status="open",
        query="Investigate unbounded memory growth in worker pool processing",
    )
    simulation = Simulation(
        repository_id=repo.id,
        name="Split monolith into domain services",
        simulation_type="architectural_split",
        status="pending",
    )
    conversation = Conversation(
        repository_id=repo.id,
        workspace_id=workspace.id,
        title="Architecture Review Session",
        context_type="repository",
        messages=[{"role": "user", "content": "How are database connections pooled?"}],
    )
    db_session.add_all([investigation, simulation, conversation])
    await db_session.commit()

    inv_res = await db_session.execute(select(Investigation).where(Investigation.repository_id == repo.id))
    assert inv_res.scalars().first().title == "Memory Leak Investigation in Worker Loop"

    sim_res = await db_session.execute(select(Simulation).where(Simulation.repository_id == repo.id))
    assert sim_res.scalars().first().name == "Split monolith into domain services"

    conv_res = await db_session.execute(select(Conversation).where(Conversation.repository_id == repo.id))
    assert conv_res.scalars().first().title == "Architecture Review Session"


@pytest.mark.asyncio
async def test_commits_git_history_tracking(db_session: AsyncSession):
    workspace = Workspace(name="Git WS", slug="git-ws")
    db_session.add(workspace)
    await db_session.flush()

    repo = Repository(
        workspace_id=workspace.id,
        name="infra-repo",
        url="https://github.com/org/infra-repo",
    )
    db_session.add(repo)
    await db_session.flush()

    commit = Commit(
        repository_id=repo.id,
        commit_sha="e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
        author_name="Alice DevOps",
        author_email="alice@infra.io",
        message="feat: provision redis clustering",
        committed_at=datetime.now(timezone.utc),
        stats={"additions": 45, "deletions": 12, "files_changed": 3},
    )
    db_session.add(commit)
    await db_session.commit()

    c_res = await db_session.execute(select(Commit).where(Commit.repository_id == repo.id))
    fetched_commit = c_res.scalars().first()
    assert fetched_commit is not None
    assert fetched_commit.commit_sha == "e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"
    assert fetched_commit.stats["additions"] == 45
