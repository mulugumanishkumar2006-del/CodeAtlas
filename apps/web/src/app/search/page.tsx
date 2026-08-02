'use client';

import React, { useState } from 'react';
import { Compass, Search as SearchIcon, FileCode, Code, Layers } from 'lucide-react';

export default function SearchWorkflowPage() {
                        const [query, setQuery] = useState<string>('');

                        const mockResults = [
                                                {
                                                                        name: 'ASIPOrchestrator',
                                                                        type: 'class',
                                                                        file: 'apps/backend/app/asip/orchestrator/asip_orchestrator.py',
                                                                        line: 17,
                                                },
                                                {
                                                                        name: 'get_monday_briefing',
                                                                        type: 'function',
                                                                        file: 'apps/backend/app/api/v1/asip_router.py',
                                                                        line: 42,
                                                },
                                                {
                                                                        name: 'EngineeringMissionControlEngine',
                                                                        type: 'class',
                                                                        file: 'apps/backend/app/asip/analyzers/mission_control.py',
                                                                        line: 8,
                                                },
                        ];

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        🔎
                                                                                                                                                                        Search
                                                                                                                                                                        Workflow
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        GLOBAL
                                                                                                                                                                        SEMANTIC
                                                                                                                                                                        SEARCH
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Cross-repository
                                                                                                                                                AST
                                                                                                                                                symbol
                                                                                                                                                discovery,
                                                                                                                                                call
                                                                                                                                                tree
                                                                                                                                                lookup,
                                                                                                                                                and
                                                                                                                                                architectural
                                                                                                                                                references.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        <div className="relative max-w-2xl">
                                                                                                <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                                                                                <input
                                                                                                                        type="text"
                                                                                                                        placeholder="Search classes, functions, routes, or modules across all repositories..."
                                                                                                                        value={
                                                                                                                                                query
                                                                                                                        }
                                                                                                                        onChange={(
                                                                                                                                                e
                                                                                                                        ) =>
                                                                                                                                                setQuery(
                                                                                                                                                                        e
                                                                                                                                                                                                .target
                                                                                                                                                                                                .value
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className="w-full pl-12 pr-4 py-3 bg-card border rounded-2xl text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                                                                                />
                                                                        </div>

                                                                        <div className="space-y-3">
                                                                                                {mockResults.map(
                                                                                                                        (
                                                                                                                                                res,
                                                                                                                                                i
                                                                                                                        ) => (
                                                                                                                                                <div
                                                                                                                                                                        key={
                                                                                                                                                                                                i
                                                                                                                                                                        }
                                                                                                                                                                        className="border rounded-xl p-4 bg-card hover:border-primary/40 transition-all flex justify-between items-center text-xs"
                                                                                                                                                >
                                                                                                                                                                        <div className="space-y-1">
                                                                                                                                                                                                <div className="flex items-center gap-2">
                                                                                                                                                                                                                        <span className="font-extrabold text-foreground text-sm">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        res.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        res.type
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-muted-foreground font-mono text-[11px]">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                res.file
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        :L
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                res.line
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}
