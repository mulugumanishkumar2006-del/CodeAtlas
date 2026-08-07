'use client';

import * as React from 'react';
import {
	Gauge,
	Layers,
	Code2,
	TrendingUp,
	ShieldCheck,
	Zap,
	Activity,
	FileText,
	Boxes,
	Cpu,
	CheckCircle2,
	AlertTriangle,
	Sparkles,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	Server,
	Globe,
	Eye,
	GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface ScoreDimension {
	id: string;
	name: string;
	score: number; // 0..100
	weightPercent: number; // Context-aware weighting (e.g. 12% for Security in payment service)
	status: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';
	trend: 'up' | 'down' | 'stable';
	delta: number;
	href: string;
	icon: React.ComponentType<any>;
	color: string;
	description: string;
}

interface ScoreCommandCenterProps {
	overallScore: number;
	confidencePercent: number;
	contextType: string; // e.g. "Observed Production Payment Microservice"
	dimensions: ScoreDimension[];
	onSelectDimension: (dimensionId: string) => void;
}

export function ScoreCommandCenter({
	overallScore,
	confidencePercent,
	contextType,
	dimensions,
	onSelectDimension,
}: ScoreCommandCenterProps) {
	return (
		<div className="space-y-6 font-mono">
			{/* Top Executive Summary Header Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Card 1: Overall Engineering Health Score */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Engineering Health Score
						</span>
						<div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
							<Gauge className="w-5 h-5 animate-pulse" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="flex items-baseline gap-1">
							<span className="text-4xl font-black text-white">{overallScore}</span>
							<span className="text-xs text-slate-500">/ 100</span>
						</div>
						<div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black">
							EXCELLENT ARCHITECTURE
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
						<span>Confidence: <strong className="text-cyan-300">{confidencePercent}% Verified</strong></span>
						<span className="text-emerald-400 font-bold">+4.2% vs last release</span>
					</div>
				</div>

				{/* Card 2: Repository Context Classifier */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Repository Context
						</span>
						<div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
							<Server className="w-5 h-5" />
						</div>
					</div>

					<div className="space-y-1">
						<span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold block w-fit">
							OBSERVED TELEMETRY
						</span>
						<div className="text-sm font-black text-white line-clamp-1">{contextType}</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						Context-aware weighting applied to 15 dimensions
					</div>
				</div>

				{/* Card 3: Top System Strengths */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Key Strengths
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
							<ShieldCheck className="w-5 h-5" />
						</div>
					</div>

					<div className="space-y-1 text-xs">
						<div className="text-emerald-400 font-bold flex items-center gap-1.5">
							<CheckCircle2 className="w-3.5 h-3.5" /> Security Posture (94/100)
						</div>
						<div className="text-emerald-400 font-bold flex items-center gap-1.5">
							<CheckCircle2 className="w-3.5 h-3.5" /> Architecture Health (92/100)
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						Zero critical zero-day vulnerabilities
					</div>
				</div>

				{/* Card 4: Highest-Impact Risks */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Highest-Impact Risks
						</span>
						<div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
							<Sparkles className="w-5 h-5" />
						</div>
					</div>

					<div className="space-y-1 text-xs">
						<div className="text-amber-300 font-bold flex items-center gap-1.5">
							<AlertTriangle className="w-3.5 h-3.5" /> Technical Debt (68/100)
						</div>
						<div className="text-amber-300 font-bold flex items-center gap-1.5">
							<AlertTriangle className="w-3.5 h-3.5" /> Unindexed SQL Query (-5.2 pts)
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-center justify-between">
						<span>Simulate Fix Impact</span>
						<span>Inspect →</span>
					</div>
				</div>
			</div>

			{/* 15 Multidimensional Scorecards Header */}
			<div className="flex items-center justify-between pt-2">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<Gauge className="w-5 h-5 text-cyan-400" /> 15 Engineering Score Dimensions
					</h3>
					<p className="text-xs text-slate-400">
						Multidimensional intelligence synthesized across code, architecture, security, performance, & technical debt.
					</p>
				</div>
				<span className="text-xs text-slate-500">Click dimension for deep intelligence center navigation</span>
			</div>

			{/* 15 Dimension Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
				{dimensions.map((dim) => {
					const Icon = dim.icon;
					const isUp = dim.trend === 'up';
					const isDown = dim.trend === 'down';

					return (
						<Link
							key={dim.id}
							href={dim.href}
							className="text-left p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-xl group relative overflow-hidden flex flex-col justify-between space-y-3"
						>
							<div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: dim.color }} />

							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<div
										className="p-1.5 rounded-lg border flex items-center justify-center"
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
										'flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border',
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

							<div className="flex items-baseline justify-between">
								<div>
									<span className="text-2xl font-black text-white">{dim.score}</span>
									<span className="text-[10px] text-slate-500"> / 100</span>
								</div>
								<span className="text-[10px] text-slate-400 font-mono">Weight: {dim.weightPercent}%</span>
							</div>

							<p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
								{dim.description}
							</p>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
