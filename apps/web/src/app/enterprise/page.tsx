'use client';

import React, { useState } from 'react';
import {
                        Building2,
                        Server,
                        Share2,
                        ShieldCheck,
                        Cpu,
                        BarChart3,
                        AlertTriangle,
                        CheckCircle2,
                        TrendingUp,
                        Sliders,
                        Search,
                        RotateCw,
                        Sparkles,
                        Users,
                        DollarSign,
                        Layers,
                        FileText,
                        Boxes,
                        Zap,
} from 'lucide-react';

export default function EnterprisePortfolioPage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'command_center'
                                                | 'graph'
                                                | 'search_duplicates'
                                                | 'teams_busfactor'
                                                | 'costs_perf'
                                                | 'ai_advisor_exec'
                        >('command_center');

                        const [searchQuery, setSearchQuery] = useState('Authentication');
                        const [targetRepo, setTargetRepo] = useState('auth-service-v1');
                        const [changedSymbol, setChangedSymbol] =
                                                useState('POST /api/v1/auth/login');
                        const [isSimulating, setIsSimulating] = useState(false);

                        // Mock Organization State
                        const orgData = {
                                                name: 'Acme Global Enterprise',
                                                slug: 'acme-global',
                                                totalRepos: 1000,
                                                healthScore: 93.0,
                                                healthGrade: 'A+',
                                                totalCrossDeps: 18420,
                                                criticalServices: 142,
                                                busFactorScore: 4.2,
                                                annualCloudSpend: '$2,180,400',
                                                estimatedAnnualSavingsHours: 18400,
                        };

                        const domainHeatmap = [
                                                {
                                                                        name: 'Core Services & API',
                                                                        repos: 420,
                                                                        health: 95.2,
                                                                        status: 'EXCELLENT',
                                                                        debtScore: 8.4,
                                                },
                                                {
                                                                        name: 'Payments & Billing',
                                                                        repos: 85,
                                                                        health: 91.6,
                                                                        status: 'EXCELLENT',
                                                                        debtScore: 12.2,
                                                },
                                                {
                                                                        name: 'Data Platform & ML',
                                                                        repos: 610,
                                                                        health: 88.4,
                                                                        status: 'GOOD',
                                                                        debtScore: 18.5,
                                                },
                                                {
                                                                        name: 'Web & Mobile Frontends',
                                                                        repos: 340,
                                                                        health: 94.0,
                                                                        status: 'EXCELLENT',
                                                                        debtScore: 9.0,
                                                },
                                                {
                                                                        name: 'DevOps & Infrastructure',
                                                                        repos: 185,
                                                                        health: 96.5,
                                                                        status: 'EXCELLENT',
                                                                        debtScore: 5.1,
                                                },
                                                {
                                                                        name: 'Internal Tools & Admin',
                                                                        repos: 810,
                                                                        health: 82.1,
                                                                        status: 'GOOD',
                                                                        debtScore: 24.2,
                                                },
                        ];

                        const doraMetrics = [
                                                {
                                                                        label: 'Deployment Frequency',
                                                                        value: '48 / day',
                                                                        status: 'ELITE',
                                                },
                                                {
                                                                        label: 'Lead Time for Changes',
                                                                        value: '1.4 hours',
                                                                        status: 'ELITE',
                                                },
                                                {
                                                                        label: 'Change Failure Rate',
                                                                        value: '0.8%',
                                                                        status: 'ELITE',
                                                },
                                                {
                                                                        label: 'Mean Time to Recovery',
                                                                        value: '< 14 mins',
                                                                        status: 'ELITE',
                                                },
                        ];

                        const searchMatches = [
                                                {
                                                                        repo: 'auth-service-v1',
                                                                        symbol: 'OAuth2TokenVerifier',
                                                                        kind: 'Class',
                                                                        path: 'app/core/security/verifier.py',
                                                                        owner: 'Security Team',
                                                },
                                                {
                                                                        repo: 'web-frontend-client',
                                                                        symbol: 'useAuthSession()',
                                                                        kind: 'React Hook',
                                                                        path: 'src/hooks/useAuthSession.ts',
                                                                        owner: 'Frontend Guild',
                                                },
                                                {
                                                                        repo: 'mobile-gateway-service',
                                                                        symbol: 'AuthGrpcInterceptor',
                                                                        kind: 'Middleware',
                                                                        path: 'pkg/auth/interceptor.go',
                                                                        owner: 'Mobile Platform',
                                                },
                                                {
                                                                        repo: 'legacy-payment-gateway',
                                                                        symbol: 'verify_payment_token()',
                                                                        kind: 'Function',
                                                                        path: 'services/payments/auth_helper.py',
                                                                        owner: 'Payments Team',
                                                },
                        ];

                        const duplicateCodeList = [
                                                {
                                                                        title: 'JWT Payload Verification',
                                                                        duplicates: 42,
                                                                        recommendation: "Extract into 'enterprise-auth-common'",
                                                                        debtReduction: '-14.5%',
                                                },
                                                {
                                                                        title: 'Structured JSON Logger',
                                                                        duplicates: 88,
                                                                        recommendation: "Extract into 'enterprise-logging-tracer'",
                                                                        debtReduction: '-22.0%',
                                                },
                                                {
                                                                        title: 'Tenant DB Connection Pool',
                                                                        duplicates: 19,
                                                                        recommendation: "Extract into 'enterprise-db-tenant-router'",
                                                                        debtReduction: '-9.8%',
                                                },
                        ];

                        const busFactorHotspots = [
                                                {
                                                                        repo: 'billing-calculator-v2',
                                                                        owner: 'solo.dev@corp.com',
                                                                        pct: '94.2%',
                                                                        risk: 'CRITICAL',
                                                },
                                                {
                                                                        repo: 'auth-tokens-vault',
                                                                        owner: 'alex.dev@corp.com',
                                                                        pct: '88.0%',
                                                                        risk: 'HIGH',
                                                },
                        ];

                        const cloudProviders = [
                                                {
                                                                        provider: 'AWS (Amazon Web Services)',
                                                                        spend: '$124,500 / mo',
                                                                        pct: '68.5%',
                                                                        status: 'OPTIMIZED',
                                                },
                                                {
                                                                        provider: 'GCP (Google Cloud Platform)',
                                                                        spend: '$42,000 / mo',
                                                                        pct: '23.1%',
                                                                        status: 'MODERATE',
                                                },
                                                {
                                                                        provider: 'Azure (Microsoft)',
                                                                        spend: '$15,200 / mo',
                                                                        pct: '8.4%',
                                                                        status: 'OPTIMIZED',
                                                },
                        ];

                        const aiModernizationList = [
                                                {
                                                                        rank: 1,
                                                                        repo: 'legacy-payment-gateway',
                                                                        score: 96.5,
                                                                        action: 'Execute Automated Security Patch & Refactoring Engine in Sprint 1.',
                                                },
                                                {
                                                                        rank: 2,
                                                                        repo: 'internal-tools-admin',
                                                                        score: 88.0,
                                                                        action: "Extract shared library 'enterprise-auth-common' and run Automated Debt Sprint.",
                                                },
                                                {
                                                                        rank: 3,
                                                                        repo: 'billing-calculator-v2',
                                                                        score: 82.4,
                                                                        action: 'Cross-train co-maintainers and introduce Redis L2 caching.',
                                                },
                        ];

                        const handleSimulateImpact = () => {
                                                setIsSimulating(true);
                                                setTimeout(() => setIsSimulating(false), 500);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
                                                                        {/* Enterprise Portfolio Header (Features 1, 2, 5, 31, 35) */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                                                                                                                                                                        <Building2 className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                19
                                                                                                                                                                                                •
                                                                                                                                                                                                Enterprise
                                                                                                                                                                                                Portfolio
                                                                                                                                                                                                Intelligence
                                                                                                                                                                                                (35
                                                                                                                                                                                                Features)
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        orgData.name
                                                                                                                                                                                                }
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Engineering
                                                                                                                                                Command
                                                                                                                                                Center
                                                                                                                                                spanning
                                                                                                                                                1,000+
                                                                                                                                                repositories.
                                                                                                                                                Unified
                                                                                                                                                Digital
                                                                                                                                                Twin,
                                                                                                                                                cross-repository
                                                                                                                                                graph,
                                                                                                                                                bus
                                                                                                                                                factor
                                                                                                                                                radar,
                                                                                                                                                AI
                                                                                                                                                portfolio
                                                                                                                                                advisor,
                                                                                                                                                and
                                                                                                                                                executive
                                                                                                                                                reporting.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* Enterprise KPI Card (Features 1, 5, 6, 31) */}
                                                                                                <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                                                                                                                        <div className="text-center px-3 border-r border-slate-800">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Total
                                                                                                                                                                        Repos
                                                                                                                                                </span>
                                                                                                                                                <span className="text-2xl font-bold text-white">
                                                                                                                                                                        {orgData.totalRepos.toLocaleString()}

                                                                                                                                                                        +
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <div className="text-center px-3 border-r border-slate-800">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Org
                                                                                                                                                                        Health
                                                                                                                                                                        Score
                                                                                                                                                </span>
                                                                                                                                                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                                                                                                                                                                        <span className="text-2xl font-black text-emerald-400">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        orgData.healthScore
                                                                                                                                                                                                }
                                                                                                                                                                                                /100
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        orgData.healthGrade
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <div className="text-center px-3 border-r border-slate-800">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Annual
                                                                                                                                                                        Spend
                                                                                                                                                </span>
                                                                                                                                                <span className="text-2xl font-bold text-indigo-400">
                                                                                                                                                                        {
                                                                                                                                                                                                orgData.annualCloudSpend
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <div className="text-center px-3">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Saved
                                                                                                                                                                        Hours
                                                                                                                                                </span>
                                                                                                                                                <span className="text-2xl font-bold text-purple-400">
                                                                                                                                                                        {orgData.estimatedAnnualSavingsHours.toLocaleString()}

                                                                                                                                                                        h
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Enterprise Architecture Hierarchy Flow Banner (Features 2, 10, 32) */}
                                                                        <div className="mb-8 p-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl">
                                                                                                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
                                                                                                                        <Cpu className="w-4 h-4" />{' '}
                                                                                                                        Feature
                                                                                                                        32
                                                                                                                        •
                                                                                                                        Enterprise
                                                                                                                        Digital
                                                                                                                        Twin
                                                                                                                        Architecture
                                                                                                                        Flow
                                                                                                </h3>
                                                                                                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-semibold">
                                                                                                                        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
                                                                                                                                                🏢
                                                                                                                                                Organization
                                                                                                                        </div>
                                                                                                                        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
                                                                                                                                                📦
                                                                                                                                                1,000+
                                                                                                                                                Repos
                                                                                                                        </div>
                                                                                                                        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
                                                                                                                                                🧬
                                                                                                                                                Company
                                                                                                                                                Twin
                                                                                                                        </div>
                                                                                                                        <div className="p-2.5 bg-indigo-900/40 border border-indigo-500/40 rounded-xl text-indigo-300 font-bold">
                                                                                                                                                🌐
                                                                                                                                                Global
                                                                                                                                                Graph
                                                                                                                        </div>
                                                                                                                        <div className="p-2.5 bg-purple-900/40 border border-purple-500/40 rounded-xl text-purple-300 font-bold">
                                                                                                                                                🧠
                                                                                                                                                AI
                                                                                                                                                Intelligence
                                                                                                                        </div>
                                                                                                                        <div className="p-2.5 bg-emerald-900/40 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold">
                                                                                                                                                📊
                                                                                                                                                Command
                                                                                                                                                Center
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Navigation Tabs (35 Features) */}
                                                                        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 mb-6">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'command_center',
                                                                                                                                                label: 'Engineering Command Center (93/100 Org)',
                                                                                                                                                icon: BarChart3,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'graph',
                                                                                                                                                label: 'Enterprise Graph & Architecture Map',
                                                                                                                                                icon: Share2,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'search_duplicates',
                                                                                                                                                label: 'Cross-Repo Search & Duplicate Detector',
                                                                                                                                                icon: Search,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'teams_busfactor',
                                                                                                                                                label: 'Team Intelligence & Bus Factor',
                                                                                                                                                icon: Users,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'costs_perf',
                                                                                                                                                label: 'Cloud Costs & Performance Portfolio',
                                                                                                                                                icon: DollarSign,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'ai_advisor_exec',
                                                                                                                                                label: 'AI Portfolio Advisor & Exec Reports',
                                                                                                                                                icon: Sparkles,
                                                                                                                        },
                                                                                                ].map(
                                                                                                                        (
                                                                                                                                                tab
                                                                                                                        ) => {
                                                                                                                                                const Icon =
                                                                                                                                                                        tab.icon;
                                                                                                                                                const active =
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        tab.id;
                                                                                                                                                return (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        tab.id
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                                                                tab.id as any
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                                                                                                                                                                                                        active
                                                                                                                                                                                                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                                                                                                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
                                                                                                                                                                                                }`}
                                                                                                                                                                        >
                                                                                                                                                                                                <Icon className="w-4 h-4" />
                                                                                                                                                                                                {
                                                                                                                                                                                                                        tab.label
                                                                                                                                                                                                }
                                                                                                                                                                        </button>
                                                                                                                                                );
                                                                                                                        }
                                                                                                )}
                                                                        </div>

                                                                        {/* TAB 1: ENGINEERING COMMAND CENTER */}
                                                                        {activeTab ===
                                                                                                'command_center' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {/* DORA Metrics Banner (Feature 24) */}
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                                                                        <Zap className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                        Feature
                                                                                                                                                                        24
                                                                                                                                                                        •
                                                                                                                                                                        Engineering
                                                                                                                                                                        KPI
                                                                                                                                                                        &
                                                                                                                                                                        DORA
                                                                                                                                                                        Metrics
                                                                                                                                                                        Dashboard
                                                                                                                                                </h2>
                                                                                                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                                                                                                                        {doraMetrics.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        m,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 border border-slate-800 p-4 rounded-xl"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <span className="text-xs text-slate-400 block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                m.label
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-2xl font-black text-white block my-1">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                m.value
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                m.status
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Domain Breakdown Heatmap (Features 1, 5, 6, 20) */}
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                                                                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                        Features
                                                                                                                                                                        5
                                                                                                                                                                        &
                                                                                                                                                                        20
                                                                                                                                                                        •
                                                                                                                                                                        Organization
                                                                                                                                                                        Health
                                                                                                                                                                        Matrix
                                                                                                                                                                        (Org
                                                                                                                                                                        Health
                                                                                                                                                                        Score:
                                                                                                                                                                        93.0/100)
                                                                                                                                                </h2>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                                                                                                                        {domainHeatmap.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        item,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between mb-2">
                                                                                                                                                                                                                                                                        <span className="font-bold text-slate-200 text-sm">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.name
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-xs px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.status
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.repos
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                Repositories
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="font-semibold text-slate-200">
                                                                                                                                                                                                                                                                                                Health:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.health
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                /100
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                className="h-full rounded-full bg-emerald-400"
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        width: `${item.health}%`,
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

                                                                        {/* TAB 2: ENTERPRISE GRAPH & ARCHITECTURE MAP */}
                                                                        {activeTab === 'graph' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                                                                                        <div>
                                                                                                                                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                                                                                                        <Share2 className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                        Features
                                                                                                                                                                        3,
                                                                                                                                                                        4,
                                                                                                                                                                        10
                                                                                                                                                                        •
                                                                                                                                                                        Enterprise
                                                                                                                                                                        Architecture
                                                                                                                                                                        &
                                                                                                                                                                        Dependency
                                                                                                                                                                        Map
                                                                                                                                                                        ("Google
                                                                                                                                                                        Maps
                                                                                                                                                                        for
                                                                                                                                                                        Code")
                                                                                                                                                </h2>
                                                                                                                                                <p className="text-xs text-slate-400 mt-1">
                                                                                                                                                                        Cross-repository
                                                                                                                                                                        dependency
                                                                                                                                                                        map
                                                                                                                                                                        visualizing
                                                                                                                                                                        Service
                                                                                                                                                                        A
                                                                                                                                                                        ➔
                                                                                                                                                                        Repo
                                                                                                                                                                        B
                                                                                                                                                                        ➔
                                                                                                                                                                        Shared
                                                                                                                                                                        Library
                                                                                                                                                                        ➔
                                                                                                                                                                        Repo
                                                                                                                                                                        C
                                                                                                                                                                        ➔
                                                                                                                                                                        Database
                                                                                                                                                                        across
                                                                                                                                                                        1,000+
                                                                                                                                                                        repos.
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                                                                                                                                                        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                                                                                                                                                                                                Dependency
                                                                                                                                                                                                Chain
                                                                                                                                                                                                Hierarchy
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="space-y-3 text-xs font-semibold">
                                                                                                                                                                                                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200">
                                                                                                                                                                                                                        🌐
                                                                                                                                                                                                                        Service
                                                                                                                                                                                                                        A
                                                                                                                                                                                                                        (web-frontend-client)
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-center text-indigo-400">
                                                                                                                                                                                                                        ↓
                                                                                                                                                                                                                        HTTP
                                                                                                                                                                                                                        API
                                                                                                                                                                                                                        (POST
                                                                                                                                                                                                                        /api/v1/auth/login)
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="p-3 bg-slate-900 border border-indigo-500/30 rounded-lg text-indigo-300">
                                                                                                                                                                                                                        ⚙️
                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                        B
                                                                                                                                                                                                                        (auth-service-v1)
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-center text-indigo-400">
                                                                                                                                                                                                                        ↓
                                                                                                                                                                                                                        Shared
                                                                                                                                                                                                                        Library
                                                                                                                                                                                                                        Binding
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="p-3 bg-slate-900 border border-purple-500/30 rounded-lg text-purple-300">
                                                                                                                                                                                                                        📦
                                                                                                                                                                                                                        Shared
                                                                                                                                                                                                                        Package
                                                                                                                                                                                                                        (enterprise-auth-common)
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-center text-indigo-400">
                                                                                                                                                                                                                        ↓
                                                                                                                                                                                                                        gRPC
                                                                                                                                                                                                                        Consumer
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200">
                                                                                                                                                                                                                        📱
                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                        C
                                                                                                                                                                                                                        (mobile-gateway-service)
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-center text-indigo-400">
                                                                                                                                                                                                                        ↓
                                                                                                                                                                                                                        PostgreSQL
                                                                                                                                                                                                                        Session
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-lg text-emerald-300">
                                                                                                                                                                                                                        🗄️
                                                                                                                                                                                                                        Database
                                                                                                                                                                                                                        (users_db_master)
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                                                                                                                                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                                                                                                                                                                                Graph
                                                                                                                                                                                                Statistics
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                                                                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg">
                                                                                                                                                                                                                        <span className="text-slate-400">
                                                                                                                                                                                                                                                Indexed
                                                                                                                                                                                                                                                Graph
                                                                                                                                                                                                                                                Nodes
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-bold text-white">
                                                                                                                                                                                                                                                1,000
                                                                                                                                                                                                                                                Repositories
                                                                                                                                                                                                                                                +
                                                                                                                                                                                                                                                142
                                                                                                                                                                                                                                                Microservices
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg">
                                                                                                                                                                                                                        <span className="text-slate-400">
                                                                                                                                                                                                                                                Active
                                                                                                                                                                                                                                                Dependency
                                                                                                                                                                                                                                                Edges
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-bold text-indigo-400">
                                                                                                                                                                                                                                                18,420
                                                                                                                                                                                                                                                Connections
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg">
                                                                                                                                                                                                                        <span className="text-slate-400">
                                                                                                                                                                                                                                                Graph
                                                                                                                                                                                                                                                Density
                                                                                                                                                                                                                                                Index
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-bold text-purple-400">
                                                                                                                                                                                                                                                0.0184
                                                                                                                                                                                                                                                (Low
                                                                                                                                                                                                                                                Coupling)
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: CROSS-REPO SEARCH & DUPLICATE DETECTOR */}
                                                                        {activeTab ===
                                                                                                'search_duplicates' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                                                                                                                                                        <Search className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                        Feature
                                                                                                                                                                        7
                                                                                                                                                                        •
                                                                                                                                                                        Cross
                                                                                                                                                                        Repository
                                                                                                                                                                        Search
                                                                                                                                                                        Engine
                                                                                                                                                </h2>
                                                                                                                                                <div className="flex items-center gap-3 mb-4">
                                                                                                                                                                        <input
                                                                                                                                                                                                type="text"
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
                                                                                                                                                                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                                                                                                                                                                        />
                                                                                                                                                                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2">
                                                                                                                                                                                                <Search className="w-4 h-4" />{' '}
                                                                                                                                                                                                Search
                                                                                                                                                                                                1,000+
                                                                                                                                                                                                Repos
                                                                                                                                                                        </button>
                                                                                                                                                </div>

                                                                                                                                                <div className="space-y-2">
                                                                                                                                                                        {searchMatches.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        m,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="font-bold text-indigo-400 text-sm block">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        m.symbol
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        m.kind
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-slate-400 font-mono">
                                                                                                                                                                                                                                                                                                Repo:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        m.repo
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                •
                                                                                                                                                                                                                                                                                                Path:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        m.path
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="px-2.5 py-1 bg-slate-900 text-slate-300 font-semibold rounded-lg border border-slate-800">
                                                                                                                                                                                                                                                                        Owner:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                m.owner
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                                                                                                                                                        <Boxes className="w-5 h-5 text-purple-400" />
                                                                                                                                                                        Features
                                                                                                                                                                        8,
                                                                                                                                                                        9,
                                                                                                                                                                        11
                                                                                                                                                                        •
                                                                                                                                                                        Duplicate
                                                                                                                                                                        Engineering
                                                                                                                                                                        Detector
                                                                                                                                                                        &
                                                                                                                                                                        Shared
                                                                                                                                                                        Library
                                                                                                                                                                        Intelligence
                                                                                                                                                </h2>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                                                                                                        {duplicateCodeList.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        item,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 border border-slate-800 p-4 rounded-xl"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <span className="font-bold text-white text-sm block mb-1">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                item.title
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs text-amber-400 font-semibold block mb-2">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                item.duplicates
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        duplicate
                                                                                                                                                                                                                                                                        implementations
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <p className="text-xs text-slate-400 mb-3">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                item.recommendation
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                                                                                                                                                                                                                        Est.
                                                                                                                                                                                                                                                                        Reduction:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                item.debtReduction
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: TEAM INTELLIGENCE & BUS FACTOR */}
                                                                        {activeTab ===
                                                                                                'teams_busfactor' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                                                                                        <div className="flex items-center justify-between">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                <Users className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                Features
                                                                                                                                                                                                14,
                                                                                                                                                                                                15,
                                                                                                                                                                                                29
                                                                                                                                                                                                •
                                                                                                                                                                                                Team
                                                                                                                                                                                                Intelligence
                                                                                                                                                                                                &
                                                                                                                                                                                                Bus
                                                                                                                                                                                                Factor
                                                                                                                                                                                                Radar
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-xs text-slate-400">
                                                                                                                                                                                                Identify
                                                                                                                                                                                                knowledge
                                                                                                                                                                                                concentration
                                                                                                                                                                                                risks
                                                                                                                                                                                                and
                                                                                                                                                                                                generate
                                                                                                                                                                                                AI
                                                                                                                                                                                                organization
                                                                                                                                                                                                restructuring
                                                                                                                                                                                                plans.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <span className="text-sm font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
                                                                                                                                                                        Org
                                                                                                                                                                        Average
                                                                                                                                                                        Bus
                                                                                                                                                                        Factor:
                                                                                                                                                                        4.2
                                                                                                                                                                        Maintainers
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                                                                                                                                                        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                                                                                                                                                                                                Bus
                                                                                                                                                                                                Factor
                                                                                                                                                                                                Single-Maintainer
                                                                                                                                                                                                Hotspots
                                                                                                                                                                                                (2
                                                                                                                                                                                                Critical
                                                                                                                                                                                                Repos)
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="space-y-3">
                                                                                                                                                                                                {busFactorHotspots.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                hot,
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                                                                <span className="font-bold text-slate-200 block">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                hot.repo
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                                                                                                                        Sole
                                                                                                                                                                                                                                                                                                                        Owner:{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                hot.owner
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                hot.pct
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        knowledge)
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="px-2.5 py-1 bg-red-500/20 text-red-400 font-bold rounded">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        hot.risk
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                                                                                                                                                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">
                                                                                                                                                                                                Feature
                                                                                                                                                                                                29
                                                                                                                                                                                                •
                                                                                                                                                                                                AI
                                                                                                                                                                                                Organization
                                                                                                                                                                                                Planner
                                                                                                                                                                                                Recommendations
                                                                                                                                                                        </h3>
                                                                                                                                                                        <ul className="space-y-2 text-xs text-slate-300">
                                                                                                                                                                                                <li className="flex items-start gap-2">
                                                                                                                                                                                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                                                                                                                                                                                        Rebalance
                                                                                                                                                                                                                        Payments
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Billing
                                                                                                                                                                                                                        team
                                                                                                                                                                                                                        by
                                                                                                                                                                                                                        assigning
                                                                                                                                                                                                                        2
                                                                                                                                                                                                                        senior
                                                                                                                                                                                                                        co-maintainers
                                                                                                                                                                                                                        from
                                                                                                                                                                                                                        Core
                                                                                                                                                                                                                        API.
                                                                                                                                                                                                </li>
                                                                                                                                                                                                <li className="flex items-start gap-2">
                                                                                                                                                                                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                                                                                                                                                                                        Establish
                                                                                                                                                                                                                        cross-team
                                                                                                                                                                                                                        Shared
                                                                                                                                                                                                                        Component
                                                                                                                                                                                                                        Guild
                                                                                                                                                                                                                        for
                                                                                                                                                                                                                        frontend
                                                                                                                                                                                                                        repositories.
                                                                                                                                                                                                </li>
                                                                                                                                                                                                <li className="flex items-start gap-2">
                                                                                                                                                                                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                                                                                                                                                                                        Execute
                                                                                                                                                                                                                        4-week
                                                                                                                                                                                                                        automated
                                                                                                                                                                                                                        knowledge
                                                                                                                                                                                                                        transfer
                                                                                                                                                                                                                        shadowing
                                                                                                                                                                                                                        on
                                                                                                                                                                                                                        billing-calculator-v2.
                                                                                                                                                                                                </li>
                                                                                                                                                                        </ul>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 5: CLOUD COSTS & PERFORMANCE PORTFOLIO */}
                                                                        {activeTab ===
                                                                                                'costs_perf' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                                                                                        <div className="flex items-center justify-between">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                <DollarSign className="w-5 h-5 text-emerald-400" />
                                                                                                                                                                                                Features
                                                                                                                                                                                                18,
                                                                                                                                                                                                19,
                                                                                                                                                                                                26,
                                                                                                                                                                                                27
                                                                                                                                                                                                •
                                                                                                                                                                                                Cloud
                                                                                                                                                                                                Portfolio
                                                                                                                                                                                                &
                                                                                                                                                                                                AI
                                                                                                                                                                                                Budget
                                                                                                                                                                                                Advisor
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-xs text-slate-400">
                                                                                                                                                                                                Org-wide
                                                                                                                                                                                                performance
                                                                                                                                                                                                latency,
                                                                                                                                                                                                cloud
                                                                                                                                                                                                provider
                                                                                                                                                                                                breakdown
                                                                                                                                                                                                (AWS,
                                                                                                                                                                                                GCP,
                                                                                                                                                                                                Azure),
                                                                                                                                                                                                and
                                                                                                                                                                                                AI
                                                                                                                                                                                                cost
                                                                                                                                                                                                reduction
                                                                                                                                                                                                plans.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <span className="text-xl font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                                                                                                                                                                        Annual
                                                                                                                                                                        Cloud
                                                                                                                                                                        Spend:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                orgData.annualCloudSpend
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                                                                                {cloudProviders.map(
                                                                                                                                                                        (
                                                                                                                                                                                                cp,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="bg-slate-950 border border-slate-800 p-4 rounded-xl"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <span className="text-sm font-bold text-white block mb-1">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        cp.provider
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-2xl font-black text-indigo-400 block mb-1">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        cp.spend
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-xs text-slate-400">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        cp.pct
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                of
                                                                                                                                                                                                                                                total
                                                                                                                                                                                                                                                engineering
                                                                                                                                                                                                                                                cloud
                                                                                                                                                                                                                                                budget
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 6: AI PORTFOLIO ADVISOR & EXEC REPORTS */}
                                                                        {activeTab ===
                                                                                                'ai_advisor_exec' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300">
                                                                                                                                                                        <Sparkles className="w-6 h-6" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-xl font-extrabold text-white">
                                                                                                                                                                                                Features
                                                                                                                                                                                                21,
                                                                                                                                                                                                22,
                                                                                                                                                                                                31,
                                                                                                                                                                                                33
                                                                                                                                                                                                •
                                                                                                                                                                                                AI
                                                                                                                                                                                                Portfolio
                                                                                                                                                                                                Advisor
                                                                                                                                                                                                &
                                                                                                                                                                                                Executive
                                                                                                                                                                                                Reports
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-xs text-purple-300 font-semibold">
                                                                                                                                                                                                Which
                                                                                                                                                                                                repositories
                                                                                                                                                                                                should
                                                                                                                                                                                                be
                                                                                                                                                                                                modernized
                                                                                                                                                                                                first?
                                                                                                                                                                                                Automated
                                                                                                                                                                                                AI
                                                                                                                                                                                                recommendations
                                                                                                                                                                                                &
                                                                                                                                                                                                executive
                                                                                                                                                                                                reporting.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                                                                                                                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                                                                                                                                                                        Feature
                                                                                                                                                                        21
                                                                                                                                                                        •
                                                                                                                                                                        Modernization
                                                                                                                                                                        Priority
                                                                                                                                                                        Ranking
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {aiModernizationList.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        item
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        item.rank
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="font-bold text-white text-sm block">
                                                                                                                                                                                                                                                                                                #
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.rank
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.repo
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-slate-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.action
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-extrabold rounded-lg border border-indigo-500/30">
                                                                                                                                                                                                                                                                        Score:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                item.score
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
