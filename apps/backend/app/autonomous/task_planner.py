# apps/backend/app/autonomous/task_planner.py

import uuid
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.models.autonomous_task import AutonomousTask
from app.models.repository_statistics import RepositoryStatistics


class AutonomousTaskPlanner:
    """
    Decomposes AI Engineering Council recommendations and developer requests
    into discrete, prioritized engineering tasks.
    """

    TASK_TYPES = ["refactor", "test", "docs", "dependency"]

    def plan_from_council(
        self,
        db: Session,
        repo_id: str,
        council_result: Dict[str, Any],
        pipeline_run_id: str,
    ) -> List[AutonomousTask]:
        """
        Takes a council deliberation result and generates a prioritized task queue.
        Each recommendation becomes one or more concrete engineering tasks.
        """
        tasks: List[AutonomousTask] = []
        recommendations = council_result.get("explainable_recommendations", [])

        for idx, rec in enumerate(recommendations):
            rec_title = rec.get("title", "Engineering Improvement")
            rec_id = rec.get("id", f"rec-{idx + 1}")
            confidence = rec.get("confidence_score", 85.0)

            # Generate a refactor task for each recommendation
            tasks.append(
                self._create_task(
                    db=db,
                    repo_id=repo_id,
                    pipeline_run_id=pipeline_run_id,
                    task_type="refactor",
                    title=f"Refactor: {rec_title}",
                    description=(
                        f"Implement the architectural changes recommended by the "
                        f"Engineering Council: {rec.get('why', 'Improve codebase quality')}. "
                        f"Trade-offs: {', '.join(rec.get('trade_offs', []))}."
                    ),
                    priority=1 if idx == 0 else 2,
                    estimated_effort="4 hours" if idx == 0 else "2 hours",
                    council_recommendation_id=rec_id,
                    confidence_score=confidence,
                )
            )

            # Generate a test task for coverage
            tasks.append(
                self._create_task(
                    db=db,
                    repo_id=repo_id,
                    pipeline_run_id=pipeline_run_id,
                    task_type="test",
                    title=f"Test Coverage: {rec_title}",
                    description=(
                        f"Write comprehensive unit and integration tests for: {rec_title}. "
                        f"Cover edge cases, error handling, and regression scenarios."
                    ),
                    priority=2,
                    estimated_effort="2 hours",
                    council_recommendation_id=rec_id,
                    confidence_score=confidence,
                )
            )

            # Generate a docs task
            tasks.append(
                self._create_task(
                    db=db,
                    repo_id=repo_id,
                    pipeline_run_id=pipeline_run_id,
                    task_type="docs",
                    title=f"Documentation: {rec_title}",
                    description=(
                        f"Update API docs, README, and inline docstrings for: {rec_title}. "
                        f"Include architecture decision records and migration guides."
                    ),
                    priority=3,
                    estimated_effort="1 hour",
                    council_recommendation_id=rec_id,
                    confidence_score=confidence,
                )
            )

        # Add a dependency audit task for the entire pipeline
        tasks.append(
            self._create_task(
                db=db,
                repo_id=repo_id,
                pipeline_run_id=pipeline_run_id,
                task_type="dependency",
                title="Dependency Security & Compatibility Audit",
                description=(
                    "Scan all project dependencies for outdated versions, known CVEs, "
                    "and breaking change risks. Generate upgrade plan with migration steps."
                ),
                priority=2,
                estimated_effort="1 hour",
                council_recommendation_id=None,
                confidence_score=92.0,
            )
        )

        return tasks

    def plan_from_request(
        self,
        db: Session,
        repo_id: str,
        request_text: str,
        pipeline_run_id: str,
    ) -> List[AutonomousTask]:
        """
        Takes a free-text engineering request and creates structured tasks.
        Uses keyword analysis to determine which engines to activate.
        """
        tasks: List[AutonomousTask] = []
        r_lower = request_text.lower()

        stats = (
            db.query(RepositoryStatistics)
            .filter(RepositoryStatistics.repository_id == repo_id)
            .first()
        )
        total_files = stats.total_files if stats else 25
        avg_complexity = stats.average_complexity if stats else 5.2

        # Determine which task types are needed based on request keywords
        needs_refactor = any(
            kw in r_lower
            for kw in [
                "refactor",
                "clean",
                "smell",
                "complexity",
                "extract",
                "rename",
                "debt",
                "modernize",
                "improve",
                "optimize",
            ]
        )
        needs_test = any(
            kw in r_lower
            for kw in ["test", "coverage", "edge case", "regression", "qa", "quality"]
        )
        needs_docs = any(
            kw in r_lower
            for kw in [
                "doc",
                "readme",
                "comment",
                "documentation",
                "api doc",
                "diagram",
            ]
        )
        needs_dependency = any(
            kw in r_lower
            for kw in [
                "dependency",
                "update",
                "upgrade",
                "security",
                "cve",
                "outdated",
                "version",
            ]
        )

        # If no specific keywords found, generate all task types
        if not any([needs_refactor, needs_test, needs_docs, needs_dependency]):
            needs_refactor = needs_test = needs_docs = needs_dependency = True

        if needs_refactor:
            tasks.append(
                self._create_task(
                    db=db,
                    repo_id=repo_id,
                    pipeline_run_id=pipeline_run_id,
                    task_type="refactor",
                    title="Refactor: Remove Duplicate Code & Split God Classes",
                    description=(
                        f"Analyze {total_files} files (avg complexity: {avg_complexity}). "
                        f"Target monolithic classes, extract helper modules, and eliminate duplicated logic. "
                        f"Goal: {request_text}"
                    ),
                    priority=1,
                    estimated_effort="4 hours",
                    confidence_score=88.0,
                )
            )
            tasks.append(
                self._create_task(
                    db=db,
                    repo_id=repo_id,
                    pipeline_run_id=pipeline_run_id,
                    task_type="refactor",
                    title="Refactor: Improve Naming & Clean Dead Code",
                    description=(
                        "Rename ambiguous variables and functions for clarity. "
                        "Prune unused imports, unreachable dead code branches, and obsolete exports."
                    ),
                    priority=2,
                    estimated_effort="2 hours",
                    confidence_score=92.0,
                )
            )

        if needs_test:
            tasks.append(
                self._create_task(
                    db=db,
                    repo_id=repo_id,
                    pipeline_run_id=pipeline_run_id,
                    task_type="test",
                    title=f"Test Generation: {request_text[:80]}",
                    description=(
                        "Generate missing unit tests, integration tests, and edge case "
                        "coverage for the requested changes. Target: 90%+ coverage."
                    ),
                    priority=2,
                    estimated_effort="3 hours",
                    confidence_score=90.0,
                )
            )

        if needs_docs:
            tasks.append(
                self._create_task(
                    db=db,
                    repo_id=repo_id,
                    pipeline_run_id=pipeline_run_id,
                    task_type="docs",
                    title=f"Documentation Update: {request_text[:80]}",
                    description=(
                        "Update documentation to reflect changes. "
                        "Include API docs, architecture diagrams, and migration guides."
                    ),
                    priority=3,
                    estimated_effort="1 hour",
                    confidence_score=95.0,
                )
            )

        if needs_dependency:
            tasks.append(
                self._create_task(
                    db=db,
                    repo_id=repo_id,
                    pipeline_run_id=pipeline_run_id,
                    task_type="dependency",
                    title="Dependency Audit & Upgrade Plan",
                    description=(
                        "Scan dependencies for CVEs, outdated versions, and compatibility issues. "
                        "Generate safe upgrade path with migration steps."
                    ),
                    priority=2,
                    estimated_effort="1 hour",
                    confidence_score=92.0,
                )
            )

        return tasks

    def _create_task(
        self,
        db: Session,
        repo_id: str,
        pipeline_run_id: str,
        task_type: str,
        title: str,
        description: str,
        priority: int = 2,
        estimated_effort: str = "2 hours",
        council_recommendation_id: str = None,
        confidence_score: float = 85.0,
    ) -> AutonomousTask:
        task = AutonomousTask(
            id=str(uuid.uuid4()),
            repository_id=repo_id,
            pipeline_run_id=pipeline_run_id,
            task_type=task_type,
            title=title,
            description=description,
            priority=priority,
            status="pending",
            estimated_effort=estimated_effort,
            council_recommendation_id=council_recommendation_id,
            confidence_score=confidence_score,
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return task
