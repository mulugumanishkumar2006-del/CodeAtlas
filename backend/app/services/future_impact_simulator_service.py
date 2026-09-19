import logging
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict
from typing import Dict, Any, List, Optional, Tuple, Set

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.simulation import Simulation
from backend.app.schemas.repository import (
    SimulationIntent,
    SimulationConsequences,
    SimulationBeforeAfterNode,
    SimulationBeforeAfterEdge,
    SimulationBeforeAfterModel,
    SimulationDetailResponse,
    SimulationListItem,
    SimulationListResponse,
    ImpactTargetItem,
)
from backend.app.services.impact_analysis_service import impact_service
from backend.app.services.architecture_intelligence_service import architecture_intelligence_service
from backend.app.services.technical_debt_service import technical_debt_service
from backend.app.services.risk_intelligence_service import risk_intelligence_service
from backend.app.services.time_machine_service import time_machine_service

logger = logging.getLogger("codeatlas.future_impact_simulator")


class FutureImpactSimulatorService:
    """
    Phase 22 — Future Impact Simulator Engine for CodeAtlas.
    
    Performs static impact reasoning against the repository to estimate the
    consequences of proposed code, architecture, or dependency changes.
    Strictly separates:
    - Known: Directly supported by static AST and dependency evidence.
    - Predicted: Potential consequences inferred from graph coupling and historical velocity.
    - Unknown: Blind spots that require runtime execution (reflection, external APIs).
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def invalidate_cache(self, repository_id: Optional[str] = None):
        if repository_id:
            self._cache.pop(repository_id, None)
        else:
            self._cache.clear()

    # =========================================================================
    # 1. NATURAL-LANGUAGE INTENT PARSER
    # =========================================================================

    def parse_simulation_intent(
        self,
        proposed_change: str,
        explicit_operation: Optional[str] = None,
        explicit_target: Optional[str] = None,
        explicit_target_type: Optional[str] = None,
    ) -> SimulationIntent:
        """
        Parses a natural-language or structured change proposal into a structured intent.
        If the intent is ambiguous or target is missing, requests clarification.
        """
        text = proposed_change.strip()
        text_lower = text.lower()

        # 1. Operation resolution
        operation = (explicit_operation or "").upper().strip()
        if not operation:
            if any(w in text_lower for w in ["rename", "call it", "name it", "change name to"]):
                operation = "RENAME"
            elif any(w in text_lower for w in ["remove", "delete", "drop", "eliminate"]):
                if any(w in text_lower for w in ["dependency", "package", "library"]):
                    operation = "DEPENDENCY_REMOVE"
                else:
                    operation = "REMOVE"
            elif any(w in text_lower for w in ["replace dependency", "swap dependency", "switch dependency", "replace package"]):
                operation = "DEPENDENCY_REPLACE"
            elif any(w in text_lower for w in ["signature", "parameter", "arguments", "args"]):
                operation = "SIGNATURE_CHANGE"
            elif any(w in text_lower for w in ["move", "relocate", "transfer"]):
                operation = "MOVE"
            elif any(w in text_lower for w in ["api", "endpoint", "route", "http method"]):
                operation = "API_CHANGE"
            elif any(w in text_lower for w in ["split module", "break down module", "decompose module"]):
                operation = "MODULE_SPLIT"
            elif any(w in text_lower for w in ["merge module", "combine module", "join module"]):
                operation = "MODULE_MERGE"
            elif any(w in text_lower for w in ["refactor", "modify", "change", "update", "rewrite"]):
                operation = "MODIFY"
            else:
                operation = "MODIFY"

        # 2. Target and parameters extraction
        target_identifier = explicit_target or ""
        target_type = (explicit_target_type or "FILE").upper()
        parameters: Dict[str, Any] = {}

        if not target_identifier:
            # Pattern matching for target and parameters
            # e.g., "rename X to Y"
            rename_match = re.search(r"rename\s+(?:function|class|symbol|file|module)?\s*([a-zA-Z0-9_\.\-\\/]+)\s+to\s+([a-zA-Z0-9_\.\-\\/]+)", text, re.I)
            if rename_match:
                target_identifier = rename_match.group(1).strip()
                parameters["new_name"] = rename_match.group(2).strip()
                operation = "RENAME"

            # e.g., "remove X" / "delete X"
            remove_match = re.search(r"(?:remove|delete|drop)\s+(?:function|class|symbol|file|module|package|dependency)?\s*([a-zA-Z0-9_\.\-\\/]+)", text, re.I)
            if remove_match and not target_identifier:
                target_identifier = remove_match.group(1).strip()

            # e.g., "move X to Y"
            move_match = re.search(r"move\s+(?:file|module|component)?\s*([a-zA-Z0-9_\.\-\\/]+)\s+to\s+([a-zA-Z0-9_\.\-\\/]+)", text, re.I)
            if move_match and not target_identifier:
                target_identifier = move_match.group(1).strip()
                parameters["new_path"] = move_match.group(2).strip()
                operation = "MOVE"

            # e.g., "replace X with Y"
            replace_match = re.search(r"replace\s+(?:dependency|package)?\s*([a-zA-Z0-9_\.\-]+)\s+with\s+([a-zA-Z0-9_\.\-]+)", text, re.I)
            if replace_match and not target_identifier:
                target_identifier = replace_match.group(1).strip()
                parameters["replacement"] = replace_match.group(2).strip()
                operation = "DEPENDENCY_REPLACE"

            # e.g., "what happens if I change X"
            change_match = re.search(r"(?:change|modify|refactor|update)\s+(?:function|class|file|symbol|module)?\s*([a-zA-Z0-9_\.\-\\/]+)", text, re.I)
            if change_match and not target_identifier:
                target_identifier = change_match.group(1).strip()

        # Clean punctuation from target_identifier
        target_identifier = target_identifier.rstrip("?.,!;:").strip("'\"`")

        # Detect target type heuristically if not explicit
        if not explicit_target_type and target_identifier:
            if any(target_identifier.endswith(ext) for ext in [".py", ".ts", ".js", ".tsx", ".jsx", ".go", ".java", ".rs"]):
                target_type = "FILE"
            elif "/" in target_identifier or "\\" in target_identifier:
                target_type = "FILE"
            elif target_identifier.startswith(("/", "api/", "/api")):
                target_type = "API"
            elif operation in ["DEPENDENCY_REMOVE", "DEPENDENCY_REPLACE"]:
                target_type = "DEPENDENCY"
            elif target_identifier[0].isupper() and "." not in target_identifier:
                target_type = "CLASS"
            else:
                target_type = "FUNCTION"

        # Check for ambiguity
        ambiguous_pronouns = {"it", "this", "that", "something", "everything", "code", "thing", "stuff"}
        if not target_identifier or len(target_identifier) < 2 or target_identifier.lower() in ambiguous_pronouns:
            return SimulationIntent(
                operation=operation,
                target_type=target_type,
                target_identifier="",
                parameters=parameters,
                requires_clarification=True,
                clarification_prompt=(
                    "Could not determine the target repository entity from your proposal. "
                    "Please specify the function, class, file, module, or dependency you want to simulate changing "
                    "(e.g., 'What happens if I remove UserService.authenticate?' or 'What if I rename billing.py?')."
                ),
            )

        return SimulationIntent(
            operation=operation,
            target_type=target_type,
            target_identifier=target_identifier,
            parameters=parameters,
            requires_clarification=False,
        )

    # =========================================================================
    # 2. STATIC SIMULATION REASONING ENGINE
    # =========================================================================

    async def run_simulation(
        self,
        db: AsyncSession,
        repository_id: str,
        proposed_change: str,
        explicit_operation: Optional[str] = None,
        explicit_target_id: Optional[str] = None,
        explicit_target_type: Optional[str] = None,
        parameters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Executes static impact simulation reasoning for a proposed repository change.
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        # 1. Parse Simulation Intent
        intent = self.parse_simulation_intent(
            proposed_change=proposed_change,
            explicit_operation=explicit_operation,
            explicit_target=explicit_target_id,
            explicit_target_type=explicit_target_type,
        )

        if parameters:
            intent.parameters.update(parameters)

        if intent.requires_clarification:
            return {
                "id": f"sim-clarify-{uuid.uuid4().hex[:8]}",
                "repository_id": repository_id,
                "name": f"Simulation Clarification: {proposed_change[:40]}",
                "status": "requires_clarification",
                "proposed_change": proposed_change,
                "operation": intent.operation,
                "confidence": "LOW",
                "target": None,
                "direct_impact": {},
                "indirect_impact": {},
                "architecture_impact": {},
                "risk_impact": {},
                "historical_evidence": {},
                "test_impact": {},
                "dependency_impact": {},
                "consequences": {
                    "known": [],
                    "predicted": [],
                    "unknown": [intent.clarification_prompt or "Unclear change proposal target."],
                },
                "recommended_validation": [
                    "Specify exact target entity before proceeding with simulation."
                ],
                "before_after": None,
                "graph": None,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }

        # 2. Target Resolution (Phase 19)
        target = await impact_service.resolve_target(
            db=db,
            repository_id=repository_id,
            target_id=intent.target_identifier,
            target_type=intent.target_type,
        )

        if not target:
            # Check files and symbols explicitly
            target = await self._fallback_resolve_target(db, repository_id, intent.target_identifier, intent.target_type)

        if not target:
            raise ValueError(
                f"Could not resolve target '{intent.target_identifier}' ({intent.target_type}) in repository '{repository_id}'."
            )

        # 3. Comprehensive Impact Analysis (Phase 19)
        impact_analysis = await impact_service.calculate_impact(
            db=db,
            repository_id=repository_id,
            target_identifier=target.target_id or target.name,
            target_type=target.target_type,
            max_depth=3,
        )

        # 4. Architecture Consequence Analysis (Phase 11 & Phase 19)
        arch_intel = await architecture_intelligence_service.get_advanced_architecture_intelligence(
            repository_id=repository_id, db=db
        )
        module_metrics = arch_intel.get("coupling", {}).get("module_metrics", [])
        coupling_by_mod = {m["module"]: m for m in module_metrics}

        # 5. Technical Debt & Risk Propagation (Phase 21)
        entity_risk = await risk_intelligence_service.get_entity_risk(
            db=db,
            repository_id=repository_id,
            entity_type=target.target_type,
            entity_id=target.file_path or target.name,
        )
        repo_risk = await risk_intelligence_service.analyze_repository_risk(db, repository_id)
        hotspots = repo_risk.get("hotspots", [])
        is_hotspot = any(h["file_path"] == target.file_path for h in hotspots if target.file_path)

        # 6. Historical Evolution Evidence (Phase 20)
        historical_ev: Dict[str, Any] = {"status": "INSUFFICIENT_DATA", "commits_count": 0, "churn": 0, "previous_changes": []}
        if target.file_path:
            try:
                file_history = await time_machine_service.get_file_evolution(
                    db=db, repository_id=repository_id, file_identifier=target.file_path
                )
                if file_history.get("commit_count", 0) > 0:
                    historical_ev = {
                        "status": "AVAILABLE",
                        "commits_count": file_history.get("commit_count", 0),
                        "churn": file_history.get("churn", 0),
                        "authors": file_history.get("authors", []),
                        "last_modified": file_history.get("last_modified_at"),
                        "was_renamed": file_history.get("was_renamed", False),
                        "previous_names": file_history.get("previous_paths", []),
                    }
            except Exception:
                historical_ev = {"status": "INSUFFICIENT_DATA", "message": "Insufficient historical evidence"}

        # 7. Triad Categorization (Known, Predicted, Unknown)
        known_consequences: List[str] = []
        predicted_consequences: List[str] = []
        unknown_consequences: List[str] = []

        direct_callers = impact_analysis.callers or []
        direct_dependents = impact_analysis.direct_dependents or []
        indirect_dependents = impact_analysis.transitive_dependents or []
        affected_files = impact_analysis.affected_files or []
        affected_tests = impact_analysis.affected_tests or []
        affected_apis = impact_analysis.affected_apis or []
        boundary_crossings = impact_analysis.boundaries_crossed or []

        op = intent.operation

        # Operation-specific reasoning
        if op == "REMOVE":
            known_consequences.append(
                f"Deleting '{target.name}' immediately breaks {len(direct_callers)} direct call-sites and {len(direct_dependents)} direct dependent entities."
            )
            for c in direct_callers[:3]:
                known_consequences.append(f"Call site in '{c.file_path}' (L{c.line_number or 1}): '{c.call_expression or c.name}' will raise NameError/ImportError.")

            if indirect_dependents:
                predicted_consequences.append(
                    f"Transitively orphans {len(indirect_dependents)} downstream components across {len(affected_files)} files."
                )

            if affected_apis:
                predicted_consequences.append(
                    f"Potentially breaks {len(affected_apis)} exposed API endpoints ({', '.join(a.path for a in affected_apis[:2])})."
                )

        elif op == "RENAME":
            new_n = intent.parameters.get("new_name", "NEW_NAME")
            known_consequences.append(
                f"Renaming '{target.name}' to '{new_n}' requires updating {len(direct_callers)} direct call sites and import statements."
            )
            for c in direct_callers[:3]:
                known_consequences.append(f"Reference in '{c.file_path}' (L{c.line_number or 1}) must be updated from '{target.name}' to '{new_n}'.")

            predicted_consequences.append(
                f"Low structural risk if all {len(direct_callers)} call sites and {len(direct_dependents)} references are refactored atomically."
            )

        elif op == "SIGNATURE_CHANGE":
            known_consequences.append(
                f"Changing the parameter signature of '{target.name}' directly affects {len(direct_callers)} call sites."
            )
            for c in direct_callers[:3]:
                known_consequences.append(f"Call expression in '{c.file_path}' L{c.line_number or 1} ({c.call_expression or c.name}) must be updated.")

            predicted_consequences.append(
                f"High potential for subtle runtime TypeError if arguments are mismatched or optional defaults are altered."
            )

        elif op == "MOVE":
            new_p = intent.parameters.get("new_path", "NEW_PATH")
            known_consequences.append(
                f"Moving '{target.name}' to '{new_p}' invalidates {len(direct_dependents)} import statements in {len(affected_files)} files."
            )
            if boundary_crossings:
                predicted_consequences.append(
                    f"Crosses {len(boundary_crossings)} architectural boundaries ({boundary_crossings[0].source_layer} -> {boundary_crossings[0].target_layer})."
                )

        elif op in ["DEPENDENCY_REMOVE", "DEPENDENCY_REPLACE"]:
            repl = intent.parameters.get("replacement")
            if op == "DEPENDENCY_REPLACE" and repl:
                known_consequences.append(
                    f"Replacing package '{target.name}' with '{repl}' affects {len(affected_files)} files that directly import '{target.name}'."
                )
                predicted_consequences.append(
                    f"API incompatibility between '{target.name}' and '{repl}' may require adapter layers or signature updates."
                )
            else:
                known_consequences.append(
                    f"Removing dependency '{target.name}' breaks imports across {len(affected_files)} files."
                )

        else:  # MODIFY
            known_consequences.append(
                f"Modifying '{target.name}' directly impacts {len(direct_dependents)} components and {len(direct_callers)} callers."
            )
            if is_hotspot:
                predicted_consequences.append(
                    f"Target is ranked as an Engineering Hotspot. Modifications carry elevated change-risk and regression velocity."
                )

        # General architecture & risk predictions
        if entity_risk.get("risk_level") in ["CRITICAL", "HIGH"]:
            predicted_consequences.append(
                f"Target entity holds {entity_risk.get('risk_level')} risk (score {entity_risk.get('risk_score')}/100); changes propagate across {len(affected_files)} dependent files."
            )

        if affected_tests:
            known_consequences.append(
                f"{len(affected_tests)} automated test suites directly cover or import the target ({', '.join(t.test_file for t in affected_tests[:3])})."
            )
        else:
            unknown_consequences.append(
                "No automated test coverage found for target entity. Regressions cannot be caught by existing test suite."
            )

        # Epistemic unknowns (No False Certainty)
        unknown_consequences.append(
            "Runtime dynamic dispatch (e.g. getattr, reflection, dictionary dispatch) cannot be verified statically."
        )
        unknown_consequences.append(
            "External consumers, third-party microservices, and unindexed clients cannot be determined without runtime monitoring."
        )
        if historical_ev.get("status") == "INSUFFICIENT_DATA":
            unknown_consequences.append(
                "Insufficient historical commit evidence to verify previous defect patterns or regression frequency."
            )

        # 8. Confidence Calculation
        confidence = "HIGH"
        if not affected_tests or impact_analysis.uncertainty:
            confidence = "MEDIUM"
        if len(unknown_consequences) > 3 or not target.file_path:
            confidence = "LOW"

        # 9. Recommended Validation Checklist
        validation_checklist: List[str] = []
        if affected_tests:
            for t in affected_tests[:3]:
                validation_checklist.append(f"Execute test suite: {t.test_file}")
        else:
            validation_checklist.append(f"Author new unit tests covering '{target.name}' before executing changes.")

        if affected_apis:
            for a in affected_apis[:2]:
                validation_checklist.append(f"Smoke test API route: {a.method} {a.path}")

        if op in ["RENAME", "SIGNATURE_CHANGE"]:
            validation_checklist.append(f"Verify all {len(direct_callers)} call sites via static type checker (e.g. mypy/tsc).")

        validation_checklist.append("Run full repository regression test suite prior to pull request merge.")

        # 10. Construct Before / After Hypothetical Model
        before_after = self._construct_before_after_model(
            target=target,
            operation=op,
            callers=direct_callers,
            dependents=direct_dependents,
            parameters=intent.parameters,
        )

        # 11. Visual Simulation Graph
        graph = self._construct_simulation_graph(
            target=target,
            operation=op,
            impact=impact_analysis,
            is_hotspot=is_hotspot,
        )

        # Structure final simulation report
        report_name = f"Simulate {op} on {target.name}"
        sim_id = f"sim-{uuid.uuid4().hex[:12]}"

        result_payload = {
            "id": sim_id,
            "repository_id": repository_id,
            "name": report_name,
            "status": "completed",
            "proposed_change": proposed_change,
            "operation": op,
            "confidence": confidence,
            "target": target.model_dump() if hasattr(target, "model_dump") else target.dict(),
            "direct_impact": {
                "callers_count": len(direct_callers),
                "dependents_count": len(direct_dependents),
                "affected_files_count": len(affected_files),
                "direct_callers": [c.model_dump() if hasattr(c, "model_dump") else c.dict() for c in direct_callers[:15]],
                "direct_dependents": [d.model_dump() if hasattr(d, "model_dump") else d.dict() for d in direct_dependents[:15]],
            },
            "indirect_impact": {
                "indirect_dependents_count": len(indirect_dependents),
                "blast_radius": len(affected_files) + len(indirect_dependents),
                "indirect_dependents": [d.model_dump() if hasattr(d, "model_dump") else d.dict() for d in indirect_dependents[:15]],
            },
            "architecture_impact": {
                "boundary_crossings_count": len(boundary_crossings),
                "boundaries": [b.model_dump() if hasattr(b, "model_dump") else b.dict() for b in boundary_crossings[:5]],
                "coupling_metrics": coupling_by_mod.get(target.file_path or target.name, {}),
            },
            "risk_impact": {
                "entity_risk_score": entity_risk.get("risk_score", 0),
                "entity_risk_level": entity_risk.get("risk_level", "LOW"),
                "is_hotspot": is_hotspot,
                "signals": entity_risk.get("signals", []),
            },
            "historical_evidence": historical_ev,
            "test_impact": {
                "affected_tests_count": len(affected_tests),
                "tests": [t.model_dump() if hasattr(t, "model_dump") else t.dict() for t in affected_tests[:10]],
            },
            "dependency_impact": {
                "affected_apis_count": len(affected_apis),
                "apis": [a.model_dump() if hasattr(a, "model_dump") else a.dict() for a in affected_apis[:10]],
            },
            "consequences": {
                "known": known_consequences,
                "predicted": predicted_consequences,
                "unknown": unknown_consequences,
            },
            "recommended_validation": validation_checklist,
            "before_after": before_after.model_dump() if hasattr(before_after, "model_dump") else before_after.dict(),
            "graph": graph,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        return result_payload

    # =========================================================================
    # 3. BEFORE / AFTER STRUCTURAL MODEL CONSTRUCTOR
    # =========================================================================

    def _construct_before_after_model(
        self,
        target: ImpactTargetItem,
        operation: str,
        callers: List[Any],
        dependents: List[Any],
        parameters: Dict[str, Any],
    ) -> SimulationBeforeAfterModel:
        """Constructs current state vs simulated state comparison model."""
        target_node_id = f"node:{target.target_id or target.name}"
        target_label = target.name

        current_nodes = [
            SimulationBeforeAfterNode(id=target_node_id, label=target_label, node_type=target.target_type, status="UNCHANGED")
        ]
        current_edges = []

        simulated_nodes = []
        simulated_edges = []

        # Target node simulation status
        if operation == "REMOVE":
            sim_target_status = "REMOVED"
        elif operation == "RENAME":
            sim_target_status = "MODIFIED"
            target_label = parameters.get("new_name", target.name)
        elif operation == "MOVE":
            sim_target_status = "REDIRECTED"
            target_label = parameters.get("new_path", target.name)
        else:
            sim_target_status = "MODIFIED"

        simulated_nodes.append(
            SimulationBeforeAfterNode(id=target_node_id, label=target_label, node_type=target.target_type, status=sim_target_status)
        )

        for idx, c in enumerate(callers[:8]):
            c_name = getattr(c, "name", str(c))
            c_file = getattr(c, "file_path", "")
            c_id = f"caller:{c_file}:{c_name}_{idx}"

            c_node = SimulationBeforeAfterNode(id=c_id, label=c_name, node_type="CALLER", status="UNCHANGED")
            current_nodes.append(c_node)
            current_edges.append(SimulationBeforeAfterEdge(source=c_id, target=target_node_id, relationship="CALLS", status="ACTIVE"))

            sim_c_status = "MODIFIED" if operation in ["RENAME", "SIGNATURE_CHANGE"] else ("UNCHANGED" if operation != "REMOVE" else "BROKEN")
            simulated_nodes.append(SimulationBeforeAfterNode(id=c_id, label=c_name, node_type="CALLER", status=sim_c_status))

            edge_status = "BROKEN" if operation == "REMOVE" else ("REDIRECTED" if operation == "RENAME" else "ACTIVE")
            simulated_edges.append(SimulationBeforeAfterEdge(source=c_id, target=target_node_id, relationship="CALLS", status=edge_status))

        summary = (
            f"Simulated {operation} on '{target.name}'. "
            f"{len(callers)} call paths will be {('severed' if operation == 'REMOVE' else 'redirected')}."
        )

        return SimulationBeforeAfterModel(
            current_nodes=current_nodes,
            current_edges=current_edges,
            simulated_nodes=simulated_nodes,
            simulated_edges=simulated_edges,
            structural_diff_summary=summary,
        )

    # =========================================================================
    # 4. VISUAL SIMULATION GRAPH CONSTRUCTOR
    # =========================================================================

    def _construct_simulation_graph(
        self,
        target: ImpactTargetItem,
        operation: str,
        impact: Any,
        is_hotspot: bool,
    ) -> Dict[str, Any]:
        """Constructs visual graph representation with target, callers, dependents, and tests."""
        nodes = []
        edges = []

        # Target node
        tgt_id = f"sim-tgt:{target.target_id or target.name}"
        nodes.append({
            "id": tgt_id,
            "label": target.name,
            "type": "target",
            "operation": operation,
            "is_hotspot": is_hotspot,
            "file_path": target.file_path,
        })

        # Direct callers
        for c in (impact.callers or [])[:10]:
            cid = f"sim-caller:{c.file_path}:{c.name}"
            nodes.append({
                "id": cid,
                "label": f"{c.name}()",
                "type": "caller",
                "file_path": c.file_path,
                "line": c.line_number,
            })
            edges.append({
                "source": cid,
                "target": tgt_id,
                "label": "CALLS",
                "status": "BROKEN" if operation == "REMOVE" else "AFFECTED",
            })

        # Affected tests
        for t in (impact.affected_tests or [])[:6]:
            tid = f"sim-test:{t.test_file}"
            nodes.append({
                "id": tid,
                "label": Path(t.test_file).name,
                "type": "test",
                "file_path": t.test_file,
            })
            edges.append({
                "source": tid,
                "target": tgt_id,
                "label": "VERIFIES",
                "status": "REQUIRES_UPDATE",
            })

        # Affected APIs
        for a in (impact.affected_apis or [])[:5]:
            aid = f"sim-api:{a.method}:{a.path}"
            nodes.append({
                "id": aid,
                "label": f"{a.method} {a.path}",
                "type": "api",
                "file_path": a.file_path,
            })
            edges.append({
                "source": aid,
                "target": tgt_id,
                "label": "EXPOSES",
                "status": "BROKEN" if operation == "REMOVE" else "AFFECTED",
            })

        return {"nodes": nodes, "edges": edges}

    # =========================================================================
    # 5. FALLBACK TARGET RESOLVER
    # =========================================================================

    async def _fallback_resolve_target(
        self, db: AsyncSession, repository_id: str, target_identifier: str, target_type: str
    ) -> Optional[ImpactTargetItem]:
        """Resolves target by case-insensitive matching against File or Symbol records."""
        clean = target_identifier.strip().lower()

        # Try File
        files_stmt = select(File).where(File.repository_id == repository_id)
        f_res = await db.execute(files_stmt)
        files = f_res.scalars().all()
        for f in files:
            if clean in f.path.lower() or Path(f.path).stem.lower() == clean:
                return ImpactTargetItem(
                    id=f.id,
                    repository_id=repository_id,
                    target_type="FILE",
                    target_id=f.id,
                    name=f.path,
                    file_id=f.id,
                    file_path=f.path,
                    start_line=1,
                    end_line=f.line_count,
                )

        # Try Symbol
        syms_stmt = select(Symbol).where(Symbol.repository_id == repository_id)
        s_res = await db.execute(syms_stmt)
        symbols = s_res.scalars().all()
        for s in symbols:
            if clean == s.name.lower() or clean == (s.qualified_name or "").lower():
                return ImpactTargetItem(
                    id=s.id,
                    repository_id=repository_id,
                    target_type="SYMBOL",
                    target_id=s.id,
                    name=s.name,
                    file_id=s.file_id,
                    symbol_id=s.id,
                    qualified_name=s.qualified_name,
                    start_line=s.start_line,
                    end_line=s.end_line,
                )

        return None

    # =========================================================================
    # 6. PERSISTENCE & SIMULATION HISTORY
    # =========================================================================

    async def create_and_save_simulation(
        self,
        db: AsyncSession,
        repository_id: str,
        proposed_change: str,
        operation: Optional[str] = None,
        target_id: Optional[str] = None,
        target_type: Optional[str] = None,
        parameters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Runs static simulation and persists result into the database."""
        result = await self.run_simulation(
            db=db,
            repository_id=repository_id,
            proposed_change=proposed_change,
            explicit_operation=operation,
            explicit_target_id=target_id,
            explicit_target_type=target_type,
            parameters=parameters,
        )

        sim_record = Simulation(
            id=result["id"],
            repository_id=repository_id,
            name=result["name"],
            simulation_type=result["operation"],
            status=result["status"],
            parameters={
                "proposed_change": proposed_change,
                "operation": operation,
                "target_id": target_id,
                "target_type": target_type,
                "parameters": parameters,
            },
            results=result,
        )
        db.add(sim_record)
        await db.commit()
        await db.refresh(sim_record)

        return result

    async def list_simulations(
        self, db: AsyncSession, repository_id: str
    ) -> List[SimulationListItem]:
        """Lists past simulations scoped strictly to repository_id."""
        stmt = (
            select(Simulation)
            .where(Simulation.repository_id == repository_id)
            .order_by(Simulation.created_at.desc())
        )
        res = await db.execute(stmt)
        records = res.scalars().all()

        items = []
        for r in records:
            res_dict = r.results or {}
            params = r.parameters or {}
            target_dict = res_dict.get("target") or {}
            direct = res_dict.get("direct_impact") or {}

            items.append(
                SimulationListItem(
                    id=r.id,
                    repository_id=r.repository_id,
                    name=r.name,
                    simulation_type=r.simulation_type,
                    status=r.status,
                    proposed_change=params.get("proposed_change") or r.name,
                    target_name=target_dict.get("name"),
                    confidence=res_dict.get("confidence", "MEDIUM"),
                    affected_files_count=direct.get("affected_files_count", 0),
                    created_at=r.created_at.isoformat() if r.created_at else None,
                )
            )

        return items

    async def get_simulation(
        self, db: AsyncSession, repository_id: str, simulation_id: str
    ) -> Optional[Dict[str, Any]]:
        """Retrieves a persisted simulation with repository isolation."""
        stmt = select(Simulation).where(
            Simulation.repository_id == repository_id,
            Simulation.id == simulation_id,
        )
        res = await db.execute(stmt)
        record = res.scalars().first()
        if not record or not record.results:
            return None

        return record.results

    async def delete_simulation(
        self, db: AsyncSession, repository_id: str, simulation_id: str
    ) -> bool:
        """Deletes a simulation record scoped to repository_id."""
        stmt = select(Simulation).where(
            Simulation.repository_id == repository_id,
            Simulation.id == simulation_id,
        )
        res = await db.execute(stmt)
        record = res.scalars().first()
        if not record:
            return False

        await db.delete(record)
        await db.commit()
        return True


future_impact_simulator_service = FutureImpactSimulatorService()
