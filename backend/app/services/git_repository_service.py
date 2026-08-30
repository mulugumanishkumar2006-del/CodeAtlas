import asyncio
import logging
import os
import re
import shutil
import stat
import subprocess
import time
from pathlib import Path
from typing import Optional, Dict, Any, Tuple
from urllib.parse import urlparse

from backend.app.config import settings

logger = logging.getLogger("codeatlas.git_service")


class GitServiceError(Exception):
    """Base exception for Git operations."""
    pass


class GitAuthenticationError(GitServiceError):
    """Raised when repository requires authentication (e.g. private repo)."""
    pass


class GitRepositoryNotFoundError(GitServiceError):
    """Raised when repository does not exist or remote host cannot be reached."""
    pass


class GitTimeoutError(GitServiceError):
    """Raised when git command times out."""
    pass


class GitValidationError(GitServiceError):
    """Raised when URL or repository identifier is invalid or unsafe."""
    pass


def _on_rm_error(func, path, exc_info):
    """
    Error handler for shutil.rmtree on Windows to clear readonly attributes
    on files (such as .git objects) and retry deletion.
    """
    try:
        os.chmod(path, stat.S_IWRITE | stat.S_IREAD)
        func(path)
    except Exception as e:
        logger.warning(f"Failed to force-delete {path}: {e}")


class GitRepositoryService:
    def __init__(self):
        self._locks: Dict[str, asyncio.Lock] = {}
        self._global_lock = asyncio.Lock()
        self._active_operations: Dict[str, str] = {}  # repo_id -> "CLONING" | "SYNCING"

    async def _get_repo_lock(self, repo_id: str) -> asyncio.Lock:
        async with self._global_lock:
            if repo_id not in self._locks:
                self._locks[repo_id] = asyncio.Lock()
            return self._locks[repo_id]

    def is_operation_in_progress(self, repo_id: str) -> Optional[str]:
        return self._active_operations.get(repo_id)

    def validate_repository_id(self, repo_id: str) -> str:
        """
        Ensure repository ID is safe and does not contain path traversal characters.
        """
        if not repo_id or not re.match(r"^[a-zA-Z0-9_\-]+$", repo_id):
            raise GitValidationError(f"Invalid repository identifier: {repo_id}")
        return repo_id

    def validate_git_url(self, url: str) -> str:
        """
        Validate Git repository URL to prevent command injection, dangerous flags,
        and unsafe protocols.
        """
        if not url or not isinstance(url, str):
            raise GitValidationError("Repository URL is required and must be a string.")
        
        cleaned_url = url.strip()
        
        # Disallow arguments starting with '-' (flag injection defense)
        if cleaned_url.startswith("-"):
            raise GitValidationError("Repository URL cannot start with a dash.")
        
        # Disallow command injection characters
        forbidden_chars = [";", "&", "|", "`", "$", "\n", "\r", "\t", " "]
        for ch in forbidden_chars:
            if ch in cleaned_url:
                raise GitValidationError(f"Repository URL contains illegal character: '{ch}'")
        
        parsed = urlparse(cleaned_url)
        # Allow standard https/http and git protocols
        if parsed.scheme in ["https", "http", "git"]:
            if not parsed.netloc or not parsed.path or len(parsed.path.strip("/")) == 0:
                raise GitValidationError(f"Invalid URL structure: '{cleaned_url}'")
            return cleaned_url
        elif cleaned_url.startswith("git@") and ":" in cleaned_url:
            # SSH format (e.g. git@github.com:owner/repo.git)
            return cleaned_url
        elif cleaned_url.startswith("file://"):
            # Allow file:// only for controlled local testing fixtures
            return cleaned_url
        else:
            raise GitValidationError(
                f"Unsupported URL protocol for '{cleaned_url}'. Must use HTTPS, HTTP, or Git protocol."
            )

    def get_storage_path(self, repo_id: str) -> Path:
        """
        Get the root storage directory for a repository's source code.
        Format: <storage_root>/<repo_id>/source
        """
        safe_id = self.validate_repository_id(repo_id)
        base_dir = Path(settings.repository_storage_root)
        return base_dir / safe_id / "source"

    def _run_git_command(
        self,
        args: list[str],
        cwd: Optional[Path | str] = None,
        timeout: int = 120,
    ) -> Tuple[int, str, str]:
        """
        Execute git commands safely using subprocess without shell=True.
        Enforces non-interactive terminal prompt and timeouts.
        """
        env = os.environ.copy()
        # Prevent git from hanging waiting for interactive user credentials
        env["GIT_TERMINAL_PROMPT"] = "0"
        env["GIT_ASKPASS"] = "echo"
        env["LC_ALL"] = "C"
        env["LANG"] = "C"

        cmd_str = " ".join(args)
        logger.debug(f"Running git command: {cmd_str} (cwd={cwd})")

        try:
            result = subprocess.run(
                args,
                cwd=str(cwd) if cwd else None,
                capture_output=True,
                text=True,
                timeout=timeout,
                shell=False,
                env=env,
            )
            return result.returncode, result.stdout.strip(), result.stderr.strip()
        except subprocess.TimeoutExpired as e:
            logger.error(f"Git command timed out after {timeout}s: {cmd_str}")
            raise GitTimeoutError(f"Git operation timed out after {timeout} seconds.")
        except FileNotFoundError:
            logger.error("Git executable not found on system PATH.")
            raise GitServiceError("Git is not installed or not available on the system PATH.")
        except Exception as e:
            logger.error(f"Error executing git command '{cmd_str}': {e}")
            raise GitServiceError(f"Failed to execute git command: {str(e)}")

    def _sanitize_error_message(self, stderr: str) -> str:
        """
        Sanitize git stderr to remove sensitive tokens or credentials while
        providing actionable, user-friendly error messages.
        """
        if not stderr:
            return "Unknown Git error occurred."

        lower_err = stderr.lower()

        if "authentication failed" in lower_err or "terminal prompts disabled" in lower_err or "could not read username" in lower_err:
            return "Authentication required: Repository is private or requires valid credentials."
        if "repository not found" in lower_err or "remote: repository not found" in lower_err or "not found" in lower_err:
            return "Repository not found: Please verify the URL exists and is publicly accessible."
        if "could not resolve host" in lower_err or "unable to access" in lower_err:
            return "Network failure: Unable to reach remote Git server."
        if "permission denied" in lower_err:
            return "Permission denied: Access to repository was refused."
        if "timed out" in lower_err or "operation timed out" in lower_err:
            return "Git operation timed out while communicating with remote."
        
        # Scrub any token patterns like https://<token>@
        sanitized = re.sub(r"://[^@]+@", "://***@", stderr)
        # Limit length to avoid massive output
        return sanitized[:300]

    def verify_repository_source(self, repo_id: str) -> Tuple[bool, Optional[str]]:
        """
        Verify that a repository's source directory exists, has a valid .git directory,
        and has a resolvable HEAD commit.
        """
        source_dir = self.get_storage_path(repo_id)
        if not source_dir.exists() or not source_dir.is_dir():
            return False, "Source directory does not exist."

        git_dir = source_dir / ".git"
        if not git_dir.exists():
            return False, "Git metadata (.git) directory not found."

        try:
            code, stdout, stderr = self._run_git_command(["git", "rev-parse", "HEAD"], cwd=source_dir, timeout=10)
            if code != 0 or not stdout:
                return False, f"HEAD could not be resolved: {self._sanitize_error_message(stderr)}"
            return True, None
        except Exception as e:
            return False, f"Verification failed: {str(e)}"

    def get_current_commit(self, repo_id: str) -> Optional[str]:
        """
        Retrieve the real current HEAD commit SHA from the repository working tree.
        """
        source_dir = self.get_storage_path(repo_id)
        if not source_dir.exists():
            return None

        try:
            code, stdout, _ = self._run_git_command(["git", "rev-parse", "HEAD"], cwd=source_dir, timeout=10)
            if code == 0 and stdout:
                return stdout.strip()
        except Exception as e:
            logger.warning(f"Failed to get current commit for repo {repo_id}: {e}")
        return None

    def get_default_branch(self, repo_id: str) -> Optional[str]:
        """
        Retrieve the current active branch name from the local git working tree.
        """
        source_dir = self.get_storage_path(repo_id)
        if not source_dir.exists():
            return None

        try:
            # Try symbolic-ref first
            code, stdout, _ = self._run_git_command(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=source_dir, timeout=10)
            if code == 0 and stdout and stdout != "HEAD":
                return stdout.strip()
        except Exception as e:
            logger.warning(f"Failed to get default branch for repo {repo_id}: {e}")
        return None

    def remove_repository_source(self, repo_id: str) -> bool:
        """
        Safely remove the local storage directory for a repository.
        Does NOT touch any remote Git server or GitHub repositories.
        """
        safe_id = self.validate_repository_id(repo_id)
        repo_dir = Path(settings.repository_storage_root) / safe_id
        
        if not repo_dir.exists():
            logger.info(f"Repository directory for {repo_id} does not exist. Nothing to remove.")
            return True

        logger.info(f"Removing local repository source for {repo_id} at {repo_dir}")
        try:
            shutil.rmtree(str(repo_dir), onerror=_on_rm_error)
            logger.info(f"Successfully cleaned up source directory for repository {repo_id}")
            return True
        except Exception as e:
            logger.error(f"Error removing repository storage for {repo_id}: {e}")
            return False

    async def clone_repository(
        self,
        repo_id: str,
        url: str,
        default_branch: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Perform real Git clone with shallow depth (--depth 1) into CodeAtlas storage.
        Prevents concurrent operations and captures real commit SHA and branch.
        """
        safe_id = self.validate_repository_id(repo_id)
        clean_url = self.validate_git_url(url)
        lock = await self._get_repo_lock(safe_id)

        async with lock:
            if self._active_operations.get(safe_id):
                current_op = self._active_operations[safe_id]
                logger.info(f"Operation '{current_op}' already running for repository {safe_id}. Reusing state.")
                return {
                    "repository_id": safe_id,
                    "status": current_op,
                    "already_in_progress": True,
                }

            self._active_operations[safe_id] = "CLONING"
            start_time = time.time()
            logger.info(f"Repository acquisition started: repo_id={safe_id}, url={clean_url}")

            target_dir = self.get_storage_path(safe_id)

            try:
                # Run the blocking Git command in an async executor thread
                def _do_clone() -> Dict[str, Any]:
                    # If target directory already exists with a valid Git repo, verify it
                    if target_dir.exists():
                        is_valid, _ = self.verify_repository_source(safe_id)
                        if is_valid:
                            commit_sha = self.get_current_commit(safe_id)
                            branch = self.get_default_branch(safe_id) or default_branch or "main"
                            return {
                                "success": True,
                                "branch": branch,
                                "commit_sha": commit_sha,
                                "clone_path": str(target_dir),
                                "reused_existing": True,
                            }
                        else:
                            # Clean up dirty/incomplete directory before fresh clone
                            self.remove_repository_source(safe_id)

                    # Ensure parent directories exist
                    target_dir.parent.mkdir(parents=True, exist_ok=True)

                    # Prepare clone command
                    cmd = ["git", "clone", "--depth", "1"]
                    if default_branch:
                        cmd.extend(["-b", default_branch])
                    cmd.extend([clean_url, str(target_dir)])

                    code, stdout, stderr = self._run_git_command(cmd, timeout=180)

                    # If specific branch failed, attempt clone without -b
                    if code != 0 and default_branch and "Remote branch" in stderr:
                        logger.warning(f"Branch '{default_branch}' not found for {safe_id}, falling back to remote default branch.")
                        if target_dir.exists():
                            self.remove_repository_source(safe_id)
                        fallback_cmd = ["git", "clone", "--depth", "1", clean_url, str(target_dir)]
                        code, stdout, stderr = self._run_git_command(fallback_cmd, timeout=180)

                    if code != 0:
                        # Clone failed
                        if target_dir.exists():
                            self.remove_repository_source(safe_id)
                        sanitized_err = self._sanitize_error_message(stderr)
                        logger.error(f"Repository acquisition failed: repo_id={safe_id}, error={sanitized_err}")
                        if "Authentication required" in sanitized_err:
                            raise GitAuthenticationError(sanitized_err)
                        elif "not found" in sanitized_err.lower():
                            raise GitRepositoryNotFoundError(sanitized_err)
                        else:
                            raise GitServiceError(sanitized_err)

                    # Verify clone integrity
                    is_valid, err = self.verify_repository_source(safe_id)
                    if not is_valid:
                        if target_dir.exists():
                            self.remove_repository_source(safe_id)
                        raise GitServiceError(f"Post-clone verification failed: {err}")

                    commit_sha = self.get_current_commit(safe_id)
                    branch = self.get_default_branch(safe_id) or default_branch or "main"

                    return {
                        "success": True,
                        "branch": branch,
                        "commit_sha": commit_sha,
                        "clone_path": str(target_dir),
                    }

                loop = asyncio.get_running_loop()
                result = await loop.run_in_executor(None, _do_clone)
                duration = round(time.time() - start_time, 2)
                logger.info(
                    f"Repository clone completed: repo_id={safe_id}, duration={duration}s, "
                    f"branch={result.get('branch')}, commit_sha={result.get('commit_sha')}"
                )
                return {
                    "repository_id": safe_id,
                    "status": "READY",
                    "branch": result.get("branch"),
                    "commit_sha": result.get("commit_sha"),
                    "clone_path": result.get("clone_path"),
                    "duration_seconds": duration,
                }
            finally:
                self._active_operations.pop(safe_id, None)

    async def sync_repository(
        self,
        repo_id: str,
        url: str,
        branch: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Synchronize an existing cloned repository with the latest remote commit.
        If repository has not been cloned yet, executes initial clone.
        """
        safe_id = self.validate_repository_id(repo_id)
        clean_url = self.validate_git_url(url)
        lock = await self._get_repo_lock(safe_id)

        async with lock:
            if self._active_operations.get(safe_id):
                current_op = self._active_operations[safe_id]
                logger.info(f"Operation '{current_op}' already running for repository {safe_id}. Reusing state.")
                return {
                    "repository_id": safe_id,
                    "status": current_op,
                    "already_in_progress": True,
                }

            target_dir = self.get_storage_path(safe_id)
            is_valid, _ = self.verify_repository_source(safe_id)

            if not is_valid:
                # Trigger initial clone if not cloned or invalid
                logger.info(f"Repository {safe_id} not cloned yet. Performing initial clone during sync.")
                return await self.clone_repository(safe_id, clean_url, default_branch=branch)

            self._active_operations[safe_id] = "SYNCING"
            start_time = time.time()
            logger.info(f"Repository sync started: repo_id={safe_id}")

            try:
                def _do_sync() -> Dict[str, Any]:
                    target_branch = branch or self.get_default_branch(safe_id) or "main"
                    fetch_cmd = ["git", "fetch", "--depth", "1", "origin", target_branch]
                    code, stdout, stderr = self._run_git_command(fetch_cmd, cwd=target_dir, timeout=120)

                    if code != 0:
                        # Try generic fetch
                        fallback_fetch = ["git", "fetch", "--depth", "1", "origin"]
                        code, stdout, stderr = self._run_git_command(fallback_fetch, cwd=target_dir, timeout=120)

                    if code != 0:
                        sanitized_err = self._sanitize_error_message(stderr)
                        logger.error(f"Repository sync failed during fetch: repo_id={safe_id}, error={sanitized_err}")
                        raise GitServiceError(f"Fetch failed: {sanitized_err}")

                    # Reset working tree to FETCH_HEAD
                    reset_cmd = ["git", "reset", "--hard", "FETCH_HEAD"]
                    code, stdout, stderr = self._run_git_command(reset_cmd, cwd=target_dir, timeout=60)
                    if code != 0:
                        sanitized_err = self._sanitize_error_message(stderr)
                        logger.error(f"Repository sync failed during reset: repo_id={safe_id}, error={sanitized_err}")
                        raise GitServiceError(f"Reset failed: {sanitized_err}")

                    commit_sha = self.get_current_commit(safe_id)
                    current_branch = self.get_default_branch(safe_id) or target_branch

                    return {
                        "success": True,
                        "branch": current_branch,
                        "commit_sha": commit_sha,
                        "clone_path": str(target_dir),
                    }

                loop = asyncio.get_running_loop()
                result = await loop.run_in_executor(None, _do_sync)
                duration = round(time.time() - start_time, 2)
                logger.info(
                    f"Repository sync completed: repo_id={safe_id}, duration={duration}s, "
                    f"branch={result.get('branch')}, commit_sha={result.get('commit_sha')}"
                )
                return {
                    "repository_id": safe_id,
                    "status": "READY",
                    "branch": result.get("branch"),
                    "commit_sha": result.get("commit_sha"),
                    "clone_path": result.get("clone_path"),
                    "duration_seconds": duration,
                }
            finally:
                self._active_operations.pop(safe_id, None)


# Global singleton instance
git_service = GitRepositoryService()
