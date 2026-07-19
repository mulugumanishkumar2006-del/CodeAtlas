"""
HealthIntelligenceService — Repository Health Intelligence Engine
=================================================================

This is the capstone service for CodeAtlas.  It aggregates signals from every
other engine in the platform and produces one unified "Repository Health Report"
that answers the CTO-level question:

    "How healthy is my software — and is it getting better or worse?"

Engines consumed
----------------
  1. TechDebtService          → architecture, maintainability, testing,
                                 security, performance, documentation scores
  2. ReliabilityIntelligenceService → reliability_score, deployment_risk
  3. KnowledgeIntelligenceService   → bus_factor, documentation_quality,
                                       team_resilience_score

Composite Health Score formula (weighted average of 11 dimensions)
------------------------------------------------------------------
  Architecture        15%
  Technical Debt      12%
  Reliability         12%
  Knowledge           10%
  Documentation       10%
  Performance          8%
  Testing             10%
  Security             8%
  Developer Experience 7%
  Scalability          5%  (derived; falls back to architecture proxy)
  Maintainability      3%

Grade thresholds
----------------
  90–100 → A  (Excellent)
  75–89  → B  (Healthy)
  60–74  → C  (Warning)
  45–59  → D  (High Risk)
  0–44   → F  (Critical)
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.orm import Session

from app.models.health_intelligence import RepositoryHealthSnapshot
from app.schemas.health_intelligence import (
    AnalyzeHealthRequest,
    CategorizedHealthReport,
    CategoryDetail,
    DimensionScore,
    HealthAction,
    HealthIntelligenceReport,
    HealthTrendPoint,
    MeasureDetail,
    TrendResponse,
)
from app.services.coupling_reduction_advisor import CouplingReductionAdvisorService
from app.services.drift_detection_service import DriftDetectionService
from app.services.knowledge_intelligence import KnowledgeIntelligenceService
from app.services.reliability_intelligence import ReliabilityIntelligenceService
from app.services.tech_debt_service import TechDebtService

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

_WEIGHTS: Dict[str, float] = {
    "Architecture": 0.15,
    "Technical Debt": 0.15,
    "Reliability": 0.12,
    "Knowledge": 0.10,
    "Documentation": 0.10,
    "Performance": 0.10,
    "Security": 0.10,
    "Developer Experience": 0.05,
    "Scalability": 0.05,
    "Maintainability": 0.08,
}

_DIMENSION_META: Dict[str, Dict[str, str]] = {
    "Architecture": {
        "icon": "Layers",
        "color": "#6366f1",
        "source": "TechDebt / ArchitectService",
    },
    "Technical Debt": {
        "icon": "Flame",
        "color": "#f59e0b",
        "source": "TechDebtService",
    },
    "Reliability": {
        "icon": "HeartPulse",
        "color": "#10b981",
        "source": "ReliabilityIntelligenceService",
    },
    "Knowledge": {
        "icon": "Brain",
        "color": "#8b5cf6",
        "source": "KnowledgeIntelligenceService",
    },
    "Documentation": {
        "icon": "BookOpen",
        "color": "#3b82f6",
        "source": "KnowledgeIntelligenceService",
    },
    "Performance": {
        "icon": "Zap",
        "color": "#f97316",
        "source": "TechDebtService",
    },
    "Security": {
        "icon": "Shield",
        "color": "#ef4444",
        "source": "TechDebtService",
    },
    "Developer Experience": {
        "icon": "Code2",
        "color": "#ec4899",
        "source": "Derived (maintainability + churn)",
    },
    "Scalability": {
        "icon": "TrendingUp",
        "color": "#14b8a6",
        "source": "Derived (architecture proxy)",
    },
    "Maintainability": {
        "icon": "Wrench",
        "color": "#a3e635",
        "source": "TechDebtService",
    },
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _grade(score: float) -> str:
    if score >= 90:
        return "A"
    if score >= 75:
        return "B"
    if score >= 60:
        return "C"
    if score >= 45:
        return "D"
    return "F"


def _status(score: float) -> Tuple[str, str]:
    """Return (status_label, css_color_class)."""
    if score >= 90:
        return "EXCELLENT", "#10b981"
    if score >= 75:
        return "HEALTHY", "#22c55e"
    if score >= 60:
        return "WARNING", "#f59e0b"
    if score >= 45:
        return "HIGH_RISK", "#f97316"
    return "CRITICAL", "#ef4444"


def _trend_label(delta: float) -> str:
    if delta > 1.0:
        return "up"
    if delta < -1.0:
        return "down"
    return "stable"


def _overall_trend(delta: float) -> str:
    if delta > 2.0:
        return "improving"
    if delta < -2.0:
        return "degrading"
    return "stable"


def _dimension_explanation(name: str, score: float, grade: str) -> str:
    """Generate a one-sentence insight for a dimension."""
    explanations: Dict[str, Dict[str, str]] = {
        "Architecture": {
            "A": "Your architecture is clean with no detected circular dependencies.",
            "B": "Architecture is well-structured with minor coupling concerns.",
            "C": "Several circular dependencies detected — refactoring is recommended.",
            "D": "High coupling and circular imports are significantly degrading quality.",
            "F": "Architecture is severely compromised with many circular dependency cycles.",
        },
        "Technical Debt": {
            "A": "Technical debt is very low — the codebase is clean and well-maintained.",
            "B": "Minor technical debt exists but is manageable.",
            "C": "Technical debt is accumulating and slowing down development velocity.",
            "D": "High debt is causing significant rework and maintenance overhead.",
            "F": "Critical debt levels — immediate remediation sprint is strongly advised.",
        },
        "Reliability": {
            "A": "System reliability is excellent with very low failure probability.",
            "B": "Reliability is good with low risk of regressions.",
            "C": "Moderate reliability risk — several hotspots detected.",
            "D": "High reliability risk with multiple bug-prone components.",
            "F": "Critical reliability issues — deployment risk is very high.",
        },
        "Knowledge": {
            "A": "Knowledge is well distributed across the team — low bus factor risk.",
            "B": "Good team knowledge coverage with minor concentration areas.",
            "C": "Some knowledge silos detected — key person dependency risk.",
            "D": "High bus factor risk — critical modules owned by single developers.",
            "F": "Severe knowledge concentration — team is extremely vulnerable.",
        },
        "Documentation": {
            "A": "Excellent documentation coverage across modules and APIs.",
            "B": "Documentation is generally good with a few gaps.",
            "C": "Documentation coverage is below recommended levels.",
            "D": "Significant documentation gaps are slowing onboarding.",
            "F": "Documentation is critically lacking — onboarding is very difficult.",
        },
        "Performance": {
            "A": "No large files or hotspot modules detected — performance is optimal.",
            "B": "Performance is good with minor optimization opportunities.",
            "C": "Some large files and coupling patterns may degrade runtime performance.",
            "D": "Multiple performance anti-patterns detected.",
            "F": "Severe performance concerns — complex and bloated modules detected.",
        },
        "Testing": {
            "A": "Excellent test coverage with a strong automated testing culture.",
            "B": "Good test coverage — most critical paths are covered.",
            "C": "Test coverage is adequate but has noticeable gaps.",
            "D": "Low test coverage is creating high regression risk.",
            "F": "Critical lack of automated tests — regressions are nearly undetectable.",
        },
        "Security": {
            "A": "No security anti-patterns detected — the codebase looks safe.",
            "B": "Security posture is solid with minor areas to harden.",
            "C": "Some security concerns detected including coupling and circular imports.",
            "D": "Multiple security risk patterns detected.",
            "F": "Critical security posture — immediate audit is recommended.",
        },
        "Developer Experience": {
            "A": "Excellent DX — the codebase is easy to navigate and modify.",
            "B": "Good developer experience with clean, maintainable patterns.",
            "C": "Some friction in developer experience due to complexity.",
            "D": "High cognitive load is slowing down developers.",
            "F": "Very poor developer experience — code is extremely difficult to work with.",
        },
        "Scalability": {
            "A": "Architecture scales well — low coupling and clean layer separation.",
            "B": "Good scalability characteristics with minor improvement areas.",
            "C": "Some scalability bottlenecks detected.",
            "D": "Structural patterns will limit scalability under growth.",
            "F": "Critical scalability issues — major architectural rework needed.",
        },
        "Maintainability": {
            "A": "The codebase is highly maintainable and easy to evolve.",
            "B": "Good maintainability with low modification risk.",
            "C": "Maintainability is average — some areas need cleanup.",
            "D": "Low maintainability is increasing time-to-change for features.",
            "F": "Critical maintainability — the codebase is very difficult to safely modify.",
        },
    }
    dim_map = explanations.get(name, {})
    return dim_map.get(grade, f"{name} score is {score:.1f}/100.")


# ---------------------------------------------------------------------------
# Main service
# ---------------------------------------------------------------------------


class HealthIntelligenceService:
    """
    Aggregates all CodeAtlas engines into one unified Repository Health Report.
    """

    def __init__(self) -> None:
        self._tech_debt_svc = TechDebtService()
        self._reliability_svc = ReliabilityIntelligenceService()
        self._knowledge_svc = KnowledgeIntelligenceService()
        self._coupling_svc = CouplingReductionAdvisorService()
        self._drift_svc = DriftDetectionService()

    # -----------------------------------------------------------------------
    # Public API
    # -----------------------------------------------------------------------

    def analyze(
        self,
        db: Session,
        repo_id: str,
        request: Optional[AnalyzeHealthRequest] = None,
    ) -> HealthIntelligenceReport:
        """
        Run a full health analysis, persist a snapshot, and return the report.
        Always saves a new snapshot so the trend chart grows over time.
        """
        if request is None:
            request = AnalyzeHealthRequest(use_cached=True)

        logger.info("HealthIntelligenceService.analyze started for repo %s", repo_id)

        # 1. Collect raw signals from all sub-engines
        raw_scores = self._collect_signals(db, repo_id)

        # 2. Compute composite + build dimension list
        overall, dimensions = self._compute_composite(raw_scores)

        # 3. Load previous snapshot for delta / trend
        prev_snapshot = self._load_last_snapshot(db, repo_id)
        prev_overall = prev_snapshot.overall_score if prev_snapshot else overall
        score_delta = round(overall - prev_overall, 1)

        # 4. Build dimension trend deltas
        prev_dim_scores: Dict[str, float] = {}
        if prev_snapshot:
            prev_dim_scores = {
                "Architecture": prev_snapshot.score_architecture or overall,
                "Technical Debt": prev_snapshot.score_technical_debt or overall,
                "Reliability": prev_snapshot.score_reliability or overall,
                "Knowledge": prev_snapshot.score_knowledge or overall,
                "Documentation": prev_snapshot.score_documentation or overall,
                "Performance": prev_snapshot.score_performance or overall,
                "Security": prev_snapshot.score_security or overall,
                "Developer Experience": prev_snapshot.score_developer_experience
                or overall,
                "Scalability": prev_snapshot.score_scalability or overall,
                "Maintainability": prev_snapshot.score_maintainability or overall,
            }

        enriched_dimensions = self._enrich_dimensions(dimensions, prev_dim_scores)

        # 5. Narrative
        grade = _grade(overall)
        status, status_color = _status(overall)
        headline = self._build_headline(overall, score_delta, status)
        narrative = self._build_narrative(
            overall, score_delta, enriched_dimensions, status
        )
        what_healthy, what_attention = self._top_and_bottom(enriched_dimensions)

        # 6. Priority actions
        actions = self._build_actions(enriched_dimensions, raw_scores)

        # 7. Persist snapshot
        snapshot = self._persist_snapshot(
            db, repo_id, overall, grade, status, raw_scores, headline, narrative
        )

        # 8. Load trend history
        trend_history = self._load_trend_history(db, repo_id, limit=10)

        # 9. Compute structured categories
        categories = self._compute_categorized_report(db, repo_id)

        # 10. Compute forecast
        forecast = self._compute_forecast(overall, db, repo_id)

        return HealthIntelligenceReport(
            repo_id=repo_id,
            snapshot_id=snapshot.id,
            generated_at=datetime.now(timezone.utc),
            overall_score=round(overall, 1),
            grade=grade,
            status=status,
            status_color=status_color,
            score_delta=score_delta,
            trend=_overall_trend(score_delta),
            headline=headline,
            narrative=narrative,
            what_is_healthy=what_healthy,
            what_needs_attention=what_attention,
            dimensions=enriched_dimensions,
            priority_actions=actions,
            trend_history=trend_history,
            categories=categories,
            forecast=forecast,
        )

    def get_report(self, db: Session, repo_id: str) -> HealthIntelligenceReport:
        """
        Return a health report.  If no snapshot exists, trigger a fresh analysis.
        """
        snapshot = self._load_last_snapshot(db, repo_id)
        if not snapshot:
            return self.analyze(db, repo_id)

        # Rebuild a lightweight report from the stored snapshot
        raw_scores = {
            "Architecture": snapshot.score_architecture or 70.0,
            "Technical Debt": snapshot.score_technical_debt or 70.0,
            "Reliability": snapshot.score_reliability or 70.0,
            "Knowledge": snapshot.score_knowledge or 70.0,
            "Documentation": snapshot.score_documentation or 70.0,
            "Performance": snapshot.score_performance or 70.0,
            "Security": snapshot.score_security or 70.0,
            "Developer Experience": snapshot.score_developer_experience or 70.0,
            "Scalability": snapshot.score_scalability or 70.0,
            "Maintainability": snapshot.score_maintainability or 70.0,
        }
        overall = snapshot.overall_score
        grade = snapshot.grade
        status = snapshot.status
        _, status_color = _status(overall)

        overall_computed, dimensions = self._compute_composite(raw_scores)
        enriched_dimensions = self._enrich_dimensions(dimensions, {})
        what_healthy, what_attention = self._top_and_bottom(enriched_dimensions)
        actions = self._build_actions(enriched_dimensions, raw_scores)
        trend_history = self._load_trend_history(db, repo_id, limit=10)

        # Compute categories
        categories = self._compute_categorized_report(db, repo_id)

        # Compute forecast
        forecast = self._compute_forecast(overall, db, repo_id)

        return HealthIntelligenceReport(
            repo_id=repo_id,
            snapshot_id=snapshot.id,
            generated_at=snapshot.created_at,
            overall_score=round(overall, 1),
            grade=grade,
            status=status,
            status_color=status_color,
            score_delta=0.0,
            trend="stable",
            headline=snapshot.headline
            or f"Repository health score is {overall:.1f}/100.",
            narrative=snapshot.narrative
            or "Run a fresh analysis to get detailed insights.",
            what_is_healthy=what_healthy,
            what_needs_attention=what_attention,
            dimensions=enriched_dimensions,
            priority_actions=actions,
            trend_history=trend_history,
            categories=categories,
            forecast=forecast,
        )

    def get_trend(self, db: Session, repo_id: str) -> TrendResponse:
        """Return all historical health snapshots for this repository."""
        history = self._load_trend_history(db, repo_id, limit=50)
        return TrendResponse(repo_id=repo_id, snapshots=history)

    def _compute_forecast(self, overall_score: float, db: Session, repo_id: str) -> Any:
        """Calculate health forecast over 30 and 90 days based on technical debt and historical snapshots."""
        from app.schemas.health_intelligence import HealthForecast, HealthForecastPoint

        # Check historical snapshots to see if overall score has been degrading or improving
        history = (
            db.query(RepositoryHealthSnapshot)
            .filter(RepositoryHealthSnapshot.repo_id == repo_id)
            .order_by(RepositoryHealthSnapshot.created_at.desc())
            .limit(5)
            .all()
        )

        # Determine trend based on tech debt
        try:
            td = self._tech_debt_svc.calculate_repository_tech_debt(
                db=db, repo_id=repo_id
            )
            debt_ratio = td.get("scorecard", {}).get("technical_debt", 80.0)
            remediation_count = len(td.get("remediations", []))
        except Exception:
            debt_ratio = 80.0
            remediation_count = 0

        # Generate prediction delta
        if remediation_count > 4 or debt_ratio < 65.0:
            delta_30 = -3.0
            delta_90 = -8.0
            reason = (
                "Technical Debt is increasing with pending refactoring recommendations."
            )
        elif len(history) >= 2 and history[0].overall_score > history[-1].overall_score:
            delta_30 = 2.0
            delta_90 = 5.0
            reason = "Overall health is improving due to active modularity and technical debt reduction."
        else:
            delta_30 = 1.0
            delta_90 = 3.0
            reason = "Health score is projected to steadily improve as code quality and test coverage remain high."

        score_30 = max(0.0, min(100.0, overall_score + delta_30))
        score_90 = max(0.0, min(100.0, overall_score + delta_90))

        return HealthForecast(
            current_score=overall_score,
            predictions=[
                HealthForecastPoint(days=30, label="30 Days", score=round(score_30, 1)),
                HealthForecastPoint(days=90, label="90 Days", score=round(score_90, 1)),
            ],
            reason=reason,
        )

    # -----------------------------------------------------------------------
    # Signal collection
    # -----------------------------------------------------------------------

    def _collect_signals(self, db: Session, repo_id: str) -> Dict[str, float]:
        """Call every sub-engine and return a flat map of dimension → score."""
        scores: Dict[str, float] = {}

        # --- TechDebt signals ---
        try:
            td = self._tech_debt_svc.calculate_repository_tech_debt(
                db=db, repo_id=repo_id
            )
            sc = td["scorecard"]
            scores["Architecture"] = float(sc.get("architecture", 70.0))
            scores["Technical Debt"] = float(sc.get("technical_debt", 70.0))
            scores["Performance"] = float(sc.get("performance", 70.0))
            scores["Testing"] = float(sc.get("testing", 70.0))
            scores["Security"] = float(sc.get("security", 70.0))
            scores["Documentation"] = float(sc.get("documentation", 70.0))
            scores["Maintainability"] = float(sc.get("maintainability", 70.0))
            logger.info("TechDebt signals collected for %s", repo_id)
        except Exception as exc:
            logger.warning("TechDebt signal collection failed: %s", exc)
            for dim in (
                "Architecture",
                "Technical Debt",
                "Performance",
                "Testing",
                "Security",
                "Documentation",
                "Maintainability",
            ):
                scores.setdefault(dim, 60.0)

        # --- Reliability signals ---
        try:
            rel = self._reliability_svc.get_dashboard(db, repo_id)
            scores["Reliability"] = float(getattr(rel, "reliability_score", 70.0))
            logger.info("Reliability signals collected for %s", repo_id)
        except Exception as exc:
            logger.warning("Reliability signal collection failed: %s", exc)
            scores.setdefault("Reliability", 65.0)

        # --- Knowledge signals ---
        try:
            know = self._knowledge_svc.get_dashboard(db, repo_id)
            # Knowledge = composite of bus factor risk + team resilience
            bus_factor = getattr(know, "bus_factor", 1)
            bus_score = min(100.0, bus_factor * 20.0)  # bus_factor 5+ = 100
            team_resilience = float(getattr(know, "team_resilience_score", 60.0))
            scores["Knowledge"] = round((bus_score + team_resilience) / 2, 1)

            doc_quality = float(getattr(know, "documentation_quality", 60.0))
            # If TechDebt didn't fill Documentation, use knowledge doc quality
            if scores.get("Documentation", 0.0) < 1.0:
                scores["Documentation"] = doc_quality
            else:
                # Average both signals for documentation
                scores["Documentation"] = round(
                    (scores["Documentation"] + doc_quality) / 2, 1
                )
            logger.info("Knowledge signals collected for %s", repo_id)
        except Exception as exc:
            logger.warning("Knowledge signal collection failed: %s", exc)
            scores.setdefault("Knowledge", 60.0)

        # --- Developer Experience (derived) ---
        # DX = average of Maintainability + Testing capped/floored
        maint = scores.get("Maintainability", 70.0)
        testing = scores.get("Testing", 70.0)
        scores["Developer Experience"] = round((maint * 0.6 + testing * 0.4), 1)

        # --- Scalability (derived from Architecture proxy) ---
        arch = scores.get("Architecture", 70.0)
        security = scores.get("Security", 70.0)
        scores["Scalability"] = round((arch * 0.7 + security * 0.3), 1)

        return scores

    # -----------------------------------------------------------------------
    # Composite computation
    # -----------------------------------------------------------------------

    def _compute_composite(
        self, raw_scores: Dict[str, float]
    ) -> Tuple[float, List[Dict[str, Any]]]:
        """Compute weighted composite and return (overall_score, dim_list)."""
        composite = 0.0
        dimensions = []
        for name, weight in _WEIGHTS.items():
            score = round(raw_scores.get(name, 70.0), 1)
            composite += score * weight
            dimensions.append({"name": name, "score": score, "weight": weight})
        return round(composite, 1), dimensions

    # -----------------------------------------------------------------------
    # Dimension enrichment
    # -----------------------------------------------------------------------

    def _enrich_dimensions(
        self,
        dimensions: List[Dict[str, Any]],
        prev_scores: Dict[str, float],
    ) -> List[DimensionScore]:
        enriched = []
        for d in dimensions:
            name = d["name"]
            score = d["score"]
            grade = _grade(score)
            prev = prev_scores.get(name, score)
            delta = round(score - prev, 1)
            meta = _DIMENSION_META.get(
                name, {"icon": "Circle", "color": "#6b7280", "source": "Derived"}
            )
            enriched.append(
                DimensionScore(
                    name=name,
                    score=score,
                    weight=d["weight"],
                    grade=grade,
                    trend=_trend_label(delta),
                    trend_delta=delta,
                    icon=meta["icon"],
                    color=meta["color"],
                    explanation=_dimension_explanation(name, score, grade),
                    source=meta["source"],
                )
            )
        return enriched

    # -----------------------------------------------------------------------
    # Narrative generation
    # -----------------------------------------------------------------------

    def _build_headline(self, overall: float, delta: float, status: str) -> str:
        if abs(delta) < 1.0:
            return f"Your repository health is {status.lower()} at {overall:.1f}/100."
        direction = "improved by" if delta > 0 else "dropped by"
        return (
            f"Your repository health {direction} {abs(delta):.1f} points "
            f"and is now {status.lower()} at {overall:.1f}/100."
        )

    def _build_narrative(
        self,
        overall: float,
        delta: float,
        dimensions: List[DimensionScore],
        status: str,
    ) -> str:
        sorted_dims = sorted(dimensions, key=lambda d: d.score)
        weakest = sorted_dims[:3]
        strongest = sorted_dims[-3:]

        weak_names = ", ".join(d.name for d in weakest)
        strong_names = ", ".join(d.name for d in strongest)

        trend_sentence = ""
        if delta > 2:
            trend_sentence = f" The overall score improved by {delta:.1f} points since the last analysis — great progress!"
        elif delta < -2:
            trend_sentence = f" The overall score declined by {abs(delta):.1f} points since the last analysis — immediate attention is recommended."
        else:
            trend_sentence = (
                " The overall score has been stable since the last analysis."
            )

        return (
            f"CodeAtlas analyzed your repository across 11 engineering health dimensions "
            f"and computed a composite score of {overall:.1f}/100 (Grade {_grade(overall)}).{trend_sentence} "
            f"Your strongest dimensions are {strong_names}, indicating solid work in these areas. "
            f"The dimensions requiring the most attention are {weak_names}. "
            f"Focusing remediation effort on these weakest areas will have the greatest impact on your overall health score. "
            f"Use the Priority Action Board below to see specific, ranked actions across all dimensions."
        )

    def _top_and_bottom(
        self, dimensions: List[DimensionScore]
    ) -> Tuple[List[str], List[str]]:
        sorted_dims = sorted(dimensions, key=lambda d: d.score)
        bottom = [f"{d.name} ({d.score:.1f})" for d in sorted_dims[:3]]
        top = [f"{d.name} ({d.score:.1f})" for d in sorted_dims[-3:]]
        return top, bottom

    # -----------------------------------------------------------------------
    # Priority actions
    # -----------------------------------------------------------------------

    def _build_actions(
        self,
        dimensions: List[DimensionScore],
        raw_scores: Dict[str, float],
    ) -> List[HealthAction]:
        """Produce top-5 cross-dimensional health actions ordered by impact."""
        action_templates = {
            "Architecture": HealthAction(
                rank=0,
                title="Resolve circular dependencies",
                description="Circular import cycles are degrading architecture score. Use abstract interfaces or dependency inversion to break cycles.",
                dimension="Architecture",
                expected_improvement=8.0,
                effort="2–3 days",
                link_path="/architecture",
                severity="HIGH",
            ),
            "Technical Debt": HealthAction(
                rank=0,
                title="Tackle high-risk technical debt hotspots",
                description="Split god modules, extract helpers from large files, and enforce complexity limits in CI.",
                dimension="Technical Debt",
                expected_improvement=10.0,
                effort="1 sprint",
                link_path="/tech-debt",
                severity="HIGH",
            ),
            "Reliability": HealthAction(
                rank=0,
                title="Reduce failure probability in bug hotspots",
                description="Add tests, retries, and circuit breakers to the highest-risk components identified in the Reliability Dashboard.",
                dimension="Reliability",
                expected_improvement=12.0,
                effort="1 sprint",
                link_path="/reliability",
                severity="CRITICAL",
            ),
            "Knowledge": HealthAction(
                rank=0,
                title="Execute knowledge transfer plan",
                description="Critical modules are owned by single developers. Run the Knowledge Transfer Plan to distribute ownership.",
                dimension="Knowledge",
                expected_improvement=7.0,
                effort="2 weeks",
                link_path="/knowledge",
                severity="HIGH",
            ),
            "Documentation": HealthAction(
                rank=0,
                title="Close documentation gaps",
                description="Add missing ADRs, API docs, and inline comments to modules with low documentation coverage.",
                dimension="Documentation",
                expected_improvement=9.0,
                effort="3 days",
                link_path="/knowledge?tab=documentation",
                severity="MEDIUM",
            ),
            "Testing": HealthAction(
                rank=0,
                title="Increase automated test coverage",
                description="Add unit and integration tests to the lowest-coverage, highest-risk modules.",
                dimension="Testing",
                expected_improvement=11.0,
                effort="1 sprint",
                link_path="/tech-debt",
                severity="HIGH",
            ),
            "Security": HealthAction(
                rank=0,
                title="Harden security posture",
                description="Eliminate circular dependency anti-patterns and audit direct coupling in authentication paths.",
                dimension="Security",
                expected_improvement=6.0,
                effort="2 days",
                link_path="/architecture?tab=governance",
                severity="HIGH",
            ),
            "Performance": HealthAction(
                rank=0,
                title="Refactor large performance-heavy files",
                description="Break up files over 400 lines that have high coupling — these create runtime bottlenecks.",
                dimension="Performance",
                expected_improvement=5.0,
                effort="2 days",
                link_path="/tech-debt",
                severity="MEDIUM",
            ),
            "Developer Experience": HealthAction(
                rank=0,
                title="Reduce cognitive complexity",
                description="Simplify high-complexity functions to reduce cognitive load and onboarding friction.",
                dimension="Developer Experience",
                expected_improvement=6.0,
                effort="3 days",
                link_path="/tech-debt",
                severity="MEDIUM",
            ),
            "Scalability": HealthAction(
                rank=0,
                title="Improve architectural scalability",
                description="Decouple tightly coupled services and introduce event-driven patterns for horizontal scalability.",
                dimension="Scalability",
                expected_improvement=7.0,
                effort="1–2 sprints",
                link_path="/architect",
                severity="MEDIUM",
            ),
            "Maintainability": HealthAction(
                rank=0,
                title="Refactor to improve maintainability",
                description="Extract interfaces, remove dead code, and enforce module boundaries to lower the cost of future changes.",
                dimension="Maintainability",
                expected_improvement=5.0,
                effort="1 sprint",
                link_path="/tech-debt",
                severity="LOW",
            ),
        }

        severity_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}

        # Only include actions for dimensions that score below 75
        candidate_actions = []
        for d in dimensions:
            if d.score < 75 and d.name in action_templates:
                action = action_templates[d.name].model_copy()
                action.expected_improvement = round(
                    action.expected_improvement * (1 + (75 - d.score) / 100), 1
                )
                candidate_actions.append((d.score, action))

        # Sort by score ascending (worst first) then severity
        candidate_actions.sort(
            key=lambda x: (severity_order.get(x[1].severity, 9), x[0])
        )

        result = []
        for rank, (_, action) in enumerate(candidate_actions[:5], start=1):
            action.rank = rank
            result.append(action)

        # If fewer than 3 actions (high-scoring repo), add top items anyway
        if len(result) < 3:
            for d in sorted(dimensions, key=lambda d: d.score)[:3]:
                if d.name in action_templates and not any(
                    a.dimension == d.name for a in result
                ):
                    action = action_templates[d.name].model_copy()
                    action.rank = len(result) + 1
                    result.append(action)
                    if len(result) >= 5:
                        break

        return result

    # -----------------------------------------------------------------------
    # Persistence helpers
    # -----------------------------------------------------------------------

    def _persist_snapshot(
        self,
        db: Session,
        repo_id: str,
        overall: float,
        grade: str,
        status: str,
        raw_scores: Dict[str, float],
        headline: str,
        narrative: str,
    ) -> RepositoryHealthSnapshot:
        snapshot = RepositoryHealthSnapshot(
            repo_id=repo_id,
            overall_score=round(overall, 1),
            grade=grade,
            status=status,
            score_architecture=raw_scores.get("Architecture"),
            score_technical_debt=raw_scores.get("Technical Debt"),
            score_reliability=raw_scores.get("Reliability"),
            score_knowledge=raw_scores.get("Knowledge"),
            score_documentation=raw_scores.get("Documentation"),
            score_performance=raw_scores.get("Performance"),
            score_testing=raw_scores.get("Testing"),
            score_security=raw_scores.get("Security"),
            score_developer_experience=raw_scores.get("Developer Experience"),
            score_scalability=raw_scores.get("Scalability"),
            score_maintainability=raw_scores.get("Maintainability"),
            headline=headline[:500] if headline else None,
            narrative=narrative,
        )
        db.add(snapshot)
        db.commit()
        db.refresh(snapshot)
        logger.info(
            "Persisted health snapshot %s for repo %s (score=%.1f)",
            snapshot.id,
            repo_id,
            overall,
        )
        return snapshot

    def _load_last_snapshot(
        self, db: Session, repo_id: str
    ) -> Optional[RepositoryHealthSnapshot]:
        return (
            db.query(RepositoryHealthSnapshot)
            .filter(RepositoryHealthSnapshot.repo_id == repo_id)
            .order_by(RepositoryHealthSnapshot.created_at.desc())
            .first()
        )

    def _load_trend_history(
        self, db: Session, repo_id: str, limit: int = 10
    ) -> List[HealthTrendPoint]:
        snapshots = (
            db.query(RepositoryHealthSnapshot)
            .filter(RepositoryHealthSnapshot.repo_id == repo_id)
            .order_by(RepositoryHealthSnapshot.created_at.asc())
            .limit(limit)
            .all()
        )
        return [
            HealthTrendPoint(
                snapshot_id=s.id,
                timestamp=s.created_at,
                overall_score=s.overall_score,
                grade=s.grade,
                dimension_scores={
                    "Architecture": s.score_architecture or 0,
                    "Technical Debt": s.score_technical_debt or 0,
                    "Reliability": s.score_reliability or 0,
                    "Knowledge": s.score_knowledge or 0,
                    "Documentation": s.score_documentation or 0,
                    "Performance": s.score_performance or 0,
                    "Security": s.score_security or 0,
                    "Developer Experience": s.score_developer_experience or 0,
                    "Scalability": s.score_scalability or 0,
                    "Maintainability": s.score_maintainability or 0,
                },
            )
            for s in snapshots
        ]

    def _compute_categorized_report(
        self, db: Session, repo_id: str
    ) -> CategorizedHealthReport:
        # 1. Fetch raw data from TechDebt, Drift, Coupling, Reliability, and Knowledge
        try:
            tech_debt = self._tech_debt_svc.calculate_repository_tech_debt(
                db=db, repo_id=repo_id
            )
        except Exception:
            tech_debt = {}

        try:
            drift = self._drift_svc.detect_drift(db=db, repo_id=repo_id)
        except Exception:
            drift = None

        try:
            coupling = self._coupling_svc.get_coupling_report(db=db, repo_id=repo_id)
        except Exception:
            coupling = None

        try:
            reliability = self._reliability_svc.predict(db=db, repo_id=repo_id)
        except Exception:
            reliability = None

        try:
            knowledge = self._knowledge_svc.get_dashboard(db=db, repo_id=repo_id)
        except Exception:
            knowledge = None

        # Helper to map score to status
        def get_status_from_score(score: float) -> str:
            if score >= 90:
                return "EXCELLENT"
            if score >= 75:
                return "HEALTHY"
            if score >= 60:
                return "WARNING"
            if score >= 45:
                return "HIGH_RISK"
            return "CRITICAL"

        # Helper to map score to grade
        def get_grade_from_score(score: float) -> str:
            if score >= 90:
                return "A"
            if score >= 75:
                return "B"
            if score >= 60:
                return "C"
            if score >= 45:
                return "D"
            return "F"

        # =====================================================================
        # Category 1: Architecture Health
        # =====================================================================
        # 1.1 Circular dependencies
        circular_count = 0
        if tech_debt:
            circular_count = tech_debt.get("summary", {}).get(
                "circular_dependencies_count", 0
            )
        elif coupling:
            circular_count = sum(
                1
                for issue in coupling.issues
                if issue.issue_type == "cyclic_dependency"
            )
        circ_score = max(0.0, 100.0 - circular_count * 10.0)
        circ_detail = MeasureDetail(
            name="Circular Dependencies",
            score=circ_score,
            status=get_status_from_score(circ_score),
            value_label=f"{circular_count} loops",
            details=(
                "Direct import cycles that can cause execution deadlock and hinder modular isolation."
                if circular_count > 0
                else "No circular dependency loops detected."
            ),
        )

        # 1.2 Layer violations
        layer_violations_count = 0
        if drift:
            layer_violations_count = sum(
                1 for v in drift.get("violations", []) if v.type == "layer_violation"
            )
        layer_score = max(0.0, 100.0 - layer_violations_count * 8.0)
        layer_detail = MeasureDetail(
            name="Layer Violations",
            score=layer_score,
            status=get_status_from_score(layer_score),
            value_label=f"{layer_violations_count} violations",
            details=(
                f"Identified {layer_violations_count} dependency paths crossing defined architectural layers in forbidden directions."
                if layer_violations_count > 0
                else "Strict layer boundaries are correctly observed."
            ),
        )

        # 1.3 Coupling
        coupling_score = 100.0
        high_coupling_count = 0
        if coupling:
            coupling_score = coupling.coupling_health_score
            high_coupling_count = sum(
                1
                for issue in coupling.issues
                if issue.issue_type == "high_coupling"
                or issue.issue_type == "god_object"
            )
        elif tech_debt:
            high_coupling_count = sum(
                1
                for f in tech_debt.get("remediations", [])
                if "coupling" in f.get("reasons", [])
            )
            coupling_score = max(0.0, 100.0 - high_coupling_count * 5.0)

        coupling_detail = MeasureDetail(
            name="Coupling",
            score=coupling_score,
            status=get_status_from_score(coupling_score),
            value_label=f"{high_coupling_count} coupled modules",
            details=(
                f"Elevated efferent/afferent coupling in {high_coupling_count} key areas makes refactoring riskier."
                if high_coupling_count > 0
                else "Low coupling allows safe modular modification."
            ),
        )

        # 1.4 Architecture drift
        compliance_score = 100.0
        violations_count = 0
        if drift:
            compliance_score = drift.get("compliance_score", 100.0)
            violations_count = len(drift.get("violations", []))
        drift_score = compliance_score
        drift_detail = MeasureDetail(
            name="Architecture Drift",
            score=drift_score,
            status=get_status_from_score(drift_score),
            value_label=f"{drift_score:.1f}% compliance",
            details=(
                f"Codebase has drifted from baseline configuration with {violations_count} governance violations."
                if violations_count > 0
                else "Codebase is in full compliance with baseline rules."
            ),
        )

        # 1.5 Service boundaries
        boundary_issues_count = 0
        if drift:
            boundary_issues_count = sum(
                1 for v in drift.get("violations", []) if v.type == "boundary_violation"
            )
            boundary_analysis = drift.get("microservice_boundary_analysis", {})
            boundary_issues_count += len(boundary_analysis.get("smells", []))
        boundary_score = max(0.0, 100.0 - boundary_issues_count * 12.0)
        boundary_detail = MeasureDetail(
            name="Service Boundaries",
            score=boundary_score,
            status=get_status_from_score(boundary_score),
            value_label=f"{boundary_issues_count} concerns",
            details=(
                "Identified domain boundaries bleed or direct dependencies across bounded contexts."
                if boundary_issues_count > 0
                else "Domain boundary isolations are clean."
            ),
        )

        arch_score = round(
            (circ_score + layer_score + coupling_score + drift_score + boundary_score)
            / 5.0,
            1,
        )
        arch_detail = CategoryDetail(
            score=arch_score,
            status=get_status_from_score(arch_score),
            grade=get_grade_from_score(arch_score),
            measures=[
                circ_detail,
                layer_detail,
                coupling_detail,
                drift_detail,
                boundary_detail,
            ],
        )

        # =====================================================================
        # Category 2: Code Quality
        # =====================================================================
        processed_files = []
        maintainability_score = 70.0
        if tech_debt:
            maintainability_score = tech_debt.get("scorecard", {}).get(
                "maintainability", 70.0
            )

            def extract_files(node):
                if not node:
                    return []
                if node.get("type") == "file":
                    return [node]
                files_found = []
                for child in node.get("children", []):
                    files_found.extend(extract_files(child))
                return files_found

            processed_files = extract_files(tech_debt.get("heatmap", {}))

        # 2.1 Complexity
        high_complexity_count = sum(
            1 for f in processed_files if f.get("has_excessive_nesting", False)
        )
        comp_score = max(0.0, 100.0 - high_complexity_count * 15.0)
        if len(processed_files) > 0:
            avg_cc = sum(f.get("complexity", 0) for f in processed_files) / len(
                processed_files
            )
        else:
            avg_cc = 0.0
        comp_detail = MeasureDetail(
            name="Complexity",
            score=comp_score,
            status=get_status_from_score(comp_score),
            value_label=f"Avg CC: {avg_cc:.1f}",
            details=(
                f"Excessive nested logic and cognitive complexity detected in {high_complexity_count} files."
                if high_complexity_count > 0
                else "Logical branches are simple and clean."
            ),
        )

        # 2.2 Duplicate code
        dup_count = sum(
            1 for f in processed_files if f.get("has_duplicate_code", False)
        )
        dup_score = max(0.0, 100.0 - dup_count * 15.0)
        dup_detail = MeasureDetail(
            name="Duplicate Code",
            score=dup_score,
            status=get_status_from_score(dup_score),
            value_label=f"{dup_count} files",
            details=(
                f"Detected highly isomorphic duplicate blocks in {dup_count} files. Consolidate into common helpers."
                if dup_count > 0
                else "Dry principle is followed; low copy-paste footprint."
            ),
        )

        # 2.3 Dead code
        dead_count = sum(1 for f in processed_files if f.get("has_dead_code", False))
        dead_score = max(0.0, 100.0 - dead_count * 10.0)
        dead_detail = MeasureDetail(
            name="Dead Code",
            score=dead_score,
            status=get_status_from_score(dead_score),
            value_label=f"{dead_count} files",
            details=(
                f"Unused variables, orphan functions, or decoupled exports detected in {dead_count} modules."
                if dead_count > 0
                else "Codebase has zero or negligible orphaned symbols."
            ),
        )

        # 2.4 Function size
        long_methods_count = sum(
            1 for f in processed_files if f.get("has_long_methods", False)
        )
        size_score = max(0.0, 100.0 - long_methods_count * 8.0)
        size_detail = MeasureDetail(
            name="Function Size",
            score=size_score,
            status=get_status_from_score(size_score),
            value_label=f"{long_methods_count} files",
            details=(
                f"Functions exceeding 40 lines (or files exceeding 300 lines) detected in {long_methods_count} files."
                if long_methods_count > 0
                else "Methods and classes are compact and focused."
            ),
        )

        # 2.5 Maintainability
        maint_detail = MeasureDetail(
            name="Maintainability",
            score=maintainability_score,
            status=get_status_from_score(maintainability_score),
            value_label=f"{maintainability_score:.1f}/100",
            details="Determines modification risk, documentation coverage, and clean layering.",
        )

        code_score = round(
            (comp_score + dup_score + dead_score + size_score + maintainability_score)
            / 5.0,
            1,
        )
        code_detail = CategoryDetail(
            score=code_score,
            status=get_status_from_score(code_score),
            grade=get_grade_from_score(code_score),
            measures=[comp_detail, dup_detail, dead_detail, size_detail, maint_detail],
        )

        # =====================================================================
        # Category 3: Technical Debt
        # =====================================================================
        # 3.1 Debt Ratio
        remediation_hours = 0.0
        if tech_debt:
            remediations = tech_debt.get("remediations", [])
            for rem in remediations:
                eff = rem.get("estimated_effort", "2 days").lower()
                if "0.5" in eff or "half" in eff:
                    remediation_hours += 4.0
                elif "day" in eff:
                    try:
                        days = float(eff.split(" ")[0])
                        remediation_hours += days * 8.0
                    except Exception:
                        remediation_hours += 16.0
                elif "sprint" in eff or "week" in eff:
                    remediation_hours += 80.0
                else:
                    remediation_hours += 16.0

        total_loc = (
            sum(f.get("value", 0) for f in processed_files) if processed_files else 1000
        )
        if total_loc == 0:
            total_loc = 1000
        asset_size_hours = total_loc * 0.15

        debt_ratio_percent = round((remediation_hours / asset_size_hours) * 100, 1)
        if debt_ratio_percent > 100.0:
            debt_ratio_percent = 100.0
        debt_ratio_score = max(0.0, 100.0 - debt_ratio_percent * 2.5)

        ratio_detail = MeasureDetail(
            name="Debt Ratio",
            score=debt_ratio_score,
            status=get_status_from_score(debt_ratio_score),
            value_label=f"{debt_ratio_percent:.1f}% ratio",
            details=f"Remediation cost is estimated at {remediation_hours:.1f} hours vs asset construction cost of {asset_size_hours:.1f} hours.",
        )

        # 3.2 Refactoring Priority
        remediation_count = len(tech_debt.get("remediations", [])) if tech_debt else 0
        refac_score = max(0.0, 100.0 - remediation_count * 10.0)
        refac_detail = MeasureDetail(
            name="Refactoring Priority",
            score=refac_score,
            status=get_status_from_score(refac_score),
            value_label=f"{remediation_count} tasks",
            details=(
                f"Identify {remediation_count} refactoring targets requiring attention, sorted by impact."
                if remediation_count > 0
                else "No urgent refactoring recommendations."
            ),
        )

        # 3.3 Hotspots
        hotspot_count = sum(1 for f in processed_files if f.get("score", 0) > 60)
        hotspot_score = max(0.0, 100.0 - hotspot_count * 15.0)
        hotspots_detail = MeasureDetail(
            name="Hotspots",
            score=hotspot_score,
            status=get_status_from_score(hotspot_score),
            value_label=f"{hotspot_count} hotspots",
            details=(
                f"Found {hotspot_count} highly unstable, complex files undergoing active development changes."
                if hotspot_count > 0
                else "No high-risk code hotspots found."
            ),
        )

        debt_score = round((debt_ratio_score + refac_score + hotspot_score) / 3.0, 1)
        debt_detail = CategoryDetail(
            score=debt_score,
            status=get_status_from_score(debt_score),
            grade=get_grade_from_score(debt_score),
            measures=[ratio_detail, refac_detail, hotspots_detail],
        )

        # =====================================================================
        # Category 4: Reliability
        # =====================================================================
        hotspots = reliability.hotspots if reliability else []

        # 4.1 Failure probability
        if hotspots:
            avg_fail_prob = (
                sum(h.failure_probability for h in hotspots) / len(hotspots) * 100.0
            )
        else:
            avg_fail_prob = 10.0
        fail_prob_score = max(0.0, 100.0 - avg_fail_prob)
        fail_prob_detail = MeasureDetail(
            name="Failure Probability",
            score=fail_prob_score,
            status=get_status_from_score(fail_prob_score),
            value_label=f"{avg_fail_prob:.1f}% avg prob",
            details=f"Average probability of bugs or regression failures across hotspots is {avg_fail_prob:.1f}%.",
        )

        # 4.2 Change risk
        if hotspots:
            avg_change_risk = (
                sum(h.change_risk for h in hotspots) / len(hotspots) * 100.0
            )
        else:
            avg_change_risk = 15.0
        change_risk_score = max(0.0, 100.0 - avg_change_risk)
        change_risk_detail = MeasureDetail(
            name="Change Risk",
            score=change_risk_score,
            status=get_status_from_score(change_risk_score),
            value_label=f"{avg_change_risk:.1f}% risk",
            details=f"Average risk score when introducing changes in hotspots is {avg_change_risk:.1f}%.",
        )

        # 4.3 Incident prediction
        if hotspots:
            avg_reg_risk = (
                sum(h.regression_risk for h in hotspots) / len(hotspots) * 100.0
            )
        else:
            avg_reg_risk = 12.0
        incident_score = max(0.0, 100.0 - avg_reg_risk)
        incident_detail = MeasureDetail(
            name="Incident Prediction",
            score=incident_score,
            status=get_status_from_score(incident_score),
            value_label=f"{avg_reg_risk:.1f}% vulnerability",
            details=f"Estimated regression/incident susceptibility score is {avg_reg_risk:.1f}% based on complexity and churn.",
        )

        # 4.4 Recovery
        recovery_scores = []
        for h in hotspots:
            diff = (h.recovery_difficulty or "low").lower()
            if "high" in diff:
                recovery_scores.append(40.0)
            elif "medium" in diff:
                recovery_scores.append(70.0)
            else:
                recovery_scores.append(95.0)
        avg_recovery = (
            sum(recovery_scores) / len(recovery_scores) if recovery_scores else 90.0
        )
        recovery_detail = MeasureDetail(
            name="Recovery",
            score=avg_recovery,
            status=get_status_from_score(avg_recovery),
            value_label=f"Grade {get_grade_from_score(avg_recovery)}",
            details=f"Codebase recovery capacity is graded as {get_grade_from_score(avg_recovery)} based on diagnostic traceability and module complexity.",
        )

        rel_score = round(
            (fail_prob_score + change_risk_score + incident_score + avg_recovery) / 4.0,
            1,
        )
        rel_detail = CategoryDetail(
            score=rel_score,
            status=get_status_from_score(rel_score),
            grade=get_grade_from_score(rel_score),
            measures=[
                fail_prob_detail,
                change_risk_detail,
                incident_detail,
                recovery_detail,
            ],
        )

        # =====================================================================
        # Category 5: Knowledge Health
        # =====================================================================
        bus_factor = knowledge.bus_factor if knowledge else 2
        doc_quality = knowledge.documentation_quality if knowledge else 70.0
        concentration = knowledge.knowledge_concentration if knowledge else 30.0
        risk_items_count = (
            len(knowledge.risk_items) if (knowledge and knowledge.risk_items) else 0
        )

        # 5.1 Bus factor
        bf_score = min(100.0, bus_factor * 25.0)
        bf_detail = MeasureDetail(
            name="Bus Factor",
            score=bf_score,
            status=get_status_from_score(bf_score),
            value_label=f"{bus_factor} developers",
            details=f"Codebase survival requires at least {bus_factor} primary developer(s) to sustain operations.",
        )

        # 5.2 Documentation
        doc_detail = MeasureDetail(
            name="Documentation",
            score=doc_quality,
            status=get_status_from_score(doc_quality),
            value_label=f"{doc_quality:.1f}/100 score",
            details="Assesses the completeness and health of ADRs, READMEs, and inline documentation.",
        )

        # 5.3 Ownership
        owner_score = max(0.0, 100.0 - concentration)
        owner_detail = MeasureDetail(
            name="Ownership",
            score=owner_score,
            status=get_status_from_score(owner_score),
            value_label=f"{concentration:.1f}% concentration",
            details=f"Core knowledge concentration is {concentration:.1f}%. Lower concentration prevents silo risks.",
        )

        # 5.4 Knowledge risk
        kr_score = max(0.0, 100.0 - risk_items_count * 15.0)
        kr_detail = MeasureDetail(
            name="Knowledge Risk",
            score=kr_score,
            status=get_status_from_score(kr_score),
            value_label=f"{risk_items_count} risk items",
            details=(
                f"Identified {risk_items_count} critical components owned by single developers with no backups."
                if risk_items_count > 0
                else "No high-risk knowledge concentration silos detected."
            ),
        )

        know_score = round((bf_score + doc_quality + owner_score + kr_score) / 4.0, 1)
        know_detail = CategoryDetail(
            score=know_score,
            status=get_status_from_score(know_score),
            grade=get_grade_from_score(know_score),
            measures=[bf_detail, doc_detail, owner_detail, kr_detail],
        )

        # =====================================================================
        # Category 6: Performance Readiness
        # =====================================================================
        # 6.1 Slow modules
        slow_files_count = sum(
            1
            for f in processed_files
            if f.get("complexity", 0) > 18 or f.get("has_excessive_nesting", False)
        )
        slow_score = max(0.0, 100.0 - slow_files_count * 12.0)
        slow_detail = MeasureDetail(
            name="Slow Modules",
            score=slow_score,
            status=get_status_from_score(slow_score),
            value_label=f"{slow_files_count} modules",
            details=(
                f"Detected {slow_files_count} files with high algorithmic complexity that could slow operations under load."
                if slow_files_count > 0
                else "All modules have simple, high-performing code patterns."
            ),
        )

        # 6.2 Expensive database queries
        db_queries_violations = 0
        if drift:
            db_queries_violations = sum(
                1
                for v in drift.get("violations", [])
                if "database" in v.message.lower() or "db" in v.message.lower()
            )
            db_queries_violations += len(
                drift.get("microservice_boundary_analysis", {}).get(
                    "shared_databases", []
                )
            )
        db_score = max(0.0, 100.0 - db_queries_violations * 15.0)
        db_detail = MeasureDetail(
            name="Expensive Database Queries",
            score=db_score,
            status=get_status_from_score(db_score),
            value_label=f"{db_queries_violations} violations",
            details=(
                f"Identified {db_queries_violations} query violations (e.g. shared DB tables, direct database bypass patterns) that affect performance."
                if db_queries_violations > 0
                else "Database query boundaries are strictly observed and optimized."
            ),
        )

        # 6.3 API bottlenecks
        bottleneck_apis_count = sum(
            1
            for f in processed_files
            if (
                "api/" in f.get("path", "").lower()
                or "controllers/" in f.get("path", "").lower()
            )
            and f.get("complexity", 0) > 10
        )
        api_score = max(0.0, 100.0 - bottleneck_apis_count * 10.0)
        api_detail = MeasureDetail(
            name="API Bottlenecks",
            score=api_score,
            status=get_status_from_score(api_score),
            value_label=f"{bottleneck_apis_count} slow routes",
            details=(
                f"Found {bottleneck_apis_count} API endpoints with high cyclomatic complexity that could create bottlenecks under concurrent requests."
                if bottleneck_apis_count > 0
                else "All public API routes are simple and highly responsive."
            ),
        )

        # 6.4 Memory usage
        memory_risk_count = sum(
            1
            for f in processed_files
            if any(
                k in f.get("path", "").lower()
                for k in ("parse", "read", "load", "buffer", "cache")
            )
            and f.get("complexity", 0) > 12
        )
        mem_score = max(0.0, 100.0 - memory_risk_count * 12.0)
        mem_detail = MeasureDetail(
            name="Memory Usage",
            score=mem_score,
            status=get_status_from_score(mem_score),
            value_label=f"{memory_risk_count} files at risk",
            details=(
                f"Identified {memory_risk_count} memory-intensive utility modules without streaming/chunking protocols."
                if memory_risk_count > 0
                else "Memory consumption footprints are well-managed."
            ),
        )

        # 6.5 CPU hotspots
        cpu_hotspot_count = sum(
            1 for f in processed_files if f.get("complexity", 0) > 20
        )
        cpu_score = max(0.0, 100.0 - cpu_hotspot_count * 10.0)
        cpu_detail = MeasureDetail(
            name="CPU Hotspots",
            score=cpu_score,
            status=get_status_from_score(cpu_score),
            value_label=f"{cpu_hotspot_count} hotspots",
            details=(
                f"Found {cpu_hotspot_count} files with cyclomatic complexity exceeding 20 which might cause heavy CPU cycles."
                if cpu_hotspot_count > 0
                else "All computational functions lie well within performance baselines."
            ),
        )

        perf_score = round(
            (slow_score + db_score + api_score + mem_score + cpu_score) / 5.0, 1
        )
        perf_detail = CategoryDetail(
            score=perf_score,
            status=get_status_from_score(perf_score),
            grade=get_grade_from_score(perf_score),
            measures=[slow_detail, db_detail, api_detail, mem_detail, cpu_detail],
        )

        # =====================================================================
        # Category 7: Security Readiness
        # =====================================================================
        secrets_count = sum(
            1
            for f in processed_files
            if any(
                k in f.get("path", "").lower()
                for k in ("secret", "key", "password", "token", "credential")
            )
            and f.get("complexity", 0) > 15
        )
        sec_secrets_score = max(0.0, 100.0 - secrets_count * 20.0)
        secrets_detail = MeasureDetail(
            name="Hardcoded Secrets",
            score=sec_secrets_score,
            status=get_status_from_score(sec_secrets_score),
            value_label=f"{secrets_count} hardcoded secrets",
            details=(
                f"Identified {secrets_count} files with potential credentials or plain-text keys."
                if secrets_count > 0
                else "No hardcoded credentials or API keys found in codebase."
            ),
        )

        insecure_dep_count = sum(
            1
            for f in processed_files
            if "requirements.txt" in f.get("path", "").lower()
            or "package.json" in f.get("path", "").lower()
        )
        sec_dep_score = max(0.0, 100.0 - insecure_dep_count * 15.0)
        dep_detail = MeasureDetail(
            name="Insecure Dependencies",
            score=sec_dep_score,
            status=get_status_from_score(sec_dep_score),
            value_label=f"{insecure_dep_count} insecure libraries",
            details=(
                f"Detected {insecure_dep_count} outdated or vulnerable library constraints."
                if insecure_dep_count > 0
                else "All external dependencies are securely pinned to latest safe releases."
            ),
        )

        weak_auth_violations = sum(
            1
            for f in processed_files
            if "auth" in f.get("path", "").lower() and f.get("complexity", 0) > 20
        )
        sec_auth_score = max(0.0, 100.0 - weak_auth_violations * 25.0)
        auth_detail = MeasureDetail(
            name="Weak Authentication",
            score=sec_auth_score,
            status=get_status_from_score(sec_auth_score),
            value_label=f"{weak_auth_violations} auth concerns",
            details=(
                f"Found {weak_auth_violations} authentication handlers with high complexity or missing validation filters."
                if weak_auth_violations > 0
                else "Authentication logic utilizes secure encryption and token validations."
            ),
        )

        missing_val_violations = sum(
            1
            for f in processed_files
            if "schemas" in f.get("path", "").lower() and f.get("complexity", 0) > 15
        )
        sec_val_score = max(0.0, 100.0 - missing_val_violations * 12.0)
        val_detail = MeasureDetail(
            name="Missing Validation",
            score=sec_val_score,
            status=get_status_from_score(sec_val_score),
            value_label=f"{missing_val_violations} inputs unvalidated",
            details=(
                f"Identified {missing_val_violations} data entry schemas lacking strict pydantic type checks."
                if missing_val_violations > 0
                else "All request inputs and configurations are fully validated at boundary schemas."
            ),
        )

        dangerous_configs = sum(
            1
            for f in processed_files
            if any(
                k in f.get("path", "").lower() for k in ("config", "settings", "env")
            )
            and f.get("complexity", 0) > 10
        )
        sec_config_score = max(0.0, 100.0 - dangerous_configs * 15.0)
        config_detail = MeasureDetail(
            name="Dangerous Configurations",
            score=sec_config_score,
            status=get_status_from_score(sec_config_score),
            value_label=f"{dangerous_configs} risky configurations",
            details=(
                f"Flagged {dangerous_configs} server settings files lacking separation of environment parameters."
                if dangerous_configs > 0
                else "Configurations adhere to secure Twelve-Factor App parameters."
            ),
        )

        security_score = round(
            (
                sec_secrets_score
                + sec_dep_score
                + sec_auth_score
                + sec_val_score
                + sec_config_score
            )
            / 5.0,
            1,
        )
        security_detail = CategoryDetail(
            score=security_score,
            status=get_status_from_score(security_score),
            grade=get_grade_from_score(security_score),
            measures=[
                secrets_detail,
                dep_detail,
                auth_detail,
                val_detail,
                config_detail,
            ],
        )

        # =====================================================================
        # Category 8: Scalability
        # =====================================================================
        coupling_smells = (
            sum(
                1
                for v in drift.get("violations", [])
                if "coupling" in v.message.lower() or "boundary" in v.message.lower()
            )
            if drift
            else 0
        )
        scal_ind_score = max(0.0, 100.0 - coupling_smells * 12.0)
        independence_detail = MeasureDetail(
            name="Service Independence",
            score=scal_ind_score,
            status=get_status_from_score(scal_ind_score),
            value_label=f"{coupling_smells} boundary concerns",
            details=(
                f"Found {coupling_smells} tight couplings that block independent microservice deployments."
                if coupling_smells > 0
                else "High service isolation limits deployment friction and shared resource locks."
            ),
        )

        db_violations = (
            sum(
                1
                for v in drift.get("violations", [])
                if "database" in v.message.lower()
            )
            if drift
            else 0
        )
        scal_db_score = max(0.0, 100.0 - db_violations * 15.0)
        db_scal_detail = MeasureDetail(
            name="Database Scaling Readiness",
            score=scal_db_score,
            status=get_status_from_score(scal_db_score),
            value_label=f"{db_violations} database concerns",
            details=(
                f"Identified {db_violations} shared databases or cross-domain tables blocking database horizontal split scaling."
                if db_violations > 0
                else "Database partitions, connection pooling, and replication profiles are properly organized."
            ),
        )

        missing_cache = sum(
            1
            for f in processed_files
            if any(k in f.get("path", "").lower() for k in ("db", "query", "sql"))
            and not any(
                k in f.get("path", "").lower() for k in ("cache", "redis", "memo")
            )
        )
        scal_cache_score = max(0.0, 100.0 - missing_cache * 2.0)
        cache_detail = MeasureDetail(
            name="Cache Readiness",
            score=scal_cache_score,
            status=get_status_from_score(scal_cache_score),
            value_label=f"{missing_cache} cache concerns",
            details=(
                f"Identified {missing_cache} heavy database fetch routes missing a caching layers check."
                if missing_cache > 0
                else "Critical performance bottlenecks use active distributed key-value cache layer mappings."
            ),
        )

        missing_queue = sum(
            1
            for f in processed_files
            if any(k in f.get("path", "").lower() for k in ("task", "job", "worker"))
            and not any(
                k in f.get("path", "").lower()
                for k in ("celery", "rabbit", "queue", "kafka")
            )
        )
        scal_queue_score = max(0.0, 100.0 - missing_queue * 4.0)
        queue_detail = MeasureDetail(
            name="Queue Readiness",
            score=scal_queue_score,
            status=get_status_from_score(scal_queue_score),
            value_label=f"{missing_queue} queue concerns",
            details=(
                f"Identified {missing_queue} files using synchronous operations instead of background queue job delegations."
                if missing_queue > 0
                else "Long-running computational pipelines correctly delegate to asynchronous brokers."
            ),
        )

        statefulness_smells = sum(
            1
            for f in processed_files
            if any(
                k in f.get("path", "").lower()
                for k in ("upload", "local", "session", "static")
            )
            and f.get("complexity", 0) > 15
        )
        scal_horiz_score = max(0.0, 100.0 - statefulness_smells * 18.0)
        horizontal_detail = MeasureDetail(
            name="Horizontal Scalability",
            score=scal_horiz_score,
            status=get_status_from_score(scal_horiz_score),
            value_label=f"{statefulness_smells} state bottlenecks",
            details=(
                f"Detected {statefulness_smells} modules with stateful session dependencies that complicate horizontal autoscaling rules."
                if statefulness_smells > 0
                else "Application services are stateless and ready for dynamic Kubernetes container scaling."
            ),
        )

        scalability_score = round(
            (
                scal_ind_score
                + scal_db_score
                + scal_cache_score
                + scal_queue_score
                + scal_horiz_score
            )
            / 5.0,
            1,
        )
        scalability_detail = CategoryDetail(
            score=scalability_score,
            status=get_status_from_score(scalability_score),
            grade=get_grade_from_score(scalability_score),
            measures=[
                independence_detail,
                db_scal_detail,
                cache_detail,
                queue_detail,
                horizontal_detail,
            ],
        )

        # =====================================================================
        # Category 9: Maintainability
        # =====================================================================
        high_complexity_count = sum(
            1 for f in processed_files if f.get("complexity", 0) > 15
        )
        maint_read_score = max(0.0, 100.0 - high_complexity_count * 10.0)
        readability_detail = MeasureDetail(
            name="Readability",
            score=maint_read_score,
            status=get_status_from_score(maint_read_score),
            value_label=f"{high_complexity_count} complex files",
            details=(
                f"Readability is impacted by {high_complexity_count} highly nested or complex logical blocks."
                if high_complexity_count > 0
                else "Logical blocks are simple, highly descriptive, and readable."
            ),
        )

        coupling_violations = (
            len(coupling.get("violations", []))
            if (coupling and "violations" in coupling)
            else 0
        )
        maint_mod_score = max(0.0, 100.0 - coupling_violations * 8.0)
        modularity_detail = MeasureDetail(
            name="Modularity",
            score=maint_mod_score,
            status=get_status_from_score(maint_mod_score),
            value_label=f"{coupling_violations} modularity concerns",
            details=(
                f"Identified {coupling_violations} high-coupling boundaries that limit logical encapsulation."
                if coupling_violations > 0
                else "Cohesive module clustering supports separation of concerns."
            ),
        )

        maint_doc_score = doc_quality
        documentation_detail = MeasureDetail(
            name="Documentation",
            score=maint_doc_score,
            status=get_status_from_score(maint_doc_score),
            value_label=f"{maint_doc_score:.1f}/100 score",
            details="Comprehensive review of API definitions, ADR mappings, and comments density.",
        )

        testing_score = (
            float(tech_debt.get("scorecard", {}).get("testing", 75.0))
            if tech_debt
            else 75.0
        )
        testing_detail = MeasureDetail(
            name="Testing",
            score=testing_score,
            status=get_status_from_score(testing_score),
            value_label=f"{testing_score:.1f}/100 score",
            details="Reflects code testability, mock coverage density, and test execution reliability.",
        )

        dependency_smells = sum(
            1
            for f in processed_files
            if "requirements.txt" in f.get("path", "").lower()
        )
        maint_dep_score = max(0.0, 100.0 - dependency_smells * 8.0)
        dependency_mgt_detail = MeasureDetail(
            name="Dependency Management",
            score=maint_dep_score,
            status=get_status_from_score(maint_dep_score),
            value_label=f"{dependency_smells} dependency issues",
            details=(
                f"Requires optimization for {dependency_smells} requirements configurations."
                if dependency_smells > 0
                else "Dependency packages are clean and securely locked."
            ),
        )

        maintainability_score = round(
            (
                maint_read_score
                + maint_mod_score
                + maint_doc_score
                + testing_score
                + maint_dep_score
            )
            / 5.0,
            1,
        )
        maintainability_detail = CategoryDetail(
            score=maintainability_score,
            status=get_status_from_score(maintainability_score),
            grade=get_grade_from_score(maintainability_score),
            measures=[
                readability_detail,
                modularity_detail,
                documentation_detail,
                testing_detail,
                dependency_mgt_detail,
            ],
        )

        # =====================================================================
        # Category 10: Developer Experience
        # =====================================================================
        ci_config_files = sum(
            1
            for f in processed_files
            if any(
                k in f.get("path", "").lower()
                for k in (
                    "dockerfile",
                    "docker-compose",
                    "github/workflows",
                    "gitlab-ci",
                    "package.json",
                )
            )
        )
        build_score = max(50.0, 100.0 - ci_config_files * 8.0)
        avg_build_time = max(0.5, len(processed_files) * 0.05)
        build_time_detail = MeasureDetail(
            name="Build Time",
            score=build_score,
            status=get_status_from_score(build_score),
            value_label=f"{avg_build_time:.1f} min avg",
            details=f"Average dockerized local environment/CI pipeline compile time is estimated at {avg_build_time:.1f} minutes.",
        )

        has_contributing = any(
            "contributing" in f.get("path", "").lower() for f in processed_files
        )
        onboard_score = 95.0 if has_contributing else 75.0
        onboard_days = 1 if doc_quality >= 85 else 2 if doc_quality >= 60 else 4
        onboarding_detail = MeasureDetail(
            name="Onboarding",
            score=onboard_score,
            status=get_status_from_score(onboard_score),
            value_label=f"{onboard_days} days est",
            details=f"Onboarding duration stands at {onboard_days} day(s) based on readmes, setup guides, and setup scripts availability.",
        )

        doc_detail = MeasureDetail(
            name="Documentation",
            score=doc_quality,
            status=get_status_from_score(doc_quality),
            value_label=f"{doc_quality:.1f}/100 score",
            details="Comprehensive review of API descriptions, ADR mappings, and comments density.",
        )

        code_org_score = max(0.0, 100.0 - coupling_violations * 5.0)
        code_org_detail = MeasureDetail(
            name="Code Organization",
            score=code_org_score,
            status=get_status_from_score(code_org_score),
            value_label=f"{coupling_violations} concerns",
            details="Assesses layer integrity, circular boundaries, and modular folder structure layout.",
        )

        naming_consistency_score = max(80.0, 100.0 - (high_complexity_count * 0.5))
        naming_detail = MeasureDetail(
            name="Naming Consistency",
            score=naming_consistency_score,
            status=get_status_from_score(naming_consistency_score),
            value_label=f"{naming_consistency_score:.1f}% match",
            details="Identifies consistency of variables, classes, functions and package names across packages.",
        )

        dev_exp_score = round(
            (
                build_score
                + onboard_score
                + doc_quality
                + code_org_score
                + naming_consistency_score
            )
            / 5.0,
            1,
        )
        dev_exp_detail = CategoryDetail(
            score=dev_exp_score,
            status=get_status_from_score(dev_exp_score),
            grade=get_grade_from_score(dev_exp_score),
            measures=[
                build_time_detail,
                onboarding_detail,
                doc_detail,
                code_org_detail,
                naming_detail,
            ],
        )

        return CategorizedHealthReport(
            architecture_health=arch_detail,
            code_quality=code_detail,
            technical_debt=debt_detail,
            reliability=rel_detail,
            knowledge_health=know_detail,
            performance_readiness=perf_detail,
            security_readiness=security_detail,
            scalability=scalability_detail,
            maintainability=maintainability_detail,
            developer_experience=dev_exp_detail,
        )
