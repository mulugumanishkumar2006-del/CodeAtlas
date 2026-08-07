'use client';

import * as React from 'react';
import {
	CheckCircle2,
	AlertCircle,
	Sparkles,
	TrendingUp,
	TrendingDown,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	Code2,
	Layers,
	Copy,
	FileText,
	ShieldCheck,
	Activity,
	Zap,
	FileCode,
	GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QualityMetricDimension {
	id: string;
	name: string;
	score: number; // 0..100 index
	status: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';
	trend: 'up' | 'down' | 'stable';
	delta: number;
	icon: React.ComponentType<any>;
	color: string;
	description: string;
}

interface QualityCommandCenterProps {
	overallQualityScore: number;
	maintainabilityIndex: number;
	duplicationRatePercent: number;
	testCoveragePercent: number;
	architectureAlignmentPercent: number;
	dimensions: QualityMetricDimension[];
	onSelectDimension: (dimensionId: string) => void;
}

export function QualityCommandCenter({
	overallQualityScore,
	maintainabilityIndex,
	duplicationRatePercent,
	testCoveragePercent,
	architectureAlignmentPercent,
	dimensions,
	onSelectDimension,
}: QualityCommandCenterProps) {
	return (
		<div className="space-y-6 font-mono">
			{/* Top Executive Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Card 1: Overall Quality Score */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Code Quality Index
						</span>
						<div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
							<CheckCircle2 className="w-5 h-5 animate-pulse" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="flex items-baseline gap-1">
							<span className="text-4xl font-black text-white">{overallQualityScore}</span>
							<span className="text-xs text-slate-500">/ 100</span>
						</div>
						<div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black">
							EXCELLENT ARCHITECTURE
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
						<span>Maintainability: <strong className="text-cyan-300">{maintainabilityIndex} / 100</strong></span>
						<span className="text-emerald-400 font-bold">+3.8% vs last release</span>
					</div>
				</div>

				{/* Card 2: Duplication & Testability */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Duplication & Coverage
						</span>
						<div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
							<Copy className="w-5 h-5" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2 text-center">
						<div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30">
							<div className="text-xl font-black text-purple-300">{duplicationRatePercent}%</div>
							<div className="text-[9px] text-slate-400 font-bold uppercase">Duplication</div>
						</div>
						<div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
							<div className="text-xl font-black text-emerald-300">{testCoveragePercent}%</div>
							<div className="text-[9px] text-slate-400 font-bold uppercase">Test Coverage</div>
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						Zero critical testability gaps in core domain
					</div>
				</div>

				{/* Card 3: Architecture Alignment */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Architecture Alignment
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
							<Layers className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-emerald-400">{architectureAlignmentPercent}%</div>
						<div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
							<ArrowUpRight className="w-4 h-4" /> Zero Drift
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						100% strict layer boundary compliance
					</div>
				</div>

				{/* Card 4: AI Refactoring Opportunities */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							AI Refactoring Wins
						</span>
						<div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
							<Sparkles className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-amber-300">5</div>
						<span className="text-xs text-slate-400 font-bold">Quick Wins Ready</span>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-center justify-between">
						<span>Simulate Refactoring</span>
						<span>Inspect →</span>
					</div>
				</div>
			</div>

			{/* 14 Quality Dimensions Header */}
			<div className="flex items-center justify-between pt-2">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<Code2 className="w-5 h-5 text-cyan-400" /> 14 Code Quality Dimensions
					</h3>
					<p className="text-xs text-slate-400">
						Deep structural intelligence across maintainability, complexity, testability, duplication, & architecture.
					</p>
				</div>
				<span className="text-xs text-slate-500">Click dimension for interactive quality map focus</span>
			</div>

			{/* 14 Dimension Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{dimensions.map((dim) => {
					const Icon = dim.icon;
					const isUp = dim.trend === 'up';
					const isDown = dim.trend === 'down';

					return (
						<button
							key={dim.id}
							onClick={() => onSelectDimension(dim.id)}
							className="text-left p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-xl group relative overflow-hidden flex flex-col justify-between space-y-3"
						>
							<div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: dim.color }} />

							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2.5">
									<div
										className="p-2 rounded-xl border flex items-center justify-center"
										style={{
											backgroundColor: `${dim.color}15`,
											borderColor: `${dim.color}40`,
											color: dim.color,
										}}
									>
										<Icon className="w-4 h-4" />
									</div>
									<span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
										{dim.name}
									</span>
								</div>

								<div
									className={cn(
										'flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded border',
										isUp && 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400',
										isDown && 'bg-rose-950/60 border-rose-500/40 text-rose-400',
										!isUp && !isDown && 'bg-slate-950/60 border-slate-800 text-slate-400'
									)}
								>
									{isUp && <ArrowUpRight className="w-3 h-3" />}
									{isDown && <ArrowDownRight className="w-3 h-3" />}
									{!isUp && !isDown && <Minus className="w-3 h-3" />}
									<span>{dim.delta > 0 ? `+${dim.delta}` : dim.delta}%</span>
								</div>
							</div>

							<div className="flex items-baseline justify-between mt-2">
								<div>
									<span className="text-3xl font-black text-white">{dim.score}</span>
									<span className="text-xs text-slate-400 font-bold ml-1">/ 100</span>
								</div>
								<span
									className={cn(
										'text-[10px] font-bold px-2 py-0.5 rounded border',
										dim.score >= 90 ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
									)}
								>
									{dim.status}
								</span>
							</div>

							<p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
								{dim.description}
							</p>
						</button>
					);
				})}
			</div>
		</div>
	);
}
