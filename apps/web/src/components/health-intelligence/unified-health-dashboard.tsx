'use client';

import * as React from 'react';
import {
	Layers,
	Flame,
	HeartPulse,
	Brain,
	BookOpen,
	Zap,
	Shield,
	Code2,
	TrendingUp,
	Wrench,
	CheckCircle,
	AlertTriangle,
	Sparkles,
	Activity,
	GitBranch,
	ShieldAlert,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	Gauge,
	FileCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HealthDimension {
	id: string;
	name: string;
	score: number;
	weight: number; // 0..1
	grade: string;
	trend: 'up' | 'down' | 'stable';
	trendDelta: number;
	icon: React.ComponentType<any>;
	color: string;
	explanation: string;
	source: string;
	keyMetric: string;
}

interface UnifiedHealthDashboardProps {
	overallScore: number;
	grade: string;
	status: string;
	statusColor: string;
	headline: string;
	narrative: string;
	dimensions: HealthDimension[];
	onSelectDimension?: (dimensionId: string) => void;
	whatIsHealthy: string[];
	whatNeedsAttention: string[];
}

export function UnifiedHealthDashboard({
	overallScore,
	grade,
	status,
	statusColor,
	headline,
	narrative,
	dimensions,
	onSelectDimension,
	whatIsHealthy,
	whatNeedsAttention,
}: UnifiedHealthDashboardProps) {
	// Calculate SVG circle progress for main gauge
	const radius = 80;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (overallScore / 100) * circumference;

	return (
		<div className="space-y-6 font-mono">
			{/* Hero Banner with Animated Speedometer Gauge & Executive Narrative */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
				<div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

				{/* Gauge Radial Card */}
				<div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-inner relative">
					<div className="relative flex items-center justify-center">
						<svg className="w-56 h-56 transform -rotate-90">
							{/* Background Track */}
							<circle
								cx="112"
								cy="112"
								r={radius}
								className="stroke-slate-800"
								strokeWidth="14"
								fill="transparent"
							/>
							{/* Glowing Gradient Progress */}
							<circle
								cx="112"
								cy="112"
								r={radius}
								stroke={statusColor}
								strokeWidth="14"
								strokeDasharray={circumference}
								strokeDashoffset={strokeDashoffset}
								strokeLinecap="round"
								fill="transparent"
								className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]"
							/>
						</svg>

						{/* Center Numeric Score */}
						<div className="absolute flex flex-col items-center justify-center text-center">
							<span className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
								{overallScore}
							</span>
							<span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
								Score / 100
							</span>
							<div className="flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800">
								<span
									className="w-2 h-2 rounded-full animate-pulse"
									style={{ backgroundColor: statusColor }}
								/>
								<span className="text-xs font-bold text-white">{status}</span>
							</div>
						</div>
					</div>

					{/* Grade & Delta Badges */}
					<div className="flex items-center justify-between w-full mt-6 pt-4 border-t border-slate-800/80 text-xs">
						<div className="flex items-center gap-2">
							<span className="text-slate-400">Overall Grade:</span>
							<span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-black text-sm">
								{grade}
							</span>
						</div>
						<div className="flex items-center gap-1.5 text-emerald-400 font-bold">
							<ArrowUpRight className="w-4 h-4" />
							<span>+3.2% vs last release</span>
						</div>
					</div>
				</div>

				{/* Executive AI Summary Narrative */}
				<div className="lg:col-span-7 flex flex-col justify-between space-y-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
							<Sparkles className="w-4 h-4" /> AI CTO Health Diagnosis
						</div>
						<h2 className="text-xl font-black text-white leading-tight">{headline}</h2>
						<p className="text-xs text-slate-300 leading-relaxed mt-2 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
							{narrative}
						</p>
					</div>

					{/* Strengths vs Attention Needed */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
						{/* Strongest */}
						<div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
							<div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
								<CheckCircle className="w-4 h-4" /> Strongest Dimensions
							</div>
							<ul className="space-y-1 text-xs text-slate-300">
								{whatIsHealthy.map((item, idx) => (
									<li key={idx} className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						{/* Needs Attention */}
						<div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20">
							<div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
								<AlertTriangle className="w-4 h-4" /> Needs Immediate Focus
							</div>
							<ul className="space-y-1 text-xs text-slate-300">
								{whatNeedsAttention.map((item, idx) => (
									<li key={idx} className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* 14 Scorecards Grid Header */}
			<div className="flex items-center justify-between pt-4">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<Gauge className="w-5 h-5 text-cyan-400" /> Health Dimension Scorecards
					</h3>
					<p className="text-xs text-slate-400">
						14 core sub-scores continuously calculated from underlying code analysis sub-engines.
					</p>
				</div>
				<span className="text-xs text-slate-500">Click card for deep-dive issue filtering</span>
			</div>

			{/* Scorecards 14 Dimensions Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{dimensions.map((dim) => {
					const Icon = dim.icon;
					const isUp = dim.trend === 'up';
					const isDown = dim.trend === 'down';

					return (
						<button
							key={dim.id}
							onClick={() => onSelectDimension && onSelectDimension(dim.id)}
							className="text-left p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-lg group relative overflow-hidden"
						>
							<div
								className="absolute top-0 left-0 right-0 h-1"
								style={{ backgroundColor: dim.color }}
							/>

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
									<div>
										<span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
											{dim.name}
										</span>
										<span className="text-[10px] text-slate-500 font-mono">
											{dim.source}
										</span>
									</div>
								</div>

								<div className="flex items-center gap-1.5">
									<span className="px-2 py-0.5 text-xs font-black rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
										{dim.grade}
									</span>
								</div>
							</div>

							{/* Score & Key Metric */}
							<div className="flex items-baseline justify-between mt-4">
								<div className="flex items-baseline gap-2">
									<span className="text-3xl font-black text-white">{dim.score}</span>
									<span className="text-[10px] text-slate-500">/ 100</span>
								</div>

								{/* Trend indicator */}
								<div
									className={cn(
										'flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md border',
										isUp && 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400',
										isDown && 'bg-rose-950/60 border-rose-500/40 text-rose-400',
										!isUp && !isDown && 'bg-slate-950/60 border-slate-800 text-slate-400'
									)}
								>
									{isUp && <ArrowUpRight className="w-3.5 h-3.5" />}
									{isDown && <ArrowDownRight className="w-3.5 h-3.5" />}
									{!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
									<span>
										{dim.trendDelta > 0 ? `+${dim.trendDelta}` : dim.trendDelta}%
									</span>
								</div>
							</div>

							{/* Key Metric Label */}
							<div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
								<span>Metric: <strong className="text-slate-200">{dim.keyMetric}</strong></span>
								<span className="text-[10px] text-cyan-400 group-hover:underline">Inspect →</span>
							</div>

							{/* One sentence explanation */}
							<p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-tight">
								{dim.explanation}
							</p>
						</button>
					);
				})}
			</div>
		</div>
	);
}
