'use client';

import * as React from 'react';
import {
	ListOrdered,
	Sparkles,
	CheckCircle,
	Clock,
	ArrowRight,
	AlertTriangle,
	Layers,
	CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PriorityItem {
	id: string;
	priorityCategory: 'FIX_NOW' | 'FIX_NEXT' | 'PLAN' | 'MONITOR' | 'IGNORE';
	title: string;
	expectedScoreGain: number; // e.g. +5.2 pts
	estimatedEffort: string;
	affectedComponent: string;
	reasoning: string;
}

const SAMPLE_PRIORITIES: PriorityItem[] = [
	{
		id: 'prio-1',
		priorityCategory: 'FIX_NOW',
		title: 'Create Composite Index on (tenant_id, filter) in PostgreSQL metrics table',
		expectedScoreGain: 5.2,
		estimatedEffort: '1 hr',
		affectedComponent: 'apps/backend/app/db/queries/analytics_raw.py',
		reasoning: 'Fixes P99 latency bloat from 180ms down to sub-20ms under 3,400 rps load.',
	},
	{
		id: 'prio-2',
		priorityCategory: 'FIX_NOW',
		title: 'Revoke and rotate exposed Stripe test API key',
		expectedScoreGain: 3.8,
		estimatedEffort: '30 mins',
		affectedComponent: 'apps/backend/config/test_keys.json',
		reasoning: 'Eliminates secret key leakage risk in repository commit history.',
	},
	{
		id: 'prio-3',
		priorityCategory: 'FIX_NEXT',
		title: 'Extract IPaymentContext interface into domain contracts layer',
		expectedScoreGain: 4.1,
		estimatedEffort: '1.5 days',
		affectedComponent: 'apps/backend/app/payment/processor.ts',
		reasoning: 'Breaks tight circular import between PaymentProcessor and CheckoutManager.',
	},
];

export function PriorityEngineRoadmap() {
	const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');

	const filteredPriorities = SAMPLE_PRIORITIES.filter((item) => {
		return selectedCategory === 'ALL' || item.priorityCategory === selectedCategory;
	});

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
							<ListOrdered className="w-4 h-4" /> Multi-Signal Priority Engine
						</div>
						<h2 className="text-xl font-black text-white">Engineering Priority & Actionable Roadmap</h2>
						<p className="text-xs text-slate-400">
							Ranks refactoring tasks by expected health score gain, risk reduction, effort, and dependency centrality.
						</p>
					</div>

					<div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
						{['ALL', 'FIX_NOW', 'FIX_NEXT', 'PLAN', 'MONITOR'].map((cat) => (
							<button
								key={cat}
								onClick={() => setSelectedCategory(cat)}
								className={cn(
									'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
									selectedCategory === cat
										? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950'
										: 'text-slate-400 hover:text-white'
								)}
							>
								{cat.replace(/_/g, ' ')}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Priorities Cards List */}
			<div className="space-y-4">
				{filteredPriorities.map((item) => {
					const isNow = item.priorityCategory === 'FIX_NOW';
					return (
						<div
							key={item.id}
							className={cn(
								'p-5 rounded-3xl border transition-all duration-200 shadow-xl space-y-3 relative overflow-hidden',
								isNow ? 'bg-slate-900/90 border-cyan-500/60' : 'bg-slate-900/80 border-slate-800'
							)}
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
								<div className="flex items-center gap-2">
									<span
										className={cn(
											'px-2.5 py-0.5 rounded text-[10px] font-black uppercase',
											isNow ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
										)}
									>
										{item.priorityCategory.replace(/_/g, ' ')}
									</span>
									<h3 className="text-base font-black text-white">{item.title}</h3>
								</div>

								<div className="text-right">
									<div className="text-xl font-black text-emerald-400">+{item.expectedScoreGain} pts gain</div>
									<div className="text-[10px] text-slate-500 font-mono">Effort: {item.estimatedEffort}</div>
								</div>
							</div>

							<div className="text-xs text-slate-400">
								Affected Component: <code className="text-cyan-300">{item.affectedComponent}</code>
							</div>

							<div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
								<strong>Priority Rationale:</strong> {item.reasoning}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
