'use client';

import React, { useState } from 'react';
import {
                        Network,
                        Search,
                        Filter,
                        ZoomIn,
                        ZoomOut,
                        RefreshCw,
                        Cpu,
                        Database,
                        Layers,
                        Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DependencyGraphPage() {
                        const [searchQuery, setSearchQuery] = useState<string>('');
                        const [activeFilter, setActiveFilter] = useState<string>('all');
                        const [zoomLevel, setZoomLevel] = useState<number>(100);

                        const nodes = [
                                                {
                                                                        id: 'n1',
                                                                        label: 'FastAPI Router Gateway',
                                                                        type: 'api',
                                                                        status: 'HEALTHY',
                                                                        x: 200,
                                                                        y: 150,
                                                },
                                                {
                                                                        id: 'n2',
                                                                        label: 'Auth & JWT Service',
                                                                        type: 'service',
                                                                        status: 'HEALTHY',
                                                                        x: 500,
                                                                        y: 100,
                                                },
                                                {
                                                                        id: 'n3',
                                                                        label: 'ASIP Orchestrator Engine',
                                                                        type: 'service',
                                                                        status: 'HEALTHY',
                                                                        x: 500,
                                                                        y: 250,
                                                },
                                                {
                                                                        id: 'n4',
                                                                        label: 'SQLAlchemy ORM Data Store',
                                                                        type: 'database',
                                                                        status: 'HEALTHY',
                                                                        x: 800,
                                                                        y: 150,
                                                },
                                                {
                                                                        id: 'n5',
                                                                        label: 'Redis Cache Cluster',
                                                                        type: 'cache',
                                                                        status: 'HEALTHY',
                                                                        x: 800,
                                                                        y: 300,
                                                },
                                                {
                                                                        id: 'n6',
                                                                        label: 'Neo4j Knowledge Graph',
                                                                        type: 'database',
                                                                        status: 'HEALTHY',
                                                                        x: 800,
                                                                        y: 450,
                                                },
                        ];

                        const filteredNodes = nodes.filter((node) => {
                                                const matchesSearch = node.label
                                                                        .toLowerCase()
                                                                        .includes(
                                                                                                searchQuery.toLowerCase()
                                                                        );
                                                const matchesFilter =
                                                                        activeFilter === 'all' ||
                                                                        node.type === activeFilter;
                                                return matchesSearch && matchesFilter;
                        });

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-6 max-w-7xl mx-auto">
                                                                        {/* Page Header */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        🕸️
                                                                                                                                                                        Interactive
                                                                                                                                                                        Dependency
                                                                                                                                                                        Graph
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        128
                                                                                                                                                                        CONNECTED
                                                                                                                                                                        NODES
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Real-time
                                                                                                                                                semantic
                                                                                                                                                call
                                                                                                                                                tree,
                                                                                                                                                package
                                                                                                                                                imports,
                                                                                                                                                and
                                                                                                                                                microservice
                                                                                                                                                boundary
                                                                                                                                                call
                                                                                                                                                graph.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <Button
                                                                                                                                                variant="outline"
                                                                                                                                                size="sm"
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setZoomLevel(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        z
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        Math.min(
                                                                                                                                                                                                                                                z +
                                                                                                                                                                                                                                                                        10,
                                                                                                                                                                                                                                                150
                                                                                                                                                                                                                        )
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                        >
                                                                                                                                                <ZoomIn className="h-4 w-4" />
                                                                                                                        </Button>
                                                                                                                        <Button
                                                                                                                                                variant="outline"
                                                                                                                                                size="sm"
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setZoomLevel(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        z
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        Math.max(
                                                                                                                                                                                                                                                z -
                                                                                                                                                                                                                                                                        10,
                                                                                                                                                                                                                                                50
                                                                                                                                                                                                                        )
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                        >
                                                                                                                                                <ZoomOut className="h-4 w-4" />
                                                                                                                        </Button>
                                                                                                                        <span className="text-xs font-mono font-bold text-muted-foreground">
                                                                                                                                                {
                                                                                                                                                                        zoomLevel
                                                                                                                                                }

                                                                                                                                                %
                                                                                                                        </span>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Search & Filter Bar */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card border rounded-2xl p-4 shadow-sm">
                                                                                                <div className="relative w-full md:w-80">
                                                                                                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                                                                        <input
                                                                                                                                                type="text"
                                                                                                                                                placeholder="Search nodes or modules..."
                                                                                                                                                value={
                                                                                                                                                                        searchQuery
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setSearchQuery(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="w-full pl-9 pr-4 py-1.5 bg-muted/20 border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary"
                                                                                                                        />
                                                                                                </div>

                                                                                                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                                                                                                                        {[
                                                                                                                                                {
                                                                                                                                                                        id: 'all',
                                                                                                                                                                        label: 'All Nodes',
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'api',
                                                                                                                                                                        label: 'API Routers',
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'service',
                                                                                                                                                                        label: 'Services',
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'database',
                                                                                                                                                                        label: 'Databases',
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'cache',
                                                                                                                                                                        label: 'Cache',
                                                                                                                                                },
                                                                                                                        ].map(
                                                                                                                                                (
                                                                                                                                                                        f
                                                                                                                                                ) => (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        f.id
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setActiveFilter(
                                                                                                                                                                                                                                                f.id
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                                                                                                                                                                                        activeFilter ===
                                                                                                                                                                                                                        f.id
                                                                                                                                                                                                                                                ? 'bg-primary text-primary-foreground shadow'
                                                                                                                                                                                                                                                : 'bg-muted/20 border text-muted-foreground hover:text-foreground'
                                                                                                                                                                                                }`}
                                                                                                                                                                        >
                                                                                                                                                                                                {
                                                                                                                                                                                                                        f.label
                                                                                                                                                                                                }
                                                                                                                                                                        </button>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>

                                                                        {/* Canvas Container */}
                                                                        <div className="border rounded-2xl bg-card/60 backdrop-blur-md p-8 min-h-[500px] relative overflow-hidden flex flex-col justify-between shadow-xl">
                                                                                                <div className="grid gap-4 md:grid-cols-3">
                                                                                                                        {filteredNodes.map(
                                                                                                                                                (
                                                                                                                                                                        node
                                                                                                                                                ) => (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        node.id
                                                                                                                                                                                                }
                                                                                                                                                                                                className="border border-indigo-500/30 rounded-2xl bg-card p-5 space-y-3 shadow hover:border-indigo-500/70 transition-all"
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        node.type
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                                                                                                                                                                                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        node.status
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <h3 className="text-base font-extrabold text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                node.label
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                                        Connected
                                                                                                                                                                                                                        edges:
                                                                                                                                                                                                                        12
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        AST
                                                                                                                                                                                                                        Parser:
                                                                                                                                                                                                                        SWC/libcst
                                                                                                                                                                                                </p>

                                                                                                                                                                                                <div className="flex items-center justify-between text-xs pt-2 border-t text-muted-foreground">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Latency:
                                                                                                                                                                                                                                                &lt;1.2ms
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-primary font-bold">
                                                                                                                                                                                                                                                100%
                                                                                                                                                                                                                                                Verified
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
