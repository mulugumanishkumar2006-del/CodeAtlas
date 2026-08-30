import pytest
import subprocess
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.repository import Repository
from backend.app.services.search_intelligence_service import search_intelligence_service, SearchIntelligenceService
from backend.app.services.repository_ingestion_service import ingestion_service


# =========================================================================
# Unit Tests for Query Intent Classifier & Sanitization (Tests 5, 6, 9, 17)
# =========================================================================

def test_intent_parsing_and_sanitization():
    svc = SearchIntelligenceService()

    # 1. SQL Sanitization
    assert svc.sanitize_sql_pattern("50%_discount\\code") == "50\\%\\_discount\\\\code"

    # 2. Natural language: Incoming dependencies
    intent, target, _ = svc.parse_query_intent("What depends on auth.py?")
    assert intent == "DEPENDENCY_INCOMING"
    assert target == "auth.py"

    intent2, target2, _ = svc.parse_query_intent("Who imports database?")
    assert intent2 == "DEPENDENCY_INCOMING"
    assert target2 == "database"

    # 3. Natural language: Outgoing dependencies
    intent3, target3, _ = svc.parse_query_intent("What does auth.py depend on?")
    assert intent3 == "DEPENDENCY_OUTGOING"
    assert target3 == "auth.py"

    # 4. Natural language: Callers / Callees
    intent4, target4, _ = svc.parse_query_intent("Who calls authenticate_user?")
    assert intent4 == "CALLER_SEARCH"
    assert target4 == "authenticate_user"

    # 5. Natural language: Location / Symbol
    intent5, target5, _ = svc.parse_query_intent("Where is authentication implemented?")
    assert intent5 == "SYMBOL_SEARCH"
    assert "authentication" in target5

    # 6. Keyword search fallback
    intent6, target6, _ = svc.parse_query_intent("JWT_SECRET_KEY")
    assert intent6 == "KEYWORD_SEARCH"
    assert target6 == "JWT_SECRET_KEY"


# =========================================================================
# Full Pipeline & Strict Repository Isolation Tests (Tests 1–16)
# =========================================================================

@pytest.mark.asyncio
async def test_1_to_17_search_intelligence_full_pipeline_and_isolation(
    client: AsyncClient,
    db_session: AsyncSession,
    repo_a_python_origin,
    repo_b_typescript_origin,
    monkeypatch,
    tmp_path,
):
    storage_root = tmp_path / "search_test_workspace"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    # --- Setup Repo A (Python) with auth, models, and dependencies ---
    (repo_a_python_origin / "src" / "services").mkdir(parents=True, exist_ok=True)
    (repo_a_python_origin / "src" / "services" / "auth_service.py").write_text(
        '"""Authentication service implementation."""\n\n'
        'import jwt\n\n'
        'class AuthService:\n'
        '    """Handles user login."""\n'
        '    def login(self, username: str) -> bool:\n'
        '        token = jwt.encode({"user": username}, "secret")\n'
        '        return token is not None\n\n'
        'def verify_token(token: str) -> bool:\n'
        '    return len(token) > 5\n'
    )
    (repo_a_python_origin / "src" / "api").mkdir(parents=True, exist_ok=True)
    (repo_a_python_origin / "src" / "api" / "routes.py").write_text(
        'from src.services.auth_service import AuthService\n\n'
        'def handle_login(req):\n'
        '    auth = AuthService()\n'
        '    return auth.login(req.username)\n'
    )
    subprocess.run(["git", "add", "."], cwd=repo_a_python_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Add Python auth service and routes in Repo A"], cwd=repo_a_python_origin, check=True)

    # --- Setup Repo B (TypeScript) with same symbol name login and different logic ---
    (repo_b_typescript_origin / "src" / "lib").mkdir(parents=True, exist_ok=True)
    (repo_b_typescript_origin / "src" / "lib" / "auth_service.ts").write_text(
        'export interface UserCredentials {\n'
        '  username: string;\n'
        '}\n\n'
        'export class AuthService {\n'
        '  login(creds: UserCredentials): boolean {\n'
        '    return creds.username === "admin";\n'
        '  }\n'
        '}\n'
    )
    subprocess.run(["git", "add", "."], cwd=repo_b_typescript_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Add TypeScript auth service in Repo B"], cwd=repo_b_typescript_origin, check=True)

    # 1. Register & Ingest Repo A
    res_a = await client.post(
        "/api/v1/repositories",
        json={"name": "org/backend-python", "url": str(repo_a_python_origin.as_uri()), "default_branch": "main"},
    )
    repo_a_id = res_a.json()["id"]
    ingest_a = await ingestion_service.ingest_repository(repo_a_id, db=db_session)
    assert ingest_a["status"] == "completed"

    # 2. Register & Ingest Repo B
    res_b = await client.post(
        "/api/v1/repositories",
        json={"name": "org/frontend-ts", "url": str(repo_b_typescript_origin.as_uri()), "default_branch": "main"},
    )
    repo_b_id = res_b.json()["id"]
    ingest_b = await ingestion_service.ingest_repository(repo_b_id, db=db_session)
    assert ingest_b["status"] == "completed"

    # --- Test 9: Empty Query Handling ---
    empty_res = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=")
    assert empty_res.status_code == 200
    assert empty_res.json()["total_matches"] == 0

    # --- Test 10: No Results Handling ---
    no_res = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=NonExistentEntity12345")
    assert no_res.status_code == 200
    assert no_res.json()["total_matches"] == 0

    # --- Test 16: Missing Repository Handling ---
    missing_repo = await client.get("/api/v1/repositories/non-existent-id/search?q=auth")
    assert missing_repo.status_code == 404

    # --- Test 2 & 7: Symbol Search Accuracy & Deterministic Ranking ---
    sym_search = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=AuthService&type=symbol")
    assert sym_search.status_code == 200
    sym_json = sym_search.json()
    assert len(sym_json["symbols"]) >= 1
    assert sym_json["symbols"][0]["name"] == "AuthService"
    assert sym_json["symbols"][0]["file_path"] == "src/services/auth_service.py"
    assert sym_json["symbols"][0]["score"] == 100

    # --- Test 1: File Search Accuracy ---
    file_search = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=routes.py&type=file")
    assert file_search.status_code == 200
    file_json = file_search.json()
    assert len(file_json["files"]) >= 1
    assert any("routes.py" in f["path"] for f in file_json["files"])

    # --- Test 3: Source Code Search with Context Snippets ---
    code_search = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=jwt.encode&type=code")
    assert code_search.status_code == 200
    code_json = code_search.json()
    assert len(code_json["code_matches"]) >= 1
    target_match = code_json["code_matches"][0]
    assert "jwt.encode" in target_match["line_content"]
    assert len(target_match["context_snippet"]) > 0
    assert any(line["is_target"] for line in target_match["context_snippet"])

    # --- Test 4: Directory Search & Aggregations ---
    dir_search = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=services&type=directory")
    assert dir_search.status_code == 200
    dir_json = dir_search.json()
    assert len(dir_json["directories"]) >= 1
    assert dir_json["directories"][0]["directory"] == "src/services"
    assert dir_json["directories"][0]["file_count"] >= 1

    # --- Test 5: Natural-Language Query: Incoming Dependencies ("What depends on auth_service.py?") ---
    incoming_q = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=What depends on auth_service.py?")
    assert incoming_q.status_code == 200
    inc_json = incoming_q.json()
    assert inc_json["intent"] == "DEPENDENCY_INCOMING"
    assert len(inc_json["dependencies"]) >= 1
    assert any("routes.py" in d["source_path"] for d in inc_json["dependencies"])

    # --- Test 6: Natural-Language Query: Outgoing Dependencies ("What does routes.py depend on?") ---
    outgoing_q = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=What does routes.py depend on?")
    assert outgoing_q.status_code == 200
    out_json = outgoing_q.json()
    assert out_json["intent"] == "DEPENDENCY_OUTGOING"
    assert len(out_json["dependencies"]) >= 1

    # --- Test 11, 12, 13: Strict Repository Isolation & Same Symbol/Filename in Repo A vs Repo B ---
    # In Repo A: Searching for AuthService returns Python file
    search_a = (await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=AuthService")).json()
    assert any("auth_service.py" in s["file_path"] for s in search_a["symbols"])
    assert not any("auth_service.ts" in s["file_path"] for s in search_a["symbols"])

    # In Repo B: Searching for AuthService returns TypeScript file
    search_b = (await client.get(f"/api/v1/repositories/{repo_b_id}/search?q=AuthService")).json()
    assert any("auth_service.ts" in s["file_path"] for s in search_b["symbols"])
    assert not any("auth_service.py" in s["file_path"] for s in search_b["symbols"])

    # Search in Repo B for Repo A specific entity ('verify_token') must return 0 in Repo B
    verify_in_b = (await client.get(f"/api/v1/repositories/{repo_b_id}/search?q=verify_token")).json()
    assert verify_in_b["total_matches"] == 0

    # --- Test 8: Result Pagination & Limits ---
    paged_search = await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=auth&limit=1&offset=0")
    assert paged_search.status_code == 200
    assert paged_search.json()["limit"] == 1

    # --- Test 14: Search Freshness after Re-indexing ---
    # Update Repo A with a new symbol and re-index
    (repo_a_python_origin / "src" / "services" / "payment_service.py").write_text(
        'class PaymentGateway:\n    def process_charge(self, amount: int) -> bool:\n        return amount > 0\n'
    )
    subprocess.run(["git", "add", "."], cwd=repo_a_python_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Add payment service"], cwd=repo_a_python_origin, check=True)

    sync_res = await client.post(f"/api/v1/repositories/{repo_a_id}/sync")
    assert sync_res.status_code == 200
    reingest = await ingestion_service.ingest_repository(repo_a_id, db=db_session)
    assert reingest["status"] == "completed"

    fresh_search = (await client.get(f"/api/v1/repositories/{repo_a_id}/search?q=PaymentGateway")).json()
    assert len(fresh_search["symbols"]) >= 1
    assert fresh_search["symbols"][0]["name"] == "PaymentGateway"
