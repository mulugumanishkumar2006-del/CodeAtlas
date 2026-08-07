'use client';

import * as React from 'react';
import {
	Flame,
	TrendingUp,
	TrendingDown,
	AlertOctagon,
	AlertTriangle,
	Sparkles,
	Layers,
	Code2,
	CheckSquare,
	BookOpen,
	ShieldAlert,
	Server,
	Activity,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	Clock,
	DollarSign,
	ExternalLink,
	CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DebtCategoryItem {
	id: string;
	name: string;
	score: number; // 0..100 debt level (higher = more debt)
	count: number;
	estimatedHours: number;
	monthlyCost: number;
	trend: 'up' | 'down' | 'stable';
	delta: number;
	icon: React.ComponentType<any>;
	color: string;
	description: string;
}

interface TechDebtCommandCenterProps {
	overallDebtScore: number;
	debtGrowthRate: number; // e.g. +1.2
	debtReductionRate: number; // e.g. -3.4
	criticalDebtCount: number;
	highImpactCount: number;
	quickWinsCount: number;
	categories: DebtCategoryItem[];
	onSelectCategory: (categoryId: string) => void;
	onNavigateToEvidence?: (target: string) => void;
}

export function TechDebtCommandCenter({
	overallDebtScore,
	debtGrowthRate,
	debtReductionRate,
	criticalDebtCount,
	highImpactCount,
	quickWinsCount,
	categories,
	onSelectCategory,
	onNavigateToEvidence,
}: TechDebtCommandCenterProps) {
	return (
		<div className="space-y-6 font-mono">
			{/* Command Center Summary Scorecards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Card 1: Overall Debt Score */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Overall Debt Index
						</span>
						<div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
							<Flame className="w-5 h-5 animate-pulse" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="flex items-baseline gap-1">
							<span className="text-4xl font-black text-white">{overallDebtScore}</span>
							<span className="text-xs text-slate-500">/ 100</span>
						</div>
						<div className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-black">
							MODERATE DEBT
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
						<span>345 Total Debt Hours</span>
						<span className="text-amber-400 font-bold">$14,200/mo cost</span>
					</div>
				</div>

				{/* Card 2: Debt Growth Rate */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Weekly Debt Growth
						</span>
						<div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
							<TrendingUp className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-rose-400">+{debtGrowthRate}%</div>
						<div className="flex items-center gap-1 text-xs text-rose-400 font-bold">
							<ArrowUpRight className="w-4 h-4" /> +12 hrs/wk
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						Driven by unrefactored PR additions
					</div>
				</div>

				{/* Card 3: Debt Reduction Rate */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Debt Reduction Pace
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
							<TrendingDown className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-emerald-400">{debtReductionRate}%</div>
						<div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
							<ArrowDownRight className="w-4 h-4" /> -28 hrs refactored
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						Net progress: <strong className="text-emerald-400">Pacing ahead</strong>
					</div>
				</div>

				{/* Card 4: Actionable Debt Hotspots */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Actionable Items
						</span>
						<div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
							<Sparkles className="w-5 h-5" />
						</div>
					</div>

					<div className="grid grid-cols-3 gap-2 text-center">
						<div className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/30">
							<div className="text-lg font-black text-rose-300">{criticalDebtCount}</div>
							<div className="text-[9px] text-slate-400 font-bold">Critical</div>
						</div>
						<div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30">
							<div className="text-lg font-black text-amber-300">{highImpactCount}</div>
							<div className="text-[9px] text-slate-400 font-bold">High Impact</div>
						</div>
						<div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
							<div className="text-lg font-black text-emerald-300">{quickWinsCount}</div>
							<div className="text-[9px] text-slate-400 font-bold">Quick Wins</div>
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-400 flex items-center justify-between">
						<span>Ready for remediation</span>
						<span>Inspect →</span>
					</div>
				</div>
			</div>

			{/* 7 Core Debt Categories Header */}
			<div className="flex items-center justify-between pt-2">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<Layers className="w-5 h-5 text-cyan-400" /> Technical Debt Breakdown by Layer
					</h3>
					<p className="text-xs text-slate-400">
						Categorized debt metrics continuously calculated across architectural and code surfaces.
					</p>
				</div>
				<span className="text-xs text-slate-500">Click category for interactive heatmap zoom</span>
			</div>

			{/* 7 Core Debt Category Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{categories.map((cat) => {
					const Icon = cat.icon;
					const isUp = cat.trend === 'up';
					const isDown = cat.trend === 'down';

					return (
						<button
							key={cat.id}
							onClick={() => onSelectCategory(cat.id)}
							className="text-left p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-xl group relative overflow-hidden"
						>
							<div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cat.color }} />

							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2.5">
									<div
										className="p-2 rounded-xl border flex items-center justify-center"
										style={{
											backgroundColor: `${cat.color}15`,
											borderColor: `${cat.color}40`,
											color: cat.color,
										}}
									>
										<Icon className="w-4 h-4" />
									</div>
									<div>
										<span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
											{cat.name}
										</span>
										<span className="text-[10px] text-slate-500 font-mono">
											{cat.count} debt issues
										</span>
									</div>
								</div>

								{/* Trend badge */}
								<div
									className={cn(
										'flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md border',
										isUp && 'bg-rose-950/60 border-rose-500/40 text-rose-400',
										isDown && 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400',
										!isUp && !isDown && 'bg-slate-950/60 border-slate-800 text-slate-400'
									)}
								>
									{isUp && <ArrowUpRight className="w-3 h-3" />}
									{isDown && <ArrowDownRight className="w-3 h-3" />}
									{!isUp && !isDown && <Minus className="w-3 h-3" />}
									<span>{cat.delta > 0 ? `+${cat.delta}` : cat.delta}%</span>
								</div>
							</div>

							{/* Score & Hours */}
							<div className="flex items-baseline justify-between mt-4">
								<div>
									<span className="text-3xl font-black text-white">{cat.score}</span>
									<span className="text-[10px] text-slate-500"> / 100 debt index</span>
								</div>
								<span className="text-xs font-bold text-amber-400">{cat.estimatedHours} hrs</span>
							</div>

							{/* Description & Navigation */}
							<p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-tight">
								{cat.description}
							</p>

							<div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-cyan-400 font-bold flex items-center justify-between">
								<span>Monthly Friction: ${cat.monthlyCost}/mo</span>
								<span className="group-hover:underline">Explore Heatmap →</span>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
