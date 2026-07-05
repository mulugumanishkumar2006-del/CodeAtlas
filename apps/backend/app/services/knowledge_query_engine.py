import re
from sqlalchemy.orm import Session
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.services.domain_detector import DomainDetector
from typing import List, Dict, Any

class KnowledgeQueryEngine:
    """
    Executes semantic query questions on the universal repository graph:
    1. Which services own this API?
    2. Which modules interact with Redis?
    3. Which functions write to the database?
    4. Which services expose public endpoints?
    5. Which modules belong to Authentication?
    6. Which APIs use JWT?
    """
    def execute_query(self, db: Session, repo_id: str, query: str) -> Dict[str, Any]:
        q_lower = query.strip().lower()

        # 1. Which services own this API?
        if "service" in q_lower and "own" in q_lower and "api" in q_lower:
            return self.query_services_owning_api(db, repo_id, query)

        # 2. Which modules interact with Redis?
        if "redis" in q_lower and ("interact" in q_lower or "connect" in q_lower or "use" in q_lower or "write" in q_lower):
            return self.query_modules_redis(db, repo_id, query)

        # 3. Which functions write to the database?
        if "function" in q_lower and "write" in q_lower and ("database" in q_lower or "db" in q_lower):
            return self.query_functions_writing_db(db, repo_id, query)

        # 4. Which services expose public endpoints?
        if "service" in q_lower and "expose" in q_lower and ("endpoint" in q_lower or "api" in q_lower or "public" in q_lower):
            return self.query_services_exposing_apis(db, repo_id, query)

        # 5. Which modules belong to Authentication?
        if "authentication" in q_lower or "auth" in q_lower:
            if "module" in q_lower or "belong" in q_lower or "what" in q_lower or "which" in q_lower or "file" in q_lower:
                return self.query_authentication_modules(db, repo_id, query)

        # 6. Which APIs use JWT?
        if "api" in q_lower and ("use" in q_lower or "jwt" in q_lower or "token" in q_lower or "auth" in q_lower):
            return self.query_apis_using_jwt(db, repo_id, query)

        # Fallback search matching node names/properties
        return self.fallback_keyword_query(db, repo_id, query)

    def query_services_owning_api(self, db: Session, repo_id: str, query: str) -> Dict[str, Any]:
        rels = db.query(GraphRelationship).filter(
            GraphRelationship.repository_id == repo_id,
            GraphRelationship.type.in_(["EXPOSES", "CALLS", "USES"])
        ).all()

        results = []
        for r in rels:
            src = db.query(GraphNode).filter(GraphNode.id == r.source_id, GraphNode.repository_id == repo_id).first()
            tgt = db.query(GraphNode).filter(GraphNode.id == r.target_id, GraphNode.repository_id == repo_id).first()
            if src and tgt:
                src_type = src.type.lower()
                tgt_type = tgt.type.lower()
                if "service" in src_type and "api" in tgt_type:
                    results.append({
                        "id": src.id,
                        "name": src.name,
                        "type": src.type,
                        "relationship": r.type,
                        "target": tgt.name,
                        "details": f"Service component '{src.name}' owns/exposes endpoint gate '{tgt.name}'."
                    })
        return {
            "query": query,
            "inferred_intent": "Identify services that own, expose, or call API endpoints.",
            "results": results
        }

    def query_modules_redis(self, db: Session, repo_id: str, query: str) -> Dict[str, Any]:
        rels = db.query(GraphRelationship).filter(
            GraphRelationship.repository_id == repo_id,
            GraphRelationship.type.in_(["CONNECTS_TO", "USES", "CALLS", "PRODUCES", "CONSUMES"])
        ).all()

        results = []
        for r in rels:
            src = db.query(GraphNode).filter(GraphNode.id == r.source_id, GraphNode.repository_id == repo_id).first()
            tgt = db.query(GraphNode).filter(GraphNode.id == r.target_id, GraphNode.repository_id == repo_id).first()
            if src and tgt:
                if "redis" in tgt.name.lower() or "cache" in tgt.type.lower():
                    results.append({
                        "id": src.id,
                        "name": src.name,
                        "type": src.type,
                        "relationship": r.type,
                        "target": tgt.name,
                        "details": f"Module '{src.name}' connects to cache instance '{tgt.name}' via {r.type}."
                    })
        return {
            "query": query,
            "inferred_intent": "Find codebase modules or files interacting with the Redis Cache cache layer.",
            "results": results
        }

    def query_functions_writing_db(self, db: Session, repo_id: str, query: str) -> Dict[str, Any]:
        rels = db.query(GraphRelationship).filter(
            GraphRelationship.repository_id == repo_id,
            GraphRelationship.type == "WRITES"
        ).all()

        results = []
        for r in rels:
            src = db.query(GraphNode).filter(GraphNode.id == r.source_id, GraphNode.repository_id == repo_id).first()
            tgt = db.query(GraphNode).filter(GraphNode.id == r.target_id, GraphNode.repository_id == repo_id).first()
            if src and tgt:
                results.append({
                    "id": src.id,
                    "name": src.name,
                    "type": src.type,
                    "relationship": r.type,
                    "target": tgt.name,
                    "details": f"Function '{src.name}' writes data to table/database entity '{tgt.name}'."
                })
        return {
            "query": query,
            "inferred_intent": "Identify functions or methods executing write transactions to database storage tables.",
            "results": results
        }

    def query_services_exposing_apis(self, db: Session, repo_id: str, query: str) -> Dict[str, Any]:
        rels = db.query(GraphRelationship).filter(
            GraphRelationship.repository_id == repo_id,
            GraphRelationship.type == "EXPOSES"
        ).all()

        results = []
        for r in rels:
            src = db.query(GraphNode).filter(GraphNode.id == r.source_id, GraphNode.repository_id == repo_id).first()
            tgt = db.query(GraphNode).filter(GraphNode.id == r.target_id, GraphNode.repository_id == repo_id).first()
            if src and tgt:
                results.append({
                    "id": src.id,
                    "name": src.name,
                    "type": src.type,
                    "relationship": r.type,
                    "target": tgt.name,
                    "details": f"Service '{src.name}' exposes gateway endpoint '{tgt.name}'."
                })
        return {
            "query": query,
            "inferred_intent": "Identify logic services exposing API routing gateways.",
            "results": results
        }

    def query_authentication_modules(self, db: Session, repo_id: str, query: str) -> Dict[str, Any]:
        detector = DomainDetector()
        clusters = detector.detect_domains(db, repo_id)

        results = []
        auth_cluster = next((c for c in clusters if "Authentication" in c["name"]), None)
        if auth_cluster:
            for node_id in auth_cluster["node_ids"]:
                n = db.query(GraphNode).filter(GraphNode.id == node_id, GraphNode.repository_id == repo_id).first()
                if n and n.type in ("Module", "Service", "API", "File", "Domain"):
                    results.append({
                        "id": n.id,
                        "name": n.name,
                        "type": n.type,
                        "details": f"Module '{n.name}' is clustered inside the Authentication business subdomain."
                    })
        return {
            "query": query,
            "inferred_intent": "Find modules, files, and classes grouped under the Authentication & Security domain.",
            "results": results
        }

    def query_apis_using_jwt(self, db: Session, repo_id: str, query: str) -> Dict[str, Any]:
        nodes = db.query(GraphNode).filter(
            GraphNode.repository_id == repo_id,
            GraphNode.type.in_(["API", "API Endpoint", "api"])
        ).all()

        results = []
        for n in nodes:
            name_lower = n.name.lower()
            props = n.properties or {}
            route = props.get("route", "").lower()
            
            matches_jwt = "jwt" in name_lower or "jwt" in route or "token" in name_lower or "token" in route

            if not matches_jwt:
                rels = db.query(GraphRelationship).filter(
                    GraphRelationship.repository_id == repo_id,
                    GraphRelationship.source_id == n.id
                ).all()
                for r in rels:
                    tgt = db.query(GraphNode).filter(GraphNode.id == r.target_id, GraphNode.repository_id == repo_id).first()
                    if tgt and ("jwt" in tgt.name.lower() or "token" in tgt.name.lower()):
                        matches_jwt = True
                        break

            if matches_jwt:
                results.append({
                    "id": n.id,
                    "name": n.name,
                    "type": n.type,
                    "details": f"API Endpoint '{n.name}' maps to token security credentials."
                })
        return {
            "query": query,
            "inferred_intent": "Retrieve API routes checking web tokens (JWT) or authentication headers.",
            "results": results
        }

    def fallback_keyword_query(self, db: Session, repo_id: str, query: str) -> Dict[str, Any]:
        search_pattern = f"%{query.strip()}%"
        from sqlalchemy import or_
        nodes = db.query(GraphNode).filter(
            GraphNode.repository_id == repo_id,
            or_(
                GraphNode.name.ilike(search_pattern),
                GraphNode.type.ilike(search_pattern)
            )
        ).limit(10).all()

        results = []
        for n in nodes:
            results.append({
                "id": n.id,
                "name": n.name,
                "type": n.type,
                "details": f"Fuzzy metadata match: discovered node construct '{n.name}' of type '{n.type}'."
            })
        return {
            "query": query,
            "inferred_intent": "Fuzzy keyword lookup against graph metadata.",
            "results": results
        }
