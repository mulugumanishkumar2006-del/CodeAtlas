'use client';

import * as React from 'react';
import {
	BrainCircuit,
	TrendingUp,
	TrendingDown,
	ShieldCheck,
	Zap,
	Layers,
	Code2,
	Boxes,
	Activity,
	CheckCircle,
	AlertTriangle,
	Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DomainForecastDetails {
	id: string;
	domainName: string;
	currentStateScore: number;
	projectedScore: number;
	timeHorizon: string;
	confidenceRating: string;
	confidencePercent: number;
	primaryDrivers: string[];
	assumptions: string[];
	evidenceSummary: string;
	recommendedIntervention: string;
}

const SAMPLE_DOMAIN_FORECASTS: DomainForecastDetails[] = [
	{
		id: 'dom-debt',
		domainName: 'Technical Debt Growth Trajectory',
		currentStateScore: 68,
		projectedScore: 78,
		timeHorizon: '90 Days',
		confidenceRating: 'HIGH CONFIDENCE',
		confidencePercent: 98,
		primaryDrivers: [
			'PaymentProcessor circular import coupling with CheckoutManager',
			'Unindexed PostgreSQL raw SQL query formatting in analytics_raw.py',
		],
		assumptions: [
			'Current feature development pace continues without dedicated refactoring sprint.',
			'Database table grows by projected ~120k rows/month.',
		],
		evidenceSummary: 'Code churn history shows 4.2x higher modification frequency in payment modules without test coverage additions.',
		recommendedIntervention: 'Extract IPaymentContext interface and apply PostgreSQL composite index.',
	},
	{
		id: 'dom-perf',
		domainName: 'Performance Latency Degradation Forecast',
		currentStateScore: 96,
		projectedScore: 88,
		timeHorizon: '90 Days',
		confidenceRating: 'MODERATE CONFIDENCE',
		confidencePercent: 92,
		primaryDrivers: [
			'Database query latency bloat under 3,400 rps load spikes',
			'N+1 order details fetching pattern in payment/processor.ts',
		],
		assumptions: [
			'Production HTTP API request throughput increases by ~25% quarter-over-quarter.',
		],
		evidenceSummary: 'P99 database query response latency degraded from 38ms to 180ms during recent load test simulations.',
		recommendedIntervention: 'Add Redis cache layer for payment status lookups.',
	},
];

export function DomainForecastEngines() {
	const [activeDomainId, setActiveDomainId] = React.useState<string>('dom-debt');
	const activeDomain = SAMPLE_DOMAIN_FORECASTS.find((d) => d.id === activeDomainId) || SAMPLE_DOMAIN_FORECASTS[0];

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<BrainCircuit className="w-4 h-4" /> Multidimensional Domain Forecast Engines
					</div>
					<h2 className="text-xl font-black text-white">Domain Forecast Deep Inspector</h2>
					<p className="text-xs text-slate-400">
						Inspect evidence-backed projections, underlying assumptions, and recommended interventions across engineering domains.
					</p>
				</div>
			</div>

			{/* Domain Selector Tabs */}
			<div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
				{SAMPLE_DOMAIN_FORECASTS.map((dom) => (
					<button
						key={dom.id}
						onClick={() => setActiveDomainId(dom.id)}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border whitespace-nowrap',
							dom.id === activeDomain.id
								? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-lg'
								: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
						)}
					>
						{dom.domainName}
					</button>
				))}
			</div>

			{/* Active Domain Box */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
					<div>
						<h3 className="text-lg font-black text-white">{activeDomain.domainName}</h3>
						<span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
							{activeDomain.confidenceRating} ({activeDomain.confidencePercent}%)
						</span>
					</div>

					<div className="text-right">
						<span className="text-xs text-slate-400 block uppercase">Projected Score ({activeDomain.timeHorizon})</span>
						<span className="text-3xl font-black text-emerald-400">{activeDomain.projectedScore} / 100</span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<strong className="text-cyan-400 uppercase">Primary Projected Drivers:</strong>
						<ul className="space-y-1 text-slate-300">
							{activeDomain.primaryDrivers.map((driver, idx) => (
								<li key={idx} className="flex items-center gap-1.5">
									<span className="text-cyan-400">•</span>
									<span>{driver}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<strong className="text-purple-300 uppercase">Model Assumptions:</strong>
						<ul className="space-y-1 text-slate-300">
							{activeDomain.assumptions.map((asm, idx) => (
								<li key={idx} className="flex items-center gap-1.5">
									<span className="text-purple-400">•</span>
									<span>{asm}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
					<strong className="text-slate-400 uppercase">Evidence Summary:</strong>
					<p className="text-slate-300">{activeDomain.evidenceSummary}</p>
				</div>

				<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1 text-xs">
					<strong className="text-emerald-400 uppercase">Recommended Preventive Action:</strong>
					<p className="text-emerald-300 font-bold">{activeDomain.recommendedIntervention}</p>
				</div>
			</div>
		</div>
	);
}
