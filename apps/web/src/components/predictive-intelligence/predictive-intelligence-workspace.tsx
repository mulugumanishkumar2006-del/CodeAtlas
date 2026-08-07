'use client';

import * as React from 'react';
import { PredictiveCommandCenter, PredictiveDomainCard } from './predictive-command-center';
import { DomainForecastEngines } from './domain-forecast-engines';
import { PredictiveHotspotsAlerts } from './predictive-hotspots-alerts';
import { WhatIfPredictionEngine } from './what-if-prediction-engine';
import { PreventiveRoadmap } from './preventive-roadmap';
import { PredictionAccuracyCenter } from './prediction-accuracy-center';
import { AIPredictiveAdvisorTimeline } from './ai-predictive-advisor-timeline';
import {
	BrainCircuit,
	TrendingUp,
	ShieldCheck,
	Zap,
	Layers,
	Code2,
	Boxes,
	Activity,
	CheckCircle2,
	RefreshCw,
	Sparkles,
	Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SAMPLE_PREDICTIVE_DOMAINS: PredictiveDomainCard[] = [
	{
		id: 'dom-health',
		domainName: 'Repository Health Forecast',
		currentStateScore: 94,
		projectedScore: 97,
		confidenceRating: 'HIGH_CONFIDENCE',
		confidencePercent: 98,
		timeHorizon: '90 Days',
		primaryDriver: 'Zero-trust auth sweep & domain contract isolation',
		recommendedAction: 'Maintain current zero-trust architecture boundary enforcement.',
		icon: BrainCircuit,
		color: '#06b6d4',
	},
	{
		id: 'dom-debt',
		domainName: 'Technical Debt Forecast',
		currentStateScore: 68,
		projectedScore: 78,
		confidenceRating: 'HIGH_CONFIDENCE',
		confidencePercent: 98,
		timeHorizon: '90 Days',
		primaryDriver: 'PaymentProcessor circular import coupling',
		recommendedAction: 'Extract IPaymentContext interface into shared domain contracts.',
		icon: TrendingUp,
		color: '#f59e0b',
	},
	{
		id: 'dom-sec',
		domainName: 'Security Risk Forecast',
		currentStateScore: 94,
		projectedScore: 96,
		confidenceRating: 'HIGH_CONFIDENCE',
		confidencePercent: 99,
		timeHorizon: '90 Days',
		primaryDriver: 'Active secret rotation & JWT signature verification',
		recommendedAction: 'Rotate exposed Stripe test API key in commit history.',
		icon: ShieldCheck,
		color: '#10b981',
	},
	{
		id: 'dom-perf',
		domainName: 'Performance Forecast',
		currentStateScore: 96,
		projectedScore: 88,
		confidenceRating: 'MODERATE_CONFIDENCE',
		confidencePercent: 92,
		timeHorizon: '90 Days',
		primaryDriver: 'Unindexed raw SQL query formatting in metrics table',
		recommendedAction: 'Create composite index on (tenant_id, filter) in PostgreSQL metrics table.',
		icon: Zap,
		color: '#f97316',
	},
	{
		id: 'dom-arch',
		domainName: 'Architecture Risk Forecast',
		currentStateScore: 92,
		projectedScore: 94,
		confidenceRating: 'HIGH_CONFIDENCE',
		confidencePercent: 96,
		timeHorizon: '90 Days',
		primaryDriver: 'Zero circular imports outside payment module',
		recommendedAction: 'Decouple CheckoutManager from PaymentProcessor implementation.',
		icon: Layers,
		color: '#3b82f6',
	},
];

export function PredictiveIntelligenceWorkspace() {
	const [activeTab, setActiveTab] = React.useState('command-center');
	const [selectedHorizon, setSelectedHorizon] = React.useState('90d');
	const [isScanning, setIsScanning] = React.useState(false);

	const tabs = [
		{ id: 'command-center', label: 'Predictive Command Center' },
		{ id: 'forecast-engines', label: 'Domain Forecast Engines' },
		{ id: 'hotspots', label: 'Predictive Hotspots & Early Warnings' },
		{ id: 'what-if', label: 'What-If Prediction Engine' },
		{ id: 'roadmap', label: 'Preventive Roadmap' },
		{ id: 'accuracy', label: 'Prediction vs Reality (Accuracy)' },
		{ id: 'analyst', label: 'AI Advisor & Timeline' },
	];

	const horizons = [
		{ id: '7d', label: '7 Days' },
		{ id: '30d', label: '30 Days' },
		{ id: '90d', label: '90 Days' },
		{ id: '6m', label: '6 Months' },
		{ id: '1y', label: '1 Year' },
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
							<BrainCircuit className="w-6 h-6 animate-pulse" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									Predictive Repository Intelligence
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-full uppercase">
									PROACTIVE ENGINEERING FORECASTS
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Observe → Detect Trend → Predict → Explain → Investigate → Simulate → Prevent → Verify
							</p>
						</div>
					</div>

					{/* Time Horizon Filter & Trigger Button */}
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
							{horizons.map((h) => (
								<button
									key={h.id}
									onClick={() => setSelectedHorizon(h.id)}
									className={cn(
										'px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all',
										selectedHorizon === h.id
											? 'bg-purple-950/80 border border-purple-500/40 text-purple-300 shadow-md'
											: 'text-slate-400 hover:text-white'
									)}
								>
									{h.label}
								</button>
							))}
						</div>

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
							<span>{isScanning ? 'Computing Forecast Horizon...' : 'Trigger Predictive Sweep'}</span>
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
				<PredictiveCommandCenter
					predictiveHealthIndex={94}
					selectedHorizon={selectedHorizon}
					domains={SAMPLE_PREDICTIVE_DOMAINS}
					onSelectDomain={() => setActiveTab('forecast-engines')}
				/>
			)}

			{activeTab === 'forecast-engines' && <DomainForecastEngines />}

			{activeTab === 'hotspots' && <PredictiveHotspotsAlerts />}

			{activeTab === 'what-if' && <WhatIfPredictionEngine />}

			{activeTab === 'roadmap' && <PreventiveRoadmap />}

			{activeTab === 'accuracy' && <PredictionAccuracyCenter />}

			{activeTab === 'analyst' && <AIPredictiveAdvisorTimeline />}
		</div>
	);
}
