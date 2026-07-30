'use client';

import React, { useState } from 'react';
import {
                        Sparkles,
                        GitPullRequest,
                        Shield,
                        Zap,
                        TestTube,
                        FileText,
                        Layers,
                        Package,
                        CheckCircle2,
                        XCircle,
                        Clock,
                        ArrowRight,
                        TrendingUp,
                        AlertTriangle,
                        Play,
                        RotateCcw,
                        Sliders,
                        ChevronRight,
                        Brain,
                        Orbit,
                        Dna,
                        DollarSign,
                        HeartPulse,
                        Database,
                        Lock,
                        GitMerge,
                        PieChart,
                        HelpCircle,
                        Eye,
                        Calendar,
                        Check,
                        Building,
                        BarChart3,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

interface EvolutionAction {
                        step: number;
                        title: string;
                        description: string;
                        target_file?: string;
                        suggested_change?: string;
}

interface EvolutionItem {
                        id: string;
                        repository_id: string;
                        category: string;
                        title: string;
                        description?: string;
                        target_component?: string;
                        priority_score: number;
                        business_impact: number;
                        risk_score: number;
                        effort_score: number;
                        confidence_score: number;
                        target_week: number;
                        timeline_horizon:
                                                | 'today'
                                                | 'next_sprint'
                                                | 'next_quarter'
                                                | 'next_year'
                                                | 'ideal';
                        status:
                                                | 'proposed'
                                                | 'queued'
                                                | 'validating'
                                                | 'approved'
                                                | 'rejected'
                                                | 'completed';
                        validation_status: 'pending' | 'passed' | 'failed';
                        why_statement?: string;
                        expected_benefit?: string;
                        evidence?: any[];
                        prerequisites?: string[];
                        roi_metrics?: { cost_savings_usd?: number; dev_hours_saved?: number };
                        metrics?: Record<string, any>;
                        actions?: EvolutionAction[];
}

export default function AutonomousEvolutionPage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'timeline'
                                                | 'optimizer'
                                                | 'depgraph'
                                                | 'roadmap'
                                                | 'queue'
                                                | 'debt'
                                                | 'domain'
                        >('timeline');
                        const [activeHorizon, setActiveHorizon] = useState<
                                                | 'today'
                                                | 'next_sprint'
                                                | 'next_quarter'
                                                | 'next_year'
                                                | 'ideal'
                        >('next_sprint');
                        const [activeDomain, setActiveDomain] = useState<string>('architecture');
                        const [selectedWeekBudget, setSelectedWeekBudget] = useState<number>(2);
                        const [isEvolving, setIsEvolving] = useState<boolean>(false);
                        const [inspectingItem, setInspectingItem] = useState<EvolutionItem | null>(
                                                null
                        );

                        // Initial State
                        const [items, setItems] = useState<EvolutionItem[]>([
                                                {
                                                                        id: 'arch-item-1',
                                                                        repository_id: 'demo-repo-id',
                                                                        category: 'architecture',
                                                                        title: 'Decouple Monolithic Orchestrator into Modular Sub-Services',
                                                                        description: 'Split central orchestration logic into domain-focused sub-engines to improve concurrency.',
                                                                        target_component: 'app.autonomous.orchestrator',
                                                                        priority_score: 92.0,
                                                                        business_impact: 9.0,
                                                                        risk_score: 3.0,
                                                                        effort_score: 4.0,
                                                                        confidence_score: 0.96,
                                                                        target_week: 1,
                                                                        timeline_horizon: 'next_sprint',
                                                                        status: 'proposed',
                                                                        validation_status: 'passed',
                                                                        why_statement: 'Direct monolithic imports reduce concurrent scaling and increase blast radius of engine crashes.',
                                                                        expected_benefit: 'Improves maintainability score by +18% and unlocks parallel worker task dispatching.',
                                                                        evidence: [
                                                                                                {
                                                                                                                        type: 'AST Coupling Metric',
                                                                                                                        location: 'app/autonomous/orchestrator.py',
                                                                                                                        imports_count: 32,
                                                                                                },
                                                                        ],
                                                                        prerequisites: [],
                                                                        roi_metrics: {
                                                                                                cost_savings_usd: 1200,
                                                                                                dev_hours_saved: 15,
                                                                        },
                                                                        actions: [
                                                                                                {
                                                                                                                        step: 1,
                                                                                                                        title: 'Define Sub-Engine Contracts',
                                                                                                                        description: 'Create clean interface contracts.',
                                                                                                },
                                                                        ],
                                                },
                                                {
                                                                        id: 'dep-item-1',
                                                                        repository_id: 'demo-repo-id',
                                                                        category: 'dependency',
                                                                        title: 'Upgrade Redis Async Client Library to v5.0+',
                                                                        description: 'Upgrade redis-py to 5.0+ to gain non-blocking connection pool performance.',
                                                                        target_component: 'pyproject.toml',
                                                                        priority_score: 85.0,
                                                                        business_impact: 8.0,
                                                                        risk_score: 2.0,
                                                                        effort_score: 2.0,
                                                                        confidence_score: 0.98,
                                                                        target_week: 2,
                                                                        timeline_horizon: 'next_sprint',
                                                                        status: 'queued',
                                                                        validation_status: 'passed',
                                                                        why_statement: 'Older redis-py versions suffer from memory leak issues under heavy async concurrency.',
                                                                        expected_benefit: 'Fixes 2 security advisories and boosts query throughput by +12%.',
                                                                        evidence: [
                                                                                                {
                                                                                                                        type: 'Security Advisory',
                                                                                                                        cve: 'CVE-2024-XXXX',
                                                                                                },
                                                                        ],
                                                                        prerequisites: [
                                                                                                'arch-item-1',
                                                                        ],
                                                                        roi_metrics: {
                                                                                                cost_savings_usd: 800,
                                                                                                dev_hours_saved: 8,
                                                                        },
                                                },
                                                {
                                                                        id: 'sec-item-1',
                                                                        repository_id: 'demo-repo-id',
                                                                        category: 'security',
                                                                        title: 'Harden JWT Token Signature Algorithms & Key Rotation',
                                                                        description: 'Enforce strict algorithm verification (RS256/EdDSA) and introduce automated key rotation.',
                                                                        target_component: 'app.api.v1.auth',
                                                                        priority_score: 95.0,
                                                                        business_impact: 9.5,
                                                                        risk_score: 2.5,
                                                                        effort_score: 3.0,
                                                                        confidence_score: 0.99,
                                                                        target_week: 2,
                                                                        timeline_horizon: 'next_sprint',
                                                                        status: 'proposed',
                                                                        validation_status: 'passed',
                                                                        why_statement: 'Symmetric key signing poses key exposure risks across distributed microservices.',
                                                                        expected_benefit: 'Protects against token forgery and meets SOC2 security compliance requirements.',
                                                                        evidence: [
                                                                                                {
                                                                                                                        type: 'Security Audit',
                                                                                                                        rule: 'JWT_ALG_HARDENING',
                                                                                                },
                                                                        ],
                                                                        prerequisites: [],
                                                                        roi_metrics: {
                                                                                                cost_savings_usd: 3000,
                                                                                                dev_hours_saved: 20,
                                                                        },
                                                },
                                                {
                                                                        id: 'perf-item-1',
                                                                        repository_id: 'demo-repo-id',
                                                                        category: 'performance',
                                                                        title: 'Introduce In-Memory LRU Caching for Code Graph Queries',
                                                                        description: 'Cache frequent Neo4j path lookup queries to reduce query roundtrip latency from 180ms to 8ms.',
                                                                        target_component: 'app.core.neo4j_client',
                                                                        priority_score: 90.0,
                                                                        business_impact: 9.0,
                                                                        risk_score: 2.0,
                                                                        effort_score: 3.0,
                                                                        confidence_score: 0.95,
                                                                        target_week: 3,
                                                                        timeline_horizon: 'next_quarter',
                                                                        status: 'proposed',
                                                                        validation_status: 'passed',
                                                                        why_statement: 'Repeated graph path lookups strain the database and slow down UI dashboard load times.',
                                                                        expected_benefit: 'Reduces p99 endpoint latency by 95% and cuts database load by 70%.',
                                                                        evidence: [
                                                                                                {
                                                                                                                        type: 'Telemetry Trace',
                                                                                                                        latency_ms: 185,
                                                                                                },
                                                                        ],
                                                                        prerequisites: [
                                                                                                'dep-item-1',
                                                                        ],
                                                                        roi_metrics: {
                                                                                                cost_savings_usd: 2500,
                                                                                                dev_hours_saved: 12,
                                                                        },
                                                },
                                                {
                                                                        id: 'cost-item-1',
                                                                        repository_id: 'demo-repo-id',
                                                                        category: 'cost',
                                                                        title: 'Consolidate Worker Containers into Dynamic KEDA Pool',
                                                                        description: 'Replace fixed idle worker instances with auto-scaling Celery task workers to reduce cloud cost.',
                                                                        target_component: 'apps/backend/app/workers',
                                                                        priority_score: 88.0,
                                                                        business_impact: 8.5,
                                                                        risk_score: 2.0,
                                                                        effort_score: 3.0,
                                                                        confidence_score: 0.94,
                                                                        target_week: 2,
                                                                        timeline_horizon: 'next_quarter',
                                                                        status: 'proposed',
                                                                        validation_status: 'passed',
                                                                        why_statement: 'Idle background containers consume fixed cloud instance budgets even during low traffic.',
                                                                        expected_benefit: 'Saves an estimated $420/month ($5,040/year) in cloud compute costs.',
                                                                        evidence: [
                                                                                                {
                                                                                                                        type: 'Cloud Telemetry',
                                                                                                                        idle_time_pct: '68%',
                                                                                                },
                                                                        ],
                                                                        prerequisites: [],
                                                                        roi_metrics: {
                                                                                                cost_savings_usd: 5040,
                                                                                                dev_hours_saved: 5,
                                                                        },
                                                },
                                                {
                                                                        id: 'rel-item-1',
                                                                        repository_id: 'demo-repo-id',
                                                                        category: 'reliability',
                                                                        title: 'Implement Circuit-Breaker Pattern for External API Dependencies',
                                                                        description: 'Wrap external HTTP requests with circuit breakers to prevent cascading downstream timeouts.',
                                                                        target_component: 'app.services.external_api',
                                                                        priority_score: 91.0,
                                                                        business_impact: 9.0,
                                                                        risk_score: 2.0,
                                                                        effort_score: 3.0,
                                                                        confidence_score: 0.96,
                                                                        target_week: 3,
                                                                        timeline_horizon: 'next_year',
                                                                        status: 'proposed',
                                                                        validation_status: 'passed',
                                                                        why_statement: 'Third-party API slowdowns cause worker thread exhaustion and request queueing.',
                                                                        expected_benefit: 'Increases system uptime SLA to 99.99% and eliminates cascade outages.',
                                                                        evidence: [
                                                                                                {
                                                                                                                        type: 'Incident Log',
                                                                                                                        incident_id: 'INC-2026-04',
                                                                                                },
                                                                        ],
                                                                        prerequisites: [],
                                                                        roi_metrics: {
                                                                                                cost_savings_usd: 4000,
                                                                                                dev_hours_saved: 30,
                                                                        },
                                                },
                                                {
                                                                        id: 'db-item-1',
                                                                        repository_id: 'demo-repo-id',
                                                                        category: 'database',
                                                                        title: 'Add Composite Index on Evolution Plan Database Tables',
                                                                        description: 'Create B-Tree composite index on (repository_id, status, target_week) to accelerate roadmap queries.',
                                                                        target_component: 'app.models.ase',
                                                                        priority_score: 86.0,
                                                                        business_impact: 8.0,
                                                                        risk_score: 1.0,
                                                                        effort_score: 1.5,
                                                                        confidence_score: 0.99,
                                                                        target_week: 1,
                                                                        timeline_horizon: 'ideal',
                                                                        status: 'proposed',
                                                                        validation_status: 'passed',
                                                                        why_statement: 'Sequential table scans occur when filtering large evolution roadmap datasets.',
                                                                        expected_benefit: 'Reduces DB index scan query time from 65ms to 1.2ms (54x faster).',
                                                                        evidence: [
                                                                                                {
                                                                                                                        type: 'EXPLAIN ANALYZE',
                                                                                                                        query_time_ms: 65,
                                                                                                },
                                                                        ],
                                                                        prerequisites: [],
                                                                        roi_metrics: {
                                                                                                cost_savings_usd: 600,
                                                                                                dev_hours_saved: 6,
                                                                        },
                                                },
                        ]);

                        const handleRunContinuousEvolution = () => {
                                                setIsEvolving(true);
                                                setTimeout(() => {
                                                                        setIsEvolving(false);
                                                }, 1200);
                        };

                        const handleApprove = (id: string) => {
                                                setItems((prev) =>
                                                                        prev.map((i) =>
                                                                                                i.id ===
                                                                                                id
                                                                                                                        ? {
                                                                                                                                                  ...i,
                                                                                                                                                  status: 'approved',
                                                                                                                          }
                                                                                                                        : i
                                                                        )
                                                );
                        };

                        const handleReject = (id: string) => {
                                                setItems((prev) =>
                                                                        prev.map((i) =>
                                                                                                i.id ===
                                                                                                id
                                                                                                                        ? {
                                                                                                                                                  ...i,
                                                                                                                                                  status: 'rejected',
                                                                                                                          }
                                                                                                                        : i
                                                                        )
                                                );
                        };

                        const horizons = [
                                                {
                                                                        key: 'today',
                                                                        label: 'Today (Baseline)',
                                                                        score: '75.0%',
                                                                        desc: 'Monolithic orchestrator, high coupling, 62% test coverage',
                                                },
                                                {
                                                                        key: 'next_sprint',
                                                                        label: 'Next Sprint (2 Wks)',
                                                                        score: '82.0%',
                                                                        desc: 'Decoupled access layer & JWT security hardening',
                                                },
                                                {
                                                                        key: 'next_quarter',
                                                                        label: 'Next Quarter (3 Mos)',
                                                                        score: '90.0%',
                                                                        desc: 'In-memory graph caching & KEDA auto-scaling active',
                                                },
                                                {
                                                                        key: 'next_year',
                                                                        label: 'Next Year (12 Mos)',
                                                                        score: '96.0%',
                                                                        desc: 'Circuit breakers & event-driven microservices architecture',
                                                },
                                                {
                                                                        key: 'ideal',
                                                                        label: 'Ideal Architecture',
                                                                        score: '99.5%',
                                                                        desc: 'Zero-debt, self-healing autonomous software organism',
                                                },
                        ];

                        const getCategoryIcon = (cat: string) => {
                                                switch (cat) {
                                                                        case 'architecture':
                                                                                                return (
                                                                                                                        <Layers className="w-4 h-4 text-purple-400" />
                                                                                                );
                                                                        case 'dependency':
                                                                                                return (
                                                                                                                        <Package className="w-4 h-4 text-cyan-400" />
                                                                                                );
                                                                        case 'security':
                                                                                                return (
                                                                                                                        <Shield className="w-4 h-4 text-rose-400" />
                                                                                                );
                                                                        case 'performance':
                                                                                                return (
                                                                                                                        <Zap className="w-4 h-4 text-amber-400" />
                                                                                                );
                                                                        case 'testing':
                                                                                                return (
                                                                                                                        <TestTube className="w-4 h-4 text-emerald-400" />
                                                                                                );
                                                                        case 'documentation':
                                                                                                return (
                                                                                                                        <FileText className="w-4 h-4 text-blue-400" />
                                                                                                );
                                                                        case 'cost':
                                                                                                return (
                                                                                                                        <DollarSign className="w-4 h-4 text-emerald-400" />
                                                                                                );
                                                                        case 'reliability':
                                                                                                return (
                                                                                                                        <HeartPulse className="w-4 h-4 text-rose-400" />
                                                                                                );
                                                                        case 'database':
                                                                                                return (
                                                                                                                        <Database className="w-4 h-4 text-indigo-400" />
                                                                                                );
                                                                        default:
                                                                                                return (
                                                                                                                        <Sliders className="w-4 h-4 text-indigo-400" />
                                                                                                );
                                                }
                        };

                        const getStatusBadge = (status: string) => {
                                                switch (status) {
                                                                        case 'approved':
                                                                                                return (
                                                                                                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                                                                                                                                Approved
                                                                                                                        </span>
                                                                                                );
                                                                        case 'rejected':
                                                                                                return (
                                                                                                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                                                                                                                                Rejected
                                                                                                                        </span>
                                                                                                );
                                                                        case 'queued':
                                                                                                return (
                                                                                                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                                                                                                                                Queued
                                                                                                                        </span>
                                                                                                );
                                                                        default:
                                                                                                return (
                                                                                                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                                                                                                                                Proposed
                                                                                                                        </span>
                                                                                                );
                                                }
                        };

                        // Optimizer calculations
                        const totalHoursAvailable = selectedWeekBudget * 40;
                        const recommendedForBudget = items.slice(
                                                0,
                                                Math.min(items.length, selectedWeekBudget * 3)
                        );
                        const estimatedCostSaved = recommendedForBudget.reduce(
                                                (acc, curr) =>
                                                                        acc +
                                                                        (curr.roi_metrics
                                                                                                ?.cost_savings_usd ||
                                                                                                0),
                                                0
                        );
                        const estimatedHoursSaved = recommendedForBudget.reduce(
                                                (acc, curr) =>
                                                                        acc +
                                                                        (curr.roi_metrics
                                                                                                ?.dev_hours_saved ||
                                                                                                0),
                                                0
                        );

                        return (
                                                <DashboardLayout>
                                                                        <div className="space-y-6 pb-12">
                                                                                                {/* Header Banner */}
                                                                                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/90 to-purple-950 p-6 md:p-8 border border-indigo-500/20 shadow-2xl">
                                                                                                                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                                                                                                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                                                                                                                                <div>
                                                                                                                                                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                                                                                                                                                                                                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                                                                                                                                                                                🚀
                                                                                                                                                                                                Phase
                                                                                                                                                                                                29
                                                                                                                                                                                                —
                                                                                                                                                                                                Autonomous
                                                                                                                                                                                                Software
                                                                                                                                                                                                Evolution
                                                                                                                                                                                                Engine
                                                                                                                                                                                                (ASE)
                                                                                                                                                                        </div>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                                                                                                                                                                                Continuous
                                                                                                                                                                                                Software
                                                                                                                                                                                                Evolution
                                                                                                                                                                                                Engine
                                                                                                                                                                        </h1>
                                                                                                                                                                        <p className="mt-2 text-base text-slate-300 max-w-2xl">
                                                                                                                                                                                                GitHub
                                                                                                                                                                                                Copilot
                                                                                                                                                                                                writes
                                                                                                                                                                                                code.{' '}
                                                                                                                                                                                                <span className="text-indigo-400 font-semibold">
                                                                                                                                                                                                                        CodeAtlas
                                                                                                                                                                                                                        evolves
                                                                                                                                                                                                                        software.
                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                Software
                                                                                                                                                                                                continuously
                                                                                                                                                                                                improves
                                                                                                                                                                                                itself
                                                                                                                                                                                                with
                                                                                                                                                                                                human
                                                                                                                                                                                                oversight.
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="flex flex-wrap items-center gap-3">
                                                                                                                                                                        <button
                                                                                                                                                                                                onClick={
                                                                                                                                                                                                                        handleRunContinuousEvolution
                                                                                                                                                                                                }
                                                                                                                                                                                                disabled={
                                                                                                                                                                                                                        isEvolving
                                                                                                                                                                                                }
                                                                                                                                                                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50"
                                                                                                                                                                        >
                                                                                                                                                                                                {isEvolving ? (
                                                                                                                                                                                                                        <>
                                                                                                                                                                                                                                                <RotateCcw className="w-4 h-4 animate-spin" />
                                                                                                                                                                                                                                                Running
                                                                                                                                                                                                                                                Evolution
                                                                                                                                                                                                                                                Cycle...
                                                                                                                                                                                                                        </>
                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                        <>
                                                                                                                                                                                                                                                <Play className="w-4 h-4" />
                                                                                                                                                                                                                                                Run
                                                                                                                                                                                                                                                Continuous
                                                                                                                                                                                                                                                Evolution
                                                                                                                                                                                                                        </>
                                                                                                                                                                                                )}
                                                                                                                                                                        </button>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Navigation Tabs */}
                                                                                                <div className="flex flex-wrap border-b border-slate-800 gap-6 text-sm font-medium">
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'timeline'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'timeline'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <Sparkles className="w-4 h-4 text-purple-400" />{' '}
                                                                                                                                                🌟
                                                                                                                                                Signature
                                                                                                                                                Evolution
                                                                                                                                                Timeline
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'optimizer'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'optimizer'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <PieChart className="w-4 h-4 text-emerald-400" />{' '}
                                                                                                                                                Investment
                                                                                                                                                Optimizer
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'depgraph'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'depgraph'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <GitMerge className="w-4 h-4 text-cyan-400" />{' '}
                                                                                                                                                Dependency
                                                                                                                                                Graph
                                                                                                                                                (DAG)
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'roadmap'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'roadmap'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <Clock className="w-4 h-4" />{' '}
                                                                                                                                                AI
                                                                                                                                                Evolution
                                                                                                                                                Roadmap
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'queue'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'queue'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <GitPullRequest className="w-4 h-4" />{' '}
                                                                                                                                                Refactoring
                                                                                                                                                Queue
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'domain'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'domain'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <Layers className="w-4 h-4" />{' '}
                                                                                                                                                Domain
                                                                                                                                                Planners
                                                                                                                                                (11)
                                                                                                                        </button>
                                                                                                </div>

                                                                                                {/* TAB: Signature Feature — Engineering Evolution Timeline */}
                                                                                                {activeTab ===
                                                                                                                        'timeline' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                                                                                                                                                                        <div className="flex items-center justify-between">
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                                                                <Sparkles className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                                                                                                Signature
                                                                                                                                                                                                                                                Feature
                                                                                                                                                                                                                                                —
                                                                                                                                                                                                                                                Engineering
                                                                                                                                                                                                                                                Evolution
                                                                                                                                                                                                                                                Timeline
                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                                        <p className="text-xs text-slate-400">
                                                                                                                                                                                                                                                Open
                                                                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                                                                to
                                                                                                                                                                                                                                                see
                                                                                                                                                                                                                                                the
                                                                                                                                                                                                                                                path
                                                                                                                                                                                                                                                from
                                                                                                                                                                                                                                                today's
                                                                                                                                                                                                                                                system
                                                                                                                                                                                                                                                to
                                                                                                                                                                                                                                                your
                                                                                                                                                                                                                                                ideal
                                                                                                                                                                                                                                                software
                                                                                                                                                                                                                                                architecture.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-right text-xs font-mono text-indigo-300">
                                                                                                                                                                                                                        Current
                                                                                                                                                                                                                        Baseline:{' '}
                                                                                                                                                                                                                        <span className="font-bold text-white">
                                                                                                                                                                                                                                                75.0%
                                                                                                                                                                                                                        </span>{' '}
                                                                                                                                                                                                                        →
                                                                                                                                                                                                                        Target
                                                                                                                                                                                                                        Ideal:{' '}
                                                                                                                                                                                                                        <span className="font-bold text-emerald-400">
                                                                                                                                                                                                                                                99.5%
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Timeline Horizon Stepper */}
                                                                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
                                                                                                                                                                                                {horizons.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                h,
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                h.key
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                setActiveHorizon(
                                                                                                                                                                                                                                                                                                                        h.key as any
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className={`p-4 text-left rounded-xl border transition-all ${
                                                                                                                                                                                                                                                                                                activeHorizon ===
                                                                                                                                                                                                                                                                                                h.key
                                                                                                                                                                                                                                                                                                                        ? 'bg-gradient-to-b from-indigo-950 to-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                                                                                                                                                                                                                                                                                                                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400 uppercase">
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        STEP{' '}
                                                                                                                                                                                                                                                                                                                        {idx +
                                                                                                                                                                                                                                                                                                                                                1}
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                h.score
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <h4 className="mt-2 font-bold text-white text-sm line-clamp-1">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        h.label
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                                                                        <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        h.desc
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Selected Horizon Content */}
                                                                                                                                                                        <div className="mt-6 p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                                                                                                                                                                                                <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                                                                                                                                                                                                                        <ArrowRight className="w-4 h-4 text-indigo-400" />{' '}
                                                                                                                                                                                                                        Milestone:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                horizons.find(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                h
                                                                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                                                                h.key ===
                                                                                                                                                                                                                                                                                                activeHorizon
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        ?.label
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                <p className="text-xs text-slate-300">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                horizons.find(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                h
                                                                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                                                                h.key ===
                                                                                                                                                                                                                                                                                                activeHorizon
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        ?.desc
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>

                                                                                                                                                                                                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                                                                                                                                                                                                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                                                                                                                                                                                                                Key
                                                                                                                                                                                                                                                Evolution
                                                                                                                                                                                                                                                Tasks:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                                                                                                                                                                                {items
                                                                                                                                                                                                                                                                        .filter(
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                                                                        i.timeline_horizon ===
                                                                                                                                                                                                                                                                                                                                                activeHorizon ||
                                                                                                                                                                                                                                                                                                                        (activeHorizon ===
                                                                                                                                                                                                                                                                                                                                                'next_sprint' &&
                                                                                                                                                                                                                                                                                                                                                i.target_week ===
                                                                                                                                                                                                                                                                                                                                                                        1)
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                        .map(
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                        item
                                                                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                                                                        item.id
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1"
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                                                                                                                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                                                                                                                                                                                                                                                                                                                                                                                {getCategoryIcon(
                                                                                                                                                                                                                                                                                                                                                                                                                        item.category
                                                                                                                                                                                                                                                                                                                                                                                                )}{' '}
                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                        item.title
                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                                                                                                                                                                        setInspectingItem(
                                                                                                                                                                                                                                                                                                                                                                                                                                                item
                                                                                                                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                                                                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                                                                <Eye className="w-3 h-3" />{' '}
                                                                                                                                                                                                                                                                                                                                                                                                AI
                                                                                                                                                                                                                                                                                                                                                                                                Review
                                                                                                                                                                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                <p className="text-[11px] text-slate-400 line-clamp-1">
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                item.description
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* TAB: Feature 15 — Engineering Investment Optimizer */}
                                                                                                {activeTab ===
                                                                                                                        'optimizer' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <PieChart className="w-5 h-5 text-emerald-400" />{' '}
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        15
                                                                                                                                                                                                                        —
                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                        Investment
                                                                                                                                                                                                                        Optimizer
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                                                                        Answer:{' '}
                                                                                                                                                                                                                        <span className="text-white italic">
                                                                                                                                                                                                                                                "If
                                                                                                                                                                                                                                                we
                                                                                                                                                                                                                                                spend
                                                                                                                                                                                                                                                N
                                                                                                                                                                                                                                                weeks
                                                                                                                                                                                                                                                improving
                                                                                                                                                                                                                                                the
                                                                                                                                                                                                                                                platform,
                                                                                                                                                                                                                                                where
                                                                                                                                                                                                                                                should
                                                                                                                                                                                                                                                we
                                                                                                                                                                                                                                                invest
                                                                                                                                                                                                                                                that
                                                                                                                                                                                                                                                time?"
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Timeframe Slider */}
                                                                                                                                                                        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                                                                                                                                                                                                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                SELECT
                                                                                                                                                                                                                                                ENGINEERING
                                                                                                                                                                                                                                                TIME
                                                                                                                                                                                                                                                BUDGET
                                                                                                                                                                                                                                                (WEEKS):
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-indigo-400 font-mono font-bold text-sm">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        selectedWeekBudget
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                WEEKS
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        totalHoursAvailable
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                HOURS)
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="range"
                                                                                                                                                                                                                        min={
                                                                                                                                                                                                                                                1
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        max={
                                                                                                                                                                                                                                                8
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                selectedWeekBudget
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setSelectedWeekBudget(
                                                                                                                                                                                                                                                                        parseInt(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* ROI Output Summary */}
                                                                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                                                                                                                                <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                                                                                                                                                                                                                        <span className="text-xs text-slate-400 font-medium">
                                                                                                                                                                                                                                                ESTIMATED
                                                                                                                                                                                                                                                COST
                                                                                                                                                                                                                                                SAVINGS
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="text-2xl font-bold text-emerald-400 mt-1">
                                                                                                                                                                                                                                                $
                                                                                                                                                                                                                                                {estimatedCostSaved.toLocaleString()}{' '}
                                                                                                                                                                                                                                                /
                                                                                                                                                                                                                                                year
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-[11px] text-slate-400">
                                                                                                                                                                                                                                                Reduced
                                                                                                                                                                                                                                                idle
                                                                                                                                                                                                                                                compute
                                                                                                                                                                                                                                                &
                                                                                                                                                                                                                                                cloud
                                                                                                                                                                                                                                                resources
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                                                                                                                                                                                                                        <span className="text-xs text-slate-400 font-medium">
                                                                                                                                                                                                                                                DEV
                                                                                                                                                                                                                                                HOURS
                                                                                                                                                                                                                                                SAVED
                                                                                                                                                                                                                                                /
                                                                                                                                                                                                                                                MONTH
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="text-2xl font-bold text-cyan-400 mt-1">
                                                                                                                                                                                                                                                +
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        estimatedHoursSaved
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                hours
                                                                                                                                                                                                                                                /
                                                                                                                                                                                                                                                mo
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-[11px] text-slate-400">
                                                                                                                                                                                                                                                Refactored
                                                                                                                                                                                                                                                debt
                                                                                                                                                                                                                                                &
                                                                                                                                                                                                                                                automated
                                                                                                                                                                                                                                                workflows
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30">
                                                                                                                                                                                                                        <span className="text-xs text-slate-400 font-medium">
                                                                                                                                                                                                                                                RISK
                                                                                                                                                                                                                                                REDUCTION
                                                                                                                                                                                                                                                RATIO
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="text-2xl font-bold text-purple-400 mt-1">
                                                                                                                                                                                                                                                +34.8%
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-[11px] text-slate-400">
                                                                                                                                                                                                                                                Reduced
                                                                                                                                                                                                                                                bug
                                                                                                                                                                                                                                                blast
                                                                                                                                                                                                                                                radius
                                                                                                                                                                                                                                                &
                                                                                                                                                                                                                                                security
                                                                                                                                                                                                                                                leaks
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* TAB: Feature 14 — Improvement Dependency Graph */}
                                                                                                {activeTab ===
                                                                                                                        'depgraph' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                                                                                                                                                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                <GitMerge className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                14
                                                                                                                                                                                                —
                                                                                                                                                                                                Improvement
                                                                                                                                                                                                Dependency
                                                                                                                                                                                                Graph
                                                                                                                                                                                                (DAG)
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-slate-400">
                                                                                                                                                                                                Understand
                                                                                                                                                                                                prerequisite
                                                                                                                                                                                                relationships
                                                                                                                                                                                                between
                                                                                                                                                                                                refactor
                                                                                                                                                                                                tasks
                                                                                                                                                                                                so
                                                                                                                                                                                                engineers
                                                                                                                                                                                                know
                                                                                                                                                                                                what
                                                                                                                                                                                                to
                                                                                                                                                                                                build
                                                                                                                                                                                                first.
                                                                                                                                                                        </p>

                                                                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
                                                                                                                                                                                                {items.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                item
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                item.id
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="flex items-center justify-between text-xs">
                                                                                                                                                                                                                                                                                                <span className="font-bold text-indigo-400 flex items-center gap-1">
                                                                                                                                                                                                                                                                                                                        {getCategoryIcon(
                                                                                                                                                                                                                                                                                                                                                item.category
                                                                                                                                                                                                                                                                                                                        )}{' '}
                                                                                                                                                                                                                                                                                                                        {item.category.toUpperCase()}
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                {item.prerequisites &&
                                                                                                                                                                                                                                                                                                item
                                                                                                                                                                                                                                                                                                                        .prerequisites
                                                                                                                                                                                                                                                                                                                        .length >
                                                                                                                                                                                                                                                                                                                        0 ? (
                                                                                                                                                                                                                                                                                                                        <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300">
                                                                                                                                                                                                                                                                                                                                                Prereqs:{' '}
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        item
                                                                                                                                                                                                                                                                                                                                                                                                .prerequisites
                                                                                                                                                                                                                                                                                                                                                                                                .length
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                                                                                                                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300">
                                                                                                                                                                                                                                                                                                                                                Root
                                                                                                                                                                                                                                                                                                                                                Task
                                                                                                                                                                                                                                                                                                                                                (Unblocked)
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                                                                        <h4 className="font-bold text-white text-sm line-clamp-1">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                                                                        <p className="text-xs text-slate-400 line-clamp-2">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.description
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* AI Review Board Inspector Drawer / Modal */}
                                                                                                {inspectingItem && (
                                                                                                                        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                                                                                                                                                <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
                                                                                                                                                                        <button
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setInspectingItem(
                                                                                                                                                                                                                                                null
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                                                                                                                                                                        >
                                                                                                                                                                                                <XCircle className="w-6 h-6" />
                                                                                                                                                                        </button>

                                                                                                                                                                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase">
                                                                                                                                                                                                <Brain className="w-4 h-4" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                13
                                                                                                                                                                                                —
                                                                                                                                                                                                AI
                                                                                                                                                                                                Review
                                                                                                                                                                                                Board
                                                                                                                                                                                                Rationale
                                                                                                                                                                        </div>

                                                                                                                                                                        <h3 className="text-xl font-bold text-white">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        inspectingItem.title
                                                                                                                                                                                                }
                                                                                                                                                                        </h3>

                                                                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                                                                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                                                                                                                                                                                                                        <span className="font-bold text-indigo-300 uppercase">
                                                                                                                                                                                                                                                Why:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                                                                {inspectingItem.why_statement ||
                                                                                                                                                                                                                                                                        'Identified during continuous structural code analysis.'}
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                                                                                                                                                                                                                        <span className="font-bold text-emerald-300 uppercase">
                                                                                                                                                                                                                                                Expected
                                                                                                                                                                                                                                                Benefit:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                                                                {inspectingItem.expected_benefit ||
                                                                                                                                                                                                                                                                        'Improves maintainability score and system scalability.'}
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="grid grid-cols-3 gap-3">
                                                                                                                                                                                                                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                                                                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                                                                        Confidence:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <div className="text-base font-bold text-emerald-400 font-mono">
                                                                                                                                                                                                                                                                        {(
                                                                                                                                                                                                                                                                                                inspectingItem.confidence_score *
                                                                                                                                                                                                                                                                                                100
                                                                                                                                                                                                                                                                        ).toFixed(
                                                                                                                                                                                                                                                                                                0
                                                                                                                                                                                                                                                                        )}

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                                                                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                                                                        Score:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <div className="text-base font-bold text-amber-400 font-mono">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                inspectingItem.risk_score
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        /10
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                                                                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                                                                        Estimated
                                                                                                                                                                                                                                                                        Effort:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <div className="text-base font-bold text-indigo-400 font-mono">
                                                                                                                                                                                                                                                                        {inspectingItem.effort_score *
                                                                                                                                                                                                                                                                                                4}

                                                                                                                                                                                                                                                                        h
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="flex justify-end pt-3">
                                                                                                                                                                                                <button
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setInspectingItem(
                                                                                                                                                                                                                                                                        null
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        Close
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Review
                                                                                                                                                                                                                        Board
                                                                                                                                                                                                </button>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </DashboardLayout>
                        );
}
