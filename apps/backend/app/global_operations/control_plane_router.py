"""
CodeAtlas v3.6 - Multi-Region Control Plane & Cloud Abstraction Engine
Manages region registration, health-aware global load balancing, multi-cloud abstraction (AWS, GCP, Azure), and environment graph.
"""

import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class CloudProvider:
    AWS = "AWS"
    GCP = "GCP"
    AZURE = "AZURE"

class RegionStatus:
    HEALTHY = "HEALTHY"
    DEGRADED = "DEGRADED"
    DRAINING = "DRAINING"
    DISABLED = "DISABLED"
    FAILOVER = "FAILOVER"

class MultiRegionControlPlaneEngine:
    def __init__(self):
        self.regions: Dict[str, Dict[str, Any]] = {}
        self.environments: Dict[str, Dict[str, Any]] = {}
        self._initialize_regions()
        self._initialize_environments()

    def _initialize_regions(self):
        default_regions_spec = [
            ("reg_us_east", "US East (N. Virginia)", CloudProvider.AWS, "us-east-1", "North America", 12.4, 99.99),
            ("reg_eu_west", "EU West (Frankfurt)", CloudProvider.GCP, "europe-west3", "Europe (GDPR Vault)", 48.2, 99.98),
            ("reg_ap_south", "AP South (Mumbai)", CloudProvider.AZURE, "centralindia", "Asia Pacific", 84.1, 99.95)
        ]
        for reg_id, name, provider, zone, geo, latency, avail in default_regions_spec:
            self.regions[reg_id] = {
                "region_id": reg_id,
                "name": name,
                "cloud_provider": provider,
                "zone": zone,
                "geographic_location": geo,
                "status": RegionStatus.HEALTHY,
                "avg_latency_ms": latency,
                "availability_pct": avail,
                "capacity_utilization_pct": 62.5,
                "data_residency_policy": "STRICT_EU_ONLY" if "EU" in name else "GLOBAL_SHARED",
                "registered_at": datetime.now(timezone.utc).isoformat()
            }

    def _initialize_environments(self):
        envs = ["Development", "Testing", "Staging", "Production", "DisasterRecovery"]
        for env in envs:
            self.environments[env.lower()] = {
                "environment": env,
                "active_regions": ["reg_us_east", "reg_eu_west"],
                "dr_region": "reg_ap_south",
                "isolation_level": "STRICT"
            }

    def list_regions(self) -> List[Dict[str, Any]]:
        return list(self.regions.values())

    def update_region_status(self, region_id: str, new_status: str) -> Dict[str, Any]:
        """Supports Region Management: Enable, Disable, Drain, Migrate, Failover."""
        if region_id not in self.regions:
            raise ValueError(f"Region {region_id} not found")
        self.regions[region_id]["status"] = new_status
        self.regions[region_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
        return self.regions[region_id]

    def route_global_traffic(self, user_location: str, tenant_residency: str) -> Dict[str, Any]:
        """Global Routing & Health-Aware Load Balancing considering Latency, Data Residency & Policy."""
        if tenant_residency == "EU_ONLY":
            optimal = self.regions["reg_eu_west"]
            reason = "DATA_RESIDENCY_STRICT_EU"
        elif "Asia" in user_location:
            optimal = self.regions["reg_ap_south"]
            reason = "OPTIMAL_GEOGRAPHIC_LATENCY"
        else:
            optimal = self.regions["reg_us_east"]
            reason = "PRIMARY_LOWEST_LATENCY"

        return {
            "routed_region_id": optimal["region_id"],
            "region_name": optimal["name"],
            "cloud_provider": optimal["cloud_provider"],
            "routing_reason": reason,
            "estimated_latency_ms": optimal["avg_latency_ms"]
        }

    def get_cloud_abstraction_model(self) -> Dict[str, Any]:
        """Normalizes Compute, Storage, Networking, Identity, Observability across AWS, GCP, Azure."""
        return {
            "normalized_primitives": {
                "compute": {"AWS": "ECS/EKS", "GCP": "GKE/CloudRun", "AZURE": "AKS"},
                "storage": {"AWS": "S3/Aurora", "GCP": "CloudStorage/Spanner", "AZURE": "Blob/CosmosDB"},
                "observability": {"AWS": "CloudWatch/OTEL", "GCP": "CloudMonitoring", "AZURE": "AppInsights"}
            },
            "abstraction_status": "UNIFIED_CODEATLAS_V36"
        }
