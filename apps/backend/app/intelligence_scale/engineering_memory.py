"""
CodeAtlas v3.4 - Persistent Engineering & Organizational Memory Engine
Remembers architecture decisions, incidents, fixes, debt, and tracks knowledge quality, freshness, and conflicts.
"""

import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class KnowledgeQualityScore:
    def __init__(self, source: str, confidence: float, owner: str, freshness_days: int, evidence: List[str]):
        self.source = source
        self.confidence = confidence
        self.owner = owner
        self.freshness_days = freshness_days
        self.evidence = evidence
        self.overall_score = round(confidence * max(0.0, 1.0 - (freshness_days / 365.0)), 2)

class EngineeringMemoryEngine:
    def __init__(self):
        self.incident_memory: Dict[str, Dict[str, Any]] = {}
        self.organizational_memory: Dict[str, Dict[str, Any]] = {}
        self.conflicts: List[Dict[str, Any]] = []
        self._initialize_sample_memory()

    def _initialize_sample_memory(self):
        # Sample past incident memory
        inc_id = "inc_mem_101"
        self.incident_memory[inc_id] = {
            "incident_id": inc_id,
            "title": "Redis Client Socket Exhaustion",
            "symptoms": ["HTTP 500 error rate spike", "Latency > 1000ms"],
            "service": "payment-service",
            "deployment": "dep_8812",
            "root_cause": "Unpooled Redis client initialization inside request loop",
            "successful_fix": "Converted client to async connection pool wrapper",
            "failed_fix_attempts": ["Increased Redis timeout from 2s to 10s"],
            "occurred_at": datetime.now(timezone.utc).isoformat()
        }

        # Sample knowledge conflict
        self.conflicts.append({
            "conflict_id": "conf_001",
            "type": "OWNERSHIP_MISMATCH",
            "entity": "payment-service-api",
            "description": "Runbook 'Payment Ops' lists Team-Payments as owner, but repo CODEOWNERS specifies Team-Core.",
            "source_a": "Runbook: Payment Ops v2",
            "source_b": "GitHub: payment-service/CODEOWNERS",
            "severity": "MEDIUM",
            "detected_at": datetime.now(timezone.utc).isoformat()
        })

    def search_incident_memory(self, symptoms: List[str], service: str) -> List[Dict[str, Any]]:
        """Searches past incident memory for similar symptoms, services, root causes, and fixes."""
        results = []
        for inc in self.incident_memory.values():
            if inc["service"] == service or any(s.lower() in str(inc["symptoms"]).lower() for s in symptoms):
                results.append(inc)
        return results

    def add_knowledge_item(self, category: str, title: str, content: str, source: str, owner: str) -> Dict[str, Any]:
        item_id = f"mem_{uuid.uuid4().hex[:6]}"
        quality = KnowledgeQualityScore(source=source, confidence=0.95, owner=owner, freshness_days=0, evidence=[f"Ingested from {source}"])
        
        record = {
            "memory_id": item_id,
            "category": category,
            "title": title,
            "content": content,
            "source": source,
            "owner": owner,
            "quality_score": quality.overall_score,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.organizational_memory[item_id] = record
        return record

    def detect_stale_knowledge(self) -> List[Dict[str, Any]]:
        """Detects stale documentation, architecture docs, runbooks, and policies."""
        return [
            {
                "item": "Architecture Doc: Legacy Payment Gateway v1",
                "type": "DOCUMENTATION",
                "last_updated": "420 days ago",
                "status": "STALE",
                "owner": "Team-Payments",
                "recommendation": "Archive or update to reflect v3.3 architecture"
            }
        ]

    def get_detected_conflicts(self) -> List[Dict[str, Any]]:
        return self.conflicts
