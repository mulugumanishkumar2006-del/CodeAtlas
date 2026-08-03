'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
	Search,
	Command,
	Sparkles,
	Brain,
	Server,
	Code2,
	Layers,
	ShieldAlert,
	Play,
	ArrowRight,
	CheckCircle2,
	AlertTriangle,
	Flame,
	HeartPulse,
	Database,
	Clock,
	Copy,
	ExternalLink,
	Tag,
	Filter,
	Zap,
	FileText,
	Building2,
	Plus,
	Check,
	Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Search Item Schema
interface SearchResultItem {
	id: string;
	title: string;
	category: 'AI REASONING' | 'REPOSITORIES' | 'SERVICES & APIS' | 'CLASSES & FUNCTIONS' | 'ARCHITECTURE' | 'DEBT & SECURITY' | 'SIMULATIONS';
	type: string;
	repo: string;
	path: string;
	aiSummary: string;
	health: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	lastUpdated: string;
	isAIRouting?: boolean;
	aiRootCause?: string;
	aiConfidence?: string;
	aiEvidence?: string;
	quickActions: { label: string; href: string; icon: React.ElementType }[];
}

export function UniversalSearchCommandCenter() {
	const [query, setQuery] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

	// Comprehensive Catalog of Indexable Entities
	const allResults: SearchResultItem[] = [
		// AI Natural Language Query 1
		{
			id: 'ai-query-auth-slow',
			title: 'Why is authentication slow?',
			category: 'AI REASONING',
			type: 'AI Natural Language Diagnosis',
			repo: 'codeatlas/auth-gateway',
			path: 'AuthGatewayController -> PostgresUserDAL',
			aiSummary:
				'Database token validation creates synchronous connection lock contention under 50k requests/sec traffic bursts.',
			health: 82.0,
			riskLevel: 'HIGH',
			lastUpdated: '10m ago',
			isAIRouting: true,
			aiRootCause: 'Database Connection Lock Contention on User Session Queries',
			aiConfidence: '98.4%',
			aiEvidence: 'AuthGateway/router.py:L142 latency spikes +45ms during load tests',
			quickActions: [
				{ label: 'Run AI Investigation', href: '/investigate', icon: Brain },
				{ label: 'Simulate Redis Cluster Cache', href: '/simulate', icon: Play },
				{ label: 'Auto Patch Auth Handler', href: '/improve', icon: Sparkles },
			],
		},
		// AI Natural Language Query 2
		{
			id: 'ai-query-dead-code',
			title: 'Find dead code and unused REST endpoints',
			category: 'AI REASONING',
			type: 'AI Dead Code Scanner',
			repo: 'codeatlas/payments-service',
			path: 'apps/backend/app/api/v1/legacy_router.py',
			aiSummary:
				'Identified 4 unreferenced REST routes (1,450 LOC) with 0 inbound requests over the past 90 days.',
			health: 78.5,
			riskLevel: 'MEDIUM',
			lastUpdated: '1h ago',
			isAIRouting: true,
			aiRootCause: 'Unreferenced Legacy v1 API Route Handlers',
			aiConfidence: '99.1%',
			aiEvidence: 'legacy_router.py contains deprecated /v1/charge_card endpoint',
			quickActions: [
				{ label: 'Review Dead Code AST', href: '/investigate', icon: Brain },
				{ label: 'Auto Prune Dead Code', href: '/improve', icon: Sparkles },
			],
		},

		// Services & APIs
		{
			id: 'item-payment-service',
			title: 'PaymentService',
			category: 'SERVICES & APIS',
			type: 'Microservice Controller',
			repo: 'codeatlas/payments-service',
			path: 'apps/backend/app/api/v1/payment_service.py',
			aiSummary:
				'Multi-currency payment processing controller with direct inline SQL database query execution.',
			health: 82.0,
			riskLevel: 'HIGH',
			lastUpdated: '4h ago',
			quickActions: [
				{ label: 'Analyze Service', href: '/analyze', icon: Search },
				{ label: 'Simulate Microservices Split', href: '/simulate', icon: Play },
			],
		},
		{
			id: 'item-auth-controller',
			title: 'AuthGatewayController',
			category: 'SERVICES & APIS',
			type: 'REST API Ingress',
			repo: 'codeatlas/auth-gateway',
			path: 'apps/backend/app/api/v1/auth.py',
			aiSummary: 'OAuth2 JWT token issuer and user session verification router.',
			health: 94.2,
			riskLevel: 'LOW',
			lastUpdated: '2h ago',
			quickActions: [
				{ label: 'Open Repository Twin', href: '/repositories', icon: Server },
				{ label: 'Investigate Auth Flow', href: '/investigate', icon: Brain },
			],
		},

		// Architecture
		{
			id: 'item-kafka-stream',
			title: 'Kafka Event Broker Topology',
			category: 'ARCHITECTURE',
			type: 'Async Event Stream',
			repo: 'codeatlas/core-engine',
			path: 'infrastructure/kafka/events.yml',
			aiSummary: 'Decoupled event-driven architecture streaming 50,000 AST index events per second.',
			health: 96.0,
			riskLevel: 'LOW',
			lastUpdated: '1d ago',
			quickActions: [
				{ label: 'View 3D Topology Graph', href: '/architecture', icon: Layers },
				{ label: 'Simulate Stream Partition', href: '/simulate', icon: Play },
			],
		},

		// Debt & Security
		{
			id: 'item-inline-sql-debt',
			title: 'Direct Inline SQL Query Execution in Routers',
			category: 'DEBT & SECURITY',
			type: 'Architectural Tech Debt',
			repo: 'codeatlas/payments-service',
			path: 'PaymentService/router.py:L142',
			aiSummary:
				'Direct SQL query execution inside route handlers breaks architectural isolation and prevents cache reuse.',
			health: 74.0,
			riskLevel: 'HIGH',
			lastUpdated: '3h ago',
			quickActions: [
				{ label: 'Auto Patch Repository Pattern', href: '/improve', icon: Sparkles },
				{ label: 'View Debt Metrics', href: '/tech-debt', icon: Flame },
			],
		},
	];

	// Preset Suggested Prompts
	const suggestedPrompts = [
		'Why is authentication slow?',
		'Find dead code',
		'Explain payment service',
		'Show architecture topology',
		'Where is technical debt?',
	];

	// Filtered Results
	const filteredResults = allResults.filter((item) => {
		const matchesCategory =
			selectedCategory === 'ALL' || item.category.toUpperCase() === selectedCategory.toUpperCase();
		const matchesQuery =
			query.trim() === '' ||
			item.title.toLowerCase().includes(query.toLowerCase()) ||
			item.path.toLowerCase().includes(query.toLowerCase()) ||
			item.aiSummary.toLowerCase().includes(query.toLowerCase());
		return matchesCategory && matchesQuery;
	});

	return (
		<div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans select-none">
			{/* Top Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-5 font-mono">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
							Universal Search & Engineering Command Center
						</h1>
						<span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold rounded-full uppercase tracking-wider">
							RAYCAST + LINEAR + AI
						</span>
					</div>
					<p className="text-xs text-slate-400 mt-1 font-sans">
						Instant cross-repository entity lookup, natural language AI diagnosis routing, and executable command actions.
					</p>
				</div>

				<div className="flex items-center gap-2 text-xs text-slate-400">
					<kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-300">
						Ctrl + K
					</kbd>
					<span>Global Shortcut</span>
				</div>
			</div>

			{/* Raycast-style Main Input Command Box */}
			<div className="glass-card rounded-2xl p-5 border border-cyan-500/40 shadow-2xl space-y-4 font-mono">
				<div className="relative flex items-center">
					<Search className="absolute left-4 h-5 w-5 text-cyan-400 animate-pulse" />
					<input
						type="text"
						autoFocus
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search repositories, APIs, files, AST symbols, or ask AI 'Why is payment slow?'..."
						className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-cyan-500 font-mono shadow-inner"
					/>
					<div className="absolute right-4 flex items-center gap-2 text-[10px] text-slate-500 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
						<Command className="w-3.5 h-3.5 text-cyan-400" /> FAST &lt;100MS
					</div>
				</div>

				{/* Preset Quick Trigger Badges */}
				<div className="flex flex-wrap items-center gap-2 text-xs">
					<span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Suggested AI Prompts:</span>
					{suggestedPrompts.map((prompt, idx) => (
						<button
							key={idx}
							onClick={() => setQuery(prompt)}
							className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-[11px] transition-all"
						>
							&ldquo;{prompt}&rdquo;
						</button>
					))}
				</div>

				{/* Category Filters */}
				<div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80 text-[10px] overflow-x-auto">
					{[
						'ALL',
						'AI REASONING',
						'REPOSITORIES',
						'SERVICES & APIS',
						'ARCHITECTURE',
						'DEBT & SECURITY',
					].map((cat) => (
						<button
							key={cat}
							onClick={() => setSelectedCategory(cat)}
							className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
								selectedCategory === cat
									? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
									: 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
							}`}
						>
							{cat}
						</button>
					))}
				</div>
			</div>

			{/* ========================================================================= */}
			{/* SEARCH RESULTS LIST (NATURAL LANGUAGE ROUTING CARDS + RICH ENTITIES) */}
			{/* ========================================================================= */}
			<div className="space-y-4 font-mono">
				<div className="flex items-center justify-between">
					<span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
						Search Results ({filteredResults.length})
					</span>
					<span className="text-[10px] text-emerald-400 font-bold">RESPONSE TIME: 14MS</span>
				</div>

				<div className="space-y-3">
					{filteredResults.map((item) => (
						<div
							key={item.id}
							className={`glass-card rounded-2xl p-5 border transition-all space-y-4 ${
								item.isAIRouting
									? 'border-purple-500/40 bg-purple-950/10 shadow-lg shadow-purple-950/30'
									: 'border-slate-800/80 hover:border-cyan-500/40'
							}`}
						>
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										{item.isAIRouting ? (
											<Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
										) : (
											<Server className="w-4 h-4 text-cyan-400" />
										)}
										<h3 className="font-extrabold text-white text-base leading-snug">{item.title}</h3>
										<span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
											{item.category}
										</span>
									</div>
									<p className="text-[11px] text-slate-400">{item.repo} &gt; {item.path}</p>
								</div>

								<div className="flex items-center gap-3 text-xs">
									<span className="text-emerald-400 font-bold">{item.health} Health</span>
									<span className="text-slate-500">{item.lastUpdated}</span>
								</div>
							</div>

							{/* AI Natural Language Diagnostic Card (If AI Routing) */}
							{item.isAIRouting && (
								<div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-2 font-sans text-xs">
									<div className="flex items-center justify-between font-mono">
										<span className="font-bold text-purple-300 uppercase text-[10px]">
											Root Cause Diagnosis
										</span>
										<span className="text-emerald-400 font-bold text-[10px]">
											Confidence: {item.aiConfidence}
										</span>
									</div>
									<p className="font-bold text-white text-sm">{item.aiRootCause}</p>
									<p className="text-slate-400 text-xs">{item.aiEvidence}</p>
								</div>
							)}

							{/* AI Summary */}
							{!item.isAIRouting && (
								<p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
									{item.aiSummary}
								</p>
							)}

							{/* Executable Quick Action Buttons */}
							<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
								{item.quickActions.map((action, idx) => {
									const ActionIcon = action.icon;
									return (
										<Link key={idx} href={action.href}>
											<Button
												size="sm"
												variant="outline"
												className="h-8 text-[11px] font-bold gap-1.5 bg-slate-900 border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/40"
											>
												<ActionIcon className="w-3.5 h-3.5 text-cyan-400" />
												{action.label}
											</Button>
										</Link>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
