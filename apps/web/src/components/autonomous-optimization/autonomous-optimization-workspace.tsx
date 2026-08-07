'use client';

import * as React from 'react';
import { OptimizationCommandCenter, OptimizationCategoryCard } from './optimization-command-center';
import { PrioritizedQueueQuickWins } from './prioritized-queue-quickwins';
import { IsolatedWorkspaceDiff } from './isolated-workspace-diff';
import { ValidationPipelineSafety } from './validation-pipeline-safety';
import { OptimizationSimulatorPR } from './optimization-simulator-pr';
import { OptimizationHistoryAudit } from './optimization-history-audit';
import { AIStaffEngineerTimeline } from './ai-staff-engineer-timeline';
import {
	Bot,
	Sparkles,
	ShieldCheck,
	Zap,
	Layers,
	Code2,
	Boxes,
	Activity,
	CheckCircle2,
	RefreshCw,
	Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SAMPLE_OPTIMIZATION_CATEGORIES: OptimizationCategoryCard[] = [
	{
		id: 'cat-arch',
		categoryName: 'Architecture Boundary Optimization',
		opportunitiesCount: 2,
		potentialHealthGain: 4.1,
		effort: 'MEDIUM',
		risk: 'LOW',
		confidencePercent: 96,
		icon: Layers,
		color: '#3b82f6',
	},
	{
		id: 'cat-quality',
		categoryName: 'Code Quality & Complexity',
		opportunitiesCount: 4,
		potentialHealthGain: 3.2,
		effort: 'LOW',
		risk: 'LOW',
		confidencePercent: 98,
		icon: Code2,
		color: '#06b6d4',
	},
	{
		id: 'cat-debt',
		categoryName: 'Technical Debt Refactoring',
		opportunitiesCount: 3,
		potentialHealthGain: 8.0,
		effort: 'LOW',
		risk: 'LOW',
		confidencePercent: 99,
		icon: RefreshCw,
		color: '#f59e0b',
	},
	{
		id: 'cat-sec',
		categoryName: 'Security Controls Guard',
		opportunitiesCount: 1,
		potentialHealthGain: 3.8,
		effort: 'LOW',
		risk: 'LOW',
		confidencePercent: 99,
		icon: ShieldCheck,
		color: '#10b981',
	},
	{
		id: 'cat-perf',
		categoryName: 'Performance Latency Optimization',
		opportunitiesCount: 2,
		potentialHealthGain: 8.0,
		effort: 'LOW',
		risk: 'LOW',
		confidencePercent: 98,
		icon: Zap,
		color: '#f97316',
	},
];

export function AutonomousOptimizationWorkspace() {
	const [activeTab, setActiveTab] = React.useState('command-center');
	const [activeAutonomyLevel, setActiveAutonomyLevel] = React.useState<number>(4); // Default: LEVEL 4 — VALIDATE
	const [isScanning, setIsScanning] = React.useState(false);

	const tabs = [
		{ id: 'command-center', label: 'Optimization Command Center' },
		{ id: 'queue', label: 'Prioritized Queue & Quick Wins' },
		{ id: 'workspace-diff', label: 'Isolated Workspace & Diff' },
		{ id: 'validation', label: 'Validation Pipeline & Safety' },
		{ id: 'simulator-pr', label: 'Optimization Simulator & PR' },
		{ id: 'history', label: 'History & Audit Trail' },
		{ id: 'staff-engineer', label: 'AI Staff Engineer & Learning' },
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
							<Bot className="w-6 h-6 animate-pulse" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									Autonomous Repository Optimization Engine
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-full uppercase">
									CONTROLLED AUTONOMY LOOP
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Detect → Understand → Explain → Prioritize → Plan → Simulate → Prepare Change → Validate → Developer Approval → Apply → Monitor → Learn
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
							<span>{isScanning ? 'Executing Autonomous Discovery...' : 'Trigger Autonomous Optimization'}</span>
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
				<OptimizationCommandCenter
					activeAutonomyLevel={activeAutonomyLevel}
					onSelectAutonomyLevel={(lvl) => setActiveAutonomyLevel(lvl)}
					categories={SAMPLE_OPTIMIZATION_CATEGORIES}
					onSelectCategory={() => setActiveTab('queue')}
				/>
			)}

			{activeTab === 'queue' && (
				<PrioritizedQueueQuickWins onInspectPatch={() => setActiveTab('workspace-diff')} />
			)}

			{activeTab === 'workspace-diff' && <IsolatedWorkspaceDiff />}

			{activeTab === 'validation' && <ValidationPipelineSafety />}

			{activeTab === 'simulator-pr' && <OptimizationSimulatorPR />}

			{activeTab === 'history' && <OptimizationHistoryAudit />}

			{activeTab === 'staff-engineer' && <AIStaffEngineerTimeline />}
		</div>
	);
}
