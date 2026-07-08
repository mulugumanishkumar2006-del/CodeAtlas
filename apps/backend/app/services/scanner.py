"""
Repository Scanner Service

Recursively scans a cloned repository directory and returns a flat list of
files, skipping directories that are build artifacts, dependency caches,
or version-control internals.
"""

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional, Set

# Directory names that should always be skipped during scanning.
DEFAULT_IGNORED_DIRS: Set[str] = frozenset(
    {
        "node_modules",
        ".git",
        "dist",
        "build",
        ".venv",
        "venv",
        "__pycache__",
        ".next",
        ".pnpm-store",
        ".ruff_cache",
        ".cache",
        ".tox",
        ".mypy_cache",
        ".pytest_cache",
        "egg-info",
    }
)


@dataclass(frozen=True)
class ScannedFile:
    """Represents a single file discovered during a repository scan."""

    relative_path: str  # Relative to the repo root (always forward-slash separated)
    absolute_path: str  # Full filesystem path
    size_bytes: int  # File size in bytes
    extension: str  # File extension including the dot, e.g. ".py", "" for no ext


@dataclass
class ScanResult:
    """Aggregated output of a repository scan."""

    root_dir: str
    files: List[ScannedFile] = field(default_factory=list)
    total_files: int = 0
    total_size_bytes: int = 0
    skipped_dirs: List[str] = field(default_factory=list)

    def summary(self) -> str:
        return (
            f"Scanned {self.total_files} files "
            f"({self.total_size_bytes:,} bytes) "
            f"under {self.root_dir}"
        )


class RepositoryScanner:
    """
    Recursively scans a repository directory tree and collects file metadata.

    Usage:
        scanner = RepositoryScanner()
        result  = scanner.scan("/path/to/cloned/repo")
        for f in result.files:
            print(f.relative_path, f.size_bytes)
    """

    def __init__(
        self,
        ignored_dirs: Optional[Set[str]] = None,
    ) -> None:
        self._ignored_dirs = (
            ignored_dirs if ignored_dirs is not None else DEFAULT_IGNORED_DIRS
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def scan(self, root_dir: str) -> ScanResult:
        """
        Walk *root_dir* recursively, skip ignored directories, and return a
        :class:`ScanResult` containing every discovered file.

        Parameters
        ----------
        root_dir:
            Absolute path to the repository root to scan.

        Raises
        ------
        FileNotFoundError
            If *root_dir* does not exist.
        NotADirectoryError
            If *root_dir* is not a directory.
        """
        root = Path(root_dir).resolve()

        if not root.exists():
            raise FileNotFoundError(f"Directory does not exist: {root}")
        if not root.is_dir():
            raise NotADirectoryError(f"Path is not a directory: {root}")

        result = ScanResult(root_dir=str(root))
        self._walk(root, root, result)

        result.total_files = len(result.files)
        result.total_size_bytes = sum(f.size_bytes for f in result.files)
        return result

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _should_skip(self, dir_name: str) -> bool:
        """Return True if a directory name matches the ignore set."""
        return dir_name in self._ignored_dirs

    def _walk(self, current: Path, root: Path, result: ScanResult) -> None:
        """Depth-first recursive walk collecting file metadata."""
        try:
            entries = sorted(current.iterdir(), key=lambda e: e.name)
        except PermissionError:
            return

        for entry in entries:
            if entry.is_dir():
                if self._should_skip(entry.name):
                    result.skipped_dirs.append(
                        str(entry.relative_to(root)).replace(os.sep, "/")
                    )
                    continue
                self._walk(entry, root, result)

            elif entry.is_file():
                try:
                    size = entry.stat().st_size
                except OSError:
                    size = 0

                relative = str(entry.relative_to(root)).replace(os.sep, "/")
                result.files.append(
                    ScannedFile(
                        relative_path=relative,
                        absolute_path=str(entry),
                        size_bytes=size,
                        extension=entry.suffix,
                    )
                )
