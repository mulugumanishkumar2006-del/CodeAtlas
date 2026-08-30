import os
import re
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

from backend.app.services.git_repository_service import git_service

logger = logging.getLogger("codeatlas.source_code")

# Extensions commonly considered binary
BINARY_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svgz", ".webp", ".pdf",
    ".zip", ".tar", ".gz", ".7z", ".rar", ".exe", ".dll", ".so", ".dylib",
    ".bin", ".pyc", ".pyo", ".class", ".jar", ".war", ".ear", ".wasm",
    ".woff", ".woff2", ".ttf", ".eot", ".mp3", ".mp4", ".wav", ".avi",
    ".db", ".sqlite", ".sqlite3"
}


class SourceCodeService:
    """
    Secure retrieval and search service for repository source code.
    Reads directly from repository local checkouts with strict path traversal prevention,
    binary detection, and line coordinate accuracy.
    """

    def _resolve_safe_file_path(self, repository_id: str, file_path: str) -> Optional[Path]:
        """
        Resolves the absolute path to a file inside the repository checkout.
        Ensures strict sandboxing against directory traversal (e.g. '..', absolute paths).
        """
        try:
            repo_root = git_service.get_storage_path(repository_id).resolve()
            # Normalize path
            clean_rel = file_path.replace("\\", "/").lstrip("/")
            target_path = (repo_root / clean_rel).resolve()

            # Ensure target_path is within repo_root
            if not str(target_path).startswith(str(repo_root)):
                logger.warning(f"Path traversal attempt blocked: {file_path} in repo {repository_id}")
                return None

            return target_path
        except Exception as e:
            logger.error(f"Error resolving path '{file_path}' in repo {repository_id}: {e}")
            return None

    def is_binary_file(self, file_path: Path) -> bool:
        """
        Checks if a file is binary using extension heuristics and null-byte scanning.
        """
        if file_path.suffix.lower() in BINARY_EXTENSIONS:
            return True

        try:
            with open(file_path, "rb") as f:
                chunk = f.read(1024)
                if b"\x00" in chunk:
                    return True
            return False
        except Exception:
            return True

    def get_file_source(
        self,
        repository_id: str,
        file_path: str,
        max_size_bytes: int = 3_000_000,
    ) -> Dict[str, Any]:
        """
        Securely retrieves the actual source code of a file from repository checkout.
        """
        target_path = self._resolve_safe_file_path(repository_id, file_path)

        if not target_path or not target_path.exists() or not target_path.is_file():
            return {
                "source": "",
                "is_binary": False,
                "is_missing": True,
                "is_truncated": False,
                "total_lines": 0,
                "size_bytes": 0,
            }

        # Check binary
        if self.is_binary_file(target_path):
            return {
                "source": "",
                "is_binary": True,
                "is_missing": False,
                "is_truncated": False,
                "total_lines": 0,
                "size_bytes": target_path.stat().st_size,
            }

        file_size = target_path.stat().st_size

        try:
            # Safe text read with UTF-8 and fallback replacement
            with open(target_path, "r", encoding="utf-8", errors="replace") as f:
                if file_size > max_size_bytes:
                    content = f.read(max_size_bytes)
                    is_truncated = True
                else:
                    content = f.read()
                    is_truncated = False

            lines = content.splitlines()
            return {
                "source": content,
                "is_binary": False,
                "is_missing": False,
                "is_truncated": is_truncated,
                "total_lines": len(lines),
                "size_bytes": file_size,
            }
        except Exception as e:
            logger.error(f"Failed to read file {target_path}: {e}")
            return {
                "source": "",
                "is_binary": False,
                "is_missing": True,
                "is_truncated": False,
                "total_lines": 0,
                "size_bytes": file_size,
            }

    def search_repository_code(
        self,
        repository_id: str,
        query: str,
        file_map: Dict[str, str],  # file_path -> file_id
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """
        Performs real line-by-line text search across repository files.
        Returns matches with exact line numbers and matching line text.
        """
        if not query or len(query.strip()) < 2:
            return []

        clean_query = query.strip()
        matches: List[Dict[str, Any]] = []

        repo_root = git_service.get_storage_path(repository_id).resolve()
        if not repo_root.exists():
            return []

        try:
            regex_pattern = re.compile(re.escape(clean_query), re.IGNORECASE)
        except Exception:
            return []

        for rel_path, file_id in file_map.items():
            if len(matches) >= limit:
                break

            target_path = (repo_root / rel_path.replace("\\", "/")).resolve()
            if not target_path.exists() or not target_path.is_file() or self.is_binary_file(target_path):
                continue

            try:
                with open(target_path, "r", encoding="utf-8", errors="replace") as f:
                    for line_idx, line in enumerate(f, 1):
                        match = regex_pattern.search(line)
                        if match:
                            matches.append({
                                "file_id": file_id,
                                "file_path": rel_path,
                                "line_number": line_idx,
                                "line_content": line.rstrip("\r\n"),
                                "match_start": match.start(),
                                "match_end": match.end(),
                            })
                            if len(matches) >= limit:
                                break
            except Exception as e:
                logger.debug(f"Search skipped file {rel_path}: {e}")

        return matches


source_code_service = SourceCodeService()
