'use client';

import React, { useState } from 'react';
import {
                        Users,
                        Brain,
                        Crown,
                        Layers,
                        Target,
                        Zap,
                        ShieldCheck,
                        Sparkles,
                        Send,
                        CheckCircle2,
                        TrendingUp,
                        DollarSign,
                        Activity,
                        Sliders,
                        Award,
                        RefreshCw,
                        MessageSquare,
                        ShieldAlert,
} from 'lucide-react';

export default function AIEngineeringBoardroomPage() {
                        const [proposalInput, setProposalInput] = useState<string>(
                                                'Split Checkout Service & Migrate to Active-Active Dual Region'
                        );
                        const [isConvening, setIsConvening] = useState<boolean>(false);
                        const [activeTab, setActiveTab] = useState<string>('boardroom');

                        // 🌟 Ultimate Feature Boardroom Statements
                        const boardroomStatements = [
                                                {
                                                                        role: 'CTO AI',
                                                                        icon: Crown,
                                                                        color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
                                                                        speech: 'Scaling risk is increasing. Current monolithic checkout DB lock contention under >5,000 RPS will breach our 99.99% SLA during Q4 holiday traffic.',
                                                                        concern: 'Unbounded database load during peak holiday traffic sales.',
                                                                        resolution: 'Approve service decoupling & active-active dual-region cell architecture.',
                                                },
                                                {
                                                                        role: 'Architect AI',
                                                                        icon: Layers,
                                                                        color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/40 text-indigo-300',
                                                                        speech: 'Split Checkout Service into isolated gRPC Auth Vault and Inventory Cart microservices to eliminate circular DB dependencies.',
                                                                        concern: 'Interface contract breaking changes for 14 consuming services.',
                                                                        resolution: 'Enforce OpenAPI 3.1 & gRPC Protobuf binary schema validation.',
                                                },
                                                {
                                                                        role: 'SRE AI',
                                                                        icon: Zap,
                                                                        color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300',
                                                                        speech: 'Introduce autoscaling on AWS EKS and inject Resilience4j circuit breakers with 5-second fallback triggers.',
                                                                        concern: 'Cascading timeout spikes across cross-border VPC transit gateway peering links.',
                                                                        resolution: 'Deploy Datadog p95 latency alerts at 50ms threshold.',
                                                },
                                                {
                                                                        role: 'Security Engineer AI',
                                                                        icon: ShieldAlert,
                                                                        color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300',
                                                                        speech: 'Strengthen token management by enforcing RS256 JWT key rotation and CockroachDB row locality for EU PII.',
                                                                        concern: 'GDPR Article 44 cross-border data transfer non-compliance.',
                                                                        resolution: 'Pin EU user rows locally in Frankfurt (eu-central-1).',
                                                },
                                                {
                                                                        role: 'Product Manager AI',
                                                                        icon: Target,
                                                                        color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
                                                                        speech: 'Delay migration until after holiday traffic to avoid freeze period release risks.',
                                                                        concern: 'Disrupting Q4 peak sales revenue stream during active migration.',
                                                                        resolution: 'Schedule production cutover execution for Q2 2026.',
                                                },
                        ];

                        // Strategic Decision Simulator Data
                        const strategyComparison = {
                                                optionA: {
                                                                        name: 'Option A: Monolith Read Replicas',
                                                                        impact: '68.5 / 100',
                                                                        risk: 'High Risk (GDPR Non-Compliant)',
                                                                        duration: '3 Weeks',
                                                                        cost: '$8,500 / mo',
                                                },
                                                optionB: {
                                                                        name: 'Option B: Dual-Region Microservices (RECOMMENDED)',
                                                                        impact: '98.0 / 100',
                                                                        risk: 'Low Risk (100% GDPR Compliant)',
                                                                        duration: '8 Weeks',
                                                                        cost: '$18,500 / mo',
                                                },
                        };

                        // Executive Dashboard Metrics
                        const execMetrics = {
                                                deliveryHealth: '96.5%',
                                                architectureHealth: '97.2%',
                                                techDebtTrend: '-15.4%',
                                                costForecast: '$42,000 / mo',
                                                capacityAllocated: '82.0%',
                        };

                        // Autonomous Improvements
                        const improvements = [
                                                {
                                                                        id: 'OPP-101',
                                                                        cat: 'Performance',
                                                                        title: 'Migrate Auth Vault REST payload serialization to gRPC Protobuf streaming',
                                                                        impact: '-72% Latency Reduction',
                                                                        auto: true,
                                                },
                                                {
                                                                        id: 'OPP-102',
                                                                        cat: 'Cost Efficiency',
                                                                        title: 'Leverage AWS Spot Instance workers for background Celery queues',
                                                                        impact: '$14,200/mo Cloud Savings',
                                                                        auto: true,
                                                },
                                                {
                                                                        id: 'OPP-103',
                                                                        cat: 'Security',
                                                                        title: 'Enforce 24-hour RS256 JWT key rotation and mTLS certificate pinning',
                                                                        impact: '100% Zero-Trust Compliance',
                                                                        auto: true,
                                                },
                        ];

                        const handleConveneSubmit = (e: React.FormEvent) => {
                                                e.preventDefault();
                                                setIsConvening(true);
                                                setTimeout(() => setIsConvening(false), 1200);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Top Banner Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
                                                                                                                                                                        <Users className="w-8 h-8 animate-pulse" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                                                                                                                                                                                🌟
                                                                                                                                                                                                The
                                                                                                                                                                                                Ultimate
                                                                                                                                                                                                Feature
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                                                                                                                                                                                                AI
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Boardroom
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                "Rather
                                                                                                                                                than
                                                                                                                                                a
                                                                                                                                                single
                                                                                                                                                answer,
                                                                                                                                                users
                                                                                                                                                see
                                                                                                                                                structured
                                                                                                                                                reasoning
                                                                                                                                                from
                                                                                                                                                multiple
                                                                                                                                                perspectives."
                                                                                                                                                Opens
                                                                                                                                                a
                                                                                                                                                boardroom
                                                                                                                                                view
                                                                                                                                                where
                                                                                                                                                specialized
                                                                                                                                                AI
                                                                                                                                                executive
                                                                                                                                                roles
                                                                                                                                                discuss
                                                                                                                                                proposals
                                                                                                                                                and
                                                                                                                                                reach
                                                                                                                                                structured
                                                                                                                                                consensus.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        Boardroom
                                                                                                                                                                        Status
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-indigo-300">
                                                                                                                                                                        5
                                                                                                                                                                        AI
                                                                                                                                                                        Executive
                                                                                                                                                                        Personas
                                                                                                                                                                        Convened
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Proposal Prompt Bar */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                                                                                                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-2">
                                                                                                                        <MessageSquare className="w-4 h-4" />{' '}
                                                                                                                        Boardroom
                                                                                                                        Proposal
                                                                                                                        Query
                                                                                                </div>

                                                                                                <form
                                                                                                                        onSubmit={
                                                                                                                                                handleConveneSubmit
                                                                                                                        }
                                                                                                                        className="flex gap-3"
                                                                                                >
                                                                                                                        <input
                                                                                                                                                type="text"
                                                                                                                                                value={
                                                                                                                                                                        proposalInput
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setProposalInput(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/60 font-medium"
                                                                                                                        />
                                                                                                                        <button
                                                                                                                                                type="submit"
                                                                                                                                                disabled={
                                                                                                                                                                        isConvening
                                                                                                                                                }
                                                                                                                                                className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                                                                                                                        >
                                                                                                                                                {isConvening ? (
                                                                                                                                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                                                                                                                ) : (
                                                                                                                                                                        <Send className="w-4 h-4" />
                                                                                                                                                )}
                                                                                                                                                {isConvening
                                                                                                                                                                        ? 'Convening Boardroom...'
                                                                                                                                                                        : 'Convene Boardroom'}
                                                                                                                        </button>
                                                                                                </form>
                                                                        </div>

                                                                        {/* Navigation Tabs */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'boardroom',
                                                                                                                                                label: 'AI Engineering Boardroom Dialogue',
                                                                                                                                                icon: MessageSquare,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'dashboard',
                                                                                                                                                label: 'Executive Leadership Dashboard',
                                                                                                                                                icon: Activity,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'simulator',
                                                                                                                                                label: 'Strategic Decision Simulator',
                                                                                                                                                icon: Sliders,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'improvements',
                                                                                                                                                label: 'Autonomous Improvement Engine',
                                                                                                                                                icon: Sparkles,
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
                                                                                                                                                                                                                                                ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-500/20'
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

                                                                        {/* TAB 1: AI Engineering Boardroom Dialogue */}
                                                                        {activeTab ===
                                                                                                'boardroom' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {/* Consensus Banner */}
                                                                                                                        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
                                                                                                                                                <div className="flex items-center gap-4">
                                                                                                                                                                        <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                                                                                                                                                                                                <CheckCircle2 className="w-7 h-7" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                                                                                                                                                                                                        Boardroom
                                                                                                                                                                                                                        Verdict
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h3 className="text-xl font-black text-white">
                                                                                                                                                                                                                        Consensus:
                                                                                                                                                                                                                        Migration
                                                                                                                                                                                                                        in
                                                                                                                                                                                                                        Q2.
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-slate-400 mt-0.5">
                                                                                                                                                                                                                        Decouple
                                                                                                                                                                                                                        Checkout
                                                                                                                                                                                                                        into
                                                                                                                                                                                                                        gRPC
                                                                                                                                                                                                                        microservices
                                                                                                                                                                                                                        with
                                                                                                                                                                                                                        active-active
                                                                                                                                                                                                                        dual-region
                                                                                                                                                                                                                        CockroachDB
                                                                                                                                                                                                                        storage,
                                                                                                                                                                                                                        scheduled
                                                                                                                                                                                                                        for
                                                                                                                                                                                                                        production
                                                                                                                                                                                                                        migration
                                                                                                                                                                                                                        in
                                                                                                                                                                                                                        Q2
                                                                                                                                                                                                                        2026
                                                                                                                                                                                                                        after
                                                                                                                                                                                                                        Q4
                                                                                                                                                                                                                        holiday
                                                                                                                                                                                                                        freeze.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-black rounded-xl whitespace-nowrap">
                                                                                                                                                                        100%
                                                                                                                                                                        Unanimous
                                                                                                                                                                        Consensus
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        {/* Speech Dialogue Cards Grid */}
                                                                                                                        <div className="space-y-4">
                                                                                                                                                {boardroomStatements.map(
                                                                                                                                                                        (
                                                                                                                                                                                                stmt,
                                                                                                                                                                                                i
                                                                                                                                                                        ) => {
                                                                                                                                                                                                const Icon =
                                                                                                                                                                                                                        stmt.icon;
                                                                                                                                                                                                return (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className={`p-6 rounded-2xl border bg-slate-950 ${stmt.color} space-y-3 shadow-lg hover:border-indigo-500/60 transition-all`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                                                <div className="p-2 rounded-xl border bg-slate-900">
                                                                                                                                                                                                                                                                                                                        <Icon className="w-5 h-5" />
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <span className="text-sm font-black text-white">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                stmt.role
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="text-[10px] uppercase font-bold text-slate-400">
                                                                                                                                                                                                                                                                                                Boardroom
                                                                                                                                                                                                                                                                                                Member
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <p className="text-sm text-slate-200 font-medium pl-11">
                                                                                                                                                                                                                                                                        "
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                stmt.speech
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        "
                                                                                                                                                                                                                                                </p>

                                                                                                                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11 pt-2 text-xs">
                                                                                                                                                                                                                                                                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                                                                <span className="text-rose-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                                                                                                                        Key
                                                                                                                                                                                                                                                                                                                        Concern:
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <p className="text-slate-300 mt-0.5">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                stmt.concern
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                                                                <span className="text-emerald-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                                                                                                                        Proposed
                                                                                                                                                                                                                                                                                                                        Resolution:
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <p className="text-slate-300 mt-0.5">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                stmt.resolution
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                );
                                                                                                                                                                        }
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: Executive Leadership Dashboard */}
                                                                        {activeTab ===
                                                                                                'dashboard' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Delivery
                                                                                                                                                                                                Health
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-emerald-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        execMetrics.deliveryHealth
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                Health
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-indigo-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        execMetrics.architectureHealth
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Tech
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Trend
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-cyan-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        execMetrics.techDebtTrend
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Cost
                                                                                                                                                                                                Forecast
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-amber-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        execMetrics.costForecast
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Capacity
                                                                                                                                                                                                Allocated
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-purple-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        execMetrics.capacityAllocated
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: Strategic Decision Simulator */}
                                                                        {activeTab ===
                                                                                                'simulator' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white">
                                                                                                                                                                        Strategic
                                                                                                                                                                        Option
                                                                                                                                                                        Strategy
                                                                                                                                                                        Comparison
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                                                                                                                                                                                                <div className="text-rose-400 font-bold uppercase">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionA
                                                                                                                                                                                                                                                                        .name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-300">
                                                                                                                                                                                                                        Business
                                                                                                                                                                                                                        Impact:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionA
                                                                                                                                                                                                                                                                        .impact
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-rose-400 font-semibold">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionA
                                                                                                                                                                                                                                                                        .risk
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                                                                        Duration:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionA
                                                                                                                                                                                                                                                                        .duration
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        |
                                                                                                                                                                                                                        Cost:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionA
                                                                                                                                                                                                                                                                        .cost
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
                                                                                                                                                                                                <div className="text-emerald-400 font-bold uppercase">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionB
                                                                                                                                                                                                                                                                        .name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-300">
                                                                                                                                                                                                                        Business
                                                                                                                                                                                                                        Impact:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionB
                                                                                                                                                                                                                                                                        .impact
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-emerald-400 font-semibold">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionB
                                                                                                                                                                                                                                                                        .risk
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                                                                        Duration:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionB
                                                                                                                                                                                                                                                                        .duration
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        |
                                                                                                                                                                                                                        Cost:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                strategyComparison
                                                                                                                                                                                                                                                                        .optionB
                                                                                                                                                                                                                                                                        .cost
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: Autonomous Improvement Engine */}
                                                                        {activeTab ===
                                                                                                'improvements' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white">
                                                                                                                                                                        Autonomous
                                                                                                                                                                        Improvement
                                                                                                                                                                        Engine
                                                                                                                                                                        Opportunity
                                                                                                                                                                        Stream
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3 text-xs">
                                                                                                                                                                        {improvements.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        opp
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        opp.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="space-y-1">
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                                                <span className="font-mono font-bold text-indigo-400">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                opp.id
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="font-bold text-white text-sm">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                opp.title
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                opp.cat
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <p className="text-slate-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        opp.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                opp.impact
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
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
