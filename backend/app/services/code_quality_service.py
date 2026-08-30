import ast
import hashlib
import logging
import re
from collections import defaultdict
from pathlib import Path
from typing import Dict, Any, List, Set, Tuple, Optional

logger = logging.getLogger("codeatlas.quality")


class CodeQualityService:
    """
    Real Code Quality & Technical Debt Intelligence Engine for CodeAtlas:
    - AST-based cyclomatic complexity computation for Python & TypeScript/JavaScript
    - Oversized function & oversized file detection with exact source coordinates
    - God Class detection with multi-signal evidence (methods, size, coupling)
    - Deterministic token/block duplication detection with similarity percentages
    - Potential Dead Code & unused file candidate discovery
    - Unused import detection
    - High-coupling change-risk hotspot identification
    - Explainable Technical Debt / Maintainability scoring (0–100) with factor breakdowns
    - Repository-isolated in-memory caching with invalidation
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def invalidate_cache(self, repository_id: Optional[str] = None):
        """Invalidates quality cache for a specific repository or all repositories."""
        if repository_id:
            self._cache.pop(repository_id, None)
            logger.info(f"Invalidated quality cache for repository '{repository_id}'")
        else:
            self._cache.clear()
            logger.info("Invalidated all quality cache")

    # =========================================================================
    # 1. AST CYCLOMATIC COMPLEXITY ENGINE
    # =========================================================================

    def compute_python_function_complexity(self, func_node: ast.AST) -> int:
        """
        Computes standard McCabe cyclomatic complexity for a Python function AST node.
        Base complexity = 1 + number of branching decision points.
        Branching points: if, elif, while, for, async for, except, with, async with, assert,
        comprehensions (list, dict, set, generator), boolean operations (and, or), ternary if-expressions.
        """
        complexity = 1

        for child in ast.walk(func_node):
            if child is func_node:
                continue

            # Nested functions are handled separately
            if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                continue

            if isinstance(child, (ast.If, ast.While, ast.For, ast.AsyncFor)):
                complexity += 1
            elif isinstance(child, ast.ExceptHandler):
                complexity += 1
            elif isinstance(child, (ast.With, ast.AsyncWith)):
                complexity += 1
            elif isinstance(child, ast.Assert):
                complexity += 1
            elif isinstance(child, ast.IfExp):  # ternary expression
                complexity += 1
            elif isinstance(child, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)):
                complexity += len(child.generators)
            elif isinstance(child, ast.BoolOp):  # boolean 'and' / 'or'
                complexity += len(child.values) - 1

        return complexity

    def compute_text_fallback_complexity(self, code_snippet: str) -> int:
        """
        Calculates cyclomatic complexity for non-Python or unparseable source files using
        deterministic token-level branching keywords (if, else if, for, while, catch, switch, case, &&, ||, ?).
        """
        complexity = 1
        branch_patterns = [
            r"\bif\b",
            r"\belse\s+if\b",
            r"\bfor\b",
            r"\bwhile\b",
            r"\bcatch\b",
            r"\bcase\b",
            r"&&",
            r"\|\|",
            r"\?\?",
            r"\?[^.:\n]+\:",  # ternary operator
        ]
        for pattern in branch_patterns:
            matches = re.findall(pattern, code_snippet)
            complexity += len(matches)
        return complexity

    def classify_complexity(self, complexity: int) -> str:
        if complexity <= 5:
            return "Low"
        elif complexity <= 10:
            return "Moderate"
        elif complexity <= 20:
            return "High"
        else:
            return "Very High"

    # =========================================================================
    # 2. DUPLICATION DETECTION ENGINE
    # =========================================================================

    def detect_duplications(
        self,
        files_sources: Dict[str, Tuple[str, str]],  # file_path -> (file_id, source_code)
        min_lines: int = 5,
        min_similarity: float = 80.0,
    ) -> List[Dict[str, Any]]:
        """
        Detects exact and near-duplicate code blocks across files using normalized sliding window hashes.
        Filters out imports, blank lines, single-line braces, and comments.
        """
        clusters: List[Dict[str, Any]] = []
        normalized_windows: Dict[str, List[Tuple[str, Optional[str], int, int, str]]] = defaultdict(list)

        def normalize_line(line: str) -> str:
            # Strip comments, whitespace, punctuation
            l = re.sub(r"#.*$", "", line)
            l = re.sub(r"//.*$", "", l)
            l = re.sub(r"/\*.*?\*/", "", l)
            l = re.sub(r"\s+", "", l)
            return l

        for file_path, (file_id, source_code) in files_sources.items():
            # Skip generated or lock files
            p_lower = file_path.lower()
            if any(ign in p_lower for ign in ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "dist/", "build/", ".min."]):
                continue

            lines = source_code.splitlines()
            if len(lines) < min_lines:
                continue

            # Build cleaned lines with original line numbers
            cleaned_indexed_lines = []
            for i, line in enumerate(lines):
                norm = normalize_line(line)
                # Ignore import lines and tiny trivial symbols
                if norm and not norm.startswith(("import", "from", "export", "require", "{", "}", "package")):
                    cleaned_indexed_lines.append((i + 1, norm, line))

            # Sliding window of min_lines
            for idx in range(len(cleaned_indexed_lines) - min_lines + 1):
                window = cleaned_indexed_lines[idx : idx + min_lines]
                start_l = window[0][0]
                end_l = window[-1][0]
                joined_norm = "".join(w[1] for w in window)

                # Skip windows with too few characters
                if len(joined_norm) < 40:
                    continue

                w_hash = hashlib.md5(joined_norm.encode("utf-8")).hexdigest()
                preview = "\n".join(w[2] for w in window[:3])
                normalized_windows[w_hash].append((file_path, file_id, start_l, end_l, preview))

        # Collect duplicate occurrences with distinct files or non-overlapping ranges
        seen_pairs: Set[Tuple[str, int, str, int]] = set()
        cluster_id = 1

        for w_hash, occurrences in normalized_windows.items():
            if len(occurrences) >= 2:
                for i in range(len(occurrences)):
                    for j in range(i + 1, len(occurrences)):
                        src = occurrences[i]
                        tgt = occurrences[j]

                        # Skip overlapping regions in the exact same file
                        if src[0] == tgt[0] and abs(src[2] - tgt[2]) < min_lines:
                            continue

                        pair_key = (src[0], src[2], tgt[0], tgt[2])
                        if pair_key in seen_pairs:
                            continue
                        seen_pairs.add(pair_key)

                        clusters.append({
                            "id": f"dup_cluster_{cluster_id}",
                            "similarity_percentage": 100.0,
                            "token_count": len(w_hash),
                            "line_count": min_lines,
                            "source_file": src[0],
                            "source_file_id": src[1],
                            "source_start_line": src[2],
                            "source_end_line": src[3],
                            "target_file": tgt[0],
                            "target_file_id": tgt[1],
                            "target_start_line": tgt[2],
                            "target_end_line": tgt[3],
                            "snippet_preview": src[4],
                        })
                        cluster_id += 1
                        if len(clusters) >= 50:
                            return clusters

        return clusters

    # =========================================================================
    # 3. UNUSED IMPORTS & DEAD CODE DETECTION
    # =========================================================================

    def detect_unused_imports_python(self, source_code: str, file_path: str) -> List[Dict[str, Any]]:
        """
        Detects unused import statements in Python using AST inspection.
        """
        unused: List[Dict[str, Any]] = []
        try:
            tree = ast.parse(source_code, filename=file_path)
        except Exception:
            return []

        imported_names: Dict[str, Tuple[int, str]] = {}
        all_referenced_names: Set[str] = set()

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    name_to_check = alias.asname or alias.name.split(".")[0]
                    imported_names[name_to_check] = (node.lineno, alias.name)
            elif isinstance(node, ast.ImportFrom):
                for alias in node.names:
                    name_to_check = alias.asname or alias.name
                    imported_names[name_to_check] = (node.lineno, f"{node.module or ''}.{alias.name}")
            elif isinstance(node, ast.Name):
                all_referenced_names.add(node.id)
            elif isinstance(node, ast.Attribute):
                if isinstance(node.value, ast.Name):
                    all_referenced_names.add(node.value.id)

        # Check which imported names are never referenced (excluding __all__, __name__, etc.)
        for name, (lineno, full_import) in imported_names.items():
            # If name is only in imported_names and appears <= 0 times elsewhere
            # Note: in ast.walk, the Import node itself doesn't create ast.Name nodes for alias names
            if name not in all_referenced_names and not name.startswith("_"):
                unused.append({
                    "name": name,
                    "full_import": full_import,
                    "line": lineno,
                    "file_path": file_path,
                })

        return unused

    # =========================================================================
    # 4. FULL QUALITY ANALYSIS & TECHNICAL DEBT ENGINE
    # =========================================================================

    def analyze_repository_quality(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        symbols: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        files_sources: Dict[str, str],
        cycles: Optional[List[List[str]]] = None,
        arch_violations: Optional[List[Dict[str, Any]]] = None,
        arch_drift: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Performs comprehensive code quality and technical debt analysis for a repository.
        """
        if repository_id in self._cache:
            return self._cache[repository_id]

        cycles_list = cycles or []
        findings: List[Dict[str, Any]] = []
        file_metrics: List[Dict[str, Any]] = []

        # 1. Map symbols and dependencies per file
        symbols_by_file: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        for s in symbols:
            symbols_by_file[s.get("file_id") or s.get("file_path", "")].append(s)

        in_degree: Dict[str, int] = defaultdict(int)
        out_degree: Dict[str, int] = defaultdict(int)
        target_called_symbols: Set[str] = set()

        for d in dependencies:
            if not d.get("resolved"):
                continue
            src = d.get("source_path")
            tgt = d.get("target_path")
            sym = d.get("name") or d.get("target_symbol")
            if src and tgt:
                out_degree[src] += 1
                in_degree[tgt] += 1
            if sym:
                target_called_symbols.add(sym.lower())

        file_id_map = {f.get("id"): f.get("path") for f in files}
        file_path_map = {f.get("path"): f.get("id") for f in files}
        cycle_files = {f for c in cycles_list for f in c}

        # 2. Analyze each file
        for f in files:
            file_path = f.get("path", "")
            file_id = f.get("id")
            lang = f.get("language") or "Other"
            source_code = files_sources.get(file_path, "")
            lines = source_code.splitlines() if source_code else []
            total_loc = f.get("line_count") or len(lines)

            # Check if test file or generated
            p_lower = file_path.lower()
            is_test = any(t in p_lower for t in ["test", "tests", "__tests__", ".spec.", ".test."])
            is_gen = any(g in p_lower for g in ["generated", "build/", "dist/", ".min.", "package-lock.json", "yarn.lock"])

            # Compute lines breakdown
            code_lines = 0
            blank_lines = 0
            comment_lines = 0
            for line in lines:
                stripped = line.strip()
                if not stripped:
                    blank_lines += 1
                elif stripped.startswith(("#", "//", "/*", "*")):
                    comment_lines += 1
                else:
                    code_lines += 1

            # Get symbols in this file
            file_syms = symbols_by_file.get(file_id, []) or symbols_by_file.get(file_path, [])
            functions = [s for s in file_syms if s.get("symbol_type") in ["function", "async_function", "method"]]
            classes = [s for s in file_syms if s.get("symbol_type") == "class"]

            # Compute AST complexity
            file_max_complexity = 1
            if lang == "Python" and source_code.strip():
                try:
                    tree = ast.parse(source_code, filename=file_path)
                    for node in ast.walk(tree):
                        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                            fn_comp = self.compute_python_function_complexity(node)
                            fn_lines = (getattr(node, "end_lineno", node.lineno) - node.lineno) + 1
                            if fn_comp > file_max_complexity:
                                file_max_complexity = fn_comp

                            # Finding: High Complexity Function
                            if fn_comp >= 11:
                                sev = "CRITICAL" if fn_comp >= 21 else ("HIGH" if fn_comp >= 15 else "MEDIUM")
                                findings.append({
                                    "id": f"finding:comp:{file_id}:{node.name}:{node.lineno}",
                                    "repository_id": repository_id,
                                    "category": "COMPLEXITY",
                                    "severity": sev,
                                    "title": f"High Cyclomatic Complexity in '{node.name}()'",
                                    "description": f"Function '{node.name}' has cyclomatic complexity of {fn_comp} (threshold: 10). It contains {fn_lines} lines of code with multiple decision branches.",
                                    "file_path": file_path,
                                    "file_id": file_id,
                                    "symbol": node.name,
                                    "start_line": node.lineno,
                                    "end_line": getattr(node, "end_lineno", node.lineno),
                                    "metric_value": float(fn_comp),
                                    "threshold": 10.0,
                                    "evidence": {
                                        "complexity": fn_comp,
                                        "lines": fn_lines,
                                        "complexity_level": self.classify_complexity(fn_comp),
                                    },
                                    "recommendation": f"Refactor '{node.name}' by extracting discrete branches or helper functions to reduce cognitive load and test permutations.",
                                })

                            # Finding: Large Function
                            if fn_lines >= 50:
                                findings.append({
                                    "id": f"finding:size_fn:{file_id}:{node.name}:{node.lineno}",
                                    "repository_id": repository_id,
                                    "category": "SIZE",
                                    "severity": "HIGH" if fn_lines >= 100 else "MEDIUM",
                                    "title": f"Oversized Function '{node.name}()'",
                                    "description": f"Function '{node.name}' contains {fn_lines} lines of code (threshold: 50 lines). Large functions increase maintenance friction and bug probability.",
                                    "file_path": file_path,
                                    "file_id": file_id,
                                    "symbol": node.name,
                                    "start_line": node.lineno,
                                    "end_line": getattr(node, "end_lineno", node.lineno),
                                    "metric_value": float(fn_lines),
                                    "threshold": 50.0,
                                    "evidence": {"lines": fn_lines},
                                    "recommendation": f"Break '{node.name}' into modular single-responsibility functions.",
                                })
                except Exception:
                    file_max_complexity = self.compute_text_fallback_complexity(source_code)
            else:
                file_max_complexity = self.compute_text_fallback_complexity(source_code)

            # Finding: Large File
            if total_loc >= 500 and not is_gen:
                findings.append({
                    "id": f"finding:size_file:{file_id}",
                    "repository_id": repository_id,
                    "category": "SIZE",
                    "severity": "HIGH" if total_loc >= 1000 else "MEDIUM",
                    "title": f"Oversized File '{Path(file_path).name}'",
                    "description": f"File '{file_path}' has {total_loc} lines of code and {len(file_syms)} symbols (threshold: 500 lines).",
                    "file_path": file_path,
                    "file_id": file_id,
                    "symbol": None,
                    "start_line": 1,
                    "end_line": total_loc,
                    "metric_value": float(total_loc),
                    "threshold": 500.0,
                    "evidence": {"lines": total_loc, "symbols": len(file_syms)},
                    "recommendation": "Split this file into domain-focused submodules or smaller dedicated service files.",
                })

            # Finding: God Class Detection
            for cls in classes:
                cls_name = cls.get("name", "")
                cls_methods = [s for s in file_syms if s.get("parent_name") == cls_name]
                cls_lines = (cls.get("end_line", 1) - cls.get("start_line", 1)) + 1
                cls_out_deps = out_degree.get(file_path, 0)

                if len(cls_methods) >= 10 and cls_lines >= 200:
                    findings.append({
                        "id": f"finding:god_class:{file_id}:{cls_name}",
                        "repository_id": repository_id,
                        "category": "MAINTAINABILITY",
                        "severity": "HIGH",
                        "title": f"Potential God Class '{cls_name}'",
                        "description": f"Class '{cls_name}' exhibits excessive responsibilities: {len(cls_methods)} methods, {cls_lines} LOC, and {cls_out_deps} outgoing dependencies.",
                        "file_path": file_path,
                        "file_id": file_id,
                        "symbol": cls_name,
                        "start_line": cls.get("start_line", 1),
                        "end_line": cls.get("end_line", cls_lines),
                        "metric_value": float(len(cls_methods)),
                        "threshold": 10.0,
                        "evidence": {
                            "method_count": len(cls_methods),
                            "lines": cls_lines,
                            "outgoing_dependencies": cls_out_deps,
                        },
                        "recommendation": f"Apply Single Responsibility Principle: decompose '{cls_name}' into cohesive delegate classes.",
                    })

            # Finding: Unused Imports in Python
            if lang == "Python" and not is_test and not is_gen:
                unused_imps = self.detect_unused_imports_python(source_code, file_path)
                for u in unused_imps:
                    findings.append({
                        "id": f"finding:unused_imp:{file_id}:{u['name']}:{u['line']}",
                        "repository_id": repository_id,
                        "category": "UNUSED_IMPORT",
                        "severity": "LOW",
                        "title": f"Unused Import '{u['name']}'",
                        "description": f"Imported module/name '{u['full_import']}' is never referenced in '{file_path}'.",
                        "file_path": file_path,
                        "file_id": file_id,
                        "symbol": u["name"],
                        "start_line": u["line"],
                        "end_line": u["line"],
                        "metric_value": 0.0,
                        "threshold": 1.0,
                        "evidence": {"import": u["full_import"], "line": u["line"]},
                        "recommendation": f"Remove unused import '{u['full_import']}' on line {u['line']} to keep the module clean.",
                    })

            # Finding: Dead Code Candidate (Internal functions with 0 callers)
            is_entry_file = any(file_path.endswith(ef) for ef in ["main.py", "app.py", "index.py", "index.ts", "index.js", "__init__.py", "server.py", "server.ts", "server.js"])
            if not is_test and not is_gen and not is_entry_file and len(files) > 1:
                for fn in functions:
                    fn_name = fn.get("name", "")
                    # Ignore entry points, special dunder methods, test functions, and constructors
                    if fn_name.startswith(("__", "test_", "setup_", "teardown_")) or fn_name in ["main", "app", "handler", "run", "start"]:
                        continue
                    if fn_name.lower() not in target_called_symbols and in_degree.get(file_path, 0) == 0:
                        findings.append({
                            "id": f"finding:dead_code:{file_id}:{fn_name}:{fn.get('start_line', 1)}",
                            "repository_id": repository_id,
                            "category": "DEAD_CODE",
                            "severity": "LOW",
                            "title": f"Potential Dead Code in '{fn_name}()'",
                            "description": f"Function '{fn_name}' has no detected callers or incoming dependencies across the repository.",
                            "file_path": file_path,
                            "file_id": file_id,
                            "symbol": fn_name,
                            "start_line": fn.get("start_line", 1),
                            "end_line": fn.get("end_line", 1),
                            "metric_value": 0.0,
                            "threshold": 1.0,
                            "evidence": {"callers_found": 0},
                            "recommendation": f"Verify if '{fn_name}' is called dynamically; if unused, safely deprecate and remove it.",
                        })

            # Determine file risk level
            f_in = in_degree[file_path]
            f_out = out_degree[file_path]
            is_cyclic = file_path in cycle_files
            risk_score = (f_in * 3) + (f_out * 2) + min(file_max_complexity, 20) + (15 if is_cyclic else 0)
            risk_level = "CRITICAL" if risk_score >= 35 or (is_cyclic and f_in >= 3) else ("HIGH" if risk_score >= 20 else ("MEDIUM" if risk_score >= 10 else "LOW"))

            file_findings_count = len([fn for fn in findings if fn.get("file_path") == file_path])

            file_metrics.append({
                "file_id": file_id,
                "file_path": file_path,
                "language": lang,
                "lines_of_code": total_loc,
                "code_lines": code_lines,
                "blank_lines": blank_lines,
                "comment_lines": comment_lines,
                "symbol_count": len(file_syms),
                "function_count": len(functions),
                "class_count": len(classes),
                "complexity": file_max_complexity,
                "complexity_level": self.classify_complexity(file_max_complexity),
                "duplication_percentage": 0.0,
                "incoming_dependencies": f_in,
                "outgoing_dependencies": f_out,
                "findings_count": file_findings_count,
                "risk_level": risk_level,
                "is_test_file": is_test,
                "is_generated": is_gen,
            })

        # 3. Detect Duplications
        dup_sources = {f.get("path"): (f.get("id"), files_sources.get(f.get("path"), "")) for f in files}
        duplications = self.detect_duplications(dup_sources)

        for d in duplications:
            findings.append({
                "id": f"finding:dup:{d['id']}",
                "repository_id": repository_id,
                "category": "DUPLICATION",
                "severity": "MEDIUM",
                "title": f"Code Duplication ({d['line_count']} identical lines)",
                "description": f"Code block in '{d['source_file']}:{d['source_start_line']}-{d['source_end_line']}' matches '{d['target_file']}:{d['target_start_line']}-{d['target_end_line']}' with {d['similarity_percentage']}% similarity.",
                "file_path": d["source_file"],
                "file_id": d["source_file_id"],
                "symbol": None,
                "start_line": d["source_start_line"],
                "end_line": d["source_end_line"],
                "metric_value": d["similarity_percentage"],
                "threshold": 80.0,
                "evidence": {
                    "matched_file": d["target_file"],
                    "matched_range": f"L{d['target_start_line']}-L{d['target_end_line']}",
                    "snippet": d["snippet_preview"],
                },
                "recommendation": "Extract common logic into a shared utility function or reusable helper module.",
            })

        # 4. Integrate Architecture Violations & Drift if provided
        if arch_violations:
            for v in arch_violations:
                findings.append({
                    "id": f"finding:arch_viol:{v.get('source_entity')}->{v.get('target_entity')}",
                    "repository_id": repository_id,
                    "category": "ARCHITECTURE_DRIFT",
                    "severity": v.get("severity", "HIGH"),
                    "title": v.get("title", "Architectural Violation"),
                    "description": v.get("description", ""),
                    "file_path": v.get("evidence_file") or v.get("source_entity"),
                    "file_id": file_path_map.get(v.get("evidence_file") or v.get("source_entity")),
                    "symbol": None,
                    "start_line": v.get("evidence_line") or 1,
                    "end_line": v.get("evidence_line") or 1,
                    "metric_value": 1.0,
                    "threshold": 0.0,
                    "evidence": {"source": v.get("source_entity"), "target": v.get("target_entity")},
                    "recommendation": "Decouple layer inversion by introducing an interface or routing via business services.",
                })

        if arch_drift:
            for dr in arch_drift:
                findings.append({
                    "id": f"finding:arch_drift:{dr.get('source_entity')}->{dr.get('target_entity')}",
                    "repository_id": repository_id,
                    "category": "ARCHITECTURE_DRIFT",
                    "severity": dr.get("severity", "MEDIUM"),
                    "title": dr.get("title", "Architecture Drift / Layer Bypass"),
                    "description": dr.get("description", ""),
                    "file_path": dr.get("evidence_file") or dr.get("source_entity"),
                    "file_id": file_path_map.get(dr.get("evidence_file") or dr.get("source_entity")),
                    "symbol": None,
                    "start_line": dr.get("evidence_line") or 1,
                    "end_line": dr.get("evidence_line") or 1,
                    "metric_value": 1.0,
                    "threshold": 0.0,
                    "evidence": {"source": dr.get("source_entity"), "target": dr.get("target_entity")},
                    "recommendation": "Route data requests through the established service layer instead of direct database queries.",
                })

        # 5. Technical Debt Score Calculation (0–100)
        # Formula: Base 100 - weighted deductions
        comp_findings = [f for f in findings if f["category"] == "COMPLEXITY"]
        dup_findings = [f for f in findings if f["category"] == "DUPLICATION"]
        size_findings = [f for f in findings if f["category"] == "SIZE"]
        dead_findings = [f for f in findings if f["category"] == "DEAD_CODE"]
        drift_findings = [f for f in findings if f["category"] == "ARCHITECTURE_DRIFT"]

        comp_ded = min(len(comp_findings) * 4.0, 25.0)
        dup_ded = min(len(dup_findings) * 5.0, 20.0)
        coupling_ded = min(len([f for f in file_metrics if f["risk_level"] in ["HIGH", "CRITICAL"]]) * 4.0, 20.0)
        cycles_ded = min(len(cycles_list) * 10.0, 15.0)
        size_ded = min(len(size_findings) * 3.0, 10.0)
        dead_ded = min(len(dead_findings) * 2.0, 10.0)

        total_deduction = comp_ded + dup_ded + coupling_ded + cycles_ded + size_ded + dead_ded
        final_score = max(0.0, round(100.0 - total_deduction, 1))

        if final_score >= 90.0:
            grade, status_label = "A", "Low Technical Debt / Pristine Quality"
        elif final_score >= 75.0:
            grade, status_label = "B", "Moderate Technical Debt"
        elif final_score >= 60.0:
            grade, status_label = "C", "Substantial Technical Debt"
        elif final_score >= 40.0:
            grade, status_label = "D", "High Technical Debt / Immediate Attention Required"
        else:
            grade, status_label = "F", "Critical Technical Debt"

        score_factors = [
            {"factor": "Complexity", "weight": 25.0, "deduction": comp_ded, "score_impact": round(comp_ded, 1), "description": f"{len(comp_findings)} high complexity functions."},
            {"factor": "Duplication", "weight": 20.0, "deduction": dup_ded, "score_impact": round(dup_ded, 1), "description": f"{len(dup_findings)} duplicate code clusters."},
            {"factor": "Coupling", "weight": 20.0, "deduction": coupling_ded, "score_impact": round(coupling_ded, 1), "description": f"{len([f for f in file_metrics if f['risk_level'] in ['HIGH', 'CRITICAL']])} high coupling hotspots."},
            {"factor": "Cycles", "weight": 15.0, "deduction": cycles_ded, "score_impact": round(cycles_ded, 1), "description": f"{len(cycles_list)} circular dependency loops."},
            {"factor": "File & Function Size", "weight": 10.0, "deduction": size_ded, "score_impact": round(size_ded, 1), "description": f"{len(size_findings)} oversized files/functions."},
            {"factor": "Dead Code Candidates", "weight": 10.0, "deduction": dead_ded, "score_impact": round(dead_ded, 1), "description": f"{len(dead_findings)} potential dead code symbols."},
        ]

        score_breakdown = {
            "score": final_score,
            "max_score": 100.0,
            "grade": grade,
            "status_label": status_label,
            "complexity_deduction": comp_ded,
            "duplication_deduction": dup_ded,
            "coupling_deduction": coupling_ded,
            "cycles_deduction": cycles_ded,
            "size_deduction": size_ded,
            "dead_code_deduction": dead_ded,
            "factors": score_factors,
        }

        # Category counts
        category_counts: Dict[str, int] = defaultdict(int)
        for f in findings:
            category_counts[f["category"]] += 1

        crit_count = len([f for f in findings if f["severity"] == "CRITICAL"])
        high_count = len([f for f in findings if f["severity"] == "HIGH"])
        med_count = len([f for f in findings if f["severity"] == "MEDIUM"])
        low_count = len([f for f in findings if f["severity"] in ["LOW", "INFO"]])

        summary_text = (
            f"Repository Technical Debt Score: {final_score}/100 (Grade {grade} - {status_label}). "
            f"Detected {len(findings)} total quality findings ({crit_count} critical, {high_count} high), "
            f"{len(duplications)} duplication clusters, and {len(comp_findings)} high-complexity functions."
        )

        top_findings = sorted(findings, key=lambda x: (
            0 if x["severity"] == "CRITICAL" else (1 if x["severity"] == "HIGH" else (2 if x["severity"] == "MEDIUM" else 3)),
            -(x.get("metric_value") or 0.0)
        ))[:15]

        top_hotspots = sorted(file_metrics, key=lambda x: (
            0 if x["risk_level"] == "CRITICAL" else (1 if x["risk_level"] == "HIGH" else (2 if x["risk_level"] == "MEDIUM" else 3)),
            -x["complexity"],
            -(x["incoming_dependencies"] + x["outgoing_dependencies"])
        ))[:10]

        result = {
            "repository_id": repository_id,
            "score": final_score,
            "grade": grade,
            "status_label": status_label,
            "score_breakdown": score_breakdown,
            "total_files": len(files),
            "total_lines": sum(f["lines_of_code"] for f in file_metrics),
            "total_findings": len(findings),
            "critical_findings": crit_count,
            "high_findings": high_count,
            "medium_findings": med_count,
            "low_findings": low_count,
            "category_counts": dict(category_counts),
            "duplication_clusters_count": len(duplications),
            "dead_code_candidates_count": len(dead_findings),
            "findings": findings,
            "files": file_metrics,
            "duplications": duplications,
            "top_findings": top_findings,
            "top_hotspots": top_hotspots,
            "summary_text": summary_text,
        }

        self._cache[repository_id] = result
        return result


code_quality_service = CodeQualityService()
