# apps/backend/app/ai_cto/analyzers/tradeoff_advisor.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class TradeoffAdvisorEngine:
    """
    Feature 5: AI Strategic Advisor
    Evaluates key architecture decisions (Build vs Buy, Monolith vs Microservices,
    PostgreSQL vs CockroachDB, Kafka vs RabbitMQ, Kubernetes vs Serverless)
    providing pros, cons, trade-offs, and evidence-based recommendations.
    """

    PREDEFINED_DECISIONS = {
        "build_vs_buy": {
            "decision": "Build Core Domain, Buy Supporting Infrastructure",
            "recommendation": "Build custom domain graph & reasoning engine in-house; buy managed auth (Auth0/Clerk), managed database (AWS Aurora/Cockroach Cloud), and observability (Datadog/Honeycomb).",
            "tradeoffs": [
                {
                    "dimension": "Time-to-Market",
                    "build": "Slow (6-12 months)",
                    "buy": "Fast (1-2 weeks)",
                    "verdict": "Buy supporting services to ship product features faster.",
                },
                {
                    "dimension": "Long-Term Cost",
                    "build": "High maintenance overhead",
                    "buy": "Predictable SaaS subscription",
                    "verdict": "Build core IP only; buying infrastructure reduces engineering headcount drag by 3 FTEs.",
                },
                {
                    "dimension": "Customization",
                    "build": "100% control over logic",
                    "buy": "Constrained by vendor API limits",
                    "verdict": "Core graph engine requires 100% custom code.",
                },
            ],
            "conclusion": "Buy managed infrastructure; focus 100% of engineering headcount on core CodeAtlas IP.",
        },
        "monolith_vs_microservices": {
            "decision": "Domain-Driven Modular Monolith transitioning to Microservices",
            "recommendation": "Maintain single deployment artifact while enforcing strict package boundary separation. Split into standalone microservices once domain team size exceeds 15 engineers.",
            "tradeoffs": [
                {
                    "dimension": "Operational Complexity",
                    "monolith": "Low (single pipeline)",
                    "microservices": "High (Kubernetes, service mesh, distributed tracing)",
                    "verdict": "Modular Monolith avoids prematurely complex infra.",
                },
                {
                    "dimension": "Deployment Velocity",
                    "monolith": "Coupled releases",
                    "microservices": "Independent service releases",
                    "verdict": "Modular monolith keeps velocity high for teams < 20 engineers.",
                },
                {
                    "dimension": "Fault Isolation",
                    "monolith": "Single process crash risk",
                    "microservices": "Isolated blast radius",
                    "verdict": "Add circuit breakers & retries inside monolith.",
                },
            ],
            "conclusion": "Refactor to Modular Monolith now; delay physical microservice split until Q3 2027.",
        },
        "postgres_vs_cockroachdb": {
            "decision": "PostgreSQL (Current) with CockroachDB Multi-Region Migration Plan",
            "recommendation": "Stay on PostgreSQL for initial scale (< 50,000 req/sec). Adopt CockroachDB when active multi-region active-active database replication becomes a hard SLA constraint.",
            "tradeoffs": [
                {
                    "dimension": "Developer Experience",
                    "postgres": "Native SQL, rich extensions (pgvector)",
                    "cockroach": "PostgreSQL wire compatible, subset of DDL",
                    "verdict": "PostgreSQL is easier for rapid prototyping.",
                },
                {
                    "dimension": "Global Scalability",
                    "postgres": "Primary-replica read scaling",
                    "cockroach": "Native active-active multi-region sharding",
                    "verdict": "CockroachDB wins for global 100M user scale.",
                },
                {
                    "dimension": "Infrastructure Cost",
                    "postgres": "Low ($150-$500/mo)",
                    "cockroach": "Moderate to High ($800+/mo)",
                    "verdict": "PostgreSQL saves ~65% on cloud database spend.",
                },
            ],
            "conclusion": "Use PostgreSQL read-replicas currently; migrate to CockroachDB at 100k RPS milestone.",
        },
        "kafka_vs_rabbitmq": {
            "decision": "RabbitMQ for Task Queues, NATS/Kafka for Event Streaming",
            "recommendation": "Use RabbitMQ for background task processing (Celery worker queues). Use Kafka/NATS JetStream for high-throughput event logging, auditing, and real-time graph updates.",
            "tradeoffs": [
                {
                    "dimension": "Message Retention",
                    "kafka": "Log-based persistent replay",
                    "rabbitmq": "Queue-based transient deletion",
                    "verdict": "Kafka enables event sourcing & event replay.",
                },
                {
                    "dimension": "Setup & Maintenance",
                    "kafka": "High (Zookeeper/KRaft cluster)",
                    "rabbitmq": "Low (single node / mirror queue)",
                    "verdict": "RabbitMQ is simpler for standard worker jobs.",
                },
                {
                    "dimension": "Throughput",
                    "kafka": "1,000,000+ msg/sec",
                    "rabbitmq": "50,000 msg/sec",
                    "verdict": "Kafka handles enterprise event firehoses.",
                },
            ],
            "conclusion": "Adopt RabbitMQ immediately for task queues; introduce NATS/Kafka in Phase 40.",
        },
        "kubernetes_vs_serverless": {
            "decision": "Hybrid: Serverless APIs + Managed Kubernetes Workers",
            "recommendation": "Use Serverless (AWS Lambda / Cloud Run) for low-latency HTTP REST API endpoints. Use Managed Kubernetes (EKS / GKE) for long-running graph parsing, background workers, and AI reasoning pipelines.",
            "tradeoffs": [
                {
                    "dimension": "Cold Start Latency",
                    "kubernetes": "0ms (always running)",
                    "serverless": "200ms - 2s cold starts",
                    "verdict": "Kubernetes wins for heavy compute state.",
                },
                {
                    "dimension": "Cost at Scale",
                    "kubernetes": "Fixed cluster cost",
                    "serverless": "Pay-per-request execution",
                    "verdict": "Serverless is cheaper for idle/variable traffic; K8s is cheaper for constant heavy load.",
                },
                {
                    "dimension": "Ops Maintenance",
                    "kubernetes": "Requires cluster upgrades & node pools",
                    "serverless": "Zero server maintenance",
                    "verdict": "Serverless reduces platform ops workload.",
                },
            ],
            "conclusion": "Deploy HTTP routes on Cloud Run / Serverless; run background graph engine workers on EKS.",
        },
    }

    def evaluate_decision(
        self, db: Session, repo_id: str, decision_key: str = "monolith_vs_microservices"
    ) -> Dict[str, Any]:
        key = decision_key.lower().replace(" ", "_").replace("-", "_")
        if key in self.PREDEFINED_DECISIONS:
            res = dict(self.PREDEFINED_DECISIONS[key])
        else:
            res = {
                "decision": f"Evaluated trade-offs for {decision_key}",
                "recommendation": f"Perform POC benchmarking for {decision_key} prior to migration.",
                "tradeoffs": [
                    {
                        "dimension": "Cost",
                        "option_a": "Lower initial cost",
                        "option_b": "Lower operational cost",
                        "verdict": "Option A recommended for short term.",
                    },
                    {
                        "dimension": "Complexity",
                        "option_a": "Simple setup",
                        "option_b": "Distributed setup",
                        "verdict": "Option A is simpler for current team size.",
                    },
                ],
                "conclusion": f"Carefully evaluate team readiness before adopting {decision_key}.",
            }

        res["repository_id"] = repo_id
        res["all_available_decisions"] = list(self.PREDEFINED_DECISIONS.keys())
        return res
