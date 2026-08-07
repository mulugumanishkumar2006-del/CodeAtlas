'use client';

import * as React from 'react';
import {
	Sparkles,
	TrendingUp,
	TrendingDown,
	AlertTriangle,
	CheckCircle,
	ArrowRight,
	GitCommit,
	ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ScoreDriver {
	id: string;
	title: string;
	type: 'POSITIVE' | 'NEGATIVE' | 'EMERGING_RISK' | 'OPPORTUNITY';
	impactDelta: number; // e.g. +5.2 or -3.8
	confidencePercent: number;
	affectedComponent: string;
	evidenceSummary: string;
	recommendedAction: string;
}

const SAMPLE_SCORE_DRIVERS: ScoreDriver[] = [
	{
		id: 'drv-1',
		title: 'Zero-Trust Authentication & Strict Contract Decoupling',
		type: 'POSITIVE',
		impactDelta: 8.4,
		confidencePercent: 99,
		affectedComponent: 'apps/backend/app/auth/vault.py',
		evidenceSummary: 'JWT signature verification and role-based access control enforced with 98% test coverage.',
		recommendedAction: 'Maintain current zero-trust architecture boundary enforcement.',
	},
	{
		id: 'drv-2',
		title: 'Unindexed Raw SQL Query Formatting in Analytics Handler',
		type: 'NEGATIVE',
		impactDelta: -5.2,
		confidencePercent: 96,
		affectedComponent: 'apps/backend/app/db/queries/analytics_raw.py',
		evidenceSummary: 'Full table scans across 4.2M rows dragging P99 database query latency to 180ms.',
		recommendedAction: 'Create composite index on (tenant_id, filter) in PostgreSQL metrics table.',
	},
	{
		id: 'drv-3',
		title: 'Circular Import Dependency in Payment Processor',
		type: 'EMERGING_RISK',
		impactDelta: -3.1,
		confidencePercent: 92,
		affectedComponent: 'apps/backend/app/payment/processor.ts',
		evidenceSummary: 'PaymentProcessor directly imports CheckoutManager which calls back into PaymentProcessor.',
		recommendedAction: 'Extract IPaymentContext interface into domain contracts layer.',
	},
];

export function ScoreExplainabilityDrivers() {
	return (
		<div className="space-y-6 font-mono">
			{/* AI Narrative Panel */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
					<Sparkles className="w-4 h-4" /> AI Evidence Rationale
				</div>
				<h2 className="text-xl font-black text-white">Why is Engineering Health Score 94/100?</h2>
				<p className="text-xs text-slate-300 leading-relaxed">
					"Engineering health score is <strong className="text-emerald-400">94/100</strong> because architecture health (92) and security posture (94) are exceptionally robust with zero-trust verification. However, unindexed raw SQL query formatting in <code className="text-cyan-300">analytics_raw.py</code> (-5.2 pts) and technical debt coupling in payment processing (-3.1 pts) currently reduce the overall score."
				</p>
			</div>

			{/* Score Drivers Grid */}
			<div className="space-y-4">
				<h3 className="text-base font-black text-white border-b border-slate-800 pb-3">
					Primary Score Drivers & Evidence
				</h3>

				<div className="grid grid-cols-1 gap-4">
					{SAMPLE_SCORE_DRIVERS.map((driver) => {
						const isPositive = driver.type === 'POSITIVE';
						const isNegative = driver.type === 'NEGATIVE';

						return (
							<div
								key={driver.id}
								className={cn(
									'p-5 rounded-3xl border transition-all duration-200 shadow-xl space-y-3 relative overflow-hidden',
									isPositive ? 'bg-slate-900/80 border-emerald-500/40' : 'bg-slate-900/80 border-rose-500/40'
								)}
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
									<div className="flex items-center gap-2">
										<span
											className={cn(
												'px-2.5 py-0.5 rounded text-[10px] font-black uppercase',
												isPositive ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'
											)}
										>
											{driver.type.replace(/_/g, ' ')}
										</span>
										<h4 className="text-sm font-black text-white">{driver.title}</h4>
									</div>

									<div className="text-right">
										<span
											className={cn(
												'text-lg font-black',
												isPositive ? 'text-emerald-400' : 'text-rose-400'
											)}
										>
											{driver.impactDelta > 0 ? `+${driver.impactDelta}` : driver.impactDelta} pts
										</span>
									</div>
								</div>

								<div className="text-xs text-slate-400">
									Affected Component: <code className="text-cyan-300">{driver.affectedComponent}</code>
								</div>

								<div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
									<strong>Evidence:</strong> {driver.evidenceSummary}
								</div>

								<div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
									<span>Action: {driver.recommendedAction}</span>
									<span className="text-[10px] text-slate-400 font-bold">{driver.confidencePercent}% Confidence</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
