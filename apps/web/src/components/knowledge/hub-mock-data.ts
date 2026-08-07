import {
  HubNode,
  HubEdge,
  EngineeringMemoryQA,
  SmartSearchResult,
  WikiPage,
  ProactiveRecommendation,
  InterSystemLink,
} from './hub-types';

export const MOCK_HUB_NODES: HubNode[] = [
  {
    id: 'node-svc-payment',
    label: 'Payment Service (svc-payment-core)',
    nodeType: 'service',
    teamOwner: 'Core Payments Team',
    technology: 'Python FastAPI / SQLAlchemy / Strimzi Kafka',
    description: 'Handles core asynchronous checkout, tokenization, and Stripe integration.',
    contributors: ['Elena Rostova', 'Marcus Vance', 'Sarah Chen'],
    historyEventsCount: 48,
    relatedDocIds: ['doc-payment-arch', 'adr-0042'],
    relatedInvestigationIds: ['inv-9821', 'inv-4402'],
    aiRecommendation: 'Decompose monolithic strategy classes to reduce cyclomatic complexity from 18.4 to 4.2.',
  },
  {
    id: 'node-svc-auth',
    label: 'Auth & Identity Router (svc-auth-router)',
    nodeType: 'service',
    teamOwner: 'Identity & Security Team',
    technology: 'TypeScript / Node.js / Redis L2 Cache',
    description: 'Stateless JWT verification router with distributed token revocation caching.',
    contributors: ['Sarah Chen', 'Alex Rivera'],
    historyEventsCount: 32,
    relatedDocIds: ['doc-auth-spec'],
    relatedInvestigationIds: ['inv-1204'],
    aiRecommendation: 'Migrate RS256 token verification to Rust NAPI module to handle +45k QPS.',
  },
  {
    id: 'node-db-postgres',
    label: 'PostgreSQL Relational Primary DB (db-primary)',
    nodeType: 'database',
    teamOwner: 'Data Platform Team',
    technology: 'AWS RDS Aurora PostgreSQL 15.4',
    description: 'Primary transactional storage for orders, user accounts, and billing ledgers.',
    contributors: ['Marcus Vance'],
    historyEventsCount: 64,
    relatedDocIds: ['adr-0042'],
    relatedInvestigationIds: ['inv-9821'],
    aiRecommendation: 'Apply Alembic 0042 partition migration for composite indexes (repo_id, status).',
  },
  {
    id: 'node-tech-kafka',
    label: 'Kafka Distributed Event Broker',
    nodeType: 'technology',
    teamOwner: 'Platform Infrastructure',
    technology: 'Strimzi Kafka v3.5 / Zookeeper',
    description: 'Asynchronous event streaming bus decoupling payment checkout from external APIs.',
    contributors: ['Elena Rostova'],
    historyEventsCount: 22,
    relatedDocIds: ['doc-kafka-design'],
    relatedInvestigationIds: [],
    aiRecommendation: 'Maintain 3 availability zone topic replication for payment.checkout.v1.',
  },
  {
    id: 'node-adr-0042',
    label: 'ADR-0042: Hybrid Graph-Relational Storage Model',
    nodeType: 'adr',
    teamOwner: 'Architecture Council',
    technology: 'Neo4j Cypher + PostgreSQL',
    description: 'Architecture Decision Record authorizing Neo4j for dependency topology and Postgres for ACID ledgers.',
    contributors: ['Sarah Chen', 'Elena Rostova'],
    historyEventsCount: 14,
    relatedDocIds: ['doc-payment-arch'],
    relatedInvestigationIds: [],
    aiRecommendation: 'Zero governance drift detected. Architecture verified by Staff AI Reviewer.',
  },
];

export const MOCK_HUB_EDGES: HubEdge[] = [
  { id: 'edge-1', sourceId: 'node-svc-payment', targetId: 'node-db-postgres', edgeType: 'uses', label: 'Uses (Read/Write)' },
  { id: 'edge-2', sourceId: 'node-svc-payment', targetId: 'node-tech-kafka', edgeType: 'depends_on', label: 'Depends On (Event Queue)' },
  { id: 'edge-3', sourceId: 'node-svc-auth', targetId: 'node-svc-payment', edgeType: 'related_to', label: 'Routes Auth To' },
  { id: 'edge-4', sourceId: 'node-adr-0042', targetId: 'node-svc-payment', edgeType: 'affected_by', label: 'Governs Domain' },
];

export const MOCK_MEMORY_QA_ENTRIES: EngineeringMemoryQA[] = [
  {
    id: 'mem-qa-1',
    question: 'Why was Kafka adopted for PaymentService checkout processing?',
    category: 'architecture_decision',
    answerSummary: 'Kafka was adopted under ADR-0038 to decouple synchronous checkout calls from third-party Stripe API latency spikes (340ms -> 24ms P95 latency drop).',
    reasoningChain: [
      'In Q2 2026, Stripe sandbox API latency spikes caused HTTP 504 timeouts on synchronous checkout calls.',
      'Architecture Council conducted Monte Carlo simulation studio load tests evaluating RabbitMQ vs Kafka.',
      'Kafka Strimzi cluster approved under ADR-0038 for zero data loss event queuing.',
    ],
    sourceArtifacts: [
      { type: 'ADR', title: 'ADR-0038 Event Driven Payment Bus', link: '/docs' },
      { type: 'Simulation', title: 'Monte Carlo 100k Load Test', link: '/simulate' },
    ],
    keyContributors: ['Elena Rostova', 'Sarah Chen'],
    confidencePct: 99.4,
  },
  {
    id: 'mem-qa-2',
    question: 'Who introduced the Redis cache eviction fallback mechanism and why?',
    category: 'code_evolution',
    answerSummary: 'Sarah Chen introduced the local memory L1 fallback buffer during PR #312 after Redis cluster memory saturation (88.1%) caused transient cache miss latency spikes.',
    reasoningChain: [
      'Incident #1204 detected elevated API P95 latency (380ms) during cache key eviction.',
      'PR #312 introduced a 5-minute local memory LRU fallback cache inside Auth Router.',
    ],
    sourceArtifacts: [
      { type: 'PR', title: 'PR #312 Local LRU Cache Fallback', link: '/review' },
      { type: 'Incident', title: 'Incident #1204 Telemetry Log', link: '/investigate' },
    ],
    keyContributors: ['Sarah Chen'],
    confidencePct: 98.6,
  },
];

export const MOCK_SMART_SEARCH_RESULTS: SmartSearchResult[] = [
  {
    id: 'srch-1',
    conceptTitle: 'Multi-Tenant Auth & Token Verification Architecture',
    matchedCategory: 'Architecture & Security',
    aiSummary: 'Complete domain overview covering JWT RS256 token verification, Redis L2 caching, and WebAssembly / Rust optimization plans.',
    relevanceScore: 98.4,
    connectedNodes: ['node-svc-auth', 'node-adr-0042'],
    lastUpdated: 'Today, 09:15 AM',
  },
  {
    id: 'srch-2',
    conceptTitle: 'Async Payment Processing & Circuit Breakers',
    matchedCategory: 'Microservices & Telemetry',
    aiSummary: 'FastAPI async payment worker decoupled via Kafka topic payment.checkout.v1 with zero data loss guarantee.',
    relevanceScore: 95.0,
    connectedNodes: ['node-svc-payment', 'node-tech-kafka'],
    lastUpdated: 'Yesterday',
  },
];

export const MOCK_WIKI_PAGES: WikiPage[] = [
  {
    id: 'wiki-arch',
    section: 'architecture',
    title: 'CodeAtlas Hexagonal Domain Architecture Guidelines',
    aiGeneratedContent: `## CodeAtlas Hexagonal Domain Architecture

The CodeAtlas monorepo strictly follows **Clean Architecture & Hexagonal Domain Isolation**.

### Core Architecture Rules
1. **Domain Layer Independence**: The core domain model must never import FastAPI, SQLAlchemy, or external HTTP clients.
2. **Repository Pattern**: Data persistence MUST be abstracted via interfaces in \`domain/repositories.py\`.
3. **Layer Bypass Policy**: 0 Layer bypasses are tolerated. Architecture Intelligence scans AST symbols continuously.
4. **ADR Enforcement**: All major design changes require an Architecture Decision Record (ADR) approved by the Council.`,
    lastUpdated: 'Today, 08:00 AM',
    author: 'Chief Architecture AI Agent',
    version: '4.8.0',
    tags: ['Architecture', 'Clean Architecture', 'ADR'],
    relatedNodeIds: ['node-adr-0042', 'node-svc-payment'],
  },
  {
    id: 'wiki-runbook',
    section: 'runbooks',
    title: 'SRE Production Incident Incident Response & Rollback Runbook',
    aiGeneratedContent: `## SRE Production Incident & Rollback Runbook

### Incident Response Steps
1. **Trigger Automated Rollback**: Navigate to [AI Release Intelligence](/release) and verify MTTR recovery estimate (1.8 mins).
2. **Drain Istio Canary Traffic**: Execute \`kubectl apply -f k8s/istio-route-drain-100-v4.7.yml\`.
3. **Rollback Helm Release**: Run \`helm rollback codeatlas-payment-svc 479\`.
4. **Verify Database Revision**: Run \`alembic current\` to ensure zero non-destructive column drops.`,
    lastUpdated: 'Yesterday, 14:30',
    author: 'Staff SRE AI Agent',
    version: '2.1.0',
    tags: ['SRE', 'Runbook', 'Istio', 'Rollback'],
    relatedNodeIds: ['node-svc-payment', 'node-db-postgres'],
  },
];

export const MOCK_PROACTIVE_RECOMMENDATIONS: ProactiveRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Related Investigation: Monolithic Database Connection Saturation',
    type: 'investigation',
    summary: 'Root cause analysis for PostgreSQL read connection pool saturation under 100k QPS stress testing.',
    targetLink: '/investigate',
    relevancePct: 98,
  },
  {
    id: 'rec-2',
    title: 'Architecture Decision: ADR-0042 Hybrid Graph Storage',
    type: 'adr',
    summary: 'Approved design decision for Neo4j Cypher dependency topology mapping.',
    targetLink: '/docs',
    relevancePct: 96,
  },
];

export const MOCK_INTER_SYSTEM_LINKS: InterSystemLink[] = [
  { subsystem: 'mission_control', label: 'AI Mission Control', url: '/command-center', badge: 'Command' },
  { subsystem: 'cto_workspace', label: 'AI CTO Workspace', url: '/ai-cto', badge: 'CTO' },
  { subsystem: 'investigation_engine', label: 'AI Investigation Engine', url: '/investigate', badge: 'Root Cause' },
  { subsystem: 'refactoring_planner', label: 'AI Refactoring Planner', url: '/improve', badge: 'Refactor' },
  { subsystem: 'doc_engineer', label: 'AI Doc Engineer', url: '/docs', badge: 'Docs' },
  { subsystem: 'code_review', label: 'AI Code Review Intelligence', url: '/review', badge: 'Review' },
  { subsystem: 'release_intelligence', label: 'AI Release Intelligence', url: '/release', badge: 'Release' },
  { subsystem: 'engineering_forecasting', label: 'AI Engineering Forecasting', url: '/forecast', badge: 'Forecast' },
  { subsystem: 'autonomous_workflows', label: 'Autonomous Workflows', url: '/workflows', badge: 'Swarm' },
  { subsystem: 'repository_explorer', label: 'Repository Explorer', url: '/repositories', badge: 'AST' },
  { subsystem: 'architecture_intelligence', label: 'Architecture Intelligence', url: '/architecture', badge: 'Topology' },
  { subsystem: 'dependency_intelligence', label: 'Dependency Intelligence', url: '/dependency-graph', badge: 'Graph' },
  { subsystem: 'simulation_studio', label: 'Simulation Studio', url: '/simulate', badge: 'Monte Carlo' },
  { subsystem: 'monitoring', label: 'Real-Time Monitoring', url: '/monitor', badge: 'Datadog' },
  { subsystem: 'software_memory', label: 'Software Memory Engine', url: '/memory', badge: 'Memory' },
  { subsystem: 'copilot', label: 'AI Copilot', url: '/search', badge: 'Copilot' },
];
