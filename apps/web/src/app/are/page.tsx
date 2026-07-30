'use client';

import React, { useState } from 'react';
import {
                        Sparkles,
                        GitPullRequest,
                        Shield,
                        Zap,
                        TestTube,
                        FileText,
                        Layers,
                        Package,
                        CheckCircle2,
                        XCircle,
                        Clock,
                        ArrowRight,
                        TrendingUp,
                        AlertTriangle,
                        Play,
                        RotateCcw,
                        Sliders,
                        ChevronRight,
                        Brain,
                        Orbit,
                        Dna,
                        DollarSign,
                        HeartPulse,
                        Database,
                        Lock,
                        GitMerge,
                        PieChart,
                        HelpCircle,
                        Eye,
                        Calendar,
                        Check,
                        Building,
                        BarChart3,
                        Cpu,
                        Scissors,
                        Repeat,
                        Trash2,
                        Terminal,
                        Activity,
                        Award,
                        Layers3,
                        ShieldCheck,
                        RefreshCw,
                        GitBranch,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

interface RefactoringOpportunity {
                        id: string;
                        smell_type: string;
                        title: string;
                        description: string;
                        target_file: string;
                        target_symbol?: string;
                        line_range?: string;
                        priority_score: number;
                        business_value: number;
                        engineering_cost: number;
                        risk_score: number;
                        tech_debt_impact: number;
                        customer_impact: number;
                        recommended_action: string;
                        refactoring_pattern: string;
                        status: string;
}

export default function AutonomousRefactoringEnginePage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'studio'
                                                | 'scanner'
                                                | 'planner'
                                                | 'priority'
                                                | 'decomposer'
                                                | 'cycles'
                                                | 'naming'
                                                | 'simulation'
                        >('studio');
                        const [smellFilter, setSmellFilter] = useState<string>('all');
                        const [selectedOpportunity, setSelectedOpportunity] =
                                                useState<RefactoringOpportunity | null>(null);
                        const [isScanning, setIsScanning] = useState<boolean>(false);
                        const [isSimulatingStudio, setIsSimulatingStudio] =
                                                useState<boolean>(false);
                        const [studioStep, setStudioStep] = useState<number>(4); // Sprints completed (0-4)
                        const [simulationComplete, setSimulationComplete] =
                                                useState<boolean>(false);
                        const [prCreated, setPrCreated] = useState<boolean>(false);
                        const [prUrl, setPrUrl] = useState<string>('');
                        const [adrGenerated, setAdrGenerated] = useState<boolean>(false);
                        const [archStyle, setArchStyle] = useState<
                                                'modular' | 'clean' | 'hexagonal'
                        >('clean');

                        const opportunities: RefactoringOpportunity[] = [
                                                {
                                                                        id: 'opp-1',
                                                                        smell_type: 'god_class',
                                                                        title: "Decompose God Class 'UserManagerService'",
                                                                        description: 'UserManagerService contains 2,450 lines of code, 42 methods, and handles auth, notifications, payment, and user profile management.',
                                                                        target_file: 'apps/backend/app/services/user_manager_service.py',
                                                                        target_symbol: 'UserManagerService',
                                                                        line_range: '1-2450',
                                                                        priority_score: 92.5,
                                                                        business_value: 90.0,
                                                                        engineering_cost: 45.0,
                                                                        risk_score: 30.0,
                                                                        tech_debt_impact: 95.0,
                                                                        customer_impact: 85.0,
                                                                        recommended_action: 'Extract UserAuthService, NotificationPublisher, and PaymentGatewayService into separate domain services.',
                                                                        refactoring_pattern: 'Extract Class & Single Responsibility Principle',
                                                                        status: 'detected',
                                                },
                                                {
                                                                        id: 'opp-2',
                                                                        smell_type: 'circular_dependency',
                                                                        title: "Break Circular Dependency between 'OrderEngine' and 'InventoryManager'",
                                                                        description: 'Direct circular import detected between order_engine.py and inventory_manager.py causing tight coupling and initialization fragility.',
                                                                        target_file: 'apps/backend/app/services/order_engine.py',
                                                                        target_symbol: 'OrderEngine <-> InventoryManager',
                                                                        line_range: '15-28',
                                                                        priority_score: 88.0,
                                                                        business_value: 85.0,
                                                                        engineering_cost: 25.0,
                                                                        risk_score: 20.0,
                                                                        tech_debt_impact: 90.0,
                                                                        customer_impact: 70.0,
                                                                        recommended_action: 'Extract InventoryObserver interface and publish OrderCreated domain events via EventBus.',
                                                                        refactoring_pattern: 'Dependency Inversion & Event-Driven Decoupling',
                                                                        status: 'detected',
                                                },
                                                {
                                                                        id: 'opp-3',
                                                                        smell_type: 'dead_code',
                                                                        title: 'Eliminate Deprecated Legacy V1 Auth Endpoints & Helper Classes',
                                                                        description: 'Legacy authentication handler functions in v1_legacy_auth.py are unreferenced by any active routes or tests.',
                                                                        target_file: 'apps/backend/app/api/v1_legacy_auth.py',
                                                                        target_symbol: 'verify_v1_legacy_token',
                                                                        line_range: '45-310',
                                                                        priority_score: 78.0,
                                                                        business_value: 60.0,
                                                                        engineering_cost: 10.0,
                                                                        risk_score: 5.0,
                                                                        tech_debt_impact: 75.0,
                                                                        customer_impact: 40.0,
                                                                        recommended_action: 'Remove unused module v1_legacy_auth.py and clean up import references.',
                                                                        refactoring_pattern: 'Safe Dead Code Removal',
                                                                        status: 'detected',
                                                },
                                                {
                                                                        id: 'opp-4',
                                                                        smell_type: 'duplicate_code',
                                                                        title: 'Consolidate Duplicate Query Builder Logic across Analytics Controllers',
                                                                        description: 'Identical SQL query building and filtering logic repeated across 6 report handlers.',
                                                                        target_file: 'apps/backend/app/api/v1/analytics.py',
                                                                        target_symbol: 'build_date_range_query',
                                                                        line_range: '110-195',
                                                                        priority_score: 75.5,
                                                                        business_value: 70.0,
                                                                        engineering_cost: 20.0,
                                                                        risk_score: 15.0,
                                                                        tech_debt_impact: 80.0,
                                                                        customer_impact: 50.0,
                                                                        recommended_action: 'Extract shared AnalyticsQueryBuilder utility in core/utils.',
                                                                        refactoring_pattern: 'Extract Utility & Deduplication',
                                                                        status: 'detected',
                                                },
                                                {
                                                                        id: 'opp-5',
                                                                        smell_type: 'god_function',
                                                                        title: "Refactor God Method 'process_enterprise_billing_pipeline'",
                                                                        description: 'Method exceeds 400 lines with nesting depth 7, handling tax calculations, discount rules, PDF creation, and webhook delivery.',
                                                                        target_file: 'apps/backend/app/services/billing_service.py',
                                                                        target_symbol: 'process_enterprise_billing_pipeline',
                                                                        line_range: '200-610',
                                                                        priority_score: 85.0,
                                                                        business_value: 85.0,
                                                                        engineering_cost: 35.0,
                                                                        risk_score: 25.0,
                                                                        tech_debt_impact: 88.0,
                                                                        customer_impact: 80.0,
                                                                        recommended_action: 'Decompose into pipeline steps using Strategy and Command patterns.',
                                                                        refactoring_pattern: 'Replace Method with Method Object',
                                                                        status: 'detected',
                                                },
                        ];

                        const filteredOpportunities =
                                                smellFilter === 'all'
                                                                        ? opportunities
                                                                        : opportunities.filter(
                                                                                                  (
                                                                                                                          o
                                                                                                  ) =>
                                                                                                                          o.smell_type ===
                                                                                                                          smellFilter
                                                                          );

                        const handleRunStudioSimulation = () => {
                                                setIsSimulatingStudio(true);
                                                setStudioStep(0);
                                                let step = 0;
                                                const interval = setInterval(() => {
                                                                        step += 1;
                                                                        setStudioStep(step);
                                                                        if (step >= 4) {
                                                                                                clearInterval(
                                                                                                                        interval
                                                                                                );
                                                                                                setIsSimulatingStudio(
                                                                                                                        false
                                                                                                );
                                                                        }
                                                }, 800);
                        };

                        const handleScanRepo = () => {
                                                setIsScanning(true);
                                                setTimeout(() => {
                                                                        setIsScanning(false);
                                                }, 1200);
                        };

                        const handleCreatePR = () => {
                                                setPrCreated(true);
                                                setPrUrl(
                                                                        'https://github.com/codeatlas/repo/pull/482'
                                                );
                        };

                        // Calculate current simulated health score based on studioStep (72 -> 93)
                        const currentStudioHealth = Math.round(72 + (studioStep / 4) * 21);

                        return (
                                                <DashboardLayout>
                                                                        <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-6 space-y-6">
                                                                                                {/* Top Title Banner */}
                                                                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 p-6 rounded-2xl border border-purple-800/40 shadow-2xl backdrop-blur-md">
                                                                                                                        <div className="space-y-1">
                                                                                                                                                <div className="flex items-center space-x-3">
                                                                                                                                                                        <div className="p-2.5 bg-purple-600/20 border border-purple-500/30 rounded-xl">
                                                                                                                                                                                                <Scissors className="w-7 h-7 text-purple-400 animate-pulse" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                                                                                                                        <h1 className="text-2xl font-bold tracking-tight text-white">
                                                                                                                                                                                                                                                Autonomous
                                                                                                                                                                                                                                                Refactoring
                                                                                                                                                                                                                                                Engine
                                                                                                                                                                                                                                                (ARE)
                                                                                                                                                                                                                        </h1>
                                                                                                                                                                                                                        <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-full">
                                                                                                                                                                                                                                                Phase
                                                                                                                                                                                                                                                31
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-sm text-gray-400">
                                                                                                                                                                                                                        World&apos;s
                                                                                                                                                                                                                        First
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Architecture
                                                                                                                                                                                                                        Modernization,
                                                                                                                                                                                                                        Monolith
                                                                                                                                                                                                                        Decomposition
                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                        Interactive
                                                                                                                                                                                                                        Refactoring
                                                                                                                                                                                                                        Studio
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center space-x-3">
                                                                                                                                                <button
                                                                                                                                                                        onClick={
                                                                                                                                                                                                handleRunStudioSimulation
                                                                                                                                                                        }
                                                                                                                                                                        disabled={
                                                                                                                                                                                                isSimulatingStudio
                                                                                                                                                                        }
                                                                                                                                                                        className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
                                                                                                                                                >
                                                                                                                                                                        <Play
                                                                                                                                                                                                className={`w-4 h-4 ${isSimulatingStudio ? 'animate-spin' : ''}`}
                                                                                                                                                                        />
                                                                                                                                                                        <span>
                                                                                                                                                                                                {isSimulatingStudio
                                                                                                                                                                                                                        ? `Simulating Sprint ${studioStep}...`
                                                                                                                                                                                                                        : 'Run AI Refactoring Studio'}
                                                                                                                                                                        </span>
                                                                                                                                                </button>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Top Key Performance Metric Cards */}
                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Repository
                                                                                                                                                                                                Health
                                                                                                                                                                        </span>
                                                                                                                                                                        <Activity className="w-5 h-5 text-purple-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-white">
                                                                                                                                                                        {
                                                                                                                                                                                                currentStudioHealth
                                                                                                                                                                        }

                                                                                                                                                                        %{' '}
                                                                                                                                                                        <span className="text-xs text-purple-400 font-normal">
                                                                                                                                                                                                Target:
                                                                                                                                                                                                93%
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                                                                                                                                                                        <div
                                                                                                                                                                                                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-2 rounded-full transition-all duration-700"
                                                                                                                                                                                                style={{
                                                                                                                                                                                                                        width: `${(currentStudioHealth / 100) * 100}%`,
                                                                                                                                                                                                }}
                                                                                                                                                                        ></div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Technical
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Delta
                                                                                                                                                                        </span>
                                                                                                                                                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-emerald-400">
                                                                                                                                                                        -41%
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-gray-400 font-medium mt-1">
                                                                                                                                                                        185h
                                                                                                                                                                        Tech
                                                                                                                                                                        Debt
                                                                                                                                                                        Hours
                                                                                                                                                                        Saved
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Build
                                                                                                                                                                                                Time
                                                                                                                                                                                                &amp;
                                                                                                                                                                                                Risk
                                                                                                                                                                        </span>
                                                                                                                                                                        <Zap className="w-5 h-5 text-indigo-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-indigo-300">
                                                                                                                                                                        -18%{' '}
                                                                                                                                                                        <span className="text-sm text-gray-400">
                                                                                                                                                                                                CI
                                                                                                                                                                                                Time
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-indigo-400 font-medium mt-1">
                                                                                                                                                                        -33%
                                                                                                                                                                        Deployment
                                                                                                                                                                        Risk
                                                                                                                                                                        Factor
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                                                                                                                                                <div className="flex justify-between items-center text-gray-400 mb-2">
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Dev
                                                                                                                                                                                                Productivity
                                                                                                                                                                        </span>
                                                                                                                                                                        <Award className="w-5 h-5 text-amber-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-amber-300">
                                                                                                                                                                        +29%
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xs text-amber-400 font-medium mt-1">
                                                                                                                                                                        Velocity
                                                                                                                                                                        Acceleration
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Navigation Tabs */}
                                                                                                <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1">
                                                                                                                        {[
                                                                                                                                                {
                                                                                                                                                                        id: 'studio',
                                                                                                                                                                        label: '🌟 AI Refactoring Studio',
                                                                                                                                                                        icon: Award,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'scanner',
                                                                                                                                                                        label: '🔍 Smells Scanner',
                                                                                                                                                                        icon: Scissors,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'planner',
                                                                                                                                                                        label: '🗺️ Roadmap & Costs',
                                                                                                                                                                        icon: Calendar,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'priority',
                                                                                                                                                                        label: '🎯 Priority Engine',
                                                                                                                                                                        icon: BarChart3,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'decomposer',
                                                                                                                                                                        label: '🏛️ Monolith Decomposer',
                                                                                                                                                                        icon: Building,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'cycles',
                                                                                                                                                                        label: '🔄 Cycles & Duplicates',
                                                                                                                                                                        icon: Repeat,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'naming',
                                                                                                                                                                        label: '🏷️ Naming & Layers',
                                                                                                                                                                        icon: Layers3,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'simulation',
                                                                                                                                                                        label: '⚡ Simulation & PR',
                                                                                                                                                                        icon: Terminal,
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
                                                                                                                                                                                                                                                ? 'border-purple-500 text-purple-300 bg-slate-900/90'
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

                                                                                                {/* Tab 0: Signature AI Refactoring Studio */}
                                                                                                {activeTab ===
                                                                                                                        'studio' && (
                                                                                                                        <div className="space-y-6">
                                                                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                                                                                                                                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                                                                                                                                                                                                                                <Award className="w-6 h-6 text-amber-400" />
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                                                                        Refactoring
                                                                                                                                                                                                                                                                        Studio
                                                                                                                                                                                                                                                                        —
                                                                                                                                                                                                                                                                        Simulated
                                                                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                                                                        Transformation
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </h2>
                                                                                                                                                                                                                        <p className="text-xs text-gray-400">
                                                                                                                                                                                                                                                Whole-repository
                                                                                                                                                                                                                                                modernization
                                                                                                                                                                                                                                                planner:
                                                                                                                                                                                                                                                Health
                                                                                                                                                                                                                                                72%
                                                                                                                                                                                                                                                &rarr;
                                                                                                                                                                                                                                                93%,
                                                                                                                                                                                                                                                Technical
                                                                                                                                                                                                                                                Debt
                                                                                                                                                                                                                                                -41%,
                                                                                                                                                                                                                                                Deployment
                                                                                                                                                                                                                                                Risk
                                                                                                                                                                                                                                                -33%
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="flex items-center space-x-3">
                                                                                                                                                                                                                        <span className="text-xs text-gray-400">
                                                                                                                                                                                                                                                Architecture
                                                                                                                                                                                                                                                Style:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                                                                                                                                                                                                                                                {(
                                                                                                                                                                                                                                                                        [
                                                                                                                                                                                                                                                                                                'clean',
                                                                                                                                                                                                                                                                                                'hexagonal',
                                                                                                                                                                                                                                                                                                'modular',
                                                                                                                                                                                                                                                                        ] as const
                                                                                                                                                                                                                                                ).map(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                style
                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                style
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                                                                setArchStyle(
                                                                                                                                                                                                                                                                                                                                                                        style
                                                                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                        className={`px-3 py-1 font-semibold rounded-lg capitalize transition-all ${
                                                                                                                                                                                                                                                                                                                                                archStyle ===
                                                                                                                                                                                                                                                                                                                                                style
                                                                                                                                                                                                                                                                                                                                                                        ? 'bg-purple-600 text-white'
                                                                                                                                                                                                                                                                                                                                                                        : 'text-gray-400 hover:text-white'
                                                                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                style
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* 4-Sprint Simulation Timeline */}
                                                                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                                                                                                                                {[
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                sprint: 1,
                                                                                                                                                                                                                                                title: 'Sprint 1: Split Authentication',
                                                                                                                                                                                                                                                details: 'Extract UserAuthService, move session verification to middleware, eliminate legacy V1 auth tokens.',
                                                                                                                                                                                                                                                healthDelta: '+5%',
                                                                                                                                                                                                                                                active:
                                                                                                                                                                                                                                                                        studioStep >=
                                                                                                                                                                                                                                                                        1,
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                sprint: 2,
                                                                                                                                                                                                                                                title: 'Sprint 2: Extract Notifications',
                                                                                                                                                                                                                                                details: 'Create NotificationPublisher service, decouple email/SMS dispatchers from billing pipeline.',
                                                                                                                                                                                                                                                healthDelta: '+6%',
                                                                                                                                                                                                                                                active:
                                                                                                                                                                                                                                                                        studioStep >=
                                                                                                                                                                                                                                                                        2,
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                sprint: 3,
                                                                                                                                                                                                                                                title: 'Sprint 3: Remove Circular Dependencies',
                                                                                                                                                                                                                                                details: 'Break OrderEngine <-> InventoryManager cycle using IInventoryNotifier interface, enforce Layer Validation.',
                                                                                                                                                                                                                                                healthDelta: '+5%',
                                                                                                                                                                                                                                                active:
                                                                                                                                                                                                                                                                        studioStep >=
                                                                                                                                                                                                                                                                        3,
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                sprint: 4,
                                                                                                                                                                                                                                                title: 'Sprint 4: Modernize Database Layer',
                                                                                                                                                                                                                                                details: 'Encapsulate queries inside Repository Pattern classes, replace raw dicts with Pydantic Value Objects.',
                                                                                                                                                                                                                                                healthDelta: '+5%',
                                                                                                                                                                                                                                                active:
                                                                                                                                                                                                                                                                        studioStep >=
                                                                                                                                                                                                                                                                        4,
                                                                                                                                                                                                                        },
                                                                                                                                                                                                ].map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                sp
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                sp.sprint
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className={`p-5 rounded-xl border transition-all space-y-3 ${
                                                                                                                                                                                                                                                                                                sp.active
                                                                                                                                                                                                                                                                                                                        ? 'bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-950/40'
                                                                                                                                                                                                                                                                                                                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="flex justify-between items-center text-xs">
                                                                                                                                                                                                                                                                                                <span className="font-bold text-purple-300">
                                                                                                                                                                                                                                                                                                                        Sprint{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                sp.sprint
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="px-2 py-0.5 font-bold bg-emerald-500/20 text-emerald-300 rounded">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                sp.healthDelta
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <h4 className="text-sm font-bold text-white">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        sp.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                                                                        <p className="text-xs text-gray-300">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        sp.details
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                        <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                                                                                                                                                                                                                                                                                                <CheckCircle2
                                                                                                                                                                                                                                                                                                                        className={`w-4 h-4 ${sp.active ? 'text-emerald-400' : 'text-gray-600'}`}
                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        {sp.active
                                                                                                                                                                                                                                                                                                                                                ? 'Simulated & Validated'
                                                                                                                                                                                                                                                                                                                                                : 'Queued'}
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Action Controls & ADR Generator */}
                                                                                                                                                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                                                                                                                                                                                                <div className="flex items-center space-x-3 text-xs">
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        setAdrGenerated(
                                                                                                                                                                                                                                                                                                true
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 font-medium rounded-xl border border-slate-700 transition-all"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {adrGenerated
                                                                                                                                                                                                                                                                        ? 'ADR #42 Generated ✓'
                                                                                                                                                                                                                                                                        : 'Generate Architecture Decision Record (ADR)'}
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                        <span className="text-gray-500">
                                                                                                                                                                                                                                                Rollback
                                                                                                                                                                                                                                                Checkpoint:{' '}
                                                                                                                                                                                                                                                <code>
                                                                                                                                                                                                                                                                        pre-refactor-checkpoint-01
                                                                                                                                                                                                                                                </code>
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <button
                                                                                                                                                                                                                        onClick={
                                                                                                                                                                                                                                                handleCreatePR
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        disabled={
                                                                                                                                                                                                                                                prCreated
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {prCreated
                                                                                                                                                                                                                                                ? 'Pull Request Submitted ✓'
                                                                                                                                                                                                                                                : 'Execute Full Modernization PR'}
                                                                                                                                                                                                </button>
                                                                                                                                                                        </div>

                                                                                                                                                                        {adrGenerated && (
                                                                                                                                                                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                                                                                                                                                                                                                        <div className="font-bold text-purple-300 text-sm">
                                                                                                                                                                                                                                                Architecture
                                                                                                                                                                                                                                                Decision
                                                                                                                                                                                                                                                Record
                                                                                                                                                                                                                                                (ADR
                                                                                                                                                                                                                                                #42):
                                                                                                                                                                                                                                                Adopt
                                                                                                                                                                                                                                                Modular
                                                                                                                                                                                                                                                Monolith
                                                                                                                                                                                                                                                Domain
                                                                                                                                                                                                                                                Boundaries
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-gray-400">
                                                                                                                                                                                                                                                <strong>
                                                                                                                                                                                                                                                                        Context:
                                                                                                                                                                                                                                                </strong>{' '}
                                                                                                                                                                                                                                                Monolithic
                                                                                                                                                                                                                                                coupling
                                                                                                                                                                                                                                                between
                                                                                                                                                                                                                                                Auth,
                                                                                                                                                                                                                                                Billing,
                                                                                                                                                                                                                                                and
                                                                                                                                                                                                                                                Analytics
                                                                                                                                                                                                                                                created
                                                                                                                                                                                                                                                deployment
                                                                                                                                                                                                                                                risk
                                                                                                                                                                                                                                                and
                                                                                                                                                                                                                                                slow
                                                                                                                                                                                                                                                CI
                                                                                                                                                                                                                                                builds.
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-gray-400">
                                                                                                                                                                                                                                                <strong>
                                                                                                                                                                                                                                                                        Decision:
                                                                                                                                                                                                                                                </strong>{' '}
                                                                                                                                                                                                                                                We
                                                                                                                                                                                                                                                adopt
                                                                                                                                                                                                                                                explicit
                                                                                                                                                                                                                                                Modular
                                                                                                                                                                                                                                                Monolith
                                                                                                                                                                                                                                                domain
                                                                                                                                                                                                                                                packages
                                                                                                                                                                                                                                                with
                                                                                                                                                                                                                                                public
                                                                                                                                                                                                                                                interface
                                                                                                                                                                                                                                                contracts
                                                                                                                                                                                                                                                and
                                                                                                                                                                                                                                                EventBus
                                                                                                                                                                                                                                                async
                                                                                                                                                                                                                                                messaging.
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* Tab 1: Scanner */}
                                                                                                {activeTab ===
                                                                                                                        'scanner' && (
                                                                                                                        <div className="space-y-4">
                                                                                                                                                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                        <div className="flex items-center space-x-2 overflow-x-auto">
                                                                                                                                                                                                <span className="text-xs font-semibold text-gray-400 uppercase mr-2">
                                                                                                                                                                                                                        Filter
                                                                                                                                                                                                                        Smells:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                {[
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                id: 'all',
                                                                                                                                                                                                                                                label: 'All Smells',
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                id: 'god_class',
                                                                                                                                                                                                                                                label: 'God Classes',
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                id: 'circular_dependency',
                                                                                                                                                                                                                                                label: 'Circular Deps',
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                id: 'dead_code',
                                                                                                                                                                                                                                                label: 'Dead Code',
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                id: 'duplicate_code',
                                                                                                                                                                                                                                                label: 'Duplicates',
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                id: 'god_function',
                                                                                                                                                                                                                                                label: 'God Functions',
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
                                                                                                                                                                                                                                                                                                setSmellFilter(
                                                                                                                                                                                                                                                                                                                        f.id
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                                                                                                                                                                                                                                                                                smellFilter ===
                                                                                                                                                                                                                                                                                                f.id
                                                                                                                                                                                                                                                                                                                        ? 'bg-purple-600 text-white'
                                                                                                                                                                                                                                                                                                                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                f.label
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-gray-400">
                                                                                                                                                                                                Showing{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        filteredOpportunities.length
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                Refactoring
                                                                                                                                                                                                Opportunities
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 gap-4">
                                                                                                                                                                        {filteredOpportunities.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        opp
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        opp.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 transition-all shadow-md space-y-3"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                                                                                                                                                                                                                                        <div className="flex items-center space-x-3">
                                                                                                                                                                                                                                                                                                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wide bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg">
                                                                                                                                                                                                                                                                                                                        {opp.smell_type.replace(
                                                                                                                                                                                                                                                                                                                                                '_',
                                                                                                                                                                                                                                                                                                                                                ' '
                                                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <h3 className="text-lg font-bold text-white">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                opp.title
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </h3>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="flex items-center space-x-3 text-xs">
                                                                                                                                                                                                                                                                                                <span className="text-gray-400">
                                                                                                                                                                                                                                                                                                                        Priority
                                                                                                                                                                                                                                                                                                                        Score:
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="px-2.5 py-1 font-extrabold bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-lg text-sm">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                opp.priority_score
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        /
                                                                                                                                                                                                                                                                                                                        100
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <p className="text-sm text-gray-300">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                opp.description
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>

                                                                                                                                                                                                                                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                                                                <span className="text-gray-500 mr-1">
                                                                                                                                                                                                                                                                                                                        Target
                                                                                                                                                                                                                                                                                                                        File:
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <code className="text-indigo-300 font-mono">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                opp.target_file
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </code>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        {opp.target_symbol && (
                                                                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                                                                        <span className="text-gray-500 mr-1">
                                                                                                                                                                                                                                                                                                                                                Symbol:
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                        <code className="text-purple-300 font-mono">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        opp.target_symbol
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </code>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* Tab 6: Naming & Layers */}
                                                                                                {activeTab ===
                                                                                                                        'naming' && (
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                                        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                                                                                                                                                                                                <Layers3 className="w-5 h-5 text-purple-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        Naming
                                                                                                                                                                                                                        Intelligence
                                                                                                                                                                                                                        (Domain-Driven)
                                                                                                                                                                                                </span>
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                                                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                        <div className="text-gray-400">
                                                                                                                                                                                                                                                Class
                                                                                                                                                                                                                                                Rename
                                                                                                                                                                                                                                                Recommendation:
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex items-center space-x-2 font-mono">
                                                                                                                                                                                                                                                <span className="text-rose-400">
                                                                                                                                                                                                                                                                        UserManagerService
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        &rarr;
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                                                                        UserDomainService
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                        <div className="text-gray-400">
                                                                                                                                                                                                                                                API
                                                                                                                                                                                                                                                Endpoint
                                                                                                                                                                                                                                                Rename
                                                                                                                                                                                                                                                Recommendation:
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex items-center space-x-2 font-mono">
                                                                                                                                                                                                                                                <span className="text-rose-400">
                                                                                                                                                                                                                                                                        POST
                                                                                                                                                                                                                                                                        /api/v1/doProcessing
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        &rarr;
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                                                                        POST
                                                                                                                                                                                                                                                                        /api/v1/jobs/process
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                                                                                                                                        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                                                                                                                                                                                                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        Layer
                                                                                                                                                                                                                        Validation
                                                                                                                                                                                                                        Engine
                                                                                                                                                                                                </span>
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                                                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                                                                                                                                                                                                        <div className="font-bold text-white mb-2">
                                                                                                                                                                                                                                                Layer
                                                                                                                                                                                                                                                Hierarchy
                                                                                                                                                                                                                                                Enforcement:
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex items-center justify-between text-indigo-300 font-mono text-xs">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Presentation
                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                &rarr;{' '}
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Application
                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                &rarr;{' '}
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Domain
                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                &rarr;{' '}
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Infrastructure
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl text-rose-200">
                                                                                                                                                                                                                        <strong>
                                                                                                                                                                                                                                                Violation
                                                                                                                                                                                                                                                Detected:
                                                                                                                                                                                                                        </strong>{' '}
                                                                                                                                                                                                                        Direct
                                                                                                                                                                                                                        SQL
                                                                                                                                                                                                                        query
                                                                                                                                                                                                                        execution
                                                                                                                                                                                                                        inside{' '}
                                                                                                                                                                                                                        <code>
                                                                                                                                                                                                                                                analytics.py
                                                                                                                                                                                                                        </code>{' '}
                                                                                                                                                                                                                        router
                                                                                                                                                                                                                        handler
                                                                                                                                                                                                                        bypassing
                                                                                                                                                                                                                        Application
                                                                                                                                                                                                                        service
                                                                                                                                                                                                                        layer.
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* Tab 7: Simulation & PR */}
                                                                                                {activeTab ===
                                                                                                                        'simulation' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                                                                                                                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h2 className="text-xl font-bold text-white">
                                                                                                                                                                                                                        Refactoring
                                                                                                                                                                                                                        Dry-Run
                                                                                                                                                                                                                        Simulation
                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                        PR
                                                                                                                                                                                                                        Generator
                                                                                                                                                                                                </h2>
                                                                                                                                                                                                <p className="text-xs text-gray-400">
                                                                                                                                                                                                                        Simulate
                                                                                                                                                                                                                        code
                                                                                                                                                                                                                        transformation,
                                                                                                                                                                                                                        verify
                                                                                                                                                                                                                        AST
                                                                                                                                                                                                                        integrity,
                                                                                                                                                                                                                        run
                                                                                                                                                                                                                        unit
                                                                                                                                                                                                                        regression
                                                                                                                                                                                                                        test
                                                                                                                                                                                                                        suite,
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        generate
                                                                                                                                                                                                                        PR
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="flex items-center space-x-3">
                                                                                                                                                                                                <button
                                                                                                                                                                                                                        onClick={
                                                                                                                                                                                                                                                handleCreatePR
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        disabled={
                                                                                                                                                                                                                                                prCreated
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-xl transition-all shadow-md disabled:opacity-50"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {prCreated
                                                                                                                                                                                                                                                ? 'PR Created ✓'
                                                                                                                                                                                                                                                : 'Generate Pull Request'}
                                                                                                                                                                                                </button>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="space-y-2">
                                                                                                                                                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                                                                                                                                                                                <span className="font-mono">
                                                                                                                                                                                                                        Simulated
                                                                                                                                                                                                                        Git
                                                                                                                                                                                                                        Diff:
                                                                                                                                                                                                                        user_manager_service.py
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-emerald-400">
                                                                                                                                                                                                                        Safety
                                                                                                                                                                                                                        Score:
                                                                                                                                                                                                                        96.5
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        100
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-gray-300">
                                                                                                                                                                                                {`--- a/apps/backend/app/services/user_manager_service.py
+++ b/apps/backend/app/services/user_manager_service.py
@@ -10,12 +10,6 @@ class UserManagerService:
-    def send_welcome_email(self, user_email: str):
-        # Legacy inline email sending logic
-        pass
+    def send_welcome_email(self, user_email: str):
+        # Delegated to dedicated NotificationPublisher service
+        self.notification_publisher.publish_welcome_event(user_email)`}
                                                                                                                                                                        </pre>
                                                                                                                                                </div>

                                                                                                                                                {prCreated && (
                                                                                                                                                                        <div className="p-4 bg-purple-950/60 border border-purple-800/60 rounded-xl space-y-2">
                                                                                                                                                                                                <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm">
                                                                                                                                                                                                                        <GitPullRequest className="w-5 h-5 text-purple-400" />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Pull
                                                                                                                                                                                                                                                Request
                                                                                                                                                                                                                                                Successfully
                                                                                                                                                                                                                                                Created!
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-xs text-gray-300">
                                                                                                                                                                                                                        Branch:{' '}
                                                                                                                                                                                                                        <code className="text-purple-300 font-mono">
                                                                                                                                                                                                                                                are/refactor-user-manager-service
                                                                                                                                                                                                                        </code>
                                                                                                                                                                                                </p>
                                                                                                                                                                                                <a
                                                                                                                                                                                                                        href={
                                                                                                                                                                                                                                                prUrl
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        target="_blank"
                                                                                                                                                                                                                        rel="noreferrer"
                                                                                                                                                                                                                        className="inline-block text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        View
                                                                                                                                                                                                                        Pull
                                                                                                                                                                                                                        Request
                                                                                                                                                                                                                        #
                                                                                                                                                                                                                        {prUrl
                                                                                                                                                                                                                                                .split(
                                                                                                                                                                                                                                                                        '/'
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                .pop()}{' '}
                                                                                                                                                                                                                        &rarr;
                                                                                                                                                                                                </a>
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </DashboardLayout>
                        );
}
