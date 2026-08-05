export type DriftChangeStatus = 'Added' | 'Removed' | 'Drifted' | 'Unchanged';

export interface ArchitectureBaselineSnapshot {
  id: string;
  name: string;
  releaseTag: string;
  timestamp: string;
  author: string;
  description: string;
  healthScore: number;
  couplingScore: number;
  totalServices: number;
  totalDependencies: number;
  violationsCount: number;
}

export interface DriftNodeData {
  id: string;
  name: string;
  type: 'Microservice' | 'Database' | 'Cache' | 'API Gateway' | 'Queue' | 'Module';
  layer: 'Frontend' | 'API Gateway' | 'Domain Service' | 'Data Store' | 'Infrastructure';
  changeStatus: DriftChangeStatus;
  healthBefore: number;
  healthAfter: number;
  driftDescription: string;
  violatingLayer?: string;
  ownerTeam: string;
  repository: string;
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface DriftEdgeData {
  id: string;
  source: string;
  target: string;
  changeStatus: DriftChangeStatus;
  type: 'Calls' | 'Reads' | 'Writes' | 'Bypasses Layer';
  protocol?: string;
  isViolation?: boolean;
}

export interface ArchitectureScorecardMetric {
  dimension: 'Architecture Stability' | 'Maintainability' | 'Scalability' | 'Coupling' | 'Cohesion' | 'Modularity' | 'Resilience' | 'Security';
  currentScore: number;
  previousScore: number;
  trend: 'Improved' | 'Degraded' | 'Stable';
  status: 'Good' | 'Warning' | 'Critical';
  analysis: string;
}

export interface ArchitectureRecommendation {
  id: string;
  title: string;
  priority: 'P0 - Critical' | 'P1 - High' | 'P2 - Medium';
  affectedNodes: string[];
  impactDescription: string;
  suggestedAction: string;
  effortHours: number;
  riskReductionPct: number;
}

export const MOCK_SNAPSHOT_BASELINES: ArchitectureBaselineSnapshot[] = [
  {
    id: 'snap-v1.0',
    name: 'Release v1.0 (Initial Architecture Baseline)',
    releaseTag: 'v1.0.0',
    timestamp: '12 months ago',
    author: 'Chief Architect',
    description: 'Clean microservice architecture baseline with strict domain layer boundaries.',
    healthScore: 94,
    couplingScore: 92,
    totalServices: 6,
    totalDependencies: 8,
    violationsCount: 0
  },
  {
    id: 'snap-v2.0',
    name: 'Release v2.0 (Scaled Platform)',
    releaseTag: 'v2.0.0',
    timestamp: '3 months ago',
    author: 'Platform Lead',
    description: 'Introduced Redis L2 cache and Strimzi Kafka event stream.',
    healthScore: 88,
    couplingScore: 84,
    totalServices: 8,
    totalDependencies: 14,
    violationsCount: 1
  },
  {
    id: 'snap-current',
    name: 'Current Production (Live Drifted Architecture)',
    releaseTag: 'v2.5.0-drifted',
    timestamp: 'Live Production',
    author: 'DevOps Automated Indexer',
    description: 'Actual live deployment with 3 architecture layer bypasses and database coupling drift.',
    healthScore: 78,
    couplingScore: 64, // Degraded coupling!
    totalServices: 9,
    totalDependencies: 19,
    violationsCount: 3
  }
];

export const MOCK_DRIFT_NODES: DriftNodeData[] = [
  {
    id: 'svc-payment-core',
    name: 'Payment & Billing Microservice',
    type: 'Microservice',
    layer: 'Domain Service',
    changeStatus: 'Drifted',
    healthBefore: 94,
    healthAfter: 72,
    driftDescription: 'DRIFT DETECTED: Service bypassed API Gateway and created direct PostgreSQL database table coupling.',
    violatingLayer: 'Direct Data Store Bypass',
    ownerTeam: 'Financial Engineering Guild',
    repository: 'CodeAtlas/apps/backend/services/payment',
    riskRating: 'High'
  },
  {
    id: 'worker-payment-notifier',
    name: 'Payment Async Notification Worker',
    type: 'Microservice',
    layer: 'Domain Service',
    changeStatus: 'Added',
    healthBefore: 0,
    healthAfter: 95,
    driftDescription: 'NEW COMPONENT: Added in v2.4 to handle asynchronous billing receipts via Kafka.',
    ownerTeam: 'Customer Engagement Team',
    repository: 'CodeAtlas/apps/backend/workers/notifier',
    riskRating: 'Low'
  },
  {
    id: 'monolith-legacy-auth',
    name: 'Legacy Monolithic Auth Module',
    type: 'Module',
    layer: 'Domain Service',
    changeStatus: 'Removed',
    healthBefore: 60,
    healthAfter: 0,
    driftDescription: 'REMOVED COMPONENT: Fully decommissioned in favor of FastAPI IAM Service.',
    ownerTeam: 'Security Core Team',
    repository: 'CodeAtlas/legacy/auth',
    riskRating: 'Low'
  },
  {
    id: 'app-web-portal',
    name: 'CodeAtlas Web Portal App',
    type: 'Microservice',
    layer: 'Frontend',
    changeStatus: 'Unchanged',
    healthBefore: 95,
    healthAfter: 94,
    driftDescription: 'Architecture boundaries fully maintained.',
    ownerTeam: 'Frontend Platform',
    repository: 'CodeAtlas/apps/web',
    riskRating: 'Low'
  },
  {
    id: 'db-neo4j-graph',
    name: 'Neo4j Graph Database',
    type: 'Database',
    layer: 'Data Store',
    changeStatus: 'Unchanged',
    healthBefore: 98,
    healthAfter: 96,
    driftDescription: 'Database schema maintained cleanly.',
    ownerTeam: 'Database REL',
    repository: 'CodeAtlas/k8s/neo4j',
    riskRating: 'Low'
  }
];

export const MOCK_DRIFT_EDGES: DriftEdgeData[] = [
  { id: 'edge-1', source: 'app-web-portal', target: 'svc-payment-core', changeStatus: 'Unchanged', type: 'Calls', protocol: 'HTTP/2 REST' },
  { id: 'edge-2', source: 'svc-payment-core', target: 'worker-payment-notifier', changeStatus: 'Added', type: 'Calls', protocol: 'Kafka Topic' },
  { id: 'edge-3', source: 'svc-payment-core', target: 'db-neo4j-graph', changeStatus: 'Drifted', type: 'Bypasses Layer', protocol: 'Direct Cypher SQL', isViolation: true }
];

export const MOCK_SCORECARD_METRICS: ArchitectureScorecardMetric[] = [
  {
    dimension: 'Architecture Stability',
    currentScore: 88,
    previousScore: 94,
    trend: 'Degraded',
    status: 'Warning',
    analysis: 'Stability decreased by 6% due to 3 unapproved layer bypasses in Payment & Billing service.'
  },
  {
    dimension: 'Coupling',
    currentScore: 64,
    previousScore: 92,
    trend: 'Degraded',
    status: 'Critical',
    analysis: 'Coupling score dropped severely (64%) due to direct database reads bypassing the Data Repository layer.'
  },
  {
    dimension: 'Security',
    currentScore: 94,
    previousScore: 95,
    trend: 'Stable',
    status: 'Good',
    analysis: 'RS256 JWT token validation and SAML SSO enforcement remain robust.'
  },
  {
    dimension: 'Maintainability',
    currentScore: 82,
    previousScore: 88,
    trend: 'Degraded',
    status: 'Warning',
    analysis: 'Modularity maintains 82% efficiency despite service growth.'
  }
];

export const MOCK_DRIFT_RECOMMENDATIONS: ArchitectureRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Remediate Layer Bypass in PaymentService ➔ Neo4j DB',
    priority: 'P0 - Critical',
    affectedNodes: ['svc-payment-core', 'db-neo4j-graph'],
    impactDescription: 'Direct Cypher queries from PaymentService violate domain isolation and bypass repository caching.',
    suggestedAction: 'Route graph queries through standard GraphQueryRepository service API wrapper.',
    effortHours: 16,
    riskReductionPct: 28
  },
  {
    id: 'rec-2',
    title: 'Extract Monolithic Payment Webhooks into Async Worker',
    priority: 'P1 - High',
    affectedNodes: ['svc-payment-core', 'worker-payment-notifier'],
    impactDescription: 'Synchronous Stripe webhooks increase API response latency.',
    suggestedAction: 'Migrate webhook ingestion to Kafka payment.events.v1 queue.',
    effortHours: 24,
    riskReductionPct: 22
  }
];
