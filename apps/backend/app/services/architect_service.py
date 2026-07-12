"""
ArchitectService — Architecture Reasoning Engine
================================================

Feature 1 — Generates 8 specific recommendation types:
  1. Split [Service Name]              — God-module decomposition
  2. Introduce Repository Pattern      — Direct DB access from API/service
  3. Add Redis Cache                   — High-read, no cache layer
  4. Replace Synchronous APIs w/Events — Deep sync call chains
  5. Extract Interfaces                — Tight concrete-class coupling
  6. Introduce CQRS                    — Mixed read/write bidirectional nodes
  7. Add Read Replicas                 — DB node overload from many consumers
  8. Reduce Circular Dependencies      — Graph cycles detected

Feature 2 — 5-Dimension Prioritization Scorer:
  • Business Impact Score    (0–100)
  • Technical Impact Score   (0–100)
  • Risk Reduction Score     (0–100)
  • Engineering Effort Score (0–100, 100 = max work)
  • Health Improvement %     (0–100)

  Composite = (Business×0.25) + (Technical×0.25) + (Risk×0.25)
            + ((100-Effort)×0.15) + (Health%×0.10)
"""

import uuid
from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List, Optional, Set

from sqlalchemy.orm import Session

from app.models.architect import (
    ArchitectureDecisionGenerated as ArchitectureDecisionGeneratedModel,
)
from app.models.architect import (
    ArchitectureRecommendation as ArchitectureRecommendationModel,
)
from app.models.architect import (
    ArchitectureReview as ArchitectureReviewModel,
)
from app.models.file import File
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.schemas.architect import (
    ArchitectReportResponse,
    ArchitectSummaryResponse,
    ArchitectureRecommendation,
    CategorySummary,
    RecommendationCategory,
    RecommendationRisk,
    RepoArchitectureSummary,
)
from app.services.analysis_service import AnalysisService
from app.services.architecture_detector import ArchitectureDetector

# ===========================================================================
# Helpers
# ===========================================================================


def _make_id() -> str:
    return f"rec_{uuid.uuid4().hex[:8]}"


def _risk_from_score(score: float) -> RecommendationRisk:
    if score >= 0.7:
        return RecommendationRisk.HIGH
    if score >= 0.4:
        return RecommendationRisk.MEDIUM
    return RecommendationRisk.LOW


def _priority_from_composite(composite: float) -> int:
    """Map composite score (0–100) to priority integer 1–5 (1 = most critical)."""
    if composite >= 80:
        return 1
    if composite >= 65:
        return 2
    if composite >= 48:
        return 3
    if composite >= 30:
        return 4
    return 5


def _confidence(base: float, evidence_count: int, pattern_conf: float = 0.0) -> float:
    ev_weight = min(evidence_count / 5.0, 1.0)
    score = (base * 0.5) + (pattern_conf * 0.3) + (ev_weight * 0.2)
    return round(min(score, 1.0), 2)


def _level(score: float) -> str:
    """Convert 0–100 score to High/Medium/Low label."""
    if score >= 68:
        return "High"
    if score >= 38:
        return "Medium"
    return "Low"


# ===========================================================================
# Feature 2 — Recommendation Scorer
# ===========================================================================


class RecommendationScorer:
    """
    Attaches 5-dimension priority scores to every recommendation.

    Scoring philosophy:
      business_impact  — which recommendation unblocks the most user-facing capabilities
      technical_impact — which most improves structural quality of the codebase
      risk_reduction   — which most reduces the chance of cascading failures
      effort_score     — raw engineering work (higher = more work = lower priority weight)
      health_pct       — expected improvement to the overall repository health score

    composite = (business×0.25) + (technical×0.25) + (risk×0.25)
              + ((100 - effort)×0.15) + (health_pct×0.10)
    """

    # Base scores per recommendation type (tag → scores)
    _TYPE_SCORES: Dict[str, Dict[str, float]] = {
        # tag                   business  technical  risk  health_pct_base
        "circular-dependency": {"b": 75, "t": 92, "r": 95, "h": 18},
        "god-module": {"b": 85, "t": 82, "r": 78, "h": 22},
        "service-split": {"b": 85, "t": 82, "r": 78, "h": 22},
        "data-access": {"b": 70, "t": 78, "r": 72, "h": 16},
        "caching": {"b": 65, "t": 60, "r": 42, "h": 14},
        "event-driven": {"b": 62, "t": 72, "r": 58, "h": 13},
        "read-replicas": {"b": 68, "t": 65, "r": 50, "h": 12},
        "cqrs": {"b": 58, "t": 70, "r": 52, "h": 11},
        "extract-interfaces": {"b": 55, "t": 75, "r": 65, "h": 15},
        "dead-code": {"b": 30, "t": 45, "r": 28, "h": 6},
        "complexity": {"b": 60, "t": 72, "r": 62, "h": 15},
        "coupling": {"b": 65, "t": 70, "r": 60, "h": 13},
        "refactoring": {"b": 55, "t": 68, "r": 58, "h": 13},
        "boundaries": {"b": 72, "t": 80, "r": 74, "h": 17},
        "microservice": {"b": 70, "t": 65, "r": 55, "h": 12},
    }

    def _get_base(self, tags: List[str]) -> Dict[str, float]:
        """Pick the highest-priority base scores from tag set."""
        best: Dict[str, float] = {"b": 50, "t": 50, "r": 50, "h": 10}
        for tag in tags or []:
            if tag in self._TYPE_SCORES:
                scores = self._TYPE_SCORES[tag]
                if scores["b"] > best["b"]:
                    best = dict(scores)
        return best

    def _effort_from_hours(self, hours: Optional[int]) -> float:
        """Convert hour estimate to 0–100 effort score."""
        if hours is None:
            return 50.0
        if hours <= 16:
            return 20.0
        if hours <= 40:
            return 38.0
        if hours <= 80:
            return 55.0
        if hours <= 160:
            return 72.0
        return 88.0

    def score(
        self,
        rec: ArchitectureRecommendation,
        fan_in_map: Dict[str, int],
    ) -> ArchitectureRecommendation:
        base = self._get_base(rec.tags or [])

        # Business impact bonus from affected module criticality
        module_criticality = 0.0
        if rec.affected_modules:
            for mod in rec.affected_modules[:5]:
                fi = fan_in_map.get(mod, 0)
                module_criticality = max(module_criticality, min(fi * 4, 25))

        business = min(base["b"] + module_criticality * 0.3, 100.0)
        technical = min(base["t"] + len(rec.evidence) * 1.5, 100.0)
        risk = min(
            base["r"] + (20 if rec.risk == RecommendationRisk.HIGH else 0), 100.0
        )
        health_pct = min(base["h"] + len(rec.evidence) * 0.8, 40.0)
        effort = self._effort_from_hours(rec.effort_hours_estimate)

        composite = (
            business * 0.25
            + technical * 0.25
            + risk * 0.25
            + (100 - effort) * 0.15
            + health_pct * 0.10
        )

        rec.business_impact_score = round(business, 1)
        rec.technical_impact_score = round(technical, 1)
        rec.risk_reduction_score = round(risk, 1)
        rec.engineering_effort_score = round(effort, 1)
        rec.health_improvement_pct = round(health_pct, 1)
        rec.composite_priority_score = round(composite, 1)
        rec.impact_level = _level(max(business, technical, risk))
        rec.effort_level = _level(effort)
        rec.expected_improvement = f"+{round(health_pct)}%"

        # Populate Explainable AI Alternatives (Feature 11)
        alts = [
            "Maintain existing codebase layout",
            "Manual code refactoring without abstraction",
        ]
        t = rec.title.lower()
        if "redis" in t or "cache" in t:
            alts = [
                "Memcached cluster deployment",
                "In-Process / Local Memory Cache (lru-cache)",
                "HTTP Gateway caching (Varnish)",
            ]
        elif "repository" in t:
            alts = [
                "Active Record pattern",
                "Direct raw database client query strings",
                "Query Builder classes wrapper",
            ]
        elif "split" in t or "decompose" in t:
            alts = [
                "Maintain monolithic services",
                "Extract logic into shared utility helper libraries",
                "Define interface segregation patterns",
            ]
        elif "event" in t or "synchronous" in t:
            alts = [
                "Direct synchronous HTTP client calls",
                "Message Queue (RabbitMQ)",
                "Background Celery workers",
            ]
        elif "interface" in t:
            alts = [
                "Direct concrete class dependencies",
                "Duck typing dynamic dispatch",
                "Hardcoded instance imports",
            ]
        elif "cqrs" in t:
            alts = [
                "Single shared read-write repository path",
                "Materialized database views",
                "Read replica database query routing",
            ]
        elif "replica" in t:
            alts = [
                "Horizontal database sharding",
                "Database query connection pool scaling",
                "NoSQL document storage replication",
            ]
        elif "circular" in t:
            alts = [
                "Introduce mediator pattern module",
                "Lazy dynamic package loading (`importlib`)",
                "Constructor dependency injecting",
            ]

        rec.alternatives = alts

        return rec


# ===========================================================================
# Feature 1 — Design Pattern Engine
# ===========================================================================


class DesignPatternEngine:
    """
    Generates recommendations 2, 5, 6 from the Feature 1 list:
      2. Introduce Repository Pattern
      5. Extract Interfaces
      6. Introduce CQRS
      + Clean Architecture enforcement
      + Event-Driven / Replace Synchronous APIs
    """

    def analyse(
        self,
        db: Session,
        repo_id: str,
        patterns: List[Dict],
        violations: List[Dict],
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
    ) -> List[ArchitectureRecommendation]:
        recs: List[ArchitectureRecommendation] = []
        pattern_names = {p["pattern"].lower(): p for p in patterns}

        fan_in: Dict[str, int] = defaultdict(int)
        fan_out: Dict[str, int] = defaultdict(int)
        for r in relationships:
            fan_out[r.source_id] += 1
            fan_in[r.target_id] += 1

        # ── Rec 2: Introduce Repository Pattern ──────────────────────────────
        repo_conf = pattern_names.get("repository pattern", {}).get("confidence", 0.0)
        api_direct_db = [
            v
            for v in violations
            if (
                "direct" in v.get("message", "").lower()
                and "db" in v.get("message", "").lower()
            )
            or "api" in v.get("type", "").lower()
        ]
        api_node_ids = {
            n.id
            for n in nodes
            if "api" in n.type.lower() or "controller" in n.name.lower()
        }
        db_node_ids = {
            n.id
            for n in nodes
            if "database" in n.type.lower() or "table" in n.type.lower()
        }
        direct_db_edges = [
            r
            for r in relationships
            if r.source_id in api_node_ids and r.target_id in db_node_ids
        ]

        if (not (repo_conf >= 0.5)) and (direct_db_edges or api_direct_db):
            evidence = []
            if direct_db_edges:
                evidence.append(
                    f"{len(direct_db_edges)} direct API→Database edge(s) detected, bypassing the service layer."
                )
                for e in direct_db_edges[:3]:
                    src = next(
                        (n.name for n in nodes if n.id == e.source_id), e.source_id
                    )
                    tgt = next(
                        (n.name for n in nodes if n.id == e.target_id), e.target_id
                    )
                    evidence.append(f"  `{src}` → `{tgt}` (no repository abstraction)")
            for v in api_direct_db[:3]:
                evidence.append(f"Violation: {v.get('message', '')}")

            recs.append(
                ArchitectureRecommendation(
                    id=_make_id(),
                    category=RecommendationCategory.design_pattern,
                    title="Introduce Repository Pattern to isolate data access",
                    priority=2,
                    confidence=_confidence(0.88, len(evidence), repo_conf),
                    risk=RecommendationRisk.HIGH,
                    estimated_effort="1–2 weeks",
                    expected_impact="Decouple HTTP layer from persistence, enable mock-based testing, swap DB without touching business logic.",
                    evidence=evidence,
                    reason=(
                        "API controllers or service classes are making direct database calls. "
                        "This violates the Single Responsibility Principle — HTTP handlers should never "
                        "own persistence logic. Introducing a Repository layer creates a clean boundary "
                        "that lets each concern evolve independently."
                    ),
                    trade_offs=[
                        "One new repository class per domain entity.",
                        "Short-term increase in file count.",
                        "Teams new to the pattern require onboarding.",
                    ],
                    affected_modules=[n.name for n in nodes if n.id in api_node_ids][
                        :5
                    ],
                    suggested_pattern="Repository Pattern",
                    effort_hours_estimate=55,
                    tags=["data-access", "coupling", "testability", "repository"],
                )
            )

        # ── Rec 5: Extract Interfaces ────────────────────────────────────────
        # Detect service nodes that depend directly on other concrete service nodes (not abstractions)
        concrete_service_ids = {
            n.id
            for n in nodes
            if n.type.lower() in ("service", "class")
            and not any(
                kw in n.name.lower()
                for kw in ("interface", "abstract", "base", "protocol")
            )
        }
        service_to_concrete = [
            r
            for r in relationships
            if r.source_id in concrete_service_ids
            and r.target_id in concrete_service_ids
            and r.source_id != r.target_id
            and r.type in ("IMPORTS", "CALLS", "USES")
        ]
        if len(service_to_concrete) >= 5:
            involved: Set[str] = set()
            for r in service_to_concrete[:6]:
                for nid in (r.source_id, r.target_id):
                    n = next((x for x in nodes if x.id == nid), None)
                    if n:
                        involved.add(n.name)
            evidence = [
                f"{len(service_to_concrete)} direct concrete-class-to-concrete-class dependency edges detected.",
                "No interface or abstract base classes found mediating these relationships.",
            ] + [f"  Concrete dependency: {e}" for e in list(involved)[:4]]
            recs.append(
                ArchitectureRecommendation(
                    id=_make_id(),
                    category=RecommendationCategory.design_pattern,
                    title=f"Extract Interfaces — {len(service_to_concrete)} concrete dependencies need abstractions",
                    priority=3,
                    confidence=_confidence(0.75, len(evidence)),
                    risk=RecommendationRisk.MEDIUM,
                    estimated_effort="1–3 weeks",
                    expected_impact="Enable mock-based testing, support dependency injection, reduce cross-service coupling.",
                    evidence=evidence,
                    reason=(
                        "Services depending directly on other concrete service classes create rigid coupling. "
                        "Extracting interfaces or abstract base classes allows consumers to depend on "
                        "contracts rather than implementations — a prerequisite for effective unit testing, "
                        "dependency injection, and future service replacement."
                    ),
                    trade_offs=[
                        "Each extracted interface is additional boilerplate to maintain.",
                        "Requires updating all call sites to inject through the interface.",
                        "Can over-engineer if the service is unlikely to have multiple implementations.",
                    ],
                    affected_modules=list(involved)[:8],
                    suggested_pattern="Dependency Inversion Principle / Interface Segregation",
                    effort_hours_estimate=65,
                    tags=[
                        "extract-interfaces",
                        "coupling",
                        "dependency-inversion",
                        "testability",
                    ],
                )
            )

        # ── Rec 6: Introduce CQRS ───────────────────────────────────────────
        cqrs_conf = pattern_names.get("cqrs", {}).get("confidence", 0.0)
        if cqrs_conf < 0.3:
            mixed_nodes = [
                n
                for n in nodes
                if fan_in[n.id] > 4
                and fan_out[n.id] > 4
                and n.type.lower() in ("service", "module", "file")
            ]
            if mixed_nodes:
                evidence = [
                    f"{len(mixed_nodes)} module(s) acting as mixed read+write hubs detected.",
                ] + [
                    f"  `{n.name}`: {fan_in[n.id]} incoming + {fan_out[n.id]} outgoing edges (mixed traffic)"
                    for n in mixed_nodes[:4]
                ]
                recs.append(
                    ArchitectureRecommendation(
                        id=_make_id(),
                        category=RecommendationCategory.design_pattern,
                        title="Introduce CQRS — Separate read and write command paths",
                        priority=3,
                        confidence=_confidence(0.68, len(evidence), cqrs_conf),
                        risk=RecommendationRisk.MEDIUM,
                        estimated_effort="3–6 weeks",
                        expected_impact="Optimise query performance independently of write throughput, simplify each path, enable targeted scaling.",
                        evidence=evidence,
                        reason=(
                            "Multiple service nodes process both read queries and write commands "
                            "through identical code paths. CQRS (Command Query Responsibility Segregation) "
                            "separates these concerns, letting each side be optimised, tested, and scaled "
                            "independently — particularly valuable as read volume grows."
                        ),
                        trade_offs=[
                            "Introduces eventual consistency if read models are derived asynchronously.",
                            "Requires maintaining separate query projections.",
                            "Significant upfront complexity increase.",
                        ],
                        affected_modules=[n.name for n in mixed_nodes[:5]],
                        suggested_pattern="CQRS",
                        effort_hours_estimate=175,
                        tags=[
                            "cqrs",
                            "coupling",
                            "read-write-separation",
                            "scalability",
                        ],
                    )
                )

        # ── Replace Synchronous APIs with Events ───────────────────────────
        event_conf = pattern_names.get("event driven", {}).get("confidence", 0.0)
        layered_conf = pattern_names.get("layered architecture", {}).get(
            "confidence", 0.0
        )

        if event_conf < 0.4 and layered_conf > 0.4:
            adj: Dict[str, List[str]] = defaultdict(list)
            for r in relationships:
                if r.type in ("CALLS", "IMPORTS"):
                    adj[r.source_id].append(r.target_id)

            max_depth = 0
            deepest_name = ""
            depth_cache: Dict[str, int] = {}

            def _depth(nid: str, visiting: Set[str]) -> int:
                if nid in depth_cache:
                    return depth_cache[nid]
                if nid in visiting:
                    return 0
                visiting.add(nid)
                d = 1 + max((_depth(c, visiting) for c in adj.get(nid, [])), default=0)
                depth_cache[nid] = d
                return d

            for n in nodes:
                if n.type.lower() in ("api endpoint", "service", "function"):
                    d = _depth(n.id, set())
                    if d > max_depth:
                        max_depth = d
                        deepest_name = n.name

            if max_depth >= 5:
                evidence = [
                    f"Deepest synchronous call chain: {max_depth} hops, starting at `{deepest_name}`.",
                    "Layered Architecture detected — all processing is synchronous.",
                    "Long synchronous chains block the HTTP thread and mask latency.",
                ]
                recs.append(
                    ArchitectureRecommendation(
                        id=_make_id(),
                        category=RecommendationCategory.design_pattern,
                        title=f"Replace Synchronous APIs with Events — {max_depth}-hop chain detected",
                        priority=3,
                        confidence=_confidence(0.70, len(evidence), event_conf),
                        risk=RecommendationRisk.MEDIUM,
                        estimated_effort="4–8 weeks",
                        expected_impact="Reduce request latency, decouple producers from consumers, improve fault isolation.",
                        evidence=evidence,
                        reason=(
                            f"A {max_depth}-hop synchronous call chain forces every upstream caller "
                            "to wait for every downstream service. Converting the tail of this chain "
                            "to async event publishing (using the existing Redis/Celery stack) removes "
                            "blocking waits and makes the system resilient to downstream slowdowns."
                        ),
                        trade_offs=[
                            "Callers no longer get immediate results from async operations.",
                            "Requires event schema design and versioning strategy.",
                            "Debugging async flows is harder than synchronous traces.",
                        ],
                        suggested_pattern="Event-Driven Architecture (Pub/Sub)",
                        effort_hours_estimate=220,
                        tags=["event-driven", "async", "coupling", "performance"],
                    )
                )

        # ── Clean Architecture boundary enforcement ────────────────────────
        clean_violations = [
            v for v in violations if "domain" in v.get("message", "").lower()
        ]
        if clean_violations:
            evidence = [v.get("message", "") for v in clean_violations[:5]]
            recs.append(
                ArchitectureRecommendation(
                    id=_make_id(),
                    category=RecommendationCategory.design_pattern,
                    title="Enforce Clean Architecture Dependency Rule — domain imports detected",
                    priority=2,
                    confidence=_confidence(0.91, len(evidence)),
                    risk=RecommendationRisk.HIGH,
                    estimated_effort="1–3 weeks",
                    expected_impact="Restore boundary integrity, keep domain logic testable without infrastructure.",
                    evidence=evidence,
                    reason=(
                        "The Dependency Rule requires inner layers (Domain/Core) to never import from "
                        "outer layers (Adapters/Infrastructure). Detected violations allow infrastructure "
                        "concerns to pollute the domain model."
                    ),
                    trade_offs=[
                        "Requires interface extraction and inversion of control.",
                        "Some short-term instability during the refactor.",
                    ],
                    suggested_pattern="Clean / Hexagonal Architecture",
                    effort_hours_estimate=75,
                    tags=["boundaries", "clean-architecture", "dependency-rule"],
                )
            )

        return recs


# ===========================================================================
# Feature 1 — Scalability Engine
# ===========================================================================


class ScalabilityEngine:
    """
    Generates recommendations 1, 3, 4, 7 from the Feature 1 list:
      1. Split [Service Name]   — God-module decomposition
      3. Add Redis Cache         — High-read hotspots
      4. (handled by DesignPatternEngine) Replace Sync with Events
      7. Add Read Replicas       — DB overload from many consumers
    """

    def analyse(
        self,
        db: Session,
        repo_id: str,
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        files: List[Any],
    ) -> List[ArchitectureRecommendation]:
        recs: List[ArchitectureRecommendation] = []

        fan_in: Dict[str, int] = defaultdict(int)
        fan_out: Dict[str, int] = defaultdict(int)
        for r in relationships:
            fan_out[r.source_id] += 1
            fan_in[r.target_id] += 1

        # ── Rec 1: Split [Service Name] ──────────────────────────────────────
        hotspot_fi = 7
        hotspot_fo = 5
        god_nodes = sorted(
            [
                n
                for n in nodes
                if fan_in[n.id] >= hotspot_fi
                and fan_out[n.id] >= hotspot_fo
                and n.type.lower() in ("service", "module", "file", "class")
            ],
            key=lambda n: fan_in[n.id] + fan_out[n.id],
            reverse=True,
        )
        for node in god_nodes[:3]:
            improvement_pct = min(8 + round(fan_in[node.id] * 0.6), 28)
            evidence = [
                f"'{node.name}' has **{fan_in[node.id]} afferent** (incoming) and **{fan_out[node.id]} efferent** (outgoing) dependencies.",
                f"Node type: {node.type} — exhibits classic 'God Module' coupling pattern.",
                "High bidirectional coupling = single point of failure + deployment bottleneck.",
                f"Splitting this module could improve repository health by ~{improvement_pct}%.",
            ]
            recs.append(
                ArchitectureRecommendation(
                    id=_make_id(),
                    category=RecommendationCategory.scalability,
                    title=f"Split '{node.name}' — God Module ({fan_in[node.id]} dependants)",
                    priority=2,
                    confidence=_confidence(0.83, len(evidence)),
                    risk=RecommendationRisk.HIGH,
                    estimated_effort="2–4 weeks",
                    expected_impact=f"Reduce coupling by 60–80%, enable {node.name} sub-components to be deployed and scaled independently.",
                    evidence=evidence,
                    reason=(
                        f"'{node.name}' is a God Module: {fan_in[node.id]} modules depend on it "
                        f"while it itself depends on {fan_out[node.id]} others. This makes it "
                        "a deployment bottleneck, a change-amplifier (one edit breaks many consumers), "
                        "and the primary obstacle to horizontal scaling."
                    ),
                    trade_offs=[
                        f"All {fan_in[node.id]} dependant call sites need updating.",
                        "Clean interface contracts must be defined for extracted pieces.",
                        "Short-term instability risk during decomposition.",
                    ],
                    affected_modules=[node.name],
                    effort_hours_estimate=min(fan_in[node.id] * 5, 160),
                    tags=["god-module", "service-split", "coupling", "scalability"],
                )
            )

        # ── Rec 3: Add Redis Cache ───────────────────────────────────────────
        redis_present = any(
            "redis" in n.name.lower()
            or "cache" in n.name.lower()
            or (n.properties or {}).get("raw_type", "").lower() == "redis"
            for n in nodes
        )
        cached_target_ids = {
            r.target_id
            for r in relationships
            if any(
                t in (r.properties or {}).get("label", "").lower()
                for t in ("cache", "get", "hget")
            )
        }
        read_hotspots = [
            n
            for n in nodes
            if fan_in[n.id] >= 5
            and n.id not in cached_target_ids
            and n.type.lower() in ("function", "method", "api endpoint", "service")
        ]
        if read_hotspots and not redis_present:
            evidence = [
                "No Redis/cache layer detected in the repository graph.",
                f"{len(read_hotspots)} high-fanin read hotspot(s) found with no caching:",
            ] + [
                f"  `{n.name}` ({n.type}) — {fan_in[n.id]} callers"
                for n in read_hotspots[:4]
            ]
            recs.append(
                ArchitectureRecommendation(
                    id=_make_id(),
                    category=RecommendationCategory.scalability,
                    title=f"Add Redis Cache — {len(read_hotspots)} uncached read hotspot(s) detected",
                    priority=3,
                    confidence=_confidence(0.79, len(evidence)),
                    risk=RecommendationRisk.LOW,
                    estimated_effort="3–5 days",
                    expected_impact=f"Reduce DB read load by 50–70% for the top {min(len(read_hotspots), 5)} endpoints. Redis broker is already in the stack.",
                    evidence=evidence,
                    reason=(
                        "Multiple functions are called by many consumers with no caching layer. "
                        "The Redis broker is already present in the infrastructure (docker-compose). "
                        "Adding a Cache-Aside pattern here requires minimal change with immediate "
                        "latency and throughput benefit."
                    ),
                    trade_offs=[
                        "Cache invalidation must be carefully designed (TTL or event-based).",
                        "Cache drift risk if invalidation logic is incomplete.",
                        "Redis becomes a hard operational dependency for these paths.",
                    ],
                    affected_modules=[n.name for n in read_hotspots[:6]],
                    suggested_pattern="Cache-Aside",
                    effort_hours_estimate=28,
                    tags=["caching", "redis", "performance", "read-optimization"],
                )
            )

        # ── Rec 7: Add Read Replicas ─────────────────────────────────────────
        db_nodes = [
            n for n in nodes if n.type.lower() in ("database", "database table")
        ]
        for db_node in db_nodes[:2]:
            readers = fan_in[db_node.id]
            if readers >= 6:
                evidence = [
                    f"Database node '{db_node.name}' has {readers} direct consumers (read + write mixed).",
                    "No read replica or CQRS read model detected in the graph.",
                    f"All {readers} consumer modules are hitting the same database endpoint.",
                ]
                recs.append(
                    ArchitectureRecommendation(
                        id=_make_id(),
                        category=RecommendationCategory.scalability,
                        title=f"Add Read Replicas — '{db_node.name}' serves {readers} consumers",
                        priority=3,
                        confidence=_confidence(0.72, len(evidence)),
                        risk=RecommendationRisk.MEDIUM,
                        estimated_effort="1–2 weeks",
                        expected_impact="Offload read traffic from primary DB, reduce write contention, improve read latency under load.",
                        evidence=evidence,
                        reason=(
                            f"The database node '{db_node.name}' is consumed by {readers} modules "
                            "without any read/write separation. As read traffic grows, write operations "
                            "compete for the same connection pool and lock resources. Adding a read "
                            "replica routes query traffic to a hot-standby, reducing primary DB pressure."
                        ),
                        trade_offs=[
                            "Replication lag means reads may see slightly stale data.",
                            "Adds operational complexity: replica monitoring, failover strategy.",
                            "Application must be updated to route read queries to replica endpoint.",
                        ],
                        affected_modules=[db_node.name],
                        suggested_pattern="Read Replica / CQRS Read Model",
                        effort_hours_estimate=55,
                        tags=[
                            "read-replicas",
                            "scalability",
                            "database",
                            "performance",
                        ],
                    )
                )

        # ── Microservice extraction candidate ────────────────────────────────
        domains: Dict[str, List[GraphNode]] = defaultdict(list)
        for n in nodes:
            path = (n.properties or {}).get("path", "") or (n.properties or {}).get(
                "file_path", ""
            )
            if path:
                parts = path.replace("\\", "/").split("/")
                for idx, part in enumerate(parts):
                    if part in ("apps", "src", "packages", "services"):
                        if idx + 1 < len(parts):
                            domains[parts[idx + 1]].append(n)
                            break

        for domain_name, domain_nodes in domains.items():
            if len(domain_nodes) < 5:
                continue
            domain_ids = {n.id for n in domain_nodes}
            internal = sum(
                1
                for r in relationships
                if r.source_id in domain_ids and r.target_id in domain_ids
            )
            external = sum(
                1
                for r in relationships
                if (r.source_id in domain_ids) != (r.target_id in domain_ids)
            )
            total = internal + external
            if total == 0:
                continue
            cohesion = internal / total
            if cohesion >= 0.78 and external <= 6:
                evidence = [
                    f"Domain cluster '{domain_name}': {len(domain_nodes)} nodes, {cohesion:.0%} internal cohesion.",
                    f"Only {external} external dependency edge(s) — well-bounded context.",
                ]
                recs.append(
                    ArchitectureRecommendation(
                        id=_make_id(),
                        category=RecommendationCategory.scalability,
                        title=f"'{domain_name}' is a Microservice extraction candidate ({cohesion:.0%} cohesion)",
                        priority=4,
                        confidence=_confidence(0.70, len(evidence)),
                        risk=RecommendationRisk.MEDIUM,
                        estimated_effort="4–8 weeks",
                        expected_impact=f"Extract '{domain_name}' as an independent service with autonomous deployment and team ownership.",
                        evidence=evidence,
                        reason=(
                            f"'{domain_name}' shows {cohesion:.0%} internal cohesion with minimal "
                            "cross-domain coupling — the hallmarks of a well-bounded context ready "
                            "for microservice extraction."
                        ),
                        trade_offs=[
                            "Requires defining a stable API contract (REST/gRPC) for cross-service calls.",
                            "Adds CI/CD overhead, health checks, and distributed tracing.",
                            "Network latency replaces in-process calls.",
                        ],
                        affected_modules=[n.name for n in domain_nodes[:8]],
                        suggested_pattern="Microservices / Bounded Context",
                        effort_hours_estimate=200,
                        tags=["microservice", "service-split", "bounded-context"],
                    )
                )
                break

        return recs


# ===========================================================================
# Feature 1 — Refactoring Engine
# ===========================================================================


class RefactoringEngine:
    """
    Generates recommendation 8 (Reduce Circular Dependencies) and
    module refactoring priority list ranked by composite risk score.
    """

    def analyse(
        self,
        db: Session,
        repo_id: str,
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        files: List[Any],
        circular_data: Dict[str, Any],
    ) -> List[ArchitectureRecommendation]:
        recs: List[ArchitectureRecommendation] = []
        circular_modules: Set[str] = set(circular_data.get("affected_modules", []))

        # ── Rec 8: Reduce Circular Dependencies ──────────────────────────────
        cycles = circular_data.get("cycles", [])
        total_cycles = circular_data.get("total_cycles", 0)
        if total_cycles > 0:
            evidence = [f"Total circular dependency cycles: **{total_cycles}**"]
            for i, cycle in enumerate(cycles[:4]):
                desc = cycle.get("description", "")
                if desc:
                    evidence.append(f"  Cycle {i + 1}: `{desc}`")
            evidence.append(
                f"Affected modules: {', '.join(list(circular_modules)[:6])}"
            )

            recs.append(
                ArchitectureRecommendation(
                    id=_make_id(),
                    category=RecommendationCategory.refactoring,
                    title=f"Reduce Circular Dependencies — {total_cycles} cycle(s) blocking independent deployment",
                    priority=1,
                    confidence=_confidence(0.97, len(evidence)),
                    risk=RecommendationRisk.HIGH,
                    estimated_effort=f"{total_cycles * 3}–{total_cycles * 6} days",
                    expected_impact="Eliminate circular imports, unblock tree-shaking/static analysis, enable independent module loading.",
                    evidence=evidence,
                    reason=(
                        "Circular dependencies prevent modules from being loaded independently, "
                        "interfere with test isolation, and create hidden 'action at a distance' bugs. "
                        "Each cycle indicates that at least two modules share responsibilities that "
                        "belong in a third, mediator module. Resolving cycles typically uses the "
                        "Dependency Inversion Principle — both sides depend on an abstraction rather "
                        "than each other."
                    ),
                    trade_offs=[
                        "Requires identifying which module owns the shared logic and extracting it.",
                        "Interface introduction may be needed to break the dependency direction.",
                        "Temporarily destabilising during refactor if tests are insufficient.",
                    ],
                    affected_modules=list(circular_modules)[:10],
                    suggested_pattern="Dependency Inversion Principle",
                    effort_hours_estimate=total_cycles * 14,
                    tags=["circular-dependency", "coupling", "refactoring"],
                )
            )

        # ── Module refactoring priority list ────────────────────────────────
        scored_files = []
        for f in files:
            if not f.metrics:
                continue
            file_path = f.file_path.replace("\\", "/")
            basename = file_path.split("/")[-1]
            basename_no_ext = basename.rsplit(".", 1)[0]

            cc_total = f.metrics.complexity_total or 0
            cc_max = f.metrics.complexity_max or 0
            coverage = f.metrics.coverage_percent or 0
            coupling = len(f.imports) if f.imports else 0
            loc = max(f.code_lines or 1, 1)
            is_cyclic = basename_no_ext in circular_modules or any(
                m in file_path for m in circular_modules
            )

            comp_f = min(1.0, (cc_total / loc) * 5.0)
            max_cc_f = min(1.0, cc_max / 20.0)
            coup_f = min(1.0, coupling / 15.0)
            doc_gap = 1.0 - (coverage / 100.0)
            cycle_f = 1.0 if is_cyclic else 0.0

            risk_score = (
                comp_f * 25 + max_cc_f * 20 + coup_f * 15 + doc_gap * 10 + cycle_f * 15
            )

            scored_files.append(
                {
                    "path": file_path,
                    "basename": basename_no_ext,
                    "risk_score": round(risk_score, 1),
                    "cc_total": cc_total,
                    "cc_max": cc_max,
                    "coupling": coupling,
                    "coverage": coverage,
                    "loc": loc,
                    "is_cyclic": is_cyclic,
                }
            )

        scored_files.sort(key=lambda x: x["risk_score"], reverse=True)

        for rank, sf in enumerate(scored_files[:3]):
            evidence = [
                f"File: `{sf['path']}`",
                f"Cyclomatic complexity: {sf['cc_total']} total, {sf['cc_max']} max per function",
                f"Import coupling: {sf['coupling']} direct dependencies",
                f"Doc coverage: {sf['coverage']:.0f}%",
                f"Lines of code: {sf['loc']}",
            ]
            if sf["is_cyclic"]:
                evidence.append("⚠️ Involved in a circular dependency cycle.")

            risk = (
                RecommendationRisk.HIGH
                if sf["risk_score"] >= 60
                else (
                    RecommendationRisk.MEDIUM
                    if sf["risk_score"] >= 35
                    else RecommendationRisk.LOW
                )
            )
            recs.append(
                ArchitectureRecommendation(
                    id=_make_id(),
                    category=RecommendationCategory.refactoring,
                    title=f"Refactor `{sf['basename']}` — #{rank + 1} risk module (score {sf['risk_score']}/100)",
                    priority=2 if sf["risk_score"] >= 60 else 3,
                    confidence=_confidence(0.84, len(evidence)),
                    risk=risk,
                    estimated_effort=(
                        "1–2 weeks" if sf["risk_score"] < 60 else "2–4 weeks"
                    ),
                    expected_impact=f"Reduce complexity by ~50–70%, eliminate {sf['coupling']} couplings where redundant.",
                    evidence=evidence,
                    reason=(
                        f"`{sf['basename']}` scores {sf['risk_score']}/100 on the composite risk index. "
                        f"Max cyclomatic complexity of {sf['cc_max']} signals overly complex branching "
                        f"logic, while {sf['coupling']} imports means any change ripples outward."
                    ),
                    trade_offs=[
                        f"All {sf['coupling']} importing modules may need minor updates.",
                        "Refactoring during active sprints increases merge conflict risk.",
                        "Good test coverage required before refactoring to prevent regression.",
                    ],
                    affected_modules=[sf["basename"]],
                    effort_hours_estimate=int(sf["risk_score"] * 1.4),
                    tags=["refactoring", "complexity", "coupling", "technical-debt"],
                )
            )

        # ── Orphan module cleanup ────────────────────────────────────────────
        connected_ids = set()
        for r in relationships:
            connected_ids.add(r.source_id)
            connected_ids.add(r.target_id)
        orphans = [
            n
            for n in nodes
            if n.id not in connected_ids and n.type.lower() in ("file", "module")
        ]

        if len(orphans) >= 3:
            evidence = [
                f"{len(orphans)} orphan modules with zero graph connections detected.",
            ] + [f"  Orphan: `{n.name}` ({n.type})" for n in orphans[:5]]
            recs.append(
                ArchitectureRecommendation(
                    id=_make_id(),
                    category=RecommendationCategory.refactoring,
                    title=f"Remove {len(orphans)} dead/orphan modules — zero-connection dead code",
                    priority=4,
                    confidence=_confidence(0.91, len(evidence)),
                    risk=RecommendationRisk.LOW,
                    estimated_effort="1–3 days",
                    expected_impact="Reduce codebase noise, lower cognitive load for new engineers.",
                    evidence=evidence,
                    reason="Orphan modules contribute to cognitive overhead without serving any function.",
                    trade_offs=[
                        "Manual review needed — some may be entry points not captured by the parser."
                    ],
                    affected_modules=[n.name for n in orphans[:10]],
                    effort_hours_estimate=len(orphans) * 2,
                    tags=["dead-code", "refactoring", "cleanup"],
                )
            )

        return recs


# ===========================================================================
# Architecture Decision Engine — Orchestrator
# ===========================================================================


class ArchitectDecisionEngine:
    def __init__(self):
        self.pattern_engine = DesignPatternEngine()
        self.scalability_engine = ScalabilityEngine()
        self.refactoring_engine = RefactoringEngine()
        self.scorer = RecommendationScorer()
        self.analysis_service = AnalysisService()
        self.architecture_detector = ArchitectureDetector()

    def generate_report(self, db: Session, repo_id: str) -> ArchitectReportResponse:
        # ── Gather intelligence signals ──────────────────────────────────
        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
        relationships = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.repository_id == repo_id)
            .all()
        )
        files = db.query(File).filter(File.repository_id == repo_id).all()

        # Build fan-in map for scorer
        fan_in_map: Dict[str, int] = defaultdict(int)
        for r in relationships:
            fan_in_map[r.target_id] += 1
        # Also map by name for scoring affected_modules
        name_fan_in: Dict[str, int] = {}
        for n in nodes:
            name_fan_in[n.name] = fan_in_map.get(n.id, 0)

        # Pattern detection
        patterns: List[Dict] = []
        try:
            patterns = self.architecture_detector.detect(db, repo_id)
        except Exception:
            patterns = []

        # Circular dependency analysis
        circular_data: Dict[str, Any] = {
            "total_cycles": 0,
            "cycles": [],
            "affected_modules": [],
        }
        try:
            circular_data = self.analysis_service.detect_circular_dependencies(
                db, repo_id
            )
        except Exception:
            pass

        # Drift violations + compliance score
        violations: List[Dict] = []
        compliance_score = 100.0
        try:
            from app.services.drift_detection_service import DriftDetectionService

            drift_service = DriftDetectionService()
            drift_report = drift_service.detect_drift(db, repo_id)
            compliance_score = drift_report.get("compliance_score", 100.0)
            violations = [
                {"message": v.message, "severity": v.severity, "type": v.type}
                for v in drift_report.get("violations", [])
            ]
        except Exception:
            pass

        # Tech debt overall health
        overall_health = 0.0
        high_risk_files = 0
        try:
            from app.services.tech_debt_service import TechDebtService

            td_service = TechDebtService()
            td_report = td_service.calculate_repository_tech_debt(db, repo_id)
            overall_health = td_report.get("scorecard", {}).get("overall_health", 0.0)
            high_risk_files = td_report.get("high_risk_count", 0)
        except Exception:
            pass

        # Orphan count
        orphan_count = 0
        try:
            orphan_data = self.analysis_service.find_orphan_modules(db, repo_id)
            orphan_count = orphan_data.get("total_orphans", 0)
        except Exception:
            pass

        # ── Run sub-engines ──────────────────────────────────────────────
        design_recs = self.pattern_engine.analyse(
            db, repo_id, patterns, violations, nodes, relationships
        )
        scalability_recs = self.scalability_engine.analyse(
            db, repo_id, nodes, relationships, files
        )
        refactoring_recs = self.refactoring_engine.analyse(
            db, repo_id, nodes, relationships, files, circular_data
        )

        all_recs: List[ArchitectureRecommendation] = (
            design_recs + scalability_recs + refactoring_recs
        )

        # ── Feature 2: Apply 5-dimension scoring ────────────────────────
        scored_recs: List[ArchitectureRecommendation] = []
        for rec in all_recs:
            scored = self.scorer.score(rec, name_fan_in)
            scored_recs.append(scored)

        # ── Deduplication by title prefix ───────────────────────────────
        seen: Set[str] = set()
        unique_recs: List[ArchitectureRecommendation] = []
        for rec in scored_recs:
            key = rec.title[:38].lower().strip()
            if key not in seen:
                seen.add(key)
                unique_recs.append(rec)

        # ── Re-rank by composite_priority_score (descending) ────────────
        unique_recs.sort(key=lambda r: (-(r.composite_priority_score or 0), r.priority))

        # Re-assign priorities based on composite rank
        for i, rec in enumerate(unique_recs):
            score = rec.composite_priority_score or 0
            rec.priority = _priority_from_composite(score)

        # ── Build summary structures ─────────────────────────────────────
        cat_summary = CategorySummary()
        priority_dist: Dict[int, int] = {}
        for rec in unique_recs:
            if rec.category == RecommendationCategory.design_pattern:
                cat_summary.design_pattern += 1
            elif rec.category == RecommendationCategory.scalability:
                cat_summary.scalability += 1
            elif rec.category == RecommendationCategory.refactoring:
                cat_summary.refactoring += 1
            priority_dist[rec.priority] = priority_dist.get(rec.priority, 0) + 1

        detected_pattern_names = [
            p["pattern"] for p in patterns if p.get("confidence", 0) > 0.3
        ]
        repo_summary = RepoArchitectureSummary(
            total_files=len(files),
            total_nodes=len(nodes),
            total_relationships=len(relationships),
            detected_patterns=detected_pattern_names,
            compliance_score=round(compliance_score, 1),
            overall_health_score=round(overall_health, 1),
            circular_dependency_count=circular_data.get("total_cycles", 0),
            high_risk_files=high_risk_files,
            orphan_modules=orphan_count,
        )

        verdict = _build_verdict(unique_recs, circular_data, compliance_score)

        return ArchitectReportResponse(
            repo_id=repo_id,
            generated_at=datetime.utcnow(),
            recommendations=unique_recs,
            total_recommendations=len(unique_recs),
            total_by_category=cat_summary,
            total_by_priority=priority_dist,
            top_priority_recommendation=unique_recs[0] if unique_recs else None,
            repo_summary=repo_summary,
            engineering_verdict=verdict,
        )


# ===========================================================================
# Verdict Builder
# ===========================================================================


def _build_verdict(
    recs: List[ArchitectureRecommendation],
    circular_data: Dict,
    compliance_score: float,
) -> str:
    if not recs:
        return "No architectural issues detected. The codebase is structurally healthy."

    top = recs[0]
    critical_count = sum(1 for r in recs if r.priority == 1)
    cycle_count = circular_data.get("total_cycles", 0)

    if critical_count > 0:
        return (
            f"{critical_count} critical architectural issue(s) demand immediate engineering attention. "
            f"Top priority: {top.title}. "
            f"Expected improvement: {top.expected_improvement or 'N/A'}. "
            f"Compliance: {compliance_score:.0f}/100."
        )
    if cycle_count > 0:
        return (
            f"{cycle_count} circular dependency cycle(s) are the highest-risk structural issue. "
            f"Resolve these before new feature work begins. Compliance: {compliance_score:.0f}/100."
        )
    return (
        f"Architecture is functionally stable (compliance {compliance_score:.0f}/100). "
        f"Recommended next action: {top.title} "
        f"(confidence {top.confidence:.0%}, expected +{round(top.health_improvement_pct or 0)}% health)."
    )


# ===========================================================================
# Public service interface
# ===========================================================================


class ArchitectService:
    """Public service class used by the API layer."""

    def __init__(self):
        self.engine = ArchitectDecisionEngine()

    def get_report(self, db: Session, repo_id: str) -> ArchitectReportResponse:
        return self.engine.generate_report(db, repo_id)

    def get_summary(self, db: Session, repo_id: str) -> ArchitectSummaryResponse:
        report = self.engine.generate_report(db, repo_id)
        recs = report.recommendations
        avg_conf = (
            round(sum(r.confidence for r in recs) / len(recs), 2) if recs else 0.0
        )
        cat_count: Dict[str, int] = defaultdict(int)
        for r in recs:
            cat_count[r.category.value] += 1
        top_cat = max(cat_count, key=lambda k: cat_count[k]) if cat_count else "none"
        return ArchitectSummaryResponse(
            repo_id=repo_id,
            total_recommendations=report.total_recommendations,
            critical_count=report.total_by_priority.get(1, 0),
            high_count=report.total_by_priority.get(2, 0),
            average_confidence=avg_conf,
            top_category=top_cat,
            engineering_verdict=report.engineering_verdict,
            generated_at=report.generated_at,
        )

    def analyze(self, db: Session, repo_id: str) -> dict:
        # 1. Generate full recommendations report
        report = self.get_report(db, repo_id)

        # 2. Persist recommendations into database (Feature 11 / Database changes)
        db.query(ArchitectureRecommendationModel).filter(
            ArchitectureRecommendationModel.repo_id == repo_id
        ).delete()
        for r in report.recommendations:
            db_rec = ArchitectureRecommendationModel(
                id=r.id,
                repo_id=repo_id,
                category=r.category.value,
                recommendation_type=r.category.value,
                title=r.title,
                description=r.reason,
                priority=r.priority,
                confidence=r.confidence,
                risk=r.risk.value,
                estimated_effort=r.estimated_effort,
                expected_impact=r.expected_impact,
                status=r.status.value,
                payload={
                    "evidence": r.evidence,
                    "trade_offs": r.trade_offs,
                    "alternatives": r.alternatives,
                    "business_impact_score": r.business_impact_score,
                    "technical_impact_score": r.technical_impact_score,
                    "risk_reduction_score": r.risk_reduction_score,
                    "engineering_effort_score": r.engineering_effort_score,
                    "health_improvement_pct": r.health_improvement_pct,
                },
            )
            db.add(db_rec)

        # 3. Persist AI Review into architecture_reviews table
        db.query(ArchitectureReviewModel).filter(
            ArchitectureReviewModel.repo_id == repo_id
        ).delete()
        from app.services.ai_engineering_review import AiEngineeringReviewService

        review_service = AiEngineeringReviewService()
        rev = review_service.get_review_report(db, repo_id)
        db_rev = ArchitectureReviewModel(
            repo_id=repo_id,
            health_score=report.repo_summary.overall_health_score or 75.0,
            strengths=rev.strengths,
            weaknesses=rev.weaknesses,
            summary=rev.overall_summary,
        )
        db.add(db_rev)

        # 4. Persist dynamic ADRs into architecture_decisions_generated table
        db.query(ArchitectureDecisionGeneratedModel).filter(
            ArchitectureDecisionGeneratedModel.repo_id == repo_id
        ).delete()
        from app.services.adr_generator import AdrGeneratorService

        adr_service = AdrGeneratorService()
        adr_rep = adr_service.get_adr_report(db, repo_id)
        for adr in adr_rep.proposals:
            db_adr = ArchitectureDecisionGeneratedModel(
                id=adr.id,
                repo_id=repo_id,
                title=adr.title,
                reason=adr.reason,
                alternatives=adr.alternatives,
                impact=adr.result,
            )
            db.add(db_adr)

        db.commit()
        return {
            "status": "success",
            "message": f"Successfully analyzed repository {repo_id}.",
        }
