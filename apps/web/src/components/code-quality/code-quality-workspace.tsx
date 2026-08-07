'use client';

import * as React from 'react';
import { QualityCommandCenter, QualityMetricDimension } from './quality-command-center';
import { CodeQualityMap } from './code-quality-map';
import { ComplexityHotspotsPanel } from './complexity-hotspots-panel';
import { DuplicationCouplingPanel } from './duplication-coupling-panel';
import { ReadabilityTestabilityPanel } from './readability-testability-panel';
import { RefactoringSimulatorStudio } from './refactoring-simulator-studio';
import { AIQualityReviewerTimeline } from './ai-quality-reviewer-timeline';
import {
	CheckCircle2,
	Code2,
	Layers,
	Copy,
	FileText,
	ShieldCheck,
	Activity,
	Sparkles,
	RefreshCw,
	Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SAMPLE_QUALITY_DIMENSIONS: QualityMetricDimension[] = [
	{
		id: 'dim-maintainability',
		name: 'Maintainability',
		score: 92,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 3.5,
		icon: CheckCircle2,
		color: '#10b981',
		description: 'High maintainability index with clear module separation.',
	},
	{
		id: 'dim-readability',
		name: 'Readability',
		score: 88,
		status: 'HEALTHY',
		trend: 'up',
		delta: 2.1,
		icon: FileText,
		color: '#06b6d4',
		description: 'Clean naming conventions and explicit domain contracts.',
	},
	{
		id: 'dim-complexity',
		name: 'Complexity Index',
		score: 84,
		status: 'HEALTHY',
		trend: 'up',
		delta: 1.8,
		icon: Code2,
		color: '#8b5cf6',
		description: 'Cognitive complexity controlled across 94% of functions.',
	},
	{
		id: 'dim-testability',
		name: 'Testability',
		score: 95,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 4.0,
		icon: ShieldCheck,
		color: '#3b82f6',
		description: 'Zero hidden dependencies or global state mutations in domain code.',
	},
	{
		id: 'dim-modularity',
		name: 'Modularity',
		score: 94,
		status: 'EXCELLENT',
		trend: 'stable',
		delta: 0.0,
		icon: Layers,
		color: '#ec4899',
		description: 'Strict interface decoupling between API ingress and persistence.',
	},
	{
		id: 'dim-duplication',
		name: 'Duplication Index',
		score: 89,
		status: 'HEALTHY',
		trend: 'up',
		delta: 2.5,
		icon: Copy,
		color: '#f59e0b',
		description: 'Sub-1.5% code duplication rate across repository modules.',
	},
	{
		id: 'dim-consistency',
		name: 'Consistency',
		score: 96,
		status: 'EXCELLENT',
		trend: 'stable',
		delta: 0.0,
		icon: Activity,
		color: '#14b8a6',
		description: '100% adherence to monorepo code styling & type patterns.',
	},
	{
		id: 'dim-documentation',
		name: 'Documentation',
		score: 90,
		status: 'HEALTHY',
		trend: 'up',
		delta: 1.2,
		icon: FileText,
		color: '#a3e635',
		description: 'Up-to-date OpenAPI specs and architecture contract docs.',
	},
];

export function CodeQualityWorkspace() {
	const [activeTab, setActiveTab] = React.useState('command-center');
	const [isScanning, setIsScanning] = React.useState(false);

	const tabs = [
		{ id: 'command-center', label: 'Command Center' },
		{ id: 'quality-map', label: 'Code Quality Map' },
		{ id: 'complexity', label: 'Complexity & Hotspots' },
		{ id: 'duplication', label: 'Duplication & Coupling' },
		{ id: 'readability', label: 'Readability & Testability' },
		{ id: 'refactoring-sim', label: 'Refactoring Simulator' },
		{ id: 'ai-reviewer', label: 'AI Reviewer & Time Machine' },
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
							<CheckCircle2 className="w-6 h-6 animate-pulse" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									Code Quality Intelligence Center
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-full uppercase">
									STRUCTURAL AI INTELLIGENCE
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Discover → Inspect → Understand → Explain → Improve → Verify
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
							<span>{isScanning ? 'Analyzing AST Surfaces...' : 'Trigger Quality Analysis'}</span>
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
			{activeTab === 'command-center' && (
				<QualityCommandCenter
					overallQualityScore={94}
					maintainabilityIndex={92}
					duplicationRatePercent={1.2}
					testCoveragePercent={94}
					architectureAlignmentPercent={98}
					dimensions={SAMPLE_QUALITY_DIMENSIONS}
					onSelectDimension={() => setActiveTab('quality-map')}
				/>
			)}

			{activeTab === 'quality-map' && <CodeQualityMap />}

			{activeTab === 'complexity' && <ComplexityHotspotsPanel />}

			{activeTab === 'duplication' && <DuplicationCouplingPanel />}

			{activeTab === 'readability' && <ReadabilityTestabilityPanel />}

			{activeTab === 'refactoring-sim' && <RefactoringSimulatorStudio />}

			{activeTab === 'ai-reviewer' && <AIQualityReviewerTimeline />}
		</div>
	);
}
