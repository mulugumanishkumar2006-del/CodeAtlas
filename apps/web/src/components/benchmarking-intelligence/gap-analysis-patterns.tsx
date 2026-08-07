'use client';

import * as React from 'react';
import {
	Sparkles,
	Layers,
	CheckCircle,
	AlertTriangle,
	ArrowRight,
	Boxes,
	ShieldCheck,
	Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BenchmarkGap {
	id: string;
	dimension: string;
	currentScore: number;
	benchmarkScore: number;
	gapDelta: number;
	likelyCause: string;
	recommendedAction: string;
	expectedGain: number;
	effort: string;
}

export interface BestPracticePattern {
	id: string;
	patternName: string;
	category: string;
	currentStatus: 'ADOPTED' | 'PARTIAL' | 'NOT_ADOPTED';
	benefitSummary: string;
}

const SAMPLE_GAPS: BenchmarkGap[] = [
	{
		id: 'gap-1',
		dimension: 'Performance Index',
		currentScore: 74,
		benchmarkScore: 82,
		gapDelta: -8,
		likelyCause: 'Unindexed PostgreSQL query in analytics_raw.py dragging P99 database latency.',
		recommendedAction: 'Create composite index on (tenant_id, filter) in metrics table.',
		expectedGain: 8.0,
		effort: '1 hr',
	},
];

const SAMPLE_PATTERNS: BestPracticePattern[] = [
	{
		id: 'pat-1',
		patternName: 'Zero-Trust Domain Contract Isolation',
		category: 'Architecture',
		currentStatus: 'ADOPTED',
		benefitSummary: 'Domain interfaces completely decoupled from HTTP router and database drivers.',
	},
	{
		id: 'pat-2',
		patternName: 'Automated Secret Rotation Guard',
		category: 'Security',
		currentStatus: 'PARTIAL',
		benefitSummary: 'Stripe test API key detected in commit history; needs automated vault rotation.',
	},
];

export function GapAnalysisPatterns() {
	const [activeSubTab, setActiveSubTab] = React.useState<'gaps' | 'patterns'>('gaps');

	return (
		<div className="space-y-6 font-mono">
			{/* Sub Tabs Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<Sparkles className="w-4 h-4" /> Benchmark Gap & Pattern Library
					</div>
					<h2 className="text-xl font-black text-white">Engineering Gap Analysis & Best Practices</h2>
				</div>

				<div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
					<button
						onClick={() => setActiveSubTab('gaps')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'gaps'
								? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<AlertTriangle className="w-4 h-4" /> Gap Analysis ({SAMPLE_GAPS.length})
					</button>

					<button
						onClick={() => setActiveSubTab('patterns')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'patterns'
								? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<Layers className="w-4 h-4" /> Pattern Library ({SAMPLE_PATTERNS.length})
					</button>
				</div>
			</div>

			{/* Gap Tab */}
			{activeSubTab === 'gaps' && (
				<div className="space-y-4">
					{SAMPLE_GAPS.map((gap) => (
						<div
							key={gap.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
						>
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<h3 className="text-base font-black text-white">{gap.dimension} Gap</h3>
								<span className="text-xl font-black text-rose-400">{gap.gapDelta} pts below benchmark</span>
							</div>

							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
								<strong className="text-slate-400">Likely Cause:</strong>
								<p className="text-slate-300">{gap.likelyCause}</p>
							</div>

							<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1 text-xs">
								<strong className="text-emerald-400">Recommended Improvement:</strong>
								<p className="text-slate-300">{gap.recommendedAction}</p>
								<div className="text-emerald-300 font-bold mt-1">Expected Gain: +{gap.expectedGain} pts | Effort: {gap.effort}</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Pattern Tab */}
			{activeSubTab === 'patterns' && (
				<div className="space-y-4">
					{SAMPLE_PATTERNS.map((pat) => (
						<div
							key={pat.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3"
						>
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<div>
									<span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-bold">
										{pat.category}
									</span>
									<h3 className="text-base font-black text-white mt-1">{pat.patternName}</h3>
								</div>

								<span
									className={cn(
										'px-2.5 py-1 rounded text-xs font-bold uppercase',
										pat.currentStatus === 'ADOPTED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
									)}
								>
									{pat.currentStatus}
								</span>
							</div>

							<p className="text-xs text-slate-300">{pat.benefitSummary}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
