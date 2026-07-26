# apps/backend/app/services/spe_service.py

from typing import Optional

from sqlalchemy.orm import Session

from app.schemas.spe import (
    ComponentPhysicsProfile,
    SoftwarePhysicsMetrics,
    SPEUniverseRequest,
    SPEUniverseResponse,
)


class SPEService:
    def _make_visual_gauge(self, score: float) -> str:
        """Converts a 0 to 10 score into a visual gauge bar (e.g. 8.0 -> '████████  ')."""
        num_blocks = min(10, max(0, int(round(score))))
        return "█" * num_blocks + "░" * (10 - num_blocks)

    def get_component_physics(
        self, component_id: str = "auth_service", db: Optional[Session] = None
    ) -> ComponentPhysicsProfile:
        """Calculates 10-property physics profile for a specific microservice component."""
        profiles = {
            "auth_service": ComponentPhysicsProfile(
                component_id="auth_service",
                component_name="Authentication Service",
                physics=SoftwarePhysicsMetrics(
                    mass=10.0,
                    gravity=9.0,
                    energy=8.5,
                    momentum=4.0,
                    friction=7.0,
                    temperature=7.0,
                    pressure=8.0,
                    velocity=2.0,
                    elasticity=9.0,
                    entropy=6.0,
                ),
                visual_gauges={
                    "mass": self._make_visual_gauge(10.0),
                    "gravity": self._make_visual_gauge(9.0),
                    "energy": self._make_visual_gauge(8.5),
                    "momentum": self._make_visual_gauge(4.0),
                    "friction": self._make_visual_gauge(7.0),
                    "temperature": self._make_visual_gauge(7.0),
                    "pressure": self._make_visual_gauge(8.0),
                    "velocity": self._make_visual_gauge(2.0),
                    "elasticity": self._make_visual_gauge(9.0),
                    "entropy": self._make_visual_gauge(6.0),
                },
                intuition_summary="Authentication Service has High Mass (10/10) and High Gravity (9/10). Changes carry intense orbital pull across 14 consuming microservices.",
                physical_law_verdict="HIGH_GRAVITATIONAL_ORBITAL_PULL",
            ),
            "checkout_service": ComponentPhysicsProfile(
                component_id="checkout_service",
                component_name="Checkout Service",
                physics=SoftwarePhysicsMetrics(
                    mass=8.5,
                    gravity=8.0,
                    energy=9.5,
                    momentum=7.5,
                    friction=8.0,
                    temperature=9.0,
                    pressure=9.5,
                    velocity=6.5,
                    elasticity=7.0,
                    entropy=7.5,
                ),
                visual_gauges={
                    "mass": self._make_visual_gauge(8.5),
                    "gravity": self._make_visual_gauge(8.0),
                    "energy": self._make_visual_gauge(9.5),
                    "momentum": self._make_visual_gauge(7.5),
                    "friction": self._make_visual_gauge(8.0),
                    "temperature": self._make_visual_gauge(9.0),
                    "pressure": self._make_visual_gauge(9.5),
                    "velocity": self._make_visual_gauge(6.5),
                    "elasticity": self._make_visual_gauge(7.0),
                    "entropy": self._make_visual_gauge(7.5),
                },
                intuition_summary="Checkout Service operates under Extreme Thermal Pressure (9.5/10) and High Entropy (7.5/10). High refactoring friction requires active cooling.",
                physical_law_verdict="HIGH_THERMAL_PRESSURE_ENTROPY_DECAY",
            ),
            "inventory_service": ComponentPhysicsProfile(
                component_id="inventory_service",
                component_name="Inventory Service",
                physics=SoftwarePhysicsMetrics(
                    mass=6.0,
                    gravity=5.0,
                    energy=6.5,
                    momentum=5.0,
                    friction=3.0,
                    temperature=4.0,
                    pressure=6.0,
                    velocity=4.5,
                    elasticity=8.5,
                    entropy=3.5,
                ),
                visual_gauges={
                    "mass": self._make_visual_gauge(6.0),
                    "gravity": self._make_visual_gauge(5.0),
                    "energy": self._make_visual_gauge(6.5),
                    "momentum": self._make_visual_gauge(5.0),
                    "friction": self._make_visual_gauge(3.0),
                    "temperature": self._make_visual_gauge(4.0),
                    "pressure": self._make_visual_gauge(6.0),
                    "velocity": self._make_visual_gauge(4.5),
                    "elasticity": self._make_visual_gauge(8.5),
                    "entropy": self._make_visual_gauge(3.5),
                },
                intuition_summary="Inventory Service maintains Optimal Thermal Equilibrium with Low Entropy (3.5/10) and High Elasticity (8.5/10).",
                physical_law_verdict="STABLE_THERMODYNAMIC_EQUILIBRIUM",
            ),
        }

        return profiles.get(component_id, profiles["auth_service"])

    def simulate_universe(
        self, request: SPEUniverseRequest, db: Optional[Session] = None
    ) -> SPEUniverseResponse:
        """Simulates full system software physics universe across all microservices."""
        comps = [
            self.get_component_physics("auth_service", db),
            self.get_component_physics("checkout_service", db),
            self.get_component_physics("inventory_service", db),
        ]

        total_mass = sum(c.physics.mass for c in comps)
        avg_entropy = sum(c.physics.entropy for c in comps) / len(comps)

        return SPEUniverseResponse(
            universe_title="CodeAtlas Enterprise Software Physics Universe",
            total_components_simulated=len(comps),
            system_total_mass=total_mass,
            system_avg_entropy=round(avg_entropy, 2),
            components=comps,
            physics_simulation_verdict="PHYSICS_UNIVERSE_SIMULATION_OPTIMAL",
        )
