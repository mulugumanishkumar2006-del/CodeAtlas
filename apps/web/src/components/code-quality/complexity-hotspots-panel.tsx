'use client';

import * as React from 'react';
import {
	Code2,
	Sparkles,
	Clock,
	GitCommit,
	AlertTriangle,
	CheckCircle,
	ArrowRight,
	TrendingUp,
	Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ComplexityHotspot {
	id: string;
	functionName: string;
	filePath: string;
	cyclomaticComplexity: number;
	cognitiveComplexity: number;
	nestingDepth: number;
	changeFrequencyRps: number; // commits/mo
	qualityHotspotScore: number; // 0..100 explainable score
	contextualVerdict: string;
	priority: 'HIGH_PRIORITY_REFACTOR' | 'STABLE_COMPLEXITY' | 'LOW_RISK';
	codeSnippet: string;
}

const SAMPLE_HOTSPOTS: ComplexityHotspot[] = [
	{
		id: 'c-hot-1',
		functionName: 'PaymentProcessor.executeTransaction()',
		filePath: 'apps/backend/app/payment/processor.ts',
		cyclomaticComplexity: 24,
		cognitiveComplexity: 32,
		nestingDepth: 5,
		changeFrequencyRps: 18,
		qualityHotspotScore: 94.2,
		priority: 'HIGH_PRIORITY_REFACTOR',
		contextualVerdict: 'Complexity is high (32) AND this function changes frequently (18 commits/mo), making it a high-priority refactoring candidate.',
		codeSnippet: `async executeTransaction(payload: TransactionPayload) {\n  if (payload.isCredit) {\n    if (payload.token) {\n      for (const item of payload.items) {\n        // Deep nested branching\n      }\n    }\n  }\n}`,
	},
	{
		id: 'c-hot-2',
		functionName: 'JwtAuthVault.verifySignature()',
		filePath: 'apps/backend/app/auth/vault.py',
		cyclomaticComplexity: 18,
		cognitiveComplexity: 22,
		nestingDepth: 3,
		changeFrequencyRps: 1,
		qualityHotspotScore: 42.0,
		priority: 'STABLE_COMPLEXITY',
		contextualVerdict: 'Complexity is high (22), but this function is stable and rarely changed (1 commit/yr). Low urgency to modify.',
		codeSnippet: `def verifySignature(token, secret):\n    # Mathematical cryptographic verification logic\n    pass`,
	},
];

export function ComplexityHotspotsPanel() {
	const [activeHotspotId, setActiveHotspotId] = React.useState<string>('c-hot-1');
	const activeHotspot = SAMPLE_HOTSPOTS.find((h) => h.id === activeHotspotId) || SAMPLE_HOTSPOTS[0];

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<Code2 className="w-4 h-4" /> Contextual Complexity Analysis
					</div>
					<h2 className="text-xl font-black text-white">Complexity Intelligence & Quality Hotspots</h2>
					<p className="text-xs text-slate-400">
						Evaluates cyclomatic and cognitive complexity alongside change frequency to distinguish high-risk hotspots from stable code.
					</p>
				</div>
			</div>

			{/* Main Split Screen */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Hotspot List (5 Cols) */}
				<div className="lg:col-span-5 space-y-3">
					<div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
						<span>Hotspot Candidate</span>
						<span>Hotspot Index</span>
					</div>

					<div className="space-y-3">
						{SAMPLE_HOTSPOTS.map((hotspot) => {
							const isSelected = activeHotspotId === hotspot.id;
							const isHighPriority = hotspot.priority === 'HIGH_PRIORITY_REFACTOR';

							return (
								<button
									key={hotspot.id}
									onClick={() => setActiveHotspotId(hotspot.id)}
									className={cn(
										'w-full text-left p-4 rounded-2xl transition-all border shadow-lg space-y-2 relative group',
										isSelected
											? 'bg-slate-900 border-cyan-500/60 shadow-cyan-950/40 ring-1 ring-cyan-500/30'
											: 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
									)}
								>
									<div className="flex items-start justify-between">
										<span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate max-w-[220px]">
											{hotspot.functionName}
										</span>
										<span
											className={cn(
												'text-sm font-black',
												isHighPriority ? 'text-rose-400' : 'text-emerald-400'
											)}
										>
											{hotspot.qualityHotspotScore} pts
										</span>
									</div>

									<div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
										<span>Cognitive: <strong className="text-cyan-300">{hotspot.cognitiveComplexity}</strong></span>
										<span>Churn: <strong className="text-purple-300">{hotspot.changeFrequencyRps} / mo</strong></span>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Inspector (7 Cols) */}
				<div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
					<div className="flex items-start justify-between border-b border-slate-800 pb-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span
									className={cn(
										'px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider',
										activeHotspot.priority === 'HIGH_PRIORITY_REFACTOR'
											? 'bg-rose-950 text-rose-300 border border-rose-500/40'
											: 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
									)}
								>
									{activeHotspot.priority.replace(/_/g, ' ')}
								</span>
							</div>
							<h3 className="text-lg font-black text-white">{activeHotspot.functionName}</h3>
							<p className="text-xs text-slate-400">{activeHotspot.filePath}</p>
						</div>

						<div className="text-right">
							<span className="text-[10px] text-slate-400 uppercase font-bold block">Hotspot Score</span>
							<span className="text-3xl font-black text-rose-400">{activeHotspot.qualityHotspotScore}</span>
						</div>
					</div>

					{/* 3 Metric Badges */}
					<div className="grid grid-cols-3 gap-3 text-xs">
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Cyclomatic</span>
							<div className="text-lg font-black text-white">{activeHotspot.cyclomaticComplexity}</div>
						</div>
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Cognitive</span>
							<div className="text-lg font-black text-cyan-300">{activeHotspot.cognitiveComplexity}</div>
						</div>
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Max Nesting</span>
							<div className="text-lg font-black text-purple-300">{activeHotspot.nestingDepth} levels</div>
						</div>
					</div>

					{/* Contextual Verdict Box */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
							<Sparkles className="w-4 h-4" /> Context-Aware Interpretation
						</div>
						<p className="text-xs text-slate-300 leading-relaxed">
							{activeHotspot.contextualVerdict}
						</p>
					</div>

					{/* Code Snippet */}
					<div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-cyan-200 overflow-x-auto">
						<pre className="text-[11px] leading-relaxed">{activeHotspot.codeSnippet}</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
