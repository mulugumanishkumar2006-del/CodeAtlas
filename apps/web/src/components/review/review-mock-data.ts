export type ReviewRolePerspective = 'Developer' | 'Tech Lead' | 'Staff Engineer' | 'Principal Engineer' | 'Engineering Manager' | 'Director' | 'CTO';

export type ReviewModeType =
  | 'Overall Architecture'
  | 'Scalability'
  | 'Performance'
  | 'Security'
  | 'Reliability'
  | 'Maintainability'
  | 'Developer Experience'
  | 'Cloud Readiness'
  | 'Microservices'
  | 'Event Driven'
  | 'Domain Driven Design'
  | 'Clean Architecture'
  | 'Hexagonal Architecture'
  | 'CQRS'
  | 'Event Sourcing'
  | 'Layered Architecture'
  | 'Monolith'
  | 'Modular Monolith'
  | 'Serverless'
  | 'Kubernetes'
  | 'Platform Engineering'
  | 'Repository Organization'
  | 'API Design'
  | 'Database Design';

export interface ScorecardDimension {
  name: string;
  scorePct: number;
  previousScorePct: number;
  status: 'Excellent' | 'Good' | 'Warning' | 'Critical';
  analysis: string;
  frameworkPillar: string; // e.g. "AWS Well-Architected: Performance Efficiency"
}

export interface DesignOption {
  optionName: string;
  title: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  complexity: 'Low' | 'Medium' | 'High';
  estimatedCost: string;
  effortHours: number;
  riskReductionPct: number;
  scalabilityRating: 'Good' | 'Excellent' | 'Fair';
}

export interface ReviewFinding {
  id: string;
  title: string;
  category: 'Architecture Smell' | 'Layer Violation' | 'Bottleneck' | 'Security Risk';
  severity: 'Critical' | 'High' | 'Medium';
  affectedComponent: string;
  evidence: string;
  frameworkMapping: string;
  businessImpact: string;
  designOptions: DesignOption[];
}

export const MOCK_SCORECARD_DIMENSIONS: ScorecardDimension[] = [
  { name: 'Architecture Quality', scorePct: 94, previousScorePct: 92, status: 'Excellent', analysis: 'Strict domain layer separation across 87% of services.', frameworkPillar: 'Clean Architecture Principles' },
  { name: 'Scalability', scorePct: 86, previousScorePct: 84, status: 'Good', analysis: 'Stateless JWT auth scales linearly; PaymentService requires event queue decoupling.', frameworkPillar: 'AWS Well-Architected: Performance' },
  { name: 'Maintainability', scorePct: 82, previousScorePct: 85, status: 'Good', analysis: 'High modularity score; 1 layer bypass detected in database access layer.', frameworkPillar: 'SOLID: Dependency Inversion' },
  { name: 'Reliability', scorePct: 96, previousScorePct: 95, status: 'Excellent', analysis: 'Sub-second failover and multi-region Redis cluster fallback active.', frameworkPillar: 'Google SRE: Fault Tolerance' },
  { name: 'Security', scorePct: 95, previousScorePct: 94, status: 'Excellent', analysis: 'RS256 asymmetric token signing & mTLS Istio sidecars verified.', frameworkPillar: 'OWASP Top 10 API Security' },
  { name: 'Performance', scorePct: 88, previousScorePct: 82, status: 'Good', analysis: 'P95 latency 245ms; Stripe external API call represents 67% of request duration.', frameworkPillar: '12-Factor App: Concurrency' },
  { name: 'Modularity', scorePct: 84, previousScorePct: 88, status: 'Good', analysis: 'Clean package bounds in Next.js frontend and Python FastAPI services.', frameworkPillar: 'DDD: Bounded Contexts' },
  { name: 'Developer Experience', scorePct: 91, previousScorePct: 89, status: 'Excellent', analysis: 'Instant local docker-compose orchestration and auto-generated OpenAPI specs.', frameworkPillar: 'Platform Engineering UX' },
  { name: 'Testability', scorePct: 89, previousScorePct: 88, status: 'Good', analysis: '84% unit test coverage and integrated Cypress e2e test suite.', frameworkPillar: 'Testing Pyramid Standards' },
  { name: 'Documentation', scorePct: 78, previousScorePct: 80, status: 'Warning', analysis: 'Living ADR system active; 2 microservices missing updated OpenAPI schemas.', frameworkPillar: 'Documentation-as-Code' },
  { name: 'Cloud Readiness', scorePct: 92, previousScorePct: 90, status: 'Excellent', analysis: 'Fully containerized with Helm charts and Strimzi Kafka operator.', frameworkPillar: 'CNCF Cloud Native Standards' },
  { name: 'Observability', scorePct: 90, previousScorePct: 88, status: 'Excellent', analysis: 'Jaeger distributed tracing and Prometheus telemetry exporters enabled.', frameworkPillar: 'OpenTelemetry Observability' },
  { name: 'Deployment Readiness', scorePct: 94, previousScorePct: 92, status: 'Excellent', analysis: 'Automated GitHub Actions CI/CD pipeline with Istio 90/10 canary splitting.', frameworkPillar: 'GitOps Continuous Deployment' }
];

export const MOCK_REVIEW_FINDINGS: ReviewFinding[] = [
  {
    id: 'finding-1',
    title: 'High Fan-Out Bottleneck & Layer Bypass in PaymentService',
    category: 'Layer Violation',
    severity: 'Critical',
    affectedComponent: 'Payment & Billing Microservice (svc-payment-core)',
    evidence: 'PaymentService depends directly on 18 external modules and executes direct Cypher SQL queries to Neo4j, bypassing repository abstraction.',
    frameworkMapping: 'SOLID: Dependency Inversion Principle & AWS Well-Architected Performance Pillar',
    businessImpact: 'Increases downtime risk during database migrations and limits checkout throughput under Black Friday spikes.',
    designOptions: [
      {
        optionName: 'Option A (Recommended)',
        title: 'Decouple via Kafka Event Stream & Repository Pattern',
        description: 'Offload payment capture to asynchronous Kafka payment.events.v1 topic and wrap Cypher queries in GraphQueryRepository.',
        advantages: ['Eliminates 67% of synchronous checkout latency', 'Restores 100% domain isolation', 'Replayable event log'],
        disadvantages: ['Requires 24 hours of engineering refactoring'],
        complexity: 'Medium',
        estimatedCost: '$80/mo Kafka topic infra',
        effortHours: 24,
        riskReductionPct: 35,
        scalabilityRating: 'Excellent'
      },
      {
        optionName: 'Option B',
        title: 'Introduce Redis Read-Through Cache Layer',
        description: 'Cache Cypher query results in Redis 7 Cluster with 1-hour TTL invalidation.',
        advantages: ['Sub-millisecond read retrieval', 'Minimal code changes needed'],
        disadvantages: ['Does not solve high fan-out coupling; potential stale cache'],
        complexity: 'Low',
        estimatedCost: '$120/mo Redis RAM',
        effortHours: 12,
        riskReductionPct: 18,
        scalabilityRating: 'Good'
      },
      {
        optionName: 'Option C',
        title: 'Extract Dedicated Stripe Webhook Microservice',
        description: 'Split PaymentService into PaymentCheckout API and PaymentWebhook Worker.',
        advantages: ['Isolates third-party failure domains completely'],
        disadvantages: ['Adds new microservice deployment overhead'],
        complexity: 'High',
        estimatedCost: '$160/mo additional pod',
        effortHours: 40,
        riskReductionPct: 28,
        scalabilityRating: 'Excellent'
      }
    ]
  }
];
