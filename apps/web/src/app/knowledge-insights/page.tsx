'use client';

import React, { useState } from 'react';
import {
                        Brain,
                        Network,
                        Compass,
                        Bell,
                        Trophy,
                        BookOpen,
                        ThumbsUp,
                        ThumbsDown,
                        ShieldCheck,
                        LineChart,
                        HelpCircle,
                        Layers,
                        Sparkles,
                        CheckCircle2,
                        AlertTriangle,
                        ArrowRight,
                        Send,
                        Zap,
                        Code2,
                        GitBranch,
} from 'lucide-react';

export default function KnowledgeInsightsPage() {
                        const [activeTab, setActiveTab] = useState<string>('graph');
                        const [feedbackRating, setFeedbackRating] = useState<string>('accepted');
                        const [feedbackNotes, setFeedbackNotes] = useState<string>('');
                        const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

                        // Feature 31 Data
                        const graphNodes = [
                                                {
                                                                        id: 'repo-main',
                                                                        name: 'CodeAtlas Backend',
                                                                        type: 'Repository',
                                                                        color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                                                },
                                                {
                                                                        id: 'service-auth',
                                                                        name: 'Auth Vault Service',
                                                                        type: 'Service (gRPC)',
                                                                        color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                                                },
                                                {
                                                                        id: 'service-graph',
                                                                        name: 'Neo4j Graph Client',
                                                                        type: 'Database Engine',
                                                                        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                                                },
                                                {
                                                                        id: 'pattern-eda',
                                                                        name: 'Event-Driven Arch',
                                                                        type: 'Pattern',
                                                                        color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                                                },
                        ];

                        // Feature 32 Data
                        const techRadar = [
                                                {
                                                                        name: 'FastAPI',
                                                                        cat: 'Frameworks',
                                                                        status: 'Adopt',
                                                                        risk: 'Low',
                                                                        desc: 'Primary asynchronous backend web framework.',
                                                },
                                                {
                                                                        name: 'Next.js 15',
                                                                        cat: 'Frameworks',
                                                                        status: 'Adopt',
                                                                        risk: 'Low',
                                                                        desc: 'React App Router frontend layer.',
                                                },
                                                {
                                                                        name: 'REST Monolith Vault',
                                                                        cat: 'Infrastructure',
                                                                        status: 'Hold',
                                                                        risk: 'High',
                                                                        desc: 'Deprecate in favor of gRPC protocol buffer vault.',
                                                },
                                                {
                                                                        name: 'OpenTelemetry Spans',
                                                                        cat: 'Observability',
                                                                        status: 'Trial',
                                                                        risk: 'Low',
                                                                        desc: 'Evaluating distributed tracing context propagation.',
                                                },
                        ];

                        // Feature 33 Data
                        const emergingAlerts = [
                                                {
                                                                        id: 'ALT-1',
                                                                        tech: 'PyJWT Cryptographic Library',
                                                                        type: 'Security CVE',
                                                                        sev: 'Warning',
                                                                        action: 'Upgrade to PyJWT >= 2.10.1 for algorithm pinning patch.',
                                                },
                                                {
                                                                        id: 'ALT-2',
                                                                        tech: 'OpenAPI 3.1 Strict Validation',
                                                                        type: 'Paradigm Shift',
                                                                        sev: 'Info',
                                                                        action: 'Enable Pydantic v2 strict mode across v1 API routers.',
                                                },
                        ];

                        // Feature 34 Data
                        const successStories = [
                                                {
                                                                        title: 'Checkout Microservice: Monolith to Event-Driven CQRS',
                                                                        org: 'Enterprise FinTech',
                                                                        outcomes: [
                                                                                                'Reduced p95 checkout latency from 240ms down to 14ms.',
                                                                                                'Zero database row locks under 50K RPS burst traffic.',
                                                                        ],
                                                                        latencyDrop: '94.1%',
                                                                        costSavings: '38.5%',
                                                },
                                                {
                                                                        title: 'Auth Vault Protocol: REST JSON to gRPC Streams',
                                                                        org: 'Global SaaS',
                                                                        outcomes: [
                                                                                                'Eliminated JSON serialization overhead across 14 microservices.',
                                                                                                'Enhanced security via mTLS token isolation.',
                                                                        ],
                                                                        latencyDrop: '72.0%',
                                                                        costSavings: '25.0%',
                                                },
                        ];

                        // Feature 35 Data
                        const caseStudies = [
                                                {
                                                                        title: 'Eliminating Circular Dependency Debt in Python Modules',
                                                                        problem: 'Tight coupling between notification service and user repository caused circular import crashes.',
                                                                        solution: 'Extracted Domain Event Publisher interface and applied Dependency Inversion Principle.',
                                                                        before: '4 circular imports, 8.4s startup time',
                                                                        after: '0 circular imports, 1.2s startup time',
                                                },
                        ];

                        // Feature 37 Data
                        const patternConfidence = {
                                                name: 'Event-Driven Architecture with CQRS',
                                                score: 96.4,
                                                astMatch: 98.0,
                                                securityComp: 95.0,
                                                verdict: 'HIGHLY_RECOMMENDED',
                        };

                        // Feature 38 Data
                        const historicalPoints = [
                                                {
                                                                        date: '90 days ago',
                                                                        health: 74.0,
                                                                        coverage: '72.0%',
                                                                        debt: '65.0 hrs',
                                                },
                                                {
                                                                        date: '60 days ago',
                                                                        health: 81.5,
                                                                        coverage: '80.5%',
                                                                        debt: '48.0 hrs',
                                                },
                                                {
                                                                        date: '30 days ago',
                                                                        health: 88.0,
                                                                        coverage: '85.2%',
                                                                        debt: '40.0 hrs',
                                                },
                                                {
                                                                        date: 'Today',
                                                                        health: 94.5,
                                                                        coverage: '88.4%',
                                                                        debt: '36.5 hrs',
                                                },
                        ];

                        // Feature 39 Data
                        const xaiExplanation = {
                                                title: 'Migrate Auth Service to gRPC Token Vault Protocol',
                                                summary: 'Generated with 96.4% confidence based on AST static analysis: removing direct DB session imports eliminates lock contention and reduces API response overhead by ~70%.',
                                                factors: [
                                                                        {
                                                                                                factor: 'AST Interface Isolation',
                                                                                                weight: '+0.45',
                                                                                                desc: 'Zero direct DB session references found in public API routes.',
                                                                        },
                                                                        {
                                                                                                factor: 'Security Compliance',
                                                                                                weight: '+0.35',
                                                                                                desc: 'Complies with RS256 cryptographic token rotation guidelines.',
                                                                        },
                                                                        {
                                                                                                factor: 'Serialization Overhead',
                                                                                                weight: '+0.20',
                                                                                                desc: 'Protobuf binary encoding bypasses JSON parsing bottlenecks.',
                                                                        },
                                                ],
                                                snippet: 'class AuthVaultClient:\n    async def verify_token(self, token: str) -> TokenClaims:\n        ...',
                        };

                        // Feature 40 Data
                        const crossDomainInsights = [
                                                {
                                                                        title: 'Database Lock Contention Direct Impact on Next.js UI Stalls',
                                                                        domains: [
                                                                                                'PostgreSQL DB',
                                                                                                'FastAPI Backend',
                                                                                                'Next.js Frontend',
                                                                        ],
                                                                        desc: 'SQL row-locking during checkout transaction spikes API response to >200ms, causing Next.js client-side re-click anomalies.',
                                                                        action: 'Implement event-driven checkout queue to immediately acknowledge UI order placement.',
                                                },
                                                {
                                                                        title: 'CI/CD Pipeline Build Times Impacting PR Code Review Turnaround',
                                                                        domains: [
                                                                                                'GitHub Actions CI',
                                                                                                'Team Workflow',
                                                                                                'Code Quality',
                                                                        ],
                                                                        desc: '18-minute integration test runs discourage developers from breaking PRs into smaller, reviewable commits.',
                                                                        action: 'Enable pytest-xdist parallelization and Redis artifact caching.',
                                                },
                        ];

                        const handleFeedbackSubmit = (e: React.FormEvent) => {
                                                e.preventDefault();
                                                setFeedbackSubmitted(true);
                                                setTimeout(() => setFeedbackSubmitted(false), 3000);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Banner Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-2.5 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400">
                                                                                                                                                                        <Brain className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/20">
                                                                                                                                                                                                Features
                                                                                                                                                                                                31–40
                                                                                                                                                                                                —
                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                Core
                                                                                                                                                                                                Suite
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
                                                                                                                                                                                                Knowledge
                                                                                                                                                                                                Graph
                                                                                                                                                                                                &
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                Intelligence
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Synthesizes
                                                                                                                                                codebase
                                                                                                                                                knowledge
                                                                                                                                                graphs,
                                                                                                                                                tracks
                                                                                                                                                technology
                                                                                                                                                radar
                                                                                                                                                lifecycles,
                                                                                                                                                provides
                                                                                                                                                explainable
                                                                                                                                                AI
                                                                                                                                                decision
                                                                                                                                                rationale,
                                                                                                                                                historical
                                                                                                                                                health
                                                                                                                                                trends,
                                                                                                                                                and
                                                                                                                                                strategic
                                                                                                                                                cross-domain
                                                                                                                                                engineering
                                                                                                                                                insights.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        AI
                                                                                                                                                                        Confidence
                                                                                                                                                                        Engine
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-purple-300">
                                                                                                                                                                        96.4%
                                                                                                                                                                        Recommendation
                                                                                                                                                                        Confidence
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Tabs */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'graph',
                                                                                                                                                label: 'Graph Explorer',
                                                                                                                                                icon: Network,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'radar',
                                                                                                                                                label: 'Tech Radar Lifecycle',
                                                                                                                                                icon: Compass,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'alerts',
                                                                                                                                                label: 'Emerging Alerts',
                                                                                                                                                icon: Bell,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'stories',
                                                                                                                                                label: 'Success Stories',
                                                                                                                                                icon: Trophy,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'cases',
                                                                                                                                                label: 'Case Studies',
                                                                                                                                                icon: BookOpen,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'feedback',
                                                                                                                                                label: 'AI Feedback Loop',
                                                                                                                                                icon: ThumbsUp,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'confidence',
                                                                                                                                                label: 'Pattern Confidence',
                                                                                                                                                icon: ShieldCheck,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'trends',
                                                                                                                                                label: 'Historical Trends',
                                                                                                                                                icon: LineChart,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'xai',
                                                                                                                                                label: 'Explainable AI',
                                                                                                                                                icon: HelpCircle,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'cross',
                                                                                                                                                label: 'Cross-Domain Insights',
                                                                                                                                                icon: Layers,
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
                                                                                                                                                                                                                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
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

                                                                        {/* TAB 1: Knowledge Graph Explorer (Feature 31) */}
                                                                        {activeTab === 'graph' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                                                                        <Network className="w-5 h-5 text-purple-400" />{' '}
                                                                                                                                                                        Interactive
                                                                                                                                                                        Codebase
                                                                                                                                                                        Knowledge
                                                                                                                                                                        Graph
                                                                                                                                                                        Explorer
                                                                                                                                                </h2>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                                                                                                                                                        {graphNodes.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        node
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        node.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className={`p-4 rounded-xl border ${node.color}`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <span className="text-[10px] uppercase font-bold tracking-wider">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                node.type
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <div className="text-sm font-extrabold text-white mt-1">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                node.name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-[11px] opacity-80 mt-2">
                                                                                                                                                                                                                                                                        ID:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                node.id
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-xs space-y-2">
                                                                                                                                                                        <div className="text-slate-400 font-semibold uppercase tracking-wider mb-2">
                                                                                                                                                                                                Graph
                                                                                                                                                                                                Relationships:
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-slate-300 flex items-center gap-2">
                                                                                                                                                                                                <GitBranch className="w-4 h-4 text-purple-400" />{' '}
                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                        CodeAtlas
                                                                                                                                                                                                                        Backend
                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                —
                                                                                                                                                                                                DEPENDS_ON
                                                                                                                                                                                                ➔{' '}
                                                                                                                                                                                                <span className="text-cyan-400 font-bold">
                                                                                                                                                                                                                        Auth
                                                                                                                                                                                                                        Vault
                                                                                                                                                                                                                        Service
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-slate-300 flex items-center gap-2">
                                                                                                                                                                                                <GitBranch className="w-4 h-4 text-purple-400" />{' '}
                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                        CodeAtlas
                                                                                                                                                                                                                        Backend
                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                —
                                                                                                                                                                                                DEPENDS_ON
                                                                                                                                                                                                ➔{' '}
                                                                                                                                                                                                <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                        Neo4j
                                                                                                                                                                                                                        Graph
                                                                                                                                                                                                                        Client
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-slate-300 flex items-center gap-2">
                                                                                                                                                                                                <GitBranch className="w-4 h-4 text-purple-400" />{' '}
                                                                                                                                                                                                <span className="font-bold text-cyan-400">
                                                                                                                                                                                                                        Auth
                                                                                                                                                                                                                        Vault
                                                                                                                                                                                                                        Service
                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                —
                                                                                                                                                                                                USES_PATTERN
                                                                                                                                                                                                ➔{' '}
                                                                                                                                                                                                <span className="text-amber-400 font-bold">
                                                                                                                                                                                                                        Event-Driven
                                                                                                                                                                                                                        Arch
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: Technology Lifecycle Tracking (Feature 32) */}
                                                                        {activeTab === 'radar' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Technology
                                                                                                                                                                        Radar
                                                                                                                                                                        &
                                                                                                                                                                        Lifecycle
                                                                                                                                                                        Status
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                                                                                                        {techRadar.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        item,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start justify-between"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                                                                                                                <span className="text-sm font-bold text-white">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                item.name
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                                                                                                                                                                                                                                                                                                                item.status ===
                                                                                                                                                                                                                                                                                                                                                'Adopt'
                                                                                                                                                                                                                                                                                                                                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                                                                                                                                                                                                                                                                                                                        : item.status ===
                                                                                                                                                                                                                                                                                                                                                                            'Hold'
                                                                                                                                                                                                                                                                                                                                                                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                                                                                                                                                                                                                                                                                                                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                item.status
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <p className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.desc
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="text-xs text-slate-500 font-mono">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                item.cat
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: Emerging Technology Alerts (Feature 33) */}
                                                                        {activeTab === 'alerts' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Real-Time
                                                                                                                                                                        Emerging
                                                                                                                                                                        Technology
                                                                                                                                                                        &
                                                                                                                                                                        Security
                                                                                                                                                                        Alerts
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-4">
                                                                                                                                                                        {emergingAlerts.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        alt
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        alt.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start justify-between"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                                                                                                                <span className="text-sm font-bold text-white">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                alt.tech
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                alt.type
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <p className="text-xs text-slate-300 mt-1">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        alt.action
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <button className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold">
                                                                                                                                                                                                                                                                        Resolve
                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: Architecture Success Stories (Feature 34) */}
                                                                        {activeTab ===
                                                                                                'stories' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                {successStories.map(
                                                                                                                                                                        (
                                                                                                                                                                                                story,
                                                                                                                                                                                                i
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        story.org
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <h3 className="text-base font-extrabold text-white mt-1">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        story.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                                        <div className="grid grid-cols-2 gap-3 my-4">
                                                                                                                                                                                                                                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                                                                                        <div className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                                                Latency
                                                                                                                                                                                                                                                                                                Reduction
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-xl font-black text-emerald-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        story.latencyDrop
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                                                                                        <div className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                                                Infra
                                                                                                                                                                                                                                                                                                Cost
                                                                                                                                                                                                                                                                                                Savings
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-xl font-black text-cyan-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        story.costSavings
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <ul className="space-y-1 text-xs text-slate-300">
                                                                                                                                                                                                                                                {story.outcomes.map(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                out,
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                <li
                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                        className="flex items-center gap-2"
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                out
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
                                                                        )}

                                                                        {/* TAB 5: Engineering Case Studies (Feature 35) */}
                                                                        {activeTab === 'cases' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {caseStudies.map(
                                                                                                                                                (
                                                                                                                                                                        cs,
                                                                                                                                                                        i
                                                                                                                                                ) => (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        i
                                                                                                                                                                                                }
                                                                                                                                                                                                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4"
                                                                                                                                                                        >
                                                                                                                                                                                                <h3 className="text-lg font-bold text-white">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                cs.title
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                <div className="text-rose-400 font-bold uppercase mb-1">
                                                                                                                                                                                                                                                                        Problem
                                                                                                                                                                                                                                                                        Statement:
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-slate-300">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                cs.problem
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                <div className="mt-3 text-slate-400">
                                                                                                                                                                                                                                                                        <span className="font-semibold">
                                                                                                                                                                                                                                                                                                Before
                                                                                                                                                                                                                                                                                                Metrics:
                                                                                                                                                                                                                                                                        </span>{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                cs.before
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                <div className="text-emerald-400 font-bold uppercase mb-1">
                                                                                                                                                                                                                                                                        Solution
                                                                                                                                                                                                                                                                        Design:
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-slate-300">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                cs.solution
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                <div className="mt-3 text-slate-400">
                                                                                                                                                                                                                                                                        <span className="font-semibold">
                                                                                                                                                                                                                                                                                                After
                                                                                                                                                                                                                                                                                                Metrics:
                                                                                                                                                                                                                                                                        </span>{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                cs.after
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 6: AI Learning Feedback Loop (Feature 36) */}
                                                                        {activeTab ===
                                                                                                'feedback' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 max-w-2xl">
                                                                                                                                                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                                                                                                                                                                        <ThumbsUp className="w-5 h-5 text-purple-400" />{' '}
                                                                                                                                                                        AI
                                                                                                                                                                        Recommendation
                                                                                                                                                                        Learning
                                                                                                                                                                        Feedback
                                                                                                                                                                        Loop
                                                                                                                                                </h3>
                                                                                                                                                <p className="text-xs text-slate-400 mb-6">
                                                                                                                                                                        Your
                                                                                                                                                                        feedback
                                                                                                                                                                        is
                                                                                                                                                                        fed
                                                                                                                                                                        directly
                                                                                                                                                                        back
                                                                                                                                                                        into
                                                                                                                                                                        our
                                                                                                                                                                        prompt
                                                                                                                                                                        weighting
                                                                                                                                                                        engine
                                                                                                                                                                        to
                                                                                                                                                                        fine-tune
                                                                                                                                                                        future
                                                                                                                                                                        AI
                                                                                                                                                                        architectural
                                                                                                                                                                        suggestions
                                                                                                                                                                        for
                                                                                                                                                                        your
                                                                                                                                                                        codebase.
                                                                                                                                                </p>

                                                                                                                                                <form
                                                                                                                                                                        onSubmit={
                                                                                                                                                                                                handleFeedbackSubmit
                                                                                                                                                                        }
                                                                                                                                                                        className="space-y-4"
                                                                                                                                                >
                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="text-xs text-slate-300 block mb-2 font-semibold">
                                                                                                                                                                                                                        Recommendation
                                                                                                                                                                                                                        Rating
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <div className="flex items-center gap-3">
                                                                                                                                                                                                                        {[
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        val: 'accepted',
                                                                                                                                                                                                                                                                        label: 'Accepted (Helpful)',
                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        val: 'modified',
                                                                                                                                                                                                                                                                        label: 'Modified',
                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        val: 'rejected',
                                                                                                                                                                                                                                                                        label: 'Rejected',
                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                        ].map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        r
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        r.val
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                type="button"
                                                                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                                                                        setFeedbackRating(
                                                                                                                                                                                                                                                                                                                                                r.val
                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                                                                                                                                                                                                                                                                                                        feedbackRating ===
                                                                                                                                                                                                                                                                                                                        r.val
                                                                                                                                                                                                                                                                                                                                                ? 'bg-purple-600 text-white shadow'
                                                                                                                                                                                                                                                                                                                                                : 'bg-slate-950 text-slate-400 border border-slate-800'
                                                                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        r.label
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="text-xs text-slate-300 block mb-1 font-semibold">
                                                                                                                                                                                                                        User
                                                                                                                                                                                                                        Feedback
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        Override
                                                                                                                                                                                                                        Notes
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <textarea
                                                                                                                                                                                                                        rows={
                                                                                                                                                                                                                                                3
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                feedbackNotes
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setFeedbackNotes(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        placeholder="Explain why this recommendation was accepted or rejected..."
                                                                                                                                                                                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>

                                                                                                                                                                        <button
                                                                                                                                                                                                type="submit"
                                                                                                                                                                                                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30"
                                                                                                                                                                        >
                                                                                                                                                                                                <Send className="w-4 h-4" />{' '}
                                                                                                                                                                                                Submit
                                                                                                                                                                                                Feedback
                                                                                                                                                                                                to
                                                                                                                                                                                                Retrain
                                                                                                                                                                                                Model
                                                                                                                                                                        </button>

                                                                                                                                                                        {feedbackSubmitted && (
                                                                                                                                                                                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                                                                                                                                                                                                                        <CheckCircle2 className="w-4 h-4" />{' '}
                                                                                                                                                                                                                        Feedback
                                                                                                                                                                                                                        submitted
                                                                                                                                                                                                                        successfully!
                                                                                                                                                                                                                        Model
                                                                                                                                                                                                                        weights
                                                                                                                                                                                                                        updated.
                                                                                                                                                                                                </div>
                                                                                                                                                                        )}
                                                                                                                                                </form>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 7: Pattern Confidence Scoring (Feature 37) */}
                                                                        {activeTab ===
                                                                                                'confidence' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-2">
                                                                                                                                                                        Pattern
                                                                                                                                                                        Structural
                                                                                                                                                                        Confidence
                                                                                                                                                                        Algorithm
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        AST
                                                                                                                                                                                                                        Structural
                                                                                                                                                                                                                        Match
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-extrabold text-purple-400 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                patternConfidence.astMatch
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Security
                                                                                                                                                                                                                        Compliance
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                patternConfidence.securityComp
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Overall
                                                                                                                                                                                                                        Score
                                                                                                                                                                                                                        Verdict
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-extrabold text-cyan-400 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                patternConfidence.score
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 8: Historical Trend Visualization (Feature 38) */}
                                                                        {activeTab === 'trends' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Codebase
                                                                                                                                                                        Health
                                                                                                                                                                        &
                                                                                                                                                                        Tech
                                                                                                                                                                        Debt
                                                                                                                                                                        Historical
                                                                                                                                                                        Trajectory
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                                                                                                        {historicalPoints.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        pt,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="text-xs font-bold text-purple-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                pt.date
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-2xl font-black text-white mt-1">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                pt.health
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        <span className="text-xs font-normal text-slate-400">
                                                                                                                                                                                                                                                                                                score
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-[11px] text-slate-400 mt-2">
                                                                                                                                                                                                                                                                        Coverage:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                pt.coverage
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        |
                                                                                                                                                                                                                                                                        Debt:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                pt.debt
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 9: Explainable AI (XAI) (Feature 39) */}
                                                                        {activeTab === 'xai' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                                                                                                                                                                                                Explainable
                                                                                                                                                                                                AI
                                                                                                                                                                                                Rationale
                                                                                                                                                                                                (XAI)
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-lg font-extrabold text-white mt-2">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        xaiExplanation.title
                                                                                                                                                                                                }
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-slate-300 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        xaiExplanation.summary
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {xaiExplanation.factors.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        f,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start justify-between text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="font-bold text-white">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        f.factor
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <p className="text-slate-400 mt-0.5">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        f.desc
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="font-mono font-bold text-emerald-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                f.weight
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                                                                                                                                                                                                AST
                                                                                                                                                                                                Code
                                                                                                                                                                                                Evidence
                                                                                                                                                                                                Snippet
                                                                                                                                                                        </div>
                                                                                                                                                                        <pre className="text-[11px] text-cyan-300 font-mono overflow-x-auto">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        xaiExplanation.snippet
                                                                                                                                                                                                }
                                                                                                                                                                        </pre>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 10: Cross-Domain Engineering Insights (Feature 40) */}
                                                                        {activeTab === 'cross' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Strategic
                                                                                                                                                                        Cross-Domain
                                                                                                                                                                        Engineering
                                                                                                                                                                        Insights
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-4">
                                                                                                                                                                        {crossDomainInsights.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        ins,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <span className="text-sm font-bold text-white">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        ins.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                                                                                                                                                                {ins.domains.map(
                                                                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                                                                d,
                                                                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                        className="text-[10px] font-semibold px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800"
                                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                d
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                ins.desc
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                <div className="text-xs text-indigo-300 font-semibold pt-1 flex items-center gap-1.5">
                                                                                                                                                                                                                                                                        <Zap className="w-3.5 h-3.5 text-purple-400" />{' '}
                                                                                                                                                                                                                                                                        Action:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                ins.action
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
