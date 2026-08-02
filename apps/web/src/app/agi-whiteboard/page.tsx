'use client';

import React, { useState } from 'react';
import {
                        Palette,
                        Sparkles,
                        Layers,
                        Send,
                        CheckCircle2,
                        AlertTriangle,
                        ArrowRight,
                        Database,
                        Cloud,
                        DollarSign,
                        Users,
                        Cpu,
                        RefreshCw,
                        Zap,
                        ShieldCheck,
                        Layout,
                        GitBranch,
                        ShieldAlert,
                        Server,
                        Activity,
                        Sliders,
} from 'lucide-react';

export default function AIArchitectureWhiteboardPage() {
                        const [promptInput, setPromptInput] = useState<string>(
                                                'Redesign this architecture for 50 million users.'
                        );
                        const [isGenerating, setIsGenerating] = useState<boolean>(false);
                        const [activeLayer, setActiveLayer] = useState<string>('diagram');

                        // Whiteboard Interactive Nodes & Edges
                        const nodes = [
                                                {
                                                                        id: 'node-1',
                                                                        label: 'Route53 + Cloudflare Anycast',
                                                                        type: 'Ingress Edge',
                                                                        protocol: 'HTTPS/3',
                                                                        status: 'Active',
                                                                        color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300',
                                                },
                                                {
                                                                        id: 'node-2',
                                                                        label: 'AWS EKS Active-Active Dual-Region Mesh',
                                                                        type: 'Compute Mesh',
                                                                        protocol: 'mTLS',
                                                                        status: 'Active',
                                                                        color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300',
                                                },
                                                {
                                                                        id: 'node-3',
                                                                        label: 'gRPC Auth & User Identity Vault',
                                                                        type: 'Microservice',
                                                                        protocol: 'gRPC',
                                                                        status: 'New',
                                                                        color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
                                                },
                                                {
                                                                        id: 'node-4',
                                                                        label: 'CockroachDB Multi-Region Row Locality',
                                                                        type: 'Storage',
                                                                        protocol: 'Raft',
                                                                        status: 'New',
                                                                        color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/40 text-emerald-300',
                                                },
                                                {
                                                                        id: 'node-5',
                                                                        label: 'Redis L2 Write-Through Distributed Cache',
                                                                        type: 'Caching',
                                                                        protocol: 'RESP3',
                                                                        status: 'Active',
                                                                        color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
                                                },
                                                {
                                                                        id: 'node-6',
                                                                        label: 'Kafka Distributed Event Streaming Bus',
                                                                        type: 'Messaging',
                                                                        protocol: 'Binary Streaming',
                                                                        status: 'Active',
                                                                        color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300',
                                                },
                        ];

                        const migrationPhases = [
                                                {
                                                                        phase: 'Stage 1',
                                                                        title: 'Decouple Auth Vault & gRPC Proto Schema Contracts',
                                                                        duration: '3 Months',
                                                                        deliverable: 'Isolated gRPC Auth Microservice',
                                                },
                                                {
                                                                        phase: 'Stage 2',
                                                                        title: 'Multi-Region CockroachDB Migration & Row Locality Rules',
                                                                        duration: '4 Months',
                                                                        deliverable: 'Active-Active Dual Region DB',
                                                },
                                                {
                                                                        phase: 'Stage 3',
                                                                        title: 'Zero-Trust mTLS Inter-Service Mesh & Circuit Breakers',
                                                                        duration: '3 Months',
                                                                        deliverable: 'Zero-Trust EKS Service Mesh',
                                                },
                                                {
                                                                        phase: 'Stage 4',
                                                                        title: '50M User Load Test & Automated Blue/Green Rollback Verification',
                                                                        duration: '2 Months',
                                                                        deliverable: '100% SLA Scale Readiness',
                                                },
                        ];

                        const costEstimate = {
                                                monthlyInfra: '$42,000 / mo',
                                                oneTimeMigration: '$85,000 USD',
                                                totalBudget: '$1,200,000 USD',
                                                annualSavings: '$145,000 USD / yr',
                        };

                        const riskMatrix = [
                                                {
                                                                        title: 'Cross-Region DB Synchronization Latency',
                                                                        impact: 'Medium Impact',
                                                                        mitigation: 'Configure CockroachDB leaseholders locally in eu-central-1 and ap-south-1.',
                                                },
                                                {
                                                                        title: 'GDPR Article 44 Data Sovereignty Non-Compliance',
                                                                        impact: 'High Impact',
                                                                        mitigation: 'Enforce strict row-locality rules pinning EU user rows to Frankfurt.',
                                                },
                        ];

                        const sprintBacklog = [
                                                {
                                                                        epic: 'EPIC-101',
                                                                        title: 'Define Protobuf binary schemas for Auth Vault gRPC streaming',
                                                                        points: 13,
                                                                        priority: 'P0',
                                                },
                                                {
                                                                        epic: 'EPIC-102',
                                                                        title: 'Deploy AWS EKS Dual-Region Transit Gateway VPC Peering',
                                                                        points: 21,
                                                                        priority: 'P0',
                                                },
                                                {
                                                                        epic: 'EPIC-103',
                                                                        title: 'Configure Kafka Event Sourcing reconciliation consumer workers',
                                                                        points: 8,
                                                                        priority: 'P1',
                                                },
                        ];

                        const hiringPlan = [
                                                {
                                                                        role: 'Lead Distributed Systems Architect',
                                                                        headcount: '1 Headcount',
                                                                        quarter: 'Q1 2026',
                                                },
                                                {
                                                                        role: 'Senior Multi-Region SRE Engineer',
                                                                        headcount: '2 Headcount',
                                                                        quarter: 'Q1 2026',
                                                },
                                                {
                                                                        role: 'Zero-Trust Security Engineer',
                                                                        headcount: '1 Headcount',
                                                                        quarter: 'Q2 2026',
                                                },
                        ];

                        const handleRedesignSubmit = (e: React.FormEvent) => {
                                                e.preventDefault();
                                                setIsGenerating(true);
                                                setTimeout(() => setIsGenerating(false), 1200);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Top Banner Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-2xl text-purple-400">
                                                                                                                                                                        <Palette className="w-8 h-8 animate-pulse" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                                                                                                                                                                                                🌟
                                                                                                                                                                                                The
                                                                                                                                                                                                Signature
                                                                                                                                                                                                Feature
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                                                                                                                                                                                                AI
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                Whiteboard
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                "Unlike
                                                                                                                                                almost
                                                                                                                                                any
                                                                                                                                                existing
                                                                                                                                                engineering
                                                                                                                                                tool."
                                                                                                                                                Ask
                                                                                                                                                CodeAtlas
                                                                                                                                                to
                                                                                                                                                redesign
                                                                                                                                                any
                                                                                                                                                software
                                                                                                                                                architecture
                                                                                                                                                for
                                                                                                                                                50M
                                                                                                                                                users
                                                                                                                                                —
                                                                                                                                                instantly
                                                                                                                                                generating
                                                                                                                                                an
                                                                                                                                                editable
                                                                                                                                                interactive
                                                                                                                                                diagram,
                                                                                                                                                migration
                                                                                                                                                phases,
                                                                                                                                                cost
                                                                                                                                                estimates,
                                                                                                                                                risk
                                                                                                                                                matrix,
                                                                                                                                                sprint
                                                                                                                                                backlog,
                                                                                                                                                hiring
                                                                                                                                                plan,
                                                                                                                                                infra
                                                                                                                                                plan,
                                                                                                                                                and
                                                                                                                                                rollback
                                                                                                                                                strategy.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        Whiteboard
                                                                                                                                                                        Canvas
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-purple-300">
                                                                                                                                                                        8
                                                                                                                                                                        Editable
                                                                                                                                                                        Layers
                                                                                                                                                                        Active
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Redesign Prompt Bar */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                                                                                                <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-2">
                                                                                                                        <Sparkles className="w-4 h-4" />{' '}
                                                                                                                        Ask
                                                                                                                        CodeAtlas
                                                                                                                        Architecture
                                                                                                                        Whiteboard
                                                                                                </div>

                                                                                                <form
                                                                                                                        onSubmit={
                                                                                                                                                handleRedesignSubmit
                                                                                                                        }
                                                                                                                        className="flex gap-3"
                                                                                                >
                                                                                                                        <input
                                                                                                                                                type="text"
                                                                                                                                                value={
                                                                                                                                                                        promptInput
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setPromptInput(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 focus:outline-none focus:border-purple-500/60 font-medium"
                                                                                                                        />
                                                                                                                        <button
                                                                                                                                                type="submit"
                                                                                                                                                disabled={
                                                                                                                                                                        isGenerating
                                                                                                                                                }
                                                                                                                                                className="px-8 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black text-xs rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20"
                                                                                                                        >
                                                                                                                                                {isGenerating ? (
                                                                                                                                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                                                                                                                ) : (
                                                                                                                                                                        <Send className="w-4 h-4" />
                                                                                                                                                )}
                                                                                                                                                {isGenerating
                                                                                                                                                                        ? 'Rendering Whiteboard...'
                                                                                                                                                                        : 'Redesign Architecture'}
                                                                                                                        </button>
                                                                                                </form>
                                                                        </div>

                                                                        {/* Whiteboard Layer Navigation */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'diagram',
                                                                                                                                                label: '1. Architecture Canvas',
                                                                                                                                                icon: Layout,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'migration',
                                                                                                                                                label: '2. Migration Stages',
                                                                                                                                                icon: GitBranch,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'costs',
                                                                                                                                                label: '3. Cost Estimates',
                                                                                                                                                icon: DollarSign,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'risks',
                                                                                                                                                label: '4. Risk Matrix',
                                                                                                                                                icon: ShieldAlert,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'sprints',
                                                                                                                                                label: '5. Sprint Backlog',
                                                                                                                                                icon: Layers,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'hiring',
                                                                                                                                                label: '6. Hiring Plan',
                                                                                                                                                icon: Users,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'infra',
                                                                                                                                                label: '7. Infrastructure Plan',
                                                                                                                                                icon: Server,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'rollback',
                                                                                                                                                label: '8. Rollback Strategy',
                                                                                                                                                icon: RefreshCw,
                                                                                                                        },
                                                                                                ].map(
                                                                                                                        (
                                                                                                                                                tab
                                                                                                                        ) => {
                                                                                                                                                const Icon =
                                                                                                                                                                        tab.icon;
                                                                                                                                                const isActive =
                                                                                                                                                                        activeLayer ===
                                                                                                                                                                        tab.id;
                                                                                                                                                return (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        tab.id
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setActiveLayer(
                                                                                                                                                                                                                                                tab.id
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                                                                                                                                                                                                        isActive
                                                                                                                                                                                                                                                ? 'bg-purple-600 text-white font-black shadow-lg shadow-purple-500/20'
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

                                                                        {/* LAYER 1: Interactive Architecture Diagram Canvas */}
                                                                        {activeLayer ===
                                                                                                'diagram' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-base font-extrabold text-white">
                                                                                                                                                                                                                        50
                                                                                                                                                                                                                        Million
                                                                                                                                                                                                                        User
                                                                                                                                                                                                                        Scale
                                                                                                                                                                                                                        Architecture
                                                                                                                                                                                                                        Canvas
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                                                                        Interactive
                                                                                                                                                                                                                        component
                                                                                                                                                                                                                        nodes
                                                                                                                                                                                                                        connected
                                                                                                                                                                                                                        via
                                                                                                                                                                                                                        high-performance
                                                                                                                                                                                                                        mTLS
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        gRPC
                                                                                                                                                                                                                        protocols.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
                                                                                                                                                                                                Target
                                                                                                                                                                                                Scale:
                                                                                                                                                                                                50,000,000
                                                                                                                                                                                                Users
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                {/* Visual Whiteboard Grid */}
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                                                                                                                                                        {nodes.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        node
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        node.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className={`p-5 rounded-2xl border bg-slate-950 ${node.color} space-y-3 shadow-lg hover:border-purple-500/60 transition-all`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        node.type
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        node.status
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <h4 className="text-sm font-black text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                node.label
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </h4>
                                                                                                                                                                                                                                                <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                Protocol:{' '}
                                                                                                                                                                                                                                                                                                <strong className="text-slate-200">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                node.protocol
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </strong>
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                                                                                                &lt;
                                                                                                                                                                                                                                                                                                5ms
                                                                                                                                                                                                                                                                                                Latency
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* LAYER 2: Migration Phases */}
                                                                        {activeLayer ===
                                                                                                'migration' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        4-Phase
                                                                                                                                                                        Zero-Downtime
                                                                                                                                                                        Migration
                                                                                                                                                                        Strategy
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {migrationPhases.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        m,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="space-y-1">
                                                                                                                                                                                                                                                                        <div className="font-bold text-purple-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        m.phase
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                :{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        m.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-slate-400">
                                                                                                                                                                                                                                                                                                Key
                                                                                                                                                                                                                                                                                                Deliverable:{' '}
                                                                                                                                                                                                                                                                                                <span className="text-slate-200">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                m.deliverable
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1 rounded-full font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                m.duration
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* LAYER 3: Cost Estimates */}
                                                                        {activeLayer ===
                                                                                                'costs' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Monthly
                                                                                                                                                                                                Cloud
                                                                                                                                                                                                Infra
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-emerald-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        costEstimate.monthlyInfra
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                One-Time
                                                                                                                                                                                                Migration
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-cyan-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        costEstimate.oneTimeMigration
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Total
                                                                                                                                                                                                Scale
                                                                                                                                                                                                Budget
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-purple-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        costEstimate.totalBudget
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Annual
                                                                                                                                                                                                Cost
                                                                                                                                                                                                Savings
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-black text-amber-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        costEstimate.annualSavings
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* LAYER 4: Risk Matrix */}
                                                                        {activeLayer ===
                                                                                                'risks' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Architecture
                                                                                                                                                                        Risk
                                                                                                                                                                        Matrix
                                                                                                                                                                        &
                                                                                                                                                                        Mitigation
                                                                                                                                                                        Strategies
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {riskMatrix.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        r,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <span className="font-bold text-rose-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        r.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        r.impact
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-slate-300">
                                                                                                                                                                                                                                                                        Mitigation:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                r.mitigation
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* LAYER 5: Sprint Backlog */}
                                                                        {activeLayer ===
                                                                                                'sprints' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        24-Epic
                                                                                                                                                                        Agile
                                                                                                                                                                        Sprint
                                                                                                                                                                        Backlog
                                                                                                                                                                        Breakdown
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {sprintBacklog.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        s,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="font-bold text-white">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        s.epic
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                :{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        s.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-slate-400 mt-0.5">
                                                                                                                                                                                                                                                                                                Priority:{' '}
                                                                                                                                                                                                                                                                                                <span className="text-amber-400 font-bold">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                s.priority
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                s.points
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        Story
                                                                                                                                                                                                                                                                        Points
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* LAYER 6: Hiring Plan */}
                                                                        {activeLayer ===
                                                                                                'hiring' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Engineering
                                                                                                                                                                        Talent
                                                                                                                                                                        Hiring
                                                                                                                                                                        Headcount
                                                                                                                                                                        Plan
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {hiringPlan.map(
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
                                                                                                                                                                                                                                                <div className="font-bold text-white text-sm">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                h.role
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                        <span className="text-slate-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        h.headcount
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-3 py-1 rounded-full font-bold">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        h.quarter
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* LAYER 7: Infrastructure Plan */}
                                                                        {activeLayer ===
                                                                                                'infra' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Multi-Region
                                                                                                                                                                        Cloud
                                                                                                                                                                        Infrastructure
                                                                                                                                                                        Specification
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3 text-xs">
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="font-bold text-cyan-400">
                                                                                                                                                                                                                        AWS
                                                                                                                                                                                                                        EKS
                                                                                                                                                                                                                        Worker
                                                                                                                                                                                                                        Nodes
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-300 mt-1">
                                                                                                                                                                                                                        Spec:
                                                                                                                                                                                                                        c6i.4xlarge
                                                                                                                                                                                                                        (16
                                                                                                                                                                                                                        vCPU,
                                                                                                                                                                                                                        32GiB
                                                                                                                                                                                                                        RAM)
                                                                                                                                                                                                                        |
                                                                                                                                                                                                                        Region:
                                                                                                                                                                                                                        ap-south-1
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        eu-central-1
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="font-bold text-purple-400">
                                                                                                                                                                                                                        CockroachDB
                                                                                                                                                                                                                        Multi-Region
                                                                                                                                                                                                                        Cluster
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-300 mt-1">
                                                                                                                                                                                                                        Spec:
                                                                                                                                                                                                                        i3en.3xlarge
                                                                                                                                                                                                                        NVMe
                                                                                                                                                                                                                        Storage
                                                                                                                                                                                                                        Nodes
                                                                                                                                                                                                                        |
                                                                                                                                                                                                                        Region:
                                                                                                                                                                                                                        Mumbai
                                                                                                                                                                                                                        +
                                                                                                                                                                                                                        Frankfurt
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* LAYER 8: Rollback Strategy */}
                                                                        {activeLayer ===
                                                                                                'rollback' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-2">
                                                                                                                                                                        Automated
                                                                                                                                                                        Blue/Green
                                                                                                                                                                        Rollback
                                                                                                                                                                        Strategy
                                                                                                                                                </h3>
                                                                                                                                                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                                                                                                                                                                        <div className="text-rose-400 font-bold uppercase">
                                                                                                                                                                                                Automated
                                                                                                                                                                                                Trigger
                                                                                                                                                                                                Condition:
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                Automated
                                                                                                                                                                                                switchback
                                                                                                                                                                                                triggers
                                                                                                                                                                                                if
                                                                                                                                                                                                p99
                                                                                                                                                                                                latency
                                                                                                                                                                                                &gt;
                                                                                                                                                                                                50ms
                                                                                                                                                                                                or
                                                                                                                                                                                                HTTP
                                                                                                                                                                                                5xx
                                                                                                                                                                                                error
                                                                                                                                                                                                rate
                                                                                                                                                                                                &gt;
                                                                                                                                                                                                0.05%
                                                                                                                                                                                                for
                                                                                                                                                                                                60
                                                                                                                                                                                                consecutive
                                                                                                                                                                                                seconds.
                                                                                                                                                                        </p>
                                                                                                                                                                        <div className="text-emerald-400 font-bold uppercase pt-2">
                                                                                                                                                                                                Switchback
                                                                                                                                                                                                Performance:
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                Instant
                                                                                                                                                                                                automated
                                                                                                                                                                                                switchback
                                                                                                                                                                                                completes
                                                                                                                                                                                                in
                                                                                                                                                                                                15
                                                                                                                                                                                                seconds
                                                                                                                                                                                                with
                                                                                                                                                                                                zero
                                                                                                                                                                                                lost
                                                                                                                                                                                                user
                                                                                                                                                                                                state
                                                                                                                                                                                                via
                                                                                                                                                                                                Kafka
                                                                                                                                                                                                event
                                                                                                                                                                                                store
                                                                                                                                                                                                replay
                                                                                                                                                                                                log.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
