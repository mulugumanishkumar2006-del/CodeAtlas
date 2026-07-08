import uuid
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import asc
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.evolution import CommitSnapshot, ComponentSnapshot
from app.models.job import Job
from app.models.repository import Repository
from app.models.user import User
from app.repositories.job import job_repository
from app.schemas.evolution import (
    ArchitectureDiffResponse,
    ArchitectureDriftEvent,
    CommitSnapshotResponse,
    ComponentMetricDiff,
    ComponentSnapshotResponse,
    EngineeringTimelineEvent,
    EvolutionAnalyticsResponse,
    EvolutionInsightsResponse,
    EvolutionSummaryResponse,
    EvolutionTriggerResponse,
    TimelineAnomaly,
)
from app.workers.evolution_task import analyze_repository_timeline_task

router = APIRouter()


@router.post(
    "/repositories/{repo_id}/evolution/trigger",
    response_model=EvolutionTriggerResponse,
    status_code=status.HTTP_201_CREATED,
)
def trigger_evolution_timeline_analysis(
    repo_id: str,
    checkpoints: int = 10,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    # Create background Job entry
    job_id = str(uuid.uuid4())
    job = Job(
        id=job_id,
        name=f"Timeline analysis: {repo.full_name}",
        status="pending",
        repository_id=repo_id,
    )
    job_repository.save(db, job)

    # Trigger Celery Task
    analyze_repository_timeline_task.delay(repo_id, job_id, checkpoints)

    return EvolutionTriggerResponse(
        status="triggered",
        job_id=job_id,
        repository_id=repo_id,
    )


@router.get(
    "/repositories/{repo_id}/evolution/timeline",
    response_model=List[CommitSnapshotResponse],
)
def get_evolution_timeline(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    snapshots = (
        db.query(CommitSnapshot)
        .filter(CommitSnapshot.repository_id == repo_id)
        .order_by(asc(CommitSnapshot.committed_at))
        .all()
    )
    return snapshots


@router.get(
    "/repositories/{repo_id}/evolution/components",
    response_model=List[ComponentSnapshotResponse],
)
def get_component_evolution(
    repo_id: str,
    path: Optional[str] = None,
    commit_sha: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    query = (
        db.query(ComponentSnapshot)
        .join(CommitSnapshot)
        .filter(CommitSnapshot.repository_id == repo_id)
    )

    if path is not None and path != "":
        query = query.filter(ComponentSnapshot.path == path)

    if commit_sha:
        query = query.filter(CommitSnapshot.commit_sha == commit_sha)

    if type:
        query = query.filter(ComponentSnapshot.type == type)

    components = query.order_by(asc(CommitSnapshot.committed_at)).all()
    return components


@router.get(
    "/repositories/{repo_id}/evolution/diff",
    response_model=ArchitectureDiffResponse,
)
def get_architecture_diff(
    repo_id: str,
    base_sha: str,
    head_sha: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    base_snap = (
        db.query(CommitSnapshot)
        .filter(
            CommitSnapshot.repository_id == repo_id,
            CommitSnapshot.commit_sha == base_sha,
        )
        .first()
    )
    head_snap = (
        db.query(CommitSnapshot)
        .filter(
            CommitSnapshot.repository_id == repo_id,
            CommitSnapshot.commit_sha == head_sha,
        )
        .first()
    )

    if not base_snap or not head_snap:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or both commit snapshots not found for this repository. Trigger analysis first.",
        )

    # Aggregate differences
    total_lines_diff = head_snap.total_lines - base_snap.total_lines
    code_lines_diff = head_snap.code_lines - base_snap.code_lines
    complexity_total_diff = head_snap.complexity_total - base_snap.complexity_total
    documentation_coverage_diff = round(
        head_snap.documentation_coverage - base_snap.documentation_coverage, 2
    )
    dependencies_count_diff = (
        head_snap.dependencies_count - base_snap.dependencies_count
    )

    # Compare component metrics
    base_components = {
        (c.path, c.type): c
        for c in db.query(ComponentSnapshot)
        .filter(ComponentSnapshot.commit_snapshot_id == base_snap.id)
        .all()
    }
    head_components = {
        (c.path, c.type): c
        for c in db.query(ComponentSnapshot)
        .filter(ComponentSnapshot.commit_snapshot_id == head_snap.id)
        .all()
    }

    added_components = []
    removed_components = []
    changed_components = []

    # 1. Added
    for key, head_comp in head_components.items():
        if key not in base_components:
            added_components.append(head_comp)

    # 2. Removed
    for key, base_comp in base_components.items():
        if key not in head_components:
            removed_components.append(base_comp)

    # 3. Changed
    for key, head_comp in head_components.items():
        if key in base_components:
            base_comp = base_components[key]

            # Check if metrics changed
            if (
                base_comp.complexity_total != head_comp.complexity_total
                or base_comp.code_lines != head_comp.code_lines
                or base_comp.dependencies_count != head_comp.dependencies_count
                or base_comp.technical_debt_score != head_comp.technical_debt_score
            ):
                base_metrics = {
                    "complexity_total": base_comp.complexity_total,
                    "code_lines": base_comp.code_lines,
                    "dependencies_count": base_comp.dependencies_count,
                    "dependents_count": base_comp.dependents_count,
                    "coupling_score": base_comp.coupling_score,
                    "technical_debt_score": base_comp.technical_debt_score,
                }
                head_metrics = {
                    "complexity_total": head_comp.complexity_total,
                    "code_lines": head_comp.code_lines,
                    "dependencies_count": head_comp.dependencies_count,
                    "dependents_count": head_comp.dependents_count,
                    "coupling_score": head_comp.coupling_score,
                    "technical_debt_score": head_comp.technical_debt_score,
                }
                metrics_diff = {
                    k: head_metrics[k] - base_metrics[k] for k in base_metrics.keys()
                }

                changed_components.append(
                    ComponentMetricDiff(
                        path=head_comp.path,
                        name=head_comp.name,
                        type=head_comp.type,
                        base_metrics=base_metrics,
                        head_metrics=head_metrics,
                        metrics_diff=metrics_diff,
                    )
                )

    # Calculate evolution highlights
    highlights = []

    base_graph = base_snap.graph_data or {"nodes": [], "edges": []}
    head_graph = head_snap.graph_data or {"nodes": [], "edges": []}

    base_nodes = {n.get("id"): n for n in base_graph.get("nodes", []) if n.get("id")}
    head_nodes = {n.get("id"): n for n in head_graph.get("nodes", []) if n.get("id")}

    # 1. Modules appearing / disappearing
    added_files = [
        n
        for nid, n in head_nodes.items()
        if nid not in base_nodes and n.get("kind") == "file"
    ]
    for f in added_files[:5]:
        highlights.append(
            f"Module '{f.get('name')}' created at '{f.get('file_path') or f.get('id')}'"
        )
    if len(added_files) > 5:
        highlights.append(f"And {len(added_files) - 5} more modules created.")

    removed_files = [
        n
        for nid, n in base_nodes.items()
        if nid not in head_nodes and n.get("kind") == "file"
    ]
    for f in removed_files[:5]:
        highlights.append(
            f"Module '{f.get('name')}' removed or moved from '{f.get('file_path') or f.get('id')}'"
        )

    # 2. APIs added
    added_apis = [
        n
        for nid, n in head_nodes.items()
        if nid not in base_nodes
        and (
            "api" in n.get("name", "").lower()
            or "route" in n.get("name", "").lower()
            or n.get("kind") in ("api", "endpoint")
        )
    ]
    for api in added_apis[:5]:
        highlights.append(
            f"API Endpoint or Handler '{api.get('name')}' added in '{api.get('file_path') or ''}'"
        )

    # 3. Databases introduced
    added_dbs = [
        n
        for nid, n in head_nodes.items()
        if nid not in base_nodes
        and (
            "db" in n.get("name", "").lower()
            or "table" in n.get("name", "").lower()
            or "model" in n.get("name", "").lower()
            or n.get("kind") == "database table"
        )
    ]
    for db_node in added_dbs[:5]:
        highlights.append(
            f"Database Table or Entity Model '{db_node.get('name')}' registered"
        )

    # 4. Service splits
    for key, head_comp in head_components.items():
        if key in base_components:
            base_comp = base_components[key]
            if base_comp.complexity_total - head_comp.complexity_total > 15:
                child_candidates = [
                    hc.name
                    for hk, hc in head_components.items()
                    if hk not in base_components and hc.type == head_comp.type
                ]
                if child_candidates:
                    highlights.append(
                        f"Service splitting detected: component '{head_comp.name}' split into submodules: "
                        f"{', '.join(child_candidates[:3])}"
                    )
                else:
                    highlights.append(
                        f"Complexity offloaded: component '{head_comp.name}' refactored to reduce complexity."
                    )

    # 5. Dependency changes
    base_edges = {
        (e.get("source"), e.get("target"))
        for e in base_graph.get("edges", [])
        if e.get("source") and e.get("target")
    }
    head_edges = {
        (e.get("source"), e.get("target"))
        for e in head_graph.get("edges", [])
        if e.get("source") and e.get("target")
    }

    added_edges = head_edges - base_edges
    removed_edges = base_edges - head_edges

    if len(added_edges) > 0:
        highlights.append(
            f"Dependency changes: introduced {len(added_edges)} new semantic relationship link(s)."
        )
    if len(removed_edges) > 0:
        highlights.append(
            f"Dependency cleanup: removed {len(removed_edges)} obsolete relationship link(s)."
        )

    if not highlights:
        highlights.append(
            "No major structural architecture changes detected between these commits."
        )

    # Calculate explicit technical debt hike reason
    health_drop = base_snap.health_score - head_snap.health_score
    reasons = []

    if complexity_total_diff > 5:
        reasons.append(f"complexity increased by +{complexity_total_diff} points")
    if documentation_coverage_diff < 0:
        reasons.append(
            f"documentation coverage decreased by {abs(round(documentation_coverage_diff * 100))}%"
        )
    if dependencies_count_diff > 3:
        reasons.append(f"introduced +{dependencies_count_diff} coupling connections")

    if hasattr(base_snap, "average_function_size") and hasattr(
        head_snap, "average_function_size"
    ):
        func_diff = head_snap.average_function_size - base_snap.average_function_size
        if func_diff > 3:
            reasons.append(
                f"average function size increased by +{round(func_diff, 1)} lines"
            )

    if hasattr(base_snap, "cohesion_score") and hasattr(head_snap, "cohesion_score"):
        cohesion_drop = base_snap.cohesion_score - head_snap.cohesion_score
        if cohesion_drop > 0.05:
            reasons.append(f"cohesion score dropped by -{round(cohesion_drop * 100)}%")

    if health_drop > 3:
        debt_status_base = (
            "Excellent (🟢)"
            if base_snap.health_score > 75
            else "Fair (🟡)" if base_snap.health_score > 50 else "Poor (🟠)"
        )
        debt_status_head = (
            "Excellent (🟢)"
            if head_snap.health_score > 75
            else (
                "Fair (🟡)"
                if head_snap.health_score > 50
                else "Poor (🟠)" if head_snap.health_score > 30 else "Critical (🔴)"
            )
        )
        reasons_str = "; ".join(reasons) if reasons else "general complexity drift"
        debt_hike_reason = f"Repository health score dropped from {round(base_snap.health_score, 1)} to {round(head_snap.health_score, 1)}, shifting rating from {debt_status_base} to {debt_status_head}. Key factors: {reasons_str}."
    elif health_drop < -3:
        debt_hike_reason = f"Repository health score improved by +{round(abs(health_drop), 1)} points due to modular refactoring cleanup."
    else:
        debt_hike_reason = "Repository complexity and structural technical debt remain stable between these checkpoints."

    return ArchitectureDiffResponse(
        base_sha=base_sha,
        head_sha=head_sha,
        total_lines_diff=total_lines_diff,
        code_lines_diff=code_lines_diff,
        complexity_total_diff=complexity_total_diff,
        documentation_coverage_diff=documentation_coverage_diff,
        dependencies_count_diff=dependencies_count_diff,
        added_components=added_components,
        removed_components=removed_components,
        changed_components=changed_components,
        evolution_highlights=highlights,
        debt_hike_reason=debt_hike_reason,
    )


@router.get(
    "/repositories/{repo_id}/evolution/anomalies",
    response_model=List[TimelineAnomaly],
)
def get_timeline_anomalies(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    snapshots = (
        db.query(CommitSnapshot)
        .filter(CommitSnapshot.repository_id == repo_id)
        .order_by(asc(CommitSnapshot.committed_at))
        .all()
    )

    anomalies = []
    if len(snapshots) < 2:
        return anomalies

    for i in range(1, len(snapshots)):
        base = snapshots[i - 1]
        head = snapshots[i]

        # 1. Complexity Spike (>50 points increase or >30% jump)
        comp_diff = head.complexity_total - base.complexity_total
        comp_rel = comp_diff / max(base.complexity_total, 1)
        if comp_diff > 50 or (comp_diff > 10 and comp_rel > 0.3):
            anomalies.append(
                TimelineAnomaly(
                    commit_sha=head.commit_sha,
                    message=head.message or "No message",
                    committed_at=head.committed_at,
                    author_name=head.author_name or "Unknown",
                    metric_name="complexity",
                    previous_value=float(base.complexity_total),
                    new_value=float(head.complexity_total),
                    spike_value=float(comp_diff),
                    description=f"Complexity spiked by +{comp_diff} (+{round(comp_rel * 100, 1)}%) in this commit.",
                )
            )

        # 2. Dependency Explosion (more than 10 new references)
        dep_diff = head.dependencies_count - base.dependencies_count
        if dep_diff > 10:
            anomalies.append(
                TimelineAnomaly(
                    commit_sha=head.commit_sha,
                    message=head.message or "No message",
                    committed_at=head.committed_at,
                    author_name=head.author_name or "Unknown",
                    metric_name="dependencies",
                    previous_value=float(base.dependencies_count),
                    new_value=float(head.dependencies_count),
                    spike_value=float(dep_diff),
                    description=f"Dependency explosion: added {dep_diff} new coupling relationships.",
                )
            )

        # 3. Technical Debt Spike (spikes of >10 points in components, or global spikes)
        # We also check if any component had a massive technical debt increase
        base_components = {
            c.path: c
            for c in db.query(ComponentSnapshot)
            .filter(ComponentSnapshot.commit_snapshot_id == base.id)
            .all()
        }
        head_components = {
            c.path: c
            for c in db.query(ComponentSnapshot)
            .filter(ComponentSnapshot.commit_snapshot_id == head.id)
            .all()
        }

        for path, hc in head_components.items():
            if path in base_components:
                bc = base_components[path]
                debt_diff = hc.technical_debt_score - bc.technical_debt_score
                if debt_diff > 15:
                    anomalies.append(
                        TimelineAnomaly(
                            commit_sha=head.commit_sha,
                            message=head.message or "No message",
                            committed_at=head.committed_at,
                            author_name=head.author_name or "Unknown",
                            metric_name="tech_debt",
                            previous_value=float(bc.technical_debt_score),
                            new_value=float(hc.technical_debt_score),
                            spike_value=float(debt_diff),
                            description=f"Technical debt for component '{hc.name}' ({hc.type}) spiked by +{round(debt_diff, 1)} points.",
                        )
                    )

    # Sort anomalies by committed date (descending) so latest anomalies show first
    anomalies.sort(key=lambda x: x.committed_at, reverse=True)
    return anomalies


@router.get(
    "/repositories/{repo_id}/evolution/graph",
    response_model=Dict[str, Any],
)
def get_evolution_graph(
    repo_id: str,
    commit_sha: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    snapshot = (
        db.query(CommitSnapshot)
        .filter(
            CommitSnapshot.repository_id == repo_id,
            CommitSnapshot.commit_sha == commit_sha,
        )
        .first()
    )
    if not snapshot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commit snapshot not found. Please trigger evolution analysis first.",
        )

    return snapshot.graph_data or {"nodes": [], "edges": []}


@router.get(
    "/repositories/{repo_id}/evolution/drifts",
    response_model=List[ArchitectureDriftEvent],
)
def get_architecture_drifts(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    snapshots = (
        db.query(CommitSnapshot)
        .filter(CommitSnapshot.repository_id == repo_id)
        .order_by(asc(CommitSnapshot.committed_at))
        .all()
    )

    drifts = []

    for snapshot in snapshots:
        graph_data = snapshot.graph_data or {"nodes": [], "edges": []}
        nodes_list = graph_data.get("nodes", [])
        edges_list = graph_data.get("edges", [])

        nodes_map = {n.get("id"): n for n in nodes_list if n.get("id")}

        # 1. Layer Violations & Domain Leakage Checks
        for edge in edges_list:
            source_id = edge.get("source")
            target_id = edge.get("target")
            if not source_id or not target_id:
                continue

            source_node = nodes_map.get(source_id)
            target_node = nodes_map.get(target_id)
            if not source_node or not target_node:
                continue

            src_name = source_node.get("name", "").lower()
            src_kind = source_node.get("kind", "").lower()
            tgt_name = target_node.get("name", "").lower()
            tgt_kind = target_node.get("kind", "").lower()

            # Layer Violation Check: API route calling database directly
            if (
                "api" in src_name
                or "route" in src_name
                or src_kind in ("api", "endpoint")
            ) and (
                "db" in tgt_name
                or "table" in tgt_name
                or "model" in tgt_name
                or tgt_kind == "database table"
            ):
                drifts.append(
                    ArchitectureDriftEvent(
                        commit_sha=snapshot.commit_sha,
                        committed_at=snapshot.committed_at,
                        author_name=snapshot.author_name or "Unknown",
                        type="layer_violation",
                        severity="critical",
                        message=f"Layer Violation: Endpoint '{source_node.get('name')}' queries Table '{target_node.get('name')}' directly, bypassing Service layers.",
                    )
                )

            # Domain Leakage Check: Import crossing clean boundaries
            src_file = source_node.get("file_path", "")
            tgt_file = target_node.get("file_path", "")
            if src_file and tgt_file:
                domains = ["auth", "billing", "payment", "notifications", "tasks"]
                src_dom = next((d for d in domains if d in src_file.lower()), None)
                tgt_dom = next((d for d in domains if d in tgt_file.lower()), None)
                if src_dom and tgt_dom and src_dom != tgt_dom:
                    drifts.append(
                        ArchitectureDriftEvent(
                            commit_sha=snapshot.commit_sha,
                            committed_at=snapshot.committed_at,
                            author_name=snapshot.author_name or "Unknown",
                            type="domain_leakage",
                            severity="warning",
                            message=f"Domain Leakage: Module in '{src_dom}' directly references code within '{tgt_dom}' domain scope.",
                        )
                    )

        # 2. Monolith Bloat Check: component consumes >40% of CC
        comps = (
            db.query(ComponentSnapshot)
            .filter(ComponentSnapshot.commit_snapshot_id == snapshot.id)
            .all()
        )
        for comp in comps:
            if comp.type == "domain" and snapshot.complexity_total > 0:
                ratio = comp.complexity_total / snapshot.complexity_total
                if ratio > 0.4:
                    drifts.append(
                        ArchitectureDriftEvent(
                            commit_sha=snapshot.commit_sha,
                            committed_at=snapshot.committed_at,
                            author_name=snapshot.author_name or "Unknown",
                            type="monolith_bloat",
                            severity="warning",
                            message=f"Monolith Bloat: Domain component '{comp.name}' consumes {round(ratio * 100)}% of overall repository cyclomatic complexity.",
                        )
                    )

        # 3. Circular Dependencies Cycle Check
        # Build adjacency graph
        adj = {}
        for edge in edges_list:
            s = edge.get("source")
            t = edge.get("target")
            if s and t:
                if s not in adj:
                    adj[s] = []
                adj[s].append(t)

        visited = {}
        cycles_count = 0

        def dfs(node_id, path):
            visited[node_id] = 1
            path.add(node_id)
            for neigh in adj.get(node_id, []):
                if neigh in path:
                    nonlocal cycles_count
                    cycles_count += 1
                elif neigh not in visited:
                    dfs(neigh, path)
            path.remove(node_id)
            visited[node_id] = 2

        for n_id in nodes_map.keys():
            if n_id not in visited:
                dfs(n_id, set())

        if cycles_count > 0:
            drifts.append(
                ArchitectureDriftEvent(
                    commit_sha=snapshot.commit_sha,
                    committed_at=snapshot.committed_at,
                    author_name=snapshot.author_name or "Unknown",
                    type="circular_dependency",
                    severity="critical",
                    message=f"Circular imports cycle introduced: detected {cycles_count} loop cycles in dependency graphs.",
                )
            )

    return drifts


@router.get(
    "/repositories/{repo_id}/evolution/engineering-timeline",
    response_model=List[EngineeringTimelineEvent],
)
def get_engineering_timeline(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    snapshots = (
        db.query(CommitSnapshot)
        .filter(CommitSnapshot.repository_id == repo_id)
        .order_by(asc(CommitSnapshot.committed_at))
        .all()
    )

    events = []

    for idx, snapshot in enumerate(snapshots):
        msg = snapshot.message or ""
        author = snapshot.author_name or "Unknown"
        sha = snapshot.commit_sha

        # 1. Commit Event (default)
        events.append(
            EngineeringTimelineEvent(
                commit_sha=sha,
                committed_at=snapshot.committed_at,
                author_name=author,
                type="commit",
                title=f"Commit: {msg.splitlines()[0] if msg else 'Checkpoint'}",
                description=f"Standard update checking code evolution. Added files/LOC analysis at checkpoint {sha[:7]}.",
            )
        )

        # 2. ADR Event
        if (
            "adr" in msg.lower()
            or "architecture decision" in msg.lower()
            or "decision record" in msg.lower()
        ):
            events.append(
                EngineeringTimelineEvent(
                    commit_sha=sha,
                    committed_at=snapshot.committed_at,
                    author_name=author,
                    type="adr",
                    title="ADR Documented",
                    description=f"Architectural Decision Record (ADR) parsed or committed: '{msg.splitlines()[0]}'.",
                )
            )

        # 3. Release Event
        if (
            "release" in msg.lower()
            or "bump version" in msg.lower()
            or "v1." in msg.lower()
            or "v2." in msg.lower()
        ):
            events.append(
                EngineeringTimelineEvent(
                    commit_sha=sha,
                    committed_at=snapshot.committed_at,
                    author_name=author,
                    type="release",
                    title="System Version Release Tagged",
                    description=f"Software deployment release snapshot published: '{msg.splitlines()[0]}'.",
                )
            )

        # 4. Infrastructure migration
        if any(
            k in msg.lower()
            for k in [
                "docker",
                "compose",
                "infra",
                "nginx",
                "alembic",
                "migration",
                "k8s",
                "kubernetes",
            ]
        ):
            events.append(
                EngineeringTimelineEvent(
                    commit_sha=sha,
                    committed_at=snapshot.committed_at,
                    author_name=author,
                    type="infrastructure",
                    title="Infrastructure Configuration Migration",
                    description=f"System environment config or database migration modified: '{msg.splitlines()[0]}'.",
                )
            )

        # Compare with previous to detect refactors and new services
        if idx > 0:
            prev_snap = snapshots[idx - 1]

            # 5. Major Refactor
            cc_diff = snapshot.complexity_total - prev_snap.complexity_total
            loc_diff = abs(snapshot.code_lines - prev_snap.code_lines)
            if cc_diff < -8 or loc_diff > 250:
                events.append(
                    EngineeringTimelineEvent(
                        commit_sha=sha,
                        committed_at=snapshot.committed_at,
                        author_name=author,
                        type="refactor",
                        title="Major Codebase Refactoring",
                        description=f"Refactored code paths: complexity changed by {cc_diff} points, matching {loc_diff} LOC diff.",
                    )
                )

            # 6. New Services
            curr_comps = {
                c.name
                for c in db.query(ComponentSnapshot)
                .filter(ComponentSnapshot.commit_snapshot_id == snapshot.id)
                .all()
            }
            prev_comps = {
                c.name
                for c in db.query(ComponentSnapshot)
                .filter(ComponentSnapshot.commit_snapshot_id == prev_snap.id)
                .all()
            }
            added_comps = curr_comps - prev_comps
            for comp_name in added_comps:
                events.append(
                    EngineeringTimelineEvent(
                        commit_sha=sha,
                        committed_at=snapshot.committed_at,
                        author_name=author,
                        type="service",
                        title=f"New Component Introduced: '{comp_name}'",
                        description=f"System decomposition split or component added to graph snapshot: '{comp_name}'.",
                    )
                )

    # Sort events by committed_at
    events.sort(key=lambda e: e.committed_at)
    return events


@router.get(
    "/repositories/{repo_id}/evolution/ai-summary",
    response_model=EvolutionSummaryResponse,
)
def get_ai_summary(
    repo_id: str,
    base_sha: str,
    head_sha: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    base_snap = (
        db.query(CommitSnapshot)
        .filter(
            CommitSnapshot.repository_id == repo_id,
            CommitSnapshot.commit_sha == base_sha,
        )
        .first()
    )
    head_snap = (
        db.query(CommitSnapshot)
        .filter(
            CommitSnapshot.repository_id == repo_id,
            CommitSnapshot.commit_sha == head_sha,
        )
        .first()
    )

    if not base_snap or not head_snap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Snapshots not found"
        )

    bullets = []

    # 1. Health Score changes
    health_diff = head_snap.health_score - base_snap.health_score
    if health_diff < 0:
        bullets.append(
            f"Repository health dropped from {base_snap.health_score} to {head_snap.health_score} (technical debt increased)."
        )
    elif health_diff > 0:
        bullets.append(
            f"Repository health score improved from {base_snap.health_score} to {head_snap.health_score} due to refactoring cleanups."
        )
    else:
        bullets.append(
            f"Repository health score remained stable at {base_snap.health_score}%."
        )

    # 2. Complexity changes
    cc_diff = head_snap.complexity_total - base_snap.complexity_total
    if base_snap.complexity_total > 0:
        cc_pct = round((cc_diff / base_snap.complexity_total) * 100)
        if cc_pct > 0:
            bullets.append(
                f"Code complexity increased by {cc_pct}% (from {base_snap.complexity_total} to {head_snap.complexity_total})."
            )
        elif cc_pct < 0:
            bullets.append(
                f"Code complexity decreased by {abs(cc_pct)}% (from {base_snap.complexity_total} to {head_snap.complexity_total})."
            )
    else:
        bullets.append(
            f"Overall complexity increased to {head_snap.complexity_total} points."
        )

    # 3. Component differences / splits
    base_comps = (
        db.query(ComponentSnapshot)
        .filter(ComponentSnapshot.commit_snapshot_id == base_snap.id)
        .all()
    )
    head_comps = (
        db.query(ComponentSnapshot)
        .filter(ComponentSnapshot.commit_snapshot_id == head_snap.id)
        .all()
    )
    comp_diff = len(head_comps) - len(base_comps)
    if comp_diff > 0:
        bullets.append(
            f"Codebase architecture expanded, introducing {comp_diff} new component modules."
        )
    elif comp_diff < 0:
        bullets.append(
            f"Codebase consolidated, removing {abs(comp_diff)} obsolete sub-modules."
        )

    # 4. Redis / resource additions
    b_nodes = {
        n.get("name", "").lower() for n in (base_snap.graph_data or {}).get("nodes", [])
    }
    h_nodes = {
        n.get("name", "").lower() for n in (head_snap.graph_data or {}).get("nodes", [])
    }
    added_nodes = h_nodes - b_nodes
    for node_name in added_nodes:
        if any(k in node_name for k in ["redis", "celery", "postgres", "db", "api"]):
            bullets.append(
                f"Technical resource component '{node_name}' was introduced to the dependency network."
            )

    # 5. Circular dependencies count shifts
    def calc_cycles(snap):
        edges = (snap.graph_data or {}).get("edges", [])
        nodes = (snap.graph_data or {}).get("nodes", [])
        adj = {}
        for edge in edges:
            s, t = edge.get("source"), edge.get("target")
            if s and t:
                adj.setdefault(s, []).append(t)
        visited = {}
        cycles = 0

        def dfs(n_id, path):
            visited[n_id] = 1
            path.add(n_id)
            for neigh in adj.get(n_id, []):
                if neigh in path:
                    nonlocal cycles
                    cycles += 1
                elif neigh not in visited:
                    dfs(neigh, path)
            path.remove(n_id)
            visited[n_id] = 2

        for n in nodes:
            n_id = n.get("id")
            if n_id and n_id not in visited:
                dfs(n_id, set())
        return cycles

    base_cycles = calc_cycles(base_snap)
    head_cycles = calc_cycles(head_snap)
    cycle_diff = head_cycles - base_cycles
    if cycle_diff < 0:
        bullets.append(
            f"{abs(cycle_diff)} circular dependencies were successfully resolved."
        )
    elif cycle_diff > 0:
        bullets.append(
            f"{cycle_diff} new circular import loop cycles were introduced in file links."
        )

    return EvolutionSummaryResponse(
        summary_bullets=bullets, base_sha=base_sha, head_sha=head_sha
    )


@router.get(
    "/repositories/{repo_id}/evolution/insights",
    response_model=EvolutionInsightsResponse,
)
def get_evolution_insights(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    snapshots = (
        db.query(CommitSnapshot)
        .filter(CommitSnapshot.repository_id == repo_id)
        .order_by(asc(CommitSnapshot.committed_at))
        .all()
    )

    if not snapshots:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No snapshots found"
        )

    # Fetch all component snapshots to analyze modules
    all_comps = (
        db.query(ComponentSnapshot)
        .join(CommitSnapshot, ComponentSnapshot.commit_snapshot_id == CommitSnapshot.id)
        .filter(CommitSnapshot.repository_id == repo_id)
        .all()
    )

    # Defaults
    largest_arch = "No major changes"
    impactful_rel = "No releases tagged"
    biggest_refactor = "No refactoring detected"
    stable_mod = "No components identified"
    fastest_grow = "No growth identified"
    frequent_api = "No APIs identified"

    # 1. Largest architectural change & Biggest Refactoring
    max_arch_diff = -1
    max_refactor_val = 1  # only trigger on negative cc_diff

    # Group components by commit_snapshot_id
    comps_by_snap = {}
    for c in all_comps:
        comps_by_snap.setdefault(c.commit_snapshot_id, []).append(c)

    for idx, snap in enumerate(snapshots):
        if idx > 0:
            prev = snapshots[idx - 1]
            curr_names = {c.name for c in comps_by_snap.get(snap.id, [])}
            prev_names = {c.name for c in comps_by_snap.get(prev.id, [])}
            arch_diff = len(curr_names ^ prev_names)
            if arch_diff > max_arch_diff:
                max_arch_diff = arch_diff
                largest_arch = f"Commit {snap.commit_sha[:7]} by {snap.author_name or 'Bob'}: '{snap.message.splitlines()[0]}' (added/removed {arch_diff} modules)"

            # Biggest refactoring (largest decrease in complexity)
            cc_diff = snap.complexity_total - prev.complexity_total
            if cc_diff < 0 and abs(cc_diff) > max_refactor_val:
                max_refactor_val = abs(cc_diff)
                biggest_refactor = f"Commit {snap.commit_sha[:7]}: complexity decreased by {abs(cc_diff)} points in refactoring path"

    # 2. Most impactful release
    max_impact = 0
    for idx, snap in enumerate(snapshots):
        msg = (snap.message or "").lower()
        if any(k in msg for k in ["release", "bump version", "v1.", "v2."]):
            if idx > 0:
                prev = snapshots[idx - 1]
                impact = (
                    abs(snap.code_lines - prev.code_lines)
                    + abs(snap.complexity_total - prev.complexity_total) * 5
                )
                if impact > max_impact:
                    max_impact = impact
                    impactful_rel = f"Release {snap.commit_sha[:7]} ('{snap.message.splitlines()[0]}'): impacted {impact} metric scale units"
    if impactful_rel == "No releases tagged":
        # fallback to largest overall commit
        max_any_impact = 0
        for idx, snap in enumerate(snapshots):
            if idx > 0:
                prev = snapshots[idx - 1]
                impact = (
                    abs(snap.code_lines - prev.code_lines)
                    + abs(snap.complexity_total - prev.complexity_total) * 5
                )
                if impact > max_any_impact:
                    max_any_impact = impact
                    impactful_rel = f"Commit {snap.commit_sha[:7]} ('{snap.message.splitlines()[0]}'): impacted {impact} metric scale units"

    # 3. Component stats (stable module, fastest growing, frequent API)
    comp_loc_series = {}
    comp_mod_counts = {}
    for c in all_comps:
        comp_loc_series.setdefault(c.path, []).append(c.code_lines)
        comp_mod_counts[c.path] = comp_mod_counts.get(c.path, 0) + 1

    # Most stable module: Lowest variance in LOC (min variance/stdev or just stable code lines)
    min_variance = float("inf")
    for path, locs in comp_loc_series.items():
        if len(locs) >= 2:
            mean = sum(locs) / len(locs)
            variance = sum((x - mean) ** 2 for x in locs) / len(locs)
            if variance < min_variance:
                min_variance = variance
                name = path.split("/")[-1] or path
                stable_mod = f"Module '{name}' ({path}): LOC variance of {round(variance, 2)} over time"

    # Fastest growing service
    max_growth = -1
    for path, locs in comp_loc_series.items():
        if len(locs) >= 2:
            growth = locs[-1] - locs[0]
            if growth > max_growth:
                max_growth = growth
                name = path.split("/")[-1] or path
                fastest_grow = f"Service '{name}': grew by {growth} LOC across commits"

    # Most frequently modified API
    max_mods = -1
    for path, count in comp_mod_counts.items():
        if (
            "api" in path.lower()
            or "route" in path.lower()
            or "controller" in path.lower()
        ):
            if count > max_mods:
                max_mods = count
                name = path.split("/")[-1] or path
                frequent_api = f"API '{name}' ({path}): modified {count} times across analyzed history"

    if frequent_api == "No APIs identified":
        # Fallback to any most modified component
        max_any_mods = -1
        for path, count in comp_mod_counts.items():
            if count > max_any_mods:
                max_any_mods = count
                name = path.split("/")[-1] or path
                frequent_api = f"Component '{name}': modified {count} times across analyzed history"

    return EvolutionInsightsResponse(
        largest_arch_change=largest_arch,
        most_impactful_release=impactful_rel,
        biggest_refactoring=biggest_refactor,
        most_stable_module=stable_mod,
        fastest_growing_service=fastest_grow,
        most_frequently_modified_api=frequent_api,
    )


@router.get(
    "/repositories/{repo_id}/evolution/analytics",
    response_model=EvolutionAnalyticsResponse,
)
def get_evolution_analytics(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    snapshots = (
        db.query(CommitSnapshot)
        .filter(CommitSnapshot.repository_id == repo_id)
        .order_by(asc(CommitSnapshot.committed_at))
        .all()
    )

    if len(snapshots) < 2:
        return EvolutionAnalyticsResponse(
            longest_common_subgraph={"nodes": [], "edges": []},
            change_points=[],
            community_evolution=[],
            trend_slopes={"loc_slope": 0.0, "cc_slope": 0.0},
        )

    # 1. Longest Common Subgraph (between first and last snapshots)
    first_snap = snapshots[0]
    last_snap = snapshots[-1]

    nodes_a = {
        n.get("id"): n
        for n in (first_snap.graph_data or {}).get("nodes", [])
        if n.get("id")
    }
    nodes_b = {
        n.get("id"): n
        for n in (last_snap.graph_data or {}).get("nodes", [])
        if n.get("id")
    }
    common_node_ids = set(nodes_a.keys()) & set(nodes_b.keys())
    common_nodes = [nodes_a[nid] for nid in common_node_ids]

    edges_a = {
        (e.get("source"), e.get("target")): e
        for e in (first_snap.graph_data or {}).get("edges", [])
        if e.get("source") and e.get("target")
    }
    edges_b = {
        (e.get("source"), e.get("target")): e
        for e in (last_snap.graph_data or {}).get("edges", [])
        if e.get("source") and e.get("target")
    }
    common_edge_keys = set(edges_a.keys()) & set(edges_b.keys())
    common_edges = [edges_a[ekey] for ekey in common_edge_keys]

    lcs = {
        "nodes": common_nodes,
        "edges": common_edges,
        "nodes_count": len(common_nodes),
        "edges_count": len(common_edges),
    }

    # 2. Change-Point Detection (complexity shifts > 8 or LOC shifts > 250)
    change_points = []
    for idx, snap in enumerate(snapshots):
        if idx > 0:
            prev = snapshots[idx - 1]
            loc_diff = abs(snap.code_lines - prev.code_lines)
            cc_diff = abs(snap.complexity_total - prev.complexity_total)
            if loc_diff > 250 or cc_diff > 8:
                change_points.append(
                    {
                        "commit_sha": snap.commit_sha,
                        "committed_at": snap.committed_at.isoformat(),
                        "loc_shift": snap.code_lines - prev.code_lines,
                        "cc_shift": snap.complexity_total - prev.complexity_total,
                        "reason": f"Change-point detected: LOC changed by {snap.code_lines - prev.code_lines}, CC by {snap.complexity_total - prev.complexity_total} points.",
                    }
                )

    # 3. Community Evolution (added/removed modules)
    comp_snapshots = (
        db.query(ComponentSnapshot)
        .join(CommitSnapshot, ComponentSnapshot.commit_snapshot_id == CommitSnapshot.id)
        .filter(CommitSnapshot.repository_id == repo_id)
        .all()
    )
    comps_by_snap = {}
    for c in comp_snapshots:
        comps_by_snap.setdefault(c.commit_snapshot_id, []).append(c)

    community_evolution = []
    for idx, snap in enumerate(snapshots):
        if idx > 0:
            prev = snapshots[idx - 1]
            prev_names = {c.name for c in comps_by_snap.get(prev.id, [])}
            curr_names = {c.name for c in comps_by_snap.get(snap.id, [])}
            added = list(curr_names - prev_names)
            removed = list(prev_names - curr_names)
            if added or removed:
                community_evolution.append(
                    {
                        "commit_sha": snap.commit_sha,
                        "committed_at": snap.committed_at.isoformat(),
                        "added_modules": added,
                        "removed_modules": removed,
                    }
                )

    # 4. Trend Analysis & Time-series slopes (Least Squares Slope)
    n = len(snapshots)
    sum_x = sum(i for i in range(n))
    sum_x2 = sum(i * i for i in range(n))

    sum_y_loc = sum(s.code_lines for s in snapshots)
    sum_xy_loc = sum(i * s.code_lines for i, s in enumerate(snapshots))

    sum_y_cc = sum(s.complexity_total for s in snapshots)
    sum_xy_cc = sum(i * s.complexity_total for i, s in enumerate(snapshots))

    denominator = n * sum_x2 - sum_x * sum_x
    loc_slope = 0.0
    cc_slope = 0.0
    if denominator != 0:
        loc_slope = round((n * sum_xy_loc - sum_x * sum_y_loc) / denominator, 3)
        cc_slope = round((n * sum_xy_cc - sum_x * sum_y_cc) / denominator, 3)

    return EvolutionAnalyticsResponse(
        longest_common_subgraph=lcs,
        change_points=change_points,
        community_evolution=community_evolution,
        trend_slopes={"loc_slope": loc_slope, "cc_slope": cc_slope},
    )
