# apps/backend/app/visual_engine/gamification_engine.py

from typing import Any, Dict

from sqlalchemy.orm import Session

from app.models.visual_experience import EngineeringAchievement


class GamificationEngine:
    """
    Feature 11: Interactive Engineering Game (Mission Mode)
    Feature 12: Engineering Achievements
    Feature 13: Code DNA
    Feature 19: Repository Life Score
    Feature 20: Engineering Metaverse
    """

    DEFAULT_ACHIEVEMENTS = [
        {
            "key": "god-object-destroyer",
            "title": "🏅 God Object Destroyer",
            "desc": "Refactored monolithic class > 1,500 lines into 4 modular micro-components.",
            "unlocked": True,
        },
        {
            "key": "architecture-guardian",
            "title": "🏅 Architecture Guardian",
            "desc": "Enforced zero-trust mTLS policy across 100% of microservice endpoints.",
            "unlocked": True,
        },
        {
            "key": "dependency-slayer",
            "title": "🏅 Dependency Slayer",
            "desc": "Eliminated 5 circular dependencies and 12 unused third-party packages.",
            "unlocked": True,
        },
        {
            "key": "test-master",
            "title": "🏅 Test Master",
            "desc": "Increased automated test coverage from 68% to 92% across all repos.",
            "unlocked": True,
        },
    ]

    def get_mission_mode_status(self, db: Session) -> Dict[str, Any]:
        return {
            "current_mission": "Mission: Modernize Payment Infrastructure",
            "start_health_pct": "68.0%",
            "current_health_pct": "84.5%",
            "target_health_pct": "90.0%",
            "mission_progress_pct": 75,
            "tasks": [
                {"task": "Reduce coupling on checkout-service", "status": "COMPLETED"},
                {
                    "task": "Remediate 3 critical CVE vulnerabilities",
                    "status": "COMPLETED",
                },
                {"task": "Increase test coverage to > 85%", "status": "IN_PROGRESS"},
                {
                    "task": "Apply Redis L2 caching to ingestion worker",
                    "status": "PENDING",
                },
            ],
            "exp_gained": 4850,
            "level": "Level 14 Senior Architect",
        }

    def get_achievements(self, db: Session) -> Dict[str, Any]:
        items = db.query(EngineeringAchievement).all()
        achievements = [
            {
                "key": a.badge_key,
                "title": a.title,
                "desc": a.description,
                "unlocked": True if a.unlocked == "UNLOCKED" else False,
            }
            for a in items
        ]

        if not achievements:
            achievements = self.DEFAULT_ACHIEVEMENTS

        return {
            "total_unlocked": len([a for a in achievements if a["unlocked"]]),
            "total_available": len(achievements),
            "achievements": achievements,
        }

    def get_code_dna(self, db: Session) -> Dict[str, Any]:
        return {
            "genome_id": "DNA-REPO-AUTH-2026",
            "dna_metrics": {
                "reliability": 94,
                "performance": 88,
                "architecture": 96,
                "security": 92,
                "maintainability": 90,
                "testability": 86,
            },
            "overall_rating": "AAA+ Enterprise Grade",
        }

    def get_repository_life_score(self, db: Session) -> Dict[str, Any]:
        return {
            "fitness_score": "94.2 / 100",
            "metrics": {
                "repository_age": "3 Years 4 Months",
                "maintainability_score": "92.5%",
                "knowledge_index": "96.0% (Low Bus Factor Risk)",
                "performance_rating": "p95 42ms (Optimal)",
                "health_status": "EXCELLENT",
                "growth_velocity": "+18.4% Features / Month",
                "technical_debt": "Managed (12.0%)",
            },
        }

    def get_metaverse_session(self, db: Session) -> Dict[str, Any]:
        return {
            "metaverse_name": "CodeAtlas Shared Architecture Room",
            "connected_engineers": 4,
            "participants": [
                {
                    "name": "Lead Architect",
                    "avatar": "👨‍💻",
                    "location": "Auth District",
                },
                {
                    "name": "Senior SRE",
                    "avatar": "👩‍💻",
                    "location": "Payments District",
                },
                {"name": "AI CTO Agent", "avatar": "🤖", "location": "Mission Control"},
                {"name": "Security Auditor", "avatar": "🛡️", "location": "Cloud Orbit"},
            ],
            "active_collaboration": "Reviewing Pull Request #481 in virtual 3D room.",
        }
