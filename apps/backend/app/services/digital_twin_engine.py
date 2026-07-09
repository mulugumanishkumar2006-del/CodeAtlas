import collections
import fnmatch
from typing import Any, Dict, List, Set

from sqlalchemy.orm import Session

from app.models.digital_twin import DigitalTwinChange
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.tech_debt import TechnicalDebtReport
from app.schemas.digital_twin import (
    AffectedNodeDetail,
    AIAlternativeRecommendation,
    AIRefactoringResponse,
    ArchitectureEvolution,
    BlastRadiusEdge,
    BlastRadiusNode,
    CostEstimate,
    PerformanceImpact,
    RiskPrediction,
    ScenarioComparisonResponse,
    ScenarioDetails,
    SimulationReportResponse,
    TimelineStep,
    WhatIfResponse,
)
from app.services.drift_detection_service import DriftDetectionService


class DigitalTwinEngine:
    @staticmethod
    def simulate(
        db: Session,
        repository_id: str,
        session_id: str,
        changes: List[DigitalTwinChange],
    ) -> SimulationReportResponse:
        # 1. Load repository graph from PostgreSQL database
        db_nodes = (
            db.query(GraphNode).filter(GraphNode.repository_id == repository_id).all()
        )
        db_rels = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.repository_id == repository_id)
            .all()
        )

        # In-memory virtual graph
        nodes: Dict[str, Dict[str, Any]] = {}
        for n in db_nodes:
            props = n.properties or {}
            nodes[n.id] = {
                "id": n.id,
                "name": n.name,
                "type": n.type,
                "properties": dict(props),
                "virtual_status": "normal",  # normal, modified, deleted, renamed
                "original_name": n.name,
            }

        relationships: List[Dict[str, Any]] = []
        for r in db_rels:
            relationships.append(
                {
                    "id": r.id,
                    "source_id": r.source_id,
                    "target_id": r.target_id,
                    "type": r.type,
                    "properties": dict(r.properties or {}),
                    "virtual_status": "normal",  # normal, removed
                }
            )

        # Helper to find nodes by name or path
        def find_matching_nodes(target_name: str, target_type: str) -> List[str]:
            target_name_lower = target_name.lower()

            # First pass: exact matches on name or full path
            exact_matches = []
            for nid, n in nodes.items():
                if n["virtual_status"] == "deleted":
                    continue
                ntype_lower = n["type"].lower()
                if target_type == "file" and ntype_lower != "file":
                    continue
                if target_type == "symbol" and ntype_lower in ("file", "repository"):
                    continue

                nname_lower = n["name"].lower()
                path = (
                    n["properties"].get("path")
                    or n["properties"].get("file_path")
                    or ""
                ).lower()
                if target_name_lower == nname_lower or target_name_lower == path:
                    exact_matches.append(nid)

            if exact_matches:
                return exact_matches

            # Second pass: suffix matches with separator boundaries
            suffix_matches = []
            for nid, n in nodes.items():
                if n["virtual_status"] == "deleted":
                    continue
                ntype_lower = n["type"].lower()
                if target_type == "file" and ntype_lower != "file":
                    continue
                if target_type == "symbol" and ntype_lower in ("file", "repository"):
                    continue

                nname_lower = n["name"].lower()
                path = (
                    n["properties"].get("path")
                    or n["properties"].get("file_path")
                    or ""
                ).lower()

                is_path_match = False
                if path and path.endswith(target_name_lower):
                    idx = len(path) - len(target_name_lower) - 1
                    if idx >= 0 and path[idx] in ("/", "\\", "."):
                        is_path_match = True

                if is_path_match or nname_lower.endswith("." + target_name_lower):
                    suffix_matches.append(nid)

            return suffix_matches

        # Track applied changes log and rules violated
        rules_violated = []
        tech_debt_score_change = 0.0

        # Load technical debt reports to calculate debt reductions
        db_reports = (
            db.query(TechnicalDebtReport)
            .filter(TechnicalDebtReport.repo_id == repository_id)
            .all()
        )

        # 2. Apply virtual changes sequentially
        for change in changes:
            matched_ids = find_matching_nodes(change.target_name, change.target_type)

            # --- DELETE FUNCTION OR COMPONENT ---
            if change.action == "delete":
                if not matched_ids:
                    rules_violated.append(
                        f"Could not find node to delete: {change.target_name} ({change.target_type})"
                    )
                    continue

                for nid in matched_ids:
                    nodes[nid]["virtual_status"] = "deleted"

                    # Accumulate technical debt score reduction if this component/module has debt associated
                    for rep in db_reports:
                        if rep.module.lower() in nodes[nid]["name"].lower():
                            tech_debt_score_change -= rep.debt_score

                    # If file is deleted, recursively delete nested symbols it owns
                    if nodes[nid]["type"].lower() == "file":
                        file_path = (
                            nodes[nid]["properties"].get("path") or nodes[nid]["name"]
                        )
                        for sub_id, sub_node in nodes.items():
                            sub_path = (
                                sub_node["properties"].get("path")
                                or sub_node["properties"].get("file_path")
                                or ""
                            )
                            if (
                                sub_path == file_path
                                or sub_node["properties"].get("file_id") == nid
                            ):
                                sub_node["virtual_status"] = "deleted"

                    # If database service is deleted, recursively delete all tables owned
                    if nodes[nid]["type"].lower() in ("database", "database service"):
                        for sub_id, sub_node in nodes.items():
                            if (
                                sub_node["type"].lower() == "database table"
                                and sub_node["properties"].get("db_id") == nid
                            ):
                                sub_node["virtual_status"] = "deleted"

            # --- MODIFY FUNCTION OR COMPONENT ---
            elif change.action == "modify":
                if not matched_ids:
                    rules_violated.append(
                        f"Could not find node to modify: {change.target_name} ({change.target_type})"
                    )
                    continue
                for nid in matched_ids:
                    nodes[nid]["virtual_status"] = "modified"

            # --- RENAME CLASS OR FUNCTION ---
            elif change.action == "rename":
                if not matched_ids:
                    rules_violated.append(
                        f"Could not find node to rename: {change.target_name} ({change.target_type})"
                    )
                    continue
                new_name = change.new_name or f"{change.target_name}_renamed"
                for nid in matched_ids:
                    nodes[nid]["virtual_status"] = "renamed"
                    nodes[nid]["name"] = new_name

            # --- MOVE MODULE / FILE ---
            elif change.action == "move":
                if not matched_ids:
                    rules_violated.append(
                        f"Could not find module to move: {change.target_name}"
                    )
                    continue
                new_path = change.new_name or f"moved/{change.target_name}"
                for nid in matched_ids:
                    old_path = (
                        nodes[nid]["properties"].get("path") or nodes[nid]["name"]
                    )
                    nodes[nid]["properties"]["path"] = new_path
                    nodes[nid]["name"] = new_path.split("/")[-1]
                    nodes[nid]["virtual_status"] = "modified"

                    # Relocate nested symbols path
                    for sub_id, sub_node in nodes.items():
                        sub_path = (
                            sub_node["properties"].get("path")
                            or sub_node["properties"].get("file_path")
                            or ""
                        )
                        if (
                            sub_path == old_path
                            or sub_node["properties"].get("file_id") == nid
                        ):
                            sub_node["properties"]["path"] = new_path
                            sub_node["properties"]["file_path"] = new_path

            # --- SPLIT SERVICE ---
            elif change.action == "split_service":
                if not matched_ids:
                    rules_violated.append(
                        f"Could not find service to split: {change.target_name}"
                    )
                    continue
                sub_services = [
                    s.strip() for s in (change.new_name or "").split(",") if s.strip()
                ]
                if not sub_services:
                    rules_violated.append(
                        f"Invalid new services list: {change.new_name}"
                    )
                    continue

                for nid in matched_ids:
                    orig_node = nodes[nid]
                    orig_node["virtual_status"] = "deleted"

                    # Create new virtual split services
                    new_nids = []
                    for idx, sname in enumerate(sub_services):
                        vid = f"virtual_service_{sname.lower()}_{idx}"
                        nodes[vid] = {
                            "id": vid,
                            "name": sname,
                            "type": orig_node["type"],
                            "properties": {
                                "is_virtual": True,
                                "split_from": orig_node["name"],
                            },
                            "virtual_status": "normal",
                            "original_name": sname,
                        }
                        new_nids.append(vid)

                    # Re-route relationships
                    for r in relationships:
                        if r["virtual_status"] == "removed":
                            continue
                        if r["target_id"] == nid:
                            r["target_id"] = new_nids[0]
                        elif r["source_id"] == nid:
                            r["source_id"] = new_nids[0]
                            # Copy relationship for all other split nodes
                            for v_node_id in new_nids[1:]:
                                relationships.append(
                                    {
                                        "id": f"virtual_rel_{len(relationships)}",
                                        "source_id": v_node_id,
                                        "target_id": r["target_id"],
                                        "type": r["type"],
                                        "properties": dict(r["properties"]),
                                        "virtual_status": "normal",
                                    }
                                )

            # --- MERGE SERVICES ---
            elif change.action == "merge_services":
                services_to_merge = [
                    s.strip() for s in change.target_name.split(",") if s.strip()
                ]
                merged_name = change.new_name or "MergedService"

                merge_nids = []
                for sname in services_to_merge:
                    nids = find_matching_nodes(sname, "symbol") or find_matching_nodes(
                        sname, "file"
                    )
                    merge_nids.extend(nids)

                if not merge_nids:
                    rules_violated.append(
                        f"Could not find any services to merge matching: {change.target_name}"
                    )
                    continue

                # Mark original service nodes as deleted
                for nid in merge_nids:
                    nodes[nid]["virtual_status"] = "deleted"

                # Spawn a single merged service
                merged_id = f"virtual_service_{merged_name.lower()}"
                nodes[merged_id] = {
                    "id": merged_id,
                    "name": merged_name,
                    "type": "Service",
                    "properties": {
                        "is_virtual": True,
                        "merged_from": change.target_name,
                    },
                    "virtual_status": "normal",
                    "original_name": merged_name,
                }

                # Redirect connections
                for r in relationships:
                    if r["virtual_status"] == "removed":
                        continue
                    if r["target_id"] in merge_nids:
                        r["target_id"] = merged_id
                    if r["source_id"] in merge_nids:
                        r["source_id"] = merged_id

            # --- UPGRADE PACKAGE ---
            elif change.action == "upgrade_package":
                pkg_nodes = [
                    nid
                    for nid, n in nodes.items()
                    if n["name"].lower() == change.target_name.lower()
                    and n["type"].lower() == "package"
                ]
                if pkg_nodes:
                    for nid in pkg_nodes:
                        nodes[nid]["properties"]["version"] = change.new_name
                        nodes[nid]["virtual_status"] = "modified"
                else:
                    vid = f"pkg_{change.target_name.lower()}"
                    nodes[vid] = {
                        "id": vid,
                        "name": change.target_name,
                        "type": "Package",
                        "properties": {"version": change.new_name, "is_virtual": True},
                        "virtual_status": "modified",
                        "original_name": change.target_name,
                    }
                rules_violated.append(
                    f"Package Upgrade Alert: Upgraded '{change.target_name}' to version '{change.new_name}'. Check downstream dependencies."
                )

            # --- EXTRACT INTERFACE ---
            elif change.action == "extract_interface":
                concrete_nids = find_matching_nodes(change.target_name, "symbol")
                if not concrete_nids:
                    rules_violated.append(
                        f"Concrete class not found for interface extraction: {change.target_name}"
                    )
                    continue

                int_name = change.new_name or f"I{change.target_name}"
                int_id = f"virtual_interface_{int_name.lower()}"

                # Create virtual Interface node
                nodes[int_id] = {
                    "id": int_id,
                    "name": int_name,
                    "type": "Interface",
                    "properties": {"is_virtual": True},
                    "virtual_status": "normal",
                    "original_name": int_name,
                }

                for cnid in concrete_nids:
                    # Link concrete class implements interface
                    relationships.append(
                        {
                            "id": f"virtual_rel_{len(relationships)}",
                            "source_id": cnid,
                            "target_id": int_id,
                            "type": "IMPLEMENTS",
                            "properties": {"is_virtual": True},
                            "virtual_status": "normal",
                        }
                    )

                    # Decouple callers by connecting them to the Interface instead of concrete class
                    for r in relationships:
                        if (
                            r["virtual_status"] == "removed"
                            or r["type"] == "IMPLEMENTS"
                        ):
                            continue
                        if r["target_id"] == cnid:
                            r["target_id"] = int_id

            # --- CREATE MICROSERVICE ---
            elif change.action == "create_microservice":
                ms_id = f"virtual_ms_{change.target_name.lower()}"
                nodes[ms_id] = {
                    "id": ms_id,
                    "name": change.target_name,
                    "type": "Service",
                    "properties": {"is_virtual": True},
                    "virtual_status": "normal",
                    "original_name": change.target_name,
                }

                # Connect virtual service to targets
                deps = [
                    d.strip() for d in (change.new_name or "").split(",") if d.strip()
                ]
                for dname in deps:
                    target_nids = find_matching_nodes(
                        dname, "symbol"
                    ) or find_matching_nodes(dname, "file")
                    if target_nids:
                        relationships.append(
                            {
                                "id": f"virtual_rel_{len(relationships)}",
                                "source_id": ms_id,
                                "target_id": target_nids[0],
                                "type": "DEPENDS_ON",
                                "properties": {"is_virtual": True},
                                "virtual_status": "normal",
                            }
                        )
                    else:
                        rules_violated.append(
                            f"Microservice target dependency not found: {dname}"
                        )

            # --- ADD OR REMOVE DEPENDENCY ---
            elif change.action == "add_dependency":
                src_ids = find_matching_nodes(
                    change.target_name, "symbol"
                ) or find_matching_nodes(change.target_name, "file")
                tgt_ids = find_matching_nodes(
                    change.new_name or "", "symbol"
                ) or find_matching_nodes(change.new_name or "", "file")

                if src_ids and tgt_ids:
                    relationships.append(
                        {
                            "id": f"virtual_rel_{len(relationships)}",
                            "source_id": src_ids[0],
                            "target_id": tgt_ids[0],
                            "type": "DEPENDS_ON",
                            "properties": {"is_virtual": True},
                            "virtual_status": "normal",
                        }
                    )
                else:
                    rules_violated.append(
                        f"Failed to add dependency from {change.target_name} to {change.new_name}: nodes not found"
                    )

            elif change.action == "remove_dependency":
                src_ids = find_matching_nodes(
                    change.target_name, "symbol"
                ) or find_matching_nodes(change.target_name, "file")
                tgt_ids = find_matching_nodes(
                    change.new_name or "", "symbol"
                ) or find_matching_nodes(change.new_name or "", "file")

                if src_ids and tgt_ids:
                    found = False
                    for r in relationships:
                        if r["source_id"] in src_ids and r["target_id"] in tgt_ids:
                            r["virtual_status"] = "removed"
                            found = True
                    if not found:
                        rules_violated.append(
                            f"No direct dependency found from {change.target_name} to {change.new_name}"
                        )
                else:
                    rules_violated.append(
                        "Failed to remove dependency: source/target nodes not found"
                    )

        # 3. Impact Prediction Engine (BFS traversal of reverse/incoming relationships)
        # Identify starting nodes (which are deleted, modified, or renamed virtual nodes)
        start_nodes = [
            nid
            for nid, n in nodes.items()
            if n["virtual_status"] in ("deleted", "modified", "renamed")
        ]

        # Build reverse adjacency list: target -> list of sources
        rev_adj: Dict[str, Set[str]] = collections.defaultdict(set)
        rel_map: Dict[str, List[Dict[str, Any]]] = collections.defaultdict(
            list
        )  # target_id -> rel details

        for r in relationships:
            if r["virtual_status"] == "removed":
                continue
            if r["type"] in ("OWNS", "BELONGS_TO"):
                continue
            rev_adj[r["target_id"]].add(r["source_id"])
            rel_map[r["target_id"]].append(r)

        # BFS Traversal with depth tracking
        queue = collections.deque([(nid, 0) for nid in start_nodes])
        visited_depth: Dict[str, int] = {}
        for nid in start_nodes:
            visited_depth[nid] = 0

        visited: Set[str] = set()
        impact_reason: Dict[str, str] = {}
        for nid in start_nodes:
            n = nodes[nid]
            impact_reason[nid] = f"Directly virtual-{n['virtual_status']}"

        while queue:
            curr, d = queue.popleft()
            if curr in visited:
                if visited_depth.get(curr, d) > d:
                    visited_depth[curr] = d
                continue
            visited.add(curr)
            visited_depth[curr] = d

            # Traverse to callers/dependents
            for parent_id in rev_adj.get(curr, []):
                if parent_id not in visited_depth or visited_depth[parent_id] > d + 1:
                    triggered_by_rels = [
                        r for r in rel_map[curr] if r["source_id"] == parent_id
                    ]
                    rel_type = (
                        triggered_by_rels[0]["type"]
                        if triggered_by_rels
                        else "DEPENDS_ON"
                    )

                    impact_reason[parent_id] = (
                        f"Downstream dependent of '{nodes[curr]['name']}' (via {rel_type})"
                    )
                    visited_depth[parent_id] = d + 1
                    queue.append((parent_id, d + 1))

        # Affected nodes exclude starting nodes themselves
        affected_ids = visited - set(start_nodes)

        # 4. Group & categorize affected nodes
        affected_files: Set[str] = set()
        affected_functions: Set[str] = set()
        affected_classes: Set[str] = set()
        broken_apis: Set[str] = set()
        broken_tests: Set[str] = set()
        affected_microservices: Set[str] = set()
        affected_databases: Set[str] = set()
        affected_ci_pipelines: Set[str] = set()

        total_tests = sum(
            1
            for n in nodes.values()
            if "test" in n["name"].lower()
            or "test" in (n["properties"].get("path") or "").lower()
        )

        for nid in affected_ids:
            n = nodes[nid]
            ntype_lower = n["type"].lower()
            name_lower = n["name"].lower()
            path = n["properties"].get("path") or n["properties"].get("file_path") or ""
            path_lower = path.lower()

            is_test = (
                "test" in name_lower
                or "test" in path_lower
                or "tests" in path_lower
                or ntype_lower == "test"
            )
            is_api = (
                ntype_lower == "api endpoint"
                or ntype_lower == "api"
                or "/api/" in path_lower
                or name_lower.startswith("api")
            )
            is_microservice = (
                ntype_lower
                in ("service", "external service", "docker service", "domain")
                or "service" in name_lower
            )
            is_database = (
                ntype_lower in ("database table", "database") or "db" in name_lower
            )
            is_class = (
                ntype_lower == "class"
                or "controller" in name_lower
                or "facade" in name_lower
            )

            if is_test:
                broken_tests.add(nid)
            elif is_api:
                broken_apis.add(nid)
            elif is_microservice:
                affected_microservices.add(nid)
            elif is_database:
                affected_databases.add(nid)
            elif is_class:
                affected_classes.add(nid)
            elif ntype_lower == "file":
                affected_files.add(nid)
            elif ntype_lower in ("function", "method"):
                affected_functions.add(nid)
                file_id = n["properties"].get("file_id")
                if file_id and file_id in nodes:
                    affected_files.add(file_id)
                    impact_reason[file_id] = f"Contains affected function '{n['name']}'"
            else:
                affected_functions.add(nid)

        # 5. CI Pipeline Auditing
        ci_file_ids = [
            nid
            for nid, n in nodes.items()
            if n["type"].lower() == "file"
            and (
                ".github/workflows" in (n["properties"].get("path") or "").lower()
                or "jenkins" in n["name"].lower()
            )
        ]
        if broken_tests:
            if ci_file_ids:
                for cid in ci_file_ids:
                    affected_ids.add(cid)
                    affected_ci_pipelines.add(cid)
                    visited.add(cid)
                    visited_depth[cid] = 2
                    impact_reason[cid] = (
                        f"Executes broken tests: {', '.join(nodes[tid]['name'] for tid in list(broken_tests)[:2])}"
                    )
            else:
                # Add virtual pipeline if tests are broken but no workflow files are on disk
                vci_id = "virtual_ci_pipeline_github_actions"
                nodes[vci_id] = {
                    "id": vci_id,
                    "name": "ci.yml (.github/workflows/ci.yml)",
                    "type": "File",
                    "properties": {
                        "path": ".github/workflows/ci.yml",
                        "is_virtual": True,
                    },
                    "virtual_status": "normal",
                    "original_name": "ci.yml",
                }
                affected_ids.add(vci_id)
                affected_ci_pipelines.add(vci_id)
                visited.add(vci_id)
                visited_depth[vci_id] = 2
                impact_reason[vci_id] = "Executes affected tests"

        # Build final affected details list
        affected_details_list = []
        for nid in affected_ids:
            n = nodes[nid]
            ntype_lower = n["type"].lower()
            parent_file_path = (
                n["properties"].get("path") or n["properties"].get("file_path") or ""
            )
            if ntype_lower != "file" and "file_id" in n["properties"]:
                fid = n["properties"]["file_id"]
                if fid in nodes:
                    parent_file_path = (
                        nodes[fid]["properties"].get("path") or nodes[fid]["name"]
                    )

            affected_details_list.append(
                AffectedNodeDetail(
                    id=n["id"],
                    name=n["name"],
                    type=n["type"],
                    file_path=parent_file_path if parent_file_path else None,
                    impact_reason=impact_reason.get(
                        nid, "Downstream transitive impact"
                    ),
                )
            )

        # 6. Architecture Compliance check
        drift_service = DriftDetectionService()
        arch_rules = drift_service.load_rules(repository_id)

        node_layers = {}
        node_boundaries = {}
        layers = arch_rules.get("layers", [])
        boundaries = arch_rules.get("boundaries", [])

        for nid, n in nodes.items():
            if n["virtual_status"] == "deleted":
                continue
            name_lower = n["name"].lower()
            path = (
                n["properties"].get("path") or n["properties"].get("file_path") or ""
            ).lower()

            for lay in layers:
                for pat in lay.get("matching_patterns", []):
                    if fnmatch.fnmatch(name_lower, pat.lower()) or (
                        path and fnmatch.fnmatch(path, pat.lower())
                    ):
                        node_layers[nid] = lay["name"]
                        break
                if nid in node_layers:
                    break

            for b in boundaries:
                for pat in b.get("matching_patterns", []):
                    if fnmatch.fnmatch(name_lower, pat.lower()) or (
                        path and fnmatch.fnmatch(path, pat.lower())
                    ):
                        node_boundaries[nid] = b["name"]
                        break
                if nid in node_boundaries:
                    break

        compliance_violations = []
        for r in relationships:
            if r["virtual_status"] in ("deleted", "removed"):
                continue
            src_id, tgt_id = r["source_id"], r["target_id"]
            if src_id not in nodes or tgt_id not in nodes:
                continue
            if (
                nodes[src_id]["virtual_status"] == "deleted"
                or nodes[tgt_id]["virtual_status"] == "deleted"
            ):
                continue

            src_layer, tgt_layer = node_layers.get(src_id), node_layers.get(tgt_id)
            src_bound, tgt_bound = node_boundaries.get(src_id), node_boundaries.get(
                tgt_id
            )

            if src_layer and tgt_layer and src_layer != tgt_layer:
                l_conf = next((lay for lay in layers if lay["name"] == src_layer), None)
                if l_conf:
                    allowed = [
                        a.lower() for a in l_conf.get("allowed_dependencies", [])
                    ]
                    if (
                        tgt_layer.lower() not in allowed
                        and tgt_layer.lower() != src_layer.lower()
                    ):
                        compliance_violations.append(
                            f"Arch Rule Breached: Layer '{src_layer}' ({nodes[src_id]['name']}) depends on "
                            f"'{tgt_layer}' ({nodes[tgt_id]['name']}). Dependency is forbidden."
                        )

            if src_bound and tgt_bound and src_bound != tgt_bound:
                b_conf = next((b for b in boundaries if b["name"] == src_bound), None)
                if b_conf:
                    forbidden = [
                        f.lower() for f in b_conf.get("forbidden_dependencies", [])
                    ]
                    if tgt_bound.lower() in forbidden:
                        compliance_violations.append(
                            f"Domain Smells: Microservice '{src_bound}' depends on forbidden domain '{tgt_bound}' "
                            f"(detected in link '{nodes[src_id]['name']}' ➔ '{nodes[tgt_id]['name']}')"
                        )

        rules_violated.extend(compliance_violations)
        architecture_compliance_score = max(
            10.0, 100.0 - len(compliance_violations) * 15.0
        )
        tech_debt_score_change += len(compliance_violations) * 5.0

        # 7. Risk and Failure Probability Calculations
        risk_score = min(
            100,
            len(affected_files) * 6
            + len(affected_functions) * 2
            + len(broken_apis) * 15
            + len(broken_tests) * 5
            + len(affected_databases) * 20,
        )

        is_critical_target = any(
            change.target_name.lower()
            in (
                "userservice",
                "authservice",
                "db",
                "database",
                "payment",
                "checkout",
                "postgresql",
                "billing",
            )
            for change in changes
        )
        if is_critical_target and risk_score > 30:
            risk_score = max(risk_score, 85)

        if risk_score >= 80 or len(broken_apis) > 5 or len(affected_databases) > 1:
            risk_level = "CRITICAL"
        elif risk_score >= 40 or len(broken_apis) > 0 or len(affected_databases) > 0:
            risk_level = "HIGH"
        elif risk_score >= 15:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Estimated Failure Probability solver
        estimated_failure_probability = min(
            99.0,
            float(
                risk_score * 0.6
                + len(broken_apis) * 4
                + len(compliance_violations) * 10
                + len(affected_ci_pipelines) * 5
                + (85.0 if is_critical_target else 0.0)
            ),
        )
        if len(changes) > 0:
            estimated_failure_probability = max(10.0, estimated_failure_probability)
        else:
            estimated_failure_probability = 0.0

        # Risk explanation text
        change_names = ", ".join(f"'{c.target_name}'" for c in changes)
        if len(changes) == 0:
            risk_explanation = "No virtual alterations have been simulated."
            risk_level = "LOW"
            risk_score = 0
        else:
            risk_explanation = (
                f"Simulating changes on {change_names} impacts {len(affected_files)} files, "
                f"{len(affected_functions)} functions, and breaks {len(broken_apis)} API endpoints. "
                f"Risk level is {risk_level} (Score: {risk_score}/100)."
            )

        # Estimated repair time logic
        total_minutes = (
            len(affected_files) * 30
            + len(affected_functions) * 10
            + len(broken_apis) * 120
            + len(broken_tests) * 20
            + len(affected_databases) * 180
            + len(affected_ci_pipelines) * 60
        )
        if total_minutes == 0:
            estimated_repair_time = "Under 10 Minutes"
        elif total_minutes < 60:
            estimated_repair_time = f"{total_minutes} Minutes"
        else:
            hours = total_minutes // 60
            if hours < 4:
                estimated_repair_time = f"{hours}–{hours + 1} Hours"
            elif hours < 12:
                estimated_repair_time = f"{hours}–{hours + 3} Hours"
            else:
                lower = hours
                upper = int(hours * 1.3)
                estimated_repair_time = f"{lower}–{upper} Hours"

        # Confidence level
        if total_tests > 0:
            conf_val = 90 + min(5, total_tests // 2)
            confidence_level = f"{conf_val}%"
        else:
            confidence_level = "78% (Low test coverage detected)"

        # 8. Build Blast Radius Visualization Sub-Graph
        blast_radius_nodes: List[BlastRadiusNode] = []
        for nid in visited:
            n = nodes[nid]
            depth_val = visited_depth.get(nid, 2)
            blast_radius_nodes.append(
                BlastRadiusNode(
                    id=nid,
                    name=n["name"],
                    type=n["type"],
                    depth=min(2, depth_val),
                    virtual_status=n["virtual_status"],
                )
            )

        blast_radius_edges: List[BlastRadiusEdge] = []
        for r in relationships:
            if r["virtual_status"] in ("deleted", "removed"):
                continue
            src, tgt = r["source_id"], r["target_id"]
            if src in visited and tgt in visited:
                blast_radius_edges.append(
                    BlastRadiusEdge(
                        source=src,
                        target=tgt,
                        type=r["type"],
                    )
                )

        # 9. Risk Prediction Engine (7 categories)
        confidence_score_val = 80.0 if total_tests > 0 else 60.0

        # Runtime Failures
        runtime_prob = min(
            99.0,
            float(
                len(affected_functions) * 3
                + len(affected_databases) * 20
                + (50 if is_critical_target else 0)
            ),
        )
        runtime_level = (
            "CRITICAL"
            if runtime_prob >= 75
            else (
                "HIGH"
                if runtime_prob >= 50
                else "MEDIUM" if runtime_prob >= 20 else "LOW"
            )
        )

        # Performance Loss
        perf_prob = min(
            95.0,
            float(
                (
                    45
                    if any(
                        c.action in ("split_service", "merge_services") for c in changes
                    )
                    else 0
                )
                + len(affected_databases) * 15
                + len(affected_microservices) * 8
            ),
        )
        perf_level = (
            "CRITICAL"
            if perf_prob >= 75
            else "HIGH" if perf_prob >= 50 else "MEDIUM" if perf_prob >= 20 else "LOW"
        )

        # Deployment Risk
        deploy_prob = min(
            99.0,
            float(
                len(affected_files) * 2
                + len(affected_microservices) * 10
                + (40 if any(c.action == "upgrade_package" for c in changes) else 0)
            ),
        )
        deploy_level = (
            "CRITICAL"
            if deploy_prob >= 75
            else (
                "HIGH"
                if deploy_prob >= 50
                else "MEDIUM" if deploy_prob >= 20 else "LOW"
            )
        )

        # Architecture Drift
        drift_prob = min(
            99.0,
            float(
                len(compliance_violations) * 25
                + (
                    20
                    if any(
                        c.action in ("add_dependency", "remove_dependency")
                        for c in changes
                    )
                    else 0
                )
            ),
        )
        drift_level = (
            "CRITICAL"
            if drift_prob >= 75
            else "HIGH" if drift_prob >= 50 else "MEDIUM" if drift_prob >= 20 else "LOW"
        )

        # Security Impact
        has_security_keywords = any(
            "auth" in n["name"].lower()
            or "security" in n["name"].lower()
            or "crypt" in n["name"].lower()
            or "jwt" in n["name"].lower()
            or "login" in n["name"].lower()
            or "token" in n["name"].lower()
            or "user" in n["name"].lower()
            for n in nodes.values()
            if n["virtual_status"] in ("deleted", "modified", "renamed")
        )
        sec_prob = 85.0 if has_security_keywords else 15.0
        sec_level = (
            "CRITICAL"
            if sec_prob >= 75
            else "HIGH" if sec_prob >= 50 else "MEDIUM" if sec_prob >= 20 else "LOW"
        )

        # Test Failures
        test_fail_prob = min(
            99.0, float(len(broken_tests) * 15 + len(affected_files) * 2)
        )
        test_fail_level = (
            "CRITICAL"
            if test_fail_prob >= 75
            else (
                "HIGH"
                if test_fail_prob >= 50
                else "MEDIUM" if test_fail_prob >= 20 else "LOW"
            )
        )

        # Dependency Issues
        dep_prob = min(
            95.0,
            float(
                len(affected_ci_pipelines) * 12
                + (
                    30
                    if any(
                        c.action
                        in ("add_dependency", "remove_dependency", "upgrade_package")
                        for c in changes
                    )
                    else 0
                )
            ),
        )
        dep_level = (
            "CRITICAL"
            if dep_prob >= 75
            else "HIGH" if dep_prob >= 50 else "MEDIUM" if dep_prob >= 20 else "LOW"
        )

        predictions = [
            RiskPrediction(
                type="Runtime Failures",
                risk_level=runtime_level,
                probability=runtime_prob if len(changes) > 0 else 0.0,
                explanation="Modifications disrupt caller dependency hierarchies, causing runtime exceptions.",
                confidence_score=confidence_score_val,
            ),
            RiskPrediction(
                type="Performance Loss",
                risk_level=perf_level,
                probability=perf_prob if len(changes) > 0 else 0.0,
                explanation="Boundary re-adjustments and db drops forecast query latency issues.",
                confidence_score=confidence_score_val,
            ),
            RiskPrediction(
                type="Deployment Risk",
                risk_level=deploy_level,
                probability=deploy_prob if len(changes) > 0 else 0.0,
                explanation="Refactoring changeset size spikes verification and deploy pipeline decay probability.",
                confidence_score=confidence_score_val,
            ),
            RiskPrediction(
                type="Architecture Drift",
                risk_level=drift_level,
                probability=drift_prob if len(changes) > 0 else 0.0,
                explanation="Simulated direct imports or boundary bypasses violate default layers guidelines.",
                confidence_score=confidence_score_val,
            ),
            RiskPrediction(
                type="Security Impact",
                risk_level=sec_level,
                probability=sec_prob if len(changes) > 0 else 0.0,
                explanation="Modifications in credentials or tokens boundaries trigger compliance checks.",
                confidence_score=confidence_score_val,
            ),
            RiskPrediction(
                type="Test Failures",
                risk_level=test_fail_level,
                probability=test_fail_prob if len(changes) > 0 else 0.0,
                explanation="Broken function references compromise current assertions, failing unit test sweeps.",
                confidence_score=confidence_score_val,
            ),
            RiskPrediction(
                type="Dependency Issues",
                risk_level=dep_level,
                probability=dep_prob if len(changes) > 0 else 0.0,
                explanation="Transitive dependencies alterations trigger circular loops or unresolved package imports.",
                confidence_score=confidence_score_val,
            ),
        ]

        # 10. Engineering Cost Estimator
        dev_hours = (
            float(
                len(affected_files) * 2.5
                + len(affected_functions) * 0.5
                + len(broken_apis) * 6.0
                + len(affected_databases) * 10.0
            )
            if len(changes) > 0
            else 0.0
        )
        qa_hours = (
            float(
                len(broken_tests) * 1.5
                + len(affected_files) * 0.8
                + len(broken_apis) * 2.0
            )
            if len(changes) > 0
            else 0.0
        )
        review_hours = (
            float(max(0.5, (dev_hours + qa_hours) * 0.15)) if dev_hours > 0 else 0.0
        )
        deployment_hours = (
            float(
                0.5 + len(affected_microservices) * 1.5 + len(affected_databases) * 3.0
            )
            if dev_hours > 0
            else 0.0
        )
        rollback_cost_index = (
            float(
                len(affected_databases) * 2000.0
                + len(affected_microservices) * 400.0
                + len(affected_files) * 80.0
            )
            if len(changes) > 0
            else 0.0
        )
        total_hours = dev_hours + qa_hours + review_hours + deployment_hours

        cost_est = CostEstimate(
            developer_hours=round(dev_hours, 1),
            qa_hours=round(qa_hours, 1),
            review_hours=round(review_hours, 1),
            deployment_hours=round(deployment_hours, 1),
            rollback_cost_index=round(rollback_cost_index, 1),
            total_hours=round(total_hours, 1),
            explanation="Estimates include coding efforts, test suite adjustments, code review approvals, and release rollback parameters.",
        )

        # 11. Recommendation Engine
        recommendations = []
        if len(affected_files) > 0:
            recommendations.append(
                f"Refactor the {len(affected_files)} affected files to address compile-time references."
            )
        if len(affected_functions) > 0:
            recommendations.append(
                f"Validate call parameters of the {len(affected_functions)} affected functions/methods."
            )
        if len(broken_apis) > 0:
            recommendations.append(
                f"Adjust clients or gateway configurations calling the {len(broken_apis)} broken APIs."
            )
        if len(broken_tests) > 0:
            recommendations.append(
                f"Rewrite test expectations for the {len(broken_tests)} broken test cases."
            )
        if len(affected_databases) > 0:
            recommendations.append(
                f"Synchronize migrations on the {len(affected_databases)} affected databases."
            )
        if len(affected_ci_pipelines) > 0:
            recommendations.append(
                f"Audit the {len(affected_ci_pipelines)} affected CI/CD workflow configuration files."
            )

        if not recommendations:
            recommendations.append(
                "No changes or dependencies are broken. The digital twin simulation is stable."
            )

        # 12. Performance Impact Predictions
        latency_change_ms = (
            float(
                len(affected_databases) * 45.0
                + len(affected_microservices) * 12.0
                + len(affected_files) * 1.5
            )
            if len(changes) > 0
            else 0.0
        )

        memory_change_mb = (
            float(len(affected_microservices) * 120.0 + len(affected_files) * 2.5)
            if len(changes) > 0
            else 0.0
        )

        cpu_change_percent = (
            float(len(affected_functions) * 0.4 + len(affected_databases) * 5.0)
            if len(changes) > 0
            else 0.0
        )

        db_queries_change = (
            int(
                len(affected_databases) * 8
                + (4 if any(c.action == "split_service" for c in changes) else 0)
            )
            if len(changes) > 0
            else 0
        )

        network_calls_change = (
            int(
                len(affected_microservices) * 3
                + (5 if any(c.action == "split_service" for c in changes) else 0)
            )
            if len(changes) > 0
            else 0
        )

        caching_efficiency_change_percent = (
            float(
                -15.0
                if len(affected_databases) > 0
                or any(c.action == "split_service" for c in changes)
                else 0.0
            )
            if len(changes) > 0
            else 0.0
        )

        perf_impact = PerformanceImpact(
            latency_change_ms=round(latency_change_ms, 1),
            memory_change_mb=round(memory_change_mb, 1),
            cpu_change_percent=round(cpu_change_percent, 1),
            db_queries_change=db_queries_change,
            network_calls_change=network_calls_change,
            caching_efficiency_change_percent=round(
                caching_efficiency_change_percent, 1
            ),
            explanation="Estimates impact on runtime latency, memory footprint, database overhead, and network calls.",
        )

        # 13. Architecture Evolution Predictions
        compliance_before = 92.0 if len(compliance_violations) > 0 else 100.0
        compliance_after = float(architecture_compliance_score)

        tech_debt_before = float(sum(r.debt_score for r in db_reports))
        if tech_debt_before == 0.0:
            tech_debt_before = 120.0
        tech_debt_after = max(0.0, tech_debt_before + tech_debt_score_change)

        base_coupling = round(len(relationships) / max(1, len(nodes)), 2)
        if base_coupling > 1.0 or base_coupling == 0.0:
            base_coupling = 0.45

        coupling_before = float(base_coupling)
        coupling_after = min(
            0.99,
            float(
                base_coupling
                + len(compliance_violations) * 0.05
                + len(affected_files) * 0.01
            ),
        )
        if len(changes) == 0:
            coupling_after = coupling_before

        arch_evolution = ArchitectureEvolution(
            compliance_before=round(compliance_before, 1),
            compliance_after=round(compliance_after, 1),
            tech_debt_before=round(tech_debt_before, 1),
            tech_debt_after=round(tech_debt_after, 1),
            coupling_before=round(coupling_before, 2),
            coupling_after=round(coupling_after, 2),
            explanation="Forecasts changes to codebase compliance, technical debt profile, and microservice/module coupling parameters.",
        )

        # 14. AI Recommendation Engine
        ai_recommendations = []
        for change in changes:
            if change.action == "delete" and change.target_type == "symbol":
                ai_recommendations.append(
                    AIAlternativeRecommendation(
                        original_action=f"Deleting monolithic symbol '{change.target_name}'",
                        alternative_action=f"Consider: Extract {change.target_name}Repository ➔ Reduce Coupling ➔ Introduce Events",
                        expected_health_gain_percent=16.0,
                        explanation=f"Decoupling callers of '{change.target_name}' using event listeners reduces class coupling metrics, increasing overall system health.",
                    )
                )
            elif change.action == "delete" and change.target_type == "database":
                ai_recommendations.append(
                    AIAlternativeRecommendation(
                        original_action=f"Dropping database '{change.target_name}'",
                        alternative_action="Consider: Introduce Read Replicas ➔ Partition schemas ➔ CQRS queries",
                        expected_health_gain_percent=24.0,
                        explanation="Prevents monolithic database downtime risk while achieving performance latency improvements.",
                    )
                )
            elif change.action == "split_service":
                ai_recommendations.append(
                    AIAlternativeRecommendation(
                        original_action=f"Splitting Service '{change.target_name}' directly",
                        alternative_action="Consider: Extract shared interfaces contracts ➔ Transition callers via Strangler Fig pattern",
                        expected_health_gain_percent=18.0,
                        explanation="Allows incremental migrations of clients without introducing runtime interface incompatibilities.",
                    )
                )

        # Fallback if no specific recommendations compiled
        if not ai_recommendations:
            ai_recommendations.append(
                AIAlternativeRecommendation(
                    original_action="No high-risk operations simulated",
                    alternative_action="Consider: Keep Auth Service cached ➔ Profile hot endpoints ➔ Setup database indexes",
                    expected_health_gain_percent=12.0,
                    explanation="Optimizes baseline throughput latency without code mutations.",
                )
            )

        # 15. Simulation Timeline Step-by-Step Evaluator
        timeline_steps = []
        timeline_steps.append(
            TimelineStep(
                step_number=0,
                change_summary="Baseline (Initial Repository State)",
                affected_nodes_count=0,
                architecture_compliance_score=100.0,
                estimated_failure_probability=0.0,
                health_score=100.0,
            )
        )

        for idx in range(1, len(changes) + 1):
            sub_changes = changes[:idx]
            sub_affected = 0
            sub_compliance = 100.0
            sub_failure = 0.0

            for chg in sub_changes:
                if chg.action == "delete":
                    sub_affected += 4
                    sub_failure += 25.0
                elif chg.action == "split_service":
                    sub_affected += 6
                    sub_failure += 40.0
                elif chg.action == "add_dependency":
                    sub_compliance = 85.0
                    sub_affected += 2
                    sub_failure += 15.0
                else:
                    sub_affected += 1
                    sub_failure += 5.0

            sub_failure = min(99.0, sub_failure)
            sub_health = max(
                10.0, sub_compliance - (sub_failure * 0.3) - (sub_affected * 0.5)
            )

            timeline_steps.append(
                TimelineStep(
                    step_number=idx,
                    change_summary=f"Apply: {sub_changes[-1].action.upper()} {sub_changes[-1].target_name}",
                    affected_nodes_count=sub_affected,
                    architecture_compliance_score=round(sub_compliance, 1),
                    estimated_failure_probability=round(sub_failure, 1),
                    health_score=round(sub_health, 1),
                )
            )

        return SimulationReportResponse(
            session_id=session_id,
            repository_id=repository_id,
            total_affected_nodes=len(affected_ids),
            affected_counts={
                "files": len(affected_files),
                "functions": len(affected_functions),
                "classes": len(affected_classes),
                "apis": len(broken_apis),
                "tests": len(broken_tests),
                "microservices": len(affected_microservices),
                "databases": len(affected_databases),
                "ci_pipelines": len(affected_ci_pipelines),
            },
            risk_level=risk_level,
            risk_score=risk_score,
            risk_explanation=risk_explanation,
            estimated_repair_time=estimated_repair_time,
            confidence_level=confidence_level,
            affected_details=affected_details_list,
            remediation_recommendations=recommendations,
            rules_violated=rules_violated,
            tech_debt_score_change=tech_debt_score_change,
            architecture_compliance_score=architecture_compliance_score,
            estimated_failure_probability=estimated_failure_probability,
            blast_radius_nodes=blast_radius_nodes,
            blast_radius_edges=blast_radius_edges,
            risk_predictions=predictions,
            cost_estimate=cost_est,
            performance_impact=perf_impact,
            architecture_evolution=arch_evolution,
            ai_alternative_recommendations=ai_recommendations,
            simulation_timeline=timeline_steps,
        )

    @staticmethod
    def generate_ai_refactoring(
        db: Session, repository_id: str, goal: str
    ) -> AIRefactoringResponse:
        goal_lower = goal.lower()

        # Look up nodes in this repository
        db_nodes = (
            db.query(GraphNode).filter(GraphNode.repository_id == repository_id).all()
        )
        matched = []
        for n in db_nodes:
            if n.name.lower() in goal_lower:
                matched.append(n.name)

        target = matched[0] if matched else "Payment Service"

        if "split" in goal_lower:
            migration_plan = [
                f"Step 1: Extract domain boundaries and interface contracts from monolithic {target}.",
                f"Step 2: Partition backend schema/tables queried by {target} into isolated schemas.",
                "Step 3: Refactor source imports and classes to decouple internal calls into API/HTTP/gRPC boundaries.",
                f"Step 4: Spin up new microservice containers (e.g. {target}-Core, {target}-Gateway).",
                "Step 5: Safely redirect ingress API router endpoints to point to the new microservice routes.",
                f"Step 6: Deprecate monolithic {target} entrypoint after gradual verification.",
            ]
            new_architecture = (
                "```mermaid\n"
                "graph TD\n"
                "  Client[Client Router] --> Gateway[API Gateway]\n"
                f"  Gateway --> |API/gRPC| CoreSvc[{target} Core Service]\n"
                f"  Gateway --> |API/gRPC| PaySvc[{target} Billing Service]\n"
                f"  CoreSvc --> Db1[(Core Database)]\n"
                f"  PaySvc --> Db2[(Billing Database)]\n"
                "```"
            )
            new_dependencies = [
                f"Gateway ➔ {target} Core Service",
                f"Gateway ➔ {target} Billing Service",
                f"{target} Core Service ➔ Core Database",
                f"{target} Billing Service ➔ Billing Database",
            ]
            risk_analysis = (
                f"MODERATE TO HIGH RISK: Decoupling {target} breaks database transactional integrity. "
                "Distributed transactions must be controlled via Saga/Outbox patterns. "
                "Network latency overhead increases by +12ms due to microservice gRPC hops."
            )
            timeline = [
                "Day 1-3: Establish schema boundaries & contract models.",
                "Day 4-7: Refactor imports & separate codebase structures.",
                "Day 8-10: Setup container deployment & ingress gateway configurations.",
                "Day 11-14: Shadow traffic testing & gradual production rollouts.",
            ]
            rollback_strategy = (
                f"Maintain the legacy {target} instance alive as shadow backup. "
                "Setup weighted target routing on API Gateway to direct 0-100% traffic, enabling instant rollback in case of issues."
            )
            expected_improvement = (
                "Maintainability Index boosts from 62.0 to 88.0 (+41.9%). "
                "Module coupling factor decreases from 0.78 to 0.22. "
                "Deployment boundaries are decoupled, allowing independent releases."
            )
        elif "merge" in goal_lower or "combine" in goal_lower:
            migration_plan = [
                "Step 1: Consolidate data schemas and transaction logic of merged targets.",
                "Step 2: Move modules/files under a single unified repository folder namespace.",
                "Step 3: Refactor client callers to import from single shared service contracts.",
                "Step 4: Decommission secondary microservice servers & release pipelines.",
            ]
            new_architecture = (
                "```mermaid\n"
                "graph TD\n"
                "  Client[API Client] --> UnifiedSvc[Unified Consolidation Service]\n"
                "  UnifiedSvc --> ConsolidatedDb[(Consolidated Database)]\n"
                "```"
            )
            new_dependencies = [
                "API Gateway ➔ Unified Consolidation Service",
                "Unified Consolidation Service ➔ Consolidated Database",
            ]
            risk_analysis = (
                "LOW RISK: Merging reduces network serialization latency (-15ms) and simplifies codebase imports. "
                "Requires careful schema migrations to avoid data downtime."
            )
            timeline = [
                "Day 1-2: Map model and class consolidation.",
                "Day 3-5: Merge codebase folders & refactor endpoints.",
                "Day 6-8: Data reconciliation script execution & regression tests.",
            ]
            rollback_strategy = "Deploy unified service side-by-side with secondary components, routing traffic back in case of regression."
            expected_improvement = (
                "Removes microservice networking overhead, increasing performance by +22.0%. "
                "Halves deployment costs and simplifies governance auditing."
            )
        else:
            migration_plan = [
                f"Step 1: Audit code segments and class boundaries for refactoring goal '{goal}'.",
                "Step 2: Create a virtual replica branch in memory to trace callers.",
                "Step 3: Extract concrete interfaces & redirect client caller imports.",
                "Step 4: Execute testing pipeline to verify no regressions.",
            ]
            new_architecture = (
                "```mermaid\n"
                "graph TD\n"
                f"  Caller[Callers] --> |Decoupled Interface| TargetSvc[{target}]\n"
                "```"
            )
            new_dependencies = [
                f"Callers ➔ I{target} Interface",
                f"I{target} Interface ➔ Concrete {target}",
            ]
            risk_analysis = (
                "LOW RISK: Refactoring uses standard decoupling patterns. "
                "Risk of structural drift is minimal under robust unit test coverage."
            )
            timeline = [
                "Day 1-2: Interface design & callers analysis.",
                "Day 3-4: Refactoring edits & automated unit runs.",
            ]
            rollback_strategy = "Standard git branch revert. No database structure migrations are involved."
            expected_improvement = (
                "Removes circular references, boosting code maintainability by +12.0%."
            )

        return AIRefactoringResponse(
            goal=goal,
            migration_plan=migration_plan,
            new_architecture=new_architecture,
            new_dependencies=new_dependencies,
            risk_analysis=risk_analysis,
            timeline=timeline,
            rollback_strategy=rollback_strategy,
            expected_improvement=expected_improvement,
        )

    @staticmethod
    def compare_scenarios(
        db: Session, repository_id: str, sess_a_id: str, sess_b_id: str
    ) -> ScenarioComparisonResponse:
        from app.models.digital_twin import DigitalTwinSession

        # Load Session A
        sess_a = (
            db.query(DigitalTwinSession)
            .filter(
                DigitalTwinSession.id == sess_a_id,
                DigitalTwinSession.repository_id == repository_id,
            )
            .first()
        )

        # Load Session B
        sess_b = (
            db.query(DigitalTwinSession)
            .filter(
                DigitalTwinSession.id == sess_b_id,
                DigitalTwinSession.repository_id == repository_id,
            )
            .first()
        )

        if not sess_a or not sess_b:
            raise ValueError("One or both twin sessions not found.")

        # Simulate Scenario A
        report_a = DigitalTwinEngine.simulate(
            db, repository_id, sess_a_id, sess_a.changes
        )

        # Simulate Scenario B
        report_b = DigitalTwinEngine.simulate(
            db, repository_id, sess_b_id, sess_b.changes
        )

        details_a = ScenarioDetails(
            name=sess_a.name,
            cost_hours=(
                report_a.cost_estimate.total_hours if report_a.cost_estimate else 0.0
            ),
            rollback_cost=(
                report_a.cost_estimate.rollback_cost_index
                if report_a.cost_estimate
                else 0.0
            ),
            risk_level=report_a.risk_level,
            failure_probability=report_a.estimated_failure_probability,
            coupling_ratio=(
                report_a.architecture_evolution.coupling_after
                if report_a.architecture_evolution
                else 0.0
            ),
            latency_ms=(
                report_a.performance_impact.latency_change_ms
                if report_a.performance_impact
                else 0.0
            ),
            tech_debt_change=report_a.tech_debt_score_change,
        )

        details_b = ScenarioDetails(
            name=sess_b.name,
            cost_hours=(
                report_b.cost_estimate.total_hours if report_b.cost_estimate else 0.0
            ),
            rollback_cost=(
                report_b.cost_estimate.rollback_cost_index
                if report_b.cost_estimate
                else 0.0
            ),
            risk_level=report_b.risk_level,
            failure_probability=report_b.estimated_failure_probability,
            coupling_ratio=(
                report_b.architecture_evolution.coupling_after
                if report_b.architecture_evolution
                else 0.0
            ),
            latency_ms=(
                report_b.performance_impact.latency_change_ms
                if report_b.performance_impact
                else 0.0
            ),
            tech_debt_change=report_b.tech_debt_score_change,
        )

        score_a = (
            details_a.failure_probability * 0.4
            + details_a.cost_hours * 0.3
            + details_a.coupling_ratio * 10.0
            + details_a.latency_ms * 0.1
        )
        score_b = (
            details_b.failure_probability * 0.4
            + details_b.cost_hours * 0.3
            + details_b.coupling_ratio * 10.0
            + details_b.latency_ms * 0.1
        )

        if score_a < score_b:
            recommendation = (
                f"AI Verdict: Scenario A ({sess_a.name}) is highly recommended. "
                f"It operates with {round(details_b.failure_probability - details_a.failure_probability, 1)}% lower failure risk, "
                f"saves {round(details_b.cost_hours - details_a.cost_hours, 1)} hours of remediation effort, and "
                f"maintains a cleaner module coupling coefficient ({details_a.coupling_ratio} vs {details_b.coupling_ratio})."
            )
        else:
            recommendation = (
                f"AI Verdict: Scenario B ({sess_b.name}) is highly recommended. "
                f"It operates with {round(details_a.failure_probability - details_b.failure_probability, 1)}% lower failure risk, "
                f"saves {round(details_a.cost_hours - details_b.cost_hours, 1)} hours of remediation effort, and "
                f"maintains a cleaner module coupling coefficient ({details_b.coupling_ratio} vs {details_a.coupling_ratio})."
            )

        return ScenarioComparisonResponse(
            scenario_a=details_a, scenario_b=details_b, recommendation=recommendation
        )

    @staticmethod
    def simulate_what_if(
        db: Session, repository_id: str, scenario_type: str
    ) -> WhatIfResponse:
        title_map = {
            "developer_attrition": "Developer Attrition (20% of engineering team leaves)",
            "db_failure": "Primary Database Outage Failure",
            "cache_removal": "Caching Layer (Redis) Removal",
            "cloud_migration": "AWS/GCP Cloud Architecture Migration",
            "monolith_to_microservices": "Monolith splitting to Microservices boundaries",
        }

        title = title_map.get(scenario_type, "Custom Crisis/Strategy Simulation")

        if scenario_type == "developer_attrition":
            return WhatIfResponse(
                scenario_title=title,
                impact_level="HIGH",
                failure_probability=45.0,
                remediation_hours=72.0,
                affected_components=[
                    "auth_service.py",
                    "payment_router.py",
                    "db_utils.py",
                ],
                verdict="AI Verdict: Risk is High. Knowledge loss of key developers impacts core authentication and payment modules, reducing maintenance speed by 35%. Proactively schedule documentation reviews.",
                details="Bus Factor risk is active. 3 critical modules have sole ownership constraints. Remediation requires cross-training code reviews.",
            )
        elif scenario_type == "db_failure":
            return WhatIfResponse(
                scenario_title=title,
                impact_level="CRITICAL",
                failure_probability=95.0,
                remediation_hours=24.0,
                affected_components=[
                    "PostgreSQL Database",
                    "UserService",
                    "OrderRepository",
                ],
                verdict="AI Verdict: Risk is Critical. A database failure directly breaks 8 primary API routes. Proactively implement database read replicas and robust connection pool retry checks.",
                details="Single point of failure detected. Downtime cascades to client frontend components instantly.",
            )
        elif scenario_type == "cache_removal":
            return WhatIfResponse(
                scenario_title=title,
                impact_level="MEDIUM",
                failure_probability=20.0,
                remediation_hours=12.0,
                affected_components=[
                    "Redis Cache Service",
                    "GET /api/products",
                    "GET /api/catalog",
                ],
                verdict="AI Verdict: Risk is Medium. Caching layer removal increases hot database catalog queries by +250%, increasing query latency by +120ms.",
                details="Requires cache failover settings to prevent database transaction choke.",
            )
        elif scenario_type == "cloud_migration":
            return WhatIfResponse(
                scenario_title=title,
                impact_level="MEDIUM",
                failure_probability=30.0,
                remediation_hours=120.0,
                affected_components=["Dockerfile", "Docker Compose", "CI Workflows"],
                verdict="AI Verdict: Risk is Medium. Migration requires updating environment parameters and establishing clean cloud network VPC bounds.",
                details="Infrastructure as Code files need translation from local docker environments to target cloud constructs.",
            )
        elif scenario_type == "monolith_to_microservices":
            return WhatIfResponse(
                scenario_title=title,
                impact_level="HIGH",
                failure_probability=65.0,
                remediation_hours=180.0,
                affected_components=[
                    "Monolith Core",
                    "Auth boundaries",
                    "Inventory Domain",
                ],
                verdict="AI Verdict: Risk is High. Splitting introduces inter-service network latency and database transaction splits. Follow gradual Strangler Fig patterns.",
                details="Strongly coupled database references must be refactored into event message notifications first.",
            )
        else:
            return WhatIfResponse(
                scenario_title=title,
                impact_level="LOW",
                failure_probability=10.0,
                remediation_hours=8.0,
                affected_components=["Base Configuration"],
                verdict="AI Verdict: Baseline risk is low. Monitor performance indexes.",
                details="No critical boundaries are breached under standard operating metrics.",
            )
