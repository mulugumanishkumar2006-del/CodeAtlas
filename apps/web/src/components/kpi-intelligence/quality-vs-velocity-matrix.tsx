'use client';

import * as React from 'react';
import {
	TrendingUp,
	TrendingDown,
	Sparkles,
	ArrowRight,
	Activity,
	CheckCircle,
	AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QualityVelocityRelation {
	id: string;
	question: string;
	relationshipType: 'OBSERVED_CORRELATION' | 'POSSIBLE_EXPLANATION' | 'INSUFFICIENT_EVIDENCE';
	observedMetrics: string;
	explanation: string;
}

const SAMPLE_RELATIONS: QualityVelocityRelation[] = [
	{
		id: 'rel-1',
		question: 'Are we moving faster by accumulating technical debt?',
		relationshipType: 'OBSERVED_CORRELATION',
		observedMetrics: 'PR merge speed increased +24%, while technical debt score decreased -4.2 pts over past 30 days.',
		explanation: 'Observed correlation between delivery speed acceleration and technical debt accumulation in payment processor module.',
	},
	{
		id: 'rel-2',
		question: 'Did release velocity improve without increasing production incidents?',
		relationshipType: 'OBSERVED_CORRELATION',
		observedMetrics: 'Deployment frequency increased to 4.2 deploys/day with 0.0% incident failure rate.',
		explanation: 'Canary testing and automated zero-trust security checks prevented production regressions during velocity increase.',
	},
];

export function QualityVsVelocityMatrix() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
						<Activity className="w-4 h-4" /> System Tradeoff Analysis
					</div>
					<h2 className="text-xl font-black text-white">Quality vs Velocity Relationship Analyzer</h2>
					<p className="text-xs text-slate-400">
						Evaluates whether delivery acceleration introduces technical debt, security risks, or performance regressions.
					</p>
				</div>
			</div>

			{/* Relation Cards */}
			<div className="space-y-4">
				{SAMPLE_RELATIONS.map((rel) => (
					<div
						key={rel.id}
						className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
					>
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<h3 className="text-base font-black text-white">{rel.question}</h3>
							<span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-xs font-bold">
								{rel.relationshipType.replace(/_/g, ' ')}
							</span>
						</div>

						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
							<strong className="text-cyan-400">Observed Telemetry Metrics:</strong>
							<p className="text-slate-300">{rel.observedMetrics}</p>
						</div>

						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
							<strong className="text-purple-300">System Explanation:</strong>
							<p className="text-slate-300">{rel.explanation}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
