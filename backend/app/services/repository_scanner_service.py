import hashlib
import logging
import os
from pathlib import Path
from typing import List, Dict, Any, Set

from backend.app.services.language_detection_service import language_service

logger = logging.getLogger("codeatlas.scanner")


class RepositoryScannerService:
    """
    Recursively scans a repository workspace directory, discovers real source files,
    extracts file metadata, line counts, content hashes, and detected languages.
    """

    DEFAULT_IGNORE_DIRS: Set[str] = {
        ".git",
        ".svn",
        ".hg",
        "node_modules",
        "venv",
        ".venv",
        "env",
        ".env",
        "dist",
        "build",
        "coverage",
        "__pycache__",
        ".pytest_cache",
        ".next",
        ".nuxt",
        "target",
        ".turbo",
        ".cache",
        ".tox",
        ".idea",
        ".vscode",
        "vendor",
        "bower_components",
        ".parcel-cache",
        ".gradle",
        ".nuget",
        "bin",
        "obj",
        "out",
    }

    DEFAULT_IGNORE_FILES: Set[str] = {
        ".ds_store",
        "thumbs.db",
        "npm-debug.log",
        "yarn-error.log",
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
    }

    # Skip files larger than 10MB to avoid indexing massive generated binaries
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024

    def __init__(self, custom_ignore_dirs: Set[str] | None = None):
        self.ignore_dirs = set(self.DEFAULT_IGNORE_DIRS)
        if custom_ignore_dirs:
            self.ignore_dirs.update(custom_ignore_dirs)

    def is_binary_file(self, file_path: Path) -> bool:
        """
        Check if a file appears to be binary by inspecting the first 1024 bytes.
        """
        try:
            with open(file_path, "rb") as f:
                chunk = f.read(1024)
                if b"\0" in chunk:
                    return True
            return False
        except Exception:
            return True

    def scan_directory(self, root_dir: Path | str) -> List[Dict[str, Any]]:
        """
        Recursively discover all source files in the given repository path.
        """
        root_path = Path(root_dir).resolve()
        if not root_path.exists() or not root_path.is_dir():
            logger.warning(f"Root path {root_path} does not exist or is not a directory.")
            return []

        discovered_files: List[Dict[str, Any]] = []

        for dirpath, dirnames, filenames in os.walk(str(root_path)):
            current_path = Path(dirpath)

            # Filter out ignored directories in-place to prevent recursion into them
            dirnames[:] = [
                d for d in dirnames
                if d.lower() not in self.ignore_dirs and not d.startswith(".")
            ]

            for filename in filenames:
                if filename.lower() in self.DEFAULT_IGNORE_FILES:
                    continue

                file_path = current_path / filename
                try:
                    # Skip symlinks that point outside repository or broken symlinks
                    if file_path.is_symlink() and not file_path.resolve().exists():
                        continue

                    # Check file size
                    stat_info = file_path.stat()
                    size_bytes = stat_info.st_size

                    if size_bytes > self.MAX_FILE_SIZE_BYTES:
                        logger.debug(f"Skipping large file ({size_bytes} bytes): {file_path}")
                        continue

                    # Check if binary
                    if self.is_binary_file(file_path):
                        continue

                    # Calculate relative POSIX path (e.g. 'src/services/api.py')
                    rel_path = file_path.relative_to(root_path).as_posix()

                    # Compute real line count, content hash, and line stats breakdown
                    line_count, content_hash, line_stats = self._analyze_file_content(file_path)

                    # Detect language
                    language = language_service.detect_language(file_path)

                    discovered_files.append({
                        "path": rel_path,
                        "filename": filename,
                        "extension": file_path.suffix.lower(),
                        "size_bytes": size_bytes,
                        "line_count": line_count,
                        "content_hash": content_hash,
                        "language": language,
                        "absolute_path": str(file_path),
                        "code_lines": line_stats["code_lines"],
                        "blank_lines": line_stats["blank_lines"],
                        "comment_lines": line_stats["comment_lines"],
                    })

                except Exception as e:
                    logger.warning(f"Error scanning file {file_path}: {e}")
                    continue

        # Sort files deterministically by relative path
        discovered_files.sort(key=lambda x: x["path"])
        return discovered_files

    def _analyze_file_content(self, file_path: Path) -> tuple[int, str, dict[str, int]]:
        """
        Read file to count total lines, blank lines, comment lines, code lines, and compute SHA-256 hash.
        """
        hasher = hashlib.sha256()
        total_lines = 0
        blank_lines = 0
        comment_lines = 0
        ext = file_path.suffix.lower()

        # Determine comment prefixes based on file extension
        is_hash_comment = ext in {".py", ".sh", ".bash", ".zsh", ".rb", ".yaml", ".yml", ".toml"}
        is_slash_comment = ext in {".js", ".jsx", ".ts", ".tsx", ".java", ".c", ".cpp", ".h", ".hpp", ".cs", ".go", ".rs", ".kt", ".swift", ".php", ".scss", ".css"}
        is_dash_comment = ext in {".sql", ".lua", ".hs"}

        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                for line in f:
                    total_lines += 1
                    hasher.update(line.encode("utf-8"))
                    stripped = line.strip()
                    if not stripped:
                        blank_lines += 1
                    elif is_hash_comment and stripped.startswith("#"):
                        comment_lines += 1
                    elif is_slash_comment and (stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("*")):
                        comment_lines += 1
                    elif is_dash_comment and stripped.startswith("--"):
                        comment_lines += 1

        except Exception as e:
            logger.debug(f"Could not decode {file_path} as utf-8: {e}")
            try:
                with open(file_path, "rb") as f:
                    content = f.read()
                    hasher.update(content)
                    total_lines = content.count(b"\n") + (1 if content and not content.endswith(b"\n") else 0)
            except Exception:
                return 0, "", {"total_lines": 0, "code_lines": 0, "blank_lines": 0, "comment_lines": 0}

        code_lines = max(total_lines - blank_lines - comment_lines, 0)
        line_stats = {
            "total_lines": total_lines,
            "code_lines": code_lines,
            "blank_lines": blank_lines,
            "comment_lines": comment_lines,
        }
        return total_lines, hasher.hexdigest(), line_stats


scanner_service = RepositoryScannerService()

