'use client';

import * as React from 'react';
import {
	RefreshCw,
	Sparkles,
	ArrowRight,
	CheckCircle,
	AlertTriangle,
	Layers,
	Sliders,
	Code2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface RefactoringSimTask {
	id: string;
	title: string;
	category: string;
	currentComplexity: number;
	simulatedComplexity: number;
	currentCoveragePercent: number;
	simulatedCoveragePercent: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
	estimatedEffort: string;
}

const SAMPLE_SIM_TASKS: RefactoringSimTask[] = [
	{
		id: 'sim-1',
		title: 'Extract PaymentValidator & WebhookNotifier from PaymentProcessor',
		category: 'Function & Class Decomposition',
		currentComplexity: 32,
		simulatedComplexity: 8,
		currentCoveragePercent: 42,
		simulatedCoveragePercent: 94,
		riskLevel: 'LOW',
		estimatedEffort: '1.5 days',
	},
	{
		id: 'sim-2',
		title: 'Parametrize Multitenant SQL Query Strings in analytics_raw.py',
		category: 'Security & Maintainability Refactor',
		currentComplexity: 18,
		simulatedComplexity: 4,
		currentCoveragePercent: 65,
		simulatedCoveragePercent: 98,
		riskLevel: 'LOW',
		estimatedEffort: '2 hrs',
	},
];

export function RefactoringSimulatorStudio() {
	const [activeTaskId, setActiveTaskId] = React.useState<string>('sim-1');
	const [isSimulating, setIsSimulating] = React.useState(false);

	const activeTask = SAMPLE_SIM_TASKS.find((t) => t.id === activeTaskId) || SAMPLE_SIM_TASKS[0];

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
							<Sliders className="w-4 h-4" /> Reversible Code Refactoring Simulator
						</div>
						<h2 className="text-xl font-black text-white">Refactoring Simulation Studio</h2>
						<p className="text-xs text-slate-400">
							Simulate complexity reduction, testability gains, and coupling improvements before modifying code.
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
						<span>{isSimulating ? 'Simulating Code State...' : 'Run Refactoring Simulation'}</span>
					</Button>
				</div>
			</div>

			{/* Task Selector Tabs */}
			<div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
				{SAMPLE_SIM_TASKS.map((task) => (
					<button
						key={task.id}
						onClick={() => setActiveTaskId(task.id)}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border whitespace-nowrap',
							task.id === activeTask.id
								? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-lg shadow-cyan-950'
								: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
						)}
					>
						{task.title}
					</button>
				))}
			</div>

			{/* Side-by-Side Comparison */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				<div className="border-b border-slate-800 pb-3">
					<span className="text-xs font-bold text-cyan-400 uppercase">{activeTask.category}</span>
					<h3 className="text-base font-black text-white">{activeTask.title}</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Current Implementation */}
					<div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
						<span className="text-xs font-bold text-slate-400 uppercase">CURRENT STRUCTURE</span>
						<div>
							<span className="text-3xl font-black text-rose-400">{activeTask.currentComplexity}</span>
							<span className="text-xs text-slate-500 block">Cognitive Complexity</span>
						</div>
						<div className="text-xs text-slate-300">Test Coverage: <strong>{activeTask.currentCoveragePercent}%</strong></div>
					</div>

					{/* Simulated Implementation */}
					<div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-xs font-bold text-cyan-400 uppercase">PROPOSED REFACTORED STRUCTURE</span>
							<span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
								{activeTask.riskLevel} RISK
							</span>
						</div>
						<div>
							<span className="text-3xl font-black text-emerald-400">{activeTask.simulatedComplexity}</span>
							<span className="text-xs text-slate-500 block">Simulated Cognitive Complexity</span>
						</div>
						<div className="text-xs text-slate-300">
							Simulated Coverage: <strong className="text-emerald-400">{activeTask.simulatedCoveragePercent}%</strong> | Effort: <strong>{activeTask.estimatedEffort}</strong>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
