'use client';

import * as React from 'react';
import {
	Calendar,
	Sparkles,
	CheckCircle,
	ArrowRight,
	Clock,
	AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PreventiveRoadmapItem {
	id: string;
	horizon: 'NOW' | 'NEXT_30_DAYS' | 'NEXT_60_DAYS' | 'NEXT_90_DAYS';
	title: string;
	whyNow: string;
	expectedImpact: string;
	effort: string;
	confidencePercent: number;
}

const SAMPLE_ROADMAP: PreventiveRoadmapItem[] = [
	{
		id: 'rd-1',
		horizon: 'NOW',
		title: 'Create Composite Index on (tenant_id, filter) in PostgreSQL metrics table',
		whyNow: 'Prevents database P99 latency bloat before row count reaches 4.2M.',
		expectedImpact: '+8.0 pts Performance Index gain',
		effort: '1 hr',
		confidencePercent: 99,
	},
	{
		id: 'rd-2',
		horizon: 'NEXT_30_DAYS',
		title: 'Extract IPaymentContext interface into domain contracts layer',
		whyNow: 'Breaks tight circular import between PaymentProcessor and CheckoutManager.',
		expectedImpact: '+4.1 pts Architecture Health gain',
		effort: '1.5 days',
		confidencePercent: 96,
	},
	{
		id: 'rd-3',
		horizon: 'NEXT_60_DAYS',
		title: 'Add Redis Status Caching for Payment Verifications',
		whyNow: 'Eliminates redundant database queries during 3,400 rps traffic spikes.',
		expectedImpact: '+6.2 pts Reliability gain',
		effort: '2 days',
		confidencePercent: 94,
	},
];

export function PreventiveRoadmap() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
						<Calendar className="w-4 h-4" /> Proactive Action Plan
					</div>
					<h2 className="text-xl font-black text-white">Preventive Engineering Roadmap</h2>
					<p className="text-xs text-slate-400">
						AI-generated preventive refactoring roadmap ordered by urgency, expected impact, effort, and confidence.
					</p>
				</div>
			</div>

			{/* Roadmap Timeline List */}
			<div className="space-y-4">
				{SAMPLE_ROADMAP.map((item) => (
					<div
						key={item.id}
						className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
					>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
							<div className="flex items-center gap-2">
								<span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase">
									{item.horizon.replace(/_/g, ' ')}
								</span>
								<h3 className="text-base font-black text-white">{item.title}</h3>
							</div>

							<div className="text-right">
								<span className="text-xs text-emerald-400 font-bold">{item.expectedImpact}</span>
								<span className="text-[10px] text-slate-500 block font-mono">Effort: {item.effort}</span>
							</div>
						</div>

						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
							<strong className="text-cyan-400">Why Now:</strong> {item.whyNow}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
