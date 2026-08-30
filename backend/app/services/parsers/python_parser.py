import ast
import logging
from typing import Dict, Any, List, Optional
from backend.app.services.parsers.base import BaseASTParser

logger = logging.getLogger("codeatlas.parser.python")


class PythonParser(BaseASTParser):
    """
    Real Python AST parser using Python's built-in `ast` module.
    Extracts classes, methods, functions, async functions, nested structures,
    exact line coordinates, docstrings, decorators, imports, and exports.
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
            tree = ast.parse(source_code, filename=file_path)
        except SyntaxError as e:
            err_msg = f"SyntaxError at line {e.lineno}, col {e.offset}: {e.msg}"
            logger.debug(f"Python parse error in {file_path}: {err_msg}")
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "error",
                "error": err_msg,
            }
        except Exception as e:
            err_msg = f"AST parse error: {str(e)}"
            logger.warning(f"Unexpected Python parse error in {file_path}: {err_msg}")
            return {
                "symbols": [],
                "imports": [],
                "exports": [],
                "parse_status": "error",
                "error": err_msg,
            }

        class Visitor(ast.NodeVisitor):
            def __init__(self):
                self.scope_stack: List[str] = []
                self.parent_stack: List[Optional[str]] = []

            def _get_qname(self, name: str) -> str:
                if self.scope_stack:
                    return f"{'.'.join(self.scope_stack)}.{name}"
                return name

            def _get_parent(self) -> Optional[str]:
                return self.scope_stack[-1] if self.scope_stack else None

            def visit_Import(self, node: ast.Import):
                for alias in node.names:
                    imports.append({
                        "module": alias.name,
                        "name": alias.name,
                        "alias": alias.asname,
                        "import_type": "module",
                        "start_line": node.lineno,
                        "end_line": getattr(node, "end_lineno", node.lineno),
                    })
                self.generic_visit(node)

            def visit_ImportFrom(self, node: ast.ImportFrom):
                module = node.module or ""
                for alias in node.names:
                    imports.append({
                        "module": module,
                        "name": alias.name,
                        "alias": alias.asname,
                        "import_type": "from_import",
                        "start_line": node.lineno,
                        "end_line": getattr(node, "end_lineno", node.lineno),
                    })
                self.generic_visit(node)

            def visit_Assign(self, node: ast.Assign):
                # Detect `__all__ = [...]` for explicit module exports
                for target in node.targets:
                    if isinstance(target, ast.Name) and target.id == "__all__":
                        if isinstance(node.value, (ast.List, ast.Tuple)):
                            for elt in node.value.elts:
                                if isinstance(elt, ast.Constant) and isinstance(elt.value, str):
                                    exports.append({
                                        "name": elt.value,
                                        "export_type": "explicit_all",
                                        "start_line": node.lineno,
                                        "end_line": getattr(node, "end_lineno", node.lineno),
                                    })
                self.generic_visit(node)

            def visit_ClassDef(self, node: ast.ClassDef):
                qname = self._get_qname(node.name)
                parent_name = self._get_parent()
                docstring = ast.get_docstring(node)
                bases = [ast.unparse(b) for b in node.bases] if hasattr(ast, "unparse") else []
                decorators = [ast.unparse(d) for d in node.decorator_list] if hasattr(ast, "unparse") else []

                symbols.append({
                    "name": node.name,
                    "symbol_type": "class",
                    "qualified_name": qname,
                    "parent_name": parent_name,
                    "start_line": node.lineno,
                    "end_line": getattr(node, "end_lineno", node.lineno),
                    "start_column": getattr(node, "col_offset", 0),
                    "end_column": getattr(node, "end_col_offset", None),
                    "docstring": docstring,
                    "ast_metadata": {
                        "bases": bases,
                        "decorators": decorators,
                        "parent": parent_name,
                        "hierarchy_depth": len(self.scope_stack),
                    },
                })

                # Push class scope
                self.scope_stack.append(node.name)
                self.generic_visit(node)
                self.scope_stack.pop()

            def visit_FunctionDef(self, node: ast.FunctionDef):
                self._handle_function(node, is_async=False)

            def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef):
                self._handle_function(node, is_async=True)

            def _handle_function(self, node: ast.FunctionDef | ast.AsyncFunctionDef, is_async: bool):
                qname = self._get_qname(node.name)
                parent_name = self._get_parent()
                docstring = ast.get_docstring(node)
                is_method = len(self.scope_stack) > 0 and not any(
                    s.startswith("def ") or s.startswith("async def ") for s in self.scope_stack
                )
                
                # If parent is a class, symbol_type is method. If inside another function, it's a nested function.
                if parent_name and (symbols and any(s["name"] == parent_name and s["symbol_type"] == "class" for s in symbols)):
                    symbol_type = "method"
                else:
                    symbol_type = "async_function" if is_async else "function"

                decorators = [ast.unparse(d) for d in node.decorator_list] if hasattr(ast, "unparse") else []
                args = [a.arg for a in node.args.args]
                sig = f"{'async ' if is_async else ''}def {node.name}({', '.join(args)})"

                symbols.append({
                    "name": node.name,
                    "symbol_type": symbol_type,
                    "qualified_name": qname,
                    "parent_name": parent_name,
                    "start_line": node.lineno,
                    "end_line": getattr(node, "end_lineno", node.lineno),
                    "start_column": getattr(node, "col_offset", 0),
                    "end_column": getattr(node, "end_col_offset", None),
                    "docstring": docstring,
                    "ast_metadata": {
                        "is_async": is_async,
                        "is_method": symbol_type == "method",
                        "signature": sig,
                        "parameters": args,
                        "decorators": decorators,
                        "parent": parent_name,
                        "hierarchy_depth": len(self.scope_stack),
                    },
                })

                # Push function scope for nested symbols
                self.scope_stack.append(node.name)
                self.generic_visit(node)
                self.scope_stack.pop()

        visitor = Visitor()
        visitor.visit(tree)

        return {
            "symbols": symbols,
            "imports": imports,
            "exports": exports,
            "parse_status": "parsed",
            "error": None,
        }
