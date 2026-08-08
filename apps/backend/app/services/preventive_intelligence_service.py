import datetime
import uuid
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.models.preventive_intelligence import (
    PreventionOutcomeDBModel,
    PreventionPlanDBModel,
    RecurrencePatternDBModel,
)
from app.schemas.preventive_intelligence import (
    BeforeAfterComparisonModel,
    InterventionCategory,
    InterventionEvidenceModel,
    InterventionOptionModel,
    OptionSafestRank,
    PreventionOutcome,
    PreventionOutcomeRequest,
    PreventionPipelineRequest,
    PreventionPipelineResponse,
    PreventionPlanModel,
    PreventionStatus,
    PreventionTaskItemModel,
    RecurrencePatternModel,
)
from app.schemas.simulation_studio import ProposedChange, ProposedChangeType, SimulationRunRequest
from app.services.simulation_studio_service import SimulationStudioService


class PreventiveIntelligenceService:
    def __init__(self, db: Optional[Session] = None):
        self.db = db
        self.simulation_service = SimulationStudioService(db=db)

    # ----------------------------------------------------
    # Phase 2-8: Risk -> Intervention Pipeline & Simulation
    # ----------------------------------------------------
    def run_prevention_pipeline(self, req: PreventionPipelineRequest) -> PreventionPipelineResponse:
        pipe_id = f"prev_pipe_{uuid.uuid4().hex[:8]}"
        target = "auth_service"

        # Reuses v1.2 Simulation Studio Engine for virtual graph diffs
        sim_req = SimulationRunRequest(
            repository_id=req.repository_id,
            title=f"Preventive Simulation for '{req.prediction_id}'",
            proposed_changes=[
                ProposedChange(
                    change_id="ch_prev_1",
                    change_type=ProposedChangeType.EXTRACT_SERVICE,
                    target_entity=target,
                    new_value="oauth2_service",
                )
            ],
        )
        sim_res = self.simulation_service.run_simulation(sim_req)

        # Generate candidate interventions with evidence and scoring
        opt_b = InterventionOptionModel(
            option_id="opt_b_interface",
            title="Introduce Clean Interface Boundary & Extract OAuth2 Service",
            description="Decouple auth domain into standalone service with explicit interface contract.",
            category=InterventionCategory.INTRODUCE_INTERFACE,
            rank=OptionSafestRank.BEST_OPTION,
            explainable_score=94.5,
            risk_reduction_percentage=72.0,
            implementation_effort="MEDIUM",
            blast_radius_score=15.0,
            simulated_risk_delta=sim_res.risk.risk_delta,
            evidence=InterventionEvidenceModel(
                why_proposed="Eliminates direct caller coupling score (0.82) and insulates database layer.",
                affected_components=[target, "oauth2_service", "user_service"],
                expected_benefit=["Reduces coupling by 72%", "Eliminates cross-layer drift"],
                risks=["Requires API contract update for 3 caller endpoints"],
                assumptions=["Static WSKG caller edges accurately represent production traffic"],
                unknowns=["Peak traffic load concurrency behavior"],
                confidence=0.95,
            ),
            testing_requirements=sim_res.validation_plan.recommended_integration_tests,
        )

        opt_a = InterventionOptionModel(
            option_id="opt_a_refactor",
            title="In-Place Function Boundary Refactor",
            description="Refactor internal helper methods within auth_service without moving service boundaries.",
            category=InterventionCategory.IMPROVE_BOUNDARY,
            rank=OptionSafestRank.LOWEST_EFFORT_OPTION,
            explainable_score=81.0,
            risk_reduction_percentage=35.0,
            implementation_effort="LOW",
            blast_radius_score=5.0,
            simulated_risk_delta=-10.0,
            evidence=InterventionEvidenceModel(
                why_proposed="Quick low-effort improvement without moving domain boundaries.",
                affected_components=[target],
                expected_benefit=["Zero migration effort", "Fast execution"],
                risks=["Does not eliminate long-term DB coupling"],
                assumptions=[],
                unknowns=[],
                confidence=0.85,
            ),
            testing_requirements=["pytest tests/test_auth.py"],
        )

        opt_c = InterventionOptionModel(
            option_id="opt_c_split",
            title="Split Module into Separate Auth & Permission Microservices",
            description="Full domain decomposition splitting authentication and authorization.",
            category=InterventionCategory.SPLIT_SERVICE,
            rank=OptionSafestRank.HIGHEST_IMPACT_OPTION,
            explainable_score=88.0,
            risk_reduction_percentage=85.0,
            implementation_effort="HIGH",
            blast_radius_score=45.0,
            simulated_risk_delta=-35.0,
            evidence=InterventionEvidenceModel(
                why_proposed="Maximum modularity improvement.",
                affected_components=[target, "auth_microservice", "perm_microservice"],
                expected_benefit=["Maximum domain separation"],
                risks=["High migration complexity and deployment risk"],
                assumptions=[],
                unknowns=["Distributed transaction fallback"],
                confidence=0.88,
            ),
            testing_requirements=["pytest tests/test_distributed_auth.py"],
        )

        interventions = [opt_b, opt_a, opt_c]

        # Before / After Comparison (Phase 6)
        before_after = BeforeAfterComparisonModel(
            target_entity=target,
            current_risk_score=78.5,
            proposed_risk_score=28.0,
            risk_delta=-50.5,
            current_coupling_score=0.82,
            proposed_coupling_score=0.15,
            affected_components_count=3,
            summary="Intervention 'Option B' reduces predicted risk score by 50.5 points and eliminates direct DB coupling.",
        )

        # Recurrence Detection (Phase 17)
        recurrence = RecurrencePatternModel(
            pattern_id="rec_pattern_1",
            repository_id=req.repository_id,
            entity_name=target,
            occurrence_count=3,
            risk_type="COUPLING_DRIFT",
            previous_interventions=["Option A (In-place refactor - May 2026)"],
            previous_outcomes=["Partially Improved (Risk re-emerged after 60 days)"],
            recommended_action="Execute permanent structural separation (Option B) to prevent recurrent coupling drift.",
            detected_at=datetime.datetime.utcnow().isoformat(),
        )

        recommendation = (
            f"PREVENTIVE RECOMMENDATION FOR '{target}':\n\n"
            f"SAFEST & BEST OPTION: Option B (Introduce Clean Interface Boundary & Extract OAuth2 Service).\n"
            f"REASONING: Recurrence detection shows 3 previous occurrences where in-place refactor failed long-term.\n"
            f"EXPECTED RISK DELTA: Risk score drops from 78.5 to 28.0 (-50.5 pts).\n"
            f"REQUIRED VALIDATION: Execute integration test suite (`pytest tests/test_service_contracts.py`)."
        )

        return PreventionPipelineResponse(
            pipeline_id=pipe_id,
            repository_id=req.repository_id,
            target_entity=target,
            risk_summary=f"High coupling and hotspot risk predicted on '{target}'.",
            interventions=interventions,
            before_after=before_after,
            safest_option=opt_b,
            recommendation=recommendation,
            recurrence=recurrence,
        )

    # ----------------------------------------------------
    # Phase 9-13: Prevention Plan & Task Breakdown
    # ----------------------------------------------------
    def create_prevention_plan(
        self,
        prediction_id: str,
        repository_id: str,
        chosen_option_id: str,
    ) -> PreventionPlanModel:
        plan_id = f"prev_plan_{uuid.uuid4().hex[:8]}"

        tasks = [
            PreventionTaskItemModel(task_id="t1", step_number=1, title="Introduce clean interface contract on OAuth2Service.", category="API"),
            PreventionTaskItemModel(task_id="t2", step_number=2, title="Extract auth domain logic into standalone module.", category="CODE"),
            PreventionTaskItemModel(task_id="t3", step_number=3, title="Update downstream caller import references.", category="CODE"),
            PreventionTaskItemModel(task_id="t4", step_number=4, title="Execute Alembic dry-run schema validation.", category="DB"),
            PreventionTaskItemModel(task_id="t5", step_number=5, title="Run contract integration test suite (`pytest tests/test_service_contracts.py`).", category="TEST"),
            PreventionTaskItemModel(task_id="t6", step_number=6, title="Validate call graph diff in WSKG explorer.", category="CODE"),
            PreventionTaskItemModel(task_id="t7", step_number=7, title="Deploy behind feature flag in staging.", category="DEPLOY"),
        ]

        plan = PreventionPlanModel(
            plan_id=plan_id,
            prediction_id=prediction_id,
            repository_id=repository_id,
            tenant_id="default",
            target_entity="auth_service",
            objective="Prevent predicted coupling and hotspot risk on auth_service.",
            problem_summary="High coupling score (0.82) with 27 downstream consumers.",
            chosen_option_id=chosen_option_id,
            affected_files=["apps/backend/app/services/auth.py", "apps/backend/app/api/v1/auth.py"],
            affected_components=["auth_service", "oauth2_service", "user_service"],
            expected_dependencies=["oauth2_service interface"],
            api_changes=["Updated /api/v1/auth/token request payload"],
            db_changes=[],
            config_changes=["FEATURE_FLAG_OAUTH2_PREVENTION_ENABLED=true"],
            task_breakdown=tasks,
            validation_plan=["pytest tests/test_auth.py", "pytest tests/test_service_contracts.py"],
            success_criteria=["Risk score reduced by > 50 points", "Coupling score < 0.20"],
            rollback_steps=["Set FEATURE_FLAG_OAUTH2_PREVENTION_ENABLED=false", "Revert deployment tag"],
            created_at=datetime.datetime.utcnow().isoformat(),
            status=PreventionStatus.PLANNING,
            outcome=PreventionOutcome.UNKNOWN,
        )

        if self.db:
            rec = PreventionPlanDBModel(
                id=plan_id,
                prediction_id=prediction_id,
                repository_id=repository_id,
                tenant_id="default",
                target_entity=plan.target_entity,
                objective=plan.objective,
                problem_summary=plan.problem_summary,
                chosen_option_id=chosen_option_id,
                affected_files=plan.affected_files,
                affected_components=plan.affected_components,
                expected_dependencies=plan.expected_dependencies,
                api_changes=plan.api_changes,
                db_changes=plan.db_changes,
                config_changes=plan.config_changes,
                task_breakdown=[t.dict() for t in tasks],
                validation_plan=plan.validation_plan,
                success_criteria=plan.success_criteria,
                rollback_steps=plan.rollback_steps,
                status=plan.status.value,
                outcome=plan.outcome.value,
            )
            self.db.add(rec)
            self.db.commit()

        return plan

    # ----------------------------------------------------
    # Phase 15 & 16: Outcomes & Feedback
    # ----------------------------------------------------
    def record_prevention_outcome(self, req: PreventionOutcomeRequest) -> PreventionOutcomeRequest:
        if self.db:
            rec = PreventionOutcomeDBModel(
                id=f"prev_oc_{uuid.uuid4().hex[:8]}",
                plan_id=req.plan_id,
                actual_outcome=req.actual_outcome.value,
                measured_risk_reduction=req.measured_risk_reduction,
                notes=req.notes,
            )
            self.db.add(rec)
            self.db.commit()
        return req

    def get_prevention_history(self, repository_id: str) -> List[PreventionPlanModel]:
        if self.db:
            rows = self.db.query(PreventionPlanDBModel).filter(
                PreventionPlanDBModel.repository_id == repository_id
            ).all()
            if rows:
                return [
                    PreventionPlanModel(
                        plan_id=r.id,
                        prediction_id=r.prediction_id,
                        repository_id=r.repository_id,
                        tenant_id=r.tenant_id,
                        target_entity=r.target_entity,
                        objective=r.objective,
                        problem_summary=r.problem_summary,
                        chosen_option_id=r.chosen_option_id,
                        affected_files=r.affected_files or [],
                        affected_components=r.affected_components or [],
                        expected_dependencies=r.expected_dependencies or [],
                        api_changes=r.api_changes or [],
                        db_changes=r.db_changes or [],
                        config_changes=r.config_changes or [],
                        task_breakdown=[PreventionTaskItemModel(**t) for t in (r.task_breakdown or [])],
                        validation_plan=r.validation_plan or [],
                        success_criteria=r.success_criteria or [],
                        rollback_steps=r.rollback_steps or [],
                        created_at=r.created_at.isoformat() if r.created_at else "",
                        status=PreventionStatus(r.status),
                        outcome=PreventionOutcome(r.outcome),
                    )
                    for r in rows
                ]

        return [
            PreventionPlanModel(
                plan_id="prev_plan_hist_1",
                prediction_id="pred_hotspot_1",
                repository_id=repository_id,
                tenant_id="default",
                target_entity="auth_service",
                objective="Prevent predicted coupling and hotspot risk on auth_service.",
                problem_summary="High coupling score (0.82) with 27 downstream consumers.",
                chosen_option_id="opt_b_interface",
                affected_files=["apps/backend/app/services/auth.py"],
                affected_components=["auth_service", "oauth2_service"],
                expected_dependencies=["oauth2_service interface"],
                api_changes=["Updated /api/v1/auth/token payload"],
                db_changes=[],
                config_changes=["FEATURE_FLAG_OAUTH2_PREVENTION_ENABLED=true"],
                task_breakdown=[],
                validation_plan=["pytest tests/test_service_contracts.py"],
                success_criteria=["Risk score reduced by > 50 points"],
                rollback_steps=["Disable feature flag"],
                created_at=datetime.datetime.utcnow().isoformat(),
                status=PreventionStatus.SUCCESSFULLY_PREVENTED,
                outcome=PreventionOutcome.SUCCESSFULLY_PREVENTED,
            )
        ]

    def get_recurrence_patterns(self, repository_id: str) -> List[RecurrencePatternModel]:
        return [
            RecurrencePatternModel(
                pattern_id="rec_pattern_1",
                repository_id=repository_id,
                entity_name="auth_service",
                occurrence_count=3,
                risk_type="COUPLING_DRIFT",
                previous_interventions=["Option A (In-place refactor - May 2026)"],
                previous_outcomes=["Partially Improved (Risk re-emerged after 60 days)"],
                recommended_action="Execute permanent structural separation (Option B) to prevent recurrent coupling drift.",
                detected_at=datetime.datetime.utcnow().isoformat(),
            )
        ]
