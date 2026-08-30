import os
import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient


@pytest.fixture
def local_git_origin(tmp_path):
    origin_dir = tmp_path / "remote_api_repo.git"
    origin_dir.mkdir(parents=True, exist_ok=True)

    subprocess.run(["git", "init", "-b", "main", str(origin_dir)], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "CodeAtlas API Tester"], cwd=origin_dir, check=True)
    subprocess.run(["git", "config", "user.email", "tester@codeatlas.dev"], cwd=origin_dir, check=True)

    sample_file = origin_dir / "index.py"
    sample_file.write_text("print('Hello from CodeAtlas real repo!')\n")
    subprocess.run(["git", "add", "index.py"], cwd=origin_dir, check=True)
    subprocess.run(["git", "commit", "-m", "Initial commit for API test"], cwd=origin_dir, check=True)

    res = subprocess.run(["git", "rev-parse", "HEAD"], cwd=origin_dir, check=True, capture_output=True, text=True)
    initial_sha = res.stdout.strip()

    return origin_dir, initial_sha


@pytest.mark.asyncio
async def test_repository_acquisition_api_lifecycle(client: AsyncClient, local_git_origin, monkeypatch, tmp_path):
    origin_dir, initial_sha = local_git_origin
    storage_root = tmp_path / "app_repo_storage"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    # 1. Register repository
    create_res = await client.post(
        "/api/v1/repositories",
        json={
            "name": "test-owner/api-test-repo",
            "url": str(origin_dir.as_uri()),
            "default_branch": "main",
            "description": "API Test Repo for Phase 4 Git Acquisition",
        },
    )
    assert create_res.status_code == 201
    repo_data = create_res.json()
    repo_id = repo_data["id"]
    assert repo_data["acquisition_status"] == "NOT_CLONED"

    # 2. Check initial status endpoint
    status_res = await client.get(f"/api/v1/repositories/{repo_id}/status")
    assert status_res.status_code == 200
    assert status_res.json()["status"] in ("NOT_CLONED", "CLONING", "READY")

    # 3. Trigger Git Clone via POST /repositories/{id}/clone
    clone_res = await client.post(f"/api/v1/repositories/{repo_id}/clone")
    assert clone_res.status_code == 200
    clone_data = clone_res.json()
    assert clone_data["status"] in ("CLONING", "READY")
    assert clone_data["commit_sha"] == initial_sha
    assert clone_data["branch"] == "main"

    # 4. Verify status endpoint returns READY and real commit SHA
    status_ready_res = await client.get(f"/api/v1/repositories/{repo_id}/status")
    assert status_ready_res.status_code == 200
    assert status_ready_res.json()["status"] == "READY"
    assert status_ready_res.json()["commit_sha"] == initial_sha

    # 5. Push a second commit to the remote origin
    doc_file = origin_dir / "DOCS.md"
    doc_file.write_text("# Documentation added\n")
    subprocess.run(["git", "add", "DOCS.md"], cwd=origin_dir, check=True)
    subprocess.run(["git", "commit", "-m", "Add docs"], cwd=origin_dir, check=True)
    res = subprocess.run(["git", "rev-parse", "HEAD"], cwd=origin_dir, check=True, capture_output=True, text=True)
    new_sha = res.stdout.strip()
    assert new_sha != initial_sha

    # 6. Trigger Git Sync via POST /repositories/{id}/sync
    sync_res = await client.post(f"/api/v1/repositories/{repo_id}/sync")
    assert sync_res.status_code == 200
    sync_data = sync_res.json()
    assert sync_data["status"] == "READY"
    assert sync_data["commit_sha"] == new_sha

    # 7. Verify source directory exists on disk with files
    source_dir = storage_root / repo_id / "source"
    assert source_dir.exists()
    assert (source_dir / "index.py").exists()
    assert (source_dir / "DOCS.md").exists()

    # 8. Delete repository and verify local cleanup
    del_res = await client.delete(f"/api/v1/repositories/{repo_id}")
    assert del_res.status_code == 204

    # Verify source directory was removed locally
    assert not (storage_root / repo_id).exists()
    # Verify remote origin remains intact
    assert origin_dir.exists()


@pytest.mark.asyncio
async def test_clone_invalid_or_failing_repo_reports_error(client: AsyncClient, monkeypatch, tmp_path):
    storage_root = tmp_path / "app_repo_storage_err"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    # Register with a non-existent GitHub URL
    create_res = await client.post(
        "/api/v1/repositories",
        json={
            "name": "fake-org/non-existent-repo-9999",
            "url": "https://github.com/fake-org-404-not-found/fake-repo-99999.git",
            "default_branch": "main",
        },
    )
    assert create_res.status_code == 201
    repo_id = create_res.json()["id"]

    # Trigger clone
    clone_res = await client.post(f"/api/v1/repositories/{repo_id}/clone")
    assert clone_res.status_code == 200
    clone_data = clone_res.json()
    assert clone_data["status"] == "ERROR"
    assert clone_data["error"] is not None

    # Check status endpoint also reflects ERROR
    status_res = await client.get(f"/api/v1/repositories/{repo_id}/status")
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "ERROR"
    assert status_res.json()["error"] is not None
