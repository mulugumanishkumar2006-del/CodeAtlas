"""
Parser Factory & Language-Specific Parsers

Provides an abstract ``BaseParser`` contract and concrete implementations
for Python, JavaScript, and TypeScript.  The ``ParserFactory`` maps a
``Language`` enum value to the correct parser automatically.

Extracted symbols:
  • classes
  • functions / methods
  • imports
"""

from __future__ import annotations

import ast
import re
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Optional

from app.services.language_detector import Language


# ──────────────────────────────────────────────────────────────────────
# Data models
# ──────────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class ImportStatement:
    """A single import found in a source file."""
    module: str           # e.g. "os.path" or "react"
    names: List[str]      # e.g. ["join", "dirname"]  (empty for bare imports)
    line: int             # 1-indexed source line


@dataclass(frozen=True)
class FunctionSymbol:
    """A function or method definition."""
    name: str
    line: int
    end_line: Optional[int] = None
    parameters: List[str] = field(default_factory=list)
    is_method: bool = False        # True when nested inside a class
    is_async: bool = False


@dataclass(frozen=True)
class ClassSymbol:
    """A class definition."""
    name: str
    line: int
    end_line: Optional[int] = None
    bases: List[str] = field(default_factory=list)
    methods: List[FunctionSymbol] = field(default_factory=list)


@dataclass
class ParseResult:
    """Aggregated output of parsing a single source file."""
    file_path: str
    language: Language
    imports: List[ImportStatement] = field(default_factory=list)
    functions: List[FunctionSymbol] = field(default_factory=list)
    classes: List[ClassSymbol] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)

    @property
    def total_symbols(self) -> int:
        return len(self.imports) + len(self.functions) + len(self.classes)

    def summary(self) -> str:
        return (
            f"{self.language.value}: {len(self.imports)} imports, "
            f"{len(self.functions)} functions, "
            f"{len(self.classes)} classes"
        )


# ──────────────────────────────────────────────────────────────────────
# Abstract base parser
# ──────────────────────────────────────────────────────────────────────

class BaseParser(ABC):
    """Contract that every language parser must satisfy."""

    @abstractmethod
    def parse(self, file_path: str, source: Optional[str] = None) -> ParseResult:
        """
        Parse a source file and return structured symbols.

        Parameters
        ----------
        file_path : str
            Path to the file (used for error messages and the result).
        source : str, optional
            Raw source code.  If *None*, the file is read from disk.
        """
        ...

    @property
    @abstractmethod
    def language(self) -> Language:
        ...

    # Shared helper
    @staticmethod
    def _read_source(file_path: str) -> str:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as fh:
            return fh.read()


# ──────────────────────────────────────────────────────────────────────
# Python parser  (uses the stdlib ``ast`` module)
# ──────────────────────────────────────────────────────────────────────

class PythonParser(BaseParser):
    """Parses Python files using the built-in ``ast`` module."""

    @property
    def language(self) -> Language:
        return Language.PYTHON

    def parse(self, file_path: str, source: Optional[str] = None) -> ParseResult:
        source = source if source is not None else self._read_source(file_path)
        result = ParseResult(file_path=file_path, language=self.language)

        try:
            tree = ast.parse(source, filename=file_path)
        except SyntaxError as exc:
            result.errors.append(f"SyntaxError: {exc}")
            return result

        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                result.imports.append(self._convert_import(node))
            elif isinstance(node, ast.ClassDef):
                result.classes.append(self._convert_class(node))
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                # Only top-level functions (not methods inside classes)
                if not self._is_method(node, tree):
                    result.functions.append(self._convert_function(node, is_method=False))

        return result

    # -- helpers ----------------------------------------------------------

    @staticmethod
    def _convert_import(node: ast.AST) -> ImportStatement:
        if isinstance(node, ast.Import):
            module = node.names[0].name
            names = [a.name for a in node.names]
        else:  # ImportFrom
            module = node.module or ""
            names = [a.name for a in node.names]
        return ImportStatement(module=module, names=names, line=node.lineno)

    @staticmethod
    def _convert_function(
        node: ast.FunctionDef | ast.AsyncFunctionDef,
        is_method: bool,
    ) -> FunctionSymbol:
        params = [a.arg for a in node.args.args if a.arg != "self"]
        return FunctionSymbol(
            name=node.name,
            line=node.lineno,
            end_line=node.end_lineno,
            parameters=params,
            is_method=is_method,
            is_async=isinstance(node, ast.AsyncFunctionDef),
        )

    @classmethod
    def _convert_class(cls, node: ast.ClassDef) -> ClassSymbol:
        bases = []
        for base in node.bases:
            if isinstance(base, ast.Name):
                bases.append(base.id)
            elif isinstance(base, ast.Attribute):
                bases.append(ast.dump(base))
        methods = []
        for child in node.body:
            if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                methods.append(cls._convert_function(child, is_method=True))
        return ClassSymbol(
            name=node.name,
            line=node.lineno,
            end_line=node.end_lineno,
            bases=bases,
            methods=methods,
        )

    @staticmethod
    def _is_method(node: ast.AST, tree: ast.Module) -> bool:
        """Return True if *node* is directly inside a ClassDef body."""
        for cls_node in ast.walk(tree):
            if isinstance(cls_node, ast.ClassDef) and node in cls_node.body:
                return True
        return False


# ──────────────────────────────────────────────────────────────────────
# JavaScript / TypeScript regex-based parser
# ──────────────────────────────────────────────────────────────────────

# Shared regex patterns for JS/TS
_RE_IMPORT = re.compile(
    r"""(?mx)
    ^[ \t]*import\s+
    (?:
      (?:\{([^}]+)\}\s+from\s+)           # named:  import { a, b } from '...'
      |(?:(\w+)\s+from\s+)               # default: import React from '...'
      |(?:\*\s+as\s+(\w+)\s+from\s+)     # star:   import * as X from '...'
      |()                                 # bare:   import '...'
    )
    ['"]([^'"]+)['"]
    """
)

_RE_REQUIRE = re.compile(
    r"""(?mx)
    ^[ \t]*(?:const|let|var)\s+
    (?:
      \{([^}]+)\}                          # destructured require
      |(\w+)                               # simple require
    )
    \s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)
    """
)

_RE_FUNCTION = re.compile(
    r"""(?mx)
    ^[ \t]*(?:export\s+)?(?:default\s+)?
    (async\s+)?
    function\s*(\*?)\s*(\w+)\s*
    \(([^)]*)\)
    """
)

_RE_ARROW_FUNCTION = re.compile(
    r"""(?mx)
    ^[ \t]*(?:export\s+)?(?:const|let|var)\s+
    (\w+)\s*=\s*(async\s+)?
    (?:\([^)]*\)|[a-zA-Z_]\w*)\s*=>
    """
)

_RE_CLASS = re.compile(
    r"""(?mx)
    ^[ \t]*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?
    class\s+(\w+)
    (?:\s+extends\s+(\w+))?
    (?:\s+implements\s+[\w,\s]+)?
    \s*\{
    """
)

_RE_METHOD = re.compile(
    r"""(?mx)
    ^[ \t]+(async\s+)?
    (?:static\s+)?(?:get\s+|set\s+)?
    (\w+)\s*\(([^)]*)\)\s*[\{:]
    """
)


class _JSBaseParser(BaseParser):
    """Shared regex-based implementation for JavaScript and TypeScript."""

    def parse(self, file_path: str, source: Optional[str] = None) -> ParseResult:
        source = source if source is not None else self._read_source(file_path)
        lines = source.split("\n")
        result = ParseResult(file_path=file_path, language=self.language)

        self._extract_imports(source, lines, result)
        self._extract_functions(source, lines, result)
        self._extract_classes(source, lines, result)

        return result

    # -- imports -----------------------------------------------------------

    @staticmethod
    def _extract_imports(source: str, lines: list[str], result: ParseResult) -> None:
        for m in _RE_IMPORT.finditer(source):
            named, default, star, bare, module = m.groups()
            names: list[str] = []
            if named:
                names = [n.strip().split(" as ")[0].strip() for n in named.split(",") if n.strip()]
            elif default:
                names = [default]
            elif star:
                names = [f"* as {star}"]
            line = source[: m.start()].count("\n") + 1
            result.imports.append(ImportStatement(module=module, names=names, line=line))

        for m in _RE_REQUIRE.finditer(source):
            destructured, simple, module = m.groups()
            names: list[str] = []
            if destructured:
                names = [n.strip() for n in destructured.split(",") if n.strip()]
            elif simple:
                names = [simple]
            line = source[: m.start()].count("\n") + 1
            result.imports.append(ImportStatement(module=module, names=names, line=line))

    # -- functions ---------------------------------------------------------

    @staticmethod
    def _extract_functions(source: str, lines: list[str], result: ParseResult) -> None:
        for m in _RE_FUNCTION.finditer(source):
            is_async_str, _generator, name, params_str = m.groups()
            params = [p.strip().split(":")[0].split("=")[0].strip()
                      for p in params_str.split(",") if p.strip()]
            line = source[: m.start()].count("\n") + 1
            result.functions.append(FunctionSymbol(
                name=name,
                line=line,
                parameters=params,
                is_async=bool(is_async_str),
            ))

        for m in _RE_ARROW_FUNCTION.finditer(source):
            name, is_async_str = m.groups()
            line = source[: m.start()].count("\n") + 1
            # Avoid duplicating class methods picked up as arrow fns
            result.functions.append(FunctionSymbol(
                name=name,
                line=line,
                is_async=bool(is_async_str),
            ))

    # -- classes -----------------------------------------------------------

    @staticmethod
    def _extract_classes(source: str, lines: list[str], result: ParseResult) -> None:
        for m in _RE_CLASS.finditer(source):
            name, base = m.groups()
            line = source[: m.start()].count("\n") + 1
            bases = [base] if base else []

            # Find methods inside the class body (simple heuristic)
            methods: list[FunctionSymbol] = []
            brace_depth = 0
            class_start = source.index("{", m.end() - 1)
            i = class_start
            while i < len(source):
                ch = source[i]
                if ch == "{":
                    brace_depth += 1
                elif ch == "}":
                    brace_depth -= 1
                    if brace_depth == 0:
                        break
                i += 1
            class_body = source[class_start: i + 1]

            for mm in _RE_METHOD.finditer(class_body):
                is_async_str, mname, params_str = mm.groups()
                if mname in ("if", "for", "while", "switch", "catch"):
                    continue
                params = [p.strip().split(":")[0].split("=")[0].strip()
                          for p in params_str.split(",") if p.strip()]
                mline = line + class_body[: mm.start()].count("\n")
                methods.append(FunctionSymbol(
                    name=mname,
                    line=mline,
                    parameters=params,
                    is_method=True,
                    is_async=bool(is_async_str),
                ))

            result.classes.append(ClassSymbol(
                name=name, line=line, bases=bases, methods=methods,
            ))


class JavaScriptParser(_JSBaseParser):
    """Parses JavaScript files using regex heuristics."""

    @property
    def language(self) -> Language:
        return Language.JAVASCRIPT


class TypeScriptParser(_JSBaseParser):
    """Parses TypeScript / TSX files using regex heuristics."""

    @property
    def language(self) -> Language:
        return Language.TYPESCRIPT


# ──────────────────────────────────────────────────────────────────────
# Parser Factory
# ──────────────────────────────────────────────────────────────────────

class ParserFactory:
    """
    Maps a ``Language`` to the appropriate parser instance.

    Usage::

        factory = ParserFactory()
        parser  = factory.get_parser(Language.PYTHON)
        result  = parser.parse("app/main.py")
    """

    _parsers: dict[Language, BaseParser] = {
        Language.PYTHON: PythonParser(),
        Language.JAVASCRIPT: JavaScriptParser(),
        Language.TYPESCRIPT: TypeScriptParser(),
    }

    def get_parser(self, language: Language) -> Optional[BaseParser]:
        """Return the parser for *language*, or ``None`` if unsupported."""
        return self._parsers.get(language)

    def can_parse(self, language: Language) -> bool:
        """Return ``True`` if a parser is registered for *language*."""
        return language in self._parsers

    @property
    def supported_languages(self) -> list[Language]:
        return list(self._parsers.keys())
