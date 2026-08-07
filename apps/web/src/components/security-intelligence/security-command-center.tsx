'use client';

import * as React from 'react';
import {
	ShieldAlert,
	ShieldCheck,
	Lock,
	Key,
	Globe,
	UserCheck,
	Database,
	Server,
	Cloud,
	Boxes,
	Activity,
	Sparkles,
	TrendingUp,
	TrendingDown,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	CheckCircle,
	AlertTriangle,
	Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SecurityDomainItem {
	id: string;
	name: string;
	score: number; // 0..100 security rating
	findingsCount: number;
	status: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';
	trend: 'up' | 'down' | 'stable';
	trendDelta: number;
	icon: React.ComponentType<any>;
	color: string;
	description: string;
}

interface SecurityCommandCenterProps {
	securityHealthScore: number;
	criticalFindingsCount: number;
	highRiskFindingsCount: number;
	remediationVelocity: number; // e.g. +14% / month
	aiConfidenceScore: number;
	domains: SecurityDomainItem[];
	onSelectDomain: (domainId: string) => void;
}

export function SecurityCommandCenter({
	securityHealthScore,
	criticalFindingsCount,
	highRiskFindingsCount,
	remediationVelocity,
	aiConfidenceScore,
	domains,
	onSelectDomain,
}: SecurityCommandCenterProps) {
	return (
		<div className="space-y-6 font-mono">
			{/* Top Executive Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Card 1: Security Health Score */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Security Posture Score
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
							<ShieldCheck className="w-5 h-5 animate-pulse" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="flex items-baseline gap-1">
							<span className="text-4xl font-black text-white">{securityHealthScore}</span>
							<span className="text-xs text-slate-500">/ 100</span>
						</div>
						<div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black">
							ZERO-TRUST VERIFIED
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
						<span>Overall Status: <strong className="text-emerald-400">Robust Defense</strong></span>
						<span className="text-emerald-400 font-bold">+5.2% vs last release</span>
					</div>
				</div>

				{/* Card 2: Active Vulnerability Counters */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Active Security Findings
						</span>
						<div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
							<ShieldAlert className="w-5 h-5" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2 text-center">
						<div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30">
							<div className="text-xl font-black text-rose-300">{criticalFindingsCount}</div>
							<div className="text-[9px] text-slate-400 font-bold uppercase">Critical</div>
						</div>
						<div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30">
							<div className="text-xl font-black text-amber-300">{highRiskFindingsCount}</div>
							<div className="text-[9px] text-slate-400 font-bold uppercase">High Risk</div>
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-rose-400 flex items-center justify-between">
						<span>Targeted fixes ready</span>
						<span>Inspect Findings →</span>
					</div>
				</div>

				{/* Card 3: Remediation Velocity */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							Remediation Velocity
						</span>
						<div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
							<TrendingUp className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-cyan-400">+{remediationVelocity}%</div>
						<div className="flex items-center gap-1 text-xs text-cyan-400 font-bold">
							<ArrowUpRight className="w-4 h-4" /> 18 resolved / mo
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						MTTR: <strong className="text-cyan-300">1.8 days average</strong>
					</div>
				</div>

				{/* Card 4: AI Confidence Score */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
							AI Security Confidence
						</span>
						<div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
							<Sparkles className="w-5 h-5" />
						</div>
					</div>

					<div className="flex items-baseline justify-between">
						<div className="text-4xl font-black text-purple-300">{aiConfidenceScore}%</div>
						<div className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
							AST + DATA FLOW
						</div>
					</div>

					<div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
						100% evidence-backed AST parsing
					</div>
				</div>
			</div>

			{/* 10 Security Domains Grid Header */}
			<div className="flex items-center justify-between pt-2">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<ShieldAlert className="w-5 h-5 text-cyan-400" /> Security Posture Domains
					</h3>
					<p className="text-xs text-slate-400">
						10 continuous security domains continuously analyzed across code, dependencies, secrets, APIs, & cloud infrastructure.
					</p>
				</div>
				<span className="text-xs text-slate-500">Click domain for interactive security map zoom</span>
			</div>

			{/* 10 Security Domain Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
				{domains.map((dom) => {
					const Icon = dom.icon;
					const isUp = dom.trend === 'up';
					const isDown = dom.trend === 'down';

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
										{dom.name}
									</span>
								</div>

								{/* Trend indicator */}
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
									<span>{dom.trendDelta > 0 ? `+${dom.trendDelta}` : dom.trendDelta}%</span>
								</div>
							</div>

							{/* Score & Findings Count */}
							<div className="flex items-baseline justify-between">
								<div>
									<span className="text-2xl font-black text-white">{dom.score}</span>
									<span className="text-[10px] text-slate-500"> / 100</span>
								</div>
								<span
									className={cn(
										'text-[10px] font-bold px-2 py-0.5 rounded border',
										dom.findingsCount > 0
											? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
											: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
									)}
								>
									{dom.findingsCount} findings
								</span>
							</div>

							<p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
								{dom.description}
							</p>
						</button>
					);
				})}
			</div>
		</div>
	);
}
