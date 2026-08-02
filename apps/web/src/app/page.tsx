'use client';

import * as React from 'react';
import Link from 'next/link';
import {
                        Activity,
                        BarChart3,
                        BookOpen,
                        Brain,
                        CheckCircle2,
                        ChevronRight,
                        Clock,
                        Cpu,
                        Database,
                        FileCode,
                        Flame,
                        GitBranch,
                        HeartPulse,
                        Layers,
                        Network,
                        Orbit,
                        Plus,
                        RefreshCw,
                        ShieldAlert,
                        ShieldCheck,
                        Sparkles,
                        Zap,
                        Search,
                        SlidersHorizontal,
                        ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { IndexingProgress } from '@/components/ui/indexing-progress';

export default function Home() {
                        const { token } = useAuth();
                        const [repositories, setRepositories] = React.useState<any[]>([]);
                        const [selectedRepoId, setSelectedRepoId] =
                                                React.useState<string>('Spoon-Knife');
                        const [isRegistering, setIsRegistering] = React.useState<boolean>(false);
                        const [isIndexing, setIsIndexing] = React.useState<boolean>(false);
                        const [newRepoName, setNewRepoName] = React.useState<string>('');
                        const [newFullName, setNewFullName] = React.useState<string>('');

                        React.useEffect(() => {
                                                if (!token) return;
                                                fetch('/api/v1/repositories', {
                                                                        headers: {
                                                                                                Authorization: `Bearer ${token}`,
                                                                        },
                                                })
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                const repos =
                                                                                                                        Array.isArray(
                                                                                                                                                data
                                                                                                                        )
                                                                                                                                                ? data
                                                                                                                                                : data.items ||
                                                                                                                                                  [];
                                                                                                setRepositories(
                                                                                                                        repos
                                                                                                );
                                                                                                if (
                                                                                                                        repos.length >
                                                                                                                        0
                                                                                                )
                                                                                                                        setSelectedRepoId(
                                                                                                                                                repos[0]
                                                                                                                                                                        .id ||
                                                                                                                                                                        'Spoon-Knife'
                                                                                                                        );
                                                                        })
                                                                        .catch(console.error);
                        }, [token]);

                        const handleRegisterSubmit = (e: React.FormEvent) => {
                                                e.preventDefault();
                                                setIsRegistering(false);
                                                setIsIndexing(true);
                        };

                        const recentActivity = [
                                                {
                                                                        time: '10 mins ago',
                                                                        event: 'Continuous AST index updated (35 files, 4,500 LOC)',
                                                                        repo: 'CodeAtlas Core',
                                                                        author: 'AI Indexer',
                                                },
                                                {
                                                                        time: '1 hour ago',
                                                                        event: 'SOC2 Type II compliance check passed (96%)',
                                                                        repo: 'Payments Pod',
                                                                        author: 'Security Bot',
                                                },
                                                {
                                                                        time: '3 hours ago',
                                                                        event: 'Architecture drift alert resolved',
                                                                        repo: 'Auth Gateway',
                                                                        author: 'Lead Architect',
                                                },
                                                {
                                                                        time: 'Yesterday',
                                                                        event: 'DORA Elite Performer status verified',
                                                                        repo: 'Global Suite',
                                                                        author: 'CTO Briefing',
                                                },
                        ];

                        const aiRecommendations = [
                                                {
                                                                        title: 'Decouple REST Router SQL Queries',
                                                                        impact: '$18.5k/yr Debt Drag',
                                                                        confidence: '95.8%',
                                                                        effort: '2 hrs',
                                                },
                                                {
                                                                        title: 'Upgrade Pydantic V1 Class-based Configs',
                                                                        impact: 'Zero Deprecation Warnings',
                                                                        confidence: '99.1%',
                                                                        effort: '1 hr',
                                                },
                                                {
                                                                        title: 'Deploy Redis Cluster for Auth Cache',
                                                                        impact: '+350% Throughput',
                                                                        confidence: '94.2%',
                                                                        effort: '4 hrs',
                                                },
                        ];

                        const recentScans = [
                                                {
                                                                        id: 'scan-109',
                                                                        name: 'AST Delta Index Scan',
                                                                        target: 'FastAPI Routers',
                                                                        result: 'PASSED',
                                                                        time: '10m ago',
                                                },
                                                {
                                                                        id: 'scan-108',
                                                                        name: 'Dependency CVE Audit',
                                                                        target: 'pnpm-lock.yaml',
                                                                        result: '0 CVES',
                                                                        time: '1h ago',
                                                },
                                                {
                                                                        id: 'scan-107',
                                                                        name: 'Clean Architecture Audit',
                                                                        target: 'Layer Boundaries',
                                                                        result: '94.0% CLEAN',
                                                                        time: '3h ago',
                                                },
                        ];

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        {/* Dashboard Top Header & Quick Action Bar */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        Software
                                                                                                                                                                        Intelligence
                                                                                                                                                                        Dashboard
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1">
                                                                                                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{' '}
                                                                                                                                                                        LIVE
                                                                                                                                                                        SYSTEM
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Unified
                                                                                                                                                operational
                                                                                                                                                overview
                                                                                                                                                of
                                                                                                                                                repository
                                                                                                                                                health,
                                                                                                                                                active
                                                                                                                                                analysis,
                                                                                                                                                architecture,
                                                                                                                                                and
                                                                                                                                                AI
                                                                                                                                                recommendations.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* Quick Actions */}
                                                                                                <div className="flex flex-wrap items-center gap-3">
                                                                                                                        <Button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setIsIndexing(
                                                                                                                                                                                                true
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                variant="outline"
                                                                                                                                                className="text-xs font-bold gap-1.5"
                                                                                                                        >
                                                                                                                                                <RefreshCw className="h-3.5 w-3.5" />{' '}
                                                                                                                                                Scan
                                                                                                                                                Repository
                                                                                                                        </Button>
                                                                                                                        <Button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setIsRegistering(
                                                                                                                                                                                                true
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow hover:opacity-90 transition-all flex items-center gap-2"
                                                                                                                        >
                                                                                                                                                <Plus className="h-4 w-4" />{' '}
                                                                                                                                                Add
                                                                                                                                                Repository
                                                                                                                        </Button>
                                                                                                                        <Link
                                                                                                                                                href="/monitor"
                                                                                                                                                className="px-4 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow transition-all flex items-center gap-2"
                                                                                                                        >
                                                                                                                                                <Orbit className="h-4 w-4" />{' '}
                                                                                                                                                Monitor
                                                                                                                                                Command
                                                                                                                        </Link>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Animated Progress HUD modal when triggered */}
                                                                        {isIndexing && (
                                                                                                <IndexingProgress
                                                                                                                        repoName={
                                                                                                                                                newRepoName ||
                                                                                                                                                'Spoon-Knife'
                                                                                                                        }
                                                                                                                        onComplete={() =>
                                                                                                                                                setIsIndexing(
                                                                                                                                                                        false
                                                                                                                                                )
                                                                                                                        }
                                                                                                />
                                                                        )}

                                                                        {/* Register Repo Modal */}
                                                                        {isRegistering && (
                                                                                                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                                                                                                                        <div className="bg-card border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                                                                                                                                                <h3 className="text-lg font-black text-foreground">
                                                                                                                                                                        Add
                                                                                                                                                                        Git
                                                                                                                                                                        Repository
                                                                                                                                                </h3>
                                                                                                                                                <form
                                                                                                                                                                        onSubmit={
                                                                                                                                                                                                handleRegisterSubmit
                                                                                                                                                                        }
                                                                                                                                                                        className="space-y-3 text-xs"
                                                                                                                                                >
                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="font-bold text-muted-foreground block mb-1">
                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                        Name
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="text"
                                                                                                                                                                                                                        required
                                                                                                                                                                                                                        placeholder="e.g. CodeAtlas Core"
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                newRepoName
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setNewRepoName(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full px-3 py-2 border rounded-xl bg-muted/20 text-foreground outline-none focus:ring-2 focus:ring-primary"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="font-bold text-muted-foreground block mb-1">
                                                                                                                                                                                                                        Full
                                                                                                                                                                                                                        Name
                                                                                                                                                                                                                        (owner/repo)
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="text"
                                                                                                                                                                                                                        required
                                                                                                                                                                                                                        placeholder="e.g. octocat/Spoon-Knife"
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                newFullName
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setNewFullName(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full px-3 py-2 border rounded-xl bg-muted/20 text-foreground outline-none focus:ring-2 focus:ring-primary"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-end gap-2 pt-2">
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        type="button"
                                                                                                                                                                                                                        variant="outline"
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setIsRegistering(
                                                                                                                                                                                                                                                                        false
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                >
                                                                                                                                                                                                                        Cancel
                                                                                                                                                                                                </Button>
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        type="submit"
                                                                                                                                                                                                                        className="bg-primary text-primary-foreground font-bold"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        Start
                                                                                                                                                                                                                        Analysis
                                                                                                                                                                                                </Button>
                                                                                                                                                                        </div>
                                                                                                                                                </form>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* Section 1: Repository Health & Key Stats */}
                                                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                                                                                {/* 1. Repository Health */}
                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm relative overflow-hidden">
                                                                                                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                                                                                                                <span className="font-extrabold uppercase tracking-wider">
                                                                                                                                                                        Repository
                                                                                                                                                                        Health
                                                                                                                                                </span>
                                                                                                                                                <HeartPulse className="h-4 w-4 text-emerald-400" />
                                                                                                                        </div>
                                                                                                                        <div className="flex items-baseline gap-2">
                                                                                                                                                <h3 className="text-3xl font-black text-foreground">
                                                                                                                                                                        88.5
                                                                                                                                                </h3>
                                                                                                                                                <span className="text-xs font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                                                                                                                                        GRADE
                                                                                                                                                                        A-
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-[11px] text-muted-foreground">
                                                                                                                                                Zero
                                                                                                                                                critical
                                                                                                                                                architecture
                                                                                                                                                violations
                                                                                                                                                detected.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* 2. Technical Debt & Risk Summary */}
                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                                                                                                                <span className="font-extrabold uppercase tracking-wider">
                                                                                                                                                                        Risk
                                                                                                                                                                        Summary
                                                                                                                                                </span>
                                                                                                                                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                                                                                                        </div>
                                                                                                                        <div className="flex items-baseline gap-2">
                                                                                                                                                <h3 className="text-3xl font-black text-foreground">
                                                                                                                                                                        LOW
                                                                                                                                                </h3>
                                                                                                                                                <span className="text-xs font-bold text-emerald-400">
                                                                                                                                                                        0
                                                                                                                                                                        CRITICAL
                                                                                                                                                                        CVES
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-[11px] text-muted-foreground">
                                                                                                                                                Debt
                                                                                                                                                velocity:
                                                                                                                                                +2.4h/wk
                                                                                                                                                ($18.5k/yr
                                                                                                                                                drag).
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* 3. Architecture Overview */}
                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                                                                                                                <span className="font-extrabold uppercase tracking-wider">
                                                                                                                                                                        Architecture
                                                                                                                                                                        Boundary
                                                                                                                                                </span>
                                                                                                                                                <Layers className="h-4 w-4 text-indigo-400" />
                                                                                                                        </div>
                                                                                                                        <div className="flex items-baseline gap-2">
                                                                                                                                                <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                        94.0%
                                                                                                                                                </h3>
                                                                                                                                                <span className="text-xs font-bold text-indigo-400">
                                                                                                                                                                        CLEAN
                                                                                                                                                                        SCORE
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-[11px] text-muted-foreground">
                                                                                                                                                Modular
                                                                                                                                                Monolith
                                                                                                                                                →
                                                                                                                                                Microservice
                                                                                                                                                ready.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* 4. Active Analysis & Performance */}
                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                                                                                                                <span className="font-extrabold uppercase tracking-wider">
                                                                                                                                                                        Active
                                                                                                                                                                        Analysis
                                                                                                                                                </span>
                                                                                                                                                <Activity className="h-4 w-4 text-primary" />
                                                                                                                        </div>
                                                                                                                        <div className="flex items-baseline gap-2">
                                                                                                                                                <h3 className="text-xl font-black text-foreground">
                                                                                                                                                                        SUB-120MS
                                                                                                                                                </h3>
                                                                                                                                                <span className="text-xs font-bold text-emerald-400">
                                                                                                                                                                        DELTA
                                                                                                                                                                        SYNC
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-[11px] text-muted-foreground">
                                                                                                                                                35
                                                                                                                                                files,
                                                                                                                                                128
                                                                                                                                                dependencies
                                                                                                                                                indexed.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Section 2: AI Recommendations & Recent Activity */}
                                                                        <div className="grid gap-6 md:grid-cols-3">
                                                                                                {/* AI Recommendations (2 cols) */}
                                                                                                <div className="md:col-span-2 border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <div className="flex items-center gap-2">
                                                                                                                                                                        <Sparkles className="h-5 w-5 text-indigo-400" />
                                                                                                                                                                        <h3 className="text-base font-black text-foreground">
                                                                                                                                                                                                AI
                                                                                                                                                                                                Recommendations
                                                                                                                                                                        </h3>
                                                                                                                                                </div>
                                                                                                                                                <Link
                                                                                                                                                                        href="/improve"
                                                                                                                                                                        className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Improve
                                                                                                                                                                        Queue{' '}
                                                                                                                                                                        <ChevronRight className="h-3 w-3" />
                                                                                                                                                </Link>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3">
                                                                                                                                                {aiRecommendations.map(
                                                                                                                                                                        (
                                                                                                                                                                                                rec,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="border rounded-xl p-4 bg-muted/10 hover:border-primary/40 transition-all space-y-2"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex justify-between items-start">
                                                                                                                                                                                                                                                <h4 className="text-sm font-extrabold text-foreground">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                rec.title
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </h4>
                                                                                                                                                                                                                                                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                rec.confidence
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        CONFIDENCE
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Impact:{' '}
                                                                                                                                                                                                                                                                        <strong className="text-foreground">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        rec.impact
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Effort:{' '}
                                                                                                                                                                                                                                                                        <strong className="text-foreground">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        rec.effort
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Recent Activity (1 col) */}
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <div className="flex items-center gap-2">
                                                                                                                                                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                                                                                                                                                        <h3 className="text-base font-black text-foreground">
                                                                                                                                                                                                Recent
                                                                                                                                                                                                Activity
                                                                                                                                                                        </h3>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-4 text-xs">
                                                                                                                                                {recentActivity.map(
                                                                                                                                                                        (
                                                                                                                                                                                                act,
                                                                                                                                                                                                i
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="space-y-1 relative pl-4 border-l-2 border-primary/30"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex justify-between text-[11px] text-muted-foreground">
                                                                                                                                                                                                                                                <span className="font-bold text-foreground">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                act.repo
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                act.time
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <p className="text-muted-foreground leading-snug">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        act.event
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                        <span className="text-[10px] text-primary font-mono block">
                                                                                                                                                                                                                                                By:{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        act.author
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Section 3: Recent Scans History Table */}
                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                <div className="flex justify-between items-center border-b pb-3">
                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                <Database className="h-5 w-5 text-indigo-400" />
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Recent
                                                                                                                                                                        Scans
                                                                                                                                                                        History
                                                                                                                                                </h3>
                                                                                                                        </div>
                                                                                                                        <Link
                                                                                                                                                href="/analyze"
                                                                                                                                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                        >
                                                                                                                                                Analyze
                                                                                                                                                Workflow{' '}
                                                                                                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                                                                                        </Link>
                                                                                                </div>

                                                                                                <div className="grid gap-3 md:grid-cols-3 text-xs">
                                                                                                                        {recentScans.map(
                                                                                                                                                (
                                                                                                                                                                        scan
                                                                                                                                                ) => (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        scan.id
                                                                                                                                                                                                }
                                                                                                                                                                                                className="border rounded-xl p-3.5 bg-muted/10 space-y-1"
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                        <span className="font-extrabold text-foreground">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        scan.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        scan.result
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                        Target:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                scan.target
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                                                <span className="text-[10px] text-muted-foreground/70 font-mono block">
                                                                                                                                                                                                                        Scanned{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                scan.time
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
