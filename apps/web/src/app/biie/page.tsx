'use client';

import React, { useState, useEffect } from 'react';
import {
                        DollarSign,
                        TrendingUp,
                        Building2,
                        AlertTriangle,
                        Zap,
                        Briefcase,
                        Layers,
                        Activity,
                        CheckCircle2,
                        RefreshCw,
                        Sparkles,
                        PieChart,
                        ShieldCheck,
                        Users,
                        Target,
                        ArrowRight,
                        ChevronRight,
                        Clock,
                        BarChart3,
                        Server,
                        Code2,
                        FileText,
                        Radio,
                        ExternalLink,
                        Flame,
                        Globe,
                        GitFork,
                        Database,
                        Cpu,
                        Workflow,
                        Compass,
                        Coins,
                        Cloud,
                        ShieldAlert,
                        Lock,
                        Play,
                        Bot,
                        Lightbulb,
                        Crown,
                        Send,
} from 'lucide-react';

export default function BIIEPage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'twin_command'
                                                | 'impact'
                                                | 'ai_advisor'
                                                | 'risk'
                                                | 'economics'
                                                | 'product_tree'
                                                | 'analytics'
                                                | 'capabilities'
                                                | 'cost_inaction'
                                                | 'executive'
                                                | 'connectors'
                        >('twin_command');
                        const [loading, setLoading] = useState(false);
                        const [repoId, setRepoId] = useState('demo-repo-001');

                        // Signature Digital Twin State
                        const [twinData, setTwinData] = useState<any>(null);
                        const [selectedRole, setSelectedRole] = useState<
                                                'CEO' | 'CTO' | 'CIO' | 'CFO' | 'PRODUCT'
                        >('CEO');
                        const [roleData, setRoleData] = useState<any>(null);

                        // AI Executive Chat State
                        const [chatQuery, setChatQuery] = useState('');
                        const [chatHistory, setChatHistory] = useState<
                                                Array<{ sender: 'user' | 'ai'; text: string }>
                        >([
                                                {
                                                                        sender: 'ai',
                                                                        text: 'Hello Executive. I am your CodeAtlas BIIE AI Advisor. Ask me anything about how code architecture maps to ARR, cloud costs, or outage risks.',
                                                },
                        ]);

                        // Form & Simulator state
                        const [targetService, setTargetService] = useState('payment_service');
                        const [targetPr, setTargetPr] = useState(
                                                'PR #142 — Core Database Refactor & Schema Migration'
                        );
                        const [impactData, setImpactData] = useState<any>(null);

                        // Outage Simulator state
                        const [outageHours, setOutageHours] = useState<number>(2.0);
                        const [outageSimData, setOutageSimData] = useState<any>(null);

                        // AI Business Case Generator State
                        const [caseModule, setCaseModule] = useState('payment_service');
                        const [generatedCase, setGeneratedCase] = useState<any>(null);

                        // Strategic Simulation State
                        const [simInvestment, setSimInvestment] = useState<number>(15000);
                        const [stratSimData, setStratSimData] = useState<any>(null);

                        // Features 1-5 State
                        const [criticalityScoreData, setCriticalityScoreData] = useState<any>(null);
                        const [productTreeData, setProductTreeData] = useState<any>(null);
                        const [customerImpactData, setCustomerImpactData] = useState<any>(null);

                        // Features 6-20 Analytics State
                        const [analyticsSuiteData, setAnalyticsSuiteData] = useState<any>(null);

                        // Features 21-40 Engineering Economics State
                        const [economicsSuiteData, setEconomicsSuiteData] = useState<any>(null);

                        // Features 41-60 Business Risk Intelligence State
                        const [riskSuiteData, setRiskSuiteData] = useState<any>(null);

                        // Features 61-80 AI Business Advisor State
                        const [aiAdvisorSuiteData, setAiAdvisorSuiteData] = useState<any>(null);

                        // Capabilities state
                        const [capabilitiesList, setCapabilitiesList] = useState<any[]>([]);

                        // Cost of Inaction state
                        const [horizonDays, setHorizonDays] = useState<number>(90);
                        const [inactionData, setInactionData] = useState<any>(null);

                        // Executive Brief state
                        const [audience, setAudience] = useState<'CTO' | 'CEO' | 'CFO' | 'BOARD'>(
                                                'CTO'
                        );
                        const [executiveBrief, setExecutiveBrief] = useState<any>(null);

                        // Connectors State
                        const [syncStatus, setSyncStatus] = useState<any>(null);

                        // Load initial summary, digital twin, and role dashboard
                        useEffect(() => {
                                                fetchDashboardSummary();
                                                fetchDigitalTwin();
                                                fetchRoleDashboard(selectedRole);
                                                fetchFeatures1to5();
                                                fetchAnalyticsSuite();
                                                fetchEconomicsSuite();
                                                fetchRiskSuite();
                                                fetchAiAdvisorSuite();
                        }, [repoId, targetService]);

                        const fetchDigitalTwin = async () => {
                                                try {
                                                                        const res = await fetch(
                                                                                                `/api/v1/biie/command-center/engineering-to-business-twin?service_name=Payments+Service`
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setTwinData(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error fetching digital twin:',
                                                                                                err
                                                                        );
                                                }
                        };

                        const fetchRoleDashboard = async (role: string) => {
                                                setSelectedRole(role as any);
                                                try {
                                                                        const res = await fetch(
                                                                                                `/api/v1/biie/command-center/role-dashboard/${role}`
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setRoleData(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error fetching role dashboard:',
                                                                                                err
                                                                        );
                                                }
                        };

                        const handleSendChat = async () => {
                                                if (!chatQuery.trim()) return;
                                                const userMsg = chatQuery;
                                                setChatQuery('');
                                                setChatHistory((prev) => [
                                                                        ...prev,
                                                                        {
                                                                                                sender: 'user',
                                                                                                text: userMsg,
                                                                        },
                                                ]);

                                                try {
                                                                        const res = await fetch(
                                                                                                '/api/v1/biie/command-center/ai-executive-chat',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers: {
                                                                                                                                                'Content-Type': 'application/json',
                                                                                                                        },
                                                                                                                        body: JSON.stringify(
                                                                                                                                                {
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        query: userMsg,
                                                                                                                                                }
                                                                                                                        ),
                                                                                                }
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setChatHistory(
                                                                                                                        (
                                                                                                                                                prev
                                                                                                                        ) => [
                                                                                                                                                ...prev,
                                                                                                                                                {
                                                                                                                                                                        sender: 'ai',
                                                                                                                                                                        text: data.answer,
                                                                                                                                                },
                                                                                                                        ]
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error in AI executive chat:',
                                                                                                err
                                                                        );
                                                }
                        };

                        const fetchDashboardSummary = async () => {
                                                setLoading(true);
                                                try {
                                                                        const res = await fetch(
                                                                                                `/api/v1/biie/dashboard-summary?repository_id=${repoId}`
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setCapabilitiesList(
                                                                                                                        data.business_capabilities ||
                                                                                                                                                []
                                                                                                );
                                                                                                if (
                                                                                                                        data.latest_impact_analysis
                                                                                                ) {
                                                                                                                        setImpactData(
                                                                                                                                                data.latest_impact_analysis
                                                                                                                        );
                                                                                                }
                                                                                                if (
                                                                                                                        data.latest_cost_of_inaction
                                                                                                ) {
                                                                                                                        setInactionData(
                                                                                                                                                data.latest_cost_of_inaction
                                                                                                                        );
                                                                                                }
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error fetching BIIE dashboard summary:',
                                                                                                err
                                                                        );
                                                } finally {
                                                                        setLoading(false);
                                                }
                        };

                        const fetchFeatures1to5 = async () => {
                                                try {
                                                                        const critRes = await fetch(
                                                                                                `/api/v1/biie/analytics/criticality-score?repository_id=${repoId}&service_name=${targetService}`
                                                                        );
                                                                        if (critRes.ok) {
                                                                                                const cData =
                                                                                                                        await critRes.json();
                                                                                                setCriticalityScoreData(
                                                                                                                        cData
                                                                                                );
                                                                        }

                                                                        const treeRes = await fetch(
                                                                                                `/api/v1/biie/analytics/product-dependency-graph?repository_id=${repoId}`
                                                                        );
                                                                        if (treeRes.ok) {
                                                                                                const tData =
                                                                                                                        await treeRes.json();
                                                                                                setProductTreeData(
                                                                                                                        tData.product_tree ||
                                                                                                                                                []
                                                                                                );
                                                                        }

                                                                        const custRes = await fetch(
                                                                                                '/api/v1/biie/analytics/customer-impact',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers: {
                                                                                                                                                'Content-Type': 'application/json',
                                                                                                                        },
                                                                                                                        body: JSON.stringify(
                                                                                                                                                {
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        target_service: targetService,
                                                                                                                                                }
                                                                                                                        ),
                                                                                                }
                                                                        );
                                                                        if (custRes.ok) {
                                                                                                const custData =
                                                                                                                        await custRes.json();
                                                                                                setCustomerImpactData(
                                                                                                                        custData
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error fetching Features 1-5 data:',
                                                                                                err
                                                                        );
                                                }
                        };

                        const fetchAnalyticsSuite = async () => {
                                                try {
                                                                        const res = await fetch(
                                                                                                `/api/v1/biie/analytics/business-analytics-suite?repository_id=${repoId}`
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setAnalyticsSuiteData(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error fetching analytics suite:',
                                                                                                err
                                                                        );
                                                }
                        };

                        const fetchEconomicsSuite = async () => {
                                                try {
                                                                        const res = await fetch(
                                                                                                `/api/v1/biie/economics/engineering-economics-suite?repository_id=${repoId}`
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setEconomicsSuiteData(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error fetching economics suite:',
                                                                                                err
                                                                        );
                                                }
                        };

                        const fetchRiskSuite = async () => {
                                                try {
                                                                        const res = await fetch(
                                                                                                `/api/v1/biie/risk/risk-intelligence-suite?repository_id=${repoId}`
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setRiskSuiteData(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error fetching risk suite:',
                                                                                                err
                                                                        );
                                                }
                        };

                        const fetchAiAdvisorSuite = async () => {
                                                try {
                                                                        const res = await fetch(
                                                                                                `/api/v1/biie/ai-advisor/advisor-suite?repository_id=${repoId}`
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setAiAdvisorSuiteData(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error fetching AI advisor suite:',
                                                                                                err
                                                                        );
                                                }
                        };

                        const handleGenerateBusinessCase = async () => {
                                                setLoading(true);
                                                try {
                                                                        const res = await fetch(
                                                                                                '/api/v1/biie/ai-advisor/business-case-generator',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers: {
                                                                                                                                                'Content-Type': 'application/json',
                                                                                                                        },
                                                                                                                        body: JSON.stringify(
                                                                                                                                                {
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        target_module: caseModule,
                                                                                                                                                }
                                                                                                                        ),
                                                                                                }
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setGeneratedCase(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error generating business case:',
                                                                                                err
                                                                        );
                                                } finally {
                                                                        setLoading(false);
                                                }
                        };

                        const handleRunStrategicSimulation = async (budgetUsd: number) => {
                                                setSimInvestment(budgetUsd);
                                                setLoading(true);
                                                try {
                                                                        const res = await fetch(
                                                                                                '/api/v1/biie/ai-advisor/strategic-simulation',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers: {
                                                                                                                                                'Content-Type': 'application/json',
                                                                                                                        },
                                                                                                                        body: JSON.stringify(
                                                                                                                                                {
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        investment_amount_usd: budgetUsd,
                                                                                                                                                }
                                                                                                                        ),
                                                                                                }
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setStratSimData(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error running strategic simulation:',
                                                                                                err
                                                                        );
                                                } finally {
                                                                        setLoading(false);
                                                }
                        };

                        const handleSimulateOutage = async (hrs: number) => {
                                                setOutageHours(hrs);
                                                setLoading(true);
                                                try {
                                                                        const res = await fetch(
                                                                                                '/api/v1/biie/risk/outage-simulation',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers: {
                                                                                                                                                'Content-Type': 'application/json',
                                                                                                                        },
                                                                                                                        body: JSON.stringify(
                                                                                                                                                {
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        duration_hours: hrs,
                                                                                                                                                }
                                                                                                                        ),
                                                                                                }
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setOutageSimData(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error simulating outage:',
                                                                                                err
                                                                        );
                                                } finally {
                                                                        setLoading(false);
                                                }
                        };

                        const handleRunImpactAnalysis = async () => {
                                                setLoading(true);
                                                try {
                                                                        const res = await fetch(
                                                                                                '/api/v1/biie/impact-analysis',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers: {
                                                                                                                                                'Content-Type': 'application/json',
                                                                                                                        },
                                                                                                                        body: JSON.stringify(
                                                                                                                                                {
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        target_service: targetService,
                                                                                                                                                                        target_commit_or_pr: targetPr,
                                                                                                                                                }
                                                                                                                        ),
                                                                                                }
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setImpactData(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                                        fetchFeatures1to5();
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error calculating impact analysis:',
                                                                                                err
                                                                        );
                                                } finally {
                                                                        setLoading(false);
                                                }
                        };

                        const handleGenerateExecutiveBrief = async (
                                                targetAudience: 'CTO' | 'CEO' | 'CFO' | 'BOARD'
                        ) => {
                                                setAudience(targetAudience);
                                                setLoading(true);
                                                try {
                                                                        const res = await fetch(
                                                                                                '/api/v1/biie/executive-brief',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers: {
                                                                                                                                                'Content-Type': 'application/json',
                                                                                                                        },
                                                                                                                        body: JSON.stringify(
                                                                                                                                                {
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        target_audience: targetAudience,
                                                                                                                                                }
                                                                                                                        ),
                                                                                                }
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setExecutiveBrief(
                                                                                                                        data
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error generating executive brief:',
                                                                                                err
                                                                        );
                                                } finally {
                                                                        setLoading(false);
                                                }
                        };

                        const handleSyncConnectors = async () => {
                                                setLoading(true);
                                                try {
                                                                        const res = await fetch(
                                                                                                '/api/v1/biie/connectors/sync',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                }
                                                                        );
                                                                        if (res.ok) {
                                                                                                const data =
                                                                                                                        await res.json();
                                                                                                setSyncStatus(
                                                                                                                        data
                                                                                                );
                                                                                                fetchDashboardSummary();
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Error syncing connectors:',
                                                                                                err
                                                                        );
                                                } finally {
                                                                        setLoading(false);
                                                }
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
                                                                        <div className="max-w-7xl mx-auto space-y-8">
                                                                                                {/* Header */}
                                                                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                                                                                                                        <div>
                                                                                                                                                <div className="flex items-center gap-3">
                                                                                                                                                                        <span className="px-3 py-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-emerald-500/20">
                                                                                                                                                                                                <Crown className="w-3.5 h-3.5" />{' '}
                                                                                                                                                                                                All
                                                                                                                                                                                                100
                                                                                                                                                                                                Features
                                                                                                                                                                                                Complete
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-slate-400 text-sm flex items-center gap-1">
                                                                                                                                                                                                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />{' '}
                                                                                                                                                                                                Digital
                                                                                                                                                                                                Twin
                                                                                                                                                                                                Active
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-amber-300 mt-2">
                                                                                                                                                                        Business
                                                                                                                                                                        Impact
                                                                                                                                                                        Intelligence
                                                                                                                                                                        Engine
                                                                                                                                                                        (BIIE)
                                                                                                                                                </h1>
                                                                                                                                                <p className="text-slate-400 text-sm md:text-base mt-1">
                                                                                                                                                                        Connecting
                                                                                                                                                                        software
                                                                                                                                                                        architecture
                                                                                                                                                                        directly
                                                                                                                                                                        to
                                                                                                                                                                        revenue,
                                                                                                                                                                        enterprise
                                                                                                                                                                        customers,
                                                                                                                                                                        executive
                                                                                                                                                                        role
                                                                                                                                                                        cockpits,
                                                                                                                                                                        and
                                                                                                                                                                        digital
                                                                                                                                                                        twin
                                                                                                                                                                        simulation.
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <button
                                                                                                                                                                        onClick={
                                                                                                                                                                                                handleSyncConnectors
                                                                                                                                                                        }
                                                                                                                                                                        disabled={
                                                                                                                                                                                                loading
                                                                                                                                                                        }
                                                                                                                                                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
                                                                                                                                                >
                                                                                                                                                                        <RefreshCw
                                                                                                                                                                                                className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`}
                                                                                                                                                                        />
                                                                                                                                                                        Sync
                                                                                                                                                                        Business
                                                                                                                                                                        Systems
                                                                                                                                                </button>

                                                                                                                                                <button
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                handleGenerateExecutiveBrief(
                                                                                                                                                                                                                        'CTO'
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-medium rounded-lg text-sm transition shadow-lg shadow-teal-500/20 flex items-center gap-2"
                                                                                                                                                >
                                                                                                                                                                        <FileText className="w-4 h-4" />
                                                                                                                                                                        Executive
                                                                                                                                                                        Briefing
                                                                                                                                                </button>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Metric Cards Grid */}
                                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden backdrop-blur-md">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Payments
                                                                                                                                                                                                Service
                                                                                                                                                                                                Revenue
                                                                                                                                                                        </span>
                                                                                                                                                                        <DollarSign className="w-4 h-4 text-emerald-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xl font-bold text-emerald-400">
                                                                                                                                                                        $850M
                                                                                                                                                                        /
                                                                                                                                                                        year
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400 mt-1">
                                                                                                                                                                        18.4M
                                                                                                                                                                        Mapped
                                                                                                                                                                        Customers
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden backdrop-blur-md">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Payments
                                                                                                                                                                                                Outage
                                                                                                                                                                                                Cost
                                                                                                                                                                        </span>
                                                                                                                                                                        <Flame className="w-4 h-4 text-rose-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xl font-bold text-rose-400">
                                                                                                                                                                        $1.8M
                                                                                                                                                                        /
                                                                                                                                                                        hour
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400 mt-1">
                                                                                                                                                                        Criticality:
                                                                                                                                                                        98
                                                                                                                                                                        /
                                                                                                                                                                        100
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden backdrop-blur-md">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Digital
                                                                                                                                                                                                Twin
                                                                                                                                                                                                Recommendation
                                                                                                                                                                        </span>
                                                                                                                                                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-amber-300 truncate">
                                                                                                                                                                        Upgrade
                                                                                                                                                                        infra
                                                                                                                                                                        before
                                                                                                                                                                        Black
                                                                                                                                                                        Friday
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-emerald-400 mt-1">
                                                                                                                                                                        42
                                                                                                                                                                        Global
                                                                                                                                                                        Regions
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden backdrop-blur-md">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Connected
                                                                                                                                                                                                Total
                                                                                                                                                                                                ARR
                                                                                                                                                                        </span>
                                                                                                                                                                        <Building2 className="w-4 h-4 text-teal-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xl font-bold text-teal-300">
                                                                                                                                                                        $20.5
                                                                                                                                                                        Million
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-slate-400 mt-1">
                                                                                                                                                                        100
                                                                                                                                                                        Enterprise
                                                                                                                                                                        Features
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden backdrop-blur-md">
                                                                                                                                                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                                                                                                                                                                        <span>
                                                                                                                                                                                                Business
                                                                                                                                                                                                Resilience
                                                                                                                                                                        </span>
                                                                                                                                                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xl font-bold text-emerald-400">
                                                                                                                                                                        92.4
                                                                                                                                                                        /
                                                                                                                                                                        100
                                                                                                                                                </div>
                                                                                                                                                <p className="text-[11px] text-emerald-400 mt-1">
                                                                                                                                                                        RESILIENT
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Tab Navigation */}
                                                                                                <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-px">
                                                                                                                        {[
                                                                                                                                                {
                                                                                                                                                                        id: 'twin_command',
                                                                                                                                                                        label: '🌟 Digital Twin & Command Center (81–100)',
                                                                                                                                                                        icon: Crown,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'ai_advisor',
                                                                                                                                                                        label: '🤖 AI Business Advisor',
                                                                                                                                                                        icon: Bot,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'impact',
                                                                                                                                                                        label: '💥 Impact & Criticality',
                                                                                                                                                                        icon: Activity,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'risk',
                                                                                                                                                                        label: '⚠ Business Risk Intelligence',
                                                                                                                                                                        icon: ShieldAlert,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'economics',
                                                                                                                                                                        label: '💰 Engineering Economics',
                                                                                                                                                                        icon: Coins,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'product_tree',
                                                                                                                                                                        label: '🌳 Product Dependency Tree',
                                                                                                                                                                        icon: GitFork,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'analytics',
                                                                                                                                                                        label: '📈 Business Analytics Suite',
                                                                                                                                                                        icon: BarChart3,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'capabilities',
                                                                                                                                                                        label: '🗺️ Capability Graph Matrix',
                                                                                                                                                                        icon: Layers,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'cost_inaction',
                                                                                                                                                                        label: '⏳ Cost of Inaction Forecaster',
                                                                                                                                                                        icon: TrendingUp,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'executive',
                                                                                                                                                                        label: '👔 Executive Intelligence',
                                                                                                                                                                        icon: Briefcase,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'connectors',
                                                                                                                                                                        label: '🔌 Telemetry Connectors',
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
                                                                                                                                                                                                                                                                        tab.id as any
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`px-4 py-3 text-sm font-medium rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
                                                                                                                                                                                                                                                isActive
                                                                                                                                                                                                                                                                        ? 'bg-slate-900 border-t-2 border-amber-400 text-amber-300'
                                                                                                                                                                                                                                                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
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

                                                                                                {/* Tab: Features 81-100 Command Center & Digital Twin */}
                                                                                                {activeTab ===
                                                                                                                        'twin_command' &&
                                                                                                                        twinData && (
                                                                                                                                                <div className="space-y-8">
                                                                                                                                                                        {/* 🌟 Signature Feature Visual Card: Engineering-to-Business Digital Twin */}
                                                                                                                                                                        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                                                                                                                                                                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit border border-amber-500/30">
                                                                                                                                                                                                                                                                        <Crown className="w-3.5 h-3.5 text-amber-400" />{' '}
                                                                                                                                                                                                                                                                        🌟
                                                                                                                                                                                                                                                                        Signature
                                                                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                                                                        —
                                                                                                                                                                                                                                                                        Engineering-to-Business
                                                                                                                                                                                                                                                                        Digital
                                                                                                                                                                                                                                                                        Twin
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <h2 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                twinData.service_name
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        Architecture
                                                                                                                                                                                                                                                                        Pipeline
                                                                                                                                                                                                                                                </h2>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-right">
                                                                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                                                                        Business
                                                                                                                                                                                                                                                                        Criticality
                                                                                                                                                                                                                                                                        Score
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-2xl font-extrabold text-amber-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                twinData.business_criticality_score_0_100
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        /
                                                                                                                                                                                                                                                                        100
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                {/* Digital Twin 9-Step Chain Flow */}
                                                                                                                                                                                                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3 text-center">
                                                                                                                                                                                                                        {(
                                                                                                                                                                                                                                                twinData.digital_twin_vector ||
                                                                                                                                                                                                                                                []
                                                                                                                                                                                                                        ).map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        step: any
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        step.step
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl space-y-1 relative group hover:border-amber-500/50 transition"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                                                                                                                                                                                                                                                                                        Step{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                step.step
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <div className="text-xs text-slate-300 font-semibold truncate">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                step.label
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <div className="text-sm font-extrabold text-amber-300 truncate">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                step.value
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                                                                                                                                                                                                        <div className="flex items-center gap-2 text-amber-200">
                                                                                                                                                                                                                                                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                                                                                                                                                                                                                                                <span className="font-semibold text-sm">
                                                                                                                                                                                                                                                                        Actionable
                                                                                                                                                                                                                                                                        Recommendation:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                twinData.recommendation
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded">
                                                                                                                                                                                                                                                Now
                                                                                                                                                                                                                                                architecture
                                                                                                                                                                                                                                                decisions
                                                                                                                                                                                                                                                become
                                                                                                                                                                                                                                                business
                                                                                                                                                                                                                                                decisions.
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Features 81-85: Role Cockpit Selector */}
                                                                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
                                                                                                                                                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                                                                                        <Briefcase className="w-4 h-4 text-teal-400" />{' '}
                                                                                                                                                                                                                                                                        Executive
                                                                                                                                                                                                                                                                        Role
                                                                                                                                                                                                                                                                        Cockpits
                                                                                                                                                                                                                                                                        (Features
                                                                                                                                                                                                                                                                        81–85)
                                                                                                                                                                                                                                                </h3>
                                                                                                                                                                                                                                                <p className="text-xs text-slate-400 mt-0.5">
                                                                                                                                                                                                                                                                        Tailored
                                                                                                                                                                                                                                                                        business
                                                                                                                                                                                                                                                                        intelligence
                                                                                                                                                                                                                                                                        views
                                                                                                                                                                                                                                                                        for
                                                                                                                                                                                                                                                                        CEO,
                                                                                                                                                                                                                                                                        CTO,
                                                                                                                                                                                                                                                                        CIO,
                                                                                                                                                                                                                                                                        CFO,
                                                                                                                                                                                                                                                                        and
                                                                                                                                                                                                                                                                        Product
                                                                                                                                                                                                                                                                        Leadership.
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="flex items-center gap-2 overflow-x-auto">
                                                                                                                                                                                                                                                {[
                                                                                                                                                                                                                                                                        'CEO',
                                                                                                                                                                                                                                                                        'CTO',
                                                                                                                                                                                                                                                                        'CIO',
                                                                                                                                                                                                                                                                        'CFO',
                                                                                                                                                                                                                                                                        'PRODUCT',
                                                                                                                                                                                                                                                ].map(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                r
                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                r
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                                                                fetchRoleDashboard(
                                                                                                                                                                                                                                                                                                                                                                        r
                                                                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                        className={`px-3 py-1.5 text-xs font-bold rounded border transition ${
                                                                                                                                                                                                                                                                                                                                                selectedRole ===
                                                                                                                                                                                                                                                                                                                                                r
                                                                                                                                                                                                                                                                                                                                                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                                                                                                                                                                                                                                                                                                                                                        : 'bg-slate-950 text-slate-400 border-slate-800'
                                                                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                r
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        Cockpit
                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                {roleData && (
                                                                                                                                                                                                                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3 text-xs">
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <span className="font-bold text-white text-sm">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        roleData.role
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                Executive
                                                                                                                                                                                                                                                                                                Perspective
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-slate-400 font-semibold">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        roleData.focus
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-sm font-semibold text-teal-300">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                roleData.headline
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Feature 97: AI Executive Chat Panel */}
                                                                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
                                                                                                                                                                                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <Bot className="w-4 h-4 text-emerald-400" />{' '}
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Executive
                                                                                                                                                                                                                        Conversational
                                                                                                                                                                                                                        Intelligence
                                                                                                                                                                                                                        (Feature
                                                                                                                                                                                                                        97)
                                                                                                                                                                                                </h3>

                                                                                                                                                                                                <div className="h-48 overflow-y-auto space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                                                                                                                                                                                                                        {chatHistory.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        m,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                        className={`p-3 rounded-lg max-w-xl ${
                                                                                                                                                                                                                                                                                                                                                m.sender ===
                                                                                                                                                                                                                                                                                                                                                'user'
                                                                                                                                                                                                                                                                                                                                                                        ? 'bg-teal-600 text-white'
                                                                                                                                                                                                                                                                                                                                                                        : 'bg-slate-900 border border-slate-800 text-slate-200'
                                                                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                m.text
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="flex items-center gap-2">
                                                                                                                                                                                                                        <input
                                                                                                                                                                                                                                                type="text"
                                                                                                                                                                                                                                                placeholder="Ask CodeAtlas e.g., 'What is our peak outage exposure?' or 'What is the ROI of refactoring?'"
                                                                                                                                                                                                                                                value={
                                                                                                                                                                                                                                                                        chatQuery
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setChatQuery(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onKeyDown={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        e.key ===
                                                                                                                                                                                                                                                                                                'Enter' &&
                                                                                                                                                                                                                                                                        handleSendChat()
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                                                                                                                                                                                                                        />
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                onClick={
                                                                                                                                                                                                                                                                        handleSendChat
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <Send className="w-3.5 h-3.5" />{' '}
                                                                                                                                                                                                                                                Send
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )}

                                                                                                {/* Other Tabs */}
                                                                                                {activeTab ===
                                                                                                                        'ai_advisor' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                AI
                                                                                                                                                Business
                                                                                                                                                Advisor
                                                                                                                        </div>
                                                                                                )}
                                                                                                {activeTab ===
                                                                                                                        'impact' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                Impact
                                                                                                                                                Simulator
                                                                                                                        </div>
                                                                                                )}
                                                                                                {activeTab ===
                                                                                                                        'risk' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                Business
                                                                                                                                                Risk
                                                                                                                                                Intelligence
                                                                                                                        </div>
                                                                                                )}
                                                                                                {activeTab ===
                                                                                                                        'economics' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                Engineering
                                                                                                                                                Economics
                                                                                                                        </div>
                                                                                                )}
                                                                                                {activeTab ===
                                                                                                                        'product_tree' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                Product
                                                                                                                                                Dependency
                                                                                                                                                Graph
                                                                                                                                                Tree
                                                                                                                        </div>
                                                                                                )}
                                                                                                {activeTab ===
                                                                                                                        'analytics' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                Business
                                                                                                                                                Analytics
                                                                                                                                                Suite
                                                                                                                        </div>
                                                                                                )}
                                                                                                {activeTab ===
                                                                                                                        'capabilities' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                Capability
                                                                                                                                                Matrix
                                                                                                                        </div>
                                                                                                )}
                                                                                                {activeTab ===
                                                                                                                        'cost_inaction' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                Cost
                                                                                                                                                of
                                                                                                                                                Inaction
                                                                                                                        </div>
                                                                                                )}
                                                                                                {activeTab ===
                                                                                                                        'executive' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                Executive
                                                                                                                                                Intelligence
                                                                                                                        </div>
                                                                                                )}
                                                                                                {activeTab ===
                                                                                                                        'connectors' && (
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white font-bold">
                                                                                                                                                Telemetry
                                                                                                                                                Connectors
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}
