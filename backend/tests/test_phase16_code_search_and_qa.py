import pytest
from datetime import datetime, timezone
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.services.rag_service import rag_service, redact_sensitive_strings, is_secret_file
from backend.app.services.search_intelligence_service import search_intelligence_service
from backend.app.services.llm_provider import GroundedDeterministicProvider, SYSTEM_PROMPT


@pytest.mark.asyncio
async def test_canonical_intent_classification():
    """Verify all 10 canonical intents are correctly classified."""
    cases = [
        ("What files break if I modify user_service.py?", "IMPACT"),
        ("What is the blast radius of changing calculate_tax?", "IMPACT"),
        ("Who calls handle_payment?", "CALL_GRAPH"),
        ("What functions call authenticate_user?", "CALL_GRAPH"),
        ("What dependencies does this project have?", "DEPENDENCY"),
        ("Where is FastAPI used in this codebase?", "DEPENDENCY"),
        ("What is the high-level architecture and structure?", "ARCHITECTURE"),
        ("What is the API layer and main components?", "ARCHITECTURE"),
        ("Who changed auth.py and what was the commit history?", "HISTORY"),
        ("When was login function modified recently?", "HISTORY"),
        ("Which files have high complexity and technical debt?", "QUALITY"),
        ("Where is code duplication and technical debt concentrated?", "QUALITY"),
        ("Where are security findings and secrets stored?", "SECURITY"),
        ("Are there any vulnerabilities or injection risks in this repo?", "SECURITY"),
        ("Where is authentication implemented?", "SEARCH"),
        ("Find the database connection file", "SEARCH"),
        ("Explain this class and how it works", "EXPLAIN"),
        ("How does the checkout flow work?", "EXPLAIN"),
        ("What is the weather today?", "GENERAL"),
    ]

    for question, expected_intent in cases:
        intent, keywords = rag_service.classify_query(question)
        assert intent == expected_intent, f"Query '{question}' classified as {intent}, expected {expected_intent}"


def test_secret_redaction_and_exclusion():
    """Verify secret redaction from snippets and secret file exclusions."""
    assert is_secret_file(".env") is True
    assert is_secret_file(".env.production") is True
    assert is_secret_file("server.key") is True
    assert is_secret_file("id_rsa") is True
    assert is_secret_file("credentials.json") is True
    assert is_secret_file("src/auth.py") is False
    assert is_secret_file("README.md") is False

    # Test sensitive string redaction
    raw_text = (
        "Stripe key: sk_live_ABC12345678901234567890\n"
        "AWS key: AKIAIOSFODNN7EXAMPLE\n"
        "GitHub token: ghp_1234567890abcdefghijklmnopqrstuvwxyz\n"
        "Bearer token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz\n"
        "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0\n-----END RSA PRIVATE KEY-----"
    )
    redacted = redact_sensitive_strings(raw_text)
    assert "sk_live_" not in redacted
    assert "[REDACTED_STRIPE_KEY]" in redacted
    assert "AKIAIOSFODNN7EXAMPLE" not in redacted
    assert "[REDACTED_AWS_KEY]" in redacted
    assert "ghp_" not in redacted
    assert "[REDACTED_GITHUB_TOKEN]" in redacted
    assert "[REDACTED_TOKEN]" in redacted
    assert "[REDACTED_PRIVATE_KEY]" in redacted


from backend.app.models.workspace import Workspace

@pytest.mark.asyncio
async def test_search_and_qa_repository_isolation(db_session: AsyncSession):
    """Verify search and Q&A enforce strict repository isolation."""
    ws = Workspace(id=f"ws-{uuid.uuid4().hex[:8]}", name="TestWS", slug=f"test-ws-{uuid.uuid4().hex[:6]}")
    db_session.add(ws)
    await db_session.flush()

    repo_a_id = f"repo-a-{uuid.uuid4().hex[:8]}"
    repo_b_id = f"repo-b-{uuid.uuid4().hex[:8]}"

    repo_a = Repository(
        id=repo_a_id,
        workspace_id=ws.id,
        name="AlphaRepo",
        url="https://github.com/test/alpha",
        default_branch="main",
        analysis_status="completed",
        metadata_json={"primary_language": "Python", "analysis_summary": {"total_files": 2, "total_symbols": 2, "total_lines": 50}},
    )
    repo_b = Repository(
        id=repo_b_id,
        workspace_id=ws.id,
        name="BetaRepo",
        url="https://github.com/test/beta",
        default_branch="main",
        analysis_status="completed",
        metadata_json={"primary_language": "TypeScript", "analysis_summary": {"total_files": 2, "total_symbols": 2, "total_lines": 60}},
    )
    db_session.add_all([repo_a, repo_b])
    await db_session.flush()

    file_a = File(
        id=f"file-a-{uuid.uuid4().hex[:8]}",
        repository_id=repo_a_id,
        path="src/alpha_authenticate.py",
        language="python",
        line_count=25,
        size_bytes=400,
    )
    file_b = File(
        id=f"file-b-{uuid.uuid4().hex[:8]}",
        repository_id=repo_b_id,
        path="src/beta_authenticate.ts",
        language="typescript",
        line_count=30,
        size_bytes=500,
    )
    db_session.add_all([file_a, file_b])
    await db_session.flush()

    sym_a = Symbol(
        id=f"sym-a-{uuid.uuid4().hex[:8]}",
        repository_id=repo_a_id,
        file_id=file_a.id,
        name="authenticate_alpha_user",
        symbol_type="function",
        qualified_name="src.alpha_authenticate.authenticate_alpha_user",
        start_line=5,
        end_line=15,
        docstring="Authenticates Alpha users.",
    )
    sym_b = Symbol(
        id=f"sym-b-{uuid.uuid4().hex[:8]}",
        repository_id=repo_b_id,
        file_id=file_b.id,
        name="authenticate_beta_user",
        symbol_type="function",
        qualified_name="src.beta_authenticate.authenticate_beta_user",
        start_line=4,
        end_line=18,
        docstring="Authenticates Beta users.",
    )
    db_session.add_all([sym_a, sym_b])
    await db_session.commit()

    # 1. Search in Repo A should NEVER return Repo B items
    search_a = await search_intelligence_service.search_repository(
        repository_id=repo_a_id,
        query_str="authenticate",
        search_type="all",
        db=db_session,
    )
    assert search_a["repository_id"] == repo_a_id
    assert any(s["name"] == "authenticate_alpha_user" for s in search_a["symbols"])
    assert not any(s["name"] == "authenticate_beta_user" for s in search_a["symbols"])
    assert any("alpha_authenticate.py" in f["path"] for f in search_a["files"])
    assert not any("beta_authenticate.ts" in f["path"] for f in search_a["files"])

    # 2. Search in Repo B should NEVER return Repo A items
    search_b = await search_intelligence_service.search_repository(
        repository_id=repo_b_id,
        query_str="authenticate",
        search_type="all",
        db=db_session,
    )
    assert search_b["repository_id"] == repo_b_id
    assert any(s["name"] == "authenticate_beta_user" for s in search_b["symbols"])
    assert not any(s["name"] == "authenticate_alpha_user" for s in search_b["symbols"])

    # 3. Q&A in Repo A returns only Repo A citations
    qa_res_a = await rag_service.answer_repository_query(
        repository_id=repo_a_id,
        question="Where is authentication implemented?",
        db=db_session,
    )
    assert qa_res_a["repository_id"] == repo_a_id
    assert len(qa_res_a["sources"]) > 0
    assert all(s["path"] == "src/alpha_authenticate.py" for s in qa_res_a["sources"])
    assert "src/alpha_authenticate.py" in qa_res_a["answer"]
    assert "beta_authenticate.ts" not in qa_res_a["answer"]


@pytest.mark.asyncio
async def test_unindexed_repository_handling(db_session: AsyncSession):
    """Verify querying an unindexed repository returns clear instructions."""
    ws = Workspace(id=f"ws-{uuid.uuid4().hex[:8]}", name="PendingWS", slug=f"pending-ws-{uuid.uuid4().hex[:6]}")
    db_session.add(ws)
    await db_session.flush()

    unindexed_id = f"unindexed-{uuid.uuid4().hex[:8]}"
    repo = Repository(
        id=unindexed_id,
        workspace_id=ws.id,
        name="PendingRepo",
        url="https://github.com/test/pending",
        default_branch="main",
        analysis_status="pending",
    )
    db_session.add(repo)
    await db_session.commit()

    res = await rag_service.answer_repository_query(
        repository_id=unindexed_id,
        question="Where is authentication implemented?",
        db=db_session,
    )
    assert "not been indexed yet" in res["answer"]
    assert res["sources"] == []


@pytest.mark.asyncio
async def test_deterministic_provider_formatting_and_grounding():
    """Verify GroundedDeterministicProvider produces grounded markdown sections."""
    provider = GroundedDeterministicProvider()
    
    # Prompt with evidence
    user_prompt = (
        "REPOSITORY METADATA:\n- Name: TestRepo\n- Primary Language: Python\n\n"
        "QUESTION: Where is user authentication implemented?\n"
        "DETECTED INTENT: SEARCH\n\n"
        "EVIDENCE (Use [source_1], [source_2] etc. to cite these):\n"
        "[source_1]\n"
        "Path: backend/app/auth.py\n"
        "Lines: 10–35\n"
        "Symbol: verify_token\n"
        "Type: function\n"
        "Relevance: 0.95\n"
        "<untrusted_source_code>\ndef verify_token(token: str):\n    return decode(token)\n</untrusted_source_code>"
    )

    result = await provider.generate(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt,
    )
    assert "answer" in result
    assert "cited_source_ids" in result
    assert "[source_1]" in result["answer"] or "source_1" in result["cited_source_ids"]
    assert "## Answer" in result["answer"]
    assert "## Evidence" in result["answer"]

    # Prompt with no evidence should return fallback
    empty_prompt = (
        "REPOSITORY METADATA:\n- Name: EmptyRepo\n\n"
        "QUESTION: Where is Kubernetes configured?\n"
        "DETECTED INTENT: SEARCH\n\n"
        "EVIDENCE:\nNo relevant source files or symbols were found in the indexed repository."
    )
    empty_res = await provider.generate(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=empty_prompt,
    )
    assert "I couldn't find enough evidence in this repository to answer confidently." in empty_res["answer"]
