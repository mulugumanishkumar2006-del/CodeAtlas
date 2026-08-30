import os
import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.analysis import Analysis
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.services.git_repository_service import git_service
from backend.app.services.language_detection_service import language_service
from backend.app.services.repository_scanner_service import scanner_service
from backend.app.services.ast_parser_service import ast_parser_service
from backend.app.services.repository_ingestion_service import ingestion_service


# =========================================================================
# Fixtures for Real Local Git Repositories (Python & TypeScript)
# =========================================================================

@pytest.fixture
def repo_a_python_origin(tmp_path):
    """
    Creates a real Git repository for Repository A: Python project
    Structure:
      src/
        core/
          config.py (Class Config, function get_config)
        services/
          auth_service.py (Class AuthService, method login, async method verify_token)
        api/
          main.py (function main, function login_route)
    """
    origin_dir = tmp_path / "repo_a_python.git"
    origin_dir.mkdir(parents=True, exist_ok=True)

    subprocess.run(["git", "init", "-b", "main", str(origin_dir)], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "CodeAtlas Tester A"], cwd=origin_dir, check=True)
    subprocess.run(["git", "config", "user.email", "tester_a@codeatlas.dev"], cwd=origin_dir, check=True)

    # 1. src/core/config.py
    core_dir = origin_dir / "src" / "core"
    core_dir.mkdir(parents=True, exist_ok=True)
    (core_dir / "config.py").write_text(
        '"""App configuration module."""\n\n'
        'class Config:\n'
        '    """Core app config."""\n'
        '    app_name: str = "CodeAtlas"\n'
        '    debug: bool = True\n\n'
        'def get_config() -> Config:\n'
        '    """Retrieve singleton config."""\n'
        '    return Config()\n'
    )

    # 2. src/services/auth_service.py
    services_dir = origin_dir / "src" / "services"
    services_dir.mkdir(parents=True, exist_ok=True)
    (services_dir / "auth_service.py").write_text(
        '"""Authentication Service."""\n\n'
        'class AuthService:\n'
        '    def login(self, username: str, password_hash: str) -> bool:\n'
        '        """Verify login credentials."""\n'
        '        return username == "admin"\n\n'
        '    async def verify_token(self, token: str) -> bool:\n'
        '        """Async token validator."""\n'
        '        return len(token) > 10\n'
    )

    # 3. src/api/main.py
    api_dir = origin_dir / "src" / "api"
    api_dir.mkdir(parents=True, exist_ok=True)
    (api_dir / "main.py").write_text(
        '"""API Entrypoint."""\n\n'
        'def login_route(payload: dict):\n'
        '    return {"status": "ok"}\n\n'
        'def main():\n'
        '    print("Starting Python API server...")\n'
    )

    subprocess.run(["git", "add", "."], cwd=origin_dir, check=True)
    subprocess.run(["git", "commit", "-m", "Initial commit for Repository A"], cwd=origin_dir, check=True)
    return origin_dir


@pytest.fixture
def repo_b_typescript_origin(tmp_path):
    """
    Creates a real Git repository for Repository B: TypeScript project
    Structure:
      src/
        lib/
          config.ts (interface Config, const config)
          auth.ts (function login, function logout)
        components/
          LoginCard.tsx (interface LoginCardProps, const LoginCard component)
    """
    origin_dir = tmp_path / "repo_b_typescript.git"
    origin_dir.mkdir(parents=True, exist_ok=True)

    subprocess.run(["git", "init", "-b", "main", str(origin_dir)], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "CodeAtlas Tester B"], cwd=origin_dir, check=True)
    subprocess.run(["git", "config", "user.email", "tester_b@codeatlas.dev"], cwd=origin_dir, check=True)

    # 1. src/lib/config.ts
    lib_dir = origin_dir / "src" / "lib"
    lib_dir.mkdir(parents=True, exist_ok=True)
    (lib_dir / "config.ts").write_text(
        'export interface AppConfig {\n'
        '  apiUrl: string;\n'
        '  environment: string;\n'
        '}\n\n'
        'export const config: AppConfig = {\n'
        '  apiUrl: "http://localhost:8000",\n'
        '  environment: "production",\n'
        '};\n'
    )

    # 2. src/lib/auth.ts
    (lib_dir / "auth.ts").write_text(
        'export interface UserSession {\n'
        '  token: string;\n'
        '}\n\n'
        'export async function login(credentials: { user: string }): Promise<UserSession> {\n'
        '  return { token: "token-abc-123" };\n'
        '}\n\n'
        'export function logout(): void {\n'
        '  console.log("Logged out");\n'
        '}\n'
    )

    # 3. src/components/LoginCard.tsx
    comp_dir = origin_dir / "src" / "components"
    comp_dir.mkdir(parents=True, exist_ok=True)
    (comp_dir / "LoginCard.tsx").write_text(
        'export interface LoginCardProps {\n'
        '  title: string;\n'
        '}\n\n'
        'export const LoginCard = (props: LoginCardProps) => {\n'
        '  return <div>{props.title}</div>;\n'
        '};\n'
    )

    subprocess.run(["git", "add", "."], cwd=origin_dir, check=True)
    subprocess.run(["git", "commit", "-m", "Initial commit for Repository B"], cwd=origin_dir, check=True)
    return origin_dir


# =========================================================================
# Unit Tests for Scanner, Language, and AST Parser Services
# =========================================================================

class TestIngestionUnitServices:
    def test_language_detection(self):
        assert language_service.detect_language("main.py") == "Python"
        assert language_service.detect_language("src/App.tsx") == "TSX"
        assert language_service.detect_language("lib/utils.ts") == "TypeScript"
        assert language_service.detect_language("index.js") == "JavaScript"
        assert language_service.detect_language("server.go") == "Go"
        assert language_service.detect_language("main.rs") == "Rust"
        assert language_service.detect_language("App.java") == "Java"
        assert language_service.detect_language("unknown.xyz123") == "Unknown"

    def test_scanner_service_ignores_vendor(self, tmp_path):
        repo_dir = tmp_path / "sample_scan_repo"
        repo_dir.mkdir()
        (repo_dir / "src").mkdir()
        (repo_dir / "src" / "index.py").write_text("print('hello')\nline2\n")

        # Ignore dirs
        (repo_dir / "node_modules").mkdir()
        (repo_dir / "node_modules" / "pkg.js").write_text("module.exports = {}")
        (repo_dir / ".git").mkdir()
        (repo_dir / ".git" / "config").write_text("[core]")

        files = scanner_service.scan_directory(repo_dir)
        paths = [f["path"] for f in files]

        assert "src/index.py" in paths
        assert "node_modules/pkg.js" not in paths
        assert ".git/config" not in paths

        # Verify metadata
        py_file = next(f for f in files if f["path"] == "src/index.py")
        assert py_file["line_count"] == 2
        assert py_file["language"] == "Python"
        assert len(py_file["content_hash"]) == 64

    def test_python_ast_symbol_extraction(self, tmp_path):
        py_code = (
            "class UserManager:\n"
            "    def __init__(self, db):\n"
            "        self.db = db\n\n"
            "    def get_user(self, user_id: str):\n"
            "        return {'id': user_id}\n\n"
            "    async def async_fetch(self):\n"
            "        return True\n\n"
            "def standalone_func():\n"
            "    pass\n"
        )
        file_path = tmp_path / "user_mgr.py"
        file_path.write_text(py_code)

        symbols = ast_parser_service.parse_file(file_path, "Python")
        names = [s["name"] for s in symbols]
        qnames = [s["qualified_name"] for s in symbols]

        assert "UserManager" in names
        assert "get_user" in names
        assert "async_fetch" in names
        assert "standalone_func" in names
        assert "UserManager.get_user" in qnames
        assert "UserManager.async_fetch" in qnames

        user_mgr_sym = next(s for s in symbols if s["name"] == "UserManager")
        assert user_mgr_sym["symbol_type"] == "class"
        assert user_mgr_sym["start_line"] == 1
        assert user_mgr_sym["end_line"] == 9

        get_user_sym = next(s for s in symbols if s["name"] == "get_user")
        assert get_user_sym["symbol_type"] == "method"
        assert get_user_sym["start_line"] == 5

        standalone_sym = next(s for s in symbols if s["name"] == "standalone_func")
        assert standalone_sym["symbol_type"] == "function"
        assert standalone_sym["start_line"] == 11

    def test_typescript_symbol_extraction(self, tmp_path):
        ts_code = (
            "export interface AuthProps {\n"
            "  token: string;\n"
            "}\n\n"
            "export type Role = 'admin' | 'user';\n\n"
            "export class AuthService {\n"
            "  login(user: string) {\n"
            "    return true;\n"
            "  }\n"
            "}\n\n"
            "export const LoginButton: React.FC = () => {\n"
            "  return null;\n"
            "};\n"
        )
        file_path = tmp_path / "auth.tsx"
        file_path.write_text(ts_code)

        symbols = ast_parser_service.parse_file(file_path, "TSX")
        names = [s["name"] for s in symbols]

        assert "AuthProps" in names
        assert "Role" in names
        assert "AuthService" in names
        assert "login" in names
        assert "LoginButton" in names

        auth_props = next(s for s in symbols if s["name"] == "AuthProps")
        assert auth_props["symbol_type"] == "interface"
        assert auth_props["start_line"] == 1

        btn_sym = next(s for s in symbols if s["name"] == "LoginButton")
        assert btn_sym["symbol_type"] == "component"


# =========================================================================
# Integration & Multi-Repository Isolation Tests
# =========================================================================

@pytest.mark.asyncio
async def test_repository_a_and_b_ingestion_and_strict_isolation(
    client: AsyncClient,
    db_session: AsyncSession,
    repo_a_python_origin,
    repo_b_typescript_origin,
    monkeypatch,
    tmp_path,
):
    storage_root = tmp_path / "ingestion_workspace"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    # 1. Add Repository A (Python)
    res_a = await client.post(
        "/api/v1/repositories",
        json={
            "name": "org-alpha/python-core-service",
            "url": str(repo_a_python_origin.as_uri()),
            "default_branch": "main",
            "description": "Python Backend Service",
        },
    )
    assert res_a.status_code == 201
    repo_a_id = res_a.json()["id"]

    # 2. Add Repository B (TypeScript)
    res_b = await client.post(
        "/api/v1/repositories",
        json={
            "name": "org-beta/typescript-ui-app",
            "url": str(repo_b_typescript_origin.as_uri()),
            "default_branch": "main",
            "description": "TypeScript Frontend App",
        },
    )
    assert res_b.status_code == 201
    repo_b_id = res_b.json()["id"]

    # 3. Synchronously run ingestion on Repository A
    result_a = await ingestion_service.ingest_repository(repo_a_id, db=db_session)
    assert result_a["status"] == "completed"
    assert result_a["files_discovered"] >= 3
    assert result_a["symbols_extracted"] >= 4

    # 4. Synchronously run ingestion on Repository B
    result_b = await ingestion_service.ingest_repository(repo_b_id, db=db_session)
    assert result_b["status"] == "completed"
    assert result_b["files_discovered"] >= 3
    assert result_b["symbols_extracted"] >= 4

    # 5. Verify Repository A Files via API
    files_a_res = await client.get(f"/api/v1/repositories/{repo_a_id}/files")
    assert files_a_res.status_code == 200
    files_a = files_a_res.json()
    paths_a = [f["path"] for f in files_a]
    assert "src/core/config.py" in paths_a
    assert "src/services/auth_service.py" in paths_a
    assert "src/api/main.py" in paths_a
    # Must NOT contain Repository B files
    assert "src/lib/config.ts" not in paths_a

    # 6. Verify Repository B Files via API
    files_b_res = await client.get(f"/api/v1/repositories/{repo_b_id}/files")
    assert files_b_res.status_code == 200
    files_b = files_b_res.json()
    paths_b = [f["path"] for f in files_b]
    assert "src/lib/config.ts" in paths_b
    assert "src/lib/auth.ts" in paths_b
    assert "src/components/LoginCard.tsx" in paths_b
    # Must NOT contain Repository A files
    assert "src/core/config.py" not in paths_b

    # 7. CRITICAL ISOLATION TEST: Query same symbol name "login" on Repository A
    symbols_a_login = await client.get(f"/api/v1/repositories/{repo_a_id}/symbols?q=login")
    assert symbols_a_login.status_code == 200
    syms_a = symbols_a_login.json()
    assert len(syms_a) > 0
    # Must all belong strictly to Repository A
    for sym in syms_a:
        assert sym["repository_id"] == repo_a_id
        assert sym["name"] in ("login", "login_route")

    # 8. Query same symbol name "login" on Repository B
    symbols_b_login = await client.get(f"/api/v1/repositories/{repo_b_id}/symbols?q=login")
    assert symbols_b_login.status_code == 200
    syms_b = symbols_b_login.json()
    assert len(syms_b) > 0
    for sym in syms_b:
        assert sym["repository_id"] == repo_b_id
        # Must be TS symbols (login function or LoginCard component)
        assert sym["name"] in ("login", "LoginCard", "LoginCardProps")

    # 9. Verify Analysis status endpoint on Repository A
    analysis_a_res = await client.get(f"/api/v1/repositories/{repo_a_id}/analysis")
    assert analysis_a_res.status_code == 200
    analysis_a_data = analysis_a_res.json()
    assert analysis_a_data["status"] == "completed"
    assert analysis_a_data["files_discovered"] >= 3
    assert analysis_a_data["symbols_extracted"] >= 4

    # 10. Verify GET /index/status endpoint API contract
    status_api_res = await client.get(f"/api/v1/repositories/{repo_a_id}/index/status")
    assert status_api_res.status_code == 200
    status_api_data = status_api_res.json()
    assert status_api_data["repository_id"] == repo_a_id
    assert status_api_data["status"] in ("COMPLETED", "completed")
    assert status_api_data["progress"] == 100
    assert status_api_data["files_discovered"] >= 3
    assert status_api_data["files_indexed"] >= 3
    assert "current_stage" in status_api_data
    assert status_api_data["error"] is None

    # 11. RE-INDEXING TEST: Re-index Repository A and verify no duplicates
    reindex_result = await ingestion_service.ingest_repository(repo_a_id, db=db_session)
    assert reindex_result["status"] == "completed"

    files_a_after = (await client.get(f"/api/v1/repositories/{repo_a_id}/files")).json()
    symbols_a_after = (await client.get(f"/api/v1/repositories/{repo_a_id}/symbols")).json()
    assert len(files_a_after) == len(files_a)
    assert len(symbols_a_after) >= 4

    # 12. Verify Repository B was NOT altered by Repository A re-indexing
    files_b_after = (await client.get(f"/api/v1/repositories/{repo_b_id}/files")).json()
    assert len(files_b_after) == len(files_b)


@pytest.mark.asyncio
async def test_line_counting_breakdown_accuracy(tmp_path):
    code_file = tmp_path / "sample_math.py"
    code_file.write_text(
        "# Header comment\n"
        "# Another comment line\n"
        "\n"
        "def add(a: int, b: int) -> int:\n"
        "    return a + b\n"
        "\n"
        "def sub(a: int, b: int) -> int:\n"
        "    return a - b\n"
    )

    files = scanner_service.scan_directory(tmp_path)
    assert len(files) == 1
    f = files[0]
    assert f["line_count"] == 8
    assert f["blank_lines"] == 2
    assert f["comment_lines"] == 2
    assert f["code_lines"] == 4


@pytest.mark.asyncio
async def test_incremental_reindexing_lifecycle(
    client: AsyncClient,
    db_session: AsyncSession,
    repo_a_python_origin,
    monkeypatch,
    tmp_path,
):
    storage_root = tmp_path / "incremental_workspace"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    # 1. Register repo
    res = await client.post(
        "/api/v1/repositories",
        json={
            "name": "incremental/python-app",
            "url": str(repo_a_python_origin.as_uri()),
            "default_branch": "main",
        },
    )
    repo_id = res.json()["id"]

    # 2. Initial Index
    init_res = await ingestion_service.ingest_repository(repo_id, db=db_session)
    assert init_res["status"] == "completed"

    files_init = (await client.get(f"/api/v1/repositories/{repo_id}/files")).json()
    init_paths = {f["path"] for f in files_init}
    assert "src/api/main.py" in init_paths
    assert "src/core/config.py" in init_paths

    config_file_init = next(f for f in files_init if f["path"] == "src/core/config.py")
    config_file_id = config_file_init["id"]

    # 3. Modify origin git repository:
    # - Add new file `src/utils/helpers.py`
    # - Modify `src/core/config.py`
    # - Delete `src/api/main.py`
    utils_dir = repo_a_python_origin / "src" / "utils"
    utils_dir.mkdir(parents=True, exist_ok=True)
    (utils_dir / "helpers.py").write_text("def helper_fn():\n    return 42\n")

    (repo_a_python_origin / "src" / "core" / "config.py").write_text(
        "class Config:\n    version = 2\n    extra = 'updated'\n"
    )

    (repo_a_python_origin / "src" / "api" / "main.py").unlink()

    subprocess.run(["git", "add", "."], cwd=repo_a_python_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Incremental update"], cwd=repo_a_python_origin, check=True)

    # 4. Sync Git repo working tree to pick up origin changes via API
    sync_res = await client.post(f"/api/v1/repositories/{repo_id}/sync")
    assert sync_res.status_code == 200

    # 5. Re-index
    reindex_res = await ingestion_service.ingest_repository(repo_id, db=db_session)
    assert reindex_res["status"] == "completed"

    files_after = (await client.get(f"/api/v1/repositories/{repo_id}/files")).json()
    paths_after = {f["path"] for f in files_after}

    # Verify new file added
    assert "src/utils/helpers.py" in paths_after
    # Verify deleted file removed
    assert "src/api/main.py" not in paths_after
    # Verify changed file updated (same ID preserved, updated line count/hash)
    config_file_after = next(f for f in files_after if f["path"] == "src/core/config.py")
    assert config_file_after["id"] == config_file_id
    assert config_file_after["content_hash"] != config_file_init["content_hash"]


@pytest.mark.asyncio
async def test_failed_ingestion_on_invalid_repository(
    client: AsyncClient,
    db_session: AsyncSession,
    monkeypatch,
    tmp_path,
):
    storage_root = tmp_path / "ingestion_workspace_err"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    # Add repo with non-existent URL
    res = await client.post(
        "/api/v1/repositories",
        json={
            "name": "invalid-org/failing-ingest-repo",
            "url": "https://github.com/fake-org-not-found/failing-ingest-999.git",
            "default_branch": "main",
        },
    )
    assert res.status_code == 201
    repo_id = res.json()["id"]

    # Ingest should handle failure gracefully
    result = await ingestion_service.ingest_repository(repo_id, db=db_session)
    assert result["status"] == "failed"
    assert result["error"] is not None

    # Check status endpoint
    analysis_res = await client.get(f"/api/v1/repositories/{repo_id}/analysis")
    assert analysis_res.status_code == 200
    assert analysis_res.json()["status"] == "failed"

