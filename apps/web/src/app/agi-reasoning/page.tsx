'use client';

import React, { useState } from 'react';
import {
                        Brain,
                        Sparkles,
                        GitBranch,
                        ShieldCheck,
                        CheckCircle2,
                        AlertTriangle,
                        ArrowRight,
                        Database,
                        Cpu,
                        Layers,
                        FlaskConical,
                        Zap,
                        DollarSign,
                        Users,
                        Compass,
                        RefreshCw,
                        Rocket,
                        ShieldAlert,
                        Code2,
                        Cloud,
                        Send,
} from 'lucide-react';

export default function AGIReasoningCorePage() {
                        const [activeTab, setActiveTab] = useState<string>('reasoning');
                        const [selectedScientist, setSelectedScientist] =
                                                useState<string>('incident_scientist');

                        // Multi-Step Reasoning Data (Think -> Debate -> Simulate -> Verify -> Answer)
                        const reasoningSteps = [
                                                {
                                                                        num: 1,
                                                                        phase: 'Think',
                                                                        time: '14.2 ms',
                                                                        summary: 'Parsed codebase dependency AST graph and repository history for prompt context.',
                                                                        findings: [
                                                                                                'Identified 14 consuming microservices reliant on Auth Vault REST API.',
                                                                                                'Discovered DB connection pool lock contention under >500 conns.',
                                                                        ],
                                                },
                                                {
                                                                        num: 2,
                                                                        phase: 'Debate',
                                                                        time: '28.5 ms',
                                                                        summary: 'Simulated multi-persona debate between CTO AI, Security AI, and SRE AI.',
                                                                        findings: [
                                                                                                'CTO AI proposed gRPC migration; Security AI required RS256 token rotation.',
                                                                                                'SRE AI insisted on circuit breakers.',
                                                                        ],
                                                },
                                                {
                                                                        num: 3,
                                                                        phase: 'Simulate',
                                                                        time: '42.0 ms',
                                                                        summary: 'Ran Monte-Carlo load & latency simulation across ap-south-1 and eu-central-1 regions.',
                                                                        findings: [
                                                                                                'gRPC protocol buffer streaming reduces latency by 72%.',
                                                                                                'CockroachDB EU row leaseholders eliminate GDPR risk.',
                                                                        ],
                                                },
                                                {
                                                                        num: 4,
                                                                        phase: 'Verify',
                                                                        time: '18.0 ms',
                                                                        summary: 'Verified zero breaking changes against OpenAPI 3.1 & gRPC schema contracts.',
                                                                        findings: [
                                                                                                'Backward-compatibility regression test passed across all 14 consuming services.',
                                                                        ],
                                                },
                                                {
                                                                        num: 5,
                                                                        phase: 'Answer',
                                                                        time: '8.4 ms',
                                                                        summary: 'Formulated final executive strategic answer with complete evidence provenance.',
                                                                        findings: [
                                                                                                'Recommended dual-region active-active deployment with isolated gRPC auth vault.',
                                                                        ],
                                                },
                        ];

                        // 15 Specialized AI Scientists Data
                        const scientists = [
                                                {
                                                                        id: 'research_assistant',
                                                                        title: 'Engineering Research Assistant',
                                                                        icon: Compass,
                                                                        focus: 'Codebase Synthesis & Industry Benchmarks',
                                                },
                                                {
                                                                        id: 'arch_professor',
                                                                        title: 'AI Architecture Professor',
                                                                        icon: Layers,
                                                                        focus: 'System Design Patterns & Clean Architecture',
                                                },
                                                {
                                                                        id: 'incident_scientist',
                                                                        title: 'AI Incident Scientist',
                                                                        icon: AlertTriangle,
                                                                        focus: 'Post-Mortem Root Cause Analysis',
                                                },
                                                {
                                                                        id: 'reliability_scientist',
                                                                        title: 'AI Reliability Scientist',
                                                                        icon: Zap,
                                                                        focus: 'Fault Tolerance, MTBF & SLA Readiness',
                                                },
                                                {
                                                                        id: 'performance_scientist',
                                                                        title: 'AI Performance Scientist',
                                                                        icon: Cpu,
                                                                        focus: 'Latency Optimization & Profiling',
                                                },
                                                {
                                                                        id: 'security_strategist',
                                                                        title: 'AI Security Strategist',
                                                                        icon: ShieldAlert,
                                                                        focus: 'Zero-Trust, Threats & OWASP Compliance',
                                                },
                                                {
                                                                        id: 'cost_optimizer',
                                                                        title: 'AI Cost Optimizer',
                                                                        icon: DollarSign,
                                                                        focus: 'FinOps Cloud Budget Optimization',
                                                },
                                                {
                                                                        id: 'hiring_planner',
                                                                        title: 'AI Hiring Planner',
                                                                        icon: Users,
                                                                        focus: 'Engineering Talent Headcount Planning',
                                                },
                                                {
                                                                        id: 'tech_advisor',
                                                                        title: 'AI Technology Advisor',
                                                                        icon: Compass,
                                                                        focus: 'Tech Radar Lifecycle & Adoption',
                                                },
                                                {
                                                                        id: 'modernization_planner',
                                                                        title: 'AI Modernization Planner',
                                                                        icon: RefreshCw,
                                                                        focus: 'Legacy Code Modernization Roadmap',
                                                },
                                                {
                                                                        id: 'release_planner',
                                                                        title: 'AI Release Planner',
                                                                        icon: Rocket,
                                                                        focus: 'DORA Metrics & Release Verification',
                                                },
                                                {
                                                                        id: 'dependency_strategist',
                                                                        title: 'AI Dependency Strategist',
                                                                        icon: Code2,
                                                                        focus: 'Package Vulnerability & CVE Lifecycle',
                                                },
                                                {
                                                                        id: 'database_scientist',
                                                                        title: 'AI Database Scientist',
                                                                        icon: Database,
                                                                        focus: 'Database Schema & Query Optimization',
                                                },
                                                {
                                                                        id: 'api_architect',
                                                                        title: 'AI API Architect',
                                                                        icon: Layers,
                                                                        focus: 'OpenAPI 3.1 & Interface Contracts',
                                                },
                                                {
                                                                        id: 'cloud_economist',
                                                                        title: 'AI Cloud Economist',
                                                                        icon: Cloud,
                                                                        focus: 'Multi-Cloud Infrastructure ROI',
                                                },
                        ];

                        // Long-Term Memories
                        const memories = [
                                                {
                                                                        id: 'MEM-101',
                                                                        date: '2026-07-26',
                                                                        category: 'Architecture Decision',
                                                                        text: 'Decoupled circular dependency in legacy notification handler via Event Publisher ABC.',
                                                                        weight: '0.95 Permanent',
                                                },
                                                {
                                                                        id: 'MEM-102',
                                                                        date: '2026-07-26',
                                                                        category: 'Incident Retrospective',
                                                                        text: 'Postgres connection pool exhausted during Q2 flash sale. Added PgBouncer limits.',
                                                                        weight: '0.98 Permanent',
                                                },
                        ];

                        const currentScientistObj =
                                                scientists.find(
                                                                        (s) =>
                                                                                                s.id ===
                                                                                                selectedScientist
                                                ) || scientists[2];

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
                                                                                                                                                                        <Brain className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                25
                                                                                                                                                                                                Features
                                                                                                                                                                                                1–20
                                                                                                                                                                                                —
                                                                                                                                                                                                Core
                                                                                                                                                                                                AGI
                                                                                                                                                                                                Intelligence
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                                                                                                                                                                                                Universal
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Reasoning
                                                                                                                                                                                                Engine
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Processes
                                                                                                                                                engineering
                                                                                                                                                queries
                                                                                                                                                through
                                                                                                                                                multi-step
                                                                                                                                                reasoning
                                                                                                                                                (Think
                                                                                                                                                ➔
                                                                                                                                                Debate
                                                                                                                                                ➔
                                                                                                                                                Simulate
                                                                                                                                                ➔
                                                                                                                                                Verify
                                                                                                                                                ➔
                                                                                                                                                Answer),
                                                                                                                                                retains
                                                                                                                                                permanent
                                                                                                                                                long-term
                                                                                                                                                memory,
                                                                                                                                                and
                                                                                                                                                coordinates
                                                                                                                                                15
                                                                                                                                                specialized
                                                                                                                                                AI
                                                                                                                                                Scientists.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        Confidence
                                                                                                                                                                        Score
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-indigo-300">
                                                                                                                                                                        98.5%
                                                                                                                                                                        Multi-Step
                                                                                                                                                                        Confidence
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Tabs */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'reasoning',
                                                                                                                                                label: 'Multi-Step Reasoning (Think ➔ Answer)',
                                                                                                                                                icon: Brain,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'explainable',
                                                                                                                                                label: 'Explainable Decisions (XAI)',
                                                                                                                                                icon: ShieldCheck,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'memory',
                                                                                                                                                label: 'Long-Term Memory Vault',
                                                                                                                                                icon: Database,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'scientists',
                                                                                                                                                label: '15 Specialized AI Scientists',
                                                                                                                                                icon: FlaskConical,
                                                                                                                        },
                                                                                                ].map(
                                                                                                                        (
                                                                                                                                                tab
                                                                                                                        ) => {
                                                                                                                                                const Icon =
                                                                                                                                                                        tab.icon;
                                                                                                                                                const isActive =
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        tab.id;
                                                                                                                                                return (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        tab.id
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                                                                tab.id
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                                                                                                                                                                                                        isActive
                                                                                                                                                                                                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                                                                                                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
                                                                                                                                                                                                }`}
                                                                                                                                                                        >
                                                                                                                                                                                                <Icon className="w-4 h-4" />
                                                                                                                                                                                                {
                                                                                                                                                                                                                        tab.label
                                                                                                                                                                                                }
                                                                                                                                                                        </button>
                                                                                                                                                );
                                                                                                                        }
                                                                                                )}
                                                                        </div>

                                                                        {/* TAB 1: Multi-Step Reasoning Chain (Features 1 & 4) */}
                                                                        {activeTab ===
                                                                                                'reasoning' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
                                                                                                                                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                                                                                                                                                        <Brain className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        Multi-Step
                                                                                                                                                                        Engineering
                                                                                                                                                                        Reasoning
                                                                                                                                                                        Pipeline
                                                                                                                                                </h2>

                                                                                                                                                {/* Stepper Chain */}
                                                                                                                                                <div className="space-y-4">
                                                                                                                                                                        {reasoningSteps.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        step
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        step.num
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                                                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                step.num
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                step.phase
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        Phase
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="text-xs text-slate-500 font-mono">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        step.time
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-xs text-slate-300 font-medium pl-10">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                step.summary
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                <ul className="pl-10 space-y-1 text-xs text-slate-400">
                                                                                                                                                                                                                                                                        {step.findings.map(
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                        f,
                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                                                                        <li
                                                                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                className="flex items-center gap-2"
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />{' '}
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        f
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                </ul>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: Explainable Decisions (Feature 5) */}
                                                                        {activeTab ===
                                                                                                'explainable' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                                                                                                                        <ShieldCheck className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        Explainable
                                                                                                                                                                        Decision
                                                                                                                                                                        Inspector
                                                                                                                                                                        (Why,
                                                                                                                                                                        Evidence,
                                                                                                                                                                        Risks)
                                                                                                                                                </h3>
                                                                                                                                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-3">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="text-indigo-400 font-bold uppercase">
                                                                                                                                                                                                                        Why
                                                                                                                                                                                                                        This
                                                                                                                                                                                                                        Decision
                                                                                                                                                                                                                        Was
                                                                                                                                                                                                                        Made:
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-slate-200 mt-1">
                                                                                                                                                                                                                        Migrating
                                                                                                                                                                                                                        Auth
                                                                                                                                                                                                                        Vault
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        gRPC
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        isolating
                                                                                                                                                                                                                        EU
                                                                                                                                                                                                                        user
                                                                                                                                                                                                                        rows
                                                                                                                                                                                                                        in
                                                                                                                                                                                                                        Frankfurt
                                                                                                                                                                                                                        eliminates
                                                                                                                                                                                                                        DB
                                                                                                                                                                                                                        lock
                                                                                                                                                                                                                        contention
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        guarantees
                                                                                                                                                                                                                        100%
                                                                                                                                                                                                                        GDPR
                                                                                                                                                                                                                        compliance.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="text-slate-400 font-bold uppercase">
                                                                                                                                                                                                                        Evidence
                                                                                                                                                                                                                        Sources:
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <ul className="list-disc list-inside text-slate-300 mt-1">
                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                AST
                                                                                                                                                                                                                                                Static
                                                                                                                                                                                                                                                Analysis
                                                                                                                                                                                                                                                (0
                                                                                                                                                                                                                                                breaking
                                                                                                                                                                                                                                                interface
                                                                                                                                                                                                                                                deltas)
                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                Historical
                                                                                                                                                                                                                                                Load
                                                                                                                                                                                                                                                Test
                                                                                                                                                                                                                                                Records
                                                                                                                                                                                                                                                (p95
                                                                                                                                                                                                                                                latency
                                                                                                                                                                                                                                                14.2ms)
                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                OWASP
                                                                                                                                                                                                                                                Cryptographic
                                                                                                                                                                                                                                                Key
                                                                                                                                                                                                                                                Rotation
                                                                                                                                                                                                                                                Benchmark
                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                </ul>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: Long-Term Memory Vault (Feature 2) */}
                                                                        {activeTab === 'memory' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Permanent
                                                                                                                                                                        Long-Term
                                                                                                                                                                        Codebase
                                                                                                                                                                        Memory
                                                                                                                                                                        Records
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {memories.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        m
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        m.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="font-bold text-indigo-300">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        m.category
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                <span className="text-slate-500 font-normal">
                                                                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                m.date
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <p className="text-slate-300 mt-1">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        m.text
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                m.weight
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: 15 Specialized AI Scientists Hub (Features 6–20) */}
                                                                        {activeTab ===
                                                                                                'scientists' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <FlaskConical className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                                                                        15
                                                                                                                                                                                                                        Specialized
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Scientists
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Advisors
                                                                                                                                                                                                                        Hub
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-slate-400 mt-1">
                                                                                                                                                                                                                        Consult
                                                                                                                                                                                                                        domain-expert
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        scientists
                                                                                                                                                                                                                        across
                                                                                                                                                                                                                        security,
                                                                                                                                                                                                                        reliability,
                                                                                                                                                                                                                        performance,
                                                                                                                                                                                                                        FinOps,
                                                                                                                                                                                                                        databases,
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        APIs.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <select
                                                                                                                                                                                                value={
                                                                                                                                                                                                                        selectedScientist
                                                                                                                                                                                                }
                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        setSelectedScientist(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                                                                                                                                                                        >
                                                                                                                                                                                                {scientists.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                s
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <option
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                s.id
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                                                                s.id
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                s.title
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </select>
                                                                                                                                                </div>

                                                                                                                                                {/* Selected Scientist Consultation Card */}
                                                                                                                                                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                                                                                                                                                                        <div className="flex items-center justify-between">
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <h4 className="text-base font-extrabold text-white">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        currentScientistObj.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                        <div className="text-xs text-indigo-400 font-semibold mt-0.5">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        currentScientistObj.focus
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full">
                                                                                                                                                                                                                        96.5%
                                                                                                                                                                                                                        Confidence
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="text-slate-400 font-bold uppercase mb-1">
                                                                                                                                                                                                                        Specialized
                                                                                                                                                                                                                        Assessment:
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p>
                                                                                                                                                                                                                        Synthesized
                                                                                                                                                                                                                        codebase
                                                                                                                                                                                                                        telemetry
                                                                                                                                                                                                                        for
                                                                                                                                                                                                                        '
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                currentScientistObj.title
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        '.
                                                                                                                                                                                                                        Proceed
                                                                                                                                                                                                                        with
                                                                                                                                                                                                                        recommended
                                                                                                                                                                                                                        microservice
                                                                                                                                                                                                                        refactoring
                                                                                                                                                                                                                        backed
                                                                                                                                                                                                                        by
                                                                                                                                                                                                                        static
                                                                                                                                                                                                                        AST
                                                                                                                                                                                                                        evidence
                                                                                                                                                                                                                        graph.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
