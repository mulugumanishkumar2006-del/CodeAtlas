'use client';

import * as React from 'react';
import { PerformanceCommandCenter, PerformanceMetricItem } from './performance-command-center';
import { PerformanceTopologyMap } from './performance-topology-map';
import { RequestFlowWaterfall } from './request-flow-waterfall';
import { CodeLevelTraceHotspots } from './code-level-trace-hotspots';
import { DatabaseCacheIntelligence } from './database-cache-intelligence';
import { WhatIfPerformanceSimulator } from './what-if-performance-simulator';
import { PerformanceOptimizationWorkspace } from './performance-optimization-workspace';
import { AIPerformanceAnalystTimeline } from './ai-performance-analyst-timeline';
import {
	Zap,
	Activity,
	Clock,
	Cpu,
	Database,
	Server,
	Globe,
	Layers,
	HardDrive,
	RefreshCw,
	Sparkles,
	Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SAMPLE_PERFORMANCE_METRICS: PerformanceMetricItem[] = [
	{
		id: 'm-p99',
		name: 'P99 Latency',
		value: '38',
		unit: 'ms',
		score: 96,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 4.2,
		icon: Clock,
		color: '#f97316',
		description: 'Sub-40ms P99 latency across all production microservices.',
	},
	{
		id: 'm-throughput',
		name: 'Throughput',
		value: '1,250',
		unit: 'rps',
		score: 92,
		status: 'HEALTHY',
		trend: 'up',
		delta: 6.5,
		icon: Activity,
		color: '#10b981',
		description: '1,250 requests/sec sustained without queue latency backlog.',
	},
	{
		id: 'm-error',
		name: 'Error Rate',
		value: '0.02',
		unit: '%',
		score: 99,
		status: 'EXCELLENT',
		trend: 'stable',
		delta: 0.0,
		icon: Zap,
		color: '#10b981',
		description: 'Zero uncaught 5xx exceptions across production telemetry.',
	},
	{
		id: 'm-cpu',
		name: 'CPU Utilization',
		value: '24.5',
		unit: '%',
		score: 94,
		status: 'HEALTHY',
		trend: 'stable',
		delta: 0.0,
		icon: Cpu,
		color: '#8b5cf6',
		description: 'Worker pool CPU usage operating within safe thresholds.',
	},
	{
		id: 'm-mem',
		name: 'Memory Heap',
		value: '184',
		unit: 'MB',
		score: 90,
		status: 'HEALTHY',
		trend: 'up',
		delta: 1.0,
		icon: HardDrive,
		color: '#3b82f6',
		description: 'Zero heap memory leaks detected across AST parsers.',
	},
	{
		id: 'm-db-lat',
		name: 'Database Latency',
		value: '180',
		unit: 'ms',
		score: 64,
		status: 'WARNING',
		trend: 'down',
		delta: -2.5,
		icon: Database,
		color: '#ef4444',
		description: 'Unindexed query in analytics_raw.py dragging P99 database latency.',
	},
	{
		id: 'm-api-lat',
		name: 'API Latency',
		value: '31',
		unit: 'ms',
		score: 95,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 3.0,
		icon: Globe,
		color: '#14b8a6',
		description: 'FastAPI REST router executing with sub-35ms overhead.',
	},
	{
		id: 'm-cache-hit',
		name: 'Cache Hit Rate',
		value: '94.2',
		unit: '%',
		score: 98,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 5.0,
		icon: HardDrive,
		color: '#ec4899',
		description: 'Redis cluster caching active token references cleanly.',
	},
];

export function PerformanceIntelligenceWorkspace() {
	const [activeTab, setActiveTab] = React.useState('command-center');
	const [isScanning, setIsScanning] = React.useState(false);

	const tabs = [
		{ id: 'command-center', label: 'Command Center' },
		{ id: 'topology', label: 'Performance Topology' },
		{ id: 'waterfall', label: 'Request Flow & Waterfall' },
		{ id: 'trace', label: 'Code Trace & Hotspots' },
		{ id: 'database', label: 'Database & Cache' },
		{ id: 'what-if', label: 'What-If Simulator' },
		{ id: 'optimization', label: 'Optimization & Verification' },
		{ id: 'analyst', label: 'AI Analyst & Time Machine' },
	];

	const handleTriggerScan = () => {
		setIsScanning(true);
		setTimeout(() => setIsScanning(false), 1500);
	};

	// Keyboard shortcuts listener
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey) {
				const num = parseInt(e.key);
				if (num >= 1 && num <= tabs.length) {
					e.preventDefault();
					setActiveTab(tabs[num - 1].id);
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [tabs]);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1700px] mx-auto selection:bg-orange-500/30 selection:text-orange-200 font-mono">
			{/* Top Workspace Header */}
			<div className="flex flex-col gap-5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl relative overflow-hidden">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 z-10">
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-500/20 via-amber-500/20 to-purple-500/20 border border-orange-500/30 text-orange-400 shadow-lg shadow-orange-950">
							<Zap className="w-6 h-6 animate-pulse fill-orange-400" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									Performance Intelligence Center
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-orange-300 bg-orange-950/80 border border-orange-500/40 rounded-full uppercase">
									CODE-AWARE TELEMETRY
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Detect → Trace → Understand → Investigate → Simulate → Optimize → Verify
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button
							onClick={handleTriggerScan}
							disabled={isScanning}
							className={cn(
								'flex items-center gap-2 font-mono text-xs px-4 py-2.5 rounded-xl border shadow-lg transition-all',
								isScanning
									? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
									: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-orange-400/30'
							)}
						>
							<RefreshCw className={cn('w-4 h-4', isScanning && 'animate-spin')} />
							<span>{isScanning ? 'Running Telemetry Sweep...' : 'Trigger Telemetry Sweep'}</span>
						</Button>
					</div>
				</div>

				{/* Tabs Navigation */}
				<div className="flex items-center justify-between border-t border-slate-800/80 pt-4 z-10">
					<div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
						{tabs.map((t, idx) => {
							const isActive = activeTab === t.id;
							return (
								<button
									key={t.id}
									onClick={() => setActiveTab(t.id)}
									className={cn(
										'px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-2',
										isActive
											? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/40 shadow-lg shadow-orange-950'
											: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
									)}
								>
									<span>{t.label}</span>
									<span className="text-[9px] text-slate-500 font-mono">⌘{idx + 1}</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Active View Tab Content */}
			{activeTab === 'command-center' && (
				<PerformanceCommandCenter
					overallPerformanceScore={96}
					p99LatencyMs={38}
					throughputRps={1250}
					errorRatePercent={0.02}
					availabilityPercent={99.98}
					metrics={SAMPLE_PERFORMANCE_METRICS}
					onSelectMetric={() => setActiveTab('waterfall')}
				/>
			)}

			{activeTab === 'topology' && <PerformanceTopologyMap />}

			{activeTab === 'waterfall' && <RequestFlowWaterfall />}

			{activeTab === 'trace' && <CodeLevelTraceHotspots />}

			{activeTab === 'database' && <DatabaseCacheIntelligence />}

			{activeTab === 'what-if' && <WhatIfPerformanceSimulator />}

			{activeTab === 'optimization' && <PerformanceOptimizationWorkspace />}

			{activeTab === 'analyst' && <AIPerformanceAnalystTimeline />}
		</div>
	);
}
