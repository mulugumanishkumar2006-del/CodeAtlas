'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
	Activity,
	Radio,
	Sparkles,
	Brain,
	ShieldCheck,
	Flame,
	HeartPulse,
	Play,
	Clock,
	Layers,
	Search,
	CheckCircle2,
	AlertTriangle,
	TrendingUp,
	Server,
	Database,
	Plus,
	RefreshCw,
	FileText,
	Building2,
	Sliders,
	ArrowUpRight,
	XCircle,
	Bookmark,
	Check,
	Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// AI Activity Stream Item Schema
interface AIActivityEvent {
	id: string;
	title: string;
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
	confidence: string;
	repo: string;
	evidence: string;
	timestamp: string;
	suggestedActions: { label: string; href: string; icon: React.ElementType }[];
}

// Engineering Timeline Item Schema
interface TimelineEvent {
	id: string;
	title: string;
	category: 'Architecture' | 'Security' | 'Simulation' | 'Analysis' | 'Deployment';
	repo: string;
	timestamp: string;
	author: string;
}

// Prioritized Backlog Item Schema
interface BacklogItem {
	id: string;
	priority: 'HIGH' | 'MEDIUM' | 'LOW';
	title: string;
	expectedImpact: string;
	estimatedEffort: string;
	riskLevel: string;
	description: string;
}

export function EngineeringMissionControl() {
	const [timelineFilter, setTimelineFilter] = useState<string>('ALL');
	const [dismissedBacklog, setDismissedBacklog] = useState<string[]>([]);
	const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>([]);

	// 10 Health Scorecards HUD
	const healthMetrics = [
		{ label: 'Overall Health', score: '94.2', trend: '+2.4%', pred: 'Stable A+' },
		{ label: 'Architecture', score: '94.0%', trend: 'Zero Drift', pred: 'Enforced' },
		{ label: 'Security', score: '100%', trend: 'SOC2 Pass', pred: '0 Vulnerabilities' },
		{ label: 'Performance', score: '91.2%', trend: '+350% QPS', pred: 'Optimal' },
		{ label: 'Documentation', score: '84.0%', trend: '+5.0%', pred: 'Sufficient' },
		{ label: 'Testing', score: '87.4%', trend: '+1.2%', pred: 'Good Coverage' },
		{ label: 'Dependency', score: '92.0%', trend: '0 Audits', pred: 'Clean Tree' },
		{ label: 'Maintainability', score: '89.5%', trend: 'Low Drag', pred: 'High Velocity' },
		{ label: 'Scalability', score: '90.0%', trend: '50k req/sec', pred: 'Horizontal' },
		{ label: 'Reliability', score: '98.5%', trend: '99.99% Uptime', pred: 'HA Active' },
	];

	// Real-Time AI Activity Stream
	const aiEvents: AIActivityEvent[] = [
		{
			id: 'ai-event-1',
			title: 'AI detected circular dependency in PaymentService DAL',
			severity: 'HIGH',
			confidence: '98.4%',
			repo: 'codeatlas/payments-service',
			evidence: 'PaymentService/dal.py circular reference with UserRepository',
			timestamp: 'Just now',
			suggestedActions: [
				{ label: 'Open Investigation', href: '/investigate', icon: Brain },
				{ label: 'Simulate Fix', href: '/simulate', icon: Play },
			],
		},
		{
			id: 'ai-event-2',
			title: 'AuthGateway token validation latency improved by 45ms',
			severity: 'INFO',
			confidence: '99.1%',
			repo: 'codeatlas/auth-gateway',
			evidence: 'Redis L2 Write-Through Cache deployed in PR #145',
			timestamp: '15m ago',
			suggestedActions: [
				{ label: 'View Metrics', href: '/analytics', icon: TrendingUp },
			],
		},
		{
			id: 'ai-event-3',
			title: 'Unused legacy REST v1 API route handlers identified',
			severity: 'MEDIUM',
			confidence: '96.5%',
			repo: 'codeatlas/payments-service',
			evidence: 'legacy_router.py 0 requests over last 90 days',
			timestamp: '1h ago',
			suggestedActions: [
				{ label: 'Auto Patch Code', href: '/improve', icon: Sparkles },
			],
		},
	];

	// Engineering Timeline Log
	const timelineLog: TimelineEvent[] = [
		{
			id: 'tl-1',
			title: 'Continuous AST index updated (35 files, 4,500 LOC)',
			category: 'Analysis',
			repo: 'CodeAtlas Core Suite',
			timestamp: '10m ago',
			author: 'AI Indexer',
		},
		{
			id: 'tl-2',
			title: 'SOC2 Type II compliance posture check verified (96%)',
			category: 'Security',
			repo: 'Payments Pod',
			timestamp: '1h ago',
			author: 'Security Bot',
		},
		{
			id: 'tl-3',
			title: 'Kafka Microservices Split Simulation completed successfully',
			category: 'Simulation',
			repo: 'Analytics Pipeline',
			timestamp: '3h ago',
			author: 'Lead Architect',
		},
		{
			id: 'tl-4',
			title: 'Architecture drift alert resolved in Auth module',
			category: 'Architecture',
			repo: 'Auth Gateway',
			timestamp: 'Yesterday',
			author: 'DevOps Automated Agent',
		},
	];

	// Prioritized Backlog Items
	const backlogItems: BacklogItem[] = [
		{
			id: 'backlog-1',
			priority: 'HIGH',
			title: 'Decouple Inline REST Router SQL Queries in PaymentService',
			expectedImpact: '+18 Health Points ($18.5k/yr Debt Payoff)',
			estimatedEffort: '2 Days (~14 files)',
			riskLevel: 'Low Risk',
			description:
				'Direct inline SQL execution inside route handlers breaks architectural isolation and prevents cache reuse.',
		},
		{
			id: 'backlog-2',
			priority: 'MEDIUM',
			title: 'Upgrade Pydantic V1 Config Objects to V2 Settings',
			expectedImpact: 'Zero Runtime Deprecation Warnings',
			estimatedEffort: '1 Day',
			riskLevel: 'Low Risk',
			description:
				'Legacy Pydantic v1 config objects trigger deprecation warnings during FastAPI startup sequence.',
		},
	];

	const filteredTimeline = timelineLog.filter((item) => {
		if (timelineFilter === 'ALL') return true;
		return item.category.toUpperCase() === timelineFilter.toUpperCase();
	});

	const toggleBookmark = (id: string) => {
		setBookmarkedEvents((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	};

	return (
		<div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans select-none">
			{/* ========================================================================= */}
			{/* NASA / AIR TRAFFIC CONTROL ROOM HEADER */}
			{/* ========================================================================= */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800/80 pb-5 font-mono">
				<div>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
							<Radio className="w-5 h-5 animate-pulse" />
						</div>
						<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
							Engineering Mission Control Center
						</h1>
					</div>
					<p className="text-xs text-slate-400 mt-1 font-sans">
						Unified real-time operational command room uniting repository health, live AI discoveries, architecture drift, and timeline events.
					</p>
				</div>

				{/* Control Room Live Status Badges */}
				<div className="flex flex-wrap items-center gap-2 text-xs">
					<span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
						<span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> SYSTEM OPERATIONAL
					</span>
					<span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full font-bold">
						14 REPOS TRACKED
					</span>
					<span className="px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full font-bold">
						LIVE AST STREAM
					</span>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* 10 HEALTH SCORECARDS HUD */}
			{/* ========================================================================= */}
			<div className="space-y-3 font-mono">
				<div className="flex items-center justify-between">
					<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
						<HeartPulse className="w-3.5 h-3.5 text-cyan-400" /> 10 Engineering Health Scorecards HUD
					</span>
					<span className="text-[10px] text-slate-500 font-bold">REALTIME AUDIT</span>
				</div>

				<div className="grid gap-3 grid-cols-2 md:grid-cols-5 text-xs">
					{healthMetrics.map((m, i) => (
						<div key={i} className="glass-card rounded-2xl p-3 border border-slate-800 space-y-1 hover:border-cyan-500/40 transition-all">
							<span className="text-[9px] text-slate-400 uppercase font-bold block">{m.label}</span>
							<div className="flex items-baseline justify-between">
								<span className="text-lg font-black text-white">{m.score}</span>
								<span className="text-[10px] text-emerald-400 font-bold">{m.trend}</span>
							</div>
							<span className="text-[9px] text-slate-500 block truncate">{m.pred}</span>
						</div>
					))}
				</div>
			</div>

			{/* ========================================================================= */}
			{/* MAIN GRID: LIVE AI STREAM + TIMELINE + BACKLOG */}
			{/* ========================================================================= */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
				{/* LIVE AI ACTIVITY STREAM (2 Cols) */}
				<div className="lg:col-span-2 space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
								<Brain className="w-4 h-4" />
							</div>
							<h2 className="text-base font-black text-white">Live AI Activity Stream</h2>
						</div>
						<span className="text-xs text-slate-400 font-mono">Real-Time Discoveries</span>
					</div>

					<div className="space-y-3">
						{aiEvents.map((evt) => (
							<div
								key={evt.id}
								className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-3"
							>
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<span
												className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
													evt.severity === 'CRITICAL'
														? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
														: evt.severity === 'HIGH'
															? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
															: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
												}`}
											>
												{evt.severity}
											</span>
											<span className="text-xs text-slate-400">{evt.repo}</span>
										</div>
										<h3 className="text-sm font-bold text-white leading-snug">{evt.title}</h3>
									</div>

									<div className="flex items-center gap-2">
										<span className="text-xs font-bold text-emerald-400">{evt.confidence}</span>
										<button
											onClick={() => toggleBookmark(evt.id)}
											className="p-1 text-slate-500 hover:text-white transition-colors"
										>
											<Bookmark
												className={`w-4 h-4 ${
													bookmarkedEvents.includes(evt.id) ? 'text-amber-400 fill-amber-400' : ''
												}`}
											/>
										</button>
									</div>
								</div>

								<p className="text-xs text-cyan-300/80 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-sans">
									Evidence: {evt.evidence}
								</p>

								{/* Actions */}
								<div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
									<span className="text-[10px] text-slate-500">{evt.timestamp}</span>
									<div className="flex items-center gap-2">
										{evt.suggestedActions.map((action, idx) => {
											const ActionIcon = action.icon;
											return (
												<Link key={idx} href={action.href}>
													<Button
														size="sm"
														variant="outline"
														className="h-7 text-[11px] font-bold gap-1 bg-slate-900 border-slate-800 text-slate-200 hover:text-white"
													>
														<ActionIcon className="w-3 h-3 text-cyan-400" />
														{action.label}
													</Button>
												</Link>
											);
										})}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Prioritized Engineering Backlog */}
					<div className="pt-4 space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
									<Sliders className="w-4 h-4" />
								</div>
								<h2 className="text-base font-black text-white">Prioritized Engineering Backlog</h2>
							</div>
							<span className="text-xs text-cyan-400 font-bold">2 High Priority</span>
						</div>

						<div className="space-y-3">
							{backlogItems
								.filter((item) => !dismissedBacklog.includes(item.id))
								.map((item) => (
									<div
										key={item.id}
										className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3"
									>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
													{item.priority} PRIORITY
												</span>
												<h3 className="text-sm font-bold text-white">{item.title}</h3>
											</div>
											<span className="text-xs text-emerald-400 font-bold">{item.expectedImpact}</span>
										</div>

										<p className="text-xs text-slate-400 font-sans leading-relaxed">{item.description}</p>

										<div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
											<div className="flex items-center gap-3 text-[11px] text-slate-400">
												<span>Effort: <strong className="text-slate-200">{item.estimatedEffort}</strong></span>
												<span>Risk: <strong className="text-emerald-400">{item.riskLevel}</strong></span>
											</div>

											<div className="flex items-center gap-2">
												<Link href="/investigate">
													<Button size="sm" variant="outline" className="h-7 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-200">
														Investigate
													</Button>
												</Link>
												<Link href="/simulate">
													<Button size="sm" className="h-7 text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white">
														Simulate
													</Button>
												</Link>
												<button
													onClick={() => setDismissedBacklog((prev) => [...prev, item.id])}
													className="p-1 text-slate-500 hover:text-slate-300"
													title="Dismiss"
												>
													<XCircle className="w-4 h-4" />
												</button>
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				</div>

				{/* ENGINEERING TIMELINE LOG (1 Col) */}
				<div className="space-y-4">
					<div className="glass-card rounded-2xl p-5 space-y-4">
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<h3 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
								<Clock className="w-3.5 h-3.5 text-cyan-400" /> Engineering Timeline
							</h3>
							<span className="text-[10px] text-emerald-400 font-bold">REALTIME</span>
						</div>

						{/* Timeline Filters */}
						<div className="flex items-center gap-1 overflow-x-auto text-[9px]">
							{['ALL', 'Analysis', 'Security', 'Simulation', 'Architecture'].map((cat) => (
								<button
									key={cat}
									onClick={() => setTimelineFilter(cat)}
									className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${
										timelineFilter === cat
											? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
											: 'text-slate-500 hover:text-white'
									}`}
								>
									{cat}
								</button>
							))}
						</div>

						{/* Timeline Items */}
						<div className="space-y-3 text-xs font-sans">
							{filteredTimeline.map((item) => (
								<div key={item.id} className="flex items-start gap-3">
									<div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0 animate-pulse" />
									<div className="space-y-0.5 font-mono">
										<p className="text-slate-200 font-medium leading-snug">{item.title}</p>
										<div className="flex items-center gap-2 text-[10px] text-slate-500">
											<span className="text-cyan-400">{item.repo}</span>
											<span>•</span>
											<span>{item.timestamp}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* FLOATING QUICK-ACTION COMMAND CENTER BAR */}
			{/* ========================================================================= */}
			<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-cyan-500/40 backdrop-blur-xl px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 font-mono text-xs">
				<span className="text-slate-400 font-bold text-[11px] shrink-0">COMMAND BAR:</span>

				<div className="flex items-center gap-2">
					<Link href="/analyze">
						<Button size="sm" variant="outline" className="h-8 text-[11px] font-bold bg-slate-950 border-slate-800 text-slate-200 hover:text-white">
							<Search className="w-3.5 h-3.5 text-cyan-400 mr-1" /> Analyze Repo
						</Button>
					</Link>
					<Link href="/investigate">
						<Button size="sm" variant="outline" className="h-8 text-[11px] font-bold bg-slate-950 border-slate-800 text-slate-200 hover:text-white">
							<Brain className="w-3.5 h-3.5 text-purple-400 mr-1" /> AI Investigation
						</Button>
					</Link>
					<Link href="/simulate">
						<Button size="sm" className="h-8 text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/50">
							<Play className="w-3.5 h-3.5 mr-1" /> Run Simulation
						</Button>
					</Link>
					<Link href="/architecture">
						<Button size="sm" variant="outline" className="h-8 text-[11px] font-bold bg-slate-950 border-slate-800 text-slate-200 hover:text-white">
							<Layers className="w-3.5 h-3.5 text-indigo-400 mr-1" /> 3D Architecture
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
