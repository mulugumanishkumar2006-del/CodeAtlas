import re
import logging
from typing import Dict, Any, List, Optional
from backend.app.services.parsers.base import BaseASTParser

logger = logging.getLogger("codeatlas.parsers.rust")


class RustParser(BaseASTParser):
    """
    Static Rust source code parser.
    Extracts use statements, structs, enums, traits, impls, functions,
    and fn main() entry points without executing untrusted code.
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

            # 1. Use / Import extraction
            use_regex = re.compile(r"^(?:pub\s+)?use\s+([a-zA-Z0-9_:]+)(?:::\{([^}]+)\}|::\*)?\s*;")
            for idx, line in enumerate(lines):
                line_no = idx + 1
                stripped = line.strip()

                u_match = use_regex.match(stripped)
                if u_match:
                    base_path = u_match.group(1)
                    sub_items = u_match.group(2)
                    if sub_items:
                        for item in sub_items.split(","):
                            it = item.strip()
                            if it:
                                imports.append({
                                    "module": base_path,
                                    "name": it,
                                    "alias": None,
                                    "line": line_no,
                                    "is_type_only": False,
                                })
                    else:
                        name = base_path.split("::")[-1]
                        imports.append({
                            "module": base_path,
                            "name": name,
                            "alias": None,
                            "line": line_no,
                            "is_type_only": False,
                        })

            # 2. Struct, Enum, Trait, Function
            type_regex = re.compile(
                r"^(?:#\[[^\]]+\]\s*)*"
                r"(?:pub(?:\([^)]+\))?\s+)?\b(struct|enum|trait|union)\s+([a-zA-Z0-9_]+)"
            )
            fn_regex = re.compile(
                r"^(?:#\[[^\]]+\]\s*)*"
                r"(?:pub(?:\([^)]+\))?\s+)?(?:async\s+)?(?:const\s+)?(?:unsafe\s+)?fn\s+([a-zA-Z0-9_]+)"
            )

            for idx, line in enumerate(lines):
                line_no = idx + 1
                stripped = line.strip()

                if stripped.startswith("//") or stripped.startswith("/*"):
                    continue

                # Struct / Enum / Trait
                t_match = type_regex.match(stripped)
                if t_match:
                    kind = t_match.group(1)
                    name = t_match.group(2)
                    end_line = self._find_matching_brace(lines, idx) if "{" in stripped or (idx + 1 < len(lines) and "{" in lines[idx + 1]) else line_no

                    sym_type = "struct" if kind == "struct" else ("enum" if kind == "enum" else "interface")
                    symbols.append({
                        "name": name,
                        "symbol_type": sym_type,
                        "qualified_name": name,
                        "start_line": line_no,
                        "end_line": max(end_line, line_no),
                        "start_column": line.find(name),
                        "end_column": len(line),
                        "docstring": None,
                        "ast_metadata": {"kind": kind},
                    })
                    continue

                # Function
                f_match = fn_regex.match(stripped)
                if f_match:
                    func_name = f_match.group(1)
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
                        "ast_metadata": {
                            "is_main": is_main,
                            "is_async": "async fn" in stripped,
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
            logger.warning(f"Error parsing Rust source in {file_path}: {e}")
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
