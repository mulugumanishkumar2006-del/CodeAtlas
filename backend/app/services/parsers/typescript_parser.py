import re
import logging
from typing import Dict, Any, List, Optional
from backend.app.services.parsers.base import BaseASTParser

logger = logging.getLogger("codeatlas.parser.typescript")


class TypeScriptParser(BaseASTParser):
    """
    Real TypeScript and TSX parser extracting functions, arrow functions, React components,
    classes, methods, interfaces, type aliases, enums, imports, and exports with exact source line coordinates.
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
                # 1. Imports
                # -------------------------------------------------------------
                # import [type] ... from 'module'
                import_match = re.match(r'^import\s+(?:type\s+)?(?:([\w*\s{},$]+)\s+from\s+)?[\'"]([^\'"]+)[\'"]', stripped)
                if import_match:
                    specifiers, mod_path = import_match.groups()
                    imports.append({
                        "module": mod_path,
                        "specifiers": specifiers.strip() if specifiers else None,
                        "import_type": "typescript_import",
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

                # -------------------------------------------------------------
                # 3. Interfaces: [export] interface UserProps [extends ...] {
                # -------------------------------------------------------------
                interface_match = re.match(r'^(?:export\s+)?interface\s+([A-Za-z0-9_$]+)(?:<[^>]+>)?(?:\s+extends\s+([^{]+))?', stripped)
                if interface_match:
                    name = interface_match.group(1)
                    extends_clause = interface_match.group(2)
                    end_line = find_block_end(i)
                    is_exported = "export " in stripped

                    symbols.append({
                        "name": name,
                        "symbol_type": "interface",
                        "qualified_name": name,
                        "parent_name": None,
                        "start_line": line_num,
                        "end_line": end_line,
                        "start_column": line.find(name),
                        "end_column": None,
                        "docstring": None,
                        "ast_metadata": {
                            "extends": extends_clause.strip() if extends_clause else None,
                            "is_exported": is_exported,
                        },
                    })
                    if is_exported:
                        exports.append({"name": name, "export_type": "interface", "start_line": line_num, "end_line": end_line})
                    continue

                # -------------------------------------------------------------
                # 4. Type Aliases: [export] type StatusType = ...;
                # -------------------------------------------------------------
                type_match = re.match(r'^(?:export\s+)?type\s+([A-Za-z0-9_$]+)(?:<[^>]+>)?\s*=', stripped)
                if type_match:
                    name = type_match.group(1)
                    end_line = line_num
                    is_exported = "export " in stripped
                    # If type has multi-line object definition
                    if "{" in stripped and "}" not in stripped:
                        end_line = find_block_end(i)

                    symbols.append({
                        "name": name,
                        "symbol_type": "type_alias",
                        "qualified_name": name,
                        "parent_name": None,
                        "start_line": line_num,
                        "end_line": end_line,
                        "start_column": line.find(name),
                        "end_column": None,
                        "docstring": None,
                        "ast_metadata": {
                            "is_exported": is_exported,
                        },
                    })
                    if is_exported:
                        exports.append({"name": name, "export_type": "type_alias", "start_line": line_num, "end_line": end_line})
                    continue

                # -------------------------------------------------------------
                # 5. Enums: [export] [const] enum UserRole { ... }
                # -------------------------------------------------------------
                enum_match = re.match(r'^(?:export\s+)?(?:const\s+)?enum\s+([A-Za-z0-9_$]+)', stripped)
                if enum_match:
                    name = enum_match.group(1)
                    end_line = find_block_end(i)
                    is_exported = "export " in stripped

                    symbols.append({
                        "name": name,
                        "symbol_type": "enum",
                        "qualified_name": name,
                        "parent_name": None,
                        "start_line": line_num,
                        "end_line": end_line,
                        "start_column": line.find(name),
                        "end_column": None,
                        "docstring": None,
                        "ast_metadata": {
                            "is_exported": is_exported,
                        },
                    })
                    if is_exported:
                        exports.append({"name": name, "export_type": "enum", "start_line": line_num, "end_line": end_line})
                    continue

                # -------------------------------------------------------------
                # 6. Class Declaration: [export] [abstract|default] class AuthClient [extends ...] [implements ...] {
                # -------------------------------------------------------------
                class_match = re.match(r'^(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+([A-Za-z0-9_$]+)(?:<[^>]+>)?(?:\s+extends\s+([A-Za-z0-9_$.]+))?(?:\s+implements\s+([^{]+))?', stripped)
                if class_match:
                    name = class_match.group(1)
                    extends_class = class_match.group(2)
                    implements_clause = class_match.group(3)
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
                            "implements": implements_clause.strip() if implements_clause else None,
                            "is_exported": is_exported,
                        },
                    })
                    if is_exported:
                        exports.append({"name": name, "export_type": "class", "start_line": line_num, "end_line": end_line})
                    continue

                # -------------------------------------------------------------
                # 7. Standard Function / Component: [export] [default] [async] function UserDashboard(...) {
                # -------------------------------------------------------------
                fn_match = re.match(r'^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)(?:<[^>]+>)?\s*\(([^)]*)\)', stripped)
                if fn_match:
                    name = fn_match.group(1)
                    raw_args = fn_match.group(2)
                    end_line = find_block_end(i)
                    is_async = "async " in stripped
                    is_exported = "export " in stripped
                    is_component = bool(re.match(r"^[A-Z][A-Za-z0-9]*$", name))
                    args = [a.strip() for a in raw_args.split(",") if a.strip()]
                    qname = f"{current_class_name}.{name}" if current_class_name else name
                    stype = "component" if is_component else ("async_function" if is_async else "function")

                    symbols.append({
                        "name": name,
                        "symbol_type": stype,
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
                            "is_component": is_component,
                            "parameters": args,
                        },
                    })
                    if is_exported:
                        exports.append({"name": name, "export_type": stype, "start_line": line_num, "end_line": end_line})
                    continue

                # -------------------------------------------------------------
                # 8. Arrow Function / React Component: [export] const Dashboard: React.FC = (...) => { ... }
                # -------------------------------------------------------------
                arrow_match = re.match(
                    r'^(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_$]+)(?:\s*:\s*[^=]+)?\s*=\s*(?:async\s*)?(?:<[^>]+>)?\s*(?:\([^)]*\)|[A-Za-z0-9_$]+)\s*=>',
                    stripped
                )
                if arrow_match:
                    name = arrow_match.group(1)
                    end_line = find_block_end(i)
                    is_async = "async" in stripped
                    is_exported = "export " in stripped
                    is_react_fc = "React.FC" in line or "FC<" in line or "JSX.Element" in line
                    is_pascal_case = bool(re.match(r"^[A-Z][A-Za-z0-9]*$", name))
                    is_component = is_react_fc or is_pascal_case
                    stype = "component" if is_component else ("async_function" if is_async else "arrow_function")
                    qname = f"{current_class_name}.{name}" if current_class_name else name

                    symbols.append({
                        "name": name,
                        "symbol_type": stype,
                        "qualified_name": qname,
                        "parent_name": current_class_name,
                        "start_line": line_num,
                        "end_line": end_line,
                        "start_column": line.find(name),
                        "end_column": None,
                        "docstring": None,
                        "ast_metadata": {
                            "is_arrow": True,
                            "is_async": is_async,
                            "is_exported": is_exported,
                            "is_component": is_component,
                        },
                    })
                    if is_exported:
                        exports.append({"name": name, "export_type": stype, "start_line": line_num, "end_line": end_line})
                    continue

                # -------------------------------------------------------------
                # 9. Class Method: [public|private|protected] [async] [static] login(...) {
                # -------------------------------------------------------------
                if current_class_name and "(" in stripped and not stripped.startswith("//") and not stripped.startswith("/*"):
                    method_match = re.match(
                        r'^(?:(?:public|private|protected|static|override|readonly|async|get|set)\s+)*([A-Za-z0-9_$]+)(?:<[^>]+>)?\s*\(([^)]*)\)(?:\s*:\s*[^{]+)?\s*\{?',
                        stripped
                    )
                    if method_match:
                        m_name = method_match.group(1)
                        if m_name not in ("if", "for", "while", "switch", "catch", "return", "throw", "constructor"):
                            raw_args = method_match.group(2)
                            end_line = find_block_end(i)
                            is_async = "async" in stripped
                            is_static = "static" in stripped
                            visibility = "private" if "private " in stripped else ("protected" if "protected " in stripped else "public")
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
                                    "visibility": visibility,
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
            err_msg = f"TypeScript parse error in {file_path}: {str(e)}"
            logger.warning(err_msg)
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "error",
                "error": err_msg,
            }
