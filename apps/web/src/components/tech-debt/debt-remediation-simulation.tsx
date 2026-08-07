'use client';

import * as React from 'react';
import {
	CheckSquare,
	Play,
	Sparkles,
	ArrowRight,
	Layers,
	ShieldAlert,
	CheckCircle,
	AlertTriangle,
	RefreshCw,
	Sliders,
	GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface RemediationTaskItem {
	id: string;
	stepOrder: number;
	title: string;
	targetModule: string;
	dependsOnTaskId?: string; // Prerequisite task
	expectedScoreImprovement: number;
	estimatedEffortDays: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
	isUpstreamRootCause?: boolean;
}

const SAMPLE_REMEDIATION_TASKS: RemediationTaskItem[] = [
	{
		id: 'task-rem-1',
		stepOrder: 1,
		title: 'Extract IPaymentContext interface & introduce dependency injection',
		targetModule: 'apps/backend/app/payment/processor.ts',
		expectedScoreImprovement: 6.5,
		estimatedEffortDays: 1.5,
		riskLevel: 'MEDIUM',
		isUpstreamRootCause: true,
	},
	{
		id: 'task-rem-2',
		stepOrder: 2,
		title: 'Parametrize dynamic raw SQL in analytics_raw.py',
		targetModule: 'apps/backend/app/db/queries/analytics_raw.py',
		dependsOnTaskId: 'task-rem-1',
		expectedScoreImprovement: 4.8,
		estimatedEffortDays: 0.5,
		riskLevel: 'LOW',
	},
	{
		id: 'task-rem-3',
		stepOrder: 3,
		title: 'Decompose OrderProcessingEngine into Validator & Notifier services',
		targetModule: 'apps/backend/app/order/engine.ts',
		dependsOnTaskId: 'task-rem-1',
		expectedScoreImprovement: 5.2,
		estimatedEffortDays: 2.5,
		riskLevel: 'HIGH',
	},
	{
		id: 'task-rem-4',
		stepOrder: 4,
		title: 'Add 25 unit test mocks for payment processor endpoints',
		targetModule: 'apps/backend/app/payment/processor.ts',
		dependsOnTaskId: 'task-rem-3',
		expectedScoreImprovement: 3.5,
		estimatedEffortDays: 1.0,
		riskLevel: 'LOW',
	},
];

export function DebtRemediationSimulation() {
	const [selectedTaskIds, setSelectedTaskIds] = React.useState<string[]>([
		'task-rem-1',
		'task-rem-2',
		'task-rem-3',
	]);
	const [isSimulating, setIsSimulating] = React.useState<boolean>(false);

	const toggleSelectTask = (id: string) => {
		setSelectedTaskIds((prev) =>
			prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
		);
	};

	const totalImprovement = selectedTaskIds.reduce((acc, id) => {
		const found = SAMPLE_REMEDIATION_TASKS.find((t) => t.id === id);
		return acc + (found ? found.expectedScoreImprovement : 0);
	}, 0);

	const totalEffort = selectedTaskIds.reduce((acc, id) => {
		const found = SAMPLE_REMEDIATION_TASKS.find((t) => t.id === id);
		return acc + (found ? found.estimatedEffortDays : 0);
	}, 0);

	const handleRunSimulation = () => {
		setIsSimulating(true);
		setTimeout(() => setIsSimulating(false), 1200);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Remediation Workspace Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
							<CheckSquare className="w-4 h-4" /> Remediation Planner & Simulator
						</div>
						<h2 className="text-xl font-black text-white">Debt Remediation & Simulation Studio</h2>
						<p className="text-xs text-slate-400">
							Build structured refactoring sequences and simulate side-by-side architectural impacts.
						</p>
					</div>

					<Button
						onClick={handleRunSimulation}
						disabled={isSimulating}
						className={cn(
							'flex items-center gap-2 font-mono text-xs px-5 py-3 rounded-2xl shadow-lg border transition-all',
							isSimulating
								? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
								: 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white border-emerald-400/30'
						)}
					>
						<RefreshCw className={cn('w-4 h-4', isSimulating && 'animate-spin')} />
						<span>{isSimulating ? 'Simulating Architecture...' : 'Run Simulation'}</span>
					</Button>
				</div>
			</div>

			{/* Main Grid: Ordered Remediation Plan (6 Cols) & Side-by-Side Comparison (6 Cols) */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Remediation Plan Tasks */}
				<div className="lg:col-span-6 space-y-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
					<div className="flex items-center justify-between border-b border-slate-800 pb-3">
						<h3 className="text-base font-black text-white flex items-center gap-2">
							<GitBranch className="w-4 h-4 text-emerald-400" /> Remediation Sequence Plan
						</h3>
						<span className="text-xs text-slate-400">
							{selectedTaskIds.length} Selected Tasks
						</span>
					</div>

					<div className="space-y-3">
						{SAMPLE_REMEDIATION_TASKS.map((task) => {
							const isSelected = selectedTaskIds.includes(task.id);
							return (
								<div
									key={task.id}
									onClick={() => toggleSelectTask(task.id)}
									className={cn(
										'p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-md space-y-2',
										isSelected
											? 'bg-slate-900 border-emerald-500/50 shadow-emerald-950/40 ring-1 ring-emerald-500/30'
											: 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
									)}
								>
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2">
											<span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center justify-center">
												{task.stepOrder}
											</span>
											<h4 className="text-xs font-bold text-white">{task.title}</h4>
										</div>
										<span className="text-xs font-black text-emerald-400">
											+{task.expectedScoreImprovement} pts
										</span>
									</div>

									{task.isUpstreamRootCause && (
										<div className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold w-fit">
											★ UPSTREAM ROOT CAUSE (Prerequisite for downstream tasks)
										</div>
									)}

									<div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
										<span className="truncate max-w-[240px]">{task.targetModule}</span>
										<span>Effort: <strong className="text-slate-200">{task.estimatedEffortDays} days</strong></span>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Side-by-Side Before vs After Simulation */}
				<div className="lg:col-span-6 space-y-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
					<div className="border-b border-slate-800 pb-3">
						<h3 className="text-base font-black text-white flex items-center gap-2">
							<Sparkles className="w-4 h-4 text-cyan-400" /> Side-by-Side Architecture Simulation
						</h3>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Before Simulation */}
						<div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3">
							<div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
								CURRENT STATE
							</div>
							<div>
								<span className="text-3xl font-black text-white">54.2</span>
								<span className="text-xs text-slate-500"> / 100 debt</span>
							</div>
							<div className="space-y-1.5 text-xs text-slate-300">
								<div>Cognitive Complexity: <strong className="text-rose-400">205</strong></div>
								<div>Circular Dependencies: <strong className="text-rose-400">4 loops</strong></div>
								<div>Test Coverage: <strong className="text-amber-400">51.5%</strong></div>
							</div>
						</div>

						{/* After Simulation */}
						<div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 relative overflow-hidden">
							<div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
								<span>PROPOSED STATE</span>
								<span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
									SIMULATED
								</span>
							</div>
							<div>
								<span className="text-3xl font-black text-emerald-400">
									{(54.2 - totalImprovement).toFixed(1)}
								</span>
								<span className="text-xs text-slate-500"> / 100 debt</span>
							</div>
							<div className="space-y-1.5 text-xs text-slate-300">
								<div>Cognitive Complexity: <strong className="text-emerald-400">118 (-42%)</strong></div>
								<div>Circular Dependencies: <strong className="text-emerald-400">0 loops</strong></div>
								<div>Test Coverage: <strong className="text-emerald-400">78.5% (+27%)</strong></div>
							</div>
						</div>
					</div>

					<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
						<div className="text-xs font-bold text-emerald-400">Simulation Summary:</div>
						<p className="text-xs text-slate-300 leading-relaxed">
							Executing this {totalEffort.toFixed(1)}-day remediation plan improves Overall System Health by{' '}
							<strong className="text-emerald-400">+{totalImprovement.toFixed(1)} points</strong>, resolves all circular imports, and lowers monthly maintenance friction by $6,400/mo.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
