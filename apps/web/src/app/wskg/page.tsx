'use client';

import React, { useState } from 'react';
import {
                        Globe,
                        Network,
                        Search,
                        Sparkles,
                        Layers,
                        Package,
                        Shield,
                        Zap,
                        TestTube,
                        FileText,
                        Database,
                        Cpu,
                        Brain,
                        Orbit,
                        Dna,
                        Share2,
                        ChevronRight,
                        Eye,
                        CheckCircle2,
                        XCircle,
                        ExternalLink,
                        BookOpen,
                        Cloud,
                        Terminal,
                        Activity,
                        Sliders,
                        Compass,
                        ArrowRight,
                        TrendingUp,
                        RotateCcw,
                        GitFork,
                        SlidersHorizontal,
                        Check,
                        Building,
                        BarChart3,
                        RefreshCw,
                        Scale,
                        Bot,
                        Box,
                        GraduationCap,
                        FileCode,
                        ZoomIn,
                        ZoomOut,
                        MapPin,
                        Radio,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function WorldSoftwareKnowledgeGraphPage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'atlas'
                                                | 'graph'
                                                | 'internet'
                                                | 'semantic'
                                                | 'encyclopedia'
                                                | 'migration'
                                                | 'comparison'
                                                | 'aimodels'
                                                | 'casestudies'
                        >('atlas');
                        const [atlasZoomLevel, setAtlasZoomLevel] = useState<string>('earth');
                        const [selectedAtlasNode, setSelectedAtlasNode] = useState<string>('Earth');
                        const [semanticQuery, setSemanticQuery] = useState<string>(
                                                'FastAPI Clean Architecture'
                        );

                        // Signature Feature: World Software Atlas Levels Mock
                        const atlasLevels = [
                                                {
                                                                        level: 'earth',
                                                                        name: 'Earth (Software World)',
                                                                        desc: '142,000,000 global repositories & frameworks',
                                                                        count: '142M Repos',
                                                },
                                                {
                                                                        level: 'domain',
                                                                        name: 'Domain: Backend Systems',
                                                                        desc: 'Server architecture, microservices & databases',
                                                                        count: '48M Services',
                                                },
                                                {
                                                                        level: 'language',
                                                                        name: 'Language: Python Ecosystem',
                                                                        desc: 'FastAPI, Pydantic, SQLAlchemy, PyTorch',
                                                                        count: '12M Packages',
                                                },
                                                {
                                                                        level: 'framework',
                                                                        name: 'Framework: FastAPI',
                                                                        desc: 'High-performance ASGI Web Framework',
                                                                        count: '6.4k Starred Repos',
                                                },
                                                {
                                                                        level: 'repository',
                                                                        name: 'Repository: CodeAtlas',
                                                                        desc: 'Autonomous Software Evolution & Knowledge Graph',
                                                                        count: 'Current Active Workspace',
                                                },
                                                {
                                                                        level: 'symbol',
                                                                        name: 'Symbol: wskg_engine.py',
                                                                        desc: 'WorldSoftwareKnowledgeGraphEngine class method',
                                                                        count: 'Function Scope',
                                                },
                        ];

                        // Feature 56: Engineering Internet Dashboard Mock
                        const internetStats = {
                                                pulse: 'ONLINE — 1.42M Connected Software Entities',
                                                active_repos: '142,000,000+',
                                                framework_adoption: [
                                                                        {
                                                                                                name: 'FastAPI',
                                                                                                rate: 42.8,
                                                                                                color: 'bg-emerald-500',
                                                                        },
                                                                        {
                                                                                                name: 'Next.js',
                                                                                                rate: 38.5,
                                                                                                color: 'bg-indigo-500',
                                                                        },
                                                                        {
                                                                                                name: 'Django',
                                                                                                rate: 18.7,
                                                                                                color: 'bg-amber-500',
                                                                        },
                                                ],
                        };

                        return (
                                                <DashboardLayout>
                                                                        <div className="space-y-6 pb-12">
                                                                                                {/* Top Header Banner */}
                                                                                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/90 to-purple-950 p-6 md:p-8 border border-indigo-500/20 shadow-2xl">
                                                                                                                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                                                                                                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                                                                                                                                <div>
                                                                                                                                                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                                                                                                                                                                                                <Globe className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                                                                                                                                                                                                🌍
                                                                                                                                                                                                Phase
                                                                                                                                                                                                30
                                                                                                                                                                                                Signature
                                                                                                                                                                                                Feature
                                                                                                                                                                                                —
                                                                                                                                                                                                World
                                                                                                                                                                                                Software
                                                                                                                                                                                                Atlas
                                                                                                                                                                                                Complete
                                                                                                                                                                                                ⭐⭐⭐⭐⭐
                                                                                                                                                                        </div>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                                                                                                                                                                                World
                                                                                                                                                                                                Software
                                                                                                                                                                                                Knowledge
                                                                                                                                                                                                Graph
                                                                                                                                                                                                (WSKG)
                                                                                                                                                                        </h1>
                                                                                                                                                                        <p className="mt-2 text-base text-slate-300 max-w-2xl">
                                                                                                                                                                                                Don't
                                                                                                                                                                                                start
                                                                                                                                                                                                with
                                                                                                                                                                                                your
                                                                                                                                                                                                repository.
                                                                                                                                                                                                Start
                                                                                                                                                                                                with
                                                                                                                                                                                                the
                                                                                                                                                                                                world
                                                                                                                                                                                                of
                                                                                                                                                                                                software.
                                                                                                                                                                                                Zoom
                                                                                                                                                                                                smoothly
                                                                                                                                                                                                from
                                                                                                                                                                                                the
                                                                                                                                                                                                global
                                                                                                                                                                                                software
                                                                                                                                                                                                ecosystem
                                                                                                                                                                                                down
                                                                                                                                                                                                to
                                                                                                                                                                                                a
                                                                                                                                                                                                single
                                                                                                                                                                                                function.
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono">
                                                                                                                                                                        <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                                                                                                                                                                                                <span className="text-slate-400 block text-[10px]">
                                                                                                                                                                                                                        GLOBAL
                                                                                                                                                                                                                        NODES
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-lg font-bold text-white">
                                                                                                                                                                                                                        1,420,000+
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                                                                                                                                                                                                <span className="text-slate-400 block text-[10px]">
                                                                                                                                                                                                                        ZOOM
                                                                                                                                                                                                                        DEPTH
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-lg font-bold text-cyan-400">
                                                                                                                                                                                                                        Earth
                                                                                                                                                                                                                        →
                                                                                                                                                                                                                        Function
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Navigation Tabs */}
                                                                                                <div className="flex flex-wrap border-b border-slate-800 gap-6 text-sm font-medium">
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'atlas'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'atlas'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />{' '}
                                                                                                                                                🌟
                                                                                                                                                Signature:
                                                                                                                                                World
                                                                                                                                                Software
                                                                                                                                                Atlas
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'internet'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'internet'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <Radio className="w-4 h-4 text-emerald-400" />{' '}
                                                                                                                                                ⭐
                                                                                                                                                Internet
                                                                                                                                                Dashboard
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'semantic'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'semantic'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <Search className="w-4 h-4 text-amber-400" />{' '}
                                                                                                                                                Semantic
                                                                                                                                                Search
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'encyclopedia'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'encyclopedia'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <BookOpen className="w-4 h-4 text-purple-400" />{' '}
                                                                                                                                                Encyclopedia
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                'migration'
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        'migration'
                                                                                                                                                                                                ? 'border-indigo-500 text-indigo-400 font-semibold'
                                                                                                                                                                                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                                                                                                                                }`}
                                                                                                                        >
                                                                                                                                                <RefreshCw className="w-4 h-4 text-blue-400" />{' '}
                                                                                                                                                Migration
                                                                                                                                                Paths
                                                                                                                        </button>
                                                                                                </div>

                                                                                                {/* 🌟 SIGNATURE FEATURE: World Software Atlas */}
                                                                                                {activeTab ===
                                                                                                                        'atlas' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-6 shadow-2xl">
                                                                                                                                                                        <div className="flex items-center justify-between">
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                                                                <Globe
                                                                                                                                                                                                                                                                        className="w-6 h-6 text-cyan-400 animate-spin"
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                animationDuration: '12s',
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                🌟
                                                                                                                                                                                                                                                Signature
                                                                                                                                                                                                                                                Feature
                                                                                                                                                                                                                                                —
                                                                                                                                                                                                                                                World
                                                                                                                                                                                                                                                Software
                                                                                                                                                                                                                                                Atlas
                                                                                                                                                                                                                                                Interactive
                                                                                                                                                                                                                                                Zoom
                                                                                                                                                                                                                                                Hierarchy
                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                                        <p className="text-xs text-slate-400 mt-1">
                                                                                                                                                                                                                                                Click
                                                                                                                                                                                                                                                any
                                                                                                                                                                                                                                                level
                                                                                                                                                                                                                                                to
                                                                                                                                                                                                                                                zoom
                                                                                                                                                                                                                                                from
                                                                                                                                                                                                                                                the
                                                                                                                                                                                                                                                global
                                                                                                                                                                                                                                                software
                                                                                                                                                                                                                                                ecosystem
                                                                                                                                                                                                                                                down
                                                                                                                                                                                                                                                to
                                                                                                                                                                                                                                                a
                                                                                                                                                                                                                                                single
                                                                                                                                                                                                                                                function
                                                                                                                                                                                                                                                symbol.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                                                                                                                                                                                                                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />{' '}
                                                                                                                                                                                                                        Active
                                                                                                                                                                                                                        Zoom:{' '}
                                                                                                                                                                                                                        <span className="text-cyan-400 font-bold capitalize">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        atlasZoomLevel
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Interactive Zoom Hierarchy Stepper */}
                                                                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
                                                                                                                                                                                                {atlasLevels.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                lvl,
                                                                                                                                                                                                                                                index
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                lvl.level
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        onClick={() => {
                                                                                                                                                                                                                                                                                                setAtlasZoomLevel(
                                                                                                                                                                                                                                                                                                                        lvl.level
                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                setSelectedAtlasNode(
                                                                                                                                                                                                                                                                                                                        lvl.name
                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                        className={`p-4 rounded-xl border text-left transition-all ${
                                                                                                                                                                                                                                                                                                atlasZoomLevel ===
                                                                                                                                                                                                                                                                                                lvl.level
                                                                                                                                                                                                                                                                                                                        ? 'bg-indigo-950/80 border-indigo-500 text-white ring-2 ring-indigo-500/50 shadow-lg'
                                                                                                                                                                                                                                                                                                                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                                                                                                                Level{' '}
                                                                                                                                                                                                                                                                                                {index +
                                                                                                                                                                                                                                                                                                                        1}
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <h4 className="font-bold text-xs text-white mt-1 truncate">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        lvl.name.split(
                                                                                                                                                                                                                                                                                                                                                ':'
                                                                                                                                                                                                                                                                                                                        )[0]
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                                                                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        lvl.desc
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                        <span className="inline-block mt-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        lvl.count
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Active Zoom Detail Panel */}
                                                                                                                                                                        <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
                                                                                                                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                <ZoomIn className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <h4 className="font-bold text-white text-base">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        selectedAtlasNode
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                                                                        <p className="text-xs text-slate-400 font-mono">
                                                                                                                                                                                                                                                                                                Hierarchy
                                                                                                                                                                                                                                                                                                Scope:{' '}
                                                                                                                                                                                                                                                                                                {atlasZoomLevel.toUpperCase()}
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                                                                                                                                                                                                                Live
                                                                                                                                                                                                                                                Graph
                                                                                                                                                                                                                                                Connected
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                                                                                                                                                                                                                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                                                                                                                                                                                                                                <span className="text-slate-400 block text-[10px]">
                                                                                                                                                                                                                                                                        DECOUPLING
                                                                                                                                                                                                                                                                        INDEX
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-base font-bold text-emerald-400">
                                                                                                                                                                                                                                                                        96.4
                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                                                                                                                                                                                                                                <span className="text-slate-400 block text-[10px]">
                                                                                                                                                                                                                                                                        ECOSYSTEM
                                                                                                                                                                                                                                                                        MATCH
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-base font-bold text-indigo-400">
                                                                                                                                                                                                                                                                        Optimal
                                                                                                                                                                                                                                                                        (Top
                                                                                                                                                                                                                                                                        1%)
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                                                                                                                                                                                                                                <span className="text-slate-400 block text-[10px]">
                                                                                                                                                                                                                                                                        CONNECTED
                                                                                                                                                                                                                                                                        EDGES
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-base font-bold text-cyan-400">
                                                                                                                                                                                                                                                                        14,200
                                                                                                                                                                                                                                                                        Relationship
                                                                                                                                                                                                                                                                        Edges
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* TAB: Feature 56 — Engineering Internet Dashboard */}
                                                                                                {activeTab ===
                                                                                                                        'internet' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                                                                                                                                                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />{' '}
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                56
                                                                                                                                                                                                —
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Internet
                                                                                                                                                                                                Dashboard
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-slate-400">
                                                                                                                                                                                                Live
                                                                                                                                                                                                global
                                                                                                                                                                                                software
                                                                                                                                                                                                pulse
                                                                                                                                                                                                tracking
                                                                                                                                                                                                framework
                                                                                                                                                                                                adoption
                                                                                                                                                                                                rates,
                                                                                                                                                                                                breaking
                                                                                                                                                                                                advisories,
                                                                                                                                                                                                and
                                                                                                                                                                                                trending
                                                                                                                                                                                                entities.
                                                                                                                                                                        </p>

                                                                                                                                                                        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 font-mono text-xs flex items-center justify-between text-emerald-300">
                                                                                                                                                                                                <span className="flex items-center gap-2">
                                                                                                                                                                                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                internetStats.pulse
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold">
                                                                                                                                                                                                                        Active
                                                                                                                                                                                                                        Repos:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                internetStats.active_repos
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="space-y-3 pt-2">
                                                                                                                                                                                                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                                                                                                                                                                                        Global
                                                                                                                                                                                                                        Framework
                                                                                                                                                                                                                        Adoption
                                                                                                                                                                                                                        Trends
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                {internetStats.framework_adoption.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                fw
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                fw.name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="space-y-1 text-xs"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="flex justify-between text-slate-300 font-mono">
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                fw.name
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                fw.rate
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                        className={`h-2 ${fw.color}`}
                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                width: `${fw.rate}%`,
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* TAB: Feature 42 — Semantic Engineering Search */}
                                                                                                {activeTab ===
                                                                                                                        'semantic' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                                                                                                                                                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                <Search className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                42
                                                                                                                                                                                                —
                                                                                                                                                                                                Semantic
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Search
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-slate-400">
                                                                                                                                                                                                Execute
                                                                                                                                                                                                natural
                                                                                                                                                                                                language
                                                                                                                                                                                                vector
                                                                                                                                                                                                queries
                                                                                                                                                                                                across
                                                                                                                                                                                                global
                                                                                                                                                                                                software
                                                                                                                                                                                                patterns,
                                                                                                                                                                                                libraries,
                                                                                                                                                                                                and
                                                                                                                                                                                                frameworks.
                                                                                                                                                                        </p>

                                                                                                                                                                        <div className="flex gap-3">
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="text"
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                semanticQuery
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setSemanticQuery(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                                                                                                                                                                                                />
                                                                                                                                                                                                <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs shadow-md">
                                                                                                                                                                                                                        Execute
                                                                                                                                                                                                                        Semantic
                                                                                                                                                                                                                        Search
                                                                                                                                                                                                </button>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </DashboardLayout>
                        );
}
