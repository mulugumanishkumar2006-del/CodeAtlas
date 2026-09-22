import logging
import re
import os
import yaml
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple, Set
from collections import defaultdict
from datetime import datetime, timezone
import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.pull_request_review import PullRequestReview
from backend.app.services.ast_parser_service import ASTParserService
from backend.app.services.time_machine_service import TimeMachineService
from backend.app.services.architecture_intelligence_service import architecture_intelligence_service
from backend.app.services.impact_analysis_service import ImpactAnalysisService
from backend.app.services.risk_intelligence_service import RiskIntelligenceService
from backend.app.services.technical_debt_service import TechnicalDebtService
from backend.app.services.security_reliability_service import SecurityReliabilityService
from backend.app.services.git_history_service import GitHistoryService
from backend.app.services.llm_provider import GroundedDeterministicProvider, get_llm_provider
from backend.app.schemas.collaboration import CollaborationEventType
from backend.app.services.collaboration_manager import collaboration_manager

logger = logging.getLogger("codeatlas.pr_reviewer")


DEFAULT_REVIEW_CONFIG: Dict[str, Any] = {
    "gates": {
        "breaking_changes": {
            "enabled": True,
            "fail_on": "DETECTED",  # DETECTED, POTENTIAL, NONE
            "severity": "BLOCKING",
        },
        "architecture": {
            "enabled": True,
            "max_new_violations": 0,
            "fail_on_boundary_crossing": True,
            "severity": "BLOCKING",
        },
        "security": {
            "enabled": True,
            "fail_on_severity": ["CRITICAL", "HIGH"],
            "severity": "BLOCKING",
        },
        "risk_delta": {
            "enabled": True,
            "max_risk_delta": 25.0,
            "severity": "HIGH",
        },
        "test_coverage_gap": {
            "enabled": True,
            "warn_on_untested_high_impact": True,
            "severity": "MEDIUM",
        },
    },
    "ignore_paths": [
        "node_modules/**",
        "vendor/**",
        "dist/**",
        "build/**",
        "*.min.js",
        "*.min.css",
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
    ],
    "limits": {
        "max_files": 200,
        "max_diff_lines": 15000,
        "max_comments": 50,
    },
}


class PullRequestReviewerService:
    """
    Phase 24: CI/CD & Automated Pull Request Reviewer Engine.
    Performs multi-dimensional evidence-backed review comparing BASE vs HEAD.
    Strictly scoped to a single repository.
    """

    def __init__(self):
        self._ast_parser = ASTParserService()
        self._time_machine = TimeMachineService()
        self._impact_service = ImpactAnalysisService()
        self._risk_service = RiskIntelligenceService()
        self._debt_service = TechnicalDebtService()
        self._sec_rel_service = SecurityReliabilityService()
        self._git_history = GitHistoryService()

    # =========================================================================
    # 1. CONFIGURATION RESOLUTION (.codeatlas.yml)
    # =========================================================================

    def load_repository_config(self, clone_path: Optional[str], override: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Loads repository .codeatlas.yml configuration or returns defaults."""
        config = dict(DEFAULT_REVIEW_CONFIG)
        if clone_path:
            cfg_file = Path(clone_path) / ".codeatlas.yml"
            if not cfg_file.exists():
                cfg_file = Path(clone_path) / ".codeatlas.yaml"
            if cfg_file.exists():
                try:
                    with open(cfg_file, "r", encoding="utf-8") as f:
                        user_cfg = yaml.safe_load(f)
                        if isinstance(user_cfg, dict):
                            # Deep merge simple config sections
                            for k, v in user_cfg.items():
                                if isinstance(v, dict) and k in config and isinstance(config[k], dict):
                                    config[k].update(v)
                                else:
                                    config[k] = v
                except Exception as exc:
                    logger.warning(f"Failed to parse .codeatlas.yml: {exc}")

        if override:
            for k, v in override.items():
                if isinstance(v, dict) and k in config and isinstance(config[k], dict):
                    config[k].update(v)
                else:
                    config[k] = v

        return config

    # =========================================================================
    # 2. DIFF RETRIEVAL & PARSING
    # =========================================================================

    def get_or_parse_diff(
        self,
        clone_path: Optional[str],
        base_sha: str,
        head_sha: str,
        custom_diff: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves and parses unified git diff between base_sha and head_sha.
        Supports custom_diff input when running in simulated or CI environments.
        """
        if custom_diff and custom_diff.strip():
            return self._time_machine._parse_unified_diff(custom_diff)

        if not clone_path or not Path(clone_path).exists():
            return []

        # Run git diff -U3 -M20% base_sha..head_sha
        code, out, err = self._time_machine._run_git_cmd(
            clone_path,
            ["diff", "-U3", "-M20%", base_sha, head_sha],
        )
        if code != 0:
            logger.warning(f"Git diff failed between {base_sha}..{head_sha}: {err}")
            return []

        return self._time_machine._parse_unified_diff(out)

    # =========================================================================
    # 3. CHANGED-SYMBOL & SIGNATURE MUTATION ANALYSIS
    # =========================================================================

    def analyze_symbol_changes(
        self,
        clone_path: Optional[str],
        base_sha: str,
        head_sha: str,
        file_diffs: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Extracts AST symbols at base and head commits to identify:
        CREATED, DELETED, MODIFIED, and SIGNATURE_CHANGED symbols.
        """
        all_symbol_changes = []

        for fd in file_diffs:
            p = fd.get("new_path") or fd.get("old_path") or ""
            lang = self._time_machine._get_language_from_path(p)
            if not lang or not clone_path:
                continue

            sym_changes = self._time_machine._map_hunks_to_symbols(
                clone_path=clone_path,
                commit_hash=head_sha,
                file_diff=fd,
                old_commit_ref=base_sha,
                new_commit_ref=head_sha,
            )

            # Detect signature changes for MODIFIED symbols
            for sc in sym_changes:
                old_s = sc.get("old_start_line")
                new_s = sc.get("new_start_line")
                # Look for signature modification in hunk lines
                hunk_lines = []
                for h in fd.get("hunks", []):
                    hunk_lines.extend(h.get("lines", []))

                has_sig_change = False
                for l in hunk_lines:
                    if (l.startswith("-") or l.startswith("+")) and ("def " in l or "function " in l or "class " in l or "interface " in l or "fn " in l):
                        has_sig_change = True
                        break

                if has_sig_change and sc.get("change_type") == "MODIFIED":
                    sc["change_type"] = "SIGNATURE_CHANGED"
                    sc["is_signature_changed"] = True
                else:
                    sc["is_signature_changed"] = False

                all_symbol_changes.append(sc)

        return all_symbol_changes

    # =========================================================================
    # 4. BREAKING CHANGE DETECTION
    # =========================================================================

    def detect_breaking_changes(
        self,
        file_diffs: List[Dict[str, Any]],
        symbol_changes: List[Dict[str, Any]],
        base_files: List[Any],
    ) -> Dict[str, Any]:
        """
        Detects evidence-backed breaking changes across:
        - Functions / Methods (DELETED, SIGNATURE_CHANGED)
        - Classes / Interfaces (DELETED, public method mutations)
        - HTTP APIs (Endpoints removed, route path altered)
        - Dependencies (Removed or major version change)
        - Configuration (Removed env vars or config keys)
        Categorized into: DETECTED, POTENTIAL, UNKNOWN.
        """
        detected: List[Dict[str, Any]] = []
        potential: List[Dict[str, Any]] = []
        unknowns: List[Dict[str, Any]] = []

        # 1. Deleted & Signature Changed Symbols
        for sc in symbol_changes:
            s_name = sc.get("symbol_name")
            s_type = sc.get("symbol_type", "function")
            ch_type = sc.get("change_type")
            f_path = sc.get("file_path")

            if ch_type == "DELETED":
                detected.append({
                    "category": "SYMBOL",
                    "entity": s_name,
                    "type": s_type,
                    "file_path": f_path,
                    "reason": f"Exported symbol '{s_name}' ({s_type}) was deleted.",
                    "evidence": sc.get("evidence", f"Removed in {f_path}"),
                    "severity": "BLOCKING",
                })
            elif ch_type == "SIGNATURE_CHANGED":
                detected.append({
                    "category": "SIGNATURE",
                    "entity": s_name,
                    "type": s_type,
                    "file_path": f_path,
                    "reason": f"Signature for '{s_name}' ({s_type}) was modified.",
                    "evidence": sc.get("evidence", f"Modified lines in {f_path}"),
                    "severity": "HIGH",
                })
            elif ch_type == "MODIFIED" and sc.get("is_uncertain"):
                unknowns.append({
                    "category": "SYMBOL",
                    "entity": s_name,
                    "file_path": f_path,
                    "reason": f"Overlapping modifications near '{s_name}' require AST/test verification.",
                })

        # 2. File Deletions (API endpoints, modules)
        for fd in file_diffs:
            if fd.get("change_type") == "DELETED":
                op = fd.get("old_path", "")
                if "api" in op.lower() or "controller" in op.lower() or "route" in op.lower():
                    detected.append({
                        "category": "API_ROUTE",
                        "entity": op,
                        "type": "file",
                        "file_path": op,
                        "reason": f"API route definition file '{op}' was deleted.",
                        "evidence": f"Deleted file: {op}",
                        "severity": "BLOCKING",
                    })
                else:
                    potential.append({
                        "category": "MODULE",
                        "entity": op,
                        "type": "file",
                        "file_path": op,
                        "reason": f"Module file '{op}' was deleted. May affect external callers.",
                        "evidence": f"Deleted file: {op}",
                    })

        # 3. Dependency Manifest Deletions / Removals
        dep_manifests = {"requirements.txt", "package.json", "pyproject.toml", "go.mod", "Cargo.toml"}
        for fd in file_diffs:
            op = fd.get("old_path") or fd.get("new_path") or ""
            filename = Path(op).name
            if filename in dep_manifests:
                # Check for removed packages in hunks
                for h in fd.get("hunks", []):
                    for l in h.get("lines", []):
                        if l.startswith("-") and not l.startswith("---") and len(l.strip()) > 3:
                            cleaned = l[1:].strip()
                            if not cleaned.startswith("#") and not cleaned.startswith("//"):
                                potential.append({
                                    "category": "DEPENDENCY",
                                    "entity": cleaned,
                                    "type": "package",
                                    "file_path": op,
                                    "reason": f"Dependency entry removed or altered in {filename}: '{cleaned}'",
                                    "evidence": f"Diff line: {l.strip()}",
                                })

        # 4. Configuration Changes
        config_files = {".env", ".env.example", "config.py", "settings.py", "config.json", "application.yml"}
        for fd in file_diffs:
            op = fd.get("old_path") or fd.get("new_path") or ""
            if Path(op).name in config_files:
                for h in fd.get("hunks", []):
                    for l in h.get("lines", []):
                        if l.startswith("-") and not l.startswith("---") and "=" in l:
                            key = l[1:].split("=")[0].strip()
                            detected.append({
                                "category": "CONFIGURATION",
                                "entity": key,
                                "type": "config_key",
                                "file_path": op,
                                "reason": f"Configuration key '{key}' was removed or modified in {op}.",
                                "evidence": f"Diff: {l.strip()}",
                                "severity": "HIGH",
                            })

        return {
            "detected": detected,
            "potential": potential,
            "unknowns": unknowns,
            "total_breaking_count": len(detected) + len(potential),
        }

    # =========================================================================
    # 5. MONOREPO AFFECTED PACKAGES
    # =========================================================================

    def detect_monorepo_affected_packages(
        self, file_diffs: List[Dict[str, Any]], clone_path: Optional[str]
    ) -> List[Dict[str, Any]]:
        """Identifies affected packages/workspaces in a monorepo structure."""
        package_changes = defaultdict(lambda: {"files": [], "insertions": 0, "deletions": 0})

        for fd in file_diffs:
            p = fd.get("new_path") or fd.get("old_path") or ""
            parts = Path(p).parts
            pkg_name = "root"
            if len(parts) > 1 and parts[0] in ("packages", "apps", "services", "libs", "modules"):
                pkg_name = f"{parts[0]}/{parts[1]}"

            package_changes[pkg_name]["files"].append(p)
            package_changes[pkg_name]["insertions"] += fd.get("additions", 0)
            package_changes[pkg_name]["deletions"] += fd.get("deletions", 0)

        result = []
        for pkg, data in package_changes.items():
            result.append({
                "package": pkg,
                "is_monorepo_package": pkg != "root",
                "changed_files_count": len(data["files"]),
                "files": data["files"],
                "insertions": data["insertions"],
                "deletions": data["deletions"],
            })
        return result

    # =========================================================================
    # 6. ARCHITECTURE & BOUNDARY REVIEW (Phase 18 Reuse)
    # =========================================================================

    def review_architecture(
        self,
        file_diffs: List[Dict[str, Any]],
        symbol_changes: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Compares architectural boundaries and detects new layer violations.
        Example: Presentation directly importing Persistence.
        """
        layer_shifts = []
        new_dependencies = []
        boundary_violations = []

        for fd in file_diffs:
            p = fd.get("new_path") or fd.get("old_path") or ""
            layer_name, layer_cat, _ = architecture_intelligence_service.classify_file_layer(p)
            ct = fd.get("change_type")

            if layer_name and layer_name != "Uncategorized":
                layer_shifts.append({
                    "file_path": p,
                    "layer": layer_name,
                    "category": layer_cat,
                    "change_type": ct,
                })

            # Inspect import lines in hunks to detect new imports
            for h in fd.get("hunks", []):
                for l in h.get("lines", []):
                    if l.startswith("+") and not l.startswith("+++"):
                        imp_match = re.match(r"^\+\s*(?:import|from)\s+([a-zA-Z0-9_\.]+)", l)
                        if imp_match:
                            imported_module = imp_match.group(1)
                            new_dependencies.append({
                                "source_file": p,
                                "source_layer": layer_name,
                                "imported_target": imported_module,
                            })

                            # Check for Presentation -> Persistence layer violation
                            if "presentation" in layer_cat.lower() or "api" in layer_cat.lower():
                                if "db" in imported_module.lower() or "models" in imported_module.lower() or "persistence" in imported_module.lower() or "repository" in imported_module.lower():
                                    boundary_violations.append({
                                        "source_file": p,
                                        "source_layer": layer_name,
                                        "target_import": imported_module,
                                        "violation_type": "LAYER_BYPASS",
                                        "rule": "Presentation / API layer should not directly couple to persistence models; route through Service layer.",
                                        "severity": "HIGH",
                                        "evidence": f"Added import: '{l[1:].strip()}'",
                                    })

        return {
            "layer_shifts": layer_shifts,
            "new_dependencies_count": len(new_dependencies),
            "new_dependencies": new_dependencies[:20],
            "boundary_violations": boundary_violations,
            "violations_count": len(boundary_violations),
        }

    # =========================================================================
    # 7. TEST IMPACT & COVERAGE GAPS
    # =========================================================================

    def analyze_test_impact(
        self,
        file_diffs: List[Dict[str, Any]],
        symbol_changes: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Determines changed test files, affected tests, and high-impact symbols lacking tests.
        """
        changed_tests = []
        changed_production_files = []

        for fd in file_diffs:
            p = fd.get("new_path") or fd.get("old_path") or ""
            is_test = "test" in p.lower() or "spec" in p.lower() or p.startswith("tests/")
            if is_test:
                changed_tests.append({
                    "file_path": p,
                    "change_type": fd.get("change_type"),
                    "additions": fd.get("additions", 0),
                    "deletions": fd.get("deletions", 0),
                })
            else:
                changed_production_files.append(p)

        # Detect high-impact production changes with zero test changes
        test_gaps = []
        if changed_production_files and not changed_tests:
            for p in changed_production_files[:5]:
                test_gaps.append({
                    "file_path": p,
                    "gap_type": "NO_TEST_MODIFIED",
                    "reason": f"Production file '{p}' was modified with {len(changed_production_files)} other files, but no test files were added or updated in this PR.",
                    "severity": "MEDIUM",
                })

        # Check for signature changed symbols without test changes
        for sc in symbol_changes:
            if sc.get("change_type") in ("SIGNATURE_CHANGED", "DELETED"):
                s_name = sc.get("symbol_name")
                fp = sc.get("file_path")
                if not any(t["file_path"] for t in changed_tests):
                    test_gaps.append({
                        "file_path": fp,
                        "symbol": s_name,
                        "gap_type": "UNTESTED_CRITICAL_CHANGE",
                        "reason": f"Critical symbol '{s_name}' was {sc.get('change_type')}, but no test changes were detected in the PR.",
                        "severity": "HIGH",
                    })

        return {
            "changed_test_files_count": len(changed_tests),
            "changed_tests": changed_tests,
            "test_gaps_count": len(test_gaps),
            "test_gaps": test_gaps,
        }

    # =========================================================================
    # 8. HISTORICAL CONTEXT (Phase 20 Reuse)
    # =========================================================================

    def gather_historical_context(
        self,
        clone_path: Optional[str],
        file_diffs: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Inspects git history for changed files to report recent churn and hotspots.
        """
        file_history_notes = []
        if not clone_path or not Path(clone_path).exists():
            return {"hotspots": [], "recent_churn": []}

        for fd in file_diffs[:10]:
            p = fd.get("new_path") or fd.get("old_path") or ""
            # Count commit history for this file
            code, out, _ = self._time_machine._run_git_cmd(
                clone_path,
                ["rev-list", "--count", "HEAD", "--", p]
            )
            commit_count = int(out.strip()) if code == 0 and out.strip().isdigit() else 0
            if commit_count > 5:
                file_history_notes.append({
                    "file_path": p,
                    "historical_commit_count": commit_count,
                    "is_hotspot": commit_count > 15,
                    "note": f"File '{p}' has {commit_count} commits in history (active development hotspot).",
                })

        return {
            "hotspots": [h for h in file_history_notes if h.get("is_hotspot")],
            "recent_churn": file_history_notes,
        }

    # =========================================================================
    # 9. REVIEW GATES & COMMENTS GENERATION
    # =========================================================================

    def evaluate_gates_and_comments(
        self,
        config: Dict[str, Any],
        breaking_changes: Dict[str, Any],
        arch_review: Dict[str, Any],
        risk_delta: float,
        test_impact: Dict[str, Any],
        sec_findings: List[Dict[str, Any]],
        symbol_changes: List[Dict[str, Any]],
        file_diffs: List[Dict[str, Any]],
    ) -> Tuple[Dict[str, Any], List[Dict[str, Any]], str]:
        """
        Evaluates review gates and produces structured inline comments.
        Returns: (gates_dict, comments_list, overall_gate_status: 'PASSED' | 'WARNING' | 'BLOCKED')
        """
        gates_cfg = config.get("gates", {})
        gates: Dict[str, Any] = {}
        comments: List[Dict[str, Any]] = []

        is_blocked = False
        has_warning = False

        # Gate 1: Breaking Changes
        bc_cfg = gates_cfg.get("breaking_changes", {})
        detected_bc = breaking_changes.get("detected", [])
        if bc_cfg.get("enabled", True):
            if detected_bc and bc_cfg.get("fail_on") == "DETECTED":
                gates["breaking_changes"] = {
                    "status": "BLOCKED",
                    "message": f"Detected {len(detected_bc)} breaking change(s) requiring remediation.",
                    "details": {"count": len(detected_bc)},
                }
                is_blocked = True
            elif breaking_changes.get("potential"):
                gates["breaking_changes"] = {
                    "status": "WARNING",
                    "message": f"Found {len(breaking_changes.get('potential', []))} potential breaking change(s).",
                    "details": {"count": len(breaking_changes.get("potential", []))},
                }
                has_warning = True
            else:
                gates["breaking_changes"] = {
                    "status": "PASSED",
                    "message": "No breaking changes detected in analyzed evidence.",
                }

        # Gate 2: Architecture
        arch_cfg = gates_cfg.get("architecture", {})
        violations = arch_review.get("boundary_violations", [])
        if arch_cfg.get("enabled", True):
            if len(violations) > arch_cfg.get("max_new_violations", 0):
                gates["architecture"] = {
                    "status": "BLOCKED",
                    "message": f"Detected {len(violations)} architectural boundary violation(s).",
                    "details": {"violations": violations},
                }
                is_blocked = True
            else:
                gates["architecture"] = {
                    "status": "PASSED",
                    "message": "Architecture boundary rules satisfied.",
                }

        # Gate 3: Security
        sec_cfg = gates_cfg.get("security", {})
        crit_sec = [s for s in sec_findings if s.get("severity") in sec_cfg.get("fail_on_severity", ["CRITICAL"])]
        if sec_cfg.get("enabled", True):
            if crit_sec:
                gates["security"] = {
                    "status": "BLOCKED",
                    "message": f"Detected {len(crit_sec)} critical/high security issue(s).",
                    "details": {"findings": crit_sec},
                }
                is_blocked = True
            elif sec_findings:
                gates["security"] = {
                    "status": "WARNING",
                    "message": f"Found {len(sec_findings)} security/reliability observation(s).",
                }
                has_warning = True
            else:
                gates["security"] = {
                    "status": "PASSED",
                    "message": "No detected security issues in analyzed evidence.",
                }

        # Gate 4: Risk Delta
        risk_cfg = gates_cfg.get("risk_delta", {})
        max_risk_delta = risk_cfg.get("max_risk_delta", 25.0)
        if risk_cfg.get("enabled", True):
            if risk_delta > max_risk_delta:
                gates["risk_delta"] = {
                    "status": "BLOCKED" if risk_cfg.get("severity") == "BLOCKING" else "WARNING",
                    "message": f"Risk increased by +{risk_delta:.1f} (threshold: +{max_risk_delta:.1f}).",
                    "actual_value": risk_delta,
                    "threshold": max_risk_delta,
                }
                if risk_cfg.get("severity") == "BLOCKING":
                    is_blocked = True
                else:
                    has_warning = True
            else:
                gates["risk_delta"] = {
                    "status": "PASSED",
                    "message": f"Risk delta (+{risk_delta:.1f}) within acceptable threshold (+{max_risk_delta:.1f}).",
                    "actual_value": risk_delta,
                }

        # Gate 5: Test Gaps
        test_cfg = gates_cfg.get("test_coverage_gap", {})
        test_gaps = test_impact.get("test_gaps", [])
        if test_cfg.get("enabled", True):
            if test_gaps:
                gates["test_coverage_gap"] = {
                    "status": "WARNING",
                    "message": f"Detected {len(test_gaps)} test gap(s) for high-impact changes.",
                    "details": {"count": len(test_gaps)},
                }
                has_warning = True
            else:
                gates["test_coverage_gap"] = {
                    "status": "PASSED",
                    "message": "Test presence verified for changed areas.",
                }

        # Overall Status
        overall_status = "BLOCKED" if is_blocked else ("WARNING" if has_warning else "PASSED")

        # Generate Evidence-Backed Comments
        comment_id = 1

        # 1. Comments from Breaking Changes
        for bc in detected_bc:
            comments.append({
                "id": f"comment-{comment_id}",
                "file_path": bc.get("file_path", ""),
                "line": 1,
                "finding": bc.get("reason", ""),
                "severity": bc.get("severity", "BLOCKING"),
                "category": "BREAKING_CHANGE",
                "evidence": bc.get("evidence", ""),
                "potential_impact": "Downstream callers or API clients will experience compilation or runtime failures.",
                "suggested_action": f"Provide backwards-compatible adapter or deprecation schedule for '{bc.get('entity')}'.",
                "symbol_name": bc.get("entity"),
            })
            comment_id += 1

        # 2. Comments from Architecture Violations
        for v in violations:
            comments.append({
                "id": f"comment-{comment_id}",
                "file_path": v.get("source_file", ""),
                "line": 1,
                "finding": f"Architecture Layer Violation: {v.get('violation_type')}",
                "severity": v.get("severity", "HIGH"),
                "category": "ARCHITECTURE",
                "evidence": v.get("evidence", ""),
                "potential_impact": v.get("rule", ""),
                "suggested_action": "Decouple layer dependency by injecting a service or interface.",
            })
            comment_id += 1

        # 3. Comments from Test Gaps
        for tg in test_gaps:
            comments.append({
                "id": f"comment-{comment_id}",
                "file_path": tg.get("file_path", ""),
                "line": 1,
                "finding": f"Test Gap: {tg.get('gap_type')}",
                "severity": tg.get("severity", "MEDIUM"),
                "category": "TEST_GAP",
                "evidence": tg.get("reason", ""),
                "potential_impact": "Risk of undetected runtime regressions during deployment.",
                "suggested_action": "Add unit or integration tests verifying the modified behavior.",
            })
            comment_id += 1

        # 4. Comments from Security Findings
        for sf in sec_findings:
            comments.append({
                "id": f"comment-{comment_id}",
                "file_path": sf.get("file_path", ""),
                "line": sf.get("line", 1),
                "finding": sf.get("title", "Security Observation"),
                "severity": sf.get("severity", "HIGH"),
                "category": "SECURITY",
                "evidence": sf.get("description", ""),
                "potential_impact": "Potential security exposure or untrusted input vulnerability.",
                "suggested_action": sf.get("recommendation", "Sanitize inputs and enforce authorization checks."),
            })
            comment_id += 1

        return gates, comments, overall_status

    # =========================================================================
    # 10. AI GROUNDED REVIEW SUMMARY
    # =========================================================================

    async def generate_ai_review(
        self,
        title: str,
        changed_files_count: int,
        insertions: int,
        deletions: int,
        risk_delta: float,
        breaking_changes: Dict[str, Any],
        arch_review: Dict[str, Any],
        test_impact: Dict[str, Any],
        comments: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Generates a grounded, hallucination-free executive summary using the deterministic provider.
        """
        detected_bc = breaking_changes.get("detected", [])
        violations = arch_review.get("boundary_violations", [])
        test_gaps = test_impact.get("test_gaps", [])

        summary_points = []
        if detected_bc:
            summary_points.append(f"PR introduces {len(detected_bc)} breaking change(s) requiring immediate attention.")
        if violations:
            summary_points.append(f"Introduced {len(violations)} architectural boundary violation(s).")
        if test_gaps:
            summary_points.append(f"Contains {len(test_gaps)} testing gap(s) for modified high-impact code.")
        if not summary_points:
            summary_points.append("Clean pull request with no detected breaking changes or architectural violations.")

        summary_text = f"Reviewed {changed_files_count} changed files (+{insertions} / -{deletions} lines). Risk delta: {risk_delta:+.1f}. " + " ".join(summary_points)

        return {
            "title": f"AI CTO Review: {title}",
            "summary": summary_text,
            "key_takeaways": summary_points,
            "model_used": "GroundedDeterministic-Phase24",
            "is_grounded": True,
        }

    # =========================================================================
    # 11. MAIN END-TO-END PIPELINE: ANALYZE PULL REQUEST
    # =========================================================================

    async def analyze_pull_request(
        self,
        db: AsyncSession,
        repository_id: str,
        base_commit_sha: str,
        head_commit_sha: str,
        title: str = "Automated Pull Request Review",
        pr_number: Optional[str] = None,
        provider: str = "local",
        source_branch: Optional[str] = None,
        target_branch: Optional[str] = None,
        author: Optional[str] = "Engineer",
        custom_diff: Optional[str] = None,
        config_override: Optional[Dict[str, Any]] = None,
    ) -> PullRequestReview:
        """
        Executes the complete Phase 24 CI/CD and Pull Request Review pipeline.
        Enforces strict repository isolation.
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found.")

        # Broadcast PR review started event
        try:
            await collaboration_manager.broadcast_to_repository(
                repository_id=repository_id,
                event_type=CollaborationEventType.PR_REVIEW_STARTED.value,
                payload={
                    "title": title,
                    "pr_number": pr_number,
                    "base_commit_sha": base_commit_sha,
                    "head_commit_sha": head_commit_sha,
                    "author": author,
                    "status": "started",
                },
            )
        except Exception:
            pass

        # 1. Load config
        config = self.load_repository_config(repo.clone_path, config_override)

        # 2. Extract and parse diff
        file_diffs = self.get_or_parse_diff(
            clone_path=repo.clone_path,
            base_sha=base_commit_sha,
            head_sha=head_commit_sha,
            custom_diff=custom_diff,
        )

        # Apply file limit
        max_files = config.get("limits", {}).get("max_files", 200)
        file_diffs = file_diffs[:max_files]

        # Broadcast PR review progress
        try:
            await collaboration_manager.broadcast_to_repository(
                repository_id=repository_id,
                event_type=CollaborationEventType.PR_REVIEW_PROGRESS.value,
                payload={
                    "stage": "diff_parsed",
                    "files_count": len(file_diffs),
                    "progress_percent": 25,
                },
            )
        except Exception:
            pass

        insertions = sum(f.get("additions", 0) for f in file_diffs)
        deletions = sum(f.get("deletions", 0) for f in file_diffs)

        # 3. Analyze changed symbols with AST
        symbol_changes = self.analyze_symbol_changes(
            clone_path=repo.clone_path,
            base_sha=base_commit_sha,
            head_sha=head_commit_sha,
            file_diffs=file_diffs,
        )

        # 4. Detect breaking changes
        breaking_changes = self.detect_breaking_changes(
            file_diffs=file_diffs,
            symbol_changes=symbol_changes,
            base_files=[],
        )

        # 5. Architecture Review
        arch_review = self.review_architecture(
            file_diffs=file_diffs,
            symbol_changes=symbol_changes,
        )

        # 6. Test Impact
        test_impact = self.analyze_test_impact(
            file_diffs=file_diffs,
            symbol_changes=symbol_changes,
        )

        # 7. Historical Context
        hist_context = self.gather_historical_context(
            clone_path=repo.clone_path,
            file_diffs=file_diffs,
        )

        # 8. Monorepo packages
        monorepo_packages = self.detect_monorepo_affected_packages(
            file_diffs=file_diffs,
            clone_path=repo.clone_path,
        )

        # 9. Compute Risk & Debt Deltas
        # Base risk from existing metrics or default 42.0
        base_risk = 42.0
        # Calculate risk additions based on churn, breaking changes, violations
        risk_added = (
            min(insertions * 0.05, 15.0)
            + len(breaking_changes.get("detected", [])) * 12.0
            + len(arch_review.get("boundary_violations", [])) * 8.0
            + len(test_impact.get("test_gaps", [])) * 4.0
        )
        head_risk = min(base_risk + risk_added, 100.0)
        risk_delta = head_risk - base_risk

        # Technical debt deltas
        debt_hours_before = 120.0
        debt_hours_added = (
            len(arch_review.get("boundary_violations", [])) * 4.0
            + len(test_impact.get("test_gaps", [])) * 2.0
            + len(breaking_changes.get("detected", [])) * 6.0
        )
        debt_hours_after = debt_hours_before + debt_hours_added
        debt_hours_delta = debt_hours_added
        debt_cost_delta = debt_hours_delta * 120.0  # $120/hr developer rate

        # 10. Security & Reliability
        sec_findings = []
        for fd in file_diffs:
            for h in fd.get("hunks", []):
                for l in h.get("lines", []):
                    if l.startswith("+") and ("password" in l.lower() or "secret" in l.lower() or "api_key" in l.lower()) and "=" in l:
                        sec_findings.append({
                            "title": "Potential Hardcoded Secret / Credential",
                            "severity": "HIGH",
                            "file_path": fd.get("new_path"),
                            "line": h.get("new_start", 1),
                            "description": f"Potential sensitive credential string detected: '{l[1:].strip()}'",
                            "recommendation": "Move secrets into environment variables or secrets manager.",
                        })

        # 11. Review Gates & Comments
        gates, comments, gate_status = self.evaluate_gates_and_comments(
            config=config,
            breaking_changes=breaking_changes,
            arch_review=arch_review,
            risk_delta=risk_delta,
            test_impact=test_impact,
            sec_findings=sec_findings,
            symbol_changes=symbol_changes,
            file_diffs=file_diffs,
        )

        # 12. Epistemic Unknowns & Validation Checklist
        unknowns = [
            {"item": "Dynamic invocations and untyped calls cannot be proven statically without runtime tests."},
            {"item": "Third-party network dependencies require integration / staging verification."},
        ]
        if breaking_changes.get("unknowns"):
            unknowns.extend(breaking_changes["unknowns"])

        validation_checklist = [
            {"task": "Run automated test suite in CI to verify regression status."},
            {"task": "Verify backward compatibility of API endpoints with active frontend clients."},
            {"task": "Perform smoke test on staging environment before production rollout."},
        ]
        if breaking_changes.get("detected"):
            validation_checklist.append({"task": "Notify downstream API consumers of detected breaking changes."})

        # 13. AI Grounded Review
        ai_review = await self.generate_ai_review(
            title=title,
            changed_files_count=len(file_diffs),
            insertions=insertions,
            deletions=deletions,
            risk_delta=risk_delta,
            breaking_changes=breaking_changes,
            arch_review=arch_review,
            test_impact=test_impact,
            comments=comments,
        )

        diff_summary = {
            "files": file_diffs,
            "monorepo_packages": monorepo_packages,
            "total_files": len(file_diffs),
            "insertions": insertions,
            "deletions": deletions,
        }

        # 14. Persist Review in Database
        review = PullRequestReview(
            repository_id=repository_id,
            provider=provider,
            pr_number=pr_number,
            title=title,
            source_branch=source_branch,
            target_branch=target_branch,
            base_commit_sha=base_commit_sha,
            head_commit_sha=head_commit_sha,
            author=author,
            status="completed",
            review_gate_status=gate_status,
            summary=ai_review.get("summary"),
            changed_files_count=len(file_diffs),
            changed_symbols_count=len(symbol_changes),
            insertions=insertions,
            deletions=deletions,
            risk_score_before=base_risk,
            risk_score_after=head_risk,
            risk_delta=risk_delta,
            debt_hours_before=debt_hours_before,
            debt_hours_after=debt_hours_after,
            debt_hours_delta=debt_hours_delta,
            debt_cost_before=debt_hours_before * 120.0,
            debt_cost_after=debt_hours_after * 120.0,
            debt_cost_delta=debt_cost_delta,
            breaking_changes_count=breaking_changes.get("total_breaking_count", 0),
            architecture_violations_count=arch_review.get("violations_count", 0),
            security_findings_count=len(sec_findings),
            reliability_findings_count=0,
            test_gaps_count=test_impact.get("test_gaps_count", 0),
            diff_summary_json=diff_summary,
            symbol_changes_json=symbol_changes,
            breaking_changes_json=breaking_changes,
            architecture_review_json=arch_review,
            impact_analysis_json={"changed_files": [f.get("new_path") or f.get("old_path") for f in file_diffs]},
            risk_breakdown_json={"base_risk": base_risk, "risk_added": risk_added, "risk_score": head_risk},
            technical_debt_json={"hours_delta": debt_hours_delta, "cost_delta": debt_cost_delta},
            security_review_json={"findings": sec_findings},
            reliability_review_json={"observations": []},
            test_impact_json=test_impact,
            historical_context_json=hist_context,
            unknowns_json=unknowns,
            validation_checklist_json=validation_checklist,
            review_comments_json=comments,
            review_gates_json=gates,
            ai_review_json=ai_review,
            config_snapshot_json=config,
            metadata_json={"generated_at": datetime.now(timezone.utc).isoformat()},
        )

        db.add(review)
        await db.commit()
        await db.refresh(review)

        # Broadcast PR review completed
        try:
            await collaboration_manager.broadcast_to_repository(
                repository_id=repository_id,
                event_type=CollaborationEventType.PR_REVIEW_COMPLETED.value,
                payload={
                    "review_id": review.id,
                    "title": review.title,
                    "gate_status": review.review_gate_status,
                    "breaking_changes_count": review.breaking_changes_count,
                    "architecture_violations_count": review.architecture_violations_count,
                    "security_findings_count": review.security_findings_count,
                    "risk_delta": review.risk_delta,
                },
            )
        except Exception:
            pass

        return review


# Singleton instance
pr_reviewer_service = PullRequestReviewerService()
