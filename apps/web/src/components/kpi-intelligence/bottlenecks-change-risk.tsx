'use client';

import * as React from 'react';
import {
	AlertTriangle,
	Sparkles,
	ArrowRight,
	FileCode,
	ShieldAlert,
	CheckCircle,
	Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BottleneckSignal {
	id: string;
	signalName: string;
	possibleCause: string;
	evidenceSummary: string;
	confidencePercent: number;
	impactSummary: string;
	recommendedInvestigation: string;
}

export interface ChangeRiskItem {
	id: string;
	prTitle: string;
	filesChangedCount: number;
	linesChangedCount: number;
	architectureImpact: string;
	dbImpact: boolean;
	changeRiskScore: number; // 0..100 risk score
}

const SAMPLE_BOTTLENECK_SIGNALS: BottleneckSignal[] = [
	{
		id: 'bot-1',
		signalName: 'Review Waiting Time Delay (14.5 hrs)',
		possibleCause: 'Large cross-service PRs spanning multiple domain boundaries.',
		evidenceSummary: 'PRs modifying >10 files experience 3.4x longer code review queues.',
		confidencePercent: 96,
		impactSummary: 'Extends total lead time by 14.5 hours per release cycle.',
		recommendedInvestigation: 'Decompose cross-service PRs into decoupled feature branches.',
	},
];

const SAMPLE_CHANGE_RISKS: ChangeRiskItem[] = [
	{
		id: 'risk-1',
		prTitle: 'Refactor PaymentProcessor & Add Webhook Retry Queue',
		filesChangedCount: 14,
		linesChangedCount: 480,
		architectureImpact: 'Modifies payment domain contract layer',
		dbImpact: true,
		changeRiskScore: 84.5,
	},
];

export function BottlenecksChangeRisk() {
	const [activeSubTab, setActiveSubTab] = React.useState<'bottlenecks' | 'changerisk'>('bottlenecks');

	return (
		<div className="space-y-6 font-mono">
			{/* Sub Tabs Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-rose-400 font-bold uppercase tracking-wider mb-1">
						<AlertTriangle className="w-4 h-4" /> Bottlenecks & Risk Intelligence
					</div>
					<h2 className="text-xl font-black text-white">Automated Bottleneck & Change Risk Engine</h2>
				</div>

				<div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
					<button
						onClick={() => setActiveSubTab('bottlenecks')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'bottlenecks'
								? 'bg-rose-950/80 border border-rose-500/40 text-rose-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<AlertTriangle className="w-4 h-4" /> Bottlenecks ({SAMPLE_BOTTLENECK_SIGNALS.length})
					</button>

					<button
						onClick={() => setActiveSubTab('changerisk')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'changerisk'
								? 'bg-rose-950/80 border border-rose-500/40 text-rose-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<ShieldAlert className="w-4 h-4" /> Change Risk Calculator
					</button>
				</div>
			</div>

			{/* Bottlenecks Tab */}
			{activeSubTab === 'bottlenecks' && (
				<div className="space-y-4">
					{SAMPLE_BOTTLENECK_SIGNALS.map((bot) => (
						<div
							key={bot.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
						>
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<h3 className="text-base font-black text-white">{bot.signalName}</h3>
								<span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-xs font-bold">
									{bot.confidencePercent}% CONFIDENCE
								</span>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
								<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
									<strong className="text-slate-400">Possible Cause:</strong>
									<p className="text-slate-300">{bot.possibleCause}</p>
								</div>

								<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
									<strong className="text-slate-400">Evidence Summary:</strong>
									<p className="text-slate-300">{bot.evidenceSummary}</p>
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1 text-xs">
								<strong className="text-cyan-400">Recommended Action:</strong>
								<p className="text-slate-300">{bot.recommendedInvestigation}</p>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Change Risk Tab */}
			{activeSubTab === 'changerisk' && (
				<div className="space-y-4">
					{SAMPLE_CHANGE_RISKS.map((risk) => (
						<div
							key={risk.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
						>
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<div>
									<h3 className="text-base font-black text-white">{risk.prTitle}</h3>
									<span className="text-xs text-slate-400">
										{risk.filesChangedCount} files changed ({risk.linesChangedCount} lines)
									</span>
								</div>
								<div className="text-right">
									<span className="text-2xl font-black text-rose-400">{risk.changeRiskScore} pts</span>
									<span className="text-[10px] text-slate-500 block uppercase">Contextual Risk</span>
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
								<strong>Architecture Impact:</strong> {risk.architectureImpact}
								{risk.dbImpact && (
									<span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold block w-fit mt-1">
										⚠️ MODIFIES DATABASE SCHEMA
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
