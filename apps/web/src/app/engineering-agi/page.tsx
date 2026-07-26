'use client';

import React, { useState } from 'react';
import {
                        Rocket,
                        Brain,
                        Crown,
                        Layers,
                        FlaskConical,
                        ShieldAlert,
                        Zap,
                        DollarSign,
                        Target,
                        Cloud,
                        Database,
                        Sparkles,
                        Send,
                        CheckCircle2,
                        AlertTriangle,
                        ArrowRight,
                        TrendingUp,
                        Users,
                        Activity,
                        Calendar,
                        Globe,
                        Sliders,
} from 'lucide-react';

export default function EngineeringAGIPage() {
                        const [macroPrompt, setMacroPrompt] = useState<string>(
                                                'Our company wants to expand from India to Europe over the next two years. What engineering changes must we make?'
                        );
                        const [isExecuting, setIsExecuting] = useState<boolean>(false);
                        const [activeTab, setActiveTab] = useState<string>('overview');

                        // 9 Persona Council Data
                        const councilPersonas = [
                                                {
                                                                        role: 'CTO AI',
                                                                        title: 'Executive Visionary',
                                                                        icon: Crown,
                                                                        color: 'from-amber-500 to-yellow-500 text-amber-300 border-amber-500/30',
                                                                        assessment: 'Isolate EU customer PHI/PII data to comply with GDPR Art. 44 data transfer restrictions.',
                                                                        recommendation: 'Deploy an active-active dual-region cell topology (Frankfurt + Mumbai) with localized data vaults.',
                                                                        risk: 'Medium Risk',
                                                },
                                                {
                                                                        role: 'Architect AI',
                                                                        title: 'System Modeler',
                                                                        icon: Layers,
                                                                        color: 'from-indigo-500 to-blue-500 text-indigo-300 border-indigo-500/30',
                                                                        assessment: 'Decouple monolithic DB bindings into Hexagonal domain microservices.',
                                                                        recommendation: 'Extract Auth Vault and User Profile services into isolated gRPC services.',
                                                                        risk: 'Low Risk',
                                                },
                                                {
                                                                        role: 'Scientist AI',
                                                                        title: 'Algorithmic Scaling',
                                                                        icon: FlaskConical,
                                                                        color: 'from-purple-500 to-pink-500 text-purple-300 border-purple-500/30',
                                                                        assessment: 'Inter-region synchronous REST calls introduce 180ms latency penalty.',
                                                                        recommendation: 'Implement Redis L2 write-through caching and Kafka Event Sourcing reconciliation.',
                                                                        risk: 'Low Risk',
                                                },
                                                {
                                                                        role: 'Security AI',
                                                                        title: 'Zero-Trust & Security',
                                                                        icon: ShieldAlert,
                                                                        color: 'from-rose-500 to-red-500 text-rose-300 border-rose-500/30',
                                                                        assessment: 'GDPR requires strict Hardware Security Module (HSM) key isolation for EU user tokens.',
                                                                        recommendation: 'Enforce RS256 JWT key rotation and mutual TLS (mTLS) for all inter-region traffic.',
                                                                        risk: 'High Risk',
                                                },
                                                {
                                                                        role: 'SRE AI',
                                                                        title: 'Resilience & SLA',
                                                                        icon: Zap,
                                                                        color: 'from-cyan-500 to-teal-500 text-cyan-300 border-cyan-500/30',
                                                                        assessment: 'Cross-region network link disruptions cause cascading timeout spikes without circuit breakers.',
                                                                        recommendation: 'Implement circuit breakers with 5-second fallback triggers.',
                                                                        risk: 'Medium Risk',
                                                },
                                                {
                                                                        role: 'Finance AI',
                                                                        title: 'FinOps Budgeting',
                                                                        icon: DollarSign,
                                                                        color: 'from-emerald-500 to-green-500 text-emerald-300 border-emerald-500/30',
                                                                        assessment: 'Dual-region deployment increases cloud infrastructure footprint by ~35%.',
                                                                        recommendation: 'Utilize AWS Spot Instances for background Celery workers and reserved instances for DB nodes.',
                                                                        risk: 'Low Risk',
                                                },
                                                {
                                                                        role: 'Product AI',
                                                                        title: 'Agile Deliverables',
                                                                        icon: Target,
                                                                        color: 'from-orange-500 to-amber-500 text-orange-300 border-orange-500/30',
                                                                        assessment: 'Split 2-year expansion into 8 quarterly milestones across 42 Agile sprints.',
                                                                        recommendation: 'Prioritize EU data vault foundation in Year 1 before UI localization in Year 2.',
                                                                        risk: 'Low Risk',
                                                },
                                                {
                                                                        role: 'Cloud AI',
                                                                        title: 'Multi-Region Topology',
                                                                        icon: Cloud,
                                                                        color: 'from-sky-500 to-blue-600 text-sky-300 border-sky-500/30',
                                                                        assessment: 'AWS eu-central-1 (Frankfurt) and ap-south-1 (Mumbai) VPC peering requires encrypted transit gateway.',
                                                                        recommendation: 'Deploy EKS clusters in active-active topology connected via AWS Transit Gateway.',
                                                                        risk: 'Medium Risk',
                                                },
                                                {
                                                                        role: 'Data AI',
                                                                        title: 'Data Sovereignty',
                                                                        icon: Database,
                                                                        color: 'from-violet-500 to-purple-600 text-violet-300 border-violet-500/30',
                                                                        assessment: 'European user PII cannot cross borders into non-EU databases.',
                                                                        recommendation: 'Implement CockroachDB multi-region row locality rules pinning EU user rows to eu-central-1.',
                                                                        risk: 'High Risk',
                                                },
                        ];

                        // Roadmap Data
                        const roadmapData = [
                                                {
                                                                        q: 'Q1 2026',
                                                                        title: 'Architecture Decoupling & EU Data Vault Foundation',
                                                                        state: 'Modular Monolith + Isolated Auth Vault',
                                                },
                                                {
                                                                        q: 'Q2 2026',
                                                                        title: 'Multi-Region Database Deployment (CockroachDB)',
                                                                        state: 'Hybrid Active-Passive Multi-Region',
                                                },
                                                {
                                                                        q: 'Q3 2026',
                                                                        title: 'Security Hardening & mTLS Certificate Pinning',
                                                                        state: 'Zero-Trust Multi-Region Mesh',
                                                },
                                                {
                                                                        q: 'Q4 2026',
                                                                        title: 'Active-Active Load Testing & Chaos Engineering',
                                                                        state: 'Full Active-Active Dual Region',
                                                },
                                                {
                                                                        q: 'Q1-Q4 2027',
                                                                        title: 'European Market Scale & Regional Localization',
                                                                        state: 'Global Autonomous Scale Tier',
                                                },
                        ];

                        const handleExecuteQuery = (e: React.FormEvent) => {
                                                e.preventDefault();
                                                setIsExecuting(true);
                                                setTimeout(() => setIsExecuting(false), 1500);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Top Banner Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-3 bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-amber-500/30 rounded-2xl text-amber-400">
                                                                                                                                                                        <Rocket className="w-8 h-8 animate-pulse" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                25
                                                                                                                                                                                                —
                                                                                                                                                                                                Project
                                                                                                                                                                                                Atlas
                                                                                                                                                                                                (Engineering
                                                                                                                                                                                                AGI)
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Executive
                                                                                                                                                                                                AGI
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                "The
                                                                                                                                                world's
                                                                                                                                                first
                                                                                                                                                AI
                                                                                                                                                that
                                                                                                                                                truly
                                                                                                                                                understands
                                                                                                                                                software
                                                                                                                                                ecosystems."
                                                                                                                                                CodeAtlas
                                                                                                                                                acts
                                                                                                                                                as
                                                                                                                                                your
                                                                                                                                                AI
                                                                                                                                                Engineering
                                                                                                                                                Executive
                                                                                                                                                —
                                                                                                                                                synthesizing
                                                                                                                                                multi-year
                                                                                                                                                strategic
                                                                                                                                                expansion,
                                                                                                                                                architecture
                                                                                                                                                generation,
                                                                                                                                                hiring
                                                                                                                                                budgets,
                                                                                                                                                risk
                                                                                                                                                predictions,
                                                                                                                                                and
                                                                                                                                                blast
                                                                                                                                                radius
                                                                                                                                                simulations.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        Executive
                                                                                                                                                                        Council
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-amber-300">
                                                                                                                                                                        9
                                                                                                                                                                        AI
                                                                                                                                                                        Executive
                                                                                                                                                                        Personas
                                                                                                                                                                        Active
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Strategic Macro Prompt Bar */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                                                                                                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
                                                                                                                        <Brain className="w-4 h-4" />{' '}
                                                                                                                        Universal
                                                                                                                        Executive
                                                                                                                        Reasoning
                                                                                                                        Prompt
                                                                                                </div>

                                                                                                <form
                                                                                                                        onSubmit={
                                                                                                                                                handleExecuteQuery
                                                                                                                        }
                                                                                                                        className="space-y-4"
                                                                                                >
                                                                                                                        <div className="relative">
                                                                                                                                                <textarea
                                                                                                                                                                        rows={
                                                                                                                                                                                                2
                                                                                                                                                                        }
                                                                                                                                                                        value={
                                                                                                                                                                                                macroPrompt
                                                                                                                                                                        }
                                                                                                                                                                        onChange={(
                                                                                                                                                                                                e
                                                                                                                                                                        ) =>
                                                                                                                                                                                                setMacroPrompt(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pr-36 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60 font-medium"
                                                                                                                                                />
                                                                                                                                                <button
                                                                                                                                                                        type="submit"
                                                                                                                                                                        disabled={
                                                                                                                                                                                                isExecuting
                                                                                                                                                                        }
                                                                                                                                                                        className="absolute right-3 top-3 bottom-3 px-6 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                                                                                                                                                >
                                                                                                                                                                        {isExecuting ? (
                                                                                                                                                                                                <Sparkles className="w-4 h-4 animate-spin" />
                                                                                                                                                                        ) : (
                                                                                                                                                                                                <Send className="w-4 h-4" />
                                                                                                                                                                        )}
                                                                                                                                                                        {isExecuting
                                                                                                                                                                                                ? 'Synthesizing...'
                                                                                                                                                                                                : 'Execute Strategy'}
                                                                                                                                                </button>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center gap-2 text-xs">
                                                                                                                                                <span className="text-slate-500 font-semibold">
                                                                                                                                                                        Quick
                                                                                                                                                                        Sample
                                                                                                                                                                        Prompts:
                                                                                                                                                </span>
                                                                                                                                                <button
                                                                                                                                                                        type="button"
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                setMacroPrompt(
                                                                                                                                                                                                                        'Our company wants to expand from India to Europe over the next two years. What engineering changes must we make?'
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="px-3 py-1 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded-lg border border-slate-800 transition-all"
                                                                                                                                                >
                                                                                                                                                                        India
                                                                                                                                                                        ➔
                                                                                                                                                                        Europe
                                                                                                                                                                        Expansion
                                                                                                                                                </button>
                                                                                                                                                <button
                                                                                                                                                                        type="button"
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                setMacroPrompt(
                                                                                                                                                                                                                        'Prepare our monolithic backend for 100,000 RPS burst load during Black Friday sales while maintaining 99.99% availability.'
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="px-3 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 rounded-lg border border-slate-800 transition-all"
                                                                                                                                                >
                                                                                                                                                                        100K
                                                                                                                                                                        RPS
                                                                                                                                                                        Flash
                                                                                                                                                                        Sale
                                                                                                                                                                        Scale
                                                                                                                                                </button>
                                                                                                                        </div>
                                                                                                </form>
                                                                        </div>

                                                                        {/* Tabs */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'overview',
                                                                                                                                                label: 'Executive Council (9 Personas)',
                                                                                                                                                icon: Crown,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'financial',
                                                                                                                                                label: 'Costs & Hiring Budget',
                                                                                                                                                icon: DollarSign,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'roadmap',
                                                                                                                                                label: '2-Year Quarterly Roadmap',
                                                                                                                                                icon: Calendar,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'cloud',
                                                                                                                                                label: 'Cloud Topology & Trade-offs',
                                                                                                                                                icon: Cloud,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'sim',
                                                                                                                                                label: 'Simulation & Compliance',
                                                                                                                                                icon: Activity,
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
                                                                                                                                                                                                                                                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
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

                                                                        {/* TAB 1: Executive Council Grid (9 Personas) */}
                                                                        {activeTab ===
                                                                                                'overview' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                                                                                                {councilPersonas.map(
                                                                                                                                                                        (
                                                                                                                                                                                                persona,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => {
                                                                                                                                                                                                const Icon =
                                                                                                                                                                                                                        persona.icon;
                                                                                                                                                                                                return (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-2.5">
                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                        className={`p-2 rounded-xl border bg-slate-950 ${persona.color}`}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        <Icon className="w-5 h-5" />
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                                                                        <div className="text-sm font-black text-white">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        persona.role
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                        <div className="text-[11px] text-slate-400">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        persona.title
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-400 border border-slate-800">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        persona.risk
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <div className="space-y-2 text-xs">
                                                                                                                                                                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                                                                                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                                                                                                                                                                                                                                                                                                        Strategic
                                                                                                                                                                                                                                                                                                                        Assessment:
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <p className="text-slate-300">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                persona.assessment
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                                                                                                                <div className="text-[10px] text-amber-400 font-bold uppercase mb-1">
                                                                                                                                                                                                                                                                                                                        Key
                                                                                                                                                                                                                                                                                                                        Recommendation:
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <p className="text-slate-200">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                persona.recommendation
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

                                                                        {/* TAB 2: Costs & Hiring Budget */}
                                                                        {activeTab ===
                                                                                                'financial' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Cloud
                                                                                                                                                                                                Infra
                                                                                                                                                                                                Monthly
                                                                                                                                                                                                Cost
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-emerald-400 mt-1">
                                                                                                                                                                                                $18,500{' '}
                                                                                                                                                                                                <span className="text-xs font-normal text-slate-400">
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        mo
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                Dual-Region
                                                                                                                                                                                                active-active
                                                                                                                                                                                                AWS
                                                                                                                                                                                                EKS
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                One-Time
                                                                                                                                                                                                Migration
                                                                                                                                                                                                Cost
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-cyan-400 mt-1">
                                                                                                                                                                                                $45,000
                                                                                                                                                                                                USD
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                VPC
                                                                                                                                                                                                Peering
                                                                                                                                                                                                &
                                                                                                                                                                                                Data
                                                                                                                                                                                                Vault
                                                                                                                                                                                                Setup
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Total
                                                                                                                                                                                                2-Year
                                                                                                                                                                                                Budget
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-amber-400 mt-1">
                                                                                                                                                                                                $501,000
                                                                                                                                                                                                USD
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-emerald-400 mt-2 font-semibold">
                                                                                                                                                                                                Includes
                                                                                                                                                                                                Spot
                                                                                                                                                                                                Instance
                                                                                                                                                                                                cost
                                                                                                                                                                                                optimizations
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Hiring Plan */}
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Target
                                                                                                                                                                        Hiring
                                                                                                                                                                        Headcount
                                                                                                                                                                        Plan
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {[
                                                                                                                                                                                                {
                                                                                                                                                                                                                        role: 'Senior EU Compliance Security Engineer',
                                                                                                                                                                                                                        count: '2 Headcount',
                                                                                                                                                                                                                        salary: '$140,000 / yr',
                                                                                                                                                                                                                        priority: 'Immediate (Q1 2026)',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        role: 'Lead Multi-Region SRE Engineer',
                                                                                                                                                                                                                        count: '1 Headcount',
                                                                                                                                                                                                                        salary: '$155,000 / yr',
                                                                                                                                                                                                                        priority: 'Immediate (Q1 2026)',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        role: 'Distributed Systems Backend Engineer',
                                                                                                                                                                                                                        count: '3 Headcount',
                                                                                                                                                                                                                        salary: '$130,000 / yr',
                                                                                                                                                                                                                        priority: 'Q3 2026',
                                                                                                                                                                                                },
                                                                                                                                                                        ].map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        h,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="font-bold text-white text-sm">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        h.role
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-slate-400 mt-1">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        h.count
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                |{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        h.salary
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3 py-1 rounded-full font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                h.priority
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: 2-Year Quarterly Roadmap */}
                                                                        {activeTab ===
                                                                                                'roadmap' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white">
                                                                                                                                                                        2-Year
                                                                                                                                                                        8-Quarter
                                                                                                                                                                        Technical
                                                                                                                                                                        Migration
                                                                                                                                                                        Roadmap
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-4">
                                                                                                                                                                        {roadmapData.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        m,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-4"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 whitespace-nowrap">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                m.q
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="text-sm font-bold text-white">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        m.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-xs text-slate-400 mt-1">
                                                                                                                                                                                                                                                                                                Target
                                                                                                                                                                                                                                                                                                Architecture
                                                                                                                                                                                                                                                                                                State:{' '}
                                                                                                                                                                                                                                                                                                <span className="text-cyan-300 font-semibold">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                m.state
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: Cloud Topology & Trade-offs */}
                                                                        {activeTab === 'cloud' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white">
                                                                                                                                                                        Multi-Region
                                                                                                                                                                        Cloud
                                                                                                                                                                        Topology
                                                                                                                                                                        &
                                                                                                                                                                        Trade-Off
                                                                                                                                                                        Analysis
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                                                                                                                                                                                                <div className="text-rose-400 font-bold uppercase">
                                                                                                                                                                                                                        Option
                                                                                                                                                                                                                        A:
                                                                                                                                                                                                                        Single
                                                                                                                                                                                                                        Centralized
                                                                                                                                                                                                                        DB
                                                                                                                                                                                                                        (India)
                                                                                                                                                                                                                        +
                                                                                                                                                                                                                        EU
                                                                                                                                                                                                                        CDN
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-slate-400">
                                                                                                                                                                                                                        Lowest
                                                                                                                                                                                                                        cost
                                                                                                                                                                                                                        ($8,500/mo)
                                                                                                                                                                                                                        but
                                                                                                                                                                                                                        violates
                                                                                                                                                                                                                        GDPR
                                                                                                                                                                                                                        Art.
                                                                                                                                                                                                                        44
                                                                                                                                                                                                                        data
                                                                                                                                                                                                                        transfer
                                                                                                                                                                                                                        law.
                                                                                                                                                                                                </p>
                                                                                                                                                                                                <div className="text-rose-400 font-semibold pt-2">
                                                                                                                                                                                                                        ❌
                                                                                                                                                                                                                        Critical
                                                                                                                                                                                                                        Legal
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Latency
                                                                                                                                                                                                                        Exposure
                                                                                                                                                                                                                        (180ms+)
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 border-emerald-500/40">
                                                                                                                                                                                                <div className="text-emerald-400 font-bold uppercase">
                                                                                                                                                                                                                        Option
                                                                                                                                                                                                                        B:
                                                                                                                                                                                                                        Active-Active
                                                                                                                                                                                                                        Dual
                                                                                                                                                                                                                        Region
                                                                                                                                                                                                                        (RECOMMENDED)
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-slate-300">
                                                                                                                                                                                                                        Mumbai
                                                                                                                                                                                                                        +
                                                                                                                                                                                                                        Frankfurt
                                                                                                                                                                                                                        with
                                                                                                                                                                                                                        CockroachDB
                                                                                                                                                                                                                        EU
                                                                                                                                                                                                                        row-locality
                                                                                                                                                                                                                        leaseholders.
                                                                                                                                                                                                </p>
                                                                                                                                                                                                <div className="text-emerald-400 font-semibold pt-2">
                                                                                                                                                                                                                        ✅
                                                                                                                                                                                                                        100%
                                                                                                                                                                                                                        GDPR
                                                                                                                                                                                                                        Compliant
                                                                                                                                                                                                                        |
                                                                                                                                                                                                                        Sub-15ms
                                                                                                                                                                                                                        Latency
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 5: Simulation & Compliance */}
                                                                        {activeTab === 'sim' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Multi-Region
                                                                                                                                                                        Latency
                                                                                                                                                                        &
                                                                                                                                                                        Blast
                                                                                                                                                                        Radius
                                                                                                                                                                        Simulation
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Cross-Border
                                                                                                                                                                                                                        Latency
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-black text-cyan-400 mt-1">
                                                                                                                                                                                                                        14.2
                                                                                                                                                                                                                        ms
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Throughput
                                                                                                                                                                                                                        Capacity
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-black text-white mt-1">
                                                                                                                                                                                                                        45,000
                                                                                                                                                                                                                        RPS
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Failure
                                                                                                                                                                                                                        Probability
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-black text-emerald-400 mt-1">
                                                                                                                                                                                                                        0.01%
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        GDPR
                                                                                                                                                                                                                        Compliance
                                                                                                                                                                                                                        Score
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-3xl font-black text-amber-400 mt-1">
                                                                                                                                                                                                                        98.5%
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
