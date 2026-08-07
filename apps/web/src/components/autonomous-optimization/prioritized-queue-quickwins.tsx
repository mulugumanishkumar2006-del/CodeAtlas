'use client';

import * as React from 'react';
import {
	ListOrdered,
	Sparkles,
	CheckCircle,
	ArrowRight,
	AlertTriangle,
	ShieldCheck,
	Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface OptimizationQueueItem {
	id: string;
	title: string;
	category: 'IMMEDIATE' | 'HIGH_VALUE' | 'QUICK_WIN' | 'MONITOR';
	expectedHealthGain: number;
	effort: string;
	risk: 'LOW' | 'MEDIUM' | 'HIGH';
	confidencePercent: number;
	affectedComponent: string;
	summary: string;
}

const SAMPLE_QUEUE_ITEMS: OptimizationQueueItem[] = [
	{
		id: 'opt-1',
		title: 'Create Composite Index on (tenant_id, filter) in PostgreSQL metrics table',
		category: 'QUICK_WIN',
		expectedHealthGain: 8.0,
		effort: '1 hr',
		risk: 'LOW',
		confidencePercent: 99,
		affectedComponent: 'apps/backend/app/db/queries/analytics_raw.py',
		summary: 'Fixes P99 latency bloat from 180ms down to sub-20ms under 3,400 rps load.',
	},
	{
		id: 'opt-2',
		title: 'Extract IPaymentContext interface into domain contracts layer',
		category: 'HIGH_VALUE',
		expectedHealthGain: 4.1,
		effort: '1.5 days',
		risk: 'LOW',
		confidencePercent: 96,
		affectedComponent: 'apps/backend/app/payment/processor.ts',
		summary: 'Breaks tight circular import between PaymentProcessor and CheckoutManager.',
	},
];

interface PrioritizedQueueQuickWinsProps {
	onInspectPatch: (itemId: string) => void;
}

export function PrioritizedQueueQuickWins({ onInspectPatch }: PrioritizedQueueQuickWinsProps) {
	const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');

	const filteredItems = SAMPLE_QUEUE_ITEMS.filter(
		(item) => selectedCategory === 'ALL' || item.category === selectedCategory
	);

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
							<ListOrdered className="w-4 h-4" /> Multi-Signal Optimization Queue
						</div>
						<h2 className="text-xl font-black text-white">Prioritized Optimization Queue & Quick Wins</h2>
						<p className="text-xs text-slate-400">
							Ranks refactoring opportunities by health gain, effort, risk, & confidence.
						</p>
					</div>

					<div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
						{['ALL', 'IMMEDIATE', 'HIGH_VALUE', 'QUICK_WIN', 'MONITOR'].map((cat) => (
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

			{/* Queue Cards */}
			<div className="space-y-4">
				{filteredItems.map((item) => (
					<div
						key={item.id}
						className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
					>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
							<div className="flex items-center gap-2">
								<span
									className={cn(
										'px-2.5 py-0.5 rounded text-[10px] font-black uppercase',
										item.category === 'QUICK_WIN'
											? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
											: 'bg-purple-950 text-purple-300 border border-purple-500/40'
									)}
								>
									{item.category.replace(/_/g, ' ')}
								</span>
								<h3 className="text-base font-black text-white">{item.title}</h3>
							</div>

							<div className="text-right">
								<span className="text-xl font-black text-emerald-400">+{item.expectedHealthGain} pts</span>
								<span className="text-[10px] text-slate-500 block">Effort: {item.effort}</span>
							</div>
						</div>

						<div className="text-xs text-slate-400">
							Affected Component: <code className="text-cyan-300">{item.affectedComponent}</code>
						</div>

						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
							<strong>Summary:</strong> {item.summary}
						</div>

						<div className="flex items-center justify-between pt-1">
							<span className="text-[10px] text-slate-400 font-bold">{item.confidencePercent}% Model Confidence</span>
							<Button
								onClick={() => onInspectPatch(item.id)}
								className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono px-4 py-2 rounded-xl flex items-center gap-2"
							>
								<span>Inspect Isolated Patch</span>
								<ArrowRight className="w-3.5 h-3.5" />
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
