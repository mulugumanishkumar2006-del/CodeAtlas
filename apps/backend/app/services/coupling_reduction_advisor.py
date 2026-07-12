"""CouplingReductionAdvisorService — Feature 6 Coupling Reduction Advisor."""

import uuid
from collections import defaultdict
from datetime import datetime
from typing import Dict, List

from sqlalchemy.orm import Session

from app.models.file import File
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.schemas.advisor import CouplingIssue, CouplingReport
from app.services.analysis_service import AnalysisService


class CouplingReductionAdvisorService:
    """
    Feature 6 — Detects high coupling, circular dependencies,
    god objects, and large modules; provides precise fixes
    and step-by-step engineering steps.
    """

    def __init__(self):
        self.analysis_service = AnalysisService()

    def _cid(self) -> str:
        return f"cpl_{uuid.uuid4().hex[:8]}"

    def get_coupling_report(self, db: Session, repo_id: str) -> CouplingReport:
        # 1. Gather code elements
        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
        relationships = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.repository_id == repo_id)
            .all()
        )
        files = db.query(File).filter(File.repository_id == repo_id).all()

        # Build coupling structures
        fan_in: Dict[str, int] = defaultdict(int)
        fan_out: Dict[str, int] = defaultdict(int)
        for r in relationships:
            fan_out[r.source_id] += 1
            fan_in[r.target_id] += 1

        issues: List[CouplingIssue] = []

        # ─── 1. Detect Cyclic Dependencies ───
        try:
            circular_data = self.analysis_service.detect_circular_dependencies(
                db, repo_id
            )
            total_cycles = circular_data.get("total_cycles", 0)
            if total_cycles > 0:
                for idx, cycle in enumerate(circular_data.get("cycles", [])[:3]):
                    affected = cycle.get("modules", [])
                    desc = cycle.get("description", "")
                    if not desc and len(affected) >= 2:
                        desc = " -> ".join(affected) + " -> " + affected[0]

                    issues.append(
                        CouplingIssue(
                            id=self._cid(),
                            issue_type="cyclic_dependency",
                            severity="Critical",
                            module_name=affected[0] if affected else "unknown",
                            description=f"Circular dependency loop detected: {desc}",
                            metrics={
                                "cycle_length": len(affected),
                                "total_repo_cycles": total_cycles,
                            },
                            affected_modules=affected,
                            precise_fix=f"Introduce an interface abstraction or extract shared models from '{affected[0]}' and its partners to break the loop.",
                            fix_steps=[
                                f"Analyze imports in '{affected[0]}' and locate where it references the cycle partners.",
                                "Extract the shared data models or core calculations into a separate shared helper module.",
                                "Update the cycle partners to import from the new shared module, completely resolving direct circular references.",
                            ],
                            before_state="Modules directly import each other, blocking modular isolation and unit test scoping.",
                            after_state="Clean unidirectional imports targeting a third shared component.",
                            estimated_effort="3–5 days",
                            expected_improvement=f"Resolves circular dependency loop involving {len(affected)} modules.",
                            confidence=0.98,
                            tags=["cyclic-dependency", "coupling", "refactoring"],
                        )
                    )
        except Exception:
            pass

        # ─── 2. Detect God Objects ───
        # Criteria: node with high fan_in >= 6 and high fan_out >= 5
        for node in nodes:
            fi = fan_in[node.id]
            fo = fan_out[node.id]
            if fi >= 6 and fo >= 5:
                issues.append(
                    CouplingIssue(
                        id=self._cid(),
                        issue_type="god_object",
                        severity="High",
                        module_name=node.name,
                        description=f"Module '{node.name}' acts as a God Object with {fi} afferent (incoming) and {fo} efferent (outgoing) couplings.",
                        metrics={"fan_in": fi, "fan_out": fo},
                        affected_modules=[node.name],
                        precise_fix=f"Extract helper modules and inject them into '{node.name}' using constructor injection.",
                        fix_steps=[
                            f"Identify functional boundaries within '{node.name}' (e.g. database access, gateway calls, layout calculations).",
                            "Extract these sub-responsibilities into small, stateless services.",
                            f"Refactor '{node.name}' to accept these helper services via constructor parameters, delegate functionality, and clean up direct imports.",
                        ],
                        before_state=f"Monolithic '{node.name}' owns multiple responsibilities, making it a hotspot for merge conflicts and regressions.",
                        after_state="A lightweight service delegating tasks to dedicated dependencies.",
                        estimated_effort="1–2 weeks",
                        expected_improvement="Reduces combined coupling factor by over 60%.",
                        confidence=0.92,
                        tags=["god-object", "coupling", "service-split"],
                    )
                )

        # ─── 3. Detect High Coupling (Efferent) ───
        # Criteria: node with fan_out >= 6 (excluding already matched God Objects)
        for node in nodes:
            fo = fan_out[node.id]
            fi = fan_in[node.id]
            # Avoid duplicating God Object issues
            if fo >= 6 and not (fi >= 6 and fo >= 5):
                issues.append(
                    CouplingIssue(
                        id=self._cid(),
                        issue_type="high_coupling",
                        severity="Medium",
                        module_name=node.name,
                        description=f"Module '{node.name}' has excessive outgoing coupling (fan-out: {fo}). Changes to any of its dependencies will ripple into this module.",
                        metrics={"fan_out": fo, "fan_in": fi},
                        affected_modules=[node.name],
                        precise_fix="Introduce a Facade interface or wrapper adapters to isolate 3rd-party/internal API calls.",
                        fix_steps=[
                            f"Audit the {fo} dependencies imported by '{node.name}'.",
                            "Extract adapter classes or a simplified Facade interface to group these integrations.",
                            f"Replace raw imports inside '{node.name}' with a single instance of the Facade interface.",
                        ],
                        before_state=f"'{node.name}' is highly sensitive to changes in {fo} external modules.",
                        after_state="Dependencies are routed through a single stable contract, shielding the business logic from downstream volatility.",
                        estimated_effort="2–4 days",
                        expected_improvement="Efferent coupling drops from 6+ down to 1.",
                        confidence=0.88,
                        tags=["high-coupling", "facade", "adapter"],
                    )
                )

        # ─── 4. Detect Large Modules ───
        # Criteria: file with LOC > 350 or cyclomatic complexity > 20
        for f in files:
            file_path = f.file_path.replace("\\", "/")
            basename = file_path.split("/")[-1]
            loc = f.code_lines or 0
            max_cc = 0
            if f.metrics and f.metrics.complexity_max:
                max_cc = f.metrics.complexity_max

            if loc > 350 or max_cc > 20:
                issues.append(
                    CouplingIssue(
                        id=self._cid(),
                        issue_type="large_module",
                        severity="Medium",
                        module_name=basename,
                        description=f"File '{basename}' is overly large or complex ({loc} LOC, max cyclomatic complexity {max_cc}).",
                        metrics={"loc": loc, "max_complexity": max_cc},
                        affected_modules=[basename],
                        precise_fix=f"Extract private logic branches and helper utilities out of '{basename}' into separate local files.",
                        fix_steps=[
                            f"Examine the functions in '{basename}' with the highest complexity scores.",
                            "Extract interchangeable branching blocks (e.g. switch statements) into separate helper functions or strategy classes.",
                            "Move these helper components into a local sub-folder and import them back into the main module.",
                        ],
                        before_state=f"Excessive file size and complexity in '{basename}' increases cognitive overhead and unit testing difficulty.",
                        after_state="A cleaner, streamlined entry file orchestrating small, easily testable sub-functions.",
                        estimated_effort="3–5 days",
                        expected_improvement=f"Reduces max complexity from {max_cc} to under 10; improves readability.",
                        confidence=0.90,
                        tags=["large-module", "complexity", "refactoring"],
                    )
                )

        # Sort issues by severity (Critical -> High -> Medium -> Low)
        severity_weight = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
        issues.sort(key=lambda x: -severity_weight.get(x.severity, 0))

        # Counts
        by_type = {
            "cyclic_dependency": 0,
            "god_object": 0,
            "high_coupling": 0,
            "large_module": 0,
        }
        for iss in issues:
            by_type[iss.issue_type] = by_type.get(iss.issue_type, 0) + 1

        # Calculate health score: 100 baseline, subtract penalty per issue
        penalty = sum(severity_weight.get(x.severity, 2) * 5 for x in issues)
        health_score = max(35.0, 100.0 - penalty)

        # Verdict
        if not issues:
            verdict = "The repository exhibits excellent coupling health and modular separation."
        else:
            criticals = by_type.get("cyclic_dependency", 0)
            gods = by_type.get("god_object", 0)
            if criticals > 0 or gods > 0:
                verdict = f"Critical coupling issues detected: {criticals} cyclic dependencies and {gods} God Objects are impeding scalability and test isolation."
            else:
                verdict = f"Coupling is moderate. Resolving {len(issues)} large modules or tightly coupled files will improve repository health."

        return CouplingReport(
            repo_id=repo_id,
            generated_at=datetime.utcnow(),
            issues=issues,
            total_issues=len(issues),
            coupling_health_score=round(health_score, 1),
            by_type=by_type,
            verdict=verdict,
        )
