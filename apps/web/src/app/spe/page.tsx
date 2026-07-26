'use client';

import React, { useState } from 'react';
import {
                        Atom,
                        Flame,
                        Zap,
                        Shield,
                        Gauge,
                        Activity,
                        Layers,
                        Sparkles,
                        RefreshCw,
                        Info,
                        Scale,
                        Compass,
                        CheckCircle2,
                        Orbit,
                        TrendingUp,
                        BarChart2,
                        TrendingDown,
                        ShieldAlert,
                        Sliders,
                        History,
                        CloudSun,
                        Radio,
                        AlertTriangle,
                        GitMerge,
} from 'lucide-react';

export default function SoftwarePhysicsEnginePage() {
                        const [selectedComponent, setSelectedComponent] =
                                                useState<string>('auth_service');
                        const [activeTab, setActiveTab] = useState<string>('gauges');

                        const components = [
                                                {
                                                                        id: 'auth_service',
                                                                        name: 'Authentication Service',
                                                                        summary: 'High Mass (10/10) & Gravity (9/10). Changes carry intense orbital pull across 14 microservices.',
                                                                        verdict: 'HIGH_GRAVITATIONAL_ORBITAL_PULL',
                                                                        massBreakdown: {
                                                                                                loc: 42000,
                                                                                                complexity: 142,
                                                                                                classes: 64,
                                                                                                functions: 380,
                                                                        },
                                                                        gravityBreakdown: {
                                                                                                services: 14,
                                                                                                repos: [
                                                                                                                        'checkout',
                                                                                                                        'payments',
                                                                                                                        'inventory',
                                                                                                                        'cart',
                                                                                                ],
                                                                                                radius: '450 km',
                                                                        },
                                                                        tempPressure: {
                                                                                                commits14d: 78,
                                                                                                authors: 12,
                                                                                                rps: 12400,
                                                                                                churn: '45 LOC/day',
                                                                                                cadence: '14 days',
                                                                        },
                                                                        frictionBreakdown: {
                                                                                                coupling: '7.5 / 10',
                                                                                                complexity: '8.0 / 10',
                                                                                                testCoverage: '62.0%',
                                                                                                docsScore: '45.0 / 100',
                                                                        },
                                                                        entropyHistory: [
                                                                                                {
                                                                                                                        quarter: 'Q1 2025',
                                                                                                                        score: '3.2 / 10',
                                                                                                                        status: 'Organized',
                                                                                                },
                                                                                                {
                                                                                                                        quarter: 'Q3 2025',
                                                                                                                        score: '5.8 / 10',
                                                                                                                        status: 'Drifting',
                                                                                                },
                                                                                                {
                                                                                                                        quarter: 'Q1 2026',
                                                                                                                        score: '6.0 / 10',
                                                                                                                        status: 'Disorganized',
                                                                                                },
                                                                                                {
                                                                                                                        quarter: 'Q2 2026',
                                                                                                                        score: '4.1 / 10',
                                                                                                                        status: 'Organized',
                                                                                                },
                                                                        ],
                                                                        metrics: [
                                                                                                {
                                                                                                                        label: 'Mass',
                                                                                                                        val: '10.0 / 10',
                                                                                                                        gauge: '██████████',
                                                                                                                        desc: 'Very Large Module (42,000 LOC AST)',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Gravity',
                                                                                                                        val: '9.0 / 10',
                                                                                                                        gauge: '█████████░',
                                                                                                                        desc: '14 Consuming Services Bound to it',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Energy',
                                                                                                                        val: '8.5 / 10',
                                                                                                                        gauge: '████████░░',
                                                                                                                        desc: 'Active CPU/Memory Compute Throughput',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Momentum',
                                                                                                                        val: '4.0 / 10',
                                                                                                                        gauge: '████░░░░░░',
                                                                                                                        desc: 'Release Momentum',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Friction',
                                                                                                                        val: '7.0 / 10',
                                                                                                                        gauge: '███████░░░',
                                                                                                                        desc: 'Refactoring Technical Debt Resistance',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Temperature',
                                                                                                                        val: '7.0 / 10',
                                                                                                                        gauge: '███████░░░',
                                                                                                                        desc: '78 Commits in past 14 days',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Pressure',
                                                                                                                        val: '8.0 / 10',
                                                                                                                        gauge: '████████░░',
                                                                                                                        desc: '12,400 RPS Production Traffic',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Velocity',
                                                                                                                        val: '2.0 / 10',
                                                                                                                        gauge: '██░░░░░░░░',
                                                                                                                        desc: 'Changes Slowly (Stable Core)',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Elasticity',
                                                                                                                        val: '9.0 / 10',
                                                                                                                        gauge: '█████████░',
                                                                                                                        desc: 'Instant AWS EKS Pod Recovery',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Entropy',
                                                                                                                        val: '6.0 / 10',
                                                                                                                        gauge: '██████░░░░',
                                                                                                                        desc: 'Architecture Becoming Disorganized',
                                                                                                },
                                                                        ],
                                                },
                                                {
                                                                        id: 'checkout_service',
                                                                        name: 'Checkout Service',
                                                                        summary: 'Operates under Extreme Thermal Pressure (9.5/10) and High Entropy (7.5/10). High refactoring friction requires active cooling.',
                                                                        verdict: 'HIGH_THERMAL_PRESSURE_ENTROPY_DECAY',
                                                                        massBreakdown: {
                                                                                                loc: 31500,
                                                                                                complexity: 118,
                                                                                                classes: 48,
                                                                                                functions: 290,
                                                                        },
                                                                        gravityBreakdown: {
                                                                                                services: 10,
                                                                                                repos: [
                                                                                                                        'payments',
                                                                                                                        'cart',
                                                                                                                        'inventory',
                                                                                                ],
                                                                                                radius: '320 km',
                                                                        },
                                                                        tempPressure: {
                                                                                                commits14d: 142,
                                                                                                authors: 18,
                                                                                                rps: 24500,
                                                                                                churn: '120 LOC/day',
                                                                                                cadence: '3 days',
                                                                        },
                                                                        frictionBreakdown: {
                                                                                                coupling: '8.5 / 10',
                                                                                                complexity: '9.0 / 10',
                                                                                                testCoverage: '48.0%',
                                                                                                docsScore: '30.0 / 100',
                                                                        },
                                                                        entropyHistory: [
                                                                                                {
                                                                                                                        quarter: 'Q1 2025',
                                                                                                                        score: '4.5 / 10',
                                                                                                                        status: 'Organized',
                                                                                                },
                                                                                                {
                                                                                                                        quarter: 'Q3 2025',
                                                                                                                        score: '6.8 / 10',
                                                                                                                        status: 'Drifting',
                                                                                                },
                                                                                                {
                                                                                                                        quarter: 'Q1 2026',
                                                                                                                        score: '7.5 / 10',
                                                                                                                        status: 'Disorganized',
                                                                                                },
                                                                                                {
                                                                                                                        quarter: 'Q2 2026',
                                                                                                                        score: '5.2 / 10',
                                                                                                                        status: 'Drifting',
                                                                                                },
                                                                        ],
                                                                        metrics: [
                                                                                                {
                                                                                                                        label: 'Mass',
                                                                                                                        val: '8.5 / 10',
                                                                                                                        gauge: '████████░░',
                                                                                                                        desc: 'Large Complex Monolith Slices',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Gravity',
                                                                                                                        val: '8.0 / 10',
                                                                                                                        gauge: '████████░░',
                                                                                                                        desc: '10 Consuming Microservices',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Energy',
                                                                                                                        val: '9.5 / 10',
                                                                                                                        gauge: '█████████░',
                                                                                                                        desc: 'Extreme Database I/O Overhead',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Momentum',
                                                                                                                        val: '7.5 / 10',
                                                                                                                        gauge: '███████░░░',
                                                                                                                        desc: 'High Feature Velocity Momentum',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Friction',
                                                                                                                        val: '8.0 / 10',
                                                                                                                        gauge: '████████░░',
                                                                                                                        desc: 'High Technical Debt Friction',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Temperature',
                                                                                                                        val: '9.0 / 10',
                                                                                                                        gauge: '█████████░',
                                                                                                                        desc: 'Hot Codebase (142 Commits)',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Pressure',
                                                                                                                        val: '9.5 / 10',
                                                                                                                        gauge: '█████████░',
                                                                                                                        desc: '24,500 RPS Peak Sales Traffic',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Velocity',
                                                                                                                        val: '6.5 / 10',
                                                                                                                        gauge: '██████░░░░',
                                                                                                                        desc: 'Rapid Code Evolution',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Elasticity',
                                                                                                                        val: '7.0 / 10',
                                                                                                                        gauge: '███████░░░',
                                                                                                                        desc: 'Moderate Autoscaling Resilience',
                                                                                                },
                                                                                                {
                                                                                                                        label: 'Entropy',
                                                                                                                        val: '7.5 / 10',
                                                                                                                        gauge: '███████░░░',
                                                                                                                        desc: 'High Disorganization Decay',
                                                                                                },
                                                                        ],
                                                },
                        ];

                        // Engineering Climate State
                        const climateState = {
                                                status: 'Warming',
                                                index: '74.5 / 100',
                                                color: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
                                                driver: 'Elevated commit heat (78 commits in 14d) and active PR collisions in security core.',
                                                action: 'Execute PR-408 merge and decouple Auth Vault before Q4 traffic peak.',
                        };

                        const currentComp =
                                                components.find(
                                                                        (c) =>
                                                                                                c.id ===
                                                                                                selectedComponent
                                                ) || components[0];

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Top Banner Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl text-cyan-400">
                                                                                                                                                                        <Atom className="w-8 h-8 animate-spin-slow" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                                                                                                                                                                                                🚀
                                                                                                                                                                                                Phase
                                                                                                                                                                                                27
                                                                                                                                                                                                —
                                                                                                                                                                                                Software
                                                                                                                                                                                                Physics
                                                                                                                                                                                                Engine
                                                                                                                                                                                                (SPE)
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                                                                                                                                                                                                Software
                                                                                                                                                                                                Physics
                                                                                                                                                                                                Simulator
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Simulates
                                                                                                                                                software
                                                                                                                                                components
                                                                                                                                                as
                                                                                                                                                living
                                                                                                                                                physical
                                                                                                                                                systems
                                                                                                                                                across
                                                                                                                                                Force
                                                                                                                                                Propagation,
                                                                                                                                                Collision
                                                                                                                                                Detection,
                                                                                                                                                Stability
                                                                                                                                                Indexing,
                                                                                                                                                Resonance,
                                                                                                                                                and
                                                                                                                                                Engineering
                                                                                                                                                Climate
                                                                                                                                                (Calm,
                                                                                                                                                Warming,
                                                                                                                                                Storm,
                                                                                                                                                Critical).
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        Engineering
                                                                                                                                                                        Climate
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                                                                                                                                                                        <CloudSun className="w-4 h-4" />{' '}
                                                                                                                                                                        State:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                climateState.status
                                                                                                                                                                        }
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Component Selector */}
                                                                        <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {components.map(
                                                                                                                        (
                                                                                                                                                c
                                                                                                                        ) => (
                                                                                                                                                <button
                                                                                                                                                                        key={
                                                                                                                                                                                                c.id
                                                                                                                                                                        }
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                setSelectedComponent(
                                                                                                                                                                                                                        c.id
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                                                                                                                                                                                                selectedComponent ===
                                                                                                                                                                                                c.id
                                                                                                                                                                                                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/20'
                                                                                                                                                                                                                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                                                                                                                                                                        }`}
                                                                                                                                                >
                                                                                                                                                                        <Atom className="w-4 h-4" />
                                                                                                                                                                        {
                                                                                                                                                                                                c.name
                                                                                                                                                                        }
                                                                                                                                                </button>
                                                                                                                        )
                                                                                                )}
                                                                        </div>

                                                                        {/* Tabs */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'gauges',
                                                                                                                                                label: '10 Physics Gauges (██████████)',
                                                                                                                                                icon: Gauge,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'climate',
                                                                                                                                                label: '⭐ 15. Engineering Climate Summary',
                                                                                                                                                icon: CloudSun,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'force',
                                                                                                                                                label: '⭐ 11–12. Force Simulation & Collisions',
                                                                                                                                                icon: GitMerge,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'stability',
                                                                                                                                                label: '⭐ 13–14. Stability Index & Resonance',
                                                                                                                                                icon: Shield,
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
                                                                                                                                                                                                                                                ? 'bg-cyan-600 text-white font-black shadow-lg shadow-cyan-500/20'
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

                                                                        {/* TAB 1: 10 Physics Gauges */}
                                                                        {activeTab === 'gauges' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                                                                                                                <div className="flex items-center gap-4">
                                                                                                                                                                        <div className="p-3 bg-cyan-500/20 border border-cyan-500/30 rounded-2xl text-cyan-400">
                                                                                                                                                                                                <Info className="w-6 h-6" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                                                                                                                                                                                                                        Physical
                                                                                                                                                                                                                        System
                                                                                                                                                                                                                        Intuition
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h3 className="text-base font-bold text-white mt-0.5">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                currentComp.summary
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h3>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <span className="px-4 py-2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-black rounded-xl whitespace-nowrap">
                                                                                                                                                                        {
                                                                                                                                                                                                currentComp.verdict
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                                                                                                                                {currentComp.metrics.map(
                                                                                                                                                                        (
                                                                                                                                                                                                m,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-cyan-500/40 transition-all"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                <span className="text-xs font-black uppercase text-slate-300">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                m.label
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs font-bold text-cyan-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                m.val
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="font-mono text-cyan-400 tracking-widest text-sm bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        m.gauge
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        m.desc
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: Engineering Climate Summary */}
                                                                        {activeTab ===
                                                                                                'climate' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div
                                                                                                                                                className={`p-6 rounded-3xl border ${climateState.color} space-y-4 shadow-2xl`}
                                                                                                                        >
                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-2xl text-amber-300">
                                                                                                                                                                                                                        <CloudSun className="w-8 h-8 animate-pulse" />
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                                                                                                                                                                                                                                ⭐
                                                                                                                                                                                                                                                15.
                                                                                                                                                                                                                                                Overall
                                                                                                                                                                                                                                                Engineering
                                                                                                                                                                                                                                                Climate
                                                                                                                                                                                                                                                State
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <h2 className="text-2xl font-black text-white">
                                                                                                                                                                                                                                                Climate
                                                                                                                                                                                                                                                State:{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        climateState.status
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </h2>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xl font-black text-amber-300 bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-2xl">
                                                                                                                                                                                                Index:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        climateState.index
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                                                                                                                                                                                <span className="text-slate-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                        Primary
                                                                                                                                                                                                                        Weather
                                                                                                                                                                                                                        Driver:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-slate-200 mt-1 font-medium">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                climateState.driver
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                                                                                                                                                                                <span className="text-emerald-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                        Recommended
                                                                                                                                                                                                                        Leadership
                                                                                                                                                                                                                        Action:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-slate-200 mt-1 font-medium">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                climateState.action
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: Force Simulation & Collision Detector */}
                                                                        {activeTab === 'force' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-2">
                                                                                                                                                                        ⭐
                                                                                                                                                                        11.
                                                                                                                                                                        Force
                                                                                                                                                                        Simulation
                                                                                                                                                                        &
                                                                                                                                                                        ⭐
                                                                                                                                                                        12.
                                                                                                                                                                        Pre-Merge
                                                                                                                                                                        Collision
                                                                                                                                                                        Detector
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                                                                                                                                                                                                <div className="text-cyan-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                        Force
                                                                                                                                                                                                                        Vector
                                                                                                                                                                                                                        Magnitude
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-2xl font-black text-white">
                                                                                                                                                                                                                        850.0
                                                                                                                                                                                                                        N{' '}
                                                                                                                                                                                                                        <span className="text-xs font-normal text-slate-400">
                                                                                                                                                                                                                                                (Shockwave:
                                                                                                                                                                                                                                                3
                                                                                                                                                                                                                                                Hops)
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-300">
                                                                                                                                                                                                                        Propagates
                                                                                                                                                                                                                        to:
                                                                                                                                                                                                                        checkout_service,
                                                                                                                                                                                                                        payments_gateway,
                                                                                                                                                                                                                        cart_service
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                                                                                                                                                                                                <div className="text-rose-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                        Pre-Merge
                                                                                                                                                                                                                        Collision
                                                                                                                                                                                                                        Warning
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-sm font-bold text-white">
                                                                                                                                                                                                                        PR-402
                                                                                                                                                                                                                        ↔
                                                                                                                                                                                                                        PR-408
                                                                                                                                                                                                                        Conflict
                                                                                                                                                                                                                        Detected
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                                                                        File:
                                                                                                                                                                                                                        apps/backend/app/core/security.py
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: Subsystem Stability & Resonance */}
                                                                        {activeTab ===
                                                                                                'stability' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-2">
                                                                                                                                                                        ⭐
                                                                                                                                                                        13.
                                                                                                                                                                        Subsystem
                                                                                                                                                                        Stability
                                                                                                                                                                        Index
                                                                                                                                                                        &
                                                                                                                                                                        ⭐
                                                                                                                                                                        14.
                                                                                                                                                                        Resonance
                                                                                                                                                                        Frequency
                                                                                                                                                                        Detection
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                                                                                                                                                                                                <div className="text-emerald-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                        Stability
                                                                                                                                                                                                                        Index
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-2xl font-black text-white">
                                                                                                                                                                                                                        94.2%
                                                                                                                                                                                                                        Stability{' '}
                                                                                                                                                                                                                        <span className="text-xs font-normal text-slate-400">
                                                                                                                                                                                                                                                (MTBF:
                                                                                                                                                                                                                                                720
                                                                                                                                                                                                                                                Hours)
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-emerald-400 font-semibold">
                                                                                                                                                                                                                        Volatility
                                                                                                                                                                                                                        Rating:
                                                                                                                                                                                                                        Low
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                                                                                                                                                                                                <div className="text-purple-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                        Recurring
                                                                                                                                                                                                                        Resonance
                                                                                                                                                                                                                        Pattern
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-sm font-bold text-white">
                                                                                                                                                                                                                        Bi-Weekly
                                                                                                                                                                                                                        Redis
                                                                                                                                                                                                                        Write-Through
                                                                                                                                                                                                                        Memory
                                                                                                                                                                                                                        Leak
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                                                                        Cycle
                                                                                                                                                                                                                        Period:
                                                                                                                                                                                                                        14
                                                                                                                                                                                                                        Days
                                                                                                                                                                                                                        |
                                                                                                                                                                                                                        Pod
                                                                                                                                                                                                                        Memory
                                                                                                                                                                                                                        Rises
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        92%
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
