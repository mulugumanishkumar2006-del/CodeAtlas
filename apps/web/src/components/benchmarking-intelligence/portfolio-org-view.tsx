'use client';

import * as React from 'react';
import {
	Building2,
	Layers,
	ShieldCheck,
	Zap,
	Code2,
	ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PortfolioRepoItem {
	id: string;
	repoName: string;
	architectureConsistency: number;
	securityPosture: number;
	performanceIndex: number;
	qualityScore: number;
	overallHealth: number;
}

const SAMPLE_PORTFOLIO_REPOS: PortfolioRepoItem[] = [
	{
		id: 'p-1',
		repoName: 'CodeAtlas Core Engine',
		architectureConsistency: 96,
		securityPosture: 94,
		performanceIndex: 96,
		qualityScore: 94,
		overallHealth: 94,
	},
	{
		id: 'p-2',
		repoName: 'Auth Vault Service',
		architectureConsistency: 98,
		securityPosture: 98,
		performanceIndex: 94,
		qualityScore: 96,
		overallHealth: 96,
	},
];

export function PortfolioOrgView() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<Building2 className="w-4 h-4" /> Portfolio & Organization Benchmark
					</div>
					<h2 className="text-xl font-black text-white">Organization Portfolio Health Matrix</h2>
					<p className="text-xs text-slate-400">
						Cross-repository analysis of architecture consistency, security posture, and quality patterns.
					</p>
				</div>
			</div>

			{/* Portfolio Grid */}
			<div className="grid grid-cols-1 gap-4">
				{SAMPLE_PORTFOLIO_REPOS.map((repo) => (
					<div
						key={repo.id}
						className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
					>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
							<h3 className="text-base font-black text-white">{repo.repoName}</h3>
							<div className="text-right">
								<span className="text-[10px] text-slate-400 uppercase block">Portfolio Health</span>
								<span className="text-2xl font-black text-emerald-400">{repo.overallHealth} / 100</span>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
							<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
								<span className="text-[10px] text-slate-400">Architecture Consistency</span>
								<div className="text-base font-black text-white">{repo.architectureConsistency}%</div>
							</div>
							<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
								<span className="text-[10px] text-slate-400">Security Posture</span>
								<div className="text-base font-black text-emerald-400">{repo.securityPosture} / 100</div>
							</div>
							<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
								<span className="text-[10px] text-slate-400">Performance Index</span>
								<div className="text-base font-black text-orange-400">{repo.performanceIndex} / 100</div>
							</div>
							<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
								<span className="text-[10px] text-slate-400">Quality Index</span>
								<div className="text-base font-black text-cyan-300">{repo.qualityScore} / 100</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
