'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
	BookOpen,
	Folder,
	FileCode,
	Database,
	Server,
	Layers,
	Cpu,
	ShieldCheck,
	Sparkles,
	Search,
	ChevronRight,
	ChevronDown,
	CheckCircle2,
	AlertTriangle,
	Flame,
	HeartPulse,
	Play,
	Copy,
	Share2,
	ExternalLink,
	Star,
	Code2,
	Activity,
	Lock,
	Check,
	HelpCircle,
	ArrowRight,
	TrendingUp,
	FileText,
	HardDrive,
	Radio,
	Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Entity Schema for Structure Tree
interface StructureNode {
	id: string;
	name: string;
	category: 'services' | 'modules' | 'packages' | 'apis' | 'databases' | 'config' | 'infra' | 'docs' | 'tests';
	icon: React.ElementType;
	health: number;
	complexity: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	dependencies: string[];
	consumers: string[];
	owner: string;
	techDebt: string;
	lastChange: string;
	aiSummary: string;
	suggestedActions: string[];
}

export function RepositoryExplorer() {
	// Selected Entity Node in Left Tree
	const [selectedNodeId, setSelectedNodeId] = useState<string>('node-auth-service');
	const [treeSearch, setTreeSearch] = useState<string>('');
	const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
	const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
		services: true,
		apis: true,
		databases: true,
		modules: true,
	});

	// Structure Nodes Catalog
	const structureNodes: Record<string, StructureNode> = {
		'node-auth-service': {
			id: 'node-auth-service',
			name: 'AuthGatewayController',
			category: 'services',
			icon: Server,
			health: 94.2,
			complexity: 7.8,
			riskLevel: 'LOW',
			dependencies: ['JwtValidatorModule', 'RedisTokenCache', 'UserRepository'],
			consumers: ['RESTIngressRouter'],
			owner: 'Security Core Team',
			techDebt: '$2.1k/yr',
			lastChange: 'fix: rotate JWT secret key vault (2h ago)',
			aiSummary:
				'OAuth2 authentication gateway handling token validation and user session locks with sub-12ms average latency.',
			suggestedActions: [
				'Deploy Redis Cluster session cache',
				'Enforce RS256 token signature verification',
			],
		},
		'node-payment-service': {
			id: 'node-payment-service',
			name: 'PaymentService',
			category: 'services',
			icon: Server,
			health: 82.0,
			complexity: 14.8,
			riskLevel: 'HIGH',
			dependencies: ['UserRepository', 'StripeAdapter', 'KafkaEventStream'],
			consumers: ['RESTIngressRouter'],
			owner: 'Payments Domain Team',
			techDebt: '$18.5k/yr',
			lastChange: 'refactor: idempotency webhook handler (4h ago)',
			aiSummary:
				'Multi-currency processing pipeline. High complexity due to inline SQL database queries inside router handlers.',
			suggestedActions: [
				'Extract inline SQL queries to Repository DAL',
				'Split service into async worker queue pattern',
			],
		},
		'node-jwt-module': {
			id: 'node-jwt-module',
			name: 'JwtValidatorModule',
			category: 'modules',
			icon: Code2,
			health: 91.5,
			complexity: 5.4,
			riskLevel: 'LOW',
			dependencies: ['CryptoKeyVault'],
			consumers: ['AuthGatewayController'],
			owner: 'Security Core Team',
			techDebt: '$0.8k/yr',
			lastChange: 'feat: add RS256 algorithm support (1d ago)',
			aiSummary: 'Cryptographic signature verification engine for RS256/HS256 tokens.',
			suggestedActions: ['Benchmark RS256 key rotation latency'],
		},
		'node-user-repo': {
			id: 'node-user-repo',
			name: 'UserRepositoryDAL',
			category: 'packages',
			icon: Layers,
			health: 92.4,
			complexity: 6.2,
			riskLevel: 'LOW',
			dependencies: ['PostgreSQLPrimaryDB'],
			consumers: ['AuthGatewayController', 'PaymentService'],
			owner: 'Core Platform Team',
			techDebt: '$1.2k/yr',
			lastChange: 'perf: optimize user indexed lookup query (3h ago)',
			aiSummary: 'Data Access Layer (DAL) wrapping async PostgreSQL database queries.',
			suggestedActions: ['Add cache key pre-warming strategy'],
		},
		'node-redis-cache': {
			id: 'node-redis-cache',
			name: 'RedisTokenCache',
			category: 'databases',
			icon: HardDrive,
			health: 98.0,
			complexity: 3.2,
			riskLevel: 'LOW',
			dependencies: [],
			consumers: ['AuthGatewayController', 'JwtValidatorModule'],
			owner: 'DevOps / Infra Team',
			techDebt: '$0.0k/yr',
			lastChange: 'ops: memory eviction policy update (1d ago)',
			aiSummary: 'In-memory token cache cluster handling 50k req/sec peak loads.',
			suggestedActions: ['Monitor memory eviction key eviction rates'],
		},
		'node-postgres-db': {
			id: 'node-postgres-db',
			name: 'PostgreSQLPrimaryDB',
			category: 'databases',
			icon: Database,
			health: 89.0,
			complexity: 7.1,
			riskLevel: 'MEDIUM',
			dependencies: [],
			consumers: ['UserRepositoryDAL'],
			owner: 'Database Admins',
			techDebt: '$3.4k/yr',
			lastChange: 'migration: add user idempotency index (2d ago)',
			aiSummary: 'Primary relational datastore supporting transactional ACID workloads.',
			suggestedActions: ['Adjust connection pool size limit'],
		},
	};

	const selectedNode = structureNodes[selectedNodeId] || structureNodes['node-auth-service'];

	const toggleSection = (section: string) => {
		setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
	};

	const handleCopySummary = () => {
		navigator.clipboard.writeText(
			'CodeAtlas Repository Summary: Event-Driven Async Microservices architecture with 94.2 health score. Key services: AuthGateway, PaymentService, RedisCache.'
		);
		setCopiedSummary(true);
		setTimeout(() => setCopiedSummary(false), 2000);
	};

	return (
		<div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-950 text-white font-sans overflow-hidden rounded-2xl border border-slate-800/90 shadow-2xl relative select-none">
			{/* Top Control Header */}
			<div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/80 font-mono text-xs shrink-0">
				<div className="flex items-center gap-3">
					<div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
						<BookOpen className="w-4 h-4" />
					</div>
					<div>
						<h1 className="font-black text-white flex items-center gap-2">
							Repository Digital Twin Explorer
							<span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
								GITHUB + LINEAR + FIGMA
							</span>
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-3 text-slate-400">
					<span>Health Index: <strong className="text-emerald-400 font-bold">94.2 Grade A+</strong></span>
					<span>Tech Debt: <strong className="text-amber-400 font-bold">$4.2k/yr</strong></span>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* MAIN 3-PANEL LAYOUT CONTAINER */}
			{/* ========================================================================= */}
			<div className="flex flex-1 overflow-hidden">
				{/* ------------------------------------------------------------------------- */}
				{/* LEFT PANEL: REPOSITORY STRUCTURE TREE */}
				{/* ------------------------------------------------------------------------- */}
				<div className="w-80 border-r border-slate-800/80 bg-slate-950/90 flex flex-col justify-between shrink-0 font-mono">
					{/* Tree Header & Search */}
					<div className="p-3 border-b border-slate-800/80 space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
								Repository Structure
							</span>
							<span className="text-[10px] text-slate-500 font-bold">DIGITAL TWIN</span>
						</div>

						<div className="relative">
							<Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
							<input
								type="text"
								value={treeSearch}
								onChange={(e) => setTreeSearch(e.target.value)}
								placeholder="Filter services, modules, APIs..."
								className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
							/>
						</div>
					</div>

					{/* Expandable Categorized Structure Tree */}
					<div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
						{/* Category: Services */}
						<div className="space-y-1">
							<button
								onClick={() => toggleSection('services')}
								className="w-full flex items-center justify-between p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white font-bold"
							>
								<div className="flex items-center gap-2">
									<Server className="w-3.5 h-3.5 text-cyan-400" />
									<span>Services (2)</span>
								</div>
								{expandedSections['services'] ? (
									<ChevronDown className="w-3.5 h-3.5" />
								) : (
									<ChevronRight className="w-3.5 h-3.5" />
								)}
							</button>

							{expandedSections['services'] && (
								<div className="pl-4 space-y-1">
									{['node-auth-service', 'node-payment-service'].map((id) => {
										const node = structureNodes[id];
										const isSelected = selectedNodeId === id;
										return (
											<div
												key={id}
												onClick={() => setSelectedNodeId(id)}
												className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
													isSelected
														? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
														: 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white'
												}`}
											>
												<div className="flex items-center gap-2">
													<node.icon className="w-3.5 h-3.5 text-cyan-400" />
													<span>{node.name}</span>
												</div>
												<span
													className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
														node.riskLevel === 'HIGH' ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400'
													}`}
												>
													{node.health}
												</span>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Category: Databases */}
						<div className="space-y-1">
							<button
								onClick={() => toggleSection('databases')}
								className="w-full flex items-center justify-between p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white font-bold"
							>
								<div className="flex items-center gap-2">
									<Database className="w-3.5 h-3.5 text-emerald-400" />
									<span>Databases (2)</span>
								</div>
								{expandedSections['databases'] ? (
									<ChevronDown className="w-3.5 h-3.5" />
								) : (
									<ChevronRight className="w-3.5 h-3.5" />
								)}
							</button>

							{expandedSections['databases'] && (
								<div className="pl-4 space-y-1">
									{['node-redis-cache', 'node-postgres-db'].map((id) => {
										const node = structureNodes[id];
										const isSelected = selectedNodeId === id;
										return (
											<div
												key={id}
												onClick={() => setSelectedNodeId(id)}
												className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
													isSelected
														? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
														: 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white'
												}`}
											>
												<div className="flex items-center gap-2">
													<node.icon className="w-3.5 h-3.5 text-emerald-400" />
													<span>{node.name}</span>
												</div>
												<span className="text-[9px] text-emerald-400 font-bold">{node.health}</span>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* ------------------------------------------------------------------------- */}
				{/* CENTER PANEL: REPOSITORY OVERVIEW & 10 HEALTH WIDGETS */}
				{/* ------------------------------------------------------------------------- */}
				<div className="flex-1 flex flex-col bg-slate-950 overflow-y-auto p-5 space-y-5">
					{/* 60-Second Clarity Answers Banner */}
					<div className="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-slate-900/80 space-y-3 shadow-xl">
						<div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
							<div className="flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-cyan-400" />
								<h2 className="text-base font-black text-white">60-Second Repository Overview</h2>
							</div>
							<span className="text-xs text-emerald-400 font-bold">100% INDEXED</span>
						</div>

						<p className="text-xs text-slate-300 font-sans leading-relaxed">
							CodeAtlas Core Engine is an <strong>Event-Driven Async Microservices</strong> platform written in Python FastAPI and TypeScript. Overall health index is <strong>94.2 (Grade A+)</strong> with zero critical security vulnerabilities. Highest priority refactoring item is decoupling direct SQL query execution inside <code>PaymentService/router.py</code> into async repository DAL handlers.
						</p>
					</div>

					{/* Structured AI Repository Summary Card */}
					<div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
						<div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
							<span className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-purple-400" /> AI Repository Architectural Summary
							</span>
							<div className="flex items-center gap-2">
								<button
									onClick={handleCopySummary}
									className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:text-white flex items-center gap-1 font-mono"
								>
									{copiedSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="font-bold text-cyan-300 block font-mono">Core Purpose</span>
								<p className="text-slate-400">High-throughput software intelligence indexing engine supporting continuous AST delta parsing and architectural simulation.</p>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="font-bold text-purple-300 block font-mono">Architecture Type</span>
								<p className="text-slate-400">Event-Driven Async Microservices decoupled using Kafka event broker and Redis Sentinel token session cache.</p>
							</div>
						</div>
					</div>

					{/* 10 Health Widgets HUD Grid */}
					<div className="space-y-3 font-mono">
						<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
							10 Engineering Health Widgets HUD
						</span>

						<div className="grid gap-3 grid-cols-2 md:grid-cols-5 text-xs">
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Overall Health</span>
								<span className="text-lg font-black text-emerald-400">94.2</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Architecture</span>
								<span className="text-lg font-black text-cyan-400">94.0%</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Security</span>
								<span className="text-lg font-black text-emerald-400">100%</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Performance</span>
								<span className="text-lg font-black text-cyan-300">91.2%</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Documentation</span>
								<span className="text-lg font-black text-emerald-400">84.0%</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Testing</span>
								<span className="text-lg font-black text-cyan-400">87.4%</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Dependency</span>
								<span className="text-lg font-black text-emerald-400">92.0%</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Maintainability</span>
								<span className="text-lg font-black text-cyan-400">89.5%</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Readability</span>
								<span className="text-lg font-black text-emerald-400">95.0%</span>
							</div>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Scalability</span>
								<span className="text-lg font-black text-purple-300">90.0%</span>
							</div>
						</div>
					</div>

					{/* Smart Action Cards */}
					<div className="space-y-3 font-mono">
						<span className="text-[10px] font-black uppercase text-purple-400 tracking-wider block">
							Smart AI Recommended Actions
						</span>

						<div className="grid gap-3 grid-cols-1 md:grid-cols-3 text-xs">
							<div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
								<div className="flex justify-between font-bold">
									<span className="text-white">Run AI Investigation</span>
									<span className="text-amber-400">HIGH PRIORITY</span>
								</div>
								<p className="text-[11px] text-slate-400 font-sans">Investigate PaymentService direct SQL query execution.</p>
								<Link href="/investigate" className="block pt-1">
									<Button size="sm" className="w-full h-7 text-[10px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white">
										Investigate Now
									</Button>
								</Link>
							</div>

							<div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
								<div className="flex justify-between font-bold">
									<span className="text-white">Open Simulation Studio</span>
									<span className="text-cyan-400">OPTIMIZATION</span>
								</div>
								<p className="text-[11px] text-slate-400 font-sans">Simulate Kafka event stream split on Payment processing.</p>
								<Link href="/simulate" className="block pt-1">
									<Button size="sm" className="w-full h-7 text-[10px] font-bold bg-purple-600 hover:bg-purple-500 text-white">
										Simulate Split
									</Button>
								</Link>
							</div>

							<div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
								<div className="flex justify-between font-bold">
									<span className="text-white">View Architecture</span>
									<span className="text-emerald-400">VERIFIED</span>
								</div>
								<p className="text-[11px] text-slate-400 font-sans">Explore full interactive 3D dependency topology graph.</p>
								<Link href="/architecture" className="block pt-1">
									<Button size="sm" variant="outline" className="w-full h-7 text-[10px] font-bold bg-slate-950 border-slate-800 text-slate-300">
										View Topology
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* ------------------------------------------------------------------------- */}
				{/* RIGHT PANEL: DYNAMIC CONTEXT INSPECTOR */}
				{/* ------------------------------------------------------------------------- */}
				<div className="w-80 border-l border-slate-800/80 bg-slate-950/90 p-4 flex flex-col justify-between shrink-0 font-mono space-y-4 overflow-y-auto">
					<div className="space-y-4">
						{/* Context Header */}
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div>
								<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
									Entity Inspector
								</span>
								<h3 className="text-base font-black text-white mt-0.5">{selectedNode.name}</h3>
							</div>
							<span
								className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${
									selectedNode.riskLevel === 'HIGH'
										? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
										: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
								}`}
							>
								{selectedNode.riskLevel} RISK
							</span>
						</div>

						{/* Metrics */}
						<div className="grid grid-cols-2 gap-2 text-center">
							<div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
								<span className="text-[9px] text-slate-500 uppercase font-bold block">Health Score</span>
								<span className="text-lg font-black text-emerald-400">{selectedNode.health}</span>
							</div>
							<div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
								<span className="text-[9px] text-slate-500 uppercase font-bold block">Complexity</span>
								<span className="text-lg font-black text-cyan-300">{selectedNode.complexity}</span>
							</div>
						</div>

						{/* AI Summary */}
						<div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-3 space-y-1.5">
							<span className="text-[9px] font-black text-indigo-300 uppercase block">AI Summary</span>
							<p className="text-[11px] text-slate-300 leading-relaxed font-sans">{selectedNode.aiSummary}</p>
						</div>

						{/* Dependencies */}
						<div className="space-y-2">
							<span className="text-[10px] text-slate-400 font-bold uppercase block">Outgoing Dependencies</span>
							<div className="space-y-1 text-xs">
								{selectedNode.dependencies.map((dep, idx) => (
									<div key={idx} className="p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
										• {dep}
									</div>
								))}
							</div>
						</div>

						{/* Owner & Last Change */}
						<div className="space-y-1 text-[10px] text-slate-400 border-t border-slate-800 pt-2">
							<p>Owner: <span className="text-slate-200">{selectedNode.owner}</span></p>
							<p>Tech Debt: <span className="text-amber-400">{selectedNode.techDebt}</span></p>
							<p className="truncate">Last Change: <span className="text-cyan-300">{selectedNode.lastChange}</span></p>
						</div>
					</div>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* BOTTOM PANEL: LIVE ACTIVITY TIMELINE TICKER */}
			{/* ========================================================================= */}
			<div className="h-10 border-t border-slate-800 bg-slate-950 font-mono text-[11px] flex items-center justify-between px-5 shrink-0">
				<div className="flex items-center gap-3 overflow-hidden">
					<span className="text-cyan-400 font-bold flex items-center gap-1.5 shrink-0">
						<Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> LIVE STREAM:
					</span>
					<div className="flex items-center gap-3 overflow-x-auto text-slate-300 whitespace-nowrap">
						<span>[AST Scan] Continuous sync completed (142 files)</span>
						<span className="text-slate-600">•</span>
						<span>[AI Discovery] Zero critical CVEs in dependency graph</span>
						<span className="text-slate-600">•</span>
						<span>[Simulation] Kafka Event Stream split tested</span>
					</div>
				</div>

				<span className="text-[10px] text-emerald-400 font-bold shrink-0">60 FPS REALTIME</span>
			</div>
		</div>
	);
}
