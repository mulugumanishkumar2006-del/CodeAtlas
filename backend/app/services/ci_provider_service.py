import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import httpx

logger = logging.getLogger("codeatlas.ci_provider")


class CIProvider(ABC):
    """Abstract base class for CI/CD Providers (GitHub, GitLab, Local/CLI)."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name."""
        pass

    @abstractmethod
    def parse_webhook_payload(self, payload: Dict[str, Any], headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Extracts standardized PR review metadata from an incoming webhook event.
        Returns:
            {
                "pr_number": str,
                "title": str,
                "author": str,
                "base_commit_sha": str,
                "head_commit_sha": str,
                "source_branch": str,
                "target_branch": str,
                "action": str,
                "clone_url": Optional[str],
            }
        """
        pass

    @abstractmethod
    def format_review_comment(self, review: Dict[str, Any]) -> str:
        """Formats the review data into a rich provider-native Markdown comment."""
        pass

    @abstractmethod
    def format_check_run(self, review: Dict[str, Any]) -> Dict[str, Any]:
        """Formats commit status or check run payload."""
        pass

    async def post_review_comment(
        self,
        token: Optional[str],
        repo_slug: str,
        pr_number: str,
        comment_body: str,
    ) -> bool:
        """Posts comment to the provider platform if credentials exist."""
        return False

    async def set_commit_status(
        self,
        token: Optional[str],
        repo_slug: str,
        commit_sha: str,
        state: str,
        description: str,
        target_url: Optional[str] = None,
    ) -> bool:
        """Sets commit status on the provider platform if credentials exist."""
        return False


class GitHubProvider(CIProvider):
    """GitHub Actions & Pull Requests integration provider."""

    @property
    def name(self) -> str:
        return "github"

    def parse_webhook_payload(self, payload: Dict[str, Any], headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        # Handle 'pull_request' or 'check_run' or 'push'
        pr = payload.get("pull_request") or {}
        head = pr.get("head") or {}
        base = pr.get("base") or {}
        user = pr.get("user") or {}

        pr_num = str(pr.get("number") or payload.get("number") or "")
        title = pr.get("title") or payload.get("title") or "Pull Request"
        author = user.get("login") or payload.get("sender", {}).get("login") or "github-user"
        base_sha = base.get("sha") or payload.get("before") or ""
        head_sha = head.get("sha") or payload.get("after") or ""
        source_branch = head.get("ref") or ""
        target_branch = base.get("ref") or ""
        action = payload.get("action", "opened")

        clone_url = pr.get("head", {}).get("repo", {}).get("clone_url")

        return {
            "pr_number": pr_num,
            "title": title,
            "author": author,
            "base_commit_sha": base_sha,
            "head_commit_sha": head_sha,
            "source_branch": source_branch,
            "target_branch": target_branch,
            "action": action,
            "clone_url": clone_url,
        }

    def format_review_comment(self, review: Dict[str, Any]) -> str:
        gate_status = review.get("review_gate_status", "PASSED")
        status_badge = "✅ **PASSED**" if gate_status == "PASSED" else ("⚠️ **WARNING**" if gate_status == "WARNING" else "🛑 **BLOCKED**")

        summary = review.get("summary") or "Automated repository intelligence review completed."
        changed_files = review.get("changed_files_count", 0)
        changed_symbols = review.get("changed_symbols_count", 0)
        insertions = review.get("insertions", 0)
        deletions = review.get("deletions", 0)

        risk_delta = review.get("risk_delta", 0.0)
        risk_str = f"{'+' if risk_delta > 0 else ''}{risk_delta:.1f}"
        breaking_count = review.get("breaking_changes_count", 0)
        arch_violations = review.get("architecture_violations_count", 0)
        sec_findings = review.get("security_findings_count", 0)
        rel_findings = review.get("reliability_findings_count", 0)
        test_gaps = review.get("test_gaps_count", 0)

        lines = [
            f"## 🧭 CodeAtlas Pull Request Review: {status_badge}",
            "",
            f"> **Base**: `{review.get('base_commit_sha', '')[:8]}` → **Head**: `{review.get('head_commit_sha', '')[:8]}` | **Gate**: **{gate_status}**",
            "",
            f"### Executive Summary",
            summary,
            "",
            "| Metric | Value | Delta / State |",
            "| :--- | :--- | :--- |",
            f"| **Changed Files** | `{changed_files}` | `+{insertions} / -{deletions}` lines |",
            f"| **Changed AST Symbols** | `{changed_symbols}` | AST mapped |",
            f"| **Risk Delta** | `{review.get('risk_score_before', 0):.1f} → {review.get('risk_score_after', 0):.1f}` | `{risk_str}` |",
            f"| **Technical Debt** | `{review.get('debt_hours_delta', 0):.1f} hrs` | `${review.get('debt_cost_delta', 0):.0f}` |",
            f"| **Breaking Changes** | `{breaking_count}` | {'🛑 Action Required' if breaking_count > 0 else 'None detected'} |",
            f"| **Architecture Violations** | `{arch_violations}` | {'⚠️ Layer Boundary Drift' if arch_violations > 0 else 'Clean'} |",
            f"| **Security Findings** | `{sec_findings}` | {'⚠️ Review Required' if sec_findings > 0 else 'No issues detected'} |",
            f"| **Reliability Findings** | `{rel_findings}` | {'⚠️ Error handling review' if rel_findings > 0 else 'Clean'} |",
            f"| **Test Gaps** | `{test_gaps}` | {'⚠️ High-impact untested code' if test_gaps > 0 else 'Sufficient test presence'} |",
            "",
        ]

        # Review Gates Breakdown
        gates = review.get("review_gates", {})
        if gates:
            lines.append("### 🚦 Review Gates Evaluation")
            for gate_name, gate_info in gates.items():
                g_status = gate_info.get("status", "PASSED")
                g_icon = "✅" if g_status == "PASSED" else ("⚠️" if g_status == "WARNING" else "🛑")
                lines.append(f"- {g_icon} **{gate_name.replace('_', ' ').title()}**: {gate_info.get('message', '')}")
            lines.append("")

        # Breaking Changes Details
        breaking = review.get("breaking_changes", {})
        detected_breaking = breaking.get("detected", [])
        potential_breaking = breaking.get("potential", [])
        if detected_breaking or potential_breaking:
            lines.append("<details><summary>💥 <b>Breaking Changes Analysis (" + str(len(detected_breaking) + len(potential_breaking)) + ")</b></summary>")
            lines.append("")
            if detected_breaking:
                lines.append("#### Detected Breaking Changes")
                for db in detected_breaking:
                    lines.append(f"- 🛑 **{db.get('entity', 'Item')}** (`{db.get('category', 'API')}`): {db.get('reason', '')} *(Evidence: `{db.get('evidence', '')}`)*")
            if potential_breaking:
                lines.append("#### Potential Breaking Changes")
                for pb in potential_breaking:
                    lines.append(f"- ⚠️ **{pb.get('entity', 'Item')}** (`{pb.get('category', 'API')}`): {pb.get('reason', '')}")
            lines.append("</details>")
            lines.append("")

        # Inline Findings & Comments
        comments = review.get("review_comments", [])
        if comments:
            lines.append("<details open><summary>📝 <b>Evidence-Backed Findings (" + str(len(comments)) + ")</b></summary>")
            lines.append("")
            for c in comments:
                sev = c.get("severity", "MEDIUM")
                sev_icon = "🛑" if sev == "BLOCKING" else ("🔴" if sev == "HIGH" else ("🟡" if sev == "MEDIUM" else "ℹ️"))
                line_str = f":L{c.get('line')}" if c.get("line") else ""
                lines.append(f"#### {sev_icon} [{sev}] `{c.get('file_path', '')}{line_str}`")
                lines.append(f"**Finding**: {c.get('finding', '')}")
                lines.append(f"- **Evidence**: {c.get('evidence', '')}")
                lines.append(f"- **Potential Impact**: {c.get('potential_impact', '')}")
                lines.append(f"- **Suggested Action**: {c.get('suggested_action', '')}")
                lines.append("")
            lines.append("</details>")
            lines.append("")

        # Validation Checklist
        checklist = review.get("validation_checklist", [])
        if checklist:
            lines.append("<details><summary>📋 <b>Recommended Pre-Merge Validation Checklist</b></summary>")
            lines.append("")
            for item in checklist:
                lines.append(f"- [ ] {item.get('task', item) if isinstance(item, dict) else item}")
            lines.append("</details>")
            lines.append("")

        lines.append("---")
        lines.append("*Generated by [CodeAtlas](https://github.com/codeatlas) Repository Intelligence Engine.*")

        return "\n".join(lines)

    def format_check_run(self, review: Dict[str, Any]) -> Dict[str, Any]:
        gate_status = review.get("review_gate_status", "PASSED")
        conclusion = "success" if gate_status == "PASSED" else ("neutral" if gate_status == "WARNING" else "failure")
        title = f"CodeAtlas Review: {gate_status}"
        summary = review.get("summary") or "Automated repository intelligence review completed."

        annotations = []
        for c in review.get("review_comments", [])[:50]:  # GitHub limits annotations to 50
            if c.get("line"):
                annotations.append({
                    "path": c.get("file_path"),
                    "start_line": c.get("line"),
                    "end_line": c.get("end_line") or c.get("line"),
                    "annotation_level": "failure" if c.get("severity") in ("BLOCKING", "HIGH") else "warning",
                    "message": c.get("finding"),
                    "title": f"CodeAtlas: {c.get('category')}",
                    "raw_details": f"Evidence: {c.get('evidence')}\nImpact: {c.get('potential_impact')}\nSuggested: {c.get('suggested_action')}",
                })

        return {
            "name": "CodeAtlas Intelligence Review",
            "head_sha": review.get("head_commit_sha"),
            "status": "completed",
            "conclusion": conclusion,
            "output": {
                "title": title,
                "summary": summary,
                "text": self.format_review_comment(review),
                "annotations": annotations,
            }
        }

    async def post_review_comment(
        self,
        token: Optional[str],
        repo_slug: str,
        pr_number: str,
        comment_body: str,
    ) -> bool:
        if not token or not repo_slug or not pr_number:
            return False
        url = f"https://api.github.com/repos/{repo_slug}/issues/{pr_number}/comments"
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "CodeAtlas-Reviewer",
        }
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, headers=headers, json={"body": comment_body})
                return res.status_code in (200, 201)
        except Exception as exc:
            logger.error(f"Failed to post GitHub PR comment: {exc}")
            return False

    async def set_commit_status(
        self,
        token: Optional[str],
        repo_slug: str,
        commit_sha: str,
        state: str,
        description: str,
        target_url: Optional[str] = None,
    ) -> bool:
        if not token or not repo_slug or not commit_sha:
            return False
        url = f"https://api.github.com/repos/{repo_slug}/statuses/{commit_sha}"
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "CodeAtlas-Reviewer",
        }
        gh_state = "success" if state == "PASSED" else ("failure" if state in ("FAILED", "BLOCKED") else "pending")
        payload = {
            "state": gh_state,
            "description": description[:140],
            "context": "codeatlas/review-gates",
            "target_url": target_url or "",
        }
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                return res.status_code in (200, 201)
        except Exception as exc:
            logger.error(f"Failed to set GitHub commit status: {exc}")
            return False


class GitLabProvider(CIProvider):
    """GitLab CI & Merge Requests integration provider."""

    @property
    def name(self) -> str:
        return "gitlab"

    def parse_webhook_payload(self, payload: Dict[str, Any], headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        mr = payload.get("object_attributes") or {}
        last_commit = mr.get("last_commit") or {}

        pr_num = str(mr.get("iid") or mr.get("id") or "")
        title = mr.get("title") or "Merge Request"
        author = payload.get("user", {}).get("username") or mr.get("author_id", "gitlab-user")
        head_sha = mr.get("last_commit", {}).get("id") or payload.get("after") or ""
        base_sha = mr.get("diff_head_sha") or mr.get("target_branch_sha") or payload.get("before") or ""
        source_branch = mr.get("source_branch") or ""
        target_branch = mr.get("target_branch") or ""
        action = mr.get("action", "open")

        return {
            "pr_number": pr_num,
            "title": title,
            "author": str(author),
            "base_commit_sha": base_sha,
            "head_commit_sha": head_sha,
            "source_branch": source_branch,
            "target_branch": target_branch,
            "action": action,
            "clone_url": payload.get("project", {}).get("git_http_url"),
        }

    def format_review_comment(self, review: Dict[str, Any]) -> str:
        # Same rich Markdown structure compatible with GitLab Flavored Markdown
        gh = GitHubProvider()
        return gh.format_review_comment(review)

    def format_check_run(self, review: Dict[str, Any]) -> Dict[str, Any]:
        gate_status = review.get("review_gate_status", "PASSED")
        state = "success" if gate_status == "PASSED" else ("failed" if gate_status in ("FAILED", "BLOCKED") else "running")
        return {
            "name": "CodeAtlas Review",
            "state": state,
            "description": f"Gate status: {gate_status} (Risk: {review.get('risk_delta', 0.0):+.1f})",
        }

    async def post_review_comment(
        self,
        token: Optional[str],
        repo_slug: str,
        pr_number: str,
        comment_body: str,
    ) -> bool:
        if not token or not repo_slug or not pr_number:
            return False
        # GitLab projects API uses URL encoded project path
        encoded_slug = repo_slug.replace("/", "%2F")
        url = f"https://gitlab.com/api/v4/projects/{encoded_slug}/merge_requests/{pr_number}/notes"
        headers = {"PRIVATE-TOKEN": token}
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, headers=headers, json={"body": comment_body})
                return res.status_code in (200, 201)
        except Exception as exc:
            logger.error(f"Failed to post GitLab MR note: {exc}")
            return False

    async def set_commit_status(
        self,
        token: Optional[str],
        repo_slug: str,
        commit_sha: str,
        state: str,
        description: str,
        target_url: Optional[str] = None,
    ) -> bool:
        if not token or not repo_slug or not commit_sha:
            return False
        encoded_slug = repo_slug.replace("/", "%2F")
        url = f"https://gitlab.com/api/v4/projects/{encoded_slug}/statuses/{commit_sha}"
        headers = {"PRIVATE-TOKEN": token}
        gl_state = "success" if state == "PASSED" else ("failed" if state in ("FAILED", "BLOCKED") else "pending")
        payload = {
            "state": gl_state,
            "description": description[:140],
            "name": "codeatlas/review-gates",
            "target_url": target_url or "",
        }
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                return res.status_code in (200, 201)
        except Exception as exc:
            logger.error(f"Failed to set GitLab commit status: {exc}")
            return False


class LocalProvider(CIProvider):
    """Local / Manual CLI driver provider."""

    @property
    def name(self) -> str:
        return "local"

    def parse_webhook_payload(self, payload: Dict[str, Any], headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        return {
            "pr_number": str(payload.get("pr_number", "LOCAL")),
            "title": payload.get("title", "Local Diff Review"),
            "author": payload.get("author", "Local Developer"),
            "base_commit_sha": payload.get("base_commit_sha", ""),
            "head_commit_sha": payload.get("head_commit_sha", ""),
            "source_branch": payload.get("source_branch", "head"),
            "target_branch": payload.get("target_branch", "base"),
            "action": "review",
            "clone_url": None,
        }

    def format_review_comment(self, review: Dict[str, Any]) -> str:
        gh = GitHubProvider()
        return gh.format_review_comment(review)

    def format_check_run(self, review: Dict[str, Any]) -> Dict[str, Any]:
        gh = GitHubProvider()
        return gh.format_check_run(review)


def get_ci_provider(provider_name: str) -> CIProvider:
    """Factory returning the requested CIProvider implementation."""
    p_lower = (provider_name or "").lower().strip()
    if p_lower == "github":
        return GitHubProvider()
    elif p_lower == "gitlab":
        return GitLabProvider()
    return LocalProvider()
