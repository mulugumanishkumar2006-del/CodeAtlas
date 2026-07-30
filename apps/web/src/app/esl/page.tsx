'use client';

import React, { useState } from 'react';
import {
                        FlaskConical,
                        Play,
                        RotateCcw,
                        CheckCircle2,
                        AlertTriangle,
                        Zap,
                        Shield,
                        Database,
                        Server,
                        Activity,
                        Cpu,
                        TrendingUp,
                        DollarSign,
                        Layers,
                        ArrowRight,
                        Sliders,
                        FileText,
                        Building,
                        Flame,
                        Globe,
                        Radio,
                        Lock,
                        ShoppingBag,
                        Users,
                        ShieldAlert,
                        ArrowUpRight,
                        Box,
                        Terminal,
                        Award,
                        BarChart3,
                        SlidersHorizontal,
                        Compass,
                        MessageSquare,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function EngineeringSimulationLabPage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'digi_lab'
                                                | 'debate'
                                                | 'monte_carlo'
                                                | 'black_friday'
                                                | 'db_migration'
                                                | 'dependency'
                                                | 'infrastructure'
                                                | 'security'
                                                | 'team'
                        >('digi_lab');

                        // Digital Lab State
                        const [scenario, setScenario] = useState<string>(
                                                'Scale to 50 Million Users'
                        );
                        const [platform, setPlatform] = useState<string>('AWS');
                        const [database, setDatabase] = useState<string>('CockroachDB');
                        const [cache, setCache] = useState<string>('Redis Cluster');
                        const [messaging, setMessaging] = useState<string>('Kafka');
                        const [deployment, setDeployment] = useState<string>('Kubernetes');

                        const [isSimulating, setIsSimulating] = useState<boolean>(false);
                        const [simCompleted, setSimCompleted] = useState<boolean>(true);

                        // Simulation Results
                        const [archScore, setArchScore] = useState<number>(91);
                        const [monthlyCost, setMonthlyCost] = useState<number>(87000);
                        const [expectedLatency, setExpectedLatency] = useState<number>(72);
                        const [riskLevel, setRiskLevel] = useState<string>('Medium');
                        const [confidencePct, setConfidencePct] = useState<number>(89);

                        const handleRunDigitalLab = () => {
                                                setIsSimulating(true);
                                                setTimeout(() => {
                                                                        setIsSimulating(false);
                                                                        setSimCompleted(true);
                                                }, 1000);
                        };

                        return (
                                                <DashboardLayout>
                                                                        <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-6 space-y-6">
                                                                                                {/* Top Title Banner */}
                                                                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/60 via-slate-900 to-purple-950/60 p-6 rounded-2xl border border-blue-800/40 shadow-2xl backdrop-blur-md">
                                                                                                                        <div className="space-y-1">
                                                                                                                                                <div className="flex items-center space-x-3">
                                                                                                                                                                        <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl">
                                                                                                                                                                                                <FlaskConical className="w-7 h-7 text-blue-400 animate-pulse" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                                                                                                                        <h1 className="text-2xl font-bold tracking-tight text-white">
                                                                                                                                                                                                                                                Engineering
                                                                                                                                                                                                                                                Simulation
                                                                                                                                                                                                                                                Laboratory
                                                                                                                                                                                                                                                (ESL)
                                                                                                                                                                                                                        </h1>
                                                                                                                                                                                                                        <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-full">
                                                                                                                                                                                                                                                Phase
                                                                                                                                                                                                                                                32
                                                                                                                                                                                                                                                —
                                                                                                                                                                                                                                                60
                                                                                                                                                                                                                                                Features
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-sm text-gray-400">
                                                                                                                                                                                                                        Digital
                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                        Laboratory
                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                        Command
                                                                                                                                                                                                                        Center:
                                                                                                                                                                                                                        Experiment
                                                                                                                                                                                                                        Safely
                                                                                                                                                                                                                        with
                                                                                                                                                                                                                        50M
                                                                                                                                                                                                                        Users,
                                                                                                                                                                                                                        CockroachDB,
                                                                                                                                                                                                                        Kafka
                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                        AWS
                                                                                                                                                                                                                        Before
                                                                                                                                                                                                                        Writing
                                                                                                                                                                                                                        Code
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center space-x-3">
                                                                                                                                                <button
                                                                                                                                                                        onClick={
                                                                                                                                                                                                handleRunDigitalLab
                                                                                                                                                                        }
                                                                                                                                                                        disabled={
                                                                                                                                                                                                isSimulating
                                                                                                                                                                        }
                                                                                                                                                                        className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                                                                                                                                >
                                                                                                                                                                        {isSimulating ? (
                                                                                                                                                                                                <RotateCcw className="w-4 h-4 animate-spin" />
                                                                                                                                                                        ) : (
                                                                                                                                                                                                <Play className="w-4 h-4" />
                                                                                                                                                                        )}
                                                                                                                                                                        <span>
                                                                                                                                                                                                {isSimulating
                                                                                                                                                                                                                        ? 'Computing Digital Simulation...'
                                                                                                                                                                                                                        : 'Run Simulation'}
                                                                                                                                                                        </span>
                                                                                                                                                </button>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Top Key Metric Cards */}
                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                Score
                                                                                                                                                                        </span>
                                                                                                                                                                        <Award className="w-5 h-5 text-emerald-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-emerald-400">
                                                                                                                                                                        {
                                                                                                                                                                                                archScore
                                                                                                                                                                        }

                                                                                                                                                                        %
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-emerald-400 font-medium mt-1">
                                                                                                                                                                        Optimal
                                                                                                                                                                        Scalability
                                                                                                                                                                        &amp;
                                                                                                                                                                        Isolation
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Estimated
                                                                                                                                                                                                Monthly
                                                                                                                                                                                                Cost
                                                                                                                                                                        </span>
                                                                                                                                                                        <DollarSign className="w-5 h-5 text-blue-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-blue-300">
                                                                                                                                                                        $
                                                                                                                                                                        {monthlyCost.toLocaleString()}{' '}
                                                                                                                                                                        <span className="text-xs text-gray-400 font-normal">
                                                                                                                                                                                                /
                                                                                                                                                                                                mo
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-blue-400 font-medium mt-1">
                                                                                                                                                                        Zero
                                                                                                                                                                        Waste
                                                                                                                                                                        Provisioning
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Expected
                                                                                                                                                                                                Latency
                                                                                                                                                                        </span>
                                                                                                                                                                        <Zap className="w-5 h-5 text-purple-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-purple-300">
                                                                                                                                                                        {
                                                                                                                                                                                                expectedLatency
                                                                                                                                                                        }{' '}
                                                                                                                                                                        <span className="text-xs text-gray-400 font-normal">
                                                                                                                                                                                                ms
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-purple-400 font-medium mt-1">
                                                                                                                                                                        p95
                                                                                                                                                                        Latency
                                                                                                                                                                        Target
                                                                                                                                                                        Met
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Risk
                                                                                                                                                                                                &amp;
                                                                                                                                                                                                Confidence
                                                                                                                                                                        </span>
                                                                                                                                                                        <Shield className="w-5 h-5 text-amber-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-amber-300">
                                                                                                                                                                        {
                                                                                                                                                                                                riskLevel
                                                                                                                                                                        }{' '}
                                                                                                                                                                        <span className="text-sm font-normal text-gray-400">
                                                                                                                                                                                                (
                                                                                                                                                                                                {
                                                                                                                                                                                                                        confidencePct
                                                                                                                                                                                                }

                                                                                                                                                                                                %
                                                                                                                                                                                                Conf)
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-amber-400 font-medium mt-1">
                                                                                                                                                                        Monte
                                                                                                                                                                        Carlo
                                                                                                                                                                        10,000
                                                                                                                                                                        Runs
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Navigation Tabs */}
                                                                                                <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1">
                                                                                                                        {[
                                                                                                                                                {
                                                                                                                                                                        id: 'digi_lab',
                                                                                                                                                                        label: '🌟 Digital Engineering Lab',
                                                                                                                                                                        icon: Award,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'debate',
                                                                                                                                                                        label: '🗣️ AI Architecture Debate',
                                                                                                                                                                        icon: MessageSquare,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'monte_carlo',
                                                                                                                                                                        label: '🎲 Monte Carlo Risk',
                                                                                                                                                                        icon: BarChart3,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'black_friday',
                                                                                                                                                                        label: '🛍️ Black Friday Surge',
                                                                                                                                                                        icon: ShoppingBag,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'db_migration',
                                                                                                                                                                        label: '🗄️ DB Migration',
                                                                                                                                                                        icon: Database,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'dependency',
                                                                                                                                                                        label: '📦 Dependency Upgrade',
                                                                                                                                                                        icon: Zap,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'infrastructure',
                                                                                                                                                                        label: '⚡ Infra Stack',
                                                                                                                                                                        icon: Server,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'security',
                                                                                                                                                                        label: '🛡️ Security Attack',
                                                                                                                                                                        icon: ShieldAlert,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'team',
                                                                                                                                                                        label: '👥 Team Growth',
                                                                                                                                                                        icon: Users,
                                                                                                                                                },
                                                                                                                        ].map(
                                                                                                                                                (
                                                                                                                                                                        tab
                                                                                                                                                ) => (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        tab.id
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                                                                tab.id as any
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                                                                                                                                                                                                                        activeTab ===
                                                                                                                                                                                                                        tab.id
                                                                                                                                                                                                                                                ? 'border-blue-500 text-blue-300 bg-slate-900/90'
                                                                                                                                                                                                                                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-slate-900/40'
                                                                                                                                                                                                }`}
                                                                                                                                                                        >
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                tab.label
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </button>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>

                                                                                                {/* Tab 0: Signature Digital Engineering Laboratory */}
                                                                                                {activeTab ===
                                                                                                                        'digi_lab' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                                                                                                                                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                                                                                                                                                                                                                                <Award className="w-6 h-6 text-amber-400" />
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Digital
                                                                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                                                                        Laboratory
                                                                                                                                                                                                                                                                        Command
                                                                                                                                                                                                                                                                        Center
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </h2>
                                                                                                                                                                                                                        <p className="text-xs text-gray-400">
                                                                                                                                                                                                                                                Configure
                                                                                                                                                                                                                                                tech
                                                                                                                                                                                                                                                stack
                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                target
                                                                                                                                                                                                                                                scenario
                                                                                                                                                                                                                                                —
                                                                                                                                                                                                                                                Zero
                                                                                                                                                                                                                                                code
                                                                                                                                                                                                                                                changed,
                                                                                                                                                                                                                                                Zero
                                                                                                                                                                                                                                                cloud
                                                                                                                                                                                                                                                resources
                                                                                                                                                                                                                                                deployed.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-bold">
                                                                                                                                                                                                                        SIMULATED
                                                                                                                                                                                                                        WITHOUT
                                                                                                                                                                                                                        CLOUD
                                                                                                                                                                                                                        COSTS
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Scenario Configuration Controls */}
                                                                                                                                                                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <label className="text-gray-500 block mb-1 font-semibold">
                                                                                                                                                                                                                                                Scenario
                                                                                                                                                                                                                        </label>
                                                                                                                                                                                                                        <select
                                                                                                                                                                                                                                                value={
                                                                                                                                                                                                                                                                        scenario
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setScenario(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="w-full bg-slate-900 text-white font-bold p-2 rounded-lg border border-slate-800"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <option value="Scale to 50 Million Users">
                                                                                                                                                                                                                                                                        Scale
                                                                                                                                                                                                                                                                        to
                                                                                                                                                                                                                                                                        50M
                                                                                                                                                                                                                                                                        Users
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="Scale to 100 Million Users">
                                                                                                                                                                                                                                                                        Scale
                                                                                                                                                                                                                                                                        to
                                                                                                                                                                                                                                                                        100M
                                                                                                                                                                                                                                                                        Users
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="Global Active-Active Failover">
                                                                                                                                                                                                                                                                        Global
                                                                                                                                                                                                                                                                        Failover
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                        </select>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <label className="text-gray-500 block mb-1 font-semibold">
                                                                                                                                                                                                                                                Platform
                                                                                                                                                                                                                        </label>
                                                                                                                                                                                                                        <select
                                                                                                                                                                                                                                                value={
                                                                                                                                                                                                                                                                        platform
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setPlatform(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="w-full bg-slate-900 text-blue-400 font-bold p-2 rounded-lg border border-slate-800"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <option value="AWS">
                                                                                                                                                                                                                                                                        AWS
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="Azure">
                                                                                                                                                                                                                                                                        Azure
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="Google Cloud">
                                                                                                                                                                                                                                                                        GCP
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="Multi-Cloud">
                                                                                                                                                                                                                                                                        Multi-Cloud
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                        </select>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <label className="text-gray-500 block mb-1 font-semibold">
                                                                                                                                                                                                                                                Database
                                                                                                                                                                                                                        </label>
                                                                                                                                                                                                                        <select
                                                                                                                                                                                                                                                value={
                                                                                                                                                                                                                                                                        database
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setDatabase(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="w-full bg-slate-900 text-emerald-400 font-bold p-2 rounded-lg border border-slate-800"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <option value="CockroachDB">
                                                                                                                                                                                                                                                                        CockroachDB
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="PostgreSQL">
                                                                                                                                                                                                                                                                        PostgreSQL
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="DynamoDB">
                                                                                                                                                                                                                                                                        DynamoDB
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                        </select>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <label className="text-gray-500 block mb-1 font-semibold">
                                                                                                                                                                                                                                                Cache
                                                                                                                                                                                                                        </label>
                                                                                                                                                                                                                        <select
                                                                                                                                                                                                                                                value={
                                                                                                                                                                                                                                                                        cache
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setCache(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="w-full bg-slate-900 text-purple-300 font-bold p-2 rounded-lg border border-slate-800"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <option value="Redis Cluster">
                                                                                                                                                                                                                                                                        Redis
                                                                                                                                                                                                                                                                        Cluster
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="Memcached">
                                                                                                                                                                                                                                                                        Memcached
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                        </select>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <label className="text-gray-500 block mb-1 font-semibold">
                                                                                                                                                                                                                                                Messaging
                                                                                                                                                                                                                        </label>
                                                                                                                                                                                                                        <select
                                                                                                                                                                                                                                                value={
                                                                                                                                                                                                                                                                        messaging
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setMessaging(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="w-full bg-slate-900 text-indigo-300 font-bold p-2 rounded-lg border border-slate-800"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <option value="Kafka">
                                                                                                                                                                                                                                                                        Kafka
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="RabbitMQ">
                                                                                                                                                                                                                                                                        RabbitMQ
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="AWS SQS">
                                                                                                                                                                                                                                                                        AWS
                                                                                                                                                                                                                                                                        SQS
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                        </select>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <label className="text-gray-500 block mb-1 font-semibold">
                                                                                                                                                                                                                                                Deployment
                                                                                                                                                                                                                        </label>
                                                                                                                                                                                                                        <select
                                                                                                                                                                                                                                                value={
                                                                                                                                                                                                                                                                        deployment
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setDeployment(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="w-full bg-slate-900 text-amber-300 font-bold p-2 rounded-lg border border-slate-800"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <option value="Kubernetes">
                                                                                                                                                                                                                                                                        Kubernetes
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="ECS">
                                                                                                                                                                                                                                                                        AWS
                                                                                                                                                                                                                                                                        ECS
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                                                <option value="Serverless">
                                                                                                                                                                                                                                                                        Serverless
                                                                                                                                                                                                                                                </option>
                                                                                                                                                                                                                        </select>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Recommended Changes List */}
                                                                                                                                                                        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                                                                                                                                                                                                <div className="flex justify-between items-center text-xs">
                                                                                                                                                                                                                        <span className="font-bold text-white uppercase tracking-wider">
                                                                                                                                                                                                                                                AI
                                                                                                                                                                                                                                                Recommended
                                                                                                                                                                                                                                                Architecture
                                                                                                                                                                                                                                                Changes:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                                                89%
                                                                                                                                                                                                                                                Confidence
                                                                                                                                                                                                                                                Score
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                                                                                                                                                                                                        {[
                                                                                                                                                                                                                                                '• Split Checkout Service into standalone microservice',
                                                                                                                                                                                                                                                '• Introduce Read Replicas across 3 AWS Availability Zones',
                                                                                                                                                                                                                                                '• Enable Multi-region Active-Active Deployment',
                                                                                                                                                                                                                                                '• Add Circuit Breakers to payment gateway integration points',
                                                                                                                                                                                                                                                '• Increase Queue Partitions to 32 for parallel ingestion',
                                                                                                                                                                                                                        ].map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        change,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center space-x-2 text-gray-200"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                change
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* Tab 1: AI Architecture Debate */}
                                                                                                {activeTab ===
                                                                                                                        'debate' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                                                                                                                                                                                <MessageSquare className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        41:
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Architecture
                                                                                                                                                                                                                        Debate
                                                                                                                                                                                                                        Panel
                                                                                                                                                                                                </span>
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-xs text-gray-400">
                                                                                                                                                                                                Virtual
                                                                                                                                                                                                CTO
                                                                                                                                                                                                &amp;
                                                                                                                                                                                                Principal
                                                                                                                                                                                                Infrastructure
                                                                                                                                                                                                Architect
                                                                                                                                                                                                debate
                                                                                                                                                                                                architectural
                                                                                                                                                                                                trade-offs
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="space-y-3 text-xs">
                                                                                                                                                                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                                                                                                                                                                                                <div className="font-bold text-purple-300">
                                                                                                                                                                                                                        Principal
                                                                                                                                                                                                                        Infrastructure
                                                                                                                                                                                                                        AI:
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-gray-300">
                                                                                                                                                                                                                        &quot;CockroachDB
                                                                                                                                                                                                                        provides
                                                                                                                                                                                                                        multi-region
                                                                                                                                                                                                                        active-active
                                                                                                                                                                                                                        serializable
                                                                                                                                                                                                                        isolation,
                                                                                                                                                                                                                        preventing
                                                                                                                                                                                                                        data
                                                                                                                                                                                                                        loss
                                                                                                                                                                                                                        during
                                                                                                                                                                                                                        regional
                                                                                                                                                                                                                        outages.&quot;
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                                                                                                                                                                                                <div className="font-bold text-indigo-300">
                                                                                                                                                                                                                        Lead
                                                                                                                                                                                                                        Cloud
                                                                                                                                                                                                                        Cost
                                                                                                                                                                                                                        AI:
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-gray-300">
                                                                                                                                                                                                                        &quot;Aurora
                                                                                                                                                                                                                        PostgreSQL
                                                                                                                                                                                                                        offers
                                                                                                                                                                                                                        lower
                                                                                                                                                                                                                        latency
                                                                                                                                                                                                                        (45ms
                                                                                                                                                                                                                        vs
                                                                                                                                                                                                                        72ms)
                                                                                                                                                                                                                        for
                                                                                                                                                                                                                        single-region
                                                                                                                                                                                                                        read-heavy
                                                                                                                                                                                                                        workloads
                                                                                                                                                                                                                        at
                                                                                                                                                                                                                        35%
                                                                                                                                                                                                                        lower
                                                                                                                                                                                                                        cost.&quot;
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* Tab 2: Monte Carlo Risk */}
                                                                                                {activeTab ===
                                                                                                                        'monte_carlo' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                                                                                                                                                                                <BarChart3 className="w-5 h-5 text-emerald-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        45:
                                                                                                                                                                                                                        Monte
                                                                                                                                                                                                                        Carlo
                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                        Estimation
                                                                                                                                                                                                                        (10,000
                                                                                                                                                                                                                        Iterations)
                                                                                                                                                                                                </span>
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-xs text-gray-400">
                                                                                                                                                                                                P90
                                                                                                                                                                                                cost
                                                                                                                                                                                                bounds,
                                                                                                                                                                                                P95
                                                                                                                                                                                                latency
                                                                                                                                                                                                distributions,
                                                                                                                                                                                                and
                                                                                                                                                                                                confidence
                                                                                                                                                                                                intervals
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                                                                                                                                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                <div className="text-gray-400">
                                                                                                                                                                                                                        P90
                                                                                                                                                                                                                        Monthly
                                                                                                                                                                                                                        Cost
                                                                                                                                                                                                                        Bound
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-xl font-bold text-emerald-400">
                                                                                                                                                                                                                        $92,500
                                                                                                                                                                                                                        USD
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                <div className="text-gray-400">
                                                                                                                                                                                                                        P95
                                                                                                                                                                                                                        Latency
                                                                                                                                                                                                                        Bound
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-xl font-bold text-indigo-300">
                                                                                                                                                                                                                        84
                                                                                                                                                                                                                        ms
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                <div className="text-gray-400">
                                                                                                                                                                                                                        P99
                                                                                                                                                                                                                        Outage
                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-xl font-bold text-purple-300">
                                                                                                                                                                                                                        1.2%
                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                        Ratio
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </DashboardLayout>
                        );
}
