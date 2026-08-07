'use client';

import * as React from 'react';
import {
	Rocket,
	ShieldAlert,
	GitCommit,
	Layers,
	FileCode,
	ArrowRight,
	CheckCircle,
	AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface IncidentLineageItem {
	id: string;
	incidentTitle: string;
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
	affectedService: string;
	linkedCommitHash: string;
	linkedPR: string;
	rootCauseSummary: string;
}

const SAMPLE_INCIDENT_LINEAGE: IncidentLineageItem[] = [
	{
		id: 'inc-1',
		incidentTitle: 'P99 Latency Spike on Analytics Export Endpoint',
		severity: 'HIGH',
		affectedService: 'apps/backend/app/api/v1/analytics.py',
		linkedCommitHash: 'c7f8a91',
		linkedPR: 'PR #412: Fast Checkout Optimizations',
		rootCauseSummary: 'Unindexed raw SQL query formatting in analytics_raw.py caused table scans under 3,400 rps load.',
	},
];

export function CICDIncidentLineage() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-rose-400 font-bold uppercase tracking-wider mb-1">
						<ShieldAlert className="w-4 h-4" /> Pipeline & Incident Lineage
					</div>
					<h2 className="text-xl font-black text-white">CI/CD & Incident Context Lineage</h2>
					<p className="text-xs text-slate-400">
						Connects production incidents directly to commits, pull requests, affected services, & source code.
					</p>
				</div>
			</div>

			{/* Incident Lineage Cards */}
			<div className="space-y-4">
				{SAMPLE_INCIDENT_LINEAGE.map((inc) => (
					<div
						key={inc.id}
						className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
					>
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div>
								<span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
									{inc.severity} SEVERITY INCIDENT
								</span>
								<h3 className="text-base font-black text-white mt-1">{inc.incidentTitle}</h3>
							</div>
						</div>

						{/* Visual Lineage Flow */}
						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
							<div className="p-3 rounded-xl bg-slate-900 border border-slate-800 w-full">
								<span className="text-[10px] text-slate-500 block uppercase">Incident</span>
								<div className="font-bold text-rose-400 line-clamp-1">{inc.incidentTitle}</div>
							</div>

							<ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden md:block" />

							<div className="p-3 rounded-xl bg-slate-900 border border-slate-800 w-full">
								<span className="text-[10px] text-slate-500 block uppercase">Linked PR & Commit</span>
								<div className="font-bold text-cyan-300 line-clamp-1">{inc.linkedPR} ({inc.linkedCommitHash})</div>
							</div>

							<ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden md:block" />

							<div className="p-3 rounded-xl bg-slate-900 border border-slate-800 w-full">
								<span className="text-[10px] text-slate-500 block uppercase">Affected Component</span>
								<div className="font-bold text-purple-300 line-clamp-1">{inc.affectedService}</div>
							</div>
						</div>

						<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
							<strong>Evidence Root Cause:</strong> {inc.rootCauseSummary}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
