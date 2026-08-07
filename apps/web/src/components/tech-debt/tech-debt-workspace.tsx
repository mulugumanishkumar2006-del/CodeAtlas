'use client';

import * as React from 'react';
import { TechDebtCommandCenter, DebtCategoryItem } from './tech-debt-command-center';
import { DebtHeatmapVisualizer } from './debt-heatmap-visualizer';
import { DebtHotspotMap } from './debt-hotspot-map';
import { DebtOriginInvestigator } from './debt-origin-investigator';
import { DebtPropagationGraph } from './debt-propagation-graph';
import { DebtCostModel } from './debt-cost-model';
import { DebtRemediationSimulation } from './debt-remediation-simulation';
import { AIRefactoringAdvisorForecast } from './ai-refactoring-advisor-forecast';
import { QuickWinsDetector } from './quick-wins-detector';
import {
	Flame,
	Layers,
	Code2,
	CheckSquare,
	BookOpen,
	ShieldAlert,
	Server,
	Activity,
	Sparkles,
	Building2,
	ChevronDown,
	RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SAMPLE_DEBT_CATEGORIES: DebtCategoryItem[] = [
	{
		id: 'cat-arch',
		name: 'Architecture Debt',
		score: 72,
		count: 8,
		estimatedHours: 110,
		monthlyCost: 4500,
		trend: 'up',
		delta: 2.5,
		icon: Layers,
		color: '#6366f1',
		description: 'Circular dependencies in payment processor and tight module coupling.',
	},
	{
		id: 'cat-code',
		name: 'Code Debt',
		score: 68,
		count: 14,
		estimatedHours: 95,
		monthlyCost: 3800,
		trend: 'down',
		delta: -1.2,
		icon: Code2,
		color: '#f59e0b',
		description: 'God classes exceeding 1,500 LOC and high cyclomatic complexity.',
	},
	{
		id: 'cat-test',
		name: 'Testing Debt',
		score: 58,
		count: 12,
		estimatedHours: 54,
		monthlyCost: 2200,
		trend: 'stable',
		delta: 0.0,
		icon: CheckSquare,
		color: '#10b981',
		description: 'Low statement coverage (42%) on payment processor and order engine.',
	},
	{
		id: 'cat-doc',
		name: 'Documentation Debt',
		score: 42,
		count: 6,
		estimatedHours: 18,
		monthlyCost: 800,
		trend: 'down',
		delta: -3.0,
		icon: BookOpen,
		color: '#3b82f6',
		description: 'Missing typed docstrings on knowledge graph endpoints.',
	},
	{
		id: 'cat-dep',
		name: 'Dependency Debt',
		score: 35,
		count: 4,
		estimatedHours: 12,
		monthlyCost: 500,
		trend: 'stable',
		delta: 0.0,
		icon: Activity,
		color: '#8b5cf6',
		description: 'Deprecated v1 adapter exports remaining in index bundle.',
	},
	{
		id: 'cat-infra',
		name: 'Infrastructure Debt',
		score: 48,
		count: 5,
		estimatedHours: 26,
		monthlyCost: 1100,
		trend: 'up',
		delta: 1.0,
		icon: Server,
		color: '#f97316',
		description: 'Synchronous DB query execution in worker thread pool.',
	},
	{
		id: 'cat-sec',
		name: 'Security Debt',
		score: 82,
		count: 3,
		estimatedHours: 30,
		monthlyCost: 1300,
		trend: 'up',
		delta: 4.2,
		icon: ShieldAlert,
		color: '#ef4444',
		description: 'Unsanitized raw SQL string formatting in analytics query handler.',
	},
];

export function TechDebtWorkspace() {
	const [activeTab, setActiveTab] = React.useState('command-center');
	const [selectedRepo, setSelectedRepo] = React.useState('codeatlas-main');
	const [isScanning, setIsScanning] = React.useState(false);

	const tabs = [
		{ id: 'command-center', label: 'Command Center' },
		{ id: 'heatmap', label: 'Debt Heatmap' },
		{ id: 'hotspots', label: 'Hotspots & Origin' },
		{ id: 'propagation', label: 'Propagation Graph' },
		{ id: 'cost', label: 'Cost & Risk Model' },
		{ id: 'remediation', label: 'Remediation & Simulation' },
		{ id: 'advisor', label: 'AI Advisor & Forecast' },
		{ id: 'quick-wins', label: 'Quick Wins' },
	];

	const handleScan = () => {
		setIsScanning(true);
		setTimeout(() => setIsScanning(false), 1500);
	};

	// Keyboard shortcut listener
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
		<div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1700px] mx-auto selection:bg-amber-500/30 selection:text-amber-200 font-mono">
			{/* Top Workspace Header */}
			<div className="flex flex-col gap-5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl relative overflow-hidden">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 z-10">
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-950">
							<Flame className="w-6 h-6 animate-pulse" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									Technical Debt Intelligence Engine
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-amber-300 bg-amber-950/80 border border-amber-500/40 rounded-full uppercase">
									LIVING SYSTEM
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Explore → Discover → Investigate → Understand → Decide → Improve
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button
							onClick={handleScan}
							disabled={isScanning}
							className={cn(
								'flex items-center gap-2 font-mono text-xs px-4 py-2.5 rounded-xl border shadow-lg transition-all',
								isScanning
									? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
									: 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white border-amber-400/30'
							)}
						>
							<RefreshCw className={cn('w-4 h-4', isScanning && 'animate-spin')} />
							<span>{isScanning ? 'Scanning AST Surfaces...' : 'Continuous Debt Scan'}</span>
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
											? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-950'
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

			{/* Main Workspace View Tab Content */}
			{activeTab === 'command-center' && (
				<TechDebtCommandCenter
					overallDebtScore={54}
					debtGrowthRate={1.2}
					debtReductionRate={-3.4}
					criticalDebtCount={3}
					highImpactCount={8}
					quickWinsCount={4}
					categories={SAMPLE_DEBT_CATEGORIES}
					onSelectCategory={() => setActiveTab('heatmap')}
				/>
			)}

			{activeTab === 'heatmap' && <DebtHeatmapVisualizer />}

			{activeTab === 'hotspots' && (
				<div className="space-y-8">
					<DebtHotspotMap />
					<DebtOriginInvestigator />
				</div>
			)}

			{activeTab === 'propagation' && <DebtPropagationGraph />}

			{activeTab === 'cost' && <DebtCostModel />}

			{activeTab === 'remediation' && <DebtRemediationSimulation />}

			{activeTab === 'advisor' && <AIRefactoringAdvisorForecast />}

			{activeTab === 'quick-wins' && <QuickWinsDetector />}
		</div>
	);
}
