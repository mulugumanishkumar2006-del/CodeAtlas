'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import {
                        Sparkles,
                        Loader2,
                        Activity,
                        ShieldAlert,
                        TrendingUp,
                        Clock,
                        DollarSign,
                        Users,
                        Undo2,
                        CheckCircle2,
                        Bot,
                        ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Repository {
                        id: string;
                        name: string;
                        full_name: string;
}

interface ScenarioSimulation {
                        query: string;
                        narrative: string;
                        health_before: number;
                        health_after: number;
                        performance_impact: string;
                        reliability_impact: string;
                        cost_change: string;
                        team_effort: string;
                        migration_phases: string[];
                        risks: string[];
                        rollback_strategy: string;
}

export default function ScenarioSimulatorPage() {
                        const { token } = useAuth();
                        const [repos, setRepos] = React.useState<Repository[]>([]);
                        const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');

                        // Input States
                        const [queryInput, setQueryInput] = React.useState<string>('');
                        const [simLoading, setSimLoading] = React.useState<boolean>(false);
                        const [simulation, setSimulation] =
                                                React.useState<ScenarioSimulation | null>(null);

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

                        // Trigger simulation fetch
                        const handleSimulate = (customQuery?: string) => {
                                                const query = customQuery || queryInput;
                                                if (!query.trim() || !token || !selectedRepoId)
                                                                        return;

                                                setSimLoading(true);
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/simulation/scenario`,
                                                                        {
                                                                                                method: 'POST',
                                                                                                headers: {
                                                                                                                        'Content-Type': 'application/json',
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                                                body: JSON.stringify(
                                                                                                                        {
                                                                                                                                                query,
                                                                                                                        }
                                                                                                ),
                                                                        }
                                                )
                                                                        .then((res) => {
                                                                                                if (
                                                                                                                        !res.ok
                                                                                                )
                                                                                                                        throw new Error(
                                                                                                                                                'Simulation failed'
                                                                                                                        );
                                                                                                return res.json();
                                                                        })
                                                                        .then((data) => {
                                                                                                setSimulation(
                                                                                                                        data
                                                                                                );
                                                                                                setSimLoading(
                                                                                                                        false
                                                                                                );
                                                                                                if (
                                                                                                                        !customQuery
                                                                                                )
                                                                                                                        setQueryInput(
                                                                                                                                                ''
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

                        // Circular gauge background helpers
                        const getStrokeColor = (score: number) => {
                                                if (score >= 80) return 'stroke-emerald-500';
                                                if (score >= 50) return 'stroke-amber-500';
                                                return 'stroke-red-500';
                        };

                        const getStrokeDashArray = (score: number, radius: number) => {
                                                const circum = 2 * Math.PI * radius;
                                                const progress = score / 100;
                                                return `${circum * progress} ${circum * (1 - progress)}`;
                        };

                        const gaugeRadius = 38;
                        const gaugeCircum = 2 * Math.PI * gaugeRadius;

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col gap-6 font-mono">
                                                                        {/* Header selection panel */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                                                                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
                                                                                                <div>
                                                                                                                        <h1 className="text-xl font-bold flex items-center gap-2">
                                                                                                                                                <Sparkles className="h-6 w-6 text-indigo-400" />
                                                                                                                                                AI
                                                                                                                                                Scenario
                                                                                                                                                Simulator
                                                                                                                        </h1>
                                                                                                                        <p className="text-xs text-slate-400 mt-1">
                                                                                                                                                Forecast
                                                                                                                                                codebase
                                                                                                                                                architectural
                                                                                                                                                changes,
                                                                                                                                                reliability
                                                                                                                                                drops,
                                                                                                                                                cloud
                                                                                                                                                costs,
                                                                                                                                                and
                                                                                                                                                migration
                                                                                                                                                efforts
                                                                                                                                                under
                                                                                                                                                hypothetical
                                                                                                                                                events.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <span className="text-xs text-slate-400 uppercase font-bold">
                                                                                                                                                Select
                                                                                                                                                Active
                                                                                                                                                Twin:
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
                                                                                                </div>
                                                                        </div>

                                                                        {/* Input query and preset card */}
                                                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                                                                                                        Define
                                                                                                                        Hypothetical
                                                                                                                        Event
                                                                                                </h3>

                                                                                                <form
                                                                                                                        onSubmit={(
                                                                                                                                                e
                                                                                                                        ) => {
                                                                                                                                                e.preventDefault();
                                                                                                                                                handleSimulate();
                                                                                                                        }}
                                                                                                                        className="flex gap-2"
                                                                                                >
                                                                                                                        <input
                                                                                                                                                type="text"
                                                                                                                                                value={
                                                                                                                                                                        queryInput
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setQueryInput(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                placeholder="e.g., What if we migrate to Kubernetes? or What if PostgreSQL fails?"
                                                                                                                                                className="bg-slate-950 border border-slate-850 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100 flex-1 placeholder:text-slate-700"
                                                                                                                        />
                                                                                                                        <Button
                                                                                                                                                type="submit"
                                                                                                                                                disabled={
                                                                                                                                                                        simLoading ||
                                                                                                                                                                        !queryInput.trim()
                                                                                                                                                }
                                                                                                                                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 font-bold text-xs"
                                                                                                                        >
                                                                                                                                                {simLoading ? (
                                                                                                                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                                                                                                ) : (
                                                                                                                                                                        'Run Strategy Sim'
                                                                                                                                                )}
                                                                                                                        </Button>
                                                                                                </form>

                                                                                                {/* Presets List */}
                                                                                                <div className="flex flex-col gap-2 mt-1">
                                                                                                                        <span className="text-[9px] text-slate-500 uppercase font-bold">
                                                                                                                                                Or
                                                                                                                                                select
                                                                                                                                                a
                                                                                                                                                quick
                                                                                                                                                flagship
                                                                                                                                                preset:
                                                                                                                        </span>
                                                                                                                        <div className="flex flex-wrap gap-2">
                                                                                                                                                <button
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                handleSimulate(
                                                                                                                                                                                                                        'What happens if we migrate to Kubernetes?'
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="text-[9px] bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-850 rounded px-2.5 py-1.5 transition-all text-left"
                                                                                                                                                >
                                                                                                                                                                        ☸️
                                                                                                                                                                        Migrate
                                                                                                                                                                        to
                                                                                                                                                                        Kubernetes
                                                                                                                                                </button>
                                                                                                                                                <button
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                handleSimulate(
                                                                                                                                                                                                                        'What if we split the Payment Service?'
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="text-[9px] bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-850 rounded px-2.5 py-1.5 transition-all text-left"
                                                                                                                                                >
                                                                                                                                                                        💸
                                                                                                                                                                        Split
                                                                                                                                                                        Payment
                                                                                                                                                                        Service
                                                                                                                                                </button>
                                                                                                                                                <button
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                handleSimulate(
                                                                                                                                                                                                                        'What if our traffic grows 100x?'
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="text-[9px] bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-850 rounded px-2.5 py-1.5 transition-all text-left"
                                                                                                                                                >
                                                                                                                                                                        📈
                                                                                                                                                                        Traffic
                                                                                                                                                                        grows
                                                                                                                                                                        100×
                                                                                                                                                </button>
                                                                                                                                                <button
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                handleSimulate(
                                                                                                                                                                                                                        'What if PostgreSQL fails?'
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="text-[9px] bg-slate-950 hover:bg-slate-800 text-red-500 border border-slate-850 rounded px-2.5 py-1.5 transition-all text-left animate-pulse"
                                                                                                                                                >
                                                                                                                                                                        🔥
                                                                                                                                                                        PostgreSQL
                                                                                                                                                                        Outage
                                                                                                                                                </button>
                                                                                                                                                <button
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                handleSimulate(
                                                                                                                                                                                                                        'What if Redis is removed?'
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="text-[9px] bg-slate-950 hover:bg-slate-800 text-pink-400 border border-slate-850 rounded px-2.5 py-1.5 transition-all text-left"
                                                                                                                                                >
                                                                                                                                                                        ❌
                                                                                                                                                                        Remove
                                                                                                                                                                        Redis
                                                                                                                                                                        Cache
                                                                                                                                                </button>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Viewport result layout */}
                                                                        {simLoading ? (
                                                                                                <div className="flex flex-col items-center justify-center flex-1 min-h-[300px]">
                                                                                                                        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mb-3" />
                                                                                                                        <span className="text-xs text-slate-500 uppercase tracking-widest">
                                                                                                                                                Simulating
                                                                                                                                                architectural
                                                                                                                                                impact
                                                                                                                                                variables...
                                                                                                                        </span>
                                                                                                </div>
                                                                        ) : simulation ? (
                                                                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                                                                                                                        {/* LEFT: Before vs After Health Index & Core narrative summary */}
                                                                                                                        <div className="lg:col-span-5 flex flex-col gap-6">
                                                                                                                                                {/* Health Comparer Card */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col items-center gap-4">
                                                                                                                                                                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider self-start">
                                                                                                                                                                                                📊
                                                                                                                                                                                                Health
                                                                                                                                                                                                Score
                                                                                                                                                                                                Impact
                                                                                                                                                                                                Forecast
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="flex justify-around items-center w-full mt-2">
                                                                                                                                                                                                {/* Before Gauge */}
                                                                                                                                                                                                <div className="flex flex-col items-center gap-1.5">
                                                                                                                                                                                                                        <div className="relative w-24 h-24 flex items-center justify-center">
                                                                                                                                                                                                                                                <svg className="w-full h-full transform -rotate-90">
                                                                                                                                                                                                                                                                        <circle
                                                                                                                                                                                                                                                                                                cx="48"
                                                                                                                                                                                                                                                                                                cy="48"
                                                                                                                                                                                                                                                                                                r={
                                                                                                                                                                                                                                                                                                                        gaugeRadius
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                fill="none"
                                                                                                                                                                                                                                                                                                stroke="#1e293b"
                                                                                                                                                                                                                                                                                                strokeWidth="6"
                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                                        <circle
                                                                                                                                                                                                                                                                                                cx="48"
                                                                                                                                                                                                                                                                                                cy="48"
                                                                                                                                                                                                                                                                                                r={
                                                                                                                                                                                                                                                                                                                        gaugeRadius
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                fill="none"
                                                                                                                                                                                                                                                                                                className={getStrokeColor(
                                                                                                                                                                                                                                                                                                                        simulation.health_before
                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                strokeWidth="6"
                                                                                                                                                                                                                                                                                                strokeDasharray={
                                                                                                                                                                                                                                                                                                                        gaugeCircum
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                strokeDashoffset={
                                                                                                                                                                                                                                                                                                                        gaugeCircum *
                                                                                                                                                                                                                                                                                                                        (1 -
                                                                                                                                                                                                                                                                                                                                                simulation.health_before /
                                                                                                                                                                                                                                                                                                                                                                        100)
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                </svg>
                                                                                                                                                                                                                                                <span className="absolute text-sm font-bold text-slate-300">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                simulation.health_before
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-[9px] text-slate-500 uppercase font-bold">
                                                                                                                                                                                                                                                Before
                                                                                                                                                                                                                                                Health
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <ChevronRight className="h-6 w-6 text-slate-700 mt-[-20px]" />

                                                                                                                                                                                                {/* After Gauge */}
                                                                                                                                                                                                <div className="flex flex-col items-center gap-1.5">
                                                                                                                                                                                                                        <div className="relative w-24 h-24 flex items-center justify-center">
                                                                                                                                                                                                                                                <svg className="w-full h-full transform -rotate-90">
                                                                                                                                                                                                                                                                        <circle
                                                                                                                                                                                                                                                                                                cx="48"
                                                                                                                                                                                                                                                                                                cy="48"
                                                                                                                                                                                                                                                                                                r={
                                                                                                                                                                                                                                                                                                                        gaugeRadius
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                fill="none"
                                                                                                                                                                                                                                                                                                stroke="#1e293b"
                                                                                                                                                                                                                                                                                                strokeWidth="6"
                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                                        <circle
                                                                                                                                                                                                                                                                                                cx="48"
                                                                                                                                                                                                                                                                                                cy="48"
                                                                                                                                                                                                                                                                                                r={
                                                                                                                                                                                                                                                                                                                        gaugeRadius
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                fill="none"
                                                                                                                                                                                                                                                                                                className={getStrokeColor(
                                                                                                                                                                                                                                                                                                                        simulation.health_after
                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                strokeWidth="6"
                                                                                                                                                                                                                                                                                                strokeDasharray={
                                                                                                                                                                                                                                                                                                                        gaugeCircum
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                strokeDashoffset={
                                                                                                                                                                                                                                                                                                                        gaugeCircum *
                                                                                                                                                                                                                                                                                                                        (1 -
                                                                                                                                                                                                                                                                                                                                                simulation.health_after /
                                                                                                                                                                                                                                                                                                                                                                        100)
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                </svg>
                                                                                                                                                                                                                                                <span className="absolute text-sm font-bold text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                simulation.health_after
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-[9px] text-slate-500 uppercase font-bold">
                                                                                                                                                                                                                                                Projected
                                                                                                                                                                                                                                                Health
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Narrative Blueprint */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3 flex-1">
                                                                                                                                                                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                <Bot className="h-4 w-4 text-cyan-400" />{' '}
                                                                                                                                                                                                AI
                                                                                                                                                                                                Strategy
                                                                                                                                                                                                Summary
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg flex-1 overflow-y-auto leading-relaxed text-[11px] text-slate-300">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        simulation.narrative
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* RIGHT: Blueprint parameters, migration phases, risks & rollback */}
                                                                                                                        <div className="lg:col-span-7 flex flex-col gap-6">
                                                                                                                                                {/* Parameters checklist */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
                                                                                                                                                                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-2">
                                                                                                                                                                                                📑
                                                                                                                                                                                                Strategic
                                                                                                                                                                                                Parameters
                                                                                                                                                                                                Map
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px] text-slate-400">
                                                                                                                                                                                                <div className="flex flex-col gap-1">
                                                                                                                                                                                                                        <span className="text-indigo-400 font-bold uppercase">
                                                                                                                                                                                                                                                Performance
                                                                                                                                                                                                                                                Impact
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        simulation.performance_impact
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex flex-col gap-1">
                                                                                                                                                                                                                        <span className="text-indigo-400 font-bold uppercase">
                                                                                                                                                                                                                                                Reliability
                                                                                                                                                                                                                                                Impact
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        simulation.reliability_impact
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex flex-col gap-1">
                                                                                                                                                                                                                        <span className="text-indigo-400 font-bold uppercase flex items-center gap-1">
                                                                                                                                                                                                                                                <DollarSign className="h-3 w-3" />{' '}
                                                                                                                                                                                                                                                Cloud
                                                                                                                                                                                                                                                Cost
                                                                                                                                                                                                                                                Impact
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        simulation.cost_change
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex flex-col gap-1">
                                                                                                                                                                                                                        <span className="text-indigo-400 font-bold uppercase flex items-center gap-1">
                                                                                                                                                                                                                                                <Users className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                                                                Team
                                                                                                                                                                                                                                                migration
                                                                                                                                                                                                                                                effort
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-slate-300 font-bold text-slate-200">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        simulation.team_effort
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Migration Blueprint Phases */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
                                                                                                                                                                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                <Clock className="h-4 w-4 text-emerald-400" />{' '}
                                                                                                                                                                                                Migration
                                                                                                                                                                                                Blueprint
                                                                                                                                                                                                Timeline
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="flex flex-col gap-3.5 font-mono text-[10px] pl-2 border-l border-slate-800">
                                                                                                                                                                                                {simulation.migration_phases.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                phase,
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="flex items-start gap-3 relative"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {/* Connector bullet */}
                                                                                                                                                                                                                                                                        <span className="absolute left-[-13px] top-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" />
                                                                                                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                                                                                                                                <span className="text-slate-500 uppercase font-bold text-[8px]">
                                                                                                                                                                                                                                                                                                                        Phase{' '}
                                                                                                                                                                                                                                                                                                                        {idx +
                                                                                                                                                                                                                                                                                                                                                1}
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <p className="text-slate-200 leading-normal mt-0.5">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                phase
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Risks & Rollback */}
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                                        {/* Risks alerts */}
                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        <ShieldAlert className="h-4 w-4 text-red-400" />{' '}
                                                                                                                                                                                                                        Migration
                                                                                                                                                                                                                        Risks
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <ul className="flex flex-col gap-2 font-mono text-[9px] text-red-400">
                                                                                                                                                                                                                        {simulation.risks.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        risk,
                                                                                                                                                                                                                                                                        index
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <li
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        index
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="bg-red-500/5 p-2 rounded border border-red-500/10 leading-relaxed"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                ⚠️{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        risk
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </ul>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Rollback Strategy */}
                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        <Undo2 className="h-4 w-4 text-indigo-400" />{' '}
                                                                                                                                                                                                                        Rollback
                                                                                                                                                                                                                        Strategy
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="bg-indigo-500/5 p-3.5 border border-indigo-500/10 text-[9px] leading-relaxed text-indigo-400 rounded">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                simulation.rollback_strategy
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        ) : (
                                                                                                <div className="flex flex-col items-center justify-center flex-1 min-h-[300px] border border-dashed border-slate-800 rounded-xl">
                                                                                                                        <span className="text-xs text-slate-500">
                                                                                                                                                Ask
                                                                                                                                                a
                                                                                                                                                natural
                                                                                                                                                question
                                                                                                                                                above
                                                                                                                                                or
                                                                                                                                                click
                                                                                                                                                a
                                                                                                                                                preset
                                                                                                                                                to
                                                                                                                                                simulate
                                                                                                                                                hypothetical
                                                                                                                                                changes.
                                                                                                                        </span>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
