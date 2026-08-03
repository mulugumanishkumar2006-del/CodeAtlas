'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
	Sparkles,
	Search,
	Bell,
	ChevronDown,
	Brain,
	HeartPulse,
	Flame,
	Layers,
	ShieldCheck,
	Play,
	Plus,
	RefreshCw,
	Command,
	X,
	ExternalLink,
	CheckCircle2,
	AlertTriangle,
	TrendingUp,
	Clock,
	ArrowUpRight,
	FileText,
	Building2,
	Filter,
	Check,
	RotateCcw,
	Sliders,
	Globe,
	Activity,
	Cpu,
	Database,
	Package,
	Code2,
	ShieldAlert,
	Sun,
	Moon,
	User,
	Eye,
	XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IndexingProgress } from '@/components/ui/indexing-progress';

// Repository Schema
interface RepositoryCard {
	id: string;
	name: string;
	language: string;
	architectureType: string;
	healthScore: number;
	riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	techDebt: string;
	dependenciesCount: number;
	openInvestigations: number;
	aiSummary: string;
	lastAnalysis: string;
}

// AI Recommendation Feed Item
interface AIRecommendationItem {
	id: string;
	title: string;
	description: string;
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
	confidence: string;
	effort: string;
	impact: string;
	type: string;
	evidence: string;
}

// Grouped Notification Schema
interface NotificationItem {
	id: string;
	title: string;
	category: 'Security' | 'Architecture' | 'Performance' | 'Simulation' | 'AI';
	severity: 'CRITICAL' | 'HIGH' | 'INFO';
	timestamp: string;
	read: boolean;
}

export function DeveloperWorkspace() {
	// Repositories Data
	const [repositories, setRepositories] = useState<RepositoryCard[]>([
		{
			id: 'repo-codeatlas',
			name: 'CodeAtlas Core Suite',
			language: 'TypeScript / Python',
			architectureType: 'Event-Driven Async Microservices',
			healthScore: 94.2,
			riskScore: 'LOW',
			techDebt: '$4.2k/yr',
			dependenciesCount: 42,
			openInvestigations: 2,
			aiSummary:
				'Highly optimized core platform. Decoupled async event router and zero critical CVE vulnerabilities.',
			lastAnalysis: '10 mins ago',
		},
		{
			id: 'repo-payment',
			name: 'Payment Processing Service',
			language: 'Python FastAPI',
			architectureType: 'Monolithic Express + REST',
			healthScore: 82.0,
			riskScore: 'HIGH',
			techDebt: '$18.5k/yr',
			dependenciesCount: 28,
			openInvestigations: 4,
			aiSummary:
				'High database connection lock contention. Direct inline REST SQL queries require repository DAL refactoring.',
			lastAnalysis: '1 hour ago',
		},
		{
			id: 'repo-auth',
			name: 'Auth Gateway & Identity',
			language: 'TypeScript / Go',
			architectureType: 'Modular Monolith + Redis',
			healthScore: 91.5,
			riskScore: 'LOW',
			techDebt: '$2.1k/yr',
			dependenciesCount: 19,
			openInvestigations: 1,
			aiSummary:
				'Redis cluster caching integrated for JWT token validation. Average latency sub-12ms.',
			lastAnalysis: '3 hours ago',
		},
		{
			id: 'repo-analytics',
			name: 'Analytics Telemetry Pipeline',
			language: 'Python / Kafka',
			architectureType: 'Event Stream Worker Pool',
			healthScore: 89.0,
			riskScore: 'MEDIUM',
			techDebt: '$6.8k/yr',
			dependenciesCount: 34,
			openInvestigations: 3,
			aiSummary:
				'Asynchronous worker throughput 50k events/sec. Minor Pydantic v1 config object deprecation warnings detected.',
			lastAnalysis: 'Yesterday',
		},
	]);

	// Selected Active Repo
	const [selectedRepoId, setSelectedRepoId] = useState<string>('repo-codeatlas');

	// Command Palette Modal State (Ctrl+K)
	const [isCmdKOpen, setIsCmdKOpen] = useState<boolean>(false);
	const [cmdKQuery, setCmdKQuery] = useState<string>('');

	// Notification Drawer State
	const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
	const [notificationFilter, setNotificationFilter] = useState<string>('all');
	const [notifications, setNotifications] = useState<NotificationItem[]>([
		{
			id: 'notif-1',
			title: 'AI discovered circular dependency in PaymentService DAL',
			category: 'Architecture',
			severity: 'HIGH',
			timestamp: '10m ago',
			read: false,
		},
		{
			id: 'notif-2',
			title: 'SOC2 Type II compliance audit score verified at 96%',
			category: 'Security',
			severity: 'INFO',
			timestamp: '1h ago',
			read: false,
		},
		{
			id: 'notif-3',
			title: 'Database connection pool saturation predicted at 15k req/sec',
			category: 'Performance',
			severity: 'CRITICAL',
			timestamp: '3h ago',
			read: true,
		},
		{
			id: 'notif-4',
			title: 'Kafka Microservices Split Simulation completed successfully',
			category: 'Simulation',
			severity: 'INFO',
			timestamp: 'Yesterday',
			read: true,
		},
	]);

	// Indexing Pipeline Modal State
	const [isIndexingModal, setIsIndexingModal] = useState<boolean>(false);

	// Dismissed AI Recs
	const [dismissedRecs, setDismissedRecs] = useState<string[]>([]);

	// AI Living Recommendation Feed Items
	const aiRecommendations: AIRecommendationItem[] = [
		{
			id: 'rec-1',
			title: 'Decouple REST Router SQL Queries in PaymentService',
			description:
				'Direct inline SQL query execution inside route handlers breaks architectural isolation and prevents Redis caching.',
			impact: '$18.5k/yr Debt Drag',
			confidence: '95.8%',
			severity: 'HIGH',
			effort: '2 hrs (~14 files)',
			type: 'Architecture Drift',
			evidence: 'PaymentService/router.py:L142 executes direct raw SQL queries',
		},
		{
			id: 'rec-2',
			title: 'Deploy Redis Cluster Auth Cache for JWT Validation',
			description:
				'Database token validation creates database lock contention under 50k requests/sec traffic bursts.',
			impact: '+350% Ingress Throughput',
			confidence: '99.1%',
			severity: 'CRITICAL',
			effort: '4 hrs',
			type: 'Performance Bottleneck',
			evidence: 'AuthGateway latency spikes +45ms during peak load tests',
		},
		{
			id: 'rec-3',
			title: 'Upgrade Pydantic V1 Class Configs to V2 Settings Objects',
			description:
				'Legacy Pydantic v1 config objects trigger runtime deprecation warnings during FastAPI startup.',
			impact: 'Zero Deprecation Warnings',
			confidence: '94.2%',
			severity: 'MEDIUM',
			effort: '1 hr',
			type: 'Code Hygiene',
			evidence: 'app/config.py contains deprecated BaseSettings class',
		},
	];

	// Keyboard Listener for Ctrl+K
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				setIsCmdKOpen((prev) => !prev);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	// Filter notifications
	const unreadCount = notifications.filter((n) => !n.read).length;
	const filteredNotifications = notifications.filter((n) => {
		if (notificationFilter === 'all') return true;
		return n.category.toLowerCase() === notificationFilter.toLowerCase();
	});

	return (
		<div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-none">
			{/* Modal Cinematic Analysis Pipeline */}
			{isIndexingModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
					<div className="w-full max-w-3xl">
						<IndexingProgress
							onComplete={() => setIsIndexingModal(false)}
							repoName={selectedRepoId}
						/>
					</div>
				</div>
			)}

			{/* Global Command Palette Modal (Ctrl+K / ⌘K) */}
			{isCmdKOpen && (
				<div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md p-4">
					<div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden font-sans space-y-3 p-4">
						<div className="flex items-center gap-3 border-b border-slate-800 pb-3">
							<Search className="w-5 h-5 text-cyan-400" />
							<input
								type="text"
								autoFocus
								value={cmdKQuery}
								onChange={(e) => setCmdKQuery(e.target.value)}
								placeholder="Search repositories, files, functions, APIs, architecture, AI actions..."
								className="w-full bg-transparent text-sm text-white focus:outline-none font-mono"
							/>
							<button
								onClick={() => setIsCmdKOpen(false)}
								className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 font-mono"
							>
								ESC
							</button>
						</div>

						<div className="space-y-1 max-h-80 overflow-y-auto pr-1 font-mono text-xs">
							{[
								{ title: 'Analyze Payments Service', type: 'Action', href: '/analyze' },
								{ title: 'Find Dead Code & Unused Endpoints', type: 'AI Action', href: '/investigate' },
								{ title: 'Open Architecture Graph Canvas', type: 'Navigation', href: '/architecture' },
								{ title: 'Show Technical Debt Breakdown', type: 'Dashboard', href: '/tech-debt' },
								{ title: 'Run Microservices Split Simulation', type: 'Simulation', href: '/simulate' },
								{ title: 'Explain AuthGateway JWT Flow', type: 'AI Query', href: '/investigate' },
							]
								.filter((item) => item.title.toLowerCase().includes(cmdKQuery.toLowerCase()))
								.map((item, idx) => (
									<Link
										key={idx}
										href={item.href}
										onClick={() => setIsCmdKOpen(false)}
										className="flex items-center justify-between p-3 rounded-xl hover:bg-cyan-500/10 border border-transparent cursor-pointer transition-all"
									>
										<div className="flex items-center gap-2.5">
											<Sparkles className="w-4 h-4 text-cyan-400" />
											<span className="font-bold text-white">{item.title}</span>
										</div>
										<span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 uppercase">
											{item.type}
										</span>
									</Link>
								))}
						</div>
					</div>
				</div>
			)}

			{/* Grouped Notification Center Slide-Out Drawer */}
			{isNotificationOpen && (
				<div className="fixed inset-y-0 right-0 z-50 w-96 bg-slate-900 border-l border-slate-800 shadow-2xl p-5 font-mono space-y-4 flex flex-col justify-between">
					<div className="space-y-4">
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div className="flex items-center gap-2">
								<Bell className="w-4 h-4 text-cyan-400" />
								<h3 className="font-bold text-white text-sm">Notification Center</h3>
							</div>
							<button
								onClick={() => setIsNotificationOpen(false)}
								className="text-slate-400 hover:text-white"
							>
								<X className="w-4 h-4" />
							</button>
						</div>

						{/* Category Filters */}
						<div className="flex items-center gap-1 overflow-x-auto text-[10px]">
							{['all', 'Architecture', 'Security', 'Performance', 'Simulation'].map((cat) => (
								<button
									key={cat}
									onClick={() => setNotificationFilter(cat)}
									className={`px-2 py-1 rounded uppercase font-bold transition-all ${
										notificationFilter === cat
											? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
											: 'text-slate-400 hover:text-white'
									}`}
								>
									{cat}
								</button>
							))}
						</div>

						{/* Notification List */}
						<div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1 text-xs font-sans">
							{filteredNotifications.map((n) => (
								<div
									key={n.id}
									onClick={() =>
										setNotifications((prev) =>
											prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
										)
									}
									className={`p-3 rounded-xl border transition-all space-y-1 cursor-pointer ${
										!n.read
											? 'bg-cyan-500/10 border-cyan-500/30'
											: 'bg-slate-950 border-slate-800 text-slate-400'
									}`}
								>
									<div className="flex items-center justify-between font-mono text-[10px]">
										<span
											className={`font-bold uppercase ${
												n.severity === 'CRITICAL'
													? 'text-rose-400'
													: n.severity === 'HIGH'
														? 'text-amber-400'
														: 'text-cyan-400'
											}`}
										>
											[{n.category}]
										</span>
										<span className="text-slate-500">{n.timestamp}</span>
									</div>
									<p className="font-medium text-slate-200 text-xs leading-snug">{n.title}</p>
								</div>
							))}
						</div>
					</div>

					<button
						onClick={() =>
							setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
						}
						className="w-full py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold font-mono"
					>
						Mark All as Read
					</button>
				</div>
			)}

			{/* ========================================================================= */}
			{/* TOP NAVIGATION BAR */}
			{/* ========================================================================= */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800/80 pb-5 font-mono">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
							Developer Workspace Command Center
						</h1>
						<span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> 14 REPOS INDEXED
						</span>
						<span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
							⚡ AI REASONING ONLINE
						</span>
					</div>
					<p className="text-xs text-slate-400 mt-1 font-sans">
						Central command hub for repository health, architectural drift, active AI investigations, and automated refactoring.
					</p>
				</div>

				{/* Top Bar Actions & Status Triggers */}
				<div className="flex flex-wrap items-center gap-2.5">
					<button
						onClick={() => setIsCmdKOpen(true)}
						className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-2 shadow-sm"
					>
						<Search className="w-3.5 h-3.5 text-cyan-400" /> Search Everything
						<kbd className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px]">⌘K</kbd>
					</button>

					<div className="relative">
						<button
							onClick={() => setIsNotificationOpen((prev) => !prev)}
							className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white relative"
							title="Notifications"
						>
							<Bell className="w-4 h-4 text-slate-300" />
							{unreadCount > 0 && (
								<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
									{unreadCount}
								</span>
							)}
						</button>
					</div>

					<Button
						onClick={() => setIsIndexingModal(true)}
						variant="outline"
						className="text-xs font-bold gap-2 bg-slate-900 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
					>
						<RefreshCw className="h-3.5 w-3.5 text-cyan-400" /> Run Pipeline
					</Button>

					<Link href="/repositories">
						<Button className="text-xs font-bold gap-2 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/50">
							<Plus className="h-3.5 w-3.5" /> Import Repo
						</Button>
					</Link>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* 30-SECOND UNDERSTANDING HUD GAUGES */}
			{/* ========================================================================= */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
				<div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
					<div className="flex justify-between items-start">
						<span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
							System Health Index
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
							<HeartPulse className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-black text-white">88.5</span>
						<span className="text-xs font-bold text-emerald-400">Grade A-</span>
					</div>
					<div className="mt-3 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
						<div className="bg-emerald-400 h-full w-[88.5%]" />
					</div>
					<p className="text-[11px] text-slate-400 mt-2 font-sans">142,500 AST nodes synchronized</p>
				</div>

				<div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
					<div className="flex justify-between items-start">
						<span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
							Technical Debt Drag
						</span>
						<div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
							<Flame className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-black text-white">$18.5k</span>
						<span className="text-xs font-bold text-amber-400">/ year</span>
					</div>
					<div className="mt-3 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
						<div className="bg-amber-400 h-full w-[35%]" />
					</div>
					<p className="text-[11px] text-slate-400 mt-2 font-sans">Estimated payoff effort: 3.2 days</p>
				</div>

				<div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
					<div className="flex justify-between items-start">
						<span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
							Architecture Cleanliness
						</span>
						<div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
							<Layers className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-black text-white">94.0%</span>
						<span className="text-xs font-bold text-cyan-400">Zero Drift</span>
					</div>
					<div className="mt-3 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
						<div className="bg-cyan-400 h-full w-[94%]" />
					</div>
					<p className="text-[11px] text-slate-400 mt-2 font-sans">24 layer boundary rules enforced</p>
				</div>

				<div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
					<div className="flex justify-between items-start">
						<span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
							Security & Compliance
						</span>
						<div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
							<ShieldCheck className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-black text-white">0</span>
						<span className="text-xs font-bold text-emerald-400">Critical CVEs</span>
					</div>
					<div className="mt-3 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
						<div className="bg-emerald-400 h-full w-[100%]" />
					</div>
					<p className="text-[11px] text-slate-400 mt-2 font-sans">SOC2 & ISO27001 compliant</p>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* REPOSITORY CARDS GRID (30-SECOND UNDERSTANDING OF REPOSITORIES) */}
			{/* ========================================================================= */}
			<div className="space-y-4 font-mono">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
							<Building2 className="w-4 h-4" />
						</div>
						<h2 className="text-base font-black text-white">Owned Repositories Overview</h2>
					</div>
					<Link href="/repositories" className="text-xs text-cyan-400 font-bold hover:underline">
						View All 14 Repositories &rarr;
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{repositories.map((repo) => (
						<div
							key={repo.id}
							className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-4 group"
						>
							<div className="flex items-start justify-between">
								<div>
									<div className="flex items-center gap-2">
										<h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
											{repo.name}
										</h3>
										<span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
											{repo.language}
										</span>
									</div>
									<p className="text-xs text-slate-400 mt-1 font-sans">{repo.architectureType}</p>
								</div>

								<div className="text-right">
									<span className="text-xs font-black text-emerald-400">{repo.healthScore} Health</span>
									<span className="block text-[10px] text-slate-500">{repo.lastAnalysis}</span>
								</div>
							</div>

							{/* AI Summary */}
							<p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
								{repo.aiSummary}
							</p>

							{/* Metadata Pill Metrics */}
							<div className="grid grid-cols-3 gap-2 text-center text-xs">
								<div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
									<span className="text-[9px] text-slate-500 uppercase block font-bold">Tech Debt</span>
									<span className="font-bold text-amber-400">{repo.techDebt}</span>
								</div>
								<div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
									<span className="text-[9px] text-slate-500 uppercase block font-bold">Dependencies</span>
									<span className="font-bold text-cyan-300">{repo.dependenciesCount} Packages</span>
								</div>
								<div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
									<span className="text-[9px] text-slate-500 uppercase block font-bold">Investigations</span>
									<span className="font-bold text-purple-300">{repo.openInvestigations} Active</span>
								</div>
							</div>

							{/* Card Action Buttons */}
							<div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
								<Link href="/analyze" className="flex-1">
									<Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white">
										<Search className="w-3 h-3 text-cyan-400 mr-1" /> Analyze
									</Button>
								</Link>
								<Link href="/investigate" className="flex-1">
									<Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white">
										<Brain className="w-3 h-3 text-purple-400 mr-1" /> Investigate
									</Button>
								</Link>
								<Link href="/simulate" className="flex-1">
									<Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white">
										<Play className="w-3 h-3 text-indigo-400 mr-1" /> Simulate
									</Button>
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* ========================================================================= */}
			{/* MAIN GRID: LIVING AI FEED STREAM + RECENT ACTIVITY TIMELINE */}
			{/* ========================================================================= */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono">
				{/* Living AI Activity & Recommendation Feed (2 Cols) */}
				<div className="lg:col-span-2 space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
								<Brain className="w-4 h-4" />
							</div>
							<h2 className="text-base font-black text-white">Living AI Recommendation Feed</h2>
						</div>
						<span className="text-xs text-slate-400 font-mono">3 Active Insights</span>
					</div>

					<div className="space-y-3">
						{aiRecommendations
							.filter((rec) => !dismissedRecs.includes(rec.id))
							.map((rec) => (
								<div
									key={rec.id}
									className="glass-card rounded-2xl p-5 relative space-y-3 hover:border-cyan-500/40 transition-all"
								>
									<div className="flex items-start justify-between gap-4">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<span
													className={`text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded ${
														rec.severity === 'CRITICAL'
															? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
															: rec.severity === 'HIGH'
																? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
																: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
													}`}
												>
													{rec.severity}
												</span>
												<span className="text-xs font-bold text-slate-400">{rec.type}</span>
											</div>
											<h3 className="text-sm font-bold text-white leading-snug">{rec.title}</h3>
										</div>
										<span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
											{rec.impact}
										</span>
									</div>

									<p className="text-xs text-slate-400 leading-relaxed font-sans">{rec.description}</p>
									<p className="text-[11px] text-cyan-300/80 bg-slate-950 p-2 rounded-lg border border-slate-800">
										Evidence: {rec.evidence}
									</p>

									{/* Action Footer Bar */}
									<div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800/60 text-xs gap-2">
										<div className="flex items-center gap-4 text-slate-400 text-[11px]">
											<span>Confidence: <strong className="text-cyan-300">{rec.confidence}</strong></span>
											<span>Effort: <strong className="text-slate-200">{rec.effort}</strong></span>
										</div>

										<div className="flex items-center gap-2">
											<Link href="/simulate">
												<Button
													size="sm"
													variant="outline"
													className="h-7 text-[11px] font-bold gap-1 bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
												>
													<Play className="w-3 h-3 text-cyan-400" /> Simulate
												</Button>
											</Link>
											<Link href="/improve">
												<Button
													size="sm"
													className="h-7 text-[11px] font-bold gap-1 bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/50"
												>
													<Sparkles className="w-3 h-3" /> Auto Patch
												</Button>
											</Link>
											<button
												onClick={() => setDismissedRecs((prev) => [...prev, rec.id])}
												className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
												title="Ignore"
											>
												<XCircle className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>

				{/* Sidebar Activity Stream (1 Col) */}
				<div className="space-y-6">
					<div className="glass-card rounded-2xl p-5 space-y-4">
						<div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
							<h3 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
								<Clock className="w-3.5 h-3.5 text-cyan-400" /> Recent Activity Timeline
							</h3>
							<span className="text-[10px] font-mono text-emerald-400 font-bold">REAL-TIME</span>
						</div>

						<div className="space-y-3.5 text-xs font-sans">
							{[
								{ time: '10 mins ago', event: 'Continuous AST index updated (35 files, 4,500 LOC)', repo: 'CodeAtlas Core' },
								{ time: '1 hour ago', event: 'SOC2 Type II compliance check verified (96%)', repo: 'Payments Pod' },
								{ time: '3 hours ago', event: 'Architecture drift alert resolved in Auth module', repo: 'Auth Gateway' },
								{ time: 'Yesterday', event: 'Kafka Microservices Split Simulation completed', repo: 'Analytics Pipeline' },
							].map((act, i) => (
								<div key={i} className="flex items-start gap-3">
									<div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0 animate-pulse" />
									<div className="space-y-0.5 font-mono">
										<p className="text-slate-200 font-medium leading-snug">{act.event}</p>
										<div className="flex items-center gap-2 text-[10px] text-slate-500">
											<span className="text-cyan-400">{act.repo}</span>
											<span>•</span>
											<span>{act.time}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
