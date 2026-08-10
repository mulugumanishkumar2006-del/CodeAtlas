"""
CodeAtlas v3.4 - Canonical Data Model & Temporal Knowledge Graph Engine
Supports 23 canonical entity types and tracks temporal graph relationships over time.
"""

import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class TemporalRelationshipState:
    CREATED = "CREATED"
    CHANGED = "CHANGED"
    DEPLOYED = "DEPLOYED"
    FAILED = "FAILED"
    RECOVERED = "RECOVERED"
    DEPRECATED = "DEPRECATED"
    REMOVED = "REMOVED"

class EntityType:
    ORGANIZATION = "Organization"
    TEAM = "Team"
    DEVELOPER = "Developer"
    REPOSITORY = "Repository"
    FILE = "File"
    FUNCTION = "Function"
    SERVICE = "Service"
    DEPENDENCY = "Dependency"
    COMMIT = "Commit"
    PULL_REQUEST = "PullRequest"
    ISSUE = "Issue"
    DEPLOYMENT = "Deployment"
    INCIDENT = "Incident"
    METRIC = "Metric"
    LOG = "Log"
    TRACE = "Trace"
    CLOUD_RESOURCE = "CloudResource"
    SECURITY_FINDING = "SecurityFinding"
    DOCUMENT = "Document"
    DECISION = "Decision"
    AGENT = "Agent"
    ACTION = "Action"
    POLICY = "Policy"

class CanonicalTemporalGraphEngine:
    def __init__(self):
        self.entities: Dict[str, Dict[str, Any]] = {}
        self.temporal_edges: List[Dict[str, Any]] = []
        self._initialize_canonical_graph()

    def _initialize_canonical_graph(self):
        sample_entities = [
            ("org_acme", EntityType.ORGANIZATION, "Acme Corp"),
            ("team_core", EntityType.TEAM, "Core Engineering"),
            ("dev_alice", EntityType.DEVELOPER, "Alice Smith"),
            ("repo_payment", EntityType.REPOSITORY, "payment-service"),
            ("file_charge", EntityType.FILE, "services/charge.py"),
            ("func_charge", EntityType.FUNCTION, "process_payment_charge"),
            ("service_payment", EntityType.SERVICE, "payment-service-api"),
            ("dep_redis", EntityType.DEPENDENCY, "redis-py >= 5.0.0"),
            ("commit_c1", EntityType.COMMIT, "c1a2b3d4 - Fix Redis pool"),
            ("pr_101", EntityType.PULL_REQUEST, "PR #101: Distributed Caching"),
            ("issue_42", EntityType.ISSUE, "ENG-42: Redis Connection Leak"),
            ("dep_8812", EntityType.DEPLOYMENT, "Deployment #8812 (Prod)"),
            ("inc_9941", EntityType.INCIDENT, "INC-9941: API Latency Spike"),
            ("metric_latency", EntityType.METRIC, "http_request_duration_ms"),
            ("log_err", EntityType.LOG, "KeyError: 'cache_ttl'"),
            ("trace_t1", EntityType.TRACE, "Trace ID: trace_99812"),
            ("cloud_ecs", EntityType.CLOUD_RESOURCE, "AWS ECS payment-cluster"),
            ("sec_cve1", EntityType.SECURITY_FINDING, "CVE-2026-1184 High Vuln"),
            ("doc_runbook", EntityType.DOCUMENT, "Payment Runbook v2"),
            ("adr_001", EntityType.DECISION, "ADR-001: Async Redis"),
            ("agent_bot", EntityType.AGENT, "Rollback Agent"),
            ("action_act1", EntityType.ACTION, "Rollback Execution"),
            ("pol_sec", EntityType.POLICY, "Mandatory Approval Policy")
        ]

        for ent_id, ent_type, label in sample_entities:
            self.entities[ent_id] = {
                "id": ent_id,
                "type": ent_type,
                "label": label,
                "created_at": datetime.now(timezone.utc).isoformat()
            }

        self.add_temporal_edge("dev_alice", "commit_c1", "AUTHORED", TemporalRelationshipState.CREATED)
        self.add_temporal_edge("commit_c1", "pr_101", "INCLUDED_IN", TemporalRelationshipState.CHANGED)
        self.add_temporal_edge("pr_101", "repo_payment", "MERGED_TO", TemporalRelationshipState.DEPLOYED)
        self.add_temporal_edge("repo_payment", "service_payment", "BUILDS", TemporalRelationshipState.DEPLOYED)
        self.add_temporal_edge("service_payment", "dep_8812", "DEPLOYED_IN", TemporalRelationshipState.FAILED)
        self.add_temporal_edge("dep_8812", "inc_9941", "TRIGGERED", TemporalRelationshipState.FAILED)
        self.add_temporal_edge("inc_9941", "agent_bot", "RECOVERED_BY", TemporalRelationshipState.RECOVERED)

    def add_entity(self, entity_type: str, label: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        ent_id = f"ent_{entity_type.lower()}_{uuid.uuid4().hex[:6]}"
        record = {
            "id": ent_id,
            "type": entity_type,
            "label": label,
            "metadata": metadata or {},
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.entities[ent_id] = record
        return record

    def add_temporal_edge(self, source_id: str, target_id: str, relationship: str, state: str) -> Dict[str, Any]:
        edge = {
            "edge_id": f"edge_{uuid.uuid4().hex[:6]}",
            "source_id": source_id,
            "target_id": target_id,
            "relationship": relationship,
            "state": state,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        self.temporal_edges.append(edge)
        return edge

    def query_temporal_history(self, entity_id: str) -> List[Dict[str, Any]]:
        """Returns timeline of events associated with an entity over time."""
        history = []
        for edge in self.temporal_edges:
            if edge["source_id"] == entity_id or edge["target_id"] == entity_id:
                history.append(edge)
        return history

    def get_canonical_graph_stats(self) -> Dict[str, Any]:
        return {
            "total_canonical_entities": len(self.entities),
            "supported_entity_types": 23,
            "total_temporal_edges": len(self.temporal_edges)
        }
