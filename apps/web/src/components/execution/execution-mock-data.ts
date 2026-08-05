export type ExecutionStepType =
  | 'HTTP Request'
  | 'Controller'
  | 'Middleware'
  | 'Service'
  | 'Repository'
  | 'Cache'
  | 'Database'
  | 'Queue'
  | 'Background Job'
  | 'Message Broker'
  | 'External API'
  | 'Third-party SDK'
  | 'Authentication'
  | 'Authorization'
  | 'Validation'
  | 'Business Logic'
  | 'Response Generation';

export interface ExecutionStepData {
  id: string;
  stepIndex: number;
  name: string;
  type: ExecutionStepType;
  layer: 'Frontend' | 'API Gateway' | 'Middleware' | 'Microservice' | 'Data Store' | 'Messaging' | 'External';
  technology: string;
  durationMs: number;
  averageMs: number;
  p95Ms: number;
  p99Ms: number;
  requestCount: number;
  failureRatePct: number;
  retryCount: number;
  cpuUsagePct: number;
  memoryUsageMb: number;
  ioTimeMs: number;
  cacheHitRatePct?: number;
  sqlQuery?: string;
  apiEndpoint?: string;
  status: 'Healthy' | 'Warning' | 'Critical' | 'Failed';
  description: string;
  caller: string;
  callee: string;
  owner: string;
  aiExplanation?: string;
}

export interface ExecutionFlowTrace {
  id: string;
  requestId: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  totalDurationMs: number;
  p95DurationMs: number;
  status: '200 OK' | '500 Server Error' | '401 Unauthorized';
  timestamp: string;
  environment: string;
  userEmail: string;
  steps: ExecutionStepData[];
}

export interface ExecutionBottleneck {
  id: string;
  title: string;
  type: 'N+1 Query' | 'Slow API' | 'Slow Service' | 'Heavy Function' | 'Redundant Call' | 'Memory Hotspot';
  severity: 'Critical' | 'High' | 'Medium';
  affectedStepIds: string[];
  evidence: string;
  rootCause: string;
  suggestedRefactoring: string;
  estimatedEffortHours: number;
  potentialSpeedup: string;
}

export const MOCK_EXECUTION_TRACES: ExecutionFlowTrace[] = [
  {
    id: 'trace-checkout-101',
    requestId: 'req-98f2a4bc-8120',
    endpoint: '/api/v1/billing/checkout',
    method: 'POST',
    totalDurationMs: 245,
    p95DurationMs: 280,
    status: '200 OK',
    timestamp: 'Just now',
    environment: 'Production us-east-1',
    userEmail: 'engineer@codeatlas.com',
    steps: [
      {
        id: 'step-1',
        stepIndex: 1,
        name: 'Kong Gateway TLS & Route',
        type: 'HTTP Request',
        layer: 'API Gateway',
        technology: 'Kong Edge Proxy',
        durationMs: 3,
        averageMs: 3,
        p95Ms: 5,
        p99Ms: 8,
        requestCount: 12500,
        failureRatePct: 0.01,
        retryCount: 0,
        cpuUsagePct: 4,
        memoryUsageMb: 120,
        ioTimeMs: 1,
        apiEndpoint: 'POST /api/v1/billing/checkout',
        status: 'Healthy',
        description: 'Edge TLS termination and rate limit bucket verification.',
        caller: 'Client Browser',
        callee: 'AuthJwtMiddleware',
        owner: 'Infra SecOps'
      },
      {
        id: 'step-2',
        stepIndex: 2,
        name: 'AuthJwtMiddleware Validation',
        type: 'Middleware',
        layer: 'Middleware',
        technology: 'FastAPI / PyJWT',
        durationMs: 8,
        averageMs: 7,
        p95Ms: 12,
        p99Ms: 18,
        requestCount: 3400,
        failureRatePct: 0.05,
        retryCount: 0,
        cpuUsagePct: 12,
        memoryUsageMb: 240,
        ioTimeMs: 2,
        cacheHitRatePct: 98,
        status: 'Healthy',
        description: 'Verify RS256 signature and check active session token in Redis.',
        caller: 'Kong Gateway',
        callee: 'CheckoutController',
        owner: 'Security Core'
      },
      {
        id: 'step-3',
        stepIndex: 3,
        name: 'CheckoutController.process()',
        type: 'Controller',
        layer: 'Microservice',
        technology: 'FastAPI Router',
        durationMs: 12,
        averageMs: 10,
        p95Ms: 15,
        p99Ms: 22,
        requestCount: 850,
        failureRatePct: 0.1,
        retryCount: 0,
        cpuUsagePct: 18,
        memoryUsageMb: 310,
        ioTimeMs: 4,
        status: 'Healthy',
        description: 'Parse JSON payload and delegate checkout logic to StripePaymentProcessor.',
        caller: 'AuthJwtMiddleware',
        callee: 'StripePaymentProcessor',
        owner: 'Financial Engineering'
      },
      {
        id: 'step-4',
        stepIndex: 4,
        name: 'Redis.acquire_idempotent_lock()',
        type: 'Cache',
        layer: 'Data Store',
        technology: 'Redis RESP',
        durationMs: 2,
        averageMs: 1.8,
        p95Ms: 3,
        p99Ms: 5,
        requestCount: 8500,
        failureRatePct: 0,
        retryCount: 0,
        cpuUsagePct: 2,
        memoryUsageMb: 85,
        ioTimeMs: 1.5,
        cacheHitRatePct: 100,
        status: 'Healthy',
        description: 'Acquire distributed lock to prevent duplicate payment retries.',
        caller: 'StripePaymentProcessor',
        callee: 'Stripe External API',
        owner: 'Infra SecOps'
      },
      {
        id: 'step-5',
        stepIndex: 5,
        name: 'Stripe SDK charges.create()',
        type: 'External API',
        layer: 'External',
        technology: 'Stripe REST API',
        durationMs: 165, // Slow bottleneck step!
        averageMs: 140,
        p95Ms: 210,
        p99Ms: 340,
        requestCount: 650,
        failureRatePct: 0.4,
        retryCount: 0,
        cpuUsagePct: 5,
        memoryUsageMb: 140,
        ioTimeMs: 162,
        status: 'Warning',
        description: 'External HTTP call to Stripe cloud payment gateway for card authorization.',
        caller: 'StripePaymentProcessor',
        callee: 'PostgreSQL Database',
        owner: 'Financial Engineering',
        aiExplanation: 'BOTTLENECK DETECTED: 67% of total request duration spent waiting for external Stripe HTTP response (165ms).'
      },
      {
        id: 'step-6',
        stepIndex: 6,
        name: 'PostgreSQL INSERT INTO customer_subscriptions',
        type: 'Database',
        layer: 'Data Store',
        technology: 'PostgreSQL SQL',
        durationMs: 42,
        averageMs: 35,
        p95Ms: 55,
        p99Ms: 95,
        requestCount: 2100,
        failureRatePct: 0,
        retryCount: 0,
        cpuUsagePct: 24,
        memoryUsageMb: 520,
        ioTimeMs: 38,
        sqlQuery: 'INSERT INTO customer_subscriptions (user_id, plan_id, status) VALUES ($1, $2, $3) RETURNING id;',
        status: 'Healthy',
        description: 'Persist new subscription record to primary SQL database.',
        caller: 'StripePaymentProcessor',
        callee: 'Kafka Topic Publisher',
        owner: 'Database REL'
      },
      {
        id: 'step-7',
        stepIndex: 7,
        name: 'Kafka.publish(payment.events.v1)',
        type: 'Queue',
        layer: 'Messaging',
        technology: 'Kafka Strimzi',
        durationMs: 8,
        averageMs: 6,
        p95Ms: 10,
        p99Ms: 14,
        requestCount: 820,
        failureRatePct: 0,
        retryCount: 0,
        cpuUsagePct: 6,
        memoryUsageMb: 180,
        ioTimeMs: 5,
        status: 'Healthy',
        description: 'Publish asynchronous payment completion event to Kafka topic for downstream analytics.',
        caller: 'CheckoutController',
        callee: 'Response Formatter',
        owner: 'Data Platform'
      },
      {
        id: 'step-8',
        stepIndex: 8,
        name: 'ResponseFormatter.json_response()',
        type: 'Response Generation',
        layer: 'Microservice',
        technology: 'FastAPI JSONResponse',
        durationMs: 5,
        averageMs: 4,
        p95Ms: 6,
        p99Ms: 10,
        requestCount: 850,
        failureRatePct: 0,
        retryCount: 0,
        cpuUsagePct: 8,
        memoryUsageMb: 95,
        ioTimeMs: 1,
        status: 'Healthy',
        description: 'Serialize subscription payload and return HTTP 200 OK response to browser.',
        caller: 'CheckoutController',
        callee: 'Client Browser',
        owner: 'Frontend Platform'
      }
    ]
  }
];

export const MOCK_EXECUTION_BOTTLENECKS: ExecutionBottleneck[] = [
  {
    id: 'bot-stripe-external',
    title: 'High External Latency: Stripe API Call (165ms)',
    type: 'Slow API',
    severity: 'High',
    affectedStepIds: ['step-5'],
    evidence: 'Stripe HTTP API call accounts for 67.3% of total request duration (165ms out of 245ms total).',
    rootCause: 'Synchronous blocking HTTP call to external Stripe API inside web thread.',
    suggestedRefactoring: 'Offload payment capture to background worker queue with asynchronous client polling.',
    estimatedEffortHours: 16,
    potentialSpeedup: '160ms faster TTI (65% speedup)'
  },
  {
    id: 'bot-nplus1-queries',
    title: 'N+1 SQL Queries in Subscription Permission Check',
    type: 'N+1 Query',
    severity: 'Medium',
    affectedStepIds: ['step-6'],
    evidence: 'PostgreSQL step executes 8 sequential SELECT queries inside a loop for user feature flags.',
    rootCause: 'ORM lazy loading evaluated inside iteration loop.',
    suggestedRefactoring: 'Eager load permissions using SQL JOIN in single query pass.',
    estimatedEffortHours: 6,
    potentialSpeedup: '30ms faster DB time'
  }
];
