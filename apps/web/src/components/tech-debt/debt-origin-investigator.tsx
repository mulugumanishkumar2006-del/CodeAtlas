'use client';

import * as React from 'react';
import {
	GitCommit,
	GitPullRequest,
	Clock,
	Layers,
	FileCode,
	Sparkles,
	ShieldAlert,
	AlertOctagon,
	Tag,
	ArrowRight,
	ExternalLink,
	CheckCircle,
	Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DebtOriginTrace {
	id: string;
	filePath: string;
	title: string;
	appearedDate: string;
	commitHash: string;
	commitMessage: string;
	pullRequestNumber: string;
	pullRequestTitle: string;
	engineeringContext: string;
	relatedFiles: string[];
	relatedArchitecture: string;
	relatedIncident?: string;
	relatedRelease: string;
	aiOriginNarrative: string;
}

const SAMPLE_ORIGIN_TRACES: DebtOriginTrace[] = [
	{
		id: 'origin-1',
		filePath: 'apps/backend/app/payment/processor.ts',
		title: 'Tight Circular Dependency Introduced in Payment Subsystem',
		appearedDate: '2026-06-18',
		commitHash: 'c7f8a91',
		commitMessage: 'feat(payment): integrate fast checkout webhook callback strategy',
		pullRequestNumber: '#412',
		pullRequestTitle: 'Fast Checkout Gateway Integration & Callback Handling',
		engineeringContext:
			'During the rapid integration of the fast checkout gateway, CheckoutManager was instantiated inside PaymentProcessor to avoid modifying existing route handlers.',
		relatedFiles: [
			'apps/backend/app/checkout/manager.ts',
			'apps/backend/app/payment/logger.ts',
			'apps/backend/app/api/v1/checkout.py',
		],
		relatedArchitecture: 'Payment Subsystem <-> Checkout Subsystem Coupling',
		relatedIncident: 'INC-2026-04: Callback deadlock during high-traffic flash sale',
		relatedRelease: 'v1.4.0-rc2',
		aiOriginNarrative:
			'Debt appeared on June 18, 2026 during PR #412. To deliver fast checkout support within tight timeline constraints, the implementation injected CheckoutManager directly into PaymentProcessor. This bypassed the shared contracts layer, establishing a circular initialization loop that later caused INC-2026-04 during peak load.',
	},
	{
		id: 'origin-2',
		filePath: 'apps/backend/app/order/engine.ts',
		title: 'God Class Growth via Feature Accumulation',
		appearedDate: '2026-05-10',
		commitHash: 'e2b4c5d',
		commitMessage: 'feat(order): add inline PDF invoice builder and webhook dispatcher',
		pullRequestNumber: '#308',
		pullRequestTitle: 'Order Engine Multitenancy & Invoice Generation',
		engineeringContext:
			'Order processing logic was centralized in a single file to keep initial transaction state synchronized in memory.',
		relatedFiles: [
			'apps/backend/app/invoice/pdf.ts',
			'apps/backend/app/notifications/webhook.ts',
		],
		relatedArchitecture: 'Monolithic Domain Class',
		relatedRelease: 'v1.2.0',
		aiOriginNarrative:
			'Debt accumulated over 5 consecutive PRs starting with PR #308. PDF generation and webhook dispatchers were appended directly to OrderProcessingEngine rather than creating decoupled strategy services, resulting in an 1,850 LOC God Class.',
	},
];

export function DebtOriginInvestigator() {
	const [selectedOriginId, setSelectedOriginId] = React.useState<string>('origin-1');
	const activeOrigin = SAMPLE_ORIGIN_TRACES.find((o) => o.id === selectedOriginId) || SAMPLE_ORIGIN_TRACES[0];

	return (
		<div className="space-y-6 font-mono">
			{/* Origin Trace Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
							<Clock className="w-4 h-4" /> System Evolution & Origin Tracer
						</div>
						<h2 className="text-xl font-black text-white">Technical Debt Origin Investigation</h2>
						<p className="text-xs text-slate-400">
							Traces root cause engineering context, PR history, architecture decisions, and incidents.
						</p>
					</div>

					<div className="flex items-center gap-2">
						{SAMPLE_ORIGIN_TRACES.map((trace) => (
							<button
								key={trace.id}
								onClick={() => setSelectedOriginId(trace.id)}
								className={cn(
									'px-3.5 py-2 rounded-xl text-xs font-bold transition-all border font-mono',
									trace.id === activeOrigin.id
										? 'bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-lg shadow-purple-950'
										: 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
								)}
							>
								{trace.filePath.split('/').pop()}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Origin Details Card */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				{/* Top Summary */}
				<div className="border-b border-slate-800 pb-4">
					<div className="flex items-center gap-2 mb-1">
						<span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
							ORIGIN TRACED
						</span>
						<span className="text-xs text-slate-400">First Appeared: {activeOrigin.appearedDate}</span>
					</div>
					<h3 className="text-lg font-black text-white">{activeOrigin.title}</h3>
					<p className="text-xs text-slate-400 mt-1">File: <strong className="text-cyan-300">{activeOrigin.filePath}</strong></p>
				</div>

				{/* AI Origin Narrative Box */}
				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
					<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
						<Sparkles className="w-4 h-4" /> AI Evidence-Based Origin Narrative
					</div>
					<p className="text-xs text-slate-300 leading-relaxed">
						{activeOrigin.aiOriginNarrative}
					</p>
				</div>

				{/* Git & PR Context Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
					{/* Commit info */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<div className="flex items-center gap-2 text-slate-400 font-bold">
							<GitCommit className="w-4 h-4 text-cyan-400" /> Origin Commit
						</div>
						<div className="font-bold text-white font-mono">{activeOrigin.commitHash}</div>
						<div className="text-[11px] text-slate-400 line-clamp-2">{activeOrigin.commitMessage}</div>
					</div>

					{/* PR info */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<div className="flex items-center gap-2 text-slate-400 font-bold">
							<GitPullRequest className="w-4 h-4 text-purple-400" /> Pull Request
						</div>
						<div className="font-bold text-purple-300 font-mono">{activeOrigin.pullRequestNumber}</div>
						<div className="text-[11px] text-slate-400 line-clamp-2">{activeOrigin.pullRequestTitle}</div>
					</div>

					{/* Release info */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<div className="flex items-center gap-2 text-slate-400 font-bold">
							<Tag className="w-4 h-4 text-emerald-400" /> Target Release
						</div>
						<div className="font-bold text-emerald-300">{activeOrigin.relatedRelease}</div>
						{activeOrigin.relatedIncident && (
							<div className="text-[10px] text-rose-400 font-bold">{activeOrigin.relatedIncident}</div>
						)}
					</div>
				</div>

				{/* Related Files & Architecture Dependencies */}
				<div className="space-y-2">
					<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
						Coupled Dependencies & Affected Surfaces
					</span>
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<div className="text-xs text-slate-300">
							Architecture: <strong className="text-indigo-400">{activeOrigin.relatedArchitecture}</strong>
						</div>
						<div className="flex flex-wrap items-center gap-2 pt-1">
							{activeOrigin.relatedFiles.map((file, idx) => (
								<span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono">
									{file}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
