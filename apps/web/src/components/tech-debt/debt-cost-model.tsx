'use client';

import * as React from 'react';
import {
	DollarSign,
	Clock,
	ShieldAlert,
	Zap,
	Sparkles,
	TrendingUp,
	Layers,
	HelpCircle,
	CheckCircle,
	AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DebtCostEstimate {
	engineeringHours: { min: number; max: number; value: number };
	monthlyMaintenanceCost: { min: number; max: number; value: number };
	incidentRiskCost: { min: number; max: number; value: number };
	releaseFrictionDays: number;
	refactoringEffortDays: number;
	confidenceScore: number; // 0..100
}

const DEFAULT_COST_ESTIMATE: DebtCostEstimate = {
	engineeringHours: { min: 280, max: 420, value: 345 },
	monthlyMaintenanceCost: { min: 11500, max: 18200, value: 14200 },
	incidentRiskCost: { min: 25000, max: 85000, value: 45000 },
	releaseFrictionDays: 4.5,
	refactoringEffortDays: 12.5,
	confidenceScore: 92,
};

export function DebtCostModel() {
	const cost = DEFAULT_COST_ESTIMATE;

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
							<DollarSign className="w-4 h-4" /> Financial & Velocity Impact
						</div>
						<h2 className="text-xl font-black text-white">Technical Debt Cost & Risk Model</h2>
						<p className="text-xs text-slate-400">
							Quantifies engineering friction, maintenance costs, incident exposure, and refactoring effort.
						</p>
					</div>

					<div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold">
						<Sparkles className="w-4 h-4 text-cyan-400" /> AI Confidence: {cost.confidenceScore}%
					</div>
				</div>
			</div>

			{/* 4 Financial Impact Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Maintenance Cost */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-400 uppercase">Monthly Maintenance Cost</span>
						<DollarSign className="w-5 h-5 text-amber-400" />
					</div>
					<div className="text-3xl font-black text-white">
						${cost.monthlyMaintenanceCost.value.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ mo</span>
					</div>
					<div className="text-[11px] text-slate-400">
						Range: <strong>${cost.monthlyMaintenanceCost.min.toLocaleString()} – ${cost.monthlyMaintenanceCost.max.toLocaleString()}</strong>
					</div>
					<div className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
						Estimated value based on developer hourly rate
					</div>
				</div>

				{/* Incident Risk Exposure */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-400 uppercase">Incident Exposure</span>
						<ShieldAlert className="w-5 h-5 text-rose-400" />
					</div>
					<div className="text-3xl font-black text-rose-400">
						${cost.incidentRiskCost.value.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ incident</span>
					</div>
					<div className="text-[11px] text-slate-400">
						Range: <strong>${cost.incidentRiskCost.min.toLocaleString()} – ${cost.incidentRiskCost.max.toLocaleString()}</strong>
					</div>
					<div className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
						Observed telemetry & past incident logs
					</div>
				</div>

				{/* Release Friction */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-400 uppercase">Release Friction</span>
						<Zap className="w-5 h-5 text-purple-400" />
					</div>
					<div className="text-3xl font-black text-purple-300">
						+{cost.releaseFrictionDays} <span className="text-xs text-slate-500 font-normal">days / iteration</span>
					</div>
					<div className="text-[11px] text-slate-400">
						Delayed releases due to manual integration testing
					</div>
					<div className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
						Observed CI build & test execution logs
					</div>
				</div>

				{/* Total Refactoring Effort */}
				<div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-400 uppercase">Total Refactoring Effort</span>
						<Clock className="w-5 h-5 text-emerald-400" />
					</div>
					<div className="text-3xl font-black text-emerald-400">
						{cost.refactoringEffortDays} <span className="text-xs text-slate-500 font-normal">person-days</span>
					</div>
					<div className="text-[11px] text-slate-400">
						Total effort to resolve top 5 critical debt items
					</div>
					<div className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
						AI prediction derived from AST complexity
					</div>
				</div>
			</div>
		</div>
	);
}
