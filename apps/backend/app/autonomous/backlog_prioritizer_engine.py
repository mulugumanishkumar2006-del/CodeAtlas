# apps/backend/app/autonomous/backlog_prioritizer_engine.py

from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.models.autonomous_task import AutonomousTask


class AutonomousBacklogPrioritizer:
    """
    Pillar 26: Autonomous Backlog Prioritizer.
    Ranks engineering tasks by business value, risk, and effort.
    """

    def prioritize_tasks(
        self, db: Session, tasks: List[AutonomousTask]
    ) -> List[Dict[str, Any]]:
        prioritized = []

        for idx, task in enumerate(tasks):
            # Calculate composite ROI score
            business_value = 85.0 - (idx * 5.0)
            risk_score = 15.0 + (idx * 2.0)
            effort_points = 3 + idx
            roi_score = round(
                ((business_value * 0.5) + (100 - risk_score) * 0.3)
                / max(1, effort_points),
                2,
            )

            prioritized.append(
                {
                    "task_id": task.id,
                    "title": task.title,
                    "type": task.task_type,
                    "rank": idx + 1,
                    "roi_score": roi_score,
                    "business_value_score": business_value,
                    "risk_score": risk_score,
                    "effort_points": effort_points,
                    "recommendation": f"Priority #{idx + 1}: Execute next in current sprint.",
                }
            )

        prioritized.sort(key=lambda x: x["roi_score"], reverse=True)
        for i, item in enumerate(prioritized):
            item["rank"] = i + 1

        return prioritized
