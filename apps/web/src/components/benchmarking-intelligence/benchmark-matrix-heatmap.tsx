'use client';

import * as React from 'react';
import {
	Layers,
	ShieldCheck,
	Zap,
	Code2,
	TrendingUp,
	Activity,
	FileText,
	Boxes,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface MatrixDimensionRow {
	id: string;
	dimensionName: string;
	currentScore: number;
	benchmarkScore: number;
	difference: number;
	href: string;
	icon: React.ComponentType<any>;
	aiExplanation: string;
}

const SAMPLE_MATRIX_ROWS: MatrixDimensionRow[] = [
	{
		id: 'row-arch',
		dimensionName: 'Architecture Health',
		currentScore: 92,
		benchmarkScore: 84,
		difference: 8,
		href: '/architecture',
		icon: Layers,
		aiExplanation: 'Stronger module boundary enforcement and zero circular import cycles.',
	},
	{
		id: 'row-sec',
		dimensionName: 'Security Posture',
		currentScore: 94,
		benchmarkScore: 87,
		difference: 7,
		href: '/security',
		icon: ShieldCheck,
		aiExplanation: 'Zero-trust JWT verification and active secret rotation guard.',
	},
	{
		id: 'row-perf',
		dimensionName: 'Performance Index',
		currentScore: 74,
		benchmarkScore: 82,
		difference: -8,
		href: '/performance',
		icon: Zap,
		aiExplanation: 'Performance is below benchmark primarily due to unindexed raw SQL query in analytics_raw.py.',
	},
	{
		id: 'row-quality',
		dimensionName: 'Code Quality',
		currentScore: 79,
		benchmarkScore: 81,
		difference: -2,
		href: '/code-quality',
		icon: Code2,
		aiExplanation: 'Duplication in payment processor module slightly reduces quality index.',
	},
	{
		id: 'row-debt',
		dimensionName: 'Technical Debt',
		currentScore: 68,
		benchmarkScore: 76,
		difference: -8,
		href: '/tech-debt',
		icon: TrendingUp,
		aiExplanation: 'Accumulated payment module coupling requires refactoring.',
	},
];

export function BenchmarkMatrixHeatmap() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<Layers className="w-4 h-4" /> Multidimensional Comparison Matrix
					</div>
					<h2 className="text-xl font-black text-white">Interactive Benchmark Matrix</h2>
					<p className="text-xs text-slate-400">
						Click any score variance pill to drill directly into deep CodeAtlas intelligence centers.
					</p>
				</div>
			</div>

			{/* Comparison Table */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs font-mono">
						<thead>
							<tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
								<th className="pb-3 font-bold">Dimension</th>
								<th className="pb-3 font-bold text-center">Current</th>
								<th className="pb-3 font-bold text-center">Benchmark</th>
								<th className="pb-3 font-bold text-center">Difference</th>
								<th className="pb-3 font-bold">AI Rationale</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800/80">
							{SAMPLE_MATRIX_ROWS.map((row) => {
								const Icon = row.icon;
								const isPositive = row.difference > 0;
								const isNegative = row.difference < 0;

								return (
									<tr key={row.id} className="hover:bg-slate-950/60 transition-colors group">
										<td className="py-4 font-bold text-white flex items-center gap-2">
											<Icon className="w-4 h-4 text-cyan-400" />
											<span>{row.dimensionName}</span>
										</td>
										<td className="py-4 text-center font-black text-white text-sm">{row.currentScore}</td>
										<td className="py-4 text-center text-slate-400 text-sm">{row.benchmarkScore}</td>
										<td className="py-4 text-center">
											<Link
												href={row.href}
												className={cn(
													'inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black border transition-all hover:scale-105',
													isPositive && 'bg-emerald-950 border-emerald-500/40 text-emerald-300',
													isNegative && 'bg-rose-950 border-rose-500/40 text-rose-300',
													!isPositive && !isNegative && 'bg-slate-950 border-slate-800 text-slate-400'
												)}
											>
												{isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
												{isNegative && <ArrowDownRight className="w-3.5 h-3.5" />}
												<span>{isPositive ? `+${row.difference}` : row.difference}</span>
												<ExternalLink className="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100" />
											</Link>
										</td>
										<td className="py-4 text-slate-300 leading-relaxed max-w-md">{row.aiExplanation}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
