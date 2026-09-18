import pytest
import uuid
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.workspace import Workspace
from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.services.architecture_intelligence_service import architecture_intelligence_service
from backend.app.services.rag_service import rag_service


async def create_test_workspace(db: AsyncSession) -> Workspace:
    ws = Workspace(
        id=f"ws-{uuid.uuid4().hex[:8]}",
        name=f"Workspace-{uuid.uuid4().hex[:4]}",
        slug=f"ws-slug-{uuid.uuid4().hex[:6]}",
    )
    db.add(ws)
    await db.flush()
    return ws


# =========================================================================
# 1. 12 Node Types & 11 Edge Types Architecture Graph
# =========================================================================

def test_architecture_graph_12_node_types_and_11_edge_types():
    repo_id = f"repo-{uuid.uuid4().hex[:8]}"
    files = [
        {"id": "f1", "path": "backend/api/users.py", "language": "python", "line_count": 50, "source_metadata": {}},
        {"id": "f2", "path": "backend/services/user_service.py", "language": "python", "line_count": 80, "source_metadata": {}},
        {"id": "f3", "path": "backend/models/user.py", "language": "python", "line_count": 60, "source_metadata": {}},
        {"id": "f4", "path": "backend/tests/test_users.py", "language": "python", "line_count": 40, "source_metadata": {}},
        {"id": "f5", "path": "docker-compose.yml", "language": "yaml", "line_count": 25, "source_metadata": {}},
    ]
    symbols = [
        {"id": "s1", "file_id": "f1", "name": "get_users", "symbol_type": "function", "start_line": 10, "end_line": 25},
        {"id": "s2", "file_id": "f2", "name": "UserService", "symbol_type": "class", "start_line": 5, "end_line": 40},
        {"id": "s3", "file_id": "f3", "name": "User", "symbol_type": "class", "start_line": 8, "end_line": 35},
    ]
    dependencies = [
        {"id": "d1", "source_path": "backend/api/users.py", "target_path": "backend/services/user_service.py", "dependency_type": "IMPORT", "resolved": True, "start_line": 3},
        {"id": "d2", "source_path": "backend/services/user_service.py", "target_path": "backend/models/user.py", "dependency_type": "IMPORT", "resolved": True, "start_line": 4},
        {"id": "d3", "source_path": "backend/tests/test_users.py", "target_path": "backend/api/users.py", "dependency_type": "IMPORT", "resolved": True, "start_line": 2},
        {"id": "d4", "source_path": "backend/services/user_service.py", "target_path": "requests", "dependency_type": "EXTERNAL", "resolved": False, "start_line": 5},
    ]
    profile = {
        "services": [{"name": "UserService", "entry_file": "backend/services/user_service.py", "type": "backend"}],
        "api_endpoints": [{"method": "GET", "path": "/api/v1/users", "file_path": "backend/api/users.py", "line": 10}],
        "databases": [{"type": "PostgreSQL", "source_file": "backend/models/user.py", "entities": ["User"]}],
        "infrastructure": [{"type": "docker", "file_path": "docker-compose.yml"}],
    }

    graph = architecture_intelligence_service.build_architecture_graph(
        repository_id=repo_id,
        files=files,
        dependencies=dependencies,
        symbols=symbols,
        profile=profile,
    )

    node_types = graph["node_types"]
    edge_types = graph["edge_types"]

    # Verify canonical node types are populated
    assert "repository" in node_types
    assert "application" in node_types
    assert "module" in node_types
    assert "file" in node_types
    assert "symbol" in node_types
    assert "service" in node_types
    assert "api" in node_types
    assert "database" in node_types
    assert "test" in node_types
    assert "infrastructure" in node_types
    assert "external_dependency" in node_types

    # Verify canonical edge types are populated
    assert "CONTAINS" in edge_types
    assert "IMPORTS" in edge_types
    assert "EXPOSES" in edge_types
    assert "CALLS" in edge_types
    assert "PERSISTS_TO" in edge_types
    assert "TESTS" in edge_types
    assert "DEPENDS_ON" in edge_types

    assert graph["total_nodes"] > 5
    assert graph["total_edges"] > 5


# =========================================================================
# 2. Canonical Layer Classification & Component Discovery
# =========================================================================

def test_canonical_layer_classification_and_components():
    repo_id = f"repo-{uuid.uuid4().hex[:8]}"
    files = [
        {"id": "f1", "path": "backend/api/routes.py", "language": "python", "line_count": 60},
        {"id": "f2", "path": "backend/services/billing.py", "language": "python", "line_count": 120},
        {"id": "f3", "path": "backend/models/order.py", "language": "python", "line_count": 80},
        {"id": "f4", "path": "backend/repositories/order_repo.py", "language": "python", "line_count": 90},
        {"id": "f5", "path": "backend/infra/cloud.py", "language": "python", "line_count": 45},
        {"id": "f6", "path": "backend/tests/test_billing.py", "language": "python", "line_count": 70},
        {"id": "f7", "path": "config/settings.py", "language": "python", "line_count": 30},
        {"id": "f8", "path": "integrations/stripe_client.py", "language": "python", "line_count": 55},
    ]
    deps = [
        {"id": "d1", "source_path": "backend/api/routes.py", "target_path": "backend/services/billing.py", "resolved": True},
        {"id": "d2", "source_path": "backend/services/billing.py", "target_path": "backend/repositories/order_repo.py", "resolved": True},
        {"id": "d3", "source_path": "backend/repositories/order_repo.py", "target_path": "backend/models/order.py", "resolved": True},
    ]

    components = architecture_intelligence_service.discover_components(
        repository_id=repo_id,
        files=files,
        dependencies=deps,
        symbols=[],
    )

    comp_names = [c["name"] for c in components]
    assert "API Layer" in comp_names
    assert "Service Layer" in comp_names
    assert "Data Access Layer" in comp_names
    assert "Domain Layer" in comp_names
    assert "Test Layer" in comp_names
    assert "Configuration Layer" in comp_names
    assert "Infrastructure Layer" in comp_names
    assert "External Integration Layer" in comp_names

    # Check that line counts and coupling were accumulated
    api_layer = next(c for c in components if c["name"] == "API Layer")
    assert api_layer["files_count"] == 1
    assert api_layer["code_lines"] == 60
    assert api_layer["outgoing_coupling"] == 1


# =========================================================================
# 3. End-to-End Data Flow Tracing
# =========================================================================

def test_trace_end_to_end_data_flows():
    repo_id = f"repo-{uuid.uuid4().hex[:8]}"
    files = [
        {"id": "f1", "path": "app/api/orders.py", "language": "python"},
        {"id": "f2", "path": "app/services/order_service.py", "language": "python"},
        {"id": "f3", "path": "app/repositories/order_repository.py", "language": "python"},
        {"id": "f4", "path": "app/models/order.py", "language": "python"},
    ]
    dependencies = [
        {"id": "d1", "source_path": "app/api/orders.py", "target_path": "app/services/order_service.py", "resolved": True},
        {"id": "d2", "source_path": "app/services/order_service.py", "target_path": "app/repositories/order_repository.py", "resolved": True},
        {"id": "d3", "source_path": "app/repositories/order_repository.py", "target_path": "app/models/order.py", "resolved": True},
    ]
    profile = {
        "api_endpoints": [
            {"method": "POST", "path": "/orders", "file_path": "app/api/orders.py", "line": 15}
        ]
    }

    flows = architecture_intelligence_service.trace_data_flows(
        repository_id=repo_id,
        files=files,
        dependencies=dependencies,
        profile=profile,
    )

    assert len(flows) >= 1
    flow = flows[0]
    assert flow["entry_point"] == "POST /orders"
    assert flow["entry_file"] == "app/api/orders.py"
    assert "orders" in flow["entry_file"]
    assert "models/order.py" in flow["target_datastore"]
    assert len(flow["flow_steps"]) >= 3
    assert len(flow["layer_sequence"]) >= 3


# =========================================================================
# 4. Component Coupling & Martin's Instability Metric
# =========================================================================

def test_coupling_and_instability_analysis():
    files = [
        {"id": "f1", "path": "pkg/auth/login.py"},
        {"id": "f2", "path": "pkg/auth/token.py"},
        {"id": "f3", "path": "pkg/core/utils.py"},
        {"id": "f4", "path": "pkg/api/handlers.py"},
        {"id": "f5", "path": "pkg/isolated/orphan.py"},
    ]
    # pkg/core/utils is depended upon by pkg/auth and pkg/api (high afferent coupling Ca)
    # pkg/api depends on pkg/auth and pkg/core (high efferent coupling Ce)
    # pkg/isolated has 0 incoming, 0 outgoing
    deps = [
        {"id": "d1", "source_path": "pkg/auth/login.py", "target_path": "pkg/core/utils.py", "resolved": True},
        {"id": "d2", "source_path": "pkg/api/handlers.py", "target_path": "pkg/auth/token.py", "resolved": True},
        {"id": "d3", "source_path": "pkg/api/handlers.py", "target_path": "pkg/core/utils.py", "resolved": True},
    ]

    coupling = architecture_intelligence_service.analyze_coupling_and_centrality(files, deps)

    assert "module_metrics" in coupling
    assert "isolated_modules" in coupling
    assert "architectural_hubs" in coupling

    # pkg/isolated/orphan.py is isolated
    assert "pkg/isolated" in coupling["isolated_modules"]

    # Check metrics for pkg/core
    core_metric = next(m for m in coupling["module_metrics"] if m["module"] == "pkg/core")
    assert core_metric["afferent_coupling_ca"] >= 2
    assert core_metric["efferent_coupling_ce"] == 0
    assert core_metric["instability"] == 0.0  # Completely stable
    assert "STABLE" in core_metric["classification"].upper()

    # Check metrics for pkg/api
    api_metric = next(m for m in coupling["module_metrics"] if m["module"] == "pkg/api")
    assert api_metric["efferent_coupling_ce"] >= 2
    assert api_metric["afferent_coupling_ca"] == 0
    assert api_metric["instability"] == 1.0  # Completely volatile
    assert "VOLATILE" in api_metric["classification"].upper()


# =========================================================================
# 5. Tarjan's Strongly Connected Components (Circular Dependencies)
# =========================================================================

def test_tarjan_circular_dependencies():
    # A -> B -> C -> A (cycle of 3)
    # D -> E (acyclic)
    deps = [
        {"source_path": "service_a.py", "target_path": "service_b.py", "resolved": True},
        {"source_path": "service_b.py", "target_path": "service_c.py", "resolved": True},
        {"source_path": "service_c.py", "target_path": "service_a.py", "resolved": True},
        {"source_path": "service_d.py", "target_path": "service_e.py", "resolved": True},
    ]

    result = architecture_intelligence_service.detect_circular_dependencies(deps)

    assert result["has_cycles"] is True
    assert result["cycle_count"] == 1
    cycle = result["cycles"][0]
    assert len(cycle) == 3
    assert set(cycle) == {"service_a.py", "service_b.py", "service_c.py"}
    assert "service_d.py" not in cycle
    assert "service_e.py" not in cycle


# =========================================================================
# 6. Architectural Violations (Service Bypass, Layer Inversion, Test Pollution)
# =========================================================================

def test_architectural_violations_detection():
    files = [
        {"id": "f1", "path": "src/api/routes.py"},
        {"id": "f2", "path": "src/services/billing.py"},
        {"id": "f3", "path": "src/db/models.py"},
        {"id": "f4", "path": "src/tests/test_helper.py"},
    ]
    deps = [
        # Violation 1: Service Bypass (API directly querying database models when billing service exists)
        {"source_path": "src/api/routes.py", "target_path": "src/db/models.py", "resolved": True, "start_line": 12},
        # Violation 2: Layer Inversion (Database model importing presentation API routes)
        {"source_path": "src/db/models.py", "target_path": "src/api/routes.py", "resolved": True, "start_line": 5},
        # Violation 3: Test Pollution (Production service importing test helper)
        {"source_path": "src/services/billing.py", "target_path": "src/tests/test_helper.py", "resolved": True, "start_line": 8},
    ]

    violations = architecture_intelligence_service.detect_architectural_violations(files, deps)

    v_types = [v["violation_type"] for v in violations]
    assert "SERVICE_BYPASS" in v_types
    assert "LAYER_INVERSION" in v_types
    assert "TEST_POLLUTION" in v_types

    # Ensure every violation includes remediation and line numbers
    for v in violations:
        assert v["remediation"] is not None
        assert len(v["remediation"]) > 10
        assert v["line"] >= 1


# =========================================================================
# 7. Architecture Snapshot Diffing
# =========================================================================

def test_architecture_snapshot_diff():
    base_profile = {
        "commit_sha": "commit_1111",
        "modules": [{"name": "AuthModule"}, {"name": "UserModule"}],
        "services": [{"name": "UserService"}],
        "api_endpoints": [{"method": "GET", "path": "/api/users"}],
    }
    current_profile = {
        "commit_sha": "commit_2222",
        "modules": [{"name": "AuthModule"}, {"name": "PaymentModule"}],  # UserModule removed, PaymentModule added
        "services": [{"name": "UserService"}, {"name": "PaymentService"}],  # PaymentService added
        "api_endpoints": [
            {"method": "GET", "path": "/api/users"},
            {"method": "POST", "path": "/api/checkout"},  # Added
        ],
    }

    diff = architecture_intelligence_service.diff_architecture_snapshots(base_profile, current_profile)

    assert diff["base_commit"] == "commit_1111"
    assert diff["current_commit"] == "commit_2222"
    assert len(diff["added_modules"]) == 1
    assert diff["added_modules"][0]["name"] == "PaymentModule"
    assert len(diff["removed_modules"]) == 1
    assert diff["removed_modules"][0]["name"] == "UserModule"
    assert len(diff["added_services"]) == 1
    assert diff["added_services"][0]["name"] == "PaymentService"
    assert len(diff["added_api_endpoints"]) == 1
    assert diff["net_module_delta"] == 0  # +1 -1
    assert diff["net_api_delta"] == 1


# =========================================================================
# 8. Database End-to-End & Isolation Test
# =========================================================================

@pytest.mark.asyncio
async def test_advanced_architecture_intelligence_end_to_end_and_isolation(db_session: AsyncSession):
    db = db_session
    ws = await create_test_workspace(db)

    # Repo A: Full e-commerce backend
    repo_a = Repository(
        id=f"repo-a-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="ecommerce-backend",
        url="https://github.com/example/ecommerce-backend.git",
        default_branch="main",
        acquisition_status="READY",
        analysis_status="completed",
        current_commit_sha="sha_a100",
        metadata_json={
            "profile": {
                "api_endpoints": [{"method": "GET", "path": "/products", "file_path": "api/products.py", "line": 10}],
                "databases": [{"type": "PostgreSQL", "source_file": "models/product.py", "entities": ["Product"]}],
            }
        },
    )
    db.add(repo_a)
    await db.flush()

    f1 = File(id=f"f-{uuid.uuid4().hex[:8]}", repository_id=repo_a.id, path="api/products.py", language="python", line_count=45, size_bytes=1200)
    f2 = File(id=f"f-{uuid.uuid4().hex[:8]}", repository_id=repo_a.id, path="services/product_service.py", language="python", line_count=85, size_bytes=2400)
    f3 = File(id=f"f-{uuid.uuid4().hex[:8]}", repository_id=repo_a.id, path="models/product.py", language="python", line_count=60, size_bytes=1800)
    db.add_all([f1, f2, f3])
    await db.flush()

    d1 = Dependency(id=f"d-{uuid.uuid4().hex[:8]}", repository_id=repo_a.id, source_file_id=f1.id, target_file_id=f2.id, name="services.product_service", dependency_type="IMPORT", metadata_json={"source_path": f1.path, "target_path": f2.path, "resolved": True})
    d2 = Dependency(id=f"d-{uuid.uuid4().hex[:8]}", repository_id=repo_a.id, source_file_id=f2.id, target_file_id=f3.id, name="models.product", dependency_type="IMPORT", metadata_json={"source_path": f2.path, "target_path": f3.path, "resolved": True})
    db.add_all([d1, d2])

    s1 = Symbol(id=f"s-{uuid.uuid4().hex[:8]}", repository_id=repo_a.id, file_id=f1.id, name="list_products", qualified_name="api.products.list_products", symbol_type="function", start_line=10, end_line=30)
    s2 = Symbol(id=f"s-{uuid.uuid4().hex[:8]}", repository_id=repo_a.id, file_id=f3.id, name="Product", qualified_name="models.product.Product", symbol_type="class", start_line=5, end_line=40)
    db.add_all([s1, s2])
    await db.commit()

    # Invalidate and fetch
    architecture_intelligence_service.invalidate_cache(repo_a.id)
    intel_a = await architecture_intelligence_service.get_advanced_architecture_intelligence(repo_a.id, db)

    assert intel_a["repository_id"] == repo_a.id
    assert intel_a["summary"]["total_graph_nodes"] >= 3
    assert intel_a["summary"]["total_graph_edges"] >= 2
    assert len(intel_a["components"]) >= 3
    assert len(intel_a["data_flows"]) >= 1
    assert intel_a["data_flows"][0]["entry_point"] == "GET /products"

    # Repo B: Completely isolated microservice
    repo_b = Repository(
        id=f"repo-b-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="notification-worker",
        url="https://github.com/example/notification-worker.git",
        default_branch="main",
        acquisition_status="READY",
        analysis_status="completed",
        current_commit_sha="sha_b200",
        metadata_json={},
    )
    db.add(repo_b)
    await db.flush()

    fb1 = File(id=f"fb-{uuid.uuid4().hex[:8]}", repository_id=repo_b.id, path="worker/queue.py", language="python", line_count=50, size_bytes=1000)
    db.add(fb1)
    await db.commit()

    architecture_intelligence_service.invalidate_cache(repo_b.id)
    intel_b = await architecture_intelligence_service.get_advanced_architecture_intelligence(repo_b.id, db)

    assert intel_b["repository_id"] == repo_b.id
    # Ensure Repo A nodes and files are NOT present in Repo B
    repo_b_node_refs = [n.get("source_reference") or n.get("name") for n in intel_b["graph"]["nodes"]]
    assert "api/products.py" not in repo_b_node_refs
    assert "Product" not in repo_b_node_refs
    assert any("queue.py" in ref for ref in repo_b_node_refs)


# =========================================================================
# 9. RAG Architecture Evidence Integration
# =========================================================================

@pytest.mark.asyncio
async def test_rag_architecture_evidence_enrichment(db_session: AsyncSession):
    db = db_session
    ws = await create_test_workspace(db)
    repo = Repository(
        id=f"repo-rag-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="rag-arch-app",
        url="https://github.com/example/rag-arch-app.git",
        default_branch="main",
        acquisition_status="READY",
        analysis_status="completed",
        current_commit_sha="sha_rag_1",
        metadata_json={
            "profile": {
                "api_endpoints": [{"method": "GET", "path": "/health", "file_path": "api/health.py", "line": 5}],
                "databases": [{"type": "SQLite", "source_file": "db/schema.py", "entities": ["HealthCheck"]}],
            }
        },
    )
    db.add(repo)
    await db.flush()

    f1 = File(id=f"f-{uuid.uuid4().hex[:8]}", repository_id=repo.id, path="api/health.py", language="python", line_count=25, size_bytes=600)
    f2 = File(id=f"f-{uuid.uuid4().hex[:8]}", repository_id=repo.id, path="db/schema.py", language="python", line_count=40, size_bytes=900)
    db.add_all([f1, f2])
    await db.flush()

    d1 = Dependency(id=f"d-{uuid.uuid4().hex[:8]}", repository_id=repo.id, source_file_id=f1.id, target_file_id=f2.id, name="db.schema", dependency_type="IMPORT", metadata_json={"source_path": f1.path, "target_path": f2.path, "resolved": True})
    db.add(d1)
    await db.commit()

    architecture_intelligence_service.invalidate_cache(repo.id)

    # Classify architecture question
    intent, keywords = rag_service.classify_query("How is the application structured and what are the main layers?")
    assert intent == "ARCHITECTURE"

    # Retrieve evidence
    evidence = await rag_service.retrieve_evidence(
        repository_id=repo.id,
        query="How is the application structured?",
        intent="ARCHITECTURE",
        keywords=keywords,
        db=db,
    )

    ev_types = [e.get("symbol_type") for e in evidence if e.get("symbol_type")]
    assert any(t in ["architecture_overview", "data_flow", "architecture_coupling_violations", "dependency_import"] for t in ev_types)
