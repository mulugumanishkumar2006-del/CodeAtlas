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

    # 5. Assert Folders exist as nodes (Domain in ontology)
    folder_nodes = [n for n in graph_data["nodes"] if n["type"] == "Domain"]
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
    api_depends_service = [r for r in depends_edges if "layer::" in r["source_id"] and "API" in r["source_id"] and "layer::" in r["target_id"] and "Service" in r["target_id"]]
    assert len(api_depends_service) > 0

    # Assert Service depends on Database (services/auth.py calls db/connection.py)
    service_depends_db = [r for r in depends_edges if "layer::" in r["source_id"] and "Service" in r["source_id"] and "layer::" in r["target_id"] and "Database" in r["target_id"]]
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
    assert f"module::{repo_id}::app.file_y" in dep_targets

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
    assert f"module::{repo_id}::app.file_y" in imports_targets

    # Query 4: Downstream Impact starting from file_x.py
    res = client.get(f"/api/v1/repositories/{repo_id}/query/downstream?node_id={file_x_node['id']}")
    assert res.status_code == 200
    downstream_data = res.json()
    downstream_nodes = {n["id"] for n in downstream_data["nodes"]}
    assert f"module::{repo_id}::app.file_y" in downstream_nodes

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


def test_semantic_relationships_and_search(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)
    os.makedirs(cloned_dir, exist_ok=True)

    dummy_code = """\
import os
from celery import shared_task

@shared_task
def celery_test_task():
    pass

class MyTestClass:
    def my_test_method(self):
        celery_test_task.delay()
"""

    with open(os.path.join(cloned_dir, "test_file.py"), "w", encoding="utf-8") as f:
        f.write(dummy_code)

    # Parse repo
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # Search for all relationships in the repository
    res = client.get(f"/api/v1/repositories/{repo_id}/relationships/search")
    assert res.status_code == 200
    rels = res.json()
    assert len(rels) > 0

    # Verify OWNS relationship exists: File owns class or Class owns method
    owns_rels = [r for r in rels if r["type"] == "OWNS"]
    assert len(owns_rels) > 0
    # One of them should be class owning my_test_method
    method_owns = [r for r in owns_rels if "my_test_method" in r["target"]["name"]]
    assert len(method_owns) > 0

    # Verify BELONGS_TO relationship exists: Method belongs to Class
    belongs_rels = [r for r in rels if r["type"] == "BELONGS_TO"]
    assert len(belongs_rels) > 0
    method_belongs = [r for r in belongs_rels if "my_test_method" in r["source"]["name"]]
    assert len(method_belongs) > 0

    # Search with query filters
    res_query = client.get(f"/api/v1/repositories/{repo_id}/relationships/search?query=my_test_method")
    assert res_query.status_code == 200
    query_rels = res_query.json()
    assert len(query_rels) > 0
    assert all("my_test_method" in r["source"]["name"] or "my_test_method" in r["target"]["name"] for r in query_rels)

    # Search with relationship type filter
    res_type = client.get(f"/api/v1/repositories/{repo_id}/relationships/search?type=OWNS")
    assert res_type.status_code == 200
    type_rels = res_type.json()
    assert len(type_rels) > 0
    assert all(r["type"] == "OWNS" for r in type_rels)


def test_repository_ontology_and_entity_recognition(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)
    
    # Create directory tree
    os.makedirs(os.path.join(cloned_dir, "app"), exist_ok=True)
    os.makedirs(os.path.join(cloned_dir, ".github", "workflows"), exist_ok=True)

    # 1. Create docker-compose.yml
    docker_content = """\
version: '3.8'
services:
  web:
    image: python:3.10
    ports:
      - "8000:8000"
  cache:
    image: redis:alpine
    ports:
      - "6379:6379"
  db:
    image: postgres:15
    ports:
      - "5432:5432"
"""
    with open(os.path.join(cloned_dir, "docker-compose.yml"), "w", encoding="utf-8") as f:
        f.write(docker_content)

    # 2. Create GitHub Actions workflow
    workflow_content = """\
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * *'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
"""
    with open(os.path.join(cloned_dir, ".github", "workflows", "ci.yml"), "w", encoding="utf-8") as f:
        f.write(workflow_content)

    # 3. Create .env file
    env_content = """\
DATABASE_URL=postgresql://postgres@db:5432/db
REDIS_URL=redis://cache:6379/0
API_KEY=super_secret_value
"""
    with open(os.path.join(cloned_dir, ".env"), "w", encoding="utf-8") as f:
        f.write(env_content)

    # 4. Create source file
    code_content = """\
import os
import redis
from celery import shared_task

r = redis.Redis(host='cache', port=6379)
key = os.getenv("API_KEY")

class User(Base):
    __tablename__ = "users"

@app.get("/users")
def get_users():
    return []

@shared_task
def process_data_task():
    pass
"""
    with open(os.path.join(cloned_dir, "app", "main.py"), "w", encoding="utf-8") as f:
        f.write(code_content)

    # Parse repo
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # Query graph
    res = client.get(f"/api/v1/repositories/{repo_id}/graph")
    assert res.status_code == 200
    graph_data = res.json()
    
    nodes = graph_data["nodes"]
    relationships = graph_data["relationships"]
    
    # Assert Ontology Mapping
    # File node should have type = "Module"
    file_node = next((n for n in nodes if n["id"] == "file::app/main.py"), None)
    assert file_node is not None
    assert file_node["type"] == "Module"
    assert file_node["properties"].get("raw_type") == "File"

    # Folder node should have type = "Domain"
    folder_node = next((n for n in nodes if n["id"] == "folder::app"), None)
    assert folder_node is not None
    assert folder_node["type"] == "Domain"
    assert folder_node["properties"].get("raw_type") == "Folder"

    # Function node should have type = "Function"
    func_node = next((n for n in nodes if "get_users" in n["name"]), None)
    assert func_node is not None
    assert func_node["type"] == "Function"

    # API Endpoint should map to "API"
    api_node = next((n for n in nodes if "/users" in n["name"]), None)
    assert api_node is not None
    assert api_node["type"] == "API"
    assert api_node["properties"].get("raw_type") in ("API Endpoint", "REST API Endpoint")

    # Assert Entity Recognition Engine Discovered Infrastructure Node types
    # Docker Service nodes
    web_docker = next((n for n in nodes if n["id"] == f"docker::{repo_id}::web"), None)
    assert web_docker is not None
    assert web_docker["properties"].get("raw_type") == "Docker Service"

    # GitHub Action node
    workflow_node = next((n for n in nodes if n["id"] == f"github_action::{repo_id}::ci.yml"), None)
    assert workflow_node is not None
    assert workflow_node["name"] == "CI/CD Pipeline"

    # Cron Job node
    cron_node = next((n for n in nodes if n["id"] == f"cron::{repo_id}::workflow::ci.yml"), None)
    assert cron_node is not None
    assert cron_node["properties"].get("cron_expression") == "0 0 * * *"

    # Environment variables
    api_key_node = next((n for n in nodes if n["id"] == f"env::{repo_id}::API_KEY"), None)
    assert api_key_node is not None
    assert api_key_node["properties"].get("raw_type") in ("Environment", "Environment Variable")

    # Redis Cache node
    redis_node = next((n for n in nodes if n["id"] == f"cache::{repo_id}::redis"), None)
    assert redis_node is not None

    # Assert Relationships connecting infrastructure and code
    # File uses Environment Variable
    env_use = next((r for r in relationships if r["source_id"] == "file::app/main.py" and r["target_id"] == f"env::{repo_id}::API_KEY" and r["type"] == "USES"), None)
    assert env_use is not None

    # File connects to Redis
    redis_connect = next((r for r in relationships if r["source_id"] == "file::app/main.py" and r["target_id"] == f"cache::{repo_id}::redis" and r["type"] == "CONNECTS_TO"), None)
    assert redis_connect is not None


def test_architecture_pattern_detection(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)

    # Create folder layers matching API -> Service -> Repository
    os.makedirs(os.path.join(cloned_dir, "app", "api"), exist_ok=True)
    os.makedirs(os.path.join(cloned_dir, "app", "services"), exist_ok=True)
    os.makedirs(os.path.join(cloned_dir, "app", "repositories"), exist_ok=True)

    # 1. API Controller
    api_content = """\
from app.services.auth import AuthService

class AuthController:
    def login(self):
        AuthService().authenticate()
"""
    with open(os.path.join(cloned_dir, "app", "api", "auth.py"), "w", encoding="utf-8") as f:
        f.write(api_content)

    # 2. Business Service
    service_content = """\
from app.repositories.user import UserRepository

class AuthService:
    def authenticate(self):
        UserRepository().find_by_id(1)
"""
    with open(os.path.join(cloned_dir, "app", "services", "auth.py"), "w", encoding="utf-8") as f:
        f.write(service_content)

    # 3. Repository
    repo_content = """\
class UserRepository:
    def find_by_id(self, user_id):
        pass
"""
    with open(os.path.join(cloned_dir, "app", "repositories", "user.py"), "w", encoding="utf-8") as f:
        f.write(repo_content)

    # Parse repo
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # Query patterns via API
    res = client.get(f"/api/v1/repositories/{repo_id}/analysis/architecture")
    assert res.status_code == 200
    data = res.json()
    assert "patterns" in data
    patterns = {p["pattern"]: p for p in data["patterns"]}

    # Check Layered Architecture
    assert "Layered Architecture" in patterns
    assert patterns["Layered Architecture"]["confidence"] > 0.5
    assert len(patterns["Layered Architecture"]["evidence"]) > 0

    # Check Repository Pattern
    assert "Repository Pattern" in patterns
    assert patterns["Repository Pattern"]["confidence"] > 0.5
    assert len(patterns["Repository Pattern"]["evidence"]) > 0


def test_domain_clustering(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)

    # Create directories for authentication and billing
    os.makedirs(os.path.join(cloned_dir, "app", "auth"), exist_ok=True)
    os.makedirs(os.path.join(cloned_dir, "app", "billing"), exist_ok=True)

    # Auth file: login endpoint
    auth_content = """\
def perform_user_login():
    pass
"""
    with open(os.path.join(cloned_dir, "app", "auth", "login.py"), "w", encoding="utf-8") as f:
        f.write(auth_content)

    # Billing file: checkout endpoint
    billing_content = """\
def run_checkout_transaction():
    pass
"""
    with open(os.path.join(cloned_dir, "app", "billing", "checkout.py"), "w", encoding="utf-8") as f:
        f.write(billing_content)

    # Parse repo
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # Query domains API
    res = client.get(f"/api/v1/repositories/{repo_id}/analysis/domains")
    assert res.status_code == 200
    data = res.json()
    assert "domains" in data
    
    domains_map = {d["name"]: d for d in data["domains"]}
    
    # Assert domains exist and contain correct nodes
    assert "Authentication & Security" in domains_map
    auth_node_ids = domains_map["Authentication & Security"]["node_ids"]
    assert any("login.py" in nid for nid in auth_node_ids)
    
    assert "Billing & Payment" in domains_map
    billing_node_ids = domains_map["Billing & Payment"]["node_ids"]
    assert any("checkout.py" in nid for nid in billing_node_ids)


def test_semantic_queries(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)

    os.makedirs(os.path.join(cloned_dir, "app"), exist_ok=True)

    # Mock code containing:
    # 1. API route /auth/login with JWT token check
    # 2. Redis cache connection
    # 3. Service calling UserRepository
    mock_code = """\
import redis
import os

r = redis.Redis(host='localhost')

class UserRepository:
    def save_user(self):
        pass

class UserService:
    def login_user(self):
        UserRepository().save_user()

@app.post("/auth/jwt-login")
def login(jwt_secret=None):
    UserService().login_user()
"""
    with open(os.path.join(cloned_dir, "app", "main.py"), "w", encoding="utf-8") as f:
        f.write(mock_code)

    # Parse repo
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # Query 1: Which modules interact with Redis?
    res1 = client.get(f"/api/v1/repositories/{repo_id}/query/semantic?query=Which modules interact with Redis?")
    assert res1.status_code == 200
    data1 = res1.json()
    assert "results" in data1
    assert any("main.py" in r["name"] for r in data1["results"])

    # Query 2: Which services own this API?
    res2 = client.get(f"/api/v1/repositories/{repo_id}/query/semantic?query=Which services own this API?")
    assert res2.status_code == 200
    data2 = res2.json()
    assert "results" in data2

    # Query 3: Which APIs use JWT?
    res3 = client.get(f"/api/v1/repositories/{repo_id}/query/semantic?query=Which APIs use JWT?")
    assert res3.status_code == 200
    data3 = res3.json()
    assert "results" in data3
    assert any("login" in r["name"] for r in data3["results"])


def test_semantic_search_nodes(client):
    import shutil
    from app.services.parse_service import ParseService
    from app.core.config import settings

    repo_id = "test_graph_repo"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)

    os.makedirs(os.path.join(cloned_dir, "app"), exist_ok=True)

    # Mock code containing:
    # 1. Login API endpoint
    # 2. Authentication service class
    # 3. JWT validation module
    # 4. User database table / model
    mock_code = """\
class AuthenticationService:
    def verify_token(self):
        pass

class JWTModule:
    pass

class UserTable:
    pass

@app.post("/auth/jwt-login")
def login():
    pass
"""
    with open(os.path.join(cloned_dir, "app", "auth.py"), "w", encoding="utf-8") as f:
        f.write(mock_code)

    # Parse repo
    db = SessionLocal()
    try:
        parse_service = ParseService()
        parse_service.parse_repository(db, repo_id)
    finally:
        db.close()

    # Search for concept "login"
    res = client.get(f"/api/v1/repositories/{repo_id}/search?query=login")
    assert res.status_code == 200
    data = res.json()
    
    # Assert concept expanded results are returned (e.g. JWTModule, AuthenticationService)
    node_names = [n["name"] for n in data]
    assert any("jwt-login" in n for n in node_names)
    assert any("AuthenticationService" in n for n in node_names)
    assert any("JWTModule" in n for n in node_names)
    assert any("UserTable" in n for n in node_names)


def test_aligned_knowledge_endpoints(client):
    repo_id = "test_graph_repo"

    # 1. Build
    res_build = client.post(f"/api/v1/repositories/{repo_id}/knowledge/build")
    assert res_build.status_code == 200
    assert "built successfully" in res_build.json()["message"]

    # 2. Graph
    res_graph = client.get(f"/api/v1/repositories/{repo_id}/knowledge")
    assert res_graph.status_code == 200
    assert "nodes" in res_graph.json()

    # 3. Entities
    res_entities = client.get(f"/api/v1/repositories/{repo_id}/knowledge/entities")
    assert res_entities.status_code == 200
    assert "entities" in res_entities.json()

    # 4. Search
    res_search = client.get(f"/api/v1/repositories/{repo_id}/knowledge/search?query=login")
    assert res_search.status_code == 200
    assert len(res_search.json()) > 0

    # 5. Domains
    res_domains = client.get(f"/api/v1/repositories/{repo_id}/knowledge/domains")
    assert res_domains.status_code == 200
    assert "domains" in res_domains.json()

    # 6. Patterns
    res_patterns = client.get(f"/api/v1/repositories/{repo_id}/knowledge/patterns")
    assert res_patterns.status_code == 200
    assert "patterns" in res_patterns.json()

    # 7. Statistics
    res_stats = client.get(f"/api/v1/repositories/{repo_id}/knowledge/statistics")
    assert res_stats.status_code == 200
    assert "statistics" in res_stats.json()







