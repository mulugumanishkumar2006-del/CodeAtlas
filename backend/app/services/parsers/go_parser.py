import re
import logging
from typing import Dict, Any, List, Optional
from backend.app.services.parsers.base import BaseASTParser

logger = logging.getLogger("codeatlas.parsers.go")


class GoParser(BaseASTParser):
    """
    Static Go source code parser.
    Extracts package, imports, functions, methods with receivers, structs,
    interfaces, type aliases, and func main() entry points without executing code.
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
            package_name = ""
            in_import_block = False

            # 1. Package & Import Extraction
            for idx, line in enumerate(lines):
                line_no = idx + 1
                stripped = line.strip()

                # Package
                pkg_match = re.match(r"^package\s+([a-zA-Z0-9_]+)", stripped)
                if pkg_match:
                    package_name = pkg_match.group(1)
                    symbols.append({
                        "name": package_name,
                        "symbol_type": "module",
                        "qualified_name": package_name,
                        "start_line": line_no,
                        "end_line": line_no,
                        "start_column": 0,
                        "end_column": len(line),
                        "docstring": None,
                        "ast_metadata": {"is_main_package": (package_name == "main")},
                    })
                    continue

                # Single-line import
                single_imp = re.match(r'^import\s+(?:([a-zA-Z0-9_]+|\.)\s+)?"([^"]+)"', stripped)
                if single_imp:
                    alias = single_imp.group(1)
                    mod_path = single_imp.group(2)
                    name = mod_path.split("/")[-1]
                    imports.append({
                        "module": mod_path,
                        "name": name,
                        "alias": alias if alias != "." else None,
                        "line": line_no,
                        "is_type_only": False,
                    })
                    continue

                # Multi-line import block
                if re.match(r"^import\s*\(", stripped):
                    in_import_block = True
                    continue

                if in_import_block:
                    if stripped.startswith(")"):
                        in_import_block = False
                        continue
                    multi_match = re.match(r'^(?:([a-zA-Z0-9_]+|\.)\s+)?"([^"]+)"', stripped)
                    if multi_match:
                        alias = multi_match.group(1)
                        mod_path = multi_match.group(2)
                        name = mod_path.split("/")[-1]
                        imports.append({
                            "module": mod_path,
                            "name": name,
                            "alias": alias if alias != "." else None,
                            "line": line_no,
                            "is_type_only": False,
                        })

            # 2. Functions, Methods, Structs, Interfaces
            func_regex = re.compile(
                r"^func\s+(?:\((?:[a-zA-Z0-9_]+\s+)?\*?([a-zA-Z0-9_]+)\)\s+)?([a-zA-Z0-9_]+)\s*\("
            )
            type_regex = re.compile(
                r"^type\s+([a-zA-Z0-9_]+)\s+(struct|interface)"
            )
            type_alias_regex = re.compile(
                r"^type\s+([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_\[\]]+)"
            )

            for idx, line in enumerate(lines):
                line_no = idx + 1
                stripped = line.strip()

                if stripped.startswith("//") or stripped.startswith("/*"):
                    continue

                # Type declaration (struct / interface)
                t_match = type_regex.match(stripped)
                if t_match:
                    name = t_match.group(1)
                    kind = t_match.group(2)
                    end_line = self._find_matching_brace(lines, idx)
                    qual_name = f"{package_name}.{name}" if package_name else name
                    sym_type = "struct" if kind == "struct" else "interface"

                    symbols.append({
                        "name": name,
                        "symbol_type": sym_type,
                        "qualified_name": qual_name,
                        "start_line": line_no,
                        "end_line": max(end_line, line_no),
                        "start_column": line.find(name),
                        "end_column": len(line),
                        "docstring": None,
                        "ast_metadata": {"kind": kind},
                    })
                    continue

                # Functions and Methods
                f_match = func_regex.match(stripped)
                if f_match:
                    receiver = f_match.group(1)
                    func_name = f_match.group(2)
                    end_line = self._find_matching_brace(lines, idx)
                    is_method = bool(receiver)
                    sym_type = "method" if is_method else "function"

                    qual_name = f"{package_name}.{receiver}.{func_name}" if receiver else (f"{package_name}.{func_name}" if package_name else func_name)
                    is_main = (func_name == "main" and package_name == "main")

                    symbols.append({
                        "name": func_name,
                        "symbol_type": sym_type,
                        "qualified_name": qual_name,
                        "start_line": line_no,
                        "end_line": max(end_line, line_no),
                        "start_column": line.find(func_name),
                        "end_column": len(line),
                        "docstring": None,
                        "ast_metadata": {
                            "receiver": receiver,
                            "is_main": is_main,
                            "is_exported": func_name[0].isupper() if func_name else False,
                        },
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
            logger.warning(f"Error parsing Go source in {file_path}: {e}")
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
            clean = re.sub(r'`[^`]*`', '', clean)
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
