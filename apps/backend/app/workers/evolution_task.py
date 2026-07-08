import logging
import math
import os
import uuid
from datetime import datetime, timezone

from app.core.celery_app import celery_app
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.evolution import CommitSnapshot, ComponentSnapshot
from app.repositories.job import job_repository
from app.repositories.repository import repository_repository
from app.services.architecture_detector import ArchitectureDetector
from app.services.ast_service import TreeSitterAST
from app.services.language_detector import LanguageDetector
from app.services.metadata_engine import MetadataEngine
from app.services.relationship_builder import RelationshipBuilder
from app.services.scanner import RepositoryScanner
from app.services.symbol_extractor import SymbolExtractor
from app.utils.git import (
    checkout_commit,
    get_commit_history,
    get_current_ref,
    restore_ref,
)

logger = logging.getLogger(__name__)

# Standard domain rules used for in-memory grouping
DOMAIN_RULES = {
    "Authentication & Security": {
        "keywords": [
            "auth",
            "login",
            "jwt",
            "token",
            "session",
            "register",
            "user",
            "credential",
            "identity",
            "permission",
            "role",
            "secure",
            "hash",
        ],
        "description": "Handles identity verification, secure access tokens, user registration, credentials, and session access control.",
    },
    "Billing & Payment": {
        "keywords": [
            "bill",
            "pay",
            "stripe",
            "invoice",
            "price",
            "checkout",
            "card",
            "subscription",
            "transaction",
            "payment",
        ],
        "description": "Orchestrates customer subscriptions, billing plans, invoices, and payment gateway interactions.",
    },
    "Database & Storage": {
        "keywords": [
            "database",
            "db",
            "postgres",
            "mysql",
            "sqlite",
            "mongo",
            "table",
            "model",
            "sql",
            "repository",
            "dao",
        ],
        "description": "Manages persistent schemas, database connections, class entities, and low-level ORM transactions.",
    },
    "Analytics & Monitoring": {
        "keywords": [
            "metric",
            "log",
            "analytics",
            "monitor",
            "prometheus",
            "grafana",
            "telemetry",
            "tracing",
            "datadog",
            "stats",
        ],
        "description": "Tracks service health metrics, user engagement analytics, diagnostic audit trails, and telemetry dashboards.",
    },
    "Notifications & Messaging": {
        "keywords": [
            "email",
            "mail",
            "sms",
            "notify",
            "notification",
            "slack",
            "message",
            "send",
            "alert",
        ],
        "description": "Dispatches external transactional emails, SMS triggers, Slack alerts, and push notifications.",
    },
    "Background Tasks & Queues": {
        "keywords": [
            "celery",
            "task",
            "worker",
            "job",
            "queue",
            "consumer",
            "cron",
            "schedule",
            "async",
        ],
        "description": "Processes scheduled cron jobs, queue triggers, and background asynchronous task workers.",
    },
}


def detect_in_memory_cycles(graph) -> int:
    adj = {}
    for edge in graph.edges:
        if edge.source_id not in adj:
            adj[edge.source_id] = []
        adj[edge.source_id].append(edge.target_id)

    visited = {}
    cycles = 0

    def dfs(node_id, path):
        visited[node_id] = 1  # visiting
        path.add(node_id)

        for neighbor in adj.get(node_id, []):
            if neighbor in path:
                nonlocal cycles
                cycles += 1
            elif neighbor not in visited:
                dfs(neighbor, path)

        path.remove(node_id)
        visited[node_id] = 2  # fully visited

    for node_id in graph.nodes:
        if node_id not in visited:
            dfs(node_id, set())

    return cycles


def calculate_tech_debt(
    complexity_total: int, code_lines: int, doc_coverage: float, coupling_score: float
) -> float:
    """Computes technical debt score out of 100 based on density, docs gap, and coupling."""
    # Complexity Density: complexity per line of code. Normalized to max 1.0
    complexity_density = complexity_total / max(code_lines, 1)
    density = min(1.0, complexity_density)

    # Documentation Gap: 1.0 minus coverage
    doc_gap = 1.0 - doc_coverage

    # Combined score
    score = (density * 45.0) + (doc_gap * 40.0) + (coupling_score * 15.0)
    return round(score, 1)


@celery_app.task(name="app.workers.evolution_task.analyze_repository_timeline_task")
def analyze_repository_timeline_task(
    repo_id: str, job_id: str, num_checkpoints: int = 10
) -> bool:
    db = SessionLocal()
    repo_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)

    try:
        repo = repository_repository.get_by_id(db, repo_id)
        job = job_repository.get_by_id(db, job_id)
        if not repo or not job:
            logger.error(f"Repository {repo_id} or Job {job_id} not found.")
            return False

        job.status = "running"
        job.logs = f"Starting timeline evolution analysis for {repo.full_name}\n"
        job_repository.save(db, job)

        if not os.path.exists(repo_dir):
            job.status = "failed"
            job.logs += (
                f"Error: Repository checkout directory {repo_dir} does not exist."
            )
            job.finished_at = datetime.now(timezone.utc)
            job_repository.save(db, job)
            return False

        # 1. Fetch entire commit history
        job.logs += "Reading git history...\n"
        job_repository.save(db, job)
        commits = get_commit_history(repo_dir)
        num_commits = len(commits)
        job.logs += f"Discovered {num_commits} commits.\n"
        job_repository.save(db, job)

        if num_commits == 0:
            job.status = "failed"
            job.logs += "Error: No commits found in git history."
            job.finished_at = datetime.now(timezone.utc)
            job_repository.save(db, job)
            return False

        # 2. Evenly sample checkpoints
        if num_commits <= num_checkpoints:
            sampled_commits = commits
        else:
            indices = [
                int(i * (num_commits - 1) / (num_checkpoints - 1))
                for i in range(num_checkpoints)
            ]
            indices = sorted(list(set(indices)))  # deduplicate
            sampled_commits = [commits[idx] for idx in indices]

        job.logs += (
            f"Selected {len(sampled_commits)} checkpoints for detailed analysis.\n"
        )
        job_repository.save(db, job)

        # 3. Store original ref to restore at the end
        original_ref = get_current_ref(repo_dir)
        job.logs += f"Current checked out ref is: {original_ref}. Saving state.\n"
        job_repository.save(db, job)

        # Clear existing snapshots for this repository to allow full rebuild
        db.query(CommitSnapshot).filter(
            CommitSnapshot.repository_id == repo_id
        ).delete()
        db.commit()

        # Instantiate analysis services
        scanner = RepositoryScanner()
        detector = LanguageDetector()
        ast_gen = TreeSitterAST()
        extractor = SymbolExtractor()
        metadata_engine = MetadataEngine()
        relationship_builder = RelationshipBuilder()

        # 4. Sequentially analyze each sampled commit
        for idx, commit in enumerate(sampled_commits):
            sha = commit["sha"]
            job.logs += f"\n[{idx + 1}/{len(sampled_commits)}] Analyzing commit {sha[:8]} - '{commit['message'][:40]}'...\n"
            job_repository.save(db, job)

            try:
                # Check out commit
                checkout_commit(repo_dir, sha)

                # Scan files at this commit
                scan_result = scanner.scan(repo_dir)

                file_metas = []
                extractions = {}
                asts = {}
                file_stats = {}

                total_files = 0
                total_lines = 0
                code_lines_tot = 0
                comment_lines_tot = 0
                complexity_tot = 0
                complexity_max = 0
                languages_lines = {}

                # 4.1 Process each scanned file
                for scanned_file in scan_result.files:
                    detection = detector.detect(
                        scanned_file.absolute_path, extension=scanned_file.extension
                    )
                    lang = detection.language

                    try:
                        with open(
                            scanned_file.absolute_path,
                            "r",
                            encoding="utf-8",
                            errors="ignore",
                        ) as f:
                            source_content = f.read()
                    except Exception:
                        source_content = ""

                    ast_result = None
                    extraction_result = None

                    if ast_gen.supports(lang):
                        if scanned_file.extension == ".tsx":
                            ast_result = ast_gen.parse_tsx_file(
                                scanned_file.absolute_path, source=source_content
                            )
                        else:
                            ast_result = ast_gen.parse_file(
                                scanned_file.absolute_path, lang, source=source_content
                            )

                        if ast_result and not ast_result.error:
                            extraction_result = extractor.extract(ast_result)
                            asts[scanned_file.relative_path] = ast_result
                            extractions[scanned_file.relative_path] = extraction_result

                    file_meta = metadata_engine.analyse_file(
                        file_path=scanned_file.relative_path,
                        source=source_content,
                        language=lang,
                        file_size=scanned_file.size_bytes,
                        ast_result=ast_result,
                        extraction=extraction_result,
                    )
                    file_metas.append(file_meta)

                    # Accumulate global metrics
                    total_files += 1
                    total_lines += file_meta.lines.total
                    code_lines_tot += file_meta.lines.code
                    comment_lines_tot += file_meta.lines.comment
                    complexity_tot += file_meta.complexity.total
                    if file_meta.complexity.max > complexity_max:
                        complexity_max = file_meta.complexity.max

                    # Languages line count breakdown
                    lang_name = lang.value
                    languages_lines[lang_name] = (
                        languages_lines.get(lang_name, 0) + file_meta.lines.code
                    )

                    # Cache file metadata
                    file_stats[scanned_file.relative_path] = {
                        "complexity_total": file_meta.complexity.total,
                        "complexity_average": file_meta.complexity.average,
                        "complexity_max": file_meta.complexity.max,
                        "code_lines": file_meta.lines.code,
                        "comment_lines": file_meta.lines.comment,
                        "total_lines": file_meta.lines.total,
                        "doc_coverage": file_meta.documentation.coverage_percent,
                        "doc_symbols": file_meta.documentation.documented_symbols,
                        "total_documentable": file_meta.documentation.total_documentable,
                    }

                # Global stats calculations
                total_documentable = sum(
                    m.documentation.total_documentable for m in file_metas
                )
                total_documented = sum(
                    m.documentation.documented_symbols for m in file_metas
                )
                global_doc_coverage = total_documented / max(total_documentable, 1)
                complexity_avg_global = complexity_tot / max(total_files, 1)

                # 4.2 Build in-memory graph
                graph = relationship_builder.build(extractions, asts)
                dependencies_count = len(graph.edges)

                # 4.3 Group files and symbols into domains in-memory
                node_domains = {}
                for node_id, node in graph.nodes.items():
                    name_lower = node.name.lower()
                    path_lower = node.file_path.lower()
                    best_domain = None
                    max_matches = 0
                    for dom, config in DOMAIN_RULES.items():
                        matches = sum(
                            1
                            for kw in config["keywords"]
                            if kw in name_lower or kw in path_lower
                        )
                        if matches > max_matches:
                            max_matches = matches
                            best_domain = dom
                    if best_domain and max_matches > 0:
                        node_domains[node.id] = best_domain

                # Bidirectional BFS propagation for domain mapping
                neighbors = {}
                for edge in graph.edges:
                    if edge.source_id not in neighbors:
                        neighbors[edge.source_id] = set()
                    if edge.target_id not in neighbors:
                        neighbors[edge.target_id] = set()
                    neighbors[edge.source_id].add(edge.target_id)
                    neighbors[edge.target_id].add(edge.source_id)

                unclassified = [
                    n for n in graph.nodes.values() if n.id not in node_domains
                ]
                for _ in range(2):
                    for n in unclassified:
                        adj_doms = [
                            node_domains[neigh]
                            for neigh in neighbors.get(n.id, [])
                            if neigh in node_domains
                        ]
                        if adj_doms:
                            most_common = max(set(adj_doms), key=adj_doms.count)
                            node_domains[n.id] = most_common

                # Group files belonging to domains
                domain_files = {}
                for node_id, dom in node_domains.items():
                    node = graph.get_node(node_id)
                    if node and node.file_path and node.file_path != "<external>":
                        if dom not in domain_files:
                            domain_files[dom] = set()
                        domain_files[dom].add(node.file_path)

                # Add fallback "Core System" for files not classified
                core_files = set(file_stats.keys()) - {
                    f for files in domain_files.values() for f in files
                }
                if core_files:
                    domain_files["Core System"] = core_files

                # 4.4 Folder-level stats compilation
                folder_stats = {}
                for rel_path, f_stat in file_stats.items():
                    parts = rel_path.split("/")[:-1]
                    accum = []
                    for p in parts:
                        accum.append(p)
                        folder_path = "/".join(accum)
                        if folder_path not in folder_stats:
                            folder_stats[folder_path] = {
                                "complexity_total": 0,
                                "complexity_max": 0,
                                "code_lines": 0,
                                "comment_lines": 0,
                                "total_lines": 0,
                                "file_count": 0,
                                "doc_symbols": 0,
                                "total_documentable": 0,
                            }
                        fs = folder_stats[folder_path]
                        fs["complexity_total"] += f_stat["complexity_total"]
                        fs["code_lines"] += f_stat["code_lines"]
                        fs["comment_lines"] += f_stat["comment_lines"]
                        fs["total_lines"] += f_stat["total_lines"]
                        fs["file_count"] += 1
                        fs["doc_symbols"] += f_stat["doc_symbols"]
                        fs["total_documentable"] += f_stat["total_documentable"]
                        if f_stat["complexity_max"] > fs["complexity_max"]:
                            fs["complexity_max"] = f_stat["complexity_max"]

                # 4.5 Resolve dependencies & coupling between components
                file_deps = {f_path: set() for f_path in file_stats.keys()}
                file_devs = {f_path: set() for f_path in file_stats.keys()}
                for edge in graph.edges:
                    src_node = graph.get_node(edge.source_id)
                    tgt_node = graph.get_node(edge.target_id)
                    if src_node and tgt_node:
                        src_file = src_node.file_path
                        tgt_file = tgt_node.file_path
                        if (
                            src_file
                            and tgt_file
                            and src_file != tgt_file
                            and src_file in file_stats
                            and tgt_file in file_stats
                        ):
                            file_deps[src_file].add(tgt_file)
                            file_devs[tgt_file].add(src_file)

                # Folder-level relationships
                folder_deps = {fol: set() for fol in folder_stats.keys()}
                folder_devs = {fol: set() for fol in folder_stats.keys()}
                for src_file, tgts in file_deps.items():
                    for tgt_file in tgts:
                        src_folders = [
                            f
                            for f in folder_stats.keys()
                            if src_file.startswith(f + "/")
                        ]
                        tgt_folders = [
                            f
                            for f in folder_stats.keys()
                            if tgt_file.startswith(f + "/")
                        ]
                        for sf in src_folders:
                            for tf in tgt_folders:
                                if sf != tf:
                                    folder_deps[sf].add(tf)
                                    folder_devs[tf].add(sf)

                # Domain-level relationships
                domain_deps = {d: set() for d in domain_files.keys()}
                domain_devs = {d: set() for d in domain_files.keys()}
                for src_file, tgts in file_deps.items():
                    src_doms = [
                        d for d, files in domain_files.items() if src_file in files
                    ]
                    for tgt_file in tgts:
                        tgt_doms = [
                            d for d, files in domain_files.items() if tgt_file in files
                        ]
                        for sd in src_doms:
                            for td in tgt_doms:
                                if sd != td:
                                    domain_deps[sd].add(td)
                                    domain_devs[td].add(sd)

                # 4.6 Save CommitSnapshot
                class MockNode:
                    def __init__(self, id, name, type, properties):
                        self.id = id
                        self.name = name
                        self.type = type
                        self.properties = properties

                class MockRel:
                    def __init__(self, source_id, target_id, type, properties):
                        self.source_id = source_id
                        self.target_id = target_id
                        self.type = type
                        self.properties = properties

                detector = ArchitectureDetector()
                mock_nodes = [
                    MockNode(
                        id=n.id,
                        name=n.name,
                        type=n.kind,
                        properties={"path": n.file_path, "file_path": n.file_path},
                    )
                    for n in graph.nodes.values()
                ]
                mock_rels = [
                    MockRel(
                        source_id=e.source_id,
                        target_id=e.target_id,
                        type=e.kind.value if hasattr(e.kind, "value") else str(e.kind),
                        properties={},
                    )
                    for e in graph.edges
                ]

                patterns = []
                try:
                    patterns.append(detector.detect_mvc(mock_nodes, mock_rels))
                    patterns.append(detector.detect_layered(mock_nodes, mock_rels))
                    patterns.append(detector.detect_clean(mock_nodes, mock_rels))
                    patterns.append(
                        detector.detect_repository_pattern(mock_nodes, mock_rels)
                    )
                    patterns.append(detector.detect_cqrs(mock_nodes, mock_rels))
                    patterns.append(detector.detect_event_driven(mock_nodes, mock_rels))
                    patterns.append(
                        detector.detect_microservices(mock_nodes, mock_rels)
                    )
                    patterns.append(
                        detector.detect_modular_monolith(mock_nodes, mock_rels)
                    )
                except Exception as ex:
                    logger.error(
                        f"Error running ArchitectureDetector in timeline task: {ex}"
                    )

                detected_patterns = [
                    p for p in patterns if p.get("confidence", 0.0) > 0.1
                ]

                # Cycles detection
                cycles_count = detect_in_memory_cycles(graph)

                # Health score calculation
                doc_health = global_doc_coverage * 35.0
                loc_per_cc = code_lines_tot / max(complexity_tot, 1)
                comp_health = min(max((loc_per_cc - 3.0) / 17.0, 0.0), 1.0) * 35.0
                cycle_health = max(15.0 - (cycles_count * 3.0), 0.0)

                # Coupling average of domains
                domain_couplings = []
                for dom, files in domain_files.items():
                    deps = len(domain_deps.get(dom, []))
                    devs = len(domain_devs.get(dom, []))
                    domain_couplings.append(deps / max(deps + devs, 1))
                avg_coupling = (
                    sum(domain_couplings) / max(len(domain_couplings), 1)
                    if domain_couplings
                    else 0.0
                )
                coupling_health = (1.0 - avg_coupling) * 15.0

                health_score = round(
                    min(
                        max(
                            doc_health + comp_health + cycle_health + coupling_health,
                            0.0,
                        ),
                        100.0,
                    ),
                    2,
                )

                # Features 3 & 4: Complexity Timeline Metrics
                total_functions = sum(
                    len(ex.functions) + len(ex.methods) for ex in extractions.values()
                )
                average_function_size = round(
                    code_lines_tot / max(total_functions, 1), 2
                )
                cohesion_score = round(
                    max(
                        0.1,
                        min(
                            1.0,
                            1.0 - (len(graph.edges) / max(len(graph.nodes) * 4.0, 1.0)),
                        ),
                    ),
                    2,
                )

                vol_val = max(code_lines_tot * 10.0, 1.0)
                avg_cc = complexity_tot / max(total_files, 1.0)
                mi_raw = (
                    171.0
                    - 5.2 * math.log(vol_val)
                    - 0.23 * avg_cc
                    - 16.2 * math.log(max(average_function_size, 1.0))
                )
                maintainability_index = round(
                    max(0.0, min(100.0, mi_raw * 100.0 / 171.0)), 2
                )

                commit_snap_id = str(uuid.uuid4())
                db_commit_snap = CommitSnapshot(
                    id=commit_snap_id,
                    repository_id=repo_id,
                    commit_sha=sha,
                    author_name=commit["author_name"],
                    author_email=commit["author_email"],
                    committed_at=commit["committed_at"],
                    message=commit["message"],
                    total_files=total_files,
                    total_lines=total_lines,
                    code_lines=code_lines_tot,
                    comment_lines=comment_lines_tot,
                    complexity_total=complexity_tot,
                    complexity_average=round(complexity_avg_global, 2),
                    complexity_max=complexity_max,
                    documentation_coverage=round(global_doc_coverage, 2),
                    dependencies_count=dependencies_count,
                    languages=languages_lines,
                    health_score=health_score,
                    architecture_patterns=detected_patterns,
                    graph_data=graph.to_dict(),
                    average_function_size=average_function_size,
                    cohesion_score=cohesion_score,
                    maintainability_index=maintainability_index,
                )
                db.add(db_commit_snap)

                # 4.7 Save ComponentSnapshots
                # 4.7.1 Save Domain Snapshots
                for dom, files in domain_files.items():
                    dom_comp_lines = sum(file_stats[f]["code_lines"] for f in files)
                    dom_comm_lines = sum(file_stats[f]["comment_lines"] for f in files)
                    _dom_total_lines = sum(file_stats[f]["total_lines"] for f in files)
                    dom_complexity = sum(
                        file_stats[f]["complexity_total"] for f in files
                    )
                    dom_max_comp = max(
                        (file_stats[f]["complexity_max"] for f in files), default=0
                    )

                    dom_doc_syms = sum(file_stats[f]["doc_symbols"] for f in files)
                    dom_doc_able = sum(
                        file_stats[f]["total_documentable"] for f in files
                    )
                    dom_doc_coverage = dom_doc_syms / max(dom_doc_able, 1)

                    deps = len(domain_deps.get(dom, []))
                    devs = len(domain_devs.get(dom, []))
                    coupling = deps / max(deps + devs, 1)
                    tech_debt = calculate_tech_debt(
                        dom_complexity, dom_comp_lines, dom_doc_coverage, coupling
                    )

                    db_comp = ComponentSnapshot(
                        id=str(uuid.uuid4()),
                        commit_snapshot_id=commit_snap_id,
                        path=dom,
                        type="domain",
                        name=dom,
                        complexity_total=dom_complexity,
                        complexity_average=round(
                            dom_complexity / max(len(files), 1), 2
                        ),
                        complexity_max=dom_max_comp,
                        code_lines=dom_comp_lines,
                        comment_lines=dom_comm_lines,
                        dependencies_count=deps,
                        dependents_count=devs,
                        coupling_score=round(coupling, 2),
                        technical_debt_score=tech_debt,
                    )
                    db.add(db_comp)

                # 4.7.2 Save Folder Snapshots
                for fol, stats in folder_stats.items():
                    fol_doc_cov = stats["doc_symbols"] / max(
                        stats["total_documentable"], 1
                    )
                    deps = len(folder_deps.get(fol, []))
                    devs = len(folder_devs.get(fol, []))
                    coupling = deps / max(deps + devs, 1)
                    tech_debt = calculate_tech_debt(
                        stats["complexity_total"],
                        stats["code_lines"],
                        fol_doc_cov,
                        coupling,
                    )

                    db_comp = ComponentSnapshot(
                        id=str(uuid.uuid4()),
                        commit_snapshot_id=commit_snap_id,
                        path=fol,
                        type="folder",
                        name=fol.split("/")[-1],
                        complexity_total=stats["complexity_total"],
                        complexity_average=round(
                            stats["complexity_total"] / max(stats["file_count"], 1), 2
                        ),
                        complexity_max=stats["complexity_max"],
                        code_lines=stats["code_lines"],
                        comment_lines=stats["comment_lines"],
                        dependencies_count=deps,
                        dependents_count=devs,
                        coupling_score=round(coupling, 2),
                        technical_debt_score=tech_debt,
                    )
                    db.add(db_comp)

                # 4.7.3 Save File Snapshots (filter to code files to save database space, skipping assets)
                for f_path, stats in file_stats.items():
                    # Only save source files that contain actual code lines or are of code extension
                    if stats["total_lines"] == 0:
                        continue

                    f_doc_cov = stats["doc_symbols"] / max(
                        stats["total_documentable"], 1
                    )
                    deps = len(file_deps.get(f_path, []))
                    devs = len(file_devs.get(f_path, []))
                    coupling = deps / max(deps + devs, 1)
                    tech_debt = calculate_tech_debt(
                        stats["complexity_total"],
                        stats["code_lines"],
                        f_doc_cov,
                        coupling,
                    )

                    db_comp = ComponentSnapshot(
                        id=str(uuid.uuid4()),
                        commit_snapshot_id=commit_snap_id,
                        path=f_path,
                        type="file",
                        name=f_path.split("/")[-1],
                        complexity_total=stats["complexity_total"],
                        complexity_average=round(stats["complexity_average"], 2),
                        complexity_max=stats["complexity_max"],
                        code_lines=stats["code_lines"],
                        comment_lines=stats["comment_lines"],
                        dependencies_count=deps,
                        dependents_count=devs,
                        coupling_score=round(coupling, 2),
                        technical_debt_score=tech_debt,
                    )
                    db.add(db_comp)

                # Commit snapshots database updates
                db.commit()
                job.logs += f"Commit {sha[:8]} parsed successfully.\n"
                job_repository.save(db, job)

            except Exception as commit_err:
                db.rollback()
                logger.error(f"Error parsing commit {sha}: {str(commit_err)}")
                job.logs += (
                    f"Warning: Failed to parse commit {sha}: {str(commit_err)}\n"
                )
                job_repository.save(db, job)

        # 5. Restore original repository branch state
        job.logs += f"\nTimeline analysis completed. Restoring repository state back to {original_ref}...\n"
        job_repository.save(db, job)
        restore_ref(repo_dir, original_ref)

        job.status = "completed"
        job.finished_at = datetime.now(timezone.utc)
        job.logs += "Successfully completed Semantic Code Time Machine analysis!"
        job_repository.save(db, job)
        return True

    except Exception as e:
        db.rollback()
        logger.error(f"Exception during timeline analysis: {str(e)}")
        try:
            job = job_repository.get_by_id(db, job_id)
            if job:
                job.status = "failed"
                job.logs += f"\nUnexpected Exception: {str(e)}"
                job.finished_at = datetime.now(timezone.utc)
                job_repository.save(db, job)
            if repo_dir and original_ref:
                restore_ref(repo_dir, original_ref)
        except Exception as restore_err:
            logger.error(
                f"Failed to restore original branch during recovery: {restore_err}"
            )
        return False
    finally:
        db.close()
