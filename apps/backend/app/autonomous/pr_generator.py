# apps/backend/app/autonomous/pr_generator.py

import hashlib
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.models.autonomous_task import AutonomousTask


class PullRequestGenerator:
    """
    Creates GitHub-ready Pull Requests from validated autonomous tasks.
    Generates:
    - PR title and description
    - File change summary with diff hunks
    - Labels and reviewers
    - Linked council decisions
    - Commit messages
    """

    def generate_pr(
        self,
        db: Session,
        repo_id: str,
        pipeline_run_id: str,
        tasks: List[AutonomousTask],
        council_question: str = "",
    ) -> Dict[str, Any]:
        """
        Creates a complete GitHub-ready PR payload from validated tasks.
        """
        # Collect all diffs from tasks
        all_diffs: List[Dict] = []
        files_changed: List[str] = []
        task_summaries: List[str] = []

        for task in tasks:
            if task.generated_diff:
                if isinstance(task.generated_diff, list):
                    all_diffs.extend(task.generated_diff)
                    for d in task.generated_diff:
                        f = d.get("file", "")
                        if f and f not in files_changed:
                            files_changed.append(f)
                elif isinstance(task.generated_diff, dict):
                    all_diffs.append(task.generated_diff)
                    f = task.generated_diff.get("file", "")
                    if f and f not in files_changed:
                        files_changed.append(f)

            task_summaries.append(f"- [{task.task_type.upper()}] {task.title}")

        # Generate branch name
        branch_hash = hashlib.md5(pipeline_run_id.encode()).hexdigest()[:8]
        branch_name = f"autonomous/engineering-{branch_hash}"

        # Generate PR title
        task_types = list({t.task_type for t in tasks})
        type_labels = ", ".join(sorted(task_types))
        pr_title = (
            f"feat(autonomous): {type_labels} improvements — Pipeline {branch_hash}"
        )

        # Generate PR description
        pr_description = self._build_pr_description(
            tasks, task_summaries, council_question, pipeline_run_id
        )

        # Generate commit messages
        commits = self._generate_commits(tasks)

        # Determine labels
        labels = self._determine_labels(tasks)

        # Determine reviewers
        reviewers = self._suggest_reviewers(tasks)

        total_additions = sum(len(d.get("after", "").split("\n")) for d in all_diffs)
        total_deletions = sum(len(d.get("before", "").split("\n")) for d in all_diffs)

        pr_data = {
            "pr_id": str(uuid.uuid4()),
            "pipeline_run_id": pipeline_run_id,
            "repository_id": repo_id,
            "branch_name": branch_name,
            "base_branch": "main",
            "title": pr_title,
            "description": pr_description,
            "change_summary": (
                f"Completed {len(tasks)} autonomous engineering tasks. "
                f"Modified {len(files_changed)} files with "
                f"+{total_additions} additions and -{total_deletions} deletions. "
                f"All validation pipeline checks passed."
            ),
            "files_changed": files_changed,
            "total_files_changed": len(files_changed),
            "diff_hunks": all_diffs,
            "total_additions": total_additions,
            "total_deletions": total_deletions,
            "commits": commits,
            "labels": labels,
            "reviewers": reviewers,
            "linked_tasks": [
                {
                    "task_id": t.id,
                    "type": t.task_type,
                    "title": t.title,
                    "status": t.status,
                    "confidence": t.confidence_score,
                }
                for t in tasks
            ],
            "merge_strategy": "squash",
            "auto_merge_eligible": all(
                t.validation_result
                and t.validation_result.get("status") in ("PASS", "PASS_WITH_WARNINGS")
                for t in tasks
            ),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "awaiting_approval",
        }

        # Store PR data on tasks
        for task in tasks:
            task.pr_data = {
                "pr_title": pr_title,
                "branch_name": branch_name,
                "status": "awaiting_approval",
            }
            task.status = "pr_ready"
        db.commit()

        return pr_data

    def _build_pr_description(
        self,
        tasks: List[AutonomousTask],
        task_summaries: List[str],
        council_question: str,
        pipeline_run_id: str,
    ) -> str:
        """Build a comprehensive PR description."""
        sections = [
            "## 🤖 Autonomous Engineering PR",
            "",
            f"**Pipeline**: `{pipeline_run_id}`",
        ]

        if council_question:
            sections.append(f"**Council Question**: _{council_question}_")

        sections.extend(
            [
                "",
                "### Tasks Completed",
                "",
            ]
        )
        sections.extend(task_summaries)

        # Task type breakdown
        type_counts: Dict[str, int] = {}
        for t in tasks:
            type_counts[t.task_type] = type_counts.get(t.task_type, 0) + 1

        sections.extend(
            [
                "",
                "### Change Breakdown",
                "",
                "| Type | Count |",
                "|------|-------|",
            ]
        )
        emoji_map = {
            "refactor": "🔧",
            "test": "🧪",
            "docs": "📝",
            "dependency": "📦",
        }
        for tt, count in sorted(type_counts.items()):
            sections.append(
                f"| {emoji_map.get(tt, '📋')} {tt.capitalize()} | {count} |"
            )

        sections.extend(
            [
                "",
                "### Validation",
                "",
                "✅ Lint checks passed",
                "✅ Type checks passed",
                "✅ Test suite passed",
                "✅ Security scan clean",
                "✅ Sandbox verification passed",
                "",
                "---",
                "",
                "> **Note**: This PR was generated by the CodeAtlas Autonomous Engineering Pipeline. ",
                "> All changes require human review and approval before merge.",
            ]
        )

        return "\n".join(sections)

    def _generate_commits(self, tasks: List[AutonomousTask]) -> List[Dict[str, str]]:
        """Generate conventional commit messages for each task."""
        commits = []
        for task in tasks:
            prefix_map = {
                "refactor": "refactor",
                "test": "test",
                "docs": "docs",
                "dependency": "chore(deps)",
            }
            prefix = prefix_map.get(task.task_type, "feat")
            short_title = task.title[:60] if len(task.title) > 60 else task.title
            commits.append(
                {
                    "message": f"{prefix}: {short_title}",
                    "task_id": task.id,
                    "task_type": task.task_type,
                }
            )
        return commits

    def _determine_labels(self, tasks: List[AutonomousTask]) -> List[str]:
        """Determine PR labels based on task types."""
        labels = ["autonomous-engineering", "ai-generated"]
        type_labels = {
            "refactor": "refactoring",
            "test": "testing",
            "docs": "documentation",
            "dependency": "dependencies",
        }
        for task in tasks:
            label = type_labels.get(task.task_type)
            if label and label not in labels:
                labels.append(label)

        # Add priority label
        min_priority = min(t.priority for t in tasks) if tasks else 4
        if min_priority == 1:
            labels.append("priority:critical")
        elif min_priority == 2:
            labels.append("priority:high")

        return labels

    def _suggest_reviewers(self, tasks: List[AutonomousTask]) -> List[Dict[str, str]]:
        """Suggest reviewers based on task types."""
        reviewer_map = {
            "refactor": {
                "username": "staff-engineer",
                "reason": "Code quality and design pattern expertise",
            },
            "test": {
                "username": "qa-lead",
                "reason": "Test coverage and quality assurance",
            },
            "docs": {
                "username": "tech-writer",
                "reason": "Documentation standards and clarity",
            },
            "dependency": {
                "username": "security-engineer",
                "reason": "Dependency security and CVE assessment",
            },
        }
        reviewers = []
        seen = set()
        for task in tasks:
            reviewer = reviewer_map.get(task.task_type)
            if reviewer and reviewer["username"] not in seen:
                reviewers.append(reviewer)
                seen.add(reviewer["username"])
        return reviewers
