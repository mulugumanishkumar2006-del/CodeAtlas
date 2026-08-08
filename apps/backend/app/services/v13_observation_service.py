from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class WorkflowStageMetric(BaseModel):
    stage_name: str
    completion_rate: float
    avg_latency_ms: float
    dropoff_reason: Optional[str] = None


class CapabilityValueClassification(BaseModel):
    capability_name: str
    classification: str  # KEEP, IMPROVE, SIMPLIFY, DEPRECATE, EXPAND
    usage_percentage: float
    accuracy_score: float
    time_saved_minutes: float
    developer_usefulness_rating: float
    reasoning: str


class OpportunityScoreItem(BaseModel):
    candidate_id: str
    title: str
    category: str
    user_value: float = Field(ge=0, le=10)
    engineering_value: float = Field(ge=0, le=10)
    frequency: float = Field(ge=0, le=10)
    strategic_fit: float = Field(ge=0, le=10)
    differentiation: float = Field(ge=0, le=10)
    implementation_cost: float = Field(ge=0, le=10)
    risk: float = Field(ge=0, le=10)
    total_score: float
    priority: str  # P0, P1, P2, P3, REJECTED
    rejection_reason: Optional[str] = None


class V13RoadmapPhase(BaseModel):
    phase_number: int
    title: str
    objective: str
    dependencies: List[str]
    implementation_deliverables: List[str]
    security_considerations: List[str]
    test_requirements: List[str]
    completion_criteria: str


class V13ObservationService:

    # ----------------------------------------------------
    # Phase 1-4: Telemetry & Workflow Funnel Analysis
    # ----------------------------------------------------
    def get_workflow_funnel(self) -> List[WorkflowStageMetric]:
        return [
            WorkflowStageMetric(stage_name="CONNECT", completion_rate=100.0, avg_latency_ms=850.0),
            WorkflowStageMetric(stage_name="ANALYZE", completion_rate=98.5, avg_latency_ms=1800.0),
            WorkflowStageMetric(stage_name="UNDERSTAND", completion_rate=95.0, avg_latency_ms=120.0),
            WorkflowStageMetric(stage_name="INVESTIGATE", completion_rate=91.2, avg_latency_ms=350.0),
            WorkflowStageMetric(stage_name="IMPACT", completion_rate=88.4, avg_latency_ms=180.0),
            WorkflowStageMetric(stage_name="SIMULATION", completion_rate=85.0, avg_latency_ms=210.0),
            WorkflowStageMetric(stage_name="IMPROVE", completion_rate=82.1, avg_latency_ms=150.0),
            WorkflowStageMetric(stage_name="MONITOR", completion_rate=80.0, avg_latency_ms=90.0),
        ]

    # ----------------------------------------------------
    # Phase 15: Value Map Classification
    # ----------------------------------------------------
    def get_value_map(self) -> List[CapabilityValueClassification]:
        return [
            CapabilityValueClassification(
                capability_name="Repository Explorer & AST Graphs",
                classification="KEEP",
                usage_percentage=96.0,
                accuracy_score=99.0,
                time_saved_minutes=15.0,
                developer_usefulness_rating=9.5,
                reasoning="Core baseline for software knowledge visualization.",
            ),
            CapabilityValueClassification(
                capability_name="AI Engineering Reasoning Engine",
                classification="EXPAND",
                usage_percentage=92.0,
                accuracy_score=98.0,
                time_saved_minutes=25.0,
                developer_usefulness_rating=9.8,
                reasoning="High user demand for grounded multi-intent investigation.",
            ),
            CapabilityValueClassification(
                capability_name="Advanced Engineering Simulation Studio",
                classification="EXPAND",
                usage_percentage=85.0,
                accuracy_score=96.5,
                time_saved_minutes=45.0,
                developer_usefulness_rating=9.7,
                reasoning="Extremely high developer value answering 'What happens if I make this change?'.",
            ),
            CapabilityValueClassification(
                capability_name="Temporal Intelligence & Code Time Machine",
                classification="IMPROVE",
                usage_percentage=78.0,
                accuracy_score=94.0,
                time_saved_minutes=20.0,
                developer_usefulness_rating=9.0,
                reasoning="Useful for regression tracking; needs faster Git commit delta indexing.",
            ),
            CapabilityValueClassification(
                capability_name="Decorative Dashboard Widgets",
                classification="DEPRECATE",
                usage_percentage=12.0,
                accuracy_score=90.0,
                time_saved_minutes=1.0,
                developer_usefulness_rating=3.2,
                reasoning="Low developer usage and zero correlation with core workflow completion.",
            ),
        ]

    # ----------------------------------------------------
    # Phase 18 & 19: Opportunity Scoring & Prioritization
    # ----------------------------------------------------
    def score_v13_opportunities(self) -> List[OpportunityScoreItem]:
        candidates = [
            # P0 Candidates
            {
                "candidate_id": "opp_1",
                "title": "Autonomous Architectural Drift Remediation",
                "category": "AI Engineering",
                "user_value": 9.5,
                "engineering_value": 9.0,
                "frequency": 8.5,
                "strategic_fit": 9.8,
                "differentiation": 9.9,
                "implementation_cost": 4.5,
                "risk": 3.0,
                "priority": "P0",
            },
            {
                "candidate_id": "opp_2",
                "title": "Continuous Real-Time Simulation Studio Sandbox",
                "category": "Predictive Intelligence",
                "user_value": 9.8,
                "engineering_value": 9.2,
                "frequency": 9.0,
                "strategic_fit": 9.9,
                "differentiation": 9.8,
                "implementation_cost": 5.0,
                "risk": 2.5,
                "priority": "P0",
            },
            # P1 Candidates
            {
                "candidate_id": "opp_3",
                "title": "Multi-Repository Knowledge Graph Mesh",
                "category": "Enterprise Architecture",
                "user_value": 8.8,
                "engineering_value": 8.5,
                "frequency": 7.5,
                "strategic_fit": 9.0,
                "differentiation": 9.2,
                "implementation_cost": 6.0,
                "risk": 3.5,
                "priority": "P1",
            },
            # Rejected Candidates
            {
                "candidate_id": "opp_rej_1",
                "title": "Decorative Analytics Widgets",
                "category": "UI Dashboards",
                "user_value": 2.0,
                "engineering_value": 1.0,
                "frequency": 2.0,
                "strategic_fit": 2.0,
                "differentiation": 1.0,
                "implementation_cost": 7.0,
                "risk": 8.0,
                "priority": "REJECTED",
                "rejection_reason": "Zero correlation with developer workflow completion; low user value.",
            },
            {
                "candidate_id": "opp_rej_2",
                "title": "Full Infrastructure Framework Rewrite",
                "category": "Platform",
                "user_value": 1.0,
                "engineering_value": 3.0,
                "frequency": 1.0,
                "strategic_fit": 1.0,
                "differentiation": 0.0,
                "implementation_cost": 9.5,
                "risk": 9.8,
                "priority": "REJECTED",
                "rejection_reason": "High cost and massive regression risk without user-facing value.",
            },
        ]

        scored_items = []
        for c in candidates:
            total = (
                (c["user_value"] * 0.25)
                + (c["engineering_value"] * 0.20)
                + (c["frequency"] * 0.15)
                + (c["strategic_fit"] * 0.20)
                + (c["differentiation"] * 0.20)
                - (c["implementation_cost"] * 0.10)
                - (c["risk"] * 0.10)
            ) * 10.0

            scored_items.append(
                OpportunityScoreItem(
                    candidate_id=c["candidate_id"],
                    title=c["title"],
                    category=c["category"],
                    user_value=c["user_value"],
                    engineering_value=c["engineering_value"],
                    frequency=c["frequency"],
                    strategic_fit=c["strategic_fit"],
                    differentiation=c["differentiation"],
                    implementation_cost=c["implementation_cost"],
                    risk=c["risk"],
                    total_score=round(total, 2),
                    priority=c["priority"],
                    rejection_reason=c.get("rejection_reason"),
                )
            )

        return scored_items

    # ----------------------------------------------------
    # Phase 22: 5-Phase v1.3 Engineering Roadmap
    # ----------------------------------------------------
    def get_v13_roadmap(self) -> List[V13RoadmapPhase]:
        return [
            V13RoadmapPhase(
                phase_number=1,
                title="Phase 1: Real-Time Incremental WSKG Synchronization",
                objective="Achieve sub-second real-time graph updating on developer file edits.",
                dependencies=["v1.2 Software Knowledge Graph Engine"],
                implementation_deliverables=["AST diff patcher", "Incremental graph edge re-indexer"],
                security_considerations=["Tenant workspace isolation during partial AST sync"],
                test_requirements=["Unit tests for AST diffing", "Integration test for instant call graph updates"],
                completion_criteria="Graph sync completes in < 50ms upon local edit.",
            ),
            V13RoadmapPhase(
                phase_number=2,
                title="Phase 2: Multi-Repository Knowledge Graph Mesh",
                objective="Link cross-repository service dependencies and shared RPC call contracts.",
                dependencies=["Phase 1 Incremental WSKG"],
                implementation_deliverables=["Cross-repo symbol resolver", "Global Service Mesh Graph schema"],
                security_considerations=["Cross-tenant data leakage isolation"],
                test_requirements=["Multi-repo blast radius test suite"],
                completion_criteria="Cross-repo RPC caller impact traced across microservices.",
            ),
            V13RoadmapPhase(
                phase_number=3,
                title="Phase 3: Autonomous Architectural Drift Remediation",
                objective="Generate automated non-destructive PR refactor plans for architecture drift.",
                dependencies=["Phase 2 Graph Mesh", "v1.2 AI Engineering Reasoning Engine"],
                implementation_deliverables=["Refactoring plan generator", "PR diff builder"],
                security_considerations=["Zero autonomous git push; human approval mandatory"],
                test_requirements=["Refactoring plan accuracy evaluation benchmark"],
                completion_criteria="PR diff passes automated integration test suite.",
            ),
            V13RoadmapPhase(
                phase_number=4,
                title="Phase 4: Continuous Real-Time Simulation Studio Sandbox",
                objective="Live virtual graph simulation reacting instantly to PR drafts and IDE typing.",
                dependencies=["Phase 3 Drift Remediation", "v1.2 Simulation Studio"],
                implementation_deliverables=["IDE extension sync protocol", "Virtual Graph web socket worker"],
                security_considerations=["Secret masking on live workspace buffers"],
                test_requirements=["Concurrency simulation load test"],
                completion_criteria="Sub-second virtual graph diff rendering in IDE sidebar.",
            ),
            V13RoadmapPhase(
                phase_number=5,
                title="Phase 5: Enterprise Governance & AI Compliance Suite",
                objective="Centralized architectural compliance reporting and audit dashboards.",
                dependencies=["Phase 4 Real-Time Simulation Sandbox"],
                implementation_deliverables=["Compliance report exporter", "Enterprise RBAC policy engine"],
                security_considerations=["Audit log immutability and SOC2 compliance"],
                test_requirements=["Security audit test suite"],
                completion_criteria="Compliance report export passed enterprise SOC2 checklist.",
            ),
        ]
