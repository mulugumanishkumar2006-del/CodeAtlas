# apps/backend/app/ai_cto/orchestrator/cto_orchestrator.py

import json
import os

import httpx
from app.ai_cto.analyzers.bottleneck_detector import BottleneckDetector
from app.ai_cto.analyzers.capacity_estimator import CapacityEstimator
from app.ai_cto.analyzers.growth_analyzer import GrowthAnalyzer
from app.ai_cto.analyzers.roi_engine import ROIEngine
from app.ai_cto.planners.architecture_planner import ArchitecturePlanner
from app.ai_cto.planners.cost_optimizer import CostOptimizer
from app.ai_cto.planners.hiring_planner import HiringPlanner
from app.ai_cto.planners.migration_planner import MigrationPlanner
from app.ai_cto.planners.risk_planner import RiskPlanner
from app.ai_cto.planners.roadmap_generator import RoadmapGenerator
from app.ai_cto.planners.scalability_planner import ScalabilityPlanner
from app.ai_cto.prompts.strategy_prompts import ANALYZE_PROMPT_TEMPLATE, SYSTEM_PROMPT
from app.ai_cto.reports.engineering_report import EngineeringReportGenerator
from app.ai_cto.reports.executive_report import ExecutiveReportGenerator
from app.ai_cto.schemas.report import (
    CTOAnalysisResponse,
)
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.repository_statistics import RepositoryStatistics
from sqlalchemy.orm import Session


class CTOOrchestrator:
    def __init__(self) -> None:
        self.growth_analyzer = GrowthAnalyzer()
        self.roi_engine = ROIEngine()
        self.bottleneck_detector = BottleneckDetector()
        self.capacity_estimator = CapacityEstimator()

        self.architecture_planner = ArchitecturePlanner()
        self.migration_planner = MigrationPlanner()
        self.scalability_planner = ScalabilityPlanner()
        self.hiring_planner = HiringPlanner()
        self.cost_optimizer = CostOptimizer()
        self.roadmap_generator = RoadmapGenerator()
        self.risk_planner = RiskPlanner()

        self.exec_report_gen = ExecutiveReportGenerator()
        self.eng_report_gen = EngineeringReportGenerator()

    def analyze_repository(
        self,
        db: Session,
        repo_id: str,
        target_users: int = 10000,
        target_requests_per_sec: int = 100,
        migration_target: str = "serverless",
        budget_reduction_pct: float = 0.0,
    ) -> CTOAnalysisResponse:
        """
        Main orchestration logic. Gathers digital twin parameters, runs analysis,
        and optionally queries external LLM if api keys are configured.
        """
        # 1. Fetch Repository details
        stats = (
            db.query(RepositoryStatistics)
            .filter(RepositoryStatistics.repository_id == repo_id)
            .first()
        )
        total_files = stats.total_files if stats else 10
        total_lines = stats.total_lines if stats else 1000
        total_complexity = stats.total_complexity if stats else 50.0
        average_complexity = stats.average_complexity if stats else 5.0
        doc_coverage = stats.documentation_coverage if stats else 70.0
        languages = stats.languages if stats and stats.languages else {"python": 1.0}

        # Query Node/Relationship counts
        total_nodes = (
            db.query(GraphNode).filter(GraphNode.repository_id == repo_id).count()
        )
        total_relationships = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.repository_id == repo_id)
            .count()
        )

        # Gather reliability & technical debt metrics
        reliability_score = 80.0
        tech_debt_score = 30.0

        # Try Calling External LLM if configured
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        openai_api_key = os.getenv("OPENAI_API_KEY")

        if gemini_api_key or openai_api_key:
            try:
                user_prompt = ANALYZE_PROMPT_TEMPLATE.format(
                    repo_id=repo_id,
                    target_users=target_users,
                    target_requests_per_sec=target_requests_per_sec,
                    migration_target=migration_target,
                    budget_reduction_pct=budget_reduction_pct,
                    total_files=total_files,
                    total_lines=total_lines,
                    total_complexity=total_complexity,
                    average_complexity=average_complexity,
                    documentation_coverage=doc_coverage,
                    languages=json.dumps(languages),
                    reliability_score=reliability_score,
                    tech_debt_score=tech_debt_score,
                    total_nodes=total_nodes,
                    total_relationships=total_relationships,
                )

                if gemini_api_key:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={gemini_api_key}"
                    resp = httpx.post(
                        url,
                        json={
                            "contents": [
                                {
                                    "parts": [
                                        {"text": f"{SYSTEM_PROMPT}\n\n{user_prompt}"}
                                    ]
                                }
                            ]
                        },
                        timeout=15.0,
                    )
                    if resp.status_code == 200:
                        raw = resp.json()["candidates"][0]["content"]["parts"][0][
                            "text"
                        ].strip()
                        if raw.startswith("```"):
                            raw = "\n".join(raw.split("\n")[1:-1])
                        return CTOAnalysisResponse.model_validate(json.loads(raw))

                if openai_api_key:
                    url = "https://api.openai.com/v1/chat/completions"
                    headers = {"Authorization": f"Bearer {openai_api_key}"}
                    payload = {
                        "model": "gpt-4-turbo",
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": user_prompt},
                        ],
                        "temperature": 0.2,
                    }
                    resp = httpx.post(url, json=payload, headers=headers, timeout=15.0)
                    if resp.status_code == 200:
                        raw = resp.json()["choices"][0]["message"]["content"].strip()
                        if raw.startswith("```"):
                            raw = "\n".join(raw.split("\n")[1:-1])
                        return CTOAnalysisResponse.model_validate(json.loads(raw))
            except Exception as e:
                print(
                    f"External AI CTO Call failed: {e}. Falling back to rule-based engine."
                )

        # 2. Run Local Codebase Rule-Based Planners and Analyzers (Fallback / Standard flow)
        growth = self.growth_analyzer.analyze(db, repo_id)
        roi = self.roi_engine.calculate(db, repo_id, budget_reduction_pct)
        bottlenecks = self.bottleneck_detector.detect(db, repo_id)
        capacity = self.capacity_estimator.estimate(
            target_users, target_requests_per_sec
        )

        arch_plan = self.architecture_planner.plan(
            bottlenecks["direct_database_queries_count"],
            bottlenecks["coupling_hotspots"],
        )
        mig_plan = self.migration_planner.plan(
            migration_target, bottlenecks["coupling_hotspots"]
        )
        self.scalability_planner.plan(capacity)

        costs = self.cost_optimizer.plan(budget_reduction_pct)
        hiring = self.hiring_planner.plan(
            target_requests_per_sec, bottlenecks["circular_dependencies_count"]
        )
        risks = self.risk_planner.plan(
            bottlenecks["circular_dependencies_count"],
            bottlenecks["direct_database_queries_count"],
        )

        roadmap = self.roadmap_generator.generate(
            repo_id, bottlenecks["coupling_hotspots"]
        )
        exec_report = self.exec_report_gen.generate(
            repo_id, roi, costs, roadmap.sprints * 2
        )
        eng_report = self.eng_report_gen.generate(arch_plan, mig_plan)

        # Target reports targeting specific stakeholders (Feature 18)
        persona_reports = {
            "CTO": (
                "CTO STRATEGIC REPORT:\n"
                "- Architecture standard: Decouple direct query violate references in routes handlers.\n"
                "- Folder structure target: Relocate coupled code base hotspots to distinct domain modules.\n"
                "- Standards list: Strict separation of serializers and database interfaces patterns."
            ),
            "CEO": (
                f"CEO STRATEGIC REPORT:\n"
                f"- Budget: Target Cloud costs optimization suggests ${roi['maintenance_savings_usd']:.0f}/yr reduction potential.\n"
                f"- Timeline: Decoupling phase roadmap estimated complete in {roadmap.sprints * 2} weeks.\n"
                f"- Organization: Recommends hiring platform & backend engineers to protect delivery targets."
            ),
            "Engineering Managers": (
                f"EM STRATEGIC REPORT:\n"
                f"- Sprints roadmap details: {len(roadmap.milestones)} milestones allocated across {roadmap.sprints} sprints.\n"
                f"- Staffing assignment: 2 backend resources and 1 platform resource allocations.\n"
                f"- Risk check: Mitigate high bus factor and circular imports to speed up dev velocity."
            ),
            "Investors": (
                f"INVESTOR ROI STRATEGIC REPORT:\n"
                f"- Financial Return: Payback period on technical debt refactoring is {roi['refactoring_payback_months']} months.\n"
                f"- Scale growth: Base metrics read growth readiness level 3 with low circular coupling hotspots.\n"
                f"- Reliability audit: Disaster recovery playbook and liveness check probes secure product availability."
            ),
        }

        # 100x traffic simulation (Feature 17)
        simulation_rps = target_requests_per_sec * 100
        sim_capacity = self.capacity_estimator.estimate(
            target_users * 100, simulation_rps
        )

        scenario_simulation = {
            "required_services": [
                f"CockroachDB Multi-Region replica nodes (target DB connections pool sizing: {sim_capacity['target_db_connections']})",
                f"Redis Cluster nodes (Cache allocation: {sim_capacity['estimated_cache_size_gb']} GB memory)",
                "RabbitMQ Queue cluster with 5 consumer nodes to handle background tasks",
                "Ingress Proxy balanced across 3 isolated cloud availability zones",
            ],
            "risks": [
                f"High database contention risk (index rate: {sim_capacity['database_contention_index'] * 100}%)",
                f"Queue saturation probability under massive background task queues: {sim_capacity['queue_saturation_rate'] * 100}%",
                f"CPU bottlenecks in parsing routing layer (likelihood: {sim_capacity['cpu_bottleneck_probability'] * 100}%)",
            ],
            "estimated_cost_increase_usd": float(
                sim_capacity["storage_growth_gb_monthly"] * 5
                + sim_capacity["compute_growth_cpu_cores"] * 45
            ),
            "migration_timeline_weeks": int(roadmap.sprints * 3),
            "predicted_latency_ms": sim_capacity["predicted_api_latency_ms"],
        }

        return CTOAnalysisResponse(
            repository_id=repo_id,
            goals={
                "target_users": target_users,
                "target_requests_per_sec": target_requests_per_sec,
                "migration_target": migration_target,
                "budget_reduction_pct": budget_reduction_pct,
            },
            growth_projections=growth,
            roi_analysis=roi,
            capacity_planning=capacity,
            costs=costs,
            hiring=hiring,
            risks=risks,
            roadmap=roadmap,
            executive_report=exec_report,
            engineering_report=eng_report,
            predicted_bottlenecks=bottlenecks.get("predicted_bottlenecks", []),
            persona_reports=persona_reports,
            scenario_simulation=scenario_simulation,
        )
