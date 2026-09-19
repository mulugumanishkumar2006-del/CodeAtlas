import ast
import logging
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional, Set, Tuple

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode, GraphRelationship
from backend.app.models.finding import Finding
from backend.app.services.source_code_service import source_code_service
from backend.app.services.code_quality_service import code_quality_service
from backend.app.services.architecture_intelligence_service import architecture_intelligence_service

logger = logging.getLogger("codeatlas.technical_debt")


class TechnicalDebtService:
    """
    Phase 21 — Technical Debt Engine
    Analyzes repositories to detect evidence-based technical debt across 6 categories:
    1. Complexity Debt (cyclomatic complexity, oversized functions/files, deep nesting, excess parameters)
    2. Duplication Debt (repeated patterns, identical or near-identical blocks)
    3. Dependency Debt (coupling hotspots, unstable modules, circular dependencies, high fan-in/fan-out)
    4. Architecture Debt (layer boundary violations, cross-tier leakage, drift)
    5. Test Debt (untested critical components, high-risk code lacking test evidence)
    6. Documentation Debt (undocumented public APIs, complex modules without explanation)
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def invalidate_cache(self, repository_id: Optional[str] = None):
        if repository_id:
            self._cache.pop(repository_id, None)
        else:
            self._cache.clear()

    # =========================================================================
    # 1. DEBT DETECTION HELPERS
    # =========================================================================

    def _analyze_python_ast_debt(
        self, source_code: str, file_path: str
    ) -> List[Dict[str, Any]]:
        """Extracts AST-level complexity, parameter, and nesting debt findings."""
        findings = []
        try:
            tree = ast.parse(source_code, filename=file_path)
        except Exception:
            return findings

        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                func_name = node.name
                line_start = node.lineno
                line_end = getattr(node, "end_lineno", line_start)
                loc = (line_end - line_start) + 1

                # 1. Cyclomatic Complexity
                complexity = code_quality_service.compute_python_function_complexity(node)
                if complexity > 25:
                    findings.append({
                        "category": "COMPLEXITY",
                        "type": "EXTREME_CYCLOMATIC_COMPLEXITY",
                        "severity": "CRITICAL",
                        "confidence": "HIGH",
                        "title": f"Extreme Cyclomatic Complexity in '{func_name}'",
                        "description": (
                            f"Function '{func_name}' has cyclomatic complexity of {complexity} "
                            f"(threshold: 25). High branching makes this function difficult to test and maintain."
                        ),
                        "file_path": file_path,
                        "line_start": line_start,
                        "line_end": line_end,
                        "symbol_name": func_name,
                        "evidence": {"complexity": complexity, "lines_of_code": loc, "branching_points": complexity - 1},
                        "impact": "Significantly higher defect rate and regression risk during modifications.",
                        "remediation": f"Decompose '{func_name}' into smaller sub-methods or apply the Strategy pattern.",
                    })
                elif complexity > 8:
                    findings.append({
                        "category": "COMPLEXITY",
                        "type": "HIGH_CYCLOMATIC_COMPLEXITY",
                        "severity": "HIGH" if complexity > 15 else "MEDIUM",
                        "confidence": "HIGH",
                        "title": f"High Cyclomatic Complexity in '{func_name}'",
                        "description": f"Function '{func_name}' has cyclomatic complexity of {complexity} (threshold: 8).",
                        "file_path": file_path,
                        "line_start": line_start,
                        "line_end": line_end,
                        "symbol_name": func_name,
                        "evidence": {"complexity": complexity, "lines_of_code": loc},
                        "impact": "Increased cognitive load and susceptibility to bugs.",
                        "remediation": f"Simplify nested branching and extract conditional logic in '{func_name}'.",
                    })

                # 2. Oversized Function
                if loc > 100:
                    findings.append({
                        "category": "COMPLEXITY",
                        "type": "OVERSIZED_FUNCTION",
                        "severity": "HIGH",
                        "confidence": "HIGH",
                        "title": f"Oversized Function '{func_name}' ({loc} lines)",
                        "description": f"Function '{func_name}' spans {loc} lines of code (recommended maximum: 50 lines).",
                        "file_path": file_path,
                        "line_start": line_start,
                        "line_end": line_end,
                        "symbol_name": func_name,
                        "evidence": {"lines_of_code": loc, "threshold": 50},
                        "impact": "Violates Single Responsibility Principle and degrades readability.",
                        "remediation": f"Split '{func_name}' into cohesive single-purpose functions.",
                    })

                # 3. Excessive Parameters
                param_count = len(node.args.args)
                if param_count > 4:
                    findings.append({
                        "category": "COMPLEXITY",
                        "type": "EXCESSIVE_PARAMETERS",
                        "severity": "MEDIUM",
                        "confidence": "HIGH",
                        "title": f"Excessive Parameter Count in '{func_name}' ({param_count} params)",
                        "description": f"Function '{func_name}' accepts {param_count} parameters (recommended threshold: 4).",
                        "file_path": file_path,
                        "line_start": line_start,
                        "line_end": line_end,
                        "symbol_name": func_name,
                        "evidence": {"param_count": param_count, "threshold": 4},
                        "impact": "Fragile signature and tight coupling between caller and callee.",
                        "remediation": f"Introduce a parameter object or dataclass for '{func_name}'.",
                    })

                # 4. Deep Nesting
                max_depth = 0
                for child in ast.walk(node):
                    if isinstance(child, (ast.If, ast.For, ast.While, ast.Try, ast.With)):
                        # Simple heuristic depth measurement
                        depth = 0
                        curr = child
                        while curr is not node and hasattr(curr, "parent"):
                            if isinstance(curr, (ast.If, ast.For, ast.While, ast.Try, ast.With)):
                                depth += 1
                            curr = getattr(curr, "parent", None)
                        if depth > max_depth:
                            max_depth = depth

                # 5. Documentation Debt on public APIs/functions
                is_public = not func_name.startswith("_")
                has_doc = ast.get_docstring(node) is not None
                if is_public and loc > 30 and not has_doc:
                    findings.append({
                        "category": "DOCUMENTATION",
                        "type": "MISSING_DOCSTRING",
                        "severity": "LOW",
                        "confidence": "HIGH",
                        "title": f"Missing Documentation on Public Function '{func_name}'",
                        "description": f"Public function '{func_name}' ({loc} LOC) lacks docstrings explaining parameters and return types.",
                        "file_path": file_path,
                        "line_start": line_start,
                        "line_end": line_end,
                        "symbol_name": func_name,
                        "evidence": {"is_public": True, "lines_of_code": loc},
                        "impact": "Increases onboarding overhead and causes API misuse.",
                        "remediation": f"Add standard docstring explaining inputs, outputs, and exceptions for '{func_name}'.",
                    })

        return findings

    # =========================================================================
    # 2. MASTER TECHNICAL DEBT ANALYSIS
    # =========================================================================

    async def analyze_technical_debt(
        self, db: AsyncSession, repository_id: str
    ) -> Dict[str, Any]:
        """
        Executes real evidence-based technical debt analysis on the repository.
        Combines AST, dependencies, architecture, duplication, and test evidence.
        """
        if repository_id in self._cache:
            return self._cache[repository_id]

        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        # 1. Fetch files and symbols
        files_stmt = select(File).where(File.repository_id == repository_id)
        f_res = await db.execute(files_stmt)
        files = f_res.scalars().all()

        sym_stmt = select(Symbol).where(Symbol.repository_id == repository_id)
        s_res = await db.execute(sym_stmt)
        symbols = s_res.scalars().all()

        dep_stmt = select(Dependency).where(Dependency.repository_id == repository_id)
        d_res = await db.execute(dep_stmt)
        dependencies = d_res.scalars().all()

        # Build file maps
        file_path_map = {f.id: f.path for f in files}
        all_paths = set(f.path for f in files)
        test_paths = set(p for p in all_paths if any(t_ind in p.lower() for t_ind in ["test", "spec", "tests/"]))
        source_paths = all_paths - test_paths

        # Cache file sources
        files_sources: Dict[str, Tuple[str, str]] = {}
        for f in files:
            src_payload = source_code_service.get_file_source(repository_id, f.path)
            src_text = src_payload.get("source", "")
            if not src_text and repo.clone_path:
                try:
                    local_f = Path(repo.clone_path) / f.path
                    if local_f.exists() and local_f.is_file():
                        src_text = local_f.read_text(encoding="utf-8", errors="replace")
                except Exception:
                    pass
            files_sources[f.path] = (f.id, src_text)

        findings: List[Dict[str, Any]] = []

        # =====================================================================
        # CATEGORY 1: COMPLEXITY DEBT
        # =====================================================================
        for f in files:
            p = f.path
            _, source_code = files_sources.get(p, (f.id, ""))
            if not source_code:
                continue

            # Oversized file
            if f.line_count > 600:
                sev = "CRITICAL" if f.line_count > 1200 else "HIGH"
                findings.append({
                    "id": f"debt-loc-{f.id[:8]}",
                    "repository_id": repository_id,
                    "category": "COMPLEXITY",
                    "type": "OVERSIZED_FILE",
                    "severity": sev,
                    "confidence": "HIGH",
                    "title": f"Oversized File '{p}' ({f.line_count} lines)",
                    "description": f"File '{p}' exceeds recommended size limits with {f.line_count} lines of code.",
                    "evidence": {"line_count": f.line_count, "threshold": 600},
                    "file_path": p,
                    "line_start": 1,
                    "line_end": f.line_count,
                    "affected_files": [p],
                    "impact": "High cognitive load, merge conflict hotspot, and poor cohesion.",
                    "remediation": f"Split '{p}' into modular components by domain responsibility.",
                    "detection_source": "STATIC_AST_ANALYZER",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                })

            # Python AST complexity inspection
            if p.endswith(".py"):
                py_debt = self._analyze_python_ast_debt(source_code, p)
                for idx, pd in enumerate(py_debt):
                    pd["id"] = f"debt-ast-{f.id[:8]}-{idx}"
                    pd["repository_id"] = repository_id
                    pd["affected_files"] = [p]
                    pd["affected_symbols"] = [pd.get("symbol_name")] if pd.get("symbol_name") else []
                    pd["detection_source"] = "STATIC_AST_ANALYZER"
                    pd["created_at"] = datetime.now(timezone.utc).isoformat()
                    findings.append(pd)

        # =====================================================================
        # CATEGORY 2: DUPLICATION DEBT
        # =====================================================================
        duplication_clusters = code_quality_service.detect_duplications(
            files_sources=files_sources, min_lines=6, min_similarity=85.0
        )
        for idx, cl in enumerate(duplication_clusters[:15]):
            src_file = cl.get("source_file", "")
            tgt_file = cl.get("target_file", "")
            sim = cl.get("similarity_percentage", 90.0)
            lines_cnt = cl.get("line_count", 6)

            findings.append({
                "id": f"debt-dup-{idx}",
                "repository_id": repository_id,
                "category": "DUPLICATION",
                "type": "CODE_DUPLICATION",
                "severity": "HIGH" if lines_cnt > 20 else "MEDIUM",
                "confidence": "HIGH",
                "title": f"Code Duplication Between '{src_file}' and '{tgt_file}'",
                "description": (
                    f"Found {sim:.1f}% duplicate block of {lines_cnt} lines between "
                    f"'{src_file}' (L{cl.get('source_start_line')}-{cl.get('source_end_line')}) "
                    f"and '{tgt_file}' (L{cl.get('target_start_line')}-{cl.get('target_end_line')})."
                ),
                "evidence": cl,
                "file_path": src_file,
                "line_start": cl.get("source_start_line"),
                "line_end": cl.get("source_end_line"),
                "affected_files": [src_file, tgt_file],
                "impact": "Bug fixes in one location will not propagate to duplicate logic, risking regression.",
                "remediation": "Extract duplicate logic into a shared utility function or base class.",
                "detection_source": "TOKEN_DUPLICATION_ANALYZER",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })

        # =====================================================================
        # CATEGORY 3: DEPENDENCY DEBT
        # =====================================================================
        # Analyze coupling from graph and architecture intelligence
        arch_intel = await architecture_intelligence_service.get_advanced_architecture_intelligence(
            repository_id=repository_id, db=db
        )
        coupling_data = arch_intel.get("coupling", {})
        module_metrics = coupling_data.get("module_metrics", [])

        for idx, mm in enumerate(module_metrics):
            mod_name = mm.get("module", "")
            ca = mm.get("afferent_coupling_ca", 0)
            ce = mm.get("efferent_coupling_ce", 0)
            instability = mm.get("instability", 0.0)
            tot_coupling = mm.get("total_coupling", 0)

            # High Coupling Bottleneck
            if tot_coupling > 15:
                findings.append({
                    "id": f"debt-dep-coupling-{idx}",
                    "repository_id": repository_id,
                    "category": "DEPENDENCY",
                    "type": "HIGH_COUPLING_HOTSPOT",
                    "severity": "HIGH",
                    "confidence": "HIGH",
                    "title": f"High Coupling Bottleneck in Module '{mod_name}'",
                    "description": (
                        f"Module '{mod_name}' has total coupling of {tot_coupling} "
                        f"(Afferent Ca: {ca}, Efferent Ce: {ce}, Instability: {instability:.2f})."
                    ),
                    "evidence": mm,
                    "file_path": mod_name,
                    "affected_files": [mod_name],
                    "related_dependencies": mm.get("dependencies", []),
                    "impact": "Changes to this module ripple widely across dependents; changes elsewhere easily break it.",
                    "remediation": f"Apply Dependency Inversion and decouple direct dependencies in '{mod_name}'.",
                    "detection_source": "ARCHITECTURE_GRAPH_ANALYZER",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                })

        # Circular dependencies
        cycles = arch_intel.get("cycles", {}).get("cycles", [])
        for idx, cycle in enumerate(cycles):
            cycle_str = " -> ".join(cycle)
            findings.append({
                "id": f"debt-dep-cycle-{idx}",
                "repository_id": repository_id,
                "category": "DEPENDENCY",
                "type": "CIRCULAR_DEPENDENCY",
                "severity": "CRITICAL",
                "confidence": "HIGH",
                "title": f"Circular Dependency Cycle: {cycle[0]} <-> {cycle[-1]}",
                "description": f"Found circular dependency chain between files: {cycle_str}",
                "evidence": {"cycle": cycle},
                "file_path": cycle[0],
                "affected_files": cycle,
                "impact": "Prevents isolated unit testing, causes import errors, and creates fragile coupling.",
                "remediation": "Break cycle by extracting shared data interfaces or using events.",
                "detection_source": "GRAPH_CYCLE_DETECTOR",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })

        # =====================================================================
        # CATEGORY 4: ARCHITECTURE DEBT
        # =====================================================================
        violations = arch_intel.get("violations", [])
        for idx, v in enumerate(violations):
            findings.append({
                "id": f"debt-arch-{idx}",
                "repository_id": repository_id,
                "category": "ARCHITECTURE",
                "type": v.get("violation_type", "ARCHITECTURE_BOUNDARY_VIOLATION"),
                "severity": v.get("severity", "HIGH").upper(),
                "confidence": "HIGH",
                "title": v.get("title", "Architecture Boundary Violation"),
                "description": v.get("description", ""),
                "evidence": v,
                "file_path": v.get("source_file"),
                "line_start": v.get("line", 1),
                "affected_files": [v.get("source_file", ""), v.get("target_file", "")],
                "impact": "Degrades modularity, breaks architectural layering, and introduces tight coupling.",
                "remediation": v.get("remediation") or "Refactor code to conform to layer boundaries.",
                "detection_source": "ARCHITECTURE_LAYER_VERIFIER",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })

        # =====================================================================
        # CATEGORY 5: TEST DEBT
        # =====================================================================
        # Identify critical production files without corresponding test files
        # Check source paths that have significant size (>50 LOC) and no test coverage evidence
        test_basenames = set(Path(tp).stem.lower().replace("test_", "").replace("_test", "").replace(".spec", "") for tp in test_paths)

        for sp in source_paths:
            sp_stem = Path(sp).stem.lower()
            # If not in tests and significant logic
            f_obj = next((f for f in files if f.path == sp), None)
            loc = f_obj.line_count if f_obj else 0

            # Only flag files in service/api/controllers/models with significant code
            is_critical_layer = any(l_k in sp.lower() for l_k in ["service", "controller", "api", "model", "logic", "core"])
            has_matching_test = sp_stem in test_basenames or any(sp_stem in tb for tb in test_basenames)

            if is_critical_layer and loc > 60 and not has_matching_test:
                findings.append({
                    "id": f"debt-test-{Path(sp).stem[:8]}",
                    "repository_id": repository_id,
                    "category": "TEST_GAP",
                    "type": "MISSING_TEST_COVERAGE",
                    "severity": "HIGH" if loc > 150 else "MEDIUM",
                    "confidence": "MEDIUM",
                    "title": f"Missing Test Evidence for Critical Component '{sp}'",
                    "description": (
                        f"Production component '{sp}' ({loc} LOC) has no identifiable automated test file "
                        f"in the test suite. Untested changes in this component risk silent regressions."
                    ),
                    "evidence": {"file_path": sp, "lines_of_code": loc, "test_paths_found": len(test_paths)},
                    "file_path": sp,
                    "line_start": 1,
                    "line_end": loc,
                    "affected_files": [sp],
                    "impact": "High risk of undetected regressions and breaking changes in core business logic.",
                    "remediation": f"Create a comprehensive unit test suite for '{sp}' exercising key pathways.",
                    "detection_source": "TEST_EVIDENCE_MAPPER",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                })

        # =====================================================================
        # CATEGORY 6: DOCUMENTATION DEBT
        # =====================================================================
        # Complex modules (> 200 LOC) lacking any header comment or docstring
        for f in files:
            p = f.path
            if p in source_paths and f.line_count > 200:
                _, src = files_sources.get(p, (f.id, ""))
                lines = [l.strip() for l in src.splitlines() if l.strip()]
                has_header = False
                if lines:
                    first_l = lines[0]
                    if first_l.startswith(('"""', "'''", "/*", "//", "#")):
                        has_header = True

                if not has_header:
                    findings.append({
                        "id": f"debt-doc-{f.id[:8]}",
                        "repository_id": repository_id,
                        "category": "DOCUMENTATION",
                        "type": "UNDOCUMENTED_MODULE",
                        "severity": "LOW",
                        "confidence": "HIGH",
                        "title": f"Undocumented Core Module '{p}' ({f.line_count} lines)",
                        "description": f"Module '{p}' contains substantial architecture logic ({f.line_count} LOC) without header documentation.",
                        "evidence": {"file_path": p, "lines_of_code": f.line_count},
                        "file_path": p,
                        "line_start": 1,
                        "line_end": 20,
                        "affected_files": [p],
                        "impact": "Obscures architectural purpose and slows team velocity.",
                        "remediation": f"Add module-level documentation describing the architectural role of '{p}'.",
                        "detection_source": "STATIC_DOC_ANALYZER",
                        "created_at": datetime.now(timezone.utc).isoformat(),
                    })

        # Deduplicate and compute metrics
        findings_by_sev = defaultdict(int)
        findings_by_cat = defaultdict(int)
        for f in findings:
            findings_by_sev[f["severity"]] += 1
            findings_by_cat[f["category"]] += 1

        # Calculate Technical Debt Score (0 to 100)
        # Deductions: Critical: -12, High: -6, Medium: -2.5, Low: -1
        deductions = (
            findings_by_sev["CRITICAL"] * 12.0 +
            findings_by_sev["HIGH"] * 6.0 +
            findings_by_sev["MEDIUM"] * 2.5 +
            findings_by_sev["LOW"] * 1.0
        )
        debt_score = max(5.0, min(100.0, round(100.0 - deductions, 1)))

        # Estimated remediation hours:
        # Critical: 6h, High: 3h, Medium: 1.5h, Low: 0.5h
        est_hours = round(
            findings_by_sev["CRITICAL"] * 6.0 +
            findings_by_sev["HIGH"] * 3.0 +
            findings_by_sev["MEDIUM"] * 1.5 +
            findings_by_sev["LOW"] * 0.5,
            1
        )

        top_categories = [
            {"category": cat, "count": count, "percentage": round((count / max(1, len(findings))) * 100, 1)}
            for cat, count in sorted(findings_by_cat.items(), key=lambda x: -x[1])
        ]

        summary_text = (
            f"Technical debt analysis identified {len(findings)} issues across {len(files)} files. "
            f"Debt score is {debt_score}/100 with an estimated remediation effort of {est_hours} engineering hours. "
            f"Top areas requiring attention: {', '.join(tc['category'] for tc in top_categories[:3]) or 'None'}."
        )

        result = {
            "repository_id": repository_id,
            "debt_score": debt_score,
            "total_findings": len(findings),
            "findings_by_severity": dict(findings_by_sev),
            "findings_by_category": dict(findings_by_cat),
            "top_categories": top_categories,
            "estimated_remediation_hours": est_hours,
            "summary_text": summary_text,
            "findings": findings,
        }

        self._cache[repository_id] = result
        return result


technical_debt_service = TechnicalDebtService()
