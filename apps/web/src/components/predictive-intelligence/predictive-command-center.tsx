'use client';

import * as React from 'react';
import {
	BrainCircuit,
	TrendingUp,
	TrendingDown,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	ShieldCheck,
	Zap,
	Layers,
	Code2,
	Boxes,
	Activity,
	CheckCircle2,
	AlertTriangle,
	Sparkles,
	Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PredictiveDomainCard {
	id: string;
	domainName: string;
	currentStateScore: number;
	projectedScore: number;
	confidenceRating: 'HIGH_CONFIDENCE' | 'MODERATE_CONFIDENCE' | 'LOW_CONFIDENCE' | 'INSUFFICIENT_DATA';
	confidencePercent: number;
	timeHorizon: string; // e.g. "90 Days"
	primaryDriver: string;
	recommendedAction: string;
	icon: React.ComponentType<any>;
	color: string;
}

interface PredictiveCommandCenterProps {
	predictiveHealthIndex: number;
	selectedHorizon: string; // e.g. "90d"
	domains: PredictiveDomainCard[];
	onSelectDomain: (domainId: string) => void;
}

export function PredictiveCommandCenter({
	predictiveHealthIndex,
	selectedHorizon,
	domains,
	onSelectDomain,
}: PredictiveCommandCenterProps) {
	return (
		<div className="space-y-6 font-mono">
			{/* Executive Top Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Card 1: Projected Engineering Health */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Projected Health Index
						</span>
						<div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
							<BrainCircuit className="w-5 h-5 animate-pulse" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="flex items-baseline gap-1">
							<span className="text-4xl font-black text-white">{predictiveHealthIndex}</span>
							<span className="text-xs text-slate-500">/ 100</span>
						</div>
						<div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black">
							STABLE TRAJECTORY
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
						<span>Horizon: <strong className="text-cyan-300">{selectedHorizon.toUpperCase()} Forecast</strong></span>
						<span className="text-emerald-400 font-bold">+2.8 pts projected</span>
					</div>
				</div>

				{/* Card 2: High Confidence Predictions */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Model Confidence
						</span>
						<div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
							<ShieldCheck className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-purple-300">96.4%</div>
						<span className="text-xs text-slate-400 font-bold">Verified Telemetry</span>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						10 Domain Models active with empirical evidence
					</div>
				</div>

				{/* Card 3: Emerging Risk Warnings */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Emerging Risk Warning
						</span>
						<div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
							<AlertTriangle className="w-5 h-5" />
						</div>
					</div>

					<div className="space-y-1 text-xs">
						<div className="text-amber-300 font-bold flex items-center gap-1.5">
							<AlertTriangle className="w-3.5 h-3.5" /> Technical Debt Growth (+14%)
						</div>
						<div className="text-amber-300 font-bold flex items-center gap-1.5">
							<AlertTriangle className="w-3.5 h-3.5" /> Unindexed SQL Query Latency
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-center justify-between">
						<span>Inspect Hotspots</span>
						<span>Inspect →</span>
					</div>
				</div>

				{/* Card 4: Preventive Recommendations */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Preventive Actions
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
							<Sparkles className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-emerald-400">3</div>
						<span className="text-xs text-slate-400 font-bold">Preventive Wins</span>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-300 flex items-center justify-between">
						<span>View Preventive Roadmap</span>
						<span>Inspect →</span>
					</div>
				</div>
			</div>

			{/* 10 Domain Forecast Scorecards Header */}
			<div className="flex items-center justify-between pt-2">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<BrainCircuit className="w-5 h-5 text-cyan-400" /> 10 Predictive Engineering Domain Forecasts
					</h3>
					<p className="text-xs text-slate-400">
						Evidence-backed projections across technical debt, security, performance, architecture, & reliability.
					</p>
				</div>
				<span className="text-xs text-slate-500">Click domain card for deep forecast inspection</span>
			</div>

			{/* 10 Domain Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				{domains.map((dom) => {
					const Icon = dom.icon;
					const isUp = dom.projectedScore > dom.currentStateScore;
					const isDown = dom.projectedScore < dom.currentStateScore;
					const diff = dom.projectedScore - dom.currentStateScore;

					return (
						<button
							key={dom.id}
							onClick={() => onSelectDomain(dom.id)}
							className="text-left p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-xl group relative overflow-hidden flex flex-col justify-between space-y-3"
						>
							<div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: dom.color }} />

							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<div
										className="p-1.5 rounded-lg border flex items-center justify-center"
										style={{
											backgroundColor: `${dom.color}15`,
											borderColor: `${dom.color}40`,
											color: dom.color,
										}}
									>
										<Icon className="w-4 h-4" />
									</div>
									<span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
										{dom.domainName}
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
									<span>{diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}</span>
								</div>
							</div>

							<div className="flex items-baseline justify-between mt-1">
								<div>
									<span className="text-2xl font-black text-white">{dom.projectedScore}</span>
									<span className="text-[10px] text-slate-500"> / 100 (Curr: {dom.currentStateScore})</span>
								</div>
							</div>

							<p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
								Driver: {dom.primaryDriver}
							</p>

							<div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500">
								<span>{dom.confidenceRating.replace(/_/g, ' ')} ({dom.confidencePercent}%)</span>
								<span>{dom.timeHorizon}</span>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
