import re
import logging
from typing import Dict, Any, List, Optional
from backend.app.services.parsers.base import BaseASTParser

logger = logging.getLogger("codeatlas.parsers.java")


class JavaParser(BaseASTParser):
    """
    Static Java code parser.
    Extracts packages, imports, classes, interfaces, records, enums, methods,
    Spring annotations, and main() entry points without executing any source code.
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

            # 1. Package & Import Extraction
            for idx, line in enumerate(lines):
                line_no = idx + 1
                stripped = line.strip()

                # Package
                pkg_match = re.match(r"^package\s+([a-zA-Z0-9_\.]+)\s*;", stripped)
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
                        "ast_metadata": {"is_package": True},
                    })
                    continue

                # Import
                imp_match = re.match(r"^import\s+(?:static\s+)?([a-zA-Z0-9_\.\*]+)\s*;", stripped)
                if imp_match:
                    full_import = imp_match.group(1)
                    parts = full_import.split(".")
                    imported_name = parts[-1] if parts else full_import
                    module_name = ".".join(parts[:-1]) if len(parts) > 1 else full_import
                    imports.append({
                        "module": module_name,
                        "name": imported_name,
                        "alias": None,
                        "line": line_no,
                        "is_type_only": False,
                    })

            # 2. Block/Brace Matching & Structural Extraction
            # Detect classes, interfaces, records, enums
            type_regex = re.compile(
                r"^(?:@[\w\(\)\"\'=\s\.,]+\s+)*"
                r"(?:public|protected|private|abstract|static|final|\s)*"
                r"\b(class|interface|enum|record)\s+([A-Za-z0-9_]+)"
                r"(?:<[^>]+>)?"
                r"(?:\s+extends\s+[A-Za-z0-9_\.<>,\s]+)?"
                r"(?:\s+implements\s+[A-Za-z0-9_\.<>,\s]+)?"
                r"\s*\{?"
            )

            # Method regex
            method_regex = re.compile(
                r"^(?:@[\w\(\)\"\'=\s\.,/]+\s+)*"
                r"(?:public|protected|private|static|final|abstract|synchronized|\s)*"
                r"(?:[A-Za-z0-9_<>,\[\]\?]+)\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)"
                r"(?:\s*throws\s+[A-Za-z0-9_,\s]+)?"
                r"\s*(?:\{|;)"
            )

            current_annotations: List[str] = []

            for idx, line in enumerate(lines):
                line_no = idx + 1
                stripped = line.strip()

                # Collect annotations
                if stripped.startswith("@"):
                    ann_matches = re.findall(r"@([A-Za-z0-9_]+(?:\([^)]*\))?)", stripped)
                    current_annotations.extend(ann_matches)
                    continue

                # Class / Interface / Enum / Record
                t_match = type_regex.search(stripped)
                if t_match and not stripped.startswith("//") and not stripped.startswith("/*"):
                    kind = t_match.group(1)
                    name = t_match.group(2)
                    end_line = self._find_matching_brace(lines, idx)
                    qual_name = f"{package_name}.{name}" if package_name else name

                    annotations = list(current_annotations)
                    current_annotations = []

                    sym_type = "class"
                    if kind == "interface":
                        sym_type = "interface"
                    elif kind == "enum":
                        sym_type = "enum"
                    elif kind == "record":
                        sym_type = "class"

                    symbols.append({
                        "name": name,
                        "symbol_type": sym_type,
                        "qualified_name": qual_name,
                        "start_line": line_no,
                        "end_line": max(end_line, line_no),
                        "start_column": line.find(name),
                        "end_column": len(line),
                        "docstring": None,
                        "ast_metadata": {
                            "kind": kind,
                            "annotations": annotations,
                            "is_spring_boot_app": any("SpringBootApplication" in a for a in annotations),
                            "is_controller": any("Controller" in a for a in annotations),
                        },
                    })
                    continue

                # Method / Function
                m_match = method_regex.search(stripped)
                if m_match and not stripped.startswith("//") and not stripped.startswith("/*") and not stripped.startswith("if") and not stripped.startswith("for") and not stripped.startswith("while"):
                    method_name = m_match.group(1)
                    # Ignore language keywords matching regex
                    if method_name not in {"if", "for", "while", "catch", "switch", "synchronized"}:
                        end_line = self._find_matching_brace(lines, idx) if "{" in stripped or (idx + 1 < len(lines) and "{" in lines[idx + 1]) else line_no
                        annotations = list(current_annotations)
                        current_annotations = []

                        is_main = (method_name == "main" and "String" in stripped and "[]" in stripped)
                        qual_name = f"{package_name}.{method_name}" if package_name else method_name

                        symbols.append({
                            "name": method_name,
                            "symbol_type": "method",
                            "qualified_name": qual_name,
                            "start_line": line_no,
                            "end_line": max(end_line, line_no),
                            "start_column": line.find(method_name),
                            "end_column": len(line),
                            "docstring": None,
                            "ast_metadata": {
                                "annotations": annotations,
                                "is_main": is_main,
                                "is_endpoint": any(any(ep in a for ep in ["GetMapping", "PostMapping", "PutMapping", "DeleteMapping", "RequestMapping"]) for a in annotations),
                            },
                        })
                        continue

                # Reset annotations if normal statement reached
                if stripped and not stripped.startswith("@"):
                    current_annotations = []

            return {
                "symbols": symbols,
                "imports": imports,
                "exports": exports,
                "parse_status": "parsed",
                "error": None,
            }
        except Exception as e:
            logger.warning(f"Error parsing Java source in {file_path}: {e}")
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
            # Strip string literals and comments roughly
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
