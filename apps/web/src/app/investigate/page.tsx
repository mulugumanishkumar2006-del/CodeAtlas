'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
                        FlaskConical,
                        Flame,
                        AlertCircle,
                        FileText,
                        Database,
                        Users,
                        Brain,
                        Building2,
                        ChevronRight,
                        ExternalLink,
                        Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InvestigateWorkflowPage() {
                        const [activeTab, setActiveTab] = useState<
                                                'diagnostics' | 'council' | 'trace' | 'briefing'
                        >('diagnostics');

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        {/* Top Header */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        🔬
                                                                                                                                                                        Investigate
                                                                                                                                                                        Workflow
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        DEBT
                                                                                                                                                                        &
                                                                                                                                                                        AGENTIC
                                                                                                                                                                        DIAGNOSTICS
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Deep
                                                                                                                                                diagnostic
                                                                                                                                                inspection
                                                                                                                                                into
                                                                                                                                                code
                                                                                                                                                complexity,
                                                                                                                                                multi-agent
                                                                                                                                                council
                                                                                                                                                debate,
                                                                                                                                                reasoning
                                                                                                                                                traces,
                                                                                                                                                and
                                                                                                                                                executive
                                                                                                                                                summaries.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Sub-Workflow Navigation Tabs */}
                                                                        <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto">
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'diagnostics'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'diagnostics'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Flame className="h-4 w-4 text-amber-400" />{' '}
                                                                                                                        Complexity
                                                                                                                        &
                                                                                                                        Debt
                                                                                                                        Diagnostics
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'council'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'council'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Users className="h-4 w-4 text-indigo-400" />{' '}
                                                                                                                        Multi-Agent
                                                                                                                        Council
                                                                                                                        Debate
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'trace'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'trace'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Brain className="h-4 w-4 text-purple-400" />{' '}
                                                                                                                        Reasoning
                                                                                                                        Trace
                                                                                                                        &
                                                                                                                        Whiteboard
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'briefing'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'briefing'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Building2 className="h-4 w-4 text-emerald-400" />{' '}
                                                                                                                        Executive
                                                                                                                        Briefing
                                                                                                </button>
                                                                        </div>

                                                                        {/* TAB CONTENT 1: Diagnostics */}
                                                                        {activeTab ===
                                                                                                'diagnostics' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid gap-6 md:grid-cols-2">
                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                                        <div className="flex justify-between items-center border-b pb-2">
                                                                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                                                                        Technical
                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                                        Hotspots
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <Flame className="h-4 w-4 text-amber-400" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="space-y-2 text-xs">
                                                                                                                                                                                                <div className="p-3 bg-muted/10 rounded-xl border flex justify-between items-center">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                FastAPI
                                                                                                                                                                                                                                                REST
                                                                                                                                                                                                                                                Router
                                                                                                                                                                                                                                                direct
                                                                                                                                                                                                                                                SQL
                                                                                                                                                                                                                                                queries
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-extrabold text-amber-400">
                                                                                                                                                                                                                                                High
                                                                                                                                                                                                                                                Risk
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="p-3 bg-muted/10 rounded-xl border flex justify-between items-center">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Class-based
                                                                                                                                                                                                                                                Pydantic
                                                                                                                                                                                                                                                Config
                                                                                                                                                                                                                                                schemas
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-extrabold text-indigo-400">
                                                                                                                                                                                                                                                Medium
                                                                                                                                                                                                                                                Risk
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="p-3 bg-muted/10 rounded-xl border flex justify-between items-center">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Auth
                                                                                                                                                                                                                                                Cache
                                                                                                                                                                                                                                                sync
                                                                                                                                                                                                                                                block
                                                                                                                                                                                                                                                in
                                                                                                                                                                                                                                                main
                                                                                                                                                                                                                                                loop
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-extrabold text-amber-400">
                                                                                                                                                                                                                                                High
                                                                                                                                                                                                                                                Risk
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                                        <div className="flex justify-between items-center border-b pb-2">
                                                                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                                                                        Cyclomatic
                                                                                                                                                                                                                        Complexity
                                                                                                                                                                                                                        Index
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <FlaskConical className="h-4 w-4 text-indigo-400" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                                                                <p className="text-muted-foreground">
                                                                                                                                                                                                                        Average
                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                        Complexity:{' '}
                                                                                                                                                                                                                        <strong className="text-foreground">
                                                                                                                                                                                                                                                14.2
                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                </p>
                                                                                                                                                                                                <p className="text-muted-foreground">
                                                                                                                                                                                                                        Max
                                                                                                                                                                                                                        Function
                                                                                                                                                                                                                        Complexity:{' '}
                                                                                                                                                                                                                        <strong className="text-foreground">
                                                                                                                                                                                                                                                22
                                                                                                                                                                                                                                                (orchestrator_service.py)
                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                </p>
                                                                                                                                                                                                <div className="p-3 bg-muted/10 rounded-xl border">
                                                                                                                                                                                                                        <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                                                Complexity
                                                                                                                                                                                                                                                Reduction
                                                                                                                                                                                                                                                Target
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-muted-foreground text-[11px] mt-1">
                                                                                                                                                                                                                                                Refactoring
                                                                                                                                                                                                                                                target
                                                                                                                                                                                                                                                set
                                                                                                                                                                                                                                                for
                                                                                                                                                                                                                                                auth
                                                                                                                                                                                                                                                routing
                                                                                                                                                                                                                                                layer
                                                                                                                                                                                                                                                to
                                                                                                                                                                                                                                                reduce
                                                                                                                                                                                                                                                cyclomatic
                                                                                                                                                                                                                                                score
                                                                                                                                                                                                                                                to
                                                                                                                                                                                                                                                &lt;
                                                                                                                                                                                                                                                10.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                <div className="flex justify-between items-center border-b pb-2">
                                                                                                                                                                        <h3 className="text-base font-black text-foreground">
                                                                                                                                                                                                Dedicated
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Calculator
                                                                                                                                                                        </h3>
                                                                                                                                                                        <Link
                                                                                                                                                                                                href="/tech-debt"
                                                                                                                                                                                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                                        >
                                                                                                                                                                                                View
                                                                                                                                                                                                Technical
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Resolution{' '}
                                                                                                                                                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                                        </Link>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                        Track
                                                                                                                                                                        debt
                                                                                                                                                                        accumulation
                                                                                                                                                                        velocity
                                                                                                                                                                        ($/yr
                                                                                                                                                                        drag),
                                                                                                                                                                        estimated
                                                                                                                                                                        developer
                                                                                                                                                                        hours
                                                                                                                                                                        required
                                                                                                                                                                        for
                                                                                                                                                                        resolution,
                                                                                                                                                                        and
                                                                                                                                                                        priority
                                                                                                                                                                        payoff
                                                                                                                                                                        sprint
                                                                                                                                                                        plans.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 2: Multi-Agent Council */}
                                                                        {activeTab ===
                                                                                                'council' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Multi-Agent
                                                                                                                                                                        Architecture
                                                                                                                                                                        Council
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/council"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Council
                                                                                                                                                                        Room{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                AI
                                                                                                                                                Principal
                                                                                                                                                Architect,
                                                                                                                                                Security
                                                                                                                                                Lead,
                                                                                                                                                and
                                                                                                                                                SRE
                                                                                                                                                specialists
                                                                                                                                                debate
                                                                                                                                                structural
                                                                                                                                                decisions
                                                                                                                                                to
                                                                                                                                                achieve
                                                                                                                                                consensus
                                                                                                                                                before
                                                                                                                                                breaking
                                                                                                                                                changes
                                                                                                                                                are
                                                                                                                                                introduced.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Users className="h-10 w-10 text-indigo-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        Consensus
                                                                                                                                                                        Debate
                                                                                                                                                                        Room
                                                                                                                                                                        Active
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        View
                                                                                                                                                                        consensus
                                                                                                                                                                        transcripts,
                                                                                                                                                                        voting
                                                                                                                                                                        arguments,
                                                                                                                                                                        and
                                                                                                                                                                        architectural
                                                                                                                                                                        recommendations
                                                                                                                                                                        from
                                                                                                                                                                        multi-agent
                                                                                                                                                                        council
                                                                                                                                                                        sessions.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/council">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                Enter
                                                                                                                                                                                                Multi-Agent
                                                                                                                                                                                                Council
                                                                                                                                                                                                Room
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 3: Reasoning Trace & Whiteboard */}
                                                                        {activeTab === 'trace' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Reasoning
                                                                                                                                                                        Trace
                                                                                                                                                                        &
                                                                                                                                                                        Whiteboard
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/agi-reasoning"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Deep
                                                                                                                                                                        Trace{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Inspect
                                                                                                                                                step-by-step
                                                                                                                                                AI
                                                                                                                                                reasoning
                                                                                                                                                chains,
                                                                                                                                                architectural
                                                                                                                                                hypothesis
                                                                                                                                                testing,
                                                                                                                                                and
                                                                                                                                                collaborative
                                                                                                                                                whiteboard
                                                                                                                                                diagrams.
                                                                                                                        </p>
                                                                                                                        <div className="grid gap-3 md:grid-cols-2 text-xs">
                                                                                                                                                <Link
                                                                                                                                                                        href="/agi-reasoning"
                                                                                                                                                                        className="p-4 bg-muted/10 rounded-xl space-y-2 border hover:border-primary/50 transition-all block"
                                                                                                                                                >
                                                                                                                                                                        <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                Deep
                                                                                                                                                                                                Reasoning
                                                                                                                                                                                                Trace
                                                                                                                                                                        </span>
                                                                                                                                                                        <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                Inspect
                                                                                                                                                                                                complete
                                                                                                                                                                                                step-by-step
                                                                                                                                                                                                thinking,
                                                                                                                                                                                                hypothesis
                                                                                                                                                                                                generation,
                                                                                                                                                                                                and
                                                                                                                                                                                                verification
                                                                                                                                                                                                steps.
                                                                                                                                                                        </p>
                                                                                                                                                </Link>
                                                                                                                                                <Link
                                                                                                                                                                        href="/agi-whiteboard"
                                                                                                                                                                        className="p-4 bg-muted/10 rounded-xl space-y-2 border hover:border-primary/50 transition-all block"
                                                                                                                                                >
                                                                                                                                                                        <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                Whiteboard
                                                                                                                                                                        </span>
                                                                                                                                                                        <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                Collaborative
                                                                                                                                                                                                visual
                                                                                                                                                                                                canvas
                                                                                                                                                                                                mapping
                                                                                                                                                                                                system
                                                                                                                                                                                                state
                                                                                                                                                                                                transformations
                                                                                                                                                                                                and
                                                                                                                                                                                                migration
                                                                                                                                                                                                steps.
                                                                                                                                                                        </p>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 4: Executive Briefing */}
                                                                        {activeTab ===
                                                                                                'briefing' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Executive
                                                                                                                                                                        Architecture
                                                                                                                                                                        Briefing
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/ai-cto"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Executive
                                                                                                                                                                        Dashboard{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                High-level
                                                                                                                                                executive
                                                                                                                                                briefing
                                                                                                                                                summarizing
                                                                                                                                                system
                                                                                                                                                health,
                                                                                                                                                architectural
                                                                                                                                                investments,
                                                                                                                                                tech
                                                                                                                                                debt
                                                                                                                                                drag,
                                                                                                                                                and
                                                                                                                                                strategic
                                                                                                                                                engineering
                                                                                                                                                recommendations.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Building2 className="h-10 w-10 text-emerald-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        Executive
                                                                                                                                                                        Briefing
                                                                                                                                                                        Dashboard
                                                                                                                                                                        Available
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        View
                                                                                                                                                                        strategic
                                                                                                                                                                        executive
                                                                                                                                                                        reports,
                                                                                                                                                                        engineering
                                                                                                                                                                        velocity,
                                                                                                                                                                        and
                                                                                                                                                                        technical
                                                                                                                                                                        risk
                                                                                                                                                                        summaries.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/ai-cto">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                View
                                                                                                                                                                                                Executive
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                Briefing
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
