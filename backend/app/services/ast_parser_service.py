import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from backend.app.services.parsers.python_parser import PythonParser
from backend.app.services.parsers.javascript_parser import JavaScriptParser
from backend.app.services.parsers.typescript_parser import TypeScriptParser
from backend.app.services.parsers.java_parser import JavaParser
from backend.app.services.parsers.go_parser import GoParser
from backend.app.services.parsers.rust_parser import RustParser
from backend.app.services.parsers.cpp_parser import CppParser

logger = logging.getLogger("codeatlas.ast_parser")


class ASTParserService:
    """
    Unified AST parsing orchestration service for CodeAtlas.
    Extracts real code symbols (classes, methods, functions, async functions, interfaces,
    components, type aliases, enums, structs, modules), imports, and exports without ever executing untrusted source code.
    """

    SUPPORTED_LANGUAGES = {"Python", "JavaScript", "TypeScript", "TSX", "Java", "Go", "Rust", "C", "C++"}

    def __init__(self):
        self._python_parser = PythonParser()
        self._js_parser = JavaScriptParser()
        self._ts_parser = TypeScriptParser()
        self._java_parser = JavaParser()
        self._go_parser = GoParser()
        self._rust_parser = RustParser()
        self._cpp_parser = CppParser()

    def is_language_supported(self, language: str) -> bool:
        return language in self.SUPPORTED_LANGUAGES

    def parse_file(self, file_path: Path | str, language: str) -> List[Dict[str, Any]]:
        """
        Parses a file and returns extracted symbols list (backwards-compatible API).
        """
        result = self.parse_file_full(file_path, language)
        return result.get("symbols", [])

    def parse_file_full(self, file_path: Path | str, language: str) -> Dict[str, Any]:
        """
        Parses a file and returns complete parsed payload:
        symbols, imports, exports, parse_status, and any error message.
        """
        path = Path(file_path)
        if not path.exists() or not path.is_file():
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "error",
                "error": f"File does not exist: {file_path}",
            }

        if not self.is_language_supported(language):
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "unsupported",
                "error": None,
            }

        try:
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                source_code = f.read()
        except Exception as e:
            err_msg = f"Failed to read file {file_path} for AST parsing: {e}"
            logger.warning(err_msg)
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "error",
                "error": err_msg,
            }

        return self.parse_source_code(source_code, str(file_path), language)

    def parse_source_code(self, source_code: str, file_path: str, language: str) -> Dict[str, Any]:
        """
        Parse raw source code using the appropriate language parser.
        """
        if not self.is_language_supported(language):
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "unsupported",
                "error": None,
            }

        if language == "Python":
            return self._python_parser.parse(source_code, file_path)
        elif language == "JavaScript":
            return self._js_parser.parse(source_code, file_path)
        elif language in ("TypeScript", "TSX"):
            return self._ts_parser.parse(source_code, file_path)
        elif language == "Java":
            return self._java_parser.parse(source_code, file_path)
        elif language == "Go":
            return self._go_parser.parse(source_code, file_path)
        elif language == "Rust":
            return self._rust_parser.parse(source_code, file_path)
        elif language in ("C", "C++"):
            return self._cpp_parser.parse(source_code, file_path)
        else:
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "unsupported",
                "error": None,
            }

    parse_content = parse_source_code

    def calculate_symbol_metrics(self, symbols: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Derives real summary metrics across all extracted symbols.
        Every number is calculated from actual parsed records.
        """
        type_counts: Dict[str, int] = {
            "functions": 0,
            "classes": 0,
            "methods": 0,
            "async_functions": 0,
            "arrow_functions": 0,
            "interfaces": 0,
            "components": 0,
            "type_aliases": 0,
            "enums": 0,
            "structs": 0,
            "modules": 0,
            "other": 0,
        }

        for s in symbols:
            stype = s.get("symbol_type")
            if stype == "function":
                type_counts["functions"] += 1
            elif stype == "class":
                type_counts["classes"] += 1
            elif stype == "method":
                type_counts["methods"] += 1
            elif stype == "async_function":
                type_counts["async_functions"] += 1
            elif stype == "arrow_function":
                type_counts["arrow_functions"] += 1
            elif stype == "interface":
                type_counts["interfaces"] += 1
            elif stype == "component":
                type_counts["components"] += 1
            elif stype == "type_alias":
                type_counts["type_aliases"] += 1
            elif stype == "enum":
                type_counts["enums"] += 1
            elif stype == "struct":
                type_counts["structs"] += 1
            elif stype == "module":
                type_counts["modules"] += 1
            else:
                type_counts["other"] += 1

        total_functions = type_counts["functions"] + type_counts["async_functions"] + type_counts["arrow_functions"]

        return {
            "total_symbols": len(symbols),
            "functions": total_functions,
            "classes": type_counts["classes"],
            "methods": type_counts["methods"],
            "interfaces": type_counts["interfaces"],
            "components": type_counts["components"],
            "type_aliases": type_counts["type_aliases"],
            "enums": type_counts["enums"],
            "breakdown": type_counts,
        }


ast_parser_service = ASTParserService()
