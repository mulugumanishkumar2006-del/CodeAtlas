from datetime import datetime, timezone
import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models import (
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
async def test_repository_isolation_pipeline_a_b_a(db_session: AsyncSession):
    """
    Test strict database isolation between two separate repositories:
    - Repository A: Python repository (Backend service)
    - Repository B: TypeScript repository (Frontend application)

    Executes full entity population for both repositories, then verifies
    complete non-contamination across:
    Query A -> Query B -> Query A
    """

    # 1. Setup shared or separate workspaces
    workspace = Workspace(
        name="Enterprise Architecture Workspace",
        slug="enterprise-arch-ws",
        description="Isolation testing workspace",
    )
    db_session.add(workspace)
    await db_session.flush()

    # -------------------------------------------------------------
    # 2. Insert Complete Dataset for Repository A (Python)
    # -------------------------------------------------------------
    repo_a = Repository(
        workspace_id=workspace.id,
        name="python-backend-service",
        url="https://github.com/enterprise/python-backend-service",
        provider="github",
        owner_name="enterprise",
        default_branch="main",
        current_commit_sha="py_sha_1001",
        connection_status="connected",
        analysis_status="completed",
    )
    db_session.add(repo_a)
    await db_session.flush()

    analysis_a = Analysis(
        repository_id=repo_a.id,
        commit_sha="py_sha_1001",
        branch="main",
        status="completed",
        version=1,
        summary="Complete AST & architectural scan for Python service",
        started_at=datetime.now(timezone.utc),
        completed_at=datetime.now(timezone.utc),
    )
    db_session.add(analysis_a)
    await db_session.flush()

    file_a1 = File(
        repository_id=repo_a.id,
        analysis_id=analysis_a.id,
        path="backend/server.py",
        language="python",
        size_bytes=4200,
        line_count=120,
        content_hash="py_hash_server",
    )
    file_a2 = File(
        repository_id=repo_a.id,
        analysis_id=analysis_a.id,
        path="backend/models/user.py",
        language="python",
        size_bytes=2100,
        line_count=60,
        content_hash="py_hash_models",
    )
    db_session.add_all([file_a1, file_a2])
    await db_session.flush()

    symbol_a1 = Symbol(
        repository_id=repo_a.id,
        file_id=file_a1.id,
        name="create_application",
        symbol_type="function",
        qualified_name="backend.server.create_application",
        start_line=15,
        end_line=45,
    )
    symbol_a2 = Symbol(
        repository_id=repo_a.id,
        file_id=file_a2.id,
        name="UserModel",
        symbol_type="class",
        qualified_name="backend.models.user.UserModel",
        start_line=10,
        end_line=50,
    )
    db_session.add_all([symbol_a1, symbol_a2])

    dep_a1 = Dependency(
        repository_id=repo_a.id,
        analysis_id=analysis_a.id,
        name="fastapi",
        version_spec=">=0.110.0",
        dependency_type="direct",
        package_manager="pip",
        source_file_id=file_a1.id,
    )
    dep_a2 = Dependency(
        repository_id=repo_a.id,
        analysis_id=analysis_a.id,
        name="sqlalchemy",
        version_spec=">=2.0.0",
        dependency_type="direct",
        package_manager="pip",
        source_file_id=file_a2.id,
    )
    db_session.add_all([dep_a1, dep_a2])

    node_a1 = GraphNode(
        repository_id=repo_a.id,
        analysis_id=analysis_a.id,
        node_key="py:backend.server",
        node_type="module",
        label="server.py",
        file_id=file_a1.id,
    )
    node_a2 = GraphNode(
        repository_id=repo_a.id,
        analysis_id=analysis_a.id,
        node_key="py:backend.models.user",
        node_type="module",
        label="user.py",
        file_id=file_a2.id,
    )
    db_session.add_all([node_a1, node_a2])
    await db_session.flush()

    rel_a = GraphRelationship(
        repository_id=repo_a.id,
        analysis_id=analysis_a.id,
        source_node_id=node_a1.id,
        target_node_id=node_a2.id,
        relationship_type="imports",
        weight=1.0,
    )
    commit_a = Commit(
        repository_id=repo_a.id,
        commit_sha="py_sha_1001",
        author_name="Python Architect",
        author_email="pydev@enterprise.io",
        message="feat(api): initialize async fastapi engine",
        committed_at=datetime.now(timezone.utc),
    )
    metric_a = Metric(
        repository_id=repo_a.id,
        analysis_id=analysis_a.id,
        category="complexity",
        name="average_cyclomatic_complexity",
        value=2.45,
        unit="score",
    )
    finding_a = Finding(
        repository_id=repo_a.id,
        analysis_id=analysis_a.id,
        file_id=file_a1.id,
        symbol_id=symbol_a1.id,
        rule_id="PY-SEC-004",
        category="security",
        severity="medium",
        title="Unsanitized environment read",
        description="Environment variable read without fallback typing in server.py",
    )
    investigation_a = Investigation(
        repository_id=repo_a.id,
        title="Python 3.12 ASGI Performance Profiling",
        status="open",
        query="Analyze ASGI worker event loop overhead during peak traffic",
    )
    simulation_a = Simulation(
        repository_id=repo_a.id,
        name="Simulate uvloop integration",
        simulation_type="performance_optimization",
        status="completed",
    )
    conversation_a = Conversation(
        repository_id=repo_a.id,
        workspace_id=workspace.id,
        title="Backend Architectural Review",
        context_type="repository",
        messages=[{"role": "user", "content": "How are database sessions handled?"}],
    )
    db_session.add_all([
        rel_a,
        commit_a,
        metric_a,
        finding_a,
        investigation_a,
        simulation_a,
        conversation_a,
    ])

    # -------------------------------------------------------------
    # 3. Insert Complete Dataset for Repository B (TypeScript)
    # -------------------------------------------------------------
    repo_b = Repository(
        workspace_id=workspace.id,
        name="typescript-web-frontend",
        url="https://github.com/enterprise/typescript-web-frontend",
        provider="github",
        owner_name="enterprise",
        default_branch="master",
        current_commit_sha="ts_sha_2001",
        connection_status="connected",
        analysis_status="completed",
    )
    db_session.add(repo_b)
    await db_session.flush()

    analysis_b = Analysis(
        repository_id=repo_b.id,
        commit_sha="ts_sha_2001",
        branch="master",
        status="completed",
        version=1,
        summary="Complete Component Tree & Dependency scan for React App",
        started_at=datetime.now(timezone.utc),
        completed_at=datetime.now(timezone.utc),
    )
    db_session.add(analysis_b)
    await db_session.flush()

    file_b1 = File(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        path="src/App.tsx",
        language="typescript",
        size_bytes=3100,
        line_count=85,
        content_hash="ts_hash_app",
    )
    file_b2 = File(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        path="src/components/Header.tsx",
        language="typescript",
        size_bytes=1800,
        line_count=45,
        content_hash="ts_hash_header",
    )
    file_b3 = File(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        path="src/hooks/useAuth.ts",
        language="typescript",
        size_bytes=2400,
        line_count=65,
        content_hash="ts_hash_auth",
    )
    db_session.add_all([file_b1, file_b2, file_b3])
    await db_session.flush()

    symbol_b1 = Symbol(
        repository_id=repo_b.id,
        file_id=file_b1.id,
        name="App",
        symbol_type="component",
        qualified_name="src.App.App",
        start_line=10,
        end_line=75,
    )
    symbol_b2 = Symbol(
        repository_id=repo_b.id,
        file_id=file_b2.id,
        name="Header",
        symbol_type="component",
        qualified_name="src.components.Header.Header",
        start_line=5,
        end_line=40,
    )
    symbol_b3 = Symbol(
        repository_id=repo_b.id,
        file_id=file_b3.id,
        name="useAuth",
        symbol_type="hook",
        qualified_name="src.hooks.useAuth.useAuth",
        start_line=8,
        end_line=60,
    )
    db_session.add_all([symbol_b1, symbol_b2, symbol_b3])

    dep_b1 = Dependency(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        name="react",
        version_spec="^18.3.1",
        dependency_type="direct",
        package_manager="npm",
        source_file_id=file_b1.id,
    )
    dep_b2 = Dependency(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        name="zustand",
        version_spec="^4.5.0",
        dependency_type="direct",
        package_manager="npm",
        source_file_id=file_b3.id,
    )
    dep_b3 = Dependency(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        name="lucide-react",
        version_spec="^0.350.0",
        dependency_type="direct",
        package_manager="npm",
        source_file_id=file_b2.id,
    )
    db_session.add_all([dep_b1, dep_b2, dep_b3])

    node_b1 = GraphNode(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        node_key="ts:src/App",
        node_type="component",
        label="App.tsx",
        file_id=file_b1.id,
    )
    node_b2 = GraphNode(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        node_key="ts:src/components/Header",
        node_type="component",
        label="Header.tsx",
        file_id=file_b2.id,
    )
    node_b3 = GraphNode(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        node_key="ts:src/hooks/useAuth",
        node_type="hook",
        label="useAuth.ts",
        file_id=file_b3.id,
    )
    db_session.add_all([node_b1, node_b2, node_b3])
    await db_session.flush()

    rel_b1 = GraphRelationship(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        source_node_id=node_b1.id,
        target_node_id=node_b2.id,
        relationship_type="renders",
        weight=1.0,
    )
    rel_b2 = GraphRelationship(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        source_node_id=node_b1.id,
        target_node_id=node_b3.id,
        relationship_type="calls",
        weight=1.0,
    )
    commit_b = Commit(
        repository_id=repo_b.id,
        commit_sha="ts_sha_2001",
        author_name="Frontend Engineer",
        author_email="fedev@enterprise.io",
        message="feat(ui): implement navigation header and auth context hook",
        committed_at=datetime.now(timezone.utc),
    )
    metric_b = Metric(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        category="performance",
        name="bundle_size_kb",
        value=192.4,
        unit="KB",
    )
    finding_b = Finding(
        repository_id=repo_b.id,
        analysis_id=analysis_b.id,
        file_id=file_b2.id,
        symbol_id=symbol_b2.id,
        rule_id="TS-PERF-012",
        category="performance",
        severity="low",
        title="Missing React.memo on static header",
        description="Header component re-renders unnecessarily on route transitions.",
    )
    investigation_b = Investigation(
        repository_id=repo_b.id,
        title="Vite Chunk Splitting Optimization",
        status="in_progress",
        query="Investigate vendor chunk splitting to reduce initial load time",
    )
    simulation_b = Simulation(
        repository_id=repo_b.id,
        name="Simulate React 19 Compiler Transition",
        simulation_type="framework_upgrade",
        status="pending",
    )
    conversation_b = Conversation(
        repository_id=repo_b.id,
        workspace_id=workspace.id,
        title="Frontend Design System Integration",
        context_type="repository",
        messages=[{"role": "user", "content": "How do we align styling tokens?"}],
    )
    db_session.add_all([
        rel_b1,
        rel_b2,
        commit_b,
        metric_b,
        finding_b,
        investigation_b,
        simulation_b,
        conversation_b,
    ])

    await db_session.commit()

    # -------------------------------------------------------------
    # 4. Helper to query and verify repository isolation
    # -------------------------------------------------------------
    async def verify_repository_a_isolation():
        # Query files for Repo A
        f_res = await db_session.execute(select(File).where(File.repository_id == repo_a.id))
        files = f_res.scalars().all()
        assert len(files) == 2
        assert all(f.repository_id == repo_a.id for f in files)
        assert all(f.language == "python" for f in files)
        assert not any(f.language == "typescript" for f in files)
        assert set(f.path for f in files) == {"backend/server.py", "backend/models/user.py"}

        # Query symbols for Repo A
        s_res = await db_session.execute(select(Symbol).where(Symbol.repository_id == repo_a.id))
        symbols = s_res.scalars().all()
        assert len(symbols) == 2
        assert all(s.repository_id == repo_a.id for s in symbols)
        assert set(s.name for s in symbols) == {"create_application", "UserModel"}
        assert "useAuth" not in [s.name for s in symbols]

        # Query dependencies for Repo A
        d_res = await db_session.execute(select(Dependency).where(Dependency.repository_id == repo_a.id))
        deps = d_res.scalars().all()
        assert len(deps) == 2
        assert all(d.repository_id == repo_a.id for d in deps)
        assert all(d.package_manager == "pip" for d in deps)
        assert set(d.name for d in deps) == {"fastapi", "sqlalchemy"}

        # Query graph nodes for Repo A
        n_res = await db_session.execute(select(GraphNode).where(GraphNode.repository_id == repo_a.id))
        nodes = n_res.scalars().all()
        assert len(nodes) == 2
        assert all(n.repository_id == repo_a.id for n in nodes)
        assert set(n.node_key for n in nodes) == {"py:backend.server", "py:backend.models.user"}

        # Query graph relationships for Repo A
        r_res = await db_session.execute(select(GraphRelationship).where(GraphRelationship.repository_id == repo_a.id))
        rels = r_res.scalars().all()
        assert len(rels) == 1
        assert rels[0].repository_id == repo_a.id
        assert rels[0].relationship_type == "imports"

        # Query metrics for Repo A
        m_res = await db_session.execute(select(Metric).where(Metric.repository_id == repo_a.id))
        metrics = m_res.scalars().all()
        assert len(metrics) == 1
        assert metrics[0].name == "average_cyclomatic_complexity"
        assert metrics[0].analysis_id == analysis_a.id

        # Query findings for Repo A
        find_res = await db_session.execute(select(Finding).where(Finding.repository_id == repo_a.id))
        findings = find_res.scalars().all()
        assert len(findings) == 1
        assert findings[0].rule_id == "PY-SEC-004"

        # Query investigations for Repo A
        inv_res = await db_session.execute(select(Investigation).where(Investigation.repository_id == repo_a.id))
        invs = inv_res.scalars().all()
        assert len(invs) == 1
        assert invs[0].title == "Python 3.12 ASGI Performance Profiling"

        # Query simulations for Repo A
        sim_res = await db_session.execute(select(Simulation).where(Simulation.repository_id == repo_a.id))
        sims = sim_res.scalars().all()
        assert len(sims) == 1
        assert sims[0].name == "Simulate uvloop integration"

        # Query conversations for Repo A
        conv_res = await db_session.execute(select(Conversation).where(Conversation.repository_id == repo_a.id))
        convs = conv_res.scalars().all()
        assert len(convs) == 1
        assert convs[0].title == "Backend Architectural Review"

    async def verify_repository_b_isolation():
        # Query files for Repo B
        f_res = await db_session.execute(select(File).where(File.repository_id == repo_b.id))
        files = f_res.scalars().all()
        assert len(files) == 3
        assert all(f.repository_id == repo_b.id for f in files)
        assert all(f.language == "typescript" for f in files)
        assert not any(f.language == "python" for f in files)
        assert set(f.path for f in files) == {"src/App.tsx", "src/components/Header.tsx", "src/hooks/useAuth.ts"}

        # Query symbols for Repo B
        s_res = await db_session.execute(select(Symbol).where(Symbol.repository_id == repo_b.id))
        symbols = s_res.scalars().all()
        assert len(symbols) == 3
        assert all(s.repository_id == repo_b.id for s in symbols)
        assert set(s.name for s in symbols) == {"App", "Header", "useAuth"}
        assert "create_application" not in [s.name for s in symbols]

        # Query dependencies for Repo B
        d_res = await db_session.execute(select(Dependency).where(Dependency.repository_id == repo_b.id))
        deps = d_res.scalars().all()
        assert len(deps) == 3
        assert all(d.repository_id == repo_b.id for d in deps)
        assert all(d.package_manager == "npm" for d in deps)
        assert set(d.name for d in deps) == {"react", "zustand", "lucide-react"}

        # Query graph nodes for Repo B
        n_res = await db_session.execute(select(GraphNode).where(GraphNode.repository_id == repo_b.id))
        nodes = n_res.scalars().all()
        assert len(nodes) == 3
        assert all(n.repository_id == repo_b.id for n in nodes)
        assert set(n.node_key for n in nodes) == {"ts:src/App", "ts:src/components/Header", "ts:src/hooks/useAuth"}

        # Query graph relationships for Repo B
        r_res = await db_session.execute(select(GraphRelationship).where(GraphRelationship.repository_id == repo_b.id))
        rels = r_res.scalars().all()
        assert len(rels) == 2
        assert all(r.repository_id == repo_b.id for r in rels)
        assert set(r.relationship_type for r in rels) == {"renders", "calls"}

        # Query metrics for Repo B
        m_res = await db_session.execute(select(Metric).where(Metric.repository_id == repo_b.id))
        metrics = m_res.scalars().all()
        assert len(metrics) == 1
        assert metrics[0].name == "bundle_size_kb"
        assert metrics[0].analysis_id == analysis_b.id

        # Query findings for Repo B
        find_res = await db_session.execute(select(Finding).where(Finding.repository_id == repo_b.id))
        findings = find_res.scalars().all()
        assert len(findings) == 1
        assert findings[0].rule_id == "TS-PERF-012"

        # Query investigations for Repo B
        inv_res = await db_session.execute(select(Investigation).where(Investigation.repository_id == repo_b.id))
        invs = inv_res.scalars().all()
        assert len(invs) == 1
        assert invs[0].title == "Vite Chunk Splitting Optimization"

        # Query simulations for Repo B
        sim_res = await db_session.execute(select(Simulation).where(Simulation.repository_id == repo_b.id))
        sims = sim_res.scalars().all()
        assert len(sims) == 1
        assert sims[0].name == "Simulate React 19 Compiler Transition"

        # Query conversations for Repo B
        conv_res = await db_session.execute(select(Conversation).where(Conversation.repository_id == repo_b.id))
        convs = conv_res.scalars().all()
        assert len(convs) == 1
        assert convs[0].title == "Frontend Design System Integration"

    # -------------------------------------------------------------
    # 5. Execute Sequence: A -> B -> A
    # -------------------------------------------------------------
    # Step A: Query and verify Repository A
    await verify_repository_a_isolation()

    # Step B: Query and verify Repository B
    await verify_repository_b_isolation()

    # Step A (Again): Query and verify Repository A again to prove no side effects or contamination
    await verify_repository_a_isolation()
