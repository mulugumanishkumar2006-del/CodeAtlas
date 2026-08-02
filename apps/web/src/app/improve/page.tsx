'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
                        Sparkles,
                        CheckCircle2,
                        XCircle,
                        ExternalLink,
                        Wrench,
                        Cpu,
                        Flame,
                        GitPullRequest,
                        ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImproveWorkflowPage() {
                        const [activeTab, setActiveTab] = useState<
                                                'queue' | 'engine' | 'autonomous' | 'debt'
                        >('queue');
                        const [approved, setApproved] = useState<boolean>(false);

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        {/* Top Header */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        ✨
                                                                                                                                                                        Improve
                                                                                                                                                                        Workflow
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        HUMAN-IN-THE-LOOP
                                                                                                                                                                        GOVERNANCE
                                                                                                                                                                        &
                                                                                                                                                                        REFACTORING
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Review,
                                                                                                                                                approve,
                                                                                                                                                or
                                                                                                                                                reject
                                                                                                                                                AI
                                                                                                                                                refactoring
                                                                                                                                                actions,
                                                                                                                                                execute
                                                                                                                                                security
                                                                                                                                                patches,
                                                                                                                                                and
                                                                                                                                                trigger
                                                                                                                                                autonomous
                                                                                                                                                issue
                                                                                                                                                resolution
                                                                                                                                                plans.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Sub-Workflow Navigation Tabs */}
                                                                        <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto">
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'queue'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'queue'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Sparkles className="h-4 w-4 text-emerald-400" />{' '}
                                                                                                                        Improvement
                                                                                                                        Action
                                                                                                                        Queue
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'engine'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'engine'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Wrench className="h-4 w-4 text-indigo-400" />{' '}
                                                                                                                        Automated
                                                                                                                        Refactoring
                                                                                                                        Engine
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'autonomous'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'autonomous'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Cpu className="h-4 w-4 text-purple-400" />{' '}
                                                                                                                        Autonomous
                                                                                                                        Issue
                                                                                                                        Planner
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'debt'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'debt'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Flame className="h-4 w-4 text-amber-400" />{' '}
                                                                                                                        Technical
                                                                                                                        Debt
                                                                                                                        Resolution
                                                                                                </button>
                                                                        </div>

                                                                        {/* TAB CONTENT 1: Action Queue */}
                                                                        {activeTab === 'queue' && (
                                                                                                <div className="space-y-4">
                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                <div className="flex justify-between items-start">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                                                                                                                                                                                                                        RECOMMENDED
                                                                                                                                                                                                                        IMPROVEMENT
                                                                                                                                                                                                                        ACTION
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h3 className="text-lg font-black text-foreground mt-1">
                                                                                                                                                                                                                        Decouple
                                                                                                                                                                                                                        SQLAlchemy
                                                                                                                                                                                                                        Router
                                                                                                                                                                                                                        Queries
                                                                                                                                                                                                                        into
                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                        Classes
                                                                                                                                                                                                </h3>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs font-extrabold text-indigo-400">
                                                                                                                                                                                                95.8%
                                                                                                                                                                                                Confidence
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                        Expected
                                                                                                                                                                        Benefits:
                                                                                                                                                                        +45%
                                                                                                                                                                        unit
                                                                                                                                                                        testability,
                                                                                                                                                                        decouples
                                                                                                                                                                        API
                                                                                                                                                                        routing
                                                                                                                                                                        layer
                                                                                                                                                                        from
                                                                                                                                                                        database
                                                                                                                                                                        tables,
                                                                                                                                                                        reduces
                                                                                                                                                                        tech
                                                                                                                                                                        debt
                                                                                                                                                                        velocity.
                                                                                                                                                </p>

                                                                                                                                                <div className="flex items-center gap-2 pt-2 border-t">
                                                                                                                                                                        {approved ? (
                                                                                                                                                                                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                                                                                                                                                                                                        <CheckCircle2 className="h-4 w-4" />{' '}
                                                                                                                                                                                                                        Pull
                                                                                                                                                                                                                        Request
                                                                                                                                                                                                                        #142
                                                                                                                                                                                                                        Created
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Automated
                                                                                                                                                                                                                        Branch
                                                                                                                                                                                                                        Ready
                                                                                                                                                                                                </div>
                                                                                                                                                                        ) : (
                                                                                                                                                                                                <>
                                                                                                                                                                                                                        <Button
                                                                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        setApproved(
                                                                                                                                                                                                                                                                                                true
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                                                                Approve
                                                                                                                                                                                                                                                &
                                                                                                                                                                                                                                                Generate
                                                                                                                                                                                                                                                Pull
                                                                                                                                                                                                                                                Request
                                                                                                                                                                                                                        </Button>
                                                                                                                                                                                                                        <Button
                                                                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                                                                variant="outline"
                                                                                                                                                                                                                                                className="text-xs font-bold gap-1 text-muted-foreground"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <XCircle className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                                                                Reject
                                                                                                                                                                                                                                                Action
                                                                                                                                                                                                                        </Button>
                                                                                                                                                                                                </>
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 2: Automated Refactoring Engine */}
                                                                        {activeTab === 'engine' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Automated
                                                                                                                                                                        Refactoring
                                                                                                                                                                        &
                                                                                                                                                                        Patch
                                                                                                                                                                        Engine
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/spe-lab"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Refactoring
                                                                                                                                                                        Lab{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Automated
                                                                                                                                                security
                                                                                                                                                patch
                                                                                                                                                generation,
                                                                                                                                                design
                                                                                                                                                pattern
                                                                                                                                                refactoring,
                                                                                                                                                and
                                                                                                                                                code
                                                                                                                                                modernization
                                                                                                                                                engines.
                                                                                                                        </p>
                                                                                                                        <div className="grid gap-3 md:grid-cols-2 text-xs">
                                                                                                                                                <Link
                                                                                                                                                                        href="/spe"
                                                                                                                                                                        className="p-4 bg-muted/10 rounded-xl border hover:border-primary/50 transition-all space-y-1 block"
                                                                                                                                                >
                                                                                                                                                                        <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                Automated
                                                                                                                                                                                                Security
                                                                                                                                                                                                Patch
                                                                                                                                                                                                Engine
                                                                                                                                                                        </span>
                                                                                                                                                                        <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                Generate
                                                                                                                                                                                                verified
                                                                                                                                                                                                security
                                                                                                                                                                                                patches
                                                                                                                                                                                                for
                                                                                                                                                                                                vulnerable
                                                                                                                                                                                                dependencies
                                                                                                                                                                                                and
                                                                                                                                                                                                code
                                                                                                                                                                                                paths.
                                                                                                                                                                        </p>
                                                                                                                                                </Link>
                                                                                                                                                <Link
                                                                                                                                                                        href="/are"
                                                                                                                                                                        className="p-4 bg-muted/10 rounded-xl border hover:border-primary/50 transition-all space-y-1 block"
                                                                                                                                                >
                                                                                                                                                                        <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                Design
                                                                                                                                                                                                Pattern
                                                                                                                                                                                                Refactoring
                                                                                                                                                                                                Engine
                                                                                                                                                                        </span>
                                                                                                                                                                        <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                Convert
                                                                                                                                                                                                raw
                                                                                                                                                                                                procedural
                                                                                                                                                                                                scripts
                                                                                                                                                                                                into
                                                                                                                                                                                                clean
                                                                                                                                                                                                layered
                                                                                                                                                                                                architecture
                                                                                                                                                                                                pattern
                                                                                                                                                                                                classes.
                                                                                                                                                                        </p>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 3: Autonomous Issue Planner */}
                                                                        {activeTab ===
                                                                                                'autonomous' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Autonomous
                                                                                                                                                                        Issue
                                                                                                                                                                        Resolution
                                                                                                                                                                        Planner
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/autonomous"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Autonomous
                                                                                                                                                                        Platform{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Autonomous
                                                                                                                                                agent
                                                                                                                                                workflow
                                                                                                                                                engine
                                                                                                                                                that
                                                                                                                                                plans,
                                                                                                                                                verifies,
                                                                                                                                                and
                                                                                                                                                executes
                                                                                                                                                end-to-end
                                                                                                                                                issue
                                                                                                                                                resolutions
                                                                                                                                                across
                                                                                                                                                codebase
                                                                                                                                                repositories.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Cpu className="h-10 w-10 text-purple-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        Autonomous
                                                                                                                                                                        Resolution
                                                                                                                                                                        Platform
                                                                                                                                                                        Active
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        View
                                                                                                                                                                        active
                                                                                                                                                                        resolution
                                                                                                                                                                        plans,
                                                                                                                                                                        verification
                                                                                                                                                                        steps,
                                                                                                                                                                        and
                                                                                                                                                                        automated
                                                                                                                                                                        pull
                                                                                                                                                                        requests.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/autonomous">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                Launch
                                                                                                                                                                                                Autonomous
                                                                                                                                                                                                Planner
                                                                                                                                                                                                Studio
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 4: Technical Debt Resolution */}
                                                                        {activeTab === 'debt' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Technical
                                                                                                                                                                        Debt
                                                                                                                                                                        Resolution
                                                                                                                                                                        Studio
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/tech-debt"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Debt
                                                                                                                                                                        Resolution{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Prioritized
                                                                                                                                                technical
                                                                                                                                                debt
                                                                                                                                                payoff
                                                                                                                                                plans,
                                                                                                                                                velocity
                                                                                                                                                tracking,
                                                                                                                                                and
                                                                                                                                                sprint
                                                                                                                                                plan
                                                                                                                                                generation.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Flame className="h-10 w-10 text-amber-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        Technical
                                                                                                                                                                        Debt
                                                                                                                                                                        Payoff
                                                                                                                                                                        Engine
                                                                                                                                                                        Ready
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        Analyze
                                                                                                                                                                        tech
                                                                                                                                                                        debt
                                                                                                                                                                        drag
                                                                                                                                                                        ($18.5k/yr),
                                                                                                                                                                        sprint
                                                                                                                                                                        resolution
                                                                                                                                                                        targets,
                                                                                                                                                                        and
                                                                                                                                                                        code
                                                                                                                                                                        cleanup
                                                                                                                                                                        queues.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/tech-debt">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                Open
                                                                                                                                                                                                Technical
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Resolution
                                                                                                                                                                                                Studio
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
