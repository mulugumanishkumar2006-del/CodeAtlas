"""
Language Detector Service

Maps a file to its programming language based on file extension and,
when ambiguous, a lightweight content-based heuristic.

Supported languages (Task 2 scope):
  • Python
  • JavaScript
  • TypeScript
"""

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class Language(str, Enum):
    """Programming languages recognised by CodeAtlas."""

    PYTHON = "Python"
    JAVASCRIPT = "JavaScript"
    TYPESCRIPT = "TypeScript"
    UNKNOWN = "Unknown"


# ------------------------------------------------------------------
# Extension → Language mapping
# ------------------------------------------------------------------

_EXTENSION_MAP: dict[str, Language] = {
    # Python
    ".py": Language.PYTHON,
    ".pyi": Language.PYTHON,
    ".pyw": Language.PYTHON,
    # TypeScript (checked before JS because .tsx/.ts are more specific)
    ".ts": Language.TYPESCRIPT,
    ".tsx": Language.TYPESCRIPT,
    ".mts": Language.TYPESCRIPT,
    ".cts": Language.TYPESCRIPT,
    # JavaScript
    ".js": Language.JAVASCRIPT,
    ".jsx": Language.JAVASCRIPT,
    ".mjs": Language.JAVASCRIPT,
    ".cjs": Language.JAVASCRIPT,
}


@dataclass(frozen=True)
class LanguageDetection:
    """Result of detecting the language of a single file."""

    file_path: str
    language: Language
    confidence: str  # "extension" | "content" | "none"


class LanguageDetector:
    """
    Detects the programming language of a file.

    Primary detection is extension-based. For files with no extension or
    ambiguous extensions, a lightweight shebang / content check is used.

    Usage:
        detector = LanguageDetector()
        result   = detector.detect("/repo/app/main.py")
        print(result.language)  # Language.PYTHON
    """

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def detect(self, file_path: str, extension: Optional[str] = None) -> LanguageDetection:
        """
        Detect the language of the file at *file_path*.

        Parameters
        ----------
        file_path:
            Path to the file (absolute or relative).
        extension:
            Optional pre-computed extension (including the dot).
            If omitted, it is derived from *file_path*.
        """
        if extension is None:
            extension = self._extract_extension(file_path)

        # 1. Extension-based detection
        lang = _EXTENSION_MAP.get(extension.lower())
        if lang is not None:
            return LanguageDetection(
                file_path=file_path,
                language=lang,
                confidence="extension",
            )

        # 2. Content-based fallback (shebang / first-line heuristics)
        lang = self._detect_from_content(file_path)
        if lang is not None:
            return LanguageDetection(
                file_path=file_path,
                language=lang,
                confidence="content",
            )

        # 3. Unknown
        return LanguageDetection(
            file_path=file_path,
            language=Language.UNKNOWN,
            confidence="none",
        )

    def detect_from_extension(self, extension: str) -> Language:
        """Pure extension lookup — no file I/O."""
        return _EXTENSION_MAP.get(extension.lower(), Language.UNKNOWN)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _extract_extension(file_path: str) -> str:
        """Return the file extension (including the dot), or '' if none."""
        dot = file_path.rfind(".")
        if dot == -1:
            return ""
        # Guard against hidden files like ".gitignore" (no real extension)
        slash = max(file_path.rfind("/"), file_path.rfind("\\"))
        if dot < slash:
            return ""
        basename_start = slash + 1
        if dot == basename_start:
            return ""
        return file_path[dot:]

    @staticmethod
    def _detect_from_content(file_path: str) -> Optional[Language]:
        """
        Read the first line of the file and look for a shebang or
        other strong indicators.
        """
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as fh:
                first_line = fh.readline(512).strip()
        except (OSError, UnicodeDecodeError):
            return None

        if not first_line:
            return None

        # Shebang detection
        if first_line.startswith("#!"):
            shebang = first_line.lower()
            if "python" in shebang:
                return Language.PYTHON
            if "node" in shebang or "deno" in shebang or "bun" in shebang:
                return Language.JAVASCRIPT
            if "ts-node" in shebang:
                return Language.TYPESCRIPT

        return None
