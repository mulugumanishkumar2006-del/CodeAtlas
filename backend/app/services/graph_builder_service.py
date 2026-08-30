import logging
from pathlib import Path
from typing import Dict, Any, List, Set, Tuple, Optional
from collections import defaultdict, deque

logger = logging.getLogger("codeatlas.graph_builder")


class GraphBuilderService:
    """
    Constructs real repository graph structures from resolved dependencies.
    Calculates graph metrics (degree centrality, connected components) and detects dependency cycles.
    """

    def build_graph_structure(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Builds graph nodes, edges, cycle analysis, and centrality metrics from resolved repository files and dependencies.
        """
        # 1. Build nodes map: path -> node dict
        nodes: List[Dict[str, Any]] = []
        path_to_node: Dict[str, Dict[str, Any]] = {}

        for f in files:
            p = f["path"]
            meta = f.get("source_metadata") or {}
            node_key = f"file:{p}"
            node_data = {
                "repository_id": repository_id,
                "file_id": f.get("id"),
                "node_key": node_key,
                "node_type": "file",
                "label": p,
                "properties": {
                    "path": p,
                    "filename": f.get("filename") or Path(p).name,
                    "language": f.get("language") or "Unknown",
                    "line_count": f.get("line_count", 0),
                    "size_bytes": f.get("size_bytes", 0),
                    "symbol_count": meta.get("symbol_count", 0),
                },
            }
            nodes.append(node_data)
            path_to_node[p] = node_data

        # 2. Build edges: source -> target
        edges: List[Dict[str, Any]] = []
        adj: Dict[str, Set[str]] = defaultdict(set)
        in_degrees: Dict[str, int] = defaultdict(int)
        out_degrees: Dict[str, int] = defaultdict(int)

        # Initialize all nodes with 0 degrees
        for f in files:
            in_degrees[f["path"]] = 0
            out_degrees[f["path"]] = 0

        for dep in dependencies:
            if not dep.get("resolved"):
                continue

            src = dep.get("source_path")
            tgt = dep.get("target_path")

            if src and tgt and src in path_to_node and tgt in path_to_node and src != tgt:
                adj[src].add(tgt)
                out_degrees[src] += 1
                in_degrees[tgt] += 1

                edges.append({
                    "repository_id": repository_id,
                    "source_path": src,
                    "target_path": tgt,
                    "source_file_id": dep.get("source_file_id"),
                    "target_file_id": dep.get("target_file_id"),
                    "relationship_type": "IMPORTS",
                    "properties": {
                        "import_name": dep.get("import_name"),
                        "dependency_type": dep.get("dependency_type", "IMPORT"),
                        "start_line": dep.get("start_line", 1),
                        "end_line": dep.get("end_line", 1),
                    },
                })

        # 3. Detect Cycles (using Tarjan's Strongly Connected Components algorithm)
        cycles = self._detect_cycles(adj)

        # 4. Calculate Connected Components (undirected)
        connected_components_count = self._calculate_connected_components(files, adj)

        # 5. Top depended-on files and top dependency-heavy files
        most_depended_on = sorted(
            [{"path": p, "count": count} for p, count in in_degrees.items() if count > 0],
            key=lambda x: x["count"],
            reverse=True,
        )[:10]

        most_dependencies = sorted(
            [{"path": p, "count": count} for p, count in out_degrees.items() if count > 0],
            key=lambda x: x["count"],
            reverse=True,
        )[:10]

        graph_metrics = {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "connected_components": connected_components_count,
            "has_cycles": len(cycles) > 0,
            "cycle_count": len(cycles),
            "cycles": cycles,
            "most_depended_on": most_depended_on,
            "most_dependencies": most_dependencies,
            "in_degrees": dict(in_degrees),
            "out_degrees": dict(out_degrees),
        }

        return {
            "nodes": nodes,
            "edges": edges,
            "metrics": graph_metrics,
            "cycles": cycles,
        }

    def _detect_cycles(self, adj: Dict[str, Set[str]]) -> List[List[str]]:
        """
        Detects directed cycles in the dependency graph using DFS.
        Returns list of cycle paths e.g. [["A.py", "B.py", "A.py"]].
        """
        cycles: List[List[str]] = []
        visited: Dict[str, int] = {}  # 0: unvisited, 1: visiting (in stack), 2: visited
        parent_map: Dict[str, str] = {}
        all_nodes = set(adj.keys())
        for targets in adj.values():
            all_nodes.update(targets)

        for node in all_nodes:
            visited[node] = 0

        def dfs(u: str, path: List[str]):
            visited[u] = 1
            path.append(u)

            for v in adj.get(u, set()):
                if visited.get(v) == 1:
                    # Found a cycle
                    cycle_start_idx = path.index(v)
                    cycle_path = path[cycle_start_idx:] + [v]
                    # Check if cycle already recorded in some rotation
                    cycle_set = frozenset(cycle_path[:-1])
                    existing_sets = [frozenset(c[:-1]) for c in cycles]
                    if cycle_set not in existing_sets:
                        cycles.append(cycle_path)
                elif visited.get(v, 0) == 0:
                    dfs(v, path)

            path.pop()
            visited[u] = 2

        for node in sorted(all_nodes):
            if visited.get(node, 0) == 0:
                dfs(node, [])

        return cycles

    def _calculate_connected_components(self, files: List[Dict[str, Any]], adj: Dict[str, Set[str]]) -> int:
        """
        Calculates the number of connected components in the undirected graph.
        """
        if not files:
            return 0

        # Build undirected adjacency
        undirected: Dict[str, Set[str]] = defaultdict(set)
        all_nodes = [f["path"] for f in files]

        for src, targets in adj.items():
            for tgt in targets:
                undirected[src].add(tgt)
                undirected[tgt].add(src)

        visited: Set[str] = set()
        components = 0

        for node in all_nodes:
            if node not in visited:
                components += 1
                # BFS to visit whole component
                queue = deque([node])
                visited.add(node)
                while queue:
                    curr = queue.popleft()
                    for neighbor in undirected.get(curr, set()):
                        if neighbor not in visited:
                            visited.add(neighbor)
                            queue.append(neighbor)

        return components


graph_builder = GraphBuilderService()
