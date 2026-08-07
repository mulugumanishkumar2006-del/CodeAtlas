'use client';

import * as React from 'react';
import {
	Clock,
	TrendingUp,
	TrendingDown,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	Server,
	Sparkles,
	CheckCircle2,
	AlertTriangle,
	GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SelfBenchmarkTimelineItem {
	period: 'Current State' | 'Previous Release' | 'Previous Month' | 'Previous Quarter' | 'Previous Major Version';
	engineeringScore: number;
	architectureScore: number;
	securityScore: number;
	performanceScore: number;
	status: 'IMPROVED' | 'REGRESSED' | 'STABLE' | 'EMERGING_RISK';
	deltaScore: number;
	eventExplanation: string;
}

export interface SimilarRepoMatcher {
	id: string;
	repoName: string;
	matchConfidencePercent: number;
	techStack: string;
	architectureStyle: string;
	similarityReason: string;
	scoreDifference: number; // e.g. +4 or -6
}

const SAMPLE_SELF_TIMELINE: SelfBenchmarkTimelineItem[] = [
	{
		period: 'Current State',
		engineeringScore: 94,
		architectureScore: 92,
		securityScore: 94,
		performanceScore: 96,
		status: 'IMPROVED',
		deltaScore: 4.2,
		eventExplanation: 'Zero-trust authentication hardening sweep and P99 latency optimization.',
	},
	{
		period: 'Previous Release',
		engineeringScore: 90,
		architectureScore: 88,
		securityScore: 90,
		performanceScore: 92,
		status: 'STABLE',
		deltaScore: 0.0,
		eventExplanation: 'Baseline release with clean domain contracts.',
	},
	{
		period: 'Previous Quarter',
		engineeringScore: 78,
		architectureScore: 74,
		securityScore: 82,
		performanceScore: 76,
		status: 'REGRESSED',
		deltaScore: -6.4,
		eventExplanation: 'PR #412 introduced unindexed SQL query and circular import coupling.',
	},
];

const SAMPLE_SIMILAR_REPOS: SimilarRepoMatcher[] = [
	{
		id: 'sim-1',
		repoName: 'Auth Vault Service (Peer Microservice)',
		matchConfidencePercent: 98,
		techStack: 'FastAPI / PostgreSQL / Redis',
		architectureStyle: 'Hexagonal Domain Contracts',
		similarityReason: 'Matches technology stack, zero-trust security model, and API throughput profile.',
		scoreDifference: 2.0,
	},
];

export function SelfSimilarBenchmark() {
	return (
		<div className="space-y-6 font-mono">
			{/* Self Benchmark Timeline */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
					<Clock className="w-4 h-4" /> Self Benchmark Timeline Evolution
				</div>
				<h2 className="text-xl font-black text-white">Repository Self-Comparison Over Time</h2>
				<p className="text-xs text-slate-400">
					Compare current repository state against previous releases, months, and quarters to track engineering progress.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
					{SAMPLE_SELF_TIMELINE.map((item, idx) => {
						const isImproved = item.status === 'IMPROVED';
						const isRegressed = item.status === 'REGRESSED';

						return (
							<div
								key={idx}
								className={cn(
									'p-5 rounded-2xl border transition-all duration-200 shadow-xl space-y-3 relative overflow-hidden',
									isImproved ? 'bg-slate-950 border-emerald-500/40' : 'bg-slate-950 border-slate-800',
									isRegressed && 'border-rose-500/40'
								)}
							>
								<div className="flex items-center justify-between">
									<span className="text-xs font-bold text-white uppercase">{item.period}</span>
									<span
										className={cn(
											'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
											isImproved ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800',
											isRegressed && 'bg-rose-950 text-rose-300 border border-rose-500/40'
										)}
									>
										{item.status}
									</span>
								</div>

								<div className="flex items-baseline justify-between">
									<div className="text-3xl font-black text-white">{item.engineeringScore} <span className="text-xs text-slate-500">/ 100</span></div>
									<div
										className={cn(
											'text-xs font-bold flex items-center gap-0.5',
											item.deltaScore > 0 ? 'text-emerald-400' : 'text-slate-400',
											item.deltaScore < 0 && 'text-rose-400'
										)}
									>
										{item.deltaScore > 0 && <ArrowUpRight className="w-3.5 h-3.5" />}
										{item.deltaScore < 0 && <ArrowDownRight className="w-3.5 h-3.5" />}
										<span>{item.deltaScore > 0 ? `+${item.deltaScore}` : item.deltaScore} pts</span>
									</div>
								</div>

								<p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
									{item.eventExplanation}
								</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* Similar Repository Matcher */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
					<Server className="w-4 h-4" /> Contextual Peer Matcher
				</div>
				<h2 className="text-xl font-black text-white">Similar Repository Benchmarking</h2>
				<p className="text-xs text-slate-400">
					Matches comparable repositories based on observed technology stack, architecture style, and scale.
				</p>

				<div className="space-y-3">
					{SAMPLE_SIMILAR_REPOS.map((repo) => (
						<div
							key={repo.id}
							className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
						>
							<div>
								<div className="flex items-center gap-2 mb-1">
									<span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
										{repo.matchConfidencePercent}% CONTEXT MATCH
									</span>
									<span className="text-xs text-slate-400">{repo.techStack}</span>
								</div>
								<h3 className="text-base font-black text-white">{repo.repoName}</h3>
								<p className="text-xs text-slate-300 mt-1">{repo.similarityReason}</p>
							</div>

							<div className="text-right">
								<span className="text-[10px] text-slate-400 uppercase block">Score Variance</span>
								<span className="text-2xl font-black text-emerald-400">+{repo.scoreDifference} pts</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
