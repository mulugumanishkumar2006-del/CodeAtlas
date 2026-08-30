import re
import logging
from typing import Dict, Any, List, Optional
from backend.app.services.parsers.base import BaseASTParser

logger = logging.getLogger("codeatlas.parser.javascript")


class JavaScriptParser(BaseASTParser):
    """
    Real JavaScript parser extracting functions, arrow functions, classes, methods,
    nested symbols, imports, and exports with exact source line coordinates.
    Never executes source code.
    """

    def parse(self, source_code: str, file_path: str = "<unknown>") -> Dict[str, Any]:
        symbols: List[Dict[str, Any]] = []
        imports: List[Dict[str, Any]] = []
        exports: List[Dict[str, Any]] = []

        if not source_code.strip():
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "parsed",
                "error": None,
            }

        try:
            lines = source_code.splitlines()

            def find_block_end(start_line_idx: int) -> int:
                """Find matching closing brace for a block starting at start_line_idx."""
                first_line = lines[start_line_idx]
                char_start_pos = 0

                # If an arrow function, look for body opening brace after '=>'
                if "=>" in first_line:
                    arrow_pos = first_line.find("=>")
                    brace_pos = first_line.find("{", arrow_pos)
                    if brace_pos != -1:
                        char_start_pos = brace_pos
                elif ")" in first_line and "{" in first_line:
                    # For standard functions/methods, look for brace after last ')'
                    paren_pos = first_line.rfind(")")
                    brace_pos = first_line.find("{", paren_pos)
                    if brace_pos != -1:
                        char_start_pos = brace_pos

                bracket_count = 0
                found_opening = False
                for idx in range(start_line_idx, len(lines)):
                    line = lines[idx]
                    start_char = char_start_pos if idx == start_line_idx else 0
                    for ch in line[start_char:]:
                        if ch == "{":
                            bracket_count += 1
                            found_opening = True
                        elif ch == "}":
                            bracket_count -= 1
                            if found_opening and bracket_count <= 0:
                                return idx + 1
                return min(start_line_idx + 1, len(lines))


            # Track class context
            class_stack: List[Dict[str, Any]] = []

            for i, line in enumerate(lines):
                line_num = i + 1
                stripped = line.strip()

                # Clean up expired classes from stack
                while class_stack and line_num > class_stack[-1]["end_line"]:
                    class_stack.pop()

                current_class_name = class_stack[-1]["name"] if class_stack else None

                # -------------------------------------------------------------
                # 1. Imports (ES6 and CommonJS)
                # -------------------------------------------------------------
                # import ... from 'module'
                import_match = re.match(r'^import\s+(?:([\w*\s{},$]+)\s+from\s+)?[\'"]([^\'"]+)[\'"]', stripped)
                if import_match:
                    specifiers, mod_path = import_match.groups()
                    imports.append({
                        "module": mod_path,
                        "specifiers": specifiers.strip() if specifiers else None,
                        "import_type": "es6_import",
                        "start_line": line_num,
                        "end_line": line_num,
                    })
                    continue

                # const/let x = require('module')
                require_match = re.search(r'(?:const|let|var)\s+([\w\s{},$]+)\s*=\s*require\([\'"]([^\'"]+)[\'"]\)', stripped)
                if require_match:
                    specifiers, mod_path = require_match.groups()
                    imports.append({
                        "module": mod_path,
                        "specifiers": specifiers.strip(),
                        "import_type": "commonjs_require",
                        "start_line": line_num,
                        "end_line": line_num,
                    })
                    continue

                # -------------------------------------------------------------
                # 2. Exports
                # -------------------------------------------------------------
                if stripped.startswith("export "):
                    if stripped.startswith("export default "):
                        target = stripped[len("export default "):].split(";")[0].strip()
                        exports.append({
                            "name": target.split("(")[0].split("{")[0].strip(),
                            "export_type": "default",
                            "start_line": line_num,
                            "end_line": line_num,
                        })
                    elif re.match(r"^export\s+\{([^}]+)\}", stripped):
                        named_exports = re.match(r"^export\s+\{([^}]+)\}", stripped).group(1)
                        for item in named_exports.split(","):
                            name = item.strip().split(" as ")[0].strip()
                            if name:
                                exports.append({
                                    "name": name,
                                    "export_type": "named_reexport",
                                    "start_line": line_num,
                                    "end_line": line_num,
                                })
                elif "module.exports" in stripped:
                    exports.append({
                        "name": "module.exports",
                        "export_type": "commonjs_export",
                        "start_line": line_num,
                        "end_line": line_num,
                    })

                # -------------------------------------------------------------
                # 3. Class Declaration: [export] [default] class AuthService [extends ...] {
                # -------------------------------------------------------------
                class_match = re.match(r'^(?:export\s+)?(?:default\s+)?class\s+([A-Za-z0-9_$]+)(?:\s+extends\s+([A-Za-z0-9_$.]+))?', stripped)
                if class_match:
                    name = class_match.group(1)
                    extends_class = class_match.group(2)
                    end_line = find_block_end(i)
                    is_exported = "export " in stripped

                    class_stack.append({"name": name, "end_line": end_line})

                    symbols.append({
                        "name": name,
                        "symbol_type": "class",
                        "qualified_name": name,
                        "parent_name": None,
                        "start_line": line_num,
                        "end_line": end_line,
                        "start_column": line.find(name),
                        "end_column": None,
                        "docstring": None,
                        "ast_metadata": {
                            "extends": extends_class,
                            "is_exported": is_exported,
                        },
                    })
                    if is_exported:
                        exports.append({"name": name, "export_type": "class", "start_line": line_num, "end_line": end_line})
                    continue

                # -------------------------------------------------------------
                # 4. Standard Function: [export] [default] [async] function authenticate(...) {
                # -------------------------------------------------------------
                fn_match = re.match(r'^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)', stripped)
                if fn_match:
                    name = fn_match.group(1)
                    raw_args = fn_match.group(2)
                    end_line = find_block_end(i)
                    is_async = "async " in stripped
                    is_exported = "export " in stripped
                    args = [a.strip() for a in raw_args.split(",") if a.strip()]
                    qname = f"{current_class_name}.{name}" if current_class_name else name

                    symbols.append({
                        "name": name,
                        "symbol_type": "async_function" if is_async else "function",
                        "qualified_name": qname,
                        "parent_name": current_class_name,
                        "start_line": line_num,
                        "end_line": end_line,
                        "start_column": line.find(name),
                        "end_column": None,
                        "docstring": None,
                        "ast_metadata": {
                            "is_async": is_async,
                            "is_exported": is_exported,
                            "parameters": args,
                        },
                    })
                    if is_exported:
                        exports.append({"name": name, "export_type": "function", "start_line": line_num, "end_line": end_line})
                    continue

                # -------------------------------------------------------------
                # 5. Arrow Function / Function Expression: [export] const auth = (user) => { ... }
                # -------------------------------------------------------------
                arrow_match = re.match(
                    r'^(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z0-9_$]+)\s*=>',
                    stripped
                )
                fn_expr_match = re.match(
                    r'^(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?function\s*(?:\([A-Za-z0-9_$,\s]*\))?',
                    stripped
                )
                if arrow_match or fn_expr_match:
                    name = (arrow_match or fn_expr_match).group(1)
                    end_line = find_block_end(i)
                    is_async = "async" in stripped
                    is_exported = "export " in stripped
                    is_arrow = arrow_match is not None
                    qname = f"{current_class_name}.{name}" if current_class_name else name

                    symbols.append({
                        "name": name,
                        "symbol_type": "arrow_function" if is_arrow else ("async_function" if is_async else "function"),
                        "qualified_name": qname,
                        "parent_name": current_class_name,
                        "start_line": line_num,
                        "end_line": end_line,
                        "start_column": line.find(name),
                        "end_column": None,
                        "docstring": None,
                        "ast_metadata": {
                            "is_arrow": is_arrow,
                            "is_async": is_async,
                            "is_exported": is_exported,
                        },
                    })
                    if is_exported:
                        exports.append({"name": name, "export_type": "arrow_function", "start_line": line_num, "end_line": end_line})
                    continue

                # -------------------------------------------------------------
                # 6. Class Method: [async] [static] login(...) {
                # -------------------------------------------------------------
                if current_class_name and "(" in stripped and not stripped.startswith("//") and not stripped.startswith("/*"):
                    method_match = re.match(
                        r'^(?:static\s+)?(?:async\s+)?(?:get\s+|set\s+)?([A-Za-z0-9_$]+)\s*\(([^)]*)\)\s*\{?',
                        stripped
                    )
                    if method_match:
                        m_name = method_match.group(1)
                        if m_name not in ("if", "for", "while", "switch", "catch", "return", "throw", "constructor"):
                            raw_args = method_match.group(2)
                            end_line = find_block_end(i)
                            is_async = "async " in stripped
                            is_static = "static " in stripped
                            args = [a.strip() for a in raw_args.split(",") if a.strip()]

                            symbols.append({
                                "name": m_name,
                                "symbol_type": "method",
                                "qualified_name": f"{current_class_name}.{m_name}",
                                "parent_name": current_class_name,
                                "start_line": line_num,
                                "end_line": end_line,
                                "start_column": line.find(m_name),
                                "end_column": None,
                                "docstring": None,
                                "ast_metadata": {
                                    "is_async": is_async,
                                    "is_static": is_static,
                                    "parent": current_class_name,
                                    "parameters": args,
                                },
                            })

            return {
                "symbols": symbols,
                "imports": imports,
                "exports": exports,
                "parse_status": "parsed",
                "error": None,
            }

        except Exception as e:
            err_msg = f"JavaScript parse error in {file_path}: {str(e)}"
            logger.warning(err_msg)
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "error",
                "error": err_msg,
            }
