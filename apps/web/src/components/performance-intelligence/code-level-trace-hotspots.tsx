'use client';

import * as React from 'react';
import {
	Code2,
	FileCode,
	Sparkles,
	Clock,
	Zap,
	Database,
	Activity,
	ArrowRight,
	CheckCircle,
	AlertTriangle,
	Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CodePerformanceHotspot {
	id: string;
	functionName: string;
	filePath: string;
	lineRange: string;
	hotspotScore: number; // 0..100 composite score
	executionTimeMs: number;
	callFrequencyRps: number;
	memoryUsageMb: number;
	dbCallsPerReq: number;
	cacheHitRatePercent: number;
	aiExplanation: string;
	codeSnippet: string;
}

const SAMPLE_CODE_HOTSPOTS: CodePerformanceHotspot[] = [
	{
		id: 'hot-1',
		functionName: 'PaymentProcessor.executeTransaction()',
		filePath: 'apps/backend/app/payment/processor.ts',
		lineRange: 'L45-L112',
		hotspotScore: 94.5,
		executionTimeMs: 245,
		callFrequencyRps: 1250,
		memoryUsageMb: 42,
		dbCallsPerReq: 14,
		cacheHitRatePercent: 12,
		aiExplanation: 'Function issues 14 synchronous DB queries per request inside a nested loop without batching or caching.',
		codeSnippet: `async executeTransaction(payload: TransactionPayload) {\n  for (const item of payload.items) {\n    await db.query(\`SELECT * FROM metrics WHERE id = '\${item.id}'\`);\n  }\n}`,
	},
	{
		id: 'hot-2',
		functionName: 'OrderProcessingEngine.buildInvoicePDF()',
		filePath: 'apps/backend/app/order/engine.ts',
		lineRange: 'L340-L480',
		hotspotScore: 82.0,
		executionTimeMs: 180,
		callFrequencyRps: 450,
		memoryUsageMb: 128,
		dbCallsPerReq: 2,
		cacheHitRatePercent: 0,
		aiExplanation: 'Synchronous PDF buffer serialization allocates 128MB heap memory per invoice build.',
		codeSnippet: `buildInvoicePDF(orderData) {\n  const doc = new PDFDocument();\n  // Synchronous stream buffer allocation\n}`,
	},
];

export function CodeLevelTraceHotspots() {
	const [activeHotspotId, setActiveHotspotId] = React.useState<string>('hot-1');
	const activeHotspot = SAMPLE_CODE_HOTSPOTS.find((h) => h.id === activeHotspotId) || SAMPLE_CODE_HOTSPOTS[0];

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
						<Code2 className="w-4 h-4" /> AST Code-Level Performance Trace
					</div>
					<h2 className="text-xl font-black text-white">Code-Level Traces & Performance Hotspots</h2>
					<p className="text-xs text-slate-400">
						Connects runtime P99 execution latencies directly to source code functions and database query calls.
					</p>
				</div>
			</div>

			{/* Main Split Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Hotspot List (5 Cols) */}
				<div className="lg:col-span-5 space-y-3">
					<div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
						<span>Hotspot Functions</span>
						<span>Hotspot Index</span>
					</div>

					<div className="space-y-3">
						{SAMPLE_CODE_HOTSPOTS.map((hotspot) => {
							const isSelected = activeHotspotId === hotspot.id;
							return (
								<button
									key={hotspot.id}
									onClick={() => setActiveHotspotId(hotspot.id)}
									className={cn(
										'w-full text-left p-4 rounded-2xl transition-all border shadow-lg space-y-2 relative group',
										isSelected
											? 'bg-slate-900 border-orange-500/60 shadow-orange-950/40 ring-1 ring-orange-500/30'
											: 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
									)}
								>
									<div className="flex items-start justify-between">
										<span className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors truncate max-w-[220px]">
											{hotspot.functionName}
										</span>
										<span className="text-sm font-black text-rose-400">{hotspot.hotspotScore} pts</span>
									</div>

									<div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
										<span>Latency: <strong className="text-white">{hotspot.executionTimeMs}ms</strong></span>
										<span>DB Calls: <strong className="text-orange-400">{hotspot.dbCallsPerReq} / req</strong></span>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Detailed Code Inspector (7 Cols) */}
				<div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
					<div className="flex items-start justify-between border-b border-slate-800 pb-4">
						<div>
							<span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
								AST Code Performance Deep Dive
							</span>
							<h3 className="text-lg font-black text-white">{activeHotspot.functionName}</h3>
							<p className="text-xs text-slate-400">{activeHotspot.filePath} ({activeHotspot.lineRange})</p>
						</div>
						<div className="px-3.5 py-1.5 rounded-2xl bg-rose-950 border border-rose-500/40 text-rose-300 font-black text-xl">
							{activeHotspot.executionTimeMs}ms
						</div>
					</div>

					{/* 4 Metric Chips */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Call Frequency</span>
							<div className="text-base font-black text-white">{activeHotspot.callFrequencyRps} rps</div>
						</div>
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Memory Usage</span>
							<div className="text-base font-black text-purple-300">{activeHotspot.memoryUsageMb} MB</div>
						</div>
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">DB Queries / Req</span>
							<div className="text-base font-black text-rose-400">{activeHotspot.dbCallsPerReq} calls</div>
						</div>
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Cache Hit Rate</span>
							<div className="text-base font-black text-emerald-400">{activeHotspot.cacheHitRatePercent}%</div>
						</div>
					</div>

					{/* Code Snippet Evidence */}
					<div className="space-y-2">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
							<FileCode className="w-4 h-4 text-orange-400" /> Source Code Evidence
						</span>
						<div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-cyan-200 overflow-x-auto">
							<pre className="text-[11px] leading-relaxed">{activeHotspot.codeSnippet}</pre>
						</div>
					</div>

					{/* AI Explanation */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<div className="flex items-center gap-2 text-xs font-bold text-orange-400">
							<Sparkles className="w-4 h-4" /> AI Bottleneck Reasoning
						</div>
						<p className="text-xs text-slate-300 leading-relaxed">
							{activeHotspot.aiExplanation}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
