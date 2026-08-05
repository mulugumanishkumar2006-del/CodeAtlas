export type DependencyNodeType =
  | 'Repository'
  | 'Application'
  | 'Domain'
  | 'Microservice'
  | 'Module'
  | 'Package'
  | 'Folder'
  | 'File'
  | 'Class'
  | 'Interface'
  | 'Function'
  | 'REST API'
  | 'GraphQL'
  | 'gRPC'
  | 'Database'
  | 'Queue'
  | 'Event'
  | 'Cache'
  | 'Configuration'
  | 'Infrastructure'
  | 'Cloud Service'
  | 'Third-party Library'
  | 'Build Tool'
  | 'CI/CD'
  | 'Deployment'
  | 'Documentation'
  | 'Testing'
  | 'Monitoring'
  | 'Security';

export interface DependencyNodeData {
  id: string;
  name: string;
  type: DependencyNodeType;
  layer: 'Frontend' | 'API Gateway' | 'Microservice' | 'Data Store' | 'Messaging' | 'Infrastructure' | 'Library';
  technology: string;
  version?: string;
  healthScore: number;
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
  owner: string;
  repository: string;
  status: 'Active' | 'Warning' | 'Critical' | 'Deprecated';
  description: string;
  fanInCount: number; // How many depend on this
  fanOutCount: number; // How many this depends on
  loc?: number;
  complexity?: number;
  impactSummary?: string;
  affectedServicesCount?: number;
  affectedApisCount?: number;
  affectedTestsCount?: number;
}

export interface DependencyEdgeData {
  id: string;
  source: string;
  target: string;
  type: 'Calls' | 'Imports' | 'Reads' | 'Writes' | 'Publishes' | 'Subscribes' | 'Deploys To' | 'Depends On';
  protocol?: string;
  latencyMs?: number;
  isCriticalPath?: boolean;
  status?: 'Active' | 'Degraded' | 'Violating';
}

export interface ImpactAnalysisReport {
  targetNodeId: string;
  targetNodeName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  engineeringEffortHours: number;
  confidenceScorePct: number;
  affectedFiles: string[];
  affectedModules: string[];
  affectedServices: string[];
  affectedApis: string[];
  affectedDatabases: string[];
  affectedTests: string[];
  rollbackStrategy: string;
  migrationPlan: string;
}

export interface DependencyAiInsight {
  id: string;
  title: string;
  category: 'Circular Dependency' | 'High Fan-Out Bottleneck' | 'Duplicate Package' | 'Architecture Boundary Violation' | 'Unused Library';
  severity: 'Critical' | 'High' | 'Medium';
  affectedNodes: string[];
  evidence: string;
  refactoringPlan: string;
  estimatedEffortHours: number;
}

export interface SnapshotDiffItem {
  id: string;
  changeType: 'Added' | 'Removed' | 'Version Upgraded' | 'Drifted';
  nodeName: string;
  oldVersion?: string;
  newVersion?: string;
  description: string;
}

export const INITIAL_DEP_NODES: DependencyNodeData[] = [
  {
    id: 'app-web-portal',
    name: 'CodeAtlas Web Portal App',
    type: 'Application',
    layer: 'Frontend',
    technology: 'Next.js 16 / React 19',
    version: 'v2.5.0',
    healthScore: 94,
    riskScore: 'Low',
    owner: 'Frontend Platform Core',
    repository: 'CodeAtlas/apps/web',
    status: 'Active',
    description: 'Next.js single page application serving AI Copilot, architecture maps, and mission control.',
    fanInCount: 1,
    fanOutCount: 6,
    loc: 24500,
    complexity: 14,
    affectedServicesCount: 6,
    affectedApisCount: 8,
    affectedTestsCount: 45
  },
  {
    id: 'api-kong-gateway',
    name: 'Kong API Gateway Engine',
    type: 'Infrastructure',
    layer: 'API Gateway',
    technology: 'Kong / Nginx',
    version: 'v3.4.0',
    healthScore: 98,
    riskScore: 'Low',
    owner: 'Infra SecOps Team',
    repository: 'CodeAtlas/k8s/gateway',
    status: 'Active',
    description: 'High-throughput edge API gateway validating JWT tokens, rate limiting, and gRPC routing.',
    fanInCount: 4,
    fanOutCount: 5,
    affectedServicesCount: 5,
    affectedApisCount: 12,
    affectedTestsCount: 80
  },
  {
    id: 'svc-payment-core',
    name: 'Payment & Billing Microservice',
    type: 'Microservice',
    layer: 'Microservice',
    technology: 'Node.js / TypeScript',
    version: 'v1.8.2',
    healthScore: 82,
    riskScore: 'High',
    owner: 'Financial Engineering Guild',
    repository: 'CodeAtlas/apps/backend/services/payment',
    status: 'Warning',
    description: 'Core microservice for enterprise subscriptions, invoice generation, and Stripe gateway.',
    fanInCount: 12,
    fanOutCount: 18, // High Fan-Out Bottleneck!
    loc: 18500,
    complexity: 42,
    impactSummary: 'CRITICAL BOTTLENECK: Depended upon by 12 upstream modules while depending on 18 external services.',
    affectedServicesCount: 8,
    affectedApisCount: 5,
    affectedTestsCount: 120
  },
  {
    id: 'svc-auth-iam',
    name: 'Authentication & IAM Service',
    type: 'Microservice',
    layer: 'Microservice',
    technology: 'FastAPI / Python 3.12',
    version: 'v2.1.0',
    healthScore: 96,
    riskScore: 'Low',
    owner: 'Security Core Team',
    repository: 'CodeAtlas/apps/backend/app/auth',
    status: 'Active',
    description: 'Identity verification, RS256 JWT token generation, SAML SSO, and permission evaluator.',
    fanInCount: 47, // High Fan-In Component!
    fanOutCount: 3,
    loc: 8900,
    complexity: 18,
    affectedServicesCount: 14,
    affectedApisCount: 22,
    affectedTestsCount: 210
  },
  {
    id: 'cache-redis-cluster',
    name: 'Redis Distributed L2 Cache',
    type: 'Cache',
    layer: 'Data Store',
    technology: 'Redis 7 Cluster',
    version: 'v7.2.4',
    healthScore: 99,
    riskScore: 'Low',
    owner: 'Infra SecOps Team',
    repository: 'CodeAtlas/k8s/redis',
    status: 'Active',
    description: 'Sub-millisecond memory store referenced by 83 services for AST trees and rate limits.',
    fanInCount: 83, // Referenced by 83 services!
    fanOutCount: 0,
    affectedServicesCount: 18,
    affectedApisCount: 35,
    affectedTestsCount: 300
  },
  {
    id: 'db-neo4j-graph',
    name: 'Neo4j Graph Database',
    type: 'Database',
    layer: 'Data Store',
    technology: 'Neo4j Enterprise 5.18',
    version: 'v5.18.0',
    healthScore: 95,
    riskScore: 'Low',
    owner: 'Database Reliability Engineering',
    repository: 'CodeAtlas/k8s/neo4j',
    status: 'Active',
    description: 'Graph database storing 10M+ code symbol entities and 50M+ structural relationship edges.',
    fanInCount: 14,
    fanOutCount: 0,
    affectedServicesCount: 4,
    affectedApisCount: 6,
    affectedTestsCount: 95
  },
  {
    id: 'queue-kafka-topics',
    name: 'Apache Kafka Event Stream',
    type: 'Queue',
    layer: 'Messaging',
    technology: 'Kafka Strimzi',
    version: 'v3.6.0',
    healthScore: 97,
    riskScore: 'Low',
    owner: 'Data Platform Guild',
    repository: 'CodeAtlas/k8s/kafka',
    status: 'Active',
    description: 'Distributed event bus streaming code push events, AST ingestion tasks, and telemetry.',
    fanInCount: 22,
    fanOutCount: 0,
    affectedServicesCount: 9,
    affectedApisCount: 8,
    affectedTestsCount: 140
  },
  {
    id: 'lib-stripe-node',
    name: 'stripe-node Third-Party SDK',
    type: 'Third-party Library',
    layer: 'Library',
    technology: 'npm package: stripe',
    version: 'v14.10.0 (Outdated)',
    healthScore: 74,
    riskScore: 'Medium',
    owner: 'External Integration Team',
    repository: 'npm / stripe',
    status: 'Warning',
    description: 'Third-party Payment SDK with 2 minor security vulnerabilities pending upgrade to v15.0.',
    fanInCount: 4,
    fanOutCount: 0,
    affectedServicesCount: 2,
    affectedApisCount: 3,
    affectedTestsCount: 38
  }
];

export const INITIAL_DEP_EDGES: DependencyEdgeData[] = [
  { id: 'dedge-1', source: 'app-web-portal', target: 'api-kong-gateway', type: 'Calls', protocol: 'HTTP/2 TLS' },
  { id: 'dedge-2', source: 'api-kong-gateway', target: 'svc-auth-iam', type: 'Calls', protocol: 'gRPC mTLS' },
  { id: 'dedge-3', source: 'api-kong-gateway', target: 'svc-payment-core', type: 'Calls', protocol: 'HTTP/2 REST' },
  { id: 'dedge-4', source: 'svc-payment-core', target: 'cache-redis-cluster', type: 'Depends On', protocol: 'Redis RESP', status: 'Active' },
  { id: 'dedge-5', source: 'svc-payment-core', target: 'lib-stripe-node', type: 'Imports', protocol: 'npm CommonJS', status: 'Degraded' },
  { id: 'dedge-6', source: 'svc-payment-core', target: 'queue-kafka-topics', type: 'Publishes', protocol: 'Kafka Topic: payment.v1' },
  { id: 'dedge-7', source: 'svc-payment-core', target: 'db-neo4j-graph', type: 'Reads', protocol: 'Bolt Cypher' },
  { id: 'dedge-8', source: 'svc-auth-iam', target: 'cache-redis-cluster', type: 'Depends On', protocol: 'Redis RESP' }
];

export const MOCK_IMPACT_REPORT: ImpactAnalysisReport = {
  targetNodeId: 'svc-payment-core',
  targetNodeName: 'Payment & Billing Microservice (svc-payment-core)',
  riskLevel: 'High',
  engineeringEffortHours: 36,
  confidenceScorePct: 96,
  affectedFiles: [
    'apps/backend/services/payment/processor.ts',
    'apps/backend/services/payment/stripe_adapter.ts',
    'apps/backend/app/api/v1/billing.py',
    'apps/web/src/components/billing/checkout-modal.tsx'
  ],
  affectedModules: ['PaymentCore', 'StripeAdapter', 'BillingAPI', 'CheckoutUI'],
  affectedServices: ['PaymentService', 'AuthService', 'NotificationWorker'],
  affectedApis: ['POST /api/v1/billing/checkout', 'GET /api/v1/billing/subscriptions'],
  affectedDatabases: ['PostgreSQL customer_subscriptions', 'Redis billing_session_locks'],
  affectedTests: [
    'test_payment_checkout_flow.py',
    'test_stripe_webhook_verification.py',
    'e2e_checkout_spec.cy.ts'
  ],
  rollbackStrategy: 'Revert deployment via Istio traffic splitting (90/10 canary rollback to v1.8.1 in 30 seconds).',
  migrationPlan: 'Phase 1: Deploy Redis fallback locks; Phase 2: Upgrade stripe-node to v15.0; Phase 3: Verify webhook idempotency.'
};

export const MOCK_DEP_AI_INSIGHTS: DependencyAiInsight[] = [
  {
    id: 'dinsight-1',
    title: 'High Fan-Out Bottleneck in Payment & Billing Microservice',
    category: 'High Fan-Out Bottleneck',
    severity: 'Critical',
    affectedNodes: ['svc-payment-core'],
    evidence: 'PaymentService depends directly on 18 external modules and 4 data stores, resulting in high change fragility.',
    refactoringPlan: 'Extract Stripe webhook processor into dedicated isolated worker pool.',
    estimatedEffortHours: 32
  },
  {
    id: 'dinsight-2',
    title: 'Outdated Third-Party Library: stripe-node v14.10',
    category: 'Duplicate Package',
    severity: 'Medium',
    affectedNodes: ['lib-stripe-node'],
    evidence: 'stripe-node is 2 major releases behind latest security patch.',
    refactoringPlan: 'Run pnpm update stripe@latest and update TypeScript type signatures.',
    estimatedEffortHours: 8
  }
];

export const MOCK_SNAPSHOT_DIFFS: SnapshotDiffItem[] = [
  {
    id: 'sdiff-1',
    changeType: 'Added',
    nodeName: 'queue-kafka-topics (Kafka Strimzi)',
    description: 'Added asynchronous Kafka topic stream for payment notifications.'
  },
  {
    id: 'sdiff-2',
    changeType: 'Version Upgraded',
    nodeName: 'Next.js Framework',
    oldVersion: 'v15.2.0',
    newVersion: 'v16.2.9',
    description: 'Upgraded Web UI framework to Next.js 16 App Router.'
  }
];
