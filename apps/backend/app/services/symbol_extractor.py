"""
Symbol Extractor

Walks a tree-sitter AST and extracts structured code symbols:

  • Classes
  • Functions
  • Methods
  • Interfaces      (TypeScript)
  • Enums           (TypeScript)
  • Variables / Constants
  • Decorators / Annotations
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional

from app.services.ast_service import ASTNode, ASTResult, Position
from app.services.language_detector import Language


# ──────────────────────────────────────────────────────────────────────
# Symbol types
# ──────────────────────────────────────────────────────────────────────

class SymbolKind(str, Enum):
    CLASS = "class"
    FUNCTION = "function"
    METHOD = "method"
    INTERFACE = "interface"
    ENUM = "enum"
    VARIABLE = "variable"
    CONSTANT = "constant"
    DECORATOR = "decorator"
    ANNOTATION = "annotation"


# ──────────────────────────────────────────────────────────────────────
# Data models
# ──────────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class Symbol:
    """A single extracted code symbol."""
    kind: SymbolKind
    name: str
    position: Position
    language: Language
    parent_name: Optional[str] = None     # e.g. class name for methods
    parameters: List[str] = field(default_factory=list)
    return_type: Optional[str] = None
    decorators: List[str] = field(default_factory=list)
    bases: List[str] = field(default_factory=list)       # superclasses / extended interfaces
    is_async: bool = False
    is_exported: bool = False
    docstring: Optional[str] = None
    text: Optional[str] = None            # raw source text (truncated)


@dataclass
class ExtractionResult:
    """Aggregated extraction output for a single file."""
    file_path: str
    language: Language
    symbols: List[Symbol] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)

    # Convenience accessors
    @property
    def classes(self) -> List[Symbol]:
        return [s for s in self.symbols if s.kind == SymbolKind.CLASS]

    @property
    def functions(self) -> List[Symbol]:
        return [s for s in self.symbols if s.kind == SymbolKind.FUNCTION]

    @property
    def methods(self) -> List[Symbol]:
        return [s for s in self.symbols if s.kind == SymbolKind.METHOD]

    @property
    def interfaces(self) -> List[Symbol]:
        return [s for s in self.symbols if s.kind == SymbolKind.INTERFACE]

    @property
    def enums(self) -> List[Symbol]:
        return [s for s in self.symbols if s.kind == SymbolKind.ENUM]

    @property
    def variables(self) -> List[Symbol]:
        return [s for s in self.symbols if s.kind == SymbolKind.VARIABLE]

    @property
    def constants(self) -> List[Symbol]:
        return [s for s in self.symbols if s.kind == SymbolKind.CONSTANT]

    @property
    def decorators(self) -> List[Symbol]:
        return [s for s in self.symbols if s.kind == SymbolKind.DECORATOR]

    @property
    def annotations(self) -> List[Symbol]:
        return [s for s in self.symbols if s.kind == SymbolKind.ANNOTATION]

    def summary(self) -> str:
        counts = {}
        for s in self.symbols:
            counts[s.kind.value] = counts.get(s.kind.value, 0) + 1
        parts = [f"{v} {k}s" for k, v in sorted(counts.items())]
        return f"{self.language.value}: {', '.join(parts) or 'no symbols'}"


# ──────────────────────────────────────────────────────────────────────
# Helper to safely read node text
# ──────────────────────────────────────────────────────────────────────

def _node_text(node: ASTNode) -> str:
    """Return the source text of a node, or '' if unavailable."""
    return node.text.strip() if node.text else ""


def _find_child(node: ASTNode, *types: str) -> Optional[ASTNode]:
    """Return the first named child matching any of *types*."""
    for c in node.children:
        if c.type in types:
            return c
    return None


def _find_children(node: ASTNode, *types: str) -> List[ASTNode]:
    """Return all named children matching any of *types*."""
    return [c for c in node.children if c.type in types]


def _collect_names(node: ASTNode, node_type: str) -> List[str]:
    """Collect text of all descendants of a given type."""
    return [_node_text(n) for n in node.walk() if n.type == node_type and n.text]


# ──────────────────────────────────────────────────────────────────────
# Python extractor
# ──────────────────────────────────────────────────────────────────────

class _PythonExtractor:
    """Extract symbols from a Python tree-sitter AST."""

    def extract(self, root: ASTNode) -> List[Symbol]:
        symbols: List[Symbol] = []
        self._walk_body(root, symbols, parent_class=None)
        return symbols

    def _walk_body(
        self,
        node: ASTNode,
        symbols: List[Symbol],
        parent_class: Optional[str],
    ) -> None:
        for child in node.children:
            if child.type == "class_definition":
                self._extract_class(child, symbols)
            elif child.type in ("function_definition", "async_function_definition"):  # noqa: SIM114
                self._extract_function(child, symbols, parent_class)
            elif child.type == "decorated_definition":
                self._extract_decorated(child, symbols, parent_class)
            elif child.type == "expression_statement":
                self._extract_variable(child, symbols, parent_class)
            elif child.type in ("assignment", ):
                self._extract_assignment(child, symbols, parent_class)

    # ---- classes --------------------------------------------------------

    def _extract_class(self, node: ASTNode, symbols: List[Symbol]) -> None:
        name_node = _find_child(node, "identifier")
        name = _node_text(name_node) if name_node else "<anonymous>"

        # Decorators
        decorators = self._get_decorators(node)

        # Bases / superclasses
        bases: List[str] = []
        arg_list = _find_child(node, "argument_list")
        if arg_list:
            bases = [_node_text(c) for c in arg_list.children
                     if c.is_named and c.text]

        # Docstring
        docstring = self._get_docstring(node)

        symbols.append(Symbol(
            kind=SymbolKind.CLASS,
            name=name,
            position=node.position,
            language=Language.PYTHON,
            decorators=decorators,
            bases=bases,
            docstring=docstring,
        ))

        # Walk class body for methods and class-level variables
        body = _find_child(node, "block")
        if body:
            self._walk_body(body, symbols, parent_class=name)

    # ---- functions / methods -------------------------------------------

    def _extract_function(
        self,
        node: ASTNode,
        symbols: List[Symbol],
        parent_class: Optional[str],
    ) -> None:
        name_node = _find_child(node, "identifier")
        name = _node_text(name_node) if name_node else "<anonymous>"
        # tree-sitter Python: async methods are function_definition with
        # an "async" child node (not a separate node type).
        is_async = any(c.type == "async" for c in node.children)

        params = self._get_parameters(node)
        decorators = self._get_decorators(node)
        docstring = self._get_docstring(node)
        return_type = self._get_return_type(node)

        kind = SymbolKind.METHOD if parent_class else SymbolKind.FUNCTION

        symbols.append(Symbol(
            kind=kind,
            name=name,
            position=node.position,
            language=Language.PYTHON,
            parent_name=parent_class,
            parameters=params,
            return_type=return_type,
            decorators=decorators,
            is_async=is_async,
            docstring=docstring,
        ))

    # ---- decorated definitions -----------------------------------------

    def _extract_decorated(
        self,
        node: ASTNode,
        symbols: List[Symbol],
        parent_class: Optional[str],
    ) -> None:
        # Extract decorator symbols themselves
        for dec in _find_children(node, "decorator"):
            dec_text = _node_text(dec)
            if dec_text.startswith("@"):
                dec_text = dec_text[1:]
            symbols.append(Symbol(
                kind=SymbolKind.DECORATOR,
                name=dec_text,
                position=dec.position,
                language=Language.PYTHON,
                parent_name=parent_class,
            ))

        # Then extract the actual definition
        inner = _find_child(node, "class_definition")
        if inner:
            self._extract_class(inner, symbols)
            return
        inner = _find_child(node, "function_definition", "async_function_definition")
        if inner:
            self._extract_function(inner, symbols, parent_class)

    # ---- variables / constants -----------------------------------------

    def _extract_variable(
        self,
        node: ASTNode,
        symbols: List[Symbol],
        parent_class: Optional[str],
    ) -> None:
        assign = _find_child(node, "assignment")
        if assign:
            self._extract_assignment(assign, symbols, parent_class)

    def _extract_assignment(
        self,
        node: ASTNode,
        symbols: List[Symbol],
        parent_class: Optional[str],
    ) -> None:
        left = node.children[0] if node.children else None
        if not left:
            return

        name = _node_text(left)
        if not name or name.startswith("_") and name.startswith("__"):
            return

        # Convention: ALL_CAPS → constant
        is_const = name.isupper() and "_" in name or name.isupper()
        kind = SymbolKind.CONSTANT if is_const else SymbolKind.VARIABLE

        # Type annotation
        ann = _find_child(node, "type")
        return_type = _node_text(ann) if ann else None

        symbols.append(Symbol(
            kind=kind,
            name=name,
            position=node.position,
            language=Language.PYTHON,
            parent_name=parent_class,
            return_type=return_type,
        ))

    # ---- helpers -------------------------------------------------------

    @staticmethod
    def _get_decorators(node: ASTNode) -> List[str]:
        parent = node
        decorators = []
        for c in _find_children(parent, "decorator"):
            txt = _node_text(c)
            if txt.startswith("@"):
                txt = txt[1:]
            decorators.append(txt)
        return decorators

    @staticmethod
    def _get_parameters(node: ASTNode) -> List[str]:
        params_node = _find_child(node, "parameters")
        if not params_node:
            return []
        result = []
        for c in params_node.children:
            if c.type in ("identifier", "typed_parameter", "default_parameter",
                          "typed_default_parameter", "list_splat_pattern",
                          "dictionary_splat_pattern"):
                name = _node_text(c).split(":")[0].split("=")[0].strip()
                if name and name not in ("self", "cls", "(", ")", ","):
                    result.append(name)
        return result

    @staticmethod
    def _get_docstring(node: ASTNode) -> Optional[str]:
        body = _find_child(node, "block", "body")
        if not body or not body.children:
            return None
        first = body.children[0]
        if first.type == "expression_statement":
            inner = first.children[0] if first.children else None
            if inner and inner.type == "string":
                txt = _node_text(inner)
                # Strip triple quotes
                for q in ('"""', "'''"):
                    if txt.startswith(q) and txt.endswith(q):
                        return txt[3:-3].strip()
                return txt
        return None

    @staticmethod
    def _get_return_type(node: ASTNode) -> Optional[str]:
        ret = _find_child(node, "return_type", "type")
        if ret:
            return _node_text(ret).lstrip("->").strip()
        return None


# ──────────────────────────────────────────────────────────────────────
# JavaScript / TypeScript extractor
# ──────────────────────────────────────────────────────────────────────

class _JSExtractor:
    """Extract symbols from JavaScript / TypeScript tree-sitter ASTs."""

    def __init__(self, language: Language) -> None:
        self._lang = language

    def extract(self, root: ASTNode) -> List[Symbol]:
        symbols: List[Symbol] = []
        self._walk(root, symbols, parent_class=None, exported=False)
        return symbols

    def _walk(
        self,
        node: ASTNode,
        symbols: List[Symbol],
        parent_class: Optional[str],
        exported: bool,
    ) -> None:
        for child in node.children:
            # Export wrapper
            if child.type in ("export_statement", "export_default_declaration"):
                self._walk(child, symbols, parent_class, exported=True)
                continue

            if child.type == "class_declaration":
                self._extract_class(child, symbols, exported)
            elif child.type in ("function_declaration", "generator_function_declaration"):
                self._extract_function(child, symbols, parent_class, exported)
            elif child.type in ("method_definition",):
                self._extract_method(child, symbols, parent_class)
            elif child.type == "lexical_declaration":
                self._extract_lexical(child, symbols, parent_class, exported)
            elif child.type == "variable_declaration":
                self._extract_lexical(child, symbols, parent_class, exported)
            elif child.type == "interface_declaration":
                self._extract_interface(child, symbols, exported)
            elif child.type == "enum_declaration":
                self._extract_enum(child, symbols, exported)
            elif child.type == "type_alias_declaration":
                self._extract_type_alias(child, symbols, exported)
            elif child.type == "abstract_class_declaration":
                self._extract_class(child, symbols, exported)
            elif child.type == "class_body":
                # Walk class body for methods
                self._walk(child, symbols, parent_class, exported)
            elif child.type in ("program", "statement_block"):
                self._walk(child, symbols, parent_class, exported)

    # ---- classes --------------------------------------------------------

    def _extract_class(self, node: ASTNode, symbols: List[Symbol], exported: bool) -> None:
        name_node = _find_child(node, "type_identifier", "identifier")
        name = _node_text(name_node) if name_node else "<anonymous>"

        # Superclass
        bases: List[str] = []
        heritage = _find_child(node, "class_heritage")
        if heritage:
            for ident in heritage.children:
                if ident.type in ("identifier", "type_identifier") and ident.text:
                    bases.append(_node_text(ident))

        # Decorators
        decorators = self._get_decorators(node)

        symbols.append(Symbol(
            kind=SymbolKind.CLASS,
            name=name,
            position=node.position,
            language=self._lang,
            bases=bases,
            decorators=decorators,
            is_exported=exported,
        ))

        # Walk body for methods
        body = _find_child(node, "class_body")
        if body:
            self._walk(body, symbols, parent_class=name, exported=exported)

    # ---- functions ------------------------------------------------------

    def _extract_function(
        self,
        node: ASTNode,
        symbols: List[Symbol],
        parent_class: Optional[str],
        exported: bool,
    ) -> None:
        name_node = _find_child(node, "identifier")
        name = _node_text(name_node) if name_node else "<anonymous>"
        is_async = any(c.type == "async" or (c.text and c.text == "async")
                       for c in node.children)
        params = self._get_params(node)
        ret = self._get_return_type(node)

        symbols.append(Symbol(
            kind=SymbolKind.FUNCTION,
            name=name,
            position=node.position,
            language=self._lang,
            parent_name=parent_class,
            parameters=params,
            return_type=ret,
            is_async=is_async,
            is_exported=exported,
        ))

    # ---- methods --------------------------------------------------------

    def _extract_method(
        self,
        node: ASTNode,
        symbols: List[Symbol],
        parent_class: Optional[str],
    ) -> None:
        name_node = _find_child(node, "property_identifier", "identifier",
                                "computed_property_name")
        name = _node_text(name_node) if name_node else "<anonymous>"
        is_async = any(c.text == "async" for c in node.children if c.text)
        params = self._get_params(node)
        ret = self._get_return_type(node)

        # Decorators
        decorators = self._get_decorators(node)

        symbols.append(Symbol(
            kind=SymbolKind.METHOD,
            name=name,
            position=node.position,
            language=self._lang,
            parent_name=parent_class,
            parameters=params,
            return_type=ret,
            decorators=decorators,
            is_async=is_async,
        ))

    # ---- variables / constants ------------------------------------------

    def _extract_lexical(
        self,
        node: ASTNode,
        symbols: List[Symbol],
        parent_class: Optional[str],
        exported: bool,
    ) -> None:
        # "const" → constant, "let"/"var" → variable
        is_const = any(c.text == "const" for c in node.children if c.text)

        for decl in _find_children(node, "variable_declarator"):
            name_node = _find_child(decl, "identifier")
            if not name_node:
                # Could be destructuring — skip for now
                continue
            name = _node_text(name_node)

            # Check if the value is an arrow function or function expression
            value = _find_child(decl, "arrow_function", "function_expression",
                                "async_arrow_function")
            if value:
                is_async = value.type == "async_arrow_function" or any(
                    c.text == "async" for c in value.children if c.text)
                params = self._get_params(value)
                ret = self._get_return_type(value)
                symbols.append(Symbol(
                    kind=SymbolKind.FUNCTION,
                    name=name,
                    position=node.position,
                    language=self._lang,
                    parent_name=parent_class,
                    parameters=params,
                    return_type=ret,
                    is_async=is_async,
                    is_exported=exported,
                ))
            else:
                # Type annotation
                ann = _find_child(decl, "type_annotation")
                ret_type = _node_text(ann).lstrip(":").strip() if ann else None

                symbols.append(Symbol(
                    kind=SymbolKind.CONSTANT if is_const else SymbolKind.VARIABLE,
                    name=name,
                    position=node.position,
                    language=self._lang,
                    parent_name=parent_class,
                    return_type=ret_type,
                    is_exported=exported,
                ))

    # ---- interfaces (TS) ------------------------------------------------

    def _extract_interface(self, node: ASTNode, symbols: List[Symbol], exported: bool) -> None:
        name_node = _find_child(node, "type_identifier", "identifier")
        name = _node_text(name_node) if name_node else "<anonymous>"

        bases: List[str] = []
        extends = _find_child(node, "extends_type_clause")
        if extends:
            for ident in extends.children:
                if ident.type in ("type_identifier", "identifier") and ident.text:
                    bases.append(_node_text(ident))

        symbols.append(Symbol(
            kind=SymbolKind.INTERFACE,
            name=name,
            position=node.position,
            language=self._lang,
            bases=bases,
            is_exported=exported,
        ))

    # ---- enums (TS) -----------------------------------------------------

    def _extract_enum(self, node: ASTNode, symbols: List[Symbol], exported: bool) -> None:
        name_node = _find_child(node, "identifier")
        name = _node_text(name_node) if name_node else "<anonymous>"

        symbols.append(Symbol(
            kind=SymbolKind.ENUM,
            name=name,
            position=node.position,
            language=self._lang,
            is_exported=exported,
        ))

    # ---- type aliases (TS) — treated as annotations --------------------

    def _extract_type_alias(self, node: ASTNode, symbols: List[Symbol], exported: bool) -> None:
        name_node = _find_child(node, "type_identifier", "identifier")
        name = _node_text(name_node) if name_node else "<anonymous>"

        symbols.append(Symbol(
            kind=SymbolKind.ANNOTATION,
            name=name,
            position=node.position,
            language=self._lang,
            is_exported=exported,
        ))

    # ---- helpers --------------------------------------------------------

    @staticmethod
    def _get_params(node: ASTNode) -> List[str]:
        params_node = _find_child(node, "formal_parameters")
        if not params_node:
            return []
        result = []
        for c in params_node.children:
            if c.type in ("identifier", "required_parameter",
                          "optional_parameter", "rest_pattern",
                          "assignment_pattern"):
                name = _node_text(c).split(":")[0].split("=")[0].strip()
                if name and name not in ("(", ")", ","):
                    result.append(name)
        return result

    @staticmethod
    def _get_return_type(node: ASTNode) -> Optional[str]:
        ann = _find_child(node, "return_type", "type_annotation")
        if ann:
            return _node_text(ann).lstrip(":").strip()
        return None

    @staticmethod
    def _get_decorators(node: ASTNode) -> List[str]:
        decorators = []
        for c in _find_children(node, "decorator"):
            txt = _node_text(c)
            if txt.startswith("@"):
                txt = txt[1:]
            decorators.append(txt)
        return decorators


# ──────────────────────────────────────────────────────────────────────
# Symbol Extractor (main entry point)
# ──────────────────────────────────────────────────────────────────────

class SymbolExtractor:
    """
    Extracts structured code symbols from a tree-sitter AST.

    Usage::

        from app.services.ast_service import TreeSitterAST
        from app.services.language_detector import Language

        ast_gen   = TreeSitterAST()
        extractor = SymbolExtractor()

        ast_result = ast_gen.parse_file("app/main.py", Language.PYTHON)
        symbols    = extractor.extract(ast_result)
        print(symbols.summary())
    """

    _extractors = {
        Language.PYTHON: _PythonExtractor(),
        Language.JAVASCRIPT: _JSExtractor(Language.JAVASCRIPT),
        Language.TYPESCRIPT: _JSExtractor(Language.TYPESCRIPT),
    }

    def extract(self, ast_result: ASTResult) -> ExtractionResult:
        """
        Extract all symbols from a parsed AST.

        Parameters
        ----------
        ast_result : ASTResult
            The output of ``TreeSitterAST.parse_file()`` or ``parse_string()``.
        """
        result = ExtractionResult(
            file_path=ast_result.file_path,
            language=ast_result.language,
        )

        if ast_result.error:
            result.errors.append(ast_result.error)
            return result

        if ast_result.root is None:
            result.errors.append("No AST root node")
            return result

        extractor = self._extractors.get(ast_result.language)
        if extractor is None:
            result.errors.append(f"No extractor for {ast_result.language.value}")
            return result

        try:
            result.symbols = extractor.extract(ast_result.root)
        except Exception as exc:
            result.errors.append(f"Extraction error: {exc}")

        return result

    def supports(self, language: Language) -> bool:
        return language in self._extractors
