"""
DesignPatternAdvisorService
============================
Feature 3 — Analyses the repository knowledge graph and recommends 11 architectural
patterns, each with Why / Where / Benefits / Drawbacks / Evidence.

Patterns covered:
  1.  Repository Pattern
  2.  Factory Pattern
  3.  Strategy Pattern
  4.  Observer Pattern
  5.  Adapter Pattern
  6.  Facade Pattern
  7.  Dependency Injection
  8.  CQRS
  9.  Event Sourcing
  10. Saga Pattern
  11. Circuit Breaker
"""

import uuid
from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.models.file import File
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.schemas.advisor import PatternAdvisory, PatternAdvisoryReport
from app.services.architecture_detector import ArchitectureDetector

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _pid() -> str:
    return f"pat_{uuid.uuid4().hex[:8]}"


def _lvl(confidence: float) -> str:
    if confidence >= 0.75:
        return "High"
    if confidence >= 0.45:
        return "Medium"
    return "Low"


def _pri(confidence: float, applicable: bool) -> int:
    if not applicable:
        return 5
    if confidence >= 0.85:
        return 1
    if confidence >= 0.70:
        return 2
    if confidence >= 0.50:
        return 3
    return 4


# ---------------------------------------------------------------------------
# Pattern detectors
# ---------------------------------------------------------------------------


class _PatternDetectors:
    """
    Each method returns a (applicable: bool, confidence: float, evidence: list, where: list) tuple.
    Methods operate on pre-computed graph structures passed in by the advisor service.
    """

    def repository_pattern(
        self,
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        patterns: List[Dict],
        fan_in: Dict,
    ):
        already = any(
            p["pattern"].lower() == "repository pattern"
            and p.get("confidence", 0) >= 0.55
            for p in patterns
        )
        api_ids = {
            n.id
            for n in nodes
            if "api" in n.type.lower() or "controller" in n.name.lower()
        }
        db_ids = {
            n.id
            for n in nodes
            if "database" in n.type.lower()
            or "table" in n.type.lower()
            or "model" in n.name.lower()
        }
        direct_edges = [
            r for r in relationships if r.source_id in api_ids and r.target_id in db_ids
        ]
        where = []
        evidence = []
        if direct_edges:
            for e in direct_edges[:4]:
                src = next((n.name for n in nodes if n.id == e.source_id), "")
                if src:
                    where.append(src)
                    evidence.append(
                        f"`{src}` directly queries the database without a repository abstraction."
                    )
        conf = min(0.6 + len(direct_edges) * 0.06, 0.97) if direct_edges else 0.2
        return not already, already, conf, evidence, list(set(where))

    def factory_pattern(
        self,
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        files: List[Any],
        fan_out: Dict,
    ):
        creator_nodes = [
            n
            for n in nodes
            if n.type.lower() in ("class", "service") and fan_out[n.id] >= 6
        ]
        already = any(
            "factory" in n.name.lower() or "builder" in n.name.lower() for n in nodes
        )
        where = [n.name for n in creator_nodes[:4]]
        evidence = [
            f"`{n.name}` has {fan_out[n.id]} outgoing creation dependencies — may benefit from factory abstraction."
            for n in creator_nodes[:3]
        ]
        conf = min(0.55 + len(creator_nodes) * 0.05, 0.88) if creator_nodes else 0.2
        return bool(creator_nodes), already, conf, evidence, where

    def strategy_pattern(
        self,
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        files: List[Any],
    ):
        already = any("strategy" in n.name.lower() for n in nodes)
        high_cc_files = [
            f
            for f in files
            if f.metrics and f.metrics.complexity_max and f.metrics.complexity_max >= 12
        ]
        where = [f.file_path.split("/")[-1] for f in high_cc_files[:4]]
        evidence = [
            f"`{f.file_path.split('/')[-1]}` has max cyclomatic complexity {f.metrics.complexity_max} — large if/elif switch suggests interchangeable algorithms."
            for f in high_cc_files[:3]
        ]
        conf = min(0.5 + len(high_cc_files) * 0.07, 0.87) if high_cc_files else 0.2
        return bool(high_cc_files), already, conf, evidence, where

    def observer_pattern(
        self,
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        fan_out: Dict,
    ):
        already = any(
            any(
                kw in n.name.lower()
                for kw in ("event", "signal", "emitter", "listener", "subscriber")
            )
            for n in nodes
        )
        broadcast_nodes = [
            n
            for n in nodes
            if fan_out[n.id] >= 8 and n.type.lower() in ("service", "module", "class")
        ]
        where = [n.name for n in broadcast_nodes[:4]]
        evidence = [
            f"`{n.name}` fans out to {fan_out[n.id]} dependants — tightly coupling producers to consumers."
            for n in broadcast_nodes[:3]
        ]
        conf = min(0.52 + len(broadcast_nodes) * 0.06, 0.86) if broadcast_nodes else 0.2
        return bool(broadcast_nodes), already, conf, evidence, where

    def adapter_pattern(
        self,
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        files: List[Any],
        fan_in: Dict,
    ):
        already = any(
            any(kw in n.name.lower() for kw in ("adapter", "wrapper", "client"))
            for n in nodes
        )
        # Look for external library imports used directly (high coupling, external-sounding names)
        external_patterns = [
            "requests",
            "boto",
            "redis",
            "stripe",
            "twilio",
            "sendgrid",
            "openai",
            "google",
            "aws",
        ]
        ext_imports = []
        for f in files:
            for imp in f.imports or []:
                if any(ep in (imp.module or "").lower() for ep in external_patterns):
                    ext_imports.append((f.file_path.split("/")[-1], imp.module))
        unique_files = list({fi for fi, _ in ext_imports})
        evidence = [
            f"`{fi}` directly imports `{mod}` — no abstraction wrapper detected."
            for fi, mod in ext_imports[:4]
        ]
        conf = min(0.55 + len(unique_files) * 0.05, 0.89) if unique_files else 0.2
        return bool(unique_files), already, conf, evidence, unique_files[:5]

    def facade_pattern(
        self,
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        fan_in: Dict,
    ):
        already = any("facade" in n.name.lower() for n in nodes)
        complex_nodes = [
            n
            for n in nodes
            if fan_in[n.id] >= 9 and n.type.lower() in ("service", "module")
        ]
        where = [n.name for n in complex_nodes[:4]]
        evidence = [
            f"`{n.name}` is accessed by {fan_in[n.id]} external callers — a Facade could simplify the interface."
            for n in complex_nodes[:3]
        ]
        conf = min(0.55 + len(complex_nodes) * 0.06, 0.88) if complex_nodes else 0.2
        return bool(complex_nodes), already, conf, evidence, where

    def dependency_injection(
        self,
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        fan_out: Dict,
    ):
        already = any(
            any(
                kw in n.name.lower()
                for kw in ("container", "injector", "provider", "di")
            )
            for n in nodes
        )
        concrete_deps = [
            n
            for n in nodes
            if fan_out[n.id] >= 5
            and n.type.lower() in ("class", "service")
            and not any(
                kw in n.name.lower() for kw in ("interface", "abstract", "base")
            )
        ]
        where = [n.name for n in concrete_deps[:5]]
        evidence = [
            f"`{n.name}` has {fan_out[n.id]} concrete hard-wired dependencies — DI would allow runtime substitution."
            for n in concrete_deps[:3]
        ]
        conf = min(0.60 + len(concrete_deps) * 0.04, 0.90) if concrete_deps else 0.2
        return bool(concrete_deps), already, conf, evidence, where

    def cqrs(
        self,
        patterns: List[Dict],
        nodes: List[GraphNode],
        relationships: List[GraphRelationship],
        fan_in: Dict,
        fan_out: Dict,
    ):
        already = any(
            p["pattern"].lower() == "cqrs" and p.get("confidence", 0) >= 0.5
            for p in patterns
        )
        mixed = [
            n
            for n in nodes
            if fan_in[n.id] > 4
            and fan_out[n.id] > 4
            and n.type.lower() in ("service", "module")
        ]
        where = [n.name for n in mixed[:4]]
        evidence = [
            f"`{n.name}` routes both reads ({fan_in[n.id]} in) and writes ({fan_out[n.id]} out) through the same paths."
            for n in mixed[:3]
        ]
        conf = min(0.55 + len(mixed) * 0.06, 0.87) if mixed else 0.2
        return bool(mixed), already, conf, evidence, where

    def event_sourcing(self, nodes: List[GraphNode], patterns: List[Dict]):
        already = any(
            any(
                kw in n.name.lower()
                for kw in ("event_store", "eventstore", "event_log", "aggregate")
            )
            for n in nodes
        )
        event_driven = any(
            p["pattern"].lower() == "event driven" and p.get("confidence", 0) >= 0.4
            for p in patterns
        )
        evidence = []
        if event_driven:
            evidence.append(
                "Event-Driven pattern detected — Event Sourcing extends this to persist state as a sequence of events."
            )
        if not already:
            evidence.append(
                "No event store, event log, or aggregate root detected in the repository graph."
            )
        conf = 0.65 if (event_driven and not already) else 0.35
        return (event_driven and not already), already, conf, evidence, []

    def saga_pattern(
        self, nodes: List[GraphNode], relationships: List[GraphRelationship]
    ):
        already = any("saga" in n.name.lower() for n in nodes)
        # Look for multi-step sequential service-to-service call chains
        service_nodes = [n for n in nodes if n.type.lower() == "service"]
        service_ids = {n.id for n in service_nodes}
        s2s_edges = [
            r
            for r in relationships
            if r.source_id in service_ids and r.target_id in service_ids
        ]
        chains = len(s2s_edges)
        where = list(
            {
                next((n.name for n in service_nodes if n.id == r.source_id), "")
                for r in s2s_edges[:4]
            }
        )
        evidence = []
        if chains >= 4:
            evidence.append(
                f"{chains} service-to-service call edges detected — multi-step operations risk partial failure without compensation."
            )
        conf = min(0.5 + chains * 0.05, 0.82) if chains >= 4 else 0.2
        return chains >= 4, already, conf, evidence, [w for w in where if w][:4]

    def circuit_breaker(self, nodes: List[GraphNode], files: List[Any]):
        already = any(
            any(
                kw in n.name.lower()
                for kw in ("circuit", "breaker", "resilience", "retry", "fallback")
            )
            for n in nodes
        )
        # Look for external HTTP/API call patterns
        ext_patterns = ["requests", "httpx", "aiohttp", "urllib", "boto", "openai"]
        ext_call_files = []
        for f in files:
            for imp in f.imports or []:
                if any(ep in (imp.module or "").lower() for ep in ext_patterns):
                    ext_call_files.append(f.file_path.split("/")[-1])
                    break
        unique_ext = list(set(ext_call_files))
        evidence = [
            f"`{fi}` makes external HTTP calls — no circuit breaker or retry logic detected."
            for fi in unique_ext[:4]
        ]
        conf = min(0.62 + len(unique_ext) * 0.05, 0.91) if unique_ext else 0.2
        return bool(unique_ext) and not already, already, conf, evidence, unique_ext[:5]


# ---------------------------------------------------------------------------
# Pattern Definitions (metadata)
# ---------------------------------------------------------------------------


PATTERN_META: Dict[str, Dict] = {
    "repository": {
        "name": "Repository Pattern",
        "category": "Architectural",
        "icon": "🗄️",
        "benefits": [
            "Decouples persistence logic from business logic",
            "Enables in-memory fakes for fast unit testing",
            "Makes database technology swappable without touching business code",
            "Centralises query logic in one place",
        ],
        "drawbacks": [
            "Adds an abstraction layer (more files)",
            "Can become a leaky abstraction for complex queries",
            "Teams unfamiliar with the pattern need onboarding",
        ],
        "hint": "Create a `{Entity}Repository` interface with `find_by_id`, `save`, `delete` methods. Inject it via constructor into services.",
        "related": ["Dependency Injection", "Unit of Work", "CQRS"],
    },
    "factory": {
        "name": "Factory Pattern",
        "category": "Creational",
        "icon": "🏭",
        "benefits": [
            "Centralises object creation logic",
            "Makes adding new types trivially easy",
            "Removes conditional object creation from business logic",
        ],
        "drawbacks": [
            "Extra indirection for simple cases",
            "Can hide what object is actually created",
        ],
        "hint": "Create a `{Entity}Factory.create(type, params)` method. Replace all `if type == 'X': return X()` blocks with factory calls.",
        "related": ["Strategy Pattern", "Dependency Injection"],
    },
    "strategy": {
        "name": "Strategy Pattern",
        "category": "Behavioral",
        "icon": "♟️",
        "benefits": [
            "Replaces large if/elif chains with interchangeable algorithms",
            "New strategies can be added without modifying existing code (Open/Closed Principle)",
            "Strategies can be unit tested in complete isolation",
        ],
        "drawbacks": [
            "Clients must be aware of different strategies",
            "Adds extra classes for simple logic",
        ],
        "hint": "Define an `{Algorithm}Strategy` protocol/interface with an `execute()` method. Move each branch of your if/elif into its own strategy class.",
        "related": ["Factory Pattern", "Template Method"],
    },
    "observer": {
        "name": "Observer Pattern",
        "category": "Behavioral",
        "icon": "👁️",
        "benefits": [
            "Decouples event producers from event consumers",
            "Adding new listeners requires zero change to the publisher",
            "Enables async processing of events",
        ],
        "drawbacks": [
            "Unexpected update order if subscribers aren't ordered",
            "Memory leaks if observers aren't unregistered",
            "Harder to trace cause-and-effect in debugging",
        ],
        "hint": "Create an `EventEmitter` with `subscribe(event, handler)` and `emit(event, data)`. Replace direct method calls with event publishing.",
        "related": ["Event Sourcing", "Mediator Pattern"],
    },
    "adapter": {
        "name": "Adapter Pattern",
        "category": "Structural",
        "icon": "🔌",
        "benefits": [
            "Isolates third-party library interfaces from business code",
            "Makes library swaps non-breaking (change one file, not all call sites)",
            "Enables mocking of external services in tests",
        ],
        "drawbacks": [
            "Adds an extra layer between client and third-party",
            "Must keep adapter up to date with external API changes",
        ],
        "hint": "Create a `{Service}Adapter` class that wraps the external library. All application code calls the adapter, never the library directly.",
        "related": ["Facade Pattern", "Repository Pattern"],
    },
    "facade": {
        "name": "Facade Pattern",
        "category": "Structural",
        "icon": "🏛️",
        "benefits": [
            "Provides a simplified interface to a complex subsystem",
            "Reduces the number of objects a client must interact with",
            "Decouples clients from subsystem internals",
        ],
        "drawbacks": [
            "Risk of becoming a 'god object' if overloaded",
            "Can hide useful functionality behind too simple an interface",
        ],
        "hint": "Create a `{Subsystem}Facade` that exposes only the operations needed by clients, delegating to the complex subsystem internally.",
        "related": ["Adapter Pattern", "Service Layer"],
    },
    "dependency_injection": {
        "name": "Dependency Injection",
        "category": "Architectural",
        "icon": "💉",
        "benefits": [
            "Hard-wired dependencies become swappable at runtime",
            "Enables true unit testing by injecting test doubles",
            "Reduces coupling between components",
            "Centralises object graph wiring in one place",
        ],
        "drawbacks": [
            "Requires a DI container or manual wiring",
            "Can obscure the dependency graph for new engineers",
        ],
        "hint": "Pass all dependencies through constructors. Use FastAPI's `Depends()` for HTTP layer DI, or a dedicated container library for complex service graphs.",
        "related": ["Repository Pattern", "Factory Pattern", "Interface Segregation"],
    },
    "cqrs": {
        "name": "CQRS",
        "category": "Architectural",
        "icon": "⚖️",
        "benefits": [
            "Read and write paths can be optimised independently",
            "Query models can be denormalised for performance",
            "Commands and queries have clear, separate responsibilities",
        ],
        "drawbacks": [
            "Increases overall complexity",
            "Eventual consistency between write model and read projections",
            "More code to maintain",
        ],
        "hint": "Split all operations into `Commands` (write) and `Queries` (read). Command handlers mutate state; query handlers return read-optimised projections.",
        "related": ["Event Sourcing", "Repository Pattern"],
    },
    "event_sourcing": {
        "name": "Event Sourcing",
        "category": "Architectural",
        "icon": "📜",
        "benefits": [
            "Complete audit trail of all state changes",
            "Ability to replay events and reconstruct state at any point in time",
            "Natural fit with event-driven and CQRS architectures",
        ],
        "drawbacks": [
            "Querying current state requires event replay or projections",
            "Event schema versioning is complex",
            "Significant paradigm shift for teams used to CRUD",
        ],
        "hint": "Store every state change as an immutable event in an event log (e.g., using EventStoreDB or Kafka). Rebuild aggregate state by replaying events.",
        "related": ["CQRS", "Observer Pattern", "Saga Pattern"],
    },
    "saga": {
        "name": "Saga Pattern",
        "category": "Distributed",
        "icon": "⛓️",
        "benefits": [
            "Manages long-running distributed transactions without 2PC",
            "Each step is independently reversible via compensating transactions",
            "Improves resilience: one service failure doesn't lock the whole system",
        ],
        "drawbacks": [
            "Complex to implement and reason about",
            "Compensating transactions must be idempotent",
            "Eventual consistency — system may be temporarily inconsistent",
        ],
        "hint": "Define each distributed operation as a `SagaStep` with a `execute()` and `compensate()` method. Orchestrate via a saga coordinator or choreography via events.",
        "related": ["Event Sourcing", "Circuit Breaker", "CQRS"],
    },
    "circuit_breaker": {
        "name": "Circuit Breaker",
        "category": "Distributed",
        "icon": "⚡",
        "benefits": [
            "Prevents cascading failures when external services are unavailable",
            "Fails fast instead of waiting for long timeouts",
            "Automatically recovers when the downstream service recovers",
        ],
        "drawbacks": [
            "Requires careful threshold tuning (too sensitive = false positives)",
            "State management overhead for half-open state",
        ],
        "hint": "Wrap all external service calls with a circuit breaker (e.g., `pybreaker`, `resilience4j`). Configure failure threshold, timeout, and recovery probe interval.",
        "related": ["Saga Pattern", "Retry Pattern", "Adapter Pattern"],
    },
}


# ---------------------------------------------------------------------------
# Main Service
# ---------------------------------------------------------------------------


class DesignPatternAdvisorService:
    def __init__(self):
        self.detectors = _PatternDetectors()
        self.arch_detector = ArchitectureDetector()

    def get_advisories(self, db: Session, repo_id: str) -> PatternAdvisoryReport:

        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
        relationships = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.repository_id == repo_id)
            .all()
        )
        files = db.query(File).filter(File.repository_id == repo_id).all()

        # Pre-compute graph structures
        fan_in: Dict[str, int] = defaultdict(int)
        fan_out: Dict[str, int] = defaultdict(int)
        for r in relationships:
            fan_out[r.source_id] += 1
            fan_in[r.target_id] += 1

        # Detected patterns from architecture detector
        patterns: List[Dict] = []
        try:
            patterns = self.arch_detector.detect(db, repo_id)
        except Exception:
            patterns = []

        # Import File model already done at start of get_advisories

        detectors = self.detectors
        results: List[PatternAdvisory] = []

        raw = [
            (
                "repository",
                detectors.repository_pattern(nodes, relationships, patterns, fan_in),
            ),
            (
                "factory",
                detectors.factory_pattern(nodes, relationships, files, fan_out),
            ),
            ("strategy", detectors.strategy_pattern(nodes, relationships, files)),
            ("observer", detectors.observer_pattern(nodes, relationships, fan_out)),
            ("adapter", detectors.adapter_pattern(nodes, relationships, files, fan_in)),
            ("facade", detectors.facade_pattern(nodes, relationships, fan_in)),
            (
                "dependency_injection",
                detectors.dependency_injection(nodes, relationships, fan_out),
            ),
            ("cqrs", detectors.cqrs(patterns, nodes, relationships, fan_in, fan_out)),
            ("event_sourcing", detectors.event_sourcing(nodes, patterns)),
            ("saga", detectors.saga_pattern(nodes, relationships)),
            ("circuit_breaker", detectors.circuit_breaker(nodes, files)),
        ]

        for key, (applicable, already_present, conf, evidence, where) in raw:
            meta = PATTERN_META.get(key, {})
            effort_map = {
                "repository": "Medium",
                "factory": "Low",
                "strategy": "Low",
                "observer": "Medium",
                "adapter": "Low",
                "facade": "Low",
                "dependency_injection": "Medium",
                "cqrs": "High",
                "event_sourcing": "High",
                "saga": "High",
                "circuit_breaker": "Low",
            }
            results.append(
                PatternAdvisory(
                    id=_pid(),
                    pattern_name=meta.get("name", key),
                    pattern_key=key,
                    category=meta.get("category", "Architectural"),
                    icon=meta.get("icon", "◈"),
                    applicable=applicable,
                    already_present=already_present,
                    confidence=round(conf, 2),
                    priority=_pri(conf, applicable),
                    effort=effort_map.get(key, "Medium"),
                    why=_build_why(key, applicable, already_present, evidence),
                    where=where,
                    benefits=meta.get("benefits", []),
                    drawbacks=meta.get("drawbacks", []),
                    evidence=evidence,
                    implementation_hint=meta.get("hint", ""),
                    related_patterns=meta.get("related", []),
                )
            )

        # Sort: applicable first, then by confidence
        results.sort(key=lambda x: (not x.applicable, -x.confidence))

        applicable_recs = [r for r in results if r.applicable]
        present = [r for r in results if r.already_present]

        verdict = (
            (
                f"{len(applicable_recs)} pattern(s) recommended for immediate adoption. "
                f"{len(present)} already implemented in the codebase."
            )
            if applicable_recs
            else "All key patterns are either implemented or not applicable."
        )

        return PatternAdvisoryReport(
            repo_id=repo_id,
            generated_at=datetime.utcnow(),
            advisories=results,
            total_applicable=len(applicable_recs),
            total_already_present=len(present),
            total_not_applicable=len(results) - len(applicable_recs) - len(present),
            recommended_order=[r.pattern_name for r in applicable_recs[:5]],
            summary=verdict,
        )


def _build_why(
    key: str, applicable: bool, already_present: bool, evidence: List[str]
) -> str:
    if already_present:
        return f"The {PATTERN_META.get(key, {}).get('name', key)} is already present in the codebase. Review its implementation quality."
    if not applicable:
        return f"No strong signals detected that the {PATTERN_META.get(key, {}).get('name', key)} would provide significant benefit here."
    first_ev = evidence[0] if evidence else ""
    return f"{first_ev} Applying this pattern here would improve modularity, testability, and long-term maintainability."
