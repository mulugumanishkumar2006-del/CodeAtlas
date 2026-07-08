"""
Tree-sitter AST Integration

Generates concrete syntax trees for Python, JavaScript, and TypeScript
using tree-sitter grammars.  Each node in the resulting tree stores:

  • type       – the grammar node type (e.g. "function_definition")
  • position   – start/end row+column
  • children   – recursive child nodes
  • text       – the source text of leaf / small nodes
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional

import tree_sitter_javascript
import tree_sitter_python
import tree_sitter_typescript
from tree_sitter import Language, Parser

from app.services.language_detector import Language as AppLanguage

# ──────────────────────────────────────────────────────────────────────
# Language setup
# ──────────────────────────────────────────────────────────────────────

PY_LANGUAGE = Language(tree_sitter_python.language())
JS_LANGUAGE = Language(tree_sitter_javascript.language())
TS_LANGUAGE = Language(tree_sitter_typescript.language_typescript())
TSX_LANGUAGE = Language(tree_sitter_typescript.language_tsx())

_LANG_MAP: Dict[AppLanguage, Language] = {
    AppLanguage.PYTHON: PY_LANGUAGE,
    AppLanguage.JAVASCRIPT: JS_LANGUAGE,
    AppLanguage.TYPESCRIPT: TS_LANGUAGE,
}


# ──────────────────────────────────────────────────────────────────────
# Data models
# ──────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class Position:
    """A start/end location in the source file (0-indexed rows & columns)."""

    start_row: int
    start_col: int
    end_row: int
    end_col: int

    def __str__(self) -> str:
        return f"{self.start_row}:{self.start_col}-{self.end_row}:{self.end_col}"


@dataclass
class ASTNode:
    """
    A single node in the concrete syntax tree.

    Mirrors tree-sitter's node structure with serialisable Python types
    so the tree can be stored, serialised to JSON, or walked later.
    """

    type: str  # Grammar node type
    position: Position  # Source location
    text: Optional[str] = None  # Source text (leaf nodes / small nodes)
    is_named: bool = True  # Named vs anonymous grammar nodes
    children: List["ASTNode"] = field(default_factory=list)
    child_count: int = 0

    def walk(self):
        """Depth-first generator over the subtree rooted at this node."""
        yield self
        for child in self.children:
            yield from child.walk()

    @property
    def named_children(self) -> List["ASTNode"]:
        return [c for c in self.children if c.is_named]

    def to_dict(self) -> dict:
        """Serialise to a plain dictionary (JSON-friendly)."""
        d: dict = {
            "type": self.type,
            "position": {
                "start": {
                    "row": self.position.start_row,
                    "col": self.position.start_col,
                },
                "end": {"row": self.position.end_row, "col": self.position.end_col},
            },
            "is_named": self.is_named,
            "child_count": self.child_count,
        }
        if self.text is not None:
            d["text"] = self.text
        if self.children:
            d["children"] = [c.to_dict() for c in self.children]
        return d


@dataclass
class ASTResult:
    """Top-level result of parsing a file into an AST."""

    file_path: str
    language: AppLanguage
    root: Optional[ASTNode] = None
    total_nodes: int = 0
    error: Optional[str] = None

    def summary(self) -> str:
        if self.error:
            return f"ERROR: {self.error}"
        return (
            f"{self.language.value} AST: "
            f"{self.total_nodes} nodes, "
            f"root type={self.root.type if self.root else 'N/A'}"
        )


# ──────────────────────────────────────────────────────────────────────
# Tree-sitter AST generator
# ──────────────────────────────────────────────────────────────────────

# Maximum source text length stored on a node (avoids bloating the tree
# with huge string literals for large source spans).
_MAX_TEXT_BYTES = 200


class TreeSitterAST:
    """
    Generates ASTs for Python, JavaScript, and TypeScript using tree-sitter.

    Usage::

        ts_ast = TreeSitterAST()
        result = ts_ast.parse_file("app/main.py", AppLanguage.PYTHON)
        for node in result.root.walk():
            print(node.type, node.position)
    """

    def __init__(self) -> None:
        self._parsers: Dict[AppLanguage, Parser] = {}
        for lang, ts_lang in _LANG_MAP.items():
            p = Parser(ts_lang)
            self._parsers[lang] = p

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def parse_file(
        self,
        file_path: str,
        language: AppLanguage,
        source: Optional[str] = None,
    ) -> ASTResult:
        """
        Parse a source file and return a full AST.

        Parameters
        ----------
        file_path : str
            Path to the source file.
        language : AppLanguage
            The detected language of the file.
        source : str, optional
            Raw source code.  If *None*, it is read from disk.
        """
        parser = self._parsers.get(language)
        if parser is None:
            return ASTResult(
                file_path=file_path,
                language=language,
                error=f"No tree-sitter grammar for {language.value}",
            )

        if source is None:
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as fh:
                    source = fh.read()
            except OSError as exc:
                return ASTResult(
                    file_path=file_path,
                    language=language,
                    error=str(exc),
                )

        source_bytes = source.encode("utf-8")
        tree = parser.parse(source_bytes)
        root_node = self._convert_node(tree.root_node, source_bytes)

        # Count all nodes
        total = sum(1 for _ in root_node.walk())

        return ASTResult(
            file_path=file_path,
            language=language,
            root=root_node,
            total_nodes=total,
        )

    def parse_string(self, source: str, language: AppLanguage) -> ASTResult:
        """Convenience wrapper for parsing an in-memory string."""
        return self.parse_file("<string>", language, source=source)

    def supports(self, language: AppLanguage) -> bool:
        return language in self._parsers

    @property
    def supported_languages(self) -> list[AppLanguage]:
        return list(self._parsers.keys())

    # ------------------------------------------------------------------
    # Use TSX parser for .tsx files
    # ------------------------------------------------------------------

    def parse_tsx_file(
        self,
        file_path: str,
        source: Optional[str] = None,
    ) -> ASTResult:
        """Parse a TSX file specifically (uses TSX grammar)."""
        tsx_parser = Parser(TSX_LANGUAGE)
        if source is None:
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as fh:
                    source = fh.read()
            except OSError as exc:
                return ASTResult(
                    file_path=file_path,
                    language=AppLanguage.TYPESCRIPT,
                    error=str(exc),
                )
        source_bytes = source.encode("utf-8")
        tree = tsx_parser.parse(source_bytes)
        root_node = self._convert_node(tree.root_node, source_bytes)
        total = sum(1 for _ in root_node.walk())
        return ASTResult(
            file_path=file_path,
            language=AppLanguage.TYPESCRIPT,
            root=root_node,
            total_nodes=total,
        )

    # ------------------------------------------------------------------
    # Internal conversion
    # ------------------------------------------------------------------

    def _convert_node(self, ts_node, source_bytes: bytes) -> ASTNode:
        """Recursively convert a tree-sitter node to our ASTNode model."""
        children = [
            self._convert_node(child, source_bytes) for child in ts_node.children
        ]

        # Only store text for small / leaf nodes
        text: Optional[str] = None
        byte_len = ts_node.end_byte - ts_node.start_byte
        if byte_len <= _MAX_TEXT_BYTES:
            text = source_bytes[ts_node.start_byte : ts_node.end_byte].decode(
                "utf-8", errors="replace"
            )

        return ASTNode(
            type=ts_node.type,
            position=Position(
                start_row=ts_node.start_point[0],
                start_col=ts_node.start_point[1],
                end_row=ts_node.end_point[0],
                end_col=ts_node.end_point[1],
            ),
            text=text,
            is_named=ts_node.is_named,
            children=children,
            child_count=len(children),
        )
