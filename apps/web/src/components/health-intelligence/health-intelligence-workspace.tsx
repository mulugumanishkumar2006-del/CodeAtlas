'use client';

import * as React from 'react';
import { HealthOverviewHeader } from './health-overview-header';
import { UnifiedHealthDashboard, HealthDimension } from './unified-health-dashboard';
import { AIHealthAnalysisPanel } from './ai-health-analysis-panel';
import { InteractiveHealthMap } from './interactive-health-map';
import { HealthTimelineMachine } from './health-timeline-machine';
import { AIHealthAdvisor } from './ai-health-advisor';
import { ActionCenter } from './action-center';
import {
	Layers,
	Flame,
	HeartPulse,
	Brain,
	BookOpen,
	Zap,
	Shield,
	Code2,
	TrendingUp,
	Wrench,
	Sparkles,
	Gauge,
	Activity,
} from 'lucide-react';

const INITIAL_DIMENSIONS: HealthDimension[] = [
	{
		id: 'dim-arch',
		name: 'Architecture Health',
		score: 88,
		weight: 0.15,
		grade: 'A',
		trend: 'up',
		trendDelta: 3.2,
		icon: Layers,
		color: '#6366f1',
		explanation: 'Clean module separation with minor circular dependency cycle in payment subsystem.',
		source: 'Architect Engine',
		keyMetric: '0.04 coupling ratio',
	},
	{
		id: 'dim-debt',
		name: 'Technical Debt',
		score: 64,
		weight: 0.15,
		grade: 'C',
		trend: 'down',
		trendDelta: -1.8,
		icon: Flame,
		color: '#f59e0b',
		explanation: '145 hours of tech debt accumulated across God classes and legacy v1 exports.',
		source: 'TechDebt Engine',
		keyMetric: '145 hrs estimated',
	},
	{
		id: 'dim-rel',
		name: 'Reliability Score',
		score: 86,
		weight: 0.12,
		grade: 'A',
		trend: 'up',
		trendDelta: 2.1,
		icon: HeartPulse,
		color: '#10b981',
		explanation: 'High MTBF index and zero uncaught exception traces in production telemetry.',
		source: 'Reliability AGI',
		keyMetric: '99.98% uptime',
	},
	{
		id: 'dim-know',
		name: 'Knowledge Health',
		score: 82,
		weight: 0.10,
		grade: 'B',
		trend: 'stable',
		trendDelta: 0.5,
		icon: Brain,
		color: '#8b5cf6',
		explanation: 'Strong bus factor (>3 maintainers per module) with minimal knowledge silos.',
		source: 'Knowledge Graph',
		keyMetric: 'Bus factor: 3.4',
	},
	{
		id: 'dim-doc',
		name: 'Documentation Health',
		score: 90,
		weight: 0.10,
		grade: 'A',
		trend: 'up',
		trendDelta: 4.0,
		icon: BookOpen,
		color: '#3b82f6',
		explanation: 'Comprehensive docstrings and auto-generated OpenAPI 3.1 specifications.',
		source: 'Doc AI Engine',
		keyMetric: '94% doc coverage',
	},
	{
		id: 'dim-perf',
		name: 'Performance Health',
		score: 85,
		weight: 0.10,
		grade: 'B',
		trend: 'up',
		trendDelta: 1.5,
		icon: Zap,
		color: '#f97316',
		explanation: 'Sub-40ms P99 API latencies; async connection pooling operating cleanly.',
		source: 'Performance AGI',
		keyMetric: '38ms P99 latency',
	},
	{
		id: 'dim-sec',
		name: 'Security Health',
		score: 92,
		weight: 0.10,
		grade: 'A',
		trend: 'up',
		trendDelta: 5.0,
		icon: Shield,
		color: '#ef4444',
		explanation: 'Zero-Trust authentication enabled; 1 dynamic SQL injection flag undergoing fix.',
		source: 'Security Scanner',
		keyMetric: '0 CVE vulnerabilities',
	},
	{
		id: 'dim-dx',
		name: 'Developer Experience',
		score: 84,
		weight: 0.05,
		grade: 'B',
		trend: 'stable',
		trendDelta: 0.8,
		icon: Code2,
		color: '#ec4899',
		explanation: 'Fast build times (<12s) and clear TypeScript interface typings.',
		source: 'Developer AGI',
		keyMetric: '11.8s build speed',
	},
	{
		id: 'dim-scale',
		name: 'Scalability Score',
		score: 87,
		weight: 0.05,
		grade: 'A',
		trend: 'up',
		trendDelta: 2.0,
		icon: TrendingUp,
		color: '#14b8a6',
		explanation: 'Horizontal auto-scaling enabled with stateless microservice boundaries.',
		source: 'Cloud Engine',
		keyMetric: '10k req/sec ready',
	},
	{
		id: 'dim-maint',
		name: 'Maintainability Index',
		score: 79,
		weight: 0.08,
		grade: 'B',
		trend: 'stable',
		trendDelta: 0.0,
		icon: Wrench,
		color: '#a3e635',
		explanation: 'Halstead complexity indices within healthy enterprise thresholds.',
		source: 'Metrics Engine',
		keyMetric: '79/100 Index',
	},
	{
		id: 'dim-test',
		name: 'Test Coverage',
		score: 78,
		weight: 0.05,
		grade: 'B',
		trend: 'up',
		trendDelta: 1.2,
		icon: Gauge,
		color: '#06b6d4',
		explanation: '78% total statement coverage across unit, integration, and E2E suites.',
		source: 'CI Test Engine',
		keyMetric: '78.4% statement coverage',
	},
	{
		id: 'dim-dep',
		name: 'Dependency Health',
		score: 91,
		weight: 0.05,
		grade: 'A',
		trend: 'stable',
		trendDelta: 0.0,
		icon: Activity,
		color: '#10b981',
		explanation: 'All package dependencies are up to date with zero known security advisories.',
		source: 'Dependency Graph',
		keyMetric: '0 outdated packages',
	},
	{
		id: 'dim-comp',
		name: 'Complexity Score',
		score: 80,
		weight: 0.05,
		grade: 'B',
		trend: 'up',
		trendDelta: 1.8,
		icon: Sparkles,
		color: '#8b5cf6',
		explanation: 'Average Cyclomatic Complexity per function is 4.2 (Low Risk).',
		source: 'AST Parser',
		keyMetric: '4.2 avg cyclomatic',
	},
	{
		id: 'dim-conf',
		name: 'AI Confidence Score',
		score: 96,
		weight: 0.05,
		grade: 'A',
		trend: 'stable',
		trendDelta: 0.0,
		icon: Brain,
		color: '#3b82f6',
		explanation: '96% confidence derived from full AST structural parsing and static analysis.',
		source: 'CodeAtlas Core AGI',
		keyMetric: '96% AST confidence',
	},
];

export function HealthIntelligenceWorkspace() {
	const [selectedRepoId, setSelectedRepoId] = React.useState('codeatlas-main');
	const [activeTab, setActiveTab] = React.useState('overview');
	const [isScanning, setIsScanning] = React.useState(false);
	const [overallScore, setOverallScore] = React.useState(87);

	// Continuous background scan simulation
	const handleTriggerScan = () => {
		setIsScanning(true);
		setTimeout(() => {
			setIsScanning(false);
			setOverallScore((prev) => Math.min(100, prev + 1));
		}, 2000);
	};

	// Keyboard Shortcut Listeners
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey) {
				if (e.key === '1') {
					e.preventDefault();
					setActiveTab('overview');
				} else if (e.key === '2') {
					e.preventDefault();
					setActiveTab('analysis');
				} else if (e.key === '3') {
					e.preventDefault();
					setActiveTab('map');
				} else if (e.key === '4') {
					e.preventDefault();
					setActiveTab('timeline');
				} else if (e.key === '5') {
					e.preventDefault();
					setActiveTab('advisor');
				} else if (e.key === '6') {
					e.preventDefault();
					setActiveTab('actions');
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1700px] mx-auto selection:bg-cyan-500/30 selection:text-cyan-200">
			{/* Top Executive Header */}
			<HealthOverviewHeader
				repoId={selectedRepoId}
				onRepoChange={setSelectedRepoId}
				overallScore={overallScore}
				grade="A"
				status="HEALTHY"
				statusColor="#10b981"
				isScanning={isScanning}
				onTriggerScan={handleTriggerScan}
				onOpenTimeMachine={() => setActiveTab('timeline')}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>

			{/* Main Tab Content */}
			{activeTab === 'overview' && (
				<UnifiedHealthDashboard
					overallScore={overallScore}
					grade="A"
					status="HEALTHY"
					statusColor="#10b981"
					headline="Your Repository Health Score is 87/100 — Production Ready with Low Risk"
					narrative="CodeAtlas AST analysis completed 1,420 files. Architecture, Security, and Reliability are operating at enterprise excellence. Recommended focus: resolve the payment processor circular import to reach a 95+ score."
					dimensions={INITIAL_DIMENSIONS}
					onSelectDimension={(id) => setActiveTab('analysis')}
					whatIsHealthy={[
						'Architecture: Zero circular imports outside payment-processor',
						'Security: Zero-Trust secrets & automated JWT verification',
						'Performance: Sub-40ms P99 latency across all service endpoints',
					]}
					whatNeedsAttention={[
						'Circular Import in payment/processor.ts',
						'God Class in order/engine.ts (1,850 LOC)',
						'Raw SQL parameterization in analytics_raw.py',
					]}
				/>
			)}

			{activeTab === 'analysis' && <AIHealthAnalysisPanel />}

			{activeTab === 'map' && <InteractiveHealthMap />}

			{activeTab === 'timeline' && <HealthTimelineMachine />}

			{activeTab === 'advisor' && <AIHealthAdvisor />}

			{activeTab === 'actions' && <ActionCenter />}
		</div>
	);
}
