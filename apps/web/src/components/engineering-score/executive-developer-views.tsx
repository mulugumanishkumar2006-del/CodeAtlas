'use client';

import * as React from 'react';
import {
	Building2,
	Code2,
	ShieldCheck,
	Zap,
	Sparkles,
	ArrowRight,
	CheckCircle,
	AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ExecutiveDeveloperViews() {
	const [viewMode, setViewMode] = React.useState<'developer' | 'executive'>('developer');

	return (
		<div className="space-y-6 font-mono">
			{/* Mode Switch Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						{viewMode === 'executive' ? <Building2 className="w-4 h-4" /> : <Code2 className="w-4 h-4" />} Role Perspective View
					</div>
					<h2 className="text-xl font-black text-white">
						{viewMode === 'executive' ? 'Executive Leadership View' : 'Developer Actionable Workspace'}
					</h2>
				</div>

				<div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
					<button
						onClick={() => setViewMode('developer')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							viewMode === 'developer'
								? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<Code2 className="w-4 h-4" /> Developer View
					</button>

					<button
						onClick={() => setViewMode('executive')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							viewMode === 'executive'
								? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<Building2 className="w-4 h-4" /> Executive View
					</button>
				</div>
			</div>

			{/* Developer View */}
			{viewMode === 'developer' && (
				<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
					<h3 className="text-base font-black text-white border-b border-slate-800 pb-3">
						Developer Action Items & Quick Wins
					</h3>
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
						1. Parametrize raw SQL query in <code className="text-cyan-300">analytics_raw.py</code> (+5.2 pts gain)
					</div>
				</div>
			)}

			{/* Executive View */}
			{viewMode === 'executive' && (
				<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
					<h3 className="text-base font-black text-white border-b border-slate-800 pb-3">
						Leadership Risk Posture & Investment Areas
					</h3>
					<div className="grid grid-cols-2 gap-4 text-xs">
						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400 uppercase">Security Posture</span>
							<div className="text-2xl font-black text-emerald-400">94 / 100</div>
						</div>
						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400 uppercase">Technical Debt Exposure</span>
							<div className="text-2xl font-black text-purple-300">$1,400 / mo</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
