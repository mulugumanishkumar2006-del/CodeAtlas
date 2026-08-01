import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.models.oip import (
    EngineeringMaturityScore,
    EngineeringOrganization,
    EngineeringTeam,
    OIPAIOrgIntelligence,
    OIPExecutiveDeepAnalytics,
    OIPKnowledgeDeepAnalytics,
    OIPKnowledgeSilo,
    OIPPortfolioDeepAnalytics,
    OIPRepositoryIntelligence,
    OIPServiceBusinessCriticality,
    OIPStrategicRecommendation,
    OIPTeamDeepAnalytics,
)
from app.schemas.oip import (
    ExecutiveDashboardMetricsSchema,
    OrganizationCreate,
    OrgGraphEdgeSchema,
    OrgGraphNodeSchema,
    OrgGraphResponseSchema,
    StrategicRecommendationSchema,
    StrategyEngineRequest,
    StrategyEngineResponse,
    TeamCreate,
)


class OrganizationIntelligenceService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_default_org(self) -> EngineeringOrganization:

        org = self.db.query(EngineeringOrganization).first()
        if not org:
            org = EngineeringOrganization(
                id=str(uuid.uuid4()),
                name="Acme Global Engineering",
                slug="acme-global",
                description="Enterprise Engineering Organization with 500+ repositories across 12 product domains.",
                total_repositories=520,
                total_teams=48,
                total_engineers=650,
                overall_health_score=84.2,
                modernization_index=71.5,
                bottleneck_risk_score=31.0,
                knowledge_silo_risk=42.0,
                strategic_goals=[
                    "Migrate Legacy Monolith to Microservices",
                    "Reduce Burnout in Core Infrastructure Team",
                    "Eliminate Single-Person Knowledge Silos",
                    "Automate Architectural Governance",
                ],
            )
            self.db.add(org)
            self.db.commit()
            self.db.refresh(org)

            # Seed default teams
            self._seed_default_teams(org.id)
            # Seed default repo intelligence
            self._seed_default_repo_intelligence(org.id)
            # Seed default knowledge silos
            self._seed_default_knowledge_silos(org.id)
            # Seed business criticality
            self._seed_default_business_criticality(org.id)
            # Seed strategic recommendations
            self._seed_default_strategy_recommendations(org.id)
            # Seed engineering maturity score
            self._seed_default_maturity_score(org.id)
            # Seed team deep analytics
            self._seed_default_team_deep_analytics(org.id)
            # Seed portfolio deep analytics (Features 21-40)
            self._seed_default_portfolio_deep_analytics(org.id)
            # Seed knowledge deep analytics (Features 41-60)
            self._seed_default_knowledge_deep_analytics(org.id)
            # Seed executive deep analytics (Features 61-80)
            self._seed_default_executive_deep_analytics(org.id)
            # Seed AI org intelligence & Engineering Earth (Features 81-100)
            self._seed_default_ai_org_intelligence(org.id)

        return org

    def _seed_default_teams(self, org_id: str):
        teams_data = [
            {
                "name": "Payments & Billing Core",
                "lead_name": "Sarah Connor",
                "team_type": "Core Product",
                "headcount": 12,
                "velocity_pts": 68.0,
                "workload_score": 92.5,  # Overloaded
                "burnout_risk_score": 85.0,  # High
                "cognitive_load_score": 88.0,
                "owned_repos_count": 14,
                "open_prs_count": 38,
                "tech_debt_contribution_pct": 24.5,
                "key_members": ["Sarah Connor", "Alex Mercer", "Elena Rostova"],
                "owned_services": [
                    "payment-gateway-v2",
                    "billing-ledger",
                    "tax-calculator",
                ],
            },
            {
                "name": "Platform Infrastructure",
                "lead_name": "David Miller",
                "team_type": "Platform & Cloud",
                "headcount": 10,
                "velocity_pts": 54.0,
                "workload_score": 88.0,
                "burnout_risk_score": 74.0,
                "cognitive_load_score": 81.0,
                "owned_repos_count": 22,
                "open_prs_count": 29,
                "tech_debt_contribution_pct": 19.0,
                "key_members": ["David Miller", "Klaus Vance", "Devon Lee"],
                "owned_services": [
                    "k8s-ingress-mesh",
                    "terraform-base-modules",
                    "auth-identity-service",
                ],
            },
            {
                "name": "Frontend Experience",
                "lead_name": "Jessica Chen",
                "team_type": "Frontend Product",
                "headcount": 15,
                "velocity_pts": 82.0,
                "workload_score": 64.0,
                "burnout_risk_score": 38.0,
                "cognitive_load_score": 52.0,
                "owned_repos_count": 8,
                "open_prs_count": 12,
                "tech_debt_contribution_pct": 11.2,
                "key_members": ["Jessica Chen", "Marcus Brody", "Anita Roy"],
                "owned_services": [
                    "web-dashboard-next",
                    "mobile-app-shell",
                    "design-system-react",
                ],
            },
            {
                "name": "AI & Analytics Engine",
                "lead_name": "Dr. Aris Thorne",
                "team_type": "AI/ML Engineering",
                "headcount": 9,
                "velocity_pts": 41.0,
                "workload_score": 76.0,
                "burnout_risk_score": 48.0,
                "cognitive_load_score": 79.0,
                "owned_repos_count": 18,
                "open_prs_count": 21,
                "tech_debt_contribution_pct": 14.8,
                "key_members": ["Dr. Aris Thorne", "Lila Vance"],
                "owned_services": [
                    "ml-feature-store",
                    "vector-search-cluster",
                    "recommendation-pipeline",
                ],
            },
        ]
        for tdata in teams_data:
            team = EngineeringTeam(
                id=str(uuid.uuid4()),
                organization_id=org_id,
                name=tdata["name"],
                lead_name=tdata["lead_name"],
                team_type=tdata["team_type"],
                headcount=tdata["headcount"],
                velocity_pts=tdata["velocity_pts"],
                workload_score=tdata["workload_score"],
                burnout_risk_score=tdata["burnout_risk_score"],
                cognitive_load_score=tdata["cognitive_load_score"],
                owned_repos_count=tdata["owned_repos_count"],
                open_prs_count=tdata["open_prs_count"],
                tech_debt_contribution_pct=tdata["tech_debt_contribution_pct"],
                key_members=tdata["key_members"],
                owned_services=tdata["owned_services"],
            )
            self.db.add(team)
        self.db.commit()

    def _seed_default_repo_intelligence(self, org_id: str):
        repos_data = [
            {
                "repository_id": "repo-legacy-billing-v1",
                "repository_name": "acme/legacy-billing-monolith",
                "modernization_urgency": 94.0,  # CRITICAL
                "maintenance_impossibility_index": 89.5,  # High risk
                "codebase_health_score": 38.0,
                "code_churn_rate": 45.0,
                "bus_factor": 1,
                "duplicate_code_ratio": 31.0,
                "complexity_tier": "HIGH",
                "primary_language": "Java 8",
                "assigned_team": "Payments & Billing Core",
                "tech_stack": ["Java 8", "Spring Boot 1.5", "Oracle DB"],
                "risk_factors": [
                    "End-of-Life Stack",
                    "Single Contributor Dependency",
                    "Zero Integration Tests",
                ],
            },
            {
                "repository_id": "repo-auth-service",
                "repository_name": "acme/auth-identity-service",
                "modernization_urgency": 72.0,
                "maintenance_impossibility_index": 62.0,
                "codebase_health_score": 68.0,
                "code_churn_rate": 28.0,
                "bus_factor": 2,
                "duplicate_code_ratio": 14.0,
                "complexity_tier": "HIGH",
                "primary_language": "Go",
                "assigned_team": "Platform Infrastructure",
                "tech_stack": ["Go 1.21", "OAuth2", "Redis", "PostgreSQL"],
                "risk_factors": ["High SLA Risk", "Complex Crypto Dependencies"],
            },
            {
                "repository_id": "repo-web-dashboard",
                "repository_name": "acme/web-dashboard-next",
                "modernization_urgency": 25.0,
                "maintenance_impossibility_index": 18.0,
                "codebase_health_score": 92.0,
                "code_churn_rate": 15.0,
                "bus_factor": 5,
                "duplicate_code_ratio": 4.5,
                "complexity_tier": "LOW",
                "primary_language": "TypeScript",
                "assigned_team": "Frontend Experience",
                "tech_stack": ["TypeScript", "Next.js 14", "TailwindCSS"],
                "risk_factors": ["Rapid UI churn"],
            },
            {
                "repository_id": "repo-recommendation-engine",
                "repository_name": "acme/recommendation-pipeline",
                "modernization_urgency": 58.0,
                "maintenance_impossibility_index": 48.0,
                "codebase_health_score": 75.0,
                "code_churn_rate": 32.0,
                "bus_factor": 1,
                "duplicate_code_ratio": 18.0,
                "complexity_tier": "MEDIUM",
                "primary_language": "Python",
                "assigned_team": "AI & Analytics Engine",
                "tech_stack": ["Python 3.11", "PyTorch", "Kafka", "Pinecone"],
                "risk_factors": ["Single Knowledge Holder (Dr. Aris Thorne)"],
            },
        ]
        for rdata in repos_data:
            repo_intel = OIPRepositoryIntelligence(
                id=str(uuid.uuid4()),
                organization_id=org_id,
                repository_id=rdata["repository_id"],
                repository_name=rdata["repository_name"],
                modernization_urgency=rdata["modernization_urgency"],
                maintenance_impossibility_index=rdata[
                    "maintenance_impossibility_index"
                ],
                codebase_health_score=rdata["codebase_health_score"],
                code_churn_rate=rdata["code_churn_rate"],
                bus_factor=rdata["bus_factor"],
                duplicate_code_ratio=rdata["duplicate_code_ratio"],
                complexity_tier=rdata["complexity_tier"],
                primary_language=rdata["primary_language"],
                assigned_team=rdata["assigned_team"],
                tech_stack=rdata["tech_stack"],
                risk_factors=rdata["risk_factors"],
            )
            self.db.add(repo_intel)
        self.db.commit()

    def _seed_default_knowledge_silos(self, org_id: str):
        silos = [
            {
                "service_or_repo": "legacy-billing-monolith",
                "silo_risk_level": "CRITICAL",
                "silo_score": 92.0,
                "bus_factor": 1,
                "onboarding_friction_score": 88.0,
                "documentation_coverage": 22.0,
                "key_knowledge_holders": ["Sarah Connor"],
                "siloed_topics": [
                    "Custom Tax Engine Logic",
                    "Oracle Stored Procedures",
                    "PCI Compliance Handshakes",
                ],
                "mitigation_steps": [
                    "Pair programming rotation",
                    "Automated Architecture Spec Extraction",
                    "ADR Documentation Drive",
                ],
            },
            {
                "service_or_repo": "recommendation-pipeline",
                "silo_risk_level": "HIGH",
                "silo_score": 78.0,
                "bus_factor": 1,
                "onboarding_friction_score": 72.0,
                "documentation_coverage": 35.0,
                "key_knowledge_holders": ["Dr. Aris Thorne"],
                "siloed_topics": [
                    "Custom Feature Matrix Normalization",
                    "Vector Index Tuning",
                ],
                "mitigation_steps": [
                    "Cross-train ML Engineer from Analytics",
                    "Codebase Knowledge Graph Indexing",
                ],
            },
            {
                "service_or_repo": "k8s-ingress-mesh",
                "silo_risk_level": "MODERATE",
                "silo_score": 52.0,
                "bus_factor": 2,
                "onboarding_friction_score": 58.0,
                "documentation_coverage": 64.0,
                "key_knowledge_holders": ["David Miller", "Klaus Vance"],
                "siloed_topics": [
                    "Envoy Filter Configurations",
                    "mTLS Certificate Rotation",
                ],
                "mitigation_steps": [
                    "Runbook automation",
                    "Self-service developer portal",
                ],
            },
        ]
        for sdata in silos:
            silo = OIPKnowledgeSilo(
                id=str(uuid.uuid4()),
                organization_id=org_id,
                service_or_repo=sdata["service_or_repo"],
                silo_risk_level=sdata["silo_risk_level"],
                silo_score=sdata["silo_score"],
                bus_factor=sdata["bus_factor"],
                onboarding_friction_score=sdata["onboarding_friction_score"],
                documentation_coverage=sdata["documentation_coverage"],
                key_knowledge_holders=sdata["key_knowledge_holders"],
                siloed_topics=sdata["siloed_topics"],
                mitigation_steps=sdata["mitigation_steps"],
            )
            self.db.add(silo)
        self.db.commit()

    def _seed_default_business_criticality(self, org_id: str):
        services = [
            {
                "service_name": "billing-ledger",
                "revenue_impact_tier": "CRITICAL",
                "sla_tier": "99.999%",
                "business_criticality_score": 98.0,
                "failure_blast_radius": 95.0,
                "customer_dependency_count": 45000,
                "is_duplicate_work_risk": True,
                "duplicate_candidates": ["payment-ledger-v1", "accounting-sync-worker"],
                "owning_team": "Payments & Billing Core",
            },
            {
                "service_name": "auth-identity-service",
                "revenue_impact_tier": "CRITICAL",
                "sla_tier": "99.99%",
                "business_criticality_score": 96.0,
                "failure_blast_radius": 99.0,
                "customer_dependency_count": 120000,
                "is_duplicate_work_risk": False,
                "duplicate_candidates": [],
                "owning_team": "Platform Infrastructure",
            },
            {
                "service_name": "recommendation-pipeline",
                "revenue_impact_tier": "HIGH",
                "sla_tier": "99.9%",
                "business_criticality_score": 82.0,
                "failure_blast_radius": 60.0,
                "customer_dependency_count": 28000,
                "is_duplicate_work_risk": True,
                "duplicate_candidates": ["personalized-feed-v2"],
                "owning_team": "AI & Analytics Engine",
            },
        ]
        for s in services:
            crit = OIPServiceBusinessCriticality(
                id=str(uuid.uuid4()),
                organization_id=org_id,
                service_name=s["service_name"],
                revenue_impact_tier=s["revenue_impact_tier"],
                sla_tier=s["sla_tier"],
                business_criticality_score=s["business_criticality_score"],
                failure_blast_radius=s["failure_blast_radius"],
                customer_dependency_count=s["customer_dependency_count"],
                is_duplicate_work_risk=s["is_duplicate_work_risk"],
                duplicate_candidates=s["duplicate_candidates"],
                owning_team=s["owning_team"],
            )
            self.db.add(crit)
        self.db.commit()

    def _seed_default_strategy_recommendations(self, org_id: str):
        recs = [
            {
                "title": "Reallocate 3 Engineers from Frontend to Payments Team",
                "target_entity": "Payments & Billing Core",
                "action_type": "REALLOCATE_ENGINEERS",
                "priority": "CRITICAL",
                "impact_score": 94.0,
                "urgency_score": 90.0,
                "summary": "Payments team is experiencing 92.5% workload and 85% burnout risk while maintaining critical revenue services.",
                "justification": "Frontend Experience team has low workload (64%) and low burnout risk (38%). Reallocating 3 engineers will balance workload to <75%.",
                "execution_steps": [
                    "Identify 3 senior React/Node engineers from Frontend team.",
                    "Initiate 2-week onboarding bootcamp for payment-gateway-v2.",
                    "Reassign billing-ledger sprint tickets.",
                ],
                "expected_roi": "40% Reduction in PR Lead Time & 50% Lower Burnout Risk",
            },
            {
                "title": "Decommission & Modernize acme/legacy-billing-monolith",
                "target_entity": "acme/legacy-billing-monolith",
                "action_type": "MODERNIZATION",
                "priority": "HIGH",
                "impact_score": 91.0,
                "urgency_score": 95.0,
                "summary": "Modernization Urgency is 94% with a single knowledge holder (Sarah Connor) creating extreme bus factor risk.",
                "justification": "Legacy Java 8 codebase has zero integration tests and introduces 24.5% of overall team technical debt.",
                "execution_steps": [
                    "Run Autonomous Refactoring Engine (ARE) decomposition scan.",
                    "Extract tax-calculator into standalone Go microservice.",
                    "Establish automated API parity testing suite.",
                ],
                "expected_roi": "Eliminates Single Point of Failure & $180k/yr Infrastructure Savings",
            },
            {
                "title": "Consolidate Duplicate Work in Recommendation Pipelines",
                "target_entity": "recommendation-pipeline",
                "action_type": "REFACTOR",
                "priority": "MEDIUM",
                "impact_score": 78.0,
                "urgency_score": 65.0,
                "summary": "Detected 84% code similarity between recommendation-pipeline and personalized-feed-v2.",
                "justification": "Consolidating shared vector search utilities eliminates redundant maintenance across AI teams.",
                "execution_steps": [
                    "Extract common vector indexing package to shared library.",
                    "Deprecate duplicate feature normalization routines.",
                ],
                "expected_roi": "Saves 120 Engineering Hours/Month",
            },
        ]
        for r in recs:
            rec = OIPStrategicRecommendation(
                id=str(uuid.uuid4()),
                organization_id=org_id,
                title=r["title"],
                target_entity=r["target_entity"],
                action_type=r["action_type"],
                priority=r["priority"],
                impact_score=r["impact_score"],
                urgency_score=r["urgency_score"],
                summary=r["summary"],
                justification=r["justification"],
                execution_steps=r["execution_steps"],
                expected_roi=r["expected_roi"],
            )
            self.db.add(rec)
        self.db.commit()

    def get_organization_overview(
        self, org_id: Optional[str] = None
    ) -> EngineeringOrganization:
        if org_id:
            org = (
                self.db.query(EngineeringOrganization)
                .filter(EngineeringOrganization.id == org_id)
                .first()
            )
            if org:
                return org
        return self.get_or_create_default_org()

    def create_organization(self, data: OrganizationCreate) -> EngineeringOrganization:
        org = EngineeringOrganization(
            id=str(uuid.uuid4()),
            name=data.name,
            slug=data.slug,
            description=data.description,
            total_repositories=data.total_repositories or 0,
            total_teams=data.total_teams or 0,
            total_engineers=data.total_engineers or 0,
            strategic_goals=data.strategic_goals or [],
        )
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        return org

    def create_team(self, data: TeamCreate) -> EngineeringTeam:
        team = EngineeringTeam(
            id=str(uuid.uuid4()),
            organization_id=data.organization_id,
            name=data.name,
            lead_name=data.lead_name or "Engineering Lead",
            team_type=data.team_type or "Product Engineering",
            headcount=data.headcount or 8,
            owned_services=data.owned_services or [],
            key_members=data.key_members or [],
        )
        self.db.add(team)
        self.db.commit()
        self.db.refresh(team)
        return team

    def get_teams(self, org_id: str) -> List[EngineeringTeam]:
        teams = (
            self.db.query(EngineeringTeam)
            .filter(EngineeringTeam.organization_id == org_id)
            .all()
        )
        if not teams:
            self.get_or_create_default_org()
            teams = (
                self.db.query(EngineeringTeam)
                .filter(EngineeringTeam.organization_id == org_id)
                .all()
            )
        return teams

    def get_repository_intelligence(
        self, org_id: str
    ) -> List[OIPRepositoryIntelligence]:
        repos = (
            self.db.query(OIPRepositoryIntelligence)
            .filter(OIPRepositoryIntelligence.organization_id == org_id)
            .all()
        )
        if not repos:
            self.get_or_create_default_org()
            repos = (
                self.db.query(OIPRepositoryIntelligence)
                .filter(OIPRepositoryIntelligence.organization_id == org_id)
                .all()
            )
        return repos

    def get_knowledge_silos(self, org_id: str) -> List[OIPKnowledgeSilo]:
        silos = (
            self.db.query(OIPKnowledgeSilo)
            .filter(OIPKnowledgeSilo.organization_id == org_id)
            .all()
        )
        if not silos:
            self.get_or_create_default_org()
            silos = (
                self.db.query(OIPKnowledgeSilo)
                .filter(OIPKnowledgeSilo.organization_id == org_id)
                .all()
            )
        return silos

    def get_business_criticality(
        self, org_id: str
    ) -> List[OIPServiceBusinessCriticality]:
        crits = (
            self.db.query(OIPServiceBusinessCriticality)
            .filter(OIPServiceBusinessCriticality.organization_id == org_id)
            .all()
        )
        if not crits:
            self.get_or_create_default_org()
            crits = (
                self.db.query(OIPServiceBusinessCriticality)
                .filter(OIPServiceBusinessCriticality.organization_id == org_id)
                .all()
            )
        return crits

    def get_strategic_recommendations(
        self, org_id: str
    ) -> List[OIPStrategicRecommendation]:
        recs = (
            self.db.query(OIPStrategicRecommendation)
            .filter(OIPStrategicRecommendation.organization_id == org_id)
            .all()
        )
        if not recs:
            self.get_or_create_default_org()
            recs = (
                self.db.query(OIPStrategicRecommendation)
                .filter(OIPStrategicRecommendation.organization_id == org_id)
                .all()
            )
        return recs

    def generate_executive_dashboard(
        self, org_id: str
    ) -> ExecutiveDashboardMetricsSchema:
        org = self.get_organization_overview(org_id)
        teams = self.get_teams(org.id)
        repos = self.get_repository_intelligence(org.id)
        silos = self.get_knowledge_silos(org.id)
        crits = self.get_business_criticality(org.id)
        recs = self.get_strategic_recommendations(org.id)

        overloaded_teams = len([t for t in teams if t.workload_score > 80.0])
        at_risk_projects = len(
            [r for r in repos if r.maintenance_impossibility_index > 70.0]
        )
        critical_silos = len(
            [s for s in silos if s.silo_risk_level in ["CRITICAL", "HIGH"]]
        )
        modernization_repos = len([r for r in repos if r.modernization_urgency > 70.0])
        critical_services = len(
            [c for c in crits if c.revenue_impact_tier == "CRITICAL"]
        )

        rec_schemas = [
            StrategicRecommendationSchema.model_validate(r) for r in recs[:5]
        ]

        return ExecutiveDashboardMetricsSchema(
            organization_name=org.name,
            total_repos_analyzed=org.total_repositories,
            total_teams_tracked=org.total_teams,
            total_engineers_tracked=org.total_engineers,
            overloaded_teams_count=overloaded_teams,
            at_risk_projects_count=at_risk_projects,
            knowledge_silos_count=critical_silos,
            modernization_needed_repos_count=modernization_repos,
            critical_business_services_count=critical_services,
            org_health_score=org.overall_health_score,
            org_modernization_score=org.modernization_index,
            org_bottleneck_risk=org.bottleneck_risk_score,
            top_risk_factors=[
                "Payments & Billing Core workload exceeding 92%",
                "Single knowledge holder for acme/legacy-billing-monolith",
                "High duplicate code ratio in AI recommendation pipelines",
            ],
            recent_recommendations=rec_schemas,
        )

    def run_strategy_engine(self, req: StrategyEngineRequest) -> StrategyEngineResponse:
        org = self.get_organization_overview(req.organization_id)
        recs = self.get_strategic_recommendations(org.id)

        # Dynamic AI Strategy generation
        rec_schemas = [
            StrategicRecommendationSchema.model_validate(r)
            for r in recs[: req.max_recommendations or 5]
        ]

        return StrategyEngineResponse(
            organization_id=org.id,
            generated_at=datetime.utcnow(),
            total_recommendations=len(rec_schemas),
            strategic_roadmap=rec_schemas,
            overall_projected_impact="Projected 35% decrease in team burnout, 42% faster onboarding, and elimination of top 3 critical knowledge silos.",
        )

    def trigger_full_organization_analysis(self, org_id: str) -> Dict[str, Any]:
        org = self.get_organization_overview(org_id)

        # Recalculate metrics dynamically
        teams = self.get_teams(org.id)
        repos = self.get_repository_intelligence(org.id)
        silos = self.get_knowledge_silos(org.id)

        avg_team_workload = sum([t.workload_score for t in teams]) / (len(teams) or 1)
        avg_modernization = sum([r.modernization_urgency for r in repos]) / (
            len(repos) or 1
        )
        avg_silo_risk = sum([s.silo_score for s in silos]) / (len(silos) or 1)

        org.bottleneck_risk_score = round(avg_team_workload * 0.4, 1)
        org.modernization_index = round(100.0 - (avg_modernization * 0.3), 1)
        org.knowledge_silo_risk = round(avg_silo_risk, 1)
        org.overall_health_score = round(
            (100.0 - org.bottleneck_risk_score + org.modernization_index) / 2.0, 1
        )

        self.db.commit()
        self.db.refresh(org)

        return {
            "status": "ANALYSIS_COMPLETE",
            "organization_id": org.id,
            "updated_health_score": org.overall_health_score,
            "updated_modernization_index": org.modernization_index,
            "updated_bottleneck_risk": org.bottleneck_risk_score,
            "analyzed_at": datetime.utcnow().isoformat(),
        }

    def _seed_default_maturity_score(self, org_id: str):
        maturity = EngineeringMaturityScore(
            id=str(uuid.uuid4()),
            organization_id=org_id,
            overall_score=81.4,
            architecture_score=84.0,
            devops_score=88.5,
            security_score=79.0,
            testing_score=76.5,
            ai_adoption_score=82.0,
            documentation_score=74.0,
            reliability_score=86.0,
        )
        self.db.add(maturity)
        self.db.commit()

    def _seed_default_team_deep_analytics(self, org_id: str):
        teams_deep = [
            {
                "team_name": "Payments & Billing Core",
                "collaboration_index": 88.0,
                "review_latency_hours": 3.5,
                "review_participation_rate": 94.0,
                "onboarding_complexity_days": 18.0,
                "capacity_utilization_pct": 92.5,
                "documentation_velocity_score": 68.0,
                "code_ownership_map": {
                    "legacy-billing-monolith": "Sarah Connor",
                    "payment-gateway-v2": "Alex Mercer",
                },
                "skill_distribution": {
                    "Java": 40,
                    "Go": 30,
                    "Spring": 20,
                    "PostgreSQL": 10,
                },
                "cross_team_dependencies": [
                    {
                        "dependent_team": "Frontend Experience",
                        "interface": "GraphQL API",
                    }
                ],
            },
            {
                "team_name": "Platform Infrastructure",
                "collaboration_index": 82.0,
                "review_latency_hours": 2.8,
                "review_participation_rate": 96.0,
                "onboarding_complexity_days": 12.0,
                "capacity_utilization_pct": 88.0,
                "documentation_velocity_score": 85.0,
                "code_ownership_map": {
                    "k8s-ingress-mesh": "David Miller",
                    "auth-identity-service": "Klaus Vance",
                },
                "skill_distribution": {"Go": 55, "Kubernetes": 25, "Terraform": 20},
                "cross_team_dependencies": [
                    {
                        "dependent_team": "Payments & Billing Core",
                        "interface": "mTLS Mesh",
                    }
                ],
            },
        ]
        for td in teams_deep:
            t = OIPTeamDeepAnalytics(
                id=str(uuid.uuid4()),
                organization_id=org_id,
                team_name=td["team_name"],
                collaboration_index=td["collaboration_index"],
                review_latency_hours=td["review_latency_hours"],
                review_participation_rate=td["review_participation_rate"],
                onboarding_complexity_days=td["onboarding_complexity_days"],
                capacity_utilization_pct=td["capacity_utilization_pct"],
                documentation_velocity_score=td["documentation_velocity_score"],
                code_ownership_map=td["code_ownership_map"],
                skill_distribution=td["skill_distribution"],
                cross_team_dependencies=td["cross_team_dependencies"],
            )
            self.db.add(t)
        self.db.commit()

    def get_engineering_maturity_score(self, org_id: str) -> EngineeringMaturityScore:
        mat = (
            self.db.query(EngineeringMaturityScore)
            .filter(EngineeringMaturityScore.organization_id == org_id)
            .first()
        )
        if not mat:
            self.get_or_create_default_org()
            mat = (
                self.db.query(EngineeringMaturityScore)
                .filter(EngineeringMaturityScore.organization_id == org_id)
                .first()
            )
        return mat

    def get_team_deep_analytics(self, org_id: str) -> List[OIPTeamDeepAnalytics]:
        teams_analytics = (
            self.db.query(OIPTeamDeepAnalytics)
            .filter(OIPTeamDeepAnalytics.organization_id == org_id)
            .all()
        )
        if not teams_analytics:
            self.get_or_create_default_org()
            teams_analytics = (
                self.db.query(OIPTeamDeepAnalytics)
                .filter(OIPTeamDeepAnalytics.organization_id == org_id)
                .all()
            )
        return teams_analytics

    def get_organization_graph(self, org_id: str) -> OrgGraphResponseSchema:
        org = self.get_organization_overview(org_id)
        teams = self.get_teams(org.id)
        repos = self.get_repository_intelligence(org.id)

        nodes: List[OrgGraphNodeSchema] = []
        edges: List[OrgGraphEdgeSchema] = []

        # Tier 1: Organization
        org_node_id = f"org-{org.id[:8]}"
        nodes.append(
            OrgGraphNodeSchema(
                id=org_node_id,
                label=org.name,
                tier="ORGANIZATION",
                health_score=org.overall_health_score,
                risk_level="LOW",
            )
        )

        # Tier 2: Departments
        depts = ["Core Platform & Infrastructure", "Product Engineering", "Data & AI"]
        for dept in depts:
            dept_node_id = f"dept-{dept.replace(' ', '-').lower()}"
            nodes.append(
                OrgGraphNodeSchema(
                    id=dept_node_id,
                    label=dept,
                    tier="DEPARTMENT",
                    health_score=85.0,
                    risk_level="LOW",
                )
            )
            edges.append(
                OrgGraphEdgeSchema(
                    source=org_node_id,
                    target=dept_node_id,
                    relationship_type="CONTAINS",
                )
            )

            # Tier 3: Teams under departments
            for team in teams:
                team_node_id = f"team-{team.id[:8]}"
                nodes.append(
                    OrgGraphNodeSchema(
                        id=team_node_id,
                        label=team.name,
                        tier="TEAM",
                        health_score=100.0 - team.burnout_risk_score,
                        risk_level="HIGH" if team.workload_score > 85 else "LOW",
                        metadata={"lead": team.lead_name, "headcount": team.headcount},
                    )
                )
                edges.append(
                    OrgGraphEdgeSchema(
                        source=dept_node_id,
                        target=team_node_id,
                        relationship_type="OWNS",
                    )
                )

                # Tier 4: Repositories under teams
                team_repos = [r for r in repos if r.assigned_team == team.name]
                for r in team_repos:
                    repo_node_id = f"repo-{r.id[:8]}"
                    nodes.append(
                        OrgGraphNodeSchema(
                            id=repo_node_id,
                            label=r.repository_name,
                            tier="REPOSITORY",
                            health_score=r.codebase_health_score,
                            risk_level=(
                                "CRITICAL" if r.modernization_urgency > 80 else "LOW"
                            ),
                        )
                    )
                    edges.append(
                        OrgGraphEdgeSchema(
                            source=team_node_id,
                            target=repo_node_id,
                            relationship_type="MAINTAINS",
                        )
                    )

                    # Tier 5: Services under repo
                    service_node_id = f"service-{r.id[:8]}"
                    nodes.append(
                        OrgGraphNodeSchema(
                            id=service_node_id,
                            label=f"{r.repository_name.split('/')[-1]}-service",
                            tier="SERVICE",
                            health_score=90.0,
                            risk_level="LOW",
                        )
                    )
                    edges.append(
                        OrgGraphEdgeSchema(
                            source=repo_node_id,
                            target=service_node_id,
                            relationship_type="PROVIDES",
                        )
                    )

                    # Tier 6: Modules
                    module_node_id = f"module-{r.id[:8]}"
                    nodes.append(
                        OrgGraphNodeSchema(
                            id=module_node_id,
                            label="core-business-logic",
                            tier="MODULE",
                            health_score=88.0,
                            risk_level="LOW",
                        )
                    )
                    edges.append(
                        OrgGraphEdgeSchema(
                            source=service_node_id,
                            target=module_node_id,
                            relationship_type="CONTAINS",
                        )
                    )

                    # Tier 7: Files
                    file_node_id = f"file-{r.id[:8]}"
                    nodes.append(
                        OrgGraphNodeSchema(
                            id=file_node_id,
                            label="main.py",
                            tier="FILE",
                            health_score=92.0,
                            risk_level="LOW",
                        )
                    )
                    edges.append(
                        OrgGraphEdgeSchema(
                            source=module_node_id,
                            target=file_node_id,
                            relationship_type="CONTAINS",
                        )
                    )

                    # Tier 8: Functions
                    func_node_id = f"func-{r.id[:8]}"
                    nodes.append(
                        OrgGraphNodeSchema(
                            id=func_node_id,
                            label="execute_transaction()",
                            tier="FUNCTION",
                            health_score=95.0,
                            risk_level="LOW",
                        )
                    )
                    edges.append(
                        OrgGraphEdgeSchema(
                            source=file_node_id,
                            target=func_node_id,
                            relationship_type="CONTAINS",
                        )
                    )

        tier_counts = {
            "ORGANIZATION": 1,
            "DEPARTMENT": len(depts),
            "TEAM": len(teams),
            "REPOSITORY": len(repos),
            "SERVICE": len(repos),
            "MODULE": len(repos),
            "FILE": len(repos),
            "FUNCTION": len(repos),
        }

        return OrgGraphResponseSchema(
            organization_id=org.id,
            total_nodes=len(nodes),
            total_edges=len(edges),
            tier_counts=tier_counts,
            nodes=nodes,
            edges=edges,
        )

    def _seed_default_portfolio_deep_analytics(self, org_id: str):
        portfolio_items = [
            {
                "repository_id": "repo-legacy-billing-v1",
                "repository_name": "acme/legacy-billing-monolith",
                "repo_health_rank": 4,
                "tech_debt_score": 92.5,
                "is_duplicate_repo": False,
                "is_legacy": True,
                "legacy_reason": "End-of-Life Java 8 Stack & Spring Boot 1.5",
                "modernization_candidate_score": 96.0,
                "lifecycle_stage": "LEGACY",
                "build_reliability_pct": 78.5,
                "release_frequency_per_month": 1.2,
                "security_posture_score": 42.0,
                "documentation_completeness_score": 28.0,
                "risk_heatmap_score": 94.0,
                "portfolio_health_score": 38.0,
                "dependency_sharing_map": {
                    "spring-boot": "1.5.9",
                    "oracle-jdbc": "12.1.0",
                },
                "shared_library_usage": ["acme-core-common-1.0.jar"],
                "tech_stack_inventory": [
                    "Java 8",
                    "Spring Boot 1.5",
                    "Oracle DB",
                    "JUnit 4",
                ],
                "framework_usage": {"Java": 85, "SQL": 15},
                "language_distribution": {"Java": 180000, "SQL": 32000},
                "infrastructure_inventory": [
                    "Oracle Cloud VM",
                    "Legacy Jenkins Pipeline",
                ],
            },
            {
                "repository_id": "repo-auth-service",
                "repository_name": "acme/auth-identity-service",
                "repo_health_rank": 2,
                "tech_debt_score": 34.0,
                "is_duplicate_repo": False,
                "is_legacy": False,
                "legacy_reason": None,
                "modernization_candidate_score": 45.0,
                "lifecycle_stage": "ACTIVE",
                "build_reliability_pct": 99.2,
                "release_frequency_per_month": 18.0,
                "security_posture_score": 92.0,
                "documentation_completeness_score": 84.0,
                "risk_heatmap_score": 32.0,
                "portfolio_health_score": 88.0,
                "dependency_sharing_map": {"golang-jwt": "v5", "redis-go": "v9"},
                "shared_library_usage": [
                    "acme/go-observability",
                    "acme/go-auth-middleware",
                ],
                "tech_stack_inventory": ["Go 1.21", "OAuth2", "Redis", "PostgreSQL"],
                "framework_usage": {"Go": 90, "SQL": 10},
                "language_distribution": {"Go": 45000, "SQL": 5000},
                "infrastructure_inventory": [
                    "AWS EKS",
                    "Redis ElastiCache",
                    "AWS RDS Postgres",
                ],
            },
            {
                "repository_id": "repo-web-dashboard",
                "repository_name": "acme/web-dashboard-next",
                "repo_health_rank": 1,
                "tech_debt_score": 14.5,
                "is_duplicate_repo": False,
                "is_legacy": False,
                "legacy_reason": None,
                "modernization_candidate_score": 12.0,
                "lifecycle_stage": "ACTIVE",
                "build_reliability_pct": 99.8,
                "release_frequency_per_month": 45.0,
                "security_posture_score": 96.0,
                "documentation_completeness_score": 91.0,
                "risk_heatmap_score": 15.0,
                "portfolio_health_score": 95.0,
                "dependency_sharing_map": {"next": "14.1.0", "react": "18.2.0"},
                "shared_library_usage": ["@acme/design-system-react"],
                "tech_stack_inventory": ["TypeScript", "Next.js 14", "TailwindCSS"],
                "framework_usage": {"TypeScript": 80, "CSS": 20},
                "language_distribution": {"TypeScript": 62000, "CSS": 12000},
                "infrastructure_inventory": ["Vercel Enterprise", "Cloudflare CDN"],
            },
        ]
        for item in portfolio_items:
            p = OIPPortfolioDeepAnalytics(
                id=str(uuid.uuid4()),
                organization_id=org_id,
                repository_id=item["repository_id"],
                repository_name=item["repository_name"],
                repo_health_rank=item["repo_health_rank"],
                tech_debt_score=item["tech_debt_score"],
                is_duplicate_repo=item["is_duplicate_repo"],
                is_legacy=item["is_legacy"],
                legacy_reason=item["legacy_reason"],
                modernization_candidate_score=item["modernization_candidate_score"],
                lifecycle_stage=item["lifecycle_stage"],
                build_reliability_pct=item["build_reliability_pct"],
                release_frequency_per_month=item["release_frequency_per_month"],
                security_posture_score=item["security_posture_score"],
                documentation_completeness_score=item[
                    "documentation_completeness_score"
                ],
                risk_heatmap_score=item["risk_heatmap_score"],
                portfolio_health_score=item["portfolio_health_score"],
                dependency_sharing_map=item["dependency_sharing_map"],
                shared_library_usage=item["shared_library_usage"],
                tech_stack_inventory=item["tech_stack_inventory"],
                framework_usage=item["framework_usage"],
                language_distribution=item["language_distribution"],
                infrastructure_inventory=item["infrastructure_inventory"],
            )
            self.db.add(p)
        self.db.commit()

    def get_portfolio_deep_analytics(
        self, org_id: str
    ) -> List[OIPPortfolioDeepAnalytics]:
        portfolio = (
            self.db.query(OIPPortfolioDeepAnalytics)
            .filter(OIPPortfolioDeepAnalytics.organization_id == org_id)
            .all()
        )
        if not portfolio:
            self.get_or_create_default_org()
            portfolio = (
                self.db.query(OIPPortfolioDeepAnalytics)
                .filter(OIPPortfolioDeepAnalytics.organization_id == org_id)
                .all()
            )
        return portfolio

    def _seed_default_knowledge_deep_analytics(self, org_id: str):
        k = OIPKnowledgeDeepAnalytics(
            id=str(uuid.uuid4()),
            organization_id=org_id,
            org_knowledge_graph_size=1450,
            knowledge_concentration_index=68.0,
            documentation_coverage_pct=74.5,
            adr_coverage_pct=82.0,
            doc_freshness_score=78.0,
            org_memory_score=85.0,
            onboarding_difficulty_score=42.0,
            wiki_health_score=79.0,
            knowledge_risk_trend_pct=-8.5,
            organization_learning_score=84.0,
            knowledge_transfer_recommendations=[
                {
                    "from_expert": "Sarah Connor",
                    "to_engineer": "Alex Mercer",
                    "topic": "Oracle Stored Procedures & PCI Handshakes",
                },
                {
                    "from_expert": "Dr. Aris Thorne",
                    "to_engineer": "Lila Vance",
                    "topic": "Vector Index Normalization Matrix",
                },
            ],
            expert_discovery_map={
                "legacy-billing-monolith": "Sarah Connor",
                "auth-identity-service": "Klaus Vance",
                "recommendation-pipeline": "Dr. Aris Thorne",
                "web-dashboard-next": "Jessica Chen",
            },
            knowledge_gap_predictions=[
                {
                    "topic": "Envoy Filter mTLS",
                    "risk_tier": "HIGH",
                    "target_date": "Q3 2026",
                },
                {
                    "topic": "Tax Calculation Rules Engine",
                    "risk_tier": "CRITICAL",
                    "target_date": "Q4 2026",
                },
            ],
            critical_knowledge_alerts=[
                {
                    "alert": "Sarah Connor is sole owner of 4 core payment modules",
                    "urgency": "CRITICAL",
                }
            ],
            engineering_glossary={
                "EDR": "Engineering Decision Record",
                "Bus Factor": "Minimum number of team members that have to get hit by a bus before a project stalls",
                "Blast Radius": "The impact zone of a service failure on downstream dependent services",
            },
            semantic_doc_graph_nodes=[
                {
                    "title": "Payment Gateway v2 Architecture Spec",
                    "type": "ARCHITECTURE_DOC",
                    "linked_repo": "acme/legacy-billing-monolith",
                },
                {
                    "title": "OAuth2 Auth Flow Runbook",
                    "type": "RUNBOOK",
                    "linked_repo": "acme/auth-identity-service",
                },
            ],
        )
        self.db.add(k)
        self.db.commit()

    def get_knowledge_deep_analytics(self, org_id: str) -> OIPKnowledgeDeepAnalytics:
        k = (
            self.db.query(OIPKnowledgeDeepAnalytics)
            .filter(OIPKnowledgeDeepAnalytics.organization_id == org_id)
            .first()
        )
        if not k:
            self.get_or_create_default_org()
            k = (
                self.db.query(OIPKnowledgeDeepAnalytics)
                .filter(OIPKnowledgeDeepAnalytics.organization_id == org_id)
                .first()
            )
        return k

    def _seed_default_executive_deep_analytics(self, org_id: str):
        e = OIPExecutiveDeepAnalytics(
            id=str(uuid.uuid4()),
            organization_id=org_id,
            deployment_frequency_per_day=14.2,
            lead_time_hours=3.4,
            change_failure_rate_pct=2.1,
            mttr_hours=1.1,
            cost_of_tech_debt_usd=4200000.0,
            engineering_roi_pct=280.0,
            team_productivity_index=91.5,
            delivery_forecasting_confidence_pct=94.0,
            innovation_index=88.0,
            ai_adoption_pct=82.0,
            strategic_modernization_progress_pct=68.5,
            business_capability_alignment_score=89.0,
            dora_tier="ELITE",
            executive_ai_briefing=(
                "Q3 Executive Briefing: The organization maintains Elite DORA performance with 14.2 daily production releases "
                "and an average MTTR of 1.1 hours. Annual cost of tech debt is estimated at $4.2M, concentrated primarily in "
                "acme/legacy-billing-monolith. Strategic modernization is 68.5% complete with an expected AI productivity lift of 32%."
            ),
            cto_dashboard_metrics={
                "headcount_efficiency": "94.2%",
                "architecture_standardization": "88.0%",
                "cloud_spend_optimization": "$120k/mo saved",
            },
            vp_eng_dashboard_metrics={
                "active_sprints_on_track": 42,
                "sprint_velocity_std_dev": "4.2%",
                "pr_turnaround_p95_hours": 6.8,
            },
            portfolio_risk_matrix={
                "HIGH_RISK": ["acme/legacy-billing-monolith"],
                "MEDIUM_RISK": ["acme/recommendation-pipeline"],
                "LOW_RISK": ["acme/auth-identity-service", "acme/web-dashboard-next"],
            },
        )
        self.db.add(e)
        self.db.commit()

    def get_executive_deep_analytics(self, org_id: str) -> OIPExecutiveDeepAnalytics:
        e = (
            self.db.query(OIPExecutiveDeepAnalytics)
            .filter(OIPExecutiveDeepAnalytics.organization_id == org_id)
            .first()
        )
        if not e:
            self.get_or_create_default_org()
            e = (
                self.db.query(OIPExecutiveDeepAnalytics)
                .filter(OIPExecutiveDeepAnalytics.organization_id == org_id)
                .first()
            )
        return e

    def _seed_default_ai_org_intelligence(self, org_id: str):
        earth_nodes = [
            {
                "id": "node-platform",
                "team_name": "Platform Infrastructure",
                "domain_category": "Platform",
                "health_status": "OPTIMAL",
                "health_score": 96.0,
                "architecture_maturity": 94.0,
                "tech_debt_score": 18.0,
                "knowledge_risk": "LOW",
                "deployment_health": 99.5,
                "documentation_score": 92.0,
                "active_engineers": 16,
                "owned_repos_count": 42,
                "ai_recommendations": ["Expand Terraform automated compliance rules"],
            },
            {
                "id": "node-payments",
                "team_name": "Payments & Billing",
                "domain_category": "Core Banking",
                "health_status": "WARNING",
                "health_score": 64.0,
                "architecture_maturity": 70.0,
                "tech_debt_score": 92.5,
                "knowledge_risk": "CRITICAL",
                "deployment_health": 78.5,
                "documentation_score": 45.0,
                "active_engineers": 12,
                "owned_repos_count": 18,
                "ai_recommendations": [
                    "Decompose legacy billing monolith",
                    "Pair Alex Mercer with Sarah Connor",
                ],
            },
            {
                "id": "node-orders",
                "team_name": "Order Fulfillment",
                "domain_category": "E-Commerce",
                "health_status": "OPTIMAL",
                "health_score": 88.0,
                "architecture_maturity": 86.0,
                "tech_debt_score": 28.0,
                "knowledge_risk": "LOW",
                "deployment_health": 95.0,
                "documentation_score": 82.0,
                "active_engineers": 14,
                "owned_repos_count": 24,
                "ai_recommendations": ["Upgrade gRPC protocol buffer definitions"],
            },
            {
                "id": "node-auth",
                "team_name": "Authentication & Identity",
                "domain_category": "Security",
                "health_status": "OPTIMAL",
                "health_score": 92.0,
                "architecture_maturity": 95.0,
                "tech_debt_score": 34.0,
                "knowledge_risk": "LOW",
                "deployment_health": 99.2,
                "documentation_score": 88.0,
                "active_engineers": 10,
                "owned_repos_count": 12,
                "ai_recommendations": ["Rotate OAuth2 signing keys"],
            },
            {
                "id": "node-data",
                "team_name": "Data Platform & Analytics",
                "domain_category": "Big Data",
                "health_status": "OPTIMAL",
                "health_score": 89.0,
                "architecture_maturity": 88.0,
                "tech_debt_score": 24.0,
                "knowledge_risk": "MEDIUM",
                "deployment_health": 94.0,
                "documentation_score": 79.0,
                "active_engineers": 18,
                "owned_repos_count": 36,
                "ai_recommendations": ["Optimize Spark memory allocation on EMR"],
            },
            {
                "id": "node-mobile",
                "team_name": "Mobile Engineering",
                "domain_category": "Frontend",
                "health_status": "OPTIMAL",
                "health_score": 86.0,
                "architecture_maturity": 84.0,
                "tech_debt_score": 32.0,
                "knowledge_risk": "LOW",
                "deployment_health": 92.0,
                "documentation_score": 81.0,
                "active_engineers": 22,
                "owned_repos_count": 15,
                "ai_recommendations": ["Migrate React Native navigation to v6"],
            },
            {
                "id": "node-ai",
                "team_name": "AI & Intelligence",
                "domain_category": "AI/ML",
                "health_status": "OPTIMAL",
                "health_score": 95.0,
                "architecture_maturity": 92.0,
                "tech_debt_score": 14.0,
                "knowledge_risk": "LOW",
                "deployment_health": 98.0,
                "documentation_score": 90.0,
                "active_engineers": 25,
                "owned_repos_count": 28,
                "ai_recommendations": ["Fine-tune vector embedding quantization"],
            },
            {
                "id": "node-devops",
                "team_name": "DevOps & SRE",
                "domain_category": "DevOps",
                "health_status": "OPTIMAL",
                "health_score": 94.0,
                "architecture_maturity": 96.0,
                "tech_debt_score": 15.0,
                "knowledge_risk": "LOW",
                "deployment_health": 99.8,
                "documentation_score": 94.0,
                "active_engineers": 15,
                "owned_repos_count": 30,
                "ai_recommendations": ["Automate canary deployment rollbacks"],
            },
            {
                "id": "node-security",
                "team_name": "InfoSec & Compliance",
                "domain_category": "Security",
                "health_status": "OPTIMAL",
                "health_score": 96.0,
                "architecture_maturity": 98.0,
                "tech_debt_score": 12.0,
                "knowledge_risk": "LOW",
                "deployment_health": 99.9,
                "documentation_score": 96.0,
                "active_engineers": 12,
                "owned_repos_count": 20,
                "ai_recommendations": [
                    "Enforce mandatory Dependency-Track CVE scanning"
                ],
            },
        ]

        ai_obj = OIPAIOrgIntelligence(
            id=str(uuid.uuid4()),
            organization_id=org_id,
            ai_advisor_confidence_pct=96.5,
            compliance_score_pct=94.0,
            scaling_headcount_capacity=120,
            repo_consolidation_opportunity_count=18,
            engineering_earth_active_nodes=len(earth_nodes),
            ai_org_advisor_recommendations=[
                {
                    "recommendation": "Consolidate 4 duplicate auth libraries into @acme/auth-core",
                    "priority": "HIGH",
                },
                {
                    "recommendation": "Reallocate 3 engineers from Platform to Payments team",
                    "priority": "CRITICAL",
                },
            ],
            ai_cto_assistant_insights={
                "quarterly_focus": "Legacy Billing Decommission & Vector Index Scaling",
                "risk_rating": "LOW",
                "recommended_capital_allocation": "$2.4M towards Microservices Refactoring",
            },
            ai_vp_eng_assistant_insights={
                "sprint_health": "96% of Sprint Commitments Met",
                "hiring_bottleneck": "Senior Go Infrastructure Engineers",
                "attrition_risk": "LOW",
            },
            ai_hiring_recommendations=[
                {
                    "role": "Staff Distributed Systems Engineer",
                    "team": "Payments & Billing",
                    "reason": "Single point of failure in Oracle Stored Procedures",
                },
                {
                    "role": "Senior ML Ops Engineer",
                    "team": "AI & Intelligence",
                    "reason": "Scaling vector database query throughput",
                },
            ],
            ai_team_scaling_simulator={
                "headcount_addition": "+15 Engineers",
                "projected_velocity_increase": "+38%",
                "onboarding_buffer_days": 18,
            },
            ai_compliance_status={
                "SOC2_Type_II": "COMPLIANT (98%)",
                "HIPAA": "COMPLIANT (95%)",
                "PCI_DSS_v4": "WARNING (88% - Monolith remediation required)",
            },
            engineering_earth_nodes=earth_nodes,
            ai_executive_chat_history=[
                {
                    "sender": "CTO",
                    "message": "What is our biggest architectural vulnerability right now?",
                },
                {
                    "sender": "CodeAtlas AI",
                    "message": "The legacy billing monolith (acme/legacy-billing-monolith) represents 92.5% of our tech debt and has a bus factor of 1 (Sarah Connor). Recommended action: Execute Phase 3 microservice decomposition.",
                },
            ],
        )
        self.db.add(ai_obj)
        self.db.commit()

    def get_ai_org_intelligence(self, org_id: str) -> OIPAIOrgIntelligence:
        ai_obj = (
            self.db.query(OIPAIOrgIntelligence)
            .filter(OIPAIOrgIntelligence.organization_id == org_id)
            .first()
        )
        if not ai_obj:
            self.get_or_create_default_org()
            ai_obj = (
                self.db.query(OIPAIOrgIntelligence)
                .filter(OIPAIOrgIntelligence.organization_id == org_id)
                .first()
            )
        return ai_obj

    def get_engineering_earth(self, org_id: str) -> List[Dict[str, Any]]:
        ai_obj = self.get_ai_org_intelligence(org_id)
        return ai_obj.engineering_earth_nodes
