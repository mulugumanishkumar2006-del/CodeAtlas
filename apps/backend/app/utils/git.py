import logging
import subprocess
from datetime import datetime, timezone
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


def run_git_command(repo_dir: str, args: List[str]) -> str:
    """Helper to run git command in the specified directory and capture output."""
    try:
        result = subprocess.run(
            ["git"] + args,
            cwd=repo_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="ignore",
            check=True,
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        logger.error(f"Git command failed: git {' '.join(args)}: {e.stderr}")
        raise RuntimeError(f"Git command failed: {e.stderr.strip()}") from e


def get_commit_history(repo_dir: str) -> List[Dict[str, Any]]:
    """
    Get a chronological list of commits in the repository.
    Returns:
        List of dicts: [
            {
                "sha": str,
                "author_name": str,
                "author_email": str,
                "committed_at": datetime (UTC),
                "message": str
            }
        ]
    """
    # %H - commit hash, %an - author name, %ae - author email, %at - author date (unix timestamp), %s - subject
    output = run_git_command(
        repo_dir, ["log", "--pretty=format:%H|%an|%ae|%at|%s", "--reverse"]
    )
    commits = []
    if not output:
        return commits

    for line in output.split("\n"):
        parts = line.strip().split("|", 4)
        if len(parts) < 5:
            continue
        sha, name, email, timestamp_str, message = parts
        try:
            committed_at = datetime.fromtimestamp(int(timestamp_str), tz=timezone.utc)
        except ValueError:
            committed_at = datetime.now(timezone.utc)

        commits.append(
            {
                "sha": sha,
                "author_name": name,
                "author_email": email,
                "committed_at": committed_at,
                "message": message,
            }
        )
    return commits


def get_current_ref(repo_dir: str) -> str:
    """Get the current commit SHA or branch name (to restore later)."""
    # Check if we are on a branch
    branch = run_git_command(repo_dir, ["rev-parse", "--abbrev-ref", "HEAD"])
    if branch != "HEAD":
        return branch
    # If in detached HEAD state, return the commit SHA
    return run_git_command(repo_dir, ["rev-parse", "HEAD"])


def checkout_commit(repo_dir: str, sha: str) -> None:
    """Check out the given commit SHA or branch ref."""
    run_git_command(repo_dir, ["checkout", sha, "--force"])


def restore_ref(repo_dir: str, ref: str) -> None:
    """Restore the git working directory to the original branch/commit."""
    try:
        checkout_commit(repo_dir, ref)
    except Exception as e:
        logger.error(f"Failed to restore original branch/ref {ref}: {e}")
        # fallback: checkout main or master if original ref restore fails
        try:
            checkout_commit(repo_dir, "main")
        except Exception:
            try:
                checkout_commit(repo_dir, "master")
            except Exception:
                pass
