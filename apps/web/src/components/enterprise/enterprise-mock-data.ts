export type ExecutiveRolePerspective = 'CTO' | 'VP Engineering' | 'Director of Architecture' | 'Engineering Manager' | 'Staff Engineer' | 'Principal Architect' | 'SRE Lead';

export type TechRadarStatus = 'Adopt' | 'Trial' | 'Assess' | 'Hold';

export interface TechRadarItem {
  id: string;
  name: string;
  category: 'Languages & Frameworks' | 'Data Stores' | 'Messaging & Streams' | 'Infrastructure' | 'Security';
  status: TechRadarStatus;
  description: string;
  adoptedTeamsCount: number;
}

export interface TeamWorkspace {
  id: string;
  teamName: string;
  leadName: string;
  ownedReposCount: number;
  healthScorePct: number;
  busFactorScore: number;
  criticalServices: string[];
  techDebtHotspots: string[];
}

export interface ArbChangeRequest {
  id: string;
  requestId: string; // e.g. "ARB-2026-042"
  title: string;
  requestor: string;
  team: string;
  date: string;
  status: 'Under Review' | 'Approved' | 'Rejected' | 'Requires Revisions';
  summary: string;
  impactScorePct: number;
  committeeVotes: { approve: number; reject: number; abstain: number };
}

export const MOCK_ORG_METRICS = {
  orgName: 'Acme Global Enterprise',
  slug: 'acme-global',
  totalRepos: 1042,
  healthScorePct: 93,
  healthGrade: 'A+',
  totalCrossDeps: 18420,
  criticalServicesCount: 142,
  busFactorScore: 4.2,
  annualCloudSpend: '$2,180,400',
  savedEngineeringHoursYearly: 18400,
};

export const MOCK_DORA_METRICS = [
  { label: 'Deployment Frequency', value: '48 / day', rating: 'ELITE' },
  { label: 'Lead Time for Changes', value: '1.4 hours', rating: 'ELITE' },
  { label: 'Change Failure Rate', value: '0.8%', rating: 'ELITE' },
  { label: 'Mean Time to Recovery', value: '< 14 mins', rating: 'ELITE' },
];

export const MOCK_TECH_RADAR: TechRadarItem[] = [
  { id: 'radar-1', name: 'FastAPI & Python 3.10', category: 'Languages & Frameworks', status: 'Adopt', description: 'Standard high-performance async framework for microservices.', adoptedTeamsCount: 24 },
  { id: 'radar-2', name: 'PostgreSQL 15 RDS', category: 'Data Stores', status: 'Adopt', description: 'Primary relational transactional database.', adoptedTeamsCount: 38 },
  { id: 'radar-3', name: 'Redis 7 Cluster', category: 'Data Stores', status: 'Adopt', description: 'L2 in-memory cache & rate limiter.', adoptedTeamsCount: 32 },
  { id: 'radar-4', name: 'Apache Kafka & Strimzi', category: 'Messaging & Streams', status: 'Adopt', description: 'Event streaming backbone for billing and analytics.', adoptedTeamsCount: 18 },
  { id: 'radar-5', name: 'Neo4j Graph DB 5.0', category: 'Data Stores', status: 'Trial', description: 'Software knowledge graph & symbol relationships.', adoptedTeamsCount: 4 },
  { id: 'radar-6', name: 'GraphQL Federation v2', category: 'Languages & Frameworks', status: 'Assess', description: 'Unified supergraph for web & mobile clients.', adoptedTeamsCount: 2 },
  { id: 'radar-7', name: 'Monolithic Session Cookies', category: 'Security', status: 'Hold', description: 'Deprecated; migrate all services to RS256 JWT auth.', adoptedTeamsCount: 1 }
];

export const MOCK_TEAMS: TeamWorkspace[] = [
  { id: 'team-core', teamName: 'Core Platform & Gateway', leadName: 'Sarah Jenkins', ownedReposCount: 42, healthScorePct: 95, busFactorScore: 5.2, criticalServices: ['KongGateway', 'AuthService'], techDebtHotspots: ['Legacy Gateway Proxy'] },
  { id: 'team-payments', teamName: 'Payments & Financial Guild', leadName: 'Marcus Vance', ownedReposCount: 18, healthScorePct: 88, busFactorScore: 3.1, criticalServices: ['PaymentService', 'StripeWorker'], techDebtHotspots: ['PaymentService Layer Bypass'] },
  { id: 'team-security', teamName: 'Security & Identity Guild', leadName: 'Elena Rostova', ownedReposCount: 12, healthScorePct: 98, busFactorScore: 4.8, criticalServices: ['VaultSecrets', 'OAuth2Service'], techDebtHotspots: ['Deprecated Token Revocation'] },
  { id: 'team-mobile', teamName: 'Mobile Platform Team', leadName: 'David Chen', ownedReposCount: 14, healthScorePct: 91, busFactorScore: 4.0, criticalServices: ['MobileBFF', 'PushNotificationWorker'], techDebtHotspots: ['Chatty REST Endpoints'] }
];

export const MOCK_ARB_REQUESTS: ArbChangeRequest[] = [
  {
    id: 'arb-1',
    requestId: 'ARB-2026-042',
    title: 'Migrate Billing Receipt Ingestion to Kafka Event Stream',
    requestor: 'Financial Engineering Guild',
    team: 'Payments & Financial Guild',
    date: '2026-04-18',
    status: 'Under Review',
    summary: 'Decouple blocking HTTP Stripe calls into asynchronous Kafka topic to eliminate 504 gateway timeouts.',
    impactScorePct: 94,
    committeeVotes: { approve: 8, reject: 0, abstain: 1 }
  },
  {
    id: 'arb-2',
    requestId: 'ARB-2026-043',
    title: 'Adopt Neo4j 5.0 for Universal Symbol Knowledge Graph',
    requestor: 'Core Platform Team',
    team: 'Core Platform & Gateway',
    date: '2026-04-20',
    status: 'Approved',
    summary: 'Deploy Neo4j 5 Cluster to serve as company-wide software intelligence graph.',
    impactScorePct: 96,
    committeeVotes: { approve: 10, reject: 0, abstain: 0 }
  }
];
