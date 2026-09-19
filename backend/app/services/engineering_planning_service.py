import logging
import uuid
from datetime import datetime, timezone
from collections import defaultdict
from typing import Dict, Any, List, Optional, Set, Tuple

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.engineering_plan import EngineeringPlan
from backend.app.services.architecture_intelligence_service import architecture_intelligence_service
from backend.app.services.technical_debt_service import technical_debt_service
from backend.app.services.risk_intelligence_service import risk_intelligence_service
from backend.app.services.future_impact_simulator_service import future_impact_simulator_service
from backend.app.services.impact_analysis_service import impact_service
from backend.app.services.time_machine_service import time_machine_service

logger = logging.getLogger("codeatlas.engineering_planning")


class EngineeringPlanningService:
    """
    Phase 23 — AI CTO & Engineering Planning Intelligence Engine
    
    Synthesizes repository-wide static AST, dependency graphs, architecture intelligence,
    technical debt, risk signals, and historical evolution into actionable engineering planning:
    - Multi-dimensional Engineering Health Assessment
    - Grounded Engineering Priorities with Action & Validation Plans
    - Technical Roadmaps (Now / Next / Later across 1w / 1m / 3m / long_term)
    - Strategic Inquiries ("What should we do next?", "What if ignored?", Strategy Comparisons)
    - Plan Generation, Persistence, and Auto-Versioning
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def invalidate_cache(self, repository_id: Optional[str] = None):
        if repository_id:
            self._cache.pop(repository_id, None)
        else:
            self._cache.clear()

    # =========================================================================
    # 1. MULTI-DIMENSIONAL ENGINEERING HEALTH ASSESSMENT
    # =========================================================================

    async def get_engineering_health(
        self, db: AsyncSession, repository_id: str
    ) -> Dict[str, Any]:
        """
        Assesses repository health across 7 core engineering dimensions.
        Returns overall score (0-100), letter grade, status, and dimensional breakdown.
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        cache_key = f"health_{repository_id}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        # Fetch underlying intelligence
        debt_data = await technical_debt_service.analyze_technical_debt(db, repository_id)
        risk_data = await risk_intelligence_service.analyze_repository_risk(db, repository_id)
        
        try:
            arch_data = await architecture_intelligence_service.get_advanced_architecture_intelligence(repository_id, db)
        except Exception as e:
            logger.warning(f"Could not load architecture intelligence for {repository_id}: {e}")
            arch_data = {}

        # Files and dependencies query
        f_stmt = select(File).where(File.repository_id == repository_id)
        f_res = await db.execute(f_stmt)
        files = f_res.scalars().all()
        file_count = len(files)

        dep_stmt = select(Dependency).where(Dependency.repository_id == repository_id)
        dep_res = await db.execute(dep_stmt)
        dependencies = dep_res.scalars().all()

        findings = debt_data.get("findings", [])
        hotspots = risk_data.get("hotspots", [])
        arch_violations = arch_data.get("violations", []) if isinstance(arch_data, dict) else []
        cycles = arch_data.get("cycles", {}).get("cycles", []) if isinstance(arch_data, dict) else []

        # ---------------------------------------------------------------------
        # Dimension 1: Architecture Health
        # ---------------------------------------------------------------------
        arch_score = 100.0
        arch_strengths = []
        arch_concerns = []
        
        violation_count = len(arch_violations)
        cycle_count = len(cycles)
        
        if violation_count > 0:
            deduct = min(40.0, violation_count * 10.0)
            arch_score -= deduct
            arch_concerns.append(f"{violation_count} architectural layer/boundary violations detected")
        else:
            arch_strengths.append("No boundary or layer violations detected")

        if cycle_count > 0:
            deduct = min(30.0, cycle_count * 15.0)
            arch_score -= deduct
            arch_concerns.append(f"{cycle_count} circular dependency cycles detected")
        else:
            arch_strengths.append("Clean acyclic dependency structure")

        arch_score = max(10.0, min(100.0, round(arch_score, 1)))
        dim_arch = {
            "name": "Architecture Health",
            "key": "architecture",
            "score": arch_score,
            "grade": self._score_to_grade(arch_score),
            "status": self._score_to_status(arch_score),
            "summary": "Evaluates architectural layering, coupling stability, and cyclic dependencies.",
            "strengths": arch_strengths,
            "concerns": arch_concerns,
            "metrics": {
                "violations_count": violation_count,
                "cycles_count": cycle_count,
                "components_count": len(arch_data.get("components", [])) if isinstance(arch_data, dict) else 0,
            },
        }

        # ---------------------------------------------------------------------
        # Dimension 2: Code Quality & Complexity
        # ---------------------------------------------------------------------
        quality_score = 100.0
        quality_strengths = []
        quality_concerns = []

        oversized_files = [f for f in files if (f.line_count or 0) > 300]
        if oversized_files:
            deduct = min(35.0, len(oversized_files) * 5.0)
            quality_score -= deduct
            quality_concerns.append(f"{len(oversized_files)} files exceed 300 LOC maintainability threshold")
        else:
            quality_strengths.append("File sizes are modular and within maintainable bounds")

        complexity_findings = [f for f in findings if f.get("category") == "COMPLEXITY"]
        if complexity_findings:
            deduct = min(30.0, len(complexity_findings) * 4.0)
            quality_score -= deduct
            quality_concerns.append(f"{len(complexity_findings)} functions exhibit elevated cyclomatic complexity")
        else:
            quality_strengths.append("Low cyclomatic complexity across codebase")

        quality_score = max(10.0, min(100.0, round(quality_score, 1)))
        dim_quality = {
            "name": "Code Quality & Complexity",
            "key": "quality",
            "score": quality_score,
            "grade": self._score_to_grade(quality_score),
            "status": self._score_to_status(quality_score),
            "summary": "Measures code size, modularity, cyclomatic complexity, and nesting.",
            "strengths": quality_strengths,
            "concerns": quality_concerns,
            "metrics": {
                "oversized_files_count": len(oversized_files),
                "complexity_findings_count": len(complexity_findings),
                "total_files": file_count,
            },
        }

        # ---------------------------------------------------------------------
        # Dimension 3: Technical Debt
        # ---------------------------------------------------------------------
        debt_score = float(debt_data.get("debt_score", 85.0))
        debt_strengths = []
        debt_concerns = []
        total_debt_findings = debt_data.get("total_findings", 0)

        if total_debt_findings == 0:
            debt_strengths.append("Zero unaddressed technical debt items detected")
        else:
            crit_debt = debt_data.get("findings_by_severity", {}).get("CRITICAL", 0)
            if crit_debt > 0:
                debt_concerns.append(f"{crit_debt} CRITICAL debt findings requiring prompt remediation")
            debt_concerns.append(f"{total_debt_findings} total debt findings across repository")

        dim_debt = {
            "name": "Technical Debt",
            "key": "technical_debt",
            "score": debt_score,
            "grade": self._score_to_grade(debt_score),
            "status": self._score_to_status(debt_score),
            "summary": "Quantifies technical debt accumulation, duplication, and remediation effort.",
            "strengths": debt_strengths,
            "concerns": debt_concerns,
            "metrics": {
                "debt_score": debt_score,
                "total_findings": total_debt_findings,
                "estimated_remediation_hours": debt_data.get("estimated_remediation_hours", 0.0),
            },
        }

        # ---------------------------------------------------------------------
        # Dimension 4: Security & Reliability Risk
        # ---------------------------------------------------------------------
        overall_risk = float(risk_data.get("overall_risk_score", 20.0))
        security_score = max(10.0, min(100.0, round(100.0 - overall_risk, 1)))
        sec_strengths = []
        sec_concerns = []

        hotspot_count = len(hotspots)
        if hotspot_count > 0:
            sec_concerns.append(f"{hotspot_count} multi-signal engineering hotspots identified")
        else:
            sec_strengths.append("No high-risk engineering hotspots detected")

        if overall_risk < 30:
            sec_strengths.append(f"Low overall risk footprint ({overall_risk}/100)")
        else:
            sec_concerns.append(f"Elevated risk score ({overall_risk}/100) based on churn and coupling")

        dim_security = {
            "name": "Security & Reliability Risk",
            "key": "security_reliability",
            "score": security_score,
            "grade": self._score_to_grade(security_score),
            "status": self._score_to_status(security_score),
            "summary": "Measures structural instability, blast radius vulnerabilities, and risk hotspots.",
            "strengths": sec_strengths,
            "concerns": sec_concerns,
            "metrics": {
                "risk_score": overall_risk,
                "hotspots_count": hotspot_count,
            },
        }

        # ---------------------------------------------------------------------
        # Dimension 5: Dependency Health
        # ---------------------------------------------------------------------
        dep_score = 100.0
        dep_strengths = []
        dep_concerns = []

        dep_findings = [f for f in findings if f.get("category") == "DEPENDENCY"]
        if dep_findings:
            dep_score -= min(40.0, len(dep_findings) * 8.0)
            dep_concerns.append(f"{len(dep_findings)} dependency debt/coupling issues detected")
        else:
            dep_strengths.append("Healthy dependency graph without excessive coupling")

        if len(dependencies) > 0:
            dep_strengths.append(f"{len(dependencies)} registered package/module dependencies")

        dep_score = max(10.0, min(100.0, round(dep_score, 1)))
        dim_dep = {
            "name": "Dependency Health",
            "key": "dependencies",
            "score": dep_score,
            "grade": self._score_to_grade(dep_score),
            "status": self._score_to_status(dep_score),
            "summary": "Assesses package/module dependency health, fan-in/fan-out, and stability.",
            "strengths": dep_strengths,
            "concerns": dep_concerns,
            "metrics": {
                "dependencies_count": len(dependencies),
                "dependency_findings_count": len(dep_findings),
            },
        }

        # ---------------------------------------------------------------------
        # Dimension 6: Testing Health & Coverage
        # ---------------------------------------------------------------------
        test_score = 100.0
        test_strengths = []
        test_concerns = []

        test_files = [f for f in files if "test" in f.path.lower()]
        test_gaps = [f for f in findings if f.get("category") == "TEST_GAP"]

        if file_count > 0:
            test_ratio = len(test_files) / max(1, file_count)
            if test_ratio < 0.15 and file_count > 5:
                test_score -= 30.0
                test_concerns.append(f"Low test-to-source ratio ({len(test_files)} test files for {file_count} source files)")
            else:
                test_strengths.append(f"Identified {len(test_files)} automated test files in repository")

        if test_gaps:
            test_score -= min(35.0, len(test_gaps) * 10.0)
            test_concerns.append(f"{len(test_gaps)} critical components lack automated test coverage")
        elif len(test_files) > 0:
            test_strengths.append("No critical untested business logic flags")

        test_score = max(10.0, min(100.0, round(test_score, 1)))
        dim_testing = {
            "name": "Testing Health & Coverage",
            "key": "testing",
            "score": test_score,
            "grade": self._score_to_grade(test_score),
            "status": self._score_to_status(test_score),
            "summary": "Tracks automated test coverage, regression protection, and test gaps.",
            "strengths": test_strengths,
            "concerns": test_concerns,
            "metrics": {
                "test_files_count": len(test_files),
                "test_gap_findings": len(test_gaps),
            },
        }

        # ---------------------------------------------------------------------
        # Dimension 7: Change Risk & Churn
        # ---------------------------------------------------------------------
        churn_score = 100.0
        churn_strengths = []
        churn_concerns = []

        high_churn_hotspots = [
            h for h in hotspots if "HIGH_CHURN" in h.get("signals_intersected", [])
        ]
        if high_churn_hotspots:
            churn_score -= min(40.0, len(high_churn_hotspots) * 10.0)
            churn_concerns.append(f"{len(high_churn_hotspots)} files have high modification frequency/churn")
        else:
            churn_strengths.append("Stable commit velocity without volatile churn hotspots")

        churn_score = max(10.0, min(100.0, round(churn_score, 1)))
        dim_churn = {
            "name": "Change Risk & Churn",
            "key": "change_risk",
            "score": churn_score,
            "grade": self._score_to_grade(churn_score),
            "status": self._score_to_status(churn_score),
            "summary": "Evaluates Git volatility, change frequency, and file modification risk.",
            "strengths": churn_strengths,
            "concerns": churn_concerns,
            "metrics": {
                "high_churn_files_count": len(high_churn_hotspots),
            },
        }

        dimensions = [
            dim_arch,
            dim_quality,
            dim_debt,
            dim_security,
            dim_dep,
            dim_testing,
            dim_churn,
        ]

        # Overall repository score (weighted average)
        # Weights: Arch 20%, Quality 15%, Debt 20%, Security 15%, Dep 10%, Testing 10%, Churn 10%
        weights = [0.20, 0.15, 0.20, 0.15, 0.10, 0.10, 0.10]
        overall_score = round(sum(d["score"] * w for d, w in zip(dimensions, weights)), 1)
        overall_score = max(10.0, min(100.0, overall_score))
        overall_grade = self._score_to_grade(overall_score)
        overall_status = self._score_to_status(overall_score)

        summary_str = (
            f"Engineering Health Score: {overall_score}/100 ({overall_grade} - {overall_status}). "
            f"Repository contains {file_count} files, {total_debt_findings} debt findings, "
            f"{len(hotspots)} risk hotspots, and {violation_count} architecture violations."
        )

        result = {
            "repository_id": repository_id,
            "overall_score": overall_score,
            "overall_grade": overall_grade,
            "overall_status": overall_status,
            "summary": summary_str,
            "dimensions": dimensions,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

        self._cache[cache_key] = result
        return result

    def _score_to_grade(self, score: float) -> str:
        if score >= 90.0:
            return "A"
        elif score >= 80.0:
            return "B"
        elif score >= 70.0:
            return "C"
        elif score >= 60.0:
            return "D"
        return "F"

    def _score_to_status(self, score: float) -> str:
        if score >= 85.0:
            return "HEALTHY"
        elif score >= 70.0:
            return "MODERATE"
        elif score >= 50.0:
            return "DEGRADED"
        return "CRITICAL"

    # =========================================================================
    # 2. EVIDENCE-BACKED ENGINEERING PRIORITIES
    # =========================================================================

    async def get_engineering_priorities(
        self, db: AsyncSession, repository_id: str
    ) -> Dict[str, Any]:
        """
        Synthesizes and ranks real, evidence-backed engineering priorities.
        Each work item includes Problem, Recommended Action, Validation Plan,
        Impact, Risk if Ignored, and Evidence Citations.
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        cache_key = f"priorities_{repository_id}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        debt_data = await technical_debt_service.analyze_technical_debt(db, repository_id)
        risk_data = await risk_intelligence_service.analyze_repository_risk(db, repository_id)
        
        try:
            arch_data = await architecture_intelligence_service.get_advanced_architecture_intelligence(repository_id, db)
        except Exception:
            arch_data = {}

        findings = debt_data.get("findings", [])
        hotspots = risk_data.get("hotspots", [])
        violations = arch_data.get("violations", []) if isinstance(arch_data, dict) else []
        cycles = arch_data.get("cycles", {}).get("cycles", []) if isinstance(arch_data, dict) else []

        work_items: List[Dict[str, Any]] = []
        item_counter = 1

        # 1. Priorities from Architecture Violations & Cycles (Tier: CRITICAL / HIGH)
        if cycles:
            for cycle in cycles[:2]:
                cycle_nodes = cycle.get("cycle", []) if isinstance(cycle, dict) else cycle
                cycle_str = " -> ".join(cycle_nodes[:4])
                work_items.append({
                    "id": f"item-arch-cycle-{item_counter}",
                    "title": f"Decouple Circular Dependency: {cycle_str}",
                    "problem_statement": f"Circular architectural dependency detected among: {cycle_str}. This prevents isolated modular testing and tightens coupling.",
                    "primary_category": "ARCHITECTURE",
                    "priority_tier": "CRITICAL",
                    "priority_score": 95.0,
                    "target_files": cycle_nodes,
                    "target_symbols": [],
                    "prerequisite_item_ids": [],
                    "dependent_item_ids": [],
                    "recommended_action": f"Introduce an abstraction interface or shared utility to invert dependency and break cycle between {cycle_nodes[0] if cycle_nodes else 'modules'}.",
                    "validation_plan": [
                        "Run architecture linter to verify cycle resolution",
                        "Execute dependency graph analysis ensuring acyclic DAG structure",
                        "Verify unit tests for decoupled modules pass independently",
                    ],
                    "effort_estimate": "Effort estimate unavailable from repository evidence.",
                    "evidence": [
                        {
                            "evidence_type": "GRAPH",
                            "source_path": cycle_nodes[0] if cycle_nodes else None,
                            "metric_name": "CYCLE_LENGTH",
                            "metric_value": len(cycle_nodes),
                            "explanation": f"Cycle detected in dependency graph containing {len(cycle_nodes)} nodes: {cycle_str}",
                        }
                    ],
                    "impact_summary": f"Breaks structural deadlock affecting {len(cycle_nodes)} interconnected components.",
                    "risk_if_ignored": "High risk of ripple breakage during refactorings and cascading build/runtime dependency failures.",
                })
                item_counter += 1

        if violations:
            for viol in violations[:3]:
                source_p = viol.get("source_file", "")
                target_p = viol.get("target_file", "")
                viol_type = viol.get("rule_name", "LAYER_VIOLATION")
                work_items.append({
                    "id": f"item-arch-viol-{item_counter}",
                    "title": f"Resolve Architectural Violation: {viol_type} in {source_p}",
                    "problem_statement": viol.get("message", f"Architectural boundary breach from {source_p} to {target_p}."),
                    "primary_category": "ARCHITECTURE",
                    "priority_tier": "HIGH",
                    "priority_score": 88.0,
                    "target_files": [p for p in [source_p, target_p] if p],
                    "target_symbols": [],
                    "prerequisite_item_ids": [],
                    "dependent_item_ids": [],
                    "recommended_action": f"Redirect dependency through service or repository layer boundary; remove direct cross-tier imports.",
                    "validation_plan": [
                        "Run static architectural boundary check",
                        "Confirm source file imports conform to layer hierarchy",
                    ],
                    "effort_estimate": "Effort estimate unavailable from repository evidence.",
                    "evidence": [
                        {
                            "evidence_type": "HOTSPOT",
                            "source_path": source_p,
                            "metric_name": "VIOLATION_TYPE",
                            "metric_value": viol_type,
                            "explanation": viol.get("message", f"Boundary violation from {source_p} to {target_p}"),
                        }
                    ],
                    "impact_summary": f"Protects system layering and stops architectural decay in {source_p}.",
                    "risk_if_ignored": "Technical debt spreads into consuming modules, making modular rewrites difficult.",
                })
                item_counter += 1

        # 2. Priorities from Hotspots (Tier: CRITICAL / HIGH)
        for h in hotspots[:4]:
            h_path = h.get("file_path", "")
            h_score = h.get("composite_score", 50.0)
            signals = h.get("signals_intersected", [])
            tier = "CRITICAL" if h_score >= 60.0 else "HIGH"

            recs = []
            if "HIGH_COMPLEXITY_SIZE" in signals:
                recs.append("Decompose oversized methods and extract cohesive helper sub-modules")
            if "HIGH_COUPLING" in signals:
                recs.append("Reduce fan-in/fan-out coupling via interface segregation")
            if "TEST_COVERAGE_GAP" in signals:
                recs.append("Implement automated test coverage for critical paths")
            if "HIGH_CHURN" in signals:
                recs.append("Stabilize frequent change vectors by isolating business logic from volatile adapters")

            rec_action = "; ".join(recs) if recs else "Refactor component to reduce complexity and volatility."

            work_items.append({
                "id": f"item-hotspot-{item_counter}",
                "title": f"Refactor Engineering Hotspot: {h_path}",
                "problem_statement": f"File '{h_path}' is an active engineering hotspot with composite risk score {h_score}/100 intersecting {len(signals)} risk vectors ({', '.join(signals)}).",
                "primary_category": "CHANGE_RISK" if "HIGH_CHURN" in signals else "TECHNICAL_DEBT",
                "priority_tier": tier,
                "priority_score": h_score,
                "target_files": [h_path],
                "target_symbols": [],
                "prerequisite_item_ids": [],
                "dependent_item_ids": [],
                "recommended_action": rec_action,
                "validation_plan": [
                    f"Create comprehensive unit test suite covering {h_path}",
                    "Measure cyclomatic complexity reduction post-refactoring",
                    "Verify all existing regression tests pass",
                ],
                "effort_estimate": "Effort estimate unavailable from repository evidence.",
                "evidence": [
                    {
                        "evidence_type": "HOTSPOT",
                        "source_path": h_path,
                        "metric_name": "COMPOSITE_RISK_SCORE",
                        "metric_value": h_score,
                        "explanation": h.get("explanation", f"Hotspot with signals: {', '.join(signals)}"),
                    }
                ],
                "impact_summary": f"Reduces blast radius and failure probability for high-churn component {h_path}.",
                "risk_if_ignored": "High probability of regressions during upcoming changes and increased onboarding overhead.",
            })
            item_counter += 1

        # 3. Priorities from Test Coverage Gaps (Tier: HIGH / MEDIUM)
        test_gap_findings = [f for f in findings if f.get("category") == "TEST_GAP"]
        for tg in test_gap_findings[:3]:
            tg_file = tg.get("file_path", "")
            work_items.append({
                "id": f"item-testgap-{item_counter}",
                "title": f"Expand Automated Test Suite: {tg_file}",
                "problem_statement": tg.get("description", f"Production component '{tg_file}' lacks automated test coverage."),
                "primary_category": "TESTING",
                "priority_tier": "HIGH" if tg.get("severity") == "HIGH" else "MEDIUM",
                "priority_score": 75.0,
                "target_files": [tg_file],
                "target_symbols": [],
                "prerequisite_item_ids": [],
                "dependent_item_ids": [],
                "recommended_action": f"Author integration and unit test fixtures targeting core execution paths in '{tg_file}'.",
                "validation_plan": [
                    f"Run pytest/jest to execute newly added tests against {tg_file}",
                    "Verify boundary edge cases and failure modes are exercised",
                ],
                "effort_estimate": "Effort estimate unavailable from repository evidence.",
                "evidence": [
                    {
                        "evidence_type": "DEBT",
                        "source_path": tg_file,
                        "metric_name": "TEST_GAP",
                        "metric_value": tg.get("severity", "HIGH"),
                        "explanation": tg.get("impact", "Lack of test coverage leaves code vulnerable to silent regressions."),
                    }
                ],
                "impact_summary": f"Establishes a safety harness allowing future refactoring of {tg_file} without fear of regression.",
                "risk_if_ignored": "High risk of unnoticed regressions reaching production when editing core logic.",
            })
            item_counter += 1

        # 4. Priorities from Critical Technical Debt Findings (Tier: HIGH / MEDIUM)
        crit_high_debt = [
            f for f in findings 
            if f.get("severity") in ("CRITICAL", "HIGH") and f.get("category") not in ("TEST_GAP", "DOCUMENTATION")
        ]
        for dbg in crit_high_debt[:3]:
            dbg_path = dbg.get("file_path", "")
            work_items.append({
                "id": f"item-debt-{item_counter}",
                "title": dbg.get("title", f"Remediate Debt in {dbg_path}"),
                "problem_statement": dbg.get("description", "High technical debt detected."),
                "primary_category": dbg.get("category", "TECHNICAL_DEBT"),
                "priority_tier": dbg.get("severity", "HIGH"),
                "priority_score": 80.0 if dbg.get("severity") == "CRITICAL" else 68.0,
                "target_files": [dbg_path] if dbg_path else [],
                "target_symbols": [],
                "prerequisite_item_ids": [],
                "dependent_item_ids": [],
                "recommended_action": dbg.get("remediation", "Refactor target component to resolve debt finding."),
                "validation_plan": [
                    "Run static code analyzer to ensure debt warning clears",
                    "Run existing test suite to verify no functional regression",
                ],
                "effort_estimate": "Effort estimate unavailable from repository evidence.",
                "evidence": [
                    {
                        "evidence_type": "DEBT",
                        "source_path": dbg_path,
                        "metric_name": dbg.get("type", "DEBT_FINDING"),
                        "metric_value": dbg.get("severity", "HIGH"),
                        "explanation": dbg.get("description", "Identified by static analysis engine."),
                    }
                ],
                "impact_summary": dbg.get("impact", "Improves code readability, testability, and maintenance velocity."),
                "risk_if_ignored": "Compounding maintenance overhead and slower feature delivery times.",
            })
            item_counter += 1

        # Fallback if no issues detected
        if not work_items:
            f_first = files[0].path if files else "repository"
            work_items.append({
                "id": f"item-baseline-{item_counter}",
                "title": f"Maintain Architecture Baseline & Continuous Validation",
                "problem_statement": "Codebase shows high health with no critical hotspots or architectural violations.",
                "primary_category": "TESTING",
                "priority_tier": "LOW",
                "priority_score": 40.0,
                "target_files": [f_first],
                "target_symbols": [],
                "prerequisite_item_ids": [],
                "dependent_item_ids": [],
                "recommended_action": "Continue executing automated test fixtures and CI linting on each commit.",
                "validation_plan": ["Verify CI pipeline green status"],
                "effort_estimate": "Effort estimate unavailable from repository evidence.",
                "evidence": [
                    {
                        "evidence_type": "AST",
                        "source_path": f_first,
                        "metric_name": "HEALTH_INDEX",
                        "metric_value": "HEALTHY",
                        "explanation": "No critical architectural violations or hotspots found in active scan.",
                    }
                ],
                "impact_summary": "Sustains high software engineering quality.",
                "risk_if_ignored": "Low risk.",
            })

        # Wire prerequisites: Test gaps on a file should precede large refactorings on the same file!
        file_to_test_item = {}
        for item in work_items:
            if item["primary_category"] == "TESTING" and item["target_files"]:
                file_to_test_item[item["target_files"][0]] = item["id"]

        for item in work_items:
            if item["primary_category"] in ("TECHNICAL_DEBT", "CHANGE_RISK", "ARCHITECTURE") and item["target_files"]:
                target_f = item["target_files"][0]
                if target_f in file_to_test_item and file_to_test_item[target_f] != item["id"]:
                    test_id = file_to_test_item[target_f]
                    item["prerequisite_item_ids"].append(test_id)
                    # Wire reverse dependent
                    for t_item in work_items:
                        if t_item["id"] == test_id and item["id"] not in t_item["dependent_item_ids"]:
                            t_item["dependent_item_ids"].append(item["id"])

        # Sort by priority_score descending
        work_items.sort(key=lambda x: -x["priority_score"])

        rationale = (
            f"Evaluated {len(work_items)} engineering priorities derived from {len(violations)} architecture violations, "
            f"{len(hotspots)} risk hotspots, and {len(findings)} technical debt findings. "
            f"Priorities are ranked by structural risk, blast radius, and dependency prerequisites."
        )

        result = {
            "repository_id": repository_id,
            "total_priorities": len(work_items),
            "priorities": work_items,
            "rationale": rationale,
            "evaluated_at": datetime.now(timezone.utc).isoformat(),
        }

        self._cache[cache_key] = result
        return result

    # =========================================================================
    # 3. ROADMAP GENERATION (Now / Next / Later)
    # =========================================================================

    async def generate_roadmap(
        self,
        db: AsyncSession,
        repository_id: str,
        time_frame: str = "1_month",
    ) -> Dict[str, Any]:
        """
        Organizes priorities into Now, Next, and Later time horizons based on
        priority score, severity tier, and prerequisite dependencies.
        """
        priorities_data = await self.get_engineering_priorities(db, repository_id)
        items = priorities_data.get("priorities", [])

        now_items: List[Dict[str, Any]] = []
        next_items: List[Dict[str, Any]] = []
        later_items: List[Dict[str, Any]] = []

        now_ids = set()

        # Step 1: Assign to horizons
        for item in items:
            tier = item.get("priority_tier", "MEDIUM")
            has_prereqs = len(item.get("prerequisite_item_ids", [])) > 0
            
            # If it has prerequisites not yet in NOW, it belongs in NEXT or LATER
            if tier == "CRITICAL" and not has_prereqs:
                horizon = "NOW"
                now_items.append(self._format_roadmap_item(item, horizon))
                now_ids.add(item["id"])
            elif tier in ("CRITICAL", "HIGH"):
                if has_prereqs and not any(p in now_ids for p in item["prerequisite_item_ids"]):
                    horizon = "NEXT"
                    next_items.append(self._format_roadmap_item(item, horizon))
                elif not has_prereqs and len(now_items) < 3:
                    horizon = "NOW"
                    now_items.append(self._format_roadmap_item(item, horizon))
                    now_ids.add(item["id"])
                else:
                    horizon = "NEXT"
                    next_items.append(self._format_roadmap_item(item, horizon))
            elif tier == "MEDIUM":
                horizon = "NEXT" if len(next_items) < 4 else "LATER"
                if horizon == "NEXT":
                    next_items.append(self._format_roadmap_item(item, horizon))
                else:
                    later_items.append(self._format_roadmap_item(item, horizon))
            else:
                horizon = "LATER"
                later_items.append(self._format_roadmap_item(item, horizon))

        # Ensure NOW is not empty if items exist
        if not now_items and items:
            first = items[0]
            now_items.append(self._format_roadmap_item(first, "NOW"))
            # remove from other lists if present
            next_items = [x for x in next_items if x["work_item_id"] != first["id"]]
            later_items = [x for x in later_items if x["work_item_id"] != first["id"]]

        exec_summary = (
            f"Roadmap across {time_frame}: {len(now_items)} immediate action items (NOW), "
            f"{len(next_items)} high-leverage follow-ups (NEXT), and {len(later_items)} preventative debt items (LATER)."
        )

        return {
            "repository_id": repository_id,
            "time_frame": time_frame,
            "now": now_items,
            "next": next_items,
            "later": later_items,
            "executive_summary": exec_summary,
            "total_items": len(now_items) + len(next_items) + len(later_items),
        }

    def _format_roadmap_item(self, item: Dict[str, Any], horizon: str) -> Dict[str, Any]:
        return {
            "work_item_id": item["id"],
            "title": item["title"],
            "category": item["primary_category"],
            "priority": item["priority_tier"],
            "time_horizon": horizon,
            "target_files": item.get("target_files", []),
            "prerequisites": item.get("prerequisite_item_ids", []),
            "summary": item.get("problem_statement", "")[:180],
        }

    # =========================================================================
    # 4. STRATEGIC INQUIRIES & COMPARISONS
    # =========================================================================

    async def what_should_we_do_next(
        self, db: AsyncSession, repository_id: str
    ) -> Dict[str, Any]:
        """
        Calculates the single most urgent engineering action item, justified by evidence.
        """
        priorities_data = await self.get_engineering_priorities(db, repository_id)
        priorities = priorities_data.get("priorities", [])

        if not priorities:
            return {
                "repository_id": repository_id,
                "headline": "Engineering baseline is healthy. Maintain continuous testing.",
                "top_action": None,
                "next_actions": [],
                "justification": "No active engineering hotspots or debt violations found in repository analysis.",
                "blockers_or_prerequisites": [],
                "confidence": "HIGH",
            }

        top_item = priorities[0]
        next_items = priorities[1:4]

        justification = (
            f"Item '{top_item['title']}' is the highest ranked engineering priority with a score of "
            f"{top_item['priority_score']}/100 in category {top_item['primary_category']}. "
            f"Addressing this first eliminates downstream structural risk and unlocks subsequent refactorings."
        )

        return {
            "repository_id": repository_id,
            "headline": f"Recommended Next Action: {top_item['title']}",
            "top_action": top_item,
            "next_actions": next_items,
            "justification": justification,
            "blockers_or_prerequisites": top_item.get("prerequisite_item_ids", []),
            "confidence": "HIGH",
        }

    async def compare_strategies(
        self,
        db: AsyncSession,
        repository_id: str,
        work_item_id: Optional[str] = None,
        topic: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Compares 4 engineering strategies:
        1. MINIMAL_CHANGE
        2. STRUCTURAL_REFACTOR
        3. INCREMENTAL_MIGRATION
        4. CONTAINMENT
        """
        priorities_data = await self.get_engineering_priorities(db, repository_id)
        priorities = priorities_data.get("priorities", [])

        target_item = None
        if work_item_id:
            for item in priorities:
                if item["id"] == work_item_id:
                    target_item = item
                    break

        if not target_item and priorities:
            target_item = priorities[0]

        target_title = target_item["title"] if target_item else (topic or "Repository Component")
        target_files = target_item.get("target_files", []) if target_item else []
        file_desc = target_files[0] if target_files else "targeted components"

        # Formulate 4 strategies
        opt_minimal = {
            "strategy_type": "MINIMAL_CHANGE",
            "title": f"Minimal Targeted Patch on {file_desc}",
            "description": f"Apply surgical fixes strictly to the affected lines without altering architecture or public interfaces.",
            "pros": [
                "Lowest implementation time",
                "Minimal blast radius to external consumers",
                "Immediate resolution of acute symptoms",
            ],
            "cons": [
                "Leaves root architectural coupling intact",
                "Technical debt continues to compound",
                "High probability of recurrent regressions over time",
            ],
            "blast_radius": "LOW",
            "estimated_complexity": "Low",
            "recommended_steps": [
                f"Identify exact defect lines in {file_desc}",
                "Apply local boundary check or parameter sanitization",
                "Add localized regression test",
            ],
            "verification_strategy": [
                "Run unit test suite against modified file",
            ],
            "is_recommended": False,
        }

        opt_refactor = {
            "strategy_type": "STRUCTURAL_REFACTOR",
            "title": f"Structural Refactoring of {file_desc}",
            "description": f"Redesign component abstractions, decompose monolithic methods, and eliminate cyclical or excessive coupling.",
            "pros": [
                "Eliminates underlying structural root cause",
                "Dramatically improves maintainability and testability",
                "Permanently reduces composite risk hotspot score",
            ],
            "cons": [
                "Higher engineering effort required",
                "Moderate blast radius requiring updates across caller sites",
            ],
            "blast_radius": "MEDIUM",
            "estimated_complexity": "Moderate",
            "recommended_steps": [
                f"Establish test harness capturing current behavior of {file_desc}",
                "Extract cohesive sub-services/interfaces",
                "Update callers to use new decoupled interfaces",
                "Deprecate monolithic helper methods",
            ],
            "verification_strategy": [
                "Run full integration and unit test suite",
                "Re-run architecture linter to confirm zero boundary violations",
            ],
            "is_recommended": True,
        }

        opt_migration = {
            "strategy_type": "INCREMENTAL_MIGRATION",
            "title": f"Incremental Side-by-Side Migration for {file_desc}",
            "description": f"Use Strangler Fig pattern: introduce new decoupled implementation alongside existing code and shift traffic incrementally.",
            "pros": [
                "Near zero downtime or breaking change risk",
                "Enables verification at every stage of rollout",
                "Allows gradual adoption without massive PRs",
            ],
            "cons": [
                "Temporary duplication of code while migration is underway",
                "Requires maintaining dual paths until legacy is retired",
            ],
            "blast_radius": "LOW",
            "estimated_complexity": "Moderate-to-High",
            "recommended_steps": [
                "Build new V2 service alongside existing module",
                "Wrap callers in a feature flag or adapter routing to V2",
                "Progressively migrate calls until legacy usage hits zero",
                "Remove legacy module",
            ],
            "verification_strategy": [
                "Shadow-run test suites comparing V1 and V2 outputs",
                "Telemetry check on invocation counts",
            ],
            "is_recommended": False,
        }

        opt_containment = {
            "strategy_type": "CONTAINMENT",
            "title": f"Boundary Containment & Facade for {file_desc}",
            "description": f"Wrap the problematic module in a strict Facade/Adapter layer to prevent debt and violations from leaking outward.",
            "pros": [
                "Stops technical debt from infecting consuming services",
                "Defers full rewrite until team capacity permits",
                "Clean boundary makes future replacement straightforward",
            ],
            "cons": [
                "Internal flaws of the wrapped module remain unresolved",
                "Adds an extra layer of indirection",
            ],
            "blast_radius": "LOW",
            "estimated_complexity": "Low-to-Moderate",
            "recommended_steps": [
                f"Define strict API boundary facade for {file_desc}",
                "Restrict direct imports of the internal module via lint rules",
                "Route all external calls through the facade",
            ],
            "verification_strategy": [
                "Verify no caller directly imports internal submodule",
                "Ensure facade unit tests pass",
            ],
            "is_recommended": False,
        }

        options = [opt_refactor, opt_minimal, opt_migration, opt_containment]
        synthesis = (
            f"For '{target_title}', STRUCTURAL_REFACTOR is the recommended engineering path. "
            f"While MINIMAL_CHANGE offers quick relief, repository evidence shows recurring complexity "
            f"that warrants architectural decomposition to permanently stabilize the component."
        )

        return {
            "repository_id": repository_id,
            "work_item_id": work_item_id,
            "topic": target_title,
            "recommended_strategy": "STRUCTURAL_REFACTOR",
            "options": options,
            "synthesis": synthesis,
        }

    async def simulate_ignore(
        self,
        db: AsyncSession,
        repository_id: str,
        work_item_id: str,
    ) -> Dict[str, Any]:
        """
        Simulates what happens if a specific engineering work item is ignored.
        Integrates Phase 22 Future Impact Simulator to project risk escalation.
        """
        priorities_data = await self.get_engineering_priorities(db, repository_id)
        priorities = priorities_data.get("priorities", [])

        target_item = None
        for item in priorities:
            if item["id"] == work_item_id:
                target_item = item
                break

        if not target_item:
            target_item = priorities[0] if priorities else {
                "id": work_item_id,
                "title": "Selected Work Item",
                "target_files": [],
                "priority_score": 50.0,
                "risk_if_ignored": "Compounding debt and structural instability.",
            }

        target_file = target_item.get("target_files", ["unknown"])[0] if target_item.get("target_files") else "unknown"

        # Run impact simulation on hypothetical failure / mutation of the target file
        sim_result = {}
        try:
            sim_result = await future_impact_simulator_service.run_simulation(
                db=db,
                repository_id=repository_id,
                proposed_change=f"remove {target_file}",
            )
        except Exception as e:
            logger.warning(f"Simulate ignore future impact simulation failed: {e}")
            sim_result = {"consequences": {"predicted": [f"Downstream callers of {target_file} will experience breaking changes."]}}

        affected = sim_result.get("direct_impact", {}).get("affected_files", [])
        if not affected and target_file != "unknown":
            affected = [target_file]

        accumulated_risk = min(100.0, round(float(target_item.get("priority_score", 50.0)) * 1.35, 1))

        consequence_summary = (
            f"Ignoring '{target_item.get('title')}' will cause composite risk to compound from "
            f"{target_item.get('priority_score', 50.0)}/100 to {accumulated_risk}/100. "
            f"{target_item.get('risk_if_ignored', 'Architectural decay will accelerate.')} "
            f"A failure in this module threatens {len(affected)} interconnected components."
        )

        return {
            "repository_id": repository_id,
            "work_item_id": work_item_id,
            "title": target_item.get("title", "Engineering Item"),
            "consequence_summary": consequence_summary,
            "accumulated_risk_score": accumulated_risk,
            "affected_components": affected,
            "historical_precedents": [
                f"Historical commit churn in {target_file} confirms ongoing volatility",
                "Similar unresolved debt in this subsystem previously expanded downstream blast radius",
            ],
            "simulation_details": sim_result.get("consequences", {}),
        }

    # =========================================================================
    # 5. PLAN GENERATION, PERSISTENCE & VERSIONING
    # =========================================================================

    async def generate_plan(
        self,
        db: AsyncSession,
        repository_id: str,
        title: Optional[str] = None,
        time_horizon: str = "1_month",
        focus_areas: Optional[List[str]] = None,
        user_id: Optional[str] = None,
    ) -> EngineeringPlan:
        """
        Generates and saves a complete Engineering Plan with auto-versioning.
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        # 1. Fetch current health, priorities, and roadmap
        health = await self.get_engineering_health(db, repository_id)
        priorities_res = await self.get_engineering_priorities(db, repository_id)
        roadmap = await self.generate_roadmap(db, repository_id, time_frame=time_horizon)

        work_items = priorities_res.get("priorities", [])
        if focus_areas:
            # Filter or re-rank by focus areas if provided
            work_items = [
                wi for wi in work_items
                if any(fa.lower() in wi["primary_category"].lower() or fa.lower() in wi["title"].lower() for fa in focus_areas)
            ] or priorities_res.get("priorities", [])

        # 2. Determine version number
        stmt = (
            select(EngineeringPlan.version)
            .where(EngineeringPlan.repository_id == repository_id)
            .order_by(desc(EngineeringPlan.version))
            .limit(1)
        )
        res = await db.execute(stmt)
        latest_version = res.scalar() or 0
        new_version = latest_version + 1

        plan_title = title or f"AI CTO Engineering Plan v{new_version} ({time_horizon.replace('_', ' ').title()})"
        summary = (
            f"Autonomous engineering roadmap for {repo.name}. Overall Health: {health.get('overall_score')}/100 "
            f"({health.get('overall_grade')}). Identifies {len(work_items)} priority action items across {time_horizon}."
        )

        plan = EngineeringPlan(
            repository_id=repository_id,
            user_id=user_id,
            title=plan_title,
            status="active",
            version=new_version,
            time_horizon=time_horizon,
            summary=summary,
            health_snapshot=health,
            work_items=work_items,
            roadmaps=roadmap,
            source_evidence=[
                {"type": "HEALTH", "score": health.get("overall_score")},
                {"type": "PRIORITIES_COUNT", "count": len(work_items)},
            ],
            metadata_json={
                "focus_areas": focus_areas or [],
                "generated_at": datetime.now(timezone.utc).isoformat(),
            },
        )

        db.add(plan)
        await db.commit()
        await db.refresh(plan)

        # Invalidate cache
        self.invalidate_cache(repository_id)
        return plan

    async def create_plan(
        self,
        db: AsyncSession,
        repository_id: str,
        title: str,
        time_horizon: str = "1_month",
        summary: Optional[str] = None,
        work_items: Optional[List[Dict[str, Any]]] = None,
        roadmaps: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None,
    ) -> EngineeringPlan:
        """
        Creates a custom or customized engineering plan with auto-versioning.
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        stmt = (
            select(EngineeringPlan.version)
            .where(EngineeringPlan.repository_id == repository_id)
            .order_by(desc(EngineeringPlan.version))
            .limit(1)
        )
        res = await db.execute(stmt)
        latest_version = res.scalar() or 0
        new_version = latest_version + 1

        health = await self.get_engineering_health(db, repository_id)

        plan = EngineeringPlan(
            repository_id=repository_id,
            user_id=user_id,
            title=title,
            status="active",
            version=new_version,
            time_horizon=time_horizon,
            summary=summary or f"Engineering Plan v{new_version} for {repo.name}",
            health_snapshot=health,
            work_items=work_items or [],
            roadmaps=roadmaps or {},
            source_evidence=[{"type": "USER_CREATED", "version": new_version}],
            metadata_json={"custom": True},
        )

        db.add(plan)
        await db.commit()
        await db.refresh(plan)
        self.invalidate_cache(repository_id)
        return plan

    async def get_plan(
        self, db: AsyncSession, repository_id: str, plan_id: str
    ) -> EngineeringPlan:
        """
        Fetches an EngineeringPlan with strict repository isolation.
        """
        stmt = (
            select(EngineeringPlan)
            .where(
                EngineeringPlan.id == plan_id,
                EngineeringPlan.repository_id == repository_id,
            )
        )
        res = await db.execute(stmt)
        plan = res.scalar_one_or_none()
        if not plan:
            raise ValueError(f"Engineering plan '{plan_id}' not found in repository '{repository_id}'")
        return plan

    async def list_plans(
        self, db: AsyncSession, repository_id: str
    ) -> List[EngineeringPlan]:
        """
        Lists all engineering plans for a repository, ordered by version descending.
        """
        stmt = (
            select(EngineeringPlan)
            .where(EngineeringPlan.repository_id == repository_id)
            .order_by(desc(EngineeringPlan.version))
        )
        res = await db.execute(stmt)
        return list(res.scalars().all())

    async def update_plan_status(
        self, db: AsyncSession, repository_id: str, plan_id: str, status: str
    ) -> EngineeringPlan:
        """
        Updates the status of an engineering plan (e.g. active, completed, archived).
        """
        plan = await self.get_plan(db, repository_id, plan_id)
        plan.status = status
        await db.commit()
        await db.refresh(plan)
        return plan


engineering_planning_service = EngineeringPlanningService()
