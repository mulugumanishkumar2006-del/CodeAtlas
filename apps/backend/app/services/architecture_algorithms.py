import datetime
import random


def weisfeiler_lehman_isomorphism(
    graph1: dict, graph2: dict, max_iter: int = 5
) -> bool:
    """Weisfeiler-Lehman (1-WL) graph isomorphism test."""
    if len(graph1) != len(graph2):
        return False

    colors1 = {node: str(len(neighbors)) for node, neighbors in graph1.items()}
    colors2 = {node: str(len(neighbors)) for node, neighbors in graph2.items()}

    for _ in range(max_iter):
        next_colors1 = {}
        for node, neighbors in graph1.items():
            neighbor_colors = sorted(
                [colors1[nbr] for nbr in neighbors if nbr in colors1]
            )
            signature = f"{colors1[node]}-" + ",".join(neighbor_colors)
            next_colors1[node] = hash(signature)

        next_colors2 = {}
        for node, neighbors in graph2.items():
            neighbor_colors = sorted(
                [colors2[nbr] for nbr in neighbors if nbr in colors2]
            )
            signature = f"{colors2[node]}-" + ",".join(neighbor_colors)
            next_colors2[node] = hash(signature)

        all_colors = sorted(
            list(set(list(next_colors1.values()) + list(next_colors2.values())))
        )
        color_map = {c: i for i, c in enumerate(all_colors)}

        colors1 = {n: str(color_map[c]) for n, c in next_colors1.items()}
        colors2 = {n: str(color_map[c]) for n, c in next_colors2.items()}

        dist1 = sorted(list(colors1.values()))
        dist2 = sorted(list(colors2.values()))
        if dist1 != dist2:
            return False

    return True


def find_strongly_connected_components(graph: dict) -> list:
    """Tarjan's algorithm for finding Strongly Connected Components (cycles)."""
    index = 0
    stack = []
    indices = {}
    lowlinks = {}
    on_stack = set()
    sccs = []

    def strongconnect(v):
        nonlocal index
        indices[v] = index
        lowlinks[v] = index
        index += 1
        stack.append(v)
        on_stack.add(v)

        for w in graph.get(v, []):
            if w not in indices:
                strongconnect(w)
                lowlinks[v] = min(lowlinks[v], lowlinks[w])
            elif w in on_stack:
                lowlinks[v] = min(lowlinks[v], indices[w])

        if lowlinks[v] == indices[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack.remove(w)
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)

    for node in graph:
        if node not in indices:
            strongconnect(node)

    return sccs


def label_propagation_communities(graph: dict, max_iter: int = 20) -> dict:
    """Label propagation community detection algorithm."""
    labels = {node: i for i, node in enumerate(graph.keys())}
    nodes = list(graph.keys())

    undirected = {node: set() for node in graph}
    for node, neighbors in graph.items():
        for nbr in neighbors:
            undirected[node].add(nbr)
            if nbr in undirected:
                undirected[nbr].add(node)

    for _ in range(max_iter):
        random.shuffle(nodes)
        changed = False
        for node in nodes:
            nbrs = undirected.get(node, set())
            if not nbrs:
                continue
            freq = {}
            for nbr in nbrs:
                lbl = labels[nbr]
                freq[lbl] = freq.get(lbl, 0) + 1
            max_val = max(freq.values())
            candidates = [lbl for lbl, count in freq.items() if count == max_val]
            new_label = random.choice(candidates)
            if labels[node] != new_label:
                labels[node] = new_label
                changed = True
        if not changed:
            break

    communities = {}
    for node, lbl in labels.items():
        communities.setdefault(lbl, []).append(node)
    return communities


def compute_coupling_metrics(nodes: list, relationships: list) -> dict:
    """Compute Afferent coupling (Ca), Efferent coupling (Ce), and Instability (I)."""
    ca = {n: 0 for n in nodes}
    ce = {n: 0 for n in nodes}

    for rel in relationships:
        src = rel.get("source")
        tgt = rel.get("target")
        if src in ce and tgt in ca:
            ce[src] += 1
            ca[tgt] += 1

    metrics = {}
    for n in nodes:
        denom = ca[n] + ce[n]
        instability = ce[n] / denom if denom > 0 else 0.0
        metrics[n] = {
            "afferent_coupling": ca[n],
            "efferent_coupling": ce[n],
            "instability": round(instability, 2),
        }
    return metrics


def predict_drift_decay(timeline_points: list) -> dict:
    """Timeseries linear regression to predict compliance decay below 50%."""
    if len(timeline_points) < 2:
        return {"trend": "stable", "decay_date": None}

    x = [p["timestamp"].timestamp() for p in timeline_points]
    y = [p["compliance_score"] for p in timeline_points]

    n = len(x)
    sum_x = sum(x)
    sum_y = sum(y)
    sum_xx = sum(x_i * x_i for x_i in x)
    sum_xy = sum(x_i * y_i for x_i, y_i in zip(x, y))

    denom = n * sum_xx - sum_x * sum_x
    if denom == 0:
        return {"trend": "stable", "decay_date": None}

    slope = (n * sum_xy - sum_x * sum_y) / denom
    intercept = (sum_y - slope * sum_x) / n

    if slope >= 0:
        return {"trend": "improving" if slope > 0 else "stable", "decay_date": None}

    target_ts = (50 - intercept) / slope
    max_ts = datetime.datetime.now().timestamp() + 5 * 365 * 24 * 3600
    if target_ts > max_ts:
        return {"trend": "stable_degrade", "decay_date": None}

    decay_date = datetime.datetime.fromtimestamp(target_ts)
    return {
        "trend": "degrading",
        "decay_date": decay_date.isoformat(),
        "slope": round(slope * 24 * 3600, 2),
    }


def multi_criteria_decision_analysis(
    alternatives: list, criteria_weights: dict
) -> list:
    """
    Multi-criteria decision analysis (MCDA) using Simple Additive Weighting (SAW).
    Normalizes criteria and applies weights to rank recommendations or patterns.
    """
    scored = []
    for alt in alternatives:
        # Expected criteria: business_impact, technical_impact, risk_reduction, effort (cost)
        bi = float(alt.get("business_impact", 50))
        ti = float(alt.get("technical_impact", 50))
        rr = float(alt.get("risk_reduction", 50))
        # Note: effort is negative criterion (lower effort is better, so we do 100 - effort)
        eff = float(alt.get("effort", 50))
        inverted_effort = max(100.0 - eff, 0.0)

        score = (
            bi * criteria_weights.get("business_impact", 0.25)
            + ti * criteria_weights.get("technical_impact", 0.25)
            + rr * criteria_weights.get("risk_reduction", 0.25)
            + inverted_effort * criteria_weights.get("effort", 0.25)
        )
        item = dict(alt)
        item["mcda_score"] = round(score, 2)
        scored.append(item)
    return sorted(scored, key=lambda x: x["mcda_score"], reverse=True)


def optimize_dependencies(graph: dict) -> list:
    """
    Dependency optimization heuristic.
    Determines optimal topological order or sequence of refactor steps
    to minimize coupling impacts, prioritizing removing nodes with high out-degree
    or nodes involved in cycle loops first.
    """
    # 1. Compute in-degree / out-degree
    in_degree = {node: 0 for node in graph}
    out_degree = {node: len(neighbors) for node, neighbors in graph.items()}
    for node, neighbors in graph.items():
        for nbr in neighbors:
            if nbr in in_degree:
                in_degree[nbr] += 1
            else:
                in_degree[nbr] = 1

    # 2. Heuristic ranking: high (out_degree - in_degree) indicates god dependency source
    scores = []
    for node in graph:
        score = out_degree.get(node, 0) * 1.5 - in_degree.get(node, 0) * 0.5
        scores.append({"node": node, "score": score})

    # Sort descending so we refactor highest score nodes first
    scores.sort(key=lambda x: x["score"], reverse=True)
    return [item["node"] for item in scores]
