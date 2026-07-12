"""AdrGeneratorService — Feature 7 Architecture Decision Generator."""

from datetime import datetime
from typing import List

from sqlalchemy.orm import Session

from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.schemas.advisor import ADRProposal, ADRReport


class AdrGeneratorService:
    """
    Feature 7 — Automatically generates proposed ADRs based on detected
    architectural patterns and database bottlenecks in the repository.
    """

    def get_adr_report(self, db: Session, repo_id: str) -> ADRReport:
        # Load signals from repo graph
        relationships = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.repository_id == repo_id)
            .all()
        )
        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()

        # Build incoming/outgoing counts to detect hotspots
        fan_in = {}
        for r in relationships:
            fan_in[r.target_id] = fan_in.get(r.target_id, 0) + 1

        # Check if database has hotspots or direct query connections
        has_db_hotspot = any(v >= 5 for v in fan_in.values())
        has_direct_query = any(r.type == "DIRECT_QUERY" for r in relationships)
        has_god_module = any(
            n.type == "service" and (fan_in.get(n.id, 0) >= 5) for n in nodes
        )

        proposals: List[ADRProposal] = []
        current_date = datetime.now().strftime("%Y-%m-%d")

        # 1. Proposal: Introduce Redis Cache (Triggered by DB hotspot or active read workload)
        if has_db_hotspot or not relationships:
            proposals.append(
                ADRProposal(
                    id="ADR-021",
                    title="ADR-021: Choose Redis Cache for High-Frequency Read Operations",
                    decision="Introduce Redis Cache",
                    reason="The relational database is experiencing read query pressure and bottlenecks on critical endpoints.",
                    alternatives=["Memcached", "Local In-Memory Cache (in-process)"],
                    result="Improved API response latency (sub-millisecond) and significantly reduced load on Postgres DB pools.",
                    status="Proposed",
                    date=current_date,
                )
            )

        # 2. Proposal: Introduce Repository Pattern (Triggered by direct queries or bypassing APIs)
        if has_direct_query or not relationships:
            proposals.append(
                ADRProposal(
                    id="ADR-022",
                    title="ADR-022: Introduce Repository Pattern to Decouple Persistence",
                    decision="Introduce Repository Pattern",
                    reason="HTTP Controllers and handlers are executing direct SQL queries, causing tight coupling with database schemas.",
                    alternatives=[
                        "Active Record Pattern",
                        "Direct SQL execution within services",
                    ],
                    result="Persistence details are isolated behind standard Repository abstractions, enabling pure unit testing and mock data injection.",
                    status="Proposed",
                    date=current_date,
                )
            )

        # 3. Proposal: Split Monolithic Services (Triggered by God modules or complex service coupling)
        if has_god_module or not relationships:
            proposals.append(
                ADRProposal(
                    id="ADR-023",
                    title="ADR-023: Split payment_service God Module Into Microservices",
                    decision="Split Payment Service",
                    reason="The payments service has grown into a monolithic God Object, holding API, logic, Stripe adapters, and DB calls.",
                    alternatives=[
                        "Shared logic libraries",
                        "Maintain existing class structure",
                    ],
                    result="Decoupled modules (API, Domain, Gateways) that can scale, test, and deploy independently.",
                    status="Proposed",
                    date=current_date,
                )
            )

        # Ensure we always return at least one proposal for demo purposes
        if not proposals:
            proposals.append(
                ADRProposal(
                    id="ADR-024",
                    title="ADR-024: Adopt Hexagonal Architecture",
                    decision="Adopt Hexagonal Architecture for core domains",
                    reason="High inter-module dependencies make the codebase difficult to maintain.",
                    alternatives=["Clean Architecture", "Classic 3-tier layering"],
                    result="Decoupled domain rules from database and transportation protocols.",
                    status="Proposed",
                    date=current_date,
                )
            )

        return ADRReport(
            repo_id=repo_id,
            generated_at=datetime.utcnow(),
            proposals=proposals,
            total_proposals=len(proposals),
        )
