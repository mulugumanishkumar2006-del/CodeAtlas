'use client';

import * as React from 'react';
import {
	Sliders,
	Sparkles,
	ArrowRight,
	TrendingUp,
	TrendingDown,
	Zap,
	RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BenchmarkScenario {
	id: string;
	title: string;
	description: string;
	currentScore: number;
	projectedScore: number;
	projectedPosition: string; // e.g. "Top 5% of Peer Repositories"
	estimatedEffort: string;
}

const SAMPLE_BENCHMARK_SCENARIOS: BenchmarkScenario[] = [
	{
		id: 'bscen-1',
		title: 'Eliminate PostgreSQL Unindexed Query Bottleneck',
		description: 'Adds composite index on (tenant_id, filter) in metrics table.',
		currentScore: 74,
		projectedScore: 92,
		projectedPosition: 'Top 3% of Microservice Peer Group',
		estimatedEffort: '1 hr',
	},
	{
		id: 'bscen-2',
		title: 'Decouple PaymentProcessor Circular Import',
		description: 'Extracts IPaymentContext interface into shared domain contracts.',
		currentScore: 68,
		projectedScore: 90,
		projectedPosition: 'Top 5% of Microservice Peer Group',
		estimatedEffort: '1.5 days',
	},
];

export function PredictiveBenchmarkScenarios() {
	const [activeScenarioId, setActiveScenarioId] = React.useState<string>('bscen-1');
	const [isSimulating, setIsSimulating] = React.useState(false);

	const activeScenario = SAMPLE_BENCHMARK_SCENARIOS.find((s) => s.id === activeScenarioId) || SAMPLE_BENCHMARK_SCENARIOS[0];

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
						<div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
							<Sliders className="w-4 h-4" /> Hypothetical Benchmark Tester
						</div>
						<h2 className="text-xl font-black text-white">Predictive Benchmark Scenario Tester</h2>
						<p className="text-xs text-slate-400">
							Simulate projected benchmark positions before committing engineering refactorings.
						</p>
					</div>

					<Button
						onClick={handleRunSim}
						disabled={isSimulating}
						className={cn(
							'flex items-center gap-2 font-mono text-xs px-5 py-3 rounded-2xl shadow-lg border transition-all',
							isSimulating
								? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
								: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-orange-400/30'
						)}
					>
						<RefreshCw className={cn('w-4 h-4', isSimulating && 'animate-spin')} />
						<span>{isSimulating ? 'Simulating Position...' : 'Run Scenario Simulation'}</span>
					</Button>
				</div>
			</div>

			{/* Scenario Tabs */}
			<div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
				{SAMPLE_BENCHMARK_SCENARIOS.map((scen) => (
					<button
						key={scen.id}
						onClick={() => setActiveScenarioId(scen.id)}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border whitespace-nowrap',
							scen.id === activeScenario.id
								? 'bg-orange-950/80 border-orange-500/60 text-orange-300 shadow-lg'
								: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
						)}
					>
						{scen.title}
					</button>
				))}
			</div>

			{/* Active Scenario Box */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				<div className="border-b border-slate-800 pb-3">
					<h3 className="text-base font-black text-white">{activeScenario.title}</h3>
					<p className="text-xs text-slate-400 mt-1">{activeScenario.description}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<span className="text-xs font-bold text-slate-400 uppercase">CURRENT STATE</span>
						<div className="text-3xl font-black text-white">{activeScenario.currentScore} / 100</div>
					</div>

					<div className="p-5 rounded-2xl bg-slate-950 border border-orange-500/40 space-y-2">
						<span className="text-xs font-bold text-orange-400 uppercase">SIMULATED BENCHMARK POSITION</span>
						<div className="text-3xl font-black text-emerald-400">{activeScenario.projectedScore} / 100</div>
						<div className="text-xs text-emerald-300 font-bold">{activeScenario.projectedPosition}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
