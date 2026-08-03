'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
	Brain,
	Clock,
	Play,
	Pause,
	RotateCcw,
	Calendar,
	History,
	GitCommit,
	TrendingUp,
	TrendingDown,
	ShieldAlert,
	Sparkles,
	Search,
	Columns,
	Layers,
	FileText,
	Database,
	Server,
	ChevronRight,
	Zap,
	Activity,
	ArrowRight,
	Lock,
	CheckCircle2,
	AlertCircle,
	Building2,
	Flame,
	Radio,
	HelpCircle,
	ArrowUpRight,
	Share2,
	Download,
	Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Milestone Snapshot Interface
interface MilestoneSnapshot {
	id: string;
	label: string;
	timeAgo: string;
	date: string;
	healthScore: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	architectureType: string;
	repoSize: string;
	commitCount: number;
	serviceCount: number;
	apiCount: number;
	techDebt: string;
	activeCVEs: number;
	aiSummary: string;
	majorEvents: string[];
	nodes: Array<{ id: string; name: string; type: string; status: string }>;
}

// Historical AI Q&A Interface
interface HistoricalQA {
	query: string;
	answer: string;
	timestamp: string;
	author: string;
	commitHash: string;
	decisionRecord: string;
	confidence: number;
}

export function SoftwareMemoryTimeMachine() {
	// Active Milestone Index (0: Today, 1: Last Week, 2: Last Month, 3: 3 Months, 4: 6 Months, 5: 1 Year)
	const [activeSnapshotIdx, setActiveSnapshotIdx] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');

	// AI Historical Memory Query State
	const [aiQueryInput, setAiQueryInput] = useState<string>('');
	const [aiLoading, setAiLoading] = useState<boolean>(false);
	const [activeQA, setActiveQA] = useState<HistoricalQA | null>(null);

	// Historical Snapshot Database (Memory Store)
	const snapshots: MilestoneSnapshot[] = [
		{
			id: 'snap-today',
			label: 'Today',
			timeAgo: 'Now',
			date: 'Aug 3, 2026',
			healthScore: 94.2,
			riskLevel: 'LOW',
			architectureType: 'Event-Driven Async Microservices',
			repoSize: '142.8 MB',
			commitCount: 3840,
			serviceCount: 14,
			apiCount: 42,
			techDebt: '$4.2k/yr',
			activeCVEs: 0,
			aiSummary:
				'Repository is highly optimized with 94.2 health index. Kafka event stream decoupled payment processing.',
			majorEvents: [
				'Deployed Kafka Event Broker cluster',
				'Upgraded Pydantic to v2 async settings',
				'Zero critical security vulnerabilities',
			],
			nodes: [
				{ id: '1', name: 'AuthGatewayController', type: 'service', status: 'active' },
				{ id: '2', name: 'PaymentMicroservice', type: 'service', status: 'active' },
				{ id: '3', name: 'KafkaEventBroker', type: 'queue', status: 'added' },
				{ id: '4', name: 'RedisCluster', type: 'database', status: 'active font-bold' },
				{ id: '5', name: 'PostgreSQLPrimaryDB', type: 'database', status: 'active' },
			],
		},
		{
			id: 'snap-1w',
			label: 'Last Week',
			timeAgo: '7 days ago',
			date: 'Jul 27, 2026',
			healthScore: 91.5,
			riskLevel: 'LOW',
			architectureType: 'Decoupled Monolith + Redis',
			repoSize: '138.4 MB',
			commitCount: 3790,
			serviceCount: 12,
			apiCount: 38,
			techDebt: '$6.8k/yr',
			activeCVEs: 1,
			aiSummary:
				'Redis cluster integration completed. Restructured authentication JWT token caching mechanism.',
			majorEvents: [
				'Integrated Redis token cache for 12ms latency',
				'Fixed JWT secret rotation vault memory leak',
			],
			nodes: [
				{ id: '1', name: 'AuthGatewayController', type: 'service', status: 'active' },
				{ id: '2', name: 'PaymentService', type: 'service', status: 'active' },
				{ id: '4', name: 'RedisCluster', type: 'database', status: 'added' },
				{ id: '5', name: 'PostgreSQLPrimaryDB', type: 'database', status: 'active' },
			],
		},
		{
			id: 'snap-1m',
			label: 'Last Month',
			timeAgo: '30 days ago',
			date: 'Jul 3, 2026',
			healthScore: 86.0,
			riskLevel: 'MEDIUM',
			architectureType: 'Modular Monolith',
			repoSize: '124.0 MB',
			commitCount: 3620,
			serviceCount: 9,
			apiCount: 31,
			techDebt: '$14.5k/yr',
			activeCVEs: 3,
			aiSummary:
				'Modular monolith boundaries defined. High database connection pool lock contention observed under heavy loads.',
			majorEvents: [
				'Modular monolith package refactoring',
				'Detected PostgreSQL query pool saturation at 15k req/sec',
			],
			nodes: [
				{ id: '1', name: 'AuthGatewayController', type: 'service', status: 'active' },
				{ id: '2', name: 'MonolithicPayment', type: 'service', status: 'risk' },
				{ id: '5', name: 'PostgreSQLPrimaryDB', type: 'database', status: 'active' },
			],
		},
		{
			id: 'snap-3m',
			label: '3 Months Ago',
			timeAgo: '90 days ago',
			date: 'May 3, 2026',
			healthScore: 78.4,
			riskLevel: 'MEDIUM',
			architectureType: 'Monolithic Express + REST',
			repoSize: '98.2 MB',
			commitCount: 3140,
			serviceCount: 5,
			apiCount: 22,
			techDebt: '$28.0k/yr',
			activeCVEs: 5,
			aiSummary:
				'Monolithic application experiencing frequent latency spikes due to direct inline SQL database access.',
			majorEvents: [
				'Added Stripe checkout adapter',
				'Refactored legacy REST routing handlers',
			],
			nodes: [
				{ id: '1', name: 'MonolithicAppEngine', type: 'service', status: 'risk' },
				{ id: '5', name: 'PostgreSQLPrimaryDB', type: 'database', status: 'active' },
			],
		},
		{
			id: 'snap-6m',
			label: '6 Months Ago',
			timeAgo: '180 days ago',
			date: 'Feb 3, 2026',
			healthScore: 71.0,
			riskLevel: 'HIGH',
			architectureType: 'Single Monolith Core',
			repoSize: '64.5 MB',
			commitCount: 2410,
			serviceCount: 3,
			apiCount: 14,
			techDebt: '$42.1k/yr',
			activeCVEs: 8,
			aiSummary:
				'Initial production rollout. High coupling across authentication and billing methods causing tech debt accumulation.',
			majorEvents: ['First production launch on EKS', 'Added OAuth2 Google & GitHub logins'],
			nodes: [
				{ id: '1', name: 'MonolithicCoreServer', type: 'service', status: 'risk' },
				{ id: '5', name: 'LegacyMySQLDB', type: 'database', status: 'removed' },
			],
		},
		{
			id: 'snap-1y',
			label: '1 Year Ago',
			timeAgo: '365 days ago',
			date: 'Aug 3, 2025',
			healthScore: 62.5,
			riskLevel: 'CRITICAL',
			architectureType: 'Prototype / Scaffold',
			repoSize: '18.1 MB',
			commitCount: 420,
			serviceCount: 1,
			apiCount: 6,
			techDebt: '$65.0k/yr',
			activeCVEs: 12,
			aiSummary: 'Repository initialized with basic boilerplate scaffold and mock endpoints.',
			majorEvents: ['Initial commit', 'Setup CI/CD GitHub Actions workflow'],
			nodes: [{ id: '1', name: 'ScaffoldServer', type: 'service', status: 'active' }],
		},
	];

	const currentSnap = snapshots[activeSnapshotIdx] || snapshots[0];

	// Play History Timeline Animation Timer
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isPlaying) {
			timer = setInterval(() => {
				setActiveSnapshotIdx((prev) => {
					if (prev >= snapshots.length - 1) {
						setIsPlaying(false);
						return prev;
					}
					return prev + 1;
				});
			}, 2200);
		}
		return () => clearInterval(timer);
	}, [isPlaying, snapshots.length]);

	// Historical Q&A Handler
	const handleAIQuestion = (customQuery?: string) => {
		const q = customQuery || aiQueryInput;
		if (!q.trim()) return;

		setAiLoading(true);
		setTimeout(() => {
			if (q.toLowerCase().includes('kafka')) {
				setActiveQA({
					query: q,
					answer:
						'Kafka was introduced 12 days ago (Commit #a8f42d1) by Senior Platform Engineer Sarah Chen to decouple high-volume payment processing webhooks from direct PostgreSQL transactions.',
					timestamp: 'Jul 22, 2026',
					author: 'Sarah Chen (Platform Infra Lead)',
					commitHash: 'a8f42d1e',
					decisionRecord: 'ADR-042: Asynchronous Event Streaming Architecture',
					confidence: 98.4,
				});
			} else if (q.toLowerCase().includes('redis')) {
				setActiveQA({
					query: q,
					answer:
						'Redis Cluster was added on Jul 27, 2026 to cache JWT authentication tokens and drop session validation latency from 45ms down to 1.2ms under 50k req/sec traffic spikes.',
					timestamp: 'Jul 27, 2026',
					author: 'DevOps & Security Core Team',
					commitHash: 'c94e019b',
					decisionRecord: 'ADR-038: In-Memory Token Session Caching',
					confidence: 96.8,
				});
			} else {
				setActiveQA({
					query: q,
					answer: `Historical Analysis for "${q}": Based on 3,840 commits and 6 architecture snapshots, the codebase evolved from a single scaffold monolith into an Event-Driven Async Microservices pattern. Health score improved from 62.5 to 94.2.`,
					timestamp: currentSnap.date,
					author: 'CodeAtlas Software Memory Engine',
					commitHash: 'f4019ab3',
					decisionRecord: 'ADR-045: Continuous Architectural Evolution',
					confidence: 94.5,
				});
			}
			setAiLoading(false);
		}, 900);
	};

	return (
		<div className="flex flex-col min-h-[calc(100vh-5rem)] bg-slate-950 text-white font-sans overflow-hidden rounded-2xl border border-slate-800/90 shadow-2xl relative select-none">
			{/* Top Control Bar */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 font-mono text-xs gap-3 shrink-0">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
						<Brain className="w-5 h-5" />
					</div>
					<div>
						<h1 className="font-black text-white text-base flex items-center gap-2">
							Software Memory & Time Machine
							<span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
								APPLE TIME MACHINE + NOTION + FIGMA
							</span>
						</h1>
						<p className="text-[11px] text-slate-400 font-sans">
							Travel through historical codebase snapshots, inspect architectural evolution, and query repository memory.
						</p>
					</div>
				</div>

				{/* Global Actions */}
				<div className="flex items-center gap-2">
					<button
						onClick={() => setIsCompareMode((prev) => !prev)}
						className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
							isCompareMode
								? 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-sm'
								: 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
						}`}
					>
						<Columns className="w-3.5 h-3.5 text-purple-400" /> {isCompareMode ? 'Exit Compare' : 'Compare Mode'}
					</button>

					<button
						onClick={() => {
							setActiveSnapshotIdx(0);
							setIsPlaying(false);
						}}
						className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5"
					>
						<RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Jump to Today
					</button>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* TIME MACHINE TIMELINE SCRUBBER BAR */}
			{/* ========================================================================= */}
			<div className="bg-slate-900/90 border-b border-slate-800 p-4 font-mono space-y-3 shrink-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setIsPlaying((p) => !p)}
							className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
						>
							{isPlaying ? (
								<>
									<Pause className="w-3.5 h-3.5" /> Pause History
								</>
							) : (
								<>
									<Play className="w-3.5 h-3.5" /> Play History Animation
								</>
							)}
						</button>

						<span className="text-xs text-slate-400 font-sans">
							Active Milestone: <strong className="text-purple-300">{currentSnap.label}</strong> ({currentSnap.date})
						</span>
					</div>

					<div className="flex items-center gap-4 text-xs">
						<span className="text-slate-400">Health: <strong className="text-emerald-400">{currentSnap.healthScore}</strong></span>
						<span className="text-slate-400">Risk: <strong className="text-amber-400">{currentSnap.riskLevel}</strong></span>
						<span className="text-slate-400">Commits: <strong className="text-cyan-300">{currentSnap.commitCount}</strong></span>
					</div>
				</div>

				{/* Interactive Timeline Slider / Milestones */}
				<div className="relative pt-2 pb-1">
					<div className="h-2 w-full bg-slate-950 rounded-full border border-slate-800 relative flex items-center justify-between px-2">
						{snapshots.map((s, idx) => {
							const isActive = idx === activeSnapshotIdx;
							return (
								<button
									key={s.id}
									onClick={() => {
										setActiveSnapshotIdx(idx);
										setIsPlaying(false);
									}}
									className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center relative group z-10 ${
										isActive
											? 'bg-purple-500 border-white scale-125 shadow-lg shadow-purple-500/50'
											: 'bg-slate-900 border-slate-700 hover:border-purple-400'
									}`}
								>
									{isActive && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}

									{/* Milestone Hover Label */}
									<div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-purple-300 whitespace-nowrap pointer-events-none shadow-xl">
										{s.label} • {s.date}
									</div>
								</button>
							);
						})}
					</div>

					{/* Timeline Labels */}
					<div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase pt-2">
						{snapshots.map((s, idx) => (
							<span
								key={s.id}
								onClick={() => setActiveSnapshotIdx(idx)}
								className={`cursor-pointer hover:text-white transition-colors ${
									idx === activeSnapshotIdx ? 'text-purple-400 font-black' : ''
								}`}
							>
								{s.label}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* MAIN WORKSPACE CONTENT: DUAL VIEW (COMPARE MODE) OR SINGLE MEMORY VIEW */}
			{/* ========================================================================= */}
			<div className="flex flex-1 overflow-hidden font-mono">
				{/* ------------------------------------------------------------------------- */}
				{/* LEFT/MAIN CONTAINER: REPOSITORY TIME MACHINE CANVAS & METRICS */}
				{/* ------------------------------------------------------------------------- */}
				<div className="flex-1 flex flex-col bg-slate-950 overflow-y-auto p-5 space-y-5">
					{/* Snapshot Header HUD */}
					<div className="glass-card rounded-2xl p-5 border border-slate-800/80 bg-slate-900/60 space-y-4 shadow-xl">
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
										Historical Snapshot
									</span>
									<span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
										{currentSnap.date} ({currentSnap.timeAgo})
									</span>
								</div>
								<h2 className="text-lg font-black text-white">{currentSnap.architectureType}</h2>
							</div>

							<div className="flex items-center gap-3">
								<div className="text-right">
									<span className="text-[9px] text-slate-500 uppercase font-bold block">Health Index</span>
									<span className="text-xl font-black text-emerald-400">{currentSnap.healthScore}</span>
								</div>
								<div className="text-right border-l border-slate-800 pl-3">
									<span className="text-[9px] text-slate-500 uppercase font-bold block">Tech Debt</span>
									<span className="text-xl font-black text-rose-400">{currentSnap.techDebt}</span>
								</div>
							</div>
						</div>

						{/* AI Summary Banner */}
						<div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-slate-300 font-sans leading-relaxed flex items-start gap-2.5">
							<Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
							<span>{currentSnap.aiSummary}</span>
						</div>

						{/* Milestone Major Events */}
						<div className="space-y-2">
							<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
								Major Historical Events
							</span>
							<div className="grid gap-2 md:grid-cols-3 text-xs">
								{currentSnap.majorEvents.map((event, i) => (
									<div
										key={i}
										className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 flex items-center gap-2 font-sans"
									>
										<CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
										<span>{event}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Compare Mode Side-by-Side Panel (Active when Compare Mode is enabled) */}
					{isCompareMode && (
						<div className="glass-card rounded-2xl p-5 border border-purple-500/40 bg-slate-900/80 space-y-4 animate-fade-in">
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<span className="text-xs font-black uppercase text-purple-300 flex items-center gap-2">
									<Columns className="w-4 h-4 text-purple-400" /> Side-by-Side Time Machine Comparison
								</span>
								<span className="text-xs text-slate-400 font-bold">
									Today (Aug 3) VS {currentSnap.label} ({currentSnap.date})
								</span>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
								{/* Left: Current State */}
								<div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-3">
									<h4 className="font-bold text-emerald-400 border-b border-slate-800 pb-2">
										Current State (Today)
									</h4>
									<div className="space-y-1.5 text-slate-300">
										<p>• Health Index: <strong className="text-emerald-400">94.2</strong> (+31.7 delta)</p>
										<p>• Tech Debt: <strong className="text-emerald-300">$4.2k/yr</strong> (-$60.8k reduction)</p>
										<p>• Architecture: Event-Driven Async Microservices</p>
										<p>• Microservices Count: 14 Active Services</p>
									</div>
								</div>

								{/* Right: Historical State */}
								<div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 space-y-3">
									<h4 className="font-bold text-rose-400 border-b border-slate-800 pb-2">
										Historical State ({currentSnap.label})
									</h4>
									<div className="space-y-1.5 text-slate-300">
										<p>• Health Index: <strong className="text-rose-400">{currentSnap.healthScore}</strong></p>
										<p>• Tech Debt: <strong className="text-rose-400">{currentSnap.techDebt}</strong></p>
										<p>• Architecture: {currentSnap.architectureType}</p>
										<p>• Active CVEs: {currentSnap.activeCVEs} Vulnerabilities</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* 10 Automated AI Trend Detectors Grid */}
					<div className="space-y-3">
						<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
							Automated AI Historical Trend Insights (10)
						</span>

						<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5 text-xs">
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[10px] text-slate-400 uppercase font-bold block">Arch Drift</span>
								<span className="font-bold text-emerald-400">+12% Modularized</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[10px] text-slate-400 uppercase font-bold block">Tech Debt</span>
								<span className="font-bold text-emerald-400">-93.5% Reduced</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[10px] text-slate-400 uppercase font-bold block">Dependencies</span>
								<span className="font-bold text-cyan-300">Tree-Shaken</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[10px] text-slate-400 uppercase font-bold block">Repo Growth</span>
								<span className="font-bold text-purple-300">142.8 MB (+680%)</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[10px] text-slate-400 uppercase font-bold block">Security Trend</span>
								<span className="font-bold text-emerald-400">Zero Critical CVEs</span>
							</div>
						</div>
					</div>
				</div>

				{/* ------------------------------------------------------------------------- */}
				{/* RIGHT CONTAINER: AI HISTORICAL MEMORY QA ASSISTANT */}
				{/* ------------------------------------------------------------------------- */}
				<div className="w-80 border-l border-slate-800/80 bg-slate-950/90 p-4 flex flex-col justify-between shrink-0 font-mono space-y-4 overflow-y-auto">
					<div className="space-y-4">
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<span className="text-[10px] font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
								<Brain className="w-4 h-4 text-purple-400" /> AI Memory Assistant
							</span>
							<span className="text-[10px] text-emerald-400 font-bold">MEMORY ACTIVE</span>
						</div>

						{/* 8 Preset Historical Questions */}
						<div className="space-y-2">
							<span className="text-[10px] text-slate-400 font-bold uppercase block">
								Ask Software Memory:
							</span>
							<div className="space-y-1.5 text-xs">
								{[
									'Why was Kafka introduced?',
									'When did technical debt increase?',
									'Why does Payment use Redis?',
									'Explain architecture evolution',
									'Show repository growth',
									'Summarize engineering history',
									'Find major architectural decisions',
									'Generate repository changelog',
								].map((q, idx) => (
									<button
										key={idx}
										onClick={() => handleAIQuestion(q)}
										className="w-full text-left p-2 rounded-xl bg-slate-900 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-all font-sans text-[11px] flex items-center justify-between group"
									>
										<span>{q}</span>
										<ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
									</button>
								))}
							</div>
						</div>

						{/* Custom Question Input */}
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleAIQuestion();
							}}
							className="space-y-2 pt-2 border-t border-slate-800"
						>
							<input
								type="text"
								value={aiQueryInput}
								onChange={(e) => setAiQueryInput(e.target.value)}
								placeholder="Ask why a service, dependency, or file changed..."
								className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
							/>
							<Button
								type="submit"
								disabled={aiLoading || !aiQueryInput.trim()}
								className="w-full h-8 text-[11px] font-bold bg-purple-600 hover:bg-purple-500 text-white gap-1.5"
							>
								{aiLoading ? 'Searching Memory...' : 'Ask Software Memory'}
							</Button>
						</form>

						{/* Answer Card Output */}
						{activeQA && (
							<div className="glass-card rounded-2xl p-4 border border-purple-500/40 bg-slate-900/90 space-y-3 text-xs animate-fade-in">
								<div className="flex items-center justify-between border-b border-slate-800 pb-2">
									<span className="font-bold text-purple-300">Answer</span>
									<span className="text-[10px] text-emerald-400 font-bold">{activeQA.confidence}% CONF</span>
								</div>
								<p className="text-slate-300 font-sans leading-relaxed text-[11px]">{activeQA.answer}</p>
								<div className="space-y-1 text-[10px] text-slate-400 border-t border-slate-800 pt-2 font-mono">
									<p>Author: <span className="text-slate-200">{activeQA.author}</span></p>
									<p>Commit: <span className="text-cyan-300">#{activeQA.commitHash}</span></p>
									<p>Record: <span className="text-purple-300">{activeQA.decisionRecord}</span></p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
