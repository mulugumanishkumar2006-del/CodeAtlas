'use client';

import * as React from 'react';
import { SelfSimilarBenchmark } from './self-similar-benchmark';
import { BenchmarkMatrixHeatmap } from './benchmark-matrix-heatmap';
import { GapAnalysisPatterns } from './gap-analysis-patterns';
import { PredictiveBenchmarkScenarios } from './predictive-benchmark-scenarios';
import { PortfolioOrgView } from './portfolio-org-view';
import { AIBenchmarkingAdvisorTimeline } from './ai-benchmarking-advisor-timeline';
import {
	TrendingUp,
	Layers,
	Sparkles,
	Sliders,
	Building2,
	Clock,
	RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BenchmarkingWorkspace() {
	const [activeTab, setActiveTab] = React.useState('self-similar');
	const [isScanning, setIsScanning] = React.useState(false);

	const tabs = [
		{ id: 'self-similar', label: 'Self & Similar Benchmark' },
		{ id: 'matrix', label: 'Benchmark Matrix & Heatmap' },
		{ id: 'gaps', label: 'Gap Analysis & Pattern Library' },
		{ id: 'predictive', label: 'Predictive Scenarios' },
		{ id: 'portfolio', label: 'Portfolio & Organization View' },
		{ id: 'analyst', label: 'AI Advisor & Time Machine' },
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
		<div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1700px] mx-auto selection:bg-cyan-500/30 selection:text-cyan-200 font-mono">
			{/* Top Workspace Header */}
			<div className="flex flex-col gap-5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl relative overflow-hidden">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 z-10">
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950">
							<TrendingUp className="w-6 h-6 animate-pulse" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									Repository Benchmarking Intelligence
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-full uppercase">
									CONTEXTUAL BENCHMARKS
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Compare → Understand → Investigate → Learn → Prioritize → Improve → Verify
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
									: 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white border-cyan-400/30'
							)}
						>
							<RefreshCw className={cn('w-4 h-4', isScanning && 'animate-spin')} />
							<span>{isScanning ? 'Re-evaluating Benchmark Surface...' : 'Trigger Benchmark Sweep'}</span>
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
											? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950'
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
			{activeTab === 'self-similar' && <SelfSimilarBenchmark />}

			{activeTab === 'matrix' && <BenchmarkMatrixHeatmap />}

			{activeTab === 'gaps' && <GapAnalysisPatterns />}

			{activeTab === 'predictive' && <PredictiveBenchmarkScenarios />}

			{activeTab === 'portfolio' && <PortfolioOrgView />}

			{activeTab === 'analyst' && <AIBenchmarkingAdvisorTimeline />}
		</div>
	);
}
