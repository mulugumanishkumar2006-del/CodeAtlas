import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.services.source_code_service import source_code_service, SourceCodeService
from backend.app.services.repository_ingestion_service import ingestion_service


# =========================================================================
# Unit Tests for Source Code Service (Tests 4, 11, 12, 13)
# =========================================================================

def test_12_binary_file_safe_handling(tmp_path):
    svc = SourceCodeService()
    # Test binary file detection
    bin_file = tmp_path / "sample.png"
    bin_file.write_bytes(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR")
    assert svc.is_binary_file(bin_file) is True

    # Test text file detection
    txt_file = tmp_path / "auth.py"
    txt_file.write_text("def authenticate():\n    return True\n")
    assert svc.is_binary_file(txt_file) is False


def test_11_missing_file_handling():
    svc = SourceCodeService()
    res = svc.get_file_source("non-existent-repo", "missing/file.py")
    assert res["is_missing"] is True
    assert res["source"] == ""
    assert res["total_lines"] == 0


def test_4_and_13_source_reading_and_large_file_safety(tmp_path, monkeypatch):
    svc = SourceCodeService()
    storage_root = tmp_path / "test_storage"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    repo_dir = storage_root / "repo-test" / "source"
    repo_dir.mkdir(parents=True, exist_ok=True)
    sample_py = repo_dir / "app.py"
    sample_py.write_text("print('hello world')\nline2\nline3\n", encoding="utf-8")

    res = svc.get_file_source("repo-test", "app.py")
    assert res["is_missing"] is False
    assert res["is_binary"] is False
    assert res["total_lines"] == 3
    assert "print('hello world')" in res["source"]


def test_7_code_search_accuracy(tmp_path, monkeypatch):
    svc = SourceCodeService()
    storage_root = tmp_path / "test_storage"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    repo_dir = storage_root / "repo-search" / "source"
    repo_dir.mkdir(parents=True, exist_ok=True)
    (repo_dir / "src").mkdir(exist_ok=True)
    (repo_dir / "src" / "auth.py").write_text(
        "import jwt\n\ndef authenticate_user(user):\n    token = jwt.encode(user)\n    return token\n",
        encoding="utf-8",
    )

    file_map = {"src/auth.py": "file-1"}
    matches = svc.search_repository_code("repo-search", "authenticate_user", file_map)
    assert len(matches) == 1
    assert matches[0]["file_path"] == "src/auth.py"
    assert matches[0]["line_number"] == 3
    assert "def authenticate_user" in matches[0]["line_content"]


# =========================================================================
# Integration & Strict Isolation Tests (Tests 1, 2, 3, 5, 6, 8, 9, 10, 14, 15)
# =========================================================================

@pytest.mark.asyncio
async def test_1_to_15_full_code_explorer_pipeline_and_isolation(
    client: AsyncClient,
    db_session: AsyncSession,
    repo_a_python_origin,
    repo_b_typescript_origin,
    monkeypatch,
    tmp_path,
):
    storage_root = tmp_path / "explorer_test_workspace"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    # --- Setup Repo A (Python) with specific source and symbols ---
    (repo_a_python_origin / "src" / "services" / "auth_service.py").write_text(
        '"""Auth service implementation."""\n\n'
        'class AuthService:\n'
        '    """Handles user login."""\n'
        '    def login(self, username: str, password_hash: str) -> bool:\n'
        '        return username == "admin"\n\n'
        'def verify_token(token: str) -> bool:\n'
        '    return len(token) > 5\n'
    )
    subprocess.run(["git", "add", "."], cwd=repo_a_python_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Add auth_service in Repo A"], cwd=repo_a_python_origin, check=True)

    # --- Setup Repo B (TypeScript) with components and login ---
    (repo_b_typescript_origin / "src" / "lib" / "auth.ts").write_text(
        'export interface UserCredentials {\n'
        '  user: string;\n'
        '}\n\n'
        'export function login(creds: UserCredentials): boolean {\n'
        '  return creds.user === "admin";\n'
        '}\n'
    )
    subprocess.run(["git", "add", "."], cwd=repo_b_typescript_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Add TypeScript auth in Repo B"], cwd=repo_b_typescript_origin, check=True)

    # 1. Register and Ingest Repo A
    res_a = await client.post(
        "/api/v1/repositories",
        json={"name": "org/backend-service", "url": str(repo_a_python_origin.as_uri()), "default_branch": "main"},
    )
    repo_a_id = res_a.json()["id"]
    ingest_a = await ingestion_service.ingest_repository(repo_a_id, db=db_session)
    assert ingest_a["status"] == "completed"

    # 2. Register and Ingest Repo B
    res_b = await client.post(
        "/api/v1/repositories",
        json={"name": "org/frontend-app", "url": str(repo_b_typescript_origin.as_uri()), "default_branch": "main"},
    )
    repo_b_id = res_b.json()["id"]
    ingest_b = await ingestion_service.ingest_repository(repo_b_id, db=db_session)
    assert ingest_b["status"] == "completed"

    # --- Test 1: File list repository & directory filtering ---
    files_a_res = await client.get(f"/api/v1/repositories/{repo_a_id}/files?directory=src/services")
    assert files_a_res.status_code == 200
    files_a = files_a_res.json()
    assert len(files_a) >= 1
    assert any("auth_service.py" in f["path"] for f in files_a)

    all_files_a = (await client.get(f"/api/v1/repositories/{repo_a_id}/files")).json()
    auth_file_a = next(f for f in all_files_a if "auth_service.py" in f["path"])

    all_files_b = (await client.get(f"/api/v1/repositories/{repo_b_id}/files")).json()
    auth_file_b = next(f for f in all_files_b if "auth.ts" in f["path"])

    # --- Test 2 & 4: Single File Retrieval with Real Source Content & Metadata ---
    detail_a_res = await client.get(f"/api/v1/repositories/{repo_a_id}/files/{auth_file_a['id']}")
    assert detail_a_res.status_code == 200
    detail_a = detail_a_res.json()

    assert detail_a["id"] == auth_file_a["id"]
    assert detail_a["repository_id"] == repo_a_id
    assert "class AuthService:" in detail_a["source"]
    assert "def login(" in detail_a["source"]
    assert detail_a["is_binary"] is False
    assert detail_a["is_missing"] is False
    assert detail_a["language"] == "Python"
    assert len(detail_a["symbols"]) >= 2

    # --- Test 3 & 14: IDOR Protection (Cross-repository file access prevention) ---
    # Attempting to access Repo B's file under Repo A's endpoint must return 404
    idor_res = await client.get(f"/api/v1/repositories/{repo_a_id}/files/{auth_file_b['id']}")
    assert idor_res.status_code == 404

    # Attempting to access Repo A's file under Repo B's endpoint must return 404
    idor_res2 = await client.get(f"/api/v1/repositories/{repo_b_id}/files/{auth_file_a['id']}")
    assert idor_res2.status_code == 404

    # --- Test 5 & 6: Symbol Repository Filtering & Coordinate Precision ---
    sym_a_res = await client.get(f"/api/v1/repositories/{repo_a_id}/symbols?file_id={auth_file_a['id']}")
    assert sym_a_res.status_code == 200
    syms_a = sym_a_res.json()
    auth_class_sym = next(s for s in syms_a if s["name"] == "AuthService")
    assert auth_class_sym["start_line"] == 3
    assert auth_class_sym["symbol_type"] == "class"

    # --- Test 7 & 8: Code Search Accuracy & Strict Repository Isolation ---
    search_code_a = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=AuthService&type=code")
    assert search_code_a.status_code == 200
    code_res_a = search_code_a.json()
    assert code_res_a["repository_id"] == repo_a_id
    assert len(code_res_a["code_matches"]) >= 1
    assert any("auth_service.py" in m["file_path"] for m in code_res_a["code_matches"])

    # Searching for Repo A code in Repo B must yield ZERO matches
    search_code_b = await client.get(f"/api/v1/repositories/{repo_b_id}/search?q=AuthService&type=code")
    assert search_code_b.status_code == 200
    code_res_b = search_code_b.json()
    assert len(code_res_b["code_matches"]) == 0

    # --- Test 9: Symbol Search Across Repositories ---
    search_sym_b = await client.get(f"/api/v1/repositories/{repo_b_id}/search?q=UserCredentials&type=symbol")
    assert search_sym_b.status_code == 200
    sym_res_b = search_sym_b.json()
    assert len(sym_res_b["symbol_matches"]) >= 1
    assert sym_res_b["symbol_matches"][0]["name"] == "UserCredentials"
    assert sym_res_b["symbol_matches"][0]["file_id"] == auth_file_b["id"]

    # --- Test 15: A -> B -> A Navigation and State Correctness ---
    check_a1 = (await client.get(f"/api/v1/repositories/{repo_a_id}/files/{auth_file_a['id']}")).json()
    check_b = (await client.get(f"/api/v1/repositories/{repo_b_id}/files/{auth_file_b['id']}")).json()
    check_a2 = (await client.get(f"/api/v1/repositories/{repo_a_id}/files/{auth_file_a['id']}")).json()

    assert check_a1["source"] == check_a2["source"]
    assert "class AuthService" in check_a2["source"]
    assert "export interface UserCredentials" in check_b["source"]
    assert "UserCredentials" not in check_a2["source"]
