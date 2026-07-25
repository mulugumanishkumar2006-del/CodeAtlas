# apps/backend/app/os_kernel/role_dashboard_engine.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class RoleDashboardEngine:
    """
    Feature 30: Role-Based Dashboards
    Tailors the CodeAtlas OS view for 6 distinct engineering roles:
    Developer, Tech Lead, Architect, SRE, QA, CTO
    """

    ROLES = ["Developer", "Tech Lead", "Architect", "SRE", "QA", "CTO"]

    def get_role_dashboard(self, db: Session, role: str) -> Dict[str, Any]:
        matched_role = "Developer"
        if role:
            for r in self.ROLES:
                if r.lower() == role.lower():
                    matched_role = r
                    break
        normalized_role = matched_role

        if normalized_role == "Developer":
            widgets = [
                {
                    "title": "My Open PRs & Code Reviews",
                    "metric": "3 Pending Reviews",
                    "status": "OPTIMAL",
                },
                {
                    "title": "Local Branch Health & Linter Warnings",
                    "metric": "0 Errors, 2 Warnings",
                    "status": "PASSED",
                },
                {
                    "title": "Automated Pre-PR Guard Check",
                    "metric": "ALL GATES GREEN",
                    "status": "PASSED",
                },
            ]
            primary_focus = (
                "Code Quality, Fast PR Feedback, and Local Workspace Productivity"
            )
        elif normalized_role == "Tech Lead":
            widgets = [
                {
                    "title": "Team Sprint Velocity & Debt Items",
                    "metric": "42 Story Points / Sprint",
                    "status": "ON_TRACK",
                },
                {
                    "title": "Bus Factor & Ownership Hotspots",
                    "metric": "1 High Risk Hotspot",
                    "status": "WARNING",
                },
                {
                    "title": "Code Review Bottlenecks",
                    "metric": "Avg Review Time: 1.4 Hours",
                    "status": "OPTIMAL",
                },
            ]
            primary_focus = (
                "Sprint Delivery, Team Knowledge Distribution, and Code Review Velocity"
            )
        elif normalized_role == "Architect":
            widgets = [
                {
                    "title": "Enterprise Knowledge Graph & ADRs",
                    "metric": "142 Services Mapped",
                    "status": "OPTIMAL",
                },
                {
                    "title": "Architecture Drift & Standard Violations",
                    "metric": "98.4% Compliance",
                    "status": "PASSED",
                },
                {
                    "title": "Multi-Repo Dependency Map",
                    "metric": "0 Circular Dependencies",
                    "status": "PASSED",
                },
            ]
            primary_focus = (
                "System Scalability, Architectural Consistency, and Technical Standards"
            )
        elif normalized_role == "SRE":
            widgets = [
                {
                    "title": "Datadog APM & Latency Telemetry",
                    "metric": "p95 Latency: 42ms",
                    "status": "OPTIMAL",
                },
                {
                    "title": "Live Incident Stream & Outage Predictor",
                    "metric": "0 Active Incidents",
                    "status": "HEALTHY",
                },
                {
                    "title": "Kubernetes Cluster Capacity & IOPS",
                    "metric": "62% Capacity Utilization",
                    "status": "OPTIMAL",
                },
            ]
            primary_focus = (
                "System Reliability, Incident Mitigation, and Infrastructure Resilience"
            )
        elif normalized_role == "QA":
            widgets = [
                {
                    "title": "Automated Test Coverage Matrix",
                    "metric": "84.5% Code Coverage",
                    "status": "OPTIMAL",
                },
                {
                    "title": "Regression Risk Analyzer Engine",
                    "metric": "Low Risk Score: 4.2%",
                    "status": "PASSED",
                },
                {
                    "title": "Flaky Test Detector & Pipeline Runs",
                    "metric": "99.2% Pipeline Success",
                    "status": "PASSED",
                },
            ]
            primary_focus = (
                "Test Automation, Regression Prevention, and Release Quality"
            )
        else:  # CTO
            widgets = [
                {
                    "title": "Organization Health Score & DORA KPIs",
                    "metric": "93.0 / 100 Health",
                    "status": "EXCELLENT",
                },
                {
                    "title": "Engineering Cost & ROI Summary",
                    "metric": "$1.45M Cost Avoidance",
                    "status": "7.4x ROI",
                },
                {
                    "title": "Executive AI Strategy Advisory",
                    "metric": "Top Priority: Modernize Legacy Payments",
                    "status": "RECOMMENDED",
                },
            ]
            primary_focus = "Executive Governance, Engineering ROI, Cost Efficiency, and Strategic Roadmap"

        return {
            "role": normalized_role,
            "available_roles": self.ROLES,
            "primary_focus": primary_focus,
            "widgets": widgets,
        }
