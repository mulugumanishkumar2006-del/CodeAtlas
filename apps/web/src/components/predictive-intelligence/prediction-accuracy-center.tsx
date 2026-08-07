'use client';

import * as React from 'react';
import {
	ShieldCheck,
	Sparkles,
	CheckCircle2,
	AlertCircle,
	TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PredictionHistoryItem {
	id: string;
	predictedDate: string;
	targetHorizonDate: string;
	domain: string;
	predictedOutcome: string;
	actualOutcome: string;
	varianceErrorPercent: number; // e.g. 2.1% error
	status: 'VERIFIED_ACCURATE' | 'MINOR_VARIANCE' | 'INCORRECT';
}

const SAMPLE_ACCURACY_HISTORY: PredictionHistoryItem[] = [
	{
		id: 'acc-1',
		predictedDate: '2026-05-01',
		targetHorizonDate: '2026-08-01',
		domain: 'Performance Latency Degradation',
		predictedOutcome: 'P99 DB latency degrades to ~180ms under 3,400 rps load',
		actualOutcome: 'Observed P99 DB latency reached 180ms on July 28',
		varianceErrorPercent: 1.2,
		status: 'VERIFIED_ACCURATE',
	},
];

export function PredictionAccuracyCenter() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
							<ShieldCheck className="w-4 h-4" /> Transparent Model Validation
						</div>
						<h2 className="text-xl font-black text-white">Prediction vs Reality Accuracy Center</h2>
						<p className="text-xs text-slate-400">
							Tracks historical model predictions against actual repository outcomes to measure forecasting reliability.
						</p>
					</div>

					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right">
						<span className="text-[10px] text-slate-400 block uppercase">Overall Model Accuracy</span>
						<span className="text-2xl font-black text-emerald-400">96.8%</span>
					</div>
				</div>
			</div>

			{/* History List */}
			<div className="space-y-4">
				{SAMPLE_ACCURACY_HISTORY.map((item) => (
					<div
						key={item.id}
						className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
					>
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div>
								<span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
									{item.status.replace(/_/g, ' ')}
								</span>
								<h3 className="text-base font-black text-white mt-1">{item.domain}</h3>
							</div>

							<span className="text-xs text-emerald-400 font-bold">
								Variance Error: {item.varianceErrorPercent}%
							</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
								<strong className="text-slate-400 uppercase">Predicted Outcome ({item.predictedDate}):</strong>
								<p className="text-slate-300">{item.predictedOutcome}</p>
							</div>

							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
								<strong className="text-emerald-400 uppercase">Actual Outcome ({item.targetHorizonDate}):</strong>
								<p className="text-slate-300">{item.actualOutcome}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
