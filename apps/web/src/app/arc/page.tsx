'use client';

import React, { useState } from 'react';
import {
                        Rocket,
                        Shield,
                        Zap,
                        CheckCircle2,
                        AlertTriangle,
                        RotateCcw,
                        Play,
                        Activity,
                        Award,
                        Database,
                        Server,
                        TrendingUp,
                        Clock,
                        ChevronRight,
                        ShieldCheck,
                        Flame,
                        Globe,
                        Lock,
                        GitBranch,
                        Terminal,
                        Layers,
                        Radio,
                        BarChart3,
                        ListCheck,
                        AlertCircle,
                        FileCode,
                        ShieldAlert,
                        Cpu,
                        Boxes,
                        FileText,
                        KeyRound,
                        Users,
                        Calendar,
                        Compass,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function AIReleaseCommanderPage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'control_tower'
                                                | 'global_center'
                                                | 'multi_team'
                                                | 'breaking_changes'
                                                | 'env_parity'
                                                | 'release_notes'
                                                | 'secrets_audit'
                                                | 'slo_budget'
                                                | 'canary'
                                                | 'rollback'
                        >('control_tower');
                        const [releaseVersion, setReleaseVersion] = useState<string>('v3.2.0');
                        const [canaryTrafficPct, setCanaryTrafficPct] = useState<number>(10);
                        const [isDeploying, setIsDeploying] = useState<boolean>(false);
                        const [deploymentAuthorized, setDeploymentAuthorized] =
                                                useState<boolean>(false);

                        const handleAuthorizeDeployment = () => {
                                                setIsDeploying(true);
                                                setTimeout(() => {
                                                                        setIsDeploying(false);
                                                                        setDeploymentAuthorized(
                                                                                                true
                                                                        );
                                                }, 1200);
                        };

                        return (
                                                <DashboardLayout>
                                                                        <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-6 space-y-6">
                                                                                                {/* Top Title Banner */}
                                                                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 p-6 rounded-2xl border border-emerald-800/40 shadow-2xl backdrop-blur-md">
                                                                                                                        <div className="space-y-1">
                                                                                                                                                <div className="flex items-center space-x-3">
                                                                                                                                                                        <div className="p-2.5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl">
                                                                                                                                                                                                <Rocket className="w-7 h-7 text-emerald-400 animate-bounce" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                                                                                                                        <h1 className="text-2xl font-bold tracking-tight text-white">
                                                                                                                                                                                                                                                AI
                                                                                                                                                                                                                                                Release
                                                                                                                                                                                                                                                Commander
                                                                                                                                                                                                                                                (ARC)
                                                                                                                                                                                                                        </h1>
                                                                                                                                                                                                                        <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full">
                                                                                                                                                                                                                                                Phase
                                                                                                                                                                                                                                                33
                                                                                                                                                                                                                                                —
                                                                                                                                                                                                                                                60
                                                                                                                                                                                                                                                Features
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-sm text-gray-400">
                                                                                                                                                                                                                        Global
                                                                                                                                                                                                                        Release
                                                                                                                                                                                                                        Control
                                                                                                                                                                                                                        Center:
                                                                                                                                                                                                                        Predicts,
                                                                                                                                                                                                                        Validates,
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        Orchestrates
                                                                                                                                                                                                                        Software
                                                                                                                                                                                                                        Releases
                                                                                                                                                                                                                        Before
                                                                                                                                                                                                                        Production
                                                                                                                                                                                                                        Deployment
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center space-x-3">
                                                                                                                                                <button
                                                                                                                                                                        onClick={
                                                                                                                                                                                                handleAuthorizeDeployment
                                                                                                                                                                        }
                                                                                                                                                                        disabled={
                                                                                                                                                                                                isDeploying ||
                                                                                                                                                                                                deploymentAuthorized
                                                                                                                                                                        }
                                                                                                                                                                        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                                                                                                                                                >
                                                                                                                                                                        {isDeploying ? (
                                                                                                                                                                                                <RotateCcw className="w-4 h-4 animate-spin" />
                                                                                                                                                                        ) : deploymentAuthorized ? (
                                                                                                                                                                                                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                                                                                                                                                                        ) : (
                                                                                                                                                                                                <Rocket className="w-4 h-4" />
                                                                                                                                                                        )}
                                                                                                                                                                        <span>
                                                                                                                                                                                                {isDeploying
                                                                                                                                                                                                                        ? 'Orchestrating Release...'
                                                                                                                                                                                                                        : deploymentAuthorized
                                                                                                                                                                                                                          ? 'Release v3.2.0 Authorized ✓'
                                                                                                                                                                                                                          : 'Authorize Production Deployment'}
                                                                                                                                                                        </span>
                                                                                                                                                </button>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Top Key Performance Metric Cards */}
                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Overall
                                                                                                                                                                                                Readiness
                                                                                                                                                                        </span>
                                                                                                                                                                        <Award className="w-5 h-5 text-emerald-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-white">
                                                                                                                                                                        94
                                                                                                                                                                        <span className="text-lg text-gray-400 font-normal">
                                                                                                                                                                                                %
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-emerald-400 font-medium mt-1">
                                                                                                                                                                        APPROVED
                                                                                                                                                                        FOR
                                                                                                                                                                        PRODUCTION
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Deployment
                                                                                                                                                                                                Risk
                                                                                                                                                                        </span>
                                                                                                                                                                        <Shield className="w-5 h-5 text-emerald-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-emerald-300">
                                                                                                                                                                        LOW
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-gray-400 font-medium mt-1">
                                                                                                                                                                        Incident
                                                                                                                                                                        Risk:
                                                                                                                                                                        4%
                                                                                                                                                                        •
                                                                                                                                                                        Rollback
                                                                                                                                                                        Risk:
                                                                                                                                                                        2%
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Confidence
                                                                                                                                                                        </span>
                                                                                                                                                                        <Activity className="w-5 h-5 text-indigo-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-indigo-300">
                                                                                                                                                                        96
                                                                                                                                                                        <span className="text-lg text-gray-400 font-normal">
                                                                                                                                                                                                %
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-indigo-400 font-medium mt-1">
                                                                                                                                                                        94.5%
                                                                                                                                                                        Test
                                                                                                                                                                        Coverage
                                                                                                                                                                        Verified
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Est.
                                                                                                                                                                                                Deployment
                                                                                                                                                                                                Duration
                                                                                                                                                                        </span>
                                                                                                                                                                        <Clock className="w-5 h-5 text-amber-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-amber-300">
                                                                                                                                                                        12{' '}
                                                                                                                                                                        <span className="text-xs text-gray-400 font-normal">
                                                                                                                                                                                                Minutes
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-amber-400 font-medium mt-1">
                                                                                                                                                                        Automated
                                                                                                                                                                        Canary
                                                                                                                                                                        Rollout
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Navigation Tabs */}
                                                                                                <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1">
                                                                                                                        {[
                                                                                                                                                {
                                                                                                                                                                        id: 'control_tower',
                                                                                                                                                                        label: '🗼 AI Deployment Control Tower',
                                                                                                                                                                        icon: Rocket,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'global_center',
                                                                                                                                                                        label: '🌐 Global Release Control Center',
                                                                                                                                                                        icon: Globe,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'multi_team',
                                                                                                                                                                        label: '👥 Multi-Team Approvals',
                                                                                                                                                                        icon: Users,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'breaking_changes',
                                                                                                                                                                        label: '🚨 Breaking Changes & DB',
                                                                                                                                                                        icon: FileCode,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'env_parity',
                                                                                                                                                                        label: '⚡ Env Parity & K8s',
                                                                                                                                                                        icon: Boxes,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'release_notes',
                                                                                                                                                                        label: '📝 Release Notes',
                                                                                                                                                                        icon: FileText,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'secrets_audit',
                                                                                                                                                                        label: '🔑 Secrets Audit',
                                                                                                                                                                        icon: KeyRound,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'canary',
                                                                                                                                                                        label: '🐤 Canary & Flags',
                                                                                                                                                                        icon: Radio,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'rollback',
                                                                                                                                                                        label: '🔄 Rollback Strategy',
                                                                                                                                                                        icon: RotateCcw,
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
                                                                                                                                                                                                                                                ? 'border-emerald-500 text-emerald-300 bg-slate-900/90'
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

                                                                                                {/* Tab 0: Signature AI Deployment Control Tower */}
                                                                                                {activeTab ===
                                                                                                                        'control_tower' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                                                                                                                                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                                                                                                                                                                                                                                <Rocket className="w-6 h-6 text-emerald-400" />
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Signature
                                                                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                                                                        Deployment
                                                                                                                                                                                                                                                                        Control
                                                                                                                                                                                                                                                                        Tower
                                                                                                                                                                                                                                                                        Briefing
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </h2>
                                                                                                                                                                                                                        <p className="text-xs text-gray-400 font-sans">
                                                                                                                                                                                                                                                Pre-deployment
                                                                                                                                                                                                                                                engineering
                                                                                                                                                                                                                                                intelligence
                                                                                                                                                                                                                                                briefing
                                                                                                                                                                                                                                                before
                                                                                                                                                                                                                                                production
                                                                                                                                                                                                                                                release
                                                                                                                                                                                                                                                authorization.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
                                                                                                                                                                                                                        <span className="text-gray-400 font-semibold">
                                                                                                                                                                                                                                                Release
                                                                                                                                                                                                                                                Target:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-emerald-300 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        releaseVersion
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Exact Control Tower Display Match */}
                                                                                                                                                                        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto space-y-5 shadow-2xl font-mono text-sm">
                                                                                                                                                                                                <div className="text-center pb-3 border-b border-slate-800">
                                                                                                                                                                                                                        <div className="text-xs text-gray-500 uppercase tracking-widest">
                                                                                                                                                                                                                                                Release
                                                                                                                                                                                                                                                Version
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-2xl font-bold text-emerald-400">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        releaseVersion
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                                                                                                                                                                                                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                <div className="text-xs text-gray-400">
                                                                                                                                                                                                                                                                        Readiness
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-xl font-extrabold text-white">
                                                                                                                                                                                                                                                                        94%
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                <div className="text-xs text-gray-400">
                                                                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-xl font-extrabold text-emerald-400">
                                                                                                                                                                                                                                                                        LOW
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                <div className="text-xs text-gray-400">
                                                                                                                                                                                                                                                                        Incident
                                                                                                                                                                                                                                                                        Prob
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-xl font-extrabold text-indigo-300">
                                                                                                                                                                                                                                                                        4%
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                <div className="text-xs text-gray-400">
                                                                                                                                                                                                                                                                        Rollback
                                                                                                                                                                                                                                                                        Prob
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-xl font-extrabold text-purple-300">
                                                                                                                                                                                                                                                                        2%
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="text-center pt-1 text-xs text-indigo-300">
                                                                                                                                                                                                                        Confidence:{' '}
                                                                                                                                                                                                                        <span className="font-bold text-white">
                                                                                                                                                                                                                                                96%
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                {/* Recommended Actions Checklist */}
                                                                                                                                                                                                <div className="pt-4 border-t border-slate-800 space-y-2">
                                                                                                                                                                                                                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">
                                                                                                                                                                                                                                                Recommended
                                                                                                                                                                                                                                                Actions
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        {[
                                                                                                                                                                                                                                                '✓ Database migration approved',
                                                                                                                                                                                                                                                '✓ Canary rollout 10%',
                                                                                                                                                                                                                                                '✓ Enable Feature Flag X',
                                                                                                                                                                                                                                                '✓ Monitor Payment API',
                                                                                                                                                                                                                                                '✓ Scale Redis before rollout',
                                                                                                                                                                                                                        ].map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        action,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="flex items-center space-x-2 text-xs text-emerald-300"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                action
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                                                                                                                                                                                                                        <span className="text-gray-400">
                                                                                                                                                                                                                                                Estimated
                                                                                                                                                                                                                                                Deployment
                                                                                                                                                                                                                                                Time:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-bold text-amber-300">
                                                                                                                                                                                                                                                12
                                                                                                                                                                                                                                                Minutes
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* Tab 1: Global Release Control Center */}
                                                                                                {activeTab ===
                                                                                                                        'global_center' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                                                                                                                                                                                                        <Globe className="w-5 h-5 text-emerald-400" />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Feature
                                                                                                                                                                                                                                                60:
                                                                                                                                                                                                                                                Global
                                                                                                                                                                                                                                                Release
                                                                                                                                                                                                                                                Control
                                                                                                                                                                                                                                                Center
                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                AI
                                                                                                                                                                                                                                                Deployment
                                                                                                                                                                                                                                                Advisor
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </h2>
                                                                                                                                                                                                <p className="text-xs text-gray-400">
                                                                                                                                                                                                                        Release
                                                                                                                                                                                                                        conflict
                                                                                                                                                                                                                        detection,
                                                                                                                                                                                                                        maintenance
                                                                                                                                                                                                                        window
                                                                                                                                                                                                                        optimizer,
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        chaos
                                                                                                                                                                                                                        test
                                                                                                                                                                                                                        verification
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold">
                                                                                                                                                                                                CLEARED
                                                                                                                                                                                                FOR
                                                                                                                                                                                                GLOBAL
                                                                                                                                                                                                ROLLOUT
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                                                                                                                                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                <div className="text-gray-400">
                                                                                                                                                                                                                        Release
                                                                                                                                                                                                                        Conflicts
                                                                                                                                                                                                                        Detected
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-xl font-bold text-emerald-400">
                                                                                                                                                                                                                        0
                                                                                                                                                                                                                        Conflicts
                                                                                                                                                                                                                        ✓
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                <div className="text-gray-400">
                                                                                                                                                                                                                        Optimized
                                                                                                                                                                                                                        Maintenance
                                                                                                                                                                                                                        Window
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-xl font-bold text-indigo-300">
                                                                                                                                                                                                                        02:00
                                                                                                                                                                                                                        -
                                                                                                                                                                                                                        03:00
                                                                                                                                                                                                                        UTC
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                <div className="text-gray-400">
                                                                                                                                                                                                                        Chaos
                                                                                                                                                                                                                        Test
                                                                                                                                                                                                                        Verification
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-xl font-bold text-purple-300">
                                                                                                                                                                                                                        VERIFIED
                                                                                                                                                                                                                        PASSED
                                                                                                                                                                                                                        ✓
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* Tab 2: Multi-Team Approvals */}
                                                                                                {activeTab ===
                                                                                                                        'multi_team' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                                                                                                                                                                                <Users className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        Features
                                                                                                                                                                                                                        42
                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                        49:
                                                                                                                                                                                                                        Multi-Team
                                                                                                                                                                                                                        Approval
                                                                                                                                                                                                                        Workflow
                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                        Compliance
                                                                                                                                                                                                                        Gate
                                                                                                                                                                                                </span>
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-xs text-gray-400">
                                                                                                                                                                                                Signed-off
                                                                                                                                                                                                pre-flight
                                                                                                                                                                                                approvals
                                                                                                                                                                                                from
                                                                                                                                                                                                DevOps,
                                                                                                                                                                                                Security,
                                                                                                                                                                                                Architecture,
                                                                                                                                                                                                and
                                                                                                                                                                                                Product
                                                                                                                                                                                                leads
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                                                                                                                                        {[
                                                                                                                                                                                                {
                                                                                                                                                                                                                        role: 'DevOps Lead',
                                                                                                                                                                                                                        approver: 'alex.devops@codeatlas.com',
                                                                                                                                                                                                                        status: 'APPROVED ✓',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        role: 'Security Officer',
                                                                                                                                                                                                                        approver: 'sec.audit@codeatlas.com',
                                                                                                                                                                                                                        status: 'APPROVED ✓',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        role: 'Principal Architect',
                                                                                                                                                                                                                        approver: 'arch.chief@codeatlas.com',
                                                                                                                                                                                                                        status: 'APPROVED ✓',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        role: 'Product Lead',
                                                                                                                                                                                                                        approver: 'prod.owner@codeatlas.com',
                                                                                                                                                                                                                        status: 'APPROVED ✓',
                                                                                                                                                                                                },
                                                                                                                                                                        ].map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        app,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="font-bold text-white text-sm">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        app.role
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-gray-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        app.approver
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                app.status
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </DashboardLayout>
                        );
}
