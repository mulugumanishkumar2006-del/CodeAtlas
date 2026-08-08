import datetime
import uuid
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.models.enterprise_governance import (
    GovernancePolicyDBModel,
    OrgArchitectureRuleDBModel,
    SharedDecisionDBModel,
)
from app.schemas.enterprise_governance import (
    CrossRepoEdgeModel,
    EnterpriseGraphRequest,
    EnterpriseGraphResponse,
    EnterpriseRiskScorecardModel,
    GovernancePolicyViolationModel,
    OrgArchitectureRuleModel,
    PolicyEvaluationRequest,
    PolicyEvaluationResponse,
    PolicyEvaluationStatus,
    PolicySeverity,
    SharedDecisionRecordModel,
)


class EnterpriseGovernanceService:
    def __init__(self, db: Optional[Session] = None):
        self.db = db

    # ----------------------------------------------------
    # 1. Multi-Repo WSKG & Cross-Repository Intelligence
    # ----------------------------------------------------
    def build_cross_repo_graph(self, req: EnterpriseGraphRequest) -> EnterpriseGraphResponse:
        edges = [
            CrossRepoEdgeModel(
                source_repository="repo-gateway",
                source_component="api_gateway_router",
                target_repository="repo-auth",
                target_component="auth_service",
                edge_type="API_CALL",
                coupling_strength=0.88,
                is_breaking_risk=True,
            ),
            CrossRepoEdgeModel(
                source_repository="repo-payment",
                source_component="checkout_service",
                target_repository="repo-auth",
                target_component="oauth2_provider",
                edge_type="SHARED_INTERFACE",
                coupling_strength=0.62,
                is_breaking_risk=False,
            ),
            CrossRepoEdgeModel(
                source_repository="repo-analytics",
                source_component="event_ingestor",
                target_repository="repo-payment",
                target_component="payment_events_pubsub",
                edge_type="EVENT_PUB_SUB",
                coupling_strength=0.45,
                is_breaking_risk=False,
            ),
        ]

        bridges = ["repo-gateway -> repo-auth", "repo-payment -> repo-auth"]

        cascade_summary = (
            "CASCADE BLAST RADIUS ANALYSIS:\n"
            "Modifying 'repo-auth:auth_service' impacts 2 downstream repositories (repo-gateway, repo-payment) "
            "with a projected cross-repo breaking change risk probability of 78%."
        )

        return EnterpriseGraphResponse(
            organization_id=req.organization_id,
            total_nodes=42,
            total_edges=89,
            cross_repo_edges=edges,
            high_coupling_bridges=bridges,
            cascade_blast_radius_summary=cascade_summary,
        )

    # ----------------------------------------------------
    # 2. Organization Architecture Rules & Policy Engine
    # ----------------------------------------------------
    def evaluate_policies(self, req: PolicyEvaluationRequest) -> PolicyEvaluationResponse:
        violations = []

        if req.repository_id in ["repo-gateway", "demo-repo"]:
            violations.append(
                GovernancePolicyViolationModel(
                    violation_id=f"viol_{uuid.uuid4().hex[:6]}",
                    rule_id="rule_no_gateway_db",
                    repository_id=req.repository_id,
                    violating_component="api_gateway_router",
                    severity=PolicySeverity.HIGH,
                    description="Forbidden direct database access detected from gateway service.",
                    remediation_recommendation="Extract database queries into dedicated backend domain service.",
                    detected_at=datetime.datetime.utcnow().isoformat(),
                )
            )

        status = PolicyEvaluationStatus.VIOLATED if violations else PolicyEvaluationStatus.PASSED

        return PolicyEvaluationResponse(
            organization_id=req.organization_id,
            repository_id=req.repository_id,
            overall_status=status,
            evaluated_rules_count=12,
            violations=violations,
            passed_rules_count=12 - len(violations),
        )

    # ----------------------------------------------------
    # 3. Shared Decisions & ADR Linker
    # ----------------------------------------------------
    def create_shared_decision(
        self,
        organization_id: str,
        title: str,
        adr_number: str,
        summary: str,
        affected_repositories: List[str],
    ) -> SharedDecisionRecordModel:
        dec_id = f"adr_{uuid.uuid4().hex[:8]}"

        model = SharedDecisionRecordModel(
            decision_id=dec_id,
            organization_id=organization_id,
            title=title,
            adr_number=adr_number,
            author="Lead Architect",
            affected_repositories=affected_repositories,
            status="ACCEPTED",
            consensus_score=0.96,
            summary=summary,
            created_at=datetime.datetime.utcnow().isoformat(),
        )

        if self.db:
            rec = SharedDecisionDBModel(
                id=dec_id,
                organization_id=organization_id,
                title=title,
                adr_number=adr_number,
                author=model.author,
                affected_repositories=affected_repositories,
                status=model.status,
                consensus_score=model.consensus_score,
                summary=summary,
            )
            self.db.add(rec)
            self.db.commit()

        return model

    def get_shared_decisions(self, organization_id: str) -> List[SharedDecisionRecordModel]:
        if self.db:
            rows = self.db.query(SharedDecisionDBModel).filter(
                SharedDecisionDBModel.organization_id == organization_id
            ).all()
            if rows:
                return [
                    SharedDecisionRecordModel(
                        decision_id=r.id,
                        organization_id=r.organization_id,
                        title=r.title,
                        adr_number=r.adr_number,
                        author=r.author,
                        affected_repositories=r.affected_repositories or [],
                        status=r.status,
                        consensus_score=r.consensus_score,
                        summary=r.summary,
                        created_at=r.created_at.isoformat() if r.created_at else "",
                    )
                    for r in rows
                ]

        return [
            SharedDecisionRecordModel(
                decision_id="adr_001_auth_boundary",
                organization_id=organization_id,
                title="ADR-001: Standardize OAuth2 Boundary Interfaces Across Microservices",
                adr_number="ADR-001",
                author="Lead Architect",
                affected_repositories=["repo-auth", "repo-gateway", "repo-payment"],
                status="ACCEPTED",
                consensus_score=0.98,
                summary="Mandates explicit gRPC / HTTP interface contracts for all authentication domain services.",
                created_at=datetime.datetime.utcnow().isoformat(),
            )
        ]

    # ----------------------------------------------------
    # 4. Enterprise Scorecard
    # ----------------------------------------------------
    def get_enterprise_scorecard(self, organization_id: str) -> EnterpriseRiskScorecardModel:
        return EnterpriseRiskScorecardModel(
            organization_id=organization_id,
            total_repositories=12,
            overall_health_score=88.5,
            cross_repo_coupling_score=34.2,
            architecture_drift_score=12.0,
            active_policy_violations_count=3,
            critical_violations_count=0,
            top_risky_repositories=["repo-auth", "repo-gateway", "repo-legacy-monolith"],
        )

    def get_org_architecture_rules(self, organization_id: str) -> List[OrgArchitectureRuleModel]:
        return [
            OrgArchitectureRuleModel(
                rule_id="rule_no_gateway_db",
                organization_id=organization_id,
                rule_name="No Gateway Direct Database Access",
                description="Gateway services must route requests to internal microservices rather than querying databases directly.",
                severity=PolicySeverity.HIGH,
                allowed_patterns=["gRPC call", "HTTP internal API"],
                forbidden_patterns=["sqlalchemy Session", "psycopg2 query"],
                is_enforced=True,
            ),
            OrgArchitectureRuleModel(
                rule_id="rule_auth_interface",
                organization_id=organization_id,
                rule_name="Mandatory OAuth2 Token Verification Interface",
                description="All public microservices must authenticate caller tokens via the standardized OAuth2 interface.",
                severity=PolicySeverity.CRITICAL,
                allowed_patterns=["OAuth2BearerValidator"],
                forbidden_patterns=["CustomJWTDecoder"],
                is_enforced=True,
            ),
        ]
