# apps/backend/app/intelligence_network/__init__.py

from app.intelligence_network.anti_pattern_detector import AntiPatternDetector
from app.intelligence_network.architecture_coach import AIArchitectureCoach
from app.intelligence_network.network_graph import ArchitectureKnowledgeGraph
from app.intelligence_network.pattern_advisor import AIPatternAdvisor
from app.intelligence_network.pattern_extraction import PatternExtractionEngine
from app.intelligence_network.pattern_library import ArchitecturePatternLibrary
from app.intelligence_network.recommendation_engine import (
    GlobalPatternRecommendationEngine,
)
from app.intelligence_network.repo_intel_engine import RepositoryIntelligenceEngine
from app.intelligence_network.similarity_engine import RepositorySimilarityEngine
from app.intelligence_network.trend_detector import EngineeringTrendDetector

__all__ = [
    "RepositoryIntelligenceEngine",
    "PatternExtractionEngine",
    "ArchitectureKnowledgeGraph",
    "GlobalPatternRecommendationEngine",
    "ArchitecturePatternLibrary",
    "RepositorySimilarityEngine",
    "AIPatternAdvisor",
    "EngineeringTrendDetector",
    "AntiPatternDetector",
    "AIArchitectureCoach",
]
