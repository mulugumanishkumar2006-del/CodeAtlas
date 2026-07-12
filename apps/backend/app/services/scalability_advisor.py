"""
ScalabilityAdvisorService
==========================
Feature 4 — Detects scalability bottlenecks and recommends 9 infrastructure patterns:

  1.  Caching              — Redis / Memcached for read hotspots
  2.  CDN                  — Static asset delivery at the edge
  3.  Load Balancer        — Distribute traffic across replicas
  4.  Queue / Message Bus  — Async offloading of heavy synchronous ops
  5.  Read Replica         — Separate read/write DB traffic
  6.  Database Partitioning— Horizontal table splitting by range/hash
  7.  Sharding             — Horizontal data distribution across DB nodes
  8.  Service Mesh         — Manage many service-to-service connections
  9.  Horizontal Scaling   — Add instances instead of bigger machines

Each advisory includes: why, where, evidence, benefits, step-by-step implementation guide, estimated improvement.
"""

import uuid
from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.models.file import File
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.schemas.advisor import ScalabilityAdvisory, ScalabilityReport


def _sid() -> str:
    return f"scl_{uuid.uuid4().hex[:8]}"


def _severity(score: float) -> str:
    if score >= 0.80:
        return "Critical"
    if score >= 0.60:
        return "High"
    if score >= 0.38:
        return "Medium"
    return "Low"


# ---------------------------------------------------------------------------
# Detectors — one per technique
# ---------------------------------------------------------------------------


def _detect_caching(
    nodes: List[GraphNode],
    relationships: List[GraphRelationship],
    fan_in: Dict,
) -> Optional[ScalabilityAdvisory]:
    redis_present = any(
        "redis" in n.name.lower() or "cache" in n.name.lower() for n in nodes
    )
    if redis_present:
        return None  # already caching

    hotspots = [
        (n, fan_in[n.id])
        for n in nodes
        if fan_in[n.id] >= 5
        and n.type.lower() in ("function", "method", "service", "api endpoint")
    ]
    hotspots.sort(key=lambda x: -x[1])

    if not hotspots:
        return None

    evidence = ["No Redis/cache layer found in the repository graph."] + [
        f"`{n.name}` ({n.type}) — {fi} callers, no caching." for n, fi in hotspots[:4]
    ]
    conf = min(0.65 + len(hotspots) * 0.04, 0.93)

    return ScalabilityAdvisory(
        id=_sid(),
        recommendation="Add Redis Cache",
        technique="caching",
        category="Caching",
        icon="⚡",
        severity=_severity(conf),
        confidence=round(conf, 2),
        issue_description=f"{len(hotspots)} high-frequency read hotspot(s) exist with no caching layer. Every call hits the database directly.",
        evidence=evidence,
        why="High fan-in read nodes are being called repeatedly without result caching. Adding a Cache-Aside layer with Redis (already in the infrastructure stack) eliminates redundant DB queries.",
        where=[n.name for n, _ in hotspots[:5]],
        benefits=[
            "50–70% reduction in database read load",
            "Sub-millisecond response for cached results",
            "Reduced database connection pressure",
            "Horizontal scaling of read throughput without DB changes",
        ],
        implementation_steps=[
            "Install `redis-py` or `aioredis` and configure connection pool.",
            "Wrap each hotspot with a cache decorator: `@cache(ttl=300, key='prefix:{args}')`.",
            "Add cache invalidation hooks on write operations that modify cached data.",
            "Monitor cache hit rate — target ≥ 70% for effectiveness.",
            "Set TTL based on data volatility (e.g., 60s for user sessions, 300s for reports).",
        ],
        estimated_improvement="50–70% reduction in read latency for top hotspots",
        effort="Low",
        tags=["caching", "redis", "performance"],
    )


def _detect_load_balancer(
    nodes: List[GraphNode],
    relationships: List[GraphRelationship],
    fan_in: Dict,
) -> Optional[ScalabilityAdvisory]:
    lb_present = any(
        any(
            kw in n.name.lower()
            for kw in ("nginx", "haproxy", "load_balancer", "traefik")
        )
        for n in nodes
    )
    if lb_present:
        return None

    entry_points = [n for n in nodes if fan_in[n.id] >= 8 and "api" in n.type.lower()]
    single_entry = [
        n for n in nodes if "main" in n.name.lower() and "api" in n.type.lower()
    ]
    candidates = entry_points or single_entry

    if not candidates:
        return None

    evidence = [
        f"Single entry point `{n.name}` handles {fan_in[n.id]} incoming connections — no load distribution detected."
        for n in candidates[:2]
    ]
    conf = 0.68

    return ScalabilityAdvisory(
        id=_sid(),
        recommendation="Add Load Balancer",
        technique="load_balancer",
        category="Infrastructure",
        icon="⚖️",
        severity=_severity(conf),
        confidence=round(conf, 2),
        issue_description="Single API entry point with no load distribution. All traffic is routed through one service instance.",
        evidence=evidence,
        why="With a single application instance, any CPU spike or memory pressure causes degraded service for all users. A load balancer enables horizontal scaling and zero-downtime deployments.",
        where=[n.name for n in candidates[:3]],
        benefits=[
            "Horizontal scaling: add instances without downtime",
            "Automatic failover if one instance crashes",
            "Zero-downtime rolling deployments",
            "SSL termination can be offloaded",
        ],
        implementation_steps=[
            "Configure Nginx (already in docker-compose) as a reverse proxy with upstream block.",
            "Set `upstream backend { server app:8000; server app2:8000; }` in nginx.conf.",
            "Ensure sessions are stored in Redis (not in-process) so any instance can serve any request.",
            "Health-check endpoint `/health` must return 200 for the load balancer to route traffic.",
            "Configure rolling update strategy in docker-compose or Kubernetes Deployment.",
        ],
        estimated_improvement="Linear throughput scaling with each added instance",
        effort="Low",
        tags=["load-balancer", "nginx", "scaling", "infrastructure"],
    )


def _detect_queue(
    nodes: List[GraphNode],
    relationships: List[GraphRelationship],
    files: List[Any],
    fan_in: Dict,
) -> Optional[ScalabilityAdvisory]:
    queue_present = any(
        any(
            kw in n.name.lower()
            for kw in ("celery", "queue", "worker", "kafka", "rabbitmq", "broker")
        )
        for n in nodes
    )
    # Look for long chains of sync operations
    heavy_service_nodes = [
        n for n in nodes if n.type.lower() == "service" and fan_in[n.id] >= 4
    ]

    evidence = []
    if heavy_service_nodes:
        evidence = [
            f"Service `{n.name}` is called synchronously by {fan_in[n.id]} callers — could be offloaded to a background worker."
            for n in heavy_service_nodes[:3]
        ]

    if queue_present and not evidence:
        return None

    conf = 0.72 if heavy_service_nodes else 0.45

    return ScalabilityAdvisory(
        id=_sid(),
        recommendation="Introduce Message Queue / Job Queue",
        technique="queue",
        category="Messaging",
        icon="📨",
        severity=_severity(conf),
        confidence=round(conf, 2),
        issue_description="Heavy processing operations are performed synchronously within the HTTP request cycle, blocking threads and adding latency.",
        evidence=evidence
        or [
            "No async processing patterns detected — long operations likely run in-process."
        ],
        why="Synchronous heavy operations (email sending, PDF generation, report computation, ML inference) block the HTTP worker thread and degrade response times for all concurrent users.",
        where=[n.name for n in heavy_service_nodes[:4]],
        benefits=[
            "HTTP responses returned instantly — background work runs separately",
            "Retry failed jobs automatically",
            "Scale workers independently of API servers",
            "Dead-letter queues capture permanently failing jobs",
        ],
        implementation_steps=[
            "Add Celery task: `@celery.task(bind=True, max_retries=3) def process_heavy_op(self, ...)`.",
            "Replace synchronous calls with `.delay()` or `.apply_async()` calls.",
            "Configure Redis as both Celery broker and result backend.",
            "Deploy Celery workers as a separate docker-compose service.",
            "Add Flower (`celery flower`) for task monitoring.",
        ],
        estimated_improvement="API response time reduced from seconds to milliseconds for affected endpoints",
        effort="Medium",
        tags=["queue", "celery", "async", "background-tasks"],
    )


def _detect_read_replica(
    nodes: List[GraphNode],
    relationships: List[GraphRelationship],
    fan_in: Dict,
) -> Optional[ScalabilityAdvisory]:
    replica_present = any(
        any(kw in n.name.lower() for kw in ("replica", "read_db", "slave", "follower"))
        for n in nodes
    )
    if replica_present:
        return None

    db_nodes = [n for n in nodes if n.type.lower() in ("database", "database table")]
    hotspot_dbs = [(n, fan_in[n.id]) for n in db_nodes if fan_in[n.id] >= 5]

    if not hotspot_dbs:
        return None

    evidence = [
        f"Database `{n.name}` is accessed by {fi} modules — no read replica configured."
        for n, fi in hotspot_dbs[:3]
    ]
    conf = min(0.65 + len(hotspot_dbs) * 0.06, 0.90)

    top_db = hotspot_dbs[0][0]
    return ScalabilityAdvisory(
        id=_sid(),
        recommendation="Add Read Replica",
        technique="read_replica",
        category="Database",
        icon="🗄️",
        severity=_severity(conf),
        confidence=round(conf, 2),
        issue_description=f"Database '{top_db.name}' receives both read and write traffic from {hotspot_dbs[0][1]} modules without any read/write separation.",
        evidence=evidence,
        why="Read traffic competing with writes for the same connection pool creates lock contention and slows both. A read replica routes all SELECT queries to a hot-standby, freeing the primary for writes.",
        where=[n.name for n, _ in hotspot_dbs[:3]],
        benefits=[
            "Reduces read load on the primary DB by 60–80%",
            "Write performance improves due to reduced lock contention",
            "Read replica can serve analytics/reporting queries without impacting production",
            "Provides a warm failover target",
        ],
        implementation_steps=[
            "Enable PostgreSQL streaming replication: set `wal_level = replica` in primary postgresql.conf.",
            "Configure `pg_hba.conf` to allow the replica to connect.",
            "Start replica with `pg_basebackup` and `recovery.conf` pointing to primary.",
            "Configure SQLAlchemy with two engines: `write_engine` (primary) and `read_engine` (replica).",
            "Route all read-only operations through `read_engine` using a custom session factory.",
        ],
        estimated_improvement="60–80% reduction in primary DB read load; improved write throughput",
        effort="Medium",
        tags=["read-replica", "database", "postgresql", "scaling"],
    )


def _detect_partitioning(
    nodes: List[GraphNode],
    files: List[Any],
) -> Optional[ScalabilityAdvisory]:
    partition_present = any(
        any(kw in n.name.lower() for kw in ("partition", "shard")) for n in nodes
    )
    if partition_present:
        return None

    # Look for large table-like nodes or high file count indicators
    large_tables = [
        n
        for n in nodes
        if n.type.lower() in ("database table",)
        and any(
            kw in n.name.lower()
            for kw in ("log", "event", "audit", "history", "record")
        )
    ]

    if not large_tables:
        return None

    evidence = [
        f"Table `{n.name}` is likely unbounded — logs/events/audit tables grow indefinitely without partitioning."
        for n in large_tables[:3]
    ]
    conf = 0.68

    return ScalabilityAdvisory(
        id=_sid(),
        recommendation="Add Database Partitioning",
        technique="partitioning",
        category="Database",
        icon="📊",
        severity=_severity(conf),
        confidence=round(conf, 2),
        issue_description="Unbounded tables (logs, events, audit records) detected without range or hash partitioning. These will degrade query performance as data grows.",
        evidence=evidence,
        why="Tables storing time-series or event data grow without bound. Partitioning by date range allows PostgreSQL to prune irrelevant partitions during queries, dramatically improving performance.",
        where=[n.name for n in large_tables[:4]],
        benefits=[
            "Queries on recent data only scan the current partition",
            "Old partitions can be archived or dropped instantly without DELETE",
            "Vacuum/analyze only processes the active partition",
            "Enables parallel query execution across partitions",
        ],
        implementation_steps=[
            "Convert target table to a partitioned table: `CREATE TABLE events (...) PARTITION BY RANGE (created_at)`.",
            "Create monthly or weekly child partitions: `CREATE TABLE events_2024_01 PARTITION OF events FOR VALUES FROM ('2024-01-01') TO ('2024-02-01')`.",
            "Create a trigger or use `pg_partman` to auto-create future partitions.",
            "Add partition key (`created_at`) to all WHERE clauses so PostgreSQL can prune partitions.",
            "Set a retention policy to drop old partitions: `DROP TABLE events_2022_01`.",
        ],
        estimated_improvement="Query performance improves 10–100x for time-ranged queries as data grows",
        effort="High",
        tags=["partitioning", "database", "postgresql", "performance"],
    )


def _detect_sharding(
    nodes: List[GraphNode],
    relationships: List[GraphRelationship],
    fan_in: Dict,
) -> Optional[ScalabilityAdvisory]:
    shard_present = any("shard" in n.name.lower() for n in nodes)
    if shard_present:
        return None

    # Sharding is relevant only at very high fan-in on DB nodes
    db_nodes = [n for n in nodes if n.type.lower() in ("database",)]
    overloaded = [(n, fan_in[n.id]) for n in db_nodes if fan_in[n.id] >= 12]

    if not overloaded:
        return None

    evidence = [
        f"Database `{n.name}` has {fi} consumers — single-node DB may become a write throughput bottleneck at scale."
        for n, fi in overloaded[:2]
    ]
    conf = 0.62

    return ScalabilityAdvisory(
        id=_sid(),
        recommendation="Evaluate Database Sharding",
        technique="sharding",
        category="Database",
        icon="🔀",
        severity=_severity(conf),
        confidence=round(conf, 2),
        issue_description="High consumer count on a single database node suggests future write throughput limitations. Sharding distributes data across multiple DB nodes.",
        evidence=evidence,
        why="When a single database node cannot handle the write throughput (typically >10k writes/sec), sharding distributes the dataset across multiple nodes using a shard key.",
        where=[n.name for n, _ in overloaded[:2]],
        benefits=[
            "Write throughput scales horizontally with each shard added",
            "Each shard node holds only a fraction of the total dataset",
            "Geographic sharding can reduce latency for regional users",
        ],
        implementation_steps=[
            "Choose a shard key with high cardinality and even distribution (e.g., `user_id`, `tenant_id`).",
            "Avoid cross-shard queries — ensure the shard key is included in all primary queries.",
            "Use a consistent hashing ring to map keys to shards.",
            "Consider Citus (PostgreSQL extension) for transparent sharding without application changes.",
            "Implement a routing layer that maps each request to the correct shard.",
        ],
        estimated_improvement="Linear write throughput scaling with each shard added",
        effort="High",
        tags=["sharding", "database", "distributed", "scaling"],
    )


def _detect_cdn(
    nodes: List[GraphNode],
    files: List[Any],
) -> Optional[ScalabilityAdvisory]:
    cdn_present = any(
        any(
            kw in n.name.lower()
            for kw in ("cdn", "cloudfront", "fastly", "cloudflare", "static")
        )
        for n in nodes
    )
    if cdn_present:
        return None

    static_files = [
        f
        for f in files
        if any(
            f.file_path.lower().endswith(ext)
            for ext in (".html", ".css", ".js", ".png", ".jpg", ".svg", ".woff")
        )
    ]

    if not static_files:
        return None

    evidence = [
        f"{len(static_files)} static asset file(s) detected with no CDN distribution layer."
    ]
    conf = 0.60

    return ScalabilityAdvisory(
        id=_sid(),
        recommendation="Add CDN for Static Assets",
        technique="cdn",
        category="Networking",
        icon="🌐",
        severity=_severity(conf),
        confidence=round(conf, 2),
        issue_description=f"{len(static_files)} static assets are served directly from the application server instead of a globally distributed CDN.",
        evidence=evidence,
        why="Serving static assets (JS, CSS, images) from the application server consumes bandwidth, adds latency for geographically distant users, and competes with dynamic API requests for resources.",
        where=["static/", "public/", "assets/"],
        benefits=[
            "Static assets served from edge nodes closest to each user",
            "Application server freed from static file serving load",
            "Automatic GZIP/Brotli compression and HTTP/2 push",
            "Browser caching at the edge with long TTLs",
        ],
        implementation_steps=[
            "Upload static assets to an S3 bucket or equivalent object store.",
            "Configure a CloudFront/Cloudflare distribution pointing to the bucket.",
            "Update the Next.js config: set `assetPrefix` to the CDN URL.",
            "Set `Cache-Control: public, max-age=31536000, immutable` for hashed asset filenames.",
            "Configure cache invalidation for non-hashed assets (e.g., index.html).",
        ],
        estimated_improvement="50–90% reduction in static asset load time for global users",
        effort="Low",
        tags=["cdn", "static-assets", "networking", "performance"],
    )


def _detect_service_mesh(
    nodes: List[GraphNode],
    relationships: List[GraphRelationship],
) -> Optional[ScalabilityAdvisory]:
    mesh_present = any(
        any(
            kw in n.name.lower()
            for kw in ("istio", "linkerd", "consul", "envoy", "mesh")
        )
        for n in nodes
    )
    if mesh_present:
        return None

    service_nodes = {n.id: n for n in nodes if n.type.lower() == "service"}
    s2s_edges = [
        r
        for r in relationships
        if r.source_id in service_nodes and r.target_id in service_nodes
    ]

    if len(s2s_edges) < 6:
        return None

    unique_services = len(
        set([r.source_id for r in s2s_edges] + [r.target_id for r in s2s_edges])
    )
    evidence = [
        f"{len(s2s_edges)} service-to-service call edges detected across {unique_services} services.",
        "No service mesh (Istio/Linkerd) detected — no automatic mTLS, circuit breaking, or distributed tracing.",
    ]
    conf = min(0.55 + len(s2s_edges) * 0.03, 0.82)

    return ScalabilityAdvisory(
        id=_sid(),
        recommendation="Introduce Service Mesh",
        technique="service_mesh",
        category="Infrastructure",
        icon="🕸️",
        severity=_severity(conf),
        confidence=round(conf, 2),
        issue_description=f"{len(s2s_edges)} service-to-service connections managed without a mesh — no automatic retry, circuit breaking, or observability.",
        evidence=evidence,
        why="As service count grows, managing retries, timeouts, mutual TLS, and distributed tracing in application code becomes unmanageable. A service mesh handles this transparently via sidecar proxies.",
        where=[
            service_nodes[sid].name
            for sid in list({r.source_id for r in s2s_edges})[:5]
            if sid in service_nodes
        ],
        benefits=[
            "Automatic mutual TLS between all services (zero code change)",
            "Circuit breaking and retry policies configured via YAML",
            "Distributed tracing (Jaeger/Zipkin) out of the box",
            "Traffic splitting for canary deployments",
        ],
        implementation_steps=[
            "Install Istio: `istioctl install --set profile=default`.",
            "Label the namespace: `kubectl label namespace default istio-injection=enabled`.",
            "Apply VirtualService and DestinationRule CRDs to configure circuit breaking.",
            "Deploy Kiali for service mesh observability dashboard.",
            "Configure traffic policies: retries, timeouts, and fault injection for testing.",
        ],
        estimated_improvement="Eliminates 80% of cross-service reliability boilerplate; full observability",
        effort="High",
        tags=["service-mesh", "istio", "infrastructure", "distributed"],
    )


def _detect_horizontal_scaling(
    nodes: List[GraphNode],
    files: List[Any],
    fan_in: Dict,
) -> Optional[ScalabilityAdvisory]:
    k8s_present = any(
        any(kw in n.name.lower() for kw in ("kubernetes", "k8s", "helm", "deployment"))
        for n in nodes
    )
    cpu_heavy = [
        n
        for n in nodes
        if fan_in[n.id] >= 6
        and n.type.lower() in ("service",)
        and any(
            kw in n.name.lower()
            for kw in ("analyze", "process", "compute", "parse", "detect", "calculate")
        )
    ]

    if not cpu_heavy:
        return None

    evidence = [
        f"CPU-intensive service `{n.name}` handles {fan_in[n.id]} callers — a single instance is the throughput ceiling."
        for n in cpu_heavy[:3]
    ]
    if not k8s_present:
        evidence.append(
            "No Kubernetes/container orchestration detected — horizontal scaling requires a deployment platform."
        )

    conf = min(0.58 + len(cpu_heavy) * 0.05, 0.84)

    return ScalabilityAdvisory(
        id=_sid(),
        recommendation="Enable Horizontal Scaling",
        technique="horizontal_scaling",
        category="Infrastructure",
        icon="📈",
        severity=_severity(conf),
        confidence=round(conf, 2),
        issue_description=f"{len(cpu_heavy)} CPU-intensive service(s) are single-instance — throughput cannot grow beyond one machine's capacity.",
        evidence=evidence,
        why="CPU-bound services (analysis, parsing, ML inference, report generation) are limited by a single machine's core count. Horizontal scaling adds replicas and distributes work across them.",
        where=[n.name for n in cpu_heavy[:4]],
        benefits=[
            "Linear throughput improvement with each replica added",
            "One instance crash doesn't take the service down",
            "Enables zero-downtime rolling updates",
            "Cloud auto-scaling reduces cost during low-traffic periods",
        ],
        implementation_steps=[
            "Ensure all service instances are stateless (sessions in Redis, no local file state).",
            "Package the service as a Docker image with a fixed tag.",
            "Write a Kubernetes Deployment with `replicas: 3` and a HorizontalPodAutoscaler (HPA).",
            "Configure HPA: `kubectl autoscale deployment {name} --cpu-percent=70 --min=2 --max=10`.",
            "Add a Kubernetes Service of type ClusterIP to load balance across replicas.",
        ],
        estimated_improvement="Throughput scales linearly with replica count; improved fault tolerance",
        effort="Medium",
        tags=["horizontal-scaling", "kubernetes", "infrastructure", "containers"],
    )


# ---------------------------------------------------------------------------
# Main Service
# ---------------------------------------------------------------------------


class ScalabilityAdvisorService:
    def get_advisories(self, db: Session, repo_id: str) -> ScalabilityReport:
        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
        relationships = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.repository_id == repo_id)
            .all()
        )
        files = db.query(File).filter(File.repository_id == repo_id).all()

        fan_in: dict = defaultdict(int)
        fan_out: dict = defaultdict(int)
        for r in relationships:
            fan_out[r.source_id] += 1
            fan_in[r.target_id] += 1

        detectors = [
            _detect_caching(nodes, relationships, fan_in),
            _detect_load_balancer(nodes, relationships, fan_in),
            _detect_queue(nodes, relationships, files, fan_in),
            _detect_read_replica(nodes, relationships, fan_in),
            _detect_partitioning(nodes, files),
            _detect_sharding(nodes, relationships, fan_in),
            _detect_cdn(nodes, files),
            _detect_service_mesh(nodes, relationships),
            _detect_horizontal_scaling(nodes, files, fan_in),
        ]

        advisories = [a for a in detectors if a is not None]

        # Sort by severity order
        severity_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
        advisories.sort(key=lambda a: severity_order.get(a.severity, 4))

        categories = list({a.category for a in advisories})
        critical = sum(1 for a in advisories if a.severity == "Critical")
        high = sum(1 for a in advisories if a.severity == "High")

        if critical > 0:
            verdict = f"{critical} critical scalability bottleneck(s) identified. Address these before scaling user load."
        elif high > 0:
            verdict = f"{high} high-severity scalability issue(s) detected. Prioritise before the next growth phase."
        elif advisories:
            verdict = f"{len(advisories)} scalability improvement(s) identified — address progressively."
        else:
            verdict = "No significant scalability bottlenecks detected in the current architecture."

        return ScalabilityReport(
            repo_id=repo_id,
            generated_at=datetime.utcnow(),
            advisories=advisories,
            total_issues=len(advisories),
            critical_count=critical,
            high_count=high,
            categories_affected=categories,
            scalability_verdict=verdict,
        )
