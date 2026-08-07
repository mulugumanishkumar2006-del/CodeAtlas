'use client';

import * as React from 'react';
import { FlowCommandCenter, FlowKPIMetric } from './flow-command-center';
import { EngineeringFlowMap } from './engineering-flow-map';
import { BottlenecksChangeRisk } from './bottlenecks-change-risk';
import { QualityVsVelocityMatrix } from './quality-vs-velocity-matrix';
import { CICDIncidentLineage } from './cicd-incident-lineage';
import { TeamHealthKnowledgeRisk } from './team-health-knowledge-risk';
import { KPISimulatorStudio } from './kpi-simulator-studio';
import { AIKPIAdvisorTimeline } from './ai-kpi-advisor-timeline';
import {
	Activity,
	GitPullRequest,
	Clock,
	Rocket,
	ShieldCheck,
	Zap,
	TrendingUp,
	CheckCircle2,
	RefreshCw,
	AlertTriangle,
	Sparkles,
	Sliders,
	Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SAMPLE_KPI_METRICS: FlowKPIMetric[] = [
	{
		id: 'kpi-velocity',
		name: 'Change Velocity',
		value: '14.2',
		unit: 'commits / day',
		status: 'EXCELLENT',
		trend: 'up',
		delta: 4.8,
		icon: Activity,
		color: '#06b6d4',
		description: 'Active commit frequency across domain microservices.',
	},
	{
		id: 'kpi-rel-freq',
		name: 'Release Frequency',
		value: '4.2',
		unit: 'releases / week',
		status: 'EXCELLENT',
		trend: 'up',
		delta: 5.1,
		icon: Rocket,
		color: '#8b5cf6',
		description: 'Automated release deployment frequency to production.',
	},
	{
		id: 'kpi-dep-freq',
		name: 'Deployment Frequency',
		value: '4.2',
		unit: 'deploys / day',
		status: 'EXCELLENT',
		trend: 'up',
		delta: 3.5,
		icon: Rocket,
		color: '#10b981',
		description: 'Production canary deployment frequency.',
	},
	{
		id: 'kpi-lead-time',
		name: 'Lead Time',
		value: '18.2',
		unit: 'hours',
		status: 'HEALTHY',
		trend: 'down',
		delta: -8.4,
		icon: Clock,
		color: '#3b82f6',
		description: 'Total elapsed time from first commit to production deployment.',
	},
	{
		id: 'kpi-cycle-time',
		name: 'Cycle Time',
		value: '4.8',
		unit: 'hours',
		status: 'HEALTHY',
		trend: 'down',
		delta: -5.2,
		icon: Clock,
		color: '#06b6d4',
		description: 'Elapsed time from PR creation to merge.',
	},
	{
		id: 'kpi-review-time',
		name: 'Review Time',
		value: '14.5',
		unit: 'hours',
		status: 'WARNING',
		trend: 'up',
		delta: 6.2,
		icon: Clock,
		color: '#f59e0b',
		description: 'Waiting time in code review queue for cross-service PRs.',
	},
	{
		id: 'kpi-pr-throughput',
		name: 'PR Throughput',
		value: '142',
		unit: 'PRs / mo',
		status: 'EXCELLENT',
		trend: 'up',
		delta: 8.2,
		icon: GitPullRequest,
		color: '#10b981',
		description: 'Merged pull request throughput across repository.',
	},
	{
		id: 'kpi-change-failure',
		name: 'Change Failure Rate',
		value: '0.0',
		unit: '%',
		status: 'EXCELLENT',
		trend: 'stable',
		delta: 0.0,
		icon: ShieldCheck,
		color: '#10b981',
		description: 'Percentage of deployments causing production incidents.',
	},
];

export function KPIIntelligenceWorkspace() {
	const [activeTab, setActiveTab] = React.useState('command-center');
	const [isScanning, setIsScanning] = React.useState(false);

	const tabs = [
		{ id: 'command-center', label: 'Flow Command Center' },
		{ id: 'flow-map', label: 'Engineering Flow Map' },
		{ id: 'bottlenecks', label: 'Bottlenecks & Change Risk' },
		{ id: 'quality-vs-velocity', label: 'Quality vs Velocity' },
		{ id: 'cicd-lineage', label: 'CI/CD & Incident Lineage' },
		{ id: 'team-health', label: 'Team Health & Knowledge Risk' },
		{ id: 'simulator', label: 'Flow Simulator' },
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
							<Activity className="w-6 h-6 animate-pulse" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									Engineering KPI Intelligence
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-full uppercase">
									SYSTEM DELIVERY FLOW
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Observe → Understand → Investigate → Identify Bottleneck → Recommend → Simulate → Improve → Verify
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
							<span>{isScanning ? 'Evaluating Delivery Flow...' : 'Trigger Flow Sweep'}</span>
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
				<FlowCommandCenter
					deliveryHealthScore={94}
					leadTimeHours={18.2}
					cycleTimeHours={4.8}
					prThroughputCount={142}
					changeFailureRatePercent={0.0}
					metrics={SAMPLE_KPI_METRICS}
					onSelectMetric={() => setActiveTab('flow-map')}
				/>
			)}

			{activeTab === 'flow-map' && <EngineeringFlowMap />}

			{activeTab === 'bottlenecks' && <BottlenecksChangeRisk />}

			{activeTab === 'quality-vs-velocity' && <QualityVsVelocityMatrix />}

			{activeTab === 'cicd-lineage' && <CICDIncidentLineage />}

			{activeTab === 'team-health' && <TeamHealthKnowledgeRisk />}

			{activeTab === 'simulator' && <KPISimulatorStudio />}

			{activeTab === 'analyst' && <AIKPIAdvisorTimeline />}
		</div>
	);
}
