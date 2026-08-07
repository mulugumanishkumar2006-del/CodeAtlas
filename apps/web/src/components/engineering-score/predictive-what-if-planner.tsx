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
	ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PredictiveScenario {
	id: string;
	scenarioName: string;
	description: string;
	projectedScore: number;
	projectedRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
	maintainabilityScore: number;
	securityScore: number;
	performanceScore: number;
	estimatedEffort: string;
	confidencePercent: number;
}

const PREDICTIVE_SCENARIOS: PredictiveScenario[] = [
	{
		id: 'scen-a',
		scenarioName: 'Scenario A: Current Trajectory (No Action)',
		description: 'Maintains baseline engineering pace without dedicated technical debt refactoring.',
		projectedScore: 91,
		projectedRiskLevel: 'MEDIUM',
		maintainabilityScore: 88,
		securityScore: 92,
		performanceScore: 78,
		estimatedEffort: '0 hrs',
		confidencePercent: 95,
	},
	{
		id: 'scen-b',
		scenarioName: 'Scenario B: Invest in Technical Debt Refactoring',
		description: 'Refactors circular payment import and extracts shared DB validation helpers.',
		projectedScore: 97,
		projectedRiskLevel: 'LOW',
		maintainabilityScore: 96,
		securityScore: 95,
		performanceScore: 94,
		estimatedEffort: '1.5 days',
		confidencePercent: 98,
	},
	{
		id: 'scen-c',
		scenarioName: 'Scenario C: Testing & Isolation Boost',
		description: 'Adds unit test fixtures mocking PostgreSQL analytics query responses.',
		projectedScore: 96,
		projectedRiskLevel: 'LOW',
		maintainabilityScore: 94,
		securityScore: 94,
		performanceScore: 82,
		estimatedEffort: '1 day',
		confidencePercent: 96,
	},
	{
		id: 'scen-d',
		scenarioName: 'Scenario D: Architecture Decoupling Cleanup',
		description: 'Extracts IPaymentContext interface into domain contracts layer.',
		projectedScore: 98,
		projectedRiskLevel: 'LOW',
		maintainabilityScore: 98,
		securityScore: 96,
		performanceScore: 88,
		estimatedEffort: '2 days',
		confidencePercent: 99,
	},
	{
		id: 'scen-e',
		scenarioName: 'Scenario E: Security-First Remediation Sweep',
		description: 'Rotates exposed test secrets and parameterizes raw SQL string queries.',
		projectedScore: 97,
		projectedRiskLevel: 'LOW',
		maintainabilityScore: 92,
		securityScore: 99,
		performanceScore: 92,
		estimatedEffort: '2.5 hrs',
		confidencePercent: 98,
	},
];

export function PredictiveWhatIfPlanner() {
	const [activeScenarioId, setActiveScenarioId] = React.useState<string>('scen-b');
	const [isSimulating, setIsSimulating] = React.useState(false);

	const activeScenario = PREDICTIVE_SCENARIOS.find((s) => s.id === activeScenarioId) || PREDICTIVE_SCENARIOS[1];

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
							<Sliders className="w-4 h-4" /> Predictive Scenario Modeling
						</div>
						<h2 className="text-xl font-black text-white">Predictive Scenarios & What-If Planner</h2>
						<p className="text-xs text-slate-400">
							Simulate expected engineering score improvements across 5 future investment scenarios before writing code.
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
						<span>{isSimulating ? 'Simulating Scenario...' : 'Run Scenario Simulation'}</span>
					</Button>
				</div>
			</div>

			{/* Scenario Selector Tabs */}
			<div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
				{PREDICTIVE_SCENARIOS.map((scen) => (
					<button
						key={scen.id}
						onClick={() => setActiveScenarioId(scen.id)}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border whitespace-nowrap',
							scen.id === activeScenario.id
								? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-lg shadow-cyan-950'
								: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
						)}
					>
						{scen.scenarioName.split(':')[0]}
					</button>
				))}
			</div>

			{/* Active Scenario Card */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
					<div>
						<h3 className="text-lg font-black text-white">{activeScenario.scenarioName}</h3>
						<p className="text-xs text-slate-400 mt-1">{activeScenario.description}</p>
					</div>

					<div className="text-right">
						<span className="text-xs text-slate-400 uppercase block">Projected Score</span>
						<span className="text-4xl font-black text-emerald-400">{activeScenario.projectedScore} / 100</span>
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
						<span className="text-[10px] text-slate-400">Maintainability</span>
						<div className="text-xl font-black text-white">{activeScenario.maintainabilityScore} / 100</div>
					</div>
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
						<span className="text-[10px] text-slate-400">Security Posture</span>
						<div className="text-xl font-black text-emerald-400">{activeScenario.securityScore} / 100</div>
					</div>
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
						<span className="text-[10px] text-slate-400">Performance Index</span>
						<div className="text-xl font-black text-orange-400">{activeScenario.performanceScore} / 100</div>
					</div>
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
						<span className="text-[10px] text-slate-400">Estimated Effort</span>
						<div className="text-xl font-black text-purple-300">{activeScenario.estimatedEffort}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
