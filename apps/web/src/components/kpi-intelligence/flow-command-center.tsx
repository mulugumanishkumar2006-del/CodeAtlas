'use client';

import * as React from 'react';
import {
	Activity,
	GitPullRequest,
	Clock,
	Rocket,
	ShieldCheck,
	Zap,
	TrendingUp,
	TrendingDown,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	CheckCircle2,
	AlertTriangle,
	Sparkles,
	GitCommit,
	Gauge,
	RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FlowKPIMetric {
	id: string;
	name: string;
	value: string;
	unit: string;
	status: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';
	trend: 'up' | 'down' | 'stable';
	delta: number;
	icon: React.ComponentType<any>;
	color: string;
	description: string;
}

interface FlowCommandCenterProps {
	deliveryHealthScore: number;
	leadTimeHours: number;
	cycleTimeHours: number;
	prThroughputCount: number;
	changeFailureRatePercent: number;
	metrics: FlowKPIMetric[];
	onSelectMetric: (metricId: string) => void;
}

export function FlowCommandCenter({
	deliveryHealthScore,
	leadTimeHours,
	cycleTimeHours,
	prThroughputCount,
	changeFailureRatePercent,
	metrics,
	onSelectMetric,
}: FlowCommandCenterProps) {
	return (
		<div className="space-y-6 font-mono">
			{/* Top Executive Summary Header Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Card 1: Delivery Health Score */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Delivery Health Index
						</span>
						<div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
							<Activity className="w-5 h-5 animate-pulse" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="flex items-baseline gap-1">
							<span className="text-4xl font-black text-white">{deliveryHealthScore}</span>
							<span className="text-xs text-slate-500">/ 100</span>
						</div>
						<div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black">
							OPTIMAL FLOW
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
						<span>Lead Time: <strong className="text-cyan-300">{leadTimeHours} hrs avg</strong></span>
						<span className="text-emerald-400 font-bold">+5.1% vs last month</span>
					</div>
				</div>

				{/* Card 2: Cycle Time & PR Throughput */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							PR Throughput & Cycle Time
						</span>
						<div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
							<GitPullRequest className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-purple-300">{prThroughputCount}</div>
						<div className="text-xs font-bold text-slate-400">PRs merged / mo</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						Cycle Time: <strong className="text-white">{cycleTimeHours} hrs</strong> (PR → Merge)
					</div>
				</div>

				{/* Card 3: Change Failure & Rollback Rate */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Change Reliability
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
							<ShieldCheck className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-emerald-400">{changeFailureRatePercent}%</div>
						<div className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
							<CheckCircle2 className="w-3.5 h-3.5" /> High Stability
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						Rollback Rate: <strong className="text-emerald-300">0.0% past 30 days</strong>
					</div>
				</div>

				{/* Card 4: AI Flow Bottlenecks */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Flow Bottlenecks
						</span>
						<div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
							<Sparkles className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-amber-300">1</div>
						<span className="text-xs text-slate-400 font-bold">Review Wait Time</span>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-center justify-between">
						<span>Inspect Flow Map</span>
						<span>Inspect →</span>
					</div>
				</div>
			</div>

			{/* 16 Flow Telemetry Cards Header */}
			<div className="flex items-center justify-between pt-2">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<Activity className="w-5 h-5 text-cyan-400" /> 16 Engineering Flow Telemetry Metrics
					</h3>
					<p className="text-xs text-slate-400">
						System-level delivery flow metrics connecting commits, pull requests, builds, deployments, & incidents.
					</p>
				</div>
				<span className="text-xs text-slate-500">Click metric for flow bottleneck drill-down</span>
			</div>

			{/* 16 Metric Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{metrics.map((m) => {
					const Icon = m.icon;
					const isUp = m.trend === 'up';
					const isDown = m.trend === 'down';

					return (
						<button
							key={m.id}
							onClick={() => onSelectMetric(m.id)}
							className="text-left p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-xl group relative overflow-hidden flex flex-col justify-between space-y-3"
						>
							<div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: m.color }} />

							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<div
										className="p-1.5 rounded-lg border flex items-center justify-center"
										style={{
											backgroundColor: `${m.color}15`,
											borderColor: `${m.color}40`,
											color: m.color,
										}}
									>
										<Icon className="w-4 h-4" />
									</div>
									<span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
										{m.name}
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
									<span>{m.delta > 0 ? `+${m.delta}` : m.delta}%</span>
								</div>
							</div>

							<div className="flex items-baseline justify-between mt-1">
								<div>
									<span className="text-2xl font-black text-white">{m.value}</span>
									<span className="text-xs text-slate-400 font-bold ml-1">{m.unit}</span>
								</div>
								<span className="text-[10px] text-slate-500 font-mono">{m.status}</span>
							</div>

							<p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
								{m.description}
							</p>
						</button>
					);
				})}
			</div>
		</div>
	);
}
