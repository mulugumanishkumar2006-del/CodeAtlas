'use client';

import * as React from 'react';
import {
	Sliders,
	GitPullRequest,
	Sparkles,
	CheckCircle,
	ArrowRight,
	Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function OptimizationSimulatorPR() {
	const [prGenerated, setPrGenerated] = React.useState(false);

	return (
		<div className="space-y-6 font-mono">
			{/* Simulation Comparison Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
						<Sliders className="w-4 h-4" /> Digital Twin Simulation & PR Generator
					</div>
					<h2 className="text-xl font-black text-white">Before vs After Optimization Simulator</h2>
					<p className="text-xs text-slate-400">
						Simulate expected metric impact and generate developer-friendly Pull Request summaries.
					</p>
				</div>
			</div>

			{/* Side-by-Side Before vs After Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
					<span className="text-xs font-bold text-slate-400 uppercase">BEFORE OPTIMIZATION</span>
					<div className="space-y-2 text-xs">
						<div className="flex justify-between border-b border-slate-800 pb-1">
							<span className="text-slate-400">Engineering Health</span>
							<span className="font-bold text-white">94 / 100</span>
						</div>
						<div className="flex justify-between border-b border-slate-800 pb-1">
							<span className="text-slate-400">Technical Debt Score</span>
							<span className="font-bold text-amber-400">68 / 100</span>
						</div>
						<div className="flex justify-between border-b border-slate-800 pb-1">
							<span className="text-slate-400">P99 DB Query Latency</span>
							<span className="font-bold text-rose-400">180ms</span>
						</div>
					</div>
				</div>

				<div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
					<span className="text-xs font-bold text-emerald-400 uppercase">PROPOSED OPTIMIZATION SIMULATION</span>
					<div className="space-y-2 text-xs">
						<div className="flex justify-between border-b border-slate-800 pb-1">
							<span className="text-slate-400">Projected Health</span>
							<span className="font-bold text-emerald-400">97 / 100 (+3.0 pts)</span>
						</div>
						<div className="flex justify-between border-b border-slate-800 pb-1">
							<span className="text-slate-400">Projected Debt Score</span>
							<span className="font-bold text-emerald-400">94 / 100 (+26.0 pts)</span>
						</div>
						<div className="flex justify-between border-b border-slate-800 pb-1">
							<span className="text-slate-400">Projected P99 Query Latency</span>
							<span className="font-bold text-emerald-400">&lt;20ms (-160ms)</span>
						</div>
					</div>
				</div>
			</div>

			{/* AI Pull Request Generator Box */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex items-center justify-between border-b border-slate-800 pb-3">
					<div className="flex items-center gap-2">
						<GitPullRequest className="w-5 h-5 text-purple-400" />
						<h3 className="text-base font-black text-white">AI Pull Request Summary Generator</h3>
					</div>

					<Button
						onClick={() => setPrGenerated(!prGenerated)}
						className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono px-4 py-2 rounded-xl flex items-center gap-2"
					>
						<Sparkles className="w-4 h-4" />
						<span>{prGenerated ? 'Hide Generated PR' : 'Generate AI PR Summary'}</span>
					</Button>
				</div>

				{prGenerated && (
					<div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3 text-xs">
						<h4 className="text-sm font-black text-purple-300">
							PR Title: refactor(db): parameterize raw SQL & leverage composite index on metrics
						</h4>
						<p className="text-slate-300 leading-relaxed">
							<strong>Summary:</strong> This pull request refactors raw SQL string queries in <code className="text-cyan-300">analytics_raw.py</code> to use parameterized SQL bindings. This allows PostgreSQL to leverage the composite (tenant_id, filter) index, eliminating full table scans across 4.2M rows.
						</p>
						<div className="text-emerald-300 font-bold">
							Validation: 94/94 tests passed | Zero TypeScript errors | 98% Model Confidence
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
