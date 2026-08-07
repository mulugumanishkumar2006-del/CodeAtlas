'use client';

import * as React from 'react';
import {
	Bot,
	Sparkles,
	ShieldCheck,
	Zap,
	Layers,
	Code2,
	Boxes,
	Activity,
	CheckCircle2,
	AlertTriangle,
	Sliders,
	ArrowUpRight,
	Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AutonomyLevelInfo {
	levelNumber: number; // 0..5
	levelName: string;
	description: string;
}

export const AUTONOMY_LEVELS: AutonomyLevelInfo[] = [
	{ levelNumber: 0, levelName: 'LEVEL 0 — OBSERVE', description: 'Only identify opportunities. No code changes.' },
	{ levelNumber: 1, levelName: 'LEVEL 1 — RECOMMEND', description: 'Generate recommendations. No code modifications.' },
	{ levelNumber: 2, levelName: 'LEVEL 2 — PLAN', description: 'Generate detailed implementation plans. No code modifications.' },
	{ levelNumber: 3, levelName: 'LEVEL 3 — PREPARE', description: 'Generate proposed patches in isolated workspace. Developer review required.' },
	{ levelNumber: 4, levelName: 'LEVEL 4 — VALIDATE', description: 'Run automated validation against proposed changes. Developer approval required.' },
	{ levelNumber: 5, levelName: 'LEVEL 5 — CONTROLLED AUTONOMY', description: 'Allow explicitly approved low-risk optimizations to be applied automatically.' },
];

export interface OptimizationCategoryCard {
	id: string;
	categoryName: string;
	opportunitiesCount: number;
	potentialHealthGain: number; // e.g. +8.2 pts
	effort: 'LOW' | 'MEDIUM' | 'HIGH';
	risk: 'LOW' | 'MEDIUM' | 'HIGH';
	confidencePercent: number;
	icon: React.ComponentType<any>;
	color: string;
}

interface OptimizationCommandCenterProps {
	activeAutonomyLevel: number;
	onSelectAutonomyLevel: (level: number) => void;
	categories: OptimizationCategoryCard[];
	onSelectCategory: (categoryId: string) => void;
}

export function OptimizationCommandCenter({
	activeAutonomyLevel,
	onSelectAutonomyLevel,
	categories,
	onSelectCategory,
}: OptimizationCommandCenterProps) {
	const currentLevelObj = AUTONOMY_LEVELS.find((l) => l.levelNumber === activeAutonomyLevel) || AUTONOMY_LEVELS[3];

	return (
		<div className="space-y-6 font-mono">
			{/* Top Autonomy Selector Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
							<Bot className="w-4 h-4" /> Controlled Autonomy Configuration
						</div>
						<h2 className="text-xl font-black text-white">{currentLevelObj.levelName}</h2>
						<p className="text-xs text-slate-400 mt-1">{currentLevelObj.description}</p>
					</div>

					<div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
						{AUTONOMY_LEVELS.map((lvl) => (
							<button
								key={lvl.levelNumber}
								onClick={() => onSelectAutonomyLevel(lvl.levelNumber)}
								className={cn(
									'px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap',
									lvl.levelNumber === activeAutonomyLevel
										? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border border-cyan-400/40 shadow-lg shadow-cyan-950'
										: 'text-slate-400 hover:text-white'
								)}
							>
								L{lvl.levelNumber}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* 10 Optimization Category Cards Header */}
			<div className="flex items-center justify-between pt-2">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<Sparkles className="w-5 h-5 text-cyan-400" /> 10 Autonomous Optimization Categories
					</h3>
					<p className="text-xs text-slate-400">
						Continuous automated discovery across architecture, quality, tech debt, security, performance, & testing.
					</p>
				</div>
				<span className="text-xs text-slate-500">Click category for prioritized queue drill-down</span>
			</div>

			{/* 10 Category Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				{categories.map((cat) => {
					const Icon = cat.icon;

					return (
						<button
							key={cat.id}
							onClick={() => onSelectCategory(cat.id)}
							className="text-left p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-xl group relative overflow-hidden flex flex-col justify-between space-y-3"
						>
							<div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cat.color }} />

							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<div
										className="p-1.5 rounded-lg border flex items-center justify-center"
										style={{
											backgroundColor: `${cat.color}15`,
											borderColor: `${cat.color}40`,
											color: cat.color,
										}}
									>
										<Icon className="w-4 h-4" />
									</div>
									<span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
										{cat.categoryName}
									</span>
								</div>

								<span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-cyan-300">
									{cat.opportunitiesCount} Opts
								</span>
							</div>

							<div className="flex items-baseline justify-between mt-1">
								<div>
									<span className="text-xl font-black text-emerald-400">+{cat.potentialHealthGain}</span>
									<span className="text-[10px] text-slate-500"> pts gain</span>
								</div>
								<span className="text-[10px] text-purple-300 font-bold">{cat.confidencePercent}% Conf</span>
							</div>

							<div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500">
								<span>Effort: {cat.effort}</span>
								<span>Risk: {cat.risk}</span>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
