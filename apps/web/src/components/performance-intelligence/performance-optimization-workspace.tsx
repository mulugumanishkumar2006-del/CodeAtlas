'use client';

import * as React from 'react';
import {
	Zap,
	Sparkles,
	CheckCircle,
	Clock,
	ArrowRight,
	FileCode,
	CheckSquare,
	Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PerformanceOptimizationTask {
	id: string;
	title: string;
	category: string;
	expectedLatencyReductionMs: number;
	estimatedEffort: string;
	affectedFiles: string[];
	verificationChecklist: string[];
}

const SAMPLE_OPTIMIZATION_TASKS: PerformanceOptimizationTask[] = [
	{
		id: 'opt-1',
		title: 'Create Composite Index on (tenant_id, filter) in PostgreSQL',
		category: 'Database Query Optimization',
		expectedLatencyReductionMs: 180,
		estimatedEffort: '1 hr',
		affectedFiles: ['apps/backend/app/db/queries/analytics_raw.py'],
		verificationChecklist: [
			'PostgreSQL EXPLAIN ANALYZER shows Index Scan instead of Seq Scan',
			'P99 query latency drops below 20ms under 3,400 rps load',
		],
	},
	{
		id: 'opt-2',
		title: 'Batch N+1 Order Queries into Single WHERE IN SQL Query',
		category: 'N+1 Batching',
		expectedLatencyReductionMs: 120,
		estimatedEffort: '3 hrs',
		affectedFiles: ['apps/backend/app/payment/processor.ts'],
		verificationChecklist: [
			'Single SQL query dispatched per checkout request',
			'Database connection pool lock contention reduced to 0%',
		],
	},
];

export function PerformanceOptimizationWorkspace() {
	const [appliedIds, setAppliedIds] = React.useState<string[]>([]);

	const toggleApply = (id: string) => {
		setAppliedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
						<Zap className="w-4 h-4 fill-emerald-400" /> Empirical Verification Engine
					</div>
					<h2 className="text-xl font-black text-white">Performance Optimization & Verification</h2>
					<p className="text-xs text-slate-400">
						Prioritized optimization recommendations complete with empirical before/after verification checks.
					</p>
				</div>
			</div>

			{/* Task Cards Feed */}
			<div className="space-y-4">
				{SAMPLE_OPTIMIZATION_TASKS.map((task) => {
					const isDone = appliedIds.includes(task.id);
					return (
						<div
							key={task.id}
							className={cn(
								'p-5 rounded-3xl bg-slate-900/90 border transition-all duration-200 shadow-xl space-y-4',
								isDone ? 'border-emerald-500/50 bg-slate-950/60' : 'border-slate-800'
							)}
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
								<div>
									<span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
										-{task.expectedLatencyReductionMs}ms LATENCY REDUCTION
									</span>
									<h3 className="text-base font-black text-white mt-1">{task.title}</h3>
								</div>

								<Button
									onClick={() => toggleApply(task.id)}
									className={cn(
										'font-mono text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all',
										isDone
											? 'bg-slate-800 text-slate-400 border border-slate-700'
											: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
									)}
								>
									{isDone ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
									<span>{isDone ? 'Verified in Benchmark' : 'Apply & Verify Fix'}</span>
								</Button>
							</div>

							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
								<div className="text-xs font-bold text-slate-400 uppercase">Verification Checklist:</div>
								<ul className="space-y-1.5 text-xs text-slate-300">
									{task.verificationChecklist.map((check, idx) => (
										<li key={idx} className="flex items-center gap-2">
											<CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
											<span>{check}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
