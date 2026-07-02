"""Smoke test for ParserFactory — run from the repo root."""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.services.scanner import RepositoryScanner
from app.services.language_detector import LanguageDetector, Language
from app.services.parser import ParserFactory


def main():
    repo_root = os.path.join(os.path.dirname(__file__), "..")
    scanner = RepositoryScanner()
    detector = LanguageDetector()
    factory = ParserFactory()

    scan_result = scanner.scan(repo_root)

    total_parsed = 0
    total_imports = 0
    total_functions = 0
    total_classes = 0
    errors = []

    for f in scan_result.files:
        detection = detector.detect(f.absolute_path, extension=f.extension)
        parser = factory.get_parser(detection.language)
        if parser is None:
            continue

        result = parser.parse(f.absolute_path)
        total_parsed += 1
        total_imports += len(result.imports)
        total_functions += len(result.functions)
        total_classes += len(result.classes)
        if result.errors:
            errors.append((f.relative_path, result.errors))

    print("=== Parser Factory Test ===\n")
    print(f"  Files parsed:    {total_parsed}")
    print(f"  Total imports:   {total_imports}")
    print(f"  Total functions: {total_functions}")
    print(f"  Total classes:   {total_classes}")
    if errors:
        print(f"\n  Parse errors ({len(errors)}):")
        for path, errs in errors:
            for e in errs:
                print(f"    {path}: {e}")
    print()

    # ---- Verify factory routing ----
    assert factory.can_parse(Language.PYTHON)
    assert factory.can_parse(Language.JAVASCRIPT)
    assert factory.can_parse(Language.TYPESCRIPT)
    assert not factory.can_parse(Language.UNKNOWN)
    assert factory.get_parser(Language.UNKNOWN) is None
    print("  Factory routing assertions passed")

    # ---- Parse a known Python file to verify structure ----
    py_parser = factory.get_parser(Language.PYTHON)
    scanner_file = os.path.join(
        os.path.dirname(__file__), "..", "apps", "backend", "app", "services", "scanner.py"
    )
    py_result = py_parser.parse(scanner_file)
    print(f"\n  scanner.py  ->  {py_result.summary()}")
    assert len(py_result.classes) >= 1, "Expected at least 1 class in scanner.py"
    class_names = [c.name for c in py_result.classes]
    assert "RepositoryScanner" in class_names, f"Expected RepositoryScanner class, got {class_names}"
    print(f"    Classes: {class_names}")
    print(f"    Functions: {[f.name for f in py_result.functions]}")
    print()

    # ---- Parse a known TypeScript file ----
    ts_files = [
        f for f in scan_result.files
        if detector.detect(f.absolute_path, f.extension).language == Language.TYPESCRIPT
    ]
    if ts_files:
        ts_parser = factory.get_parser(Language.TYPESCRIPT)
        ts_result = ts_parser.parse(ts_files[0].absolute_path)
        print(f"  {ts_files[0].relative_path}  ->  {ts_result.summary()}")
    print()

    assert total_parsed > 0, "Expected to parse at least one file"
    assert total_imports > 0, "Expected to find at least one import"

    print("All tests passed")


if __name__ == "__main__":
    main()
