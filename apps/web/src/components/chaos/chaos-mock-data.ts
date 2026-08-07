import {
  ChaosFailureTemplate,
  ResilienceScorecard,
  RecoveryPlaybook,
  AiSreQA,
} from './chaos-types';

export const MOCK_RESILIENCE_SCORECARD: ResilienceScorecard = {
  systemResilienceScorePct: 96.4,
  availabilityPct: 99.99,
  recoveryReadinessMttrMins: 1.8,
  criticalServicesCount: 6,
  activeExperimentsCount: 16,
};

export const MOCK_CHAOS_TEMPLATES: ChaosFailureTemplate[] = [
  {
    id: 'ch-db-crash',
    title: 'Database Primary Master Crash',
    category: 'Database',
    targetService: 'PostgreSQLPrimaryDB',
    description: 'Simulate primary database master crash during peak checkout volume.',
    severity: 'CRITICAL',
    estimatedMttrMinutes: 1.8,
  },
  {
    id: 'ch-redis-fail',
    title: 'Redis Cache Cluster Outage',
    category: 'Cache',
    targetService: 'RedisCacheCluster',
    description: 'Evict Redis session cache to test Auth Router local memory fallback.',
    severity: 'MEDIUM',
    estimatedMttrMinutes: 0.5,
  },
  {
    id: 'ch-kafka-out',
    title: 'Kafka Broker Topic Partition Disruption',
    category: 'Queue',
    targetService: 'StrimziKafkaCluster',
    description: 'Block Kafka partition leader to verify event buffering in disk queue.',
    severity: 'HIGH',
    estimatedMttrMinutes: 1.2,
  },
  {
    id: 'ch-cpu-sat',
    title: 'High CPU Saturation (99%)',
    category: 'Compute',
    targetService: 'PaymentService',
    description: 'Saturate CPU cores to trigger Kubernetes Horizontal Pod Autoscaler.',
    severity: 'HIGH',
    estimatedMttrMinutes: 2.0,
  },
  {
    id: 'ch-net-lat',
    title: 'Network Latency Spike (+500ms)',
    category: 'Network',
    targetService: 'StripeAPIAdapter',
    description: 'Inject +500ms delay into external HTTP calls to trigger circuit breakers.',
    severity: 'MEDIUM',
    estimatedMttrMinutes: 0.8,
  },
  {
    id: 'ch-k8s-pod',
    title: 'Kubernetes Worker Node Drain',
    category: 'Kubernetes',
    targetService: 'AuthGatewayController',
    description: 'Drain Kubernetes worker node to test pod rescheduling across availability zones.',
    severity: 'HIGH',
    estimatedMttrMinutes: 2.4,
  },
  {
    id: 'ch-mem-leak',
    title: 'Memory Leak & OOM Killer Simulation',
    category: 'Compute',
    targetService: 'UserRepository',
    description: 'Simulate unbounded array growth to trigger Linux kernel OOM Killer.',
    severity: 'HIGH',
    estimatedMttrMinutes: 1.5,
  },
  {
    id: 'ch-cloud-reg',
    title: 'AWS Region Outage & Traffic Reroute',
    category: 'Cloud',
    targetService: 'KongAPIGateway',
    description: 'Failover traffic from AWS us-east-1 to us-west-2 via Route53 DNS.',
    severity: 'CRITICAL',
    estimatedMttrMinutes: 3.2,
  },
];

export const MOCK_RECOVERY_PLAYBOOK: RecoveryPlaybook = {
  incidentId: 'INC-CHAOS-9821',
  title: 'PostgreSQL Database Master Outage & Failover Playbook',
  timestamp: 'Today, 08:45 AM',
  rootCauseAnalysis: 'Master RDS Aurora database instance experienced connection pool exhaustion (100% saturation) under 50k QPS stress test.',
  rollbackStrategy: 'Execute automated Helm rollback to release v4.7.9 and drain Istio canary traffic to 0%.',
  recoveryTimeline: [
    { time: '00:00', action: 'Chaos experiment injected primary DB master failure.' },
    { time: '00:05', action: 'Istio circuit breaker tripped; HTTP 503 fallback engaged.' },
    { time: '00:45', action: 'AWS Aurora auto-promoted read replica to master.' },
    { time: '01:48', action: 'All 6 critical microservices verified healthy. MTTR: 1.8 mins.' },
  ],
  verificationChecklist: [
    'Verify Alembic database schema migrations',
    'Check Istio VirtualService route drain targets',
    'Audit Prometheus latency P95 telemetry stream',
    'Validate zero data loss in Kafka event topic ledgers',
  ],
  postmortemSummary: 'System successfully recovered in 1.8 minutes with 0 permanent data loss. Circuit breakers prevented cascading failures to Auth Gateway.',
  preventionPlan: 'Increase RDS Aurora Max Connections from 5,000 to 15,000 and enable Redis write-behind cache.',
};

export const MOCK_AI_SRE_QA: AiSreQA[] = [
  {
    id: 'sre-1',
    question: 'Can PaymentService survive a complete primary database outage?',
    answerSummary: 'Yes. PaymentService queues all failed checkout transactions into Strimzi Kafka topics. Once the database recovers (1.8 mins MTTR), events are processed with 0 data loss.',
    evidenceTelemetry: 'Monte Carlo 100k load simulation verified 100% zero data loss event queuing.',
    confidencePct: 99.4,
  },
  {
    id: 'sre-2',
    question: 'Which microservice is most vulnerable to cascading failures?',
    answerSummary: 'UserRepository is most vulnerable due to direct synchronous coupling with PostgreSQL without an L2 Redis caching layer.',
    evidenceTelemetry: 'AST call dependency analysis detected 0 caching wrappers on UserRepository query methods.',
    confidencePct: 98.2,
  },
];
