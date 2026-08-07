'use client';

import * as React from 'react';
import {
	Database,
	HardDrive,
	Sparkles,
	Clock,
	Zap,
	AlertTriangle,
	CheckCircle,
	ArrowRight,
	Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DatabaseQueryFinding {
	id: string;
	queryText: string;
	durationMs: number;
	pattern: 'N+1 Query Pattern' | 'Unindexed Full Scan' | 'High Query Frequency' | 'Connection Pool Lock';
	affectedFile: string;
	suggestedFix: string;
}

export interface CacheScenario {
	id: string;
	mode: 'No Cache' | 'Current Cache' | 'Optimized Cache';
	hitRatePercent: number;
	p99LatencyMs: number;
	monthlyInfraCost: number;
}

const SAMPLE_DB_FINDINGS: DatabaseQueryFinding[] = [
	{
		id: 'db-1',
		queryText: "SELECT * FROM metrics WHERE tenant_id = 'tenant_123' AND filter = 'active'",
		durationMs: 180,
		pattern: 'Unindexed Full Scan',
		affectedFile: 'apps/backend/app/db/queries/analytics_raw.py',
		suggestedFix: 'Create composite B-tree index on (tenant_id, filter) in PostgreSQL metrics table.',
	},
	{
		id: 'db-2',
		queryText: 'SELECT * FROM orders WHERE user_id = :id (Executed 14x in loop)',
		durationMs: 140,
		pattern: 'N+1 Query Pattern',
		affectedFile: 'apps/backend/app/payment/processor.ts',
		suggestedFix: 'Replace loop query with WHERE user_id IN (:ids) batch query.',
	},
];

const CACHE_SCENARIOS: CacheScenario[] = [
	{ id: 'c-1', mode: 'No Cache', hitRatePercent: 0, p99LatencyMs: 380, monthlyInfraCost: 2200 },
	{ id: 'c-2', mode: 'Current Cache', hitRatePercent: 68, p99LatencyMs: 145, monthlyInfraCost: 1400 },
	{ id: 'c-3', mode: 'Optimized Cache', hitRatePercent: 94, p99LatencyMs: 24, monthlyInfraCost: 980 },
];

export function DatabaseCacheIntelligence() {
	const [activeSubTab, setActiveSubTab] = React.useState<'database' | 'cache'>('database');
	const [selectedCacheMode, setSelectedCacheMode] = React.useState<string>('c-3');

	const activeCacheScenario = CACHE_SCENARIOS.find((s) => s.id === selectedCacheMode) || CACHE_SCENARIOS[2];

	return (
		<div className="space-y-6 font-mono">
			{/* Sub Tabs Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
						<Database className="w-4 h-4" /> Persistence & Caching Analytics
					</div>
					<h2 className="text-xl font-black text-white">Database & Cache Performance Intelligence</h2>
				</div>

				<div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
					<button
						onClick={() => setActiveSubTab('database')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'database'
								? 'bg-orange-950/80 border border-orange-500/40 text-orange-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<Database className="w-4 h-4" /> Database Queries ({SAMPLE_DB_FINDINGS.length})
					</button>

					<button
						onClick={() => setActiveSubTab('cache')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'cache'
								? 'bg-orange-950/80 border border-orange-500/40 text-orange-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<HardDrive className="w-4 h-4" /> Cache Simulator
					</button>
				</div>
			</div>

			{/* Database Queries Tab */}
			{activeSubTab === 'database' && (
				<div className="space-y-4">
					{SAMPLE_DB_FINDINGS.map((finding) => (
						<div
							key={finding.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
						>
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<div className="flex items-center gap-2">
									<span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-bold">
										{finding.pattern}
									</span>
									<span className="text-xs text-slate-400">{finding.affectedFile}</span>
								</div>
								<span className="text-xl font-black text-rose-400">{finding.durationMs}ms</span>
							</div>

							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200">
								<pre className="text-[11px] leading-relaxed">{finding.queryText}</pre>
							</div>

							<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
								<div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
									<Sparkles className="w-4 h-4" /> Recommended Database Optimization
								</div>
								<p className="text-xs text-slate-300">{finding.suggestedFix}</p>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Cache Simulator Tab */}
			{activeSubTab === 'cache' && (
				<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
					<div className="flex items-center justify-between border-b border-slate-800 pb-3">
						<h3 className="text-base font-black text-white flex items-center gap-2">
							<Sliders className="w-4 h-4 text-orange-400" /> Cache Mode Simulator
						</h3>

						<div className="flex items-center gap-2">
							{CACHE_SCENARIOS.map((scen) => (
								<button
									key={scen.id}
									onClick={() => setSelectedCacheMode(scen.id)}
									className={cn(
										'px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border',
										scen.id === activeCacheScenario.id
											? 'bg-orange-950/80 border-orange-500/60 text-orange-300 shadow-lg'
											: 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
									)}
								>
									{scen.mode}
								</button>
							))}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
							<span className="text-[10px] text-slate-400 uppercase">Cache Hit Rate</span>
							<div className="text-3xl font-black text-emerald-400">{activeCacheScenario.hitRatePercent}%</div>
						</div>

						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
							<span className="text-[10px] text-slate-400 uppercase">Simulated P99 Latency</span>
							<div className="text-3xl font-black text-white">{activeCacheScenario.p99LatencyMs}ms</div>
						</div>

						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
							<span className="text-[10px] text-slate-400 uppercase">Monthly Infra Cost</span>
							<div className="text-3xl font-black text-purple-300">${activeCacheScenario.monthlyInfraCost}/mo</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
