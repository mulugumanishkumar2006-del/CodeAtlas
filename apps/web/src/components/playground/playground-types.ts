export type SystemNodeType =
  | 'gateway'
  | 'microservice'
  | 'database'
  | 'cache'
  | 'queue'
  | 'external_api'
  | 'load_balancer';

export type FaultType =
  | 'SERVICE_CRASH'
  | 'DATABASE_FAILURE'
  | 'REDIS_FAILURE'
  | 'KAFKA_OUTAGE'
  | 'NETWORK_LATENCY'
  | 'PACKET_LOSS'
  | 'HIGH_CPU'
  | 'MEMORY_LEAK';

export interface SystemNode {
  id: string;
  name: string;
  nodeType: SystemNodeType;
  status: 'healthy' | 'degraded' | 'failed' | 'recovering';
  p95LatencyMs: number;
  qps: number;
  errorRatePct: number;
  cpuUsagePct: number;
  memoryUsagePct: number;
  dependencies: string[];
  consumers: string[];
  ownerTeam: string;
  aiSummary: string;
  x: number;
  y: number;
}

export interface RequestFlowPacket {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: 'api' | 'db_query' | 'event' | 'cache';
  status: 'success' | 'retry' | 'failure' | 'timeout';
  latencyMs: number;
}

export interface TraceSpan {
  id: string;
  serviceName: string;
  operationName: string;
  startTimeMs: number;
  durationMs: number;
  status: 'ok' | 'error';
  tags: Record<string, string>;
  children?: TraceSpan[];
}

export interface FaultExperiment {
  id: string;
  title: string;
  faultType: FaultType;
  targetNodeId: string;
  description: string;
  propagatedImpact: string;
  aiCascadingSummary: string;
}

export interface DistributedScenarioQA {
  id: string;
  question: string;
  answerSummary: string;
  cascadingNodes: string[];
  mitigationStrategy: string;
  confidencePct: number;
}
