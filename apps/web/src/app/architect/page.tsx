'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

// ─── Shared types ────────────────────────────────────────────────────────────
interface Rec {
                        id: string;
                        category: string;
                        title: string;
                        priority: number;
                        confidence: number;
                        risk: string;
                        estimated_effort: string;
                        expected_impact: string;
                        evidence: string[];
                        reason: string;
                        trade_offs: string[];
                        status: string;
                        affected_modules?: string[];
                        suggested_pattern?: string;
                        effort_hours_estimate?: number;
                        tags?: string[];
                        business_impact_score?: number;
                        technical_impact_score?: number;
                        risk_reduction_score?: number;
                        health_improvement_pct?: number;
                        composite_priority_score?: number;
                        impact_level?: string;
                        effort_level?: string;
                        expected_improvement?: string;
                        alternatives?: string[];
}
interface RecReport {
                        repo_id: string;
                        generated_at: string;
                        recommendations: Rec[];
                        total_recommendations: number;
                        total_by_category: Record<string, number>;
                        total_by_priority: Record<string, number>;
                        top_priority_recommendation: Rec | null;
                        repo_summary: any;
                        engineering_verdict: string;
}
interface PatternAdvisory {
                        id: string;
                        pattern_name: string;
                        pattern_key: string;
                        category: string;
                        icon: string;
                        applicable: boolean;
                        already_present: boolean;
                        confidence: number;
                        priority: number;
                        effort: string;
                        why: string;
                        where: string[];
                        benefits: string[];
                        drawbacks: string[];
                        evidence: string[];
                        implementation_hint: string;
                        related_patterns: string[];
}
interface PatternReport {
                        repo_id: string;
                        generated_at: string;
                        advisories: PatternAdvisory[];
                        total_applicable: number;
                        total_already_present: number;
                        recommended_order: string[];
                        summary: string;
}
interface ScalabilityAdvisory {
                        id: string;
                        recommendation: string;
                        technique: string;
                        category: string;
                        icon: string;
                        severity: string;
                        confidence: number;
                        issue_description: string;
                        evidence: string[];
                        why: string;
                        where: string[];
                        benefits: string[];
                        implementation_steps: string[];
                        estimated_improvement: string;
                        effort: string;
                        tags: string[];
}
interface ScalabilityReport {
                        repo_id: string;
                        generated_at: string;
                        advisories: ScalabilityAdvisory[];
                        total_issues: number;
                        critical_count: number;
                        high_count: number;
                        categories_affected: string[];
                        scalability_verdict: string;
}

// Feature 5 — Refactoring Advisor types
interface ModuleComponent {
                        name: string;
                        responsibility: string;
                        estimated_effort_weeks: number;
                        key_responsibilities: string[];
                        depends_on: string[];
                        color: string;
}
interface MigrationPhase {
                        phase: number;
                        name: string;
                        weeks: string;
                        tasks: string[];
                        can_parallelize: boolean;
                        risk_level: string;
}
interface RefactoringRisk {
                        risk: string;
                        likelihood: string;
                        impact: string;
                        mitigation: string;
}
interface ExpectedImprovement {
                        metric: string;
                        before: string;
                        after: string;
                        improvement: string;
}
interface RefactoringPlan {
                        id: string;
                        source_module: string;
                        source_loc: number;
                        source_complexity: number;
                        source_fan_in: number;
                        source_fan_out: number;
                        rationale: string;
                        split_into: ModuleComponent[];
                        migration_phases: MigrationPhase[];
                        risks: RefactoringRisk[];
                        total_timeline_weeks: number;
                        expected_improvements: ExpectedImprovement[];
                        confidence: number;
                        priority: number;
}
interface RefactoringReport {
                        repo_id: string;
                        generated_at: string;
                        plans: RefactoringPlan[];
                        total_plans: number;
                        total_effort_weeks: number;
                        summary: string;
}

// Feature 6 — Coupling Reduction Advisor types
interface CouplingIssue {
                        id: string;
                        issue_type: string;
                        severity: string;
                        module_name: string;
                        description: string;
                        metrics: Record<string, any>;
                        affected_modules: string[];
                        precise_fix: string;
                        fix_steps: string[];
                        before_state: string;
                        after_state: string;
                        estimated_effort: string;
                        expected_improvement: string;
                        confidence: number;
                        tags?: string[];
}
interface CouplingReport {
                        repo_id: string;
                        generated_at: string;
                        issues: CouplingIssue[];
                        total_issues: number;
                        coupling_health_score: number;
                        by_type: Record<string, number>;
                        verdict: string;
}

// Feature 7 — ADR types
interface ADRProposal {
                        id: string;
                        title: string;
                        decision: string;
                        reason: string;
                        alternatives: string[];
                        result: string;
                        status: string;
                        date: string;
}
interface ADRReport {
                        repo_id: string;
                        generated_at: string;
                        proposals: ADRProposal[];
                        total_proposals: number;
}

// Feature 8 — Review types
interface AIReviewReport {
                        repo_id: string;
                        generated_at: string;
                        strengths: string[];
                        weaknesses: string[];
                        recommendations: string[];
                        overall_summary: string;
}

// Feature 9 — Sprint Recommendations types
interface SprintTask {
                        id: string;
                        priority_level: number;
                        title: string;
                        estimated_days: number;
                        expected_improvement_pct: number;
                        risk: string;
                        rationale: string;
                        target_component: string;
}
interface SprintRecommendation {
                        sprint_name: string;
                        tasks: SprintTask[];
}
interface SprintReport {
                        repo_id: string;
                        generated_at: string;
                        sprints: SprintRecommendation[];
}

// Feature 10 — Multi-level Scopes types
interface ScopeRecommendation {
                        id: string;
                        scope: string;
                        target_name: string;
                        title: string;
                        recommendation: string;
                        impact: string;
                        effort: string;
                        suggested_fix: string;
}
interface MultiLevelReport {
                        repo_id: string;
                        generated_at: string;
                        recommendations: ScopeRecommendation[];
                        total_by_scope: Record<string, number>;
}

// Roadmap Milestone types
interface RoadmapMilestone {
                        id: string;
                        phase: number;
                        title: string;
                        description: string;
                        priority: number;
                        estimated_days: number;
                        dependencies: string[];
                        risk: string;
}
interface RoadmapReport {
                        repo_id: string;
                        generated_at: string;
                        milestones: RoadmapMilestone[];
}

// Feature 11 — Copilot Opportunity types
interface CopilotOpportunity {
                        id: string;
                        title: string;
                        metrics_summary: string;
                        impact: string;
                        effort: string;
                        confidence: number;
}
interface CopilotReport {
                        repo_id: string;
                        health_score: number;
                        generated_at: string;
                        opportunities: CopilotOpportunity[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PATTERNS: PatternReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        total_applicable: 7,
                        total_already_present: 2,
                        recommended_order: [
                                                'Repository Pattern',
                                                'Circuit Breaker',
                                                'Dependency Injection',
                                                'Adapter Pattern',
                                                'Strategy Pattern',
                        ],
                        summary: '7 pattern(s) recommended for adoption. 2 already implemented in the codebase.',
                        advisories: [
                                                {
                                                                        id: 'p1',
                                                                        pattern_name: 'Repository Pattern',
                                                                        pattern_key: 'repository',
                                                                        category: 'Architectural',
                                                                        icon: '🗄️',
                                                                        applicable: true,
                                                                        already_present: false,
                                                                        confidence: 0.94,
                                                                        priority: 1,
                                                                        effort: 'Medium',
                                                                        why: '12 direct API→Database edges bypass the service layer. Applying this pattern creates a clean persistence boundary.',
                                                                        where: [
                                                                                                'api/v1/users.py',
                                                                                                'api/v1/analytics.py',
                                                                                                'api/v1/reports.py',
                                                                        ],
                                                                        benefits: [
                                                                                                'Decouples persistence from business logic',
                                                                                                'Enables in-memory fakes for fast unit tests',
                                                                                                'Makes database technology swappable',
                                                                                                'Centralises query logic',
                                                                        ],
                                                                        drawbacks: [
                                                                                                'Adds abstraction layer (more files)',
                                                                                                'Can become leaky for complex queries',
                                                                                                'Teams need onboarding',
                                                                        ],
                                                                        evidence: [
                                                                                                '12 direct API→Database edges detected bypassing the service layer.',
                                                                                                '`api/v1/users.py` directly queries SQLAlchemy models.',
                                                                        ],
                                                                        implementation_hint: 'Create a `{Entity}Repository` interface with `find_by_id`, `save`, `delete` methods. Inject via constructor.',
                                                                        related_patterns: [
                                                                                                'Dependency Injection',
                                                                                                'Unit of Work',
                                                                                                'CQRS',
                                                                        ],
                                                },
                                                {
                                                                        id: 'p2',
                                                                        pattern_name: 'Circuit Breaker',
                                                                        pattern_key: 'circuit_breaker',
                                                                        category: 'Distributed',
                                                                        icon: '⚡',
                                                                        applicable: true,
                                                                        already_present: false,
                                                                        confidence: 0.88,
                                                                        priority: 1,
                                                                        effort: 'Low',
                                                                        why: '`requests`, `boto3`, and `openai` are used directly — no retry or fallback logic detected.',
                                                                        where: [
                                                                                                'services/openai_client.py',
                                                                                                'services/s3_service.py',
                                                                                                'services/email_service.py',
                                                                        ],
                                                                        benefits: [
                                                                                                'Prevents cascading failures from external outages',
                                                                                                'Fails fast instead of waiting for timeouts',
                                                                                                'Auto-recovers when downstream recovers',
                                                                        ],
                                                                        drawbacks: [
                                                                                                'Requires threshold tuning',
                                                                                                'State management overhead for half-open state',
                                                                        ],
                                                                        evidence: [
                                                                                                '`services/openai_client.py` makes external HTTP calls — no circuit breaker detected.',
                                                                                                '`services/s3_service.py` imports boto3 directly.',
                                                                        ],
                                                                        implementation_hint: 'Wrap all external calls with `pybreaker.CircuitBreaker(fail_max=5, reset_timeout=30)`.',
                                                                        related_patterns: [
                                                                                                'Saga Pattern',
                                                                                                'Retry Pattern',
                                                                                                'Adapter Pattern',
                                                                        ],
                                                },
                        ],
};

const MOCK_SCALABILITY: ScalabilityReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        total_issues: 6,
                        critical_count: 1,
                        high_count: 3,
                        categories_affected: ['Caching', 'Infrastructure', 'Database'],
                        scalability_verdict: '1 critical scalability bottleneck identified. Address before scaling user load.',
                        advisories: [
                                                {
                                                                        id: 's1',
                                                                        recommendation: 'Add Redis Cache',
                                                                        technique: 'caching',
                                                                        category: 'Caching',
                                                                        icon: '⚡',
                                                                        severity: 'Critical',
                                                                        confidence: 0.92,
                                                                        issue_description: '5 high-frequency read hotspots exist with no caching layer. Every call hits the database directly.',
                                                                        evidence: [
                                                                                                'No Redis/cache layer found in the repository graph.',
                                                                                                '`get_repository_graph` — 9 callers, no caching.',
                                                                        ],
                                                                        why: 'High fan-in read nodes are called repeatedly without result caching. Adding Cache-Aside with Redis eliminates redundant DB queries.',
                                                                        where: [
                                                                                                'get_repository_graph',
                                                                        ],
                                                                        benefits: [
                                                                                                '50–70% reduction in database read load',
                                                                                                'Sub-millisecond response for cached results',
                                                                        ],
                                                                        implementation_steps: [
                                                                                                'Install `redis-py` and configure connection pool.',
                                                                                                'Wrap hotspot with: `@cache(ttl=300)`',
                                                                        ],
                                                                        estimated_improvement: '50–70% reduction in read latency',
                                                                        effort: 'Low',
                                                                        tags: ['caching', 'redis'],
                                                },
                        ],
};

const MOCK_RECS: RecReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        total_recommendations: 3,
                        total_by_category: { design_pattern: 1, scalability: 1, refactoring: 1 },
                        total_by_priority: { '1': 2, '2': 1 },
                        engineering_verdict: '2 critical architectural issues require immediate attention. Top: Reduce Circular Dependencies — expected +18% health.',
                        repo_summary: { total_files: 48, compliance_score: 74.2 },
                        top_priority_recommendation: null,
                        recommendations: [
                                                {
                                                                        id: 'r1',
                                                                        category: 'refactoring',
                                                                        title: 'Reduce Circular Dependencies — 3 cycles',
                                                                        priority: 1,
                                                                        confidence: 0.97,
                                                                        risk: 'HIGH',
                                                                        estimated_effort: '9–18 days',
                                                                        expected_impact: 'Eliminate circular imports',
                                                                        evidence: [
                                                                                                '3 cycles: auth_service, analytics_service, parser',
                                                                        ],
                                                                        reason: 'Circular dependencies prevent independent module loading.',
                                                                        trade_offs: [
                                                                                                'Requires mediator extraction',
                                                                        ],
                                                                        status: 'open',
                                                                        effort_hours_estimate: 42,
                                                                        tags: [
                                                                                                'circular-dependency',
                                                                        ],
                                                                        business_impact_score: 75,
                                                                        technical_impact_score: 95,
                                                                        risk_reduction_score: 97,
                                                                        health_improvement_pct: 18,
                                                                        composite_priority_score: 86,
                                                                        impact_level: 'High',
                                                                        effort_level: 'Low',
                                                                        expected_improvement: '+18%',
                                                                        alternatives: [
                                                                                                'Introduce mediator pattern module',
                                                                                                'Lazy dynamic package loading',
                                                                                                'Constructor dependency injecting',
                                                                        ],
                                                },
                                                {
                                                                        id: 'r2',
                                                                        category: 'scalability',
                                                                        title: 'Add Redis Cache to eliminate db read hotspots',
                                                                        priority: 1,
                                                                        confidence: 0.92,
                                                                        risk: 'HIGH',
                                                                        estimated_effort: '1–2 weeks',
                                                                        expected_impact: 'Eliminate DB pressure',
                                                                        evidence: [
                                                                                                'No Redis/cache layer found in the repository graph.',
                                                                        ],
                                                                        reason: 'High read workload is hitting the DB directly without cache.',
                                                                        trade_offs: [
                                                                                                'Need Redis infrastructure cluster',
                                                                        ],
                                                                        status: 'open',
                                                                        effort_hours_estimate: 55,
                                                                        tags: ['caching', 'redis'],
                                                                        business_impact_score: 80,
                                                                        technical_impact_score: 88,
                                                                        risk_reduction_score: 85,
                                                                        health_improvement_pct: 16,
                                                                        composite_priority_score: 82,
                                                                        impact_level: 'High',
                                                                        effort_level: 'Medium',
                                                                        expected_improvement: '+16%',
                                                                        alternatives: [
                                                                                                'Memcached cluster',
                                                                                                'Local In-Memory Cache (LRU)',
                                                                                                'HTTP Gateway caching',
                                                                        ],
                                                },
                                                {
                                                                        id: 'r3',
                                                                        category: 'design_pattern',
                                                                        title: 'Introduce Repository Pattern for users persistence',
                                                                        priority: 2,
                                                                        confidence: 0.88,
                                                                        risk: 'MEDIUM',
                                                                        estimated_effort: '5–10 days',
                                                                        expected_impact: 'Decouple controller persistence',
                                                                        evidence: [
                                                                                                '12 direct API→Database edges detected bypassing the service layer.',
                                                                        ],
                                                                        reason: 'API handlers query models directly without abstraction.',
                                                                        trade_offs: [
                                                                                                'Additional layer code overhead',
                                                                        ],
                                                                        status: 'open',
                                                                        effort_hours_estimate: 32,
                                                                        tags: ['data-access'],
                                                                        business_impact_score: 70,
                                                                        technical_impact_score: 78,
                                                                        risk_reduction_score: 72,
                                                                        health_improvement_pct: 12,
                                                                        composite_priority_score: 72,
                                                                        impact_level: 'Medium',
                                                                        effort_level: 'Low',
                                                                        expected_improvement: '+12%',
                                                                        alternatives: [
                                                                                                'Active Record Pattern',
                                                                                                'Query builder wrapper',
                                                                                                'Mock framework injection',
                                                                        ],
                                                },
                        ],
};
MOCK_RECS.top_priority_recommendation = MOCK_RECS.recommendations[0];

const MOCK_REFACTORING: RefactoringReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        total_plans: 1,
                        total_effort_weeks: 4,
                        summary: '1 module decomposition candidate requiring refactoring.',
                        plans: [
                                                {
                                                                        id: 'ref_1',
                                                                        source_module: 'OrderService',
                                                                        source_loc: 580,
                                                                        source_complexity: 28,
                                                                        source_fan_in: 14,
                                                                        source_fan_out: 11,
                                                                        rationale: 'OrderService is acting as a classic monolithic god component. It orchestrates API routes, writes to the DB directly, charges credit cards via Stripe, queries warehouse inventory, and triggers customer alerts. This high coupling blocks development speed, hampers testing, and prevents independent scaling.',
                                                                        total_timeline_weeks: 4,
                                                                        confidence: 0.95,
                                                                        priority: 1,
                                                                        split_into: [
                                                                                                {
                                                                                                                        name: 'Order API',
                                                                                                                        responsibility: 'Exposes HTTP endpoints, routes requests, validates schemas, and handles serialization.',
                                                                                                                        estimated_effort_weeks: 2,
                                                                                                                        key_responsibilities: [
                                                                                                                                                'REST controller mapping',
                                                                                                                                                'DTO schema validation',
                                                                                                                        ],
                                                                                                                        depends_on: [
                                                                                                                                                'Order Domain',
                                                                                                                        ],
                                                                                                                        color: '#38bdf8',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'Order Domain',
                                                                                                                        responsibility: 'Encapsulates core business rules, order status lifecycle machine, and calculations.',
                                                                                                                        estimated_effort_weeks: 3,
                                                                                                                        key_responsibilities: [
                                                                                                                                                'Order lifecycle validation',
                                                                                                                                                'Tax and total calculations',
                                                                                                                        ],
                                                                                                                        depends_on: [],
                                                                                                                        color: '#a78bfa',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'Payment',
                                                                                                                        responsibility: 'Integrates with external payment gateways (Stripe/PayPal) and processes transactional states.',
                                                                                                                        estimated_effort_weeks: 2,
                                                                                                                        key_responsibilities: [
                                                                                                                                                'Stripe wrapper logic',
                                                                                                                                                'Refund API interactions',
                                                                                                                        ],
                                                                                                                        depends_on: [],
                                                                                                                        color: '#f87171',
                                                                                                },
                                                                        ],
                                                                        migration_phases: [
                                                                                                {
                                                                                                                        phase: 1,
                                                                                                                        name: 'Extract API Layer',
                                                                                                                        weeks: '1–2',
                                                                                                                        tasks: [
                                                                                                                                                'Isolate HTTP handlers/controllers from business logic in OrderService.',
                                                                                                                                                'Define clean request/response schemas (DTOs) for endpoints.',
                                                                                                                        ],
                                                                                                                        can_parallelize: false,
                                                                                                                        risk_level: 'Low',
                                                                                                },
                                                                                                {
                                                                                                                        phase: 2,
                                                                                                                        name: 'Decouple Domain Logic',
                                                                                                                        weeks: '2–3',
                                                                                                                        tasks: [
                                                                                                                                                'Move order state transitions and price calculations into a pure Order Domain module.',
                                                                                                                                                'Remove direct database infrastructure imports.',
                                                                                                                        ],
                                                                                                                        can_parallelize: true,
                                                                                                                        risk_level: 'Medium',
                                                                                                },
                                                                        ],
                                                                        risks: [
                                                                                                {
                                                                                                                        risk: 'Database transactional integrity loss across separated modules.',
                                                                                                                        likelihood: 'Medium',
                                                                                                                        impact: 'High',
                                                                                                                        mitigation: 'Use outbox publishing pattern or transactional compensation logic (Saga).',
                                                                                                },
                                                                        ],
                                                                        expected_improvements: [
                                                                                                {
                                                                                                                        metric: 'Max Cyclomatic Complexity',
                                                                                                                        before: '28',
                                                                                                                        after: '8',
                                                                                                                        improvement: '-71%',
                                                                                                },
                                                                                                {
                                                                                                                        metric: 'Afferent Coupling (Incoming)',
                                                                                                                        before: '14',
                                                                                                                        after: '2',
                                                                                                                        improvement: '-85%',
                                                                                                },
                                                                        ],
                                                },
                        ],
};

const MOCK_COUPLING: CouplingReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        total_issues: 2,
                        coupling_health_score: 75.0,
                        verdict: 'Critical coupling issues detected: 1 cyclic dependency and 1 God Object are impeding scalability and test isolation.',
                        by_type: {
                                                cyclic_dependency: 1,
                                                god_object: 1,
                                                high_coupling: 0,
                                                large_module: 0,
                        },
                        issues: [
                                                {
                                                                        id: 'cpl_1',
                                                                        issue_type: 'cyclic_dependency',
                                                                        severity: 'Critical',
                                                                        module_name: 'auth_service',
                                                                        description: 'Circular dependency loop detected: auth_service -> user_service -> notification_service -> auth_service',
                                                                        metrics: {
                                                                                                cycle_length: 3,
                                                                                                total_repo_cycles: 1,
                                                                        },
                                                                        affected_modules: [
                                                                                                'auth_service',
                                                                                                'user_service',
                                                                                                'notification_service',
                                                                        ],
                                                                        precise_fix: 'Introduce an interface abstraction or extract shared models from auth_service and its partners to break the loop.',
                                                                        fix_steps: [
                                                                                                'Analyze imports in auth_service and locate where it references the cycle partners.',
                                                                                                'Extract the shared data models or core calculations into a separate shared helper module.',
                                                                                                'Update the cycle partners to import from the new shared module, completely resolving direct circular references.',
                                                                        ],
                                                                        before_state: 'Modules directly import each other, blocking modular isolation and unit test scoping.',
                                                                        after_state: 'Clean unidirectional imports targeting a third shared component.',
                                                                        estimated_effort: '3–5 days',
                                                                        expected_improvement: 'Resolves circular dependency loop involving 3 modules.',
                                                                        confidence: 0.98,
                                                                        tags: [
                                                                                                'cyclic-dependency',
                                                                                                'coupling',
                                                                        ],
                                                },
                        ],
};

const MOCK_ADR: ADRReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        total_proposals: 2,
                        proposals: [
                                                {
                                                                        id: 'ADR-021',
                                                                        title: 'ADR-021: Choose Redis Cache for High-Frequency Read Operations',
                                                                        decision: 'Introduce Redis Cache',
                                                                        reason: 'The relational database is experiencing read query pressure and bottlenecks on critical endpoints.',
                                                                        alternatives: [
                                                                                                'Memcached',
                                                                                                'Local In-Memory Cache (in-process)',
                                                                        ],
                                                                        result: 'Improved API response latency (sub-millisecond) and significantly reduced load on Postgres DB pools.',
                                                                        status: 'Proposed',
                                                                        date: new Date()
                                                                                                .toISOString()
                                                                                                .split(
                                                                                                                        'T'
                                                                                                )[0],
                                                },
                                                {
                                                                        id: 'ADR-022',
                                                                        title: 'ADR-022: Introduce Repository Pattern to Decouple Persistence',
                                                                        decision: 'Introduce Repository Pattern',
                                                                        reason: 'HTTP Controllers and handlers are executing direct SQL queries, causing tight coupling with database schemas.',
                                                                        alternatives: [
                                                                                                'Active Record Pattern',
                                                                                                'Direct SQL execution within services',
                                                                        ],
                                                                        result: 'Persistence details are isolated behind standard Repository abstractions.',
                                                                        status: 'Proposed',
                                                                        date: new Date()
                                                                                                .toISOString()
                                                                                                .split(
                                                                                                                        'T'
                                                                                                )[0],
                                                },
                        ],
};

const MOCK_REVIEW: AIReviewReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        strengths: [
                                                'Good modularity with clear layered architecture boundaries (API, Services, and Models separation)',
                                                'Strong testing structure with dedicated test coverage suites',
                        ],
                        weaknesses: [
                                                'High coupling index across domain boundaries',
                                                'Payment service complexity acting as a monolithic hotspot',
                        ],
                        recommendations: [
                                                'Split Payment Service into decoupled API and Domain modules',
                                                'Introduce Event Bus / Mediator Pattern to decouple direct service invokes',
                        ],
                        overall_summary: 'The repository exhibits a structured layered design, but suffers from high coupling around payment handling and DB queries.',
};

const MOCK_SPRINT: SprintReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        sprints: [
                                                {
                                                                        sprint_name: 'Sprint 14',
                                                                        tasks: [
                                                                                                {
                                                                                                                        id: 'tsk_s14_1',
                                                                                                                        priority_level: 1,
                                                                                                                        title: 'Authentication Refactor',
                                                                                                                        estimated_days: 5,
                                                                                                                        expected_improvement_pct: 18,
                                                                                                                        risk: 'Low',
                                                                                                                        rationale: 'Decouples direct imports between auth_service and user notifier modules.',
                                                                                                                        target_component: 'auth_service',
                                                                                                },
                                                                                                {
                                                                                                                        id: 'tsk_s14_2',
                                                                                                                        priority_level: 2,
                                                                                                                        title: 'Add Redis Caching layer for endpoints',
                                                                                                                        estimated_days: 3,
                                                                                                                        expected_improvement_pct: 12,
                                                                                                                        risk: 'Low',
                                                                                                                        rationale: 'Deploy Redis configuration to cache SQL reads.',
                                                                                                                        target_component: 'api/v1/payments',
                                                                                                },
                                                                        ],
                                                },
                        ],
};

const MOCK_MULTILEVEL: MultiLevelReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        total_by_scope: {
                                                Function: 1,
                                                Class: 1,
                                                Module: 1,
                                                Service: 1,
                                                Repository: 1,
                                                Enterprise: 1,
                        },
                        recommendations: [
                                                {
                                                                        id: 'scope_func_1',
                                                                        scope: 'Function',
                                                                        target_name: 'calculate_totals',
                                                                        title: 'Extract Sub-calculations to Helper Functions',
                                                                        recommendation: "The function 'calculate_totals' contains duplicate math rules.",
                                                                        impact: 'Low',
                                                                        effort: 'Low',
                                                                        suggested_fix: "Break the calculations in 'calculate_totals' into pure helpers.",
                                                },
                        ],
};

const MOCK_ROADMAP: RoadmapReport = {
                        repo_id: 'demo',
                        generated_at: new Date().toISOString(),
                        milestones: [
                                                {
                                                                        id: 'ms_r1',
                                                                        phase: 1,
                                                                        title: 'Decouple Circular Import Dependencies',
                                                                        description: 'Introduce shared interfaces to cut circular references in auth_service and notification modules.',
                                                                        priority: 1,
                                                                        estimated_days: 5,
                                                                        dependencies: [],
                                                                        risk: 'Low',
                                                },
                                                {
                                                                        id: 'ms_r2',
                                                                        phase: 2,
                                                                        title: 'Introduce Repository Pattern Persistence',
                                                                        description: 'Create a clean repository interface abstraction and replace direct SQL edges.',
                                                                        priority: 2,
                                                                        estimated_days: 10,
                                                                        dependencies: ['ms_r1'],
                                                                        risk: 'Medium',
                                                },
                                                {
                                                                        id: 'ms_r3',
                                                                        phase: 3,
                                                                        title: 'Configure Redis Cache-Aside layer',
                                                                        description: 'Implement Redis connection caching and wrap high-fanin database read nodes.',
                                                                        priority: 3,
                                                                        estimated_days: 3,
                                                                        dependencies: ['ms_r2'],
                                                                        risk: 'Low',
                                                },
                        ],
};

const MOCK_COPILOT: CopilotReport = {
                        repo_id: 'demo',
                        health_score: 86.0,
                        generated_at: new Date().toISOString(),
                        opportunities: [
                                                {
                                                                        id: 'opp_1',
                                                                        title: 'Split Payment Service',
                                                                        metrics_summary: 'Eradicates mixed concern handling of endpoints vs database persistence.',
                                                                        impact: 'High',
                                                                        effort: 'Medium',
                                                                        confidence: 0.94,
                                                },
                                                {
                                                                        id: 'opp_2',
                                                                        title: 'Add Redis caching to Authentication',
                                                                        metrics_summary: 'Estimated latency reduction: 38%',
                                                                        impact: 'High',
                                                                        effort: 'Low',
                                                                        confidence: 0.92,
                                                },
                                                {
                                                                        id: 'opp_3',
                                                                        title: 'Replace synchronous notifications with an event bus',
                                                                        metrics_summary: 'Expected resilience improvement: High',
                                                                        impact: 'High',
                                                                        effort: 'Medium',
                                                                        confidence: 0.88,
                                                },
                                                {
                                                                        id: 'opp_4',
                                                                        title: 'Refactor UserService to reduce coupling',
                                                                        metrics_summary: 'Maintainability improvement: +19%',
                                                                        impact: 'Medium',
                                                                        effort: 'Medium',
                                                                        confidence: 0.85,
                                                },
                                                {
                                                                        id: 'opp_5',
                                                                        title: 'Introduce read replicas for reporting queries',
                                                                        metrics_summary: 'Estimated database load reduction: 42%',
                                                                        impact: 'High',
                                                                        effort: 'High',
                                                                        confidence: 0.8,
                                                },
                        ],
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const PRI: Record<number, { label: string; color: string; bg: string; glow: string }> = {
                        1: {
                                                label: 'CRITICAL',
                                                color: '#f87171',
                                                bg: 'rgba(248,113,113,0.1)',
                                                glow: '0 0 14px rgba(248,113,113,0.3)',
                        },
                        2: {
                                                label: 'HIGH',
                                                color: '#fb923c',
                                                bg: 'rgba(251,146,60,0.1)',
                                                glow: '0 0 14px rgba(251,146,60,0.25)',
                        },
                        3: {
                                                label: 'MEDIUM',
                                                color: '#fbbf24',
                                                bg: 'rgba(251,191,36,0.1)',
                                                glow: '0 0 14px rgba(251,191,36,0.2)',
                        },
                        4: {
                                                label: 'LOW',
                                                color: '#4ade80',
                                                bg: 'rgba(74,222,128,0.1)',
                                                glow: '0 0 14px rgba(74,222,128,0.2)',
                        },
                        5: {
                                                label: 'INFO',
                                                color: '#60a5fa',
                                                bg: 'rgba(96,165,250,0.1)',
                                                glow: '0 0 14px rgba(96,165,250,0.2)',
                        },
};
const SEV_C: Record<string, string> = {
                        Critical: '#f87171',
                        High: '#fb923c',
                        Medium: '#fbbf24',
                        Low: '#4ade80',
};
const CAT_C: Record<string, string> = {
                        design_pattern: '#a78bfa',
                        scalability: '#38bdf8',
                        refactoring: '#fb923c',
};
const EFFORT_C: Record<string, string> = { Low: '#4ade80', Medium: '#fbbf24', High: '#f87171' };
const CAT_META: Record<string, { label: string; color: string; icon: string }> = {
                        Architectural: { label: 'Architectural', color: '#a78bfa', icon: '◈' },
                        Structural: { label: 'Structural', color: '#38bdf8', icon: '⬡' },
                        Behavioral: { label: 'Behavioral', color: '#4ade80', icon: '⟳' },
                        Creational: { label: 'Creational', color: '#fb923c', icon: '●' },
                        Distributed: { label: 'Distributed', color: '#f87171', icon: '⛓' },
};

function rel(iso: string) {
                        const d = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
                        if (d < 1) return 'just now';
                        if (d < 60) return `${d}m ago`;
                        if (d < 1440) return `${Math.floor(d / 60)}h ago`;
                        return `${Math.floor(d / 1440)}d ago`;
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span
                                                                        style={{
                                                                                                width: 110,
                                                                                                fontSize: 10,
                                                                                                color: 'rgba(255,255,255,0.4)',
                                                                                                flexShrink: 0,
                                                                        }}
                                                >
                                                                        {label}
                                                </span>
                                                <div
                                                                        style={{
                                                                                                flex: 1,
                                                                                                height: 5,
                                                                                                borderRadius: 3,
                                                                                                background: 'rgba(255,255,255,0.06)',
                                                                                                overflow: 'hidden',
                                                                        }}
                                                >
                                                                        <div
                                                                                                style={{
                                                                                                                        width: `${value}%`,
                                                                                                                        height: '100%',
                                                                                                                        background: `linear-gradient(90deg,${color}88,${color})`,
                                                                                                                        borderRadius: 3,
                                                                                                                        transition: 'width 0.8s ease',
                                                                                                }}
                                                                        />
                                                </div>
                                                <span
                                                                        style={{
                                                                                                width: 28,
                                                                                                fontSize: 10,
                                                                                                fontWeight: 700,
                                                                                                color,
                                                                                                textAlign: 'right',
                                                                                                fontFamily: "'Fira Code',monospace",
                                                                        }}
                                                >
                                                                        {Math.round(value)}
                                                </span>
                        </div>
);

const Chip = ({ label, color, bg }: { label: string; color: string; bg?: string }) => (
                        <span
                                                style={{
                                                                        padding: '2px 9px',
                                                                        borderRadius: 20,
                                                                        fontSize: 10,
                                                                        fontWeight: 700,
                                                                        color,
                                                                        background:
                                                                                                bg ||
                                                                                                `${color}15`,
                                                                        border: `1px solid ${color}28`,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.06em',
                                                }}
                        >
                                                {label}
                        </span>
);

// ─── Component: Priority Matrix 2D (Feature 12) ──────────────────────────────
interface PriorityMatrixProps {
                        recommendations: Rec[];
                        onSelectRec: (id: string) => void;
                        selectedId: string | null;
}
function PriorityMatrix({ recommendations, onSelectRec, selectedId }: PriorityMatrixProps) {
                        return (
                                                <div
                                                                        style={{
                                                                                                padding: 20,
                                                                                                borderRadius: 16,
                                                                                                border: '1px solid rgba(255,255,255,0.06)',
                                                                                                background: 'rgba(255,255,255,0.02)',
                                                                                                marginBottom: 24,
                                                                        }}
                                                >
                                                                        <h3
                                                                                                style={{
                                                                                                                        margin: '0 0 14px',
                                                                                                                        fontSize: 13,
                                                                                                                        fontWeight: 800,
                                                                                                                        color: '#38bdf8',
                                                                                                                        textTransform: 'uppercase',
                                                                                                                        letterSpacing: '0.06em',
                                                                                                }}
                                                                        >
                                                                                                Priority
                                                                                                Matrix
                                                                                                (Impact
                                                                                                vs
                                                                                                Effort)
                                                                        </h3>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'grid',
                                                                                                                        gridTemplateColumns: '1fr 1fr',
                                                                                                                        gridTemplateRows: '160px 160px',
                                                                                                                        gap: 12,
                                                                                                                        position: 'relative',
                                                                                                }}
                                                                        >
                                                                                                {/* Q1: Quick Wins */}
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                background: 'rgba(74,222,128,0.03)',
                                                                                                                                                border: '1px dashed rgba(74,222,128,0.2)',
                                                                                                                                                borderRadius: 8,
                                                                                                                                                padding: 10,
                                                                                                                                                position: 'relative',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 9,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#4ade80',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Quick
                                                                                                                                                Wins
                                                                                                                                                (High
                                                                                                                                                Impact,
                                                                                                                                                Low
                                                                                                                                                Effort)
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                        gap: 4,
                                                                                                                                                                        marginTop: 8,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {recommendations
                                                                                                                                                                        .filter(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        r
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        r.impact_level ===
                                                                                                                                                                                                                                                'High' &&
                                                                                                                                                                                                                        r.effort_level ===
                                                                                                                                                                                                                                                'Low'
                                                                                                                                                                        )
                                                                                                                                                                        .map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        r
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        r.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        onSelectRec(
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        padding: '4px 8px',
                                                                                                                                                                                                                                                                        borderRadius: 5,
                                                                                                                                                                                                                                                                        background:
                                                                                                                                                                                                                                                                                                selectedId ===
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                                                                        ? '#4ade80'
                                                                                                                                                                                                                                                                                                                        : 'rgba(255,255,255,0.05)',
                                                                                                                                                                                                                                                                        border: `1px solid ${selectedId === r.id ? '#4ade80' : 'rgba(255,255,255,0.1)'}`,
                                                                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                                                                        color:
                                                                                                                                                                                                                                                                                                selectedId ===
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                                                                        ? '#000'
                                                                                                                                                                                                                                                                                                                        : '#fff',
                                                                                                                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                                                                                                                        fontWeight: 600,
                                                                                                                                                                                                                                                                        whiteSpace: 'nowrap',
                                                                                                                                                                                                                                                                        overflow: 'hidden',
                                                                                                                                                                                                                                                                        textOverflow: 'ellipsis',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        r.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Q2: Strategic Goals */}
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                background: 'rgba(167,139,250,0.03)',
                                                                                                                                                border: '1px dashed rgba(167,139,250,0.2)',
                                                                                                                                                borderRadius: 8,
                                                                                                                                                padding: 10,
                                                                                                                                                position: 'relative',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 9,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Strategic
                                                                                                                                                Goals
                                                                                                                                                (High
                                                                                                                                                Impact,
                                                                                                                                                High
                                                                                                                                                Effort)
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                        gap: 4,
                                                                                                                                                                        marginTop: 8,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {recommendations
                                                                                                                                                                        .filter(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        r
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        r.impact_level ===
                                                                                                                                                                                                                                                'High' &&
                                                                                                                                                                                                                        r.effort_level ===
                                                                                                                                                                                                                                                'High'
                                                                                                                                                                        )
                                                                                                                                                                        .map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        r
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        r.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        onSelectRec(
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        padding: '4px 8px',
                                                                                                                                                                                                                                                                        borderRadius: 5,
                                                                                                                                                                                                                                                                        background:
                                                                                                                                                                                                                                                                                                selectedId ===
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                                                                        ? '#a78bfa'
                                                                                                                                                                                                                                                                                                                        : 'rgba(255,255,255,0.05)',
                                                                                                                                                                                                                                                                        border: `1px solid ${selectedId === r.id ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`,
                                                                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                                                                        color:
                                                                                                                                                                                                                                                                                                selectedId ===
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                                                                        ? '#000'
                                                                                                                                                                                                                                                                                                                        : '#fff',
                                                                                                                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                                                                                                                        fontWeight: 600,
                                                                                                                                                                                                                                                                        whiteSpace: 'nowrap',
                                                                                                                                                                                                                                                                        overflow: 'hidden',
                                                                                                                                                                                                                                                                        textOverflow: 'ellipsis',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        r.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Q3: Heuristic Wins */}
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                background: 'rgba(96,165,250,0.03)',
                                                                                                                                                border: '1px dashed rgba(96,165,250,0.2)',
                                                                                                                                                borderRadius: 8,
                                                                                                                                                padding: 10,
                                                                                                                                                position: 'relative',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 9,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#60a5fa',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Fill-ins
                                                                                                                                                (Low
                                                                                                                                                Impact,
                                                                                                                                                Low
                                                                                                                                                Effort)
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                        gap: 4,
                                                                                                                                                                        marginTop: 8,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {recommendations
                                                                                                                                                                        .filter(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        r
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        r.impact_level !==
                                                                                                                                                                                                                                                'High' &&
                                                                                                                                                                                                                        r.effort_level ===
                                                                                                                                                                                                                                                'Low'
                                                                                                                                                                        )
                                                                                                                                                                        .map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        r
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        r.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        onSelectRec(
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        padding: '4px 8px',
                                                                                                                                                                                                                                                                        borderRadius: 5,
                                                                                                                                                                                                                                                                        background:
                                                                                                                                                                                                                                                                                                selectedId ===
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                                                                        ? '#60a5fa'
                                                                                                                                                                                                                                                                                                                        : 'rgba(255,255,255,0.05)',
                                                                                                                                                                                                                                                                        border: `1px solid ${selectedId === r.id ? '#60a5fa' : 'rgba(255,255,255,0.1)'}`,
                                                                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                                                                        color:
                                                                                                                                                                                                                                                                                                selectedId ===
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                                                                        ? '#000'
                                                                                                                                                                                                                                                                                                                        : '#fff',
                                                                                                                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                                                                                                                        fontWeight: 600,
                                                                                                                                                                                                                                                                        whiteSpace: 'nowrap',
                                                                                                                                                                                                                                                                        overflow: 'hidden',
                                                                                                                                                                                                                                                                        textOverflow: 'ellipsis',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        r.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Q4: Strategic Overhead */}
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                background: 'rgba(251,146,60,0.03)',
                                                                                                                                                border: '1px dashed rgba(251,146,60,0.2)',
                                                                                                                                                borderRadius: 8,
                                                                                                                                                padding: 10,
                                                                                                                                                position: 'relative',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 9,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#fb923c',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Thankless
                                                                                                                                                Tasks
                                                                                                                                                (Low
                                                                                                                                                Impact,
                                                                                                                                                High
                                                                                                                                                Effort)
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                        gap: 4,
                                                                                                                                                                        marginTop: 8,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {recommendations
                                                                                                                                                                        .filter(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        r
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        r.impact_level !==
                                                                                                                                                                                                                                                'High' &&
                                                                                                                                                                                                                        r.effort_level ===
                                                                                                                                                                                                                                                'High'
                                                                                                                                                                        )
                                                                                                                                                                        .map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        r
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        r.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        onSelectRec(
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        padding: '4px 8px',
                                                                                                                                                                                                                                                                        borderRadius: 5,
                                                                                                                                                                                                                                                                        background:
                                                                                                                                                                                                                                                                                                selectedId ===
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                                                                        ? '#fb923c'
                                                                                                                                                                                                                                                                                                                        : 'rgba(255,255,255,0.05)',
                                                                                                                                                                                                                                                                        border: `1px solid ${selectedId === r.id ? '#fb923c' : 'rgba(255,255,255,0.1)'}`,
                                                                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                                                                        color:
                                                                                                                                                                                                                                                                                                selectedId ===
                                                                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                                                                                                                        ? '#000'
                                                                                                                                                                                                                                                                                                                        : '#fff',
                                                                                                                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                                                                                                                        fontWeight: 600,
                                                                                                                                                                                                                                                                        whiteSpace: 'nowrap',
                                                                                                                                                                                                                                                                        overflow: 'hidden',
                                                                                                                                                                                                                                                                        textOverflow: 'ellipsis',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        r.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}

// ─── Component: Interactive Roadmap (Feature 12) ────────────────────────────
function ArchitectureRoadmap({ roadmap }: { roadmap: RoadmapReport }) {
                        return (
                                                <div
                                                                        style={{
                                                                                                padding: 20,
                                                                                                borderRadius: 16,
                                                                                                border: '1px solid rgba(255,255,255,0.06)',
                                                                                                background: 'rgba(255,255,255,0.02)',
                                                                                                marginBottom: 24,
                                                                        }}
                                                >
                                                                        <h3
                                                                                                style={{
                                                                                                                        margin: '0 0 16px',
                                                                                                                        fontSize: 13,
                                                                                                                        fontWeight: 800,
                                                                                                                        color: '#38bdf8',
                                                                                                                        textTransform: 'uppercase',
                                                                                                                        letterSpacing: '0.06em',
                                                                                                }}
                                                                        >
                                                                                                Architecture
                                                                                                Improvement
                                                                                                Roadmap
                                                                        </h3>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        flexDirection: 'column',
                                                                                                                        gap: 18,
                                                                                                                        position: 'relative',
                                                                                                }}
                                                                        >
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                position: 'absolute',
                                                                                                                                                left: 20,
                                                                                                                                                top: 10,
                                                                                                                                                bottom: 10,
                                                                                                                                                width: 2,
                                                                                                                                                background: 'rgba(255,255,255,0.07)',
                                                                                                                        }}
                                                                                                />

                                                                                                {roadmap.milestones.map(
                                                                                                                        (
                                                                                                                                                ms,
                                                                                                                                                index
                                                                                                                        ) => (
                                                                                                                                                <div
                                                                                                                                                                        key={
                                                                                                                                                                                                ms.id
                                                                                                                                                                        }
                                                                                                                                                                        style={{
                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                gap: 16,
                                                                                                                                                                                                position: 'relative',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        width: 42,
                                                                                                                                                                                                                        height: 42,
                                                                                                                                                                                                                        borderRadius: '50%',
                                                                                                                                                                                                                        background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                                                                                                                                                                                                        border: '2px solid rgba(255,255,255,0.2)',
                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                                                                        justifyContent: 'center',
                                                                                                                                                                                                                        fontSize: 14,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color: '#fff',
                                                                                                                                                                                                                        zIndex: 2,
                                                                                                                                                                                                                        flexShrink: 0,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ms.phase
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        flex: 1,
                                                                                                                                                                                                                        padding: 14,
                                                                                                                                                                                                                        borderRadius: 12,
                                                                                                                                                                                                                        background: 'rgba(255,255,255,0.02)',
                                                                                                                                                                                                                        border: '1px solid rgba(255,255,255,0.06)',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                justifyContent: 'space-between',
                                                                                                                                                                                                                                                alignItems: 'center',
                                                                                                                                                                                                                                                flexWrap: 'wrap',
                                                                                                                                                                                                                                                gap: 8,
                                                                                                                                                                                                                                                marginBottom: 6,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <h4
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                                                                        fontSize: 13,
                                                                                                                                                                                                                                                                        fontWeight: 750,
                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.92)',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        ms.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                                                                        gap: 6,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <Chip
                                                                                                                                                                                                                                                                        label={
                                                                                                                                                                                                                                                                                                ms.risk +
                                                                                                                                                                                                                                                                                                ' RISK'
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        color={
                                                                                                                                                                                                                                                                                                SEV_C[
                                                                                                                                                                                                                                                                                                                        ms
                                                                                                                                                                                                                                                                                                                                                .risk
                                                                                                                                                                                                                                                                                                ] ||
                                                                                                                                                                                                                                                                                                '#888'
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                fontSize: 10,
                                                                                                                                                                                                                                                                                                fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.4)',
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                ms.estimated_days
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        Days
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                margin: '0 0 8px',
                                                                                                                                                                                                                                                fontSize: 11.5,
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.52)',
                                                                                                                                                                                                                                                lineHeight: 1.5,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ms.description
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                                                {ms
                                                                                                                                                                                                                        .dependencies
                                                                                                                                                                                                                        .length >
                                                                                                                                                                                                                        0 && (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.3)',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                Depends
                                                                                                                                                                                                                                                on:{' '}
                                                                                                                                                                                                                                                <strong
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                color: '#a78bfa',
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {ms.dependencies.join(
                                                                                                                                                                                                                                                                                                ', '
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                </strong>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

// ─── Component: Before / After Architecture Diagrams ──────────────────────────
function ArchitectureDiagrams() {
                        const [view, setView] = useState<'before' | 'after'>('before');
                        return (
                                                <div
                                                                        style={{
                                                                                                padding: 20,
                                                                                                borderRadius: 16,
                                                                                                border: '1px solid rgba(255,255,255,0.06)',
                                                                                                background: 'rgba(255,255,255,0.02)',
                                                                                                marginBottom: 24,
                                                                        }}
                                                >
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        justifyContent: 'space-between',
                                                                                                                        alignItems: 'center',
                                                                                                                        marginBottom: 16,
                                                                                                }}
                                                                        >
                                                                                                <h3
                                                                                                                        style={{
                                                                                                                                                margin: 0,
                                                                                                                                                fontSize: 13,
                                                                                                                                                fontWeight: 800,
                                                                                                                                                color: '#38bdf8',
                                                                                                                                                textTransform: 'uppercase',
                                                                                                                                                letterSpacing: '0.06em',
                                                                                                                        }}
                                                                                                >
                                                                                                                        Before
                                                                                                                        vs
                                                                                                                        After
                                                                                                                        Split
                                                                                                                        Diagram
                                                                                                </h3>
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                display: 'flex',
                                                                                                                                                gap: 4,
                                                                                                                                                background: 'rgba(255,255,255,0.03)',
                                                                                                                                                borderRadius: 8,
                                                                                                                                                padding: 4,
                                                                                                                                                border: '1px solid rgba(255,255,255,0.06)',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setView(
                                                                                                                                                                                                'before'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                style={{
                                                                                                                                                                        padding: '5px 12px',
                                                                                                                                                                        borderRadius: 6,
                                                                                                                                                                        border: 'none',
                                                                                                                                                                        background:
                                                                                                                                                                                                view ===
                                                                                                                                                                                                'before'
                                                                                                                                                                                                                        ? 'rgba(248,113,113,0.15)'
                                                                                                                                                                                                                        : 'transparent',
                                                                                                                                                                        color:
                                                                                                                                                                                                view ===
                                                                                                                                                                                                'before'
                                                                                                                                                                                                                        ? '#f87171'
                                                                                                                                                                                                                        : 'rgba(255,255,255,0.4)',
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 700,
                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Monolith
                                                                                                                                                Before
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setView(
                                                                                                                                                                                                'after'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                style={{
                                                                                                                                                                        padding: '5px 12px',
                                                                                                                                                                        borderRadius: 6,
                                                                                                                                                                        border: 'none',
                                                                                                                                                                        background:
                                                                                                                                                                                                view ===
                                                                                                                                                                                                'after'
                                                                                                                                                                                                                        ? 'rgba(74,222,128,0.15)'
                                                                                                                                                                                                                        : 'transparent',
                                                                                                                                                                        color:
                                                                                                                                                                                                view ===
                                                                                                                                                                                                'after'
                                                                                                                                                                                                                        ? '#4ade80'
                                                                                                                                                                                                                        : 'rgba(255,255,255,0.4)',
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 700,
                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Decoupled
                                                                                                                                                After
                                                                                                                        </button>
                                                                                                </div>
                                                                        </div>

                                                                        {view === 'before' ? (
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                padding: 20,
                                                                                                                                                borderRadius: 12,
                                                                                                                                                background: 'rgba(248,113,113,0.02)',
                                                                                                                                                border: '1px solid rgba(248,113,113,0.1)',
                                                                                                                                                display: 'flex',
                                                                                                                                                flexDirection: 'column',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                gap: 16,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        padding: '10px 20px',
                                                                                                                                                                        borderRadius: 8,
                                                                                                                                                                        background: '#f87171',
                                                                                                                                                                        color: '#000',
                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                OrderService
                                                                                                                                                Monolith
                                                                                                                                                (580
                                                                                                                                                LOC)
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'grid',
                                                                                                                                                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                                                                                                                                                        gap: 10,
                                                                                                                                                                        width: '100%',
                                                                                                                                                                        textAlign: 'center',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {[
                                                                                                                                                                        'Direct SQL edge',
                                                                                                                                                                        'Stripe Import',
                                                                                                                                                                        'Twilio Wrapper',
                                                                                                                                                                        'Warehouse query',
                                                                                                                                                ].map(
                                                                                                                                                                        (
                                                                                                                                                                                                lbl
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                lbl
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                padding: 8,
                                                                                                                                                                                                                                                borderRadius: 6,
                                                                                                                                                                                                                                                background: 'rgba(255,255,255,0.04)',
                                                                                                                                                                                                                                                border: '1px solid rgba(255,255,255,0.1)',
                                                                                                                                                                                                                                                fontSize: 10,
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.6)',
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                lbl
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        color: '#f87171',
                                                                                                                                                                        fontWeight: 700,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                ⚠️
                                                                                                                                                Direct
                                                                                                                                                relational
                                                                                                                                                coupling
                                                                                                                                                blocks
                                                                                                                                                unit
                                                                                                                                                test
                                                                                                                                                mocking
                                                                                                                                                and
                                                                                                                                                scaling.
                                                                                                                        </div>
                                                                                                </div>
                                                                        ) : (
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                padding: 20,
                                                                                                                                                borderRadius: 12,
                                                                                                                                                background: 'rgba(74,222,128,0.02)',
                                                                                                                                                border: '1px solid rgba(74,222,128,0.1)',
                                                                                                                                                display: 'flex',
                                                                                                                                                flexDirection: 'column',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                gap: 16,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        padding: '8px 16px',
                                                                                                                                                                        borderRadius: 8,
                                                                                                                                                                        background: '#4ade80',
                                                                                                                                                                        color: '#000',
                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Order
                                                                                                                                                API
                                                                                                                                                Controller
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        gap: 16,
                                                                                                                                                                        justifyContent: 'space-around',
                                                                                                                                                                        width: '100%',
                                                                                                                                                                        flexWrap: 'wrap',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {[
                                                                                                                                                                        'Order Domain Logic',
                                                                                                                                                                        'Payment Gateway (Stripe)',
                                                                                                                                                                        'Notification broker',
                                                                                                                                                                        'Inventory handler',
                                                                                                                                                ].map(
                                                                                                                                                                        (
                                                                                                                                                                                                lbl
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                lbl
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                padding: '10px 14px',
                                                                                                                                                                                                                                                borderRadius: 8,
                                                                                                                                                                                                                                                background: 'rgba(74,222,128,0.06)',
                                                                                                                                                                                                                                                border: '1px solid rgba(74,222,128,0.2)',
                                                                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                                                                color: '#4ade80',
                                                                                                                                                                                                                                                fontWeight: 700,
                                                                                                                                                                                                                                                textAlign: 'center',
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                lbl
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        color: '#4ade80',
                                                                                                                                                                        fontWeight: 700,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                ✓
                                                                                                                                                85%
                                                                                                                                                afferent
                                                                                                                                                coupling
                                                                                                                                                reduction.
                                                                                                                                                Mockable
                                                                                                                                                adapters
                                                                                                                                                enabled
                                                                                                                                                for
                                                                                                                                                test
                                                                                                                                                suites.
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}

// ─── Tab: Recommendations ─────────────────────────────────────────────────────
function RecCard({
                        rec,
                        rank,
                        selectedId,
                        onSelectRec,
}: {
                        rec: Rec;
                        rank: number;
                        selectedId: string | null;
                        onSelectRec: (id: string) => void;
}) {
                        const [open, setOpen] = useState(selectedId === rec.id || rank === 0);
                        const [status, setStatus] = useState(rec.status);
                        const p = PRI[rec.priority] || PRI[5];
                        const cat = CAT_C[rec.category] || '#888';

                        useEffect(() => {
                                                if (selectedId === rec.id) setOpen(true);
                        }, [selectedId, rec.id]);

                        return (
                                                <div
                                                                        id={`rec-${rec.id}`}
                                                                        style={{
                                                                                                borderRadius: 16,
                                                                                                border: `1.5px solid ${selectedId === rec.id ? '#38bdf8' : p.color + '22'}`,
                                                                                                background: 'linear-gradient(160deg,rgba(10,10,22,0.95),rgba(16,16,30,0.98))',
                                                                                                boxShadow: p.glow,
                                                                                                overflow: 'hidden',
                                                                                                transition: 'all 0.3s',
                                                                        }}
                                                >
                                                                        <div
                                                                                                style={{
                                                                                                                        padding: '16px 20px',
                                                                                                                        cursor: 'pointer',
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                                        setOpen(
                                                                                                                                                (
                                                                                                                                                                        o
                                                                                                                                                ) =>
                                                                                                                                                                        !o
                                                                                                                        );
                                                                                                                        onSelectRec(
                                                                                                                                                rec.id
                                                                                                                        );
                                                                                                }}
                                                                                                id={`rec-toggle-${rec.id}`}
                                                                        >
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                display: 'flex',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                gap: 8,
                                                                                                                                                marginBottom: 10,
                                                                                                                                                flexWrap: 'wrap',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        width: 34,
                                                                                                                                                                        height: 34,
                                                                                                                                                                        borderRadius: '50%',
                                                                                                                                                                        background: p.bg,
                                                                                                                                                                        border: `2px solid ${p.color}`,
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                        justifyContent: 'center',
                                                                                                                                                                        fontSize: 14,
                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                        color: p.color,
                                                                                                                                                                        flexShrink: 0,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        rec.priority
                                                                                                                                                }
                                                                                                                        </div>
                                                                                                                        <Chip
                                                                                                                                                label={
                                                                                                                                                                        p.label
                                                                                                                                                }
                                                                                                                                                color={
                                                                                                                                                                        p.color
                                                                                                                                                }
                                                                                                                                                bg={
                                                                                                                                                                        p.bg
                                                                                                                                                }
                                                                                                                        />
                                                                                                                        <Chip
                                                                                                                                                label={rec.category.replace(
                                                                                                                                                                        '_',
                                                                                                                                                                        ' '
                                                                                                                                                )}
                                                                                                                                                color={
                                                                                                                                                                        cat
                                                                                                                                                }
                                                                                                                        />
                                                                                                                        <Chip
                                                                                                                                                label={
                                                                                                                                                                        rec.risk +
                                                                                                                                                                        ' RISK'
                                                                                                                                                }
                                                                                                                                                color={
                                                                                                                                                                        SEV_C[
                                                                                                                                                                                                rec
                                                                                                                                                                                                                        .risk
                                                                                                                                                                        ] ||
                                                                                                                                                                        '#888'
                                                                                                                                                }
                                                                                                                        />
                                                                                                                        {status ===
                                                                                                                                                'acknowledged' && (
                                                                                                                                                <Chip
                                                                                                                                                                        label="✓ ACK"
                                                                                                                                                                        color="#4ade80"
                                                                                                                                                />
                                                                                                                        )}
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        marginLeft: 'auto',
                                                                                                                                                                        fontSize: 13,
                                                                                                                                                                        color: 'rgba(255,255,255,0.3)',
                                                                                                                                                                        transition: 'transform 0.2s',
                                                                                                                                                                        transform: open
                                                                                                                                                                                                ? 'rotate(180deg)'
                                                                                                                                                                                                : 'none',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                ▾
                                                                                                                        </div>
                                                                                                </div>
                                                                                                <h3
                                                                                                                        style={{
                                                                                                                                                margin: '0 0 12px',
                                                                                                                                                fontSize: 14,
                                                                                                                                                fontWeight: 700,
                                                                                                                                                color: 'rgba(255,255,255,0.9)',
                                                                                                                                                lineHeight: 1.45,
                                                                                                                                                fontFamily: "'Fira Code',monospace",
                                                                                                                        }}
                                                                                                >
                                                                                                                        {
                                                                                                                                                rec.title
                                                                                                                        }
                                                                                                </h3>
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                display: 'flex',
                                                                                                                                                gap: 10,
                                                                                                                                                flexWrap: 'wrap',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                marginBottom: 12,
                                                                                                                        }}
                                                                                                >
                                                                                                                        {rec.impact_level && (
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '6px 13px',
                                                                                                                                                                                                borderRadius: 9,
                                                                                                                                                                                                background: `${EFFORT_C[rec.impact_level] || '#888'}12`,
                                                                                                                                                                                                border: `1px solid ${EFFORT_C[rec.impact_level] || '#888'}28`,
                                                                                                                                                                                                textAlign: 'center',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 9,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.35)',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        marginBottom: 2,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Impact
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 14,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color:
                                                                                                                                                                                                                                                EFFORT_C[
                                                                                                                                                                                                                                                                        rec
                                                                                                                                                                                                                                                                                                .impact_level
                                                                                                                                                                                                                                                ] ||
                                                                                                                                                                                                                                                '#888',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        rec.impact_level
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )}
                                                                                                                        {rec.effort_level && (
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '6px 13px',
                                                                                                                                                                                                borderRadius: 9,
                                                                                                                                                                                                background: `${EFFORT_C[rec.effort_level] || '#888'}10`,
                                                                                                                                                                                                border: `1px solid ${EFFORT_C[rec.effort_level] || '#888'}22`,
                                                                                                                                                                                                textAlign: 'center',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 9,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.35)',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        marginBottom: 2,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Effort
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 14,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color:
                                                                                                                                                                                                                                                EFFORT_C[
                                                                                                                                                                                                                                                                        rec
                                                                                                                                                                                                                                                                                                .effort_level
                                                                                                                                                                                                                                                ] ||
                                                                                                                                                                                                                                                '#888',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        rec.effort_level
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )}
                                                                                                                        {rec.expected_improvement && (
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '6px 16px',
                                                                                                                                                                                                borderRadius: 9,
                                                                                                                                                                                                background: 'rgba(74,222,128,0.08)',
                                                                                                                                                                                                border: '1px solid rgba(74,222,128,0.22)',
                                                                                                                                                                                                textAlign: 'center',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 9,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.35)',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        marginBottom: 2,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Expected
                                                                                                                                                                                                Improvement
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 19,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color: '#4ade80',
                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        rec.expected_improvement
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )}
                                                                                                                        {(rec.composite_priority_score ||
                                                                                                                                                0) >
                                                                                                                                                0 && (
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                marginLeft: 'auto',
                                                                                                                                                                                                textAlign: 'right',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 9,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.28)',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.08em',
                                                                                                                                                                                                                        marginBottom: 2,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Score
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 20,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color: p.color,
                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {Math.round(
                                                                                                                                                                                                                        rec.composite_priority_score ||
                                                                                                                                                                                                                                                0
                                                                                                                                                                                                )}
                                                                                                                                                                                                <span
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                fontSize: 10,
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.28)',
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        /100
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )}
                                                                                                </div>
                                                                                                {rec.business_impact_score !==
                                                                                                                        undefined && (
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                        gap: 4,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {[
                                                                                                                                                                        {
                                                                                                                                                                                                l: 'Business Impact',
                                                                                                                                                                                                v:
                                                                                                                                                                                                                        rec.business_impact_score ||
                                                                                                                                                                                                                        0,
                                                                                                                                                                                                c: '#a78bfa',
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                                                l: 'Technical Impact',
                                                                                                                                                                                                v:
                                                                                                                                                                                                                        rec.technical_impact_score ||
                                                                                                                                                                                                                        0,
                                                                                                                                                                                                c: '#38bdf8',
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                                                l: 'Risk Reduction',
                                                                                                                                                                                                v:
                                                                                                                                                                                                                        rec.risk_reduction_score ||
                                                                                                                                                                                                                        0,
                                                                                                                                                                                                c: '#f87171',
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                                                l: 'Health Gain',
                                                                                                                                                                                                v:
                                                                                                                                                                                                                        rec.health_improvement_pct ||
                                                                                                                                                                                                                        0,
                                                                                                                                                                                                c: '#4ade80',
                                                                                                                                                                        },
                                                                                                                                                ].map(
                                                                                                                                                                        (
                                                                                                                                                                                                d
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <ScoreBar
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                d.l
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        label={
                                                                                                                                                                                                                                                d.l
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                d.v
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        color={
                                                                                                                                                                                                                                                d.c
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                                        {open && (
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                padding: '0 20px 18px',
                                                                                                                                                borderTop: '1px solid rgba(255,255,255,0.05)',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'grid',
                                                                                                                                                                        gridTemplateColumns: '1fr 1fr',
                                                                                                                                                                        gap: 16,
                                                                                                                                                                        marginTop: 14,
                                                                                                                                                                        marginBottom: 14,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                <div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.08em',
                                                                                                                                                                                                                        marginBottom: 6,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Why
                                                                                                                                                                                                /
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Rationale
                                                                                                                                                                        </div>
                                                                                                                                                                        <p
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                                                                        lineHeight: 1.75,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.72)',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        rec.reason
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                                                                        color: '#f87171',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.08em',
                                                                                                                                                                                                                        marginBottom: 6,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Risk
                                                                                                                                                                                                &
                                                                                                                                                                                                Mitigation
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        padding: '10px 12px',
                                                                                                                                                                                                                        borderRadius: 8,
                                                                                                                                                                                                                        background: 'rgba(248,113,113,0.03)',
                                                                                                                                                                                                                        border: '1px solid rgba(248,113,113,0.14)',
                                                                                                                                                                                                                        fontSize: 11.5,
                                                                                                                                                                                                                        lineHeight: 1.55,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.7)',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Adoption
                                                                                                                                                                                                risk
                                                                                                                                                                                                is
                                                                                                                                                                                                marked
                                                                                                                                                                                                as{' '}
                                                                                                                                                                                                <strong
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                color: '#f87171',
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                rec.risk
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </strong>

                                                                                                                                                                                                .
                                                                                                                                                                                                Requires
                                                                                                                                                                                                systematic
                                                                                                                                                                                                deployment,
                                                                                                                                                                                                validation
                                                                                                                                                                                                checks,
                                                                                                                                                                                                and
                                                                                                                                                                                                rollback
                                                                                                                                                                                                scripts.
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {rec
                                                                                                                                                .evidence
                                                                                                                                                .length >
                                                                                                                                                0 && (
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                marginBottom: 14,
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.38)',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.08em',
                                                                                                                                                                                                                        marginBottom: 8,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Evidence
                                                                                                                                                                                                (Diagnostic
                                                                                                                                                                                                facts)
                                                                                                                                                                        </div>
                                                                                                                                                                        {rec.evidence.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        e,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        padding: '7px 12px',
                                                                                                                                                                                                                                                                        borderRadius: 8,
                                                                                                                                                                                                                                                                        background: 'rgba(255,255,255,0.02)',
                                                                                                                                                                                                                                                                        border: '1px solid rgba(255,255,255,0.06)',
                                                                                                                                                                                                                                                                        marginBottom: 5,
                                                                                                                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.75)',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                ◆{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        )}

                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'grid',
                                                                                                                                                                        gridTemplateColumns: '1fr 1fr',
                                                                                                                                                                        gap: 16,
                                                                                                                                                                        marginBottom: 14,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                <div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                                                                        color: '#60a5fa',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.08em',
                                                                                                                                                                                                                        marginBottom: 6,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Alternatives
                                                                                                                                                                                                Considered
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                        gap: 6,
                                                                                                                                                                                                                        flexWrap: 'wrap',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {rec.alternatives &&
                                                                                                                                                                                                rec
                                                                                                                                                                                                                        .alternatives
                                                                                                                                                                                                                        .length >
                                                                                                                                                                                                                        0 ? (
                                                                                                                                                                                                                        rec.alternatives.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        alt
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        alt
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        padding: '3px 9px',
                                                                                                                                                                                                                                                                                                                        borderRadius: 5,
                                                                                                                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                                                                                                                        background: 'rgba(96,165,250,0.06)',
                                                                                                                                                                                                                                                                                                                        border: '1px solid rgba(96,165,250,0.18)',
                                                                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.72)',
                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        alt
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )
                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.35)',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                Maintain
                                                                                                                                                                                                                                                existing
                                                                                                                                                                                                                                                monolithic
                                                                                                                                                                                                                                                execution
                                                                                                                                                                                                                                                flows.
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                                                                        color: '#fb923c',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.08em',
                                                                                                                                                                                                                        marginBottom: 6,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Trade-offs
                                                                                                                                                                                                &
                                                                                                                                                                                                Consequence
                                                                                                                                                                                                costs
                                                                                                                                                                        </div>
                                                                                                                                                                        <ul
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                        padding: '0 0 0 14px',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {rec.trade_offs.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                t,
                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <li
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.6)',
                                                                                                                                                                                                                                                                                                lineHeight: 1.65,
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                t
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </ul>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        justifyContent: 'space-between',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                        paddingTop: 14,
                                                                                                                                                                        borderTop: '1px solid rgba(255,255,255,0.05)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                gap: 10,
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <button
                                                                                                                                                                                                id={`ack-${rec.id}`}
                                                                                                                                                                                                onClick={(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                ) => {
                                                                                                                                                                                                                        e.stopPropagation();
                                                                                                                                                                                                                        setStatus(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        s
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        s ===
                                                                                                                                                                                                                                                                        'acknowledged'
                                                                                                                                                                                                                                                                                                ? 'open'
                                                                                                                                                                                                                                                                                                : 'acknowledged'
                                                                                                                                                                                                                        );
                                                                                                                                                                                                }}
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        padding: '7px 15px',
                                                                                                                                                                                                                        borderRadius: 8,
                                                                                                                                                                                                                        border: `1px solid ${status === 'acknowledged' ? '#4ade80' : 'rgba(74,222,128,0.3)'}`,
                                                                                                                                                                                                                        background:
                                                                                                                                                                                                                                                status ===
                                                                                                                                                                                                                                                'acknowledged'
                                                                                                                                                                                                                                                                        ? 'rgba(74,222,128,0.12)'
                                                                                                                                                                                                                                                                        : 'transparent',
                                                                                                                                                                                                                        color: '#4ade80',
                                                                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                                                                        fontWeight: 700,
                                                                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {status ===
                                                                                                                                                                                                'acknowledged'
                                                                                                                                                                                                                        ? '✓ Acknowledged'
                                                                                                                                                                                                                        : '✓ Acknowledge'}
                                                                                                                                                                        </button>
                                                                                                                                                </div>
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                fontSize: 10,
                                                                                                                                                                                                color: 'rgba(255,255,255,0.3)',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        Reasoning
                                                                                                                                                                        confidence:{' '}
                                                                                                                                                                        <strong
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        color: '#38bdf8',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {Math.round(
                                                                                                                                                                                                                        rec.confidence *
                                                                                                                                                                                                                                                100
                                                                                                                                                                                                )}

                                                                                                                                                                                                %
                                                                                                                                                                        </strong>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}

function RecommendationsTab({
                        report,
                        selectedId,
                        onSelectRec,
}: {
                        report: RecReport;
                        selectedId: string | null;
                        onSelectRec: (id: string) => void;
}) {
                        const [cat, setCat] = useState('all');
                        const filtered = report.recommendations.filter(
                                                (r) => cat === 'all' || r.category === cat
                        );
                        return (
                                                <div>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'grid',
                                                                                                                        gridTemplateColumns: '360px 1fr',
                                                                                                                        gap: 20,
                                                                                                                        marginBottom: 20,
                                                                                                }}
                                                                        >
                                                                                                <PriorityMatrix
                                                                                                                        recommendations={
                                                                                                                                                report.recommendations
                                                                                                                        }
                                                                                                                        onSelectRec={
                                                                                                                                                onSelectRec
                                                                                                                        }
                                                                                                                        selectedId={
                                                                                                                                                selectedId
                                                                                                                        }
                                                                                                />
                                                                                                <ArchitectureDiagrams />
                                                                        </div>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        gap: 7,
                                                                                                                        marginBottom: 18,
                                                                                                                        padding: '5px',
                                                                                                                        background: 'rgba(255,255,255,0.03)',
                                                                                                                        borderRadius: 10,
                                                                                                                        border: '1px solid rgba(255,255,255,0.06)',
                                                                                                                        width: 'fit-content',
                                                                                                }}
                                                                        >
                                                                                                {[
                                                                                                                        {
                                                                                                                                                k: 'all',
                                                                                                                                                l: `All (${report.total_recommendations})`,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                k: 'design_pattern',
                                                                                                                                                l: `Patterns (${report.total_by_category.design_pattern || 0})`,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                k: 'scalability',
                                                                                                                                                l: `Scale (${report.total_by_category.scalability || 0})`,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                k: 'refactoring',
                                                                                                                                                l: `Refactor (${report.total_by_category.refactoring || 0})`,
                                                                                                                        },
                                                                                                ].map(
                                                                                                                        ({
                                                                                                                                                k,
                                                                                                                                                l,
                                                                                                                        }) => (
                                                                                                                                                <button
                                                                                                                                                                        key={
                                                                                                                                                                                                k
                                                                                                                                                                        }
                                                                                                                                                                        id={`tab-rec-${k}`}
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                setCat(
                                                                                                                                                                                                                        k
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '7px 14px',
                                                                                                                                                                                                borderRadius: 8,
                                                                                                                                                                                                border: 'none',
                                                                                                                                                                                                background:
                                                                                                                                                                                                                        cat ===
                                                                                                                                                                                                                        k
                                                                                                                                                                                                                                                ? 'rgba(167,139,250,0.15)'
                                                                                                                                                                                                                                                : 'transparent',
                                                                                                                                                                                                color:
                                                                                                                                                                                                                        cat ===
                                                                                                                                                                                                                        k
                                                                                                                                                                                                                                                ? '#a78bfa'
                                                                                                                                                                                                                                                : 'rgba(255,255,255,0.38)',
                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                fontWeight:
                                                                                                                                                                                                                        cat ===
                                                                                                                                                                                                                        k
                                                                                                                                                                                                                                                ? 700
                                                                                                                                                                                                                                                : 500,
                                                                                                                                                                                                cursor: 'pointer',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                l
                                                                                                                                                                        }
                                                                                                                                                </button>
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        flexDirection: 'column',
                                                                                                                        gap: 13,
                                                                                                }}
                                                                        >
                                                                                                {filtered.map(
                                                                                                                        (
                                                                                                                                                r,
                                                                                                                                                i
                                                                                                                        ) => (
                                                                                                                                                <RecCard
                                                                                                                                                                        key={
                                                                                                                                                                                                r.id
                                                                                                                                                                        }
                                                                                                                                                                        rec={
                                                                                                                                                                                                r
                                                                                                                                                                        }
                                                                                                                                                                        rank={
                                                                                                                                                                                                i
                                                                                                                                                                        }
                                                                                                                                                                        selectedId={
                                                                                                                                                                                                selectedId
                                                                                                                                                                        }
                                                                                                                                                                        onSelectRec={
                                                                                                                                                                                                onSelectRec
                                                                                                                                                                        }
                                                                                                                                                />
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

// ─── Tab: Pattern Advisor ─────────────────────────────────────────────────────
function PatternCard({ pat }: { pat: PatternAdvisory }) {
                        const [open, setOpen] = useState(false);
                        const cm = CAT_META[pat.category] || {
                                                label: pat.category,
                                                color: '#888',
                                                icon: '◈',
                        };
                        const statusColor = pat.already_present
                                                ? '#4ade80'
                                                : pat.applicable
                                                  ? '#fbbf24'
                                                  : 'rgba(255,255,255,0.28)';
                        const statusLabel = pat.already_present
                                                ? '✓ IMPLEMENTED'
                                                : pat.applicable
                                                  ? '— RECOMMENDED'
                                                  : '— NOT APPLICABLE';

                        return (
                                                <div
                                                                        id={`pat-${pat.id}`}
                                                                        style={{
                                                                                                borderRadius: 16,
                                                                                                border: `1.5px solid ${pat.applicable || pat.already_present ? cm.color + '30' : 'rgba(255,255,255,0.06)'}`,
                                                                                                background: pat.applicable
                                                                                                                        ? `linear-gradient(160deg,rgba(10,10,22,0.96),rgba(${cm.color === '#a78bfa' ? '30,20,60' : '10,25,45'},0.98))`
                                                                                                                        : 'rgba(255,255,255,0.02)',
                                                                                                overflow: 'hidden',
                                                                                                transition: 'all 0.3s',
                                                                                                opacity:
                                                                                                                        pat.applicable ||
                                                                                                                        pat.already_present
                                                                                                                                                ? 1
                                                                                                                                                : 0.55,
                                                                                                boxShadow: pat.applicable
                                                                                                                        ? `0 0 20px ${cm.color}10`
                                                                                                                        : 'none',
                                                                                                marginBottom: 14,
                                                                        }}
                                                >
                                                                        <div
                                                                                                style={{
                                                                                                                        padding: '18px 20px',
                                                                                                                        cursor: 'pointer',
                                                                                                }}
                                                                                                onClick={() =>
                                                                                                                        setOpen(
                                                                                                                                                (
                                                                                                                                                                        o
                                                                                                                                                ) =>
                                                                                                                                                                        !o
                                                                                                                        )
                                                                                                }
                                                                        >
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                display: 'flex',
                                                                                                                                                alignItems: 'flex-start',
                                                                                                                                                gap: 12,
                                                                                                                                                marginBottom: 12,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        width: 46,
                                                                                                                                                                        height: 46,
                                                                                                                                                                        borderRadius: 14,
                                                                                                                                                                        background: `${cm.color}18`,
                                                                                                                                                                        border: `1.5px solid ${cm.color}30`,
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                        justifyContent: 'center',
                                                                                                                                                                        fontSize: 22,
                                                                                                                                                                        flexShrink: 0,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        pat.icon
                                                                                                                                                }
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        flex: 1,
                                                                                                                                                                        minWidth: 0,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                gap: 7,
                                                                                                                                                                                                flexWrap: 'wrap',
                                                                                                                                                                                                marginBottom: 6,
                                                                                                                                                                                                alignItems: 'center',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <span
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                                                                                        color: statusColor,
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        statusLabel
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                                        <Chip
                                                                                                                                                                                                label={
                                                                                                                                                                                                                        pat.category
                                                                                                                                                                                                }
                                                                                                                                                                                                color={
                                                                                                                                                                                                                        cm.color
                                                                                                                                                                                                }
                                                                                                                                                                        />
                                                                                                                                                                        <Chip
                                                                                                                                                                                                label={`Effort: ${pat.effort}`}
                                                                                                                                                                                                color={
                                                                                                                                                                                                                        EFFORT_C[
                                                                                                                                                                                                                                                pat
                                                                                                                                                                                                                                                                        .effort
                                                                                                                                                                                                                        ] ||
                                                                                                                                                                                                                        '#888'
                                                                                                                                                                                                }
                                                                                                                                                                        />
                                                                                                                                                </div>
                                                                                                                                                <h3
                                                                                                                                                                        style={{
                                                                                                                                                                                                margin: '0 0 4px',
                                                                                                                                                                                                fontSize: 15,
                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                color: 'rgba(255,255,255,0.92)',
                                                                                                                                                                                                fontFamily: "'Fira Code',monospace",
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                pat.pattern_name
                                                                                                                                                                        }
                                                                                                                                                </h3>
                                                                                                                                                <p
                                                                                                                                                                        style={{
                                                                                                                                                                                                margin: 0,
                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                color: 'rgba(255,255,255,0.5)',
                                                                                                                                                                                                lineHeight: 1.55,
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                pat.why
                                                                                                                                                                        }
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}

function PatternAdvisorTab({ report }: { report: PatternReport }) {
                        const [filter, setFilter] = useState<'all' | 'recommended' | 'implemented'>(
                                                'all'
                        );
                        const filtered = report.advisories.filter((a) =>
                                                filter === 'all'
                                                                        ? true
                                                                        : filter === 'recommended'
                                                                          ? a.applicable &&
                                                                            !a.already_present
                                                                          : a.already_present
                        );
                        return (
                                                <div>
                                                                        <div
                                                                                                style={{
                                                                                                                        padding: '12px 18px',
                                                                                                                        borderRadius: 12,
                                                                                                                        background: 'linear-gradient(135deg,rgba(167,139,250,0.1),rgba(56,189,248,0.06))',
                                                                                                                        border: '1px solid rgba(167,139,250,0.2)',
                                                                                                                        marginBottom: 20,
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'center',
                                                                                                                        gap: 12,
                                                                                                }}
                                                                        >
                                                                                                <span
                                                                                                                        style={{
                                                                                                                                                fontSize: 20,
                                                                                                                        }}
                                                                                                >
                                                                                                                        ◈
                                                                                                </span>
                                                                                                <div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                        letterSpacing: '0.12em',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        marginBottom: 3,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Pattern
                                                                                                                                                Analysis
                                                                                                                        </div>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        color: 'rgba(255,255,255,0.8)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        report.summary
                                                                                                                                                }
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        gap: 6,
                                                                                                                        marginBottom: 18,
                                                                                                                        padding: '5px',
                                                                                                                        background: 'rgba(255,255,255,0.03)',
                                                                                                                        borderRadius: 10,
                                                                                                                        border: '1px solid rgba(255,255,255,0.06)',
                                                                                                                        width: 'fit-content',
                                                                                                }}
                                                                        >
                                                                                                {(
                                                                                                                        [
                                                                                                                                                [
                                                                                                                                                                        'all',
                                                                                                                                                                        'All Patterns',
                                                                                                                                                ],
                                                                                                                                                [
                                                                                                                                                                        'recommended',
                                                                                                                                                                        'Recommended',
                                                                                                                                                ],
                                                                                                                                                [
                                                                                                                                                                        'implemented',
                                                                                                                                                                        'Implemented',
                                                                                                                                                ],
                                                                                                                        ] as const
                                                                                                ).map(
                                                                                                                        ([
                                                                                                                                                k,
                                                                                                                                                l,
                                                                                                                        ]) => (
                                                                                                                                                <button
                                                                                                                                                                        key={
                                                                                                                                                                                                k
                                                                                                                                                                        }
                                                                                                                                                                        id={`pat-filter-${k}`}
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                setFilter(
                                                                                                                                                                                                                        k as any
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '7px 14px',
                                                                                                                                                                                                borderRadius: 8,
                                                                                                                                                                                                border: 'none',
                                                                                                                                                                                                background:
                                                                                                                                                                                                                        filter ===
                                                                                                                                                                                                                        k
                                                                                                                                                                                                                                                ? 'rgba(167,139,250,0.15)'
                                                                                                                                                                                                                                                : 'transparent',
                                                                                                                                                                                                color:
                                                                                                                                                                                                                        filter ===
                                                                                                                                                                                                                        k
                                                                                                                                                                                                                                                ? '#a78bfa'
                                                                                                                                                                                                                                                : 'rgba(255,255,255,0.38)',
                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                fontWeight:
                                                                                                                                                                                                                        filter ===
                                                                                                                                                                                                                        k
                                                                                                                                                                                                                                                ? 700
                                                                                                                                                                                                                                                : 500,
                                                                                                                                                                                                cursor: 'pointer',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                l
                                                                                                                                                                        }
                                                                                                                                                </button>
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'grid',
                                                                                                                        gridTemplateColumns: 'repeat(auto-fill,minmax(480px,1fr))',
                                                                                                                        gap: 14,
                                                                                                }}
                                                                        >
                                                                                                {filtered.map(
                                                                                                                        (
                                                                                                                                                p
                                                                                                                        ) => (
                                                                                                                                                <PatternCard
                                                                                                                                                                        key={
                                                                                                                                                                                                p.id
                                                                                                                                                                        }
                                                                                                                                                                        pat={
                                                                                                                                                                                                p
                                                                                                                                                                        }
                                                                                                                                                />
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

// ─── Tab: Scalability Advisor ─────────────────────────────────────────────────
function ScalabilityCard({ adv }: { adv: ScalabilityAdvisory }) {
                        const sc = SEV_C[adv.severity] || '#888';
                        return (
                                                <div
                                                                        id={`scl-${adv.id}`}
                                                                        style={{
                                                                                                borderRadius: 16,
                                                                                                border: `1.5px solid ${sc}28`,
                                                                                                background: 'linear-gradient(160deg,rgba(10,10,22,0.96),rgba(16,16,32,0.98))',
                                                                                                overflow: 'hidden',
                                                                                                marginBottom: 14,
                                                                                                padding: '16px 20px',
                                                                        }}
                                                >
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'flex-start',
                                                                                                                        gap: 12,
                                                                                                }}
                                                                        >
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                width: 48,
                                                                                                                                                height: 48,
                                                                                                                                                borderRadius: 14,
                                                                                                                                                background: `${sc}15`,
                                                                                                                                                border: `1.5px solid ${sc}30`,
                                                                                                                                                display: 'flex',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                justifyContent: 'center',
                                                                                                                                                fontSize: 22,
                                                                                                                                                flexShrink: 0,
                                                                                                                        }}
                                                                                                >
                                                                                                                        {
                                                                                                                                                adv.icon
                                                                                                                        }
                                                                                                </div>
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                flex: 1,
                                                                                                                                                minWidth: 0,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        gap: 7,
                                                                                                                                                                        marginBottom: 6,
                                                                                                                                                                        flexWrap: 'wrap',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                <span
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '3px 10px',
                                                                                                                                                                                                borderRadius: 20,
                                                                                                                                                                                                fontSize: 10,
                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                color: sc,
                                                                                                                                                                                                background: `${sc}15`,
                                                                                                                                                                                                border: `1px solid ${sc}28`,
                                                                                                                                                                                                textTransform: 'uppercase',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                adv.severity
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                                                <Chip
                                                                                                                                                                        label={
                                                                                                                                                                                                adv.category
                                                                                                                                                                        }
                                                                                                                                                                        color="#38bdf8"
                                                                                                                                                />
                                                                                                                                                <Chip
                                                                                                                                                                        label={`Effort: ${adv.effort}`}
                                                                                                                                                                        color={
                                                                                                                                                                                                EFFORT_C[
                                                                                                                                                                                                                        adv
                                                                                                                                                                                                                                                .effort
                                                                                                                                                                                                ] ||
                                                                                                                                                                                                '#888'
                                                                                                                                                                        }
                                                                                                                                                />
                                                                                                                        </div>
                                                                                                                        <h3
                                                                                                                                                style={{
                                                                                                                                                                        margin: '0 0 6px',
                                                                                                                                                                        fontSize: 14,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: 'rgba(255,255,255,0.92)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        adv.recommendation
                                                                                                                                                }
                                                                                                                        </h3>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                        color: 'rgba(255,255,255,0.52)',
                                                                                                                                                                        lineHeight: 1.55,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        adv.issue_description
                                                                                                                                                }
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}

function ScalabilityTab({ report }: { report: ScalabilityReport }) {
                        return (
                                                <div>
                                                                        <div
                                                                                                style={{
                                                                                                                        padding: '12px 18px',
                                                                                                                        borderRadius: 12,
                                                                                                                        background: 'linear-gradient(135deg,rgba(56,189,248,0.1),rgba(96,165,250,0.06))',
                                                                                                                        border: '1px solid rgba(56,189,248,0.2)',
                                                                                                                        marginBottom: 20,
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'center',
                                                                                                                        gap: 12,
                                                                                                }}
                                                                        >
                                                                                                <span
                                                                                                                        style={{
                                                                                                                                                fontSize: 20,
                                                                                                                        }}
                                                                                                >
                                                                                                                        📡
                                                                                                </span>
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                flex: 1,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#38bdf8',
                                                                                                                                                                        letterSpacing: '0.12em',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        marginBottom: 3,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Scalability
                                                                                                                                                Analysis
                                                                                                                        </div>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        color: 'rgba(255,255,255,0.8)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        report.scalability_verdict
                                                                                                                                                }
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        flexDirection: 'column',
                                                                                                                        gap: 13,
                                                                                                }}
                                                                        >
                                                                                                {report.advisories.map(
                                                                                                                        (
                                                                                                                                                a
                                                                                                                        ) => (
                                                                                                                                                <ScalabilityCard
                                                                                                                                                                        key={
                                                                                                                                                                                                a.id
                                                                                                                                                                        }
                                                                                                                                                                        adv={
                                                                                                                                                                                                a
                                                                                                                                                                        }
                                                                                                                                                />
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

// ─── Tab: Refactoring Advisor (Feature 5) ─────────────────────────────────────
function RefactorPlanCard({ plan }: { plan: RefactoringPlan }) {
                        return (
                                                <div
                                                                        style={{
                                                                                                borderRadius: 16,
                                                                                                border: '1px solid rgba(251,146,60,0.22)',
                                                                                                background: 'linear-gradient(160deg,rgba(10,10,22,0.96),rgba(20,15,35,0.98))',
                                                                                                overflow: 'hidden',
                                                                                                marginBottom: 18,
                                                                                                padding: '18px 22px',
                                                                        }}
                                                >
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'center',
                                                                                                                        gap: 10,
                                                                                                }}
                                                                        >
                                                                                                <span
                                                                                                                        style={{
                                                                                                                                                fontSize: 24,
                                                                                                                        }}
                                                                                                >
                                                                                                                        ⚙️
                                                                                                </span>
                                                                                                <div>
                                                                                                                        <h3
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 14,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: 'rgba(255,255,255,0.92)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Decompose
                                                                                                                                                God
                                                                                                                                                Module:{' '}
                                                                                                                                                <span
                                                                                                                                                                        style={{
                                                                                                                                                                                                fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                color: '#fb923c',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                plan.source_module
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                        </h3>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: '2px 0 0',
                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                        color: 'rgba(255,255,255,0.4)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        plan.source_loc
                                                                                                                                                }{' '}
                                                                                                                                                LOC
                                                                                                                                                ·
                                                                                                                                                Complexity:{' '}
                                                                                                                                                {
                                                                                                                                                                        plan.source_complexity
                                                                                                                                                }
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}

function RefactoringTab({ report }: { report: RefactoringReport }) {
                        return (
                                                <div>
                                                                        <div
                                                                                                style={{
                                                                                                                        padding: '12px 18px',
                                                                                                                        borderRadius: 12,
                                                                                                                        background: 'linear-gradient(135deg,rgba(251,146,60,0.1),rgba(251,191,36,0.06))',
                                                                                                                        border: '1px solid rgba(251,146,60,0.2)',
                                                                                                                        marginBottom: 20,
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'center',
                                                                                                                        gap: 12,
                                                                                                }}
                                                                        >
                                                                                                <span
                                                                                                                        style={{
                                                                                                                                                fontSize: 20,
                                                                                                                        }}
                                                                                                >
                                                                                                                        ⚙️
                                                                                                </span>
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                flex: 1,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#fb923c',
                                                                                                                                                                        letterSpacing: '0.12em',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        marginBottom: 3,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Refactoring
                                                                                                                                                &
                                                                                                                                                Decomposition
                                                                                                                        </div>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        color: 'rgba(255,255,255,0.8)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        report.summary
                                                                                                                                                }
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>
                                                                        <div>
                                                                                                {report.plans.map(
                                                                                                                        (
                                                                                                                                                p
                                                                                                                        ) => (
                                                                                                                                                <RefactorPlanCard
                                                                                                                                                                        key={
                                                                                                                                                                                                p.id
                                                                                                                                                                        }
                                                                                                                                                                        plan={
                                                                                                                                                                                                p
                                                                                                                                                                        }
                                                                                                                                                />
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

// ─── Tab: Coupling Reduction Advisor (Feature 6) ──────────────────────────────
function CouplingCard({ issue }: { issue: CouplingIssue }) {
                        const sc = SEV_C[issue.severity] || '#888';
                        return (
                                                <div
                                                                        style={{
                                                                                                borderRadius: 16,
                                                                                                border: `1.5px solid ${sc}22`,
                                                                                                background: 'linear-gradient(160deg,rgba(10,10,22,0.96),rgba(16,16,32,0.98))',
                                                                                                overflow: 'hidden',
                                                                                                marginBottom: 14,
                                                                                                padding: '16px 20px',
                                                                        }}
                                                >
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'flex-start',
                                                                                                                        gap: 12,
                                                                                                }}
                                                                        >
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                width: 38,
                                                                                                                                                height: 38,
                                                                                                                                                borderRadius: 10,
                                                                                                                                                background: `${sc}15`,
                                                                                                                                                border: `1.5px solid ${sc}30`,
                                                                                                                                                display: 'flex',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                justifyContent: 'center',
                                                                                                                                                fontSize: 18,
                                                                                                                                                fontWeight: 900,
                                                                                                                                                color: sc,
                                                                                                                                                flexShrink: 0,
                                                                                                                        }}
                                                                                                >
                                                                                                                        {issue.issue_type ===
                                                                                                                        'cyclic_dependency'
                                                                                                                                                ? '⟳'
                                                                                                                                                : '●'}
                                                                                                </div>
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                flex: 1,
                                                                                                                                                minWidth: 0,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        gap: 7,
                                                                                                                                                                        marginBottom: 6,
                                                                                                                                                                        flexWrap: 'wrap',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                <span
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '2px 8px',
                                                                                                                                                                                                borderRadius: 20,
                                                                                                                                                                                                fontSize: 9,
                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                color: sc,
                                                                                                                                                                                                background: `${sc}15`,
                                                                                                                                                                                                border: `1px solid ${sc}28`,
                                                                                                                                                                                                textTransform: 'uppercase',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                issue.severity
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                                                <Chip
                                                                                                                                                                        label={issue.issue_type.replace(
                                                                                                                                                                                                '_',
                                                                                                                                                                                                ' '
                                                                                                                                                                        )}
                                                                                                                                                                        color="#38bdf8"
                                                                                                                                                />
                                                                                                                                                <span
                                                                                                                                                                        style={{
                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                color: 'rgba(255,255,255,0.7)',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                issue.module_name
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        color: 'rgba(255,255,255,0.85)',
                                                                                                                                                                        lineHeight: 1.4,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        issue.description
                                                                                                                                                }
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}

function CouplingTab({ report }: { report: CouplingReport }) {
                        return (
                                                <div>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'grid',
                                                                                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                                                                                                        gap: 16,
                                                                                                                        marginBottom: 20,
                                                                                                }}
                                                                        >
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                padding: '16px 20px',
                                                                                                                                                borderRadius: 16,
                                                                                                                                                border: '1px solid rgba(56,189,248,0.2)',
                                                                                                                                                background: 'linear-gradient(135deg,rgba(10,10,22,0.95),rgba(15,30,50,0.98))',
                                                                                                                                                display: 'flex',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                gap: 16,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        width: 54,
                                                                                                                                                                        height: 54,
                                                                                                                                                                        borderRadius: '50%',
                                                                                                                                                                        border: '3px solid #38bdf8',
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                        justifyContent: 'center',
                                                                                                                                                                        fontSize: 18,
                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                        color: '#38bdf8',
                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        report.coupling_health_score
                                                                                                                                                }
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                fontSize: 10,
                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                color: '#38bdf8',
                                                                                                                                                                                                textTransform: 'uppercase',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        Coupling
                                                                                                                                                                        Health
                                                                                                                                                                        Score
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        flexDirection: 'column',
                                                                                                                        gap: 12,
                                                                                                }}
                                                                        >
                                                                                                {report.issues.map(
                                                                                                                        (
                                                                                                                                                iss
                                                                                                                        ) => (
                                                                                                                                                <CouplingCard
                                                                                                                                                                        key={
                                                                                                                                                                                                iss.id
                                                                                                                                                                        }
                                                                                                                                                                        issue={
                                                                                                                                                                                                iss
                                                                                                                                                                        }
                                                                                                                                                />
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

// ─── Tab: Architecture Decision Generator (Feature 7) ─────────────────────────
function AdrProposalCard({ prop }: { prop: ADRProposal }) {
                        const [status, setStatus] = useState(prop.status);
                        const isAccepted = status === 'Accepted';
                        return (
                                                <div
                                                                        style={{
                                                                                                borderRadius: 16,
                                                                                                border: '1px solid rgba(167,139,250,0.18)',
                                                                                                background: 'linear-gradient(160deg,rgba(10,10,22,0.96),rgba(22,18,36,0.98))',
                                                                                                overflow: 'hidden',
                                                                                                marginBottom: 14,
                                                                                                padding: '16px 20px',
                                                                        }}
                                                >
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'center',
                                                                                                                        justifyContent: 'space-between',
                                                                                                                        flexWrap: 'wrap',
                                                                                                                        gap: 10,
                                                                                                }}
                                                                        >
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                display: 'flex',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                gap: 10,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <span
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 20,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                📜
                                                                                                                        </span>
                                                                                                                        <div>
                                                                                                                                                <h3
                                                                                                                                                                        style={{
                                                                                                                                                                                                margin: 0,
                                                                                                                                                                                                fontSize: 14,
                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                color: 'rgba(255,255,255,0.92)',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                prop.title
                                                                                                                                                                        }
                                                                                                                                                </h3>
                                                                                                                                                <p
                                                                                                                                                                        style={{
                                                                                                                                                                                                margin: '2px 0 0',
                                                                                                                                                                                                fontSize: 10.5,
                                                                                                                                                                                                color: 'rgba(255,255,255,0.45)',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        Generated:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                prop.date
                                                                                                                                                                        }
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>
                                                                                                <button
                                                                                                                        id={`btn-accept-adr-${prop.id}`}
                                                                                                                        onClick={() =>
                                                                                                                                                setStatus(
                                                                                                                                                                        isAccepted
                                                                                                                                                                                                ? 'Proposed'
                                                                                                                                                                                                : 'Accepted'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        style={{
                                                                                                                                                padding: '5px 12px',
                                                                                                                                                borderRadius: 20,
                                                                                                                                                fontSize: 10,
                                                                                                                                                fontWeight: 800,
                                                                                                                                                color: isAccepted
                                                                                                                                                                        ? '#4ade80'
                                                                                                                                                                        : '#60a5fa',
                                                                                                                                                background: isAccepted
                                                                                                                                                                        ? 'rgba(74,222,128,0.1)'
                                                                                                                                                                        : 'rgba(96,165,250,0.1)',
                                                                                                                                                border: `1px solid ${isAccepted ? 'rgba(74,222,128,0.2)' : 'rgba(96,165,250,0.2)'}`,
                                                                                                                                                cursor: 'pointer',
                                                                                                                        }}
                                                                                                >
                                                                                                                        {
                                                                                                                                                status
                                                                                                                        }
                                                                                                </button>
                                                                        </div>
                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'grid',
                                                                                                                        gridTemplateColumns: '1fr 1fr',
                                                                                                                        gap: 16,
                                                                                                                        marginTop: 16,
                                                                                                }}
                                                                        >
                                                                                                <div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                                        marginBottom: 5,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Decision
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        padding: '10px 14px',
                                                                                                                                                                        borderRadius: 8,
                                                                                                                                                                        background: 'rgba(167,139,250,0.05)',
                                                                                                                                                                        border: '1px solid rgba(167,139,250,0.15)',
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        fontWeight: 700,
                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        prop.decision
                                                                                                                                                }
                                                                                                                        </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                        color: '#fb923c',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                                        marginBottom: 5,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Reason
                                                                                                                        </div>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 11.5,
                                                                                                                                                                        color: 'rgba(255,255,255,0.7)',
                                                                                                                                                                        lineHeight: 1.55,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        prop.reason
                                                                                                                                                }
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}

function AdrGeneratorTab({ report }: { report: ADRReport }) {
                        return (
                                                <div>
                                                                        <div
                                                                                                style={{
                                                                                                                        padding: '12px 18px',
                                                                                                                        borderRadius: 12,
                                                                                                                        background: 'linear-gradient(135deg,rgba(167,139,250,0.1),rgba(96,165,250,0.06))',
                                                                                                                        border: '1px solid rgba(167,139,250,0.2)',
                                                                                                                        marginBottom: 20,
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'center',
                                                                                                                        gap: 12,
                                                                                                }}
                                                                        >
                                                                                                <span
                                                                                                                        style={{
                                                                                                                                                fontSize: 20,
                                                                                                                        }}
                                                                                                >
                                                                                                                        🖋️
                                                                                                </span>
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                flex: 1,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                        letterSpacing: '0.12em',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        marginBottom: 3,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Architecture
                                                                                                                                                Decision
                                                                                                                                                Generator
                                                                                                                                                (ADR)
                                                                                                                        </div>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        color: 'rgba(255,255,255,0.8)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Automatically
                                                                                                                                                generated
                                                                                                                                                decision
                                                                                                                                                record
                                                                                                                                                recommendations.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>
                                                                        <div>
                                                                                                {report.proposals.map(
                                                                                                                        (
                                                                                                                                                p
                                                                                                                        ) => (
                                                                                                                                                <AdrProposalCard
                                                                                                                                                                        key={
                                                                                                                                                                                                p.id
                                                                                                                                                                        }
                                                                                                                                                                        prop={
                                                                                                                                                                                                p
                                                                                                                                                                        }
                                                                                                                                                />
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

// ─── Tab: AI Engineering Review (Feature 8) ───────────────────────────────────
function AIReviewTab({ report }: { report: AIReviewReport }) {
                        return (
                                                <div>
                                                                        <div
                                                                                                style={{
                                                                                                                        padding: 20,
                                                                                                                        borderRadius: 16,
                                                                                                                        border: '1px solid rgba(56,189,248,0.2)',
                                                                                                                        background: 'linear-gradient(145deg,rgba(10,10,22,0.96),rgba(12,30,50,0.98))',
                                                                                                                        marginBottom: 22,
                                                                                                }}
                                                                        >
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                display: 'flex',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                gap: 10,
                                                                                                                                                marginBottom: 12,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <span
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 22,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                📋
                                                                                                                        </span>
                                                                                                                        <h3
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 14,
                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                        color: '#38bdf8',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                AI
                                                                                                                                                Repository
                                                                                                                                                Engineering
                                                                                                                                                Review
                                                                                                                        </h3>
                                                                                                </div>
                                                                                                <p
                                                                                                                        style={{
                                                                                                                                                margin: 0,
                                                                                                                                                fontSize: 13,
                                                                                                                                                lineHeight: 1.75,
                                                                                                                                                color: 'rgba(255,255,255,0.8)',
                                                                                                                        }}
                                                                                                >
                                                                                                                        {
                                                                                                                                                report.overall_summary
                                                                                                                        }
                                                                                                </p>
                                                                        </div>

                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'grid',
                                                                                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                                                                                                        gap: 16,
                                                                                                }}
                                                                        >
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                padding: 20,
                                                                                                                                                borderRadius: 16,
                                                                                                                                                border: '1px solid rgba(74,222,128,0.18)',
                                                                                                                                                background: 'rgba(74,222,128,0.02)',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <h4
                                                                                                                                                style={{
                                                                                                                                                                        margin: '0 0 14px',
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                        color: '#4ade80',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        letterSpacing: '0.08em',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Codebase
                                                                                                                                                Strengths
                                                                                                                        </h4>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                        gap: 10,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {report.strengths.map(
                                                                                                                                                                        (
                                                                                                                                                                                                str,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                padding: 12,
                                                                                                                                                                                                                                                borderRadius: 8,
                                                                                                                                                                                                                                                background: 'rgba(74,222,128,0.04)',
                                                                                                                                                                                                                                                border: '1px solid rgba(74,222,128,0.1)',
                                                                                                                                                                                                                                                fontSize: 11.5,
                                                                                                                                                                                                                                                lineHeight: 1.55,
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.75)',
                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                gap: 8,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        color: '#4ade80',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                ✓
                                                                                                                                                                                                                        </span>{' '}
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        str
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                padding: 20,
                                                                                                                                                borderRadius: 16,
                                                                                                                                                border: '1px solid rgba(248,113,113,0.18)',
                                                                                                                                                background: 'rgba(248,113,113,0.02)',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <h4
                                                                                                                                                style={{
                                                                                                                                                                        margin: '0 0 14px',
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                        color: '#f87171',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        letterSpacing: '0.08em',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Codebase
                                                                                                                                                Weaknesses
                                                                                                                        </h4>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                        gap: 10,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {report.weaknesses.map(
                                                                                                                                                                        (
                                                                                                                                                                                                weak,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                padding: 12,
                                                                                                                                                                                                                                                borderRadius: 8,
                                                                                                                                                                                                                                                background: 'rgba(248,113,113,0.04)',
                                                                                                                                                                                                                                                border: '1px solid rgba(248,113,113,0.1)',
                                                                                                                                                                                                                                                fontSize: 11.5,
                                                                                                                                                                                                                                                lineHeight: 1.55,
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.75)',
                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                gap: 8,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        color: '#f87171',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                ⚠️
                                                                                                                                                                                                                        </span>{' '}
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        weak
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                padding: 20,
                                                                                                                                                borderRadius: 16,
                                                                                                                                                border: '1px solid rgba(251,146,60,0.18)',
                                                                                                                                                background: 'rgba(251,146,60,0.02)',
                                                                                                                        }}
                                                                                                >
                                                                                                                        <h4
                                                                                                                                                style={{
                                                                                                                                                                        margin: '0 0 14px',
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                        color: '#fb923c',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        letterSpacing: '0.08em',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                AI
                                                                                                                                                Recommendations
                                                                                                                        </h4>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                        gap: 10,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {report.recommendations.map(
                                                                                                                                                                        (
                                                                                                                                                                                                rec,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                padding: 12,
                                                                                                                                                                                                                                                borderRadius: 8,
                                                                                                                                                                                                                                                background: 'rgba(251,146,60,0.04)',
                                                                                                                                                                                                                                                border: '1px solid rgba(251,146,60,0.1)',
                                                                                                                                                                                                                                                fontSize: 11.5,
                                                                                                                                                                                                                                                lineHeight: 1.55,
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.75)',
                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                gap: 8,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        color: '#fb923c',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                →
                                                                                                                                                                                                                        </span>{' '}
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        rec
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}

// ─── Tab: Sprint Recommendation Engine (Feature 9) ───────────────────────────
function SprintTab({ report }: { report: SprintReport }) {
                        return (
                                                <div>
                                                                        <div
                                                                                                style={{
                                                                                                                        padding: '12px 18px',
                                                                                                                        borderRadius: 12,
                                                                                                                        background: 'linear-gradient(135deg,rgba(167,139,250,0.1),rgba(56,189,248,0.06))',
                                                                                                                        border: '1px solid rgba(167,139,250,0.2)',
                                                                                                                        marginBottom: 20,
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'center',
                                                                                                                        gap: 12,
                                                                                                }}
                                                                        >
                                                                                                <span
                                                                                                                        style={{
                                                                                                                                                fontSize: 20,
                                                                                                                        }}
                                                                                                >
                                                                                                                        🏃
                                                                                                </span>
                                                                                                <div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                        letterSpacing: '0.12em',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        marginBottom: 3,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Sprint
                                                                                                                                                Recommendation
                                                                                                                                                Engine
                                                                                                                        </div>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        color: 'rgba(255,255,255,0.8)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Prioritizes
                                                                                                                                                refactoring
                                                                                                                                                efforts
                                                                                                                                                and
                                                                                                                                                database
                                                                                                                                                optimizations
                                                                                                                                                into
                                                                                                                                                actionable
                                                                                                                                                Scrum
                                                                                                                                                sprints.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        flexDirection: 'column',
                                                                                                                        gap: 22,
                                                                                                }}
                                                                        >
                                                                                                {report.sprints.map(
                                                                                                                        (
                                                                                                                                                sprint,
                                                                                                                                                sIdx
                                                                                                                        ) => (
                                                                                                                                                <div
                                                                                                                                                                        key={
                                                                                                                                                                                                sIdx
                                                                                                                                                                        }
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: 20,
                                                                                                                                                                                                borderRadius: 16,
                                                                                                                                                                                                background: 'rgba(255,255,255,0.02)',
                                                                                                                                                                                                border: '1px solid rgba(255,255,255,0.05)',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <h3
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        margin: '0 0 14px',
                                                                                                                                                                                                                        fontSize: 15,
                                                                                                                                                                                                                        fontWeight: 850,
                                                                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        sprint.sprint_name
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                Backlog
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        display: 'grid',
                                                                                                                                                                                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                                                                                                                                                                                                                        gap: 14,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {sprint.tasks.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                task
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                task.id
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                padding: 16,
                                                                                                                                                                                                                                                                                                borderRadius: 12,
                                                                                                                                                                                                                                                                                                background: 'linear-gradient(145deg,rgba(10,10,22,0.98),rgba(16,16,32,0.98))',
                                                                                                                                                                                                                                                                                                border: '1px solid rgba(255,255,255,0.06)',
                                                                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                                                                flexDirection: 'column',
                                                                                                                                                                                                                                                                                                gap: 8,
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                                                                                                                                                                        gap: 8,
                                                                                                                                                                                                                                                                                                                        flexWrap: 'wrap',
                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                padding: '2px 8px',
                                                                                                                                                                                                                                                                                                                                                borderRadius: 20,
                                                                                                                                                                                                                                                                                                                                                fontSize: 9,
                                                                                                                                                                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                                                                                                                                                                background: 'rgba(167,139,250,0.15)',
                                                                                                                                                                                                                                                                                                                                                color: '#a78bfa',
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        P
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                task.priority_level
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                padding: '2px 8px',
                                                                                                                                                                                                                                                                                                                                                borderRadius: 20,
                                                                                                                                                                                                                                                                                                                                                fontSize: 9,
                                                                                                                                                                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                                                                                                                                                                background:
                                                                                                                                                                                                                                                                                                                                                                        task.risk ===
                                                                                                                                                                                                                                                                                                                                                                        'Low'
                                                                                                                                                                                                                                                                                                                                                                                                ? 'rgba(74,222,128,0.1)'
                                                                                                                                                                                                                                                                                                                                                                                                : 'rgba(251,146,60,0.1)',
                                                                                                                                                                                                                                                                                                                                                color:
                                                                                                                                                                                                                                                                                                                                                                        task.risk ===
                                                                                                                                                                                                                                                                                                                                                                        'Low'
                                                                                                                                                                                                                                                                                                                                                                                                ? '#4ade80'
                                                                                                                                                                                                                                                                                                                                                                                                : '#fb923c',
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        Risk:{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                task.risk
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                marginLeft: 'auto',
                                                                                                                                                                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                                                                                                                                                                fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.4)',
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                task.estimated_days
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        Days
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <h4
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                                                                                                                        fontSize: 13,
                                                                                                                                                                                                                                                                                                                        fontWeight: 750,
                                                                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.9)',
                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        task.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                                                                        <p
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.5)',
                                                                                                                                                                                                                                                                                                                        lineHeight: 1.5,
                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        task.rationale
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        marginTop: 4,
                                                                                                                                                                                                                                                                                                                        paddingTop: 6,
                                                                                                                                                                                                                                                                                                                        borderTop: '1px solid rgba(255,255,255,0.04)',
                                                                                                                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                                                                                                                        justifyContent: 'space-between',
                                                                                                                                                                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.3)',
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        Target:{' '}
                                                                                                                                                                                                                                                                                                                        <strong
                                                                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                                                                        color: '#38bdf8',
                                                                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        task.target_component
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                color: '#4ade80',
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        Expected
                                                                                                                                                                                                                                                                                                                        Improvement:{' '}
                                                                                                                                                                                                                                                                                                                        <strong>
                                                                                                                                                                                                                                                                                                                                                +
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        task.expected_improvement_pct
                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

// ─── Tab: Multi-Level Recommendations (Feature 10) ───────────────────────────
function MultiLevelTab({ report }: { report: MultiLevelReport }) {
                        const [activeScope, setActiveScope] = useState<string>('All');
                        const scopes = [
                                                'All',
                                                'Function',
                                                'Class',
                                                'Module',
                                                'Service',
                                                'Repository',
                                                'Enterprise',
                        ];
                        const filtered =
                                                activeScope === 'All'
                                                                        ? report.recommendations
                                                                        : report.recommendations.filter(
                                                                                                  (
                                                                                                                          r
                                                                                                  ) =>
                                                                                                                          r.scope ===
                                                                                                                          activeScope
                                                                          );
                        return (
                                                <div>
                                                                        <div
                                                                                                style={{
                                                                                                                        padding: '12px 18px',
                                                                                                                        borderRadius: 12,
                                                                                                                        background: 'linear-gradient(135deg,rgba(56,189,248,0.1),rgba(167,139,250,0.06))',
                                                                                                                        border: '1px solid rgba(56,189,248,0.2)',
                                                                                                                        marginBottom: 20,
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'center',
                                                                                                                        gap: 12,
                                                                                                }}
                                                                        >
                                                                                                <span
                                                                                                                        style={{
                                                                                                                                                fontSize: 20,
                                                                                                                        }}
                                                                                                >
                                                                                                                        🗂️
                                                                                                </span>
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                flex: 1,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                        color: '#38bdf8',
                                                                                                                                                                        letterSpacing: '0.12em',
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        marginBottom: 3,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Multi-Level
                                                                                                                                                Recommendation
                                                                                                                                                Engine
                                                                                                                        </div>
                                                                                                                        <p
                                                                                                                                                style={{
                                                                                                                                                                        margin: 0,
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        color: 'rgba(255,255,255,0.8)',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                Nested
                                                                                                                                                architectural
                                                                                                                                                boundary
                                                                                                                                                diagnostic
                                                                                                                                                advice.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'flex',
                                                                                                                        gap: 6,
                                                                                                                        marginBottom: 18,
                                                                                                                        flexWrap: 'wrap',
                                                                                                                        padding: '5px',
                                                                                                                        background: 'rgba(255,255,255,0.03)',
                                                                                                                        borderRadius: 10,
                                                                                                                        border: '1px solid rgba(255,255,255,0.06)',
                                                                                                                        width: 'fit-content',
                                                                                                }}
                                                                        >
                                                                                                {scopes.map(
                                                                                                                        (
                                                                                                                                                sc
                                                                                                                        ) => (
                                                                                                                                                <button
                                                                                                                                                                        key={
                                                                                                                                                                                                sc
                                                                                                                                                                        }
                                                                                                                                                                        id={`scope-tab-${sc}`}
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                setActiveScope(
                                                                                                                                                                                                                        sc
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '7px 14px',
                                                                                                                                                                                                borderRadius: 8,
                                                                                                                                                                                                border: 'none',
                                                                                                                                                                                                background:
                                                                                                                                                                                                                        activeScope ===
                                                                                                                                                                                                                        sc
                                                                                                                                                                                                                                                ? 'rgba(56,189,248,0.15)'
                                                                                                                                                                                                                                                : 'transparent',
                                                                                                                                                                                                color:
                                                                                                                                                                                                                        activeScope ===
                                                                                                                                                                                                                        sc
                                                                                                                                                                                                                                                ? '#38bdf8'
                                                                                                                                                                                                                                                : 'rgba(255,255,255,0.38)',
                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                fontWeight:
                                                                                                                                                                                                                        activeScope ===
                                                                                                                                                                                                                        sc
                                                                                                                                                                                                                                                ? 700
                                                                                                                                                                                                                                                : 500,
                                                                                                                                                                                                cursor: 'pointer',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                sc
                                                                                                                                                                        }
                                                                                                                                                </button>
                                                                                                                        )
                                                                                                )}
                                                                        </div>

                                                                        <div
                                                                                                style={{
                                                                                                                        display: 'grid',
                                                                                                                        gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
                                                                                                                        gap: 14,
                                                                                                }}
                                                                        >
                                                                                                {filtered.map(
                                                                                                                        (
                                                                                                                                                rec
                                                                                                                        ) => (
                                                                                                                                                <div
                                                                                                                                                                        key={
                                                                                                                                                                                                rec.id
                                                                                                                                                                        }
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: 20,
                                                                                                                                                                                                borderRadius: 16,
                                                                                                                                                                                                background: 'linear-gradient(160deg,rgba(10,10,22,0.96),rgba(16,16,32,0.98))',
                                                                                                                                                                                                border: '1px solid rgba(255,255,255,0.05)',
                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                flexDirection: 'column',
                                                                                                                                                                                                gap: 8,
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                                                                        gap: 8,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                <span
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                padding: '2px 8px',
                                                                                                                                                                                                                                                borderRadius: 20,
                                                                                                                                                                                                                                                fontSize: 9,
                                                                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                                                                background: 'rgba(56,189,248,0.15)',
                                                                                                                                                                                                                                                color: '#38bdf8',
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                rec.scope
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        Scope
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                                                                fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.45)',
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                rec.target_name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <h4
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                        fontSize: 13,
                                                                                                                                                                                                                        fontWeight: 750,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.9)',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        rec.title
                                                                                                                                                                                                }
                                                                                                                                                                        </h4>
                                                                                                                                                                        <p
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.5)',
                                                                                                                                                                                                                        lineHeight: 1.55,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        rec.recommendation
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        padding: '10px 12px',
                                                                                                                                                                                                                        borderRadius: 8,
                                                                                                                                                                                                                        background: 'rgba(255,255,255,0.02)',
                                                                                                                                                                                                                        border: '1px solid rgba(255,255,255,0.06)',
                                                                                                                                                                                                                        marginTop: 4,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                fontSize: 9,
                                                                                                                                                                                                                                                fontWeight: 850,
                                                                                                                                                                                                                                                color: '#38bdf8',
                                                                                                                                                                                                                                                textTransform: 'uppercase',
                                                                                                                                                                                                                                                letterSpacing: '0.06em',
                                                                                                                                                                                                                                                marginBottom: 4,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        Suggested
                                                                                                                                                                                                                        Fix
                                                                                                                                                                                                                        Blueprint
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <code
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                fontSize: 10.5,
                                                                                                                                                                                                                                                fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.8)',
                                                                                                                                                                                                                                                lineHeight: 1.5,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                rec.suggested_fix
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </code>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                        gap: 12,
                                                                                                                                                                                                                        marginTop: 6,
                                                                                                                                                                                                                        borderTop: '1px solid rgba(255,255,255,0.03)',
                                                                                                                                                                                                                        paddingTop: 8,
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.3)',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        Impact:{' '}
                                                                                                                                                                                                                        <strong
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        color: '#4ade80',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        rec.impact
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        Effort:{' '}
                                                                                                                                                                                                                        <strong
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        color: '#fb923c',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        rec.effort
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ArchitectPage() {
                        const searchParams = useSearchParams();
                        const repoId = searchParams?.get('repo') || 'demo';

                        const [mainTab, setMainTab] = useState<
                                                | 'recommendations'
                                                | 'patterns'
                                                | 'scalability'
                                                | 'refactoring'
                                                | 'coupling'
                                                | 'adrs'
                                                | 'review'
                                                | 'sprints'
                                                | 'multilevel'
                                                | 'roadmap'
                        >('recommendations');
                        const [recReport, setRecReport] = useState<RecReport | null>(null);
                        const [patReport, setPatReport] = useState<PatternReport | null>(null);
                        const [sclReport, setSclReport] = useState<ScalabilityReport | null>(null);
                        const [refReport, setRefReport] = useState<RefactoringReport | null>(null);
                        const [cplReport, setCplReport] = useState<CouplingReport | null>(null);
                        const [adrReport, setAdrReport] = useState<ADRReport | null>(null);
                        const [reviewReport, setReviewReport] = useState<AIReviewReport | null>(
                                                null
                        );
                        const [sprintReport, setSprintReport] = useState<SprintReport | null>(null);
                        const [multiLevelReport, setMultiLevelReport] =
                                                useState<MultiLevelReport | null>(null);
                        const [roadmapReport, setRoadmapReport] = useState<RoadmapReport | null>(
                                                null
                        );
                        const [copilotReport, setCopilotReport] = useState<CopilotReport | null>(
                                                null
                        );
                        const [loading, setLoading] = useState(true);
                        const [reanalyzing, setReanalyzing] = useState(false);
                        const [copilotOpen, setCopilotOpen] = useState(false);

                        // Interactive matrix node highlighter state
                        const [selectedRecId, setSelectedRecId] = useState<string | null>(null);

                        const fetchAll = useCallback(async (rid: string) => {
                                                setLoading(true);
                                                const token =
                                                                        typeof window !==
                                                                        'undefined'
                                                                                                ? localStorage.getItem(
                                                                                                                          'access_token'
                                                                                                  )
                                                                                                : null;
                                                const headers: HeadersInit = token
                                                                        ? {
                                                                                                  Authorization: `Bearer ${token}`,
                                                                          }
                                                                        : {};
                                                const base = `/api/v1/repositories/${rid}/architect`;
                                                try {
                                                                        const [
                                                                                                rRec,
                                                                                                rPat,
                                                                                                rScl,
                                                                                                rRef,
                                                                                                rCpl,
                                                                                                rAdr,
                                                                                                rRev,
                                                                                                rSpr,
                                                                                                rMlv,
                                                                                                rRod,
                                                                                                rCop,
                                                                        ] = await Promise.all([
                                                                                                fetch(
                                                                                                                        `${base}/recommendations`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/patterns`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/scalability`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/refactoring`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/coupling`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/adrs`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/review`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/sprints`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/multi-level`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/roadmap`,
                                                                                                                        {
                                                                                                                                                method: 'POST',
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                                                fetch(
                                                                                                                        `${base}/copilot`,
                                                                                                                        {
                                                                                                                                                headers,
                                                                                                                        }
                                                                                                ).then(
                                                                                                                        (
                                                                                                                                                r
                                                                                                                        ) =>
                                                                                                                                                r.ok
                                                                                                                                                                        ? r.json()
                                                                                                                                                                        : null
                                                                                                ),
                                                                        ]);
                                                                        setRecReport(
                                                                                                rRec ||
                                                                                                                        MOCK_RECS
                                                                        );
                                                                        setPatReport(
                                                                                                rPat ||
                                                                                                                        MOCK_PATTERNS
                                                                        );
                                                                        setSclReport(
                                                                                                rScl ||
                                                                                                                        MOCK_SCALABILITY
                                                                        );
                                                                        setRefReport(
                                                                                                rRef ||
                                                                                                                        MOCK_REFACTORING
                                                                        );
                                                                        setCplReport(
                                                                                                rCpl ||
                                                                                                                        MOCK_COUPLING
                                                                        );
                                                                        setAdrReport(
                                                                                                rAdr ||
                                                                                                                        MOCK_ADR
                                                                        );
                                                                        setReviewReport(
                                                                                                rRev ||
                                                                                                                        MOCK_REVIEW
                                                                        );
                                                                        setSprintReport(
                                                                                                rSpr ||
                                                                                                                        MOCK_SPRINT
                                                                        );
                                                                        setMultiLevelReport(
                                                                                                rMlv ||
                                                                                                                        MOCK_MULTILEVEL
                                                                        );
                                                                        setRoadmapReport(
                                                                                                rRod ||
                                                                                                                        MOCK_ROADMAP
                                                                        );
                                                                        setCopilotReport(
                                                                                                rCop ||
                                                                                                                        MOCK_COPILOT
                                                                        );
                                                } catch {
                                                                        setRecReport(MOCK_RECS);
                                                                        setPatReport(MOCK_PATTERNS);
                                                                        setSclReport(
                                                                                                MOCK_SCALABILITY
                                                                        );
                                                                        setRefReport(
                                                                                                MOCK_REFACTORING
                                                                        );
                                                                        setCplReport(MOCK_COUPLING);
                                                                        setAdrReport(MOCK_ADR);
                                                                        setReviewReport(
                                                                                                MOCK_REVIEW
                                                                        );
                                                                        setSprintReport(
                                                                                                MOCK_SPRINT
                                                                        );
                                                                        setMultiLevelReport(
                                                                                                MOCK_MULTILEVEL
                                                                        );
                                                                        setRoadmapReport(
                                                                                                MOCK_ROADMAP
                                                                        );
                                                                        setCopilotReport(
                                                                                                MOCK_COPILOT
                                                                        );
                                                } finally {
                                                                        setLoading(false);
                                                }
                        }, []);

                        useEffect(() => {
                                                fetchAll(repoId);
                        }, [repoId, fetchAll]);
                        const handleReanalyze = async () => {
                                                setReanalyzing(true);
                                                const token =
                                                                        typeof window !==
                                                                        'undefined'
                                                                                                ? localStorage.getItem(
                                                                                                                          'access_token'
                                                                                                  )
                                                                                                : null;
                                                const headers: HeadersInit = token
                                                                        ? {
                                                                                                  Authorization: `Bearer ${token}`,
                                                                          }
                                                                        : {};
                                                try {
                                                                        await fetch(
                                                                                                `/api/v1/repositories/${repoId}/architect/analyze`,
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers,
                                                                                                }
                                                                        );
                                                } catch {}
                                                await fetchAll(repoId);
                                                setReanalyzing(false);
                        };

                        const MAIN_TABS = [
                                                {
                                                                        key: 'recommendations' as const,
                                                                        label: 'Recommendations',
                                                                        icon: '🎯',
                                                                        badge: recReport?.total_recommendations,
                                                },
                                                {
                                                                        key: 'patterns' as const,
                                                                        label: 'Pattern Advisor',
                                                                        icon: '◈',
                                                                        badge: patReport?.total_applicable,
                                                },
                                                {
                                                                        key: 'scalability' as const,
                                                                        label: 'Scalability Advisor',
                                                                        icon: '📡',
                                                                        badge: sclReport?.total_issues,
                                                },
                                                {
                                                                        key: 'refactoring' as const,
                                                                        label: 'Refactoring Advisor',
                                                                        icon: '⚙️',
                                                                        badge: refReport?.total_plans,
                                                },
                                                {
                                                                        key: 'coupling' as const,
                                                                        label: 'Coupling Advisor',
                                                                        icon: '🔌',
                                                                        badge: cplReport?.total_issues,
                                                },
                                                {
                                                                        key: 'adrs' as const,
                                                                        label: 'ADR Generator',
                                                                        icon: '🖋️',
                                                                        badge: adrReport?.total_proposals,
                                                },
                                                {
                                                                        key: 'review' as const,
                                                                        label: 'AI Review',
                                                                        icon: '📋',
                                                },
                                                {
                                                                        key: 'sprints' as const,
                                                                        label: 'Sprint Engine',
                                                                        icon: '🏃',
                                                },
                                                {
                                                                        key: 'multilevel' as const,
                                                                        label: 'Multi-Level Advice',
                                                                        icon: '🗂️',
                                                                        badge: multiLevelReport
                                                                                                ?.recommendations
                                                                                                .length,
                                                },
                                                {
                                                                        key: 'roadmap' as const,
                                                                        label: 'Roadmap',
                                                                        icon: '🗺️',
                                                                        badge: roadmapReport
                                                                                                ?.milestones
                                                                                                .length,
                                                },
                        ];

                        // Derived stats for Feature 12 (Architecture Dashboard)
                        const activeCount = recReport?.total_recommendations || 0;
                        const topRec =
                                                recReport?.top_priority_recommendation ||
                                                (recReport?.recommendations &&
                                                                        recReport
                                                                                                .recommendations[0]);
                        const priorityScore = topRec?.composite_priority_score
                                                ? Math.round(topRec.composite_priority_score)
                                                : 86;
                        const healthImprovement = topRec?.expected_improvement || '+18%';
                        const riskReduction = topRec?.risk_reduction_score
                                                ? `${Math.round(topRec.risk_reduction_score)}%`
                                                : '97%';
                        const costEstimate = refReport?.total_effort_weeks
                                                ? `${refReport.total_effort_weeks} Weeks`
                                                : '4 Weeks';
                        const sprintPlanName = sprintReport?.sprints?.[0]?.sprint_name
                                                ? `${sprintReport.sprints[0].sprint_name} Backlog`
                                                : 'Sprint 14 Backlog';

                        return (
                                                <>
                                                                        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:3px}
        @keyframes slide-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slide-left{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(500%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes glow{0%,100%{box-shadow:0 0 15px rgba(248,113,113,0.3)}50%{box-shadow:0 0 25px rgba(248,113,113,0.6)}}
        .copilot-card:hover{border-color:rgba(255,255,255,0.18) !important;background:rgba(255,255,255,0.04) !important}
      `}</style>
                                                                        <div
                                                                                                style={{
                                                                                                                        minHeight: '100vh',
                                                                                                                        background: 'linear-gradient(140deg,#07090f 0%,#0d1120 50%,#0f1128 100%)',
                                                                                                                        color: '#fff',
                                                                                                                        fontFamily: "'Inter',-apple-system,sans-serif",
                                                                                                                        padding: '24px 28px',
                                                                                                }}
                                                                        >
                                                                                                {/* ── Header ── */}
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                display: 'flex',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                justifyContent: 'space-between',
                                                                                                                                                marginBottom: 22,
                                                                                                                        }}
                                                                                                >
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                        gap: 14,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                width: 44,
                                                                                                                                                                                                height: 44,
                                                                                                                                                                                                borderRadius: 14,
                                                                                                                                                                                                background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                alignItems: 'center',
                                                                                                                                                                                                justifyContent: 'center',
                                                                                                                                                                                                fontSize: 22,
                                                                                                                                                                                                boxShadow: '0 0 24px rgba(167,139,250,.4)',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        🤖
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <h1
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                        fontSize: 22,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        background: 'linear-gradient(135deg,#a78bfa,#38bdf8)',
                                                                                                                                                                                                                        WebkitBackgroundClip: 'text',
                                                                                                                                                                                                                        WebkitTextFillColor: 'transparent',
                                                                                                                                                                                                                        letterSpacing: '-0.02em',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                AI
                                                                                                                                                                                                Software
                                                                                                                                                                                                Architect
                                                                                                                                                                        </h1>
                                                                                                                                                                        <p
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.38)',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Continuous
                                                                                                                                                                                                codebase
                                                                                                                                                                                                diagnostics
                                                                                                                                                                                                &
                                                                                                                                                                                                sprint
                                                                                                                                                                                                prioritizations.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                        gap: 10,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {recReport && (
                                                                                                                                                                        <span
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        padding: '5px 12px',
                                                                                                                                                                                                                        borderRadius: 8,
                                                                                                                                                                                                                        background: 'rgba(255,255,255,0.04)',
                                                                                                                                                                                                                        border: '1px solid rgba(255,255,255,0.07)',
                                                                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.35)',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Analyzed{' '}
                                                                                                                                                                                                {rel(
                                                                                                                                                                                                                        recReport.generated_at
                                                                                                                                                                                                )}
                                                                                                                                                                        </span>
                                                                                                                                                )}
                                                                                                                                                <button
                                                                                                                                                                        id="btn-reanalyze"
                                                                                                                                                                        onClick={
                                                                                                                                                                                                handleReanalyze
                                                                                                                                                                        }
                                                                                                                                                                        disabled={
                                                                                                                                                                                                loading ||
                                                                                                                                                                                                reanalyzing
                                                                                                                                                                        }
                                                                                                                                                                        style={{
                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                alignItems: 'center',
                                                                                                                                                                                                gap: 7,
                                                                                                                                                                                                padding: '8px 16px',
                                                                                                                                                                                                borderRadius: 10,
                                                                                                                                                                                                border: '1px solid rgba(167,139,250,.35)',
                                                                                                                                                                                                background: 'linear-gradient(135deg,rgba(124,58,237,.18),rgba(167,139,250,.08))',
                                                                                                                                                                                                color: '#a78bfa',
                                                                                                                                                                                                fontSize: 12,
                                                                                                                                                                                                fontWeight: 700,
                                                                                                                                                                                                cursor: loading
                                                                                                                                                                                                                        ? 'wait'
                                                                                                                                                                                                                        : 'pointer',
                                                                                                                                                                                                boxShadow: '0 0 12px rgba(167,139,250,.12)',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        {reanalyzing
                                                                                                                                                                                                ? '⟳ Analyzing…'
                                                                                                                                                                                                : '▶ Re-analyze'}
                                                                                                                                                </button>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* ── Feature 12: Executive Architecture Dashboard ── */}
                                                                                                {!loading && (
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'grid',
                                                                                                                                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                                                                                                                                                        gap: 14,
                                                                                                                                                                        marginBottom: 24,
                                                                                                                                                                        animation: 'slide-up .3s ease-out',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {/* Active Recs */}
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '14px 18px',
                                                                                                                                                                                                borderRadius: 14,
                                                                                                                                                                                                border: '1px solid rgba(167,139,250,0.18)',
                                                                                                                                                                                                background: 'linear-gradient(145deg,rgba(167,139,250,0.05),rgba(10,10,22,0.9))',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Active
                                                                                                                                                                                                recommendations
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 24,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.92)',
                                                                                                                                                                                                                        marginTop: 6,
                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        activeCount
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                Open
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Priority score */}
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '14px 18px',
                                                                                                                                                                                                borderRadius: 14,
                                                                                                                                                                                                border: '1px solid rgba(248,113,113,0.18)',
                                                                                                                                                                                                background: 'linear-gradient(145deg,rgba(248,113,113,0.05),rgba(10,10,22,0.9))',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                                                                        color: '#f87171',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Top
                                                                                                                                                                                                priority
                                                                                                                                                                                                score
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 24,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color: '#f87171',
                                                                                                                                                                                                                        marginTop: 6,
                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        priorityScore
                                                                                                                                                                                                }
                                                                                                                                                                                                <span
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                fontSize: 12,
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.3)',
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        /100
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Health potential */}
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '14px 18px',
                                                                                                                                                                                                borderRadius: 14,
                                                                                                                                                                                                border: '1px solid rgba(74,222,128,0.18)',
                                                                                                                                                                                                background: 'linear-gradient(145deg,rgba(74,222,128,0.05),rgba(10,10,22,0.9))',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                                                                        color: '#4ade80',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Health
                                                                                                                                                                                                improvement
                                                                                                                                                                                                potential
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 24,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color: '#4ade80',
                                                                                                                                                                                                                        marginTop: 6,
                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        healthImprovement
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Risk reduction */}
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '14px 18px',
                                                                                                                                                                                                borderRadius: 14,
                                                                                                                                                                                                border: '1px solid rgba(56,189,248,0.18)',
                                                                                                                                                                                                background: 'linear-gradient(145deg,rgba(56,189,248,0.05),rgba(10,10,22,0.9))',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                                                                        color: '#38bdf8',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Risk
                                                                                                                                                                                                reduction
                                                                                                                                                                                                score
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 24,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color: '#38bdf8',
                                                                                                                                                                                                                        marginTop: 6,
                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        riskReduction
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Est engineering cost */}
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '14px 18px',
                                                                                                                                                                                                borderRadius: 14,
                                                                                                                                                                                                border: '1px solid rgba(251,191,36,0.18)',
                                                                                                                                                                                                background: 'linear-gradient(145deg,rgba(251,191,36,0.05),rgba(10,10,22,0.9))',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                                                                        color: '#fbbf24',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Est.
                                                                                                                                                                                                engineering
                                                                                                                                                                                                cost
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 24,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color: '#fbbf24',
                                                                                                                                                                                                                        marginTop: 6,
                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        costEstimate
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Sprint plan summary */}
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                padding: '14px 18px',
                                                                                                                                                                                                borderRadius: 14,
                                                                                                                                                                                                border: '1px solid rgba(232,121,249,0.18)',
                                                                                                                                                                                                background: 'linear-gradient(145deg,rgba(232,121,249,0.05),rgba(10,10,22,0.9))',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                                                                        color: '#e879f9',
                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                        letterSpacing: '0.06em',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Suggested
                                                                                                                                                                                                sprint
                                                                                                                                                                                                plan
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 18,
                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.92)',
                                                                                                                                                                                                                        marginTop: 12,
                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        sprintPlanName
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* ── Main Tab Bar ── */}
                                                                                                <div
                                                                                                                        style={{
                                                                                                                                                display: 'flex',
                                                                                                                                                gap: 4,
                                                                                                                                                marginBottom: 24,
                                                                                                                                                background: 'rgba(255,255,255,0.025)',
                                                                                                                                                borderRadius: 14,
                                                                                                                                                padding: '6px',
                                                                                                                                                border: '1px solid rgba(255,255,255,0.06)',
                                                                                                                                                width: 'fit-content',
                                                                                                                                                flexWrap: 'wrap',
                                                                                                                        }}
                                                                                                >
                                                                                                                        {MAIN_TABS.map(
                                                                                                                                                ({
                                                                                                                                                                        key,
                                                                                                                                                                        label,
                                                                                                                                                                        icon,
                                                                                                                                                                        badge,
                                                                                                                                                }) => (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        key
                                                                                                                                                                                                }
                                                                                                                                                                                                id={`main-tab-${key}`}
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setMainTab(
                                                                                                                                                                                                                                                key
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                                                                        gap: 8,
                                                                                                                                                                                                                        padding: '10px 20px',
                                                                                                                                                                                                                        borderRadius: 10,
                                                                                                                                                                                                                        border: 'none',
                                                                                                                                                                                                                        background:
                                                                                                                                                                                                                                                mainTab ===
                                                                                                                                                                                                                                                key
                                                                                                                                                                                                                                                                        ? 'rgba(167,139,250,0.15)'
                                                                                                                                                                                                                                                                        : 'transparent',
                                                                                                                                                                                                                        color:
                                                                                                                                                                                                                                                mainTab ===
                                                                                                                                                                                                                                                key
                                                                                                                                                                                                                                                                        ? '#a78bfa'
                                                                                                                                                                                                                                                                        : 'rgba(255,255,255,0.4)',
                                                                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                                                                        fontWeight:
                                                                                                                                                                                                                                                mainTab ===
                                                                                                                                                                                                                                                key
                                                                                                                                                                                                                                                                        ? 700
                                                                                                                                                                                                                                                                        : 500,
                                                                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                                                                        borderBottom:
                                                                                                                                                                                                                                                mainTab ===
                                                                                                                                                                                                                                                key
                                                                                                                                                                                                                                                                        ? '2px solid #a78bfa'
                                                                                                                                                                                                                                                                        : '2px solid transparent',
                                                                                                                                                                                                                        position: 'relative' as const,
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                icon
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                label
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                                                {badge !==
                                                                                                                                                                                                                        undefined &&
                                                                                                                                                                                                                        badge >
                                                                                                                                                                                                                                                0 && (
                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                padding: '1px 7px',
                                                                                                                                                                                                                                                                                                borderRadius: 20,
                                                                                                                                                                                                                                                                                                fontSize: 10,
                                                                                                                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                                                                                                                background:
                                                                                                                                                                                                                                                                                                                        mainTab ===
                                                                                                                                                                                                                                                                                                                        key
                                                                                                                                                                                                                                                                                                                                                ? 'rgba(167,139,250,0.25)'
                                                                                                                                                                                                                                                                                                                                                : 'rgba(255,255,255,0.08)',
                                                                                                                                                                                                                                                                                                color:
                                                                                                                                                                                                                                                                                                                        mainTab ===
                                                                                                                                                                                                                                                                                                                        key
                                                                                                                                                                                                                                                                                                                                                ? '#a78bfa'
                                                                                                                                                                                                                                                                                                                                                : 'rgba(255,255,255,0.5)',
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                badge
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        )}
                                                                                                                                                                        </button>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>

                                                                                                {/* ── Loading ── */}
                                                                                                {loading && (
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                        justifyContent: 'center',
                                                                                                                                                                        minHeight: 380,
                                                                                                                                                                        gap: 18,
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                width: 68,
                                                                                                                                                                                                height: 68,
                                                                                                                                                                                                borderRadius: 20,
                                                                                                                                                                                                background: 'rgba(124,58,237,.2)',
                                                                                                                                                                                                border: '2px solid rgba(167,139,250,.4)',
                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                alignItems: 'center',
                                                                                                                                                                                                justifyContent: 'center',
                                                                                                                                                                                                fontSize: 30,
                                                                                                                                                                                                position: 'relative',
                                                                                                                                                                                                overflow: 'hidden',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        🤖
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        position: 'absolute',
                                                                                                                                                                                                                        top: 0,
                                                                                                                                                                                                                        left: 0,
                                                                                                                                                                                                                        right: 0,
                                                                                                                                                                                                                        height: '28%',
                                                                                                                                                                                                                        background: 'linear-gradient(180deg,rgba(167,139,250,.4),transparent)',
                                                                                                                                                                                                                        animation: 'scan 1.8s linear infinite',
                                                                                                                                                                                                }}
                                                                                                                                                                        />
                                                                                                                                                </div>
                                                                                                                                                <div
                                                                                                                                                                        style={{
                                                                                                                                                                                                textAlign: 'center',
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 15,
                                                                                                                                                                                                                        fontWeight: 700,
                                                                                                                                                                                                                        color: '#a78bfa',
                                                                                                                                                                                                                        marginBottom: 5,
                                                                                                                                                                                                                        animation: 'pulse 2s ease-in-out infinite',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Reasoning
                                                                                                                                                                                                Engine
                                                                                                                                                                                                Active
                                                                                                                                                                        </div>
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        fontSize: 11,
                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.32)',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                Populating
                                                                                                                                                                                                dashboard
                                                                                                                                                                                                metrics
                                                                                                                                                                                                ·
                                                                                                                                                                                                Evaluating
                                                                                                                                                                                                architectural
                                                                                                                                                                                                tradeoffs…
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* ── Tab Content ── */}
                                                                                                {!loading && (
                                                                                                                        <div
                                                                                                                                                style={{
                                                                                                                                                                        animation: 'slide-up .4s ease-out',
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'recommendations' &&
                                                                                                                                                                        recReport && (
                                                                                                                                                                                                <RecommendationsTab
                                                                                                                                                                                                                        report={
                                                                                                                                                                                                                                                recReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        selectedId={
                                                                                                                                                                                                                                                selectedRecId
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onSelectRec={
                                                                                                                                                                                                                                                setSelectedRecId
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'patterns' &&
                                                                                                                                                                        patReport && (
                                                                                                                                                                                                <PatternAdvisorTab
                                                                                                                                                                                                                        report={
                                                                                                                                                                                                                                                patReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'scalability' &&
                                                                                                                                                                        sclReport && (
                                                                                                                                                                                                <ScalabilityTab
                                                                                                                                                                                                                        report={
                                                                                                                                                                                                                                                sclReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'refactoring' &&
                                                                                                                                                                        refReport && (
                                                                                                                                                                                                <RefactoringTab
                                                                                                                                                                                                                        report={
                                                                                                                                                                                                                                                refReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'coupling' &&
                                                                                                                                                                        cplReport && (
                                                                                                                                                                                                <CouplingTab
                                                                                                                                                                                                                        report={
                                                                                                                                                                                                                                                cplReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'adrs' &&
                                                                                                                                                                        adrReport && (
                                                                                                                                                                                                <AdrGeneratorTab
                                                                                                                                                                                                                        report={
                                                                                                                                                                                                                                                adrReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'review' &&
                                                                                                                                                                        reviewReport && (
                                                                                                                                                                                                <AIReviewTab
                                                                                                                                                                                                                        report={
                                                                                                                                                                                                                                                reviewReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'sprints' &&
                                                                                                                                                                        sprintReport && (
                                                                                                                                                                                                <SprintTab
                                                                                                                                                                                                                        report={
                                                                                                                                                                                                                                                sprintReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'multilevel' &&
                                                                                                                                                                        multiLevelReport && (
                                                                                                                                                                                                <MultiLevelTab
                                                                                                                                                                                                                        report={
                                                                                                                                                                                                                                                multiLevelReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                                                {mainTab ===
                                                                                                                                                                        'roadmap' &&
                                                                                                                                                                        roadmapReport && (
                                                                                                                                                                                                <ArchitectureRoadmap
                                                                                                                                                                                                                        roadmap={
                                                                                                                                                                                                                                                roadmapReport
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        )}
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* ── Flagship Feature: Floating Copilot Action Badge ── */}
                                                                                                {!loading && (
                                                                                                                        <div
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setCopilotOpen(
                                                                                                                                                                                                true
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                style={{
                                                                                                                                                                        position: 'fixed',
                                                                                                                                                                        bottom: 24,
                                                                                                                                                                        right: 24,
                                                                                                                                                                        zIndex: 999,
                                                                                                                                                                        padding: '12px 20px',
                                                                                                                                                                        borderRadius: 30,
                                                                                                                                                                        background: 'rgba(239,68,68,0.92)',
                                                                                                                                                                        border: '2.5px solid rgba(255,255,255,0.22)',
                                                                                                                                                                        color: '#fff',
                                                                                                                                                                        fontSize: 12,
                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                        display: 'flex',
                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                        gap: 8,
                                                                                                                                                                        animation: 'glow 2s infinite',
                                                                                                                                                                        boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
                                                                                                                                                                        letterSpacing: '0.04em',
                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                }}
                                                                                                                        >
                                                                                                                                                <span>
                                                                                                                                                                        🚨
                                                                                                                                                </span>
                                                                                                                                                <span>
                                                                                                                                                                        Weekly
                                                                                                                                                                        Architecture
                                                                                                                                                                        Review
                                                                                                                                                                        (Health:{' '}
                                                                                                                                                                        {copilotReport?.health_score ||
                                                                                                                                                                                                86}
                                                                                                                                                                        /100)
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* ── Flagship Feature: Copilot Slide Drawer ── */}
                                                                                                {copilotOpen &&
                                                                                                                        copilotReport && (
                                                                                                                                                <>
                                                                                                                                                                        {/* Backdrop */}
                                                                                                                                                                        <div
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setCopilotOpen(
                                                                                                                                                                                                                                                false
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        position: 'fixed',
                                                                                                                                                                                                                        inset: 0,
                                                                                                                                                                                                                        background: 'rgba(0,0,0,0.5)',
                                                                                                                                                                                                                        backdropFilter: 'blur(4px)',
                                                                                                                                                                                                                        zIndex: 1000,
                                                                                                                                                                                                }}
                                                                                                                                                                        />

                                                                                                                                                                        {/* Drawer */}
                                                                                                                                                                        <div
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        position: 'fixed',
                                                                                                                                                                                                                        top: 0,
                                                                                                                                                                                                                        right: 0,
                                                                                                                                                                                                                        bottom: 0,
                                                                                                                                                                                                                        width: 420,
                                                                                                                                                                                                                        background: 'linear-gradient(155deg,#090b14 0%,#0e1224 100%)',
                                                                                                                                                                                                                        borderLeft: '1.5px solid rgba(255,255,255,0.08)',
                                                                                                                                                                                                                        zIndex: 1001,
                                                                                                                                                                                                                        boxShadow: '-12px 0 35px rgba(0,0,0,0.6)',
                                                                                                                                                                                                                        padding: '24px 28px',
                                                                                                                                                                                                                        animation: 'slide-left 0.3s ease-out',
                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                justifyContent: 'space-between',
                                                                                                                                                                                                                                                alignItems: 'center',
                                                                                                                                                                                                                                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                                                                                                                                                                                                                                paddingBottom: 16,
                                                                                                                                                                                                                                                marginBottom: 18,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                                                                                                                        gap: 10,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                fontSize: 24,
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        🚨
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <h2
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                                                                                                                        fontSize: 15,
                                                                                                                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.95)',
                                                                                                                                                                                                                                                                                                                        letterSpacing: '0.04em',
                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                Weekly
                                                                                                                                                                                                                                                                                                Architecture
                                                                                                                                                                                                                                                                                                Review
                                                                                                                                                                                                                                                                        </h2>
                                                                                                                                                                                                                                                                        <p
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                                                                                                                        fontSize: 10,
                                                                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.45)',
                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                Proactive
                                                                                                                                                                                                                                                                                                Copilot
                                                                                                                                                                                                                                                                                                opportunity
                                                                                                                                                                                                                                                                                                scanner
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        setCopilotOpen(
                                                                                                                                                                                                                                                                                                false
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        background: 'transparent',
                                                                                                                                                                                                                                                                        border: 'none',
                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.4)',
                                                                                                                                                                                                                                                                        fontSize: 18,
                                                                                                                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                ×
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                {/* Health Score Segment */}
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                padding: 16,
                                                                                                                                                                                                                                                borderRadius: 12,
                                                                                                                                                                                                                                                background: 'linear-gradient(135deg,rgba(239,68,68,0.1),rgba(124,58,237,0.06))',
                                                                                                                                                                                                                                                border: '1px solid rgba(239,68,68,0.2)',
                                                                                                                                                                                                                                                marginBottom: 20,
                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                alignItems: 'center',
                                                                                                                                                                                                                                                gap: 16,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        width: 54,
                                                                                                                                                                                                                                                                        height: 54,
                                                                                                                                                                                                                                                                        borderRadius: '50%',
                                                                                                                                                                                                                                                                        border: '3px solid #ef4444',
                                                                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                                                                                                                        justifyContent: 'center',
                                                                                                                                                                                                                                                                        fontSize: 18,
                                                                                                                                                                                                                                                                        fontWeight: 900,
                                                                                                                                                                                                                                                                        color: '#ef4444',
                                                                                                                                                                                                                                                                        fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        copilotReport.health_score
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                fontSize: 10,
                                                                                                                                                                                                                                                                                                fontWeight: 800,
                                                                                                                                                                                                                                                                                                color: '#ef4444',
                                                                                                                                                                                                                                                                                                textTransform: 'uppercase',
                                                                                                                                                                                                                                                                                                letterSpacing: '0.06em',
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                                                                        Health
                                                                                                                                                                                                                                                                        Index
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                margin: '2px 0 0',
                                                                                                                                                                                                                                                                                                fontSize: 11.5,
                                                                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.7)',
                                                                                                                                                                                                                                                                                                lineHeight: 1.45,
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        Proactive
                                                                                                                                                                                                                                                                        health
                                                                                                                                                                                                                                                                        index
                                                                                                                                                                                                                                                                        indicates
                                                                                                                                                                                                                                                                        critical
                                                                                                                                                                                                                                                                        coupling
                                                                                                                                                                                                                                                                        issues.
                                                                                                                                                                                                                                                                        Address
                                                                                                                                                                                                                                                                        the
                                                                                                                                                                                                                                                                        opportunities
                                                                                                                                                                                                                                                                        below.
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                {/* Top 5 Opportunities List */}
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                fontSize: 10,
                                                                                                                                                                                                                                                fontWeight: 850,
                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.35)',
                                                                                                                                                                                                                                                textTransform: 'uppercase',
                                                                                                                                                                                                                                                letterSpacing: '0.08em',
                                                                                                                                                                                                                                                marginBottom: 10,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        Top
                                                                                                                                                                                                                        5
                                                                                                                                                                                                                        Opportunities
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                flex: 1,
                                                                                                                                                                                                                                                overflowY: 'auto',
                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                flexDirection: 'column',
                                                                                                                                                                                                                                                gap: 12,
                                                                                                                                                                                                                                                paddingRight: 6,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {copilotReport.opportunities.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        opp,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        opp.id
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        padding: 14,
                                                                                                                                                                                                                                                                                                                        borderRadius: 12,
                                                                                                                                                                                                                                                                                                                        background: 'rgba(255,255,255,0.02)',
                                                                                                                                                                                                                                                                                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                                                                                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                                                                                                                        flexDirection: 'column',
                                                                                                                                                                                                                                                                                                                        gap: 6,
                                                                                                                                                                                                                                                                                                                        transition: 'border-color 0.2s',
                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                                                className="copilot-card"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                                                                                                                alignItems: 'center',
                                                                                                                                                                                                                                                                                                                                                gap: 8,
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                                                                        width: 20,
                                                                                                                                                                                                                                                                                                                                                                        height: 20,
                                                                                                                                                                                                                                                                                                                                                                        borderRadius: '50%',
                                                                                                                                                                                                                                                                                                                                                                        background: 'rgba(255,255,255,0.05)',
                                                                                                                                                                                                                                                                                                                                                                        display: 'flex',
                                                                                                                                                                                                                                                                                                                                                                        alignItems: 'center',
                                                                                                                                                                                                                                                                                                                                                                        justifyContent: 'center',
                                                                                                                                                                                                                                                                                                                                                                        fontSize: 10.5,
                                                                                                                                                                                                                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.5)',
                                                                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                {idx +
                                                                                                                                                                                                                                                                                                                                                                        1}
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                        <h4
                                                                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                                                                        margin: 0,
                                                                                                                                                                                                                                                                                                                                                                        fontSize: 12.5,
                                                                                                                                                                                                                                                                                                                                                                        fontWeight: 750,
                                                                                                                                                                                                                                                                                                                                                                        color: 'rgba(255,255,255,0.92)',
                                                                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        opp.title
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <p
                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                margin: 0,
                                                                                                                                                                                                                                                                                                                                                fontSize: 11,
                                                                                                                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.5)',
                                                                                                                                                                                                                                                                                                                                                lineHeight: 1.45,
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                opp.metrics_summary
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                display: 'flex',
                                                                                                                                                                                                                                                                                                                                                gap: 10,
                                                                                                                                                                                                                                                                                                                                                marginTop: 4,
                                                                                                                                                                                                                                                                                                                                                fontSize: 9.5,
                                                                                                                                                                                                                                                                                                                                                color: 'rgba(255,255,255,0.3)',
                                                                                                                                                                                                                                                                                                                                                fontFamily: "'Fira Code',monospace",
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                                                                Impact:{' '}
                                                                                                                                                                                                                                                                                                                                                <strong
                                                                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                                                                color: '#f87171',
                                                                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                opp.impact
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                </strong>
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                                                                Effort:{' '}
                                                                                                                                                                                                                                                                                                                                                <strong
                                                                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                                                                color: '#fb923c',
                                                                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                opp.effort
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                </strong>
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                                                                Confidence:{' '}
                                                                                                                                                                                                                                                                                                                                                <strong
                                                                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                                                                color: '#4ade80',
                                                                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                                                        {Math.round(
                                                                                                                                                                                                                                                                                                                                                                                                opp.confidence *
                                                                                                                                                                                                                                                                                                                                                                                                                        100
                                                                                                                                                                                                                                                                                                                                                                        )}

                                                                                                                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                                                                                                                </strong>
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                marginTop: 'auto',
                                                                                                                                                                                                                                                paddingTop: 14,
                                                                                                                                                                                                                                                borderTop: '1px solid rgba(255,255,255,0.08)',
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                onClick={() => {
                                                                                                                                                                                                                                                                        setCopilotOpen(
                                                                                                                                                                                                                                                                                                false
                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                                        setMainTab(
                                                                                                                                                                                                                                                                                                'recommendations'
                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        width: '100%',
                                                                                                                                                                                                                                                                        padding: '10px 0',
                                                                                                                                                                                                                                                                        borderRadius: 10,
                                                                                                                                                                                                                                                                        background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                                                                                                                                                                                                                                                        border: 'none',
                                                                                                                                                                                                                                                                        color: '#fff',
                                                                                                                                                                                                                                                                        fontSize: 11.5,
                                                                                                                                                                                                                                                                        fontWeight: 800,
                                                                                                                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                                                                                                                        boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
                                                                                                                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                                                                                                                        letterSpacing: '0.04em',
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                View
                                                                                                                                                                                                                                                All
                                                                                                                                                                                                                                                Detailed
                                                                                                                                                                                                                                                Recommendations
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </>
                                                                                                                        )}
                                                                        </div>
                                                </>
                        );
}
