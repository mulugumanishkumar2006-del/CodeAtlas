"""Smoke test for LanguageDetector — run from the repo root."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))


from app.services.language_detector import Language, LanguageDetector
from app.services.scanner import RepositoryScanner


def main():
    repo_root = os.path.join(os.path.dirname(__file__), "..")

    # Scan the repo
    scanner = RepositoryScanner()
    result = scanner.scan(repo_root)

    # Detect languages
    detector = LanguageDetector()
    counts: dict[Language, int] = {}
    samples: dict[Language, list[str]] = {}

    for f in result.files:
        detection = detector.detect(f.absolute_path, extension=f.extension)
        lang = detection.language
        counts[lang] = counts.get(lang, 0) + 1
        samples.setdefault(lang, [])
        if len(samples[lang]) < 3:
            samples[lang].append(f.relative_path)

    # Print summary
    print("=== Language Detection Summary ===\n")
    for lang in sorted(counts, key=lambda lang_key: counts[lang_key], reverse=True):
        print(f"  {lang.value:15s}  {counts[lang]:4d} files")
        for s in samples[lang]:
            print(f"      e.g. {s}")
    print()

    # Verify known files
    py_files = [
        f
        for f in result.files
        if detector.detect(f.absolute_path, f.extension).language == Language.PYTHON
    ]
    ts_files = [
        f
        for f in result.files
        if detector.detect(f.absolute_path, f.extension).language == Language.TYPESCRIPT
    ]
    js_files = [
        f
        for f in result.files
        if detector.detect(f.absolute_path, f.extension).language == Language.JAVASCRIPT
    ]

    assert len(py_files) > 0, "Expected at least one Python file"
    assert len(ts_files) > 0, "Expected at least one TypeScript file"
    # JS files may or may not exist — just log
    print(f"Python files:     {len(py_files)}")
    print(f"TypeScript files: {len(ts_files)}")
    print(f"JavaScript files: {len(js_files)}")
    print()

    # Extension-only detection unit checks
    assert detector.detect_from_extension(".py") == Language.PYTHON
    assert detector.detect_from_extension(".ts") == Language.TYPESCRIPT
    assert detector.detect_from_extension(".tsx") == Language.TYPESCRIPT
    assert detector.detect_from_extension(".js") == Language.JAVASCRIPT
    assert detector.detect_from_extension(".jsx") == Language.JAVASCRIPT
    assert detector.detect_from_extension(".mjs") == Language.JAVASCRIPT
    assert detector.detect_from_extension(".cjs") == Language.JAVASCRIPT
    assert detector.detect_from_extension(".unknown") == Language.UNKNOWN
    print("All extension detection assertions passed")

    print("\n All tests passed")


if __name__ == "__main__":
    main()
