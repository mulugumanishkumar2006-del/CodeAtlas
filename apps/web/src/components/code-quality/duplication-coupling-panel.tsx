'use client';

import * as React from 'react';
import {
	Copy,
	Layers,
	Sparkles,
	ArrowRight,
	FileCode,
	AlertTriangle,
	CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DuplicationCluster {
	id: string;
	title: string;
	duplicationType: 'Exact String Duplication' | 'Structural AST Duplication' | 'Semantic Logic Duplication';
	duplicateLinesCount: number;
	affectedFiles: string[];
	refactoringOpportunity: string;
	estimatedEffort: string;
	expectedBenefit: string;
}

const SAMPLE_DUPLICATION_CLUSTERS: DuplicationCluster[] = [
	{
		id: 'dup-1',
		title: 'Repeated Multitenant SQL Query Parameter Validation',
		duplicationType: 'Structural AST Duplication',
		duplicateLinesCount: 68,
		affectedFiles: [
			'apps/backend/app/db/queries/analytics_raw.py',
			'apps/backend/app/db/queries/user_stats.py',
		],
		refactoringOpportunity: 'Extract validate_tenant_params() helper into shared db query contract.',
		estimatedEffort: '1 hr',
		expectedBenefit: 'Eliminates 68 duplicated lines and ensures uniform SQL injection protection.',
	},
	{
		id: 'dup-2',
		title: 'Repeated Stripe Webhook Signature Verification',
		duplicationType: 'Exact String Duplication',
		duplicateLinesCount: 42,
		affectedFiles: [
			'apps/backend/app/payment/processor.ts',
			'apps/backend/app/checkout/webhook.ts',
		],
		refactoringOpportunity: 'Extract VerifyStripeWebhook() middleware function.',
		estimatedEffort: '45 mins',
		expectedBenefit: 'Centralizes webhook security checks in API ingress boundary.',
	},
];

export function DuplicationCouplingPanel() {
	const [activeSubTab, setActiveSubTab] = React.useState<'duplication' | 'coupling'>('duplication');

	return (
		<div className="space-y-6 font-mono">
			{/* Sub Tabs Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
						<Copy className="w-4 h-4" /> Code Similarity & Architectural Coupling
					</div>
					<h2 className="text-xl font-black text-white">Duplication & Coupling Intelligence</h2>
				</div>

				<div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
					<button
						onClick={() => setActiveSubTab('duplication')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'duplication'
								? 'bg-purple-950/80 border border-purple-500/40 text-purple-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<Copy className="w-4 h-4" /> Duplication Clusters ({SAMPLE_DUPLICATION_CLUSTERS.length})
					</button>

					<button
						onClick={() => setActiveSubTab('coupling')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'coupling'
								? 'bg-purple-950/80 border border-purple-500/40 text-purple-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<Layers className="w-4 h-4" /> Coupling & Cohesion
					</button>
				</div>
			</div>

			{/* Duplication Tab */}
			{activeSubTab === 'duplication' && (
				<div className="space-y-4">
					{SAMPLE_DUPLICATION_CLUSTERS.map((cluster) => (
						<div
							key={cluster.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
								<div>
									<span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-xs font-bold">
										{cluster.duplicationType}
									</span>
									<h3 className="text-base font-black text-white mt-1">{cluster.title}</h3>
								</div>

								<div className="text-right">
									<div className="text-xl font-black text-purple-400">{cluster.duplicateLinesCount} lines</div>
									<div className="text-[10px] text-slate-500">Duplicated Code</div>
								</div>
							</div>

							<div className="space-y-2">
								<span className="text-xs font-bold text-slate-400 uppercase">Affected Files ({cluster.affectedFiles.length})</span>
								<div className="flex flex-wrap items-center gap-2">
									{cluster.affectedFiles.map((file, idx) => (
										<span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
											📄 {file}
										</span>
									))}
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
								<div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
									<Sparkles className="w-4 h-4" /> Recommended Refactoring & Benefit
								</div>
								<p className="text-xs text-slate-300">{cluster.refactoringOpportunity}</p>
								<div className="text-[11px] text-emerald-300 font-bold mt-1">Expected Benefit: {cluster.expectedBenefit}</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Coupling Tab */}
			{activeSubTab === 'coupling' && (
				<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
					<div className="flex items-center justify-between border-b border-slate-800 pb-3">
						<h3 className="text-base font-black text-white flex items-center gap-2">
							<Layers className="w-4 h-4 text-purple-400" /> Module Coupling & Boundary Analysis
						</h3>
						<span className="text-xs text-emerald-400 font-bold">100% Strict Boundary Compliance</span>
					</div>

					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<div className="text-xs font-bold text-cyan-400">Zero Circular Dependencies Detected</div>
						<p className="text-xs text-slate-300 leading-relaxed">
							Domain contracts layer is strictly isolated from infrastructure and web router implementation modules.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
