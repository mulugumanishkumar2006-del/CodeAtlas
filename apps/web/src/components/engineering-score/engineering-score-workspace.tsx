'use client';

import * as React from 'react';
import { ScoreCommandCenter, ScoreDimension } from './score-command-center';
import { ScoreExplainabilityDrivers } from './score-explainability-drivers';
import { PredictiveWhatIfPlanner } from './predictive-what-if-planner';
import { PriorityEngineRoadmap } from './priority-engine-roadmap';
import { TeamRepoComparison } from './team-repo-comparison';
import { ExecutiveDeveloperViews } from './executive-developer-views';
import { AIScoreAdvisorTimeline } from './ai-score-advisor-timeline';
import {
	Gauge,
	Layers,
	Code2,
	TrendingUp,
	ShieldCheck,
	Zap,
	Activity,
	FileText,
	Boxes,
	Cpu,
	CheckCircle2,
	RefreshCw,
	Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SAMPLE_SCORE_DIMENSIONS: ScoreDimension[] = [
	{
		id: 'dim-arch',
		name: 'Architecture Health',
		score: 92,
		weightPercent: 12,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 2.5,
		href: '/architecture',
		icon: Layers,
		color: '#3b82f6',
		description: 'Zero circular dependencies or boundary violations.',
	},
	{
		id: 'dim-quality',
		name: 'Code Quality',
		score: 94,
		weightPercent: 10,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 3.2,
		href: '/code-quality',
		icon: Code2,
		color: '#06b6d4',
		description: 'High maintainability index with sub-1.5% duplication rate.',
	},
	{
		id: 'dim-debt',
		name: 'Technical Debt',
		score: 68,
		weightPercent: 10,
		status: 'WARNING',
		trend: 'down',
		delta: -2.1,
		href: '/tech-debt',
		icon: TrendingUp,
		color: '#f59e0b',
		description: 'Unindexed SQL query and payment module coupling.',
	},
	{
		id: 'dim-security',
		name: 'Security Posture',
		score: 94,
		weightPercent: 15,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 4.0,
		href: '/security',
		icon: ShieldCheck,
		color: '#10b981',
		description: 'Zero-trust verification active with zero critical vulnerabilities.',
	},
	{
		id: 'dim-perf',
		name: 'Performance Index',
		score: 96,
		weightPercent: 10,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 4.2,
		href: '/performance',
		icon: Zap,
		color: '#f97316',
		description: 'Sub-40ms P99 latency across production microservices.',
	},
	{
		id: 'dim-reliability',
		name: 'Reliability',
		score: 98,
		weightPercent: 8,
		status: 'EXCELLENT',
		trend: 'stable',
		delta: 0.0,
		href: '/reliability',
		icon: Activity,
		color: '#8b5cf6',
		description: '99.98% production availability with zero 5xx error spikes.',
	},
	{
		id: 'dim-testing',
		name: 'Testing Strategy',
		score: 94,
		weightPercent: 8,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 3.0,
		href: '/code-quality',
		icon: CheckCircle2,
		color: '#10b981',
		description: '94% unit & integration test coverage across domain contracts.',
	},
	{
		id: 'dim-docs',
		name: 'Documentation',
		score: 90,
		weightPercent: 5,
		status: 'HEALTHY',
		trend: 'up',
		delta: 1.0,
		href: '/docs',
		icon: FileText,
		color: '#a3e635',
		description: 'Up-to-date OpenAPI specs and architecture contracts.',
	},
	{
		id: 'dim-deps',
		name: 'Dependency Health',
		score: 88,
		weightPercent: 6,
		status: 'HEALTHY',
		trend: 'up',
		delta: 2.0,
		href: '/dependency-graph',
		icon: Boxes,
		color: '#ec4899',
		description: 'Safe minor version upgrades available with zero breaking changes.',
	},
	{
		id: 'dim-maint',
		name: 'Maintainability',
		score: 92,
		weightPercent: 8,
		status: 'EXCELLENT',
		trend: 'up',
		delta: 3.5,
		href: '/tech-debt',
		icon: CheckCircle2,
		color: '#14b8a6',
		description: 'Clean function decomposition and low cyclomatic complexity.',
	},
];

export function EngineeringScoreWorkspace() {
	const [activeTab, setActiveTab] = React.useState('command-center');
	const [isScanning, setIsScanning] = React.useState(false);

	const tabs = [
		{ id: 'command-center', label: 'Command Center' },
		{ id: 'drivers', label: 'Score Drivers & Explainability' },
		{ id: 'what-if', label: 'Predictive What-If Planner' },
		{ id: 'priority', label: 'Priority Engine & Roadmap' },
		{ id: 'comparison', label: 'Team & Repo Comparison' },
		{ id: 'views', label: 'Executive vs Developer View' },
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
							<Gauge className="w-6 h-6 animate-pulse" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									AI Engineering Score Center
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-full uppercase">
									SYNTHESIZED AI INTELLIGENCE
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Score → Explore → Explain → Investigate → Prioritize → Simulate → Improve → Verify
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
							<span>{isScanning ? 'Synthesizing Engineering Model...' : 'Trigger Score Sweep'}</span>
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
				<ScoreCommandCenter
					overallScore={94}
					confidencePercent={98}
					contextType="Observed Production Payment Microservice"
					dimensions={SAMPLE_SCORE_DIMENSIONS}
					onSelectDimension={() => setActiveTab('drivers')}
				/>
			)}

			{activeTab === 'drivers' && <ScoreExplainabilityDrivers />}

			{activeTab === 'what-if' && <PredictiveWhatIfPlanner />}

			{activeTab === 'priority' && <PriorityEngineRoadmap />}

			{activeTab === 'comparison' && <TeamRepoComparison />}

			{activeTab === 'views' && <ExecutiveDeveloperViews />}

			{activeTab === 'analyst' && <AIScoreAdvisorTimeline />}
		</div>
	);
}
