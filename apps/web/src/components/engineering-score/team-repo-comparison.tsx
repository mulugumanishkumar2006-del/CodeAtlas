'use client';

import * as React from 'react';
import {
	GitBranch,
	Users,
	Sparkles,
	ArrowRight,
	CheckCircle,
	AlertTriangle,
	Gauge,
	Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface RepositoryCompareItem {
	id: string;
	repoName: string;
	contextType: string;
	overallScore: number;
	architectureScore: number;
	securityScore: number;
	performanceScore: number;
	techDebtScore: number;
}

const SAMPLE_REPOS: RepositoryCompareItem[] = [
	{
		id: 'repo-codeatlas',
		repoName: 'CodeAtlas Core Engine',
		contextType: 'Observed Production Monorepo',
		overallScore: 94,
		architectureScore: 92,
		securityScore: 94,
		performanceScore: 96,
		techDebtScore: 84,
	},
	{
		id: 'repo-auth-vault',
		repoName: 'Auth Vault Service',
		contextType: 'Production Microservice',
		overallScore: 96,
		architectureScore: 98,
		securityScore: 98,
		performanceScore: 94,
		techDebtScore: 90,
	},
];

export function TeamRepoComparison() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<GitBranch className="w-4 h-4" /> Contextual System Comparison
					</div>
					<h2 className="text-xl font-black text-white">Repository & System Engineering Comparison</h2>
					<p className="text-xs text-slate-400">
						Compare engineering condition across repositories and services with context-aware weighting.
					</p>
				</div>
			</div>

			{/* Comparison Table */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<h3 className="text-base font-black text-white border-b border-slate-800 pb-3">
					Repository Context Matrix
				</h3>

				<div className="space-y-3">
					{SAMPLE_REPOS.map((repo) => (
						<div
							key={repo.id}
							className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
						>
							<div>
								<span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
									{repo.contextType}
								</span>
								<h4 className="text-base font-black text-white mt-1">{repo.repoName}</h4>
							</div>

							<div className="flex items-center gap-6 text-xs">
								<div className="text-center">
									<span className="text-[10px] text-slate-400 block uppercase">Overall</span>
									<span className="text-2xl font-black text-emerald-400">{repo.overallScore}</span>
								</div>
								<div className="text-center">
									<span className="text-[10px] text-slate-400 block uppercase">Arch</span>
									<span className="text-lg font-black text-white">{repo.architectureScore}</span>
								</div>
								<div className="text-center">
									<span className="text-[10px] text-slate-400 block uppercase">Sec</span>
									<span className="text-lg font-black text-emerald-400">{repo.securityScore}</span>
								</div>
								<div className="text-center">
									<span className="text-[10px] text-slate-400 block uppercase">Perf</span>
									<span className="text-lg font-black text-orange-400">{repo.performanceScore}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
