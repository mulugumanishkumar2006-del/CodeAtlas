'use client';

import React, { useState } from 'react';
import {
                        Network,
                        Globe,
                        Cpu,
                        Layers,
                        Sparkles,
                        CheckCircle2,
                        ShieldAlert,
                        ArrowRight,
                        Zap,
                        Database,
                        Search,
} from 'lucide-react';

export default function IntelligenceNetworkPage() {
                        const [selectedIssue, setSelectedIssue] = useState(
                                                'DB lock contention on checkout'
                        );
                        const [searchQuery, setSearchQuery] = useState(
                                                'DB lock contention on checkout'
                        );

                        const globalBenchmark = {
                                                sampleSize: '12,450 Repositories',
                                                insight: 'Across 12,450 similar repositories facing high-throughput checkout lock contention, 78.4% of teams solved this problem using Event-Driven Architecture, CQRS, and Redis L2 caching.',
                                                confidence: 98.6,
                                                options: [
                                                                        {
                                                                                                name: 'Option A: Monolith + Read Replicas',
                                                                                                adoption: '21.6% Adoption',
                                                                                                verdict: 'Viable short-term fix (<500K users), low cost ($12K), but scaling bottleneck persists.',
                                                                                                status: 'VIABLE_SHORT_TERM',
                                                                        },
                                                                        {
                                                                                                name: 'Option B: Event-Driven Microservices + CQRS + Redis (RECOMMENDED)',
                                                                                                adoption: '78.4% Adoption',
                                                                                                verdict: 'Best long-term trade-off for scale >1M users. Eliminates row locks, sub-18ms latency.',
                                                                                                status: 'RECOMMENDED',
                                                                        },
                                                ],
                        };

                        const topGlobalPatterns = [
                                                {
                                                                        name: 'Event-Driven Architecture (EDA)',
                                                                        adoption: '64.2%',
                                                                        tech: 'Kafka + Redis + gRPC',
                                                                        tradeOff: 'Decoupled writes, requires async monitoring.',
                                                },
                                                {
                                                                        name: 'Command Query Responsibility Segregation (CQRS)',
                                                                        adoption: '48.5%',
                                                                        tech: 'Postgres Replicas + ES',
                                                                        tradeOff: 'Sub-10ms reads, eventual consistency.',
                                                },
                                                {
                                                                        name: 'L2 Distributed Cache Layer',
                                                                        adoption: '82.1%',
                                                                        tech: 'Redis write-through cache',
                                                                        tradeOff: 'Bypasses 85% DB load, requires TTL handling.',
                                                },
                        ];

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-2.5 bg-cyan-600/20 border border-cyan-500/30 rounded-xl text-cyan-400">
                                                                                                                                                                        <Network className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                24
                                                                                                                                                                                                —
                                                                                                                                                                                                The
                                                                                                                                                                                                Software
                                                                                                                                                                                                Internet
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Intelligence
                                                                                                                                                                                                Network
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Synthesizes
                                                                                                                                                architectural
                                                                                                                                                patterns
                                                                                                                                                across
                                                                                                                                                12,000+
                                                                                                                                                public
                                                                                                                                                and
                                                                                                                                                enterprise
                                                                                                                                                repositories
                                                                                                                                                to
                                                                                                                                                provide
                                                                                                                                                cross-repository
                                                                                                                                                comparative
                                                                                                                                                intelligence.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
                                                                                                                        <span className="text-slate-300 font-bold">
                                                                                                                                                12,450
                                                                                                                                                Repositories
                                                                                                                                                Indexed
                                                                                                                        </span>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Global Recommendation Card (The Core Mission) */}
                                                                        <div className="bg-gradient-to-br from-cyan-950/90 via-slate-900 to-indigo-950/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
                                                                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-cyan-500/20 pb-4 gap-4">
                                                                                                                        <div>
                                                                                                                                                <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-extrabold text-[11px] border border-cyan-500/30 uppercase tracking-widest">
                                                                                                                                                                        Global
                                                                                                                                                                        Pattern
                                                                                                                                                                        Benchmark
                                                                                                                                                </span>
                                                                                                                                                <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
                                                                                                                                                                        <Sparkles className="w-6 h-6 text-cyan-400" />{' '}
                                                                                                                                                                        Cross-Repository
                                                                                                                                                                        Intelligence
                                                                                                                                                                        Engine
                                                                                                                                                </h2>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center gap-2 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 text-xs">
                                                                                                                                                <Zap className="w-4 h-4 text-amber-400" />
                                                                                                                                                <span className="text-slate-300 font-bold">
                                                                                                                                                                        Confidence
                                                                                                                                                                        Rating:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                globalBenchmark.confidence
                                                                                                                                                                        }

                                                                                                                                                                        %
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Issue Search Bar */}
                                                                                                <div className="flex gap-2">
                                                                                                                        <div className="relative flex-1">
                                                                                                                                                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                                                                                                                                                <input
                                                                                                                                                                        type="text"
                                                                                                                                                                        value={
                                                                                                                                                                                                searchQuery
                                                                                                                                                                        }
                                                                                                                                                                        onChange={(
                                                                                                                                                                                                e
                                                                                                                                                                        ) =>
                                                                                                                                                                                                setSearchQuery(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        placeholder="Query global benchmark across 12,000 repos..."
                                                                                                                                                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all"
                                                                                                                                                />
                                                                                                                        </div>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setSelectedIssue(
                                                                                                                                                                                                searchQuery
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/30"
                                                                                                                        >
                                                                                                                                                Query
                                                                                                                                                Network
                                                                                                                        </button>
                                                                                                </div>

                                                                                                {/* Benchmark Verdict Box */}
                                                                                                <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 space-y-3">
                                                                                                                        <div className="text-xs text-slate-400 uppercase tracking-wider font-extrabold flex items-center gap-2">
                                                                                                                                                <Database className="w-4 h-4 text-cyan-400" />{' '}
                                                                                                                                                Global
                                                                                                                                                Synthesis
                                                                                                                                                Verdict
                                                                                                                                                (
                                                                                                                                                {
                                                                                                                                                                        globalBenchmark.sampleSize
                                                                                                                                                }

                                                                                                                                                )
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-100 text-sm font-medium leading-relaxed bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                                                                                                                                                "
                                                                                                                                                {
                                                                                                                                                                        globalBenchmark.insight
                                                                                                                                                }

                                                                                                                                                "
                                                                                                                        </p>

                                                                                                                        {/* Options Comparison */}
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                                                                                                                {globalBenchmark.options.map(
                                                                                                                                                                        (
                                                                                                                                                                                                opt,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`p-4 rounded-xl border space-y-2 transition-all ${
                                                                                                                                                                                                                                                opt.status ===
                                                                                                                                                                                                                                                'RECOMMENDED'
                                                                                                                                                                                                                                                                        ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                                                                                                                                                                                                                                                                        : 'bg-slate-900/80 border-slate-800'
                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                <span className="font-extrabold text-white text-xs">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                opt.name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                                                                                                                                                                                                                                                                                                opt.status ===
                                                                                                                                                                                                                                                                                                'RECOMMENDED'
                                                                                                                                                                                                                                                                                                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                                                                                                                                                                                                                                                                                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                opt.adoption
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <p className="text-slate-300 text-xs leading-relaxed">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        opt.verdict
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Pattern AI & Trend AI Explorer */}
                                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                                                                {topGlobalPatterns.map(
                                                                                                                        (
                                                                                                                                                pat,
                                                                                                                                                idx
                                                                                                                        ) => (
                                                                                                                                                <div
                                                                                                                                                                        key={
                                                                                                                                                                                                idx
                                                                                                                                                                        }
                                                                                                                                                                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
                                                                                                                                                >
                                                                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                                                                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <Cpu className="w-4 h-4 text-cyan-400" />{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                pat.name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                pat.adoption
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="space-y-2 text-xs">
                                                                                                                                                                                                <div className="text-slate-400 font-medium">
                                                                                                                                                                                                                        Standard
                                                                                                                                                                                                                        Tech
                                                                                                                                                                                                                        Stack:{' '}
                                                                                                                                                                                                                        <span className="text-white font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        pat.tech
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                pat.tradeOff
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )
                                                                                                )}
                                                                        </div>

                                                                        {/* Items 2 & 3: Architecture Pattern Detector & Repository Similarity Engine */}
                                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                                                {/* Item 2: Architecture Pattern Detector */}
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <Layers className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        Architecture
                                                                                                                                                                        Pattern
                                                                                                                                                                        Detector
                                                                                                                                                </h3>
                                                                                                                                                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                                        4
                                                                                                                                                                        ACTIVE
                                                                                                                                                                        PATTERNS
                                                                                                                                                                        DETECTED
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <span className="font-extrabold text-white">
                                                                                                                                                                                                                        Event
                                                                                                                                                                                                                        Driven
                                                                                                                                                                                                                        Architecture
                                                                                                                                                                                                                        (EDA)
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        98.4%
                                                                                                                                                                                                                        CONFIDENCE
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-400">
                                                                                                                                                                                                Kafka
                                                                                                                                                                                                message
                                                                                                                                                                                                consumers
                                                                                                                                                                                                in
                                                                                                                                                                                                orders-fulfillment
                                                                                                                                                                                                service
                                                                                                                                                                                                and
                                                                                                                                                                                                auth
                                                                                                                                                                                                audit
                                                                                                                                                                                                streams.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <span className="font-extrabold text-white">
                                                                                                                                                                                                                        Clean
                                                                                                                                                                                                                        Architecture
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        Hexagonal
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        96.5%
                                                                                                                                                                                                                        CONFIDENCE
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-400">
                                                                                                                                                                                                Strict
                                                                                                                                                                                                isolation
                                                                                                                                                                                                of
                                                                                                                                                                                                domain
                                                                                                                                                                                                entities,
                                                                                                                                                                                                ports,
                                                                                                                                                                                                and
                                                                                                                                                                                                adapters
                                                                                                                                                                                                across
                                                                                                                                                                                                app
                                                                                                                                                                                                layers.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Item 3: Repository Similarity Engine */}
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <Globe className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                        Repository
                                                                                                                                                                        Similarity
                                                                                                                                                                        Engine
                                                                                                                                                </h3>
                                                                                                                                                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                                        TOP
                                                                                                                                                                        2
                                                                                                                                                                        MATCHES
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <span className="font-extrabold text-white">
                                                                                                                                                                                                                        uber/order-gateway-service
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        96.4%
                                                                                                                                                                                                                        MATCH
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                Takeaway:
                                                                                                                                                                                                Scaled
                                                                                                                                                                                                this
                                                                                                                                                                                                topology
                                                                                                                                                                                                to
                                                                                                                                                                                                120,000
                                                                                                                                                                                                QPS
                                                                                                                                                                                                adding
                                                                                                                                                                                                gRPC
                                                                                                                                                                                                connection
                                                                                                                                                                                                pooling.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <span className="font-extrabold text-white">
                                                                                                                                                                                                                        stripe/billing-ledger-core
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        94.1%
                                                                                                                                                                                                                        MATCH
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                Takeaway:
                                                                                                                                                                                                Uses
                                                                                                                                                                                                partition-based
                                                                                                                                                                                                idempotency
                                                                                                                                                                                                keys
                                                                                                                                                                                                to
                                                                                                                                                                                                guarantee
                                                                                                                                                                                                zero
                                                                                                                                                                                                duplicate
                                                                                                                                                                                                charges.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Items 9 & 10: Anti-Pattern Detector & AI Architecture Coach */}
                                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                                                {/* Item 9: Anti-Pattern Detector */}
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <ShieldAlert className="w-5 h-5 text-rose-400" />{' '}
                                                                                                                                                                        Anti-Pattern
                                                                                                                                                                        Detector
                                                                                                                                                </h3>
                                                                                                                                                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                                        88.4
                                                                                                                                                                        HEALTH
                                                                                                                                                                        SCORE
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 border-l-4 border-l-rose-500">
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <span className="font-extrabold text-white">
                                                                                                                                                                                                                        God
                                                                                                                                                                                                                        Object
                                                                                                                                                                                                                        Pattern
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        HIGH
                                                                                                                                                                                                                        SEVERITY
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-slate-400 font-mono text-[11px]">
                                                                                                                                                                                                legacy-payment-gateway/monolith_handler.py
                                                                                                                                                                                                (3,400
                                                                                                                                                                                                LOC)
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                Single
                                                                                                                                                                                                module
                                                                                                                                                                                                handles
                                                                                                                                                                                                billing,
                                                                                                                                                                                                refund
                                                                                                                                                                                                processing,
                                                                                                                                                                                                audit
                                                                                                                                                                                                logging,
                                                                                                                                                                                                and
                                                                                                                                                                                                email
                                                                                                                                                                                                notifications.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 border-l-4 border-l-amber-500">
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <span className="font-extrabold text-white">
                                                                                                                                                                                                                        Circular
                                                                                                                                                                                                                        Dependency
                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        MEDIUM
                                                                                                                                                                                                                        SEVERITY
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                Orders-Router
                                                                                                                                                                                                ➔
                                                                                                                                                                                                Inventory-Service
                                                                                                                                                                                                ➔
                                                                                                                                                                                                Orders-Router
                                                                                                                                                                                                status
                                                                                                                                                                                                loop.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Item 10: AI Architecture Coach */}
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <Sparkles className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                        AI
                                                                                                                                                                        Architecture
                                                                                                                                                                        Coach
                                                                                                                                                </h3>
                                                                                                                                                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                                        INTERACTIVE
                                                                                                                                                                        RATIONALE
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                                                                                                                                                <div className="font-extrabold text-amber-300">
                                                                                                                                                                        Why
                                                                                                                                                                        Event-Driven
                                                                                                                                                                        Architecture
                                                                                                                                                                        over
                                                                                                                                                                        REST
                                                                                                                                                                        polling?
                                                                                                                                                </div>
                                                                                                                                                <p className="text-slate-300 leading-relaxed">
                                                                                                                                                                        REST
                                                                                                                                                                        polling
                                                                                                                                                                        causes
                                                                                                                                                                        85%
                                                                                                                                                                        redundant
                                                                                                                                                                        DB
                                                                                                                                                                        queries
                                                                                                                                                                        during
                                                                                                                                                                        idle
                                                                                                                                                                        windows.
                                                                                                                                                                        Event-Driven
                                                                                                                                                                        messaging
                                                                                                                                                                        consumes
                                                                                                                                                                        zero
                                                                                                                                                                        CPU
                                                                                                                                                                        until
                                                                                                                                                                        an
                                                                                                                                                                        event
                                                                                                                                                                        arrives,
                                                                                                                                                                        preserving
                                                                                                                                                                        resource
                                                                                                                                                                        capacity
                                                                                                                                                                        for
                                                                                                                                                                        spike
                                                                                                                                                                        loads.
                                                                                                                                                </p>
                                                                                                                                                <div className="text-[11px] text-cyan-400 font-semibold border-t border-slate-800 pt-2">
                                                                                                                                                                        Suggested
                                                                                                                                                                        Gap:
                                                                                                                                                                        Register
                                                                                                                                                                        Circuit
                                                                                                                                                                        Breaker
                                                                                                                                                                        pattern
                                                                                                                                                                        (Resilience4j)
                                                                                                                                                                        on
                                                                                                                                                                        external
                                                                                                                                                                        Stripe
                                                                                                                                                                        API
                                                                                                                                                                        calls.
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Items 11–20: Global 10D Benchmarking Suite */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                                                                                                                                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />{' '}
                                                                                                                                                Global
                                                                                                                                                10D
                                                                                                                                                Benchmarking
                                                                                                                                                &
                                                                                                                                                Modernization
                                                                                                                                                Suite
                                                                                                                        </h3>
                                                                                                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                TOP
                                                                                                                                                5%
                                                                                                                                                GLOBAL
                                                                                                                                                RANK
                                                                                                                        </span>
                                                                                                </div>

                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-cyan-400">
                                                                                                                                                                        11.
                                                                                                                                                                        Tech
                                                                                                                                                                        Migration
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        REST
                                                                                                                                                                        ➔
                                                                                                                                                                        gRPC
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        74.2%
                                                                                                                                                                        adoption
                                                                                                                                                                        in
                                                                                                                                                                        top
                                                                                                                                                                        high-QPS
                                                                                                                                                                        repos.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-indigo-400">
                                                                                                                                                                        12.
                                                                                                                                                                        API
                                                                                                                                                                        Design
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        96.4
                                                                                                                                                                        /
                                                                                                                                                                        100
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        OpenAPI
                                                                                                                                                                        3.1
                                                                                                                                                                        Strict
                                                                                                                                                                        Schema
                                                                                                                                                                        (Top
                                                                                                                                                                        5%).
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-emerald-400">
                                                                                                                                                                        13.
                                                                                                                                                                        Database
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        92.0%
                                                                                                                                                                        Efficiency
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        PgBouncer
                                                                                                                                                                        +
                                                                                                                                                                        Sub-2ms
                                                                                                                                                                        Read
                                                                                                                                                                        Latency.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-purple-400">
                                                                                                                                                                        14.
                                                                                                                                                                        Security
                                                                                                                                                                        Posture
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        Top
                                                                                                                                                                        2%
                                                                                                                                                                        Globally
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        RS256
                                                                                                                                                                        JWT
                                                                                                                                                                        Rotation
                                                                                                                                                                        &
                                                                                                                                                                        zero
                                                                                                                                                                        vulnerabilities.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-amber-400">
                                                                                                                                                                        15.
                                                                                                                                                                        Testing
                                                                                                                                                                        Maturity
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        94.8%
                                                                                                                                                                        Coverage
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        Exceeds
                                                                                                                                                                        80.0%
                                                                                                                                                                        global
                                                                                                                                                                        average.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-rose-400">
                                                                                                                                                                        16.
                                                                                                                                                                        Doc
                                                                                                                                                                        Maturity
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        88.5%
                                                                                                                                                                        Docstrings
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        Top
                                                                                                                                                                        12%
                                                                                                                                                                        global
                                                                                                                                                                        documentation
                                                                                                                                                                        score.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-teal-400">
                                                                                                                                                                        17.
                                                                                                                                                                        Dependencies
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        100%
                                                                                                                                                                        Up
                                                                                                                                                                        to
                                                                                                                                                                        Date
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        0
                                                                                                                                                                        outdated
                                                                                                                                                                        dependencies.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-blue-400">
                                                                                                                                                                        18.
                                                                                                                                                                        Deployment
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        GitOps
                                                                                                                                                                        Blue-Green
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        98/100
                                                                                                                                                                        automation
                                                                                                                                                                        benchmark.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-sky-400">
                                                                                                                                                                        19.
                                                                                                                                                                        Cloud
                                                                                                                                                                        Arch
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        AWS
                                                                                                                                                                        EKS
                                                                                                                                                                        Multi-AZ
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        92.4/100
                                                                                                                                                                        cost
                                                                                                                                                                        efficiency.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <span className="font-extrabold text-orange-400">
                                                                                                                                                                        20.
                                                                                                                                                                        Performance
                                                                                                                                                </span>
                                                                                                                                                <div className="text-white font-bold">
                                                                                                                                                                        18ms
                                                                                                                                                                        /
                                                                                                                                                                        45K
                                                                                                                                                                        QPS
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                        Top
                                                                                                                                                                        3%
                                                                                                                                                                        throughput
                                                                                                                                                                        globally.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
