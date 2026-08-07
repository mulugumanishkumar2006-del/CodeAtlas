'use client';

import * as React from 'react';
import {
	FileText,
	ShieldCheck,
	Sparkles,
	CheckCircle,
	AlertTriangle,
	ArrowRight,
	FlaskConical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ReadabilityItem {
	id: string;
	functionName: string;
	filePath: string;
	readabilityScore: number;
	recommendationType: 'RENAME' | 'SPLIT_FUNCTION' | 'DECOMPOSE' | 'SIMPLIFY_BRANCHING';
	reasoning: string;
}

export interface TestabilityGapItem {
	id: string;
	targetName: string;
	filePath: string;
	issue: 'Hidden Dependency' | 'Global State Mutation' | 'Side Effects in Constructor' | 'Missing Unit Tests';
	suggestedFix: string;
}

const SAMPLE_READABILITY_ITEMS: ReadabilityItem[] = [
	{
		id: 'read-1',
		functionName: 'PaymentProcessor.executeTransaction()',
		filePath: 'apps/backend/app/payment/processor.ts',
		readabilityScore: 58,
		recommendationType: 'SPLIT_FUNCTION',
		reasoning: 'Function mixes payment validation, database audit logging, and webhook dispatch in a single 180-line block. Recommend splitting into 3 discrete domain handlers.',
	},
];

const SAMPLE_TESTABILITY_GAPS: TestabilityGapItem[] = [
	{
		id: 'test-1',
		targetName: 'analytics_raw.py',
		filePath: 'apps/backend/app/db/queries/analytics_raw.py',
		issue: 'Missing Unit Tests',
		suggestedFix: 'Add unit test fixture mocking raw PostgreSQL tenant query responses.',
	},
];

export function ReadabilityTestabilityPanel() {
	const [activeSubTab, setActiveSubTab] = React.useState<'readability' | 'testability'>('readability');

	return (
		<div className="space-y-6 font-mono">
			{/* Sub Tabs Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<FileText className="w-4 h-4" /> Code Comprehension & Isolation
					</div>
					<h2 className="text-xl font-black text-white">Readability & Testability Intelligence</h2>
				</div>

				<div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
					<button
						onClick={() => setActiveSubTab('readability')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'readability'
								? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<FileText className="w-4 h-4" /> Readability Decomposition
					</button>

					<button
						onClick={() => setActiveSubTab('testability')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'testability'
								? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<FlaskConical className="w-4 h-4" /> Testability & Isolation
					</button>
				</div>
			</div>

			{/* Readability Tab */}
			{activeSubTab === 'readability' && (
				<div className="space-y-4">
					{SAMPLE_READABILITY_ITEMS.map((item) => (
						<div
							key={item.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
						>
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<div>
									<span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase">
										RECOMMENDATION: {item.recommendationType.replace(/_/g, ' ')}
									</span>
									<h3 className="text-base font-black text-white mt-1">{item.functionName}</h3>
									<span className="text-xs text-slate-400">{item.filePath}</span>
								</div>
								<div className="text-right">
									<div className="text-2xl font-black text-white">{item.readabilityScore} / 100</div>
									<div className="text-[10px] text-slate-500">Readability Index</div>
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
								<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
									<Sparkles className="w-4 h-4" /> AI Decomposition Reasoning
								</div>
								<p className="text-xs text-slate-300 leading-relaxed">{item.reasoning}</p>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Testability Tab */}
			{activeSubTab === 'testability' && (
				<div className="space-y-4">
					{SAMPLE_TESTABILITY_GAPS.map((gap) => (
						<div
							key={gap.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
						>
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<div className="flex items-center gap-2">
									<span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-bold">
										{gap.issue}
									</span>
									<h3 className="text-base font-black text-white">{gap.targetName}</h3>
								</div>
								<span className="text-xs text-slate-400">{gap.filePath}</span>
							</div>

							<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
								<div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
									<CheckCircle className="w-4 h-4" /> Recommended Testability Fix
								</div>
								<p className="text-xs text-slate-300">{gap.suggestedFix}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
