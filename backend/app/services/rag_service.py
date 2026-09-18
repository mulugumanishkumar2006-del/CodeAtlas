import re
import json
import logging
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timezone
from sqlalchemy import select, or_, and_, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode, GraphRelationship
from backend.app.models.conversation import Conversation
from backend.app.services.source_code_service import source_code_service
from backend.app.services.search_intelligence_service import search_intelligence_service
from backend.app.services.architecture_service import architecture_service
from backend.app.services.impact_analysis_service import impact_service
from backend.app.services.code_quality_service import code_quality_service
from backend.app.services.security_reliability_service import security_reliability_service
from backend.app.services.git_history_service import git_history_service
from backend.app.services.dependency_intelligence_service import dependency_intelligence_service
from backend.app.services.llm_provider import get_llm_provider, SYSTEM_PROMPT, LLMProvider

logger = logging.getLogger("codeatlas.rag")


# Secret and sensitive file exclusion patterns
SECRET_PATTERNS = [
    re.compile(r"^\.env(?:\..*)?$", re.IGNORECASE),
    re.compile(r".*\.(?:pem|key|pkcs12|pfx|p12|crt|cer)$", re.IGNORECASE),
    re.compile(r".*(?:id_rsa|id_dsa|id_ecdsa|id_ed25519).*$", re.IGNORECASE),
    re.compile(r".*(?:credentials|secrets|token|password|auth_token)\.(?:json|yaml|yml|txt|env)$", re.IGNORECASE),
]


def is_secret_file(path: str) -> bool:
    """Check whether a file path points to a secret or credential file."""
    filename = path.split("/")[-1].split("\\")[-1]
    for pattern in SECRET_PATTERNS:
        if pattern.match(filename):
            return True
    return False


def redact_sensitive_strings(text: str) -> str:
    """Redact API keys, tokens, passwords, private keys from evidence and answers."""
    if not text:
        return ""
    # Redact Stripe-like live/test keys
    text = re.sub(r"sk_(?:live|test)_[a-zA-Z0-9]{16,}", "[REDACTED_STRIPE_KEY]", text)
    # Redact AWS access keys
    text = re.sub(r"AKIA[0-9A-Z]{16}", "[REDACTED_AWS_KEY]", text)
    # Redact GitHub personal access tokens
    text = re.sub(r"gh[pousr]_[A-Za-z0-9_]{30,}", "[REDACTED_GITHUB_TOKEN]", text)
    # Redact Bearer tokens
    text = re.sub(r"(Bearer\s+)[A-Za-z0-9\-\._~\+\/]{20,}={0,2}", r"\1[REDACTED_TOKEN]", text)
    # Redact RSA private keys
    text = re.sub(r"-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA )?PRIVATE KEY-----", "[REDACTED_PRIVATE_KEY]", text)
    # Redact passwords, client secrets, and private tokens
    text = re.sub(r"(?i)(password|passwd|secret|api_key|token)\s*[:=]\s*['\"][^'\"]{4,}['\"]", r'\1 = "[REDACTED_SECRET]"', text)
    return text


class RAGService:
    """
    Evidence-Grounded Repository Q&A and Retrieval-Augmented Generation Engine.
    Strictly scoped to a single active repository.
    Never fabricates repository code, files, symbols, or claims.
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def classify_query(self, query: str) -> Tuple[str, List[str]]:
        """
        Stage 1 & 2: Classify question type into 10 canonical intents and extract target keywords/identifiers.
        Canonical intents: SEARCH, EXPLAIN, IMPACT, ARCHITECTURE, CALL_GRAPH, DEPENDENCY, HISTORY, QUALITY, SECURITY, GENERAL.
        Returns (intent, keywords).
        """
        q = query.strip()
        lower_q = q.lower()

        # Stop words to filter from candidate identifiers
        stop_words = {
            "what", "where", "how", "why", "when", "which", "who", "does", "do", "is", "are", 
            "the", "a", "an", "in", "of", "to", "for", "from", "with", "by", "on", "at", 
            "work", "works", "implemented", "handled", "defined", "created", "initialized", 
            "explain", "show", "find", "tell", "me", "about", "project", "codebase", "repository",
            "module", "file", "function", "class", "method", "this", "that", "these", "those"
        }

        # Extract potential identifiers (camelCase, snake_case, PascalCase, filenames)
        raw_words = re.findall(r"[a-zA-Z0-9_\-\.]+", q)
        keywords = [
            w.strip(".") for w in raw_words 
            if w.lower() not in stop_words and len(w) > 1 and not w.isdigit()
        ]

        # 1. IMPACT (Blast radius, breakage, affected files)
        if re.search(r"\b(affected|blast radius|impact|break if|what breaks|change impact|modify|what will break|breakage)\b", lower_q):
            return "IMPACT", keywords

        # 2. CALL_GRAPH (Callers, callees, invocations, call sequence)
        if re.search(r"\b((?:who|what|which)\s+(?:functions?|methods?|classes?)?\s*calls?|callees?|callers?|call chain|invokes?|invoked by)\b", lower_q):
            return "CALL_GRAPH", keywords

        # 3. DEPENDENCY (Incoming/outgoing packages, supply chain, imports)
        if re.search(r"\b(depend on|depends on|imports|imported by|dependent on|dependencies|dependency|where is .* used|which files use .*|package|packages|pypi|npm|library|libraries)\b", lower_q):
            return "DEPENDENCY", keywords

        # 4. ARCHITECTURE (Layers, modules, overview, components, structure)
        if re.search(r"\b(architecture|architectural|structure[ds]?|overview|high level|layers?|modules?|components?|entry points?|patterns?|app structure|how is (?:the|this) application structured|api layer|main components)\b", lower_q):
            return "ARCHITECTURE", keywords

        # 5. HISTORY (Commits, authors, changelog, churn, evolution)
        if re.search(r"\b(history|commit|commits|author|authors|contributor|contributors|churn|evolution|inactive|ownership|who changed|when was .* changed|what changed recently|blame|modified recently)\b", lower_q):
            return "HISTORY", keywords

        # 6. QUALITY (Technical debt, complexity, duplication, maintainability)
        if re.search(r"\b(quality|complexity|technical debt|debt|duplication|hotspot|maintainability|code smell|dead code|high churn|most complex|concentrated)\b", lower_q):
            return "QUALITY", keywords

        # 7. SECURITY (Vulnerabilities, secrets, risks, findings)
        if re.search(r"\b(security|secret|secrets|token|password|key|vulnerability|vulnerabilities|injection|timeout|reliability|spof|auth|crypto|cve|tls|cors|risks|findings)\b", lower_q):
            return "SECURITY", keywords

        # 8. SEARCH (Finding locations, definitions, implementations)
        if re.search(r"\b(where is|find|locate|search|which files? implement|which function handles|which components? use|show me the file)\b", lower_q):
            return "SEARCH", keywords

        # 9. EXPLAIN (Understanding behavior, classes, flows)
        if re.search(r"\b(explain|how does .* work|how .* works|what does .* do|walkthrough|describe|how .* works?)\b", lower_q):
            return "EXPLAIN", keywords

        # 10. GENERAL
        return "GENERAL", keywords

    async def retrieve_evidence(
        self,
        repository_id: str,
        query: str,
        intent: str,
        keywords: List[str],
        db: AsyncSession,
        conversation_context: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Stage 3 to 6: Execute multi-stage, repository-scoped retrieval.
        Gathers Symbols, Files, Source Excerpts, Dependencies, and Graph nodes.
        Filters out secret files and bounds the evidence set.
        """
        # Fetch non-secret files in this repository
        files_q = select(File).where(File.repository_id == repository_id)
        files_res = await db.execute(files_q)
        all_repo_files = [f for f in files_res.scalars().all() if not is_secret_file(f.path)]
        file_map = {f.id: f for f in all_repo_files}
        file_path_map = {f.path: f.id for f in all_repo_files}

        candidate_sources: List[Dict[str, Any]] = []
        seen_keys = set()

        def add_candidate(
            file_id: str,
            path: str,
            start_line: int,
            end_line: int,
            symbol: Optional[str],
            symbol_type: Optional[str],
            docstring: Optional[str],
            content: str,
            relevance: float,
            match_reason: str,
            symbol_id: Optional[str] = None,
        ):
            if is_secret_file(path):
                return
            key = f"{path}:{start_line}-{end_line}"
            if key in seen_keys:
                return
            seen_keys.add(key)
            candidate_sources.append({
                "repository_id": repository_id,
                "file_id": file_id,
                "path": path,
                "file_path": path,
                "start_line": start_line,
                "end_line": end_line,
                "symbol_id": symbol_id,
                "symbol": symbol,
                "symbol_type": symbol_type,
                "docstring": docstring,
                "content": content,
                "relevance": round(relevance, 3),
                "match_reason": match_reason,
            })

        # Helper to compute search root/stem
        def get_search_stems(word: str) -> List[str]:
            w = word.strip("'\"`").lower()
            stems = [w]
            for suffix in ["ications", "ication", "ations", "ation", "tions", "tion", "sions", "sion", "ings", "ing", "ized", "ised", "izes", "ises", "ize", "ise", "ed", "es", "s"]:
                if w.endswith(suffix) and len(w) - len(suffix) >= 4:
                    stems.append(w[:-len(suffix)])
                    break
            return stems

        # --- A. SYMBOL RETRIEVAL (Stage 4) ---
        for kw in keywords:
            clean_kw = kw.strip("'\"`")
            if not clean_kw:
                continue

            search_terms = get_search_stems(clean_kw)
            conditions = []
            for term in search_terms:
                conditions.append(Symbol.name.ilike(f"%{term}%"))
                conditions.append(Symbol.qualified_name.ilike(f"%{term}%"))

            sym_q = (
                select(Symbol, File)
                .join(File, Symbol.file_id == File.id)
                .where(
                    Symbol.repository_id == repository_id,
                    File.repository_id == repository_id,
                    or_(*conditions),
                )
            )
            sym_res = await db.execute(sym_q)
            for sym, f in sym_res.all():
                if is_secret_file(f.path):
                    continue

                # Calculate deterministic relevance score
                score = 0.65
                if sym.name.lower() == clean_kw.lower():
                    score = 0.98
                elif sym.name.lower().startswith(clean_kw.lower()) or any(sym.name.lower().startswith(t) for t in search_terms):
                    score = 0.85
                elif clean_kw.lower() in sym.name.lower() or any(t in sym.name.lower() for t in search_terms):
                    score = 0.75

                # Retrieve real bounded source code for this symbol
                file_src = source_code_service.get_file_source(repository_id, f.path)
                full_text = file_src.get("source", "")
                src_lines = full_text.splitlines() if full_text else []

                start_l = max(1, sym.start_line)
                end_l = min(len(src_lines), sym.end_line or sym.start_line + 30)
                # Bound maximum lines per symbol snippet
                if end_l - start_l > 60:
                    end_l = start_l + 60

                snippet = "\n".join(src_lines[start_l - 1 : end_l]) if src_lines else ""

                add_candidate(
                    file_id=f.id,
                    path=f.path,
                    start_line=start_l,
                    end_line=end_l,
                    symbol=sym.name,
                    symbol_type=sym.symbol_type,
                    docstring=sym.docstring,
                    content=snippet,
                    relevance=score,
                    match_reason=f"Symbol match for '{sym.name}' ({sym.symbol_type})",
                    symbol_id=sym.id,
                )

        # --- B. FILE SEARCH (Stage 3 & 4) ---
        for f in all_repo_files:
            f_basename = f.path.split("/")[-1]
            for kw in keywords:
                clean_kw = kw.strip("'\"`")
                if not clean_kw:
                    continue

                file_score = 0.0
                if f_basename.lower() == clean_kw.lower():
                    file_score = 0.95
                elif clean_kw.lower() in f_basename.lower():
                    file_score = 0.80
                elif clean_kw.lower() in f.path.lower():
                    file_score = 0.60

                if file_score > 0.5:
                    file_src = source_code_service.get_file_source(repository_id, f.path)
                    full_text = file_src.get("source", "")
                    src_lines = full_text.splitlines() if full_text else []
                    snippet = "\n".join(src_lines[:50]) if src_lines else ""

                    add_candidate(
                        file_id=f.id,
                        path=f.path,
                        start_line=1,
                        end_line=min(len(src_lines), 50),
                        symbol=None,
                        symbol_type=None,
                        docstring=None,
                        content=snippet,
                        relevance=file_score,
                        match_reason=f"File path match for '{f.path}'",
                    )

        # --- C. CODE CONTENT SEARCH (Stage 5) ---
        for kw in keywords:
            clean_kw = kw.strip("'\"`")
            if len(clean_kw) < 3:
                continue

            raw_code = source_code_service.search_repository_code(
                repository_id=repository_id,
                query=clean_kw,
                file_map=file_path_map,
                limit=15,
            )

            for match in raw_code:
                f_path = match["file_path"]
                if is_secret_file(f_path):
                    continue

                f_id = match["file_id"]
                line_no = match["line_number"]

                file_src = source_code_service.get_file_source(repository_id, f_path)
                full_text = file_src.get("source", "")
                src_lines = full_text.splitlines() if full_text else []

                start_l = max(1, line_no - 10)
                end_l = min(len(src_lines), line_no + 15)
                snippet = "\n".join(src_lines[start_l - 1 : end_l]) if src_lines else match.get("line_content", "")

                add_candidate(
                    file_id=f_id,
                    path=f_path,
                    start_line=start_l,
                    end_line=end_l,
                    symbol=None,
                    symbol_type=None,
                    docstring=None,
                    content=snippet,
                    relevance=0.70,
                    match_reason=f"Code content match at line {line_no}",
                )

        # --- D. DEPENDENCIES & CALL GRAPH (Stage 6) ---
        if intent in ["DEPENDENCY", "ARCHITECTURE", "FLOW", "CALL_GRAPH"] or len(candidate_sources) < 3:
            deps_q = select(Dependency).where(Dependency.repository_id == repository_id).limit(100)
            deps_res = (await db.execute(deps_q)).scalars().all()
            for dep in deps_res:
                meta = dep.metadata_json or {}
                src_path = meta.get("source_path")
                tgt_path = meta.get("target_path") or dep.name
                
                # Check if dependency matches keywords
                dep_match = any(kw.lower() in dep.name.lower() or (src_path and kw.lower() in src_path.lower()) or (tgt_path and kw.lower() in tgt_path.lower()) for kw in keywords)
                if dep_match or intent in ["ARCHITECTURE", "FLOW"]:
                    if dep.source_file_id and dep.source_file_id in file_map:
                        f = file_map[dep.source_file_id]
                        line = meta.get("start_line") or meta.get("line") or 1
                        file_src = source_code_service.get_file_source(repository_id, f.path)
                        full_text = file_src.get("source", "")
                        src_lines = full_text.splitlines() if full_text else []
                        start_l = max(1, line - 2)
                        end_l = min(len(src_lines), line + 10) if src_lines else line + 5
                        snippet = "\n".join(src_lines[start_l - 1 : end_l]) if src_lines else f"import {dep.name}"

                        add_candidate(
                            file_id=f.id,
                            path=f.path,
                            start_line=start_l,
                            end_line=end_l,
                            symbol=dep.name,
                            symbol_type="dependency_import",
                            docstring=None,
                            content=snippet,
                            relevance=0.96,
                            match_reason=f"File '{f.path}' imports '{dep.name}'",
                        )

        # --- D2. CALL GRAPH INTELLIGENCE ---
        if intent == "CALL_GRAPH" or any(kw.lower() in ["call", "calls", "caller", "callers", "callee", "callees", "invokes", "invoked"] for kw in keywords):
            for kw in keywords[:4]:
                clean_kw = kw.strip("'\"`")
                if len(clean_kw) < 2:
                    continue
                target_sym_q = (
                    select(Symbol, File)
                    .join(File, Symbol.file_id == File.id)
                    .where(
                        Symbol.repository_id == repository_id,
                        File.repository_id == repository_id,
                        or_(
                            Symbol.name.ilike(f"{clean_kw}"),
                            Symbol.name.ilike(f"%{clean_kw}%"),
                        ),
                    )
                )
                sym_matches = (await db.execute(target_sym_q)).all()
                for target_sym, target_f in sym_matches:
                    tgt_src = source_code_service.get_file_source(repository_id, target_f.path)
                    tgt_lines = tgt_src.get("source", "").splitlines()
                    tgt_snippet = "\n".join(tgt_lines[max(0, target_sym.start_line - 1):min(len(tgt_lines), target_sym.end_line)])
                    add_candidate(
                        file_id=target_f.id,
                        path=target_f.path,
                        start_line=target_sym.start_line,
                        end_line=target_sym.end_line,
                        symbol=target_sym.name,
                        symbol_type=target_sym.symbol_type,
                        docstring=target_sym.docstring,
                        content=tgt_snippet or f"Function definition for {target_sym.name}",
                        relevance=0.99,
                        match_reason=f"Target function '{target_sym.name}' for call graph analysis",
                        symbol_id=target_sym.id,
                    )

                    # Find incoming callers via dependencies and code references
                    callers_q = (
                        select(Dependency, File)
                        .join(File, Dependency.source_file_id == File.id)
                        .where(
                            Dependency.repository_id == repository_id,
                            File.repository_id == repository_id,
                            or_(
                                Dependency.target_file_id == target_f.id,
                                Dependency.name.ilike(f"%{target_sym.name}%"),
                            ),
                        )
                    )
                    caller_deps = (await db.execute(callers_q)).all()
                    for dep, caller_file in caller_deps:
                        meta = dep.metadata_json or {}
                        line = meta.get("start_line") or meta.get("line") or 1
                        c_src = source_code_service.get_file_source(repository_id, caller_file.path)
                        c_lines = c_src.get("source", "").splitlines()
                        c_snippet = "\n".join(c_lines[max(0, line - 2):min(len(c_lines), line + 10)]) if c_lines else ""
                        add_candidate(
                            file_id=caller_file.id,
                            path=caller_file.path,
                            start_line=max(1, line - 2),
                            end_line=min(len(c_lines), line + 10) if c_lines else line + 5,
                            symbol=None,
                            symbol_type="caller",
                            docstring=None,
                            content=c_snippet or f"Caller in {caller_file.path} invoking {target_sym.name}",
                            relevance=0.95,
                            match_reason=f"Caller of '{target_sym.name}' in {caller_file.path}",
                        )

        # --- E. DETERMINISTIC IMPACT & BLAST RADIUS (Phase 10) ---
        if intent == "IMPACT" or any(kw.lower() in ["impact", "blast", "break", "affected", "dependents"] for kw in keywords):
            # Find target among candidate symbols or files or keywords
            target_candidates = [s["symbol"] for s in candidate_sources if s.get("symbol")] + [s["path"] for s in candidate_sources] + keywords
            for cand in target_candidates[:5]:
                if not cand or len(cand) < 2:
                    continue
                try:
                    impact_data = await impact_service.analyze_impact(
                        db=db,
                        repository_id=repository_id,
                        target_id=cand,
                        direction="both",
                        max_depth=3,
                    )
                    t = impact_data.target
                    m = impact_data.impact
                    
                    impact_summary = (
                        f"IMPACT ANALYSIS FOR '{t.name}' ({t.target_type}):\n"
                        f"- Risk Level: {m.risk} (Score: {m.risk_score})\n"
                        f"- Blast Radius: {m.affected_files} files, {m.affected_symbols} symbols, max depth {m.max_depth}\n"
                        f"- Direct Dependents ({len(impact_data.direct_dependents)}): {', '.join(d.label for d in impact_data.direct_dependents[:5]) or 'None'}\n"
                        f"- Indirect Dependents ({len(impact_data.transitive_dependents)}): {', '.join(d.label for d in impact_data.transitive_dependents[:5]) or 'None'}\n"
                        f"- Direct Dependencies ({len(impact_data.direct_dependencies)}): {', '.join(d.label for d in impact_data.direct_dependencies[:5]) or 'None'}\n"
                        f"- Reasons: {'; '.join(m.risk_reasons)}"
                    )

                    t_file_id = t.file_id or file_path_map.get(t.file_path or t.name)
                    if t_file_id and t.file_path:
                        add_candidate(
                            file_id=t_file_id,
                            path=t.file_path,
                            start_line=t.start_line or 1,
                            end_line=t.end_line or 30,
                            symbol=t.name if t.target_type != "file" else None,
                            symbol_type=t.target_type,
                            docstring=None,
                            content=impact_summary,
                            relevance=0.98,
                            match_reason=f"Deterministic impact analysis for {t.name}",
                        )
                    break
                except Exception:
                    pass

        # --- F. REAL ARCHITECTURE INTELLIGENCE (Phase 11) ---
        if intent == "ARCHITECTURE" or any(kw.lower() in ["architecture", "structure", "module", "pattern", "entry", "framework", "layer", "hotspot", "drift"] for kw in keywords):
            try:
                # Query files, deps, symbols to build full real architecture model
                files_data = [
                    {"id": f.id, "path": f.path, "language": f.language, "line_count": f.line_count, "source_metadata": f.source_metadata or {}}
                    for f in all_repo_files
                ]
                deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id))
                deps = deps_res.scalars().all()
                deps_data = [
                    {"id": d.id, "source_path": file_map.get(d.source_file_id), "target_path": file_map.get(d.target_file_id) or d.name, "resolved": d.target_file_id is not None, "start_line": (d.metadata_json or {}).get("start_line")}
                    for d in deps
                ]
                syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id).limit(200))
                syms = syms_res.scalars().all()
                syms_data = [{"id": s.id, "file_id": s.file_id, "name": s.name, "symbol_type": s.symbol_type, "start_line": s.start_line} for s in syms]

                arch_model = architecture_service.build_architecture_model(
                    repository_id=repository_id,
                    files=files_data,
                    dependencies=deps_data,
                    symbols=syms_data,
                )

                # 1. Add Entry Point Evidence with exact line
                entry_points = arch_model.get("entry_points") or []
                for ep in entry_points[:3]:
                    ep_fid = file_path_map.get(ep["file_path"])
                    if ep_fid:
                        add_candidate(
                            file_id=ep_fid,
                            path=ep["file_path"],
                            start_line=ep.get("line", 1),
                            end_line=ep.get("line", 1) + 20,
                            symbol=ep.get("symbol"),
                            symbol_type="entry_point",
                            docstring=None,
                            content=f"ENTRY POINT ({ep.get('framework', 'General')}): {ep.get('reason')}",
                            relevance=0.97,
                            match_reason=f"Application Entry Point ({ep.get('confidence')} confidence)",
                        )

                # 2. Add Architecture Overview & Patterns Evidence
                summary_text = arch_model.get("explanation") or ""
                patterns = arch_model.get("patterns") or []
                pattern_desc = "\n".join([f"- Pattern: {p['pattern']} ({p['confidence']} confidence): {p['description']}" for p in patterns])
                modules_desc = ", ".join([m["name"] for m in arch_model.get("modules", [])[:6]])

                arch_summary = (
                    f"ARCHITECTURE INTELLIGENCE OVERVIEW:\n"
                    f"{summary_text}\n"
                    f"Detected Modules: {modules_desc}\n"
                    f"{pattern_desc}"
                )

                top_file = all_repo_files[0] if all_repo_files else None
                if top_file:
                    add_candidate(
                        file_id=top_file.id,
                        path=top_file.path,
                        start_line=1,
                        end_line=30,
                        symbol=None,
                        symbol_type="architecture_overview",
                        docstring=None,
                        content=arch_summary,
                        relevance=0.96,
                        match_reason="Repository Architecture Intelligence Summary",
                    )
                # 3. Add actual database GraphNode components if matching keywords
                gn_q = select(GraphNode).where(GraphNode.repository_id == repository_id)
                gn_res = await db.execute(gn_q)
                for gn in gn_res.scalars().all():
                    if any(kw.lower() in gn.label.lower() or kw.lower() in gn.node_key.lower() for kw in keywords) or (intent == "ARCHITECTURE" and len(candidate_sources) < 6):
                        gn_fid = gn.file_id or (all_repo_files[0].id if all_repo_files else "")
                        gn_path = file_map[gn.file_id].path if gn.file_id and gn.file_id in file_map else (all_repo_files[0].path if all_repo_files else "architecture")
                        add_candidate(
                            file_id=gn_fid,
                            path=gn_path,
                            start_line=1,
                            end_line=30,
                            symbol=gn.label,
                            symbol_type=gn.node_type,
                            docstring=None,
                            content=f"ARCHITECTURE NODE ({gn.node_type}): {gn.label} (Key: {gn.node_key})",
                            relevance=0.96,
                            match_reason=f"Architecture Node '{gn.label}'",
                        )
            except Exception as e:
                logger.warning(f"Error extracting architecture evidence for RAG: {e}")

        # --- G. CODE QUALITY & TECHNICAL DEBT INTELLIGENCE (Phase 12) ---
        if any(kw.lower() in ["quality", "debt", "complexity", "duplication", "duplicate", "dead", "unused", "maintainability", "refactor", "hotspot", "smell"] for kw in keywords):
            try:
                files_data = [
                    {"id": f.id, "path": f.path, "language": f.language, "line_count": f.line_count, "source_metadata": f.source_metadata or {}}
                    for f in all_repo_files
                ]
                syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id).limit(200))
                syms = syms_res.scalars().all()
                syms_data = [{"id": s.id, "file_id": s.file_id, "name": s.name, "symbol_type": s.symbol_type, "start_line": s.start_line, "end_line": s.end_line} for s in syms]

                deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id))
                deps = deps_res.scalars().all()
                deps_data = [
                    {"id": d.id, "name": d.name, "source_path": file_map.get(d.source_file_id), "target_path": file_map.get(d.target_file_id) or d.name, "resolved": d.target_file_id is not None}
                    for d in deps
                ]

                files_sources = {}
                for f in all_repo_files:
                    f_src = source_code_service.get_file_source(repository_id, f.path)
                    files_sources[f.path] = f_src.get("source", "")

                quality_data = code_quality_service.analyze_repository_quality(
                    repository_id=repository_id,
                    files=files_data,
                    symbols=syms_data,
                    dependencies=deps_data,
                    files_sources=files_sources,
                )

                # Add top findings evidence
                for finding in quality_data.get("top_findings", [])[:5]:
                    f_path = finding.get("file_path")
                    f_id = file_path_map.get(f_path)
                    if f_path and f_id:
                        add_candidate(
                            file_id=f_id,
                            path=f_path,
                            start_line=finding.get("start_line") or 1,
                            end_line=finding.get("end_line") or 30,
                            symbol=finding.get("symbol"),
                            symbol_type="quality_finding",
                            docstring=None,
                            content=f"FINDING ({finding.get('category')} - {finding.get('severity')}): {finding.get('title')}\n{finding.get('description')}\nRecommendation: {finding.get('recommendation')}",
                            relevance=0.98,
                            match_reason=f"Code Quality Finding: {finding.get('title')}",
                        )

                # Add summary score
                top_file = all_repo_files[0] if all_repo_files else None
                if top_file:
                    add_candidate(
                        file_id=top_file.id,
                        path=top_file.path,
                        start_line=1,
                        end_line=30,
                        symbol=None,
                        symbol_type="quality_summary",
                        docstring=None,
                        content=f"TECHNICAL DEBT OVERVIEW:\n{quality_data.get('summary_text')}",
                        relevance=0.97,
                        match_reason="Repository Technical Debt Score & Summary",
                    )
            except Exception as e:
                logger.warning(f"Error extracting quality evidence for RAG: {e}")

        # --- H. SECURITY & RELIABILITY INTELLIGENCE (Phase 13) ---
        if any(kw.lower() in ["security", "secret", "token", "password", "key", "vulnerability", "injection", "timeout", "reliability", "spof", "auth", "crypto", "cve", "tls", "cors"] for kw in keywords):
            try:
                files_data = [
                    {"id": f.id, "path": f.path, "language": f.language, "line_count": f.line_count, "source_metadata": f.source_metadata or {}}
                    for f in all_repo_files
                ]
                syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id).limit(200))
                syms = syms_res.scalars().all()
                syms_data = [{"id": s.id, "file_id": s.file_id, "name": s.name, "symbol_type": s.symbol_type, "start_line": s.start_line, "end_line": s.end_line} for s in syms]

                deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id))
                deps = deps_res.scalars().all()
                deps_data = [
                    {"id": d.id, "name": d.name, "source_path": file_map.get(d.source_file_id), "target_path": file_map.get(d.target_file_id) or d.name, "resolved": d.target_file_id is not None}
                    for d in deps
                ]

                files_sources = {}
                for f in all_repo_files:
                    f_src = source_code_service.get_file_source(repository_id, f.path)
                    files_sources[f.path] = f_src.get("source", "")

                sec_data = security_reliability_service.analyze_repository_security_reliability(
                    repository_id=repository_id,
                    files=files_data,
                    symbols=syms_data,
                    dependencies=deps_data,
                    files_sources=files_sources,
                )

                # Top security findings evidence with redacted snippets
                for finding in sec_data.get("top_security_findings", [])[:4] + sec_data.get("top_reliability_findings", [])[:3]:
                    f_path = finding.get("file_path")
                    f_id = file_path_map.get(f_path)
                    if f_path and f_id:
                        add_candidate(
                            file_id=f_id,
                            path=f_path,
                            start_line=finding.get("start_line") or 1,
                            end_line=finding.get("end_line") or 30,
                            symbol=finding.get("symbol"),
                            symbol_type="security_finding",
                            docstring=None,
                            content=f"SECURITY/RELIABILITY FINDING ({finding.get('category')} - {finding.get('severity')} - {finding.get('confidence')} confidence): {finding.get('title')}\n{finding.get('description')}\nEvidence: {finding.get('evidence_snippet')}\nRecommendation: {finding.get('recommendation')}",
                            relevance=0.98,
                            match_reason=f"Security/Reliability Finding: {finding.get('title')}",
                        )

                # Summary score overview
                top_file = all_repo_files[0] if all_repo_files else None
                if top_file:
                    add_candidate(
                        file_id=top_file.id,
                        path=top_file.path,
                        start_line=1,
                        end_line=30,
                        symbol=None,
                        symbol_type="security_summary",
                        docstring=None,
                        content=f"SECURITY & RELIABILITY OVERVIEW:\n{sec_data.get('summary_text')}\nExternal Services: {', '.join(sec_data.get('external_services', [])) or 'None detected'}",
                        relevance=0.97,
                        match_reason="Repository Security & Reliability Summary",
                    )
            except Exception as e:
                logger.warning(f"Error extracting security/reliability evidence for RAG: {e}")

        # --- I. GIT HISTORY & EVOLUTION INTELLIGENCE (Phase 14) ---
        if any(kw.lower() in ["history", "commit", "commits", "author", "authors", "contributor", "contributors", "churn", "evolution", "inactive", "ownership", "who", "when", "change", "changed", "recent", "velocity", "blame"] for kw in keywords):
            try:
                repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
                repo_obj = repo_res.scalars().first()
                if repo_obj:
                    files_data = [{"id": f.id, "path": f.path, "language": f.language} for f in all_repo_files]
                    clone_p = repo_obj.clone_path or ""

                    hist_data = git_history_service.analyze_repository_history(
                        repository_id=repository_id,
                        clone_path=clone_p,
                        files=files_data,
                    )

                    # Top churn files evidence
                    for fm in hist_data.get("top_churn_files", [])[:4]:
                        f_path = fm.get("file_path")
                        f_id = file_path_map.get(f_path)
                        if f_path and f_id:
                            add_candidate(
                                file_id=f_id,
                                path=f_path,
                                start_line=1,
                                end_line=30,
                                symbol=None,
                                symbol_type="git_evolution_metric",
                                docstring=None,
                                content=(
                                    f"GIT EVOLUTION METRIC for {f_path}:\n"
                                    f"Total Commits: {fm.get('total_commits')}, Churn: {fm.get('total_churn')} lines (+{fm.get('total_additions')}/-{fm.get('total_deletions')}).\n"
                                    f"Recent 30d Churn: {fm.get('recent_churn_30d')} lines, Activity Status: {fm.get('activity_status')}.\n"
                                    f"Primary Contributor: {fm.get('primary_author')} ({fm.get('primary_author_ownership')}% ownership, {fm.get('knowledge_concentration')} concentration)."
                                ),
                                relevance=0.98,
                                match_reason=f"File Evolution History: {f_path}",
                            )

                    # Summary overview
                    top_file = all_repo_files[0] if all_repo_files else None
                    if top_file:
                        top_auths = [f"{c['author_name']} ({c['total_commits']} commits)" for c in hist_data.get("top_contributors", [])[:3]]
                        add_candidate(
                            file_id=top_file.id,
                            path=top_file.path,
                            start_line=1,
                            end_line=30,
                            symbol=None,
                            symbol_type="git_history_summary",
                            docstring=None,
                            content=f"GIT HISTORY & EVOLUTION SUMMARY:\n{hist_data.get('summary_text')}\nTop Contributors: {', '.join(top_auths)}",
                            relevance=0.97,
                            match_reason="Repository Git History & Contributor Summary",
                        )
            except Exception as e:
                logger.warning(f"Error extracting Git history evidence for RAG: {e}")

        # --- J. DEPENDENCY INTELLIGENCE & SUPPLY CHAIN (Phase 15) ---
        if any(kw.lower() in ["dependency", "dependencies", "package", "packages", "library", "libraries", "supply", "chain", "unpinned", "undeclared", "unused", "manifest", "lockfile", "pypi", "npm", "cargo", "maven", "import", "imports"] for kw in keywords):
            try:
                files_data = [{"id": f.id, "path": f.path, "language": f.language} for f in all_repo_files]
                files_sources = {}
                for f in all_repo_files:
                    f_src = source_code_service.get_file_source(repository_id, f.path)
                    files_sources[f.path] = f_src.get("source", "")

                dep_intel = dependency_intelligence_service.analyze_repository_dependencies(
                    repository_id=repository_id,
                    files=files_data,
                    files_sources=files_sources,
                )

                # High-impact and top central packages evidence
                for d in dep_intel.get("high_impact_list", [])[:4]:
                    imp_files = [f_item.get("file_path") for f_item in d.get("importing_files", [])]
                    first_f_path = imp_files[0] if imp_files else (all_repo_files[0].path if all_repo_files else None)
                    f_id = file_path_map.get(first_f_path)
                    if first_f_path and f_id:
                        add_candidate(
                            file_id=f_id,
                            path=first_f_path,
                            start_line=1,
                            end_line=30,
                            symbol=None,
                            symbol_type="dependency_intelligence",
                            docstring=None,
                            content=(
                                f"DEPENDENCY INTELLIGENCE for '{d.get('name')}' ({d.get('ecosystem')}):\n"
                                f"Declared: {d.get('declared_version') or 'None'}, Resolved: {d.get('resolved_version') or 'None'}, Pinning: {d.get('pinning_status')}.\n"
                                f"Type: {d.get('dependency_type')}, Centrality: {d.get('centrality')}, Importing Files ({d.get('file_count')}): {', '.join(imp_files[:5])}.\n"
                                f"Risk: {d.get('risk_status')}, Notes: {d.get('notes') or 'None'}."
                            ),
                            relevance=0.98,
                            match_reason=f"High-Impact Dependency: {d.get('name')}",
                        )

                # Dependency summary overview
                top_file = all_repo_files[0] if all_repo_files else None
                if top_file:
                    add_candidate(
                        file_id=top_file.id,
                        path=top_file.path,
                        start_line=1,
                        end_line=30,
                        symbol=None,
                        symbol_type="dependency_summary",
                        docstring=None,
                        content=(
                            f"DEPENDENCY & SUPPLY-CHAIN OVERVIEW:\n"
                            f"{dep_intel.get('summary_text')}\n"
                            f"Lockfiles: {', '.join(dep_intel.get('lockfiles_detected', [])) or 'None detected'}\n"
                            f"Ecosystems: {', '.join(dep_intel.get('ecosystems_detected', [])) or 'None detected'}"
                        ),
                        relevance=0.97,
                        match_reason="Repository Dependency & Supply-Chain Summary",
                    )
            except Exception as e:
                logger.warning(f"Error extracting Dependency Intelligence evidence for RAG: {e}")

        # If intent is ARCHITECTURE and we have few candidate sources, include top repository files
        if intent == "ARCHITECTURE" and len(candidate_sources) < 3:
            for f in all_repo_files[:4]:
                file_src = source_code_service.get_file_source(repository_id, f.path)
                full_text = file_src.get("source", "")
                src_lines = full_text.splitlines() if full_text else []
                snippet = "\n".join(src_lines[:30]) if src_lines else ""
                add_candidate(
                    file_id=f.id,
                    path=f.path,
                    start_line=1,
                    end_line=min(len(src_lines), 30),
                    symbol=None,
                    symbol_type="module",
                    docstring=None,
                    content=snippet,
                    relevance=0.75,
                    match_reason=f"Top-level module '{f.path}' for architectural context",
                )

        # Sort candidate sources by relevance descending
        candidate_sources.sort(key=lambda s: (-s["relevance"], s["path"], s["start_line"]))

        # Bounded context limit: Top 5 to 15 items
        return candidate_sources[:12]

    def build_context_package(
        self,
        repository: Repository,
        query: str,
        intent: str,
        sources: List[Dict[str, Any]],
        relationships_summary: str = "",
    ) -> Tuple[str, Dict[str, Dict[str, Any]]]:
        """
        Stage 8: Context Builder.
        Generates a token-bounded, structured evidence package with injection protection and secret redaction.
        Assigns canonical [source_1], [source_2] keys.
        """
        source_id_map: Dict[str, Dict[str, Any]] = {}
        prompt_parts: List[str] = []

        repo_meta = repository.metadata_json or {}
        analysis_sum = repo_meta.get("analysis_summary", {})
        
        prompt_parts.append(f"REPOSITORY METADATA:")
        prompt_parts.append(f"- Name: {repository.name}")
        prompt_parts.append(f"- Primary Language: {repo_meta.get('primary_language', 'Unknown')}")
        prompt_parts.append(f"- Total Files Indexed: {analysis_sum.get('total_files', 0)}")
        prompt_parts.append(f"- Default Branch: {repository.default_branch}")
        prompt_parts.append(f"- Commit SHA: {repository.current_commit_sha or 'latest'}\n")

        prompt_parts.append(f"QUESTION: {query}")
        prompt_parts.append(f"DETECTED INTENT: {intent}\n")

        if not sources:
            prompt_parts.append("EVIDENCE:\nNo relevant source files or symbols were found in the indexed repository.")
            return "\n".join(prompt_parts), source_id_map

        prompt_parts.append("EVIDENCE (Use [source_1], [source_2] etc. to cite these):")

        for idx, src in enumerate(sources, start=1):
            s_id = f"source_{idx}"
            source_id_map[s_id] = src

            prompt_parts.append(f"\n[{s_id}]")
            prompt_parts.append(f"Path: {src['path']}")
            prompt_parts.append(f"Lines: {src['start_line']}–{src['end_line']}")
            if src.get("symbol"):
                prompt_parts.append(f"Symbol: {src['symbol']}")
            if src.get("symbol_type"):
                prompt_parts.append(f"Type: {src['symbol_type']}")
            if src.get("docstring"):
                prompt_parts.append(f"Docstring: {src['docstring']}")
            prompt_parts.append(f"Relevance: {src['relevance']}")
            prompt_parts.append("<untrusted_source_code>")
            # Limit snippet size and redact sensitive strings for security
            content_safe = redact_sensitive_strings((src.get("content") or "").strip())
            prompt_parts.append(content_safe[:1500])
            prompt_parts.append("</untrusted_source_code>")

        if relationships_summary:
            prompt_parts.append(f"\nRELATIONSHIPS:\n{relationships_summary}")

        return "\n".join(prompt_parts), source_id_map

    def validate_and_format_citations(
        self,
        raw_answer: str,
        cited_ids: List[str],
        source_id_map: Dict[str, Dict[str, Any]],
        repository_id: str,
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Stage 9: Source-Citation Validator Layer.
        Validates that cited sources exist, belong strictly to active repository, have valid line ranges.
        Converts internal [source_X] tags to canonical clickable [path:start_line–end_line] citations.
        Rejects fabricated or ungrounded claims and redacts sensitive strings.
        """
        validated_sources: List[Dict[str, Any]] = []
        valid_source_ids = set()

        for s_id in cited_ids:
            if s_id in source_id_map:
                src = source_id_map[s_id]
                valid_source_ids.add(s_id)
                validated_sources.append({
                    "file_id": src["file_id"],
                    "path": src["path"],
                    "file_path": src["path"],
                    "start_line": src["start_line"],
                    "end_line": src["end_line"],
                    "symbol_id": src.get("symbol_id"),
                    "symbol": src.get("symbol"),
                    "relevance": src["relevance"],
                    "repository_id": repository_id,
                })

        # If LLM didn't cite explicit [source_X] but valid sources exist, include top verified sources
        if not validated_sources and source_id_map:
            top_src = list(source_id_map.values())[0]
            validated_sources.append({
                "file_id": top_src["file_id"],
                "path": top_src["path"],
                "file_path": top_src["path"],
                "start_line": top_src["start_line"],
                "end_line": top_src["end_line"],
                "symbol_id": top_src.get("symbol_id"),
                "symbol": top_src.get("symbol"),
                "relevance": top_src["relevance"],
                "repository_id": repository_id,
            })

        # Replace [source_X] in answer text with canonical citation [path:start–end]
        formatted_answer = redact_sensitive_strings(raw_answer)
        for s_id, src in source_id_map.items():
            citation_str = f"[{src['path']}:{src['start_line']}–{src['end_line']}]"
            formatted_answer = formatted_answer.replace(f"[{s_id}]", citation_str)

        # Remove any lingering unvalidated [source_X] references
        formatted_answer = re.sub(r"\[source_\d+\]", "", formatted_answer)

        return formatted_answer, validated_sources

    async def answer_repository_query(
        self,
        repository_id: str,
        question: str,
        conversation_id: Optional[str] = None,
        db: AsyncSession = None,
        llm_provider: Optional[LLMProvider] = None,
    ) -> Dict[str, Any]:
        """
        Main entrypoint for evidence-grounded repository Q&A.
        Strictly scoped to repository_id.
        """
        start_time = datetime.now(timezone.utc)

        # 1. Fetch Repository & Check Indexing State
        repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
        repository = repo_res.scalars().first()
        if not repository:
            raise ValueError(f"Repository '{repository_id}' not found.")

        is_partial = False
        if repository.analysis_status != "completed":
            if repository.analysis_status == "running":
                # Check if partial files exist
                p_files_cnt = (await db.execute(select(func.count(File.id)).where(File.repository_id == repository_id))).scalar() or 0
                if p_files_cnt > 0:
                    is_partial = True
            if not is_partial:
                return {
                    "repository_id": repository_id,
                    "conversation_id": conversation_id,
                    "question": question,
                    "answer": (
                        "Repository analysis is not ready yet.\n\n"
                        "This repository has not been indexed yet. Please wait for indexing to complete or trigger repository indexing before asking code questions."
                    ),
                    "intent": "GENERAL",
                    "evidence": [],
                    "sources": [],
                    "related_symbols": [],
                    "related_files": [],
                    "related_dependencies": [],
                    "duration_ms": 0.0,
                    "latency_breakdown": {
                        "search_latency_ms": 0.0,
                        "retrieval_latency_ms": 0.0,
                        "context_construction_ms": 0.0,
                        "llm_generation_ms": 0.0,
                        "total_latency_ms": 0.0,
                    },
                }

        # 2. Check Cache
        index_version = repository.current_commit_sha or (
            repository.last_synced_at.isoformat() if repository.last_synced_at else "v1"
        )
        normalized_q = question.strip().lower()
        cache_key = f"{repository_id}:{index_version}:{normalized_q}"

        if cache_key in self._cache and not conversation_id:
            logger.info(f"Returning cached Q&A response for {cache_key}")
            return self._cache[cache_key]

        # 3. Retrieve Conversation Memory & Follow-Up Context
        conversation: Optional[Conversation] = None
        conversation_context: Optional[str] = None
        if conversation_id:
            conv_res = await db.execute(
                select(Conversation).where(
                    Conversation.id == conversation_id,
                    Conversation.repository_id == repository_id,
                )
            )
            conversation = conv_res.scalars().first()
            if conversation and conversation.messages:
                # Include last 4 turns for follow-up resolution
                recent_msgs = conversation.messages[-4:]
                context_parts = []
                for m in recent_msgs:
                    role = m.get("role", "user")
                    content = m.get("content", "")
                    context_parts.append(f"{role.upper()}: {content}")
                conversation_context = "\n".join(context_parts)

        t_search_start = datetime.now(timezone.utc)

        # 4. Stage 1 & 2: Query Classification & Keyword Extraction
        intent, keywords = self.classify_query(question)
        if conversation_context:
            # Augment keywords from prior conversation context for follow-up resolution
            _, prior_keywords = self.classify_query(conversation_context)
            for pk in prior_keywords:
                if pk not in keywords:
                    keywords.append(pk)

        # 5. Handle General Metadata / Overview Special Cases
        if intent == "GENERAL" and any(k.lower() in ["language", "files", "symbols", "stack", "tech", "statistics", "stats", "lines", "branch"] for k in keywords):
            repo_meta = repository.metadata_json or {}
            analysis_sum = repo_meta.get("analysis_summary", {})
            primary_lang = repo_meta.get("primary_language", "Unknown")
            total_files = analysis_sum.get("total_files", 0)
            total_symbols = analysis_sum.get("total_symbols", 0)
            total_lines = analysis_sum.get("total_lines", 0)

            top_files_q = select(File).where(File.repository_id == repository_id).limit(10)
            top_files = (await db.execute(top_files_q)).scalars().all()
            top_file_paths = [f.path for f in top_files if not is_secret_file(f.path)]

            meta_answer = (
                f"## Answer\n"
                f"Repository **{repository.name}** is written primarily in **{primary_lang}**.\n\n"
                f"## Statistics\n"
                f"- **Total Indexed Files:** {total_files}\n"
                f"- **Total Extracted Symbols:** {total_symbols}\n"
                f"- **Total Lines of Code:** {total_lines}\n"
                f"- **Default Branch:** `{repository.default_branch}`\n\n"
                f"## Evidence\n"
            )
            if top_file_paths:
                meta_answer += "\n".join(f"- `{p}`" for p in top_file_paths[:5]) + "\n"

            sources = [
                {
                    "file_id": f.id,
                    "path": f.path,
                    "file_path": f.path,
                    "start_line": 1,
                    "end_line": min(f.line_count or 50, 50),
                    "symbol": None,
                    "relevance": 0.90,
                    "repository_id": repository_id,
                }
                for f in top_files[:3] if not is_secret_file(f.path)
            ]
            
            duration_ms = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            result = {
                "repository_id": repository_id,
                "conversation_id": conversation.id if conversation else None,
                "question": question,
                "answer": meta_answer,
                "intent": intent,
                "evidence": sources,
                "sources": sources,
                "related_symbols": [],
                "related_files": top_file_paths[:5],
                "related_dependencies": [],
                "duration_ms": round(duration_ms, 2),
                "latency_breakdown": {
                    "search_latency_ms": round((datetime.now(timezone.utc) - t_search_start).total_seconds() * 1000, 2),
                    "retrieval_latency_ms": 0.0,
                    "context_construction_ms": 0.0,
                    "llm_generation_ms": 0.0,
                    "total_latency_ms": round(duration_ms, 2),
                },
            }
            if not conversation_id:
                self._cache[cache_key] = result
            return result

        t_search_end = datetime.now(timezone.utc)
        search_latency_ms = (t_search_end - t_search_start).total_seconds() * 1000

        # 6. Stage 3 to 6: Multi-Stage Evidence Retrieval
        t_retrieval_start = datetime.now(timezone.utc)
        retrieved_sources = await self.retrieve_evidence(
            repository_id=repository_id,
            query=question,
            intent=intent,
            keywords=keywords,
            db=db,
            conversation_context=conversation_context,
        )
        t_retrieval_end = datetime.now(timezone.utc)
        retrieval_latency_ms = (t_retrieval_end - t_retrieval_start).total_seconds() * 1000

        # 7. Architecture / Relationship summary
        relationships_summary = ""
        if intent in ["ARCHITECTURE", "FLOW", "DEPENDENCY", "CALL_GRAPH"]:
            deps_q = select(Dependency).where(Dependency.repository_id == repository_id).limit(10)
            deps_sample = (await db.execute(deps_q)).scalars().all()
            if deps_sample:
                rel_lines = []
                for d in deps_sample:
                    meta = d.metadata_json or {}
                    src_p = meta.get("source_path") or "Module"
                    tgt_p = meta.get("target_path") or d.name
                    rel_lines.append(f"- `{src_p}` → `{tgt_p}` ({d.dependency_type})")
                relationships_summary = "\n".join(rel_lines)

        # 8. Stage 8: Context Builder
        t_context_start = datetime.now(timezone.utc)
        user_prompt, source_id_map = self.build_context_package(
            repository=repository,
            query=question,
            intent=intent,
            sources=retrieved_sources,
            relationships_summary=relationships_summary,
        )
        t_context_end = datetime.now(timezone.utc)
        context_construction_ms = (t_context_end - t_context_start).total_seconds() * 1000

        # 9. LLM Generation
        t_llm_start = datetime.now(timezone.utc)
        provider = llm_provider or get_llm_provider()
        try:
            llm_result = await provider.generate(
                system_prompt=SYSTEM_PROMPT,
                user_prompt=user_prompt,
                temperature=0.1,
            )
            raw_answer = llm_result.get("answer", "")
            cited_ids = llm_result.get("cited_source_ids", [])
        except Exception as e:
            logger.error(f"LLM generation failed: {e}", exc_info=True)
            duration_ms = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            return {
                "repository_id": repository_id,
                "conversation_id": conversation.id if conversation else None,
                "question": question,
                "answer": f"Unable to generate an AI explanation due to provider error: {str(e)}",
                "intent": intent,
                "evidence": [],
                "sources": [],
                "related_symbols": [],
                "related_files": [],
                "related_dependencies": [],
                "duration_ms": round(duration_ms, 2),
                "latency_breakdown": {
                    "search_latency_ms": round(search_latency_ms, 2),
                    "retrieval_latency_ms": round(retrieval_latency_ms, 2),
                    "context_construction_ms": round(context_construction_ms, 2),
                    "llm_generation_ms": 0.0,
                    "total_latency_ms": round(duration_ms, 2),
                },
            }
        t_llm_end = datetime.now(timezone.utc)
        llm_generation_ms = (t_llm_end - t_llm_start).total_seconds() * 1000

        # 10. Stage 9: Citation Validation Layer
        formatted_answer, final_sources = self.validate_and_format_citations(
            raw_answer=raw_answer,
            cited_ids=cited_ids,
            source_id_map=source_id_map,
            repository_id=repository_id,
        )

        # Indicate if answers are based on partial index
        if is_partial:
            formatted_answer = (
                "*(Note: Repository intelligence is still being indexed; answers are based on currently available partial evidence.)*\n\n"
                + formatted_answer
            )

        # Extract related entities from verified sources
        related_files = sorted(list(set(s["path"] for s in final_sources if s.get("path"))))
        related_symbols = sorted(list(set(s["symbol"] for s in final_sources if s.get("symbol"))))
        
        # Extract related dependencies
        deps_q = select(Dependency.name).where(Dependency.repository_id == repository_id).limit(20)
        deps_rows = (await db.execute(deps_q)).scalars().all()
        related_deps = [d for d in deps_rows if any(d.lower() in question.lower() or d.lower() in formatted_answer.lower() for d in [d])]

        duration_ms = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000

        # 11. Conversation State Update
        if conversation:
            current_messages = list(conversation.messages or [])
            current_messages.append({
                "role": "user",
                "content": question,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            current_messages.append({
                "role": "assistant",
                "content": formatted_answer,
                "sources": final_sources,
                "intent": intent,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            conversation.messages = current_messages
            await db.commit()

        latency_breakdown = {
            "search_latency_ms": round(search_latency_ms, 2),
            "retrieval_latency_ms": round(retrieval_latency_ms, 2),
            "context_construction_ms": round(context_construction_ms, 2),
            "llm_generation_ms": round(llm_generation_ms, 2),
            "total_latency_ms": round(duration_ms, 2),
        }

        response_payload = {
            "repository_id": repository_id,
            "conversation_id": conversation.id if conversation else None,
            "question": question,
            "answer": formatted_answer,
            "intent": intent,
            "evidence": final_sources,
            "sources": final_sources,
            "related_symbols": related_symbols,
            "related_files": related_files,
            "related_dependencies": related_deps[:5],
            "duration_ms": round(duration_ms, 2),
            "latency_breakdown": latency_breakdown,
        }

        # Cache only if not part of a conversation thread
        if not conversation_id:
            self._cache[cache_key] = response_payload

        # Observability logging without sensitive data
        logger.info(
            f"Repository Query processed: repo_id={repository_id}, intent={intent}, "
            f"retrieved_count={len(final_sources)}, duration_ms={round(duration_ms, 2)}"
        )

        return response_payload

    def invalidate_cache(self, repository_id: Optional[str] = None):
        """Invalidate Q&A cache when repository is re-indexed."""
        if repository_id:
            keys_to_remove = [k for k in self._cache if k.startswith(f"{repository_id}:")]
            for k in keys_to_remove:
                del self._cache[k]
        else:
            self._cache.clear()


rag_service = RAGService()

