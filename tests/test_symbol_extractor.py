"""Smoke test for SymbolExtractor — run from the repo root."""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.services.scanner import RepositoryScanner
from app.services.language_detector import LanguageDetector, Language
from app.services.ast_service import TreeSitterAST
from app.services.symbol_extractor import SymbolExtractor, SymbolKind


def main():
    ast_gen = TreeSitterAST()
    extractor = SymbolExtractor()

    # ──────────────────────────────────────────────────────────────────
    # 1. Python snippet
    # ──────────────────────────────────────────────────────────────────
    print("=== Python Extraction ===\n")
    py_src = '''\
import os
from typing import List, Optional

MAX_SIZE = 1024

class Animal:
    """Base animal class."""

    def __init__(self, name: str):
        self.name = name

    async def speak(self) -> str:
        return "..."

class Dog(Animal):
    @staticmethod
    def breed() -> str:
        return "unknown"

def helper(x: int, y: int) -> int:
    return x + y

async def async_fetch(url: str):
    pass
'''
    py_ast = ast_gen.parse_string(py_src, Language.PYTHON)
    py_result = extractor.extract(py_ast)
    print(f"  {py_result.summary()}")
    _print_symbols(py_result.symbols)

    assert len(py_result.classes) >= 2, f"Expected 2+ classes, got {len(py_result.classes)}"
    assert len(py_result.methods) >= 3, f"Expected 3+ methods, got {len(py_result.methods)}"
    assert len(py_result.functions) >= 2, f"Expected 2+ functions, got {len(py_result.functions)}"
    assert len(py_result.constants) >= 1, f"Expected 1+ constant, got {len(py_result.constants)}"
    assert any(s.name == "MAX_SIZE" for s in py_result.constants)
    assert any(s.is_async for s in py_result.methods), "Expected async method"
    assert any(s.is_async for s in py_result.functions), "Expected async function"

    # Check decorator extraction
    assert len(py_result.decorators) >= 1, f"Expected decorators, got {len(py_result.decorators)}"

    # Check docstring on Animal
    animal = [s for s in py_result.classes if s.name == "Animal"][0]
    assert animal.docstring == "Base animal class.", f"Got docstring: {animal.docstring}"

    # Check bases on Dog
    dog = [s for s in py_result.classes if s.name == "Dog"][0]
    assert "Animal" in dog.bases, f"Expected Animal in bases, got {dog.bases}"

    print("  Python assertions passed\n")

    # ──────────────────────────────────────────────────────────────────
    # 2. JavaScript snippet
    # ──────────────────────────────────────────────────────────────────
    print("=== JavaScript Extraction ===\n")
    js_src = '''\
const API_URL = "https://example.com";
let counter = 0;

function greet(name) {
    console.log("Hello " + name);
}

const fetchData = async (url) => {
    return fetch(url);
};

class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        this.listeners[event] = callback;
    }
}

class Server extends EventEmitter {
    async start(port) {
        console.log("Starting on " + port);
    }
}
'''
    js_ast = ast_gen.parse_string(js_src, Language.JAVASCRIPT)
    js_result = extractor.extract(js_ast)
    print(f"  {js_result.summary()}")
    _print_symbols(js_result.symbols)

    assert len(js_result.classes) >= 2, f"Expected 2+ classes, got {len(js_result.classes)}"
    assert len(js_result.functions) >= 2, f"Expected 2+ functions, got {len(js_result.functions)}"
    assert len(js_result.constants) >= 1, f"Expected 1+ constant, got {len(js_result.constants)}"
    assert any(s.name == "API_URL" for s in js_result.constants)
    print("  JavaScript assertions passed\n")

    # ──────────────────────────────────────────────────────────────────
    # 3. TypeScript snippet (interfaces, enums, type aliases)
    # ──────────────────────────────────────────────────────────────────
    print("=== TypeScript Extraction ===\n")
    ts_src = '''\
export interface User {
    id: string;
    name: string;
}

export enum Status {
    Active,
    Inactive,
}

export type Config = {
    debug: boolean;
};

export const MAX_RETRIES: number = 3;

export class UserService {
    async getUser(id: string): Promise<User> {
        return {} as User;
    }
}

export function createApp(config: Config): void {
    console.log("creating app");
}
'''
    ts_ast = ast_gen.parse_string(ts_src, Language.TYPESCRIPT)
    ts_result = extractor.extract(ts_ast)
    print(f"  {ts_result.summary()}")
    _print_symbols(ts_result.symbols)

    assert len(ts_result.interfaces) >= 1, f"Expected 1+ interface, got {len(ts_result.interfaces)}"
    assert len(ts_result.enums) >= 1, f"Expected 1+ enum, got {len(ts_result.enums)}"
    assert len(ts_result.annotations) >= 1, f"Expected 1+ annotation (type alias), got {len(ts_result.annotations)}"
    assert any(s.is_exported for s in ts_result.symbols), "Expected exported symbols"
    print("  TypeScript assertions passed\n")

    # ──────────────────────────────────────────────────────────────────
    # 4. Full repo scan
    # ──────────────────────────────────────────────────────────────────
    print("=== Full Repository Extraction ===\n")
    repo_root = os.path.join(os.path.dirname(__file__), "..")
    scanner = RepositoryScanner()
    detector = LanguageDetector()
    scan = scanner.scan(repo_root)

    total_symbols = 0
    kind_counts: dict[str, int] = {}

    for f in scan.files:
        detection = detector.detect(f.absolute_path, f.extension)
        if not ast_gen.supports(detection.language):
            continue
        if f.extension == ".tsx":
            ast_result = ast_gen.parse_tsx_file(f.absolute_path)
        else:
            ast_result = ast_gen.parse_file(f.absolute_path, detection.language)
        result = extractor.extract(ast_result)
        total_symbols += len(result.symbols)
        for s in result.symbols:
            kind_counts[s.kind.value] = kind_counts.get(s.kind.value, 0) + 1

    print(f"  Total symbols extracted: {total_symbols}")
    for kind in sorted(kind_counts):
        print(f"    {kind:15s}  {kind_counts[kind]:4d}")
    print()

    assert total_symbols > 0, "Expected to extract symbols from the repo"
    print("All tests passed")


def _print_symbols(symbols):
    for s in symbols:
        parts = [f"  {s.kind.value:12s} {s.name}"]
        if s.parent_name:
            parts.append(f"(in {s.parent_name})")
        if s.parameters:
            parts.append(f"params={s.parameters}")
        if s.decorators:
            parts.append(f"decorators={s.decorators}")
        if s.bases:
            parts.append(f"bases={s.bases}")
        if s.is_async:
            parts.append("async")
        if s.is_exported:
            parts.append("exported")
        if s.return_type:
            parts.append(f"-> {s.return_type}")
        print(" ".join(parts))
    print()


if __name__ == "__main__":
    main()
