'use client';

import * as React from 'react';
import {
	Clock,
	CheckCircle,
	XCircle,
	GitBranch,
	ShieldCheck,
	Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AuditLogEntry {
	id: string;
	timestamp: string;
	title: string;
	actionType: 'APPLIED' | 'REJECTED' | 'MODIFIED' | 'ROLLED_BACK';
	developerDecision: string;
	predictedImpact: string;
	actualObservedImpact: string;
}

const SAMPLE_AUDIT_LOGS: AuditLogEntry[] = [
	{
		id: 'aud-1',
		timestamp: '2026-08-07 14:32',
		title: 'Parameterized PostgreSQL Query in analytics_raw.py',
		actionType: 'APPLIED',
		developerDecision: 'Approved by lead maintainer via L4 Validation Pipeline',
		predictedImpact: '+8.0 pts Performance Index gain',
		actualObservedImpact: '+8.0 pts gain verified (P99 query latency reduced from 180ms to 18ms)',
	},
];

export function OptimizationHistoryAudit() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<Clock className="w-4 h-4" /> Transparent Audit Trail & Learning Loop
					</div>
					<h2 className="text-xl font-black text-white">Optimization History & Learning Loop</h2>
					<p className="text-xs text-slate-400">
						Audits every recommendation, developer decision, validation pipeline run, and actual vs predicted impact.
					</p>
				</div>
			</div>

			{/* Audit Log Entries */}
			<div className="space-y-4">
				{SAMPLE_AUDIT_LOGS.map((log) => (
					<div
						key={log.id}
						className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
					>
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div>
								<span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase">
									{log.actionType}
								</span>
								<h3 className="text-base font-black text-white mt-1">{log.title}</h3>
							</div>

							<span className="text-xs text-slate-400 font-mono">{log.timestamp}</span>
						</div>

						<div className="text-xs text-slate-300">
							<strong>Developer Decision:</strong> {log.developerDecision}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
								<strong className="text-cyan-400 uppercase">Predicted Impact:</strong>
								<p className="text-slate-300">{log.predictedImpact}</p>
							</div>

							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
								<strong className="text-emerald-400 uppercase">Actual Observed Impact:</strong>
								<p className="text-slate-300">{log.actualObservedImpact}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
