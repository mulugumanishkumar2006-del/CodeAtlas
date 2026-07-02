"""Smoke test for RelationshipBuilder — run from the repo root."""

import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.services.scanner import RepositoryScanner
from app.services.language_detector import LanguageDetector, Language
from app.services.ast_service import TreeSitterAST
from app.services.symbol_extractor import SymbolExtractor
from app.services.relationship_builder import (
    RelationshipBuilder,
    EdgeKind,
    CodeGraph,
)


def main():
    repo_root = os.path.join(os.path.dirname(__file__), "..")
    scanner = RepositoryScanner()
    detector = LanguageDetector()
    ast_gen = TreeSitterAST()
    extractor = SymbolExtractor()
    builder = RelationshipBuilder()

    # ── 1. Inline test: known relationships ─────────────────────────
    print("=== Inline Relationship Test ===\n")

    files = {
        "models/user.py": '''\
class User:
    def __init__(self, name: str):
        self.name = name
''',
        "models/admin.py": '''\
from models.user import User

class Admin(User):
    role: str = "admin"
''',
        "services/user_service.py": '''\
from models.user import User
from models.admin import Admin

class UserService:
    def get_user(self, id: str) -> User:
        return User(name="test")

    def get_admin(self) -> Admin:
        return Admin(name="admin")

def create_service() -> UserService:
    return UserService()
''',
    }

    extractions = {}
    asts = {}
    for path, src in files.items():
        lang = Language.PYTHON
        ast_result = ast_gen.parse_string(src, lang)
        ast_result = type(ast_result)(
            file_path=path, language=lang,
            root=ast_result.root, total_nodes=ast_result.total_nodes,
        )
        asts[path] = ast_result
        ext = extractor.extract(ast_result)
        ext = type(ext)(file_path=path, language=lang, symbols=ext.symbols)
        extractions[path] = ext

    graph = builder.build(extractions, asts)
    print(f"  {graph.summary()}")

    # Verify edge types exist
    edge_kinds = {e.kind for e in graph.edges}
    print(f"  Edge kinds found: {sorted(k.value for k in edge_kinds)}")

    assert EdgeKind.INHERITS in edge_kinds, "Expected INHERITS edges"
    assert EdgeKind.MODULE_USAGE in edge_kinds, "Expected MODULE_USAGE edges"

    # Verify inheritance: Admin extends User
    inherit_edges = graph.edges_of_kind(EdgeKind.INHERITS)
    inherit_labels = [e.label for e in inherit_edges]
    print(f"  Inheritance: {inherit_labels}")
    assert any("Admin extends User" in l for l in inherit_labels if l), \
        f"Expected Admin->User inheritance, got {inherit_labels}"

    # Verify composition: UserService uses User and Admin
    comp_edges = graph.edges_of_kind(EdgeKind.COMPOSITION)
    comp_labels = [e.label for e in comp_edges]
    print(f"  Composition: {comp_labels}")
    assert any("User" in l for l in comp_labels if l), \
        f"Expected User in composition, got {comp_labels}"

    # Verify module usage
    mod_edges = graph.edges_of_kind(EdgeKind.MODULE_USAGE)
    mod_targets = [e.label for e in mod_edges]
    print(f"  Module usage: {mod_targets}")

    print("\n  Inline test assertions passed\n")

    # ── 2. Full repo scan ───────────────────────────────────────────
    print("=== Full Repository Graph ===\n")

    scan_result = scanner.scan(repo_root)
    repo_extractions = {}
    repo_asts = {}

    for f in scan_result.files:
        detection = detector.detect(f.absolute_path, f.extension)
        if not ast_gen.supports(detection.language):
            continue
        if f.extension == ".tsx":
            ast_result = ast_gen.parse_tsx_file(f.absolute_path)
        else:
            ast_result = ast_gen.parse_file(f.absolute_path, detection.language)

        ext = extractor.extract(ast_result)
        # Use relative path as key
        repo_extractions[f.relative_path] = type(ext)(
            file_path=f.relative_path, language=ext.language, symbols=ext.symbols,
        )
        repo_asts[f.relative_path] = type(ast_result)(
            file_path=f.relative_path, language=ast_result.language,
            root=ast_result.root, total_nodes=ast_result.total_nodes,
        )

    repo_graph = builder.build(repo_extractions, repo_asts)
    print(f"  {repo_graph.summary()}\n")

    # Print edge breakdown
    edge_counts = {}
    for e in repo_graph.edges:
        edge_counts[e.kind.value] = edge_counts.get(e.kind.value, 0) + 1
    for kind in sorted(edge_counts):
        print(f"    {kind:15s}  {edge_counts[kind]:4d}")

    print()

    # Verify graph has substance
    assert len(repo_graph.nodes) > 50, f"Expected 50+ nodes, got {len(repo_graph.nodes)}"
    assert len(repo_graph.edges) > 20, f"Expected 20+ edges, got {len(repo_graph.edges)}"

    # ── 3. Serialisation test ───────────────────────────────────────
    print("=== Serialisation Test ===\n")
    graph_dict = repo_graph.to_dict()
    json_str = json.dumps(graph_dict, indent=2)
    print(f"  JSON size: {len(json_str):,} chars")
    parsed = json.loads(json_str)
    assert len(parsed["nodes"]) == len(repo_graph.nodes)
    assert len(parsed["edges"]) == len(repo_graph.edges)
    print("  Serialisation round-trip passed")

    # ── 4. Query API test ───────────────────────────────────────────
    print("\n=== Query API Test ===\n")
    # Pick a file node and check neighbours
    file_nodes = [n for n in repo_graph.nodes.values() if n.kind == "file"]
    if file_nodes:
        sample = file_nodes[0]
        nbrs = repo_graph.neighbours(sample.id)
        outgoing = repo_graph.edges_from(sample.id)
        incoming = repo_graph.edges_to(sample.id)
        print(f"  {sample.name}: {len(nbrs)} neighbours, "
              f"{len(outgoing)} outgoing, {len(incoming)} incoming")

    print("\nAll tests passed")


if __name__ == "__main__":
    main()
