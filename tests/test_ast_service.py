"""Smoke test for Tree-sitter AST integration — run from the repo root."""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.services.ast_service import TreeSitterAST
from app.services.language_detector import Language, LanguageDetector
from app.services.scanner import RepositoryScanner


def main():
    repo_root = os.path.join(os.path.dirname(__file__), "..")
    scanner = RepositoryScanner()
    detector = LanguageDetector()
    ast_gen = TreeSitterAST()

    # ---- 1. Parse inline snippets for all three languages ----
    print("=== Inline Snippet Tests ===\n")

    py_result = ast_gen.parse_string(
        'def hello(name):\n    print(f"Hello {name}")\n',
        Language.PYTHON,
    )
    print(f"  Python:     {py_result.summary()}")
    assert py_result.root is not None
    assert py_result.total_nodes > 0
    assert py_result.root.type == "module"

    js_result = ast_gen.parse_string(
        'function greet(name) {\n  console.log("Hello " + name);\n}\n',
        Language.JAVASCRIPT,
    )
    print(f"  JavaScript: {js_result.summary()}")
    assert js_result.root is not None
    assert js_result.root.type == "program"

    ts_result = ast_gen.parse_string(
        'function greet(name: string): void {\n  console.log("Hello " + name);\n}\n',
        Language.TYPESCRIPT,
    )
    print(f"  TypeScript: {ts_result.summary()}")
    assert ts_result.root is not None
    assert ts_result.root.type == "program"

    # ---- 2. Verify node structure (position, type, children) ----
    print("\n=== Node Structure Verification ===\n")

    # The Python snippet should have a function_definition node
    func_nodes = [n for n in py_result.root.walk() if n.type == "function_definition"]
    assert (
        len(func_nodes) == 1
    ), f"Expected 1 function_definition, got {len(func_nodes)}"
    func = func_nodes[0]
    print(f"  function_definition @ {func.position}")
    print(f"    children: {[c.type for c in func.children]}")
    assert func.position.start_row == 0
    assert func.child_count > 0

    # ---- 3. Verify to_dict serialisation ----
    print("\n=== Serialisation Test ===\n")
    d = func.to_dict()
    assert "type" in d
    assert "position" in d
    assert "children" in d
    json_str = json.dumps(d, indent=2)
    print(f"  JSON size: {len(json_str)} chars (function_definition subtree)")
    # Verify round-trip is valid JSON
    parsed_back = json.loads(json_str)
    assert parsed_back["type"] == "function_definition"
    print("  Serialisation round-trip passed")

    # ---- 4. Scan the actual repo and parse real files ----
    print("\n=== Repository File Parsing ===\n")

    scan_result = scanner.scan(repo_root)
    lang_counts = {}
    node_counts = {}
    errors = []

    for f in scan_result.files:
        detection = detector.detect(f.absolute_path, extension=f.extension)
        if not ast_gen.supports(detection.language):
            continue

        # Use TSX parser for .tsx files
        if f.extension == ".tsx":
            result = ast_gen.parse_tsx_file(f.absolute_path)
        else:
            result = ast_gen.parse_file(f.absolute_path, detection.language)

        lang = detection.language.value
        lang_counts[lang] = lang_counts.get(lang, 0) + 1
        node_counts[lang] = node_counts.get(lang, 0) + result.total_nodes
        if result.error:
            errors.append((f.relative_path, result.error))

    for lang in sorted(lang_counts):
        print(
            f"  {lang:15s}  {lang_counts[lang]:3d} files  {node_counts[lang]:6d} AST nodes"
        )

    if errors:
        print(f"\n  Errors ({len(errors)}):")
        for path, err in errors[:5]:
            print(f"    {path}: {err}")

    print()

    # ---- 5. Walk and verify named children ----
    named = py_result.root.named_children
    assert len(named) > 0, "Expected named children in Python module"
    print(f"  Python root named children: {[c.type for c in named]}")

    # ---- 6. Verify unsupported language ----
    assert not ast_gen.supports(Language.UNKNOWN)
    unknown_result = ast_gen.parse_string("hello", Language.UNKNOWN)
    assert unknown_result.error is not None
    print(f"  Unsupported language handled: {unknown_result.error}")

    print("\nAll tests passed")


if __name__ == "__main__":
    main()
