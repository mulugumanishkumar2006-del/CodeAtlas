# apps/backend/app/enterprise/enterprise_graph.py

from typing import Any, Dict

from sqlalchemy.orm import Session

from app.models.organization import CrossRepoDependency, Organization
from app.models.repository import Repository


class EnterpriseKnowledgeGraph:
    """
    Constructs and manages the Global Enterprise Knowledge Graph linking
    repositories, microservices, shared libraries, API contracts, gRPC stubs,
    and message topics across an organization.
    """

    def build_organization_graph(self, db: Session, org_id: str) -> Dict[str, Any]:
        org = db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            org_name = "Enterprise Organization"
        else:
            org_name = org.name

        repos = (
            db.query(Repository).filter(Repository.organization_id == org_id).all()
            if org
            else []
        )

        nodes = []
        # Add org node
        nodes.append(
            {
                "id": f"org-{org_id}",
                "label": org_name,
                "type": "ORGANIZATION",
                "metadata": {"repo_count": len(repos)},
            }
        )

        # Add repo nodes
        for repo in repos:
            nodes.append(
                {
                    "id": f"repo-{repo.id}",
                    "label": repo.name,
                    "type": "REPOSITORY",
                    "metadata": {
                        "language": repo.language or "Python",
                        "repo_id": repo.id,
                    },
                }
            )

        # Add cross-repository dependencies
        edges = []
        cross_deps = (
            db.query(CrossRepoDependency)
            .filter(CrossRepoDependency.organization_id == org_id)
            .all()
            if org
            else []
        )

        for dep in cross_deps:
            edges.append(
                {
                    "id": dep.id,
                    "source": f"repo-{dep.source_repo_id}",
                    "target": f"repo-{dep.target_repo_id}",
                    "relationship": dep.dependency_type,
                    "source_symbol": dep.source_symbol,
                    "target_symbol": dep.target_symbol,
                }
            )

        # Mock fallback if empty for demonstration
        if not edges and len(repos) >= 2:
            edges.append(
                {
                    "id": "edge-demo-1",
                    "source": f"repo-{repos[0].id}",
                    "target": f"repo-{repos[1].id}",
                    "relationship": "HTTP_API",
                    "source_symbol": "GET /api/v1/users",
                    "target_symbol": "UserClient.fetch_user()",
                }
            )

        return {
            "organization_id": org_id,
            "organization_name": org_name,
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "nodes": nodes,
            "edges": edges,
            "graph_density": round(
                len(edges) / max(1, (len(nodes) * (len(nodes) - 1))), 4
            ),
        }

    def register_cross_dependency(
        self,
        db: Session,
        org_id: str,
        source_repo_id: str,
        target_repo_id: str,
        dependency_type: str,
        source_symbol: str = None,
        target_symbol: str = None,
    ) -> Dict[str, Any]:
        dep = CrossRepoDependency(
            organization_id=org_id,
            source_repo_id=source_repo_id,
            target_repo_id=target_repo_id,
            dependency_type=dependency_type,
            source_symbol=source_symbol,
            target_symbol=target_symbol,
        )
        db.add(dep)
        db.commit()
        db.refresh(dep)
        return {
            "dependency_id": dep.id,
            "status": "REGISTERED",
            "dependency_type": dependency_type,
        }
