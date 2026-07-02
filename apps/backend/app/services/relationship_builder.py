"""
Relationship Builder

Analyses tree-sitter ASTs and extracted symbols to build a directed graph
of code relationships.  This graph is the foundation for Phase 3
visualisation.

Edge types
----------
  IMPORTS          – file A imports module/symbol from file B
  EXPORTS          – file exposes a public symbol
  INHERITS         – class A extends / inherits from class B
  COMPOSITION      – class A holds / instantiates class B
  CALLS            – function/method A calls function/method B
  CLASS_USAGE      – a file references / uses a class defined elsewhere
  MODULE_USAGE     – a file uses a module (import-level dependency)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Set, Tuple

from app.services.ast_service import ASTNode, ASTResult, Position
from app.services.language_detector import Language
from app.services.symbol_extractor import (
    ExtractionResult,
    Symbol,
    SymbolKind,
)


# ──────────────────────────────────────────────────────────────────────
# Edge / Node types
# ──────────────────────────────────────────────────────────────────────

class EdgeKind(str, Enum):
    IMPORTS = "imports"
    EXPORTS = "exports"
    INHERITS = "inherits"
    COMPOSITION = "composition"
    CALLS = "calls"
    CLASS_USAGE = "class_usage"
    MODULE_USAGE = "module_usage"


@dataclass(frozen=True)
class GraphNode:
    """A node in the code graph — either a file or a symbol."""
    id: str                 # unique key: "file::path" or "symbol::path::name"
    kind: str               # "file" | symbol kind value
    name: str               # display name
    file_path: str          # source file
    language: Language
    position: Optional[Position] = None
    metadata: Optional[dict] = None

    def __hash__(self) -> int:
        return hash(self.id)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, GraphNode):
            return self.id == other.id
        return NotImplemented


@dataclass(frozen=True)
class GraphEdge:
    """A directed edge in the code graph."""
    source_id: str          # GraphNode.id of the origin
    target_id: str          # GraphNode.id of the destination
    kind: EdgeKind
    label: Optional[str] = None      # human-readable label
    file_path: Optional[str] = None  # where the relationship is expressed
    line: Optional[int] = None       # source line of the reference

    def __hash__(self) -> int:
        return hash((self.source_id, self.target_id, self.kind))

    def __eq__(self, other: object) -> bool:
        if isinstance(other, GraphEdge):
            return (self.source_id == other.source_id
                    and self.target_id == other.target_id
                    and self.kind == other.kind)
        return NotImplemented


@dataclass
class CodeGraph:
    """
    The complete relationship graph for a repository.

    Stores nodes (files + symbols) and directed edges between them.
    """
    nodes: Dict[str, GraphNode] = field(default_factory=dict)
    edges: List[GraphEdge] = field(default_factory=list)

    # -- mutators --------------------------------------------------------

    def add_node(self, node: GraphNode) -> None:
        self.nodes[node.id] = node

    def add_edge(self, edge: GraphEdge) -> None:
        self.edges.append(edge)

    # -- queries ---------------------------------------------------------

    def get_node(self, node_id: str) -> Optional[GraphNode]:
        return self.nodes.get(node_id)

    def edges_from(self, node_id: str) -> List[GraphEdge]:
        return [e for e in self.edges if e.source_id == node_id]

    def edges_to(self, node_id: str) -> List[GraphEdge]:
        return [e for e in self.edges if e.target_id == node_id]

    def edges_of_kind(self, kind: EdgeKind) -> List[GraphEdge]:
        return [e for e in self.edges if e.kind == kind]

    def neighbours(self, node_id: str) -> Set[str]:
        """Return IDs of all nodes connected to *node_id* (either direction)."""
        result: Set[str] = set()
        for e in self.edges:
            if e.source_id == node_id:
                result.add(e.target_id)
            elif e.target_id == node_id:
                result.add(e.source_id)
        return result

    # -- serialisation ---------------------------------------------------

    def to_dict(self) -> dict:
        return {
            "nodes": [
                {
                    "id": n.id,
                    "kind": n.kind,
                    "name": n.name,
                    "file_path": n.file_path,
                    "language": n.language.value,
                }
                for n in self.nodes.values()
            ],
            "edges": [
                {
                    "source": e.source_id,
                    "target": e.target_id,
                    "kind": e.kind.value,
                    "label": e.label,
                }
                for e in self.edges
            ],
        }

    def summary(self) -> str:
        edge_counts: Dict[str, int] = {}
        for e in self.edges:
            edge_counts[e.kind.value] = edge_counts.get(e.kind.value, 0) + 1
        parts = [f"{v} {k}" for k, v in sorted(edge_counts.items())]
        return (
            f"Graph: {len(self.nodes)} nodes, "
            f"{len(self.edges)} edges "
            f"({', '.join(parts)})"
        )


# ──────────────────────────────────────────────────────────────────────
# ID helpers
# ──────────────────────────────────────────────────────────────────────

def _file_id(path: str) -> str:
    return f"file::{path}"


def _symbol_id(path: str, name: str, parent: Optional[str] = None) -> str:
    if parent:
        return f"symbol::{path}::{parent}.{name}"
    return f"symbol::{path}::{name}"


def _module_id(module: str) -> str:
    return f"module::{module}"


# ──────────────────────────────────────────────────────────────────────
# Relationship Builder
# ──────────────────────────────────────────────────────────────────────

class RelationshipBuilder:
    """
    Builds a :class:`CodeGraph` from extracted symbols and AST data.

    Usage::

        builder = RelationshipBuilder()
        graph = builder.build(file_extractions, file_asts)
    """

    def build(
        self,
        extractions: Dict[str, ExtractionResult],
        asts: Optional[Dict[str, ASTResult]] = None,
    ) -> CodeGraph:
        """
        Build the full relationship graph.

        Parameters
        ----------
        extractions : dict[file_path, ExtractionResult]
            Extracted symbols per file (from SymbolExtractor).
        asts : dict[file_path, ASTResult], optional
            Parsed ASTs per file (from TreeSitterAST).
            Used for deeper call-graph and composition analysis.
        """
        graph = CodeGraph()

        # Build indexes for cross-reference resolution
        symbol_index = self._build_symbol_index(extractions)
        class_index = self._build_class_index(extractions)
        function_index = self._build_function_index(extractions)

        for path, extraction in extractions.items():
            # 1. Add file node
            file_node = GraphNode(
                id=_file_id(path),
                kind="file",
                name=path.rsplit("/", 1)[-1],
                file_path=path,
                language=extraction.language,
            )
            graph.add_node(file_node)

            # 2. Add symbol nodes + export edges
            self._add_symbols(graph, path, extraction)

            # 3. Import / module-usage edges
            self._add_import_edges(graph, path, extraction, symbol_index)

            # 4. Inheritance edges
            self._add_inheritance_edges(graph, path, extraction, class_index)

            # 5. Composition edges (type annotations referencing other classes)
            self._add_composition_edges(graph, path, extraction, class_index)

        # 6. Call edges + class usage (requires ASTs)
        if asts:
            for path, ast_result in asts.items():
                if ast_result.root and path in extractions:
                    self._add_call_edges(
                        graph, path, ast_result, extractions[path],
                        function_index, class_index,
                    )

        return graph

    # ------------------------------------------------------------------
    # Index builders
    # ------------------------------------------------------------------

    @staticmethod
    def _build_symbol_index(
        extractions: Dict[str, ExtractionResult],
    ) -> Dict[str, List[Tuple[str, Symbol]]]:
        """Map symbol name → list of (file_path, Symbol)."""
        index: Dict[str, List[Tuple[str, Symbol]]] = {}
        for path, ext in extractions.items():
            for sym in ext.symbols:
                index.setdefault(sym.name, []).append((path, sym))
        return index

    @staticmethod
    def _build_class_index(
        extractions: Dict[str, ExtractionResult],
    ) -> Dict[str, List[Tuple[str, Symbol]]]:
        """Map class/interface name → list of (file_path, Symbol)."""
        index: Dict[str, List[Tuple[str, Symbol]]] = {}
        for path, ext in extractions.items():
            for sym in ext.symbols:
                if sym.kind in (SymbolKind.CLASS, SymbolKind.INTERFACE):
                    index.setdefault(sym.name, []).append((path, sym))
        return index

    @staticmethod
    def _build_function_index(
        extractions: Dict[str, ExtractionResult],
    ) -> Dict[str, List[Tuple[str, Symbol]]]:
        """Map function/method name → list of (file_path, Symbol)."""
        index: Dict[str, List[Tuple[str, Symbol]]] = {}
        for path, ext in extractions.items():
            for sym in ext.symbols:
                if sym.kind in (SymbolKind.FUNCTION, SymbolKind.METHOD):
                    index.setdefault(sym.name, []).append((path, sym))
        return index

    # ------------------------------------------------------------------
    # Symbol + export nodes
    # ------------------------------------------------------------------

    def _add_symbols(
        self,
        graph: CodeGraph,
        path: str,
        extraction: ExtractionResult,
    ) -> None:
        for sym in extraction.symbols:
            if sym.kind in (SymbolKind.DECORATOR,):
                continue  # decorators are metadata, not standalone nodes

            sym_node = GraphNode(
                id=_symbol_id(path, sym.name, sym.parent_name),
                kind=sym.kind.value,
                name=sym.name,
                file_path=path,
                language=sym.language,
                position=sym.position,
            )
            graph.add_node(sym_node)

            # Export edge: symbol → file (symbol is exported from file)
            if sym.is_exported:
                graph.add_edge(GraphEdge(
                    source_id=_file_id(path),
                    target_id=sym_node.id,
                    kind=EdgeKind.EXPORTS,
                    label=f"exports {sym.name}",
                    file_path=path,
                ))

    # ------------------------------------------------------------------
    # Import edges
    # ------------------------------------------------------------------

    def _add_import_edges(
        self,
        graph: CodeGraph,
        path: str,
        extraction: ExtractionResult,
        symbol_index: Dict[str, List[Tuple[str, Symbol]]],
    ) -> None:
        """
        For each import in the file, create:
          - MODULE_USAGE  edge from file → module node
          - IMPORTS        edge from file → imported symbol (if resolvable)
        """
        # Collect imports from the AST-level data embedded in extraction
        # We look at symbols of kind VARIABLE/CONSTANT that come from imports,
        # but more reliably we parse the source imports from the AST.
        # For now, we use the extraction result's raw import info.

        # Build import info from the tree-sitter AST nodes
        if not extraction.symbols:
            return

        # Use the language to determine import patterns
        lang = extraction.language

        # We extract import relationships from the AST in _add_call_edges
        # For symbol-level imports, create module usage edges for known modules
        self._extract_import_edges_from_symbols(graph, path, extraction, symbol_index)

    def _extract_import_edges_from_symbols(
        self,
        graph: CodeGraph,
        path: str,
        extraction: ExtractionResult,
        symbol_index: Dict[str, List[Tuple[str, Symbol]]],
    ) -> None:
        """Cross-reference symbols used in this file with their definitions elsewhere."""
        # For each class/function used in this file, check if it's defined in another file
        local_names = {s.name for s in extraction.symbols}

        for sym in extraction.symbols:
            # Check bases (inheritance also implies an import relationship)
            for base in sym.bases:
                base_name = base.split(".")[-1]  # handle dotted names
                if base_name in symbol_index:
                    for def_path, def_sym in symbol_index[base_name]:
                        if def_path != path:
                            graph.add_edge(GraphEdge(
                                source_id=_file_id(path),
                                target_id=_symbol_id(def_path, def_sym.name, def_sym.parent_name),
                                kind=EdgeKind.IMPORTS,
                                label=f"imports {base_name}",
                                file_path=path,
                            ))

    # ------------------------------------------------------------------
    # Inheritance edges
    # ------------------------------------------------------------------

    def _add_inheritance_edges(
        self,
        graph: CodeGraph,
        path: str,
        extraction: ExtractionResult,
        class_index: Dict[str, List[Tuple[str, Symbol]]],
    ) -> None:
        for sym in extraction.symbols:
            if sym.kind not in (SymbolKind.CLASS, SymbolKind.INTERFACE):
                continue
            for base in sym.bases:
                base_name = base.split(".")[-1]
                if base_name in class_index:
                    for def_path, def_sym in class_index[base_name]:
                        graph.add_edge(GraphEdge(
                            source_id=_symbol_id(path, sym.name),
                            target_id=_symbol_id(def_path, def_sym.name),
                            kind=EdgeKind.INHERITS,
                            label=f"{sym.name} extends {base_name}",
                            file_path=path,
                            line=sym.position.start_row if sym.position else None,
                        ))

    # ------------------------------------------------------------------
    # Composition edges
    # ------------------------------------------------------------------

    def _add_composition_edges(
        self,
        graph: CodeGraph,
        path: str,
        extraction: ExtractionResult,
        class_index: Dict[str, List[Tuple[str, Symbol]]],
    ) -> None:
        """
        Detect composition: methods/functions with type annotations or
        parameters referencing other classes.
        """
        for sym in extraction.symbols:
            if sym.kind not in (SymbolKind.METHOD, SymbolKind.FUNCTION):
                continue

            # Check return type for class references
            refs = set()
            if sym.return_type:
                refs.update(self._extract_type_refs(sym.return_type))
            # Check parameter types (parameters may contain type info)
            for p in sym.parameters:
                refs.update(self._extract_type_refs(p))

            for ref in refs:
                if ref in class_index:
                    for def_path, def_sym in class_index[ref]:
                        # Composition: the containing class (if method) uses this type
                        source = _symbol_id(path, sym.parent_name) if sym.parent_name else _file_id(path)
                        target = _symbol_id(def_path, def_sym.name)
                        if source != target:
                            graph.add_edge(GraphEdge(
                                source_id=source,
                                target_id=target,
                                kind=EdgeKind.COMPOSITION,
                                label=f"uses {ref}",
                                file_path=path,
                                line=sym.position.start_row if sym.position else None,
                            ))

    @staticmethod
    def _extract_type_refs(type_str: str) -> Set[str]:
        """Pull class-like references from a type annotation string."""
        import re
        # Match capitalised identifiers (likely class names)
        return {m for m in re.findall(r'\b([A-Z][a-zA-Z0-9_]*)\b', type_str)
                if m not in ("None", "True", "False", "Any", "Optional",
                             "List", "Dict", "Set", "Tuple", "Union",
                             "Promise", "Array", "Record", "Partial",
                             "Readonly", "Required", "Pick", "Omit")}

    # ------------------------------------------------------------------
    # Call edges + class usage (requires ASTs)
    # ------------------------------------------------------------------

    def _add_call_edges(
        self,
        graph: CodeGraph,
        path: str,
        ast_result: ASTResult,
        extraction: ExtractionResult,
        function_index: Dict[str, List[Tuple[str, Symbol]]],
        class_index: Dict[str, List[Tuple[str, Symbol]]],
    ) -> None:
        """Walk the AST to find call expressions and resolve them."""
        if not ast_result.root:
            return

        # Build set of locally defined names so we can detect cross-file refs
        local_names = {s.name for s in extraction.symbols}

        # Collect all call_expression / call nodes
        for node in ast_result.root.walk():
            if node.type not in ("call", "call_expression"):
                continue

            callee_name = self._resolve_callee(node)
            if not callee_name:
                continue

            # Find the enclosing function/method for this call
            caller_id = _file_id(path)  # default: file-level
            if node.position:
                call_line = node.position.start_row
                best_enclosing_symbol = None
                best_range_size = float('inf')
                for sym in extraction.symbols:
                    if sym.kind in (SymbolKind.FUNCTION, SymbolKind.METHOD):
                        if sym.position and sym.position.start_row <= call_line <= sym.position.end_row:
                            range_size = sym.position.end_row - sym.position.start_row
                            if range_size < best_range_size:
                                best_range_size = range_size
                                best_enclosing_symbol = sym
                if best_enclosing_symbol:
                    caller_id = _symbol_id(path, best_enclosing_symbol.name, best_enclosing_symbol.parent_name)

            # Resolve target
            base_name = callee_name.split(".")[-1]

            # Function calls
            if base_name in function_index:
                # Find if there are definitions in the same file to prioritize local call links
                same_file_defs = [d for d in function_index[base_name] if d[0] == path]
                defs_to_link = same_file_defs if same_file_defs else function_index[base_name]

                for def_path, def_sym in defs_to_link:
                    target_id = _symbol_id(def_path, def_sym.name, def_sym.parent_name)
                    graph.add_edge(GraphEdge(
                        source_id=caller_id,
                        target_id=target_id,
                        kind=EdgeKind.CALLS,
                        label=f"calls {base_name}",
                        file_path=path,
                        line=node.position.start_row if node.position else None,
                    ))

            # Class instantiation / usage
            if base_name in class_index:
                # Prioritize same-file classes
                same_file_classes = [c for c in class_index[base_name] if c[0] == path]
                classes_to_link = same_file_classes if same_file_classes else class_index[base_name]

                for def_path, def_sym in classes_to_link:
                    target_id = _symbol_id(def_path, def_sym.name)
                    graph.add_edge(GraphEdge(
                        source_id=caller_id,
                        target_id=target_id,
                        kind=EdgeKind.CLASS_USAGE,
                        label=f"uses {base_name}",
                        file_path=path,
                        line=node.position.start_row if node.position else None,
                    ))

        # Module-usage edges from import statements in the AST
        self._add_module_usage_from_ast(graph, path, ast_result)

    def _add_module_usage_from_ast(
        self,
        graph: CodeGraph,
        path: str,
        ast_result: ASTResult,
    ) -> None:
        """Walk AST for import statements and create module-usage edges."""
        if not ast_result.root:
            return

        import_types = {
            "import_statement",
            "import_from_statement",       # Python
            "import_declaration",          # JS/TS
        }

        for node in ast_result.root.walk():
            if node.type not in import_types:
                continue

            module_name = self._extract_module_from_import(node)
            if not module_name:
                continue

            # Create module node
            mod_id = _module_id(module_name)
            if mod_id not in graph.nodes:
                graph.add_node(GraphNode(
                    id=mod_id,
                    kind="module",
                    name=module_name,
                    file_path="<external>",
                    language=Language.UNKNOWN,
                ))

            graph.add_edge(GraphEdge(
                source_id=_file_id(path),
                target_id=mod_id,
                kind=EdgeKind.MODULE_USAGE,
                label=f"uses {module_name}",
                file_path=path,
                line=node.position.start_row,
            ))

    # ------------------------------------------------------------------
    # AST helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _resolve_callee(call_node: ASTNode) -> Optional[str]:
        """Extract the name of the called function from a call expression."""
        if not call_node.children:
            return None

        callee = call_node.children[0]

        # Simple identifier:  foo()
        if callee.type == "identifier":
            return callee.text.strip() if callee.text else None

        # Attribute / member:  obj.method()
        if callee.type in ("attribute", "member_expression"):
            return callee.text.strip() if callee.text else None

        return None

    @staticmethod
    def _extract_module_from_import(node: ASTNode) -> Optional[str]:
        """Extract the module name from an import AST node."""
        # Python: import_statement / import_from_statement
        #   children include "dotted_name" or "module"
        for child in node.children:
            if child.type in ("dotted_name", "module_name"):
                return child.text.strip() if child.text else None
            if child.type == "string" and child.text:
                # JS/TS: import ... from "module"
                txt = child.text.strip().strip("'\"")
                return txt
        # JS/TS: look for a string_fragment inside string node
        for child in node.walk():
            if child.type in ("string_fragment",) and child.text:
                return child.text.strip()
        return None
