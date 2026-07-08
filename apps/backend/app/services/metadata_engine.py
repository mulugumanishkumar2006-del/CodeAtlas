"""
Metadata Engine

Calculates per-file code metrics:

  • Lines of Code (total, code, blank, comment)
  • Cyclomatic Complexity (basic)
  • Documentation Coverage
  • File Size
  • Language
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from app.services.ast_service import ASTNode, ASTResult
from app.services.language_detector import Language
from app.services.symbol_extractor import ExtractionResult, SymbolKind

# ──────────────────────────────────────────────────────────────────────
# Data models
# ──────────────────────────────────────────────────────────────────────


@dataclass
class LineMetrics:
    """Line-level breakdown."""

    total: int = 0
    code: int = 0
    blank: int = 0
    comment: int = 0


@dataclass
class ComplexityMetrics:
    """Cyclomatic complexity information."""

    total: int = 0  # Sum across all functions
    average: float = 0.0  # Average per function
    max: int = 0  # Highest single-function complexity
    max_function: Optional[str] = None  # Name of the most complex function
    per_function: Dict[str, int] = field(default_factory=dict)


@dataclass
class DocumentationMetrics:
    """Documentation / docstring coverage."""

    documented_symbols: int = 0
    total_documentable: int = 0  # classes + functions + methods
    coverage_percent: float = 0.0


@dataclass
class FileMetadata:
    """Complete metadata for a single source file."""

    file_path: str
    language: Language
    file_size_bytes: int
    lines: LineMetrics = field(default_factory=LineMetrics)
    complexity: ComplexityMetrics = field(default_factory=ComplexityMetrics)
    documentation: DocumentationMetrics = field(default_factory=DocumentationMetrics)

    def summary(self) -> str:
        return (
            f"{self.language.value:12s}  "
            f"{self.lines.total:5d} lines "
            f"({self.lines.code} code, {self.lines.comment} comment, {self.lines.blank} blank)  "
            f"complexity={self.complexity.total}  "
            f"doc={self.documentation.coverage_percent:.0f}%  "
            f"size={self.file_size_bytes:,}B"
        )


@dataclass
class RepositoryMetadata:
    """Aggregated metadata for an entire repository."""

    files: List[FileMetadata] = field(default_factory=list)

    @property
    def total_lines(self) -> int:
        return sum(f.lines.total for f in self.files)

    @property
    def total_code_lines(self) -> int:
        return sum(f.lines.code for f in self.files)

    @property
    def total_comment_lines(self) -> int:
        return sum(f.lines.comment for f in self.files)

    @property
    def total_blank_lines(self) -> int:
        return sum(f.lines.blank for f in self.files)

    @property
    def total_size_bytes(self) -> int:
        return sum(f.file_size_bytes for f in self.files)

    @property
    def total_complexity(self) -> int:
        return sum(f.complexity.total for f in self.files)

    @property
    def average_complexity(self) -> float:
        complexities = [
            f.complexity.average for f in self.files if f.complexity.average > 0
        ]
        return sum(complexities) / len(complexities) if complexities else 0.0

    @property
    def documentation_coverage(self) -> float:
        documented = sum(f.documentation.documented_symbols for f in self.files)
        total = sum(f.documentation.total_documentable for f in self.files)
        return (documented / total * 100) if total > 0 else 0.0

    def language_breakdown(self) -> Dict[str, int]:
        counts: Dict[str, int] = {}
        for f in self.files:
            counts[f.language.value] = counts.get(f.language.value, 0) + 1
        return counts

    def summary(self) -> str:
        langs = self.language_breakdown()
        lang_str = ", ".join(f"{v} {k}" for k, v in sorted(langs.items()))
        return (
            f"{len(self.files)} files ({lang_str})\n"
            f"  Lines: {self.total_lines:,} total "
            f"({self.total_code_lines:,} code, "
            f"{self.total_comment_lines:,} comment, "
            f"{self.total_blank_lines:,} blank)\n"
            f"  Complexity: {self.total_complexity} total, "
            f"{self.average_complexity:.1f} avg\n"
            f"  Documentation: {self.documentation_coverage:.1f}%\n"
            f"  Size: {self.total_size_bytes:,} bytes"
        )


# ──────────────────────────────────────────────────────────────────────
# Comment patterns per language
# ──────────────────────────────────────────────────────────────────────

_SINGLE_LINE_COMMENT = {
    Language.PYTHON: re.compile(r"^\s*#"),
    Language.JAVASCRIPT: re.compile(r"^\s*//"),
    Language.TYPESCRIPT: re.compile(r"^\s*//"),
}

_MULTI_LINE_COMMENT_START = {
    Language.PYTHON: re.compile(r'^\s*("""|\'\'\')'),  # docstrings
    Language.JAVASCRIPT: re.compile(r"^\s*/\*"),
    Language.TYPESCRIPT: re.compile(r"^\s*/\*"),
}

_MULTI_LINE_COMMENT_END = {
    Language.PYTHON: re.compile(r'("""|\'\'\')\s*$'),
    Language.JAVASCRIPT: re.compile(r"\*/\s*$"),
    Language.TYPESCRIPT: re.compile(r"\*/\s*$"),
}


# ──────────────────────────────────────────────────────────────────────
# Complexity branch keywords per language
# ──────────────────────────────────────────────────────────────────────

_BRANCH_KEYWORDS = {
    Language.PYTHON: {"if", "elif", "for", "while", "except", "with", "and", "or"},
    Language.JAVASCRIPT: {
        "if",
        "else if",
        "for",
        "while",
        "do",
        "catch",
        "case",
        "&&",
        "||",
        "?",
    },
    Language.TYPESCRIPT: {
        "if",
        "else if",
        "for",
        "while",
        "do",
        "catch",
        "case",
        "&&",
        "||",
        "?",
    },
}

# Regex to match branch-inducing tokens in source
_BRANCH_PATTERNS = {
    Language.PYTHON: re.compile(r"\b(if|elif|for|while|except|with)\b|\b(and|or)\b"),
    Language.JAVASCRIPT: re.compile(
        r"\b(if|for|while|do|catch|case)\b|(\?\s*[^?:])|(\&\&|\|\|)"
    ),
    Language.TYPESCRIPT: re.compile(
        r"\b(if|for|while|do|catch|case)\b|(\?\s*[^?:])|(\&\&|\|\|)"
    ),
}


# ──────────────────────────────────────────────────────────────────────
# Metadata Engine
# ──────────────────────────────────────────────────────────────────────


class MetadataEngine:
    """
    Calculates code metrics for individual files and whole repositories.

    Usage::

        engine = MetadataEngine()
        meta = engine.analyse_file(
            file_path="app/main.py",
            source=source_code,
            language=Language.PYTHON,
            file_size=len(source_code),
            ast_result=ast_result,        # optional
            extraction=extraction_result, # optional
        )
        print(meta.summary())
    """

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def analyse_file(
        self,
        file_path: str,
        source: str,
        language: Language,
        file_size: int,
        ast_result: Optional[ASTResult] = None,
        extraction: Optional[ExtractionResult] = None,
    ) -> FileMetadata:
        """Calculate all metrics for a single file."""
        meta = FileMetadata(
            file_path=file_path,
            language=language,
            file_size_bytes=file_size,
        )

        lines = source.split("\n")

        # 1. Line metrics
        meta.lines = self._count_lines(lines, language)

        # 2. Cyclomatic complexity
        if ast_result and ast_result.root:
            meta.complexity = self._compute_complexity_from_ast(
                ast_result.root, source, language
            )
        else:
            meta.complexity = self._compute_complexity_from_source(source, language)

        # 3. Documentation coverage
        if extraction:
            meta.documentation = self._compute_documentation(extraction)

        return meta

    def analyse_repository(
        self,
        file_metas: List[FileMetadata],
    ) -> RepositoryMetadata:
        """Aggregate file-level metadata into repository-level stats."""
        return RepositoryMetadata(files=file_metas)

    # ------------------------------------------------------------------
    # Line counting
    # ------------------------------------------------------------------

    def _count_lines(self, lines: List[str], language: Language) -> LineMetrics:
        metrics = LineMetrics(total=len(lines))

        single_re = _SINGLE_LINE_COMMENT.get(language)
        multi_start_re = _MULTI_LINE_COMMENT_START.get(language)
        multi_end_re = _MULTI_LINE_COMMENT_END.get(language)

        in_multi = False

        for line in lines:
            stripped = line.strip()

            if not stripped:
                metrics.blank += 1
                continue

            # Multi-line comment tracking
            if in_multi:
                metrics.comment += 1
                if multi_end_re and multi_end_re.search(stripped):
                    in_multi = False
                continue

            if multi_start_re and multi_start_re.search(stripped):
                metrics.comment += 1
                # Check if it closes on the same line
                if not (multi_end_re and multi_end_re.search(stripped)):
                    in_multi = True
                continue

            # Single-line comment
            if single_re and single_re.match(stripped):
                metrics.comment += 1
                continue

            # Otherwise it's code
            metrics.code += 1

        return metrics

    # ------------------------------------------------------------------
    # Cyclomatic complexity
    # ------------------------------------------------------------------

    def _compute_complexity_from_ast(
        self,
        root: ASTNode,
        source: str,
        language: Language,
    ) -> ComplexityMetrics:
        """
        Compute cyclomatic complexity per function using the AST.

        Basic algorithm: CC = 1 + number of branch points within the function body.
        """
        func_types = self._get_function_node_types(language)
        per_function: Dict[str, int] = {}

        for node in root.walk():
            if node.type in func_types:
                name = self._get_function_name(node)
                body_text = node.text or ""
                cc = self._count_branches(body_text, language)
                per_function[name] = cc

        if not per_function:
            # File-level complexity
            total = self._count_branches(source, language)
            return ComplexityMetrics(total=total, average=float(total), max=total)

        total = sum(per_function.values())
        avg = total / len(per_function) if per_function else 0.0
        max_cc = max(per_function.values()) if per_function else 0
        max_fn = max(per_function, key=per_function.get) if per_function else None

        return ComplexityMetrics(
            total=total,
            average=round(avg, 2),
            max=max_cc,
            max_function=max_fn,
            per_function=per_function,
        )

    def _compute_complexity_from_source(
        self,
        source: str,
        language: Language,
    ) -> ComplexityMetrics:
        """Fallback: compute file-level complexity from raw source."""
        cc = self._count_branches(source, language)
        return ComplexityMetrics(total=cc, average=float(cc), max=cc)

    @staticmethod
    def _count_branches(text: str, language: Language) -> int:
        """Count branch points in a block of source text. Returns 1 + branches."""
        pattern = _BRANCH_PATTERNS.get(language)
        if not pattern:
            return 1
        matches = pattern.findall(text)
        # Each match is a tuple of groups; count non-empty groups
        branch_count = sum(
            1
            for match in matches
            for group in (match if isinstance(match, tuple) else (match,))
            if group
        )
        return 1 + branch_count

    @staticmethod
    def _get_function_node_types(language: Language) -> set:
        if language == Language.PYTHON:
            return {"function_definition"}
        return {"function_declaration", "method_definition", "arrow_function"}

    @staticmethod
    def _get_function_name(node: ASTNode) -> str:
        for child in node.children:
            if child.type in ("identifier", "property_identifier"):
                return child.text.strip() if child.text else "<anonymous>"
        return "<anonymous>"

    # ------------------------------------------------------------------
    # Documentation coverage
    # ------------------------------------------------------------------

    @staticmethod
    def _compute_documentation(extraction: ExtractionResult) -> DocumentationMetrics:
        """
        Compute documentation coverage based on symbols that have docstrings.

        "Documentable" = classes + functions + methods.
        """
        documentable_kinds = {SymbolKind.CLASS, SymbolKind.FUNCTION, SymbolKind.METHOD}
        documentable = [s for s in extraction.symbols if s.kind in documentable_kinds]
        documented = [s for s in documentable if s.docstring]

        total = len(documentable)
        doc_count = len(documented)
        pct = (doc_count / total * 100) if total > 0 else 0.0

        return DocumentationMetrics(
            documented_symbols=doc_count,
            total_documentable=total,
            coverage_percent=round(pct, 1),
        )
