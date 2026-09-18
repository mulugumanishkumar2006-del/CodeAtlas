import re
import logging
from typing import Dict, Any, List, Optional
from backend.app.services.parsers.base import BaseASTParser

logger = logging.getLogger("codeatlas.parsers.cpp")


class CppParser(BaseASTParser):
    """
    Static C and C++ source code parser.
    Extracts includes, namespaces, classes, structs, functions, and main() entry points without executing code.
    """

    def parse(self, source_code: str, file_path: str = "<unknown>") -> Dict[str, Any]:
        symbols: List[Dict[str, Any]] = []
        imports: List[Dict[str, Any]] = []
        exports: List[Dict[str, Any]] = []

        if not source_code or not source_code.strip():
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "parsed",
                "error": None,
            }

        try:
            lines = source_code.splitlines()

            # 1. Include extraction
            inc_regex = re.compile(r'^\s*#\s*include\s+([<"][^>"]+[>"])')
            for idx, line in enumerate(lines):
                line_no = idx + 1
                stripped = line.strip()

                m = inc_regex.match(stripped)
                if m:
                    header = m.group(1).strip('<>"')
                    is_system = m.group(1).startswith("<")
                    imports.append({
                        "module": header,
                        "name": header.split("/")[-1],
                        "alias": None,
                        "line": line_no,
                        "is_type_only": False,
                    })

            # 2. Classes, Structs, Functions
            class_regex = re.compile(r'^\s*(?:template\s*<[^>]+>\s*)?(?:class|struct)\s+([A-Za-z0-9_]+)')
            func_regex = re.compile(
                r'^\s*(?:[A-Za-z0-9_<>,:~*&\s]+)\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*(?:const)?\s*(?:\{|;)'
            )

            for idx, line in enumerate(lines):
                line_no = idx + 1
                stripped = line.strip()

                if stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("#"):
                    continue

                # Class / Struct
                c_match = class_regex.match(stripped)
                if c_match and not stripped.endswith(";"):
                    name = c_match.group(1)
                    end_line = self._find_matching_brace(lines, idx) if "{" in stripped or (idx + 1 < len(lines) and "{" in lines[idx + 1]) else line_no
                    sym_type = "class" if "class" in stripped else "struct"

                    symbols.append({
                        "name": name,
                        "symbol_type": sym_type,
                        "qualified_name": name,
                        "start_line": line_no,
                        "end_line": max(end_line, line_no),
                        "start_column": line.find(name),
                        "end_column": len(line),
                        "docstring": None,
                        "ast_metadata": {"is_cpp_class": True},
                    })
                    continue

                # Function
                f_match = func_regex.match(stripped)
                if f_match and not stripped.startswith("if") and not stripped.startswith("for") and not stripped.startswith("while"):
                    func_name = f_match.group(1)
                    if func_name not in {"if", "for", "while", "switch", "catch", "return"}:
                        end_line = self._find_matching_brace(lines, idx) if "{" in stripped or (idx + 1 < len(lines) and "{" in lines[idx + 1]) else line_no
                        is_main = (func_name == "main")

                        symbols.append({
                            "name": func_name,
                            "symbol_type": "function",
                            "qualified_name": func_name,
                            "start_line": line_no,
                            "end_line": max(end_line, line_no),
                            "start_column": line.find(func_name),
                            "end_column": len(line),
                            "docstring": None,
                            "ast_metadata": {"is_main": is_main},
                        })
                        continue

            return {
                "symbols": symbols,
                "imports": imports,
                "exports": exports,
                "parse_status": "parsed",
                "error": None,
            }
        except Exception as e:
            logger.warning(f"Error parsing C/C++ source in {file_path}: {e}")
            return {
                "symbols": symbols,
                "imports": imports,
                "exports": exports,
                "parse_status": "error",
                "error": str(e),
            }

    def _find_matching_brace(self, lines: List[str], start_idx: int) -> int:
        open_braces = 0
        found_first = False
        for i in range(start_idx, len(lines)):
            line = lines[i]
            clean = re.sub(r'"(?:\\.|[^"\\])*"', '', line)
            clean = re.sub(r'//.*', '', clean)

            for char in clean:
                if char == '{':
                    open_braces += 1
                    found_first = True
                elif char == '}':
                    open_braces -= 1
                    if found_first and open_braces <= 0:
                        return i + 1
        return len(lines)
