'use client';

import React, { useState } from 'react';
import {
                        Monitor,
                        Cpu,
                        Search,
                        CheckCircle2,
                        AlertCircle,
                        Activity,
                        Layers,
                        Sparkles,
                        Zap,
                        Terminal,
                        Server,
                        ShieldCheck,
                        RotateCw,
                        ArrowRight,
                        GitBranch,
                        BookOpen,
                        Kanban,
} from 'lucide-react';

export default function CodeAtlasOSPage() {
                        const [queryInput, setQueryInput] = useState(
                                                'Which service is our biggest scalability risk?'
                        );
                        const [activeQueryResult, setActiveQueryResult] = useState<any>({
                                                category: 'Scalability Risk',
                                                headline: 'analytics-ingestion-worker is the #1 scalability risk.',
                                                details: [
                                                                        "Unindexed database query on 'events_raw' table creates bottleneck at > 15,000 RPM.",
                                                                        'Datadog APM metrics show CPU utilization spikes to 94% under load.',
                                                                        "Recommendation: Apply Redis L2 caching and add index on 'events_raw(timestamp, user_id)'.",
                                                ],
                                                confidence: '98.2%',
                                                subsystems: [
                                                                        'Repository Intelligence',
                                                                        'Digital Twin Engine',
                                                                        'AI CTO Council',
                                                                        'Autonomous Engineering',
                                                                        'Enterprise Intelligence',
                                                ],
                        });
                        const [isQuerying, setIsQuerying] = useState(false);

                        const presetQueries = [
                                                'Which service is our biggest scalability risk?',
                                                'Why did latency increase after Release 3.2?',
                                                'Which repository should be modernized first?',
                                                'What is our engineering ROI?',
                                                'Can our architecture support 100 million users?',
                                                'Which team owns the checkout workflow?',
                                                'What is blocking our release?',
                        ];

                        const subsystems = [
                                                {
                                                                        id: 'repo-intel',
                                                                        name: 'Repository Intelligence',
                                                                        phase: 'Phases 1-15',
                                                                        status: 'ACTIVE',
                                                                        icon: Layers,
                                                                        href: '/repository-dna',
                                                },
                                                {
                                                                        id: 'digital-twin',
                                                                        name: 'Digital Twin Engine',
                                                                        phase: 'Phase 16',
                                                                        status: 'ACTIVE',
                                                                        icon: Cpu,
                                                                        href: '/scenario-simulator',
                                                },
                                                {
                                                                        id: 'ai-council',
                                                                        name: 'AI CTO Council',
                                                                        phase: 'Phase 17',
                                                                        status: 'ACTIVE',
                                                                        icon: Sparkles,
                                                                        href: '/council',
                                                },
                                                {
                                                                        id: 'autonomous-eng',
                                                                        name: 'Autonomous Engineering',
                                                                        phase: 'Phase 18',
                                                                        status: 'ACTIVE',
                                                                        icon: Zap,
                                                                        href: '/autonomous',
                                                },
                                                {
                                                                        id: 'enterprise-intel',
                                                                        name: 'Enterprise Intelligence',
                                                                        phase: 'Phase 19',
                                                                        status: 'ACTIVE',
                                                                        icon: Server,
                                                                        href: '/enterprise',
                                                },
                        ];

                        const toolAdapters = [
                                                {
                                                                        name: 'GitHub',
                                                                        category: 'Source Control',
                                                                        icon: GitBranch,
                                                                        status: 'CONNECTED',
                                                                        events: '14,250 / 24h',
                                                },
                                                {
                                                                        name: 'Jira',
                                                                        category: 'Project Management',
                                                                        icon: Kanban,
                                                                        status: 'CONNECTED',
                                                                        events: '3,410 / 24h',
                                                },
                                                {
                                                                        name: 'SonarQube',
                                                                        category: 'Code Quality',
                                                                        icon: CheckCircle2,
                                                                        status: 'CONNECTED',
                                                                        events: '1,200 / 24h',
                                                },
                                                {
                                                                        name: 'Datadog',
                                                                        category: 'Observability APM',
                                                                        icon: Activity,
                                                                        status: 'CONNECTED',
                                                                        events: '45,000 / 24h',
                                                },
                                                {
                                                                        name: 'Confluence',
                                                                        category: 'Documentation',
                                                                        icon: BookOpen,
                                                                        status: 'CONNECTED',
                                                                        events: '890 / 24h',
                                                },
                                                {
                                                                        name: 'Snyk',
                                                                        category: 'Security Radar',
                                                                        icon: ShieldCheck,
                                                                        status: 'CONNECTED',
                                                                        events: '2,150 / 24h',
                                                },
                                                {
                                                                        name: 'Jenkins',
                                                                        category: 'CI/CD Automation',
                                                                        icon: Terminal,
                                                                        status: 'CONNECTED',
                                                                        events: '1,840 / 24h',
                                                },
                        ];

                        const handleRunQuery = (queryText: string) => {
                                                setQueryInput(queryText);
                                                setIsQuerying(true);
                                                setTimeout(() => {
                                                                        let cat =
                                                                                                'Engineering Query';
                                                                        let head = `Synthesized answer for query: '${queryText}'`;
                                                                        let det = [
                                                                                                'Cross-referencing Knowledge Graph, Event Bus, and AI Memory.',
                                                                                                'Synthesizing Datadog APM, GitHub commits, Jira issues, and Snyk security scans.',
                                                                        ];
                                                                        let conf = '96.5%';

                                                                        const lower =
                                                                                                queryText.toLowerCase();
                                                                        if (
                                                                                                lower.includes(
                                                                                                                        'scalability risk'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Scalability Risk';
                                                                                                head =
                                                                                                                        'analytics-ingestion-worker is the #1 scalability risk.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                "Unindexed database query on 'events_raw' table creates bottleneck at > 15,000 RPM.",
                                                                                                                                                'Datadog APM metrics show CPU utilization spikes to 94% under load.',
                                                                                                                                                "Recommendation: Apply Redis L2 caching and add index on 'events_raw(timestamp, user_id)'.",
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '98.2%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'latency increase'
                                                                                                ) ||
                                                                                                lower.includes(
                                                                                                                        'release 3.2'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Performance Incident Root Cause';
                                                                                                head =
                                                                                                                        'Latency increased +180ms due to synchronous third-party HTTP call in Release 3.2.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                "Release 3.2 commit 'b819f2a' introduced synchronous payment token verification call.",
                                                                                                                                                'SonarQube & Snyk identified missing timeout configuration on HTTP client.',
                                                                                                                                                'Recommendation: Wrap payment verification call in FastAPI BackgroundTasks worker.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '96.8%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'modernized first'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Modernization Priority';
                                                                                                head =
                                                                                                                        'legacy-payment-gateway should be modernized first (Rank #1).';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Contains 3 CRITICAL CVEs (Snyk scan), 42% test coverage (Jenkins), and high tech debt score.',
                                                                                                                                                'High revenue coupling makes this repository the top priority for Sprint 1.',
                                                                                                                                                'Recommendation: Run Phase 18 Autonomous Security Patch Generator & Refactoring Engine.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '99.0%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'roi'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Engineering ROI';
                                                                                                head =
                                                                                                                        'CodeAtlas OS delivered $1.45M cost avoidance and 18,400 developer hours saved.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Automated debt reduction reduced sprint bug tickets by 28.5%.',
                                                                                                                                                'Pre-PR AI Code Review gates prevented 14 critical production regressions.',
                                                                                                                                                'ROI Ratio: 7.4x return on total engineering infrastructure investment.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '95.5%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        '100 million'
                                                                                                ) ||
                                                                                                lower.includes(
                                                                                                                        '100m'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Capacity Planning';
                                                                                                head =
                                                                                                                        'Architecture supports up to 45M active users. Scaling to 100M requires 2 bottlenecks resolved.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Bottleneck 1: Database primary write node saturates IOPS at 60M users.',
                                                                                                                                                'Bottleneck 2: Session storage in Auth Vault requires multi-region Redis cluster.',
                                                                                                                                                'Recommendation: Execute Phase 18 Database Migration Engine for read-replica sharding.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '94.0%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'checkout'
                                                                                                ) ||
                                                                                                lower.includes(
                                                                                                                        'owns'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Ownership & Team Intelligence';
                                                                                                head =
                                                                                                                        'Payments & Billing Team owns the checkout workflow.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Primary Code Owner: solo.dev@corp.com (Jira & Confluence author).',
                                                                                                                                                'Bus Factor Warning: High single-maintainer concentration detected on checkout-service.',
                                                                                                                                                'Recommendation: Assign 2 co-maintainers from Core API & Gateway team.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '97.5%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'blocking'
                                                                                                ) ||
                                                                                                lower.includes(
                                                                                                                        'release'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Release Blockers';
                                                                                                head =
                                                                                                                        'Release v2026.04-RC2 is currently blocked by 1 unverified DB schema migration.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Jenkins build #481 succeeded, but Alembic database migration dry-run requires sign-off.',
                                                                                                                                                'Human Approval Gateway holds gate in state AWAITING_HUMAN_APPROVAL.',
                                                                                                                                                'Recommendation: Authorize migration in Human Approval Gateway console.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '98.9%';
                                                                        }

                                                                        setActiveQueryResult({
                                                                                                category: cat,
                                                                                                headline: head,
                                                                                                details: det,
                                                                                                confidence: conf,
                                                                                                subsystems: [
                                                                                                                        'Repository Intelligence',
                                                                                                                        'Digital Twin Engine',
                                                                                                                        'AI CTO Council',
                                                                                                                        'Autonomous Engineering',
                                                                                                                        'Enterprise Intelligence',
                                                                                                ],
                                                                        });
                                                                        setIsQuerying(false);
                                                }, 450);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
                                                                        {/* CodeAtlas OS Kernel Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-2.5 bg-cyan-600/20 border border-cyan-500/30 rounded-xl text-cyan-400">
                                                                                                                                                                        <Monitor className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                20
                                                                                                                                                                                                •
                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                OS
                                                                                                                                                                                                Kernel
                                                                                                                                                                                                v20.0.0
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                                                                                                                                                                                                The
                                                                                                                                                                                                Operating
                                                                                                                                                                                                System
                                                                                                                                                                                                for
                                                                                                                                                                                                Software
                                                                                                                                                                                                Engineering
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Connecting
                                                                                                                                                GitHub,
                                                                                                                                                Jira,
                                                                                                                                                SonarQube,
                                                                                                                                                Datadog,
                                                                                                                                                Confluence,
                                                                                                                                                Snyk,
                                                                                                                                                and
                                                                                                                                                Jenkins
                                                                                                                                                into
                                                                                                                                                one
                                                                                                                                                unified
                                                                                                                                                operating
                                                                                                                                                system.
                                                                                                                                                Answer
                                                                                                                                                any
                                                                                                                                                engineering
                                                                                                                                                question
                                                                                                                                                instantly
                                                                                                                                                across
                                                                                                                                                all
                                                                                                                                                repositories,
                                                                                                                                                teams,
                                                                                                                                                and
                                                                                                                                                subsystems.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* System Status Tray */}
                                                                                                <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                                                                                                                        <div className="text-center px-3 border-r border-slate-800">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        OS
                                                                                                                                                                        Kernel
                                                                                                                                                                        Status
                                                                                                                                                </span>
                                                                                                                                                <span className="text-sm font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded mt-1 inline-block">
                                                                                                                                                                        ●
                                                                                                                                                                        OPERATIONAL
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <div className="text-center px-3 border-r border-slate-800">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Subsystems
                                                                                                                                                </span>
                                                                                                                                                <span className="text-2xl font-bold text-white">
                                                                                                                                                                        5
                                                                                                                                                                        /
                                                                                                                                                                        5
                                                                                                                                                                        Active
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <div className="text-center px-3">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Connected
                                                                                                                                                                        Tools
                                                                                                                                                </span>
                                                                                                                                                <span className="text-2xl font-bold text-cyan-400">
                                                                                                                                                                        7
                                                                                                                                                                        Integrations
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Universal Engineering Intelligence Search Bar */}
                                                                        <div className="mb-8 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
                                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                                                        <Sparkles className="w-5 h-5 text-cyan-400" />
                                                                                                                        <h2 className="text-base font-extrabold text-white">
                                                                                                                                                Universal
                                                                                                                                                Engineering
                                                                                                                                                Intelligence
                                                                                                                                                Query
                                                                                                                                                Engine
                                                                                                                        </h2>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 mb-4">
                                                                                                                        <input
                                                                                                                                                type="text"
                                                                                                                                                value={
                                                                                                                                                                        queryInput
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setQueryInput(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                placeholder="Ask any engineering question (e.g. 'Which service is our biggest scalability risk?')"
                                                                                                                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none shadow-inner"
                                                                                                                        />
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        handleRunQuery(
                                                                                                                                                                                                queryInput
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                disabled={
                                                                                                                                                                        isQuerying
                                                                                                                                                }
                                                                                                                                                className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/30"
                                                                                                                        >
                                                                                                                                                {isQuerying ? (
                                                                                                                                                                        <>
                                                                                                                                                                                                <RotateCw className="w-4 h-4 animate-spin" />{' '}
                                                                                                                                                                                                Synthesizing...
                                                                                                                                                                        </>
                                                                                                                                                ) : (
                                                                                                                                                                        <>
                                                                                                                                                                                                <Search className="w-4 h-4" />{' '}
                                                                                                                                                                                                Ask
                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                OS
                                                                                                                                                                        </>
                                                                                                                                                )}
                                                                                                                        </button>
                                                                                                </div>

                                                                                                {/* Preset Query Buttons */}
                                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                                                        <span className="text-xs font-semibold text-slate-400 mr-1">
                                                                                                                                                Preset
                                                                                                                                                Questions:
                                                                                                                        </span>
                                                                                                                        {presetQueries.map(
                                                                                                                                                (
                                                                                                                                                                        q,
                                                                                                                                                                        idx
                                                                                                                                                ) => (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        handleRunQuery(
                                                                                                                                                                                                                                                q
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className="text-xs bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        q
                                                                                                                                                                                                }
                                                                                                                                                                        </button>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>

                                                                        {/* Universal Query Answer Synthesis Display */}
                                                                        {activeQueryResult && (
                                                                                                <div className="mb-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                                                                                                                                                <div className="flex items-center gap-2">
                                                                                                                                                                        <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        activeQueryResult.category
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                                                                                                                                                        Confidence:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                activeQueryResult.confidence
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
                                                                                                                                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                                                                                                                                {
                                                                                                                                                                        activeQueryResult.headline
                                                                                                                                                }
                                                                                                                        </h3>

                                                                                                                        <div className="space-y-2 mb-4 text-sm text-slate-300">
                                                                                                                                                {activeQueryResult.details.map(
                                                                                                                                                                        (
                                                                                                                                                                                                detail: string,
                                                                                                                                                                                                idx: number
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-2"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        detail
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>

                                                                                                                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                                                                                                                                <span>
                                                                                                                                                                        Synthesized
                                                                                                                                                                        across:{' '}
                                                                                                                                                                        {activeQueryResult.subsystems.join(
                                                                                                                                                                                                ' • '
                                                                                                                                                                        )}
                                                                                                                                                </span>
                                                                                                                                                <span className="text-cyan-400 font-semibold">
                                                                                                                                                                        CodeAtlas
                                                                                                                                                                        Knowledge
                                                                                                                                                                        Graph
                                                                                                                                                                        +
                                                                                                                                                                        Event
                                                                                                                                                                        Bus
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* Subsystem Dock Grid (Phases 1-19 Unified) */}
                                                                        <div className="mb-8">
                                                                                                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                        <Layers className="w-5 h-5 text-indigo-400" />
                                                                                                                        CodeAtlas
                                                                                                                        OS
                                                                                                                        Subsystem
                                                                                                                        Engine
                                                                                                                        Dock
                                                                                                                        (5
                                                                                                                        Core
                                                                                                                        Layers)
                                                                                                </h2>

                                                                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                                                                                                        {subsystems.map(
                                                                                                                                                (
                                                                                                                                                                        sub
                                                                                                                                                ) => {
                                                                                                                                                                        const Icon =
                                                                                                                                                                                                sub.icon;
                                                                                                                                                                        return (
                                                                                                                                                                                                <a
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                sub.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        href={
                                                                                                                                                                                                                                                sub.href
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl transition-all hover:scale-[1.02] block"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex items-center justify-between mb-3">
                                                                                                                                                                                                                                                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                                                                                                                                                                                                                                                                        <Icon className="w-5 h-5" />
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                sub.status
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <h3 className="font-bold text-white text-sm block mb-1">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        sub.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                                        <span className="text-xs text-slate-400 block">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        sub.phase
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </a>
                                                                                                                                                                        );
                                                                                                                                                }
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>

                                                                        {/* Multi-Tool Integration Bus Grid */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                                                                                                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                        <Server className="w-5 h-5 text-purple-400" />
                                                                                                                        Multi-Tool
                                                                                                                        Integration
                                                                                                                        Bus
                                                                                                                        (Connected
                                                                                                                        Ecosystem)
                                                                                                </h2>

                                                                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                                                                                                        {toolAdapters.map(
                                                                                                                                                (
                                                                                                                                                                        tool,
                                                                                                                                                                        idx
                                                                                                                                                ) => {
                                                                                                                                                                        const Icon =
                                                                                                                                                                                                tool.icon;
                                                                                                                                                                        return (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex items-center justify-center p-2 bg-slate-900 border border-slate-800 rounded-lg text-cyan-400 mb-2 w-10 h-10 mx-auto">
                                                                                                                                                                                                                                                <Icon className="w-5 h-5" />
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="font-bold text-white text-xs block">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        tool.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-[10px] text-slate-400 block mb-1">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        tool.category
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 block">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        tool.status
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        );
                                                                                                                                                }
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
