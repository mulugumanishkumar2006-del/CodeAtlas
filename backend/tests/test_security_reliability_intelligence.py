import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.workspace import Workspace
from backend.app.services.repository_ingestion_service import ingestion_service
from backend.app.services.security_reliability_service import security_reliability_service, SecurityReliabilityService


def _create_git_repo(path: Path, files: dict[str, str], commit_msg: str = "Initial commit"):
    path.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "TestUser"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=str(path), check=True, capture_output=True)

    for rel_path, content in files.items():
        full_path = path / rel_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content, encoding="utf-8")
        subprocess.run(["git", "add", rel_path], cwd=str(path), check=True, capture_output=True)

    subprocess.run(["git", "commit", "-m", commit_msg], cwd=str(path), check=True, capture_output=True)


# =========================================================================
# UNIT TESTS
# =========================================================================

def test_01_secret_detection_and_redaction():
    """
    Test 1: Hardcoded API keys, Stripe tokens, and private keys are detected and safely redacted.
    """
    svc = SecurityReliabilityService()
    code = (
        'API_KEY = "prod_custom_secret_key_value_987654321"\n'
        'AWS_KEY = "AKIAIOSFODNN7EXAMPLE"\n'
        'PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----\\nMIIE...\\n-----END RSA PRIVATE KEY-----"\n'
    )
    findings = svc.scan_file_for_secrets("config/keys.py", code)
    assert len(findings) >= 2

    # Verify redaction
    for f in findings:
        assert "prod_custom_secret_key_value_987654321" not in f["evidence_snippet"]
        assert "AKIAIOSFODNN7EXAMPLE" not in f["evidence_snippet"]
        assert "****" in f["evidence_snippet"] or "[REDACTED]" in f["evidence_snippet"]


def test_02_secret_false_positive_suppression():
    """
    Test 2: Placeholders ('YOUR_API_KEY', 'changeme') and os.getenv are not flagged as real secrets.
    """
    svc = SecurityReliabilityService()
    code = (
        'API_KEY = "YOUR_API_KEY"\n'
        'PASSWORD = "changeme"\n'
        'SAFE_KEY = os.getenv("STRIPE_KEY")\n'
    )
    findings = svc.scan_file_for_secrets("config/settings.py", code)
    assert len(findings) == 0


def test_03_sql_injection_detection_and_parameterized_safety():
    """
    Test 3: String formatting in SQL calls is flagged; parameterized queries are safe.
    """
    svc = SecurityReliabilityService()

    unsafe_code = (
        'def get_user(cursor, user_id):\n'
        '    cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")\n'
    )
    findings_unsafe = svc.analyze_python_ast_security("services/user.py", unsafe_code)
    assert any(f["category"] == "INJECTION" and "SQL Injection" in f["title"] for f in findings_unsafe)

    safe_code = (
        'def get_user_safe(cursor, user_id):\n'
        '    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))\n'
    )
    findings_safe = svc.analyze_python_ast_security("services/user.py", safe_code)
    assert not any(f["category"] == "INJECTION" and "SQL Injection" in f["title"] for f in findings_safe)


def test_04_command_injection_detection():
    """
    Test 4: subprocess with shell=True is flagged as potential command execution risk.
    """
    svc = SecurityReliabilityService()
    code = (
        'import subprocess\n'
        'def run_cmd(user_arg):\n'
        '    subprocess.run(f"echo {user_arg}", shell=True)\n'
    )
    findings = svc.analyze_python_ast_security("utils/runner.py", code)
    assert any(f["category"] == "COMMAND_EXECUTION" for f in findings)


def test_05_missing_timeout_detection():
    """
    Test 5: HTTP network requests without timeout are flagged as reliability risks.
    """
    svc = SecurityReliabilityService()

    unsafe_code = (
        'import requests\n'
        'def fetch_data(url):\n'
        '    return requests.get(url)\n'
    )
    findings_unsafe = svc.analyze_python_ast_security("clients/api.py", unsafe_code)
    assert any(f["category"] == "TIMEOUT" for f in findings_unsafe)

    safe_code = (
        'import requests\n'
        'def fetch_data_safe(url):\n'
        '    return requests.get(url, timeout=10.0)\n'
    )
    findings_safe = svc.analyze_python_ast_security("clients/api.py", safe_code)
    assert not any(f["category"] == "TIMEOUT" for f in findings_safe)


# =========================================================================
# INTEGRATION TESTS
# =========================================================================

@pytest.fixture
async def setup_security_repo_a(tmp_path, db_session: AsyncSession):
    """
    Repository A with hardcoded secrets, SQL injection, missing timeouts, and dependencies:
    - config/settings.py: API key, DEBUG = True
    - db/query.py: SQL injection
    - clients/http.py: requests.get without timeout
    - requirements.txt: real dependencies
    """
    repo_dir = tmp_path / "sec_repo_a"
    files = {
        "config/settings.py": (
            'DEBUG = True\n'
            'API_KEY = "prod_custom_secret_key_value_987654321"\n'
        ),
        "db/query.py": (
            'def search(cursor, term):\n'
            '    cursor.execute(f"SELECT * FROM items WHERE name = \'{term}\'")\n'
        ),
        "clients/http.py": (
            'import requests\n'
            'def call_service(url):\n'
            '    return requests.get(url)\n'
        ),
        "requirements.txt": (
            'fastapi==0.110.0\n'
            'requests==2.31.0\n'
            'stripe>=8.0.0\n'
        ),
    }
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="sec_repo_a",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    await ingestion_service.ingest_repository(repo.id, db=db_session)
    await db_session.refresh(repo)
    return repo


@pytest.fixture
async def setup_security_repo_b(tmp_path, db_session: AsyncSession):
    """
    Repository B with clean code and no vulnerabilities.
    """
    repo_dir = tmp_path / "sec_repo_b"
    files = {
        "main.py": (
            'def calculate(a: int, b: int) -> int:\n'
            '    return a + b\n'
        ),
    }
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="sec_repo_b",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    await ingestion_service.ingest_repository(repo.id, db=db_session)
    await db_session.refresh(repo)
    return repo


@pytest.mark.asyncio
async def test_06_security_summary_endpoint(client: AsyncClient, setup_security_repo_a):
    """
    Test 6: GET /security returns Security and Reliability scores, breakdowns, and findings.
    """
    repo = setup_security_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/security")
    assert res.status_code == 200
    data = res.json()

    assert data["repository_id"] == repo.id
    assert 0 <= data["security_score"] <= 100
    assert 0 <= data["reliability_score"] <= 100
    assert data["secrets_count"] >= 1
    assert data["injections_count"] >= 1
    assert data["missing_timeouts_count"] >= 1
    assert data["total_dependencies"] >= 3
    assert len(data["external_services"]) >= 1  # Stripe detected from requirements.txt / code


@pytest.mark.asyncio
async def test_07_security_findings_filtering(client: AsyncClient, setup_security_repo_a):
    """
    Test 7: GET /security/findings supports type and category filtering.
    """
    repo = setup_security_repo_a

    # Filter by finding_type = SECURITY
    res_sec = await client.get(f"/api/v1/repositories/{repo.id}/security/findings?finding_type=SECURITY")
    assert res_sec.status_code == 200
    data_sec = res_sec.json()
    assert all(f["finding_type"] == "SECURITY" for f in data_sec["findings"])
    assert data_sec["total"] >= 2

    # Filter by category = TIMEOUT
    res_timeout = await client.get(f"/api/v1/repositories/{repo.id}/security/findings?category=TIMEOUT")
    assert res_timeout.status_code == 200
    data_timeout = res_timeout.json()
    assert all(f["category"] == "TIMEOUT" for f in data_timeout["findings"])


@pytest.mark.asyncio
async def test_08_security_dependencies_endpoint(client: AsyncClient, setup_security_repo_a):
    """
    Test 8: GET /security/dependencies returns real package metadata without fabricated CVEs.
    """
    repo = setup_security_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/security/dependencies")
    assert res.status_code == 200
    data = res.json()

    assert data["total"] >= 3
    pkg_names = [d["package_name"] for d in data["dependencies"]]
    assert "fastapi" in pkg_names
    assert "requests" in pkg_names
    # Verify no fake CVEs
    for dep in data["dependencies"]:
        assert dep["risk_status"] == "No verified vulnerability data available"


@pytest.mark.asyncio
async def test_09_repository_isolation_and_switching(
    client: AsyncClient, setup_security_repo_a, setup_security_repo_b
):
    """
    Test 9: Strict repository isolation across Repo A -> Repo B -> Repo A.
    """
    repo_a = setup_security_repo_a
    repo_b = setup_security_repo_b

    # Query A
    res_a = await client.get(f"/api/v1/repositories/{repo_a.id}/security/findings")
    assert res_a.status_code == 200
    findings_a = res_a.json()["findings"]
    assert any(f["category"] == "SECRET_EXPOSURE" for f in findings_a)

    # Query B
    res_b = await client.get(f"/api/v1/repositories/{repo_b.id}/security/findings")
    assert res_b.status_code == 200
    findings_b = res_b.json()["findings"]
    assert len(findings_b) == 0  # Repo B is pristine

    res_b_summary = await client.get(f"/api/v1/repositories/{repo_b.id}/security")
    assert res_b_summary.status_code == 200
    assert res_b_summary.json()["security_score"] == 100.0

    # Query A again (round-trip state restoration)
    res_a2 = await client.get(f"/api/v1/repositories/{repo_a.id}/security/findings")
    assert res_a2.status_code == 200
    assert res_a2.json()["total"] == len(findings_a)


@pytest.mark.asyncio
async def test_10_qa_security_query_integration(client: AsyncClient, setup_security_repo_a):
    """
    Test 10: Asking security & vulnerability questions to Q&A returns grounded findings.
    """
    repo = setup_security_repo_a
    query_payload = {
        "question": "What security vulnerabilities and hardcoded secrets exist in this repository?",
    }
    res = await client.post(f"/api/v1/repositories/{repo.id}/query", json=query_payload)
    assert res.status_code == 200
    data = res.json()

    assert data["answer"] != ""
    assert len(data["sources"]) > 0
    # Must cite settings.py or query.py
    cited = [s["path"] for s in data["sources"]]
    assert any("settings.py" in p or "query.py" in p for p in cited)
