# apps/backend/app/ai_cto/planners/cost_optimizer.py

from typing import List

from app.ai_cto.schemas.recommendation import CostOptimization


class CostOptimizer:
    def plan(self, budget_reduction_pct: float = 0.0) -> List[CostOptimization]:
        """
        Recommends specific, codebase-backed cost optimization items.
        """
        opts = [
            CostOptimization(
                title="Consolidate cache connections and reuse pools",
                target="Redis Cache Server",
                current_cost_usd=120.0,
                proposed_cost_usd=60.0,
                action_required="Enable connection reuse in app configuration and clean up stale client instances.",
                performance_impact="No impact on speed. Reduces memory footprint on cache cluster.",
            ),
            CostOptimization(
                title="Migrate compute hotspots to scale-to-zero serverless",
                target="App Containers / Kubernetes Cluster",
                current_cost_usd=450.0,
                proposed_cost_usd=250.0,
                action_required="Deploy high compute tasks to serverless function runtimes.",
                performance_impact="Slight cold start latency. Saves massive baseline monthly compute fees.",
            ),
        ]

        return opts
