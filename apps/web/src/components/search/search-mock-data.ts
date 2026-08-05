export type SearchModeType =
  | 'Architecture'
  | 'Dependency'
  | 'Execution'
  | 'Performance'
  | 'Security'
  | 'Documentation'
  | 'Repository'
  | 'Simulation'
  | 'Monitoring'
  | 'Knowledge'
  | 'Timeline';

export interface SearchResultItem {
  id: string;
  title: string;
  type: 'Microservice' | 'REST API' | 'Database' | 'Cache' | 'Queue' | 'Module' | 'ADR' | 'Execution Trace' | 'Simulation Result' | 'Repository';
  repository: string;
  layer: 'Frontend' | 'API Gateway' | 'Domain Service' | 'Data Store' | 'Messaging' | 'Infrastructure';
  healthScorePct: number;
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  aiSummary: string;
  relationships: { label: string; targetName: string; targetType: string }[];
  confidencePct: number;
  lastUpdated: string;
  navigationTarget: {
    architectureUrl: string;
    knowledgeUrl: string;
    dependencyUrl: string;
    executionUrl: string;
    simulationUrl: string;
  };
}

export interface SearchInsightObservation {
  id: string;
  title: string;
  observation: string;
  evidence: string;
  confidencePct: number;
  suggestedAction: string;
  targetUrl: string;
}

export const MOCK_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: 'res-svc-payment',
    title: 'Payment & Billing Microservice (svc-payment-core)',
    type: 'Microservice',
    repository: 'CodeAtlas/apps/backend/services/payment',
    layer: 'Domain Service',
    healthScorePct: 78,
    riskRating: 'High',
    aiSummary: 'Core microservice for enterprise billing and Stripe gateway integration. Appears in 87 architectural paths.',
    relationships: [
      { label: 'Depends On', targetName: 'Redis L2 Cache', targetType: 'Cache' },
      { label: 'Reads/Writes', targetName: 'PostgreSQL Subscriptions DB', targetType: 'Database' },
      { label: 'Publishes', targetName: 'Kafka payment.events.v1', targetType: 'Queue' }
    ],
    confidencePct: 98,
    lastUpdated: '2 mins ago',
    navigationTarget: {
      architectureUrl: '/architecture?focus=svc-payment-core',
      knowledgeUrl: '/knowledge?entity=svc-payment-core',
      dependencyUrl: '/dependency-graph?select=svc-payment-core',
      executionUrl: '/investigate?symbol=svc-payment-core',
      simulationUrl: '/simulate?target=svc-payment-core'
    }
  },
  {
    id: 'res-api-checkout',
    title: 'POST /api/v1/billing/checkout (Checkout API Endpoint)',
    type: 'REST API',
    repository: 'CodeAtlas/apps/backend/app/billing',
    layer: 'API Gateway',
    healthScorePct: 88,
    riskRating: 'Medium',
    aiSummary: 'Primary entry point for customer subscription checkouts. Total execution time: 245ms (P95: 280ms).',
    relationships: [
      { label: 'Validated By', targetName: 'AuthJwtMiddleware', targetType: 'Module' },
      { label: 'Calls External', targetName: 'Stripe Cloud Gateway', targetType: 'REST API' }
    ],
    confidencePct: 96,
    lastUpdated: 'Just now',
    navigationTarget: {
      architectureUrl: '/architecture?focus=api-checkout',
      knowledgeUrl: '/knowledge?entity=api-checkout',
      dependencyUrl: '/dependency-graph?select=api-checkout',
      executionUrl: '/investigate?symbol=api-checkout',
      simulationUrl: '/simulate?target=api-checkout'
    }
  },
  {
    id: 'res-cache-redis',
    title: 'Redis Distributed L2 Cache Cluster',
    type: 'Cache',
    repository: 'CodeAtlas/k8s/redis',
    layer: 'Data Store',
    healthScorePct: 99,
    riskRating: 'Low',
    aiSummary: 'Sub-millisecond memory store referenced by 83 services for AST trees and rate limit tokens.',
    relationships: [
      { label: 'Used By', targetName: 'Payment Microservice', targetType: 'Microservice' },
      { label: 'Used By', targetName: 'IAM Auth Service', targetType: 'Microservice' }
    ],
    confidencePct: 99,
    lastUpdated: '1 hour ago',
    navigationTarget: {
      architectureUrl: '/architecture?focus=cache-redis',
      knowledgeUrl: '/knowledge?entity=cache-redis',
      dependencyUrl: '/dependency-graph?select=cache-redis',
      executionUrl: '/investigate?symbol=cache-redis',
      simulationUrl: '/simulate?target=cache-redis'
    }
  },
  {
    id: 'res-adr-002',
    title: 'ADR-002: Introduce Redis L2 Cache for AST & Knowledge Graph',
    type: 'ADR',
    repository: 'CodeAtlas/docs/adr/002.md',
    layer: 'Domain Service',
    healthScorePct: 96,
    riskRating: 'Low',
    aiSummary: 'Approved architectural decision record explaining why Redis was deployed to reduce Neo4j CPU load by 74%.',
    relationships: [
      { label: 'Documents', targetName: 'Redis L2 Cache', targetType: 'Cache' },
      { label: 'Governs', targetName: 'Knowledge Graph Engine', targetType: 'Module' }
    ],
    confidencePct: 95,
    lastUpdated: '3 days ago',
    navigationTarget: {
      architectureUrl: '/architect?adr=ADR-002',
      knowledgeUrl: '/knowledge?doc=ADR-002',
      dependencyUrl: '/dependency-graph?select=ADR-002',
      executionUrl: '/investigate?symbol=ADR-002',
      simulationUrl: '/simulate?target=ADR-002'
    }
  }
];

export const MOCK_SEARCH_INSIGHTS: SearchInsightObservation[] = [
  {
    id: 'ins-1',
    title: 'Checkout Architectural Entry Point',
    observation: 'POST /api/v1/billing/checkout is the central entry point appearing in 87 architectural execution paths.',
    evidence: 'Trace req-98f2a4bc demonstrates end-to-end traversal from Kong Gateway to Redis, Stripe API, and Kafka.',
    confidencePct: 98,
    suggestedAction: 'Launch performance simulation on PaymentService',
    targetUrl: '/simulate?target=svc-payment-core'
  },
  {
    id: 'ins-2',
    title: 'High Fan-Out Bottleneck in Payment Microservice',
    observation: 'PaymentService depends directly on 18 external modules and 4 data stores.',
    evidence: 'Coupling score degraded to 64% in latest production deployment snapshot.',
    confidencePct: 94,
    suggestedAction: 'Review ADR-004 Remediation Spec',
    targetUrl: '/architect?adr=ADR-004'
  }
];

export const TRENDING_SEARCHES = [
  'Explain checkout architecture',
  'Which services access customer data?',
  'Which APIs call Redis?',
  'Find circular dependencies',
  'Where is technical debt highest?',
  'Why was Redis introduced?'
];
