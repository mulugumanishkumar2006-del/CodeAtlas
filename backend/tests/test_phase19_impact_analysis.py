import pytest
import uuid
import tempfile
from typing import Dict, Any, List, Tuple, Optional
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.workspace import Workspace
from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode, GraphRelationship
from backend.app.services.impact_analysis_service import impact_service
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


async def setup_test_architecture_repo(db: AsyncSession, tmp_path: Path) -> Tuple[Repository, Dict[str, Any]]:
    """
    Creates a multi-layer repository environment with real files, symbols,
    dependencies, APIs, tests, and architecture components.
    
    Structure:
    - backend/api/orders_controller.py (API Layer, exposes POST /api/v1/orders)
    - backend/services/order_service.py (Service Layer, calls OrderRepository)
    - backend/models/order.py (Domain Layer, defines Order entity)
    - backend/db/order_repository.py (Data Access Layer, queries DB)
    - backend/tests/test_orders.py (Test Layer, tests OrderService)
    - external dep: requests
    """
    ws = await create_test_workspace(db)
    repo_id = f"repo-{uuid.uuid4().hex[:8]}"

    # Write files to tmp_path for real disk inspection
    repo_dir = tmp_path / "orders_repo"
    repo_dir.mkdir(parents=True, exist_ok=True)

    file_contents = {
        "backend/db/order_repository.py": (
            "from backend.models.order import Order\n\n"
            "class OrderRepository:\n"
            "    def save_order(self, order: Order):\n"
            "        return order.id\n"
        ),
        "backend/models/order.py": (
            "class Order:\n"
            "    def __init__(self, order_id: str, amount: float):\n"
            "        self.id = order_id\n"
            "        self.amount = amount\n"
        ),
        "backend/services/order_service.py": (
            "import requests\n"
            "from backend.db.order_repository import OrderRepository\n"
            "from backend.models.order import Order\n\n"
            "class OrderService:\n"
            "    def __init__(self):\n"
            "        self.repo = OrderRepository()\n\n"
            "    def create_order(self, order_id: str, amount: float):\n"
            "        order = Order(order_id, amount)\n"
            "        return self.repo.save_order(order)\n"
        ),
        "backend/api/orders_controller.py": (
            "from backend.services.order_service import OrderService\n\n"
            "order_service = OrderService()\n\n"
            "def post_create_order(payload):\n"
            "    return order_service.create_order(payload['id'], payload['amount'])\n"
        ),
        "backend/tests/test_orders.py": (
            "from backend.services.order_service import OrderService\n\n"
            "def test_create_order():\n"
            "    service = OrderService()\n"
            "    res = service.create_order('ord-1', 99.9)\n"
            "    assert res == 'ord-1'\n"
        ),
    }

    for rel_path, content in file_contents.items():
        fp = repo_dir / rel_path
        fp.parent.mkdir(parents=True, exist_ok=True)
        fp.write_text(content, encoding="utf-8")

    # Create DB Repository
    repo = Repository(
        id=repo_id,
        workspace_id=ws.id,
        name="OrdersServiceRepo",
        url="https://github.com/example/orders",
        provider="local",
        default_branch="main",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="completed",
        metadata_json={
            "universal_profile": {
                "api_endpoints": [
                    {
                        "method": "POST",
                        "route": "/api/v1/orders",
                        "file_path": "backend/api/orders_controller.py",
                        "line": 5,
                        "framework": "FastAPI",
                        "handler": "post_create_order",
                    }
                ],
                "modules_and_services": [
                    {
                        "name": "OrderModule",
                        "path": "backend/services",
                        "entry_file": "backend/services/order_service.py",
                    }
                ]
            }
        }
    )
    db.add(repo)
    await db.flush()

    # Create DB Files
    db_files = {}
    for rel_path in file_contents:
        f = File(
            id=f"f-{uuid.uuid4().hex[:8]}",
            repository_id=repo_id,
            path=rel_path,
            language="python",
            line_count=20,
            size_bytes=len(file_contents[rel_path]),
        )
        db.add(f)
        await db.flush()
        db_files[rel_path] = f

    # Create DB Symbols
    db_symbols = {}
    sym_defs = [
        ("save_order", "method", "backend/db/order_repository.py", 4, 5, "OrderRepository.save_order"),
        ("OrderRepository", "class", "backend/db/order_repository.py", 3, 5, "OrderRepository"),
        ("Order", "class", "backend/models/order.py", 1, 5, "Order"),
        ("OrderService", "class", "backend/services/order_service.py", 5, 12, "OrderService"),
        ("create_order", "method", "backend/services/order_service.py", 9, 12, "OrderService.create_order"),
        ("post_create_order", "function", "backend/api/orders_controller.py", 5, 7, "post_create_order"),
        ("test_create_order", "function", "backend/tests/test_orders.py", 3, 7, "test_create_order"),
    ]
    for sname, stype, fpath, sl, el, qname in sym_defs:
        s = Symbol(
            id=f"s-{uuid.uuid4().hex[:8]}",
            repository_id=repo_id,
            file_id=db_files[fpath].id,
            name=sname,
            symbol_type=stype,
            qualified_name=qname,
            start_line=sl,
            end_line=el,
        )
        db.add(s)
        await db.flush()
        db_symbols[sname] = s

    # Create DB Dependencies
    dep_defs = [
        ("backend/db/order_repository.py", "backend/models/order.py", "Order", "IMPORT"),
        ("backend/services/order_service.py", "backend/db/order_repository.py", "OrderRepository", "IMPORT"),
        ("backend/services/order_service.py", "backend/models/order.py", "Order", "IMPORT"),
        ("backend/services/order_service.py", "requests", "requests", "EXTERNAL"),
        ("backend/api/orders_controller.py", "backend/services/order_service.py", "OrderService", "IMPORT"),
        ("backend/tests/test_orders.py", "backend/services/order_service.py", "OrderService", "IMPORT"),
    ]
    db_deps = []
    for src, tgt, iname, dtype in dep_defs:
        d = Dependency(
            id=f"d-{uuid.uuid4().hex[:8]}",
            repository_id=repo_id,
            source_file_id=db_files[src].id,
            target_file_id=db_files.get(tgt).id if tgt in db_files else None,
            name=iname,
            dependency_type=dtype,
            metadata_json={"source_path": src, "target_path": tgt, "import_name": iname, "start_line": 1, "end_line": 1},
        )
        db.add(d)
        await db.flush()
        db_deps.append(d)

    # Create GraphNodes for Component / Module
    comp_node = GraphNode(
        id=f"node-{uuid.uuid4().hex[:8]}",
        repository_id=repo_id,
        node_key=f"component:{repo_id}:orders",
        node_type="component",
        label="OrdersComponent",
        file_id=db_files["backend/services/order_service.py"].id,
        properties={"layer": "Service Layer", "component_type": "core_business"},
    )
    db.add(comp_node)

    mod_node = GraphNode(
        id=f"node-{uuid.uuid4().hex[:8]}",
        repository_id=repo_id,
        node_key=f"module:{repo_id}:backend_services",
        node_type="module",
        label="backend.services",
        properties={"module_path": "backend/services"},
    )
    db.add(mod_node)
    await db.commit()

    return repo, {
        "files": db_files,
        "symbols": db_symbols,
        "dependencies": db_deps,
        "component_node": comp_node,
        "module_node": mod_node,
    }


# =========================================================================
# 1. NORMALIZED TARGET RESOLUTION (ALL 9 TYPES)
# =========================================================================

@pytest.mark.asyncio
async def test_01_normalized_target_resolution_all_9_types(db_session: AsyncSession, tmp_path: Path):
    """
    Verifies that target resolution correctly resolves and normalizes all 9 target types:
    FILE, SYMBOL, CLASS, FUNCTION, METHOD, MODULE, API, DEPENDENCY, COMPONENT.
    """
    repo, context = await setup_test_architecture_repo(db_session, tmp_path)
    repo_id = repo.id

    # 1. FILE
    t_file = await impact_service.resolve_target(db_session, repo_id, "backend/services/order_service.py")
    assert t_file is not None
    assert t_file.target_type == "FILE"
    assert t_file.name == "backend/services/order_service.py"
    assert t_file.file_path == "backend/services/order_service.py"
    assert t_file.repository_id == repo_id
    assert t_file.target_id == context["files"]["backend/services/order_service.py"].id

    # 2. CLASS
    t_class = await impact_service.resolve_target(db_session, repo_id, "OrderService", target_type="CLASS")
    assert t_class is not None
    assert t_class.target_type == "CLASS"
    assert t_class.name == "OrderService"
    assert t_class.symbol_id == context["symbols"]["OrderService"].id
    assert t_class.file_path == "backend/services/order_service.py"

    # 3. METHOD
    t_method = await impact_service.resolve_target(db_session, repo_id, "save_order", target_type="METHOD")
    assert t_method is not None
    assert t_method.target_type == "METHOD"
    assert t_method.name == "save_order"
    assert t_method.file_path == "backend/db/order_repository.py"

    # 4. FUNCTION
    t_func = await impact_service.resolve_target(db_session, repo_id, "post_create_order", target_type="FUNCTION")
    assert t_func is not None
    assert t_func.target_type == "FUNCTION"
    assert t_func.name == "post_create_order"
    assert t_func.file_path == "backend/api/orders_controller.py"

    # 5. SYMBOL (Generic)
    t_sym = await impact_service.resolve_target(db_session, repo_id, "Order")
    assert t_sym is not None
    assert t_sym.target_type in ["CLASS", "SYMBOL"]
    assert t_sym.name == "Order"

    # 6. MODULE
    t_mod = await impact_service.resolve_target(db_session, repo_id, "backend/services", target_type="MODULE")
    assert t_mod is not None
    assert t_mod.target_type == "MODULE"
    assert t_mod.repository_id == repo_id

    # 7. API
    t_api = await impact_service.resolve_target(db_session, repo_id, "POST /api/v1/orders", target_type="API")
    assert t_api is not None
    assert t_api.target_type == "API"
    assert "POST /api/v1/orders" in t_api.name
    assert t_api.file_path == "backend/api/orders_controller.py"

    # 8. DEPENDENCY
    t_dep = await impact_service.resolve_target(db_session, repo_id, "requests", target_type="DEPENDENCY")
    assert t_dep is not None
    assert t_dep.target_type == "DEPENDENCY"
    assert t_dep.name == "requests"

    # 9. COMPONENT
    t_comp = await impact_service.resolve_target(db_session, repo_id, "OrdersComponent", target_type="COMPONENT")
    assert t_comp is not None
    assert t_comp.target_type == "COMPONENT"
    assert t_comp.name == "OrdersComponent"


# =========================================================================
# 2. REPOSITORY ISOLATION
# =========================================================================

@pytest.mark.asyncio
async def test_02_strict_repository_isolation(db_session: AsyncSession, tmp_path: Path):
    """
    Ensures that impact target resolution and analysis for Repository A NEVER
    leaks or accepts entities belonging to Repository B.
    """
    repo_a, _ = await setup_test_architecture_repo(db_session, tmp_path)
    
    # Create isolated repo B
    ws = await create_test_workspace(db_session)
    repo_b = Repository(
        id=f"repo-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="IsolatedRepoB",
        url="https://github.com/example/b",
        provider="local",
        default_branch="main",
        analysis_status="completed",
    )
    db_session.add(repo_b)
    await db_session.commit()

    # Querying OrderService under repo_b must return None or raise ValueError
    res_b = await impact_service.resolve_target(db_session, repo_b.id, "OrderService")
    assert res_b is None

    with pytest.raises(ValueError) as exc:
        await impact_service.analyze_impact(db_session, repo_b.id, "OrderService")
    assert "not found in repository" in str(exc.value)


# =========================================================================
# 3. 12 IMPACT DIMENSIONS VERIFICATION
# =========================================================================

@pytest.mark.asyncio
async def test_03_12_impact_dimensions_order_service(db_session: AsyncSession, tmp_path: Path):
    """
    Tests all 12 impact dimensions when modifying OrderService:
    1. Direct Dependents (orders_controller.py, test_orders.py)
    2. Indirect Dependents
    3. Callers (post_create_order, test_create_order)
    4. Callees (OrderRepository, Order)
    5. Affected Files
    6. Affected Modules
    7. Affected APIs (POST /api/v1/orders)
    8. Affected Tests (backend/tests/test_orders.py)
    9. Affected Dependencies (requests, OrderRepository, Order)
    10. Architecture Boundaries Crossed (Service Layer -> API Layer, Test Layer)
    11. Evidence Tracing with line coordinates
    12. Uncertainty Analysis
    """
    repo, _ = await setup_test_architecture_repo(db_session, tmp_path)
    
    impact_data = await impact_service.analyze_impact(
        db=db_session,
        repository_id=repo.id,
        target_id="OrderService",
        target_type="CLASS",
        direction="both",
        max_depth=3,
    )

    # 1. Target Validation
    assert impact_data.target.name == "OrderService"
    assert impact_data.target.target_type == "CLASS"
    assert impact_data.target.file_path == "backend/services/order_service.py"

    # 2. Dimension 1: Direct Dependents
    direct_dep_labels = [d.label for d in impact_data.direct_dependents]
    assert any("orders_controller.py" in l for l in direct_dep_labels)
    assert any("test_orders.py" in l for l in direct_dep_labels)

    # 3. Dimension 3: Callers
    caller_names = [c.name for c in impact_data.callers]
    caller_files = [c.file_path for c in impact_data.callers]
    assert any("orders_controller.py" in f for f in caller_files)
    assert any("test_orders.py" in f for f in caller_files)

    # 4. Dimension 4: Callees
    callee_names = [c.name for c in impact_data.callees]
    assert len(callee_names) > 0  # OrderRepository or save_order or Order

    # 5. Dimension 5: Affected Files
    assert "backend/services/order_service.py" in impact_data.affected_files
    assert "backend/api/orders_controller.py" in impact_data.affected_files
    assert "backend/tests/test_orders.py" in impact_data.affected_files

    # 6. Dimension 6: Affected Modules
    assert any("api" in m for m in impact_data.affected_modules)
    assert any("services" in m for m in impact_data.affected_modules)

    # 7. Dimension 7: Affected APIs
    assert len(impact_data.affected_apis) >= 1
    api_paths = [a.path for a in impact_data.affected_apis]
    assert "/api/v1/orders" in api_paths
    assert impact_data.affected_apis[0].method == "POST"

    # 8. Dimension 8: Affected Tests
    assert len(impact_data.affected_tests) >= 1
    test_files = [t.test_file for t in impact_data.affected_tests]
    assert any("test_orders.py" in tf for tf in test_files)

    # 9. Dimension 9: Affected Dependencies
    assert len(impact_data.affected_dependencies) >= 1

    # 10. Dimension 10: Architecture Boundaries Crossed
    assert len(impact_data.boundaries_crossed) >= 1
    boundary_layers = [(b.source_layer, b.target_layer) for b in impact_data.boundaries_crossed]
    # Check that layer transitions are recorded
    assert any(b[0] != b[1] for b in boundary_layers)

    # 11. Dimension 11: Evidence Tracing
    assert len(impact_data.evidence) >= 2
    for ev in impact_data.evidence:
        assert ev.source
        assert ev.target
        assert ev.relationship in ["IMPORTS", "CALLS", "DEPENDS_ON", "TESTS", "EXTERNAL", "IMPORT"]
        assert ev.confidence in ["HIGH", "MEDIUM", "LOW"]

    # 12. Dimension 12: Uncertainty Analysis
    assert isinstance(impact_data.uncertainty, list)

    # Narrative explanation generated
    assert impact_data.explanation is not None
    assert "Impact Analysis" in impact_data.explanation
    assert "OrderService" in impact_data.explanation
    assert "Blast Radius" in impact_data.explanation


# =========================================================================
# 4. DEEP DOWNSTREAM PROPAGATION (ORDER REPOSITORY -> API)
# =========================================================================

@pytest.mark.asyncio
async def test_04_deep_downstream_propagation_from_repository(db_session: AsyncSession, tmp_path: Path):
    """
    Changing backend/db/order_repository.py propagates through:
    order_repository.py -> order_service.py -> orders_controller.py (POST /api/v1/orders)
    """
    repo, _ = await setup_test_architecture_repo(db_session, tmp_path)

    impact_data = await impact_service.analyze_impact(
        db=db_session,
        repository_id=repo.id,
        target_id="backend/db/order_repository.py",
        direction="downstream",
        max_depth=4,
    )

    assert impact_data.impact.affected_files >= 3
    assert impact_data.impact.max_depth >= 2

    # Verify that the exposed API endpoint is detected as affected
    assert len(impact_data.affected_apis) >= 1
    assert impact_data.affected_apis[0].path == "/api/v1/orders"

    # Verify that test suite is detected as affected
    assert len(impact_data.affected_tests) >= 1


# =========================================================================
# 5. UNCERTAINTY DETECTION (WILDCARD IMPORTS & UNTESTED TARGETS)
# =========================================================================

@pytest.mark.asyncio
async def test_05_uncertainty_detection(db_session: AsyncSession, tmp_path: Path):
    """
    Verifies that uncertainty analysis flags:
    1. Targets with 0 automated tests (UNTESTED).
    2. Dynamic features like wildcard imports or dynamic getattr.
    """
    ws = await create_test_workspace(db_session)
    repo_id = f"repo-{uuid.uuid4().hex[:8]}"

    repo_dir = tmp_path / "uncertainty_repo"
    repo_dir.mkdir(parents=True, exist_ok=True)

    untested_file = repo_dir / "untested_dynamic.py"
    untested_file.write_text(
        "from os import *\n\n"
        "def dynamic_runner(obj, attr_name):\n"
        "    return getattr(obj, attr_name)()\n",
        encoding="utf-8"
    )

    repo = Repository(
        id=repo_id,
        workspace_id=ws.id,
        name="UncertaintyRepo",
        url="https://github.com/example/uncertainty",
        provider="local",
        default_branch="main",
        clone_path=str(repo_dir),
        analysis_status="completed",
    )
    db_session.add(repo)
    await db_session.flush()

    f = File(
        id=f"f-{uuid.uuid4().hex[:8]}",
        repository_id=repo_id,
        path="untested_dynamic.py",
        language="python",
        line_count=5,
    )
    db_session.add(f)
    await db_session.flush()

    s = Symbol(
        id=f"s-{uuid.uuid4().hex[:8]}",
        repository_id=repo_id,
        file_id=f.id,
        name="dynamic_runner",
        symbol_type="function",
        qualified_name="dynamic_runner",
        start_line=3,
        end_line=4,
    )
    db_session.add(s)
    await db_session.commit()

    impact_data = await impact_service.analyze_impact(
        db=db_session,
        repository_id=repo_id,
        target_id="dynamic_runner",
    )

    categories = [u.category for u in impact_data.uncertainty]
    # Should flag UNTESTED (no tests in repo)
    assert "UNTESTED" in categories
    # Should flag WILDCARD_IMPORT or DYNAMIC_DISPATCH
    assert "WILDCARD_IMPORT" in categories or "DYNAMIC_DISPATCH" in categories


# =========================================================================
# 6. REST API ENDPOINTS
# =========================================================================

@pytest.mark.asyncio
async def test_06_impact_api_endpoints(client: AsyncClient, db_session: AsyncSession, tmp_path: Path):
    """
    Tests the 3 REST endpoints:
    1. GET /api/v1/repositories/{id}/impact/{target_id}
    2. POST /api/v1/repositories/{id}/impact/resolve
    3. POST /api/v1/repositories/{id}/impact/explain
    """
    repo, _ = await setup_test_architecture_repo(db_session, tmp_path)

    # 1. Resolve Endpoint
    res_resolve = await client.post(
        f"/api/v1/repositories/{repo.id}/impact/resolve",
        json={"target": "OrderService", "target_type": "CLASS"},
    )
    assert res_resolve.status_code == 200
    resolved = res_resolve.json()
    assert resolved["name"] == "OrderService"
    assert resolved["target_type"] == "CLASS"
    assert resolved["file_path"] == "backend/services/order_service.py"

    # 2. Main Impact Analysis Endpoint
    res_impact = await client.get(
        f"/api/v1/repositories/{repo.id}/impact/OrderService?target_type=CLASS&direction=both&max_depth=3"
    )
    assert res_impact.status_code == 200
    impact_json = res_impact.json()
    assert impact_json["target"]["name"] == "OrderService"
    assert len(impact_json["affected_files"]) >= 2
    assert len(impact_json["callers"]) >= 1
    assert "explanation" in impact_json

    # 3. Explain Endpoint
    res_explain = await client.post(
        f"/api/v1/repositories/{repo.id}/impact/explain",
        json={"target_id": "OrderService", "target_type": "CLASS", "direction": "both", "max_depth": 3},
    )
    assert res_explain.status_code == 200
    explain_json = res_explain.json()
    assert explain_json["explanation"] is not None
    assert "Impact Analysis" in explain_json["explanation"]


# =========================================================================
# 7. RAG AI Q&A INTEGRATION
# =========================================================================

@pytest.mark.asyncio
async def test_07_rag_impact_query_integration(db_session: AsyncSession, tmp_path: Path):
    """
    Verifies that asking an impact question via RAG retrieves Phase 19 impact intelligence.
    """
    repo, _ = await setup_test_architecture_repo(db_session, tmp_path)

    query = "What will break if I change OrderService?"
    context_sources = await rag_service.retrieve_evidence(
        repository_id=repo.id,
        query=query,
        intent="IMPACT",
        keywords=["OrderService", "break", "impact"],
        db=db_session,
    )

    # Verify that an impact evidence card was generated
    impact_cards = [c for c in context_sources if "IMPACT ANALYSIS" in (c.get("content") or "")]
    assert len(impact_cards) >= 1
    content = impact_cards[0]["content"]
    assert "OrderService" in content
    assert "Risk Level" in content
    assert "Blast Radius" in content
