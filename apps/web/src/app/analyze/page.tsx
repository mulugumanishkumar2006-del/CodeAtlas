'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
                        Search,
                        FileCode,
                        Cpu,
                        Network,
                        CheckCircle2,
                        RefreshCw,
                        Layers,
                        Eye,
                        Building2,
                        BookOpen,
                        ArrowRight,
                        ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnalyzeWorkflowPage() {
                        const [activeTab, setActiveTab] = useState<
                                                'overview' | 'ast' | 'graph' | 'city'
                        >('overview');
                        const [isScanning, setIsScanning] = useState(false);

                        const handleRescan = () => {
                                                setIsScanning(true);
                                                setTimeout(() => setIsScanning(false), 1500);
                        };

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        {/* Top Header */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        🔍
                                                                                                                                                                        Analyze
                                                                                                                                                                        Workflow
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        CONTINUOUS
                                                                                                                                                                        AST
                                                                                                                                                                        &
                                                                                                                                                                        KNOWLEDGE
                                                                                                                                                                        PARSING
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                AST
                                                                                                                                                file
                                                                                                                                                analysis,
                                                                                                                                                Quality
                                                                                                                                                Gates
                                                                                                                                                verification,
                                                                                                                                                structural
                                                                                                                                                dependency
                                                                                                                                                graphs,
                                                                                                                                                and
                                                                                                                                                3D
                                                                                                                                                software
                                                                                                                                                topology
                                                                                                                                                visualization.
                                                                                                                        </p>
                                                                                                </div>
                                                                                                <Button
                                                                                                                        onClick={
                                                                                                                                                handleRescan
                                                                                                                        }
                                                                                                                        disabled={
                                                                                                                                                isScanning
                                                                                                                        }
                                                                                                                        className="bg-primary text-primary-foreground font-bold text-xs gap-2"
                                                                                                >
                                                                                                                        <RefreshCw
                                                                                                                                                className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`}
                                                                                                                        />{' '}
                                                                                                                        {isScanning
                                                                                                                                                ? 'Parsing AST Delta...'
                                                                                                                                                : 'Trigger Full Re-Scan'}
                                                                                                </Button>
                                                                        </div>

                                                                        {/* Sub-Workflow Navigation Tabs */}
                                                                        <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto">
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'overview'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'overview'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Search className="h-4 w-4" />{' '}
                                                                                                                        Overview
                                                                                                                        &
                                                                                                                        Quality
                                                                                                                        Gates
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'ast'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'ast'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <FileCode className="h-4 w-4" />{' '}
                                                                                                                        AST
                                                                                                                        &
                                                                                                                        Code
                                                                                                                        Inspection
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'graph'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'graph'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Network className="h-4 w-4" />{' '}
                                                                                                                        Dependency
                                                                                                                        &
                                                                                                                        Knowledge
                                                                                                                        Graph
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'city'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'city'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Building2 className="h-4 w-4" />{' '}
                                                                                                                        Software
                                                                                                                        City
                                                                                                                        Map
                                                                                                                        Topology
                                                                                                </button>
                                                                        </div>

                                                                        {/* TAB CONTENT 1: Overview */}
                                                                        {activeTab ===
                                                                                                'overview' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid gap-6 md:grid-cols-3">
                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                                                                                                                                                                Incremental
                                                                                                                                                                                                Indexer
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                115
                                                                                                                                                                                                ms
                                                                                                                                                                                                Sync
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Sub-120ms
                                                                                                                                                                                                delta
                                                                                                                                                                                                tree
                                                                                                                                                                                                parser
                                                                                                                                                                                                watching
                                                                                                                                                                                                35
                                                                                                                                                                                                repository
                                                                                                                                                                                                files.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                                                                                                                                                                                Quality
                                                                                                                                                                                                Gates
                                                                                                                                                                                                Status
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-emerald-400">
                                                                                                                                                                                                4
                                                                                                                                                                                                /
                                                                                                                                                                                                4
                                                                                                                                                                                                PASSED
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Security,
                                                                                                                                                                                                Complexity,
                                                                                                                                                                                                Coverage,
                                                                                                                                                                                                and
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Velocity
                                                                                                                                                                                                gates
                                                                                                                                                                                                passed.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                                                                                                                                                                Release
                                                                                                                                                                                                Readiness
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                94
                                                                                                                                                                                                /
                                                                                                                                                                                                100
                                                                                                                                                                                                READY
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Verified
                                                                                                                                                                                                stable
                                                                                                                                                                                                for
                                                                                                                                                                                                deployment
                                                                                                                                                                                                with
                                                                                                                                                                                                zero
                                                                                                                                                                                                critical
                                                                                                                                                                                                CVEs.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                <h3 className="text-base font-black text-foreground border-b pb-3">
                                                                                                                                                                        Analyze
                                                                                                                                                                        Sub-Capabilities
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid gap-4 md:grid-cols-3 text-xs">
                                                                                                                                                                        <Link
                                                                                                                                                                                                href="/visual"
                                                                                                                                                                                                className="border rounded-xl p-4 bg-muted/10 hover:border-primary/50 transition-all space-y-2 group block"
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                        <h4 className="font-extrabold text-foreground group-hover:text-primary flex items-center gap-2">
                                                                                                                                                                                                                                                <Eye className="h-4 w-4 text-indigo-400" />{' '}
                                                                                                                                                                                                                                                Interactive
                                                                                                                                                                                                                                                AST
                                                                                                                                                                                                                                                Visualizer
                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                        Visual
                                                                                                                                                                                                                        representation
                                                                                                                                                                                                                        of
                                                                                                                                                                                                                        code
                                                                                                                                                                                                                        structure,
                                                                                                                                                                                                                        symbols,
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        scope
                                                                                                                                                                                                                        trees.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </Link>

                                                                                                                                                                        <Link
                                                                                                                                                                                                href="/dependency-graph"
                                                                                                                                                                                                className="border rounded-xl p-4 bg-muted/10 hover:border-primary/50 transition-all space-y-2 group block"
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                        <h4 className="font-extrabold text-foreground group-hover:text-primary flex items-center gap-2">
                                                                                                                                                                                                                                                <Network className="h-4 w-4 text-indigo-400" />{' '}
                                                                                                                                                                                                                                                Dependency
                                                                                                                                                                                                                                                Graph
                                                                                                                                                                                                                                                Engine
                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                        Cross-module
                                                                                                                                                                                                                        caller/callee
                                                                                                                                                                                                                        graphs
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        import
                                                                                                                                                                                                                        hierarchy
                                                                                                                                                                                                                        maps.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </Link>

                                                                                                                                                                        <Link
                                                                                                                                                                                                href="/software-city"
                                                                                                                                                                                                className="border rounded-xl p-4 bg-muted/10 hover:border-primary/50 transition-all space-y-2 group block"
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                        <h4 className="font-extrabold text-foreground group-hover:text-primary flex items-center gap-2">
                                                                                                                                                                                                                                                <Building2 className="h-4 w-4 text-indigo-400" />{' '}
                                                                                                                                                                                                                                                3D
                                                                                                                                                                                                                                                Software
                                                                                                                                                                                                                                                City
                                                                                                                                                                                                                                                Map
                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                        3D
                                                                                                                                                                                                                        city
                                                                                                                                                                                                                        topology
                                                                                                                                                                                                                        of
                                                                                                                                                                                                                        repository
                                                                                                                                                                                                                        complexity
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        module
                                                                                                                                                                                                                        footprints.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </Link>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 2: AST Inspection */}
                                                                        {activeTab === 'ast' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        AST
                                                                                                                                                                        Symbol
                                                                                                                                                                        &
                                                                                                                                                                        Parsing
                                                                                                                                                                        Suite
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/visual"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Launch
                                                                                                                                                                        Full
                                                                                                                                                                        AST
                                                                                                                                                                        Visualizer{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Full
                                                                                                                                                structural
                                                                                                                                                parsing
                                                                                                                                                engine
                                                                                                                                                analyzing
                                                                                                                                                function
                                                                                                                                                definitions,
                                                                                                                                                class
                                                                                                                                                inheritances,
                                                                                                                                                call
                                                                                                                                                trees,
                                                                                                                                                and
                                                                                                                                                syntax
                                                                                                                                                nodes
                                                                                                                                                across
                                                                                                                                                all
                                                                                                                                                registered
                                                                                                                                                repositories.
                                                                                                                        </p>
                                                                                                                        <div className="grid gap-3 md:grid-cols-2 text-xs">
                                                                                                                                                <div className="p-4 bg-muted/10 rounded-xl space-y-2 border">
                                                                                                                                                                        <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                Parsed
                                                                                                                                                                                                Modules
                                                                                                                                                                        </span>
                                                                                                                                                                        <ul className="space-y-1 text-muted-foreground">
                                                                                                                                                                                                <li>
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        FastAPI
                                                                                                                                                                                                                        REST
                                                                                                                                                                                                                        Routers
                                                                                                                                                                                                                        (35
                                                                                                                                                                                                                        routes
                                                                                                                                                                                                                        parsed)
                                                                                                                                                                                                </li>
                                                                                                                                                                                                <li>
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        Database
                                                                                                                                                                                                                        Services
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        ORM
                                                                                                                                                                                                                        Models
                                                                                                                                                                                                                        (18
                                                                                                                                                                                                                        schemas)
                                                                                                                                                                                                </li>
                                                                                                                                                                                                <li>
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        Autonomous
                                                                                                                                                                                                                        Planning
                                                                                                                                                                                                                        Workers
                                                                                                                                                                                                                        (12
                                                                                                                                                                                                                        background
                                                                                                                                                                                                                        tasks)
                                                                                                                                                                                                </li>
                                                                                                                                                                        </ul>
                                                                                                                                                </div>
                                                                                                                                                <div className="p-4 bg-muted/10 rounded-xl space-y-2 border">
                                                                                                                                                                        <span className="font-extrabold text-emerald-400 block">
                                                                                                                                                                                                Parser
                                                                                                                                                                                                Health
                                                                                                                                                                        </span>
                                                                                                                                                                        <ul className="space-y-1 text-muted-foreground">
                                                                                                                                                                                                <li>
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        Sub-120ms
                                                                                                                                                                                                                        delta
                                                                                                                                                                                                                        index
                                                                                                                                                                                                                        speed
                                                                                                                                                                                                </li>
                                                                                                                                                                                                <li>
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        Zero
                                                                                                                                                                                                                        syntax
                                                                                                                                                                                                                        tree
                                                                                                                                                                                                                        errors
                                                                                                                                                                                                </li>
                                                                                                                                                                                                <li>
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        100%
                                                                                                                                                                                                                        AST
                                                                                                                                                                                                                        node
                                                                                                                                                                                                                        indexing
                                                                                                                                                                                                                        completeness
                                                                                                                                                                                                </li>
                                                                                                                                                                        </ul>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 3: Dependency Graph */}
                                                                        {activeTab === 'graph' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Dependency
                                                                                                                                                                        &
                                                                                                                                                                        Entity
                                                                                                                                                                        Knowledge
                                                                                                                                                                        Graph
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/dependency-graph"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Interactive
                                                                                                                                                                        Graph{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Explore
                                                                                                                                                cross-component
                                                                                                                                                linkage,
                                                                                                                                                circular
                                                                                                                                                dependencies,
                                                                                                                                                package
                                                                                                                                                bounds,
                                                                                                                                                and
                                                                                                                                                deep
                                                                                                                                                AST
                                                                                                                                                entity
                                                                                                                                                relationships.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Network className="h-10 w-10 text-indigo-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        Interactive
                                                                                                                                                                        Graph
                                                                                                                                                                        Canvas
                                                                                                                                                                        Available
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        View
                                                                                                                                                                        complete
                                                                                                                                                                        interactive
                                                                                                                                                                        graph
                                                                                                                                                                        with
                                                                                                                                                                        zoom,
                                                                                                                                                                        node
                                                                                                                                                                        filtering,
                                                                                                                                                                        and
                                                                                                                                                                        call
                                                                                                                                                                        hierarchy
                                                                                                                                                                        tracing.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/dependency-graph">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-primary text-primary-foreground font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                View
                                                                                                                                                                                                Full
                                                                                                                                                                                                Dependency
                                                                                                                                                                                                Graph
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 4: Software City Map */}
                                                                        {activeTab === 'city' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        3D
                                                                                                                                                                        Software
                                                                                                                                                                        City
                                                                                                                                                                        Topology
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/software-city"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Launch
                                                                                                                                                                        3D
                                                                                                                                                                        Explorer{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Visualize
                                                                                                                                                repository
                                                                                                                                                architecture
                                                                                                                                                as
                                                                                                                                                a
                                                                                                                                                3D
                                                                                                                                                city,
                                                                                                                                                where
                                                                                                                                                building
                                                                                                                                                heights
                                                                                                                                                represent
                                                                                                                                                code
                                                                                                                                                complexity
                                                                                                                                                and
                                                                                                                                                footprints
                                                                                                                                                represent
                                                                                                                                                line
                                                                                                                                                counts.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Building2 className="h-10 w-10 text-indigo-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        3D
                                                                                                                                                                        Software
                                                                                                                                                                        City
                                                                                                                                                                        Canvas
                                                                                                                                                                        Ready
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        Explore
                                                                                                                                                                        interactive
                                                                                                                                                                        3D
                                                                                                                                                                        view
                                                                                                                                                                        of
                                                                                                                                                                        code
                                                                                                                                                                        quality,
                                                                                                                                                                        complexity
                                                                                                                                                                        hotspots,
                                                                                                                                                                        and
                                                                                                                                                                        system
                                                                                                                                                                        layout.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/software-city">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                Launch
                                                                                                                                                                                                Software
                                                                                                                                                                                                City
                                                                                                                                                                                                3D
                                                                                                                                                                                                Map
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
