'use client';

import * as React from 'react';
import {
	Users,
	BookOpen,
	ShieldCheck,
	AlertTriangle,
	Sparkles,
	CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface KnowledgeRiskItem {
	id: string;
	componentName: string;
	busFactorRisk: 'HIGH' | 'MEDIUM' | 'LOW';
	primaryMaintainerRatio: string; // e.g. "88% of commits from 1 maintainer"
	documentationCoveragePercent: number;
	recommendation: string;
}

const SAMPLE_KNOWLEDGE_RISKS: KnowledgeRiskItem[] = [
	{
		id: 'k-1',
		componentName: 'apps/backend/app/auth/vault.py (Auth Vault Domain)',
		busFactorRisk: 'HIGH',
		primaryMaintainerRatio: '88% of commits from single maintainer',
		documentationCoveragePercent: 64,
		recommendation: 'Expand peer review rotation and add OpenAPI contract docs for auth vault helpers.',
	},
];

export function TeamHealthKnowledgeRisk() {
	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
						<Users className="w-4 h-4" /> System Ownership & Knowledge Risk
					</div>
					<h2 className="text-xl font-black text-white">System Team Health & Knowledge Concentration</h2>
					<p className="text-xs text-slate-400">
						Identifies organizational Bus Factor risks, documentation gaps, and ownership concentration without individual surveillance.
					</p>
				</div>
			</div>

			{/* Knowledge Risk Cards */}
			<div className="space-y-4">
				{SAMPLE_KNOWLEDGE_RISKS.map((k) => (
					<div
						key={k.id}
						className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
					>
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<h3 className="text-base font-black text-white">{k.componentName}</h3>
							<span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-bold">
								{k.busFactorRisk} BUS FACTOR RISK
							</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
								<strong className="text-slate-400">Knowledge Concentration:</strong>
								<p className="text-slate-300">{k.primaryMaintainerRatio}</p>
							</div>

							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
								<strong className="text-slate-400">Documentation Coverage:</strong>
								<p className="text-cyan-300 font-bold">{k.documentationCoveragePercent}% OpenAPI Specs</p>
							</div>
						</div>

						<div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300">
							<strong>Recommended Action:</strong> {k.recommendation}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
