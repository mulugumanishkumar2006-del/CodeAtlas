'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
                        ShieldAlert,
                        ShieldCheck,
                        HeartPulse,
                        Activity,
                        Orbit,
                        BarChart3,
                        Award,
                        ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MonitorWorkflowPage() {
                        const [activeTab, setActiveTab] = useState<
                                                'mission' | 'security' | 'health' | 'dora'
                        >('mission');

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        {/* Top Header */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        🛡️
                                                                                                                                                                        Monitor
                                                                                                                                                                        Workflow
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        SRE
                                                                                                                                                                        &
                                                                                                                                                                        COMPLIANCE
                                                                                                                                                                        COMMAND
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Continuous
                                                                                                                                                security
                                                                                                                                                posture
                                                                                                                                                monitoring,
                                                                                                                                                SOC2/ISO27001
                                                                                                                                                regulatory
                                                                                                                                                mapping,
                                                                                                                                                SRE
                                                                                                                                                uptime
                                                                                                                                                scorecards,
                                                                                                                                                and
                                                                                                                                                Mission
                                                                                                                                                Control
                                                                                                                                                telemetry.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Sub-Workflow Navigation Tabs */}
                                                                        <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto">
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'mission'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'mission'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Orbit className="h-4 w-4 text-indigo-400" />{' '}
                                                                                                                        Mission
                                                                                                                        Control
                                                                                                                        Operational
                                                                                                                        HUD
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'security'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'security'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <ShieldCheck className="h-4 w-4 text-emerald-400" />{' '}
                                                                                                                        Security
                                                                                                                        &
                                                                                                                        Regulatory
                                                                                                                        Posture
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'health'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'health'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <HeartPulse className="h-4 w-4 text-rose-400" />{' '}
                                                                                                                        System
                                                                                                                        Health
                                                                                                                        &
                                                                                                                        Reliability
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'dora'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'dora'
                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Award className="h-4 w-4 text-amber-400" />{' '}
                                                                                                                        DORA
                                                                                                                        &
                                                                                                                        Benchmarks
                                                                                                </button>
                                                                        </div>

                                                                        {/* TAB CONTENT 1: Mission Control */}
                                                                        {activeTab ===
                                                                                                'mission' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Mission
                                                                                                                                                                        Control
                                                                                                                                                                        Operational
                                                                                                                                                                        HUD
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/mission-control"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Mission
                                                                                                                                                                        Control
                                                                                                                                                                        Studio{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Unified
                                                                                                                                                real-time
                                                                                                                                                telemetry
                                                                                                                                                HUD
                                                                                                                                                tracking
                                                                                                                                                active
                                                                                                                                                repository
                                                                                                                                                indexers,
                                                                                                                                                security
                                                                                                                                                compliance,
                                                                                                                                                architecture
                                                                                                                                                drift,
                                                                                                                                                and
                                                                                                                                                autonomous
                                                                                                                                                background
                                                                                                                                                services.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Orbit className="h-10 w-10 text-indigo-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        Mission
                                                                                                                                                                        Control
                                                                                                                                                                        HUD
                                                                                                                                                                        Live
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        View
                                                                                                                                                                        complete
                                                                                                                                                                        operational
                                                                                                                                                                        telemetry,
                                                                                                                                                                        active
                                                                                                                                                                        background
                                                                                                                                                                        workers,
                                                                                                                                                                        and
                                                                                                                                                                        real-time
                                                                                                                                                                        status
                                                                                                                                                                        feeds.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/mission-control">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                Launch
                                                                                                                                                                                                Mission
                                                                                                                                                                                                Control
                                                                                                                                                                                                HUD
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 2: Security & Regulatory Posture */}
                                                                        {activeTab ===
                                                                                                'security' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid gap-6 md:grid-cols-3">
                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                                                                                                                                                                                SOC2
                                                                                                                                                                                                Type
                                                                                                                                                                                                II
                                                                                                                                                                                                Compliance
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                96.0%
                                                                                                                                                                                                COMPLIANT
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                6/6
                                                                                                                                                                                                Secure
                                                                                                                                                                                                SDLC
                                                                                                                                                                                                checks
                                                                                                                                                                                                passed
                                                                                                                                                                                                cleanly.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                                                                                                                                                                                SLA
                                                                                                                                                                                                Target
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-emerald-400">
                                                                                                                                                                                                99.98%
                                                                                                                                                                                                SLA
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                MTBF:
                                                                                                                                                                                                1,420
                                                                                                                                                                                                hours.
                                                                                                                                                                                                Circuit
                                                                                                                                                                                                breakers
                                                                                                                                                                                                active.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                                                                                                                                                                Repository
                                                                                                                                                                                                Certification
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-xl font-black text-foreground">
                                                                                                                                                                                                ENTERPRISE
                                                                                                                                                                                                GRADE
                                                                                                                                                                                                A
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Certified
                                                                                                                                                                                                for
                                                                                                                                                                                                production
                                                                                                                                                                                                deployment.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                <div className="flex justify-between items-center border-b pb-2">
                                                                                                                                                                        <h3 className="text-base font-black text-foreground">
                                                                                                                                                                                                Dedicated
                                                                                                                                                                                                Security
                                                                                                                                                                                                Posture
                                                                                                                                                                                                Engine
                                                                                                                                                                        </h3>
                                                                                                                                                                        <Link
                                                                                                                                                                                                href="/security"
                                                                                                                                                                                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                                        >
                                                                                                                                                                                                View
                                                                                                                                                                                                Security
                                                                                                                                                                                                Center{' '}
                                                                                                                                                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                                        </Link>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                        Vulnerability
                                                                                                                                                                        scanning,
                                                                                                                                                                        dependency
                                                                                                                                                                        CVE
                                                                                                                                                                        audits,
                                                                                                                                                                        secrets
                                                                                                                                                                        detection,
                                                                                                                                                                        and
                                                                                                                                                                        compliance
                                                                                                                                                                        rule
                                                                                                                                                                        verification.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 3: System Health & Reliability */}
                                                                        {activeTab === 'health' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        System
                                                                                                                                                                        Health
                                                                                                                                                                        &
                                                                                                                                                                        SRE
                                                                                                                                                                        Reliability
                                                                                                                                                                        Intelligence
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/health-intelligence"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Health
                                                                                                                                                                        Intelligence{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                SRE
                                                                                                                                                scorecards,
                                                                                                                                                availability
                                                                                                                                                metrics,
                                                                                                                                                error
                                                                                                                                                budget
                                                                                                                                                burn
                                                                                                                                                rates,
                                                                                                                                                and
                                                                                                                                                automated
                                                                                                                                                health
                                                                                                                                                checks.
                                                                                                                        </p>
                                                                                                                        <div className="grid gap-3 md:grid-cols-2 text-xs">
                                                                                                                                                <Link
                                                                                                                                                                        href="/health"
                                                                                                                                                                        className="p-4 bg-muted/10 rounded-xl border hover:border-primary/50 transition-all space-y-1 block"
                                                                                                                                                >
                                                                                                                                                                        <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                System
                                                                                                                                                                                                Health
                                                                                                                                                                                                Scorecard
                                                                                                                                                                        </span>
                                                                                                                                                                        <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                Real-time
                                                                                                                                                                                                evaluation
                                                                                                                                                                                                of
                                                                                                                                                                                                error
                                                                                                                                                                                                budgets,
                                                                                                                                                                                                service
                                                                                                                                                                                                health,
                                                                                                                                                                                                and
                                                                                                                                                                                                API
                                                                                                                                                                                                latency.
                                                                                                                                                                        </p>
                                                                                                                                                </Link>
                                                                                                                                                <Link
                                                                                                                                                                        href="/reliability"
                                                                                                                                                                        className="p-4 bg-muted/10 rounded-xl border hover:border-primary/50 transition-all space-y-1 block"
                                                                                                                                                >
                                                                                                                                                                        <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                Reliability
                                                                                                                                                                                                &
                                                                                                                                                                                                Circuit
                                                                                                                                                                                                Breakers
                                                                                                                                                                        </span>
                                                                                                                                                                        <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                Circuit
                                                                                                                                                                                                breaker
                                                                                                                                                                                                status,
                                                                                                                                                                                                fallback
                                                                                                                                                                                                mechanisms,
                                                                                                                                                                                                and
                                                                                                                                                                                                resilience
                                                                                                                                                                                                testing.
                                                                                                                                                                        </p>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 4: DORA & Benchmarks */}
                                                                        {activeTab === 'dora' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        DORA
                                                                                                                                                                        Metrics
                                                                                                                                                                        &
                                                                                                                                                                        Enterprise
                                                                                                                                                                        Benchmarking
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/benchmarking"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Benchmarking
                                                                                                                                                                        Suite{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Deployment
                                                                                                                                                frequency,
                                                                                                                                                lead
                                                                                                                                                time
                                                                                                                                                for
                                                                                                                                                changes,
                                                                                                                                                change
                                                                                                                                                failure
                                                                                                                                                rate,
                                                                                                                                                and
                                                                                                                                                mean
                                                                                                                                                time
                                                                                                                                                to
                                                                                                                                                recovery
                                                                                                                                                (MTTR)
                                                                                                                                                analytics.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Award className="h-10 w-10 text-amber-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        DORA
                                                                                                                                                                        Elite
                                                                                                                                                                        Performer
                                                                                                                                                                        Certified
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        Deployment
                                                                                                                                                                        Frequency:
                                                                                                                                                                        &gt;
                                                                                                                                                                        10/day
                                                                                                                                                                        |
                                                                                                                                                                        Lead
                                                                                                                                                                        Time:
                                                                                                                                                                        &lt;
                                                                                                                                                                        1
                                                                                                                                                                        hour
                                                                                                                                                                        |
                                                                                                                                                                        MTTR:
                                                                                                                                                                        &lt;
                                                                                                                                                                        15
                                                                                                                                                                        mins.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/benchmarking">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                View
                                                                                                                                                                                                Complete
                                                                                                                                                                                                DORA
                                                                                                                                                                                                Benchmarks
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
