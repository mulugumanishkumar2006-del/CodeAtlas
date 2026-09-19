import logging
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple, Set

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.analysis import Analysis
from backend.app.models.file import File
from backend.app.models.commit import Commit
from backend.app.services.ast_parser_service import ASTParserService
from backend.app.services.architecture_intelligence_service import architecture_intelligence_service

logger = logging.getLogger("codeatlas.time_machine")


class TimeMachineService:
    """
    Phase 20 — Code Time Machine Service
    Provides real Git historical intelligence:
    - Historical repository snapshots & timeline
    - File evolution, churn, author contributions, and rename detection
    - Commit details with unified diff parsing, AST symbol diff, and architecture changes
    - Two-commit comparison with file, symbol, dependency, API, and architectural deltas
    - Symbol-level diff mapping with uncertainty detection
    """

    EXT_TO_LANGUAGE = {
        ".py": "Python",
        ".js": "JavaScript",
        ".jsx": "JavaScript",
        ".ts": "TypeScript",
        ".tsx": "TypeScript",
        ".java": "Java",
        ".go": "Go",
        ".rs": "Rust",
        ".cpp": "C++",
        ".cc": "C++",
        ".cxx": "C++",
        ".c": "C",
        ".h": "C",
        ".hpp": "C++",
    }

    def __init__(self):
        self._ast_parser = ASTParserService()

    def _get_language_from_path(self, path_str: str) -> Optional[str]:
        ext = Path(path_str).suffix.lower()
        return self.EXT_TO_LANGUAGE.get(ext)

    def _run_git_cmd(self, clone_path: str, args: List[str]) -> Tuple[int, str, str]:
        """Runs a git command safely in the repository clone path."""
        repo_dir = Path(clone_path)
        if not repo_dir.exists() or not (repo_dir / ".git").exists():
            return -1, "", f"Directory '{clone_path}' is not a git repository."

        try:
            res = subprocess.run(
                ["git"] + args,
                cwd=str(repo_dir),
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                check=False,
            )
            return res.returncode, res.stdout, res.stderr
        except Exception as exc:
            return -1, "", str(exc)

    # =========================================================================
    # 1. HISTORICAL SNAPSHOTS
    # =========================================================================

    async def get_historical_snapshots(
        self, db: AsyncSession, repository_id: str
    ) -> Dict[str, Any]:
        """
        Retrieves historical snapshots for the repository.
        Combines persisted Analysis states and actual Git commit points.
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        stmt = (
            select(Analysis)
            .where(Analysis.repository_id == repository_id)
            .order_by(Analysis.created_at.desc())
        )
        result = await db.execute(stmt)
        analyses = result.scalars().all()

        snapshots = []
        seen_commits: Set[str] = set()

        for a in analyses:
            c_hash = a.commit_sha or "HEAD"
            if c_hash != "HEAD":
                seen_commits.add(c_hash)

            ts_str = None
            if a.completed_at:
                ts_str = a.completed_at.isoformat()
            elif a.started_at:
                ts_str = a.started_at.isoformat()
            elif a.created_at:
                ts_str = a.created_at.isoformat()

            meta = a.metadata_json or {}
            summary = {
                "file_count": meta.get("file_count", 0),
                "symbol_count": meta.get("symbol_count", 0),
                "component_count": meta.get("component_count", 0),
                "status": a.status,
            }

            snapshots.append({
                "snapshot_id": a.id,
                "repository_id": repository_id,
                "commit_hash": c_hash,
                "commit_timestamp": ts_str,
                "branch": a.branch or repo.default_branch or "main",
                "analysis_version": f"1.{a.version}.0",
                "status": a.status.upper() if a.status else "COMPLETED",
                "created_at": a.created_at.isoformat() if a.created_at else datetime.now(timezone.utc).isoformat(),
                "summary": summary,
            })

        # If we have git repository access, complement with historical commits
        if repo.clone_path and Path(repo.clone_path).exists():
            code, out, _ = self._run_git_cmd(
                repo.clone_path,
                ["log", "-n25", "--pretty=format:%H|%aI|%s"]
            )
            if code == 0 and out.strip():
                for line in out.strip().splitlines():
                    parts = line.split("|", 2)
                    if len(parts) >= 2:
                        h = parts[0].strip()
                        ts = parts[1].strip()
                        msg = parts[2].strip() if len(parts) > 2 else ""
                        if h not in seen_commits:
                            seen_commits.add(h)
                            snapshots.append({
                                "snapshot_id": f"git-{h[:8]}",
                                "repository_id": repository_id,
                                "commit_hash": h,
                                "commit_timestamp": ts,
                                "branch": repo.default_branch or "main",
                                "analysis_version": "1.0.0",
                                "status": "GIT_COMMIT",
                                "created_at": ts,
                                "summary": {"message": msg},
                            })

        return {
            "repository_id": repository_id,
            "snapshots": snapshots,
            "total_snapshots": len(snapshots),
        }

    # =========================================================================
    # 2. FILE EVOLUTION & RENAME HISTORY
    # =========================================================================

    async def get_file_evolution(
        self, db: AsyncSession, repository_id: str, file_identifier: str
    ) -> Dict[str, Any]:
        """
        Calculates real historical evolution for a given file:
        - First appearance & creation commit
        - Last modified commit & timestamp
        - Total commits, additions, deletions, and churn
        - Author list and contributions
        - Detectable rename history via git log --follow
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        # Normalize file_identifier and find file in DB
        norm_ident = file_identifier.replace("\\", "/").strip()
        
        target_file: Optional[File] = None
        # Try direct ID
        f_by_id = await db.get(File, norm_ident)
        if f_by_id and f_by_id.repository_id == repository_id:
            target_file = f_by_id
        else:
            # Try path lookup
            stmt = select(File).where(
                File.repository_id == repository_id,
                File.path == norm_ident
            )
            res = await db.execute(stmt)
            target_file = res.scalar_one_or_none()

            # If not found directly, try ends_with match
            if not target_file:
                stmt_like = select(File).where(
                    File.repository_id == repository_id,
                    File.path.endswith(norm_ident)
                )
                res_like = await db.execute(stmt_like)
                target_file = res_like.scalars().first()

        resolved_path = target_file.path if target_file else norm_ident
        file_id = target_file.id if target_file else None

        if not repo.clone_path or not Path(repo.clone_path).exists():
            return {
                "file_id": file_id,
                "repository_id": repository_id,
                "file_path": resolved_path,
                "created_at": None,
                "first_commit_hash": None,
                "last_modified_at": None,
                "last_commit_hash": None,
                "commit_count": 0,
                "authors": [],
                "total_additions": 0,
                "total_deletions": 0,
                "churn": 0,
                "commits": [],
                "rename_history": [],
                "available_snapshots": [],
            }

        # Run git log --follow with both name-status and numstat
        sep = "---GIT_FILE_COMMIT---"
        code, out, _ = self._run_git_cmd(
            repo.clone_path,
            [
                "log",
                "--follow",
                "-M",
                f"--pretty=format:{sep}%n%H%n%an%n%ae%n%aI%n%s",
                "--name-status",
                "--",
                resolved_path,
            ],
        )

        code_num, out_num, _ = self._run_git_cmd(
            repo.clone_path,
            [
                "log",
                "--follow",
                "-M",
                f"--pretty=format:{sep}%n%H",
                "--numstat",
                "--",
                resolved_path,
            ],
        )

        # Parse numstats by commit hash
        numstat_by_hash: Dict[str, Tuple[int, int]] = {}
        if code_num == 0 and out_num.strip():
            num_blocks = out_num.split(sep)
            for nb in num_blocks:
                nb_lines = [l.strip() for l in nb.strip().splitlines() if l.strip()]
                if not nb_lines:
                    continue
                c_hash = nb_lines[0]
                adds, dels = 0, 0
                for stat_l in nb_lines[1:]:
                    parts = stat_l.split("\t")
                    if len(parts) >= 2:
                        adds += int(parts[0]) if parts[0].isdigit() else 0
                        dels += int(parts[1]) if parts[1].isdigit() else 0
                numstat_by_hash[c_hash] = (adds, dels)

        commits = []
        renames = []
        authors_seen = set()
        authors_ordered = []

        total_additions = 0
        total_deletions = 0

        if code == 0 and out.strip():
            blocks = out.split(sep)
            for block in blocks:
                lines = [l for l in block.strip().splitlines() if l.strip()]
                if len(lines) < 5:
                    continue

                c_hash = lines[0].strip()
                author = lines[1].strip()
                author_email = lines[2].strip()
                ts_iso = lines[3].strip()
                subject = lines[4].strip()

                if author and author not in authors_seen:
                    authors_seen.add(author)
                    authors_ordered.append(author)

                # Look for rename in status lines
                is_rename = False
                old_path = None
                sim_score = None

                for st_line in lines[5:]:
                    st_parts = st_line.split("\t")
                    if not st_parts:
                        continue
                    status_code = st_parts[0]
                    if status_code.startswith("R") and len(st_parts) >= 3:
                        is_rename = True
                        old_path = st_parts[1].replace("\\", "/")
                        new_p = st_parts[2].replace("\\", "/")
                        try:
                            sim_score = int(status_code[1:])
                        except Exception:
                            sim_score = 100
                        renames.append({
                            "from_path": old_path,
                            "to_path": new_p,
                            "commit_hash": c_hash,
                            "timestamp": ts_iso,
                            "similarity_score": sim_score,
                        })

                adds, dels = numstat_by_hash.get(c_hash, (0, 0))
                total_additions += adds
                total_deletions += dels

                commits.append({
                    "commit_hash": c_hash,
                    "author": author,
                    "author_email": author_email,
                    "timestamp": ts_iso,
                    "message": subject,
                    "additions": adds,
                    "deletions": dels,
                    "is_rename": is_rename,
                    "old_path": old_path,
                })

        created_at = commits[-1]["timestamp"] if commits else None
        first_commit_hash = commits[-1]["commit_hash"] if commits else None
        last_modified_at = commits[0]["timestamp"] if commits else None
        last_commit_hash = commits[0]["commit_hash"] if commits else None
        commit_count = len(commits)
        churn = total_additions + total_deletions

        # Available snapshots for this file
        available_snapshots = []
        if target_file and target_file.analysis_id:
            available_snapshots.append(target_file.analysis_id)
        if commits:
            available_snapshots.extend([c["commit_hash"] for c in commits[:5]])

        return {
            "file_id": file_id,
            "repository_id": repository_id,
            "file_path": resolved_path,
            "created_at": created_at,
            "first_commit_hash": first_commit_hash,
            "last_modified_at": last_modified_at,
            "last_commit_hash": last_commit_hash,
            "commit_count": commit_count,
            "authors": authors_ordered,
            "total_additions": total_additions,
            "total_deletions": total_deletions,
            "churn": churn,
            "commits": commits,
            "rename_history": renames,
            "available_snapshots": list(dict.fromkeys(available_snapshots)),
        }

    # =========================================================================
    # 3. DIFF PARSING & SYMBOL MAPPING
    # =========================================================================

    def _parse_unified_diff(self, raw_diff: str) -> List[Dict[str, Any]]:
        """
        Parses raw unified git diff output into structured file diffs and hunks.
        """
        if not raw_diff or not raw_diff.strip():
            return []

        file_diffs = []
        current_file: Optional[Dict[str, Any]] = None
        current_hunk: Optional[Dict[str, Any]] = None

        hunk_regex = re.compile(r"^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(?: (.*))?$")

        for line in raw_diff.splitlines():
            if line.startswith("diff --git "):
                if current_file:
                    if current_hunk:
                        current_file["hunks"].append(current_hunk)
                        current_hunk = None
                    file_diffs.append(current_file)

                parts = line.split(" ")
                old_p = parts[2][2:] if len(parts) > 2 and parts[2].startswith("a/") else (parts[2] if len(parts) > 2 else None)
                new_p = parts[3][2:] if len(parts) > 3 and parts[3].startswith("b/") else (parts[3] if len(parts) > 3 else None)

                current_file = {
                    "old_path": old_p.replace("\\", "/") if old_p else None,
                    "new_path": new_p.replace("\\", "/") if new_p else None,
                    "change_type": "MODIFIED",
                    "additions": 0,
                    "deletions": 0,
                    "hunks": [],
                }
                current_hunk = None
                continue

            if not current_file:
                continue

            if line.startswith("new file mode "):
                current_file["change_type"] = "ADDED"
            elif line.startswith("deleted file mode "):
                current_file["change_type"] = "DELETED"
            elif line.startswith("rename from "):
                current_file["change_type"] = "RENAMED"
                current_file["old_path"] = line[len("rename from "):].strip().replace("\\", "/")
            elif line.startswith("rename to "):
                current_file["change_type"] = "RENAMED"
                current_file["new_path"] = line[len("rename to "):].strip().replace("\\", "/")
            elif line.startswith("--- ") or line.startswith("+++ ") or line.startswith("index "):
                continue
            elif line.startswith("@@"):
                if current_hunk:
                    current_file["hunks"].append(current_hunk)
                m = hunk_regex.match(line)
                if m:
                    old_start = int(m.group(1))
                    old_lines = int(m.group(2)) if m.group(2) else 1
                    new_start = int(m.group(3))
                    new_lines = int(m.group(4)) if m.group(4) else 1
                    heading = m.group(5) or None
                    current_hunk = {
                        "old_start": old_start,
                        "old_lines": old_lines,
                        "new_start": new_start,
                        "new_lines": new_lines,
                        "heading": heading,
                        "lines": [],
                    }
                else:
                    current_hunk = {
                        "old_start": 1,
                        "old_lines": 0,
                        "new_start": 1,
                        "new_lines": 0,
                        "heading": None,
                        "lines": [],
                    }
            elif current_hunk is not None:
                current_hunk["lines"].append(line)
                if line.startswith("+") and not line.startswith("+++"):
                    current_file["additions"] += 1
                elif line.startswith("-") and not line.startswith("---"):
                    current_file["deletions"] += 1

        if current_file:
            if current_hunk:
                current_file["hunks"].append(current_hunk)
            file_diffs.append(current_file)

        return file_diffs

    def _get_file_content_at_commit(
        self, clone_path: str, commit_ref: str, file_path: str
    ) -> Optional[str]:
        """Retrieves raw content of a file at a specific commit using git show."""
        norm_path = file_path.replace("\\", "/")
        code, out, _ = self._run_git_cmd(
            clone_path,
            ["show", f"{commit_ref}:{norm_path}"]
        )
        if code == 0:
            return out
        return None

    def _extract_symbols_from_content(
        self, content: str, file_path: str
    ) -> List[Dict[str, Any]]:
        """Extracts AST symbols from in-memory source content."""
        lang = self._get_language_from_path(file_path)
        if not lang or not content:
            return []
        try:
            parsed = self._ast_parser.parse_source_code(content, file_path, lang)
            return parsed.get("symbols", [])
        except Exception as exc:
            logger.debug(f"Could not parse symbols for {file_path}: {exc}")
            return []

    def _map_hunks_to_symbols(
        self,
        clone_path: str,
        commit_hash: str,
        file_diff: Dict[str, Any],
        old_commit_ref: Optional[str] = None,
        new_commit_ref: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Maps Git diff hunks to AST symbols to determine CREATED, MODIFIED, DELETED, or RENAMED symbols.
        Detects ambiguous overlaps and sets is_uncertain=True.
        """
        old_path = file_diff.get("old_path") or file_diff.get("new_path")
        new_path = file_diff.get("new_path") or file_diff.get("old_path")

        if not old_path and not new_path:
            return []

        ch_type = file_diff.get("change_type", "MODIFIED")
        hunks = file_diff.get("hunks", [])

        # Fetch old content and new content
        old_ref = old_commit_ref or f"{commit_hash}~1"
        new_ref = new_commit_ref or commit_hash

        old_content = self._get_file_content_at_commit(clone_path, old_ref, old_path) if ch_type != "ADDED" else None
        new_content = self._get_file_content_at_commit(clone_path, new_ref, new_path) if ch_type != "DELETED" else None

        old_symbols = self._extract_symbols_from_content(old_content or "", old_path)
        new_symbols = self._extract_symbols_from_content(new_content or "", new_path)

        old_sym_dict = {s["name"]: s for s in old_symbols if s.get("name")}
        new_sym_dict = {s["name"]: s for s in new_symbols if s.get("name")}

        symbol_changes = []

        # 1. Added symbols (present in new, absent in old)
        for s_name, s_new in new_sym_dict.items():
            if s_name not in old_sym_dict:
                s_type = s_new.get("kind", "function")
                s_start = s_new.get("start_line")
                s_end = s_new.get("end_line")

                # Verify evidence from hunks
                hunk_evidence = []
                for h in hunks:
                    h_start = h.get("new_start", 1)
                    h_end = h_start + h.get("new_lines", 1)
                    if s_start and s_end and not (h_end < s_start or h_start > s_end):
                        hunk_evidence.append(f"lines {h_start}-{h_end}")

                evidence_str = f"Commit {commit_hash[:8]} added symbol '{s_name}' in {new_path}"
                if hunk_evidence:
                    evidence_str += f" (diff hunks: {', '.join(hunk_evidence)})"

                symbol_changes.append({
                    "symbol_name": s_name,
                    "symbol_type": s_type,
                    "file_path": new_path,
                    "change_type": "CREATED",
                    "old_start_line": None,
                    "old_end_line": None,
                    "new_start_line": s_start,
                    "new_end_line": s_end,
                    "commit_hash": commit_hash,
                    "evidence": evidence_str,
                    "is_uncertain": False,
                })

        # 2. Deleted symbols (present in old, absent in new)
        for s_name, s_old in old_sym_dict.items():
            if s_name not in new_sym_dict:
                s_type = s_old.get("kind", "function")
                s_start = s_old.get("start_line")
                s_end = s_old.get("end_line")

                symbol_changes.append({
                    "symbol_name": s_name,
                    "symbol_type": s_type,
                    "file_path": old_path,
                    "change_type": "DELETED",
                    "old_start_line": s_start,
                    "old_end_line": s_end,
                    "new_start_line": None,
                    "new_end_line": None,
                    "commit_hash": commit_hash,
                    "evidence": f"Commit {commit_hash[:8]} removed symbol '{s_name}' from {old_path}",
                    "is_uncertain": False,
                })

        # 3. Modified symbols (present in both)
        for s_name, s_new in new_sym_dict.items():
            if s_name in old_sym_dict:
                s_old = old_sym_dict[s_name]
                s_type = s_new.get("kind", "function")
                
                old_s = s_old.get("start_line", 1)
                old_e = s_old.get("end_line", 1)
                new_s = s_new.get("start_line", 1)
                new_e = s_new.get("end_line", 1)

                # Check if any hunk overlaps this symbol
                overlapping_hunks = []
                for h in hunks:
                    # check new range overlap
                    h_start = h.get("new_start", 1)
                    h_end = h_start + max(1, h.get("new_lines", 1))
                    if not (h_end < new_s or h_start > new_e):
                        overlapping_hunks.append(h)
                    else:
                        # check old range overlap
                        ho_start = h.get("old_start", 1)
                        ho_end = ho_start + max(1, h.get("old_lines", 1))
                        if not (ho_end < old_s or ho_start > old_e):
                            overlapping_hunks.append(h)

                if overlapping_hunks:
                    # Check for uncertainty (multiple overlapping symbols or empty lines)
                    other_overlapping = 0
                    for other_name, other_sym in new_sym_dict.items():
                        if other_name != s_name:
                            os = other_sym.get("start_line", 1)
                            oe = other_sym.get("end_line", 1)
                            for oh in overlapping_hunks:
                                if not (oh.get("new_start", 1) + oh.get("new_lines", 1) < os or oh.get("new_start", 1) > oe):
                                    other_overlapping += 1
                                    break

                    is_uncertain = other_overlapping > 0

                    evidence_str = (
                        f"Commit {commit_hash[:8]} modified '{s_name}' ({s_type}) in {new_path}: "
                        f"lines {old_s}-{old_e} -> {new_s}-{new_e} with {len(overlapping_hunks)} overlapping diff hunk(s)"
                    )

                    symbol_changes.append({
                        "symbol_name": s_name,
                        "symbol_type": s_type,
                        "file_path": new_path,
                        "change_type": "MODIFIED",
                        "old_start_line": old_s,
                        "old_end_line": old_e,
                        "new_start_line": new_s,
                        "new_end_line": new_e,
                        "commit_hash": commit_hash,
                        "evidence": evidence_str,
                        "is_uncertain": is_uncertain,
                    })

        return symbol_changes

    # =========================================================================
    # 4. COMMIT DETAILS API
    # =========================================================================

    async def get_commit_details(
        self, db: AsyncSession, repository_id: str, commit_hash: str
    ) -> Dict[str, Any]:
        """
        Retrieves detailed information for a specific Git commit:
        - Metadata (hash, author, date, message, parents, branch)
        - Files changed with structured diff hunks and line additions/deletions
        - AST symbol changes mapped with evidence
        - Architecture layer/component impact detection
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        if not repo.clone_path or not Path(repo.clone_path).exists():
            raise ValueError(f"Git repository for '{repository_id}' is not accessible on disk.")

        # Extract commit metadata
        meta_sep = "---GIT_COMMIT_META---"
        code, out_meta, err_meta = self._run_git_cmd(
            repo.clone_path,
            [
                "show",
                "--quiet",
                f"--pretty=format:{meta_sep}%n%H%n%P%n%an%n%ae%n%aI%n%B{meta_sep}",
                commit_hash,
            ],
        )
        if code != 0 or not out_meta.strip():
            raise ValueError(f"Commit '{commit_hash}' not found in repository '{repository_id}': {err_meta}")

        parts = out_meta.split(meta_sep)
        meta_block = parts[1] if len(parts) > 1 else out_meta
        meta_lines = meta_block.strip().splitlines()

        c_hash = meta_lines[0].strip() if len(meta_lines) > 0 else commit_hash
        parent_hashes = meta_lines[1].strip().split() if len(meta_lines) > 1 and meta_lines[1].strip() else []
        author = meta_lines[2].strip() if len(meta_lines) > 2 else "Unknown"
        author_email = meta_lines[3].strip() if len(meta_lines) > 3 else None
        ts = meta_lines[4].strip() if len(meta_lines) > 4 else datetime.now(timezone.utc).isoformat()
        message = "\n".join(meta_lines[5:]).strip() if len(meta_lines) > 5 else ""

        # Extract full diff with hunks
        code_diff, out_diff, _ = self._run_git_cmd(
            repo.clone_path,
            ["show", "-U3", "-M20%", "--format=", commit_hash],
        )

        changed_files = self._parse_unified_diff(out_diff) if code_diff == 0 else []

        total_insertions = sum(f["additions"] for f in changed_files)
        total_deletions = sum(f["deletions"] for f in changed_files)

        # Detect symbol changes across changed files
        all_symbol_changes = []
        arch_changes = set()

        for f_diff in changed_files:
            p = f_diff.get("new_path") or f_diff.get("old_path") or ""
            # Detect architecture impact
            layer_name, layer_cat, _ = architecture_intelligence_service.classify_file_layer(p)
            if layer_name and layer_name != "Uncategorized":
                arch_changes.add(f"{layer_name} ({layer_cat}): '{p}' {f_diff.get('change_type')}")

            # Map hunks to symbols for supported language files
            if self._get_language_from_path(p):
                sym_changes = self._map_hunks_to_symbols(
                    clone_path=repo.clone_path,
                    commit_hash=c_hash,
                    file_diff=f_diff,
                )
                all_symbol_changes.extend(sym_changes)

        # Try to resolve branch
        branch = None
        code_br, out_br, _ = self._run_git_cmd(
            repo.clone_path,
            ["branch", "--contains", commit_hash],
        )
        if code_br == 0 and out_br.strip():
            br_candidates = [b.strip().lstrip("* ") for b in out_br.splitlines() if b.strip()]
            if br_candidates:
                branch = br_candidates[0]

        return {
            "commit_hash": c_hash,
            "parent_hashes": parent_hashes,
            "author": author,
            "author_email": author_email,
            "timestamp": ts,
            "message": message,
            "branch": branch or repo.default_branch or "main",
            "files_changed_count": len(changed_files),
            "insertions": total_insertions,
            "deletions": total_deletions,
            "changed_files": changed_files,
            "symbol_changes": all_symbol_changes,
            "architecture_changes": sorted(list(arch_changes)),
            "metrics": {
                "total_insertions": total_insertions,
                "total_deletions": total_deletions,
                "net_change": total_insertions - total_deletions,
                "symbols_changed_count": len(all_symbol_changes),
            },
        }

    # =========================================================================
    # 5. COMMIT COMPARISON API
    # =========================================================================

    async def compare_commits(
        self, db: AsyncSession, repository_id: str, from_commit: str, to_commit: str
    ) -> Dict[str, Any]:
        """
        Compares two commits in a repository:
        - Added, deleted, modified, renamed files
        - Detailed unified file diffs and hunks
        - Added, deleted, modified, and renamed symbols with AST mapping
        - Dependency manifest changes
        - API endpoint changes
        - Architecture component shifts
        - Quantitative metrics changes
        """
        repo = await db.get(Repository, repository_id)
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found")

        if not repo.clone_path or not Path(repo.clone_path).exists():
            raise ValueError(f"Git repository for '{repository_id}' is not accessible on disk.")

        # 1. Run git diff between from_commit and to_commit
        code_diff, out_diff, err_diff = self._run_git_cmd(
            repo.clone_path,
            ["diff", "-U3", "-M20%", from_commit, to_commit],
        )
        if code_diff != 0:
            raise ValueError(f"Failed to compare commits {from_commit}..{to_commit}: {err_diff}")

        file_diffs = self._parse_unified_diff(out_diff)

        added_files = []
        deleted_files = []
        modified_files = []
        renamed_files = []

        for fd in file_diffs:
            ct = fd["change_type"]
            np = fd["new_path"]
            op = fd["old_path"]

            if ct == "ADDED":
                added_files.append(np)
            elif ct == "DELETED":
                deleted_files.append(op)
            elif ct == "RENAMED":
                renamed_files.append({"from": op, "to": np})
            else:
                modified_files.append(np)

        # 2. Extract symbol changes between the two commits
        added_symbols = []
        deleted_symbols = []
        modified_symbols = []
        renamed_symbols = []

        for fd in file_diffs:
            target_p = fd.get("new_path") or fd.get("old_path") or ""
            if self._get_language_from_path(target_p):
                sym_changes = self._map_hunks_to_symbols(
                    clone_path=repo.clone_path,
                    commit_hash=to_commit,
                    file_diff=fd,
                    old_commit_ref=from_commit,
                    new_commit_ref=to_commit,
                )
                for sc in sym_changes:
                    sc_type = sc.get("change_type")
                    if sc_type == "CREATED":
                        added_symbols.append(sc)
                    elif sc_type == "DELETED":
                        deleted_symbols.append(sc)
                    elif sc_type == "RENAMED":
                        renamed_symbols.append(sc)
                    else:
                        modified_symbols.append(sc)

        # 3. Detect dependency changes
        dep_manifests = {
            "requirements.txt", "pyproject.toml", "Pipfile",
            "package.json", "package-lock.json", "yarn.lock",
            "pom.xml", "build.gradle", "go.mod", "Cargo.toml"
        }
        dependency_changes = []
        for fd in file_diffs:
            p = fd.get("new_path") or fd.get("old_path") or ""
            basename = Path(p).name
            if basename in dep_manifests:
                old_c = self._get_file_content_at_commit(repo.clone_path, from_commit, p) or ""
                new_c = self._get_file_content_at_commit(repo.clone_path, to_commit, p) or ""

                # Look for simple additions/deletions of lines in manifest
                old_lines = set(l.strip() for l in old_c.splitlines() if l.strip() and not l.strip().startswith("#"))
                new_lines = set(l.strip() for l in new_c.splitlines() if l.strip() and not l.strip().startswith("#"))

                added_dep_lines = list(new_lines - old_lines)[:10]
                removed_dep_lines = list(old_lines - new_lines)[:10]

                dependency_changes.append({
                    "manifest_file": p,
                    "change_type": fd["change_type"],
                    "added_entries": added_dep_lines,
                    "removed_entries": removed_dep_lines,
                })

        # 4. Detect API changes
        api_changes = []
        # Check files in controllers / api / routes or files where symbols added/deleted look like endpoints
        for sc in added_symbols + deleted_symbols + modified_symbols:
            f_path = sc.get("file_path", "")
            s_name = sc.get("symbol_name", "")
            is_api_file = any(api_k in f_path.lower() for api_k in ["api", "router", "route", "controller", "endpoint"])
            if is_api_file:
                api_changes.append({
                    "file_path": f_path,
                    "endpoint_or_handler": s_name,
                    "change_type": sc.get("change_type"),
                    "evidence": sc.get("evidence"),
                })

        # 5. Architecture changes
        arch_changes = []
        changed_layers = set()
        for fd in file_diffs:
            p = fd.get("new_path") or fd.get("old_path") or ""
            layer_name, layer_cat, desc = architecture_intelligence_service.classify_file_layer(p)
            if layer_name and layer_name != "Uncategorized":
                changed_layers.add((layer_name, layer_cat))

        for l_name, l_cat in changed_layers:
            arch_changes.append({
                "layer": l_name,
                "category": l_cat,
                "description": f"Architectural layer '{l_name}' ({l_cat}) has modifications between {from_commit[:8]} and {to_commit[:8]}",
            })

        # 6. Metrics changes
        tot_adds = sum(fd["additions"] for fd in file_diffs)
        tot_dels = sum(fd["deletions"] for fd in file_diffs)

        metrics_changes = {
            "files_added_count": len(added_files),
            "files_deleted_count": len(deleted_files),
            "files_modified_count": len(modified_files),
            "files_renamed_count": len(renamed_files),
            "total_files_changed": len(file_diffs),
            "total_lines_added": tot_adds,
            "total_lines_deleted": tot_dels,
            "net_lines_delta": tot_adds - tot_dels,
            "symbols_added_count": len(added_symbols),
            "symbols_deleted_count": len(deleted_symbols),
            "symbols_modified_count": len(modified_symbols),
            "symbols_renamed_count": len(renamed_symbols),
            "dependency_manifests_changed": len(dependency_changes),
            "api_endpoints_changed": len(api_changes),
            "architectural_layers_impacted": len(arch_changes),
        }

        return {
            "repository_id": repository_id,
            "from_commit": from_commit,
            "to_commit": to_commit,
            "added_files": added_files,
            "deleted_files": deleted_files,
            "modified_files": modified_files,
            "renamed_files": renamed_files,
            "file_diffs": file_diffs,
            "added_symbols": added_symbols,
            "deleted_symbols": deleted_symbols,
            "modified_symbols": modified_symbols,
            "renamed_symbols": renamed_symbols,
            "dependency_changes": dependency_changes,
            "api_changes": api_changes,
            "architecture_changes": arch_changes,
            "metrics_changes": metrics_changes,
        }


time_machine_service = TimeMachineService()
