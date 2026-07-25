'use client';

import React, { useState } from 'react';
import {
                        Activity,
                        Server,
                        Cpu,
                        Layers,
                        ShieldCheck,
                        AlertTriangle,
                        Play,
                        Zap,
                        Terminal,
                        Clock,
                        Database,
                        GitBranch,
                        RefreshCw,
                        BarChart2,
                        FileText,
                        CheckCircle2,
                        ArrowRight,
                        TrendingUp,
                        Sliders,
} from 'lucide-react';

export default function EngineeringRealityPage() {
                        const [simulating, setSimulating] = useState(false);
                        const [simResult, setSimResult] = useState<any>(null);

                        const realityHealth = {
                                                score: 93.5,
                                                status: 'SYNCHRONIZED_WITH_PRODUCTION',
                                                collectors: [
                                                                        {
                                                                                                name: 'GitHub Enterprise',
                                                                                                status: 'CONNECTED',
                                                                                                items: '14 Open PRs, 42 Commits 24h',
                                                                        },
                                                                        {
                                                                                                name: 'Kubernetes Cluster',
                                                                                                status: 'CONNECTED',
                                                                                                items: '12 Nodes, 84 Running Pods',
                                                                        },
                                                                        {
                                                                                                name: 'Datadog APM & Prometheus',
                                                                                                status: 'CONNECTED',
                                                                                                items: 'p95 Latency 42ms, 18.5K RPM',
                                                                        },
                                                                        {
                                                                                                name: 'Elasticsearch Logs',
                                                                                                status: 'CONNECTED',
                                                                                                items: '4.25M Logs Processed 24h',
                                                                        },
                                                                        {
                                                                                                name: 'ArgoCD & Jenkins Pipelines',
                                                                                                status: 'CONNECTED',
                                                                                                items: '0 Rollbacks (30 Days)',
                                                                        },
                                                ],
                        };

                        const runtimeTopologyNodes = [
                                                {
                                                                        name: 'auth-vault-pod-1',
                                                                        type: 'Pod',
                                                                        status: 'RUNNING',
                                                                        cpu: '24.5%',
                                                                        memory: '42.0%',
                                                                        restarts: 0,
                                                },
                                                {
                                                                        name: 'checkout-api-pod-1',
                                                                        type: 'Pod',
                                                                        status: 'RUNNING',
                                                                        cpu: '38.0%',
                                                                        memory: '54.2%',
                                                                        restarts: 0,
                                                },
                                                {
                                                                        name: 'postgres-primary-db',
                                                                        type: 'Database',
                                                                        status: 'RUNNING',
                                                                        cpu: '62.0%',
                                                                        memory: '78.4%',
                                                                        restarts: 0,
                                                },
                                                {
                                                                        name: 'redis-l2-cache-cluster',
                                                                        type: 'Cache',
                                                                        status: 'RUNNING',
                                                                        cpu: '18.4%',
                                                                        memory: '32.1%',
                                                                        restarts: 0,
                                                },
                        ];

                        const handleSimulateOutage = () => {
                                                setSimulating(true);
                                                setTimeout(() => {
                                                                        setSimResult({
                                                                                                title: 'Incident Simulation: Primary Auth Vault Node Outage',
                                                                                                blast_radius: [
                                                                                                                        'checkout-service (DEGRADED)',
                                                                                                                        'orders-router (DEGRADED)',
                                                                                                ],
                                                                                                recovery_time_mins: 12,
                                                                                                mitigation: 'Automated failover to Auth Replica Vault executed in 4.2 seconds.',
                                                                        });
                                                                        setSimulating(false);
                                                }, 400);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
                                                                        {/* Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-2.5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                                                                                                                                                                        <Activity className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                21
                                                                                                                                                                                                •
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Reality
                                                                                                                                                                                                Engine
                                                                                                                                                                                                (Digital
                                                                                                                                                                                                Twin
                                                                                                                                                                                                2.0)
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                                                                                                                                                                                                Real-Time
                                                                                                                                                                                                Software
                                                                                                                                                                                                Reality
                                                                                                                                                                                                Command
                                                                                                                                                                                                Center
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Continuously
                                                                                                                                                synchronizes
                                                                                                                                                source
                                                                                                                                                code,
                                                                                                                                                Kubernetes
                                                                                                                                                runtime
                                                                                                                                                states,
                                                                                                                                                Datadog
                                                                                                                                                APM
                                                                                                                                                metrics,
                                                                                                                                                logs,
                                                                                                                                                deployments,
                                                                                                                                                and
                                                                                                                                                production
                                                                                                                                                behavior
                                                                                                                                                into
                                                                                                                                                a
                                                                                                                                                360°
                                                                                                                                                Digital
                                                                                                                                                Twin.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* Real-time Status Card */}
                                                                                                <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                                                                                                                        <div className="text-center px-3 border-r border-slate-800">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Reality
                                                                                                                                                                        Health
                                                                                                                                                </span>
                                                                                                                                                <span className="text-2xl font-extrabold text-emerald-400">
                                                                                                                                                                        {
                                                                                                                                                                                                realityHealth.score
                                                                                                                                                                        }

                                                                                                                                                                        %
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <div className="text-center px-3">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Digital
                                                                                                                                                                        Twin
                                                                                                                                                                        Sync
                                                                                                                                                </span>
                                                                                                                                                <span className="text-sm font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded mt-1 inline-block">
                                                                                                                                                                        ●
                                                                                                                                                                        REALTIME
                                                                                                                                                                        SYNC
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Grid Row 1: Active Collectors */}
                                                                        <div className="mb-8">
                                                                                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                                                                                        <Server className="w-4 h-4 text-cyan-400" />{' '}
                                                                                                                        Active
                                                                                                                        Reality
                                                                                                                        Collectors
                                                                                                                        (5
                                                                                                                        Connected
                                                                                                                        Data
                                                                                                                        Streams)
                                                                                                </h2>
                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                                                                                        {realityHealth.collectors.map(
                                                                                                                                                (
                                                                                                                                                                        c,
                                                                                                                                                                        idx
                                                                                                                                                ) => (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                }
                                                                                                                                                                                                className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl"
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex items-center justify-between mb-2">
                                                                                                                                                                                                                        <span className="font-extrabold text-white text-sm">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        c.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        c.status
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <span className="text-xs text-slate-400 block">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                c.items
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>

                                                                        {/* Grid Row 2: Digital Twin Runtime Nodes */}
                                                                        <div className="mb-8">
                                                                                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                                                                                        <Cpu className="w-4 h-4 text-emerald-400" />{' '}
                                                                                                                        Digital
                                                                                                                        Twin
                                                                                                                        2.0
                                                                                                                        Topology
                                                                                                                        Nodes
                                                                                                </h2>
                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                                                                                        {runtimeTopologyNodes.map(
                                                                                                                                                (
                                                                                                                                                                        n,
                                                                                                                                                                        idx
                                                                                                                                                ) => (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                }
                                                                                                                                                                                                className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl"
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex items-center justify-between mb-3">
                                                                                                                                                                                                                        <span className="font-extrabold text-white text-sm">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        n.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        n.status
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="space-y-1.5 text-xs text-slate-300">
                                                                                                                                                                                                                        <div className="flex justify-between">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Type:
                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                <span className="font-bold text-cyan-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                n.type
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        CPU
                                                                                                                                                                                                                                                                        Utilization:
                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                n.cpu
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Memory
                                                                                                                                                                                                                                                                        Utilization:
                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                n.memory
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Restarts:
                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                <span className="font-bold text-emerald-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                n.restarts
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>

                                                                        {/* Grid Row 3: Reality Simulation Console */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                        <div>
                                                                                                                                                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <Zap className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                        Reality
                                                                                                                                                                        Simulation
                                                                                                                                                                        &
                                                                                                                                                                        Outage
                                                                                                                                                                        Predictor
                                                                                                                                                </h2>
                                                                                                                                                <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                        Simulate
                                                                                                                                                                        production
                                                                                                                                                                        outages
                                                                                                                                                                        and
                                                                                                                                                                        10x
                                                                                                                                                                        traffic
                                                                                                                                                                        spikes
                                                                                                                                                                        before
                                                                                                                                                                        deployment.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <button
                                                                                                                                                onClick={
                                                                                                                                                                        handleSimulateOutage
                                                                                                                                                }
                                                                                                                                                disabled={
                                                                                                                                                                        simulating
                                                                                                                                                }
                                                                                                                                                className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-600/30"
                                                                                                                        >
                                                                                                                                                {simulating ? (
                                                                                                                                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                                                                                                                ) : (
                                                                                                                                                                        <Play className="w-4 h-4" />
                                                                                                                                                )}{' '}
                                                                                                                                                Simulate
                                                                                                                                                Node
                                                                                                                                                Outage
                                                                                                                                                Blast
                                                                                                                                                Radius
                                                                                                                        </button>
                                                                                                </div>

                                                                                                {simResult && (
                                                                                                                        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                                                                                                                                                <h3 className="font-bold text-white text-base flex items-center gap-2">
                                                                                                                                                                        <AlertTriangle className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                simResult.title
                                                                                                                                                                        }
                                                                                                                                                </h3>
                                                                                                                                                <div className="text-xs text-slate-300 space-y-1">
                                                                                                                                                                        <div>
                                                                                                                                                                                                Affected
                                                                                                                                                                                                Blast
                                                                                                                                                                                                Radius:{' '}
                                                                                                                                                                                                <span className="font-bold text-rose-400">
                                                                                                                                                                                                                        {simResult.blast_radius.join(
                                                                                                                                                                                                                                                ' • '
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                Estimated
                                                                                                                                                                                                Recovery
                                                                                                                                                                                                Time:{' '}
                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                simResult.recovery_time_mins
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        minutes
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                Automated
                                                                                                                                                                                                Mitigation:{' '}
                                                                                                                                                                                                <span className="font-bold text-emerald-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                simResult.mitigation
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}
