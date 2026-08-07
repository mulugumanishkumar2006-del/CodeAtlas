'use client';

import * as React from 'react';
import {
	Sliders,
	Play,
	Sparkles,
	ArrowRight,
	TrendingUp,
	TrendingDown,
	Zap,
	RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface WhatIfScenario {
	id: string;
	name: string;
	description: string;
	currentP99Ms: number;
	simulatedP99Ms: number;
	currentRps: number;
	simulatedRps: number;
	monthlyCostImpact: string;
	confidencePercent: number;
}

const SAMPLE_WHAT_IF_SCENARIOS: WhatIfScenario[] = [
	{
		id: 'wif-1',
		name: 'Traffic Spike (10x Load)',
		description: 'Simulate 12,500 req/sec peak traffic across checkout and payment endpoints.',
		currentP99Ms: 318,
		simulatedP99Ms: 1420,
		currentRps: 1250,
		simulatedRps: 12500,
		monthlyCostImpact: '+$4,200/mo (Auto-scaling instances)',
		confidencePercent: 94,
	},
	{
		id: 'wif-2',
		name: 'Add Redis Cache to Payment Endpoints',
		description: 'Caches checkout transaction tokens with 300s TTL.',
		currentP99Ms: 318,
		simulatedP99Ms: 42,
		currentRps: 1250,
		simulatedRps: 4500,
		monthlyCostImpact: '-$1,800/mo (Database offload)',
		confidencePercent: 98,
	},
	{
		id: 'wif-3',
		name: 'Composite Index on metrics (tenant_id, filter)',
		description: 'Eliminates full table scans across 4.2M rows in PostgreSQL.',
		currentP99Ms: 318,
		simulatedP99Ms: 68,
		currentRps: 1250,
		simulatedRps: 3200,
		monthlyCostImpact: '$0/mo',
		confidencePercent: 99,
	},
];

export function WhatIfPerformanceSimulator() {
	const [activeScenarioId, setActiveScenarioId] = React.useState<string>('wif-3');
	const [isSimulating, setIsSimulating] = React.useState(false);

	const activeScenario = SAMPLE_WHAT_IF_SCENARIOS.find((s) => s.id === activeScenarioId) || SAMPLE_WHAT_IF_SCENARIOS[2];

	const handleRunSimulation = () => {
		setIsSimulating(true);
		setTimeout(() => setIsSimulating(false), 1200);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
							<Sliders className="w-4 h-4" /> Predictive Scenario Modeling
						</div>
						<h2 className="text-xl font-black text-white">What-If Performance Simulator</h2>
						<p className="text-xs text-slate-400">
							Simulate latency, throughput, and cost impacts before committing code changes to production.
						</p>
					</div>

					<Button
						onClick={handleRunSimulation}
						disabled={isSimulating}
						className={cn(
							'flex items-center gap-2 font-mono text-xs px-5 py-3 rounded-2xl shadow-lg border transition-all',
							isSimulating
								? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
								: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-orange-400/30'
						)}
					>
						<RefreshCw className={cn('w-4 h-4', isSimulating && 'animate-spin')} />
						<span>{isSimulating ? 'Simulating Load...' : 'Run Scenario Simulation'}</span>
					</Button>
				</div>
			</div>

			{/* Scenario Selector Pills */}
			<div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
				{SAMPLE_WHAT_IF_SCENARIOS.map((scen) => (
					<button
						key={scen.id}
						onClick={() => setActiveScenarioId(scen.id)}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border whitespace-nowrap',
							scen.id === activeScenario.id
								? 'bg-orange-950/80 border-orange-500/60 text-orange-300 shadow-lg shadow-orange-950'
								: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
						)}
					>
						{scen.name}
					</button>
				))}
			</div>

			{/* Side by Side Comparison Grid */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				<div className="border-b border-slate-800 pb-3">
					<h3 className="text-base font-black text-white">{activeScenario.name}</h3>
					<p className="text-xs text-slate-400 mt-1">{activeScenario.description}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Baseline */}
					<div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
						<span className="text-xs font-bold text-slate-400 uppercase">CURRENT BASELINE</span>
						<div>
							<span className="text-3xl font-black text-white">{activeScenario.currentP99Ms}ms</span>
							<span className="text-xs text-slate-500 block">P99 Latency</span>
						</div>
						<div className="text-xs text-slate-300">Throughput: <strong>{activeScenario.currentRps} rps</strong></div>
					</div>

					{/* Simulated */}
					<div className="p-5 rounded-2xl bg-slate-950 border border-orange-500/40 space-y-3 relative overflow-hidden">
						<div className="flex items-center justify-between">
							<span className="text-xs font-bold text-orange-400 uppercase">SIMULATED SCENARIO</span>
							<span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-500/40 text-[10px] font-bold">
								{activeScenario.confidencePercent}% CONFIDENCE
							</span>
						</div>
						<div>
							<span className="text-3xl font-black text-emerald-400">{activeScenario.simulatedP99Ms}ms</span>
							<span className="text-xs text-slate-500 block">Simulated P99 Latency</span>
						</div>
						<div className="text-xs text-slate-300">
							Throughput: <strong className="text-emerald-400">{activeScenario.simulatedRps} rps</strong> | Cost Impact: <strong className="text-purple-300">{activeScenario.monthlyCostImpact}</strong>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
