export type KnowledgeNodeType =
  | 'Repository'
  | 'Application'
  | 'Domain'
  | 'Microservice'
  | 'Package'
  | 'Module'
  | 'Folder'
  | 'File'
  | 'Class'
  | 'Interface'
  | 'Enum'
  | 'Function'
  | 'Method'
  | 'REST API'
  | 'GraphQL API'
  | 'Database'
  | 'Table'
  | 'Column'
  | 'Queue'
  | 'Topic'
  | 'Cache'
  | 'Configuration'
  | 'Secret Reference'
  | 'Infrastructure'
  | 'Docker'
  | 'Kubernetes'
  | 'Terraform'
  | 'Documentation'
  | 'Architecture Decision'
  | 'Issue'
  | 'Pull Request'
  | 'Commit'
  | 'Developer'
  | 'AI Insight'
  | 'Simulation'
  | 'Investigation'
  | 'Monitoring Alert'
  | 'Repository Snapshot';

export type KnowledgeRelationshipType =
  | 'Imports'
  | 'Calls'
  | 'Uses'
  | 'Depends On'
  | 'Consumes'
  | 'Produces'
  | 'Reads'
  | 'Writes'
  | 'Publishes'
  | 'Subscribes'
  | 'Deploys To'
  | 'Owns'
  | 'Documents'
  | 'Tests'
  | 'Monitors'
  | 'Triggers'
  | 'Implements'
  | 'Extends'
  | 'References'
  | 'Creates'
  | 'Deletes'
  | 'Migrates'
  | 'Simulates'
  | 'Investigates';

export interface KnowledgeNodeData {
  id: string;
  name: string;
  type: KnowledgeNodeType;
  category: 'Code & Architecture' | 'APIs & Data' | 'Infrastructure & Ops' | 'People & Governance' | 'AI & Analytics';
  technology: string;
  healthScore: number;
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
  owner: string;
  repository: string;
  status: 'Active' | 'Warning' | 'Critical' | 'Deprecated';
  description: string;
  purpose?: string;
  responsibilities?: string[];
  metrics?: {
    pageRankScore: number;
    couplingDensity: number;
    latencyP95Ms: number;
    throughputRps: number;
    techDebtHours: number;
  };
  recentChanges?: {
    date: string;
    author: string;
    summary: string;
  }[];
  aiSummary?: string;
}

export interface KnowledgeRelationship {
  id: string;
  source: string;
  target: string;
  type: KnowledgeRelationshipType;
  protocol?: string;
  latencyMs?: number;
  description?: string;
  isCriticalPath?: boolean;
}

export interface AIQueryExample {
  query: string;
  answer: string;
  highlightNodes: string[];
  confidencePct: number;
  impactAnalysis: string;
  nextAction: string;
}

export interface GraphAnalyticsIssue {
  id: string;
  type: 'Single Point of Failure' | 'Knowledge Island' | 'Circular Dependency' | 'Overloaded Service' | 'Dead Code';
  title: string;
  severity: 'Critical' | 'High' | 'Medium';
  affectedNodes: string[];
  description: string;
  recommendation: string;
}

export const INITIAL_KNOWLEDGE_NODES: KnowledgeNodeData[] = [
  // Repositories & Applications
  {
    id: 'repo-codeatlas',
    name: 'CodeAtlas Core Engine Repo',
    type: 'Repository',
    category: 'Code & Architecture',
    technology: 'Next.js / Python FastAPI / Rust',
    healthScore: 95,
    riskScore: 'Low',
    owner: 'Principal Architect Guild',
    repository: 'CodeAtlas/CodeAtlas',
    status: 'Active',
    description: 'Central monorepo containing AI software intelligence services, Web UI, and graph engine.',
    purpose: 'Store authoritative source code and dependency metadata across enterprise apps.',
    responsibilities: ['Provide multi-package build scripts', 'Enforce SOC2 security policies'],
    metrics: { pageRankScore: 0.98, couplingDensity: 0.2, latencyP95Ms: 15, throughputRps: 5000, techDebtHours: 12 }
  },
  {
    id: 'app-web-portal',
    name: 'CodeAtlas Web Platform App',
    type: 'Application',
    category: 'Code & Architecture',
    technology: 'Next.js 16 / React 19',
    healthScore: 93,
    riskScore: 'Low',
    owner: 'Frontend Platform Core',
    repository: 'CodeAtlas/apps/web',
    status: 'Active',
    description: 'React single page & server rendering app for architecture maps, copilot, and knowledge graphs.',
    metrics: { pageRankScore: 0.91, couplingDensity: 0.4, latencyP95Ms: 42, throughputRps: 1800, techDebtHours: 18 }
  },

  // Microservices & APIs
  {
    id: 'svc-payment',
    name: 'Payment & Billing Microservice',
    type: 'Microservice',
    category: 'Code & Architecture',
    technology: 'Node.js / TypeScript / Stripe',
    healthScore: 89,
    riskScore: 'Medium',
    owner: 'Financial Engineering Team',
    repository: 'CodeAtlas/apps/backend/services/payment',
    status: 'Active',
    description: 'Core subscription billing, invoice generation, credit calculation, and payment gateway integrator.',
    purpose: 'Process enterprise transactions and store immutable billing ledger records.',
    responsibilities: ['Stripe payment webhook verification', 'Usage-based billing tallying', 'Invoice PDF generation'],
    metrics: { pageRankScore: 0.85, couplingDensity: 0.65, latencyP95Ms: 140, throughputRps: 650, techDebtHours: 40 }
  },
  {
    id: 'svc-auth-identity',
    name: 'Authentication & IAM Service',
    type: 'Microservice',
    category: 'Code & Architecture',
    technology: 'FastAPI / Python 3.12',
    healthScore: 98,
    riskScore: 'Low',
    owner: 'Security Core Team',
    repository: 'CodeAtlas/apps/backend/app/auth',
    status: 'Active',
    description: 'OAuth2, SAML 2.0, RS256 JWT token issuer, and role-based access control manager.',
    purpose: 'Govern user identity verification and token authorization perimeters.',
    metrics: { pageRankScore: 0.95, couplingDensity: 0.3, latencyP95Ms: 8, throughputRps: 4200, techDebtHours: 4 }
  },
  {
    id: 'api-billing-checkout',
    name: 'POST /api/v1/billing/checkout',
    type: 'REST API',
    category: 'APIs & Data',
    technology: 'FastAPI REST Endpoint',
    healthScore: 92,
    riskScore: 'Low',
    owner: 'Financial Engineering Team',
    repository: 'CodeAtlas/apps/backend/app/api/billing.py',
    status: 'Active',
    description: 'Public endpoint initiating user subscription upgrade checkout sessions.'
  },

  // Databases, Caches & Queues
  {
    id: 'cache-redis-billing',
    name: 'Redis Billing Session Cache',
    type: 'Cache',
    category: 'APIs & Data',
    technology: 'Redis 7 Cluster',
    healthScore: 99,
    riskScore: 'Low',
    owner: 'Infra SecOps Team',
    repository: 'CodeAtlas/k8s/redis',
    status: 'Active',
    description: 'In-memory store caching active checkout sessions, rate limits, and idempotent Stripe tokens.',
    purpose: 'Prevent duplicate payment charges and provide sub-millisecond session validation.',
    metrics: { pageRankScore: 0.72, couplingDensity: 0.5, latencyP95Ms: 1.2, throughputRps: 8500, techDebtHours: 0 }
  },
  {
    id: 'db-postgres-customer',
    name: 'PostgreSQL Customer Database',
    type: 'Database',
    category: 'APIs & Data',
    technology: 'PostgreSQL 16 / SQLAlchemy',
    healthScore: 94,
    riskScore: 'Low',
    owner: 'Database Reliability Engineering',
    repository: 'CodeAtlas/k8s/postgres',
    status: 'Active',
    description: 'Primary relational database storing customer accounts, billing profiles, and payment histories.'
  },
  {
    id: 'tbl-customer-billing',
    name: 'customer_subscriptions Table',
    type: 'Table',
    category: 'APIs & Data',
    technology: 'PostgreSQL Schema Table',
    healthScore: 90,
    riskScore: 'Low',
    owner: 'Financial Engineering Team',
    repository: 'CodeAtlas/apps/backend/db/schema.sql',
    status: 'Active',
    description: 'Database table storing subscription plans, renewal dates, and payment states.'
  },
  {
    id: 'topic-payment-events',
    name: 'Kafka Topic: payment.events.v1',
    type: 'Topic',
    category: 'APIs & Data',
    technology: 'Apache Kafka Topic',
    healthScore: 96,
    riskScore: 'Low',
    owner: 'Data Platform Guild',
    repository: 'CodeAtlas/k8s/kafka',
    status: 'Active',
    description: 'Asynchronous event stream broadcasting successful charges, refunds, and subscription cancellations.'
  },

  // Infrastructure & Code Classes
  {
    id: 'k8s-payment-cluster',
    name: 'Kubernetes Payment Deployment',
    type: 'Kubernetes',
    category: 'Infrastructure & Ops',
    technology: 'Kubernetes Pod / Helm',
    healthScore: 97,
    riskScore: 'Low',
    owner: 'Infra SecOps Team',
    repository: 'CodeAtlas/k8s/payment-deployment.yaml',
    status: 'Active',
    description: 'Autoscaling Kubernetes deployment running 8 replicas of Payment Microservice.'
  },
  {
    id: 'class-payment-processor',
    name: 'StripePaymentProcessor Class',
    type: 'Class',
    category: 'Code & Architecture',
    technology: 'TypeScript Class',
    healthScore: 82,
    riskScore: 'High',
    owner: 'Developer: Sarah Chen (Single Maintainer)',
    repository: 'CodeAtlas/apps/backend/services/payment/processor.ts',
    status: 'Warning',
    description: 'Complex 1400 LOC class wrapping Stripe API callbacks and database writes.',
    aiSummary: 'Knowledge Island Detected: 92% of commits authored exclusively by Sarah Chen.'
  },

  // People, Governance & ADRs
  {
    id: 'dev-sarah-chen',
    name: 'Sarah Chen (Staff Engineer)',
    type: 'Developer',
    category: 'People & Governance',
    technology: 'Staff Billing Lead',
    healthScore: 100,
    riskScore: 'Low',
    owner: 'Financial Engineering Team',
    repository: 'GitHub @sarahchen',
    status: 'Active',
    description: 'Lead author and owner of PaymentService and Billing Database schemas.'
  },
  {
    id: 'adr-payment-redis',
    name: 'ADR 042: Idempotent Payment Caching with Redis',
    type: 'Architecture Decision',
    category: 'People & Governance',
    technology: 'Markdown Architecture Decision Record',
    healthScore: 100,
    riskScore: 'Low',
    owner: 'Principal Architect Guild',
    repository: 'CodeAtlas/docs/adr/042-payment-redis.md',
    status: 'Active',
    description: 'Decision record detailing why PaymentService uses Redis for atomic lock distribution.'
  },

  // AI & Analytics
  {
    id: 'ai-spof-payment',
    name: 'Single Point of Failure: StripePaymentProcessor',
    type: 'AI Insight',
    category: 'AI & Analytics',
    technology: 'AI Knowledge Graph Detector',
    healthScore: 70,
    riskScore: 'Critical',
    owner: 'AI Graph Systems Engine',
    repository: 'CodeAtlas Knowledge Engine',
    status: 'Critical',
    description: 'AI detected that StripePaymentProcessor is a single point of failure maintained by 1 developer.'
  }
];

export const INITIAL_KNOWLEDGE_RELATIONSHIPS: KnowledgeRelationship[] = [
  {
    id: 'krel-1',
    source: 'app-web-portal',
    target: 'svc-auth-identity',
    type: 'Calls',
    protocol: 'gRPC mTLS',
    description: 'Web portal verifies user session with Auth Service.'
  },
  {
    id: 'krel-2',
    source: 'app-web-portal',
    target: 'api-billing-checkout',
    type: 'Uses',
    protocol: 'HTTP/2 REST',
    description: 'Web UI calls checkout endpoint on user upgrade.'
  },
  {
    id: 'krel-3',
    source: 'api-billing-checkout',
    target: 'svc-payment',
    type: 'Calls',
    protocol: 'gRPC Internal',
    description: 'API endpoint delegates payment processing to Payment Microservice.'
  },
  {
    id: 'krel-4',
    source: 'svc-payment',
    target: 'cache-redis-billing',
    type: 'Depends On',
    protocol: 'Redis RESP',
    description: 'PaymentService uses Redis for idempotent transaction locks and session caching.'
  },
  {
    id: 'krel-5',
    source: 'svc-payment',
    target: 'db-postgres-customer',
    type: 'Writes',
    protocol: 'PostgreSQL SQL',
    description: 'PaymentService writes subscription records to Customer DB.'
  },
  {
    id: 'krel-6',
    source: 'svc-payment',
    target: 'tbl-customer-billing',
    type: 'Writes',
    protocol: 'SQL Table Query',
    description: 'PaymentService inserts new rows into customer_subscriptions table.'
  },
  {
    id: 'krel-7',
    source: 'svc-payment',
    target: 'topic-payment-events',
    type: 'Publishes',
    protocol: 'Kafka Event',
    description: 'PaymentService publishes charge events to Kafka stream.'
  },
  {
    id: 'krel-8',
    source: 'svc-payment',
    target: 'k8s-payment-cluster',
    type: 'Deploys To',
    protocol: 'Kubernetes Pod',
    description: 'PaymentService is deployed onto Kubernetes cluster.'
  },
  {
    id: 'krel-9',
    source: 'dev-sarah-chen',
    target: 'svc-payment',
    type: 'Owns',
    description: 'Sarah Chen is the primary owner and lead maintainer of PaymentService.'
  },
  {
    id: 'krel-10',
    source: 'adr-payment-redis',
    target: 'svc-payment',
    type: 'Documents',
    description: 'ADR 042 documents the architectural decision to depend on Redis.'
  },
  {
    id: 'krel-11',
    source: 'ai-spof-payment',
    target: 'class-payment-processor',
    type: 'Investigates',
    description: 'AI Insight flags StripePaymentProcessor class as single point of failure.'
  }
];

export const MOCK_AI_QUERIES: AIQueryExample[] = [
  {
    query: 'Why does PaymentService depend on Redis?',
    answer: 'PaymentService depends on Redis (cache-redis-billing) to enforce sub-millisecond idempotent transaction locks (preventing double charges on API retries) and to store active checkout session tokens, as documented in ADR 042.',
    highlightNodes: ['svc-payment', 'cache-redis-billing', 'adr-payment-redis'],
    confidencePct: 98,
    impactAnalysis: 'Disrupting Redis connection would increase checkout latency by 120ms and risk duplicate Stripe charge retries.',
    nextAction: 'Review ADR 042 or simulate Redis cluster node failure in Simulation Studio.'
  },
  {
    query: 'Explain every dependency of Authentication.',
    answer: 'Authentication Service (svc-auth-identity) depends on PostgreSQL Primary State DB for user credentials, Kong API Gateway for edge routing, and issues RS256 JWT tokens consumed by 6 downstream microservices.',
    highlightNodes: ['svc-auth-identity', 'db-postgres-customer', 'app-web-portal'],
    confidencePct: 96,
    impactAnalysis: 'Auth Service is on the critical security path for 100% of incoming platform API requests.',
    nextAction: 'Inspect Auth Service security audit logs.'
  },
  {
    query: 'Show all services touching customer data.',
    answer: 'Customer data in PostgreSQL (db-postgres-customer) is directly read/written by Payment Microservice, Auth Service, and Knowledge Graph Engine.',
    highlightNodes: ['db-postgres-customer', 'svc-payment', 'svc-auth-identity', 'tbl-customer-billing'],
    confidencePct: 94,
    impactAnalysis: 'Any schema migration on customer_subscriptions directly impacts PaymentService and Auth token claims.',
    nextAction: 'Generate data lineage impact report.'
  },
  {
    query: 'Who owns this module and what are the single points of failure?',
    answer: 'Sarah Chen (Staff Engineer) owns PaymentService and StripePaymentProcessor. StripePaymentProcessor has a Knowledge Island risk (92% single-author code) and is a Single Point of Failure.',
    highlightNodes: ['dev-sarah-chen', 'svc-payment', 'class-payment-processor', 'ai-spof-payment'],
    confidencePct: 92,
    impactAnalysis: 'High bus factor risk if Sarah Chen is unavailable during billing deployment outage.',
    nextAction: 'Schedule knowledge transfer pairing session & assign secondary code reviewer.'
  }
];

export const MOCK_GRAPH_ANALYTICS_ISSUES: GraphAnalyticsIssue[] = [
  {
    id: 'analytics-spof-1',
    type: 'Single Point of Failure',
    title: 'StripePaymentProcessor Class (Single Maintainer Risk)',
    severity: 'Critical',
    affectedNodes: ['class-payment-processor', 'svc-payment', 'dev-sarah-chen'],
    description: 'StripePaymentProcessor handles 100% of revenue transactions but has 92% single-author commitment density by Sarah Chen with 0 unit test coverage for refund edge cases.',
    recommendation: 'Add secondary owner to Payment Guild and extract refund logic into separate helper.'
  },
  {
    id: 'analytics-island-2',
    type: 'Knowledge Island',
    title: 'Siloed Code: IncrementalASTIndexer Module',
    severity: 'High',
    affectedNodes: ['svc-payment', 'cache-redis-billing'],
    description: 'Knowledge island detected with 0 architecture documentation explaining Redis key eviction policies.',
    recommendation: 'Link Redis key schema documentation to ADR 042.'
  },
  {
    id: 'analytics-deadcode-3',
    type: 'Dead Code',
    title: 'Unused Endpoint: GET /api/v1/legacy/billing',
    severity: 'Medium',
    affectedNodes: ['api-billing-checkout'],
    description: 'Legacy REST endpoint has received 0 HTTP requests over the past 90 days across all production environments.',
    recommendation: 'Safely deprecate and remove legacy endpoint in next release cycle.'
  }
];
