'use client';

import React, { useState } from 'react';
import {
                        Building2,
                        Brain,
                        Crown,
                        Layers,
                        Target,
                        Code2,
                        Zap,
                        CheckCircle2,
                        ShieldAlert,
                        Server,
                        Sparkles,
                        AlertTriangle,
                        Send,
                        ArrowRight,
                        TrendingUp,
                        Users,
                        Activity,
                        GitPullRequest,
                        Check,
                        Calendar,
                        Compass,
                        UserCheck,
                        Globe,
                        SlidersHorizontal,
                        FolderKanban,
} from 'lucide-react';

export default function AutonomousEngineeringOrgPage() {
                        const [activeTab, setActiveTab] = useState<string>('roles');
                        const [macroGoalInput, setMacroGoalInput] =
                                                useState<string>('Expand to Europe.');

                        // 8 Executive Roles
                        const execRoles = [
                                                {
                                                                        role: 'AI CTO',
                                                                        focus: 'Tech Stack Vision & Business Alignment',
                                                                        icon: Crown,
                                                                        color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
                                                                        assessment: 'Technology radar aligned with 2026 business expansion OKRs.',
                                                                        directive: 'Enforce multi-region active-active cell topology across all 12 teams.',
                                                },
                                                {
                                                                        role: 'AI Architect',
                                                                        focus: 'System Boundary & Schema Standards',
                                                                        icon: Layers,
                                                                        color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/40 text-indigo-300',
                                                                        assessment: 'Identified REST API payload drift between Team Checkout and Team Auth.',
                                                                        directive: 'Migrate Auth Vault inter-service communication to gRPC Protobuf.',
                                                },
                                                {
                                                                        role: 'AI Product Manager',
                                                                        focus: 'Roadmap Prioritization & OKR Translation',
                                                                        icon: Target,
                                                                        color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
                                                                        assessment: 'Translated Q3 market growth OKRs into 24 technical refactoring epics.',
                                                                        directive: 'Prioritize EU Data Vault foundation before UI localization.',
                                                },
                                                {
                                                                        role: 'AI Tech Lead',
                                                                        focus: 'Codebase Refactoring & Ticket Dispatch',
                                                                        icon: Code2,
                                                                        color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300',
                                                                        assessment: 'Detected 88% duplicate authentication token validator across Payments and Cart repos.',
                                                                        directive: 'Consolidate duplicate Auth Validators into shared core library auth-sdk.',
                                                },
                                                {
                                                                        role: 'AI SRE',
                                                                        focus: 'Reliability SLAs & Fault Tolerance',
                                                                        icon: Zap,
                                                                        color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300',
                                                                        assessment: 'Circuit breaker coverage across cross-region microservices at 94.2%.',
                                                                        directive: 'Trigger 5-second fallback triggers during cross-border transit gateway stalls.',
                                                },
                                                {
                                                                        role: 'AI QA',
                                                                        focus: 'Contract & Regression Testing',
                                                                        icon: CheckCircle2,
                                                                        color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/40 text-emerald-300',
                                                                        assessment: 'Zero contract test breakages detected across 14 consuming microservices.',
                                                                        directive: 'Automate OpenAPI 3.1 schema regression suite execution in CI pipeline.',
                                                },
                                                {
                                                                        role: 'AI Security',
                                                                        focus: 'Zero-Trust & Compliance',
                                                                        icon: ShieldAlert,
                                                                        color: 'from-red-500/20 to-orange-500/20 border-red-500/40 text-red-300',
                                                                        assessment: 'GDPR Article 44 data residency verification passed.',
                                                                        directive: 'Enforce RS256 JWT key rotation and mutual TLS (mTLS) for all inter-service mesh traffic.',
                                                },
                                                {
                                                                        role: 'AI Platform Engineer',
                                                                        focus: 'Kubernetes Mesh & Cloud Budget Tuning',
                                                                        icon: Server,
                                                                        color: 'from-sky-500/20 to-blue-500/20 border-sky-500/40 text-sky-300',
                                                                        assessment: 'Achieved $14,200/mo cloud cost savings by scaling AWS Spot instance workers.',
                                                                        directive: 'Auto-scale EKS worker pods to target 70% CPU utilization cap.',
                                                },
                        ];

                        // Feature 5 Macro Expansion Blueprint Output ("Expand to Europe.")
                        const europeanExpansionBlueprint = {
                                                goal: macroGoalInput,
                                                pillars: [
                                                                        {
                                                                                                title: '1. GDPR Work',
                                                                                                items: [
                                                                                                                        'Isolate EU customer PII rows in Frankfurt (eu-central-1) CockroachDB cluster.',
                                                                                                                        'Enforce GDPR Article 44 cross-border data residency encryption rules.',
                                                                                                                        'Implement automated DSAR deletion API pipeline.',
                                                                                                ],
                                                                        },
                                                                        {
                                                                                                title: '2. Authentication Updates',
                                                                                                items: [
                                                                                                                        'Migrate Auth Vault to gRPC Protobuf binary streaming service.',
                                                                                                                        'Enforce RS256 JWT cryptographic key rotation every 24 hours.',
                                                                                                                        'Deploy mutual TLS (mTLS) certificate pinning across inter-service traffic.',
                                                                                                ],
                                                                        },
                                                                        {
                                                                                                title: '3. Localization',
                                                                                                items: [
                                                                                                                        'Extract hardcoded UI strings into i18n JSON bundles for EN, DE, FR, ES.',
                                                                                                                        'Configure regional date, EUR € currency, and VAT tax rules.',
                                                                                                ],
                                                                        },
                                                                        {
                                                                                                title: '4. Infrastructure Changes',
                                                                                                items: [
                                                                                                                        'Deploy AWS EKS active-active dual-region cluster in eu-central-1 (Frankfurt).',
                                                                                                                        'Configure AWS Transit Gateway encrypted VPC peering bridge.',
                                                                                                ],
                                                                        },
                                                                        {
                                                                                                title: '5. Monitoring Improvements',
                                                                                                items: [
                                                                                                                        'Establish Datadog cross-border latency probes across Mumbai ↔ Frankfurt links.',
                                                                                                                        'Set p99 latency SLA alarm threshold at 50ms with automated circuit breakers.',
                                                                                                ],
                                                                        },
                                                                        {
                                                                                                title: '6. Security Checklist',
                                                                                                items: [
                                                                                                                        'OWASP API Security Top 10 automated vulnerability scanning.',
                                                                                                                        'SOC2 Type II and ISO 27001 audit logging verification.',
                                                                                                ],
                                                                        },
                                                                        {
                                                                                                title: '7. Sprint Roadmap',
                                                                                                items: [
                                                                                                                        'Q1 2026: Auth Vault Decoupling & gRPC Schema Definition',
                                                                                                                        'Q2 2026: Multi-Region CockroachDB EU Row Locality Deployment',
                                                                                                                        'Q3 2026: i18n Strings Extraction & Zero-Trust mTLS Mesh',
                                                                                                                        'Q4 2026: Active-Active Dual-Region 50M User Scale Load Verification',
                                                                                                ],
                                                                        },
                                                ],
                        };

                        // Feature 6 & 7 Portfolio & Program Manager Data
                        const portfolioInitiatives = [
                                                {
                                                                        rank: 1,
                                                                        title: 'Active-Active Dual Region EU Expansion',
                                                                        value: '98.0 Value',
                                                                        effort: '240 hrs',
                                                                        debt: '85.0 Paydown',
                                                                        risk: 'Medium Risk',
                                                                        score: '94.5 Score',
                                                },
                                                {
                                                                        rank: 2,
                                                                        title: 'Consolidate Auth Token Validator Libraries',
                                                                        value: '82.0 Value',
                                                                        effort: '48 hrs',
                                                                        debt: '95.0 Paydown',
                                                                        risk: 'Low Risk',
                                                                        score: '91.0 Score',
                                                },
                                                {
                                                                        rank: 3,
                                                                        title: 'Legacy Notification Handler Event Publisher Refactor',
                                                                        value: '75.0 Value',
                                                                        effort: '36 hrs',
                                                                        debt: '90.0 Paydown',
                                                                        risk: 'Low Risk',
                                                                        score: '86.5 Score',
                                                },
                        ];

                        // Duplication Alerts
                        const duplications = [
                                                {
                                                                        id: 'DUP-101',
                                                                        teamA: 'Checkout Engineering Team',
                                                                        teamB: 'Payments Core Team',
                                                                        component: 'JWT Token Validator & RS256 Cryptographic Parser',
                                                                        similarity: '88.5% Duplication',
                                                                        solution: 'Extract to @codeatlas/auth-sdk shared npm/pypi package.',
                                                },
                                                {
                                                                        id: 'DUP-102',
                                                                        teamA: 'Inventory Team',
                                                                        teamB: 'Catalog Team',
                                                                        component: 'Redis Write-Through Caching Helper',
                                                                        similarity: '76.0% Duplication',
                                                                        solution: 'Consolidate into apps/backend/app/core/cache.py.',
                                                },
                        ];

                        // Execution Hub Actions
                        const executionActions = [
                                                {
                                                                        id: 'EXEC-301',
                                                                        time: 'Just now',
                                                                        role: 'AI Tech Lead',
                                                                        target: 'Checkout Engineering Team',
                                                                        title: 'Consolidate Duplicate Auth Token Validator',
                                                                        type: 'Refactor Ticket',
                                                                        status: 'Dispatched',
                                                },
                                                {
                                                                        id: 'EXEC-302',
                                                                        time: '2 mins ago',
                                                                        role: 'AI Platform Engineer',
                                                                        target: 'Infra Platform Team',
                                                                        title: 'Scale AWS EKS Pod Memory Caps to 512MiB',
                                                                        type: 'Config Override',
                                                                        status: 'Executed',
                                                },
                                                {
                                                                        id: 'EXEC-303',
                                                                        time: '5 mins ago',
                                                                        role: 'AI Security',
                                                                        target: 'Security Operations',
                                                                        title: 'Rotate RS256 Cryptographic Signing Keys',
                                                                        type: 'Security Trigger',
                                                                        status: 'Executed',
                                                },
                        ];

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Top Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
                                                                                                                                                                        <Building2 className="w-8 h-8 animate-pulse" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                26
                                                                                                                                                                                                —
                                                                                                                                                                                                Autonomous
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Organization
                                                                                                                                                                                                (AEO)
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                                                                                                                                                                                                AI
                                                                                                                                                                                                VP
                                                                                                                                                                                                of
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Command
                                                                                                                                                                                                Center
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Coordinates
                                                                                                                                                entire
                                                                                                                                                engineering
                                                                                                                                                organizations
                                                                                                                                                across
                                                                                                                                                8
                                                                                                                                                specialized
                                                                                                                                                AI
                                                                                                                                                Executive
                                                                                                                                                roles.
                                                                                                                                                Features
                                                                                                                                                Macro
                                                                                                                                                Business
                                                                                                                                                Goal
                                                                                                                                                Translation
                                                                                                                                                ("Expand
                                                                                                                                                to
                                                                                                                                                Europe"),
                                                                                                                                                Portfolio
                                                                                                                                                Optimization,
                                                                                                                                                Cross-Repo
                                                                                                                                                Coordination,
                                                                                                                                                and
                                                                                                                                                AI
                                                                                                                                                Program
                                                                                                                                                Management.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        AEO
                                                                                                                                                                        Status
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-indigo-300">
                                                                                                                                                                        Coordination
                                                                                                                                                                        Optimal
                                                                                                                                                                        (2.4x
                                                                                                                                                                        Velocity)
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Metrics Banner */}
                                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                Organization
                                                                                                                                                Health
                                                                                                                                                Index
                                                                                                                        </div>
                                                                                                                        <div className="text-3xl font-black text-emerald-400 mt-1">
                                                                                                                                                95.8
                                                                                                                                                /
                                                                                                                                                100
                                                                                                                        </div>
                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                12
                                                                                                                                                Engineering
                                                                                                                                                Teams
                                                                                                                                                Coordinated
                                                                                                                        </div>
                                                                                                </div>
                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                Architecture
                                                                                                                                                Alignment
                                                                                                                        </div>
                                                                                                                        <div className="text-3xl font-black text-indigo-400 mt-1">
                                                                                                                                                97.2%
                                                                                                                                                Score
                                                                                                                        </div>
                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                Zero
                                                                                                                                                Schema
                                                                                                                                                Drift
                                                                                                                                                Violations
                                                                                                                        </div>
                                                                                                </div>
                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                Duplication
                                                                                                                                                Reduction
                                                                                                                        </div>
                                                                                                                        <div className="text-3xl font-black text-cyan-400 mt-1">
                                                                                                                                                84.0%
                                                                                                                                                Saved
                                                                                                                        </div>
                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                Prevented
                                                                                                                                                duplicate
                                                                                                                                                Auth
                                                                                                                                                &
                                                                                                                                                Cache
                                                                                                                                                modules
                                                                                                                        </div>
                                                                                                </div>
                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                Engineering
                                                                                                                                                Velocity
                                                                                                                        </div>
                                                                                                                        <div className="text-3xl font-black text-amber-400 mt-1">
                                                                                                                                                2.4x
                                                                                                                                                Multiplier
                                                                                                                        </div>
                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                Automated
                                                                                                                                                Ticket
                                                                                                                                                &
                                                                                                                                                SLA
                                                                                                                                                Dispatching
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Tabs */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'roles',
                                                                                                                                                label: '8 Autonomous Executive Roles',
                                                                                                                                                icon: Crown,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'macro',
                                                                                                                                                label: 'Macro Business Goal ("Expand to Europe")',
                                                                                                                                                icon: Globe,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'portfolio',
                                                                                                                                                label: 'Portfolio Optimizer & Program Manager',
                                                                                                                                                icon: SlidersHorizontal,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'duplication',
                                                                                                                                                label: 'Duplication & Alignment Detector',
                                                                                                                                                icon: GitPullRequest,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'execution',
                                                                                                                                                label: 'Engineering Execution Hub',
                                                                                                                                                icon: Zap,
                                                                                                                        },
                                                                                                ].map(
                                                                                                                        (
                                                                                                                                                tab
                                                                                                                        ) => {
                                                                                                                                                const Icon =
                                                                                                                                                                        tab.icon;
                                                                                                                                                const isActive =
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        tab.id;
                                                                                                                                                return (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        tab.id
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                                                                tab.id
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                                                                                                                                                                                                        isActive
                                                                                                                                                                                                                                                ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-500/20'
                                                                                                                                                                                                                                                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
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

                                                                        {/* TAB 1: 8 Autonomous Executive Roles Grid */}
                                                                        {activeTab === 'roles' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                                                                                                                {execRoles.map(
                                                                                                                                                                        (
                                                                                                                                                                                                exec,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => {
                                                                                                                                                                                                const Icon =
                                                                                                                                                                                                                        exec.icon;
                                                                                                                                                                                                return (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className={`p-6 rounded-2xl border bg-slate-950 ${exec.color} space-y-4 shadow-lg hover:border-indigo-500/60 transition-all`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-2.5">
                                                                                                                                                                                                                                                                                                <div className="p-2 rounded-xl border bg-slate-900">
                                                                                                                                                                                                                                                                                                                        <Icon className="w-5 h-5" />
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                                                                        <div className="text-sm font-black text-white">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        exec.role
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                        <div className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        exec.focus
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <div className="space-y-2 text-xs">
                                                                                                                                                                                                                                                                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                                                                                                                                                                                                                                                                                                        Assessment:
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <p className="text-slate-300">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                exec.assessment
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                                                                                                                                                                                                                                                                                                <div className="text-[10px] text-indigo-300 font-bold uppercase mb-1">
                                                                                                                                                                                                                                                                                                                        Key
                                                                                                                                                                                                                                                                                                                        Directive:
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <p className="text-slate-200">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                exec.directive
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                );
                                                                                                                                                                        }
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: Macro Business Goal Translator ("Expand to Europe.") */}
                                                                        {activeTab === 'macro' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                                                                                                                                        <Globe className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        Macro
                                                                                                                                                                        Business
                                                                                                                                                                        Goal
                                                                                                                                                                        Translator
                                                                                                                                                                        ("Expand
                                                                                                                                                                        to
                                                                                                                                                                        Europe.")
                                                                                                                                                </h3>

                                                                                                                                                <div className="flex gap-3">
                                                                                                                                                                        <input
                                                                                                                                                                                                type="text"
                                                                                                                                                                                                value={
                                                                                                                                                                                                                        macroGoalInput
                                                                                                                                                                                                }
                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        setMacroGoalInput(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                                                                                                                                                                        />
                                                                                                                                                                        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow">
                                                                                                                                                                                                <Sparkles className="w-4 h-4" />{' '}
                                                                                                                                                                                                Translate
                                                                                                                                                                                                Goal
                                                                                                                                                                        </button>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                                                                                                                                                                        {europeanExpansionBlueprint.pillars.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        pillar,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="text-xs font-bold text-indigo-300 uppercase">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                pillar.title
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <ul className="space-y-1 text-xs text-slate-300">
                                                                                                                                                                                                                                                                        {pillar.items.map(
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                        item,
                                                                                                                                                                                                                                                                                                                        j
                                                                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                                                                        <li
                                                                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                                                                        j
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                className="flex items-start gap-2 pt-1"
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                item
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                </ul>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: Portfolio Optimizer & Program Manager */}
                                                                        {activeTab ===
                                                                                                'portfolio' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-2">
                                                                                                                                                                        Engineering
                                                                                                                                                                        Portfolio
                                                                                                                                                                        Optimizer
                                                                                                                                                                        (4-Pillar
                                                                                                                                                                        Priority
                                                                                                                                                                        Balancer)
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {portfolioInitiatives.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        init
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        init.rank
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                                                                                                                                                                                                                                                                                                #
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        init.rank
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                                                                <div className="font-bold text-white text-sm">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                init.title
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <div className="text-slate-400 mt-0.5">
                                                                                                                                                                                                                                                                                                                        Value:{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                init.value
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        |
                                                                                                                                                                                                                                                                                                                        Effort:{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                init.effort
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        |
                                                                                                                                                                                                                                                                                                                        Paydown:{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                init.debt
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                init.score
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: Work Duplication & Alignment Detector */}
                                                                        {activeTab ===
                                                                                                'duplication' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                                                                                                                        <GitPullRequest className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                        Cross-Team
                                                                                                                                                                        Work
                                                                                                                                                                        Duplication
                                                                                                                                                                        &
                                                                                                                                                                        Pattern
                                                                                                                                                                        Inconsistency
                                                                                                                                                                        Alerts
                                                                                                                                                </h3>

                                                                                                                                                <div className="space-y-4">
                                                                                                                                                                        {duplications.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        d
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        d.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                                                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                d.id
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-sm font-bold text-white">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                d.component
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        d.similarity
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <div className="text-xs text-slate-400 flex items-center gap-4">
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                Team
                                                                                                                                                                                                                                                                                                A:{' '}
                                                                                                                                                                                                                                                                                                <strong className="text-slate-200">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                d.teamA
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </strong>
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                ↔
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                Team
                                                                                                                                                                                                                                                                                                B:{' '}
                                                                                                                                                                                                                                                                                                <strong className="text-slate-200">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                d.teamB
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </strong>
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-emerald-400 font-semibold flex items-center justify-between">
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                Consolidation
                                                                                                                                                                                                                                                                                                Plan:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        d.solution
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow">
                                                                                                                                                                                                                                                                                                Dispatch
                                                                                                                                                                                                                                                                                                Refactor
                                                                                                                                                                                                                                                                                                Ticket
                                                                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 5: Engineering Execution Hub */}
                                                                        {activeTab ===
                                                                                                'execution' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                                                                                                                        <Zap className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                        Engineering
                                                                                                                                                                        Execution
                                                                                                                                                                        Hub
                                                                                                                                                                        Live
                                                                                                                                                                        Action
                                                                                                                                                                        Stream
                                                                                                                                                </h3>

                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {executionActions.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        action
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        action.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="space-y-1">
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                                                <span className="font-mono font-bold text-slate-400">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                action.id
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="font-bold text-white text-sm">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                action.title
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                action.type
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-slate-400">
                                                                                                                                                                                                                                                                                                Issued
                                                                                                                                                                                                                                                                                                by{' '}
                                                                                                                                                                                                                                                                                                <strong className="text-indigo-300">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                action.role
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </strong>{' '}
                                                                                                                                                                                                                                                                                                for{' '}
                                                                                                                                                                                                                                                                                                <strong className="text-slate-200">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                action.target
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </strong>{' '}
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        action.time
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                                                                                                                                                                                                                                                                        <Check className="w-3.5 h-3.5" />{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                action.status
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
