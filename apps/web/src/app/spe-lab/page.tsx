'use client';

import React, { useState } from 'react';
import {
                        Globe2,
                        Atom,
                        Orbit,
                        Sparkles,
                        Zap,
                        Shield,
                        Move,
                        Activity,
                        CheckCircle2,
                        AlertTriangle,
                        RefreshCw,
                        Award,
                        Layers,
                        Flame,
                        Scale,
} from 'lucide-react';

export default function InteractiveSoftwarePhysicsLabPage() {
                        const [selectedNode, setSelectedNode] =
                                                useState<string>('payments_service');
                        const [orbitDistance, setOrbitDistance] = useState<number>(450);
                        const [isSimulating, setIsSimulating] = useState<boolean>(false);

                        // 🌟 WOW Feature Nodes (Solar System View)
                        const solarSystemNodes = [
                                                {
                                                                        id: 'auth_service',
                                                                        name: 'Authentication Service',
                                                                        type: 'Core Sun',
                                                                        gravity: '9.0 Gravity',
                                                                        mass: '10.0 Mass',
                                                                        color: 'from-amber-500 to-yellow-500 border-amber-400 text-amber-300',
                                                },
                                                {
                                                                        id: 'payments_service',
                                                                        name: 'Payments Service',
                                                                        type: 'Inner Planet (Gravity Well)',
                                                                        gravity: '9.2 Well',
                                                                        mass: '9.2 Mass',
                                                                        color: 'from-rose-500 to-red-500 border-rose-400 text-rose-300',
                                                },
                                                {
                                                                        id: 'checkout_service',
                                                                        name: 'Checkout Service',
                                                                        type: 'Mid Orbit Planet',
                                                                        gravity: '8.0 Gravity',
                                                                        mass: '8.5 Mass',
                                                                        color: 'from-indigo-500 to-blue-500 border-indigo-400 text-indigo-300',
                                                },
                                                {
                                                                        id: 'inventory_service',
                                                                        name: 'Inventory Service',
                                                                        type: 'Outer Satellite',
                                                                        gravity: '5.0 Gravity',
                                                                        mass: '6.0 Mass',
                                                                        color: 'from-emerald-500 to-teal-500 border-emerald-400 text-emerald-300',
                                                },
                        ];

                        // Simulation State output
                        const simulationState = {
                                                node: selectedNode,
                                                dist: orbitDistance,
                                                stress: `Dragging ${selectedNode} outward to ${orbitDistance}km orbital radius redistributes 42% CPU/Memory load to auxiliary replica worker pods.`,
                                                movement: 'checkout_service, auth_service, cart_service, inventory_service',
                                                perf: '+18.5% Performance Boost',
                                                debt: '-12.4% Debt Reduction',
                                                verdict: 'ORBITAL_SHIFT_STABILITY_IMPROVED',
                        };

                        const handleSimulateDrag = (nodeId: string, distance: number) => {
                                                setSelectedNode(nodeId);
                                                setOrbitDistance(distance);
                                                setIsSimulating(true);
                                                setTimeout(() => setIsSimulating(false), 800);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Top Banner Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
                                                                                                                                                                        <Orbit className="w-8 h-8 animate-spin-slow" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                                                                                                                                                                                🌟
                                                                                                                                                                                                WOW
                                                                                                                                                                                                Feature
                                                                                                                                                                                                —
                                                                                                                                                                                                Phase
                                                                                                                                                                                                27
                                                                                                                                                                                                Finale
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                                                                                                                                                                                                Interactive
                                                                                                                                                                                                Software
                                                                                                                                                                                                Physics
                                                                                                                                                                                                Lab
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                "Imagine
                                                                                                                                                dragging
                                                                                                                                                one
                                                                                                                                                service.
                                                                                                                                                The
                                                                                                                                                simulation
                                                                                                                                                instantly
                                                                                                                                                shows
                                                                                                                                                stress
                                                                                                                                                redistribution,
                                                                                                                                                dependency
                                                                                                                                                movement,
                                                                                                                                                performance
                                                                                                                                                impact,
                                                                                                                                                and
                                                                                                                                                stability
                                                                                                                                                shifts
                                                                                                                                                like
                                                                                                                                                moving
                                                                                                                                                planets
                                                                                                                                                in
                                                                                                                                                a
                                                                                                                                                solar
                                                                                                                                                system."
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        Equilibrium
                                                                                                                                                                        Score
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-emerald-400">
                                                                                                                                                                        92.4%
                                                                                                                                                                        Optimal
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* 🌟 WOW Interactive Solar System Canvas */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6">
                                                                                                <div className="flex items-center justify-between">
                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                <Globe2 className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                                                                                                                                                <h3 className="text-base font-bold text-white">
                                                                                                                                                                        Software
                                                                                                                                                                        Solar
                                                                                                                                                                        System
                                                                                                                                                                        Canvas
                                                                                                                                                </h3>
                                                                                                                        </div>
                                                                                                                        <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 font-mono">
                                                                                                                                                Orbital
                                                                                                                                                Mechanics
                                                                                                                                                Model
                                                                                                                        </span>
                                                                                                </div>

                                                                                                {/* Solar System Node Grid */}
                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                                                                                                                        {solarSystemNodes.map(
                                                                                                                                                (
                                                                                                                                                                        node
                                                                                                                                                ) => (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        node.id
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        handleSimulateDrag(
                                                                                                                                                                                                                                                node.id,
                                                                                                                                                                                                                                                node.id ===
                                                                                                                                                                                                                                                                        'payments_service'
                                                                                                                                                                                                                                                                        ? 600
                                                                                                                                                                                                                                                                        : 450
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`p-6 rounded-2xl border bg-slate-950 cursor-pointer transition-all hover:scale-105 ${
                                                                                                                                                                                                                        selectedNode ===
                                                                                                                                                                                                                        node.id
                                                                                                                                                                                                                                                ? `${node.color} shadow-2xl ring-2 ring-indigo-500/50`
                                                                                                                                                                                                                                                : 'border-slate-800 hover:border-slate-700'
                                                                                                                                                                                                }`}
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex items-center justify-between mb-3">
                                                                                                                                                                                                                        <span className="text-[10px] uppercase font-bold text-slate-400">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        node.type
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <Move className="w-4 h-4 text-indigo-400" />
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <h4 className="text-sm font-black text-white">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                node.name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                <div className="flex items-center gap-3 mt-3 text-xs font-bold">
                                                                                                                                                                                                                        <span className="text-amber-400">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        node.mass
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-cyan-400">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        node.gravity
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>

                                                                                                {/* Real-time Recalculation Output Panel */}
                                                                                                <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                                                                                                                                                                        <Zap className="w-4 h-4" />{' '}
                                                                                                                                                                        Orbital
                                                                                                                                                                        Drag
                                                                                                                                                                        Simulation
                                                                                                                                                                        Results
                                                                                                                                                                        (
                                                                                                                                                                        {
                                                                                                                                                                                                selectedNode
                                                                                                                                                                        }

                                                                                                                                                                        )
                                                                                                                                                </span>
                                                                                                                                                {isSimulating && (
                                                                                                                                                                        <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                                                                                                                                                )}
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                                                                                                                                                <div className="space-y-1">
                                                                                                                                                                        <div className="text-slate-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                🌌
                                                                                                                                                                                                Stress
                                                                                                                                                                                                Redistribution
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-200 font-medium leading-relaxed">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        simulationState.stress
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="space-y-1">
                                                                                                                                                                        <div className="text-slate-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                ⚡
                                                                                                                                                                                                Performance
                                                                                                                                                                                                &
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Shift
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-emerald-400 font-bold text-sm">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        simulationState.perf
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-cyan-400 font-bold text-sm">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        simulationState.debt
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="space-y-1">
                                                                                                                                                                        <div className="text-slate-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                🛡
                                                                                                                                                                                                Stability
                                                                                                                                                                                                Shift
                                                                                                                                                                                                Verdict
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs rounded-full mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        simulationState.verdict
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Real Enterprise Value Mental Model Banner */}
                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                                                                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                                                                        <Sparkles className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                        Real
                                                                                                                        Enterprise
                                                                                                                        Value:
                                                                                                                        The
                                                                                                                        New
                                                                                                                        Engineering
                                                                                                                        Leadership
                                                                                                                        Mental
                                                                                                                        Model
                                                                                                </h3>

                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                                                                                                                                                <div className="text-rose-400 font-bold uppercase text-[10px]">
                                                                                                                                                                        Traditional
                                                                                                                                                                        Static
                                                                                                                                                                        View:
                                                                                                                                                </div>
                                                                                                                                                <p className="text-slate-300 font-medium font-mono text-xs">
                                                                                                                                                                        "The
                                                                                                                                                                        Payments
                                                                                                                                                                        service
                                                                                                                                                                        has
                                                                                                                                                                        14
                                                                                                                                                                        downstream
                                                                                                                                                                        dependencies."
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-2">
                                                                                                                                                <div className="text-emerald-400 font-bold uppercase text-[10px]">
                                                                                                                                                                        CodeAtlas
                                                                                                                                                                        SPE
                                                                                                                                                                        Intuitive
                                                                                                                                                                        Mental
                                                                                                                                                                        Model:
                                                                                                                                                </div>
                                                                                                                                                <p className="text-emerald-300 font-bold text-xs">
                                                                                                                                                                        "The
                                                                                                                                                                        Payments
                                                                                                                                                                        service
                                                                                                                                                                        has
                                                                                                                                                                        high
                                                                                                                                                                        gravity,
                                                                                                                                                                        high
                                                                                                                                                                        pressure,
                                                                                                                                                                        and
                                                                                                                                                                        rising
                                                                                                                                                                        entropy,
                                                                                                                                                                        making
                                                                                                                                                                        it
                                                                                                                                                                        the
                                                                                                                                                                        most
                                                                                                                                                                        critical
                                                                                                                                                                        stabilization
                                                                                                                                                                        target."
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* 🏆 4-Point Architect Trust & Metric Validation Panel */}
                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                                                                                                <div className="flex items-center gap-2">
                                                                                                                        <Award className="w-5 h-5 text-amber-400" />
                                                                                                                        <h3 className="text-sm font-bold text-white">
                                                                                                                                                🏆
                                                                                                                                                4-Point
                                                                                                                                                Architect
                                                                                                                                                Validation
                                                                                                                                                Framework
                                                                                                                        </h3>
                                                                                                </div>

                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <div className="text-indigo-400 font-bold uppercase text-[10px]">
                                                                                                                                                                        1.
                                                                                                                                                                        Better
                                                                                                                                                                        Decision
                                                                                                                                                </div>
                                                                                                                                                <p className="text-slate-300">
                                                                                                                                                                        Pinpoints
                                                                                                                                                                        exact
                                                                                                                                                                        microservice
                                                                                                                                                                        stabilization
                                                                                                                                                                        targets.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <div className="text-cyan-400 font-bold uppercase text-[10px]">
                                                                                                                                                                        2.
                                                                                                                                                                        Measurable
                                                                                                                                                                        Metrics
                                                                                                                                                </div>
                                                                                                                                                <p className="text-slate-300">
                                                                                                                                                                        Backed
                                                                                                                                                                        by
                                                                                                                                                                        10
                                                                                                                                                                        AST
                                                                                                                                                                        &
                                                                                                                                                                        telemetry
                                                                                                                                                                        physical
                                                                                                                                                                        properties.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <div className="text-emerald-400 font-bold uppercase text-[10px]">
                                                                                                                                                                        3.
                                                                                                                                                                        Intuitive
                                                                                                                                                                        Visuals
                                                                                                                                                </div>
                                                                                                                                                <p className="text-slate-300">
                                                                                                                                                                        Solar-system
                                                                                                                                                                        orbital
                                                                                                                                                                        gravity
                                                                                                                                                                        layout.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                <div className="text-purple-400 font-bold uppercase text-[10px]">
                                                                                                                                                                        4.
                                                                                                                                                                        Staff
                                                                                                                                                                        Architect
                                                                                                                                                                        Trust
                                                                                                                                                </div>
                                                                                                                                                <p className="text-slate-300">
                                                                                                                                                                        Full
                                                                                                                                                                        traceability
                                                                                                                                                                        down
                                                                                                                                                                        to
                                                                                                                                                                        code
                                                                                                                                                                        symbols
                                                                                                                                                                        and
                                                                                                                                                                        commits.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
