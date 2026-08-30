import logging
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger("codeatlas.git_history")


class GitHistoryService:
    """
    Real Git History & Repository Evolution Intelligence Engine for CodeAtlas:
    - Extracts commits and numstat diffs deterministically from local .git repository
    - Computes file churn (additions + deletions), recent 30-day churn, and frequency
    - Computes author ownership, contributor concentration, and bus factor signals
    - Identifies inactive files, high-churn hotspots, and complexity + churn evolution risks
    - Classifies commit messages into deterministic categories (FEATURE, FIX, REFACTOR, etc.)
    - Handles shallow / empty repositories gracefully without synthetic data
    - Repository isolation and cache invalidation
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def invalidate_cache(self, repository_id: Optional[str] = None):
        """Invalidates history cache for a specific repository or all repositories."""
        if repository_id:
            self._cache.pop(repository_id, None)
            logger.info(f"Invalidated Git history cache for repository '{repository_id}'")
        else:
            self._cache.clear()
            logger.info("Invalidated all Git history cache")

    # =========================================================================
    # 1. COMMIT MESSAGE CLASSIFIER
    # =========================================================================

    def classify_commit_message(self, message: str) -> str:
        """
        Classifies a commit message into a deterministic category based on keywords & conventions.
        """
        if not message:
            return "UNKNOWN"
        msg_lower = message.strip().lower()

        # 1. Conventional Commits prefix check (e.g. "feat:", "fix(api):", "test:")
        m_conv = re.match(r"^([a-z]+)(?:\([^\)]+\))?!?:", msg_lower)
        if m_conv:
            prefix = m_conv.group(1)
            prefix_map = {
                "feat": "FEATURE",
                "feature": "FEATURE",
                "fix": "FIX",
                "bug": "FIX",
                "hotfix": "FIX",
                "refactor": "REFACTOR",
                "docs": "DOCS",
                "doc": "DOCS",
                "test": "TEST",
                "tests": "TEST",
                "build": "BUILD",
                "ci": "BUILD",
                "cd": "BUILD",
                "perf": "PERFORMANCE",
                "performance": "PERFORMANCE",
                "sec": "SECURITY",
                "security": "SECURITY",
                "chore": "CHORE",
                "style": "CHORE",
            }
            if prefix in prefix_map:
                return prefix_map[prefix]

        # 2. Specificity ordered regex patterns
        patterns = [
            (r"\b(security|vulnerability|cve|sanitize|encrypt)\b", "SECURITY"),
            (r"\b(performance|optimize|optimized|optimizing|cache|memory\s+leak)\b", "PERFORMANCE"),
            (r"\b(test|tests|tested|testing|spec|specs|coverage)\b", "TEST"),
            (r"\b(fix|bug|hotfix|patch|resolve|resolves|resolved|correct|corrected|regression)\b", "FIX"),
            (r"\b(docs|documentation|readme|changelog)\b", "DOCS"),
            (r"\b(refactor|refactored|restructure|restructured|rewrite|simplify|modularize)\b", "REFACTOR"),
            (r"\b(build|ci|cd|workflow|pipeline|docker|dockerfile|makefile)\b", "BUILD"),
            (r"\b(feat|feature|implement|implemented|support|new\s+|create|created)\b", "FEATURE"),
            (r"\b(chore|bump|version|release|upgrade|format|lint|prettier|eslint)\b", "CHORE"),
            (r"\b(add|added)\b", "FEATURE"),
        ]

        for pattern, category in patterns:
            if re.search(pattern, msg_lower):
                return category

        return "UNKNOWN"

    # =========================================================================
    # 2. RAW GIT LOG EXTRACTION
    # =========================================================================

    def extract_git_commits(self, clone_path: str, max_commits: int = 1000) -> Tuple[List[Dict[str, Any]], bool]:
        """
        Runs `git log` with custom delimiter format and numstat in the repository clone directory.
        Returns: (commits_list, is_shallow)
        """
        repo_dir = Path(clone_path)
        if not repo_dir.exists() or not (repo_dir / ".git").exists():
            logger.warning(f"No .git directory found at '{clone_path}'")
            return [], False

        # Check shallow clone
        is_shallow = False
        try:
            res_shallow = subprocess.run(
                ["git", "rev-parse", "--is-shallow-repository"],
                cwd=str(repo_dir),
                capture_output=True,
                text=True,
                check=False,
            )
            if res_shallow.returncode == 0 and "true" in res_shallow.stdout.lower():
                is_shallow = True
        except Exception:
            pass

        # Git log command
        # Format: COMMIT_START\n%H\n%an\n%ae\n%aI\n%P\n%s\nFILES_START
        sep = "---GIT_COMMIT_RECORD_SEP---"
        file_sep = "---GIT_FILES_START---"
        cmd = [
            "git", "log",
            f"-n{max_commits}",
            f"--pretty=format:{sep}%n%H%n%an%n%ae%n%aI%n%P%n%s%n{file_sep}",
            "--numstat",
        ]

        try:
            res = subprocess.run(
                cmd,
                cwd=str(repo_dir),
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                check=False,
            )
            if res.returncode != 0:
                logger.warning(f"git log returned code {res.returncode}: {res.stderr}")
                return [], is_shallow

            raw_output = res.stdout
            if not raw_output.strip():
                return [], is_shallow

            commits = []
            records = raw_output.split(sep)

            for rec in records:
                rec_str = rec.strip()
                if not rec_str:
                    continue

                if file_sep not in rec_str:
                    continue

                header_part, files_part = rec_str.split(file_sep, 1)
                header_lines = [l for l in header_part.splitlines() if l.strip() or l == ""]
                if len(header_lines) < 6:
                    continue

                sha = header_lines[0].strip()
                author_name = header_lines[1].strip()
                author_email = header_lines[2].strip()
                date_iso = header_lines[3].strip()
                parent_shas_str = header_lines[4].strip()
                subject = header_lines[5].strip()

                parent_shas = [p.strip() for p in parent_shas_str.split()] if parent_shas_str else []

                try:
                    dt = datetime.fromisoformat(date_iso)
                except Exception:
                    dt = datetime.now(timezone.utc)

                file_changes = []
                tot_add = 0
                tot_del = 0

                has_source = False
                has_test = False

                for f_line in files_part.strip().splitlines():
                    parts = f_line.strip().split("\t")
                    if len(parts) >= 3:
                        add_str, del_str, fpath = parts[0], parts[1], parts[2]
                        adds = int(add_str) if add_str.isdigit() else 0
                        dels = int(del_str) if del_str.isdigit() else 0
                        tot_add += adds
                        tot_del += dels

                        norm_path = fpath.replace("\\", "/")
                        # Check change type
                        ch_type = "Modified"
                        if adds > 0 and dels == 0:
                            ch_type = "Added"
                        elif dels > 0 and adds == 0:
                            ch_type = "Deleted"

                        file_changes.append({
                            "file_path": norm_path,
                            "change_type": ch_type,
                            "additions": adds,
                            "deletions": dels,
                            "net_lines": adds - dels,
                        })

                        p_lower = norm_path.lower()
                        if any(t_sig in p_lower for t_sig in ["test", "spec", "tests/"]):
                            has_test = True
                        else:
                            has_source = True

                category = self.classify_commit_message(subject)

                commits.append({
                    "commit_sha": sha,
                    "author_name": author_name,
                    "author_email": author_email,
                    "message": subject,
                    "committed_at": dt,
                    "parent_shas": parent_shas,
                    "category": category,
                    "is_source_and_test": has_source and has_test,
                    "files_changed_count": len(file_changes),
                    "total_additions": tot_add,
                    "total_deletions": tot_del,
                    "file_changes": file_changes,
                })

            return commits, is_shallow

        except Exception as e:
            logger.error(f"Error executing git log in '{clone_path}': {e}")
            return [], is_shallow

    # =========================================================================
    # 3. FULL EVOLUTION ANALYSIS PIPELINE
    # =========================================================================

    def analyze_repository_history(
        self,
        repository_id: str,
        clone_path: str,
        files: List[Dict[str, Any]],
        quality_metrics: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Computes complete Git history, file evolution metrics, author ownership,
        churn hotspots, complexity + churn risks, and contributor summaries.
        """
        if repository_id in self._cache:
            return self._cache[repository_id]

        commits, is_shallow = self.extract_git_commits(clone_path)

        file_id_map = {f.get("path"): f.get("id") for f in files}
        quality_complexity_map = {}
        if quality_metrics:
            for qm in quality_metrics:
                p = qm.get("file_path")
                if p:
                    quality_complexity_map[p] = qm.get("complexity", 1.0)

        if not commits:
            empty_res = {
                "repository_id": repository_id,
                "total_commits": 0,
                "total_contributors": 0,
                "is_shallow": is_shallow,
                "status_message": "Limited Git history available." if is_shallow else "Git history unavailable.",
                "first_commit_date": None,
                "last_commit_date": None,
                "total_churn": 0,
                "recent_churn_30d": 0,
                "weekly_velocity": 0.0,
                "category_counts": {},
                "top_churn_files": [],
                "top_hotspots": [],
                "top_contributors": [],
                "inactive_files_count": 0,
                "branches_count": 1,
                "tags_count": 0,
                "summary_text": "No historical Git commits detected in local clone.",
                "commits": [],
                "files_metrics": [],
            }
            self._cache[repository_id] = empty_res
            return empty_res

        now = datetime.now(timezone.utc)
        recent_threshold_30d = 30 * 86400  # seconds

        # 1. Aggregate File-Level Evolution
        file_stats: Dict[str, Dict[str, Any]] = defaultdict(lambda: {
            "total_commits": 0,
            "first_date": None,
            "last_date": None,
            "additions": 0,
            "deletions": 0,
            "recent_churn": 0,
            "authors": defaultdict(lambda: {"commits": 0, "additions": 0, "deletions": 0, "email": None}),
            "fix_commits_count": 0,
        })

        # 2. Aggregate Contributor-Level Stats
        contributor_stats: Dict[str, Dict[str, Any]] = defaultdict(lambda: {
            "total_commits": 0,
            "files_touched": set(),
            "additions": 0,
            "deletions": 0,
            "first_date": None,
            "last_date": None,
            "email": None,
        })

        category_counts: Dict[str, int] = defaultdict(int)

        for c in commits:
            c_date = c["committed_at"]
            c_author = c["author_name"] or "Unknown"
            c_email = c["author_email"]
            c_cat = c["category"]
            category_counts[c_cat] += 1

            # Update contributor stats
            cs = contributor_stats[c_author]
            cs["total_commits"] += 1
            cs["email"] = c_email or cs["email"]
            if cs["first_date"] is None or c_date < cs["first_date"]:
                cs["first_date"] = c_date
            if cs["last_date"] is None or c_date > cs["last_date"]:
                cs["last_date"] = c_date

            age_sec = (now - c_date).total_seconds() if c_date.tzinfo else (datetime.now() - c_date).total_seconds()
            is_recent_30d = age_sec <= recent_threshold_30d

            for fc in c["file_changes"]:
                f_path = fc["file_path"]
                cs["files_touched"].add(f_path)
                cs["additions"] += fc["additions"]
                cs["deletions"] += fc["deletions"]

                fs = file_stats[f_path]
                fs["total_commits"] += 1
                fs["additions"] += fc["additions"]
                fs["deletions"] += fc["deletions"]
                if is_recent_30d:
                    fs["recent_churn"] += (fc["additions"] + fc["deletions"])

                if fs["first_date"] is None or c_date < fs["first_date"]:
                    fs["first_date"] = c_date
                if fs["last_date"] is None or c_date > fs["last_date"]:
                    fs["last_date"] = c_date

                if c_cat == "FIX":
                    fs["fix_commits_count"] += 1

                # Author per file
                fa = fs["authors"][c_author]
                fa["commits"] += 1
                fa["additions"] += fc["additions"]
                fa["deletions"] += fc["deletions"]
                fa["email"] = c_email or fa["email"]

        # Build File Evolution Metrics
        files_metrics: List[Dict[str, Any]] = []
        inactive_files_count = 0
        primary_owned_counts: Dict[str, int] = defaultdict(int)

        for f_path, fs in file_stats.items():
            first_dt = fs["first_date"] or now
            last_dt = fs["last_date"] or now

            age_days = max(1, int(((now - first_dt).total_seconds() if first_dt.tzinfo else (datetime.now() - first_dt).total_seconds()) / 86400))
            inactivity_days = max(0, int(((now - last_dt).total_seconds() if last_dt.tzinfo else (datetime.now() - last_dt).total_seconds()) / 86400))

            if inactivity_days > 90:
                act_status = "INACTIVE"
                inactive_files_count += 1
            elif inactivity_days >= 30:
                act_status = "LOW_ACTIVITY"
            else:
                act_status = "ACTIVE"

            tot_churn = fs["additions"] + fs["deletions"]
            ch_freq = round(fs["total_commits"] / max(1.0, age_days / 30.0), 2)

            # Authors breakdown & ownership
            authors_list = []
            primary_auth = None
            primary_own_pct = 0.0

            for a_name, a_info in fs["authors"].items():
                own_pct = round((a_info["commits"] / max(1, fs["total_commits"])) * 100.0, 1)
                authors_list.append({
                    "author_name": a_name,
                    "author_email": a_info["email"],
                    "commits_count": a_info["commits"],
                    "additions": a_info["additions"],
                    "deletions": a_info["deletions"],
                    "ownership_percentage": own_pct,
                })
                if own_pct > primary_own_pct:
                    primary_own_pct = own_pct
                    primary_auth = a_name

            authors_list.sort(key=lambda x: -x["ownership_percentage"])
            if primary_auth:
                primary_owned_counts[primary_auth] += 1

            if primary_own_pct >= 75.0:
                know_conc = "HIGH"
            elif primary_own_pct >= 50.0:
                know_conc = "MEDIUM"
            else:
                know_conc = "BALANCED"

            comp_val = quality_complexity_map.get(f_path)
            is_high_risk = (comp_val is not None and comp_val >= 10.0 and tot_churn >= 100)

            files_metrics.append({
                "file_path": f_path,
                "file_id": file_id_map.get(f_path),
                "total_commits": fs["total_commits"],
                "first_commit_date": first_dt,
                "last_commit_date": last_dt,
                "age_days": age_days,
                "inactivity_days": inactivity_days,
                "activity_status": act_status,
                "total_additions": fs["additions"],
                "total_deletions": fs["deletions"],
                "total_churn": tot_churn,
                "recent_churn_30d": fs["recent_churn"],
                "change_frequency": ch_freq,
                "unique_authors_count": len(authors_list),
                "primary_author": primary_auth,
                "primary_author_ownership": primary_own_pct,
                "knowledge_concentration": know_conc,
                "authors": authors_list,
                "complexity": comp_val,
                "is_high_evolution_risk": is_high_risk,
                "_fix_count": fs["fix_commits_count"],
            })

        # 3. Evolution Hotspots Identification
        hotspots: List[Dict[str, Any]] = []
        for fm in files_metrics:
            f_path = fm["file_path"]
            tot_ch = fm["total_churn"]
            tot_com = fm["total_commits"]
            comp = fm["complexity"]
            fix_cnt = fm.get("_fix_count", 0)
            fix_ratio = fix_cnt / max(1, tot_com)

            signals = []
            h_type = "HIGH_CHURN"
            score = (tot_com * 3.0) + (tot_ch * 0.05) + (fm["recent_churn_30d"] * 0.1)

            if fm["is_high_evolution_risk"]:
                h_type = "COMPLEXITY_AND_CHURN"
                score += 30.0
                signals.append(f"High Complexity ({comp}) combined with high churn ({tot_ch} lines)")

            if fix_ratio >= 0.4 and fix_cnt >= 2:
                signals.append(f"Correction-heavy file: {fix_cnt}/{tot_com} commits were bug fixes")

            if fm["knowledge_concentration"] == "HIGH":
                signals.append(f"High knowledge concentration: {fm['primary_author']} ({fm['primary_author_ownership']}%)")

            if tot_com >= 3 or tot_ch >= 50 or signals:
                signals.insert(0, f"Modified in {tot_com} commit(s) with {tot_ch} total churn")
                hotspots.append({
                    "file_path": f_path,
                    "file_id": fm["file_id"],
                    "hotspot_type": h_type,
                    "score": round(score, 1),
                    "total_commits": tot_com,
                    "total_churn": tot_ch,
                    "recent_churn_30d": fm["recent_churn_30d"],
                    "complexity": comp,
                    "primary_author": fm["primary_author"],
                    "ownership_percentage": fm["primary_author_ownership"],
                    "signals": signals,
                    "explanation": f"File '{f_path}' is an active evolution hotspot with {tot_com} commits and {tot_ch} line churn.",
                })

        hotspots.sort(key=lambda x: -x["score"])

        # 4. Build Contributor Summaries
        contributors: List[Dict[str, Any]] = []
        for a_name, cs in contributor_stats.items():
            contributors.append({
                "author_name": a_name,
                "author_email": cs["email"],
                "total_commits": cs["total_commits"],
                "files_touched_count": len(cs["files_touched"]),
                "total_additions": cs["additions"],
                "total_deletions": cs["deletions"],
                "primary_owned_files_count": primary_owned_counts.get(a_name, 0),
                "first_commit_date": cs["first_date"],
                "last_commit_date": cs["last_date"],
            })
        contributors.sort(key=lambda x: -x["total_commits"])

        # Sort files by churn
        top_churn = sorted(files_metrics, key=lambda x: -x["total_churn"])[:10]

        # Velocity & Dates
        first_c_date = commits[-1]["committed_at"] if commits else None
        last_c_date = commits[0]["committed_at"] if commits else None

        tot_churn_repo = sum(fm["total_churn"] for fm in files_metrics)
        rec_churn_repo = sum(fm["recent_churn_30d"] for fm in files_metrics)

        span_days = max(1, int(((last_c_date - first_c_date).total_seconds()) / 86400)) if (first_c_date and last_c_date) else 1
        weekly_velocity = round((len(commits) / max(1.0, span_days / 7.0)), 2)

        summary_text = (
            f"Repository evolution: {len(commits)} commits across {len(contributors)} contributors. "
            f"Total churn: {tot_churn_repo} lines ({rec_churn_repo} lines in last 30d). "
            f"Weekly activity velocity: {weekly_velocity} commits/week. "
            f"Identified {len(hotspots)} evolution hotspots and {inactive_files_count} inactive files."
        )

        # Formatted commit list for API
        commit_items = []
        for c in commits:
            commit_items.append({
                "id": c["commit_sha"],
                "repository_id": repository_id,
                "commit_sha": c["commit_sha"],
                "author_name": c["author_name"],
                "author_email": c["author_email"],
                "message": c["message"],
                "committed_at": c["committed_at"],
                "parent_shas": c["parent_shas"],
                "category": c["category"],
                "is_source_and_test": c["is_source_and_test"],
                "files_changed_count": c["files_changed_count"],
                "total_additions": c["total_additions"],
                "total_deletions": c["total_deletions"],
                "file_changes": c["file_changes"],
            })

        result = {
            "repository_id": repository_id,
            "total_commits": len(commits),
            "total_contributors": len(contributors),
            "is_shallow": is_shallow,
            "status_message": "Limited Git history available." if is_shallow else "Git history analyzed.",
            "first_commit_date": first_c_date,
            "last_commit_date": last_c_date,
            "total_churn": tot_churn_repo,
            "recent_churn_30d": rec_churn_repo,
            "weekly_velocity": weekly_velocity,
            "category_counts": dict(category_counts),
            "top_churn_files": top_churn,
            "top_hotspots": hotspots[:10],
            "top_contributors": contributors[:10],
            "inactive_files_count": inactive_files_count,
            "branches_count": 1,
            "tags_count": 0,
            "summary_text": summary_text,
            "commits": commit_items,
            "files_metrics": files_metrics,
            "all_hotspots": hotspots,
            "all_contributors": contributors,
        }

        self._cache[repository_id] = result
        return result


git_history_service = GitHistoryService()
