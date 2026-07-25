# apps/backend/app/reality_engine/simulation/traffic_simulator.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class TrafficSimulator:
    def simulate_traffic_spike(
        self, db: Session, multiplier: int = 10
    ) -> Dict[str, Any]:
        baseline_rpm = 18500.0
        spiked_rpm = baseline_rpm * multiplier

        return {
            "traffic_multiplier": f"{multiplier}x Spike",
            "simulated_rpm": spiked_rpm,
            "system_response": {
                "k8s_autoscaling_action": f"Autoscaled pods from 8 ➔ {8 * multiplier // 2}",
                "predicted_p95_latency_ms": 140.0 if multiplier > 5 else 55.0,
                "bottleneck_warning": "Postgres Primary DB CPU spikes to 88% under 10x load.",
            },
        }
