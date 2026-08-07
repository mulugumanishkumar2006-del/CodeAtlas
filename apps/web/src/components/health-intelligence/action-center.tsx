'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	CheckSquare,
	Zap,
	Shield,
	Flame,
	Layers,
	BookOpen,
	CheckCircle,
	ArrowRight,
	ExternalLink,
	Clock,
	Sparkles,
	Building2,
	Network,
	Activity,
	Bot,
	Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ActionTask {
	id: string;
	title: string;
	category:
		| 'Priority Tasks'
		| 'Technical Debt Backlog'
		| 'Architecture'
		| 'Security'
		| 'Performance'
		| 'Documentation'
		| 'Testing'
		| 'Quick Wins'
		| 'Long-term Improvements';
	expectedScoreGain: number; // e.g. +4.5
	effort: string; // e.g., "3 hrs", "2 days"
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
	targetSystem: string; // e.g. "Digital Twin", "Knowledge Graph", "AI CTO"
	targetRoute: string;
	status: 'BACKLOG' | 'IN_PROGRESS' | 'COMPLETED';
}

const ACTION_TASKS: ActionTask[] = [
	{
		id: 'task-1',
		title: 'Parametrize dynamic raw SQL in analytics_raw.py to eliminate injection risk',
		category: 'Quick Wins',
		expectedScoreGain: 4.5,
		effort: '2 hrs',
		severity: 'CRITICAL',
		targetSystem: 'Security Health Engine',
		targetRoute: '/security',
		status: 'BACKLOG',
	},
	{
		id: 'task-2',
		title: 'Extract IPaymentContext interface to resolve circular dependency cycle',
		category: 'Architecture',
		expectedScoreGain: 6.0,
		effort: '1.5 days',
		severity: 'CRITICAL',
		targetSystem: 'Architecture Intelligence',
		targetRoute: '/architecture',
		status: 'BACKLOG',
	},
	{
		id: 'task-3',
		title: 'Decompose God Class OrderProcessingEngine into Validator & Notifier services',
		category: 'Technical Debt Backlog',
		expectedScoreGain: 5.2,
		effort: '2.5 days',
		severity: 'HIGH',
		targetSystem: 'AI CTO Advisor',
		targetRoute: '/ai-cto',
		status: 'BACKLOG',
	},
	{
		id: 'task-4',
		title: 'Purge deprecated v1 legacy payment adapter exports from bundle',
		category: 'Quick Wins',
		expectedScoreGain: 2.5,
		effort: '1 hr',
		severity: 'MEDIUM',
		targetSystem: 'Digital Twin Platform',
		targetRoute: '/enterprise-twin',
		status: 'BACKLOG',
	},
	{
		id: 'task-5',
		title: 'Consolidate copy-pasted JWT verification into @codeatlas/auth-core package',
		category: 'Security',
		expectedScoreGain: 4.0,
		effort: '1 day',
		severity: 'HIGH',
		targetSystem: 'Knowledge Graph',
		targetRoute: '/wskg',
		status: 'BACKLOG',
	},
	{
		id: 'task-6',
		title: 'Increase test coverage on payment-processor from 42% to 85%',
		category: 'Testing',
		expectedScoreGain: 3.8,
		effort: '2 days',
		severity: 'HIGH',
		targetSystem: 'Simulation Studio',
		targetRoute: '/simulate',
		status: 'BACKLOG',
	},
	{
		id: 'task-7',
		title: 'Generate OpenAPI 3.1 & Typed Docstrings for Knowledge Intelligence API',
		category: 'Documentation',
		expectedScoreGain: 3.0,
		effort: '4 hrs',
		severity: 'MEDIUM',
		targetSystem: 'Documentation AI',
		targetRoute: '/docs',
		status: 'BACKLOG',
	},
	{
		id: 'task-8',
		title: 'Migrate synchronous DB queries in worker threads to async connection pool',
		category: 'Performance',
		expectedScoreGain: 4.2,
		effort: '3 days',
		severity: 'HIGH',
		targetSystem: 'Monitoring Intelligence',
		targetRoute: '/monitor',
		status: 'BACKLOG',
	},
];

export function ActionCenter() {
	const [activeCategory, setActiveCategory] = React.useState<string>('ALL');
	const [completedTasks, setCompletedTasks] = React.useState<string[]>([]);

	const categories = [
		'ALL',
		'Quick Wins',
		'Priority Tasks',
		'Technical Debt Backlog',
		'Architecture',
		'Security',
		'Performance',
		'Documentation',
		'Testing',
	];

	const toggleTaskComplete = (taskId: string) => {
		setCompletedTasks((prev) =>
			prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
		);
	};

	const filteredTasks = ACTION_TASKS.filter(
		(task) => activeCategory === 'ALL' || task.category === activeCategory
	);

	const totalGain = completedTasks.reduce((acc, id) => {
		const found = ACTION_TASKS.find((t) => t.id === id);
		return acc + (found ? found.expectedScoreGain : 0);
	}, 0);

	return (
		<div className="space-y-6 font-mono">
			{/* Action Center Header Banner */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

				<div>
					<div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
						<CheckSquare className="w-4 h-4" /> Continuous Remediation Engine
					</div>
					<h2 className="text-xl font-black text-white">Repository Action Center & Roadmap</h2>
					<p className="text-xs text-slate-400">
						Prioritized action items generated from health diagnostics. Complete tasks to elevate overall score.
					</p>
				</div>

				<div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
					<div>
						<span className="text-[10px] text-slate-400 uppercase font-bold">Simulated Score Gain</span>
						<div className="text-2xl font-black text-emerald-400">+{totalGain.toFixed(1)} pts</div>
					</div>
					<div className="h-8 w-px bg-slate-800" />
					<div>
						<span className="text-[10px] text-slate-400 uppercase font-bold">Tasks Completed</span>
						<div className="text-2xl font-black text-white">
							{completedTasks.length} / {ACTION_TASKS.length}
						</div>
					</div>
				</div>
			</div>

			{/* Category Filters Bar */}
			<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2">
				{categories.map((cat) => (
					<button
						key={cat}
						onClick={() => setActiveCategory(cat)}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
							activeCategory === cat
								? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950'
								: 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
						)}
					>
						{cat}
					</button>
				))}
			</div>

			{/* Tasks List */}
			<div className="space-y-3">
				{filteredTasks.map((task) => {
					const isDone = completedTasks.includes(task.id);
					const isCritical = task.severity === 'CRITICAL';
					const isHigh = task.severity === 'HIGH';

					return (
						<div
							key={task.id}
							className={cn(
								'p-4 rounded-2xl border transition-all duration-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4',
								isDone
									? 'bg-slate-950/60 border-slate-800/60 opacity-60'
									: 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
							)}
						>
							<div className="flex items-start gap-3">
								<button
									onClick={() => toggleTaskComplete(task.id)}
									className={cn(
										'w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 mt-0.5',
										isDone
											? 'bg-emerald-500 border-emerald-400 text-slate-950'
											: 'border-slate-700 bg-slate-950 hover:border-emerald-500'
									)}
								>
									{isDone && <CheckCircle className="w-3.5 h-3.5 fill-slate-950 stroke-emerald-400" />}
								</button>

								<div>
									<div className="flex items-center gap-2 mb-1">
										<span
											className={cn(
												'px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider',
												isCritical && 'bg-rose-950/80 text-rose-300 border border-rose-500/40',
												isHigh && 'bg-amber-950/80 text-amber-300 border border-amber-500/40',
												!isCritical && !isHigh && 'bg-slate-800 text-slate-300'
											)}
										>
											{task.severity}
										</span>
										<span className="text-[10px] text-slate-400 font-bold">{task.category}</span>
									</div>

									<h4
										className={cn(
											'text-xs font-bold text-white',
											isDone && 'line-through text-slate-400'
										)}
									>
										{task.title}
									</h4>
								</div>
							</div>

							{/* Right Action & System Deep-Link */}
							<div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
								<div className="flex items-center gap-3 text-xs">
									<span className="text-emerald-400 font-black">+{task.expectedScoreGain} pts</span>
									<span className="text-slate-400 flex items-center gap-1">
										<Clock className="w-3 h-3 text-purple-400" /> {task.effort}
									</span>
								</div>

								{/* One-click deep link to system module */}
								<Link
									href={task.targetRoute}
									className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
								>
									<span>Launch {task.targetSystem}</span>
									<ExternalLink className="w-3 h-3" />
								</Link>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
