import collections
import random
from typing import Dict, List, Set, Any


class SimulationAlgorithms:
    @staticmethod
    def bfs_dfs_traversal(
        nodes: List[Any], relationships: List[Any], changed_node_id: str
    ) -> Set[str]:
        """Runs standard BFS to locate all downstream affected nodes."""
        visited = {changed_node_id}
        queue = collections.deque([changed_node_id])

        # Map source_id to target_ids for fast lookup
        adj_map = collections.defaultdict(list)
        for rel in relationships:
            adj_map[rel.source_id].append(rel.target_id)

        while queue:
            curr = queue.popleft()
            for neighbor in adj_map[curr]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        return visited

    @staticmethod
    def build_dominator_tree(
        nodes: List[Any],
        relationships: List[Any],
        entry_nodes: List[str],
        target_deleted_node: str,
    ) -> List[str]:
        """
        Identifies dominated nodes (single points of failure).
        A node N is dominated by target_deleted_node if N is unreachable from
        all other entry_nodes when target_deleted_node is removed.
        """
        other_entries = [e for e in entry_nodes if e != target_deleted_node]
        if not other_entries:
            return [n.id for n in nodes if n.id != target_deleted_node]

        dominated_ids = []

        # Find reachability starting from other entries
        for node in nodes:
            node_id = node.id
            if node_id == target_deleted_node:
                continue

            visited = set()
            queue = collections.deque(other_entries)
            reachable_without_target = False

            while queue:
                curr = queue.popleft()
                if curr == node_id:
                    reachable_without_target = True
                    break
                if curr in visited:
                    continue
                visited.add(curr)

                for rel in relationships:
                    if rel.source_id == curr and rel.target_id != target_deleted_node:
                        queue.append(rel.target_id)

            if not reachable_without_target:
                dominated_ids.append(node_id)

        return dominated_ids

    @staticmethod
    def shortest_path_dijkstra(
        nodes: List[Any], relationships: List[Any], source_id: str, target_id: str
    ) -> int:
        """Finds shortest dependency distance using BFS."""
        if source_id == target_id:
            return 0

        visited = {source_id}
        queue = collections.deque([(source_id, 0)])

        adj_map = collections.defaultdict(list)
        for rel in relationships:
            adj_map[rel.source_id].append(rel.target_id)

        while queue:
            curr, dist = queue.popleft()
            if curr == target_id:
                return dist

            for neighbor in adj_map[curr]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, dist + 1))

        return 999  # Unreachable

    @staticmethod
    def dependency_propagation_risk(
        nodes: List[Any],
        relationships: List[Any],
        changed_node_id: str,
        base_probability: float,
    ) -> Dict[str, float]:
        """Calculates combined failure probabilities cascading downstream."""
        probabilities = {changed_node_id: base_probability}
        queue = collections.deque([changed_node_id])

        adj_map = collections.defaultdict(list)
        for rel in relationships:
            factor = 0.85 if rel.type in ("CALLS", "ROUTES_TO") else 0.45
            adj_map[rel.source_id].append((rel.target_id, factor))

        while queue:
            curr = queue.popleft()
            curr_prob = probabilities[curr]

            for neighbor, factor in adj_map[curr]:
                edge_prob = curr_prob * factor
                if neighbor not in probabilities:
                    probabilities[neighbor] = edge_prob
                    queue.append(neighbor)
                else:
                    # Combine independent probabilities: P(A or B) = 1 - (1-P(A))*(1-P(B))
                    old_prob = probabilities[neighbor]
                    probabilities[neighbor] = 1.0 - (
                        (1.0 - old_prob) * (1.0 - edge_prob)
                    )

        return {k: round(v * 100, 1) for k, v in probabilities.items()}

    @staticmethod
    def monte_carlo_simulate(
        base_effort_hours: float, dev_experience_ratio: float
    ) -> Dict[str, float]:
        """Runs 1,000 randomized cycles to predict effort distributions."""
        random.seed(42)  # Maintain deterministic testing
        simulated_efforts = []

        for _ in range(1000):
            qa_delay = random.uniform(0.8, 1.6)
            review_delay = random.uniform(0.9, 1.4)
            friction = random.uniform(1.0, 1.25)

            effort = (
                base_effort_hours
                * dev_experience_ratio
                * qa_delay
                * review_delay
                * friction
            )
            simulated_efforts.append(effort)

        mean_effort = sum(simulated_efforts) / len(simulated_efforts)
        simulated_efforts.sort()
        p95_effort = simulated_efforts[950]

        variance = sum((x - mean_effort) ** 2 for x in simulated_efforts) / len(
            simulated_efforts
        )
        std_dev = variance**0.5

        return {
            "mean_effort": round(mean_effort, 1),
            "p95_effort": round(p95_effort, 1),
            "std_dev": round(std_dev, 1),
        }

    @staticmethod
    def bayesian_risk_estimation(
        base_fail_prob: float, layer_rule_breached_count: int
    ) -> float:
        """
        Updates fail probability based on rules breaches count.
        """
        prior_fail = max(0.01, min(0.99, base_fail_prob))
        if layer_rule_breached_count == 0:
            return round(prior_fail * 100, 1)

        posterior = prior_fail
        for _ in range(layer_rule_breached_count):
            p_breach_given_fail = 0.85
            p_breach_given_success = 0.15
            p_breach = (p_breach_given_fail * posterior) + (
                p_breach_given_success * (1.0 - posterior)
            )
            posterior = (p_breach_given_fail * posterior) / max(0.001, p_breach)

        return round(min(0.99, posterior) * 100, 1)

    @staticmethod
    def pareto_optimization(scenarios: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Suggests Pareto-optimal tradeoffs.
        """
        pareto_front = []
        for s in scenarios:
            dominated = False
            for other in scenarios:
                if other == s:
                    continue
                other_better_or_equal = (
                    other["risk"] <= s["risk"]
                    and other["effort"] <= s["effort"]
                    and other["maintainability"] >= s["maintainability"]
                )
                other_strictly_better = (
                    other["risk"] < s["risk"]
                    or other["effort"] < s["effort"]
                    or other["maintainability"] > s["maintainability"]
                )
                if other_better_or_equal and other_strictly_better:
                    dominated = True
                    break
            if not dominated:
                pareto_front.append(s)
        return pareto_front

    @staticmethod
    def graph_differencing(
        nodes_baseline: List[str],
        rels_baseline: List[tuple],
        nodes_twin: List[str],
        rels_twin: List[tuple],
    ) -> Dict[str, int]:
        """Computes structural diffs between twin scenarios."""
        set_nodes_base = set(nodes_baseline)
        set_nodes_twin = set(nodes_twin)
        set_rels_base = set(rels_baseline)
        set_rels_twin = set(rels_twin)

        return {
            "added_nodes": len(set_nodes_twin - set_nodes_base),
            "removed_nodes": len(set_nodes_base - set_nodes_twin),
            "added_relationships": len(set_rels_twin - set_rels_base),
            "removed_relationships": len(set_rels_base - set_rels_twin),
        }
