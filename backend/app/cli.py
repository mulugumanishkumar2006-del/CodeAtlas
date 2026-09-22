import argparse
import asyncio
import sys
import json
from typing import Optional

from backend.app.db.session import get_session_factory
from backend.app.models.repository import Repository
from backend.app.services.pull_request_reviewer_service import pr_reviewer_service
from backend.app.services.ci_provider_service import get_ci_provider
from sqlalchemy import select


async def run_review(
    repository_identifier: str,
    base_commit: str,
    head_commit: str,
    provider_name: str = "local",
    output_format: str = "text",
    custom_diff_file: Optional[str] = None,
) -> int:
    """Runs a local PR review and prints results to stdout."""
    custom_diff = None
    if custom_diff_file:
        with open(custom_diff_file, "r", encoding="utf-8") as f:
            custom_diff = f.read()

    factory = get_session_factory()
    async with factory() as session:
        # Find repo by id or name
        stmt = select(Repository).where(
            (Repository.id == repository_identifier) | (Repository.name == repository_identifier)
        )
        res = await session.execute(stmt)
        repo = res.scalar_one_or_none()

        if not repo:
            print(f"Error: Repository '{repository_identifier}' not found in database.", file=sys.stderr)
            return 2

        print(f"Analyzing diff for '{repo.name}' ({base_commit[:8]}..{head_commit[:8]})...")
        try:
            review = await pr_reviewer_service.analyze_pull_request(
                db=session,
                repository_id=repo.id,
                base_commit_sha=base_commit,
                head_commit_sha=head_commit,
                title=f"CLI Review: {base_commit[:7]}..{head_commit[:7]}",
                provider=provider_name,
                custom_diff=custom_diff,
            )
        except Exception as exc:
            print(f"Error during review: {exc}", file=sys.stderr)
            return 2

        ci_prov = get_ci_provider(provider_name)
        review_dict = {
            "review_gate_status": review.review_gate_status,
            "base_commit_sha": review.base_commit_sha,
            "head_commit_sha": review.head_commit_sha,
            "summary": review.summary,
            "changed_files_count": review.changed_files_count,
            "changed_symbols_count": review.changed_symbols_count,
            "insertions": review.insertions,
            "deletions": review.deletions,
            "risk_score_before": review.risk_score_before,
            "risk_score_after": review.risk_score_after,
            "risk_delta": review.risk_delta,
            "debt_hours_delta": review.debt_hours_delta,
            "debt_cost_delta": review.debt_cost_delta,
            "breaking_changes_count": review.breaking_changes_count,
            "architecture_violations_count": review.architecture_violations_count,
            "security_findings_count": review.security_findings_count,
            "reliability_findings_count": review.reliability_findings_count,
            "test_gaps_count": review.test_gaps_count,
            "review_gates": review.review_gates_json or {},
            "breaking_changes": review.breaking_changes_json or {},
            "review_comments": review.review_comments_json or [],
            "validation_checklist": review.validation_checklist_json or [],
        }

        if output_format == "json":
            print(json.dumps(review_dict, indent=2))
        else:
            comment = ci_prov.format_review_comment(review_dict)
            print("\n" + "=" * 60)
            print(comment)
            print("=" * 60)

        # Return exit code based on review gate
        if review.review_gate_status == "BLOCKED":
            print("\n🛑 CI GATE BLOCKED: Review gates failed.", file=sys.stderr)
            return 1
        elif review.review_gate_status == "WARNING":
            print("\n⚠️ CI GATE WARNING: Warnings detected.", file=sys.stderr)
            return 0
        else:
            print("\n✅ CI GATE PASSED: All review checks satisfied.", file=sys.stderr)
            return 0


def main():
    parser = argparse.ArgumentParser(description="CodeAtlas CI/CD & Automated Pull Request Reviewer CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Review command
    review_parser = subparsers.add_parser("review", help="Analyze repository diff between base and head commits")
    review_parser.add_argument("--repository", "-r", required=True, help="Repository ID or unique name")
    review_parser.add_argument("--base", "-b", required=True, help="Base commit SHA or ref")
    review_parser.add_argument("--head", required=True, help="Head commit SHA or ref")
    review_parser.add_argument("--provider", default="local", choices=["github", "gitlab", "local"], help="CI Provider")
    review_parser.add_argument("--format", default="text", choices=["text", "json"], help="Output format")
    review_parser.add_argument("--diff-file", default=None, help="Path to unified diff file if offline/simulated")

    args = parser.parse_args()

    if args.command == "review":
        exit_code = asyncio.run(
            run_review(
                repository_identifier=args.repository,
                base_commit=args.base,
                head_commit=args.head,
                provider_name=args.provider,
                output_format=args.format,
                custom_diff_file=args.diff_file,
            )
        )
        sys.exit(exit_code)


if __name__ == "__main__":
    main()
