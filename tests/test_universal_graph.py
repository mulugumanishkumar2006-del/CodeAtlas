import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from app.api.v1.auth import get_current_user
from app.core.database import SessionLocal
from app.models.user import User
from app.models.repository import Repository
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.graph_enums import GraphNodeType, GraphRelationshipType


@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    try:
        # Create a mock user if they don't exist
        user = db.query(User).filter(User.id == "12345").first()
        if not user:
            user = User(
                id="12345",
                username="graph_tester",
                name="Graph Tester",
                email="tester@example.com",
            )
            db.add(user)
            db.commit()

        # Create a mock repository
        repo_id = "test_graph_repo"
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if repo:
            db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).delete()
            db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
            db.delete(repo)
            db.commit()

        repo = Repository(
            id=repo_id,
            name="test-graph-repo",
            full_name="tester/test-graph-repo",
            clone_url="https://github.com/tester/test-graph-repo.git",
            status="cloned",
            user_id="12345",
        )
        db.add(repo)
        db.commit()

        yield db

        # Cleanup
        db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).delete()
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


def test_create_and_fetch_graph(client):
    repo_id = "test_graph_repo"

    # 1. Create a node for each of the 12 Node Types
    for i, node_type in enumerate(GraphNodeType):
        node_id = f"node_{node_type.name.lower()}"
        payload = {
            "id": node_id,
            "type": node_type.value,
            "name": f"Test {node_type.value} Node",
            "properties": {"index": i, "meta": "test-val"}
        }
        res = client.post(f"/api/v1/repositories/{repo_id}/graph/nodes", json=payload)
        assert res.status_code == 201
        data = res.json()
        assert data["id"] == node_id
        assert data["type"] == node_type.value
        assert data["properties"]["index"] == i

    # 2. Try creating a duplicate node to verify error handling
    res = client.post(
        f"/api/v1/repositories/{repo_id}/graph/nodes",
        json={
            "id": f"node_{GraphNodeType.REPOSITORY.name.lower()}",
            "type": GraphNodeType.REPOSITORY.value,
            "name": "Duplicate Node",
        }
    )
    assert res.status_code == 400

    # 3. Create relationships of all 10 types linking nodes sequentially
    node_types_list = list(GraphNodeType)
    for i, rel_type in enumerate(GraphRelationshipType):
        source_idx = i % len(node_types_list)
        target_idx = (i + 1) % len(node_types_list)
        source_id = f"node_{node_types_list[source_idx].name.lower()}"
        target_id = f"node_{node_types_list[target_idx].name.lower()}"

        rel_id = f"rel_{rel_type.name.lower()}"
        payload = {
            "id": rel_id,
            "source_id": source_id,
            "target_id": target_id,
            "type": rel_type.value,
            "properties": {"weight": 1.5}
        }
        res = client.post(f"/api/v1/repositories/{repo_id}/graph/relationships", json=payload)
        assert res.status_code == 201
        data = res.json()
        assert data["id"] == rel_id
        assert data["source_id"] == source_id
        assert data["target_id"] == target_id
        assert data["type"] == rel_type.value

    # 4. Try creating a relationship with invalid nodes to verify validation
    res = client.post(
        f"/api/v1/repositories/{repo_id}/graph/relationships",
        json={
            "id": "rel_invalid",
            "source_id": "nonexistent_source",
            "target_id": "nonexistent_target",
            "type": GraphRelationshipType.DEPENDS_ON.value,
        }
    )
    assert res.status_code == 400

    # 5. Retrieve the whole graph and check node count and relationship kinds
    res = client.get(f"/api/v1/repositories/{repo_id}/graph")
    assert res.status_code == 200
    graph_data = res.json()
    assert len(graph_data["nodes"]) == len(GraphNodeType)
    assert len(graph_data["relationships"]) == len(GraphRelationshipType)

    # Validate node types and relationship types list match
    retrieved_node_types = {n["type"] for n in graph_data["nodes"]}
    expected_node_types = {nt.value for nt in GraphNodeType}
    assert retrieved_node_types == expected_node_types

    retrieved_rel_types = {r["type"] for r in graph_data["relationships"]}
    expected_rel_types = {rt.value for rt in GraphRelationshipType}
    assert retrieved_rel_types == expected_rel_types


def test_import_and_call_graph(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    # 1. Setup mock repository files on disk simulating import and call flow
    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)
    os.makedirs(cloned_dir, exist_ok=True)

    auth_py_content = """\
import jwt

def save_session():
    pass

def generate_token():
    save_session()

def authenticate():
    generate_token()

def login():
    authenticate()
"""
    with open(os.path.join(cloned_dir, "auth.py"), "w", encoding="utf-8") as f:
        f.write(auth_py_content)

    # 2. Force ParseService to run and populate db graph tables
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # 3. Retrieve graph from GET API
    res = client.get(f"/api/v1/repositories/{repo_id}/graph")
    assert res.status_code == 200
    graph_data = res.json()

    # Verify import node and edge exists
    import_edges = [r for r in graph_data["relationships"] if r["type"] == "IMPORTS"]
    assert len(import_edges) > 0
    # One of the import edges should target the module 'jwt'
    jwt_import = [r for r in import_edges if "jwt" in r["target_id"]]
    assert len(jwt_import) > 0

    # Verify function call edges exist and trace context
    call_edges = [r for r in graph_data["relationships"] if r["type"] == "CALLS"]
    assert len(call_edges) > 0

    # Verify specific calling dependencies
    # login() -> authenticate() -> generate_token() -> save_session()
    login_calls_auth = [r for r in call_edges if "login" in r["source_id"] and "authenticate" in r["target_id"]]
    assert len(login_calls_auth) > 0

    auth_calls_token = [r for r in call_edges if "authenticate" in r["source_id"] and "generate_token" in r["target_id"]]
    assert len(auth_calls_token) > 0

    token_calls_save = [r for r in call_edges if "generate_token" in r["source_id"] and "save_session" in r["target_id"]]
    assert len(token_calls_save) > 0


def test_graph_analysis_suite(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    # 1. Setup mock repository files on disk creating cycles, coupling and call context
    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)
    os.makedirs(os.path.join(cloned_dir, "app"), exist_ok=True)

    # File A: imports B, defines function_A calling function_B
    file_a_content = """\
from app.file_b import function_B

def function_A():
    function_B()
"""
    with open(os.path.join(cloned_dir, "app", "file_a.py"), "w", encoding="utf-8") as f:
        f.write(file_a_content)

    # File B: imports C, defines function_B calling function_C
    file_b_content = """\
from app.file_c import function_C

def function_B():
    function_C()
"""
    with open(os.path.join(cloned_dir, "app", "file_b.py"), "w", encoding="utf-8") as f:
        f.write(file_b_content)

    # File C: imports A, defines function_C calling function_A (Circular Dependency Loop!)
    file_c_content = """\
from app.file_a import function_A

def function_C():
    function_A()
"""
    with open(os.path.join(cloned_dir, "app", "file_c.py"), "w", encoding="utf-8") as f:
        f.write(file_c_content)

    # 2. Parse repository
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # 3. Verify Circular Dependency Detection (Feature 6)
    res = client.get(f"/api/v1/repositories/{repo_id}/analysis/circular")
    assert res.status_code == 200
    circular_data = res.json()
    assert circular_data["total_cycles"] > 0
    # The cycle list should contain a report tracing our cycle loop
    cycle_found = False
    for c in circular_data["cycles"]:
        if "function_A" in c["description"] and "function_B" in c["description"]:
            cycle_found = True
            assert len(c["suggested_fixes"]) > 0
            assert "function_A" in c["affected_modules"] or "function_B" in c["affected_modules"]
    assert cycle_found

    # 4. Verify Coupling Analysis (Feature 7)
    res = client.get(f"/api/v1/repositories/{repo_id}/analysis/coupling")
    assert res.status_code == 200
    coupling_data = res.json()
    assert len(coupling_data["metrics"]) > 0
    # Checks that Fan-in / Fan-out values are calculated
    node_metrics = {m["name"]: m for m in coupling_data["metrics"]}
    assert "function_A" in node_metrics
    assert node_metrics["function_A"]["fan_in"] > 0
    assert node_metrics["function_A"]["fan_out"] > 0
    # Instability score check (value between 0.0 and 1.0)
    assert 0.0 <= node_metrics["function_A"]["coupling_score"] <= 1.0

    # 5. Verify Impact Analysis Engine (Feature 8)
    # If we delete function_C, check that it affects function_B and function_A due to cycle / dependency flow
    payload = {"symbol_name": "function_C"}
    res = client.post(f"/api/v1/repositories/{repo_id}/analysis/impact", json=payload)
    assert res.status_code == 200
    impact_data = res.json()
    assert impact_data["total_affected_nodes"] > 0
    affected_names = {detail["name"] for detail in impact_data["affected_details"]}
    # Deleting function_C affects function_B because function_B calls function_C
    assert "function_B" in affected_names
    # Risk should be computed
    assert impact_data["risk"] in ("LOW", "MEDIUM", "HIGH")


def test_inheritance_and_module_dependency_graph(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    # 1. Setup mock repository with API Service DB files containing class inheritance
    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)

    # Create layer directory structures
    os.makedirs(os.path.join(cloned_dir, "app", "api"), exist_ok=True)
    os.makedirs(os.path.join(cloned_dir, "app", "services"), exist_ok=True)
    os.makedirs(os.path.join(cloned_dir, "app", "db"), exist_ok=True)

    # API Layer: calls services
    api_content = """\
from app.services.auth import AdminService

def handle_login():
    AdminService().execute_login()
"""
    with open(os.path.join(cloned_dir, "app", "api", "auth.py"), "w", encoding="utf-8") as f:
        f.write(api_content)

    # Service Layer: class Admin inheriting from User, calls database
    service_content = """\
from app.db.connection import DatabaseConnection

class User:
    def __init__(self, name):
        self.name = name

class Admin(User):
    def execute_login(self):
        DatabaseConnection().query_data()
"""
    with open(os.path.join(cloned_dir, "app", "services", "auth.py"), "w", encoding="utf-8") as f:
        f.write(service_content)

    # Database Layer
    db_content = """\
class DatabaseConnection:
    def query_data(self):
        pass
"""
    with open(os.path.join(cloned_dir, "app", "db", "connection.py"), "w", encoding="utf-8") as f:
        f.write(db_content)

    # 2. Parse mock repository and update DB tables
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # 3. Retrieve graph from GET API
    res = client.get(f"/api/v1/repositories/{repo_id}/graph")
    assert res.status_code == 200
    graph_data = res.json()

    # 4. Assert Inheritance Edge exists
    # Admin inherits from User
    inherits_edges = [r for r in graph_data["relationships"] if r["type"] == "INHERITS"]
    assert len(inherits_edges) > 0
    admin_extends_user = [r for r in inherits_edges if "Admin" in r["source_id"] and "User" in r["target_id"]]
    assert len(admin_extends_user) > 0

    # 5. Assert Folders exist as nodes
    folder_nodes = [n for n in graph_data["nodes"] if n["type"] == "Folder"]
    assert len(folder_nodes) > 0
    folder_names = {f["name"] for f in folder_nodes}
    assert "api" in folder_names
    assert "services" in folder_names
    assert "db" in folder_names

    # 6. Assert Module Dependency layers exist and have COMM edges
    module_nodes = [n for n in graph_data["nodes"] if n["type"] == "Module"]
    assert len(module_nodes) > 0
    module_names = {m["name"] for m in module_nodes}
    assert "API" in module_names
    assert "Service" in module_names
    assert "Database" in module_names

    # Assert API depends on Service (api/auth.py calls services/auth.py)
    depends_edges = [r for r in graph_data["relationships"] if r["type"] == "DEPENDS_ON"]
    api_depends_service = [r for r in depends_edges if "layer::API" in r["source_id"] and "layer::Service" in r["target_id"]]
    assert len(api_depends_service) > 0

    # Assert Service depends on Database (services/auth.py calls db/connection.py)
    service_depends_db = [r for r in depends_edges if "layer::Service" in r["source_id"] and "layer::Database" in r["target_id"]]
    assert len(service_depends_db) > 0


def test_dependency_query_engine(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    # 1. Setup mock repository files on disk with queries context
    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)
    os.makedirs(os.path.join(cloned_dir, "app"), exist_ok=True)

    # file_x: imports file_y
    file_x_content = """\
import app.file_y

def run_process():
    app.file_y.start_service()
"""
    with open(os.path.join(cloned_dir, "app", "file_x.py"), "w", encoding="utf-8") as f:
        f.write(file_x_content)

    # file_y: has start_service function
    file_y_content = """\
def start_service():
    pass
"""
    with open(os.path.join(cloned_dir, "app", "file_y.py"), "w", encoding="utf-8") as f:
        f.write(file_y_content)

    # file_z: orphan file (no imports or calls!)
    file_z_content = """\
# Orphan module
def orphan_function():
    pass
"""
    with open(os.path.join(cloned_dir, "app", "file_z.py"), "w", encoding="utf-8") as f:
        f.write(file_z_content)

    # 2. Parse repository
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # 3. Retrieve graph to get specific node IDs
    res = client.get(f"/api/v1/repositories/{repo_id}/graph")
    assert res.status_code == 200
    graph_data = res.json()
    
    file_x_node = [n for n in graph_data["nodes"] if "file_x.py" in n["id"]][0]
    file_y_node = [n for n in graph_data["nodes"] if "file_y.py" in n["id"]][0]
    file_z_node = [n for n in graph_data["nodes"] if "file_z.py" in n["id"]][0]

    # Query 1: Direct Dependencies of file_x.py
    res = client.get(f"/api/v1/repositories/{repo_id}/query/dependencies?node_id={file_x_node['id']}")
    assert res.status_code == 200
    dep_data = res.json()
    # file_x.py depends on file_y
    dep_targets = {d["target"]["id"] for d in dep_data["dependencies"]}
    assert "module::app.file_y" in dep_targets

    # Query 2: Callers of start_service
    res = client.get(f"/api/v1/repositories/{repo_id}/query/callers?symbol_name=start_service")
    assert res.status_code == 200
    callers_data = res.json()
    assert len(callers_data["callers"]) > 0
    # run_process should be a caller of start_service
    caller_names = {c["caller"]["name"] for c in callers_data["callers"]}
    assert "run_process" in caller_names

    # Query 3: Import Tree starting from file_x.py
    res = client.get(f"/api/v1/repositories/{repo_id}/query/imports?node_id={file_x_node['id']}")
    assert res.status_code == 200
    imports_data = res.json()
    imports_targets = {e["target_id"] for e in imports_data["edges"]}
    assert "module::app.file_y" in imports_targets

    # Query 4: Downstream Impact starting from file_x.py
    res = client.get(f"/api/v1/repositories/{repo_id}/query/downstream?node_id={file_x_node['id']}")
    assert res.status_code == 200
    downstream_data = res.json()
    downstream_nodes = {n["id"] for n in downstream_data["nodes"]}
    assert "module::app.file_y" in downstream_nodes

    # Query 5: Find Orphan Modules
    res = client.get(f"/api/v1/repositories/{repo_id}/query/orphans")
    assert res.status_code == 200
    orphans_data = res.json()
    orphan_ids = {o["id"] for o in orphans_data["orphans"]}
    assert file_z_node["id"] in orphan_ids


def test_neo4j_and_knowledge_graph_builder(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings
    from app.core.neo4j_client import neo4j_client

    # 1. Setup mock repository files on disk matching services, tables, routers, libs, envs
    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)
    os.makedirs(os.path.join(cloned_dir, "app"), exist_ok=True)

    # API Endpoint node check: router/endpoint context
    api_content = """\
def execute_endpoint():
    pass
"""
    with open(os.path.join(cloned_dir, "app", "api_router.py"), "w", encoding="utf-8") as f:
        f.write(api_content)

    # Service layer node check: service/Service context
    service_content = """\
def run_auth_service():
    pass
"""
    with open(os.path.join(cloned_dir, "app", "auth_service.py"), "w", encoding="utf-8") as f:
        f.write(service_content)

    # Database Table class check
    db_content = """\
class UserDBModel:
    pass
"""
    with open(os.path.join(cloned_dir, "app", "db_model.py"), "w", encoding="utf-8") as f:
        f.write(db_content)

    # requirements.txt mapping External Library entities
    with open(os.path.join(cloned_dir, "requirements.txt"), "w", encoding="utf-8") as f:
        f.write("fastapi>=0.110.0\npytest>=9.1.1\n")

    # .env mapping Environment Variables
    with open(os.path.join(cloned_dir, ".env"), "w", encoding="utf-8") as f:
        f.write("API_KEY=secret_key_123\n")

    # 2. Parse repository
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # 3. Query Neo4j to verify nodes and relationships exist
    session = neo4j_client.get_session()
    assert session is not None
    try:
        # Check Repository node
        res_repo = session.run("MATCH (r:Repository {id: $repo_id}) RETURN r", repo_id=repo_id)
        assert res_repo.single() is not None

        # Check Service node
        res_srv = session.run("MATCH (s:Service {repository_id: $repo_id}) RETURN s", repo_id=repo_id)
        records_srv = list(res_srv)
        assert len(records_srv) > 0

        # Check API Endpoint node
        res_api = session.run("MATCH (a:API_Endpoint {repository_id: $repo_id}) RETURN a", repo_id=repo_id)
        records_api = list(res_api)
        assert len(records_api) > 0

        # Check Database Table node
        res_tbl = session.run("MATCH (d:Database_Table {repository_id: $repo_id}) RETURN d", repo_id=repo_id)
        records_tbl = list(res_tbl)
        assert len(records_tbl) > 0

        # Check External Library node
        res_lib = session.run("MATCH (l:External_Library {id: 'lib::fastapi'}) RETURN l")
        assert res_lib.single() is not None

        # Check Environment Variable node
        res_env = session.run("MATCH (e:Environment_Variable {name: 'API_KEY', repository_id: $repo_id}) RETURN e", repo_id=repo_id)
        assert res_env.single() is not None

        # Check semantic connections HAS_MODULE
        res_has_mod = session.run("MATCH (r:Repository {id: $repo_id})-[h:HAS_MODULE]->() RETURN h", repo_id=repo_id)
        assert len(list(res_has_mod)) > 0

    finally:
        session.close()
