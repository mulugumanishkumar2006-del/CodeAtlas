'use client';

import * as React from 'react';
import {
	Activity,
	Clock,
	Database,
	Server,
	Globe,
	Lock,
	Zap,
	Sparkles,
	ArrowRight,
	BarChart2,
	CheckCircle,
	AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface RequestSpan {
	id: string;
	stageName: string;
	componentName: string;
	durationMs: number;
	percentage: number;
	isDominantBottleneck?: boolean;
	spanType: 'Auth' | 'Gateway' | 'Service' | 'Database' | 'External' | 'Response';
	details: string;
}

const SAMPLE_REQUEST_SPANS: RequestSpan[] = [
	{
		id: 'span-1',
		stageName: '1. Authentication',
		componentName: 'JWT Auth Vault Validator',
		durationMs: 12,
		percentage: 3.3,
		spanType: 'Auth',
		details: 'Verified HS256 JWT bearer token header.',
	},
	{
		id: 'span-2',
		stageName: '2. API Gateway',
		componentName: 'Nginx Ingress Edge Gateway',
		durationMs: 31,
		percentage: 8.5,
		spanType: 'Gateway',
		details: 'Matched route POST /api/v1/checkout and dispatched payload.',
	},
	{
		id: 'span-3',
		stageName: '3. Service Handler',
		componentName: 'PaymentProcessor.executeTransaction()',
		durationMs: 45,
		percentage: 12.3,
		spanType: 'Service',
		details: 'Constructed order payload and instantiated transaction context.',
	},
	{
		id: 'span-4',
		stageName: '4. Database Queries',
		componentName: 'PostgreSQL analytics_raw Query Handler',
		durationMs: 180,
		percentage: 49.4,
		isDominantBottleneck: true,
		spanType: 'Database',
		details: 'Full unindexed table scan across 4.2M rows in analytics table.',
	},
	{
		id: 'span-5',
		stageName: '5. External API Call',
		componentName: 'Stripe Payment Gateway v12 Webhook',
		durationMs: 74,
		percentage: 20.3,
		spanType: 'External',
		details: 'Dispatched OAuth2 payment tokenization webhook.',
	},
	{
		id: 'span-6',
		stageName: '6. Response Builder',
		componentName: 'JSON Serialization & Transmit',
		durationMs: 22,
		percentage: 6.0,
		spanType: 'Response',
		details: 'Serialized HTTP 200 OK JSON response payload.',
	},
];

export function RequestFlowWaterfall() {
	const [activeSpanId, setActiveSpanId] = React.useState<string>('span-4');
	const activeSpan = SAMPLE_REQUEST_SPANS.find((s) => s.id === activeSpanId) || SAMPLE_REQUEST_SPANS[3];

	const totalDurationMs = SAMPLE_REQUEST_SPANS.reduce((acc, s) => acc + s.durationMs, 0);

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
							<Activity className="w-4 h-4" /> End-to-End Tracing & Waterfall
						</div>
						<h2 className="text-xl font-black text-white">Request Execution Flow & Latency Waterfall</h2>
						<p className="text-xs text-slate-400">
							Breakdown of total request execution duration ({totalDurationMs}ms) identifying dominant latency contributors.
						</p>
					</div>

					<div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
						<span className="text-xs font-bold text-slate-400">Total Latency:</span>
						<span className="text-2xl font-black text-white">{totalDurationMs}ms</span>
					</div>
				</div>
			</div>

			{/* Flow Stage Cards Bar */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
				{SAMPLE_REQUEST_SPANS.map((span) => {
					const isSelected = span.id === activeSpanId;
					return (
						<button
							key={span.id}
							onClick={() => setActiveSpanId(span.id)}
							className={cn(
								'p-3.5 rounded-2xl border text-left transition-all duration-200 shadow-lg space-y-1 relative group',
								isSelected
									? 'bg-slate-900 border-orange-500/60 ring-2 ring-orange-500/30'
									: 'bg-slate-950 border-slate-800 hover:border-slate-700',
								span.isDominantBottleneck && 'border-rose-500/50 bg-rose-950/20'
							)}
						>
							<span className="text-[10px] text-slate-400 font-bold block truncate">{span.stageName}</span>
							<div className="text-xl font-black text-white">{span.durationMs}ms</div>
							<span className="text-[10px] text-orange-400 font-bold block">{span.percentage}% of total</span>
							{span.isDominantBottleneck && (
								<span className="text-[9px] text-rose-400 font-bold uppercase block">★ Bottleneck</span>
							)}
						</button>
					);
				})}
			</div>

			{/* Waterfall Visualizer Bars */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<h3 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
					<BarChart2 className="w-4 h-4 text-orange-400" /> Latency Waterfall Spans
				</h3>

				<div className="space-y-3">
					{SAMPLE_REQUEST_SPANS.map((span) => {
						const isSelected = span.id === activeSpanId;
						return (
							<div
								key={span.id}
								onClick={() => setActiveSpanId(span.id)}
								className={cn(
									'p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5',
									isSelected ? 'bg-slate-950 border-orange-500/50' : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
								)}
							>
								<div className="flex items-center justify-between text-xs font-bold">
									<span className="text-white">{span.stageName}: {span.componentName}</span>
									<span className={span.isDominantBottleneck ? 'text-rose-400 font-black' : 'text-slate-300'}>
										{span.durationMs}ms ({span.percentage}%)
									</span>
								</div>

								{/* Progress Bar Track */}
								<div className="w-full h-3 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 relative">
									<div
										className={cn(
											'h-full rounded-lg transition-all duration-500',
											span.isDominantBottleneck ? 'bg-rose-500 shadow-lg shadow-rose-950' : 'bg-orange-500'
										)}
										style={{ width: `${Math.max(4, span.percentage)}%` }}
									/>
								</div>
							</div>
						);
					})}
				</div>

				{/* Active Span Details Card */}
				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
					<div className="flex items-center gap-2 text-xs font-bold text-orange-400">
						<Sparkles className="w-4 h-4" /> AI Latency Diagnostics for {activeSpan.componentName}
					</div>
					<p className="text-xs text-slate-300">{activeSpan.details}</p>
				</div>
			</div>
		</div>
	);
}
