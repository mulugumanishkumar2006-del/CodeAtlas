'use client';

import React, { useState } from 'react';
import {
                        TrendingUp,
                        FlaskConical,
                        Target,
                        Layers,
                        ShieldCheck,
                        DollarSign,
                        Activity,
                        Sparkles,
                        Zap,
                        HelpCircle,
                        BarChart3,
                        CheckCircle2,
                        AlertTriangle,
                        ArrowRight,
                        Send,
                        Sliders,
                        Globe,
                        Award,
} from 'lucide-react';

export default function AGISimulationInsightsPage() {
                        const [activeTab, setActiveTab] = useState<string>('translator');
                        const [businessGoal, setBusinessGoal] = useState<string>(
                                                'Reduce checkout API latency and drop-off rate by 15%'
                        );
                        const [horizonYears, setHorizonYears] = useState<number>(2);

                        // Feature 23 Data
                        const translationOutput = {
                                                okr: businessGoal,
                                                epics: [
                                                                        'Epic 1: Refactor checkout API payload validation to gRPC binary streaming.',
                                                                        'Epic 2: Implement Redis L2 cache for cart inventory state.',
                                                                        'Epic 3: Decouple DB connection pool with PgBouncer transaction pooling.',
                                                ],
                                                services: [
                                                                        'checkout_service',
                                                                        'cart_service',
                                                                        'inventory_service',
                                                ],
                                                refactorHours: '48.0 hrs',
                                                businessImpact: 'Projected to eliminate checkout latency stalls, increasing checkout conversion by ~18.5%.',
                        };

                        // Feature 24 Data
                        const experimentOutput = {
                                                optionA: 'REST JSON Monolith',
                                                optionB: 'gRPC Protobuf Microservices',
                                                latencyDelta: '-72.0%',
                                                throughputDelta: '+145.0%',
                                                costDelta: '-15.0%',
                                                recommendation: 'gRPC Protobuf demonstrates superior performance with 72% lower latency and 145% higher throughput.',
                        };

                        // Feature 33 Data
                        const debateOutput = {
                                                topic: 'gRPC vs REST JSON for Auth Vault Protocol',
                                                cto: 'gRPC provides 70% lower serialization overhead and binary schema contracts.',
                                                security: 'gRPC enables native mTLS certificate pinning and RS256 key isolation.',
                                                sre: 'gRPC streaming reduces connection handshake CPU usage under high RPS load.',
                                                verdict: 'Consensus Approved: Migrate Auth Vault to gRPC Protobuf.',
                        };

                        // Feature 36 Data
                        const debtEconomics = {
                                                principalHours: '36.5 hrs',
                                                monthlyInterestHours: '4.2 hrs',
                                                financialInterestCostMonthly: '$483.00 USD / mo',
                                                paydownRoi: '340.0% ROI',
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-3 bg-cyan-600/20 border border-cyan-500/30 rounded-2xl text-cyan-400">
                                                                                                                                                                        <FlaskConical className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                25
                                                                                                                                                                                                Features
                                                                                                                                                                                                21–40
                                                                                                                                                                                                —
                                                                                                                                                                                                Simulation
                                                                                                                                                                                                &
                                                                                                                                                                                                Strategic
                                                                                                                                                                                                Insights
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                                                                                                                                                                                                Software
                                                                                                                                                                                                Evolution
                                                                                                                                                                                                &
                                                                                                                                                                                                Business
                                                                                                                                                                                                Goal
                                                                                                                                                                                                Simulation
                                                                                                                                                                                                Lab
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Translates
                                                                                                                                                executive
                                                                                                                                                business
                                                                                                                                                goals
                                                                                                                                                into
                                                                                                                                                engineering
                                                                                                                                                epics,
                                                                                                                                                simulates
                                                                                                                                                1-5
                                                                                                                                                year
                                                                                                                                                software
                                                                                                                                                evolution
                                                                                                                                                trajectories,
                                                                                                                                                conducts
                                                                                                                                                virtual
                                                                                                                                                architecture
                                                                                                                                                experiments,
                                                                                                                                                and
                                                                                                                                                analyzes
                                                                                                                                                technical
                                                                                                                                                debt
                                                                                                                                                economics.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        Simulation
                                                                                                                                                                        Status
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-cyan-300">
                                                                                                                                                                        20/20
                                                                                                                                                                        Intelligence
                                                                                                                                                                        Engines
                                                                                                                                                                        Active
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Main Tabs */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'translator',
                                                                                                                                                label: 'Business Goal Translator',
                                                                                                                                                icon: Target,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'simulator',
                                                                                                                                                label: 'Software Evolution Simulator',
                                                                                                                                                icon: TrendingUp,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'experiment',
                                                                                                                                                label: 'Architecture Experiment Lab',
                                                                                                                                                icon: FlaskConical,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'debate',
                                                                                                                                                label: 'AI Architecture Debate',
                                                                                                                                                icon: HelpCircle,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'economics',
                                                                                                                                                label: 'Technical Debt Economist',
                                                                                                                                                icon: DollarSign,
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
                                                                                                                                                                                                                                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
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

                                                                        {/* TAB 1: Business Goal Translator (Feature 23) */}
                                                                        {activeTab ===
                                                                                                'translator' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                                                                                                                                        <Target className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                        Executive
                                                                                                                                                                        Business
                                                                                                                                                                        Goal
                                                                                                                                                                        to
                                                                                                                                                                        Technical
                                                                                                                                                                        Epic
                                                                                                                                                                        Translator
                                                                                                                                                </h3>
                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                        Input
                                                                                                                                                                        any
                                                                                                                                                                        high-level
                                                                                                                                                                        business
                                                                                                                                                                        OKR
                                                                                                                                                                        or
                                                                                                                                                                        goal
                                                                                                                                                                        (e.g.
                                                                                                                                                                        "Increase
                                                                                                                                                                        checkout
                                                                                                                                                                        conversion
                                                                                                                                                                        by
                                                                                                                                                                        15%")
                                                                                                                                                                        to
                                                                                                                                                                        generate
                                                                                                                                                                        actionable
                                                                                                                                                                        technical
                                                                                                                                                                        refactoring
                                                                                                                                                                        epics.
                                                                                                                                                </p>

                                                                                                                                                <div className="flex gap-3">
                                                                                                                                                                        <input
                                                                                                                                                                                                type="text"
                                                                                                                                                                                                value={
                                                                                                                                                                                                                        businessGoal
                                                                                                                                                                                                }
                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        setBusinessGoal(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
                                                                                                                                                                        />
                                                                                                                                                                        <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow">
                                                                                                                                                                                                <Zap className="w-4 h-4" />{' '}
                                                                                                                                                                                                Translate
                                                                                                                                                                                                Goal
                                                                                                                                                                        </button>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                                                                                                                                                                                                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                                                                                                                                                                                                                        Translated
                                                                                                                                                                                                                        Technical
                                                                                                                                                                                                                        Epics:
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <ul className="space-y-2 text-xs text-slate-300">
                                                                                                                                                                                                                        {translationOutput.epics.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        epic,
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <li
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                epic
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </ul>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                                                                                                                                                                                                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                                                                                                                                                                                        Impact
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Resource
                                                                                                                                                                                                                        Summary:
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                                                                                                                                                                                                        <span className="font-semibold text-white">
                                                                                                                                                                                                                                                Expected
                                                                                                                                                                                                                                                Impact:
                                                                                                                                                                                                                        </span>{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                translationOutput.businessImpact
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                                                                                                                                                                                                        <span className="font-semibold text-white">
                                                                                                                                                                                                                                                Refactoring
                                                                                                                                                                                                                                                Effort:
                                                                                                                                                                                                                        </span>{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                translationOutput.refactorHours
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                                                                                                                                                                                                        <span className="font-semibold text-white">
                                                                                                                                                                                                                                                Affected
                                                                                                                                                                                                                                                Services:
                                                                                                                                                                                                                        </span>{' '}
                                                                                                                                                                                                                        {translationOutput.services.join(
                                                                                                                                                                                                                                                ', '
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: Software Evolution Simulator (Feature 21) */}
                                                                        {activeTab ===
                                                                                                'simulator' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                        <h3 className="text-sm font-bold text-white">
                                                                                                                                                                                                Multi-Year
                                                                                                                                                                                                Codebase
                                                                                                                                                                                                Trajectory
                                                                                                                                                                                                Simulator
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="flex items-center gap-2 text-xs">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Horizon:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                {[
                                                                                                                                                                                                                        1,
                                                                                                                                                                                                                        2,
                                                                                                                                                                                                                        3,
                                                                                                                                                                                                                        5,
                                                                                                                                                                                                ].map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                y
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                y
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                setHorizonYears(
                                                                                                                                                                                                                                                                                                                        y
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className={`px-3 py-1 rounded-lg font-bold text-xs ${
                                                                                                                                                                                                                                                                                                horizonYears ===
                                                                                                                                                                                                                                                                                                y
                                                                                                                                                                                                                                                                                                                        ? 'bg-cyan-600 text-white'
                                                                                                                                                                                                                                                                                                                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                y
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        Years
                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Projected
                                                                                                                                                                                                                        Code
                                                                                                                                                                                                                        Size
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-2xl font-black text-white mt-1">
                                                                                                                                                                                                                        {(
                                                                                                                                                                                                                                                58400 *
                                                                                                                                                                                                                                                (1 +
                                                                                                                                                                                                                                                                        0.25 *
                                                                                                                                                                                                                                                                                                horizonYears)
                                                                                                                                                                                                                        ).toLocaleString()}{' '}
                                                                                                                                                                                                                        LOC
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Projected
                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                                        Hours
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-2xl font-black text-emerald-400 mt-1">
                                                                                                                                                                                                                        {(
                                                                                                                                                                                                                                                36.5 *
                                                                                                                                                                                                                                                (1 -
                                                                                                                                                                                                                                                                        0.15 *
                                                                                                                                                                                                                                                                                                horizonYears)
                                                                                                                                                                                                                        ).toFixed(
                                                                                                                                                                                                                                                1
                                                                                                                                                                                                                        )}{' '}
                                                                                                                                                                                                                        hrs
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Architectural
                                                                                                                                                                                                                        Drift
                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-2xl font-black text-cyan-400 mt-1">
                                                                                                                                                                                                                        Low
                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Maintainability
                                                                                                                                                                                                                        Index
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-2xl font-black text-indigo-400 mt-1">
                                                                                                                                                                                                                        94.5
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        100
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: Architecture Experiment Lab (Feature 24) */}
                                                                        {activeTab ===
                                                                                                'experiment' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white">
                                                                                                                                                                        Virtual
                                                                                                                                                                        Architecture
                                                                                                                                                                        A/B
                                                                                                                                                                        Experiment
                                                                                                                                                                        Lab
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Latency
                                                                                                                                                                                                                        Delta
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-black text-emerald-400 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                experimentOutput.latencyDelta
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Throughput
                                                                                                                                                                                                                        Delta
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-black text-cyan-400 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                experimentOutput.throughputDelta
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Cloud
                                                                                                                                                                                                                        Cost
                                                                                                                                                                                                                        Delta
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-black text-indigo-400 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                experimentOutput.costDelta
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                                                                                                                                                                        <span className="font-bold text-white">
                                                                                                                                                                                                Winner
                                                                                                                                                                                                Recommendation:
                                                                                                                                                                        </span>{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                experimentOutput.recommendation
                                                                                                                                                                        }
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: AI Architecture Debate (Feature 33) */}
                                                                        {activeTab === 'debate' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-2">
                                                                                                                                                                        Simulated
                                                                                                                                                                        Multi-Persona
                                                                                                                                                                        Architecture
                                                                                                                                                                        Debate
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3 text-xs">
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <span className="font-bold text-amber-400 uppercase">
                                                                                                                                                                                                                        CTO
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Argument:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-slate-300 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                debateOutput.cto
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <span className="font-bold text-rose-400 uppercase">
                                                                                                                                                                                                                        Security
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Argument:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-slate-300 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                debateOutput.security
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <span className="font-bold text-cyan-400 uppercase">
                                                                                                                                                                                                                        SRE
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Argument:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-slate-300 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                debateOutput.sre
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-emerald-400 font-bold">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        debateOutput.verdict
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 5: Technical Debt Economist (Feature 36) */}
                                                                        {activeTab ===
                                                                                                'economics' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Principal
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Hours
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-amber-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        debtEconomics.principalHours
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Monthly
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Interest
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-rose-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        debtEconomics.monthlyInterestHours
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Financial
                                                                                                                                                                                                Interest
                                                                                                                                                                                                Cost
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-white mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        debtEconomics.financialInterestCostMonthly
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Paydown
                                                                                                                                                                                                ROI
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-emerald-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        debtEconomics.paydownRoi
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
