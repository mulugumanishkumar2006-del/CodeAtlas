'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ASIPPage() {
                        const [repositories, setRepositories] = React.useState<any[]>([]);
                        const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
                        const [token, setToken] = React.useState<string | null>(null);
                        const [briefingData, setBriefingData] = React.useState<any>(null);
                        const [governanceData, setGovernanceData] = React.useState<any>(null);
                        const [simulationData, setSimulationData] = React.useState<any>(null);
                        const [simScenario, setSimScenario] =
                                                React.useState<string>('user_scale_100m');
                        const [simTargetUsers, setSimTargetUsers] =
                                                React.useState<number>(100000000);
                        const [simLoading, setSimLoading] = React.useState<boolean>(false);
                        const [autoIntelData, setAutoIntelData] = React.useState<any>(null);
                        const [councilData, setCouncilData] = React.useState<any>(null);
                        const [digitalTwinData, setDigitalTwinData] = React.useState<any>(null);
                        const [archIntelData, setArchIntelData] = React.useState<any>(null);
                        const [contData, setContData] = React.useState<any>(null);
                        const [aiAdvisorsData, setAiAdvisorsData] = React.useState<any>(null);
                        const [govCompData, setGovCompData] = React.useState<any>(null);
                        const [entIntelData, setEntIntelData] = React.useState<any>(null);
                        const [ecosystemData, setEcosystemData] = React.useState<any>(null);
                        const [activeTab, setActiveTab] = React.useState<
                                                | 'autonomous'
                                                | 'architecture'
                                                | 'continuous'
                                                | 'advisors'
                                                | 'compliance'
                                                | 'enterprise'
                                                | 'ecosystem'
                                                | 'briefing'
                                                | 'simulation'
                                                | 'governance'
                        >('autonomous');

                        React.useEffect(() => {
                                                const storedToken = localStorage.getItem('token');
                                                if (storedToken) setToken(storedToken);
                        }, []);

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
                                                                                                                                                0 &&
                                                                                                                        !selectedRepoId
                                                                                                ) {
                                                                                                                        setSelectedRepoId(
                                                                                                                                                repos[0]
                                                                                                                                                                        .id
                                                                                                                        );
                                                                                                }
                                                                        })
                                                                        .catch(console.error);
                        }, [token]);

                        React.useEffect(() => {
                                                if (!selectedRepoId || !token) return;
                                                // Fetch Monday briefing
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/monday-briefing`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) =>
                                                                                                setBriefingData(
                                                                                                                        data
                                                                                                )
                                                                        )
                                                                        .catch(console.error);

                                                // Fetch Governance policies
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/governance`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) =>
                                                                                                setGovernanceData(
                                                                                                                        data
                                                                                                )
                                                                        )
                                                                        .catch(console.error);

                                                // Fetch Autonomous Intelligence (Features 1-5)
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/autonomous-intelligence`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                setAutoIntelData(
                                                                                                                        data
                                                                                                );
                                                                                                if (
                                                                                                                        data?.multi_agent_council
                                                                                                )
                                                                                                                        setCouncilData(
                                                                                                                                                data.multi_agent_council
                                                                                                                        );
                                                                                                if (
                                                                                                                        data?.digital_twin
                                                                                                )
                                                                                                                        setDigitalTwinData(
                                                                                                                                                data.digital_twin
                                                                                                                        );
                                                                        })
                                                                        .catch(console.error);

                                                // Fetch Architecture Intelligence (Features 6-25)
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/architecture-intelligence`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) =>
                                                                                                setArchIntelData(
                                                                                                                        data
                                                                                                )
                                                                        )
                                                                        .catch(console.error);

                                                // Fetch Continuous Analysis (Features 6-30)
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/continuous-analysis`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) =>
                                                                                                setContData(
                                                                                                                        data
                                                                                                )
                                                                        )
                                                                        .catch(console.error);

                                                // Fetch 40 Specialized AI Advisors (Features 31-70)
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/ai-advisors`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) =>
                                                                                                setAiAdvisorsData(
                                                                                                                        data
                                                                                                )
                                                                        )
                                                                        .catch(console.error);

                                                // Fetch Governance & Compliance (Features 71-100)
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/governance-compliance`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) =>
                                                                                                setGovCompData(
                                                                                                                        data
                                                                                                )
                                                                        )
                                                                        .catch(console.error);

                                                // Fetch Enterprise Intelligence (Features 101-130)
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/enterprise-intelligence`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) =>
                                                                                                setEntIntelData(
                                                                                                                        data
                                                                                                )
                                                                        )
                                                                        .catch(console.error);

                                                // Fetch Ecosystem & Extensibility (Features 131-150)
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/ecosystem-extensibility`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) =>
                                                                                                setEcosystemData(
                                                                                                                        data
                                                                                                )
                                                                        )
                                                                        .catch(console.error);
                        }, [selectedRepoId, token]);

                        const handleRunSimulation = () => {
                                                if (!selectedRepoId || !token) return;
                                                setSimLoading(true);
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/simulate`,
                                                                        {
                                                                                                method: 'POST',
                                                                                                headers: {
                                                                                                                        'Content-Type': 'application/json',
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                                                body: JSON.stringify(
                                                                                                                        {
                                                                                                                                                scenario_type: simScenario,
                                                                                                                                                target_users: Number(
                                                                                                                                                                        simTargetUsers
                                                                                                                                                ),
                                                                                                                        }
                                                                                                ),
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                setSimulationData(
                                                                                                                        data
                                                                                                );
                                                                                                setSimLoading(
                                                                                                                        false
                                                                                                );
                                                                        })
                                                                        .catch((err) => {
                                                                                                console.error(
                                                                                                                        err
                                                                                                );
                                                                                                setSimLoading(
                                                                                                                        false
                                                                                                );
                                                                        });
                        };

                        const handleApproveRecommendation = (recId: string, approved: boolean) => {
                                                if (!selectedRepoId || !token) return;
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/approve-recommendation`,
                                                                        {
                                                                                                method: 'POST',
                                                                                                headers: {
                                                                                                                        'Content-Type': 'application/json',
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                                                body: JSON.stringify(
                                                                                                                        {
                                                                                                                                                recommendation_id: recId,
                                                                                                                                                approved: approved,
                                                                                                                                                comments: approved
                                                                                                                                                                        ? 'Approved by Lead Architect via ASIP Console'
                                                                                                                                                                        : 'Rejected for Q4 review',
                                                                                                                        }
                                                                                                ),
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((resData) => {
                                                                                                alert(
                                                                                                                        `Decision: ${resData.decision} - ${resData.comments}`
                                                                                                );
                                                                                                // Refresh governance data
                                                                                                fetch(
                                                                                                                        `/api/v1/repositories/${selectedRepoId}/asip/governance`,
                                                                                                                        {
                                                                                                                                                headers: {
                                                                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                                                                },
                                                                                                                        }
                                                                                                )
                                                                                                                        .then(
                                                                                                                                                (
                                                                                                                                                                        res
                                                                                                                                                ) =>
                                                                                                                                                                        res.json()
                                                                                                                        )
                                                                                                                        .then(
                                                                                                                                                (
                                                                                                                                                                        data
                                                                                                                                                ) =>
                                                                                                                                                                        setGovernanceData(
                                                                                                                                                                                                data
                                                                                                                                                                        )
                                                                                                                        );
                                                                        })
                                                                        .catch(console.error);
                        };

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8">
                                                                        {/* Header */}
                                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                                                                                                <div>
                                                                                                                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                                                                                                                                🚀
                                                                                                                                                Autonomous
                                                                                                                                                Software
                                                                                                                                                Intelligence
                                                                                                                                                Platform
                                                                                                                                                (ASIP)
                                                                                                                        </h1>
                                                                                                                        <p className="text-sm text-muted-foreground mt-1">
                                                                                                                                                Continuous
                                                                                                                                                Virtual
                                                                                                                                                Engineering
                                                                                                                                                Operations
                                                                                                                                                Center
                                                                                                                                                —
                                                                                                                                                Predict,
                                                                                                                                                Simulate,
                                                                                                                                                Govern
                                                                                                                                                &
                                                                                                                                                Improve
                                                                                                                        </p>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <Link
                                                                                                                                                href="/mission-control"
                                                                                                                                                className="px-4 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow transition-all flex items-center gap-2"
                                                                                                                        >
                                                                                                                                                🌐
                                                                                                                                                Engineering
                                                                                                                                                Mission
                                                                                                                                                Control
                                                                                                                        </Link>
                                                                                                                        <span className="text-xs font-bold text-muted-foreground uppercase">
                                                                                                                                                Target
                                                                                                                                                Repository:
                                                                                                                        </span>
                                                                                                                        <select
                                                                                                                                                value={
                                                                                                                                                                        selectedRepoId
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setSelectedRepoId(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="bg-card border rounded-lg px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                                                                                        >
                                                                                                                                                {repositories.map(
                                                                                                                                                                        (
                                                                                                                                                                                                r
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <option
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {r.name ||
                                                                                                                                                                                                                                                r.id}
                                                                                                                                                                                                </option>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </select>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Navigation Tabs */}
                                                                        <div className="flex border-b overflow-x-auto gap-2">
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'autonomous'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'autonomous'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        🧠
                                                                                                                        Autonomous
                                                                                                                        Intelligence
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'architecture'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'architecture'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        🏛️
                                                                                                                        System
                                                                                                                        &
                                                                                                                        Architecture
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'continuous'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'continuous'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        🔍
                                                                                                                        Continuous
                                                                                                                        Analysis
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'advisors'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'advisors'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        🤖
                                                                                                                        AI
                                                                                                                        Leadership
                                                                                                                        &
                                                                                                                        Advisors
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'compliance'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'compliance'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        📊
                                                                                                                        Governance
                                                                                                                        &
                                                                                                                        Compliance
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'enterprise'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'enterprise'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        🌍
                                                                                                                        Enterprise
                                                                                                                        Intelligence
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'ecosystem'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'ecosystem'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        🚀
                                                                                                                        Ecosystem
                                                                                                                        &
                                                                                                                        Integrations
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'briefing'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'briefing'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        🌅
                                                                                                                        Monday
                                                                                                                        Morning
                                                                                                                        Briefing
                                                                                                </button>

                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'simulation'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'simulation'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        ⚡
                                                                                                                        Stress
                                                                                                                        Test
                                                                                                                        Simulator
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'governance'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'governance'
                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        🛡️
                                                                                                                        Policy
                                                                                                                        &
                                                                                                                        Approval
                                                                                                                        Queue
                                                                                                </button>
                                                                        </div>

                                                                        {/* View Renderings */}
                                                                        {activeTab ===
                                                                                                'autonomous' && (
                                                                                                <div className="space-y-8">
                                                                                                                        {/* Digital Twin & Command Center Banner */}
                                                                                                                        <div className="grid gap-6 md:grid-cols-2">
                                                                                                                                                <div className="border border-indigo-500/30 rounded-2xl bg-card p-6 space-y-3">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                5:
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Digital
                                                                                                                                                                                                Twin
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <h3 className="text-xl font-extrabold text-foreground">
                                                                                                                                                                                                                        Live
                                                                                                                                                                                                                        Graph
                                                                                                                                                                                                                        Digital
                                                                                                                                                                                                                        Twin
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <span className="text-xs font-extrabold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">
                                                                                                                                                                                                                        Fidelity:{' '}
                                                                                                                                                                                                                        {digitalTwinData?.twin_fidelity_pct ||
                                                                                                                                                                                                                                                99.4}

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Modeled
                                                                                                                                                                                                Entities:{' '}
                                                                                                                                                                                                {digitalTwinData
                                                                                                                                                                                                                        ?.modeled_entities
                                                                                                                                                                                                                        ?.code_modules_count ||
                                                                                                                                                                                                                        18}{' '}
                                                                                                                                                                                                Code
                                                                                                                                                                                                Modules
                                                                                                                                                                                                •{' '}
                                                                                                                                                                                                {digitalTwinData
                                                                                                                                                                                                                        ?.modeled_entities
                                                                                                                                                                                                                        ?.dependencies_graph_nodes ||
                                                                                                                                                                                                                        42}{' '}
                                                                                                                                                                                                Dependency
                                                                                                                                                                                                Graph
                                                                                                                                                                                                Nodes
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="border border-purple-500/30 rounded-2xl bg-card p-6 space-y-3">
                                                                                                                                                                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                4:
                                                                                                                                                                                                Unified
                                                                                                                                                                                                Command
                                                                                                                                                                                                Center
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="grid grid-cols-2 gap-3 text-xs font-bold pt-1">
                                                                                                                                                                                                <div className="bg-muted/20 p-2.5 rounded-lg">
                                                                                                                                                                                                                        Architecture
                                                                                                                                                                                                                        Health:{' '}
                                                                                                                                                                                                                        <span className="text-primary">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        autoIntelData
                                                                                                                                                                                                                                                                                                ?.command_center
                                                                                                                                                                                                                                                                                                ?.architecture_health_score
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-muted/20 p-2.5 rounded-lg">
                                                                                                                                                                                                                        Security
                                                                                                                                                                                                                        Score:{' '}
                                                                                                                                                                                                                        <span className="text-emerald-400">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        autoIntelData
                                                                                                                                                                                                                                                                                                ?.command_center
                                                                                                                                                                                                                                                                                                ?.security_health_score
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-muted/20 p-2.5 rounded-lg">
                                                                                                                                                                                                                        Reliability:{' '}
                                                                                                                                                                                                                        <span className="text-cyan-400">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        autoIntelData
                                                                                                                                                                                                                                                                                                ?.command_center
                                                                                                                                                                                                                                                                                                ?.reliability_score_pct
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-muted/20 p-2.5 rounded-lg">
                                                                                                                                                                                                                        Monthly
                                                                                                                                                                                                                        ROI
                                                                                                                                                                                                                        Value:{' '}
                                                                                                                                                                                                                        <span className="text-emerald-400">
                                                                                                                                                                                                                                                $
                                                                                                                                                                                                                                                {autoIntelData?.command_center?.business_impact_value_usd_monthly?.toLocaleString()}
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* 10-Agent Multi-Agent Engineering Council Grid */}
                                                                                                                        <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
                                                                                                                                                <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-lg font-extrabold text-foreground">
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        3:
                                                                                                                                                                                                                        Multi-Agent
                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                        Council
                                                                                                                                                                                                                        (10
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Advisors)
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                                        Combined
                                                                                                                                                                                                                        Consensus:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                councilData
                                                                                                                                                                                                                                                                        ?.combined_consensus
                                                                                                                                                                                                                                                                        ?.overall_decision
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 font-extrabold rounded-full border border-indigo-500/30">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        councilData
                                                                                                                                                                                                                                                ?.combined_consensus
                                                                                                                                                                                                                                                ?.consensus_score_pct
                                                                                                                                                                                                }

                                                                                                                                                                                                %
                                                                                                                                                                                                CONSENSUS
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                                                                                                                                                                        {(
                                                                                                                                                                                                councilData?.agent_perspectives ||
                                                                                                                                                                                                []
                                                                                                                                                                        ).map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        ag: any,
                                                                                                                                                                                                                        idx: number
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="border rounded-xl p-3.5 bg-muted/20 space-y-2 text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                                        <span className="font-extrabold text-foreground">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        ag.agent
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        ag.role
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="text-[10px] font-extrabold text-emerald-400 block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                ag.verdict
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <p className="text-[11px] text-muted-foreground leading-snug">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                ag.insight
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {activeTab ===
                                                                                                'architecture' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid gap-6 md:grid-cols-3">
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                6:
                                                                                                                                                                                                Codebase
                                                                                                                                                                                                Health
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        archIntelData
                                                                                                                                                                                                                                                ?.codebase_health_index
                                                                                                                                                                                                                                                ?.overall_score
                                                                                                                                                                                                }
                                                                                                                                                                                                /100
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Maintainability:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        archIntelData
                                                                                                                                                                                                                                                ?.codebase_health_index
                                                                                                                                                                                                                                                ?.maintainability
                                                                                                                                                                                                }

                                                                                                                                                                                                %
                                                                                                                                                                                                •
                                                                                                                                                                                                Reliability:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        archIntelData
                                                                                                                                                                                                                                                ?.codebase_health_index
                                                                                                                                                                                                                                                ?.reliability
                                                                                                                                                                                                }

                                                                                                                                                                                                %
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                8:
                                                                                                                                                                                                Tech
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Velocity
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-amber-400">
                                                                                                                                                                                                +
                                                                                                                                                                                                {
                                                                                                                                                                                                                        archIntelData
                                                                                                                                                                                                                                                ?.technical_debt_velocity
                                                                                                                                                                                                                                                ?.weekly_debt_growth_hours
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                hrs/wk
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Projected
                                                                                                                                                                                                Annual
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Cost:
                                                                                                                                                                                                $
                                                                                                                                                                                                {archIntelData?.technical_debt_velocity?.projected_annual_debt_cost_usd?.toLocaleString()}
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                18:
                                                                                                                                                                                                Cloud
                                                                                                                                                                                                Cost
                                                                                                                                                                                                Savings
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-emerald-400">
                                                                                                                                                                                                $
                                                                                                                                                                                                {
                                                                                                                                                                                                                        archIntelData
                                                                                                                                                                                                                                                ?.cloud_cost_arbitrage
                                                                                                                                                                                                                                                ?.potential_monthly_savings_usd
                                                                                                                                                                                                }
                                                                                                                                                                                                /mo
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Waste
                                                                                                                                                                                                Sources:
                                                                                                                                                                                                Graviton
                                                                                                                                                                                                ARM
                                                                                                                                                                                                +
                                                                                                                                                                                                Idle
                                                                                                                                                                                                staging
                                                                                                                                                                                                cleanup
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Complexity Hotspots Grid */}
                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                <h3 className="text-sm font-extrabold text-foreground border-b pb-2">
                                                                                                                                                                        ⭐
                                                                                                                                                                        Feature
                                                                                                                                                                        10:
                                                                                                                                                                        System
                                                                                                                                                                        Complexity
                                                                                                                                                                        Hotspots
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-2">
                                                                                                                                                                        {(
                                                                                                                                                                                                archIntelData?.complexity_heatmap ||
                                                                                                                                                                                                []
                                                                                                                                                                        ).map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        spot: any,
                                                                                                                                                                                                                        idx: number
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="flex justify-between items-center p-3 bg-muted/20 border rounded-xl text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <span className="font-mono text-indigo-300">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                spot.file
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                        <span className="font-bold">
                                                                                                                                                                                                                                                                                                Cyclomatic:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        spot.complexity
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                                                                className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${spot.status === 'Hotspot' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        spot.status
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {activeTab ===
                                                                                                'continuous' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {/* Release Readiness & Quality Gates */}
                                                                                                                        <div className="grid gap-6 md:grid-cols-2">
                                                                                                                                                <div className="border border-emerald-500/30 rounded-2xl bg-gradient-to-r from-card to-emerald-500/10 p-6 space-y-3">
                                                                                                                                                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                29:
                                                                                                                                                                                                Release
                                                                                                                                                                                                Readiness
                                                                                                                                                                                                Score
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <h3 className="text-3xl font-black text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                contData
                                                                                                                                                                                                                                                                        ?.release_readiness
                                                                                                                                                                                                                                                                        ?.readiness_score
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        /100
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <span className="text-xs font-black bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                contData
                                                                                                                                                                                                                                                                        ?.release_readiness
                                                                                                                                                                                                                                                                        ?.verdict
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                CI
                                                                                                                                                                                                Build
                                                                                                                                                                                                Success:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        contData
                                                                                                                                                                                                                                                ?.build_stability
                                                                                                                                                                                                                                                ?.ci_build_success_rate_pct
                                                                                                                                                                                                }

                                                                                                                                                                                                %
                                                                                                                                                                                                •
                                                                                                                                                                                                Change
                                                                                                                                                                                                Risk:
                                                                                                                                                                                                Low
                                                                                                                                                                                                (
                                                                                                                                                                                                {
                                                                                                                                                                                                                        contData
                                                                                                                                                                                                                                                ?.change_risk_estimation
                                                                                                                                                                                                                                                ?.latest_pr_risk_score
                                                                                                                                                                                                }
                                                                                                                                                                                                /100)
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-3 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                30:
                                                                                                                                                                                                Automated
                                                                                                                                                                                                Quality
                                                                                                                                                                                                Gates
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="space-y-2 pt-1">
                                                                                                                                                                                                {(
                                                                                                                                                                                                                        contData?.quality_gates ||
                                                                                                                                                                                                                        []
                                                                                                                                                                                                ).map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                qg: any,
                                                                                                                                                                                                                                                idx: number
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="flex justify-between items-center text-xs p-2 bg-muted/20 rounded-lg"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <span className="font-bold text-foreground">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        qg.gate
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        qg.status
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Service Health Overlays */}
                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                <h3 className="text-sm font-extrabold text-foreground border-b pb-2">
                                                                                                                                                                        ⭐
                                                                                                                                                                        Feature
                                                                                                                                                                        21:
                                                                                                                                                                        Live
                                                                                                                                                                        Service
                                                                                                                                                                        Health
                                                                                                                                                                        Overlays
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid gap-4 md:grid-cols-4">
                                                                                                                                                                        {(
                                                                                                                                                                                                contData?.service_health_overlays ||
                                                                                                                                                                                                []
                                                                                                                                                                        ).map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        sh: any,
                                                                                                                                                                                                                        idx: number
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="border rounded-xl p-3.5 bg-muted/20 space-y-1.5 text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                                        <span className="font-bold text-foreground">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        sh.service
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-[9px] font-extrabold text-emerald-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        sh.status
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                                                                        Latency:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                sh.latency_ms
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        ms
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {activeTab ===
                                                                                                'advisors' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {/* Top Ranked Recommendations */}
                                                                                                                        <div className="border border-indigo-500/30 rounded-2xl bg-card p-6 shadow-sm space-y-4">
                                                                                                                                                <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-lg font-extrabold text-foreground">
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        70:
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Recommendation
                                                                                                                                                                                                                        Ranking
                                                                                                                                                                                                                        Matrix
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                                        Prioritized
                                                                                                                                                                                                                        recommendations
                                                                                                                                                                                                                        across
                                                                                                                                                                                                                        40
                                                                                                                                                                                                                        specialized
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Advisors
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 font-extrabold rounded-full border border-indigo-500/30">
                                                                                                                                                                                                40
                                                                                                                                                                                                ACTIVE
                                                                                                                                                                                                ADVISORS
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid gap-4 md:grid-cols-2">
                                                                                                                                                                        {(
                                                                                                                                                                                                aiAdvisorsData?.top_ranked_recommendations ||
                                                                                                                                                                                                []
                                                                                                                                                                        ).map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        rec: any,
                                                                                                                                                                                                                        idx: number
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="border rounded-xl p-4 bg-muted/20 space-y-2 text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                                        <span className="font-extrabold text-primary">
                                                                                                                                                                                                                                                                                                #
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        rec.rank
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        rec.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        rec.confidence_score_pct
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                                                                                                CONFIDENCE
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                                                                        Advisor:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                rec.advisor
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        •
                                                                                                                                                                                                                                                                        Impact:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                rec.impact
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* 40 AI Advisors Directory Grid */}
                                                                                                                        <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
                                                                                                                                                <h3 className="text-sm font-extrabold text-foreground border-b pb-2">
                                                                                                                                                                        🤖
                                                                                                                                                                        Features
                                                                                                                                                                        31–70:
                                                                                                                                                                        40
                                                                                                                                                                        Specialized
                                                                                                                                                                        AI
                                                                                                                                                                        Advisors
                                                                                                                                                                        Directory
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                                                                                                                                                        {(
                                                                                                                                                                                                aiAdvisorsData?.advisors_directory ||
                                                                                                                                                                                                []
                                                                                                                                                                        ).map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        adv: any
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        adv.id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="border rounded-xl p-3 bg-muted/10 space-y-1.5 text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                                        <span className="font-extrabold text-foreground">
                                                                                                                                                                                                                                                                                                #
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        adv.id
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        adv.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="text-[10px] font-bold text-indigo-400 block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                adv.focus
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <p className="text-[11px] text-muted-foreground leading-snug">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                adv.insight
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {activeTab ===
                                                                                                'compliance' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {/* Certification Badge & Audit Package Export */}
                                                                                                                        <div className="border border-indigo-500/30 rounded-2xl bg-gradient-to-r from-card to-indigo-500/10 p-6 space-y-4 shadow-sm">
                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        78:
                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                        Certification
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                govCompData
                                                                                                                                                                                                                                                                        ?.repository_certification
                                                                                                                                                                                                                                                                        ?.certification_badge
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h3>
                                                                                                                                                                        </div>
                                                                                                                                                                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow transition-all">
                                                                                                                                                                                                📥
                                                                                                                                                                                                Export
                                                                                                                                                                                                Audit
                                                                                                                                                                                                Evidence
                                                                                                                                                                                                (.ZIP)
                                                                                                                                                                        </button>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                        Certified
                                                                                                                                                                        Date:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                govCompData
                                                                                                                                                                                                                        ?.repository_certification
                                                                                                                                                                                                                        ?.certified_date
                                                                                                                                                                        }{' '}
                                                                                                                                                                        •
                                                                                                                                                                        Valid
                                                                                                                                                                        Until:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                govCompData
                                                                                                                                                                                                                        ?.repository_certification
                                                                                                                                                                                                                        ?.valid_until
                                                                                                                                                                        }
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        {/* Regulatory Mapping Grid */}
                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                <h3 className="text-sm font-extrabold text-foreground border-b pb-2">
                                                                                                                                                                        ⭐
                                                                                                                                                                        Feature
                                                                                                                                                                        74:
                                                                                                                                                                        Regulatory
                                                                                                                                                                        Compliance
                                                                                                                                                                        Mapping
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid gap-4 md:grid-cols-4">
                                                                                                                                                                        <div className="border rounded-xl p-4 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        SOC2
                                                                                                                                                                                                                        Type
                                                                                                                                                                                                                        II
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h4 className="text-xl font-black text-emerald-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                govCompData
                                                                                                                                                                                                                                                                        ?.regulatory_mapping
                                                                                                                                                                                                                                                                        ?.soc2_type_ii_compliance_pct
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                <span className="text-[10px] text-muted-foreground">
                                                                                                                                                                                                                        Security
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Availability
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-4 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        ISO
                                                                                                                                                                                                                        27001
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h4 className="text-xl font-black text-emerald-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                govCompData
                                                                                                                                                                                                                                                                        ?.regulatory_mapping
                                                                                                                                                                                                                                                                        ?.iso_27001_compliance_pct
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                <span className="text-[10px] text-muted-foreground">
                                                                                                                                                                                                                        ISMS
                                                                                                                                                                                                                        Management
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-4 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        HIPAA
                                                                                                                                                                                                                        Privacy
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h4 className="text-xl font-black text-emerald-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                govCompData
                                                                                                                                                                                                                                                                        ?.regulatory_mapping
                                                                                                                                                                                                                                                                        ?.hipaa_compliance_pct
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                <span className="text-[10px] text-muted-foreground">
                                                                                                                                                                                                                        ePHI
                                                                                                                                                                                                                        Security
                                                                                                                                                                                                                        Standard
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-4 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        GDPR
                                                                                                                                                                                                                        Privacy
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h4 className="text-xl font-black text-emerald-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                govCompData
                                                                                                                                                                                                                                                                        ?.regulatory_mapping
                                                                                                                                                                                                                                                                        ?.gdpr_data_privacy_pct
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                <span className="text-[10px] text-muted-foreground">
                                                                                                                                                                                                                        Data
                                                                                                                                                                                                                        Protection
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Erasure
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Scorecards Row */}
                                                                                                                        <div className="grid gap-6 md:grid-cols-3">
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                86:
                                                                                                                                                                                                Reliability
                                                                                                                                                                                                Scorecard
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        govCompData
                                                                                                                                                                                                                                                ?.reliability_scorecard
                                                                                                                                                                                                                                                ?.score
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                (
                                                                                                                                                                                                {
                                                                                                                                                                                                                        govCompData
                                                                                                                                                                                                                                                ?.reliability_scorecard
                                                                                                                                                                                                                                                ?.sla_target_pct
                                                                                                                                                                                                }
                                                                                                                                                                                                %)
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                MTBF:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        govCompData
                                                                                                                                                                                                                                                ?.reliability_scorecard
                                                                                                                                                                                                                                                ?.mtbf_hours
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                hours
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                87:
                                                                                                                                                                                                Security
                                                                                                                                                                                                Scorecard
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        govCompData
                                                                                                                                                                                                                                                ?.security_scorecard
                                                                                                                                                                                                                                                ?.security_grade
                                                                                                                                                                                                }
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Critical
                                                                                                                                                                                                CVEs:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        govCompData
                                                                                                                                                                                                                                                ?.security_scorecard
                                                                                                                                                                                                                                                ?.critical_cves
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                88:
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Scorecard
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        govCompData
                                                                                                                                                                                                                                                ?.engineering_scorecard
                                                                                                                                                                                                                                                ?.holistic_score
                                                                                                                                                                                                }
                                                                                                                                                                                                /100
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Velocity:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        govCompData
                                                                                                                                                                                                                                                ?.engineering_scorecard
                                                                                                                                                                                                                                                ?.velocity_score
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                •
                                                                                                                                                                                                Quality:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        govCompData
                                                                                                                                                                                                                                                ?.engineering_scorecard
                                                                                                                                                                                                                                                ?.quality_score
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {activeTab ===
                                                                                                'enterprise' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {/* Executive Command Center Header */}
                                                                                                                        <div className="border border-indigo-500/30 rounded-2xl bg-gradient-to-r from-card to-indigo-500/10 p-6 space-y-3 shadow-sm">
                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        130:
                                                                                                                                                                                                                        Executive
                                                                                                                                                                                                                        Command
                                                                                                                                                                                                                        Center
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                entIntelData
                                                                                                                                                                                                                                                                        ?.executive_command_center
                                                                                                                                                                                                                                                                        ?.command_center_status
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h3>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs font-black bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                                                                                                                                                                                                CTO
                                                                                                                                                                                                HEALTH
                                                                                                                                                                                                RATING:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        entIntelData
                                                                                                                                                                                                                                                ?.executive_scorecard
                                                                                                                                                                                                                                                ?.cto_health_rating
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                        Portfolio
                                                                                                                                                                        Health
                                                                                                                                                                        Score:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                entIntelData
                                                                                                                                                                                                                        ?.portfolio_health
                                                                                                                                                                                                                        ?.overall_health_score
                                                                                                                                                                        }
                                                                                                                                                                        /100
                                                                                                                                                                        •
                                                                                                                                                                        Monitored
                                                                                                                                                                        Repositories:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                entIntelData
                                                                                                                                                                                                                        ?.cross_repo_analytics
                                                                                                                                                                                                                        ?.repositories_monitored_count
                                                                                                                                                                        }{' '}
                                                                                                                                                                        across
                                                                                                                                                                        4
                                                                                                                                                                        Domains
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        {/* DORA Metrics & Engineering Benchmarks */}
                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-sm font-extrabold text-foreground">
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        113:
                                                                                                                                                                                                                        DORA
                                                                                                                                                                                                                        Metrics
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Industry
                                                                                                                                                                                                                        Benchmarking
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                                        Global
                                                                                                                                                                                                                        Benchmark
                                                                                                                                                                                                                        Rank:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                entIntelData
                                                                                                                                                                                                                                                                        ?.engineering_benchmarks
                                                                                                                                                                                                                                                                        ?.global_rank_percentile
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs font-extrabold px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        entIntelData
                                                                                                                                                                                                                                                ?.dora_metrics_benchmarking
                                                                                                                                                                                                                                                ?.dora_tier
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid gap-4 md:grid-cols-4">
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="text-muted-foreground block text-[11px]">
                                                                                                                                                                                                                        Deployment
                                                                                                                                                                                                                        Frequency
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h4 className="text-lg font-black text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                entIntelData
                                                                                                                                                                                                                                                                        ?.dora_metrics_benchmarking
                                                                                                                                                                                                                                                                        ?.deployment_frequency
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h4>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="text-muted-foreground block text-[11px]">
                                                                                                                                                                                                                        Lead
                                                                                                                                                                                                                        Time
                                                                                                                                                                                                                        for
                                                                                                                                                                                                                        Changes
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h4 className="text-lg font-black text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                entIntelData
                                                                                                                                                                                                                                                                        ?.dora_metrics_benchmarking
                                                                                                                                                                                                                                                                        ?.lead_time_for_changes_hours
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        hours
                                                                                                                                                                                                </h4>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="text-muted-foreground block text-[11px]">
                                                                                                                                                                                                                        Change
                                                                                                                                                                                                                        Failure
                                                                                                                                                                                                                        Rate
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h4 className="text-lg font-black text-emerald-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                entIntelData
                                                                                                                                                                                                                                                                        ?.dora_metrics_benchmarking
                                                                                                                                                                                                                                                                        ?.change_failure_rate_pct
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </h4>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="text-muted-foreground block text-[11px]">
                                                                                                                                                                                                                        Time
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        Restore
                                                                                                                                                                                                                        Service
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h4 className="text-lg font-black text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                entIntelData
                                                                                                                                                                                                                                                                        ?.dora_metrics_benchmarking
                                                                                                                                                                                                                                                                        ?.time_to_restore_service_mins
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        mins
                                                                                                                                                                                                </h4>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Business Capability Mapping Grid */}
                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                <h3 className="text-sm font-extrabold text-foreground border-b pb-2">
                                                                                                                                                                        ⭐
                                                                                                                                                                        Feature
                                                                                                                                                                        109:
                                                                                                                                                                        Business
                                                                                                                                                                        Capability
                                                                                                                                                                        Mapping
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                                                                                                                                                        {(
                                                                                                                                                                                                entIntelData?.business_capability_mapping ||
                                                                                                                                                                                                []
                                                                                                                                                                        ).map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        bc: any,
                                                                                                                                                                                                                        idx: number
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="border rounded-xl p-3 bg-muted/10 space-y-1 text-xs"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                                        <span className="font-extrabold text-foreground">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        bc.capability
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-[9px] font-extrabold text-emerald-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        bc.health
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                                                                        Code
                                                                                                                                                                                                                                                                        Coverage:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                bc.code_coverage_pct
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {activeTab ===
                                                                                                'ecosystem' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {/* Developer Marketplace Header */}
                                                                                                                        <div className="border border-indigo-500/30 rounded-2xl bg-gradient-to-r from-card to-indigo-500/10 p-6 space-y-3 shadow-sm">
                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        150:
                                                                                                                                                                                                                        Developer
                                                                                                                                                                                                                        Plugin
                                                                                                                                                                                                                        Marketplace
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h3 className="text-2xl font-black text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ecosystemData
                                                                                                                                                                                                                                                                        ?.marketplace
                                                                                                                                                                                                                                                                        ?.marketplace_status
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h3>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs font-black bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ecosystemData
                                                                                                                                                                                                                                                ?.marketplace
                                                                                                                                                                                                                                                ?.total_available_plugins
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                AVAILABLE
                                                                                                                                                                                                PLUGINS
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                        Plugin
                                                                                                                                                                        SDK:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                ecosystemData
                                                                                                                                                                                                                        ?.plugin_sdk
                                                                                                                                                                                                                        ?.sdk_version
                                                                                                                                                                        }{' '}
                                                                                                                                                                        (
                                                                                                                                                                        {ecosystemData?.plugin_sdk?.bindings?.join(
                                                                                                                                                                                                ', '
                                                                                                                                                                        )}

                                                                                                                                                                        )
                                                                                                                                                                        •
                                                                                                                                                                        Installed
                                                                                                                                                                        Community
                                                                                                                                                                        Plugins:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                ecosystemData
                                                                                                                                                                                                                        ?.marketplace
                                                                                                                                                                                                                        ?.community_plugins_installed
                                                                                                                                                                        }
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        {/* Integrations Grid (GitHub, GitLab, Jira, Slack, Teams, Linear) */}
                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                <h3 className="text-sm font-extrabold text-foreground border-b pb-2">
                                                                                                                                                                        ⭐
                                                                                                                                                                        Features
                                                                                                                                                                        137–144:
                                                                                                                                                                        Integrations
                                                                                                                                                                        Hub
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid gap-4 md:grid-cols-3">
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        GitHub
                                                                                                                                                                                                                        App
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-emerald-400 font-bold text-[11px]">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ecosystemData
                                                                                                                                                                                                                                                                        ?.github_app
                                                                                                                                                                                                                                                                        ?.installation_status
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        GitLab
                                                                                                                                                                                                                        CI
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        MR
                                                                                                                                                                                                                        Bot
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-emerald-400 font-bold text-[11px]">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ecosystemData
                                                                                                                                                                                                                                                                        ?.gitlab_integration
                                                                                                                                                                                                                                                                        ?.status
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        Jira
                                                                                                                                                                                                                        Software
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-emerald-400 font-bold text-[11px]">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ecosystemData
                                                                                                                                                                                                                                                                        ?.jira_integration
                                                                                                                                                                                                                                                                        ?.status
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        Slack
                                                                                                                                                                                                                        Alerts
                                                                                                                                                                                                                        Bot
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-indigo-300 font-bold text-[11px]">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ecosystemData
                                                                                                                                                                                                                                                                        ?.slack_integration
                                                                                                                                                                                                                                                                        ?.channel
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        Linear
                                                                                                                                                                                                                        Sync
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-emerald-400 font-bold text-[11px]">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ecosystemData
                                                                                                                                                                                                                                                                        ?.linear_integration
                                                                                                                                                                                                                                                                        ?.status
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="border rounded-xl p-3.5 bg-muted/20 space-y-1 text-xs">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        Azure
                                                                                                                                                                                                                        DevOps
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-emerald-400 font-bold text-[11px]">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ecosystemData
                                                                                                                                                                                                                                                                        ?.azure_devops_integration
                                                                                                                                                                                                                                                                        ?.status
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Developer Tooling Row (CLI, VS Code, GraphQL) */}
                                                                                                                        <div className="grid gap-6 md:grid-cols-3">
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                147:
                                                                                                                                                                                                CLI
                                                                                                                                                                                                Executable
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-xl font-black text-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ecosystemData
                                                                                                                                                                                                                                                ?.cli
                                                                                                                                                                                                                                                ?.binary
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                (
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ecosystemData
                                                                                                                                                                                                                                                ?.cli
                                                                                                                                                                                                                                                ?.version
                                                                                                                                                                                                }

                                                                                                                                                                                                )
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                Commands:{' '}
                                                                                                                                                                                                {ecosystemData?.cli?.commands?.join(
                                                                                                                                                                                                                        ', '
                                                                                                                                                                                                )}
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                148:
                                                                                                                                                                                                VS
                                                                                                                                                                                                Code
                                                                                                                                                                                                Extension
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-xl font-black text-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ecosystemData
                                                                                                                                                                                                                                                ?.vscode_extension
                                                                                                                                                                                                                                                ?.extension_name
                                                                                                                                                                                                }
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ecosystemData
                                                                                                                                                                                                                                                ?.vscode_extension
                                                                                                                                                                                                                                                ?.status
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-2 shadow-sm">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                ⭐
                                                                                                                                                                                                Feature
                                                                                                                                                                                                146:
                                                                                                                                                                                                GraphQL
                                                                                                                                                                                                API
                                                                                                                                                                        </span>
                                                                                                                                                                        <h3 className="text-xl font-black text-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ecosystemData
                                                                                                                                                                                                                                                ?.graphql_api
                                                                                                                                                                                                                                                ?.endpoint
                                                                                                                                                                                                }
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ecosystemData
                                                                                                                                                                                                                                                ?.graphql_api
                                                                                                                                                                                                                                                ?.schema_status
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* View Renderings */}
                                                                        {activeTab ===
                                                                                                'briefing' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {/* Virtual Ops Alert Banner */}
                                                                                                                        <div className="border border-indigo-500/30 rounded-2xl bg-gradient-to-r from-card via-card to-indigo-500/10 p-6 shadow-sm flex items-center justify-between">
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider block">
                                                                                                                                                                                                Virtual
                                                                                                                                                                                                Ops
                                                                                                                                                                                                Operations
                                                                                                                                                                                                Center
                                                                                                                                                                        </span>
                                                                                                                                                                        <h2 className="text-xl font-extrabold text-foreground mt-1">
                                                                                                                                                                                                Monday
                                                                                                                                                                                                Morning
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Executive
                                                                                                                                                                                                Briefing
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-xs text-muted-foreground mt-1">
                                                                                                                                                                                                {briefingData?.repos_needing_attention_count ||
                                                                                                                                                                                                                        3}{' '}
                                                                                                                                                                                                repositories
                                                                                                                                                                                                require
                                                                                                                                                                                                attention.
                                                                                                                                                                                                Tech
                                                                                                                                                                                                debt
                                                                                                                                                                                                velocity:
                                                                                                                                                                                                +
                                                                                                                                                                                                {briefingData?.tech_debt_growth_rate_pct ||
                                                                                                                                                                                                                        12}

                                                                                                                                                                                                %
                                                                                                                                                                                                this
                                                                                                                                                                                                week.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <span className="text-xs px-3 py-1.5 bg-indigo-500/20 text-indigo-300 font-extrabold rounded-full border border-indigo-500/30">
                                                                                                                                                                        AUTOMATED
                                                                                                                                                                        INTELLIGENCE
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        {/* 3 Main Briefing Columns */}
                                                                                                                        <div className="grid gap-6 md:grid-cols-3">
                                                                                                                                                {/* Column 1: Drift Alerts */}
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-4 shadow-sm">
                                                                                                                                                                        <h3 className="text-sm font-extrabold text-rose-400 border-b pb-2 flex items-center justify-between">
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        ⚠️
                                                                                                                                                                                                                        Architecture
                                                                                                                                                                                                                        Drift
                                                                                                                                                                                                                        Alerts
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        ACTION
                                                                                                                                                                                                                        REQUIRED
                                                                                                                                                                                                </span>
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="space-y-3">
                                                                                                                                                                                                {(
                                                                                                                                                                                                                        briefingData?.architecture_drift_alerts ||
                                                                                                                                                                                                                        []
                                                                                                                                                                                                ).map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                alertItem: any
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                alertItem.alert_id
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="border rounded-xl p-3 bg-muted/20 text-xs space-y-1"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <span className="font-bold text-foreground block">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        alertItem.component
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        alertItem.issue
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                        <p className="text-rose-400 text-[11px] font-medium pt-1">
                                                                                                                                                                                                                                                                                                Fix:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        alertItem.action_required
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Column 2: Bottleneck Forecasts */}
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-4 shadow-sm">
                                                                                                                                                                        <h3 className="text-sm font-extrabold text-amber-400 border-b pb-2 flex items-center justify-between">
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        ⏳
                                                                                                                                                                                                                        Service
                                                                                                                                                                                                                        Bottleneck
                                                                                                                                                                                                                        Forecasts
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        PREDICTIVE
                                                                                                                                                                                                </span>
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="space-y-3">
                                                                                                                                                                                                {(
                                                                                                                                                                                                                        briefingData?.service_bottleneck_forecasts ||
                                                                                                                                                                                                                        []
                                                                                                                                                                                                ).map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                bot: any,
                                                                                                                                                                                                                                                idx: number
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="border rounded-xl p-3 bg-muted/20 text-xs space-y-1"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <span className="font-bold text-foreground block">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        bot.service
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                                                                                                Threshold:{' '}
                                                                                                                                                                                                                                                                                                {bot.predicted_bottleneck_rps?.toLocaleString()}{' '}
                                                                                                                                                                                                                                                                                                RPS
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        bot.time_to_exhaustion
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                        <p className="text-amber-400 text-[11px] font-medium pt-1">
                                                                                                                                                                                                                                                                                                Rec:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        bot.recommendation
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Column 3: Team Release Risk */}
                                                                                                                                                <div className="border rounded-2xl bg-card p-5 space-y-4 shadow-sm">
                                                                                                                                                                        <h3 className="text-sm font-extrabold text-indigo-400 border-b pb-2 flex items-center justify-between">
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        🚀
                                                                                                                                                                                                                        Team
                                                                                                                                                                                                                        Release
                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                        Forecast
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        POLL
                                                                                                                                                                                                                        RESULTS
                                                                                                                                                                                                </span>
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="space-y-3">
                                                                                                                                                                                                {(
                                                                                                                                                                                                                        briefingData?.deployment_risk_forecast ||
                                                                                                                                                                                                                        []
                                                                                                                                                                                                ).map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                risk: any,
                                                                                                                                                                                                                                                idx: number
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="border rounded-xl p-3 bg-muted/20 text-xs space-y-1"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                                                                <span className="font-bold text-foreground">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                risk.team
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${risk.release_risk_score_pct > 50 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                risk.release_risk_score_pct
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        risk.primary_driver
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {activeTab ===
                                                                                                'simulation' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
                                                                                                                                                <h3 className="text-base font-extrabold text-foreground border-b pb-3">
                                                                                                                                                                        ⚡
                                                                                                                                                                        Stress
                                                                                                                                                                        Test
                                                                                                                                                                        Simulation
                                                                                                                                                                        Engine
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid gap-4 md:grid-cols-3">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="text-xs font-bold text-muted-foreground block mb-1">
                                                                                                                                                                                                                        Scenario
                                                                                                                                                                                                                        Type:
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <select
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                simScenario
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setSimScenario(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full bg-muted border rounded-lg p-2 text-xs font-bold text-foreground"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <option value="user_scale_100m">
                                                                                                                                                                                                                                                100M
                                                                                                                                                                                                                                                User
                                                                                                                                                                                                                                                Scale
                                                                                                                                                                                                                                                Stress
                                                                                                                                                                                                                                                Test
                                                                                                                                                                                                                        </option>
                                                                                                                                                                                                                        <option value="microservices_split">
                                                                                                                                                                                                                                                Monolith
                                                                                                                                                                                                                                                to
                                                                                                                                                                                                                                                Microservices
                                                                                                                                                                                                                                                Split
                                                                                                                                                                                                                        </option>
                                                                                                                                                                                                                        <option value="baseline">
                                                                                                                                                                                                                                                Baseline
                                                                                                                                                                                                                                                Health
                                                                                                                                                                                                                                                Check
                                                                                                                                                                                                                        </option>
                                                                                                                                                                                                </select>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="text-xs font-bold text-muted-foreground block mb-1">
                                                                                                                                                                                                                        Target
                                                                                                                                                                                                                        Concurrency
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        Users:
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="number"
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                simTargetUsers
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setSimTargetUsers(
                                                                                                                                                                                                                                                                        Number(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full bg-muted border rounded-lg p-2 text-xs font-bold text-foreground"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex items-end">
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        onClick={
                                                                                                                                                                                                                                                handleRunSimulation
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        disabled={
                                                                                                                                                                                                                                                simLoading
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full font-bold"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {simLoading
                                                                                                                                                                                                                                                ? 'Simulating Architecture...'
                                                                                                                                                                                                                                                : '🚀 Execute Simulation'}
                                                                                                                                                                                                </Button>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {simulationData && (
                                                                                                                                                                        <div className="border border-indigo-500/30 rounded-xl p-5 bg-card space-y-4 mt-4">
                                                                                                                                                                                                <div className="flex justify-between items-center border-b pb-2">
                                                                                                                                                                                                                        <h4 className="text-sm font-extrabold text-indigo-400">
                                                                                                                                                                                                                                                Simulation
                                                                                                                                                                                                                                                Verdict:{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        simulationData.verdict
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                        <span className="text-xs font-bold text-emerald-400">
                                                                                                                                                                                                                                                Reliability
                                                                                                                                                                                                                                                Score:{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        simulationData.predicted_reliability_score_pct
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="grid grid-cols-3 gap-4 text-xs font-bold">
                                                                                                                                                                                                                        <div className="p-3 bg-muted/20 rounded-lg">
                                                                                                                                                                                                                                                P99
                                                                                                                                                                                                                                                Latency:{' '}
                                                                                                                                                                                                                                                <span className="text-primary">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                simulationData.predicted_latency_p99_ms
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        ms
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="p-3 bg-muted/20 rounded-lg">
                                                                                                                                                                                                                                                Monthly
                                                                                                                                                                                                                                                Cost:{' '}
                                                                                                                                                                                                                                                <span className="text-emerald-400">
                                                                                                                                                                                                                                                                        $
                                                                                                                                                                                                                                                                        {simulationData.predicted_monthly_cost_usd?.toLocaleString()}
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="p-3 bg-muted/20 rounded-lg">
                                                                                                                                                                                                                                                Security
                                                                                                                                                                                                                                                Risk
                                                                                                                                                                                                                                                Score:{' '}
                                                                                                                                                                                                                                                <span className="text-cyan-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                simulationData.predicted_security_risk_score
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-black/90 p-4 rounded-xl font-mono text-[11px] text-indigo-300 space-y-1">
                                                                                                                                                                                                                        {(
                                                                                                                                                                                                                                                simulationData.simulation_logs ||
                                                                                                                                                                                                                                                []
                                                                                                                                                                                                                        ).map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        log: string,
                                                                                                                                                                                                                                                                        idx: number
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        log
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {activeTab ===
                                                                                                'governance' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
                                                                                                                                                <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-base font-extrabold text-foreground">
                                                                                                                                                                                                                        🛡️
                                                                                                                                                                                                                        System
                                                                                                                                                                                                                        Governance
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Human
                                                                                                                                                                                                                        Approval
                                                                                                                                                                                                                        Queue
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                                        Compliance
                                                                                                                                                                                                                        Score:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                governanceData?.compliance_score_pct
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        %
                                                                                                                                                                                                                        |{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                governanceData?.enforced_policies_count
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        Mandatory
                                                                                                                                                                                                                        Policies
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold rounded-full border border-emerald-500/20">
                                                                                                                                                                                                HUMAN-IN-THE-LOOP
                                                                                                                                                                                                CONTROL
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="space-y-4">
                                                                                                                                                                        <h4 className="text-xs font-bold uppercase text-muted-foreground">
                                                                                                                                                                                                Pending
                                                                                                                                                                                                Human
                                                                                                                                                                                                Approvals
                                                                                                                                                                        </h4>
                                                                                                                                                                        {(
                                                                                                                                                                                                governanceData?.pending_approvals ||
                                                                                                                                                                                                []
                                                                                                                                                                        ).map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        reqItem: any
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        reqItem.recommendation_id
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="border rounded-xl p-4 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="text-xs font-extrabold text-primary block">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        reqItem.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                                                                                                                                                                                                                                                                Submitted
                                                                                                                                                                                                                                                                                                by{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        reqItem.submitted_by
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                •
                                                                                                                                                                                                                                                                                                Impact:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        reqItem.impact
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                •
                                                                                                                                                                                                                                                                                                Effort:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        reqItem.effort
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="flex items-center gap-2">
                                                                                                                                                                                                                                                                        <Button
                                                                                                                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                                                                        handleApproveRecommendation(
                                                                                                                                                                                                                                                                                                                                                reqItem.recommendation_id,
                                                                                                                                                                                                                                                                                                                                                true
                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                ✅
                                                                                                                                                                                                                                                                                                Approve
                                                                                                                                                                                                                                                                        </Button>
                                                                                                                                                                                                                                                                        <Button
                                                                                                                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                                                                                                                variant="outline"
                                                                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                                                                        handleApproveRecommendation(
                                                                                                                                                                                                                                                                                                                                                reqItem.recommendation_id,
                                                                                                                                                                                                                                                                                                                                                false
                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs font-bold"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                ❌
                                                                                                                                                                                                                                                                                                Reject
                                                                                                                                                                                                                                                                        </Button>
                                                                                                                                                                                                                                                </div>
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
