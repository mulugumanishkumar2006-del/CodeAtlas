'use client';

import * as React from 'react';
import {
	AlertTriangle,
	Sparkles,
	ArrowRight,
	ShieldAlert,
	Clock,
	Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EarlyWarningAlert {
	id: string;
	title: string;
	urgency: 'HIGH' | 'MEDIUM' | 'LOW';
	affectedComponent: string;
	predictedTrend: string;
	impactSummary: string;
	timeHorizon: string;
	recommendedIntervention: string;
}

const SAMPLE_EARLY_WARNINGS: EarlyWarningAlert[] = [
	{
		id: 'ew-1',
		title: 'Payment Service Architecture Coupling Growth Accelerating',
		urgency: 'HIGH',
		affectedComponent: 'apps/backend/app/payment/processor.ts',
		predictedTrend: 'Circular dependency cycles projected to double if CheckoutManager coupling is unaddressed.',
		impactSummary: 'May drag module maintainability index from 92 down to 74 over next 90 days.',
		timeHorizon: '90 Days',
		recommendedIntervention: 'Extract IPaymentContext interface into shared domain contracts.',
	},
	{
		id: 'ew-2',
		title: 'Unindexed PostgreSQL Query Table Scan Risk',
		urgency: 'HIGH',
		affectedComponent: 'apps/backend/app/db/queries/analytics_raw.py',
		predictedTrend: 'Table scans will degrade P99 database query response latency to >180ms as row count reaches 4.2M.',
		impactSummary: 'Will drag Performance Index down -8.0 pts under 3,400 rps load spikes.',
		timeHorizon: '30 Days',
		recommendedIntervention: 'Create composite index on (tenant_id, filter) in PostgreSQL metrics table.',
	},
];

export function PredictiveHotspotsAlerts() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
						<AlertTriangle className="w-4 h-4" /> Proactive Early Warning System
					</div>
					<h2 className="text-xl font-black text-white">Predictive Hotspot & Early Warning Alerts</h2>
					<p className="text-xs text-slate-400">
						Detects components at risk of becoming future engineering bottlenecks before code quality degrades.
					</p>
				</div>
			</div>

			{/* Early Warning Cards */}
			<div className="space-y-4">
				{SAMPLE_EARLY_WARNINGS.map((alert) => (
					<div
						key={alert.id}
						className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
					>
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div className="flex items-center gap-2">
								<span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-bold">
									{alert.urgency} URGENCY
								</span>
								<h3 className="text-base font-black text-white">{alert.title}</h3>
							</div>
							<span className="text-xs text-slate-400 font-bold">{alert.timeHorizon} Horizon</span>
						</div>

						<div className="text-xs text-slate-400">
							Affected Component: <code className="text-cyan-300">{alert.affectedComponent}</code>
						</div>

						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
							<strong className="text-amber-400">Predicted Trend:</strong>
							<p className="text-slate-300">{alert.predictedTrend}</p>
						</div>

						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
							<strong className="text-rose-400">Potential Impact:</strong>
							<p className="text-slate-300">{alert.impactSummary}</p>
						</div>

						<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
							<span>Action: {alert.recommendedIntervention}</span>
							<Button className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono px-3 py-1.5 rounded-xl">
								Plan Intervention →
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
