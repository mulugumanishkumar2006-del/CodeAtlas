'use client';

import React, { useState } from 'react';
import {
                        Compass,
                        Layers,
                        GitBranch,
                        TrendingUp,
                        ShieldCheck,
                        Zap,
                        Activity,
                        Award,
                        AlertTriangle,
                        CheckCircle2,
                        Clock,
                        ArrowRight,
                        RefreshCw,
                        Cpu,
                        Boxes,
                        Lock,
                        Globe,
                        Sparkles,
                        Server,
                        Play,
                        Terminal,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function CAEEPage() {
                        const [selectedHorizon, setSelectedHorizon] = useState<
                                                'Today' | '1Y' | '3Y' | '5Y'
                        >('3Y');
                        const [isAnalyzing, setIsAnalyzing] = useState(false);

                        const handleRunAnalysis = () => {
                                                setIsAnalyzing(true);
                                                setTimeout(() => {
                                                                        setIsAnalyzing(false);
                                                }, 1000);
                        };

                        const timeNavigatorData = {
                                                Today: {
                                                                        title: 'Current Baseline (Today)',
                                                                        pattern: 'Monolithic Architecture with Shared Database',
                                                                        servicesCount: 1,
                                                                        coupling: '0.42 (High)',
                                                                        techDebt: '120.0 Hours',
                                                                        latency: '120.0 ms',
                                                                        concurrency: '15,000 req/sec',
                                                                        monthlyCost: '$4,200',
                                                                        nodes: [
                                                                                                'Monolith App Server',
                                                                                                'PostgreSQL Instance',
                                                                        ],
                                                                        logs: [
                                                                                                'T+00 Baseline: Monolithic repository structure loaded.',
                                                                                                'T+00 Monolith handling all API routes via synchronous HTTP.',
                                                                        ],
                                                },
                                                '1Y': {
                                                                        title: '+1 Year: Modular Monolith Evolution',
                                                                        pattern: 'Modular Monolith with Domain Repositories',
                                                                        servicesCount: 3,
                                                                        coupling: '0.32 (Moderate)',
                                                                        techDebt: '60.0 Hours (-50%)',
                                                                        latency: '65.0 ms (-45%)',
                                                                        concurrency: '45,000 req/sec',
                                                                        monthlyCost: '$3,800',
                                                                        nodes: [
                                                                                                'Modular App Server',
                                                                                                'PostgreSQL Patroni Cluster',
                                                                                                'Redis 7 Cache',
                                                                        ],
                                                                        logs: [
                                                                                                'T+1Y: Domain models decoupled into independent repository packages.',
                                                                                                'T+1Y: Database queries abstracted behind strict interface contracts.',
                                                                                                'T+1Y: Redis caching layer active; p99 latency dropped from 120ms to 65ms.',
                                                                        ],
                                                },
                                                '3Y': {
                                                                        title: '+3 Years: Decoupled Microservices Evolution',
                                                                        pattern: 'Domain-Driven Decoupled Microservices & Kafka Event Bus',
                                                                        servicesCount: 7,
                                                                        coupling: '0.20 (Low)',
                                                                        techDebt: '25.0 Hours (-79%)',
                                                                        latency: '28.0 ms (-76%)',
                                                                        concurrency: '120,000 req/sec',
                                                                        monthlyCost: '$3,100',
                                                                        nodes: [
                                                                                                'Auth Service (Go)',
                                                                                                'Payment Gateway (Go)',
                                                                                                'Analytics Pipeline (Python)',
                                                                                                'Kafka Cluster',
                                                                                                'PostgreSQL HA',
                                                                                                'Kubernetes HPA',
                                                                        ],
                                                                        logs: [
                                                                                                'T+3Y: Services split! Auth & Payments extracted into high-performance Go microservices.',
                                                                                                'T+3Y: Dependencies shrunk! Synchronous calls replaced with Kafka event streams.',
                                                                                                'T+3Y: Kubernetes HPA scaling pods dynamically from 3 to 30 based on traffic spikes.',
                                                                                                'T+3Y: Technical debt reduced to 25 hours; overall architecture score reached 94.5%.',
                                                                        ],
                                                },
                                                '5Y': {
                                                                        title: '+5 Years: Global Reactive Mesh & AI Native Platform',
                                                                        pattern: 'Autonomous Event-Driven Global Reactive Mesh',
                                                                        servicesCount: 14,
                                                                        coupling: '0.08 (Minimal)',
                                                                        techDebt: '8.0 Hours (-93%)',
                                                                        latency: '12.0 ms (-90%)',
                                                                        concurrency: '350,000 req/sec',
                                                                        monthlyCost: '$2,400',
                                                                        nodes: [
                                                                                                'Global Cloudflare Wasm Edge Mesh',
                                                                                                'Event-Sourced Event Store',
                                                                                                'Active-Active Multi-Region Database',
                                                                                                'Serverless Auto-Scaler',
                                                                                                'AI Self-Healing Guardrails',
                                                                        ],
                                                                        logs: [
                                                                                                'T+5Y: Global Reactive Mesh deployed! Edge Wasm workers execute auth & routing at <12ms p99.',
                                                                                                'T+5Y: Autonomous AI self-healing guardrails active; zero manual ops intervention required.',
                                                                                                'T+5Y: Active-Active multi-region replication live across us-east-1, eu-west-1, ap-southeast-1.',
                                                                                                'T+5Y: Architecture evolution complete! Reached AI Native Platform maturity.',
                                                                        ],
                                                },
                        }[selectedHorizon];

                        return (
                                                <DashboardLayout>
                                                                        <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-6 space-y-6">
                                                                                                {/* Top Header Banner */}
                                                                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 p-6 rounded-2xl border border-purple-800/40 shadow-2xl backdrop-blur-md">
                                                                                                                        <div className="space-y-1">
                                                                                                                                                <div className="flex items-center space-x-3">
                                                                                                                                                                        <div className="p-2.5 bg-purple-600/20 border border-purple-500/30 rounded-xl">
                                                                                                                                                                                                <Compass className="w-7 h-7 text-purple-400 animate-spin-slow" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                                                                                                                        <h1 className="text-2xl font-bold tracking-tight text-white">
                                                                                                                                                                                                                                                Continuous
                                                                                                                                                                                                                                                Architecture
                                                                                                                                                                                                                                                Evolution
                                                                                                                                                                                                                                                Engine
                                                                                                                                                                                                                                                (CAEE)
                                                                                                                                                                                                                        </h1>
                                                                                                                                                                                                                        <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-full">
                                                                                                                                                                                                                                                Phase
                                                                                                                                                                                                                                                34
                                                                                                                                                                                                                                                •
                                                                                                                                                                                                                                                70
                                                                                                                                                                                                                                                Enterprise
                                                                                                                                                                                                                                                Features
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-sm text-gray-400">
                                                                                                                                                                                                                        "The
                                                                                                                                                                                                                        world's
                                                                                                                                                                                                                        first
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        platform
                                                                                                                                                                                                                        that
                                                                                                                                                                                                                        continuously
                                                                                                                                                                                                                        evolves
                                                                                                                                                                                                                        software
                                                                                                                                                                                                                        architecture
                                                                                                                                                                                                                        instead
                                                                                                                                                                                                                        of
                                                                                                                                                                                                                        only
                                                                                                                                                                                                                        monitoring
                                                                                                                                                                                                                        it."
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <button
                                                                                                                                                onClick={
                                                                                                                                                                        handleRunAnalysis
                                                                                                                                                }
                                                                                                                                                disabled={
                                                                                                                                                                        isAnalyzing
                                                                                                                                                }
                                                                                                                                                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
                                                                                                                        >
                                                                                                                                                <RefreshCw
                                                                                                                                                                        className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`}
                                                                                                                                                />
                                                                                                                                                <span>
                                                                                                                                                                        {isAnalyzing
                                                                                                                                                                                                ? 'Analyzing Architecture...'
                                                                                                                                                                                                : 'Run Evolution Analysis'}
                                                                                                                                                </span>
                                                                                                                        </button>
                                                                                                </div>

                                                                                                {/* 🌟 WOW FEATURE: 🧭 Architecture Time Navigator Control Panel */}
                                                                                                <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
                                                                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-900/60 pb-4">
                                                                                                                                                <div className="flex items-center space-x-3">
                                                                                                                                                                        <div className="p-2 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-300">
                                                                                                                                                                                                <Compass className="w-6 h-6 animate-pulse" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                                                                                                                        <h2 className="text-xl font-bold text-white tracking-wide">
                                                                                                                                                                                                                                                🧭
                                                                                                                                                                                                                                                Architecture
                                                                                                                                                                                                                                                Time
                                                                                                                                                                                                                                                Navigator
                                                                                                                                                                                                                        </h2>
                                                                                                                                                                                                                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full uppercase tracking-wider">
                                                                                                                                                                                                                                                WOW
                                                                                                                                                                                                                                                Feature
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-xs text-gray-300">
                                                                                                                                                                                                                        Watch
                                                                                                                                                                                                                        services
                                                                                                                                                                                                                        split,
                                                                                                                                                                                                                        dependencies
                                                                                                                                                                                                                        shrink,
                                                                                                                                                                                                                        technical
                                                                                                                                                                                                                        debt
                                                                                                                                                                                                                        reduce,
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        infrastructure
                                                                                                                                                                                                                        evolve
                                                                                                                                                                                                                        across
                                                                                                                                                                                                                        time
                                                                                                                                                                                                                        horizons.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Time Horizon Slider Switcher */}
                                                                                                                                                <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-indigo-500/30">
                                                                                                                                                                        {(
                                                                                                                                                                                                [
                                                                                                                                                                                                                        'Today',
                                                                                                                                                                                                                        '1Y',
                                                                                                                                                                                                                        '3Y',
                                                                                                                                                                                                                        '5Y',
                                                                                                                                                                                                ] as const
                                                                                                                                                                        ).map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        horizon
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        horizon
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        setSelectedHorizon(
                                                                                                                                                                                                                                                                                                horizon
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                                                                                                                                                                                                                                                                        selectedHorizon ===
                                                                                                                                                                                                                                                                        horizon
                                                                                                                                                                                                                                                                                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40 scale-105'
                                                                                                                                                                                                                                                                                                : 'text-gray-400 hover:text-white hover:bg-slate-800'
                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <Clock className="w-3.5 h-3.5" />
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        {horizon ===
                                                                                                                                                                                                                                                                        'Today'
                                                                                                                                                                                                                                                                                                ? 'Today'
                                                                                                                                                                                                                                                                                                : horizon ===
                                                                                                                                                                                                                                                                                                    '1Y'
                                                                                                                                                                                                                                                                                                  ? '+1 Year'
                                                                                                                                                                                                                                                                                                  : horizon ===
                                                                                                                                                                                                                                                                                                      '3Y'
                                                                                                                                                                                                                                                                                                    ? '+3 Years'
                                                                                                                                                                                                                                                                                                    : '+5 Years'}
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Dynamic Transformation Stats Grid */}
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                                                                                                                                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
                                                                                                                                                                        <div className="text-xs text-gray-400 font-semibold uppercase">
                                                                                                                                                                                                Active
                                                                                                                                                                                                Services
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-2xl font-extrabold text-white flex items-center space-x-2">
                                                                                                                                                                                                <Boxes className="w-5 h-5 text-purple-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                timeNavigatorData.servicesCount
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        Services
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-[11px] text-purple-300 font-medium">
                                                                                                                                                                                                {selectedHorizon ===
                                                                                                                                                                                                'Today'
                                                                                                                                                                                                                        ? 'Single Monolith'
                                                                                                                                                                                                                        : 'Microservice Mesh'}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
                                                                                                                                                                        <div className="text-xs text-gray-400 font-semibold uppercase">
                                                                                                                                                                                                Coupling
                                                                                                                                                                                                Index
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-2xl font-extrabold text-amber-300 flex items-center space-x-2">
                                                                                                                                                                                                <Layers className="w-5 h-5 text-amber-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                timeNavigatorData.coupling
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-[11px] text-amber-400 font-medium">
                                                                                                                                                                                                Domain
                                                                                                                                                                                                Isolated
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
                                                                                                                                                                        <div className="text-xs text-gray-400 font-semibold uppercase">
                                                                                                                                                                                                Technical
                                                                                                                                                                                                Debt
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-2xl font-extrabold text-emerald-300 flex items-center space-x-2">
                                                                                                                                                                                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                timeNavigatorData.techDebt
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-[11px] text-emerald-400 font-medium">
                                                                                                                                                                                                Continuous
                                                                                                                                                                                                Paydown
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
                                                                                                                                                                        <div className="text-xs text-gray-400 font-semibold uppercase">
                                                                                                                                                                                                Latency
                                                                                                                                                                                                (p99)
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-2xl font-extrabold text-indigo-300 flex items-center space-x-2">
                                                                                                                                                                                                <Zap className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                timeNavigatorData.latency
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-[11px] text-indigo-300 font-medium">
                                                                                                                                                                                                High
                                                                                                                                                                                                Concurrency
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
                                                                                                                                                                        <div className="text-xs text-gray-400 font-semibold uppercase">
                                                                                                                                                                                                Monthly
                                                                                                                                                                                                Spend
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-2xl font-extrabold text-cyan-300 flex items-center space-x-2">
                                                                                                                                                                                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                timeNavigatorData.monthlyCost
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-[11px] text-cyan-400 font-medium">
                                                                                                                                                                                                Cost
                                                                                                                                                                                                Optimized
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Topology Nodes & Transformation Simulation Log */}
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                                                                                                                                {/* Visual Infrastructure Nodes */}
                                                                                                                                                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                                                                                                                                                                        <div className="flex items-center justify-between">
                                                                                                                                                                                                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-2">
                                                                                                                                                                                                                        <Server className="w-4 h-4 text-purple-400" />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Infrastructure
                                                                                                                                                                                                                                                Nodes
                                                                                                                                                                                                                                                in{' '}
                                                                                                                                                                                                                                                {selectedHorizon ===
                                                                                                                                                                                                                                                'Today'
                                                                                                                                                                                                                                                                        ? 'Today'
                                                                                                                                                                                                                                                                        : `+${selectedHorizon}`}
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 rounded border border-purple-500/40">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                timeNavigatorData
                                                                                                                                                                                                                                                                        .nodes
                                                                                                                                                                                                                                                                        .length
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        Nodes
                                                                                                                                                                                                                        Active
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="flex flex-wrap gap-2 pt-1">
                                                                                                                                                                                                {timeNavigatorData.nodes.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                node,
                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="px-3 py-2 bg-slate-900 border border-purple-800/40 rounded-lg text-xs font-mono text-purple-200 flex items-center space-x-2 shadow"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        node
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Time Simulation Log */}
                                                                                                                                                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                                                                                                                                                                        <div className="flex items-center justify-between">
                                                                                                                                                                                                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-2">
                                                                                                                                                                                                                        <Terminal className="w-4 h-4 text-emerald-400" />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Evolution
                                                                                                                                                                                                                                                Simulation
                                                                                                                                                                                                                                                Log
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                {selectedHorizon ===
                                                                                                                                                                                                                                                'Today'
                                                                                                                                                                                                                                                                        ? 'Today'
                                                                                                                                                                                                                                                                        : `+${selectedHorizon}`}

                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] text-emerald-400 font-mono">
                                                                                                                                                                                                                        LIVE_TELEMETRY
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="space-y-1.5 font-mono text-[11px]">
                                                                                                                                                                                                {timeNavigatorData.logs.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                log,
                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="text-emerald-300/90 bg-slate-900/60 p-2 rounded border border-slate-800 flex items-start space-x-2"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        log
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Global Architecture Evolution Command Center Card */}
                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                                                                                        <div className="space-y-1">
                                                                                                                                                <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                                                                                                                                                                        <Globe className="w-5 h-5 animate-pulse" />
                                                                                                                                                                        <span>
                                                                                                                                                                                                Global
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                Evolution
                                                                                                                                                                                                Command
                                                                                                                                                                                                Center
                                                                                                                                                                                                ⭐:
                                                                                                                                                                                                ACTIVE
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-xs text-gray-400">
                                                                                                                                                                        Monitoring
                                                                                                                                                                        42
                                                                                                                                                                        active
                                                                                                                                                                        evolution
                                                                                                                                                                        nodes
                                                                                                                                                                        across
                                                                                                                                                                        us-east-1,
                                                                                                                                                                        eu-west-1,
                                                                                                                                                                        and
                                                                                                                                                                        ap-southeast-1.
                                                                                                                                                                        Real-time
                                                                                                                                                                        drift
                                                                                                                                                                        prevention
                                                                                                                                                                        online.
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center space-x-3">
                                                                                                                                                <span className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-lg">
                                                                                                                                                                        Architecture
                                                                                                                                                                        Score:
                                                                                                                                                                        92.5
                                                                                                                                                                        /
                                                                                                                                                                        100
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </DashboardLayout>
                        );
}
