'use client';

import React, { useState } from 'react';
import {
                        Globe,
                        Network,
                        Search,
                        Sparkles,
                        Layers,
                        Shield,
                        AlertTriangle,
                        Zap,
                        FileText,
                        Database,
                        Cpu,
                        Brain,
                        CheckCircle2,
                        ExternalLink,
                        Cloud,
                        Terminal,
                        Activity,
                        ArrowRight,
                        TrendingUp,
                        RefreshCw,
                        Box,
                        Building2,
                        Radio,
                        Server,
                        GitBranch,
                        Code2,
                        Users,
                        Sliders,
                        Compass,
                        CornerDownRight,
                        Workflow,
                        Lock,
                        PieChart,
                        Target,
                        Scissors,
                        GitFork,
                        Check,
                        ChevronDown,
                        ChevronRight,
                        Eye,
                        FolderGit2,
                        Layers3,
                        Copy,
                        Package,
                        Wrench,
                        GitPullRequest,
                        BarChart,
                        HardDrive,
                        DollarSign,
                        Briefcase,
                        ShieldCheck,
                        DatabaseZap,
                        CloudCog,
                        HeartPulse,
                        Bot,
                        Lightbulb,
                        Crosshair,
                        Flame,
                        Binary,
                        Maximize2,
                        ZoomIn,
                        ZoomOut,
                        Play,
                        RotateCcw,
                        Download,
                        Orbit,
                        Sparkle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function EnterpriseSoftwareKnowledgeGraphPage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'software_universe'
                                                | 'ai_graph_intel'
                                                | 'ent_intel'
                                                | 'repo_intel'
                                                | 'analytics'
                                                | 'hierarchy'
                                                | 'ai_discovery'
                                                | 'graph'
                                                | 'blast_radius'
                                                | 'radar'
                                                | 'ai_reasoning'
                        >('software_universe');

                        const [zoomLevel, setZoomLevel] = useState<number>(100);
                        const [activeSnapshot, setActiveSnapshot] =
                                                useState<string>('Q3 2026 Current State');
                        const [dashboardRole, setDashboardRole] = useState<
                                                'executive' | 'team' | 'engineering' | 'business'
                        >('executive');
                        const [showTrafficAnimation, setShowTrafficAnimation] =
                                                useState<boolean>(true);
                        const [showRiskHeatmap, setShowRiskHeatmap] = useState<boolean>(true);
                        const [selectedNode, setSelectedNode] = useState<any>(null);

                        // Software Universe 3D Galaxy Data
                        const universeData = {
                                                score: 99.5,
                                                center: 'Global Enterprise Software System',
                                                nodes_3d: [
                                                                        {
                                                                                                id: 'dom_auth',
                                                                                                name: 'Auth & Identity Domain',
                                                                                                entity_type: 'business_domain',
                                                                                                domain: 'Auth',
                                                                                                tier: 'tier_0',
                                                                                                x: 20,
                                                                                                y: 15,
                                                                                                z: 10,
                                                                                                criticality: 98,
                                                                        },
                                                                        {
                                                                                                id: 'dom_pay',
                                                                                                name: 'Payments Domain',
                                                                                                entity_type: 'business_domain',
                                                                                                domain: 'Payments',
                                                                                                tier: 'tier_0',
                                                                                                x: -30,
                                                                                                y: 40,
                                                                                                z: -15,
                                                                                                criticality: 99,
                                                                        },
                                                                        {
                                                                                                id: 'svc_auth',
                                                                                                name: 'auth-service',
                                                                                                entity_type: 'microservice',
                                                                                                domain: 'Auth',
                                                                                                tier: 'tier_0',
                                                                                                x: 45,
                                                                                                y: 30,
                                                                                                z: 5,
                                                                                                criticality: 99,
                                                                        },
                                                                        {
                                                                                                id: 'svc_payments',
                                                                                                name: 'payment-processor-svc',
                                                                                                entity_type: 'microservice',
                                                                                                domain: 'Payments',
                                                                                                tier: 'tier_0',
                                                                                                x: -50,
                                                                                                y: 60,
                                                                                                z: -20,
                                                                                                criticality: 99,
                                                                        },
                                                                        {
                                                                                                id: 'svc_orders',
                                                                                                name: 'order-fulfillment-svc',
                                                                                                entity_type: 'microservice',
                                                                                                domain: 'Orders',
                                                                                                tier: 'tier_1',
                                                                                                x: 10,
                                                                                                y: -45,
                                                                                                z: 25,
                                                                                                criticality: 95,
                                                                        },
                                                                        {
                                                                                                id: 'db_auth_pg',
                                                                                                name: 'auth-users-db (PostgreSQL)',
                                                                                                entity_type: 'database',
                                                                                                domain: 'Auth',
                                                                                                tier: 'tier_0',
                                                                                                x: 70,
                                                                                                y: 40,
                                                                                                z: -10,
                                                                                                criticality: 99,
                                                                        },
                                                                        {
                                                                                                id: 'inf_k8s_prod',
                                                                                                name: 'prod-us-east-1-k8s-cluster',
                                                                                                entity_type: 'infrastructure',
                                                                                                domain: 'Infra',
                                                                                                tier: 'tier_0',
                                                                                                x: 0,
                                                                                                y: 0,
                                                                                                z: 0,
                                                                                                criticality: 99,
                                                                        },
                                                ],
                                                traffic_streams: [
                                                                        {
                                                                                                source: 'order-fulfillment-svc',
                                                                                                target: 'payment-processor-svc',
                                                                                                rate: '450 req/sec',
                                                                                                color: '#10b981',
                                                                        },
                                                                        {
                                                                                                source: 'order-fulfillment-svc',
                                                                                                target: 'auth-service',
                                                                                                rate: '1,200 req/sec',
                                                                                                color: '#6366f1',
                                                                        },
                                                                        {
                                                                                                source: 'payment-processor-svc',
                                                                                                target: 'auth-users-db',
                                                                                                rate: '2,800 queries/sec',
                                                                                                color: '#f59e0b',
                                                                        },
                                                ],
                        };

                        return (
                                                <DashboardLayout>
                                                                        <div className="space-y-6 pb-12">
                                                                                                {/* Header Banner */}
                                                                                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
                                                                                                                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                                                                                                                                <Orbit className="w-96 h-96 text-indigo-400 animate-spin-slow" />
                                                                                                                        </div>
                                                                                                                        <div className="relative z-10 space-y-4">
                                                                                                                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                                                                                                                                        <div className="flex items-center space-x-3">
                                                                                                                                                                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-md">
                                                                                                                                                                                                                        🌌
                                                                                                                                                                                                                        Phase
                                                                                                                                                                                                                        37
                                                                                                                                                                                                                        —
                                                                                                                                                                                                                        Signature
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="flex items-center text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                                                                                                                                                                                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                                                                                                                                                                                                                        Software
                                                                                                                                                                                                                        Universe
                                                                                                                                                                                                                        3D
                                                                                                                                                                                                                        Galaxy
                                                                                                                                                                                                                        Active
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="flex items-center space-x-2">
                                                                                                                                                                                                <a
                                                                                                                                                                                                                        href="/api/v1/eskg/export-graphml"
                                                                                                                                                                                                                        download="enterprise_knowledge_graph.graphml"
                                                                                                                                                                                                                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105 active:scale-95"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <Download className="w-4 h-4 text-indigo-300" />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Export
                                                                                                                                                                                                                                                GraphML
                                                                                                                                                                                                                                                (XML)
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </a>

                                                                                                                                                                                                <button
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                alert(
                                                                                                                                                                                                                                                                        'Software Universe 3D Galaxy re-centered!'
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <RefreshCw className="w-4 h-4" />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Recenter
                                                                                                                                                                                                                                                Galaxy
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </button>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div>
                                                                                                                                                                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
                                                                                                                                                                                                Enterprise
                                                                                                                                                                                                Software
                                                                                                                                                                                                Knowledge
                                                                                                                                                                                                Graph
                                                                                                                                                                                                (ESKG)
                                                                                                                                                                        </h1>
                                                                                                                                                                        <p className="text-slate-300 mt-2 max-w-3xl text-sm md:text-base leading-relaxed">
                                                                                                                                                                                                🌌
                                                                                                                                                                                                Software
                                                                                                                                                                                                Universe
                                                                                                                                                                                                Explorer
                                                                                                                                                                                                (Features
                                                                                                                                                                                                81–100):
                                                                                                                                                                                                3D
                                                                                                                                                                                                Galaxy
                                                                                                                                                                                                Navigation,
                                                                                                                                                                                                Infinite
                                                                                                                                                                                                Canvas
                                                                                                                                                                                                Zoom,
                                                                                                                                                                                                Time-Travel
                                                                                                                                                                                                Snapshots,
                                                                                                                                                                                                Live
                                                                                                                                                                                                Traffic
                                                                                                                                                                                                Packet
                                                                                                                                                                                                Flow,
                                                                                                                                                                                                Risk
                                                                                                                                                                                                Heatmap
                                                                                                                                                                                                Overlays,
                                                                                                                                                                                                and
                                                                                                                                                                                                GraphML
                                                                                                                                                                                                Export.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Executive Metrics Bar */}
                                                                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                                                                                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 space-y-1 hover:border-indigo-500/40 transition-colors">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Software
                                                                                                                                                                                                Universe
                                                                                                                                                                                                Rating
                                                                                                                                                                        </span>
                                                                                                                                                                        <Sparkle className="w-4 h-4 text-amber-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-amber-400">
                                                                                                                                                                        {
                                                                                                                                                                                                universeData.score
                                                                                                                                                                        }
                                                                                                                                                                        /100
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-indigo-400">
                                                                                                                                                                        Signature
                                                                                                                                                                        Feature
                                                                                                                                                                        100
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 space-y-1 hover:border-emerald-500/40 transition-colors">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Live
                                                                                                                                                                                                Traffic
                                                                                                                                                                                                Stream
                                                                                                                                                                        </span>
                                                                                                                                                                        <Activity className="w-4 h-4 text-emerald-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-white">
                                                                                                                                                                        4.4k
                                                                                                                                                                        req/s
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-emerald-400">
                                                                                                                                                                        gRPC
                                                                                                                                                                        &
                                                                                                                                                                        mTLS
                                                                                                                                                                        Packets
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 space-y-1 hover:border-amber-500/40 transition-colors">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Time-Travel
                                                                                                                                                                                                Slider
                                                                                                                                                                        </span>
                                                                                                                                                                        <RotateCcw className="w-4 h-4 text-indigo-300" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-indigo-300">
                                                                                                                                                                        Q3
                                                                                                                                                                        2026
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                        History
                                                                                                                                                                        Snapshot
                                                                                                                                                                        Active
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 space-y-1 hover:border-indigo-500/40 transition-colors">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Zoom
                                                                                                                                                                                                Resolution
                                                                                                                                                                        </span>
                                                                                                                                                                        <ZoomIn className="w-4 h-4 text-indigo-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-white">
                                                                                                                                                                        {
                                                                                                                                                                                                zoomLevel
                                                                                                                                                                        }

                                                                                                                                                                        %
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-indigo-400">
                                                                                                                                                                        Infinite
                                                                                                                                                                        Level
                                                                                                                                                                        Presets
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 space-y-1 hover:border-indigo-500/40 transition-colors col-span-2 md:col-span-1">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Dashboard
                                                                                                                                                                                                Role
                                                                                                                                                                        </span>
                                                                                                                                                                        <Users className="w-4 h-4 text-indigo-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-white capitalize">
                                                                                                                                                                        {
                                                                                                                                                                                                dashboardRole
                                                                                                                                                                        }
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                        Features
                                                                                                                                                                        92–95
                                                                                                                                                                        Views
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* View Selection Tabs */}
                                                                                                <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'software_universe'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'software_universe'
                                                                                                                                                                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                                                                                                                                                                                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <Orbit className="w-4 h-4 text-indigo-300" />
                                                                                                                                                <span>
                                                                                                                                                                        🌌
                                                                                                                                                                        Software
                                                                                                                                                                        Universe
                                                                                                                                                                        Explorer
                                                                                                                                                                        (Features
                                                                                                                                                                        81–100)
                                                                                                                                                </span>
                                                                                                                        </button>

                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'ai_graph_intel'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'ai_graph_intel'
                                                                                                                                                                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                                                                                                                                                                                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <Bot className="w-4 h-4 text-indigo-300" />
                                                                                                                                                <span>
                                                                                                                                                                        🤖
                                                                                                                                                                        AI
                                                                                                                                                                        Graph
                                                                                                                                                                        Intelligence
                                                                                                                                                                        (Features
                                                                                                                                                                        61–80)
                                                                                                                                                </span>
                                                                                                                        </button>

                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'ent_intel'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'ent_intel'
                                                                                                                                                                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                                                                                                                                                                                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <Briefcase className="w-4 h-4 text-indigo-300" />
                                                                                                                                                <span>
                                                                                                                                                                        🏢
                                                                                                                                                                        Enterprise
                                                                                                                                                                        Intelligence
                                                                                                                                                                        (Features
                                                                                                                                                                        41–60)
                                                                                                                                                </span>
                                                                                                                        </button>

                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'repo_intel'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'repo_intel'
                                                                                                                                                                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                                                                                                                                                                                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <FolderGit2 className="w-4 h-4 text-indigo-300" />
                                                                                                                                                <span>
                                                                                                                                                                        🔍
                                                                                                                                                                        Repository
                                                                                                                                                                        Intelligence
                                                                                                                                                                        (Features
                                                                                                                                                                        21–40)
                                                                                                                                                </span>
                                                                                                                        </button>
                                                                                                </div>

                                                                                                {/* TAB: SOFTWARE UNIVERSE 3D GALAXY (FEATURES 81-100) */}
                                                                                                {activeTab ===
                                                                                                                        'software_universe' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                {/* Interactive Universe Canvas Controls Bar */}
                                                                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                                                                                                                                                                        <div className="flex items-center space-x-3 text-xs">
                                                                                                                                                                                                <span className="font-bold text-slate-300">
                                                                                                                                                                                                                        Time
                                                                                                                                                                                                                        Travel
                                                                                                                                                                                                                        Slider:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                {[
                                                                                                                                                                                                                        'Q1 2025 Initial Monolith',
                                                                                                                                                                                                                        'Q3 2025 Microservices Split',
                                                                                                                                                                                                                        'Q3 2026 Current State',
                                                                                                                                                                                                ].map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                snap,
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                setActiveSnapshot(
                                                                                                                                                                                                                                                                                                                        snap
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className={`px-3 py-1 rounded-lg transition-all ${
                                                                                                                                                                                                                                                                                                activeSnapshot ===
                                                                                                                                                                                                                                                                                                snap
                                                                                                                                                                                                                                                                                                                        ? 'bg-indigo-600 text-white font-bold'
                                                                                                                                                                                                                                                                                                                        : 'bg-slate-950 text-slate-400 hover:text-white'
                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                snap
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="flex items-center space-x-4 text-xs">
                                                                                                                                                                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                                                                                                                                                                                        <input
                                                                                                                                                                                                                                                type="checkbox"
                                                                                                                                                                                                                                                checked={
                                                                                                                                                                                                                                                                        showTrafficAnimation
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setShowTrafficAnimation(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .checked
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="rounded bg-slate-950 border-slate-800 text-indigo-600"
                                                                                                                                                                                                                        />
                                                                                                                                                                                                                        <span className="text-slate-300">
                                                                                                                                                                                                                                                Live
                                                                                                                                                                                                                                                Traffic
                                                                                                                                                                                                                                                Animation
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </label>

                                                                                                                                                                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                                                                                                                                                                                        <input
                                                                                                                                                                                                                                                type="checkbox"
                                                                                                                                                                                                                                                checked={
                                                                                                                                                                                                                                                                        showRiskHeatmap
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setShowRiskHeatmap(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .checked
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="rounded bg-slate-950 border-slate-800 text-amber-500"
                                                                                                                                                                                                                        />
                                                                                                                                                                                                                        <span className="text-slate-300">
                                                                                                                                                                                                                                                Risk
                                                                                                                                                                                                                                                Heatmap
                                                                                                                                                                                                                                                Overlay
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </label>

                                                                                                                                                                                                <div className="flex items-center space-x-1 border border-slate-800 rounded-lg p-1 bg-slate-950">
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        setZoomLevel(
                                                                                                                                                                                                                                                                                                Math.max(
                                                                                                                                                                                                                                                                                                                        25,
                                                                                                                                                                                                                                                                                                                        zoomLevel -
                                                                                                                                                                                                                                                                                                                                                25
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="p-1 hover:text-indigo-400"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <ZoomOut className="w-4 h-4" />
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                        <span className="px-2 font-bold text-white text-xs">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        zoomLevel
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        setZoomLevel(
                                                                                                                                                                                                                                                                                                Math.min(
                                                                                                                                                                                                                                                                                                                        300,
                                                                                                                                                                                                                                                                                                                        zoomLevel +
                                                                                                                                                                                                                                                                                                                                                25
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="p-1 hover:text-indigo-400"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <ZoomIn className="w-4 h-4" />
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* 3D Software Galaxy Viewport Canvas */}
                                                                                                                                                <div className="relative min-h-[520px] rounded-3xl bg-slate-950 border border-indigo-500/30 overflow-hidden shadow-2xl p-6 flex flex-col justify-between">
                                                                                                                                                                        {/* Starfield Background simulation */}
                                                                                                                                                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 opacity-80" />

                                                                                                                                                                        {/* Viewport Floating Info */}
                                                                                                                                                                        <div className="relative z-10 flex justify-between items-start">
                                                                                                                                                                                                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl space-y-1 text-xs max-w-sm">
                                                                                                                                                                                                                        <div className="font-extrabold text-white flex items-center space-x-2">
                                                                                                                                                                                                                                                <Orbit className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Galaxy
                                                                                                                                                                                                                                                                        Center:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                universeData.center
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-slate-400">
                                                                                                                                                                                                                                                Hierarchy
                                                                                                                                                                                                                                                Scope:{' '}
                                                                                                                                                                                                                                                <span className="text-indigo-300">
                                                                                                                                                                                                                                                                        Enterprise
                                                                                                                                                                                                                                                                        -&gt;
                                                                                                                                                                                                                                                                        Domain
                                                                                                                                                                                                                                                                        -&gt;
                                                                                                                                                                                                                                                                        Microservice
                                                                                                                                                                                                                                                                        -&gt;
                                                                                                                                                                                                                                                                        Package
                                                                                                                                                                                                                                                                        -&gt;
                                                                                                                                                                                                                                                                        Function
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                {/* Dashboard Role Selector */}
                                                                                                                                                                                                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl flex items-center space-x-1 text-xs">
                                                                                                                                                                                                                        {(
                                                                                                                                                                                                                                                [
                                                                                                                                                                                                                                                                        'executive',
                                                                                                                                                                                                                                                                        'team',
                                                                                                                                                                                                                                                                        'engineering',
                                                                                                                                                                                                                                                                        'business',
                                                                                                                                                                                                                                                ] as const
                                                                                                                                                                                                                        ).map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        r
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        r
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                                                                        setDashboardRole(
                                                                                                                                                                                                                                                                                                                                                r
                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                                                                                                                                                                                                                                                                                                                        dashboardRole ===
                                                                                                                                                                                                                                                                                                                        r
                                                                                                                                                                                                                                                                                                                                                ? 'bg-indigo-600 text-white font-bold'
                                                                                                                                                                                                                                                                                                                                                : 'text-slate-400 hover:text-white'
                                                                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        r
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Interactive 3D Nodes Display Canvas */}
                                                                                                                                                                        <div className="relative z-10 my-auto py-12 flex flex-wrap items-center justify-center gap-8">
                                                                                                                                                                                                {universeData.nodes_3d.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                node
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                node.id
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                setSelectedNode(
                                                                                                                                                                                                                                                                                                                        node
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className={`group relative p-4 rounded-2xl bg-slate-900/80 border transition-all transform hover:scale-110 cursor-pointer shadow-xl backdrop-blur-md ${
                                                                                                                                                                                                                                                                                                showRiskHeatmap &&
                                                                                                                                                                                                                                                                                                node.tier ===
                                                                                                                                                                                                                                                                                                                        'tier_0'
                                                                                                                                                                                                                                                                                                                        ? 'border-amber-500/60 shadow-amber-500/20'
                                                                                                                                                                                                                                                                                                                        : 'border-indigo-500/30 hover:border-indigo-400'
                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                transform: `scale(${zoomLevel / 100})`,
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="flex items-center space-x-2">
                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                        className={`w-3 h-3 rounded-full ${
                                                                                                                                                                                                                                                                                                                                                node.entity_type ===
                                                                                                                                                                                                                                                                                                                                                'database'
                                                                                                                                                                                                                                                                                                                                                                        ? 'bg-emerald-400'
                                                                                                                                                                                                                                                                                                                                                                        : node.entity_type ===
                                                                                                                                                                                                                                                                                                                                                                            'infrastructure'
                                                                                                                                                                                                                                                                                                                                                                          ? 'bg-indigo-400'
                                                                                                                                                                                                                                                                                                                                                                          : 'bg-indigo-300'
                                                                                                                                                                                                                                                                                                                        } animate-pulse`}
                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                <span className="font-bold text-xs text-white truncate max-w-[160px]">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                node.name
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                                                                        <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                node.entity_type
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                                                                                                                        Crit:{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                node.criticality
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                                                                        {showRiskHeatmap &&
                                                                                                                                                                                                                                                                                                node.tier ===
                                                                                                                                                                                                                                                                                                                        'tier_0' && (
                                                                                                                                                                                                                                                                                                                        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-500/50">
                                                                                                                                                                                                                                                                                                                                                SPOF
                                                                                                                                                                                                                                                                                                                                                OVERLAY
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Traffic Flow Animation Bar */}
                                                                                                                                                                        {showTrafficAnimation && (
                                                                                                                                                                                                <div className="relative z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                                                                                                                                                                                                                        <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                                                                                                                                                                                                                                                <Activity className="w-4 h-4 animate-pulse" />
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Real-Time
                                                                                                                                                                                                                                                                        Traffic
                                                                                                                                                                                                                                                                        Stream:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </span>

                                                                                                                                                                                                                        <div className="flex flex-wrap items-center gap-4">
                                                                                                                                                                                                                                                {universeData.traffic_streams.map(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                st,
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                        className="flex items-center space-x-2 text-[11px]"
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        <span className="text-slate-400">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        st.source
                                                                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                                                                -&gt;{' '}
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        st.target
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                        <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        st.rate
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* OTHER TABS RENDER */}
                                                                                                {activeTab ===
                                                                                                                        'ai_graph_intel' && (
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                                                                                                                                                <h3 className="text-base font-bold text-white mb-2">
                                                                                                                                                                        AI
                                                                                                                                                                        Graph
                                                                                                                                                                        Intelligence
                                                                                                                                                                        (Features
                                                                                                                                                                        61–80)
                                                                                                                                                </h3>
                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                        AI
                                                                                                                                                                        Root
                                                                                                                                                                        Cause
                                                                                                                                                                        Tracing,
                                                                                                                                                                        Modernization
                                                                                                                                                                        Roadmap,
                                                                                                                                                                        and
                                                                                                                                                                        Tech
                                                                                                                                                                        Replacement
                                                                                                                                                                        Engine
                                                                                                                                                                        active.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {activeTab ===
                                                                                                                        'ent_intel' && (
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                                                                                                                                                <h3 className="text-base font-bold text-white mb-2">
                                                                                                                                                                        Enterprise
                                                                                                                                                                        Intelligence
                                                                                                                                                                        (Features
                                                                                                                                                                        41–60)
                                                                                                                                                </h3>
                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                        DDD
                                                                                                                                                                        Bounded
                                                                                                                                                                        Contexts,
                                                                                                                                                                        Customer
                                                                                                                                                                        Journey
                                                                                                                                                                        Mapping,
                                                                                                                                                                        Engineering
                                                                                                                                                                        Investment,
                                                                                                                                                                        and
                                                                                                                                                                        Compliance
                                                                                                                                                                        Graphs
                                                                                                                                                                        active.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {activeTab ===
                                                                                                                        'repo_intel' && (
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                                                                                                                                                <h3 className="text-base font-bold text-white mb-2">
                                                                                                                                                                        Repository
                                                                                                                                                                        Intelligence
                                                                                                                                                                        (Features
                                                                                                                                                                        21–40)
                                                                                                                                                </h3>
                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                        Cross-repo
                                                                                                                                                                        API
                                                                                                                                                                        discovery,
                                                                                                                                                                        shared
                                                                                                                                                                        code
                                                                                                                                                                        blocks,
                                                                                                                                                                        duplicate
                                                                                                                                                                        libraries,
                                                                                                                                                                        and
                                                                                                                                                                        deployment
                                                                                                                                                                        sequences
                                                                                                                                                                        active.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </DashboardLayout>
                        );
}
