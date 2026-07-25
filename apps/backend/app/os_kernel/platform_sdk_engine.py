# apps/backend/app/os_kernel/platform_sdk_engine.py

from typing import Any, Dict

from sqlalchemy.orm import Session

from app.models.codeatlas_os import PlatformPlugin


class PlatformSDKEngine:
    """
    Feature 28: Repository Marketplace
    Feature 36: Platform SDK
    Allows organizations to register custom extensions, plugins, and custom code analyzers.
    """

    DEFAULT_PLUGINS = [
        {
            "plugin_name": "snyk-security-analyzer",
            "version": "2.4.0",
            "description": "Scans repository dependencies for CVE vulnerabilities and licencing compliance.",
            "author": "CodeAtlas Platform Team",
            "status": "ENABLED",
        },
        {
            "plugin_name": "datadog-telemetry-connector",
            "version": "1.8.2",
            "description": "Stream live APM p95 latency and RPM metrics into Knowledge Graph nodes.",
            "author": "SRE Guild",
            "status": "ENABLED",
        },
        {
            "plugin_name": "sonar-quality-gate-plugin",
            "version": "3.1.0",
            "description": "Enforces SonarQube quality gate thresholds before PR merge approval.",
            "author": "Quality Engineering",
            "status": "ENABLED",
        },
        {
            "plugin_name": "custom-architecture-linter",
            "version": "1.0.5",
            "description": "Validates enterprise zero-trust mTLS annotations across Kubernetes manifests.",
            "author": "Enterprise Architecture Team",
            "status": "ENABLED",
        },
    ]

    def get_marketplace_plugins(self, db: Session) -> Dict[str, Any]:
        plugins = db.query(PlatformPlugin).all()

        plugin_list = [
            {
                "plugin_name": p.plugin_name,
                "version": p.version,
                "description": p.description,
                "author": p.author,
                "status": p.status,
            }
            for p in plugins
        ]

        if not plugin_list:
            plugin_list = self.DEFAULT_PLUGINS

        return {
            "total_installed": len(plugin_list),
            "sdk_version": "20.0.0-SDK",
            "plugins": plugin_list,
        }

    def register_plugin(
        self,
        db: Session,
        plugin_name: str,
        description: str,
        version: str = "1.0.0",
        author: str = "Custom Developer",
    ) -> Dict[str, Any]:
        plugin = PlatformPlugin(
            plugin_name=plugin_name,
            version=version,
            description=description,
            author=author,
            status="ENABLED",
        )
        db.add(plugin)
        db.commit()
        db.refresh(plugin)
        return {
            "plugin_id": plugin.id,
            "plugin_name": plugin.plugin_name,
            "status": "ENABLED",
        }
