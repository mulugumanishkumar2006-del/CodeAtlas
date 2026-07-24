import random
from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.repository import Repository
from app.models.user import User

router = APIRouter()


class SoftwareWorldNode(BaseModel):
    id: str
    name: str
    full_name: str
    status: str  # active, degraded, outage
    primary_language: str
    health_score: int
    lines_of_code: int
    coverage: float
    complexity: int
    alerts: List[str]
    is_mock: bool
    clone_url: str
    x: float
    y: float


class SoftwareWorldEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str  # api, event, library
    label: str
    latency_ms: Optional[int] = None
    is_critical: bool


class SoftwareWorldResponse(BaseModel):
    nodes: List[SoftwareWorldNode]
    edges: List[SoftwareWorldEdge]


@router.get(
    "/software-world",
    response_model=SoftwareWorldResponse,
    summary="Get multi-repository software world topology",
    tags=["repositories"],
)
def get_software_world(
    scale: int = 13,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    nodes = []
    edges = []

    # 1. Fetch user's real repositories from database
    db_repos = db.query(Repository).filter(Repository.user_id == user.id).all()

    # Track the real repository IDs to merge them
    real_repo_nodes = []
    for idx, repo in enumerate(db_repos):
        # Position actual repositories at the top left of the graph
        real_repo_nodes.append(
            SoftwareWorldNode(
                id=repo.id,
                name=repo.name,
                full_name=repo.full_name,
                status="active" if repo.status == "cloned" else "degraded",
                primary_language="Python",  # Default for CodeAtlas components
                health_score=88 if repo.status == "cloned" else 50,
                lines_of_code=45000,
                coverage=0.74,
                complexity=340,
                alerts=(
                    []
                    if repo.status == "cloned"
                    else ["Repository cloning pending/failed"]
                ),
                is_mock=False,
                clone_url=repo.clone_url,
                x=100 + (idx * 300),
                y=-450,
            )
        )
    nodes.extend(real_repo_nodes)

    # If standard scale (13 microservices)
    if scale < 100:
        # Standard core mock microservices
        mock_services = [
            (
                "netflix-api-gateway",
                "Java",
                "Gateway",
                1000,
                0,
                95,
                120000,
                0.88,
                120,
                [],
            ),
            (
                "netflix-web-client",
                "TypeScript",
                "Client",
                700,
                -250,
                92,
                85000,
                0.78,
                90,
                [],
            ),
            (
                "netflix-ios-app",
                "Swift",
                "Client",
                1000,
                -250,
                90,
                150000,
                0.81,
                140,
                ["Stripe framework warning"],
            ),
            (
                "netflix-android-app",
                "Kotlin",
                "Client",
                1300,
                -250,
                89,
                140000,
                0.80,
                130,
                [],
            ),
            (
                "netflix-auth-service",
                "Go",
                "Security",
                400,
                250,
                98,
                45000,
                0.94,
                60,
                [],
            ),
            (
                "netflix-user-profile",
                "JavaScript",
                "Core Service",
                700,
                250,
                94,
                32000,
                0.85,
                45,
                [],
            ),
            (
                "netflix-payment-processor",
                "Python",
                "Billing",
                1300,
                250,
                78,
                55000,
                0.62,
                180,
                ["Direct DB connections", "Stripe API latency +240ms"],
            ),
            (
                "netflix-billing-ledger",
                "Rust",
                "Billing",
                1600,
                250,
                99,
                18000,
                0.97,
                30,
                [],
            ),
            (
                "netflix-video-encoder",
                "C++",
                "Streaming",
                700,
                500,
                91,
                280000,
                0.75,
                410,
                [],
            ),
            (
                "netflix-cdn-allocator",
                "Go",
                "Streaming",
                1000,
                500,
                96,
                25000,
                0.92,
                50,
                [],
            ),
            (
                "netflix-playback-telemetry",
                "JavaScript",
                "Core Service",
                1300,
                500,
                85,
                95000,
                0.70,
                110,
                [],
            ),
            (
                "netflix-recommendation",
                "Python",
                "AI/ML",
                700,
                750,
                87,
                180000,
                0.65,
                230,
                ["High query load"],
            ),
            (
                "netflix-content-search",
                "Java",
                "AI/ML",
                1000,
                750,
                93,
                72000,
                0.83,
                85,
                [],
            ),
        ]

        for (
            name,
            lang,
            role,
            x,
            y,
            health_val,
            loc,
            cov,
            comp,
            alerts_list,
        ) in mock_services:
            status_str = "active"
            if health_val < 80:
                status_str = "degraded"

            nodes.append(
                SoftwareWorldNode(
                    id=name,
                    name=name,
                    full_name=f"netflix/{name}",
                    status=status_str,
                    primary_language=lang,
                    health_score=health_val,
                    lines_of_code=loc,
                    coverage=cov,
                    complexity=comp,
                    alerts=alerts_list,
                    is_mock=True,
                    clone_url=f"https://github.com/netflix/{name}.git",
                    x=x,
                    y=y,
                )
            )

        # Core mock edges
        edges_data = [
            (
                "e1",
                "netflix-web-client",
                "netflix-api-gateway",
                "api",
                "HTTP /api/v1",
                12,
                False,
            ),
            (
                "e2",
                "netflix-ios-app",
                "netflix-api-gateway",
                "api",
                "HTTP /api/v1",
                24,
                False,
            ),
            (
                "e3",
                "netflix-android-app",
                "netflix-api-gateway",
                "api",
                "HTTP /api/v1",
                32,
                False,
            ),
            (
                "e4",
                "netflix-api-gateway",
                "netflix-auth-service",
                "api",
                "gRPC /verify",
                5,
                True,
            ),
            (
                "e5",
                "netflix-api-gateway",
                "netflix-user-profile",
                "api",
                "gRPC /profile",
                15,
                False,
            ),
            (
                "e6",
                "netflix-api-gateway",
                "netflix-payment-processor",
                "api",
                "HTTP /charge",
                18,
                True,
            ),
            (
                "e7",
                "netflix-payment-processor",
                "netflix-billing-ledger",
                "api",
                "gRPC /ledger",
                8,
                True,
            ),
            (
                "e8",
                "netflix-payment-processor",
                "netflix-auth-service",
                "library",
                "OAuth-SDK",
                None,
                False,
            ),
            (
                "e9",
                "netflix-api-gateway",
                "netflix-video-encoder",
                "event",
                "Kafka: video.upload",
                None,
                False,
            ),
            (
                "e10",
                "netflix-api-gateway",
                "netflix-cdn-allocator",
                "api",
                "HTTP /cdn/route",
                45,
                False,
            ),
            (
                "e11",
                "netflix-playback-telemetry",
                "netflix-recommendation",
                "event",
                "Kafka: playback.events",
                None,
                False,
            ),
            (
                "e12",
                "netflix-recommendation",
                "netflix-user-profile",
                "api",
                "gRPC /profile",
                8,
                False,
            ),
            (
                "e13",
                "netflix-api-gateway",
                "netflix-content-search",
                "api",
                "HTTP /search",
                55,
                False,
            ),
        ]

        for edge_id, src, tgt, edge_type, label, lat, is_crit in edges_data:
            edges.append(
                SoftwareWorldEdge(
                    id=edge_id,
                    source=src,
                    target=tgt,
                    type=edge_type,
                    label=label,
                    latency_ms=lat,
                    is_critical=is_crit,
                )
            )

        # Connect user's real repos to api-gateway to tie them into the map
        for idx, real_repo in enumerate(real_repo_nodes):
            edges.append(
                SoftwareWorldEdge(
                    id=f"real-edge-{idx}",
                    source=real_repo.id,
                    target="netflix-api-gateway",
                    type="api",
                    label="gRPC link",
                    latency_ms=10,
                    is_critical=False,
                )
            )

    else:
        # Scale to 300 repositories
        clusters = [
            (
                "edge-gateways",
                "Clients & Gateways",
                ["TypeScript", "Swift", "Kotlin", "Java"],
            ),
            ("auth-profiles", "Identity & Profiles", ["Go", "Node.js", "Java"]),
            ("core-services", "Core APIs & Catalog", ["Java", "Scala", "Go"]),
            ("streaming-cdn", "Video Streaming & CDN", ["C++", "Go", "Rust"]),
            ("billing-ledger", "Payments & Billing", ["Python", "Rust", "Go"]),
            ("ai-recommendations", "Data Science & AI", ["Python", "Java", "Scala"]),
        ]

        # Generate 300 repositories divided into clusters
        total_mock_nodes = 300
        for i in range(1, total_mock_nodes + 1):
            cluster_idx = (i - 1) % 6
            cluster_id, cluster_name, languages = clusters[cluster_idx]

            # Settle position coordinates in grid pattern per cluster
            node_idx = (i - 1) // 6  # ranges 0 to 49
            row = node_idx // 10  # 0 to 4
            col = node_idx % 10  # 0 to 9

            # Position offset spacing
            y_start = cluster_idx * 450
            x = col * 260 + (row % 2) * 40
            y = y_start + row * 90

            lang = languages[node_idx % len(languages)]
            health_score = random.randint(65, 100)
            status_str = "active"
            if health_score < 75:
                status_str = "degraded"
            elif health_score < 70:
                status_str = "outage"

            loc = random.randint(5000, 350000)
            coverage = round(random.uniform(0.40, 0.98), 2)
            complexity = random.randint(20, 450)

            alerts = []
            if health_score < 80:
                alerts.append("Performance degradation detected")
            if coverage < 0.50:
                alerts.append("Low test coverage")
            if complexity > 300:
                alerts.append("High cyclomatic complexity")

            node_id = f"netflix-{cluster_id}-{node_idx + 1}"

            nodes.append(
                SoftwareWorldNode(
                    id=node_id,
                    name=node_id,
                    full_name=f"netflix/{node_id}",
                    status=status_str,
                    primary_language=lang,
                    health_score=health_score,
                    lines_of_code=loc,
                    coverage=coverage,
                    complexity=complexity,
                    alerts=alerts,
                    is_mock=True,
                    clone_url=f"https://github.com/netflix/{node_id}.git",
                    x=x,
                    y=y,
                )
            )

        # Generate dependency edges in a structured mesh (connect nodes within clusters and cross-cluster layers)
        for i in range(1, total_mock_nodes + 1):
            cluster_idx = (i - 1) % 6
            cluster_id, _, _ = clusters[cluster_idx]
            node_idx = (i - 1) // 6
            node_id = f"netflix-{cluster_id}-{node_idx + 1}"

            # 1. Connect to next node in the same cluster sequentially
            if node_idx < 49:
                next_node_id = f"netflix-{cluster_id}-{node_idx + 2}"
                edge_type = "event" if i % 3 == 0 else "api"
                edges.append(
                    SoftwareWorldEdge(
                        id=f"edge-seq-{i}",
                        source=node_id,
                        target=next_node_id,
                        type=edge_type,
                        label="Internal Call",
                        latency_ms=random.randint(2, 15),
                        is_critical=False,
                    )
                )

            # 2. Connect cross-cluster layers
            if cluster_idx < 5:
                next_cluster_id, _, _ = clusters[cluster_idx + 1]
                target_node_id = f"netflix-{next_cluster_id}-{node_idx + 1}"
                edge_type = "api" if i % 2 == 0 else "library"
                edges.append(
                    SoftwareWorldEdge(
                        id=f"edge-cross-{i}",
                        source=node_id,
                        target=target_node_id,
                        type=edge_type,
                        label="Service API" if edge_type == "api" else "Shared SDK",
                        latency_ms=(
                            random.randint(10, 45) if edge_type == "api" else None
                        ),
                        is_critical=node_idx % 7 == 0,
                    )
                )

        # Link actual repositories to gateways in scaled view
        for idx, real_repo in enumerate(real_repo_nodes):
            edges.append(
                SoftwareWorldEdge(
                    id=f"real-edge-scaled-{idx}",
                    source=real_repo.id,
                    target="netflix-edge-gateways-1",
                    type="api",
                    label="Core Proxy",
                    latency_ms=5,
                    is_critical=True,
                )
            )

    return SoftwareWorldResponse(nodes=nodes, edges=edges)
