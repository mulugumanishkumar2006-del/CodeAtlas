import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.services.parsers.python_parser import PythonParser
from backend.app.services.parsers.javascript_parser import JavaScriptParser
from backend.app.services.parsers.typescript_parser import TypeScriptParser
from backend.app.services.ast_parser_service import ast_parser_service
from backend.app.services.repository_ingestion_service import ingestion_service


# =========================================================================
# Unit Tests for AST Parsers
# =========================================================================

def test_1_python_class_extraction():
    code = (
        "class UserService:\n"
        '    """User management service."""\n'
        "    pass\n"
    )
    res = PythonParser().parse(code, "services/user.py")
    assert res["parse_status"] == "parsed"
    symbols = res["symbols"]
    assert len(symbols) == 1
    cls_sym = symbols[0]
    assert cls_sym["name"] == "UserService"
    assert cls_sym["symbol_type"] == "class"
    assert cls_sym["start_line"] == 1
    assert cls_sym["end_line"] == 3
    assert cls_sym["docstring"] == "User management service."


def test_2_python_function_extraction():
    code = (
        "def authenticate_user(user: str, token: str) -> bool:\n"
        '    """Authenticate a given user."""\n'
        "    return len(token) > 0\n"
    )
    res = PythonParser().parse(code, "auth.py")
    symbols = res["symbols"]
    assert len(symbols) == 1
    fn_sym = symbols[0]
    assert fn_sym["name"] == "authenticate_user"
    assert fn_sym["symbol_type"] == "function"
    assert fn_sym["start_line"] == 1
    assert fn_sym["end_line"] == 3
    assert "parameters" in fn_sym["ast_metadata"]
    assert fn_sym["ast_metadata"]["parameters"] == ["user", "token"]


def test_3_python_method_extraction():
    code = (
        "class UserService:\n"
        "    def authenticate(self, user: str):\n"
        "        return True\n"
    )
    res = PythonParser().parse(code, "services.py")
    symbols = res["symbols"]
    assert len(symbols) == 2
    method_sym = next(s for s in symbols if s["symbol_type"] == "method")
    assert method_sym["name"] == "authenticate"
    assert method_sym["parent_name"] == "UserService"
    assert method_sym["qualified_name"] == "UserService.authenticate"
    assert method_sym["start_line"] == 2
    assert method_sym["end_line"] == 3


def test_4_python_async_function_extraction():
    code = (
        "async def fetch_remote_user(user_id: int):\n"
        '    """Async fetch."""\n'
        "    return {'id': user_id}\n"
    )
    res = PythonParser().parse(code, "fetcher.py")
    symbols = res["symbols"]
    assert len(symbols) == 1
    afn = symbols[0]
    assert afn["name"] == "fetch_remote_user"
    assert afn["symbol_type"] == "async_function"
    assert afn["ast_metadata"]["is_async"] is True


def test_5_typescript_interface_extraction():
    code = (
        "export interface UserProfile extends BaseEntity {\n"
        "  id: string;\n"
        "  username: string;\n"
        "}\n"
    )
    res = TypeScriptParser().parse(code, "types/user.ts")
    assert res["parse_status"] == "parsed"
    symbols = res["symbols"]
    assert len(symbols) == 1
    iface = symbols[0]
    assert iface["name"] == "UserProfile"
    assert iface["symbol_type"] == "interface"
    assert iface["start_line"] == 1
    assert iface["end_line"] == 4
    assert iface["ast_metadata"]["is_exported"] is True


def test_6_typescript_function_extraction():
    code = (
        "export async function computeHash(data: string): Promise<string> {\n"
        "  return 'hash_' + data;\n"
        "}\n"
    )
    res = TypeScriptParser().parse(code, "utils/crypto.ts")
    symbols = res["symbols"]
    assert len(symbols) == 1
    fn = symbols[0]
    assert fn["name"] == "computeHash"
    assert fn["symbol_type"] == "async_function"
    assert fn["start_line"] == 1
    assert fn["end_line"] == 3


def test_7_typescript_class_and_method_extraction():
    code = (
        "export class AuthClient {\n"
        "  public async login(req: LoginRequest): Promise<User> {\n"
        "    return { id: '1' };\n"
        "  }\n"
        "}\n"
    )
    res = TypeScriptParser().parse(code, "services/client.ts")
    symbols = res["symbols"]
    assert len(symbols) == 2
    cls = next(s for s in symbols if s["symbol_type"] == "class")
    meth = next(s for s in symbols if s["symbol_type"] == "method")
    assert cls["name"] == "AuthClient"
    assert meth["name"] == "login"
    assert meth["qualified_name"] == "AuthClient.login"
    assert meth["start_line"] == 2
    assert meth["end_line"] == 4


def test_8_tsx_component_extraction():
    code = (
        "import React from 'react';\n\n"
        "export const DashboardCard: React.FC<Props> = ({ title }) => {\n"
        "  return <div className='card'>{title}</div>;\n"
        "};\n"
    )
    res = TypeScriptParser().parse(code, "components/DashboardCard.tsx")
    symbols = res["symbols"]
    assert len(symbols) == 1
    comp = symbols[0]
    assert comp["name"] == "DashboardCard"
    assert comp["symbol_type"] == "component"
    assert comp["start_line"] == 3
    assert comp["end_line"] == 5


def test_9_import_extraction_python_and_typescript():
    # Python imports
    py_code = (
        "import os\n"
        "import sys as system\n"
        "from services.auth import AuthService, hash_pw as hp\n"
    )
    py_res = PythonParser().parse(py_code, "test.py")
    py_imports = py_res["imports"]
    assert len(py_imports) == 4
    assert any(i["module"] == "os" for i in py_imports)
    assert any(i["module"] == "sys" and i["alias"] == "system" for i in py_imports)
    assert any(i["module"] == "services.auth" and i["name"] == "AuthService" for i in py_imports)

    # TypeScript imports
    ts_code = (
        "import React, { useState } from 'react';\n"
        "import type { UserSession } from './types';\n"
    )
    ts_res = TypeScriptParser().parse(ts_code, "test.ts")
    ts_imports = ts_res["imports"]
    assert len(ts_imports) == 2
    assert any(i["module"] == "react" for i in ts_imports)
    assert any(i["module"] == "./types" for i in ts_imports)


def test_10_export_extraction():
    # Python __all__
    py_code = (
        "__all__ = ['UserService', 'authenticate']\n"
        "class UserService: pass\n"
    )
    py_res = PythonParser().parse(py_code, "app.py")
    assert len(py_res["exports"]) == 2
    assert py_res["exports"][0]["name"] == "UserService"

    # TypeScript exports
    ts_code = (
        "export function login() {}\n"
        "export default DashboardCard;\n"
    )
    ts_res = TypeScriptParser().parse(ts_code, "index.ts")
    assert len(ts_res["exports"]) >= 2
    assert any(e["name"] == "login" for e in ts_res["exports"])
    assert any(e["name"] == "DashboardCard" for e in ts_res["exports"])


def test_11_line_coordinate_accuracy(tmp_path):
    source_file = tmp_path / "calc.py"
    content = (
        "# Line 1: Header\n"
        "# Line 2: Header\n"
        "class Calculator:\n"
        "    def add(self, a: int, b: int) -> int:\n"
        "        return a + b\n"
        "\n"
        "def subtract(a: int, b: int) -> int:\n"
        "    return a - b\n"
    )
    source_file.write_text(content)
    lines = content.splitlines()

    res = PythonParser().parse(content, str(source_file))
    symbols = res["symbols"]
    
    for sym in symbols:
        # Verify lines are 1-indexed and in range
        s_line = sym["start_line"]
        e_line = sym["end_line"]
        assert 1 <= s_line <= len(lines)
        assert s_line <= e_line <= len(lines)
        # Verify that symbol name appears on the start line in actual source text
        decl_line = lines[s_line - 1]
        assert sym["name"] in decl_line


def test_12_parent_child_hierarchies():
    code = (
        "class OrganizationService:\n"
        "    def create_org(self, name: str):\n"
        "        def validate_name(n: str):\n"
        "            return len(n) > 2\n"
        "        return validate_name(name)\n"
    )
    res = PythonParser().parse(code, "org.py")
    symbols = res["symbols"]
    assert len(symbols) == 3
    org_cls = next(s for s in symbols if s["name"] == "OrganizationService")
    create_method = next(s for s in symbols if s["name"] == "create_org")
    validate_fn = next(s for s in symbols if s["name"] == "validate_name")

    assert org_cls["qualified_name"] == "OrganizationService"
    assert create_method["qualified_name"] == "OrganizationService.create_org"
    assert validate_fn["qualified_name"] == "OrganizationService.create_org.validate_name"
    assert validate_fn["parent_name"] == "create_org"


def test_13_invalid_source_does_not_crash():
    broken_python = "def bad_function(broken syntax {{{ ::"
    res = PythonParser().parse(broken_python, "broken.py")
    assert res["parse_status"] == "error"
    assert res["error"] is not None
    assert res["symbols"] == []


# =========================================================================
# Integration Tests for Full Pipeline & Repository Isolation (Tests 14 - 17)
# =========================================================================

@pytest.mark.asyncio
async def test_14_to_17_full_pipeline_and_strict_symbol_isolation(
    client: AsyncClient,
    db_session: AsyncSession,
    repo_a_python_origin,
    repo_b_typescript_origin,
    monkeypatch,
    tmp_path,
):
    storage_root = tmp_path / "ast_test_workspace"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    # --- 1. Register & Ingest Repository A (Python) ---
    res_a = await client.post(
        "/api/v1/repositories",
        json={
            "name": "company/backend-service",
            "url": str(repo_a_python_origin.as_uri()),
            "default_branch": "main",
        },
    )
    repo_a_id = res_a.json()["id"]
    ingest_a = await ingestion_service.ingest_repository(repo_a_id, db=db_session)
    assert ingest_a["status"] == "completed"

    # --- 2. Register & Ingest Repository B (TypeScript) ---
    res_b = await client.post(
        "/api/v1/repositories",
        json={
            "name": "company/frontend-app",
            "url": str(repo_b_typescript_origin.as_uri()),
            "default_branch": "main",
        },
    )
    repo_b_id = res_b.json()["id"]
    ingest_b = await ingestion_service.ingest_repository(repo_b_id, db=db_session)
    assert ingest_b["status"] == "completed"

    # --- Test 16: Strict Repository A/B Symbol Isolation ---
    syms_a_res = await client.get(f"/api/v1/repositories/{repo_a_id}/symbols")
    assert syms_a_res.status_code == 200
    syms_a = syms_a_res.json()
    assert len(syms_a) > 0

    syms_b_res = await client.get(f"/api/v1/repositories/{repo_b_id}/symbols")
    assert syms_b_res.status_code == 200
    syms_b = syms_b_res.json()
    assert len(syms_b) > 0

    # Repo A symbols must only belong to repo_a_id
    for s in syms_a:
        assert s["repository_id"] == repo_a_id

    # Repo B symbols must only belong to repo_b_id
    for s in syms_b:
        assert s["repository_id"] == repo_b_id

    # --- Test 17: Same symbol name 'login' in both repos remains isolated ---
    login_a = (await client.get(f"/api/v1/repositories/{repo_a_id}/symbols?name=login")).json()
    login_b = (await client.get(f"/api/v1/repositories/{repo_b_id}/symbols?name=login")).json()

    assert len(login_a) > 0
    assert len(login_b) > 0

    for s in login_a:
        assert s["repository_id"] == repo_a_id
        # Repo A is Python method or route
        assert s["qualified_name"] in ("AuthService.login", "login_route", "login")

    for s in login_b:
        assert s["repository_id"] == repo_b_id
        # Repo B is TypeScript function or component
        assert s["name"] in ("login", "LoginCard", "LoginCardProps")

    # --- Test 14: Re-indexing does not duplicate symbols ---
    sym_count_before = len(syms_a)
    reindex_a = await ingestion_service.ingest_repository(repo_a_id, db=db_session)
    assert reindex_a["status"] == "completed"

    syms_a_after = (await client.get(f"/api/v1/repositories/{repo_a_id}/symbols")).json()
    assert len(syms_a_after) == sym_count_before

    # --- Test 15: Deleted symbols disappear after re-indexing ---
    # Delete a symbol from origin Python repo (remove `login_route` from `src/api/main.py`)
    (repo_a_python_origin / "src" / "api" / "main.py").write_text(
        '"""Modified API Entrypoint."""\n\n'
        'def main():\n'
        '    print("Starting...")\n'
    )
    subprocess.run(["git", "add", "."], cwd=repo_a_python_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Remove login_route"], cwd=repo_a_python_origin, check=True)

    # Sync git repo
    await client.post(f"/api/v1/repositories/{repo_a_id}/sync")
    # Re-index
    await ingestion_service.ingest_repository(repo_a_id, db=db_session)

    # Verify `login_route` is gone from Repository A symbols
    syms_a_updated = (await client.get(f"/api/v1/repositories/{repo_a_id}/symbols")).json()
    assert not any(s["name"] == "login_route" for s in syms_a_updated)

    # Verify switching A -> B -> A restores Repo B and Repo A state cleanly
    syms_b_check = (await client.get(f"/api/v1/repositories/{repo_b_id}/symbols")).json()
    assert len(syms_b_check) == len(syms_b)
