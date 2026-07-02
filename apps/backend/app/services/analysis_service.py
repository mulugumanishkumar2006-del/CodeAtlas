from typing import List, Dict, Set, Any
from sqlalchemy.orm import Session
import collections

from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.graph_enums import GraphNodeType


class AnalysisService:

    def detect_circular_dependencies(self, db: Session, repo_id: str) -> Dict[str, Any]:
        """
        Find circular dependency loops (e.g. A -> B -> C -> A) in the repository graph.
        """
        # Load relationships
        relationships = db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).all()
        
        # Build adjacency list (source_id -> list of target_id)
        adj: Dict[str, Set[str]] = collections.defaultdict(set)
        for rel in relationships:
            adj[rel.source_id].add(rel.target_id)

        cycles: List[List[str]] = []
        visited: Set[str] = set()
        path: List[str] = []
        path_set: Set[str] = set()

        def dfs(node: str):
            if node in path_set:
                # Cycle detected! Extract the cyclic part
                cycle_start_idx = path.index(node)
                cycle = path[cycle_start_idx:] + [node]
                # Filter out self-loops (size <= 2 including start/end duplicate)
                if len(cycle) > 2:
                    # Normalize cycle presentation (rotate so the alphabetically first node is first)
                    # This avoids duplicate cycles in different order e.g. A->B->C->A and B->C->A->B
                    normalized_cycle = cycle[:-1]
                    min_idx = normalized_cycle.index(min(normalized_cycle))
                    rotated_cycle = normalized_cycle[min_idx:] + normalized_cycle[:min_idx] + [normalized_cycle[min_idx]]
                    if rotated_cycle not in cycles:
                        cycles.append(rotated_cycle)
                return

            if node in visited:
                return

            visited.add(node)
            path.append(node)
            path_set.add(node)

            for neighbour in adj.get(node, []):
                dfs(neighbour)

            path.pop()
            path_set.remove(node)

        # Run DFS from all nodes
        for node_id in list(adj.keys()):
            visited.clear()
            dfs(node_id)

        # Generate cycle reports, affected modules, and suggested fixes
        reports = []
        affected_modules = set()
        for idx, cycle in enumerate(cycles):
            cycle_nodes = cycle[:-1]
            cycle_desc = " -> ".join([n.split("::")[-1] for n in cycle])
            
            # Extract clean module names
            modules_in_cycle = []
            for n in cycle_nodes:
                name_clean = n.split("::")[-1]
                modules_in_cycle.append(name_clean)
                affected_modules.add(name_clean)

            # Generate suggested fixes based on cycle contents
            fixes = [
                f"Extract shared protocols or interfaces from '{modules_in_cycle[0]}' and '{modules_in_cycle[1]}' to break the cyclic dependency.",
                "Refactor import statements to introduce dependency injection or dynamic registry calls.",
                "Introduce a mediator module to orchestrate operations instead of direct coupling."
            ]

            reports.append({
                "id": f"cycle_{idx + 1}",
                "cycle": cycle,
                "description": cycle_desc,
                "affected_modules": modules_in_cycle,
                "suggested_fixes": fixes
            })

        return {
            "total_cycles": len(cycles),
            "cycles": reports,
            "affected_modules": list(affected_modules),
        }

    def calculate_coupling_analysis(self, db: Session, repo_id: str) -> Dict[str, Any]:
        """
        Measure coupling metrics: Fan-in, Fan-out, Instability Coupling Score, and Degree Centrality.
        """
        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
        relationships = db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).all()

        fan_in: Dict[str, int] = {n.id: 0 for n in nodes}
        fan_out: Dict[str, int] = {n.id: 0 for n in nodes}

        for rel in relationships:
            if rel.source_id in fan_out:
                fan_out[rel.source_id] += 1
            if rel.target_id in fan_in:
                fan_in[rel.target_id] += 1

        total_nodes = len(nodes)
        coupling_metrics = []
        most_reused_node = None
        max_fan_in = -1

        for n in nodes:
            fi = fan_in[n.id]
            fo = fan_out[n.id]
            
            # Instability coupling score: Instability I = Fan-out / (Fan-in + Fan-out)
            # High instability (near 1.0) means highly dependent on other modules.
            # High stability (near 0.0) means highly reused by other modules.
            coupling_score = fo / (fi + fo) if (fi + fo) > 0 else 0.0
            
            # Centrality: (Fan-in + Fan-out) / (Total Nodes - 1)
            centrality = (fi + fo) / (total_nodes - 1) if total_nodes > 1 else 0.0

            coupling_metrics.append({
                "node_id": n.id,
                "type": n.type,
                "name": n.name,
                "fan_in": fi,
                "fan_out": fo,
                "coupling_score": round(coupling_score, 2),
                "centrality": round(centrality, 2)
            })

            # Check for most reused module (File/Folder/Module of maximum Fan-in)
            if n.type in (GraphNodeType.FILE.value, GraphNodeType.FOLDER.value, GraphNodeType.MODULE.value):
                if fi > max_fan_in:
                    max_fan_in = fi
                    most_reused_node = n

        return {
            "metrics": coupling_metrics,
            "most_reused_module": {
                "id": most_reused_node.id,
                "name": most_reused_node.name,
                "type": most_reused_node.type,
                "fan_in_count": max_fan_in
            } if most_reused_node else None
        }

    def run_impact_analysis(self, db: Session, repo_id: str, symbol_name: str) -> Dict[str, Any]:
        """
        BFS traversal of upstream dependencies (incoming edges) starting from a target symbol.
        """
        # Find starting node(s) matching the symbol name
        start_nodes = db.query(GraphNode).filter(
            GraphNode.repository_id == repo_id,
            GraphNode.name == symbol_name
        ).all()

        if not start_nodes:
            # Try matching by suffix/substring if no exact match
            start_nodes = db.query(GraphNode).filter(
                GraphNode.repository_id == repo_id,
                GraphNode.name.like(f"%{symbol_name}%")
            ).all()

        if not start_nodes:
            return {
                "symbol_name": symbol_name,
                "error": "Symbol not found in repository graph.",
                "affected_counts": {
                    "files": 0,
                    "functions": 0,
                    "classes": 0,
                    "apis": 0,
                    "tests": 0
                },
                "risk": "LOW"
            }

        # Load all relationships for traversal
        relationships = db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).all()

        # Build reverse adjacency list (target_id -> list of source_id)
        # We traverse incoming edges, i.e., from target back to source
        rev_adj: Dict[str, Set[str]] = collections.defaultdict(set)
        for rel in relationships:
            rev_adj[rel.target_id].add(rel.source_id)

        # BFS Traversal to accumulate all affected nodes
        queue = collections.deque([n.id for n in start_nodes])
        visited: Set[str] = set()

        while queue:
            curr = queue.popleft()
            if curr in visited:
                continue
            visited.add(curr)
            for parent in rev_adj.get(curr, []):
                if parent not in visited:
                    queue.append(parent)

        # Do not include the starting nodes themselves in the affected counts
        affected_ids = visited - {n.id for n in start_nodes}
        affected_nodes = db.query(GraphNode).filter(
            GraphNode.repository_id == repo_id,
            GraphNode.id.in_(list(affected_ids))
        ).all() if affected_ids else []

        # Count affected nodes by type category
        counts = {
            "files": 0,
            "functions": 0,
            "classes": 0,
            "apis": 0,
            "tests": 0
        }

        for n in affected_nodes:
            type_lower = n.type.lower()
            name_lower = n.name.lower()
            path_lower = (n.properties.get("path") or "").lower() if n.properties else ""

            # Check if it is a test node
            if "test" in name_lower or "test" in path_lower or "tests" in path_lower:
                counts["tests"] += 1
            elif type_lower == "file":
                counts["files"] += 1
            elif type_lower in ("function", "method"):
                counts["functions"] += 1
            elif type_lower in ("class", "interface"):
                counts["classes"] += 1
            elif type_lower == "api endpoint":
                counts["apis"] += 1

        # Determine risk thresholds
        total_affected = len(affected_nodes)
        if total_affected > 20 or counts["apis"] > 0:
            risk = "HIGH"
        elif total_affected > 5:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        return {
            "symbol_name": symbol_name,
            "total_affected_nodes": total_affected,
            "affected_counts": counts,
            "risk": risk,
            "affected_details": [
                {"id": n.id, "name": n.name, "type": n.type}
                for n in affected_nodes
            ]
        }
