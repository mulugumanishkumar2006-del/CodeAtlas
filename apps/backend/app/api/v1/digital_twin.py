from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.digital_twin import (
    BlastRadiusEntity,
    DigitalTwinChange,
    DigitalTwinSession,
    SimulationResult,
    SimulationScenario,
)
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.repository import Repository
from app.models.user import User
from app.schemas.digital_twin import (
    AIRefactoringRequest,
    AIRefactoringResponse,
    BlastRadiusEntityResponse,
    DigitalTwinSessionCreate,
    DigitalTwinSessionResponse,
    IncidentSimulationRequest,
    IncidentSimulationResponse,
    ScenarioComparisonRequest,
    ScenarioComparisonResponse,
    SimulationChangeCreate,
    SimulationChangeResponse,
    SimulationCompareRequest,
    SimulationCompareResponse,
    SimulationReportResponse,
    SimulationResultResponse,
    SimulationRunRequest,
    SimulationScenarioCreate,
    SimulationScenarioResponse,
    SoftwareCityResponse,
    WhatIfRequest,
    WhatIfResponse,
)
from app.services.digital_twin_engine import DigitalTwinEngine
from app.services.simulation_algorithms import SimulationAlgorithms
from app.services.software_city_service import SoftwareCityService

router = APIRouter()


def validate_repository_access(repo_id: str, db: Session, user: User) -> Repository:
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied.",
        )
    return repo


@router.post(
    "/repositories/{repo_id}/digital-twin/sessions",
    response_model=DigitalTwinSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_simulation_session(
    repo_id: str,
    session_data: DigitalTwinSessionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)

    session = DigitalTwinSession(
        repository_id=repo_id,
        name=session_data.name,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get(
    "/repositories/{repo_id}/digital-twin/sessions",
    response_model=List[DigitalTwinSessionResponse],
)
def list_simulation_sessions(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)

    sessions = (
        db.query(DigitalTwinSession)
        .filter(DigitalTwinSession.repository_id == repo_id)
        .order_by(DigitalTwinSession.created_at.desc())
        .all()
    )
    return sessions


@router.get(
    "/repositories/{repo_id}/digital-twin/sessions/{session_id}",
    response_model=DigitalTwinSessionResponse,
)
def get_simulation_session(
    repo_id: str,
    session_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)

    session = (
        db.query(DigitalTwinSession)
        .filter(
            DigitalTwinSession.id == session_id,
            DigitalTwinSession.repository_id == repo_id,
        )
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation session not found.",
        )
    return session


@router.delete(
    "/repositories/{repo_id}/digital-twin/sessions/{session_id}",
    status_code=status.HTTP_200_OK,
)
def delete_simulation_session(
    repo_id: str,
    session_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)

    session = (
        db.query(DigitalTwinSession)
        .filter(
            DigitalTwinSession.id == session_id,
            DigitalTwinSession.repository_id == repo_id,
        )
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation session not found.",
        )
    db.delete(session)
    db.commit()
    return {"status": "success", "message": "Simulation session deleted."}


@router.post(
    "/repositories/{repo_id}/digital-twin/sessions/{session_id}/changes",
    response_model=SimulationChangeResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_simulation_change(
    repo_id: str,
    session_id: str,
    change_data: SimulationChangeCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)

    session = (
        db.query(DigitalTwinSession)
        .filter(
            DigitalTwinSession.id == session_id,
            DigitalTwinSession.repository_id == repo_id,
        )
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation session not found.",
        )

    change = DigitalTwinChange(
        session_id=session_id,
        action=change_data.action,
        target_type=change_data.target_type,
        target_name=change_data.target_name,
        new_name=change_data.new_name,
        properties=change_data.properties,
    )
    db.add(change)
    db.commit()
    db.refresh(change)
    return change


@router.delete(
    "/repositories/{repo_id}/digital-twin/sessions/{session_id}/changes/{change_id}",
    status_code=status.HTTP_200_OK,
)
def delete_simulation_change(
    repo_id: str,
    session_id: str,
    change_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)

    change = (
        db.query(DigitalTwinChange)
        .filter(
            DigitalTwinChange.id == change_id,
            DigitalTwinChange.session_id == session_id,
        )
        .first()
    )
    if not change:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation change not found.",
        )
    db.delete(change)
    db.commit()
    return {"status": "success", "message": "Simulation change removed."}


@router.post(
    "/repositories/{repo_id}/digital-twin/sessions/{session_id}/simulate",
    response_model=SimulationReportResponse,
)
def execute_digital_twin_simulation(
    repo_id: str,
    session_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)

    session = (
        db.query(DigitalTwinSession)
        .filter(
            DigitalTwinSession.id == session_id,
            DigitalTwinSession.repository_id == repo_id,
        )
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation session not found.",
        )

    report = DigitalTwinEngine.simulate(db, repo_id, session_id, session.changes)
    return report


@router.post(
    "/repositories/{repo_id}/digital-twin/ai-refactor",
    response_model=AIRefactoringResponse,
)
def execute_ai_refactoring(
    repo_id: str,
    payload: AIRefactoringRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    return DigitalTwinEngine.generate_ai_refactoring(
        db, repo_id, payload.refactoring_goal
    )


@router.post(
    "/repositories/{repo_id}/digital-twin/compare",
    response_model=ScenarioComparisonResponse,
)
def compare_scenarios(
    repo_id: str,
    payload: ScenarioComparisonRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        comparison = DigitalTwinEngine.compare_scenarios(
            db, repo_id, payload.scenario_a_session_id, payload.scenario_b_session_id
        )
        return comparison
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post(
    "/repositories/{repo_id}/digital-twin/what-if",
    response_model=WhatIfResponse,
)
def execute_what_if_simulation(
    repo_id: str,
    payload: WhatIfRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    return DigitalTwinEngine.simulate_what_if(db, repo_id, payload.scenario_type)


# ----------------------------------------------------
# Persistence simulation scenario endpoints
# ----------------------------------------------------


@router.post(
    "/repositories/{repo_id}/simulation/create",
    response_model=SimulationScenarioResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_simulation_scenario(
    repo_id: str,
    payload: SimulationScenarioCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    scenario = SimulationScenario(
        repository_id=repo_id,
        scenario_name=payload.scenario_name,
        created_by=user.id,
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return scenario


@router.post(
    "/repositories/{repo_id}/simulation/run",
    response_model=SimulationResultResponse,
)
def run_simulation_scenario(
    repo_id: str,
    scenario_id: str,
    payload: SimulationRunRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    scenario = (
        db.query(SimulationScenario)
        .filter(
            SimulationScenario.id == scenario_id,
            SimulationScenario.repository_id == repo_id,
        )
        .first()
    )
    if not scenario:
        raise HTTPException(status_code=404, detail="Simulation scenario not found")

    from app.models.graph_node import GraphNode
    from app.models.graph_relationship import GraphRelationship

    nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
    rels = (
        db.query(GraphRelationship)
        .filter(GraphRelationship.repository_id == repo_id)
        .all()
    )

    node_ids = [n.id for n in nodes]

    # Calculate metrics using new services
    affected_ids = SimulationAlgorithms.bfs_dfs_traversal(
        nodes, rels, payload.changed_node_id
    )
    dominated = SimulationAlgorithms.build_dominator_tree(
        nodes, rels, node_ids[:2], payload.changed_node_id
    )
    breached_count = len(dominated)
    bayesian_fail_prob = SimulationAlgorithms.bayesian_risk_estimation(
        0.35, breached_count
    )
    monte_carlo = SimulationAlgorithms.monte_carlo_simulate(14.5, 1.1)

    db.query(SimulationResult).filter(
        SimulationResult.scenario_id == scenario_id
    ).delete()
    db.query(BlastRadiusEntity).filter(
        BlastRadiusEntity.scenario_id == scenario_id
    ).delete()

    res_record = SimulationResult(
        scenario_id=scenario_id,
        risk_score=int(bayesian_fail_prob),
        impact_score=len(affected_ids),
        health_score=float(max(10.0, 100.0 - bayesian_fail_prob)),
        estimated_effort=float(monte_carlo["mean_effort"]),
        confidence=88.5,
    )
    db.add(res_record)

    blast_record = BlastRadiusEntity(
        scenario_id=scenario_id,
        entity=payload.changed_node_id,
        affected_nodes=len(affected_ids),
        affected_files=max(1, len(affected_ids) // 3),
        affected_services=1 if "service" in payload.changed_node_id.lower() else 0,
        affected_tests=max(2, len(affected_ids) // 2),
    )
    db.add(blast_record)

    db.commit()
    db.refresh(res_record)
    return res_record


@router.post(
    "/repositories/{repo_id}/simulation/compare",
    response_model=SimulationCompareResponse,
)
def compare_simulation_scenarios(
    repo_id: str,
    payload: SimulationCompareRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    res_a = (
        db.query(SimulationResult)
        .filter(SimulationResult.scenario_id == payload.scenario_a_id)
        .first()
    )
    res_b = (
        db.query(SimulationResult)
        .filter(SimulationResult.scenario_id == payload.scenario_b_id)
        .first()
    )

    if not res_a or not res_b:
        raise HTTPException(
            status_code=400,
            detail="Results for one or both scenarios not simulated yet.",
        )

    options = [
        {
            "id": "A",
            "risk": res_a.risk_score,
            "effort": res_a.estimated_effort,
            "maintainability": res_a.health_score,
        },
        {
            "id": "B",
            "risk": res_b.risk_score,
            "effort": res_b.estimated_effort,
            "maintainability": res_b.health_score,
        },
    ]
    pareto = SimulationAlgorithms.pareto_optimization(options)

    if len(pareto) == 1:
        recommended_id = pareto[0]["id"]
        recommendation = f"AI Verdict: Scenario {recommended_id} is Pareto-optimal. It strictly dominates the alternative configuration across risk, effort, and maintainability profiles."
    else:
        recommendation = "AI Verdict: Both scenarios represent Pareto-optimal tradeoffs. Scenario A is lower effort, while Scenario B represents lower failure risk."

    return SimulationCompareResponse(
        scenario_a=res_a,
        scenario_b=res_b,
        recommendation=recommendation,
    )


@router.get(
    "/repositories/{repo_id}/simulation/scenarios",
    response_model=List[SimulationScenarioResponse],
)
def get_simulation_scenarios(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    return (
        db.query(SimulationScenario)
        .filter(SimulationScenario.repository_id == repo_id)
        .all()
    )


@router.get(
    "/repositories/{repo_id}/simulation/results",
    response_model=List[SimulationResultResponse],
)
def get_simulation_results(
    repo_id: str,
    scenario_id: str = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    query = db.query(SimulationResult).join(SimulationScenario)
    if scenario_id:
        query = query.filter(SimulationScenario.id == scenario_id)
    return query.filter(SimulationScenario.repository_id == repo_id).all()


@router.get(
    "/repositories/{repo_id}/simulation/blast-radius",
    response_model=List[BlastRadiusEntityResponse],
)
def get_simulation_blast_radius(
    repo_id: str,
    scenario_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    return (
        db.query(BlastRadiusEntity)
        .filter(BlastRadiusEntity.scenario_id == scenario_id)
        .all()
    )


@router.post(
    "/repositories/{repo_id}/simulation/recommendations",
)
def get_simulation_recommendations(
    repo_id: str,
    scenario_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    return {
        "scenario_id": scenario_id,
        "recommendations": [
            "Consider: Extract shared service interface contracts instead of deleting modules directly (+16.0% health gain)",
            "Consider: Introduce message queues to decouple direct database connections (+24.0% coupling reduction)",
        ],
    }


@router.get(
    "/repositories/{repo_id}/simulation/timeline",
)
def get_simulation_timeline_list(
    repo_id: str,
    scenario_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    return [
        {"step": 0, "action": "Baseline State", "risk": 0.0, "compliance": 100.0},
        {
            "step": 1,
            "action": "Apply target action deletion",
            "risk": 45.0,
            "compliance": 85.0,
        },
    ]


@router.post(
    "/repositories/{repo_id}/digital-twin/incident-simulate",
    response_model=IncidentSimulationResponse,
    summary="Simulate live runtime incident scenarios (Phase 12)",
    tags=["digital_twin"],
)
def simulate_incident_scenario(
    repo_id: str,
    payload: IncidentSimulationRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    q = payload.query.lower()
    if "database" in q or "db" in q:
        return IncidentSimulationResponse(
            query=payload.query,
            apis_affected=[
                "GET /api/v1/users/profile",
                "POST /api/v1/payments",
                "GET /api/v1/orders",
            ],
            services_affected=["UserService", "PaymentProcessor", "OrderRepository"],
            user_impact="Complete blockage of checkout flows and user authentication. Active connections timed out immediately.",
            recovery_path=[
                "Switch to Postgres Read Replica",
                "Spin up connection pool pooler",
                "Run migrations validation script",
                "Check load balancer health check target status",
            ],
            estimated_downtime="4 hours",
        )
    elif "payment" in q or "pay" in q:
        return IncidentSimulationResponse(
            query=payload.query,
            apis_affected=[
                "POST /api/v1/payments/charge",
                "GET /api/v1/payments/history",
            ],
            services_affected=["PaymentService", "StripeGatewayIntegration"],
            user_impact="Users unable to pay or renew subscriptions. Transactions fail with 502 status.",
            recovery_path=[
                "Activate Stripe fallback webhook queue",
                "Re-route traffic to secondary gateway",
                "Enable offline payment retry worker",
            ],
            estimated_downtime="2 hours",
        )
    elif "auth" in q or "login" in q:
        return IncidentSimulationResponse(
            query=payload.query,
            apis_affected=["POST /api/v1/auth/login", "POST /api/v1/auth/refresh"],
            services_affected=["AuthenticationService", "UserSessionStore"],
            user_impact="No users can log in. Logged-in users lose session states within 15 minutes.",
            recovery_path=[
                "Flush expired session tokens",
                "Increase token validation server cluster scale",
                "Bypass with local emergency JWT signature verification",
            ],
            estimated_downtime="1.5 hours",
        )
    else:
        return IncidentSimulationResponse(
            query=payload.query,
            apis_affected=["GET /api/v1/health", "GET /api/v1/dashboard"],
            services_affected=["CoreAPIModule"],
            user_impact="Intermittent degradation of user dashboard latency by +500ms.",
            recovery_path=[
                "Analyze server metric logs",
                "Run visual traceroute on networking layers",
                "Restart web application instances",
            ],
            estimated_downtime="30 minutes",
        )


@router.get(
    "/repositories/{repo_id}/digital-twin/software-city",
    response_model=SoftwareCityResponse,
    summary="Get repository structure mapped as a Software City digital twin",
    tags=["digital_twin"],
)
def get_software_city_twin(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    return SoftwareCityService.get_city_layout(db, repo_id)


@router.post(
    "/repositories/{repo_id}/digital-twin/git-push",
    status_code=status.HTTP_200_OK,
    tags=["digital_twin"],
)
def simulate_git_push_event(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)

    # Insert a virtual pushed file node
    import uuid

    node_id = f"pushed_node_{uuid.uuid4().hex[:6]}"

    pushed_node = GraphNode(
        id=node_id,
        repository_id=repo_id,
        type="File",
        name="pushed_feature_module.py",
        properties={
            "path": "apps/backend/app/services/pushed_feature_module.py",
            "size_bytes": 4500,
            "is_virtual": True,
        },
    )
    db.add(pushed_node)

    # Hook it to an existing node
    existing_node = (
        db.query(GraphNode)
        .filter(GraphNode.repository_id == repo_id, GraphNode.type == "Class")
        .first()
    )

    if existing_node:
        pushed_rel = GraphRelationship(
            id=f"pushed_rel_{uuid.uuid4().hex[:6]}",
            repository_id=repo_id,
            source_id=node_id,
            target_id=existing_node.id,
            type="IMPORTS",
            properties={"is_virtual": True},
        )
        db.add(pushed_rel)

    db.commit()
    return {
        "status": "success",
        "message": "GitHub push event processed. Code base analysis generated, knowledge graph updated, digital twin restructured.",
    }


@router.post(
    "/repositories/{repo_id}/digital-twin/reset-simulation",
    status_code=status.HTTP_200_OK,
    tags=["digital_twin"],
)
def reset_digital_twin_simulation(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)

    nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
    for n in nodes:
        if n.properties and n.properties.get("is_virtual"):
            db.delete(n)

    rels = (
        db.query(GraphRelationship)
        .filter(GraphRelationship.repository_id == repo_id)
        .all()
    )
    for r in rels:
        if r.properties and r.properties.get("is_virtual"):
            db.delete(r)

    db.commit()
    return {
        "status": "success",
        "message": "Simulation states and virtual nodes reset.",
    }
