'use client';

import * as React from 'react';
import {
	Zap,
	Activity,
	Clock,
	Cpu,
	Database,
	Server,
	Globe,
	Layers,
	TrendingUp,
	TrendingDown,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	Sparkles,
	AlertTriangle,
	CheckCircle,
	Gauge,
	HardDrive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PerformanceMetricItem {
	id: string;
	name: string;
	value: string;
	unit: string;
	score: number; // 0..100 performance index
	status: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';
	trend: 'up' | 'down' | 'stable';
	delta: number;
	icon: React.ComponentType<any>;
	color: string;
	description: string;
}

interface PerformanceCommandCenterProps {
	overallPerformanceScore: number;
	p99LatencyMs: number;
	throughputRps: number;
	errorRatePercent: number;
	availabilityPercent: number;
	metrics: PerformanceMetricItem[];
	onSelectMetric: (metricId: string) => void;
}

export function PerformanceCommandCenter({
	overallPerformanceScore,
	p99LatencyMs,
	throughputRps,
	errorRatePercent,
	availabilityPercent,
	metrics,
	onSelectMetric,
}: PerformanceCommandCenterProps) {
	return (
		<div className="space-y-6 font-mono">
			{/* Top Executive Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Card 1: Overall Performance Score */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Performance Index
						</span>
						<div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
							<Zap className="w-5 h-5 animate-pulse fill-orange-400" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="flex items-baseline gap-1">
							<span className="text-4xl font-black text-white">{overallPerformanceScore}</span>
							<span className="text-xs text-slate-500">/ 100</span>
						</div>
						<div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black">
							OPTIMAL EFFICIENCY
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
						<span>P99 Latency: <strong className="text-orange-400">{p99LatencyMs}ms</strong></span>
						<span className="text-emerald-400 font-bold">+4.1% vs baseline</span>
					</div>
				</div>

				{/* Card 2: Throughput & Latency */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Throughput & P99
						</span>
						<div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
							<Activity className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-cyan-400">{throughputRps.toLocaleString()}</div>
						<span className="text-xs text-slate-400 font-bold">req / sec</span>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
						<span>P50: 12ms | P95: 28ms</span>
						<span className="text-cyan-300 font-bold">P99: {p99LatencyMs}ms</span>
					</div>
				</div>

				{/* Card 3: Error Rate & Availability */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Reliability & SLA
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
							<CheckCircle className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-emerald-400">{availabilityPercent}%</div>
						<div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
							Error Rate: {errorRatePercent}%
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						Zero 5xx error spikes in past 24 hrs
					</div>
				</div>

				{/* Card 4: Active Regressions & Opportunities */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							AI Optimizations
						</span>
						<div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
							<Sparkles className="w-5 h-5" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2 text-center">
						<div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30">
							<div className="text-xl font-black text-purple-300">4</div>
							<div className="text-[9px] text-slate-400 font-bold uppercase">Quick Fixes</div>
						</div>
						<div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30">
							<div className="text-xl font-black text-amber-300">1</div>
							<div className="text-[9px] text-slate-400 font-bold uppercase">N+1 Query</div>
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-purple-300 flex items-center justify-between">
						<span>Simulate Fixes</span>
						<span>Inspect →</span>
					</div>
				</div>
			</div>

			{/* 12 Core Runtime Metrics Header */}
			<div className="flex items-center justify-between pt-2">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<Gauge className="w-5 h-5 text-orange-400" /> Runtime Performance Telemetry
					</h3>
					<p className="text-xs text-slate-400">
						12 core performance metrics mapped directly to repository code execution paths & infrastructure.
					</p>
				</div>
				<span className="text-xs text-slate-500">Click metric for request flow waterfall trace</span>
			</div>

			{/* 12 Core Performance Metric Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{metrics.map((m) => {
					const Icon = m.icon;
					const isUp = m.trend === 'up';
					const isDown = m.trend === 'down';

					return (
						<button
							key={m.id}
							onClick={() => onSelectMetric(m.id)}
							className="text-left p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-xl group relative overflow-hidden flex flex-col justify-between space-y-3"
						>
							<div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: m.color }} />

							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2.5">
									<div
										className="p-2 rounded-xl border flex items-center justify-center"
										style={{
											backgroundColor: `${m.color}15`,
											borderColor: `${m.color}40`,
											color: m.color,
										}}
									>
										<Icon className="w-4 h-4" />
									</div>
									<span className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
										{m.name}
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
									<span>{m.delta > 0 ? `+${m.delta}` : m.delta}%</span>
								</div>
							</div>

							<div className="flex items-baseline justify-between mt-2">
								<div>
									<span className="text-3xl font-black text-white">{m.value}</span>
									<span className="text-xs text-slate-400 font-bold ml-1">{m.unit}</span>
								</div>
								<span className="text-[10px] text-slate-500 font-mono">Index: {m.score}/100</span>
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
