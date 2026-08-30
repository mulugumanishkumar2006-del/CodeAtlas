import os
import pytest
import subprocess
import tempfile
from pathlib import Path

from backend.app.services.git_repository_service import (
    GitRepositoryService,
    GitValidationError,
    GitAuthenticationError,
    GitRepositoryNotFoundError,
    GitTimeoutError,
)


@pytest.fixture
def temp_git_service(tmp_path):
    service = GitRepositoryService()
    return service, tmp_path


@pytest.fixture
def local_git_origin(tmp_path):
    """
    Creates a real local Git repository to serve as a remote origin for tests.
    """
    origin_dir = tmp_path / "remote_origin.git"
    origin_dir.mkdir(parents=True, exist_ok=True)

    # Initialize a bare/standard repo
    subprocess.run(["git", "init", "-b", "main", str(origin_dir)], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "CodeAtlas Tester"], cwd=origin_dir, check=True)
    subprocess.run(["git", "config", "user.email", "tester@codeatlas.dev"], cwd=origin_dir, check=True)

    # Create an initial file and commit
    test_file = origin_dir / "README.md"
    test_file.write_text("# CodeAtlas Test Repo\nInitial content.")
    subprocess.run(["git", "add", "README.md"], cwd=origin_dir, check=True)
    subprocess.run(["git", "commit", "-m", "Initial commit"], cwd=origin_dir, check=True)

    # Get the initial commit SHA
    res = subprocess.run(["git", "rev-parse", "HEAD"], cwd=origin_dir, check=True, capture_output=True, text=True)
    initial_sha = res.stdout.strip()

    return origin_dir, initial_sha


class TestGitRepositoryServiceUnit:
    def test_url_validation_success(self):
        service = GitRepositoryService()
        valid_urls = [
            "https://github.com/fastapi/fastapi",
            "https://github.com/torvalds/linux.git",
            "https://gitlab.com/gitlab-org/gitlab",
            "git@github.com:owner/repo.git",
            "file:///path/to/repo",
        ]
        for url in valid_urls:
            assert service.validate_git_url(url) == url

    def test_url_validation_rejections(self):
        service = GitRepositoryService()
        invalid_urls = [
            "--upload-pack=evil",  # Flag injection
            "-o/tmp/pwn",          # Flag injection
            "https://github.com/owner/repo; rm -rf /",  # Command injection
            "https://github.com/owner/repo\nrm -rf /",  # Newline injection
            "ftp://invalid.protocol/repo",               # Unsupported protocol
            "",
            "   ",
        ]
        for url in invalid_urls:
            with pytest.raises(GitValidationError):
                service.validate_git_url(url)

    def test_repository_id_validation(self):
        service = GitRepositoryService()
        assert service.validate_repository_id("repo-123_abc") == "repo-123_abc"
        
        with pytest.raises(GitValidationError):
            service.validate_repository_id("../traversal")
        with pytest.raises(GitValidationError):
            service.validate_repository_id("repo/id")
        with pytest.raises(GitValidationError):
            service.validate_repository_id("")

    def test_storage_path_generation(self, monkeypatch, tmp_path):
        service = GitRepositoryService()
        monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(tmp_path))
        path = service.get_storage_path("test-uuid-123")
        assert path == tmp_path / "test-uuid-123" / "source"


class TestGitRepositoryServiceOperations:
    @pytest.mark.asyncio
    async def test_real_git_clone_and_commit_extraction(self, local_git_origin, monkeypatch, tmp_path):
        origin_dir, initial_sha = local_git_origin
        monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(tmp_path))

        service = GitRepositoryService()
        repo_id = "test-repo-clone-1"

        # 1. Perform shallow clone
        result = await service.clone_repository(
            repo_id=repo_id,
            url=str(origin_dir.as_uri()),
            default_branch="main",
        )

        assert result["status"] == "READY"
        assert result["branch"] == "main"
        assert result["commit_sha"] == initial_sha
        assert Path(result["clone_path"]).exists()
        assert (Path(result["clone_path"]) / "README.md").exists()

        # 2. Verify repository source
        is_valid, err = service.verify_repository_source(repo_id)
        assert is_valid is True
        assert err is None

        # 3. Retrieve commit and branch directly
        sha = service.get_current_commit(repo_id)
        branch = service.get_default_branch(repo_id)
        assert sha == initial_sha
        assert branch == "main"

    @pytest.mark.asyncio
    async def test_real_git_sync_updates_commit(self, local_git_origin, monkeypatch, tmp_path):
        origin_dir, initial_sha = local_git_origin
        monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(tmp_path))

        service = GitRepositoryService()
        repo_id = "test-repo-sync-1"

        # 1. Initial clone
        await service.clone_repository(
            repo_id=repo_id,
            url=str(origin_dir.as_uri()),
            default_branch="main",
        )

        # 2. Push a new commit to origin
        new_file = origin_dir / "NEW_FEATURE.md"
        new_file.write_text("# New Feature Added")
        subprocess.run(["git", "add", "NEW_FEATURE.md"], cwd=origin_dir, check=True)
        subprocess.run(["git", "commit", "-m", "Add feature"], cwd=origin_dir, check=True)

        res = subprocess.run(["git", "rev-parse", "HEAD"], cwd=origin_dir, check=True, capture_output=True, text=True)
        new_sha = res.stdout.strip()
        assert new_sha != initial_sha

        # 3. Perform sync
        sync_result = await service.sync_repository(
            repo_id=repo_id,
            url=str(origin_dir.as_uri()),
            branch="main",
        )

        assert sync_result["status"] == "READY"
        assert sync_result["commit_sha"] == new_sha
        assert (Path(sync_result["clone_path"]) / "NEW_FEATURE.md").exists()

    @pytest.mark.asyncio
    async def test_remove_repository_source_cleanup(self, local_git_origin, monkeypatch, tmp_path):
        origin_dir, _ = local_git_origin
        monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(tmp_path))

        service = GitRepositoryService()
        repo_id = "test-repo-remove-1"

        await service.clone_repository(
            repo_id=repo_id,
            url=str(origin_dir.as_uri()),
        )
        storage_path = service.get_storage_path(repo_id)
        assert storage_path.exists()

        # Remove local storage
        success = service.remove_repository_source(repo_id)
        assert success is True
        assert not storage_path.exists()
        # Origin must remain untouched
        assert origin_dir.exists()

    @pytest.mark.asyncio
    async def test_clone_nonexistent_repo_raises_error(self, monkeypatch, tmp_path):
        monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(tmp_path))
        service = GitRepositoryService()
        repo_id = "test-invalid-repo"

        with pytest.raises(Exception) as exc_info:
            await service.clone_repository(
                repo_id=repo_id,
                url="https://github.com/nonexistent-org-01928374/fake-repo-99887766",
            )
        assert "not found" in str(exc_info.value).lower() or "authentication" in str(exc_info.value).lower()
