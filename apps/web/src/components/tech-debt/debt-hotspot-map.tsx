'use client';

import * as React from 'react';
import {
	Flame,
	AlertTriangle,
	ShieldAlert,
	Sparkles,
	Activity,
	GitCommit,
	Layers,
	FileCode,
	Info,
	CheckCircle,
	ArrowRight,
	Gauge,
	Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MultiSignalHotspot {
	id: string;
	filePath: string;
	hotspotScore: number; // 0..100 composite score
	riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
	signals: {
		complexity: number; // 0..100
		changeFrequency: number; // commits count
		bugHistoryCount: number;
		dependencyCentrality: number; // fan-in/fan-out score
		codeDuplication: number; // %
		testCoverage: number; // %
		securityFindingsCount: number;
		couplingRatio: number;
		fileSizeLines: number;
	};
	aiExplanation: string;
	recommendedAction: string;
}

const SAMPLE_HOTSPOTS: MultiSignalHotspot[] = [
	{
		id: 'hotspot-1',
		filePath: 'apps/backend/app/payment/processor.ts',
		hotspotScore: 96.8,
		riskLevel: 'CRITICAL',
		signals: {
			complexity: 92,
			changeFrequency: 42,
			bugHistoryCount: 6,
			dependencyCentrality: 95,
			codeDuplication: 28,
			testCoverage: 32,
			securityFindingsCount: 2,
			couplingRatio: 98,
			fileSizeLines: 1850,
		},
		aiExplanation:
			'This module has become a critical hotspot because it has extreme change frequency (42 recent commits), high complexity (92), low test coverage (32%), and dependencies across 14 modules.',
		recommendedAction: 'Decouple CheckoutManager reference using IPaymentContext interface and break circular dependency.',
	},
	{
		id: 'hotspot-2',
		filePath: 'apps/backend/app/order/engine.ts',
		hotspotScore: 88.4,
		riskLevel: 'CRITICAL',
		signals: {
			complexity: 85,
			changeFrequency: 34,
			bugHistoryCount: 4,
			dependencyCentrality: 82,
			codeDuplication: 34,
			testCoverage: 45,
			securityFindingsCount: 0,
			couplingRatio: 84,
			fileSizeLines: 1620,
		},
		aiExplanation:
			'God Class Anti-Pattern. Manages state, database persistence, invoice generation, and email notifications in a single 1,620 LOC class.',
		recommendedAction: 'Decompose OrderProcessingEngine into OrderValidator, InvoiceBuilder, and NotificationDispatcher.',
	},
	{
		id: 'hotspot-3',
		filePath: 'apps/backend/app/db/queries/analytics_raw.py',
		hotspotScore: 84.0,
		riskLevel: 'HIGH',
		signals: {
			complexity: 68,
			changeFrequency: 18,
			bugHistoryCount: 2,
			dependencyCentrality: 60,
			codeDuplication: 15,
			testCoverage: 50,
			securityFindingsCount: 1,
			couplingRatio: 55,
			fileSizeLines: 420,
		},
		aiExplanation:
			'Unsanitized dynamic SQL query string formatting detected in raw analytics query handler.',
		recommendedAction: 'Replace string formatting with parameterized query bindings in SQLAlchemy or asyncpg.',
	},
];

interface DebtHotspotMapProps {
	onSelectHotspot?: (hotspot: MultiSignalHotspot) => void;
}

export function DebtHotspotMap({ onSelectHotspot }: DebtHotspotMapProps) {
	const [selectedHotspotId, setSelectedHotspotId] = React.useState<string>('hotspot-1');
	const selectedHotspot = SAMPLE_HOTSPOTS.find((h) => h.id === selectedHotspotId) || SAMPLE_HOTSPOTS[0];

	return (
		<div className="space-y-6 font-mono">
			{/* Top Explanation Banner */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

				<div>
					<div className="flex items-center gap-2 text-xs text-rose-400 font-bold uppercase tracking-wider mb-1">
						<Flame className="w-4 h-4 animate-pulse" /> Multi-Signal Hotspot Detection
					</div>
					<h2 className="text-xl font-black text-white">Repository Debt Hotspots</h2>
					<p className="text-xs text-slate-400">
						Calculated from 13 independent signals: complexity, commit churn, bug history, centrality, coverage, & coupling.
					</p>
				</div>

				<div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
					<span className="text-xs font-bold text-slate-400">Total Hotspots:</span>
					<span className="px-3 py-1 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-300 font-black text-sm">
						{SAMPLE_HOTSPOTS.length} Critical Files
					</span>
				</div>
			</div>

			{/* Main Grid: Hotspot Rank List (5 Cols) & Multi-Signal Inspector (7 Cols) */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Hotspots Feed List */}
				<div className="lg:col-span-5 space-y-3">
					<div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
						<span>Hotspot File Ranking</span>
						<span>Explainable Score</span>
					</div>

					<div className="space-y-3">
						{SAMPLE_HOTSPOTS.map((hotspot) => {
							const isSelected = selectedHotspotId === hotspot.id;
							const isCritical = hotspot.riskLevel === 'CRITICAL';

							return (
								<button
									key={hotspot.id}
									onClick={() => {
										setSelectedHotspotId(hotspot.id);
										if (onSelectHotspot) onSelectHotspot(hotspot);
									}}
									className={cn(
										'w-full text-left p-4 rounded-2xl transition-all border shadow-lg relative overflow-hidden group',
										isSelected
											? 'bg-slate-900 border-rose-500/60 shadow-rose-950/40 ring-1 ring-rose-500/30'
											: 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
									)}
								>
									<div className="flex items-start justify-between">
										<span
											className={cn(
												'px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider',
												isCritical ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
											)}
										>
											{hotspot.riskLevel}
										</span>
										<span className="text-xl font-black text-rose-400">
											{hotspot.hotspotScore} pts
										</span>
									</div>

									<h4 className="text-xs font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors truncate">
										{hotspot.filePath}
									</h4>

									<div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
										<span>Churn: {hotspot.signals.changeFrequency} commits</span>
										<span>Bugs: {hotspot.signals.bugHistoryCount} resolved</span>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Selected Hotspot Detailed Signal Breakdown */}
				<div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
					<div className="flex items-start justify-between border-b border-slate-800 pb-4">
						<div>
							<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
								Hotspot Deep Inspection
							</span>
							<h3 className="text-lg font-black text-white">{selectedHotspot.filePath}</h3>
						</div>
						<div className="px-4 py-2 rounded-2xl bg-rose-950 border border-rose-500/40 text-rose-300 font-black text-2xl">
							{selectedHotspot.hotspotScore}
						</div>
					</div>

					{/* AI Explanation Box */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
							<Sparkles className="w-4 h-4" /> AI Multi-Signal Explanation
						</div>
						<p className="text-xs text-slate-300 leading-relaxed">
							{selectedHotspot.aiExplanation}
						</p>
					</div>

					{/* 8 Multi-Signal Metric Grid */}
					<div className="space-y-2">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Calculated Signal Signals
						</span>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
							<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
								<span className="text-[10px] text-slate-400">Complexity</span>
								<div className="text-lg font-black text-white">{selectedHotspot.signals.complexity}</div>
							</div>
							<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
								<span className="text-[10px] text-slate-400">Commit Churn</span>
								<div className="text-lg font-black text-amber-400">{selectedHotspot.signals.changeFrequency}</div>
							</div>
							<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
								<span className="text-[10px] text-slate-400">Coupling Ratio</span>
								<div className="text-lg font-black text-indigo-400">{selectedHotspot.signals.couplingRatio}%</div>
							</div>
							<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
								<span className="text-[10px] text-slate-400">Test Coverage</span>
								<div className="text-lg font-black text-emerald-400">{selectedHotspot.signals.testCoverage}%</div>
							</div>
						</div>
					</div>

					{/* Recommended Action */}
					<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
						<div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
							<CheckCircle className="w-4 h-4" /> Recommended Remediation Action
						</div>
						<p className="text-xs text-slate-300">{selectedHotspot.recommendedAction}</p>
					</div>

					<div className="flex items-center justify-end pt-2">
						<Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs px-4 py-2 rounded-xl flex items-center gap-2">
							<span>Investigate Debt Origin</span>
							<ArrowRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
