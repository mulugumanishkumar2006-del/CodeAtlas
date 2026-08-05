export interface ArchNodeData {
  id: string;
  name: string;
  type: 
    | 'Application'
    | 'Domain'
    | 'Microservice'
    | 'Module'
    | 'Package'
    | 'Class'
    | 'Interface'
    | 'Function'
    | 'REST API'
    | 'GraphQL API'
    | 'Queue'
    | 'Database'
    | 'Cache'
    | 'External Service'
    | 'Infrastructure';
  technology: string;
  techIcon?: string;
  healthScore: number; // 0-100
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
  complexity: number; // cyclomatic or LOC score
  loc?: number;
  owner: string;
  ownerAvatar?: string;
  repository: string;
  status: 'Healthy' | 'Warning' | 'Critical' | 'Deprecated';
  domain: string;
  layer: 'Frontend' | 'API Gateway' | 'Microservice' | 'Data Store' | 'Messaging' | 'Infrastructure';
  description: string;
  purpose?: string;
  responsibilities?: string[];
  dependenciesCount?: number;
  consumersCount?: number;
  hasChildren?: boolean;
  parentId?: string;
  metrics?: {
    latencyP95Ms: number;
    throughputRps: number;
    testCoveragePct: number;
    techDebtDays: number;
    securityVulnerabilities: number;
  };
  recentCommits?: {
    hash: string;
    message: string;
    author: string;
    date: string;
  }[];
  aiImprovements?: string[];
}

export interface ArchRelationship {
  id: string;
  source: string;
  target: string;
  type: 
    | 'Calls'
    | 'Imports'
    | 'Dependencies'
    | 'Database Connections'
    | 'Message Queues'
    | 'API Calls'
    | 'Shared Libraries'
    | 'Event Flows';
  protocol?: string; // e.g. gRPC, HTTP/2, SQL, Kafka Topic, WebSocket
  latencyMs?: number;
  throughputRps?: number;
  status?: 'Active' | 'Degraded' | 'Violating';
  description?: string;
}

export interface AIInsightItem {
  id: string;
  title: string;
  category: 
    | 'Circular Dependencies'
    | 'God Classes'
    | 'Highly Coupled Modules'
    | 'Unused Services'
    | 'Architecture Violations'
    | 'Large Packages'
    | 'Performance Bottlenecks'
    | 'Security Risks'
    | 'Missing Documentation'
    | 'Dead Code';
  severity: 'High' | 'Medium' | 'Critical';
  affectedNodes: string[];
  explanation: string;
  evidence: string;
  suggestedFix: string;
}

export interface TimelineMilestone {
  version: string;
  title: string;
  date: string;
  author: string;
  nodeCount: number;
  edgeCount: number;
  summary: string;
  addedNodes: string[];
  removedNodes: string[];
}

export interface SavedViewPreset {
  id: string;
  name: string;
  description: string;
  mode: string;
  focusNodeId?: string;
  iconName: string;
}

export const INITIAL_ARCH_NODES: ArchNodeData[] = [
  // 1. Applications & Gateway
  {
    id: 'app-web',
    name: 'CodeAtlas Web Portal',
    type: 'Application',
    technology: 'Next.js 16',
    healthScore: 94,
    riskScore: 'Low',
    complexity: 14,
    loc: 24500,
    owner: 'Frontend Platform Core',
    repository: 'CodeAtlas/apps/web',
    status: 'Healthy',
    domain: 'User Experience & Intelligence UI',
    layer: 'Frontend',
    description: 'Next.js 16 App Router interface providing real-time AI copilot, visual graphs, and mission control dashboard.',
    purpose: 'Serve single-page & server-rendered interactive workflows for software intelligence engineers.',
    responsibilities: [
      'Render 2D/3D WebGL topology & ReactFlow architecture graphs',
      'Manage real-time WebSocket connections with backend AI stream',
      'Provide SOC2-compliant enterprise RBAC UI'
    ],
    dependenciesCount: 5,
    consumersCount: 1,
    metrics: {
      latencyP95Ms: 45,
      throughputRps: 1450,
      testCoveragePct: 88,
      techDebtDays: 2.5,
      securityVulnerabilities: 0
    },
    recentCommits: [
      { hash: 'a8f9c12', message: 'feat: add Architecture Explorer interactive graph mode', author: 'Principal Architect', date: '2 hours ago' },
      { hash: 'e3b1290', message: 'perf: optimize ReactFlow canvas virtualization for 100k nodes', author: 'Staff Engineer', date: '1 day ago' }
    ],
    aiImprovements: [
      'Optimize bundle splitting for WebGL canvas assets to reduce initial TTI by 120ms',
      'Refactor local component state into Zustand persistent slice'
    ]
  },
  {
    id: 'api-gateway',
    name: 'Kong API Gateway Engine',
    type: 'Infrastructure',
    technology: 'Kong / Nginx',
    healthScore: 98,
    riskScore: 'Low',
    complexity: 8,
    owner: 'Infra SecOps Team',
    repository: 'CodeAtlas/k8s/gateway',
    status: 'Healthy',
    domain: 'Networking & Perimeters',
    layer: 'API Gateway',
    description: 'Edge reverse proxy handling TLS termination, rate limiting, JWT validation, and gRPC routing.',
    purpose: 'Provide high-throughput authentication, rate-limiting, and microservice traffic balancing.',
    responsibilities: ['Validate JWT Tokens', 'Rate Limit IP buckets', 'Route HTTP/2 & gRPC traffic'],
    dependenciesCount: 4,
    consumersCount: 1,
    metrics: {
      latencyP95Ms: 3,
      throughputRps: 12500,
      testCoveragePct: 95,
      techDebtDays: 0,
      securityVulnerabilities: 0
    }
  },

  // 2. Microservices
  {
    id: 'svc-auth',
    name: 'Authentication & IAM Service',
    type: 'Microservice',
    technology: 'FastAPI / Python 3.12',
    healthScore: 96,
    riskScore: 'Low',
    complexity: 18,
    loc: 8900,
    owner: 'Security Core Team',
    repository: 'CodeAtlas/apps/backend/app/auth',
    status: 'Healthy',
    domain: 'Security & Access Management',
    layer: 'Microservice',
    description: 'Enterprise OAuth2, SAML 2.0, multi-tenant RBAC tokens, and security audit log issuer.',
    purpose: 'Govern identity verification, role permissions, and API session security.',
    responsibilities: ['Issue RS256 JWT tokens', 'Integrate Enterprise Okta/Azure AD', 'Log Security Audit Traces'],
    dependenciesCount: 2,
    consumersCount: 6,
    metrics: {
      latencyP95Ms: 12,
      throughputRps: 3400,
      testCoveragePct: 94,
      techDebtDays: 1,
      securityVulnerabilities: 0
    }
  },
  {
    id: 'svc-ast-parser',
    name: 'Universal AST Parser Service',
    type: 'Microservice',
    technology: 'Tree-Sitter / Rust / Python',
    healthScore: 88,
    riskScore: 'Medium',
    complexity: 42,
    loc: 48000,
    owner: 'Language Parsing Division',
    repository: 'CodeAtlas/apps/backend/app/ast_parser',
    status: 'Healthy',
    domain: 'Code Understanding & Graph Construction',
    layer: 'Microservice',
    description: 'Incremental multi-language parser extracting syntax trees, symbols, call graphs, and type definitions.',
    purpose: 'Parse 100,000+ source code files into normalized Graph AST entities in sub-seconds.',
    responsibilities: ['Tree-Sitter grammar evaluation', 'Cyclomatic complexity calculation', 'Call graph extraction'],
    dependenciesCount: 3,
    consumersCount: 4,
    metrics: {
      latencyP95Ms: 85,
      throughputRps: 820,
      testCoveragePct: 82,
      techDebtDays: 6,
      securityVulnerabilities: 0
    },
    aiImprovements: [
      'Extract C++ bindings into dedicated Rust worker thread pool',
      'Cache parsed AST symbol hashes in Redis to eliminate duplicate passes'
    ]
  },
  {
    id: 'svc-kg-engine',
    name: 'Knowledge Graph Engine',
    type: 'Microservice',
    technology: 'Neo4j / NetworkX',
    healthScore: 92,
    riskScore: 'Low',
    complexity: 35,
    owner: 'Graph Intelligence Team',
    repository: 'CodeAtlas/apps/backend/app/graph',
    status: 'Healthy',
    domain: 'Software Intelligence Graph',
    layer: 'Microservice',
    description: 'Entity relationship graph computer resolving cross-repo dependencies, data flows, and impact boundaries.',
    purpose: 'Store and query semantic relationships across repositories, microservices, and databases.',
    responsibilities: ['Neo4j Cypher query execution', 'Graph centrality & pagerank computation', 'Circular dependency detector'],
    dependenciesCount: 2,
    consumersCount: 8,
    metrics: {
      latencyP95Ms: 24,
      throughputRps: 2100,
      testCoveragePct: 91,
      techDebtDays: 3,
      securityVulnerabilities: 0
    }
  },
  {
    id: 'svc-ai-reasoning',
    name: 'AI Engineering Reasoning Engine',
    type: 'Microservice',
    technology: 'PyTorch / Gemini 3.5 / LangChain',
    healthScore: 84,
    riskScore: 'Medium',
    complexity: 58,
    loc: 32000,
    owner: 'AI Systems Engineering',
    repository: 'CodeAtlas/apps/backend/app/agi_reasoning',
    status: 'Healthy',
    domain: 'AI Autonomous Intelligence',
    layer: 'Microservice',
    description: 'Autonomous architectural reasoning, refactoring proposal generator, and tech debt analysis agent.',
    purpose: 'Analyze architectural code health and synthesize strategic engineering recommendations.',
    responsibilities: ['Architectural pattern recognition', 'God Class & coupling detection', 'Automated doc generation'],
    dependenciesCount: 4,
    consumersCount: 3,
    metrics: {
      latencyP95Ms: 420,
      throughputRps: 180,
      testCoveragePct: 76,
      techDebtDays: 8,
      securityVulnerabilities: 0
    }
  },

  // 3. Domains & Modules
  {
    id: 'domain-security',
    name: 'Security & Compliance Domain',
    type: 'Domain',
    technology: 'Domain Boundaries',
    healthScore: 95,
    riskScore: 'Low',
    complexity: 12,
    owner: 'Security Guild',
    repository: 'CodeAtlas/security',
    status: 'Healthy',
    domain: 'Security & Access Management',
    layer: 'Microservice',
    description: 'Domain encapsulating Auth, RBAC, Secret Vault, and SOC2 Audit Pipelines.',
    hasChildren: true
  },
  {
    id: 'domain-intelligence',
    name: 'Code Intelligence Domain',
    type: 'Domain',
    technology: 'Domain Boundaries',
    healthScore: 89,
    riskScore: 'Medium',
    complexity: 28,
    owner: 'Core AI Guild',
    repository: 'CodeAtlas/intelligence',
    status: 'Healthy',
    domain: 'Software Intelligence Graph',
    layer: 'Microservice',
    description: 'Domain encapsulating AST Parser, Graph Engine, AI Reasoning, and Simulation Studio.',
    hasChildren: true
  },
  {
    id: 'mod-auth-jwt',
    name: 'JwtTokenProvider Module',
    type: 'Module',
    technology: 'Python / PyJWT',
    healthScore: 98,
    riskScore: 'Low',
    complexity: 6,
    owner: 'Security Core Team',
    repository: 'CodeAtlas/apps/backend/app/core/jwt.py',
    status: 'Healthy',
    domain: 'Security & Access Management',
    layer: 'Microservice',
    description: 'Module responsible for signing and verifying RS256 cryptographic JSON Web Tokens.'
  },
  {
    id: 'mod-ast-indexer',
    name: 'IncrementalIndexer Module',
    type: 'Module',
    technology: 'Python / AsyncIO',
    healthScore: 78,
    riskScore: 'High',
    complexity: 48,
    loc: 2400,
    owner: 'Language Parsing Division',
    repository: 'CodeAtlas/apps/backend/app/ast_parser/indexer.py',
    status: 'Warning',
    domain: 'Code Understanding & Graph Construction',
    layer: 'Microservice',
    description: 'High cyclomatic complexity module managing file diff watch loops and incremental AST merging.',
    aiImprovements: ['Break down 600-line parse_diff() function into 3 specialized sub-components']
  },

  // 4. REST & GraphQL APIs
  {
    id: 'api-graphql-gateway',
    name: '/graphql Unified Architecture API',
    type: 'GraphQL API',
    technology: 'GraphQL / Strawberry',
    healthScore: 94,
    riskScore: 'Low',
    complexity: 16,
    owner: 'API Guild',
    repository: 'CodeAtlas/apps/backend/app/api/graphql.py',
    status: 'Healthy',
    domain: 'User Experience & Intelligence UI',
    layer: 'API Gateway',
    description: 'Unified GraphQL endpoint allowing client UI to query architecture topology subgraphs on demand.'
  },
  {
    id: 'api-rest-repo-analysis',
    name: 'POST /api/v1/analyze/repository',
    type: 'REST API',
    technology: 'FastAPI REST',
    healthScore: 91,
    riskScore: 'Low',
    complexity: 9,
    owner: 'Platform Core',
    repository: 'CodeAtlas/apps/backend/app/api/v1/repositories.py',
    status: 'Healthy',
    domain: 'Code Understanding & Graph Construction',
    layer: 'API Gateway',
    description: 'Asynchronous REST endpoint to trigger full multi-repository AST scan and graph ingestion.'
  },

  // 5. Classes & Functions & Interfaces
  {
    id: 'class-god-ast-manager',
    name: 'ASTRepositoryManager (God Class)',
    type: 'Class',
    technology: 'Python Class',
    healthScore: 54,
    riskScore: 'Critical',
    complexity: 84,
    loc: 3850,
    owner: 'Legacy Codebase',
    repository: 'CodeAtlas/apps/backend/app/services/ast_manager.py',
    status: 'Critical',
    domain: 'Code Understanding & Graph Construction',
    layer: 'Microservice',
    description: 'God Class antipattern violating Single Responsibility Principle with 3850 LOC and 42 methods.',
    responsibilities: [
      'Database I/O execution',
      'AST Tree parsing',
      'File system reading',
      'Cache invalidation',
      'HTTP callback notifications'
    ],
    aiImprovements: [
      'Architectural Violation: God Class detected (84 CC, 3850 LOC)',
      'Split into ASTParseService, ASTStorageRepository, and ASTNotificationWorker'
    ]
  },
  {
    id: 'func-circular-caller',
    name: 'eval_circular_dependency()',
    type: 'Function',
    technology: 'Python Async Function',
    healthScore: 68,
    riskScore: 'High',
    complexity: 22,
    owner: 'Graph Intelligence Team',
    repository: 'CodeAtlas/apps/backend/app/graph/circular.py',
    status: 'Warning',
    domain: 'Software Intelligence Graph',
    layer: 'Microservice',
    description: 'Function participating in a detected 3-way circular call loop.'
  },

  // 6. Data Stores & Caches & Messaging
  {
    id: 'db-neo4j-cluster',
    name: 'Neo4j Enterprise Graph Database',
    type: 'Database',
    technology: 'Neo4j 5.18 Cypher',
    healthScore: 97,
    riskScore: 'Low',
    complexity: 10,
    owner: 'Database Reliability Engineering',
    repository: 'CodeAtlas/k8s/neo4j',
    status: 'Healthy',
    domain: 'Software Intelligence Graph',
    layer: 'Data Store',
    description: 'Clustered Graph DB storing 10M+ code symbol nodes and 50M+ structural relationship edges.',
    metrics: {
      latencyP95Ms: 14,
      throughputRps: 4500,
      testCoveragePct: 100,
      techDebtDays: 0,
      securityVulnerabilities: 0
    }
  },
  {
    id: 'db-postgres-relational',
    name: 'PostgreSQL Primary State DB',
    type: 'Database',
    technology: 'PostgreSQL 16 / SQLAlchemy',
    healthScore: 95,
    riskScore: 'Low',
    complexity: 15,
    owner: 'Database Reliability Engineering',
    repository: 'CodeAtlas/k8s/postgres',
    status: 'Healthy',
    domain: 'Security & Access Management',
    layer: 'Data Store',
    description: 'ACID-compliant relational database for user accounts, repositories metadata, and audit logs.'
  },
  {
    id: 'cache-redis-cluster',
    name: 'Redis L2 Distributed Cache',
    type: 'Cache',
    technology: 'Redis 7 Cluster',
    healthScore: 99,
    riskScore: 'Low',
    complexity: 4,
    owner: 'Infra SecOps Team',
    repository: 'CodeAtlas/k8s/redis',
    status: 'Healthy',
    domain: 'Networking & Perimeters',
    layer: 'Data Store',
    description: 'Sub-millisecond memory store caching parsed AST trees, user session tokens, and rate limits.'
  },
  {
    id: 'queue-kafka-events',
    name: 'Apache Kafka Event Backbone',
    type: 'Queue',
    technology: 'Kafka / Strimzi Operator',
    healthScore: 96,
    riskScore: 'Low',
    complexity: 20,
    owner: 'Data Platform Guild',
    repository: 'CodeAtlas/k8s/kafka',
    status: 'Healthy',
    domain: 'Messaging & Asynchronous Pipeline',
    layer: 'Messaging',
    description: 'Distributed event bus streaming code push events, AST parse tasks, and telemetry notifications.'
  },

  // 7. External Services & Infra
  {
    id: 'ext-github-api',
    name: 'GitHub Enterprise Cloud API',
    type: 'External Service',
    technology: 'REST / GraphQL External API',
    healthScore: 92,
    riskScore: 'Low',
    complexity: 5,
    owner: 'External Integration Team',
    repository: 'External Vendor API',
    status: 'Healthy',
    domain: 'Integrations & Cloud',
    layer: 'Infrastructure',
    description: 'External provider for repository webhooks, PR diff fetches, and commit timeline sync.'
  },
  {
    id: 'infra-k8s-mesh',
    name: 'Kubernetes Istio Service Mesh',
    type: 'Infrastructure',
    technology: 'Kubernetes / Istio / Helm',
    healthScore: 98,
    riskScore: 'Low',
    complexity: 18,
    owner: 'Infra SecOps Team',
    repository: 'CodeAtlas/k8s/mesh',
    status: 'Healthy',
    domain: 'Networking & Perimeters',
    layer: 'Infrastructure',
    description: 'mTLS service mesh enforcing zero-trust network policies and distributed telemetry tracing.'
  }
];

export const INITIAL_ARCH_RELATIONSHIPS: ArchRelationship[] = [
  // Gateway -> Services
  {
    id: 'rel-1',
    source: 'app-web',
    target: 'api-gateway',
    type: 'API Calls',
    protocol: 'HTTP/2 TLS',
    latencyMs: 4,
    throughputRps: 1450,
    status: 'Active',
    description: 'Web UI forwards browser queries to Kong edge API gateway.'
  },
  {
    id: 'rel-2',
    source: 'api-gateway',
    target: 'svc-auth',
    type: 'Calls',
    protocol: 'gRPC mTLS',
    latencyMs: 3,
    throughputRps: 3400,
    status: 'Active',
    description: 'Kong proxy verifies JWT headers with Auth Service over gRPC.'
  },
  {
    id: 'rel-3',
    source: 'api-gateway',
    target: 'api-graphql-gateway',
    type: 'API Calls',
    protocol: 'HTTP/2',
    latencyMs: 5,
    throughputRps: 920,
    status: 'Active'
  },
  {
    id: 'rel-4',
    source: 'api-graphql-gateway',
    target: 'svc-kg-engine',
    type: 'Calls',
    protocol: 'gRPC',
    latencyMs: 12,
    throughputRps: 880,
    status: 'Active'
  },
  {
    id: 'rel-5',
    source: 'api-graphql-gateway',
    target: 'svc-ai-reasoning',
    type: 'Calls',
    protocol: 'gRPC Stream',
    latencyMs: 180,
    throughputRps: 180,
    status: 'Active'
  },

  // Service -> Messaging & Data
  {
    id: 'rel-6',
    source: 'svc-ast-parser',
    target: 'queue-kafka-events',
    type: 'Message Queues',
    protocol: 'Kafka Topic: ast.parsed.v1',
    latencyMs: 8,
    throughputRps: 820,
    status: 'Active',
    description: 'Parser emits parsed AST node payloads to Kafka event stream.'
  },
  {
    id: 'rel-7',
    source: 'queue-kafka-events',
    target: 'svc-kg-engine',
    type: 'Event Flows',
    protocol: 'Kafka Consumer Group',
    latencyMs: 15,
    throughputRps: 820,
    status: 'Active',
    description: 'Knowledge Graph Engine consumes AST events and builds graph relationships.'
  },
  {
    id: 'rel-8',
    source: 'svc-kg-engine',
    target: 'db-neo4j-cluster',
    type: 'Database Connections',
    protocol: 'Bolt / Cypher',
    latencyMs: 11,
    throughputRps: 4500,
    status: 'Active'
  },
  {
    id: 'rel-9',
    source: 'svc-auth',
    target: 'db-postgres-relational',
    type: 'Database Connections',
    protocol: 'PostgreSQL / SQL',
    latencyMs: 6,
    throughputRps: 2100,
    status: 'Active'
  },
  {
    id: 'rel-10',
    source: 'svc-ast-parser',
    target: 'cache-redis-cluster',
    type: 'Database Connections',
    protocol: 'Redis RESP',
    latencyMs: 1,
    throughputRps: 5400,
    status: 'Active'
  },
  {
    id: 'rel-11',
    source: 'svc-ast-parser',
    target: 'ext-github-api',
    type: 'API Calls',
    protocol: 'HTTPS REST',
    latencyMs: 140,
    throughputRps: 45,
    status: 'Active'
  },

  // Code Level Dependencies & Architecture Violations
  {
    id: 'rel-12',
    source: 'mod-ast-indexer',
    target: 'class-god-ast-manager',
    type: 'Imports',
    protocol: 'Python Module Import',
    status: 'Degraded',
    description: 'Indexer module directly coupled to God Class manager.'
  },
  {
    id: 'rel-13',
    source: 'class-god-ast-manager',
    target: 'db-postgres-relational',
    type: 'Database Connections',
    protocol: 'Direct SQL Bypass',
    status: 'Violating',
    description: 'ARCHITECTURE VIOLATION: AST Manager bypasses Repository layer to write SQL directly to Database!'
  },
  {
    id: 'rel-14',
    source: 'func-circular-caller',
    target: 'mod-ast-indexer',
    type: 'Calls',
    protocol: 'Function Call',
    status: 'Degraded'
  },
  {
    id: 'rel-15',
    source: 'mod-ast-indexer',
    target: 'func-circular-caller',
    type: 'Calls',
    protocol: 'Function Call',
    status: 'Violating',
    description: 'CIRCULAR DEPENDENCY: mod-ast-indexer <-> func-circular-caller call cycle!'
  }
];

export const MOCK_AI_INSIGHTS: AIInsightItem[] = [
  {
    id: 'insight-1',
    title: 'God Class Antipattern Detected in ASTRepositoryManager',
    category: 'God Classes',
    severity: 'Critical',
    affectedNodes: ['class-god-ast-manager'],
    explanation: 'ASTRepositoryManager handles 5 distinct domain responsibilities including direct Database SQL execution, File I/O, and WebSocket notifications.',
    evidence: 'File: apps/backend/app/services/ast_manager.py (3,850 LOC, 84 Cyclomatic Complexity, 42 public methods).',
    suggestedFix: 'Refactor into 3 decoupled classes: ASTParseService, ASTStorageRepository, and ASTNotificationWorker.'
  },
  {
    id: 'insight-2',
    title: 'Architecture Layer Violation: Direct DB Bypass from Service',
    category: 'Architecture Violations',
    severity: 'Critical',
    affectedNodes: ['class-god-ast-manager', 'db-postgres-relational'],
    explanation: 'ASTRepositoryManager is executing raw SQL queries directly against PostgreSQL, bypassing the established Repository & DAO abstraction layer.',
    evidence: 'Line 420: connection.execute("INSERT INTO ast_nodes VALUES (...)")',
    suggestedFix: 'Route all data access through PostgreSQLRepository interface with proper session management.'
  },
  {
    id: 'insight-3',
    title: '2-Way Circular Call Loop in AST Parsing Pipeline',
    category: 'Circular Dependencies',
    severity: 'High',
    affectedNodes: ['mod-ast-indexer', 'func-circular-caller'],
    explanation: 'IncrementalIndexer imports and calls eval_circular_dependency(), which in turn invokes IncrementalIndexer.parse_diff(), creating a lock-prone dependency cycle.',
    evidence: 'mod-ast-indexer:L42 calls eval_circular_dependency(); func-circular-caller:L88 calls IncrementalIndexer.',
    suggestedFix: 'Extract the shared state evaluation logic into a pure helper module ASTDiffEvaluator.'
  },
  {
    id: 'insight-4',
    title: 'High Coupling Density in Universal AST Parser Service',
    category: 'Highly Coupled Modules',
    severity: 'Medium',
    affectedNodes: ['svc-ast-parser'],
    explanation: 'Universal AST Parser is directly coupled to 8 external modules without facade boundaries.',
    evidence: 'Effort-to-change score is 8.4/10 due to tight module coupling across 14 source files.',
    suggestedFix: 'Implement an ASTPipelineFacade pattern to encapsulate tree-sitter operations.'
  }
];

export const MOCK_TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    version: 'v1.0.0',
    title: 'Monolithic Architecture Baseline',
    date: 'Jan 15, 2025',
    author: 'Principal Architect',
    nodeCount: 6,
    edgeCount: 7,
    summary: 'Initial single Python monolith housing UI, parser, and relational database.',
    addedNodes: ['app-web', 'svc-auth', 'db-postgres-relational'],
    removedNodes: []
  },
  {
    version: 'v1.4.0',
    title: 'Microservices & Neo4j Ingestion',
    date: 'Apr 10, 2025',
    author: 'Staff Infra Engineer',
    nodeCount: 12,
    edgeCount: 14,
    summary: 'Extracted AST Parser and created Neo4j Knowledge Graph cluster.',
    addedNodes: ['svc-ast-parser', 'svc-kg-engine', 'db-neo4j-cluster', 'cache-redis-cluster'],
    removedNodes: []
  },
  {
    version: 'v2.0.0',
    title: 'Kafka Event Streaming Architecture',
    date: 'Sep 22, 2025',
    author: 'Data Platform Guild',
    nodeCount: 16,
    edgeCount: 20,
    summary: 'Introduced Apache Kafka event backbone for non-blocking asynchronous AST processing.',
    addedNodes: ['queue-kafka-events', 'api-graphql-gateway'],
    removedNodes: []
  },
  {
    version: 'v2.5.0 Today',
    title: 'AI Engineering Mesh & Multi-Domain Mesh',
    date: 'Aug 04, 2026',
    author: 'AI Systems Architect',
    nodeCount: 18,
    edgeCount: 24,
    summary: 'Integrated Gemini 3.5 AI Autonomous Reasoning engine and Kubernetes Istio service mesh.',
    addedNodes: ['svc-ai-reasoning', 'infra-k8s-mesh', 'class-god-ast-manager'],
    removedNodes: []
  }
];

export const SAVED_VIEW_PRESETS: SavedViewPreset[] = [
  {
    id: 'preset-overview',
    name: 'Full Platform Mesh',
    description: 'Complete high-level software topology across all layers and microservices.',
    mode: 'Component View',
    iconName: 'LayoutGrid'
  },
  {
    id: 'preset-services',
    name: 'Microservices & APIs',
    description: 'Isolate backend services, REST/GraphQL endpoints, and service boundaries.',
    mode: 'Service View',
    iconName: 'Server'
  },
  {
    id: 'preset-security',
    name: 'Security & Auth Perimeters',
    description: 'Focus on Kong Gateway, IAM Service, OAuth, JWT providers, and DB security.',
    mode: 'Security View',
    focusNodeId: 'svc-auth',
    iconName: 'ShieldCheck'
  },
  {
    id: 'preset-data',
    name: 'Data Stores & Messaging Queues',
    description: 'Inspect Neo4j Graph DB, PostgreSQL, Redis cache, and Kafka event topics.',
    mode: 'Database View',
    focusNodeId: 'db-neo4j-cluster',
    iconName: 'Database'
  },
  {
    id: 'preset-violations',
    name: 'AI Architecture Violations',
    description: 'Highlight God Classes, circular dependencies, and direct DB bypasses.',
    mode: 'Dependency View',
    focusNodeId: 'class-god-ast-manager',
    iconName: 'AlertTriangle'
  }
];
