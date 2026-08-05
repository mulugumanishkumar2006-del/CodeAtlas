export type AdrStatus = 'Approved' | 'Proposed' | 'Deprecated' | 'Replaced' | 'Violated';

export type AdrCategory = 'Data Store' | 'Microservices' | 'Authentication' | 'Messaging' | 'Infrastructure' | 'Frontend';

export interface AdrRecord {
  id: string;
  decisionId: string; // e.g. "ADR-001"
  title: string;
  category: AdrCategory;
  status: AdrStatus;
  author: string;
  date: string;
  repository: string;
  aiConfidenceScorePct: number;
  context: string;
  problemStatement: string;
  decision: string;
  alternativesConsidered: string[];
  pros: string[];
  cons: string[];
  tradeoffs: string;
  affectedServices: string[];
  affectedDatabases: string[];
  estimatedCost: string;
  engineeringEffortHours: number;
  performanceImpact: string;
  securityImpact: string;
  scalabilityImpact: string;
  rollbackStrategy: string;
  migrationStrategy: string;
  committeeVotes: { approve: number; reject: number; abstain: number };
  relatedPrs: string[];
  relatedCommits: string[];
}

export interface AiCtoQueryAnswer {
  query: string;
  executiveSummary: string;
  evidence: string;
  tradeoffs: string;
  risks: string;
  costEstimate: string;
  effortHours: number;
  confidencePct: number;
  recommendedAdrId?: string;
}

export const MOCK_ADR_RECORDS: AdrRecord[] = [
  {
    id: 'adr-001',
    decisionId: 'ADR-001',
    title: 'Adopt FastAPI & RS256 JWT for IAM Authentication',
    category: 'Authentication',
    status: 'Approved',
    author: 'Security Core Team',
    date: '2025-11-14',
    repository: 'CodeAtlas/apps/backend/app/auth',
    aiConfidenceScorePct: 98,
    context: 'The enterprise codebase needed a high-performance, stateless identity verification mechanism capable of validating 50,000+ API requests per second.',
    problemStatement: 'Monolithic session cookies created cross-domain CORS issues and caused database session locks under high concurrent load.',
    decision: 'Migrate identity verification to a dedicated FastAPI microservice issuing RS256 asymmetric signed JWT access tokens.',
    alternativesConsidered: ['Stateful Redis Session Store', 'OAuth2 Keycloak Sidecar', 'Node.js Express Auth'],
    pros: ['Stateless token verification at edge gateways without DB lookups', 'Sub-5ms authentication latency', 'Native OpenAPI documentation auto-generation'],
    cons: ['Cannot immediately revoke individual access tokens before expiration', 'Requires periodic public key rotation infrastructure'],
    tradeoffs: 'Traded instant token revocation for extreme sub-millisecond edge validation throughput.',
    affectedServices: ['AuthService', 'KongGateway', 'WebPortalApp'],
    affectedDatabases: ['PostgreSQL users_db', 'Redis session_cache'],
    estimatedCost: '$120/mo infra costs',
    engineeringEffortHours: 40,
    performanceImpact: 'Reduced API gateway auth latency from 45ms to 3ms (93% speedup).',
    securityImpact: 'Asymmetric RS256 signing ensures private key never leaves Auth microservice.',
    scalabilityImpact: 'Scales linearly to 500,000 requests/sec with zero DB bottleneck.',
    rollbackStrategy: 'Revert Kong gateway route to point to legacy monolithic auth endpoint via Istio canary.',
    migrationStrategy: 'Phase 1: Issue dual tokens; Phase 2: Migrate web clients; Phase 3: Decommission monolithic cookies.',
    committeeVotes: { approve: 8, reject: 0, abstain: 1 },
    relatedPrs: ['PR #142', 'PR #189'],
    relatedCommits: ['c8f92a1', 'd4e5f67']
  },
  {
    id: 'adr-002',
    decisionId: 'ADR-002',
    title: 'Introduce Redis L2 Cache for AST & Knowledge Graph Queries',
    category: 'Data Store',
    status: 'Approved',
    author: 'Database REL Team',
    date: '2026-01-20',
    repository: 'CodeAtlas/k8s/redis',
    aiConfidenceScorePct: 96,
    context: 'Parsing 10M+ code symbol entities and rendering knowledge graphs resulted in repeated expensive Neo4j Cypher queries.',
    problemStatement: 'Neo4j CPU utilization spiked to 92% during peak universal search indexing.',
    decision: 'Deploy a Redis 7 Cluster to serve as an in-memory L2 cache for parsed AST trees and symbol relationship queries with 1-hour TTL.',
    alternativesConsidered: ['Memcached Cluster', 'In-Memory Application LRU Cache', 'PostgreSQL JSONB Cache'],
    pros: ['Sub-millisecond graph query retrieval', 'Reduces Neo4j database CPU load by 74%', 'Supports pub/sub cache invalidation'],
    cons: ['Requires 16GB additional RAM footprint', 'Risk of stale cache if invalidation events fail'],
    tradeoffs: 'Traded RAM memory cost for 10x faster knowledge graph rendering.',
    affectedServices: ['KnowledgeGraphService', 'UniversalSearchEngine'],
    affectedDatabases: ['Redis Cluster', 'Neo4j Graph Database'],
    estimatedCost: '$240/mo Redis cluster',
    engineeringEffortHours: 24,
    performanceImpact: 'P95 graph search latency dropped from 380ms to 12ms.',
    securityImpact: 'Redis TLS encryption in transit & Redis RESP3 authentication enabled.',
    scalabilityImpact: 'Allows 10,000+ concurrent graph visualizer sessions.',
    rollbackStrategy: 'Toggle REDIS_CACHE_ENABLED=false feature flag to bypass cache directly to Neo4j.',
    migrationStrategy: 'Deploy Redis cluster ➔ Warm cache with top 1,000 repositories ➔ Enable read-through cache.',
    committeeVotes: { approve: 7, reject: 1, abstain: 0 },
    relatedPrs: ['PR #210'],
    relatedCommits: ['a1b2c3d']
  },
  {
    id: 'adr-003',
    decisionId: 'ADR-003',
    title: 'Migrate Billing Ingestion to Asynchronous Kafka Event Stream',
    category: 'Messaging',
    status: 'Approved',
    author: 'Financial Engineering Guild',
    date: '2026-03-05',
    repository: 'CodeAtlas/k8s/kafka',
    aiConfidenceScorePct: 94,
    context: 'Synchronous Stripe webhooks and invoice processing caused API gateway timeouts during surge checkout periods.',
    problemStatement: 'Blocking HTTP calls to third-party Stripe API resulted in 504 gateway timeouts.',
    decision: 'Decouple billing ingestion using Apache Kafka payment.events.v1 event topic stream with idempotent consumer workers.',
    alternativesConsidered: ['RabbitMQ Exchange', 'AWS SQS Queue', 'Celery Redis Broker'],
    pros: ['Zero HTTP gateway timeouts during billing surges', 'Replayable event log for audit compliance', 'Guaranteed at-least-once event processing'],
    cons: ['Increased architectural complexity', 'Eventual consistency delay (~200ms) for checkout status UI'],
    tradeoffs: 'Traded instant synchronous confirmation for zero-downtime reliability under heavy load.',
    affectedServices: ['PaymentService', 'NotificationWorker', 'BillingAnalyticsEngine'],
    affectedDatabases: ['Kafka Strimzi', 'PostgreSQL customer_subscriptions'],
    estimatedCost: '$180/mo Strimzi cluster',
    engineeringEffortHours: 36,
    performanceImpact: 'Eliminated all gateway 504 timeouts; payment API response time dropped to 25ms.',
    securityImpact: 'Kafka mTLS client certificate authentication and SASL/SCRAM encryption.',
    scalabilityImpact: 'Scales to 100,000 payment events per second.',
    rollbackStrategy: 'Switch Stripe webhook handler back to synchronous processing via feature toggle.',
    migrationStrategy: 'Deploy Kafka topic ➔ Deploy shadow consumer ➔ Route 10% canary traffic ➔ Cutover 100%.',
    committeeVotes: { approve: 9, reject: 0, abstain: 0 },
    relatedPrs: ['PR #340'],
    relatedCommits: ['e5f6g7h']
  },
  {
    id: 'adr-004',
    decisionId: 'ADR-004',
    title: 'Direct Cypher Query Bypass Remediation (Layer Violation)',
    category: 'Microservices',
    status: 'Violated',
    author: 'DevOps Automated Indexer',
    date: '2026-04-12',
    repository: 'CodeAtlas/apps/backend/services/payment',
    aiConfidenceScorePct: 89,
    context: 'AI Drift Detection flagged that Payment & Billing microservice created direct unapproved Cypher database queries to Neo4j.',
    problemStatement: 'Direct database coupling violates domain isolation principles established in ADR-001 & ADR-002.',
    decision: 'REMEDIATION REQUIRED: Refactor PaymentService to route graph queries through standard GraphQueryRepository service wrapper.',
    alternativesConsidered: ['Update ADR to allow direct queries (Rejected)', 'Create database view (Rejected)'],
    pros: ['Restores strict domain layer isolation', 'Prevents un-cached Cypher queries from bypassing Redis L2 cache'],
    cons: ['Requires 16 hours of engineering refactoring effort'],
    tradeoffs: 'Remediating violation protects platform scalability and maintainability score.',
    affectedServices: ['PaymentService', 'KnowledgeGraphService'],
    affectedDatabases: ['Neo4j Graph Database'],
    estimatedCost: '0 additional infra cost',
    engineeringEffortHours: 16,
    performanceImpact: 'Prevents 350ms un-cached Cypher spikes on graph database.',
    securityImpact: 'Enforces repository parameter sanitization.',
    scalabilityImpact: 'Restores architecture coupling score from 64% back to 92%.',
    rollbackStrategy: 'N/A - Remediation PR pending code review.',
    migrationStrategy: 'Create PR with GraphQueryRepository wrapper ➔ Run unit tests ➔ Merge and deploy.',
    committeeVotes: { approve: 6, reject: 2, abstain: 1 },
    relatedPrs: ['PR #412 (Pending)'],
    relatedCommits: ['f7g8h9i']
  }
];

export const MOCK_AI_CTO_QUERIES: AiCtoQueryAnswer[] = [
  {
    query: 'Why was Redis introduced?',
    executiveSummary: 'Redis was introduced in ADR-002 to serve as an in-memory L2 cache for parsed AST trees and Knowledge Graph relationship queries.',
    evidence: 'Neo4j CPU utilization spiked to 92% during peak indexing. Redis reduced query latency from 380ms to 12ms and dropped Neo4j CPU load by 74%.',
    tradeoffs: 'Traded $240/mo RAM memory footprint for 10x faster knowledge graph rendering.',
    risks: 'Potential stale cache if invalidation events fail.',
    costEstimate: '$240/mo Redis Cluster',
    effortHours: 24,
    confidencePct: 96,
    recommendedAdrId: 'adr-002'
  },
  {
    query: 'Why did we choose PostgreSQL?',
    executiveSummary: 'PostgreSQL was selected for core relational transactional data (users, billing subscriptions, accounts) due to strict ACID compliance and JSONB flexibility.',
    evidence: 'Handles complex financial transactions with 100% data integrity and zero corruption over 12+ months.',
    tradeoffs: 'Traded NoSQL horizontal auto-sharding for relational consistency and SQL query power.',
    risks: 'Requires vacuum tuning under high write volumes.',
    costEstimate: '$150/mo RDS PostgreSQL',
    effortHours: 40,
    confidencePct: 98,
    recommendedAdrId: 'adr-001'
  }
];
