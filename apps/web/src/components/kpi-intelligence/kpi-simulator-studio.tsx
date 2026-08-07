'use client';

import * as React from 'react';
import {
	Sliders,
	Sparkles,
	ArrowRight,
	TrendingUp,
	RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface KPIScenario {
	id: string;
	name: string;
	description: string;
	projectedLeadTimeHours: number;
	projectedCycleTimeHours: number;
	projectedDeliveryHealth: number;
}

const SAMPLE_KPI_SCENARIOS: KPIScenario[] = [
	{
		id: 'kscen-1',
		name: 'Decompose PR Sizes by 50%',
		description: 'Splits cross-service PRs into smaller, single-boundary feature commits.',
		projectedLeadTimeHours: 6.2,
		projectedCycleTimeHours: 2.1,
		projectedDeliveryHealth: 97,
	},
	{
		id: 'kscen-2',
		name: 'Automate Canary Deployments',
		description: 'Automates rollback verification upon health check failure.',
		projectedLeadTimeHours: 12.0,
		projectedCycleTimeHours: 3.0,
		projectedDeliveryHealth: 95,
	},
];

export function KPISimulatorStudio() {
	const [activeScenarioId, setActiveScenarioId] = React.useState<string>('kscen-1');
	const [isSimulating, setIsSimulating] = React.useState(false);

	const activeScenario = SAMPLE_KPI_SCENARIOS.find((s) => s.id === activeScenarioId) || SAMPLE_KPI_SCENARIOS[0];

	const handleRunSim = () => {
		setIsSimulating(true);
		setTimeout(() => setIsSimulating(false), 1200);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
							<Sliders className="w-4 h-4" /> Engineering Flow Simulation Studio
						</div>
						<h2 className="text-xl font-black text-white">Flow Scenario Simulator</h2>
						<p className="text-xs text-slate-400">
							Simulate expected lead time, cycle time, & delivery health improvements before changing team processes.
						</p>
					</div>

					<Button
						onClick={handleRunSim}
						disabled={isSimulating}
						className={cn(
							'flex items-center gap-2 font-mono text-xs px-5 py-3 rounded-2xl shadow-lg border transition-all',
							isSimulating
								? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
								: 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white border-cyan-400/30'
						)}
					>
						<RefreshCw className={cn('w-4 h-4', isSimulating && 'animate-spin')} />
						<span>{isSimulating ? 'Simulating Flow...' : 'Run Scenario Simulation'}</span>
					</Button>
				</div>
			</div>

			{/* Scenario Tabs */}
			<div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
				{SAMPLE_KPI_SCENARIOS.map((scen) => (
					<button
						key={scen.id}
						onClick={() => setActiveScenarioId(scen.id)}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border whitespace-nowrap',
							scen.id === activeScenario.id
								? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-lg'
								: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
						)}
					>
						{scen.name}
					</button>
				))}
			</div>

			{/* Active Box */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				<div className="border-b border-slate-800 pb-3">
					<h3 className="text-base font-black text-white">{activeScenario.name}</h3>
					<p className="text-xs text-slate-400 mt-1">{activeScenario.description}</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<span className="text-[10px] text-slate-400 uppercase">Projected Lead Time</span>
						<div className="text-2xl font-black text-emerald-400">{activeScenario.projectedLeadTimeHours} hrs</div>
						<div className="text-[10px] text-slate-500">Down from 18.2 hrs baseline</div>
					</div>

					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<span className="text-[10px] text-slate-400 uppercase">Projected Cycle Time</span>
						<div className="text-2xl font-black text-cyan-300">{activeScenario.projectedCycleTimeHours} hrs</div>
						<div className="text-[10px] text-slate-500">Down from 4.8 hrs baseline</div>
					</div>

					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<span className="text-[10px] text-slate-400 uppercase">Delivery Health Score</span>
						<div className="text-2xl font-black text-purple-300">{activeScenario.projectedDeliveryHealth} / 100</div>
						<div className="text-[10px] text-slate-500">+3.0 pts improvement</div>
					</div>
				</div>
			</div>
		</div>
	);
}
