"""Score Calculator for mapping, normalizing, and grading overall repository health."""

from typing import Dict, Tuple

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


class ScoreCalculator:
    """Computes weighted engineering health dimensions and assigns grades."""

    @staticmethod
    def compute_composite(raw_scores: Dict[str, float]) -> Tuple[float, list]:
        """Combine raw dimensional scores using configured weights."""
        total_weight = 0.0
        weighted_sum = 0.0
        dimensions_list = []

        for dim_name, weight in _WEIGHTS.items():
            score = raw_scores.get(dim_name, 75.0)
            weighted_sum += score * weight
            total_weight += weight

            grade = ScoreCalculator.get_grade(score)
            status, color = ScoreCalculator.get_status(score)

            dimensions_list.append(
                {
                    "name": dim_name,
                    "score": score,
                    "weight": weight,
                    "grade": grade,
                    "trend": "stable",
                    "trend_delta": 0.0,
                    "icon": ScoreCalculator.get_icon(dim_name),
                    "color": color,
                    "explanation": f"{dim_name} health level stands at {score:.1f}/100.",
                    "source": "HealthAdvisor Engine",
                }
            )

        overall_score = weighted_sum / total_weight if total_weight > 0 else 75.0
        return round(overall_score, 1), dimensions_list

    @staticmethod
    def get_grade(score: float) -> str:
        if score >= 90:
            return "A"
        if score >= 75:
            return "B"
        if score >= 60:
            return "C"
        if score >= 45:
            return "D"
        return "F"

    @staticmethod
    def get_status(score: float) -> Tuple[str, str]:
        """Return (status_label, hex_color)."""
        if score >= 90:
            return "EXCELLENT", "#10b981"
        if score >= 75:
            return "HEALTHY", "#22c55e"
        if score >= 60:
            return "WARNING", "#f59e0b"
        if score >= 45:
            return "HIGH_RISK", "#f97316"
        return "CRITICAL", "#ef4444"

    @staticmethod
    def get_icon(name: str) -> str:
        icons = {
            "Architecture": "Layers",
            "Technical Debt": "Flame",
            "Reliability": "HeartPulse",
            "Knowledge": "Brain",
            "Documentation": "BookOpen",
            "Performance": "Zap",
            "Testing": "TestTube",
            "Security": "Shield",
            "Developer Experience": "Code2",
            "Scalability": "TrendingUp",
            "Maintainability": "Wrench",
        }
        return icons.get(name, "Activity")
