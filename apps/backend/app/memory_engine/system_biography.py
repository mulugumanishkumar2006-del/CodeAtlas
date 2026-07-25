# apps/backend/app/memory_engine/system_biography.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class SystemBiographyEngine:
    def get_service_biography(
        self, db: Session, service_name: str = "Authentication Service"
    ) -> Dict[str, Any]:
        biographies = {
            "Authentication Service": {
                "service_name": "Authentication Service",
                "tagline": "The Identity & Security Guardian of CodeAtlas",
                "life_story_stages": [
                    {
                        "stage": 1,
                        "title": "Created (August 2025)",
                        "detail": "Born as an in-process monolithic auth module inside FastAPI baseline core.",
                    },
                    {
                        "stage": 2,
                        "title": "Reason (Why it Exists)",
                        "detail": "Centralized session verification and stateless JWT token issuance.",
                    },
                    {
                        "stage": 3,
                        "title": "First Deployment (Sept 2025)",
                        "detail": "Deployed to AWS EKS cluster on single Postgres relational node.",
                    },
                    {
                        "stage": 4,
                        "title": "Major Refactor (Jan 2026)",
                        "detail": "PR #145 added Redis L2 write-through permission cache, bypassing 14,000 DB queries/sec.",
                    },
                    {
                        "stage": 5,
                        "title": "Incidents (Jan 2026)",
                        "detail": "INC-741 Token Latency Spike (SEV-2) resolved within 12 minutes via cache warming.",
                    },
                    {
                        "stage": 6,
                        "title": "Performance Changes",
                        "detail": "p95 latency reduced from 140ms down to 18ms.",
                    },
                    {
                        "stage": 7,
                        "title": "Security Updates (Feb 2026)",
                        "detail": "Upgraded JWT signing keys to RS256 with automated quarterly rotation.",
                    },
                    {
                        "stage": 8,
                        "title": "Current Health",
                        "detail": "99.99% Uptime, 98.4/100 Health Score, 0 active CVE risks.",
                    },
                    {
                        "stage": 9,
                        "title": "Future Predictions",
                        "detail": "Will require gRPC Token Vault decoupling within 12m to survive 45K QPS surge.",
                    },
                ],
            },
            "Payment Gateway": {
                "service_name": "Payment Gateway",
                "tagline": "Financial Transaction Processing Core",
                "life_story_stages": [
                    {
                        "stage": 1,
                        "title": "Created (Sept 2025)",
                        "detail": "Monolithic payment processor created for Stripe integration.",
                    },
                    {
                        "stage": 2,
                        "title": "Reason (Why it Exists)",
                        "detail": "Secure checkout transactions and multi-currency billing.",
                    },
                    {
                        "stage": 3,
                        "title": "First Deployment (Oct 2025)",
                        "detail": "Deployed on AWS EKS with single DB connection pool.",
                    },
                    {
                        "stage": 4,
                        "title": "Major Refactor (Feb 2026)",
                        "detail": "PR #182 split monolithic orders & payment schema.",
                    },
                    {
                        "stage": 5,
                        "title": "Incidents (Feb 2026)",
                        "detail": "INC-882 DB row lock lockout during 2.5x surge.",
                    },
                    {
                        "stage": 6,
                        "title": "Performance Changes",
                        "detail": "Throughput increased from 1,200 QPS to 8,500 QPS.",
                    },
                    {
                        "stage": 7,
                        "title": "Security Updates (Mar 2026)",
                        "detail": "PCI-DSS compliance audit passed with zero findings.",
                    },
                    {
                        "stage": 8,
                        "title": "Current Health",
                        "detail": "82.4/100 Saturation Score (Evolution Required).",
                    },
                    {
                        "stage": 9,
                        "title": "Future Predictions",
                        "detail": "Must split into standalone microservice in Q3 2027.",
                    },
                ],
            },
        }

        selected_bio = biographies.get(
            service_name, biographies["Authentication Service"]
        )
        return {
            "biography_status": "SERVICE_BIOGRAPHY_GENERATED",
            "biography": selected_bio,
            "available_services": ["Authentication Service", "Payment Gateway"],
        }
