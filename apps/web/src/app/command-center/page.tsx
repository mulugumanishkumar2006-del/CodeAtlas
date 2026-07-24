'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import {
                        Activity,
                        Sliders,
                        AlertTriangle,
                        ShieldAlert,
                        TrendingUp,
                        Brain,
                        FileText,
                        HelpCircle,
                        Server,
                        Zap,
                        Layers,
                        BookOpen,
                        Clock,
                        Map,
                        RefreshCw,
                        Bug,
                        CheckCircle2,
                        CloudRain,
                        CloudSun,
                        CloudLightning,
                        Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Repository {
                        id: string;
                        name: string;
                        full_name: string;
}

interface DtCity {
                        city_name: string;
                        districts_count: number;
                        overall_health: number;
                        congestion_index: number;
}

interface DtSimulation {
                        simulation_active: boolean;
                        db_status: string;
                        active_load_users: number;
}

interface DtArchitecture {
                        class_count: number;
                        file_count: number;
                        modularity_score: number;
                        max_nesting_depth: number;
}

interface DtKnowledge {
                        documentation_coverage: number;
                        comments_lines: number;
                        code_lines: number;
                        knowledge_score: number;
}

interface DtHealth {
                        overall_health: number;
                        active_alerts_count: number;
                        critical_risks_count: number;
                        alerts: string[];
}

interface ForecastDay {
                        day: number;
                        predicted_health: number;
                        predicted_complexity: number;
}

interface DtForecast {
                        forecast_days: ForecastDay[];
                        description: string;
}

interface DtTimelineMilestone {
                        date: string;
                        milestone: string;
                        files_count: number;
}

interface DtTimeline {
                        milestones: DtTimelineMilestone[];
}

interface DtRecommendation {
                        category: string;
                        recommendation: string;
                        file_target?: string;
}

interface DtRecommendations {
                        recommendations: DtRecommendation[];
}

export default function CommandCenterPage() {
                        const { token } = useAuth();
                        const [repos, setRepos] = React.useState<Repository[]>([]);
                        const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');

                        // State loaders
                        const [loading, setLoading] = React.useState<boolean>(true);

                        // API datasets
                        const [city, setCity] = React.useState<DtCity | null>(null);
                        const [simulation, setSimulation] = React.useState<DtSimulation | null>(
                                                null
                        );
                        const [architecture, setArchitecture] =
                                                React.useState<DtArchitecture | null>(null);
                        const [knowledge, setKnowledge] = React.useState<DtKnowledge | null>(null);
                        const [health, setHealth] = React.useState<DtHealth | null>(null);
                        const [forecast, setForecast] = React.useState<DtForecast | null>(null);
                        const [timeline, setTimeline] = React.useState<DtTimeline | null>(null);
                        const [recs, setRecs] = React.useState<DtRecommendations | null>(null);

                        // Local chaos simulation states
                        const [localUserLoad, setLocalUserLoad] = React.useState<number>(120);
                        const [dbOutageSimulated, setDbOutageSimulated] =
                                                React.useState<boolean>(false);
                        const [cpuSpikeSimulated, setCpuSpikeSimulated] =
                                                React.useState<boolean>(false);

                        // Fetch repositories
                        React.useEffect(() => {
                                                if (!token) return;
                                                fetch('/api/v1/repositories', {
                                                                        headers: {
                                                                                                Authorization: `Bearer ${token}`,
                                                                        },
                                                })
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                setRepos(
                                                                                                                        data
                                                                                                );
                                                                                                if (
                                                                                                                        data.length >
                                                                                                                        0
                                                                                                ) {
                                                                                                                        setSelectedRepoId(
                                                                                                                                                data[0]
                                                                                                                                                                        .id
                                                                                                                        );
                                                                                                }
                                                                        })
                                                                        .catch((err) =>
                                                                                                console.error(
                                                                                                                        'Error loading repositories',
                                                                                                                        err
                                                                                                )
                                                                        );
                        }, [token]);

                        // Fetch all digital twin endpoints
                        const fetchTwinData = (repoId: string) => {
                                                if (!token || !repoId) return;
                                                setLoading(true);

                                                const endpoints = [
                                                                        'city',
                                                                        'simulation',
                                                                        'architecture',
                                                                        'knowledge',
                                                                        'health',
                                                                        'forecast',
                                                                        'timeline',
                                                                        'recommendations',
                                                ];
                                                const fetchPromises = endpoints.map((ep) =>
                                                                        fetch(
                                                                                                `/api/v1/digital-twin/${ep}?repo_id=${repoId}`,
                                                                                                {
                                                                                                                        headers: {
                                                                                                                                                Authorization: `Bearer ${token}`,
                                                                                                                        },
                                                                                                }
                                                                        ).then((res) => {
                                                                                                if (
                                                                                                                        !res.ok
                                                                                                )
                                                                                                                        throw new Error(
                                                                                                                                                `Failed to fetch ${ep}`
                                                                                                                        );
                                                                                                return res.json();
                                                                        })
                                                );

                                                Promise.all(fetchPromises)
                                                                        .then(
                                                                                                ([
                                                                                                                        cityData,
                                                                                                                        simData,
                                                                                                                        archData,
                                                                                                                        knowData,
                                                                                                                        healthData,
                                                                                                                        forecastData,
                                                                                                                        timelineData,
                                                                                                                        recsData,
                                                                                                ]) => {
                                                                                                                        setCity(
                                                                                                                                                cityData
                                                                                                                        );
                                                                                                                        setSimulation(
                                                                                                                                                simData
                                                                                                                        );
                                                                                                                        setArchitecture(
                                                                                                                                                archData
                                                                                                                        );
                                                                                                                        setKnowledge(
                                                                                                                                                knowData
                                                                                                                        );
                                                                                                                        setHealth(
                                                                                                                                                healthData
                                                                                                                        );
                                                                                                                        setForecast(
                                                                                                                                                forecastData
                                                                                                                        );
                                                                                                                        setTimeline(
                                                                                                                                                timelineData
                                                                                                                        );
                                                                                                                        setRecs(
                                                                                                                                                recsData
                                                                                                                        );
                                                                                                                        setLoading(
                                                                                                                                                false
                                                                                                                        );
                                                                                                }
                                                                        )
                                                                        .catch((err) => {
                                                                                                console.error(
                                                                                                                        err
                                                                                                );
                                                                                                setLoading(
                                                                                                                        false
                                                                                                );
                                                                        });
                        };

                        React.useEffect(() => {
                                                if (selectedRepoId) {
                                                                        fetchTwinData(
                                                                                                selectedRepoId
                                                                        );
                                                }
                        }, [selectedRepoId]);

                        // Derived states factoring in the live simulation controllers
                        const computedHealth = React.useMemo(() => {
                                                if (!health) return 100;
                                                let base = health.overall_health;
                                                // Modulate based on user load simulation
                                                if (localUserLoad > 300) {
                                                                        base -=
                                                                                                (localUserLoad -
                                                                                                                        300) *
                                                                                                0.05;
                                                }
                                                // Modulate based on failures
                                                if (dbOutageSimulated) base -= 35;
                                                if (cpuSpikeSimulated) base -= 15;
                                                return Math.max(10.0, Math.min(100.0, base));
                        }, [health, localUserLoad, dbOutageSimulated, cpuSpikeSimulated]);

                        const weatherState = React.useMemo(() => {
                                                if (computedHealth > 80 && !dbOutageSimulated) {
                                                                        return {
                                                                                                icon: CloudSun,
                                                                                                color: 'text-amber-400',
                                                                                                label: 'SUNNY (Optimal coding velocity)',
                                                                        };
                                                }
                                                if (computedHealth > 55 && !dbOutageSimulated) {
                                                                        return {
                                                                                                icon: CloudRain,
                                                                                                color: 'text-cyan-400',
                                                                                                label: 'FOGGY (Moderate technical debt drift)',
                                                                        };
                                                }
                                                return {
                                                                        icon: CloudLightning,
                                                                        color: 'text-red-500 animate-pulse',
                                                                        label: 'STORMY (Outages or severe debt hazards)',
                                                };
                        }, [computedHealth, dbOutageSimulated]);

                        // Handle resetting all twin parameters
                        const handleResetAllSimulations = () => {
                                                setLocalUserLoad(100);
                                                setDbOutageSimulated(false);
                                                setCpuSpikeSimulated(false);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col gap-6 font-mono">
                                                                        {/* Flashing Chaos Alert Banner */}
                                                                        {dbOutageSimulated && (
                                                                                                <div className="bg-red-950 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between shadow-lg animate-pulse">
                                                                                                                        <div className="flex items-center gap-2 text-xs font-bold uppercase">
                                                                                                                                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                                                                                                                                Live
                                                                                                                                                twin
                                                                                                                                                hazard:
                                                                                                                                                PostgreSQL
                                                                                                                                                Write
                                                                                                                                                replica
                                                                                                                                                offline!
                                                                                                                                                Modularity
                                                                                                                                                and
                                                                                                                                                Response
                                                                                                                                                latency
                                                                                                                                                degraded.
                                                                                                                        </div>
                                                                                                                        <Button
                                                                                                                                                size="xs"
                                                                                                                                                variant="destructive"
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setDbOutageSimulated(
                                                                                                                                                                                                false
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="text-[10px] uppercase font-bold"
                                                                                                                        >
                                                                                                                                                Resolve
                                                                                                                                                replica
                                                                                                                        </Button>
                                                                                                </div>
                                                                        )}

                                                                        {/* Header selection panel */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                                                                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
                                                                                                <div>
                                                                                                                        <h1 className="text-xl font-bold flex items-center gap-2">
                                                                                                                                                <Sliders className="h-6 w-6 text-indigo-400" />
                                                                                                                                                Engineering
                                                                                                                                                Command
                                                                                                                                                Center
                                                                                                                        </h1>
                                                                                                                        <p className="text-xs text-slate-400 mt-1">
                                                                                                                                                Control
                                                                                                                                                digital
                                                                                                                                                twin
                                                                                                                                                parameters,
                                                                                                                                                trigger
                                                                                                                                                chaos
                                                                                                                                                scenarios,
                                                                                                                                                and
                                                                                                                                                monitor
                                                                                                                                                KPIs.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <span className="text-xs text-slate-400 uppercase font-bold">
                                                                                                                                                Select
                                                                                                                                                twin
                                                                                                                                                repo:
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
                                                                                                                                                className="bg-slate-950 border border-slate-800 text-xs rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-slate-200"
                                                                                                                        >
                                                                                                                                                {repos.map(
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
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                r.name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </option>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </select>

                                                                                                                        <Button
                                                                                                                                                size="sm"
                                                                                                                                                variant="outline"
                                                                                                                                                onClick={() =>
                                                                                                                                                                        selectedRepoId &&
                                                                                                                                                                        fetchTwinData(
                                                                                                                                                                                                selectedRepoId
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="border-slate-800 hover:bg-slate-800 text-slate-300"
                                                                                                                        >
                                                                                                                                                <RefreshCw className="h-3.5 w-3.5" />
                                                                                                                        </Button>
                                                                                                </div>
                                                                        </div>

                                                                        {loading ? (
                                                                                                <div className="flex flex-col items-center justify-center flex-1 min-h-[400px]">
                                                                                                                        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin mb-4" />
                                                                                                                        <span className="text-xs text-slate-400 uppercase tracking-widest">
                                                                                                                                                Loading
                                                                                                                                                digital
                                                                                                                                                twin
                                                                                                                                                details...
                                                                                                                        </span>
                                                                                                </div>
                                                                        ) : (
                                                                                                <>
                                                                                                                        {/* KEY KPI Indicators Row */}
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                                                                                                                                {/* Health Score */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col gap-1 shadow-md">
                                                                                                                                                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                Twin
                                                                                                                                                                                                Health
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="flex justify-between items-baseline mt-1">
                                                                                                                                                                                                <span
                                                                                                                                                                                                                        className={`text-2xl font-bold ${computedHealth >= 80 ? 'text-emerald-400' : computedHealth >= 50 ? 'text-amber-400' : 'text-red-500'}`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {computedHealth.toFixed(
                                                                                                                                                                                                                                                1
                                                                                                                                                                                                                        )}

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] text-slate-400">
                                                                                                                                                                                                                        Score
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="h-1.5 w-full bg-slate-950 rounded-full mt-2 overflow-hidden">
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                width: `${computedHealth}%`,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                        className={`h-full ${computedHealth >= 80 ? 'bg-emerald-400' : computedHealth >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Modularity */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col gap-1 shadow-md">
                                                                                                                                                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                Modularity
                                                                                                                                                                                                index
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="flex justify-between items-baseline mt-1">
                                                                                                                                                                                                <span className="text-2xl font-bold text-cyan-400">
                                                                                                                                                                                                                        {architecture?.modularity_score ||
                                                                                                                                                                                                                                                50}

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] text-slate-400">
                                                                                                                                                                                                                        Target:
                                                                                                                                                                                                                        80%+
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="h-1.5 w-full bg-slate-950 rounded-full mt-2 overflow-hidden">
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                width: `${architecture?.modularity_score || 50}%`,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                        className="h-full bg-cyan-400"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Doc Coverage */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col gap-1 shadow-md">
                                                                                                                                                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                Doc
                                                                                                                                                                                                Coverage
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="flex justify-between items-baseline mt-1">
                                                                                                                                                                                                <span className="text-2xl font-bold text-indigo-400">
                                                                                                                                                                                                                        {knowledge?.documentation_coverage ||
                                                                                                                                                                                                                                                50}

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] text-slate-400">
                                                                                                                                                                                                                        Symbols
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="h-1.5 w-full bg-slate-950 rounded-full mt-2 overflow-hidden">
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                width: `${knowledge?.documentation_coverage || 50}%`,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                        className="h-full bg-indigo-400"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Complexity Average */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col gap-1 shadow-md">
                                                                                                                                                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                Avg
                                                                                                                                                                                                Complexity
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="flex justify-between items-baseline mt-1">
                                                                                                                                                                                                <span className="text-2xl font-bold text-emerald-400">
                                                                                                                                                                                                                        {(health?.overall_health
                                                                                                                                                                                                                                                ? (100 -
                                                                                                                                                                                                                                                                          health.overall_health) /
                                                                                                                                                                                                                                                                          8 +
                                                                                                                                                                                                                                                  2
                                                                                                                                                                                                                                                : 4
                                                                                                                                                                                                                        ).toFixed(
                                                                                                                                                                                                                                                2
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] text-slate-400">
                                                                                                                                                                                                                        Complexity
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="h-1.5 w-full bg-slate-950 rounded-full mt-2 overflow-hidden">
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                width: '45%',
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                        className="h-full bg-emerald-400"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Warnings Count */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col gap-1 shadow-md">
                                                                                                                                                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                Active
                                                                                                                                                                                                Risks
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="flex justify-between items-baseline mt-1">
                                                                                                                                                                                                <span
                                                                                                                                                                                                                        className={`text-2xl font-bold ${(health?.active_alerts_count || 0) + (dbOutageSimulated ? 1 : 0) > 2 ? 'text-amber-500' : 'text-slate-300'}`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {(health?.active_alerts_count ||
                                                                                                                                                                                                                                                0) +
                                                                                                                                                                                                                                                (dbOutageSimulated
                                                                                                                                                                                                                                                                        ? 1
                                                                                                                                                                                                                                                                        : 0)}
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] text-slate-400">
                                                                                                                                                                                                                        Issues
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="h-1.5 w-full bg-slate-950 rounded-full mt-2 overflow-hidden">
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                width: `${((health?.active_alerts_count || 0) + (dbOutageSimulated ? 1 : 0)) * 25}%`,
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                        className="h-full bg-amber-400"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* MAIN DASHBOARD panels */}
                                                                                                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                                                                                                                                {/* LEFT: Simulation Controllers & Digital Twin weather preview */}
                                                                                                                                                <div className="lg:col-span-4 flex flex-col gap-6">
                                                                                                                                                                        {/* Chaos Simulation Card */}
                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
                                                                                                                                                                                                <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                                                                                                                                                                                                                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                                                <Zap className="h-4 w-4 text-amber-400" />{' '}
                                                                                                                                                                                                                                                Chaos
                                                                                                                                                                                                                                                Simulator
                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                                        <Button
                                                                                                                                                                                                                                                onClick={
                                                                                                                                                                                                                                                                        handleResetAllSimulations
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                size="xs"
                                                                                                                                                                                                                                                variant="outline"
                                                                                                                                                                                                                                                className="text-[9px] font-mono border-slate-800 hover:bg-slate-800 text-slate-400"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                Reset
                                                                                                                                                                                                                                                Sim
                                                                                                                                                                                                                        </Button>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                {/* Slider for load */}
                                                                                                                                                                                                <div className="flex flex-col gap-2">
                                                                                                                                                                                                                        <div className="flex justify-between text-[10px] text-slate-400 uppercase">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Virtual
                                                                                                                                                                                                                                                                        User
                                                                                                                                                                                                                                                                        load:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                        className={
                                                                                                                                                                                                                                                                                                localUserLoad >
                                                                                                                                                                                                                                                                                                300
                                                                                                                                                                                                                                                                                                                        ? 'text-amber-400 font-bold'
                                                                                                                                                                                                                                                                                                                        : 'text-slate-300'
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                localUserLoad
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        users
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <input
                                                                                                                                                                                                                                                type="range"
                                                                                                                                                                                                                                                min="10"
                                                                                                                                                                                                                                                max="500"
                                                                                                                                                                                                                                                value={
                                                                                                                                                                                                                                                                        localUserLoad
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                                                                        setLocalUserLoad(
                                                                                                                                                                                                                                                                                                Number(
                                                                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="w-full accent-indigo-500"
                                                                                                                                                                                                                        />
                                                                                                                                                                                                                        <span className="text-[9px] text-slate-500 italic">
                                                                                                                                                                                                                                                Increasing
                                                                                                                                                                                                                                                user
                                                                                                                                                                                                                                                load
                                                                                                                                                                                                                                                raises
                                                                                                                                                                                                                                                road
                                                                                                                                                                                                                                                traffic
                                                                                                                                                                                                                                                congestion
                                                                                                                                                                                                                                                and
                                                                                                                                                                                                                                                latency
                                                                                                                                                                                                                                                variables
                                                                                                                                                                                                                                                in
                                                                                                                                                                                                                                                the
                                                                                                                                                                                                                                                City.
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                {/* Failure Toggles */}
                                                                                                                                                                                                <div className="flex flex-col gap-2 mt-2">
                                                                                                                                                                                                                        <span className="text-[10px] text-slate-400 uppercase font-bold">
                                                                                                                                                                                                                                                Simulate
                                                                                                                                                                                                                                                Infrastructure
                                                                                                                                                                                                                                                failure:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                                                                                                                                                                                                                                <Button
                                                                                                                                                                                                                                                                        size="sm"
                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                setDbOutageSimulated(
                                                                                                                                                                                                                                                                                                                        !dbOutageSimulated
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className={`text-[10px] font-bold uppercase transition-all ${dbOutageSimulated ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-800'}`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {dbOutageSimulated
                                                                                                                                                                                                                                                                                                ? 'DB Replica Down'
                                                                                                                                                                                                                                                                                                : 'Kill DB Replica'}
                                                                                                                                                                                                                                                </Button>

                                                                                                                                                                                                                                                <Button
                                                                                                                                                                                                                                                                        size="sm"
                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                setCpuSpikeSimulated(
                                                                                                                                                                                                                                                                                                                        !cpuSpikeSimulated
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className={`text-[10px] font-bold uppercase transition-all ${cpuSpikeSimulated ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-800'}`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {cpuSpikeSimulated
                                                                                                                                                                                                                                                                                                ? 'CPU 99% Alert'
                                                                                                                                                                                                                                                                                                : 'Spike CPU Load'}
                                                                                                                                                                                                                                                </Button>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Digital Twin City Weather */}
                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        <Map className="h-4 w-4 text-cyan-400" />{' '}
                                                                                                                                                                                                                        Digital
                                                                                                                                                                                                                        Twin
                                                                                                                                                                                                                        Environment
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg flex items-center gap-4">
                                                                                                                                                                                                                        {React.createElement(
                                                                                                                                                                                                                                                weatherState.icon,
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        className: `h-10 w-10 ${weatherState.color}`,
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                                                                                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                                                                                        Twin
                                                                                                                                                                                                                                                                        Weather
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs font-bold text-slate-200 mt-0.5 leading-tight">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                weatherState.label
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="flex flex-col gap-2.5 font-mono text-[10px] text-slate-400">
                                                                                                                                                                                                                        <div className="flex justify-between border-b border-slate-950 pb-1">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        City
                                                                                                                                                                                                                                                                        Name:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {city?.city_name ||
                                                                                                                                                                                                                                                                                                'Twin City'}
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between border-b border-slate-950 pb-1">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        City
                                                                                                                                                                                                                                                                        Districts:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {city?.districts_count ||
                                                                                                                                                                                                                                                                                                0}{' '}
                                                                                                                                                                                                                                                                        Districts
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between border-b border-slate-950 pb-1">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Road
                                                                                                                                                                                                                                                                        Congestion:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {Math.min(
                                                                                                                                                                                                                                                                                                100,
                                                                                                                                                                                                                                                                                                Math.round(
                                                                                                                                                                                                                                                                                                                        (city?.congestion_index ||
                                                                                                                                                                                                                                                                                                                                                25) *
                                                                                                                                                                                                                                                                                                                                                (localUserLoad /
                                                                                                                                                                                                                                                                                                                                                                        120)
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        )}

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        PostgreSQL
                                                                                                                                                                                                                                                                        Link:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                        className={`font-bold ${dbOutageSimulated ? 'text-red-500' : 'text-emerald-400'}`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {dbOutageSimulated
                                                                                                                                                                                                                                                                                                ? 'OFFLINE'
                                                                                                                                                                                                                                                                                                : 'CONNECTED'}
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* MIDDLE/RIGHT: Main Dashboard metrics sections */}
                                                                                                                                                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                                        {/* Health Alerts & Risks Warnings */}
                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3 min-h-[220px]">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        <ShieldAlert className="h-4 w-4 text-red-400" />{' '}
                                                                                                                                                                                                                        Active
                                                                                                                                                                                                                        Health
                                                                                                                                                                                                                        Alerts
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <div className="bg-slate-950 border border-slate-850 rounded-lg p-3 flex-1 overflow-y-auto flex flex-col gap-2 max-h-[240px]">
                                                                                                                                                                                                                        {dbOutageSimulated && (
                                                                                                                                                                                                                                                <div className="bg-red-500/10 border-l-2 border-red-500 p-2 text-[10px] text-red-400 flex items-start gap-1.5 font-bold">
                                                                                                                                                                                                                                                                        <Bug className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                CRITICAL:
                                                                                                                                                                                                                                                                                                PostgreSQL
                                                                                                                                                                                                                                                                                                Write
                                                                                                                                                                                                                                                                                                Database
                                                                                                                                                                                                                                                                                                Replica
                                                                                                                                                                                                                                                                                                offline.
                                                                                                                                                                                                                                                                                                Simulation
                                                                                                                                                                                                                                                                                                failing.
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                        {cpuSpikeSimulated && (
                                                                                                                                                                                                                                                <div className="bg-red-500/10 border-l-2 border-red-500 p-2 text-[10px] text-red-400 flex items-start gap-1.5 font-bold">
                                                                                                                                                                                                                                                                        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                WARNING:
                                                                                                                                                                                                                                                                                                Thread
                                                                                                                                                                                                                                                                                                pools
                                                                                                                                                                                                                                                                                                exhausted.
                                                                                                                                                                                                                                                                                                CPU
                                                                                                                                                                                                                                                                                                utilization
                                                                                                                                                                                                                                                                                                spiked
                                                                                                                                                                                                                                                                                                to
                                                                                                                                                                                                                                                                                                99%.
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                        {health &&
                                                                                                                                                                                                                        health
                                                                                                                                                                                                                                                .alerts
                                                                                                                                                                                                                                                .length >
                                                                                                                                                                                                                                                0
                                                                                                                                                                                                                                                ? health.alerts.map(
                                                                                                                                                                                                                                                                          (
                                                                                                                                                                                                                                                                                                  alert,
                                                                                                                                                                                                                                                                                                  idx
                                                                                                                                                                                                                                                                          ) => (
                                                                                                                                                                                                                                                                                                  <div
                                                                                                                                                                                                                                                                                                                          key={
                                                                                                                                                                                                                                                                                                                                                  idx
                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                          className="bg-amber-500/10 border-l-2 border-amber-500 p-2 text-[10px] text-amber-400 flex items-start gap-1.5"
                                                                                                                                                                                                                                                                                                  >
                                                                                                                                                                                                                                                                                                                          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                                                                                                                                                                                                                                                                                                          <span>
                                                                                                                                                                                                                                                                                                                                                  {
                                                                                                                                                                                                                                                                                                                                                                          alert
                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                          </span>
                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                          )
                                                                                                                                                                                                                                                  )
                                                                                                                                                                                                                                                : !dbOutageSimulated &&
                                                                                                                                                                                                                                                  !cpuSpikeSimulated && (
                                                                                                                                                                                                                                                                          <div className="text-slate-500 text-[10px] text-center my-auto flex flex-col items-center gap-1.5">
                                                                                                                                                                                                                                                                                                  <CheckCircle2 className="h-6 w-6 text-slate-700" />
                                                                                                                                                                                                                                                                                                  All
                                                                                                                                                                                                                                                                                                  systems
                                                                                                                                                                                                                                                                                                  operational.
                                                                                                                                                                                                                                                                                                  No
                                                                                                                                                                                                                                                                                                  active
                                                                                                                                                                                                                                                                                                  code
                                                                                                                                                                                                                                                                                                  alerts
                                                                                                                                                                                                                                                                                                  found.
                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                  )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Architecture & Tech Debt */}
                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3 min-h-[220px]">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        <Layers className="h-4 w-4 text-cyan-400" />{' '}
                                                                                                                                                                                                                        Architecture
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Tech
                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg flex flex-col gap-2 text-[10px] text-slate-400 font-mono">
                                                                                                                                                                                                                        <div className="flex justify-between border-b border-slate-900 pb-1.5">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Total
                                                                                                                                                                                                                                                                        Code
                                                                                                                                                                                                                                                                        Files:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {architecture?.file_count ||
                                                                                                                                                                                                                                                                                                0}{' '}
                                                                                                                                                                                                                                                                        files
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between border-b border-slate-900 pb-1.5">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Defined
                                                                                                                                                                                                                                                                        Classes
                                                                                                                                                                                                                                                                        count:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {architecture?.class_count ||
                                                                                                                                                                                                                                                                                                0}{' '}
                                                                                                                                                                                                                                                                        classes
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between border-b border-slate-900 pb-1.5">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Max
                                                                                                                                                                                                                                                                        Directory
                                                                                                                                                                                                                                                                        Depth:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {architecture?.max_nesting_depth ||
                                                                                                                                                                                                                                                                                                1}{' '}
                                                                                                                                                                                                                                                                        folders
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between pb-0.5">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Modularity
                                                                                                                                                                                                                                                                        Score:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-cyan-400 font-bold">
                                                                                                                                                                                                                                                                        {architecture?.modularity_score ||
                                                                                                                                                                                                                                                                                                50}

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <span className="text-[9px] text-slate-500 italic mt-auto">
                                                                                                                                                                                                                        *
                                                                                                                                                                                                                        Targets
                                                                                                                                                                                                                        classes-to-file
                                                                                                                                                                                                                        ratio
                                                                                                                                                                                                                        of
                                                                                                                                                                                                                        1.5
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        enforce
                                                                                                                                                                                                                        microservices
                                                                                                                                                                                                                        cleanliness.
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Knowledge & Documentation */}
                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3 min-h-[220px]">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        <BookOpen className="h-4 w-4 text-indigo-400" />{' '}
                                                                                                                                                                                                                        Knowledge
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Documentation
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg flex flex-col gap-2 text-[10px] text-slate-400 font-mono">
                                                                                                                                                                                                                        <div className="flex justify-between border-b border-slate-900 pb-1.5">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Documentation
                                                                                                                                                                                                                                                                        Coverage:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-indigo-400 font-bold">
                                                                                                                                                                                                                                                                        {knowledge?.documentation_coverage ||
                                                                                                                                                                                                                                                                                                0}

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between border-b border-slate-900 pb-1.5">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Total
                                                                                                                                                                                                                                                                        Code
                                                                                                                                                                                                                                                                        Lines:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {knowledge?.code_lines ||
                                                                                                                                                                                                                                                                                                0}{' '}
                                                                                                                                                                                                                                                                        lines
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between border-b border-slate-900 pb-1.5">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Comment
                                                                                                                                                                                                                                                                        Lines
                                                                                                                                                                                                                                                                        count:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {knowledge?.comments_lines ||
                                                                                                                                                                                                                                                                                                0}{' '}
                                                                                                                                                                                                                                                                        comments
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex justify-between pb-0.5">
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Comment/Code
                                                                                                                                                                                                                                                                        Density:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {knowledge?.comments_lines &&
                                                                                                                                                                                                                                                                        knowledge?.code_lines
                                                                                                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                                                                                                                          (knowledge.comments_lines /
                                                                                                                                                                                                                                                                                                                                                  knowledge.code_lines) *
                                                                                                                                                                                                                                                                                                                          100
                                                                                                                                                                                                                                                                                                  ).toFixed(
                                                                                                                                                                                                                                                                                                                          1
                                                                                                                                                                                                                                                                                                  )
                                                                                                                                                                                                                                                                                                : 0}

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <span className="text-[9px] text-slate-500 italic mt-auto">
                                                                                                                                                                                                                        *
                                                                                                                                                                                                                        Measures
                                                                                                                                                                                                                        comment
                                                                                                                                                                                                                        density
                                                                                                                                                                                                                        against
                                                                                                                                                                                                                        total
                                                                                                                                                                                                                        lines
                                                                                                                                                                                                                        of
                                                                                                                                                                                                                        raw
                                                                                                                                                                                                                        executable
                                                                                                                                                                                                                        code.
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Performance, Forecast & Recommendations */}
                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3 min-h-[220px]">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        <TrendingUp className="h-4 w-4 text-emerald-400" />{' '}
                                                                                                                                                                                                                        Future
                                                                                                                                                                                                                        Twin
                                                                                                                                                                                                                        Forecast
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Tips
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg flex flex-col gap-2.5 text-[10px] text-slate-400 font-mono">
                                                                                                                                                                                                                        <div className="text-[9px] text-slate-400 leading-normal border-b border-slate-900 pb-2">
                                                                                                                                                                                                                                                {forecast?.description ||
                                                                                                                                                                                                                                                                        'Loading 30-day system forecast metrics...'}
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        {forecast &&
                                                                                                                                                                                                                                                forecast
                                                                                                                                                                                                                                                                        .forecast_days
                                                                                                                                                                                                                                                                        .length >
                                                                                                                                                                                                                                                                        0 && (
                                                                                                                                                                                                                                                                        <div className="flex justify-between text-[9px] text-slate-400 uppercase pt-0.5">
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        Current
                                                                                                                                                                                                                                                                                                                        (Day
                                                                                                                                                                                                                                                                                                                        1):
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                forecast
                                                                                                                                                                                                                                                                                                                                                                        .forecast_days[0]
                                                                                                                                                                                                                                                                                                                                                                        .predicted_health
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                                                                                        Health
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        Day
                                                                                                                                                                                                                                                                                                                        30
                                                                                                                                                                                                                                                                                                                        Forecast:
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-red-500 font-bold">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                forecast
                                                                                                                                                                                                                                                                                                                                                                        .forecast_days[29]
                                                                                                                                                                                                                                                                                                                                                                        .predicted_health
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                                                                                        Health
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <span className="text-[9px] text-slate-500 italic mt-auto">
                                                                                                                                                                                                                        *
                                                                                                                                                                                                                        Run
                                                                                                                                                                                                                        regular
                                                                                                                                                                                                                        refactoring
                                                                                                                                                                                                                        checkouts
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        maintain
                                                                                                                                                                                                                        85%+
                                                                                                                                                                                                                        codebase
                                                                                                                                                                                                                        scores.
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Recommendations Checklist */}
                                                                                                                                                                        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        <Brain className="h-4 w-4 text-pink-400" />{' '}
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Recommendations
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Refactorings
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <div className="bg-slate-950 border border-slate-850 rounded-lg p-4 flex flex-col gap-3 max-h-[200px] overflow-y-auto text-[10px] font-mono">
                                                                                                                                                                                                                        {recs &&
                                                                                                                                                                                                                        recs
                                                                                                                                                                                                                                                .recommendations
                                                                                                                                                                                                                                                .length >
                                                                                                                                                                                                                                                0 ? (
                                                                                                                                                                                                                                                recs.recommendations.map(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                item,
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                        className="flex flex-col gap-1 border-b border-slate-900 pb-2.5 last:border-0 last:pb-0"
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                                                                                                                <span className="text-indigo-400 font-bold uppercase">
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                item.category
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                                                {item.file_target && (
                                                                                                                                                                                                                                                                                                                                                                        <span className="text-[9px] text-slate-500 italic truncate max-w-[200px]">
                                                                                                                                                                                                                                                                                                                                                                                                Target:{' '}
                                                                                                                                                                                                                                                                                                                                                                                                {item.file_target
                                                                                                                                                                                                                                                                                                                                                                                                                        .split(
                                                                                                                                                                                                                                                                                                                                                                                                                                                '/'
                                                                                                                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                                                                                                                                        .pop()}
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                        <p className="text-slate-300 leading-normal mt-0.5">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        item.recommendation
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        ) : (
                                                                                                                                                                                                                                                <div className="text-slate-500 italic text-center my-2">
                                                                                                                                                                                                                                                                        No
                                                                                                                                                                                                                                                                        refactoring
                                                                                                                                                                                                                                                                        recommendations.
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </>
                                                                        )}
                                                </div>
                        );
}
