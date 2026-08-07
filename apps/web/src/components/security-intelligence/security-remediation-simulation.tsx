'use client';

import * as React from 'react';
import {
	ShieldCheck,
	RefreshCw,
	Sparkles,
	ArrowRight,
	CheckCircle,
	AlertTriangle,
	Layers,
	CheckSquare,
	Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SecurityRemediationTask {
	id: string;
	stepOrder: number;
	title: string;
	category: string;
	expectedRiskReduction: number; // e.g. -24.5 pts
	estimatedEffort: string;
	isPrerequisite?: boolean;
}

const SAMPLE_SECURITY_TASKS: SecurityRemediationTask[] = [
	{
		id: 'sec-task-1',
		stepOrder: 1,
		title: 'Parametrize raw SQL queries in analytics_raw.py',
		category: 'Injection Remediation',
		expectedRiskReduction: 18.5,
		estimatedEffort: '2 hrs',
		isPrerequisite: true,
	},
	{
		id: 'sec-task-2',
		stepOrder: 2,
		title: 'Revoke and rotate exposed Stripe test API key',
		category: 'Secret Rotation',
		expectedRiskReduction: 12.0,
		estimatedEffort: '30 mins',
	},
	{
		id: 'sec-task-3',
		stepOrder: 3,
		title: 'Upgrade stripe package from v11.4.0 to v12.1.0',
		category: 'Dependency Upgrade',
		expectedRiskReduction: 8.4,
		estimatedEffort: '1 hr',
	},
];

export function SecurityRemediationSimulation() {
	const [selectedTaskIds, setSelectedTaskIds] = React.useState<string[]>([
		'sec-task-1',
		'sec-task-2',
		'sec-task-3',
	]);
	const [isSimulating, setIsSimulating] = React.useState<boolean>(false);

	const totalReduction = selectedTaskIds.reduce((acc, id) => {
		const found = SAMPLE_SECURITY_TASKS.find((t) => t.id === id);
		return acc + (found ? found.expectedRiskReduction : 0);
	}, 0);

	const handleSimulate = () => {
		setIsSimulating(true);
		setTimeout(() => setIsSimulating(false), 1200);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
							<ShieldCheck className="w-4 h-4" /> Remediation Simulation & Verification
						</div>
						<h2 className="text-xl font-black text-white">Security Remediation & Simulation Studio</h2>
						<p className="text-xs text-slate-400">
							Simulate the security risk reduction impact before committing code refactorings.
						</p>
					</div>

					<Button
						onClick={handleSimulate}
						disabled={isSimulating}
						className={cn(
							'flex items-center gap-2 font-mono text-xs px-5 py-3 rounded-2xl shadow-lg border transition-all',
							isSimulating
								? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
								: 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white border-emerald-400/30'
						)}
					>
						<RefreshCw className={cn('w-4 h-4', isSimulating && 'animate-spin')} />
						<span>{isSimulating ? 'Simulating Security State...' : 'Run Security Simulation'}</span>
					</Button>
				</div>
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Task Sequence */}
				<div className="lg:col-span-6 space-y-3 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
					<h3 className="text-base font-black text-white border-b border-slate-800 pb-3">
						Remediation Action Plan
					</h3>

					<div className="space-y-3">
						{SAMPLE_SECURITY_TASKS.map((task) => (
							<div
								key={task.id}
								className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center justify-center">
											{task.stepOrder}
										</span>
										<h4 className="text-xs font-bold text-white">{task.title}</h4>
									</div>
									<span className="text-xs font-black text-emerald-400">
										-{task.expectedRiskReduction} pts risk
									</span>
								</div>
								{task.isPrerequisite && (
									<span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold block w-fit">
										★ PREREQUISITE REMEDIATION
									</span>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Before vs After Simulation */}
				<div className="lg:col-span-6 space-y-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
					<h3 className="text-base font-black text-white border-b border-slate-800 pb-3">
						Side-by-Side Security Posture Simulation
					</h3>

					<div className="grid grid-cols-2 gap-4">
						{/* Before */}
						<div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3">
							<span className="text-xs font-bold text-rose-400 uppercase">Current Risk State</span>
							<div className="text-3xl font-black text-rose-400">87.2 <span className="text-xs text-slate-500">/ 100 risk</span></div>
							<div className="text-xs text-slate-300">Active Vulnerabilities: 3</div>
						</div>

						{/* After */}
						<div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
							<span className="text-xs font-bold text-emerald-400 uppercase">Simulated Posture</span>
							<div className="text-3xl font-black text-emerald-400">
								{(87.2 - totalReduction).toFixed(1)} <span className="text-xs text-slate-500">/ 100 risk</span>
							</div>
							<div className="text-xs text-emerald-400 font-bold">Zero Critical Risks</div>
						</div>
					</div>

					<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
						<div className="text-xs font-bold text-emerald-400">Post-Remediation Verification Checklist:</div>
						<ul className="space-y-1 text-xs text-slate-300">
							<li className="flex items-center gap-2">
								<CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Vulnerability removed from AST AST
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Attack path no longer reachable in production
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
